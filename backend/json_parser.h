#ifndef JSON_PARSER_H
#define JSON_PARSER_H

#include "types.h"

void url_decode(char *dst, const char *src);
void parse_json_string(const char *body, const char *key, char *output, int max_len);
void get_orders_json(char *buf, const char *creator_filter, const char *worker_filter, const char *category_filter, const char *status_filter);
void get_cert_apps_json(char *buf, const char *username_filter, const char *status_filter);
void get_user_json(char *buf, const char *username);
void get_users_json(char *buf);
void get_blacklist_json(char *buf, const char *blocker_filter);
void get_events_json(char *buf, const char *date_filter, const char *type_filter);
void get_event_json(char *buf, int event_id);
void get_subscriptions_json(char *buf, const char *username_filter);
void get_notifications_json(char *buf, const char *username_filter);
int is_user_subscribed(const char *username, const char *event_type);
int is_user_blocked(const char *blocker, const char *blocked);
void get_conversations_json(char *buf, const char *username);
void get_messages_json(char *buf, int thread_id);
int find_or_create_thread(const char *user1, const char *user2);
int get_unread_message_count(const char *username);

#endif
