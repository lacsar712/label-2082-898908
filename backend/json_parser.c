#include "json_parser.h"
#include "database.h"
#include <ctype.h>
#include <stdio.h>
#include <string.h>

void url_decode(char *dst, const char *src) {
  char a, b;
  while (*src) {
    if ((*src == '%') && ((a = src[1]) && (b = src[2])) &&
        (isxdigit(a) && isxdigit(b))) {
      if (a >= 'a')
        a -= 'a' - 'A';
      if (a >= 'A')
        a -= ('A' - 10);
      else
        a -= '0';
      if (b >= 'a')
        b -= 'a' - 'A';
      if (b >= 'A')
        b -= ('A' - 10);
      else
        b -= '0';
      *dst++ = 16 * a + b;
      src += 3;
    } else if (*src == '+') {
      *dst++ = ' ';
      src++;
    } else {
      *dst++ = *src++;
    }
  }
  *dst = '\0';
}

void parse_json_string(const char *body, const char *key, char *output, int max_len) {
  char search[100];
  snprintf(search, sizeof(search), "\"%s\"", key);
  char *p = strstr(body, search);
  if (p) {
    p += strlen(search);
    while (*p == ' ' || *p == ':' || *p == '"')
      p++;
    int i = 0;
    while (*p && *p != '"' && i < max_len - 1)
      output[i++] = *p++;
    output[i] = '\0';
  }
}

void get_orders_json(char *buf, const char *creator_filter,
                     const char *worker_filter, const char *category_filter,
                     const char *status_filter) {
  strcat(buf, "[");
  int first = 1;
  char dec_cat[100] = {0};
  if (category_filter && strlen(category_filter) > 0) {
    url_decode(dec_cat, category_filter);
  }
  char dec_status[100] = {0};
  if (status_filter && strlen(status_filter) > 0) {
    url_decode(dec_status, status_filter);
  }

  for (int i = 0; i < order_count; i++) {
    if (creator_filter && strlen(creator_filter) > 0 &&
        strcmp(orders[i].creator, creator_filter) != 0)
      continue;
    if (worker_filter && strlen(worker_filter) > 0 &&
        strcmp(orders[i].worker, worker_filter) != 0)
      continue;
    if (strlen(dec_cat) > 0 && strcmp(dec_cat, "全部") != 0 &&
        strstr(orders[i].category, dec_cat) == NULL &&
        strstr(orders[i].pickup_addr, dec_cat) == NULL)
      continue;
    if (strlen(dec_status) > 0 &&
        strcmp(orders[i].status, dec_status) != 0)
      continue;

    if (!first)
      strcat(buf, ",");
    char item[1024];
    sprintf(item,
            "{\"id\":%d,\"creator\":\"%s\",\"worker\":\"%s\",\"package\":\"%"
            "s\",\"pickup\":\"%s\",\"delivery\":\"%s\",\"reward\":\"%s\","
            "\"category\":\"%s\",\"status\":\"%s\",\"buildingTag\":\"%s\"}",
            orders[i].id, orders[i].creator,
            (strlen(orders[i].worker) > 0 ? orders[i].worker : ""),
            orders[i].package_info, orders[i].pickup_addr,
            orders[i].delivery_addr, orders[i].reward, orders[i].category,
            orders[i].status, orders[i].building_tag);
    strcat(buf, item);
    first = 0;
  }
  strcat(buf, "]");
}

void get_cert_apps_json(char *buf, const char *username_filter, const char *status_filter) {
  strcat(buf, "[");
  int first = 1;
  char dec_status[100] = {0};
  if (status_filter && strlen(status_filter) > 0) {
    url_decode(dec_status, status_filter);
  }

  for (int i = 0; i < cert_app_count; i++) {
    if (username_filter && strlen(username_filter) > 0 &&
        strcmp(cert_apps[i].username, username_filter) != 0)
      continue;
    if (strlen(dec_status) > 0 &&
        strcmp(cert_apps[i].status, dec_status) != 0)
      continue;

    if (!first)
      strcat(buf, ",");
    char item[2048];
    sprintf(item,
            "{\"id\":%d,\"username\":\"%s\",\"realName\":\"%s\",\"studentId\":\"%s\","
            "\"dormBuilding\":\"%s\",\"phone\":\"%s\",\"description\":\"%s\","
            "\"status\":\"%s\",\"applyTime\":\"%s\",\"auditTime\":\"%s\","
            "\"auditor\":\"%s\",\"auditOpinion\":\"%s\"}",
            cert_apps[i].id, cert_apps[i].username, cert_apps[i].real_name,
            cert_apps[i].student_id, cert_apps[i].dorm_building,
            cert_apps[i].phone, cert_apps[i].description,
            cert_apps[i].status, cert_apps[i].apply_time,
            cert_apps[i].audit_time, cert_apps[i].auditor,
            cert_apps[i].audit_opinion);
    strcat(buf, item);
    first = 0;
  }
  strcat(buf, "]");
}

void get_user_json(char *buf, const char *username) {
  for (int i = 0; i < user_count; i++) {
    if (strcmp(users[i].username, username) == 0) {
      sprintf(buf,
              "{\"username\":\"%s\",\"realName\":\"%s\",\"major\":\"%s\","
              "\"studentId\":\"%s\",\"dormBuilding\":\"%s\",\"phone\":\"%s\","
              "\"certified\":\"%s\",\"certApplyTime\":\"%s\",\"certAuditTime\":\"%s\"}",
              users[i].username, users[i].real_name, users[i].major,
              users[i].student_id, users[i].dorm_building, users[i].phone,
              users[i].certified, users[i].cert_apply_time,
              users[i].cert_audit_time);
      return;
    }
  }
  strcpy(buf, "{}");
}

void get_users_json(char *buf) {
  strcat(buf, "[");
  int first = 1;
  for (int i = 0; i < user_count; i++) {
    if (!first)
      strcat(buf, ",");
    char item[1024];
    sprintf(item,
            "{\"username\":\"%s\",\"realName\":\"%s\",\"major\":\"%s\","
            "\"certified\":\"%s\",\"dormBuilding\":\"%s\"}",
            users[i].username, users[i].real_name, users[i].major,
            users[i].certified, users[i].dorm_building);
    strcat(buf, item);
    first = 0;
  }
  strcat(buf, "]");
}

void get_blacklist_json(char *buf, const char *blocker_filter) {
  strcat(buf, "[");
  int first = 1;
  for (int i = 0; i < blacklist_count; i++) {
    if (blocker_filter && strlen(blocker_filter) > 0 &&
        strcmp(blacklist[i].blocker, blocker_filter) != 0)
      continue;

    if (!first)
      strcat(buf, ",");
    char item[1024];
    sprintf(item,
            "{\"id\":%d,\"blocker\":\"%s\",\"blocked\":\"%s\","
            "\"blockedRealName\":\"%s\",\"createTime\":\"%s\"}",
            blacklist[i].id, blacklist[i].blocker, blacklist[i].blocked,
            blacklist[i].blocked_real_name, blacklist[i].create_time);
    strcat(buf, item);
    first = 0;
  }
  strcat(buf, "]");
}

int is_user_blocked(const char *blocker, const char *blocked) {
  for (int i = 0; i < blacklist_count; i++) {
    if (strcmp(blacklist[i].blocker, blocker) == 0 &&
        strcmp(blacklist[i].blocked, blocked) == 0) {
      return 1;
    }
  }
  return 0;
}

void get_events_json(char *buf, const char *date_filter, const char *type_filter) {
  strcat(buf, "[");
  int first = 1;
  char dec_date[100] = {0};
  if (date_filter && strlen(date_filter) > 0) {
    url_decode(dec_date, date_filter);
  }
  char dec_type[100] = {0};
  if (type_filter && strlen(type_filter) > 0) {
    url_decode(dec_type, type_filter);
  }

  for (int i = 0; i < event_count; i++) {
    if (strlen(dec_date) > 0 && strcmp(events[i].date, dec_date) != 0)
      continue;
    if (strlen(dec_type) > 0 && strcmp(events[i].type, dec_type) != 0)
      continue;

    if (!first)
      strcat(buf, ",");
    char item[2048];
    sprintf(item,
            "{\"id\":%d,\"title\":\"%s\",\"date\":\"%s\",\"type\":\"%s\","
            "\"description\":\"%s\",\"createdBy\":\"%s\",\"createTime\":\"%s\"}",
            events[i].id, events[i].title, events[i].date, events[i].type,
            events[i].description, events[i].created_by, events[i].create_time);
    strcat(buf, item);
    first = 0;
  }
  strcat(buf, "]");
}

void get_event_json(char *buf, int event_id) {
  for (int i = 0; i < event_count; i++) {
    if (events[i].id == event_id) {
      sprintf(buf,
              "{\"id\":%d,\"title\":\"%s\",\"date\":\"%s\",\"type\":\"%s\","
              "\"description\":\"%s\",\"createdBy\":\"%s\",\"createTime\":\"%s\"}",
              events[i].id, events[i].title, events[i].date, events[i].type,
              events[i].description, events[i].created_by, events[i].create_time);
      return;
    }
  }
  strcpy(buf, "{}");
}

void get_subscriptions_json(char *buf, const char *username_filter) {
  strcat(buf, "[");
  int first = 1;

  for (int i = 0; i < subscription_count; i++) {
    if (username_filter && strlen(username_filter) > 0 &&
        strcmp(subscriptions[i].username, username_filter) != 0)
      continue;

    if (!first)
      strcat(buf, ",");
    char item[512];
    sprintf(item,
            "{\"id\":%d,\"username\":\"%s\",\"eventType\":\"%s\",\"createTime\":\"%s\"}",
            subscriptions[i].id, subscriptions[i].username,
            subscriptions[i].event_type, subscriptions[i].create_time);
    strcat(buf, item);
    first = 0;
  }
  strcat(buf, "]");
}

void get_notifications_json(char *buf, const char *username_filter) {
  strcat(buf, "[");
  int first = 1;

  for (int i = notification_count - 1; i >= 0; i--) {
    if (username_filter && strlen(username_filter) > 0 &&
        strcmp(notifications[i].username, username_filter) != 0)
      continue;

    if (!first)
      strcat(buf, ",");
    char item[1500];
    sprintf(item,
            "{\"id\":%d,\"username\":\"%s\",\"eventTitle\":\"%s\",\"eventDate\":\"%s\","
            "\"eventType\":\"%s\",\"content\":\"%s\",\"createTime\":\"%s\",\"readFlag\":\"%s\"}",
            notifications[i].id, notifications[i].username,
            notifications[i].event_title, notifications[i].event_date,
            notifications[i].event_type, notifications[i].content,
            notifications[i].create_time, notifications[i].read_flag);
    strcat(buf, item);
    first = 0;
  }
  strcat(buf, "]");
}

int is_user_subscribed(const char *username, const char *event_type) {
  for (int i = 0; i < subscription_count; i++) {
    if (strcmp(subscriptions[i].username, username) == 0 &&
        strcmp(subscriptions[i].event_type, event_type) == 0) {
      return 1;
    }
  }
  return 0;
}

void get_conversations_json(char *buf, const char *username) {
  strcat(buf, "[");
  int first = 1;

  int indices[MAX_THREADS];
  int cnt = 0;
  for (int i = 0; i < thread_count; i++) {
    if (strcmp(threads[i].user1, username) == 0 ||
        strcmp(threads[i].user2, username) == 0) {
      indices[cnt++] = i;
    }
  }

  for (int pass = 0; pass < cnt - 1; pass++) {
    for (int j = 0; j < cnt - 1 - pass; j++) {
      if (strcmp(threads[indices[j]].last_time, threads[indices[j+1]].last_time) < 0) {
        int tmp = indices[j];
        indices[j] = indices[j+1];
        indices[j+1] = tmp;
      }
    }
  }

  for (int k = 0; k < cnt; k++) {
    int i = indices[k];
    if (!first) strcat(buf, ",");
    char item[1024];
    sprintf(item,
            "{\"id\":%d,\"user1\":\"%s\",\"user2\":\"%s\","
            "\"lastMessage\":\"%s\",\"lastTime\":\"%s\"}",
            threads[i].id, threads[i].user1, threads[i].user2,
            threads[i].last_message, threads[i].last_time);
    strcat(buf, item);
    first = 0;
  }
  strcat(buf, "]");
}

void get_messages_json(char *buf, int thread_id) {
  strcat(buf, "[");
  int first = 1;
  for (int i = 0; i < message_count; i++) {
    if (messages[i].thread_id == thread_id) {
      if (!first) strcat(buf, ",");
      char item[1024];
      sprintf(item,
              "{\"id\":%d,\"threadId\":%d,\"sender\":\"%s\","
              "\"content\":\"%s\",\"sendTime\":\"%s\",\"readFlag\":\"%s\"}",
              messages[i].id, messages[i].thread_id, messages[i].sender,
              messages[i].content, messages[i].send_time, messages[i].read_flag);
      strcat(buf, item);
      first = 0;
    }
  }
  strcat(buf, "]");
}

int find_or_create_thread(const char *user1, const char *user2) {
  for (int i = 0; i < thread_count; i++) {
    if ((strcmp(threads[i].user1, user1) == 0 && strcmp(threads[i].user2, user2) == 0) ||
        (strcmp(threads[i].user1, user2) == 0 && strcmp(threads[i].user2, user1) == 0)) {
      return threads[i].id;
    }
  }
  if (thread_count < MAX_THREADS) {
    threads[thread_count].id = next_thread_id++;
    strcpy(threads[thread_count].user1, user1);
    strcpy(threads[thread_count].user2, user2);
    strcpy(threads[thread_count].last_message, "");
    strcpy(threads[thread_count].last_time, "");
    thread_count++;
    save_data();
    return threads[thread_count - 1].id;
  }
  return -1;
}

int get_unread_message_count(const char *username) {
  int count = 0;
  for (int i = 0; i < message_count; i++) {
    if (strcmp(messages[i].sender, username) != 0 && strcmp(messages[i].read_flag, "no") == 0) {
      int tid = messages[i].thread_id;
      for (int j = 0; j < thread_count; j++) {
        if (threads[j].id == tid) {
          if (strcmp(threads[j].user1, username) == 0 || strcmp(threads[j].user2, username) == 0) {
            count++;
          }
          break;
        }
      }
    }
  }
  return count;
}

static int is_date_in_range(const char *create_time, const char *target_date) {
  if (strlen(create_time) < 10) return 0;
  return strncmp(create_time, target_date, 10) == 0;
}

static void get_date_str(struct tm *t, char *buf, int max_len) {
  snprintf(buf, max_len, "%04d-%02d-%02d",
           t->tm_year + 1900, t->tm_mon + 1, t->tm_mday);
}

void get_stats_json(char *buf, const char *range) {
  time_t now = time(NULL);
  struct tm *t = localtime(&now);

  char today_str[20];
  get_date_str(t, today_str, sizeof(today_str));

  int total_users = user_count;
  int total_orders = order_count;

  int today_new_users = 0;
  int today_new_orders = 0;
  for (int i = 0; i < user_count; i++) {
    if (is_date_in_range(users[i].create_time, today_str)) {
      today_new_users++;
    }
  }
  for (int i = 0; i < order_count; i++) {
    if (is_date_in_range(orders[i].create_time, today_str)) {
      today_new_orders++;
    }
  }

  int pending_count = 0, accepted_count = 0, delivered_count = 0;
  int completed_count = 0, cancelled_count = 0;
  for (int i = 0; i < order_count; i++) {
    if (strcmp(orders[i].status, "pending") == 0) pending_count++;
    else if (strcmp(orders[i].status, "accepted") == 0) accepted_count++;
    else if (strcmp(orders[i].status, "delivered") == 0) delivered_count++;
    else if (strcmp(orders[i].status, "completed") == 0) completed_count++;
    else if (strcmp(orders[i].status, "cancelled") == 0) cancelled_count++;
  }

  int days = 7;
  if (range && strcmp(range, "today") == 0) days = 1;
  else if (range && strcmp(range, "week") == 0) days = 7;
  else if (range && strcmp(range, "month") == 0) days = 30;

  char daily_labels[60][20];
  int daily_order_counts[60] = {0};
  int daily_user_counts[60] = {0};

  for (int d = 0; d < days; d++) {
    time_t day_time = now - (days - 1 - d) * 86400;
    struct tm *day_tm = localtime(&day_time);
    get_date_str(day_tm, daily_labels[d], sizeof(daily_labels[d]));

    for (int i = 0; i < order_count; i++) {
      if (is_date_in_range(orders[i].create_time, daily_labels[d])) {
        daily_order_counts[d]++;
      }
    }
    for (int i = 0; i < user_count; i++) {
      if (is_date_in_range(users[i].create_time, daily_labels[d])) {
        daily_user_counts[d]++;
      }
    }
  }

  strcpy(buf, "{");
  char tmp[256];

  snprintf(tmp, sizeof(tmp), "\"totalUsers\":%d,", total_users);
  strcat(buf, tmp);
  snprintf(tmp, sizeof(tmp), "\"totalOrders\":%d,", total_orders);
  strcat(buf, tmp);
  snprintf(tmp, sizeof(tmp), "\"todayNewUsers\":%d,", today_new_users);
  strcat(buf, tmp);
  snprintf(tmp, sizeof(tmp), "\"todayNewOrders\":%d,", today_new_orders);
  strcat(buf, tmp);

  strcat(buf, "\"statusDistribution\":{");
  snprintf(tmp, sizeof(tmp), "\"pending\":%d,", pending_count);
  strcat(buf, tmp);
  snprintf(tmp, sizeof(tmp), "\"accepted\":%d,", accepted_count);
  strcat(buf, tmp);
  snprintf(tmp, sizeof(tmp), "\"delivered\":%d,", delivered_count);
  strcat(buf, tmp);
  snprintf(tmp, sizeof(tmp), "\"completed\":%d,", completed_count);
  strcat(buf, tmp);
  snprintf(tmp, sizeof(tmp), "\"cancelled\":%d", cancelled_count);
  strcat(buf, tmp);
  strcat(buf, "},");

  strcat(buf, "\"dailyTrend\":[");
  for (int d = 0; d < days; d++) {
    if (d > 0) strcat(buf, ",");
    snprintf(tmp, sizeof(tmp),
             "{\"date\":\"%s\",\"orderCount\":%d,\"userCount\":%d}",
             daily_labels[d], daily_order_counts[d], daily_user_counts[d]);
    strcat(buf, tmp);
  }
  strcat(buf, "]");

  strcat(buf, "}");
}
