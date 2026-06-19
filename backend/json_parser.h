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
int is_user_blocked(const char *blocker, const char *blocked);

#endif
