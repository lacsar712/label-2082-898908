#include "database.h"
#include "logger.h"
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <errno.h>
#include <stdlib.h>
#if defined(_WIN32) || defined(_WIN64)
#include <io.h>
#else
#include <unistd.h>
#endif

#define SUFFIX_BIN   ".bin"
#define SUFFIX_TMP   ".tmp"
#define SUFFIX_BAK   ".bak"
#define MAX_PATH_LEN 256

int validate_header(int count, int max_count, int next_id) {
    if (count < 0 || count > max_count) return 0;
    if (next_id < 0) return 0;
    return 1;
}

static void make_path(char *buf, size_t buf_size, const char *base, const char *suffix) {
    snprintf(buf, buf_size, "%s%s", base, suffix);
}

int backup_file(const char *main_path) {
    char bak_path[MAX_PATH_LEN];
    size_t len = strlen(main_path);
    if (len + strlen(SUFFIX_BAK) >= MAX_PATH_LEN) return 0;
    strcpy(bak_path, main_path);
    char *dot = strrchr(bak_path, '.');
    if (dot) strcpy(dot, SUFFIX_BAK);
    else strcat(bak_path, SUFFIX_BAK);

    FILE *src = fopen(main_path, "rb");
    if (!src) return 0;

    fseek(src, 0, SEEK_END);
    long size = ftell(src);
    fseek(src, 0, SEEK_SET);

    if (size <= 0) {
        fclose(src);
        return 0;
    }

    char *buf = (char *)malloc((size_t)size);
    if (!buf) {
        fclose(src);
        return 0;
    }

    size_t read_bytes = fread(buf, 1, (size_t)size, src);
    fclose(src);

    if (read_bytes != (size_t)size) {
        free(buf);
        return 0;
    }

    FILE *dst = fopen(bak_path, "wb");
    if (!dst) {
        free(buf);
        return 0;
    }

    size_t written = fwrite(buf, 1, (size_t)size, dst);
    fflush(dst);
    fclose(dst);
    free(buf);

    return (written == (size_t)size) ? 1 : 0;
}

int atomic_rename(const char *tmp_path, const char *main_path) {
#if defined(_WIN32) || defined(_WIN64)
    if (_access(main_path, 0) == 0) {
        if (_unlink(main_path) != 0 && errno != ENOENT) {
            return -1;
        }
    }
    return _rename(tmp_path, main_path);
#else
    return rename(tmp_path, main_path);
#endif
}

int atomic_save_binary(const char *base_path, const void *count_ptr, const void *next_id_ptr,
                       const void *data_ptr, size_t elem_size, int count) {
    char tmp_path[MAX_PATH_LEN];
    char main_path[MAX_PATH_LEN];

    make_path(tmp_path, sizeof(tmp_path), base_path, SUFFIX_TMP);
    make_path(main_path, sizeof(main_path), base_path, SUFFIX_BIN);

    backup_file(main_path);

    FILE *f = fopen(tmp_path, "wb");
    if (!f) {
        log_message(LOG_ERROR, "Failed to open temp file for writing: %s (%s)", tmp_path, strerror(errno));
        return 0;
    }

    size_t expected_bytes = sizeof(int);
    if (next_id_ptr) expected_bytes += sizeof(int);
    if (count > 0 && data_ptr) expected_bytes += elem_size * (size_t)count;

    size_t written_bytes = 0;
    written_bytes += fwrite(count_ptr, 1, sizeof(int), f);
    if (next_id_ptr) {
        written_bytes += fwrite(next_id_ptr, 1, sizeof(int), f);
    }
    if (count > 0 && data_ptr) {
        written_bytes += fwrite(data_ptr, 1, elem_size * (size_t)count, f);
    }

    if (written_bytes != expected_bytes) {
        fclose(f);
        remove(tmp_path);
        log_message(LOG_ERROR, "Incomplete write to temp file: %s (wrote %zu of %zu bytes)", tmp_path, written_bytes, expected_bytes);
        return 0;
    }

    if (fflush(f) != 0) {
        fclose(f);
        remove(tmp_path);
        log_message(LOG_ERROR, "Failed to flush temp file: %s", tmp_path);
        return 0;
    }

    fclose(f);

    if (atomic_rename(tmp_path, main_path) != 0) {
        remove(tmp_path);
        log_message(LOG_ERROR, "Failed to rename temp file: %s -> %s (%s)", tmp_path, main_path, strerror(errno));
        return 0;
    }

    return 1;
}

static int load_single_file(const char *path, void *count_ptr, void *next_id_ptr,
                            void *data_ptr, size_t elem_size, int max_count) {
    FILE *f = fopen(path, "rb");
    if (!f) return -1;

    int count = 0;
    int next_id = 0;
    int has_next_id = (next_id_ptr != NULL);

    if (fread(&count, sizeof(int), 1, f) != 1) {
        fclose(f);
        return 0;
    }

    if (has_next_id) {
        if (fread(&next_id, sizeof(int), 1, f) != 1) {
            fclose(f);
            return 0;
        }
    }

    if (!validate_header(count, max_count, has_next_id ? next_id : 1)) {
        fclose(f);
        return 0;
    }

    if (count > 0 && data_ptr) {
        if (fread(data_ptr, elem_size, (size_t)count, f) != (size_t)count) {
            fclose(f);
            return 0;
        }
    }

    fclose(f);

    *(int *)count_ptr = count;
    if (has_next_id) {
        *(int *)next_id_ptr = next_id;
    }

    return 1;
}

int load_with_fallback(const char *base_path, void *count_ptr, void *next_id_ptr,
                       void *data_ptr, size_t elem_size, int max_count,
                       const char *data_name) {
    char main_path[MAX_PATH_LEN];
    char bak_path[MAX_PATH_LEN];

    make_path(main_path, sizeof(main_path), base_path, SUFFIX_BIN);
    make_path(bak_path, sizeof(bak_path), base_path, SUFFIX_BAK);

    int rc = load_single_file(main_path, count_ptr, next_id_ptr, data_ptr, elem_size, max_count);
    if (rc == 1) {
        return 1;
    }

    if (rc == 0) {
        log_message(LOG_ERROR, "Corrupt %s data detected in %s, attempting fallback to backup", data_name, main_path);
    }

    rc = load_single_file(bak_path, count_ptr, next_id_ptr, data_ptr, elem_size, max_count);
    if (rc == 1) {
        log_message(LOG_ERROR, "Successfully recovered %s data from backup %s", data_name, bak_path);
        return 1;
    }

    if (rc == 0) {
        log_message(LOG_ERROR, "Backup file %s is also corrupt for %s", bak_path, data_name);
    }

    return 0;
}

User users[MAX_USERS];
int user_count = 0;
Order orders[MAX_ORDERS];
int order_count = 0;
int next_id = 1;
CertApplication cert_apps[MAX_CERT_APPS];
int cert_app_count = 0;
int next_cert_id = 1;
BlacklistEntry blacklist[MAX_BLACKLIST];
int blacklist_count = 0;
int next_blacklist_id = 1;
Event events[MAX_EVENTS];
int event_count = 0;
int next_event_id = 1;
EventSubscription subscriptions[MAX_SUBSCRIPTIONS];
int subscription_count = 0;
int next_subscription_id = 1;
EventNotification notifications[MAX_NOTIFICATIONS];
int notification_count = 0;
int next_notification_id = 1;
MessageThread threads[MAX_THREADS];
int thread_count = 0;
int next_thread_id = 1;
Message messages[MAX_MESSAGES];
int message_count = 0;
int next_message_id = 1;

void save_cert_data() {
  if (atomic_save_binary("data_cert", &cert_app_count, &next_cert_id,
                         cert_apps, sizeof(CertApplication), cert_app_count)) {
    log_message(LOG_INFO, "Cert applications data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save cert applications data");
  }
}

void load_cert_data() {
  int rc = load_with_fallback("data_cert", &cert_app_count, &next_cert_id,
                              cert_apps, sizeof(CertApplication), MAX_CERT_APPS,
                              "cert applications");
  if (rc == 1) {
    log_message(LOG_INFO, "Loaded %d cert applications", cert_app_count);
  } else {
    log_message(LOG_WARN, "No existing cert applications data found");
  }
}

void save_blacklist_data() {
  if (atomic_save_binary("data_blacklist", &blacklist_count, &next_blacklist_id,
                         blacklist, sizeof(BlacklistEntry), blacklist_count)) {
    log_message(LOG_INFO, "Blacklist data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save blacklist data");
  }
}

void load_blacklist_data() {
  int rc = load_with_fallback("data_blacklist", &blacklist_count, &next_blacklist_id,
                              blacklist, sizeof(BlacklistEntry), MAX_BLACKLIST,
                              "blacklist");
  if (rc == 1) {
    log_message(LOG_INFO, "Loaded %d blacklist entries", blacklist_count);
  } else {
    log_message(LOG_WARN, "No existing blacklist data found");
  }
}

void save_event_data() {
  if (atomic_save_binary("data_events", &event_count, &next_event_id,
                         events, sizeof(Event), event_count)) {
    log_message(LOG_INFO, "Events data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save events data");
  }
}

void load_event_data() {
  int rc = load_with_fallback("data_events", &event_count, &next_event_id,
                              events, sizeof(Event), MAX_EVENTS,
                              "events");
  if (rc == 1) {
    log_message(LOG_INFO, "Loaded %d events", event_count);
  } else {
    log_message(LOG_WARN, "No existing events data found");
  }
}

void save_subscription_data() {
  if (atomic_save_binary("data_subscriptions", &subscription_count, &next_subscription_id,
                         subscriptions, sizeof(EventSubscription), subscription_count)) {
    log_message(LOG_INFO, "Subscriptions data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save subscriptions data");
  }
}

void load_subscription_data() {
  int rc = load_with_fallback("data_subscriptions", &subscription_count, &next_subscription_id,
                              subscriptions, sizeof(EventSubscription), MAX_SUBSCRIPTIONS,
                              "subscriptions");
  if (rc == 1) {
    log_message(LOG_INFO, "Loaded %d subscriptions", subscription_count);
  } else {
    log_message(LOG_WARN, "No existing subscriptions data found");
  }
}

void save_notification_data() {
  if (atomic_save_binary("data_notifications", &notification_count, &next_notification_id,
                         notifications, sizeof(EventNotification), notification_count)) {
    log_message(LOG_INFO, "Notifications data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save notifications data");
  }
}

void load_notification_data() {
  int rc = load_with_fallback("data_notifications", &notification_count, &next_notification_id,
                              notifications, sizeof(EventNotification), MAX_NOTIFICATIONS,
                              "notifications");
  if (rc == 1) {
    log_message(LOG_INFO, "Loaded %d notifications", notification_count);
  } else {
    log_message(LOG_WARN, "No existing notifications data found");
  }
}

void save_message_data() {
  if (atomic_save_binary("data_threads", &thread_count, &next_thread_id,
                         threads, sizeof(MessageThread), thread_count)) {
    log_message(LOG_INFO, "Message threads data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save message threads data");
  }

  if (atomic_save_binary("data_messages", &message_count, &next_message_id,
                         messages, sizeof(Message), message_count)) {
    log_message(LOG_INFO, "Messages data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save messages data");
  }
}

void load_message_data() {
  int rc = load_with_fallback("data_threads", &thread_count, &next_thread_id,
                              threads, sizeof(MessageThread), MAX_THREADS,
                              "message threads");
  if (rc == 1) {
    log_message(LOG_INFO, "Loaded %d message threads", thread_count);
  } else {
    log_message(LOG_WARN, "No existing message threads data found");
  }

  rc = load_with_fallback("data_messages", &message_count, &next_message_id,
                          messages, sizeof(Message), MAX_MESSAGES,
                          "messages");
  if (rc == 1) {
    log_message(LOG_INFO, "Loaded %d messages", message_count);
  } else {
    log_message(LOG_WARN, "No existing messages data found");
  }
}

void save_data() {
  if (atomic_save_binary("data_orders", &order_count, &next_id,
                         orders, sizeof(Order), order_count)) {
    log_message(LOG_INFO, "Orders data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save orders data");
  }

  if (atomic_save_binary("data_users", &user_count, NULL,
                         users, sizeof(User), user_count)) {
    log_message(LOG_INFO, "Users data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save users data");
  }

  save_cert_data();
  save_blacklist_data();
  save_event_data();
  save_subscription_data();
  save_notification_data();
  save_message_data();
}

void load_data() {
  int rc = load_with_fallback("data_orders", &order_count, &next_id,
                              orders, sizeof(Order), MAX_ORDERS,
                              "orders");
  if (rc == 1) {
    log_message(LOG_INFO, "Loaded %d orders", order_count);
  } else {
    log_message(LOG_WARN, "No existing orders data found");
  }

  rc = load_with_fallback("data_users", &user_count, NULL,
                          users, sizeof(User), MAX_USERS,
                          "users");
  if (rc == 1) {
    log_message(LOG_INFO, "Loaded %d users", user_count);
  } else {
    log_message(LOG_WARN, "No existing users data found");
  }

  load_cert_data();
  load_blacklist_data();
  load_event_data();
  load_subscription_data();
  load_notification_data();
  load_message_data();

  if (user_count == 0) {
    strcpy(users[user_count].username, "admin");
    strcpy(users[user_count].password, "123456");
    strcpy(users[user_count].real_name, "张小凡");
    strcpy(users[user_count].major, "信安 2101");
    strcpy(users[user_count].certified, "yes");
    strcpy(users[user_count].create_time, "2026-01-01 00:00:00");
    user_count++;
    save_data();
    log_message(LOG_INFO, "Created default admin user");
  }

  if (event_count == 0) {
    time_t now = time(NULL);
    struct tm *t = localtime(&now);
    char today[20];
    snprintf(today, sizeof(today), "%04d-%02d-%02d", t->tm_year + 1900, t->tm_mon + 1, t->tm_mday);

    char tomorrow[20];
    snprintf(tomorrow, sizeof(tomorrow), "%04d-%02d-%02d", t->tm_year + 1900, t->tm_mon + 1, t->tm_mday + 1);

    char next_week[20];
    snprintf(next_week, sizeof(next_week), "%04d-%02d-%02d", t->tm_year + 1900, t->tm_mon + 1, t->tm_mday + 7);

    Event e1;
    memset(&e1, 0, sizeof(Event));
    e1.id = next_event_id++;
    strcpy(e1.title, "618快递高峰期");
    strcpy(e1.date, today);
    strcpy(e1.type, "peak");
    strcpy(e1.description, "618电商大促期间快递量激增，各驿站将迎来配送高峰。建议错峰取件，或提前预约代取服务。预计高峰时段为10:00-14:00及16:00-20:00。");
    strcpy(e1.created_by, "admin");
    strcpy(e1.create_time, "2026-06-18 00:00:00");
    events[event_count++] = e1;

    Event e2;
    memset(&e2, 0, sizeof(Event));
    e2.id = next_event_id++;
    strcpy(e2.title, "菜鸟驿站满减促销");
    strcpy(e2.date, tomorrow);
    strcpy(e2.type, "promotion");
    strcpy(e2.description, "菜鸟驿站南门点开展开学季促销活动：寄件满20元立减5元，满50元立减15元。活动仅限明天一天，有寄件需求的同学不要错过！");
    strcpy(e2.created_by, "admin");
    strcpy(e2.create_time, "2026-06-18 00:00:00");
    events[event_count++] = e2;

    Event e3;
    memset(&e3, 0, sizeof(Event));
    e3.id = next_event_id++;
    strcpy(e3.title, "暑假寄件优惠提醒");
    strcpy(e3.date, next_week);
    strcpy(e3.type, "holiday");
    strcpy(e3.description, "暑假即将来临，各大快递公司推出学生寄件优惠。凭学生证可享8折优惠，建议提前打包行李，错峰寄送。");
    strcpy(e3.created_by, "admin");
    strcpy(e3.create_time, "2026-06-18 00:00:00");
    events[event_count++] = e3;

    save_data();
    log_message(LOG_INFO, "Created sample events");
  }
}
