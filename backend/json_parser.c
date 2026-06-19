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
