#ifndef DATABASE_H
#define DATABASE_H

#include "types.h"

extern User users[MAX_USERS];
extern int user_count;
extern Order orders[MAX_ORDERS];
extern int order_count;
extern int next_id;
extern CertApplication cert_apps[MAX_CERT_APPS];
extern int cert_app_count;
extern int next_cert_id;
extern BlacklistEntry blacklist[MAX_BLACKLIST];
extern int blacklist_count;
extern int next_blacklist_id;
extern Event events[MAX_EVENTS];
extern int event_count;
extern int next_event_id;
extern EventSubscription subscriptions[MAX_SUBSCRIPTIONS];
extern int subscription_count;
extern int next_subscription_id;
extern EventNotification notifications[MAX_NOTIFICATIONS];
extern int notification_count;
extern int next_notification_id;
extern MessageThread threads[MAX_THREADS];
extern int thread_count;
extern int next_thread_id;
extern Message messages[MAX_MESSAGES];
extern int message_count;
extern int next_message_id;

void save_data();
void load_data();
void save_cert_data();
void load_cert_data();
void save_blacklist_data();
void load_blacklist_data();
void save_event_data();
void load_event_data();
void save_subscription_data();
void load_subscription_data();
void save_notification_data();
void load_notification_data();
void save_message_data();
void load_message_data();

#endif
