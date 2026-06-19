#include "database.h"
#include "logger.h"
#include <stdio.h>
#include <string.h>
#include <time.h>

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

void save_cert_data() {
  FILE *f = fopen("data_cert.bin", "wb");
  if (f) {
    fwrite(&cert_app_count, sizeof(int), 1, f);
    fwrite(&next_cert_id, sizeof(int), 1, f);
    fwrite(cert_apps, sizeof(CertApplication), cert_app_count, f);
    fclose(f);
    log_message(LOG_INFO, "Cert applications data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save cert applications data");
  }
}

void load_cert_data() {
  FILE *f = fopen("data_cert.bin", "rb");
  if (f) {
    fread(&cert_app_count, sizeof(int), 1, f);
    fread(&next_cert_id, sizeof(int), 1, f);
    fread(cert_apps, sizeof(CertApplication), cert_app_count, f);
    fclose(f);
    log_message(LOG_INFO, "Loaded %d cert applications", cert_app_count);
  } else {
    log_message(LOG_WARN, "No existing cert applications data found");
  }
}

void save_blacklist_data() {
  FILE *f = fopen("data_blacklist.bin", "wb");
  if (f) {
    fwrite(&blacklist_count, sizeof(int), 1, f);
    fwrite(&next_blacklist_id, sizeof(int), 1, f);
    fwrite(blacklist, sizeof(BlacklistEntry), blacklist_count, f);
    fclose(f);
    log_message(LOG_INFO, "Blacklist data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save blacklist data");
  }
}

void load_blacklist_data() {
  FILE *f = fopen("data_blacklist.bin", "rb");
  if (f) {
    fread(&blacklist_count, sizeof(int), 1, f);
    fread(&next_blacklist_id, sizeof(int), 1, f);
    fread(blacklist, sizeof(BlacklistEntry), blacklist_count, f);
    fclose(f);
    log_message(LOG_INFO, "Loaded %d blacklist entries", blacklist_count);
  } else {
    log_message(LOG_WARN, "No existing blacklist data found");
  }
}

void save_event_data() {
  FILE *f = fopen("data_events.bin", "wb");
  if (f) {
    fwrite(&event_count, sizeof(int), 1, f);
    fwrite(&next_event_id, sizeof(int), 1, f);
    fwrite(events, sizeof(Event), event_count, f);
    fclose(f);
    log_message(LOG_INFO, "Events data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save events data");
  }
}

void load_event_data() {
  FILE *f = fopen("data_events.bin", "rb");
  if (f) {
    fread(&event_count, sizeof(int), 1, f);
    fread(&next_event_id, sizeof(int), 1, f);
    fread(events, sizeof(Event), event_count, f);
    fclose(f);
    log_message(LOG_INFO, "Loaded %d events", event_count);
  } else {
    log_message(LOG_WARN, "No existing events data found");
  }
}

void save_subscription_data() {
  FILE *f = fopen("data_subscriptions.bin", "wb");
  if (f) {
    fwrite(&subscription_count, sizeof(int), 1, f);
    fwrite(&next_subscription_id, sizeof(int), 1, f);
    fwrite(subscriptions, sizeof(EventSubscription), subscription_count, f);
    fclose(f);
    log_message(LOG_INFO, "Subscriptions data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save subscriptions data");
  }
}

void load_subscription_data() {
  FILE *f = fopen("data_subscriptions.bin", "rb");
  if (f) {
    fread(&subscription_count, sizeof(int), 1, f);
    fread(&next_subscription_id, sizeof(int), 1, f);
    fread(subscriptions, sizeof(EventSubscription), subscription_count, f);
    fclose(f);
    log_message(LOG_INFO, "Loaded %d subscriptions", subscription_count);
  } else {
    log_message(LOG_WARN, "No existing subscriptions data found");
  }
}

void save_notification_data() {
  FILE *f = fopen("data_notifications.bin", "wb");
  if (f) {
    fwrite(&notification_count, sizeof(int), 1, f);
    fwrite(&next_notification_id, sizeof(int), 1, f);
    fwrite(notifications, sizeof(EventNotification), notification_count, f);
    fclose(f);
    log_message(LOG_INFO, "Notifications data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save notifications data");
  }
}

void load_notification_data() {
  FILE *f = fopen("data_notifications.bin", "rb");
  if (f) {
    fread(&notification_count, sizeof(int), 1, f);
    fread(&next_notification_id, sizeof(int), 1, f);
    fread(notifications, sizeof(EventNotification), notification_count, f);
    fclose(f);
    log_message(LOG_INFO, "Loaded %d notifications", notification_count);
  } else {
    log_message(LOG_WARN, "No existing notifications data found");
  }
}

void save_data() {
  FILE *f1 = fopen("data_orders.bin", "wb");
  if (f1) {
    fwrite(&order_count, sizeof(int), 1, f1);
    fwrite(&next_id, sizeof(int), 1, f1);
    fwrite(orders, sizeof(Order), order_count, f1);
    fclose(f1);
    log_message(LOG_INFO, "Orders data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save orders data");
  }

  FILE *f2 = fopen("data_users.bin", "wb");
  if (f2) {
    fwrite(&user_count, sizeof(int), 1, f2);
    fwrite(users, sizeof(User), user_count, f2);
    fclose(f2);
    log_message(LOG_INFO, "Users data saved successfully");
  } else {
    log_message(LOG_ERROR, "Failed to save users data");
  }

  save_cert_data();
  save_blacklist_data();
  save_event_data();
  save_subscription_data();
  save_notification_data();
}

void load_data() {
  FILE *f1 = fopen("data_orders.bin", "rb");
  if (f1) {
    fread(&order_count, sizeof(int), 1, f1);
    fread(&next_id, sizeof(int), 1, f1);
    fread(orders, sizeof(Order), order_count, f1);
    fclose(f1);
    log_message(LOG_INFO, "Loaded %d orders", order_count);
  } else {
    log_message(LOG_WARN, "No existing orders data found");
  }

  FILE *f2 = fopen("data_users.bin", "rb");
  if (f2) {
    fread(&user_count, sizeof(int), 1, f2);
    fread(users, sizeof(User), user_count, f2);
    fclose(f2);
    log_message(LOG_INFO, "Loaded %d users", user_count);
  } else {
    log_message(LOG_WARN, "No existing users data found");
  }

  load_cert_data();
  load_blacklist_data();
  load_event_data();
  load_subscription_data();
  load_notification_data();

  if (user_count == 0) {
    strcpy(users[user_count].username, "admin");
    strcpy(users[user_count].password, "123456");
    strcpy(users[user_count].real_name, "张小凡");
    strcpy(users[user_count].major, "信安 2101");
    strcpy(users[user_count].certified, "yes");
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
