#include "routes.h"
#include "database.h"
#include "json_parser.h"
#include "logger.h"
#include "types.h"
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <time.h>
#include <unistd.h>

static void send_file(int client_socket, const char *path,
                      const char *content_type) {
  int fd = open(path, O_RDONLY);
  if (fd < 0) {
    log_message(LOG_ERROR, "Failed to open file: %s", path);
    char response[] = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n";
    send(client_socket, response, strlen(response), 0);
    return;
  }

  char header[256];
  snprintf(header, sizeof(header),
           "HTTP/1.1 200 OK\r\nContent-Type: %s\r\n\r\n", content_type);
  send(client_socket, header, strlen(header), 0);

  char file_buf[BUFFER_SIZE];
  int n;
  while ((n = read(fd, file_buf, BUFFER_SIZE)) > 0) {
    send(client_socket, file_buf, n, 0);
  }
  close(fd);
  log_message(LOG_INFO, "Served file: %s", path);
}

static void handle_register(int client_socket, char *body) {
  User u;
  memset(&u, 0, sizeof(User));

  parse_json_string(body, "username", u.username, sizeof(u.username));
  parse_json_string(body, "password", u.password, sizeof(u.password));
  parse_json_string(body, "realName", u.real_name, sizeof(u.real_name));
  parse_json_string(body, "major", u.major, sizeof(u.major));

  if (strlen(u.username) == 0 || strlen(u.password) == 0) {
    log_message(LOG_WARN, "Registration failed: missing credentials");
    char resp[] = "HTTP/1.1 400 Bad Request\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  for (int i = 0; i < user_count; i++) {
    if (strcmp(users[i].username, u.username) == 0) {
      log_message(LOG_WARN, "Registration failed: username already exists: %s",
                  u.username);
      char resp[] =
          "HTTP/1.1 409 Conflict\r\nContent-Type: "
          "application/"
          "json\r\n\r\n{\"status\":\"error\",\"message\":\"用户名已存在\"}";
      send(client_socket, resp, strlen(resp), 0);
      return;
    }
  }

  if (user_count < MAX_USERS) {
    users[user_count++] = u;
    save_data();
    log_message(LOG_INFO, "User registered: %s (%s)", u.username, u.real_name);

    char resp[512];
    snprintf(resp, sizeof(resp),
             "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n"
             "{\"status\":\"success\",\"username\":\"%s\",\"realName\":\"%s\","
             "\"major\":\"%s\"}",
             u.username, u.real_name, u.major);
    send(client_socket, resp, strlen(resp), 0);
  } else {
    log_message(LOG_ERROR, "Registration failed: max users reached");
    char resp[] = "HTTP/1.1 500 Internal Server Error\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\"}";
    send(client_socket, resp, strlen(resp), 0);
  }
}

static void handle_login(int client_socket, char *body) {
  char user[50] = "", pass[50] = "";
  parse_json_string(body, "username", user, sizeof(user));
  parse_json_string(body, "password", pass, sizeof(pass));

  int found = -1;
  for (int i = 0; i < user_count; i++) {
    if (strcmp(users[i].username, user) == 0 &&
        strcmp(users[i].password, pass) == 0) {
      found = i;
      break;
    }
  }

  if (found != -1) {
    char resp[512];
    snprintf(resp, sizeof(resp),
             "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n"
             "{\"status\":\"success\",\"username\":\"%s\",\"realName\":\"%s\","
             "\"major\":\"%s\"}",
             users[found].username, users[found].real_name, users[found].major);
    send(client_socket, resp, strlen(resp), 0);
    log_message(LOG_INFO, "User logged in: %s", user);
  } else {
    char resp[] =
        "HTTP/1.1 401 Unauthorized\r\nContent-Type: application/json\r\n\r\n"
        "{\"status\":\"error\",\"message\":\"账号或密码错误\"}";
    send(client_socket, resp, strlen(resp), 0);
    log_message(LOG_WARN, "Login failed for user: %s", user);
  }
}

static void handle_get_orders(int client_socket, char *query_string) {
  char creator[50] = "", worker[50] = "", category[50] = "", status[50] = "";

  if (query_string) {
    char *cr_ptr = strstr(query_string, "creator=");
    if (cr_ptr)
      sscanf(cr_ptr + 8, "%[^& ]", creator);
    char *wr_ptr = strstr(query_string, "worker=");
    if (wr_ptr)
      sscanf(wr_ptr + 7, "%[^& ]", worker);
    char *ct_ptr = strstr(query_string, "category=");
    if (ct_ptr)
      sscanf(ct_ptr + 9, "%[^& ]", category);
    char *st_ptr = strstr(query_string, "status=");
    if (st_ptr)
      sscanf(st_ptr + 7, "%[^& ]", status);
  }

  char response_header[] = "HTTP/1.1 200 OK\r\nContent-Type: application/json; "
                           "charset=UTF-8\r\n\r\n";
  send(client_socket, response_header, strlen(response_header), 0);

  char *json = malloc(MAX_ORDERS * 1024);
  if (!json) {
    log_message(LOG_ERROR, "Failed to allocate memory for orders JSON");
    return;
  }
  memset(json, 0, MAX_ORDERS * 1024);
  get_orders_json(json, creator, worker, category, status);
  send(client_socket, json, strlen(json), 0);
  free(json);

  log_message(LOG_INFO, "Orders fetched - creator:%s worker:%s category:%s status:%s",
              creator[0] ? creator : "all", worker[0] ? worker : "all",
              category[0] ? category : "all", status[0] ? status : "all");
}

static void handle_create_order(int client_socket, char *body) {
  Order new_order;
  memset(&new_order, 0, sizeof(Order));
  new_order.id = next_id++;

  parse_json_string(body, "package", new_order.package_info,
                    sizeof(new_order.package_info));
  parse_json_string(body, "pickup", new_order.pickup_addr,
                    sizeof(new_order.pickup_addr));
  parse_json_string(body, "delivery", new_order.delivery_addr,
                    sizeof(new_order.delivery_addr));
  parse_json_string(body, "reward", new_order.reward, sizeof(new_order.reward));
  parse_json_string(body, "creator", new_order.creator,
                    sizeof(new_order.creator));

  if (strstr(new_order.pickup_addr, "菜鸟"))
    strcpy(new_order.category, "菜鸟");
  else if (strstr(new_order.pickup_addr, "顺丰"))
    strcpy(new_order.category, "顺丰");
  else if (strstr(new_order.pickup_addr, "京东"))
    strcpy(new_order.category, "京东");
  else if (strstr(new_order.pickup_addr, "中通") ||
           strstr(new_order.pickup_addr, "圆通"))
    strcpy(new_order.category, "中通");
  else
    strcpy(new_order.category, "其他");

  strcpy(new_order.status, "pending");

  if (order_count < MAX_ORDERS) {
    orders[order_count++] = new_order;
    save_data();
    log_message(LOG_INFO, "Order created: ID=%d by %s", new_order.id,
                new_order.creator);
    char response[] = "HTTP/1.1 200 OK\r\nContent-Type: "
                      "application/json\r\n\r\n{\"status\":\"success\"}";
    send(client_socket, response, strlen(response), 0);
  } else {
    log_message(LOG_ERROR, "Failed to create order: max orders reached");
    char response[] = "HTTP/1.1 500 Internal Server Error\r\nContent-Type: "
                      "application/json\r\n\r\n{\"status\":\"error\"}";
    send(client_socket, response, strlen(response), 0);
  }
}

static void get_current_time_str(char *buf, int max_len) {
  time_t now = time(NULL);
  struct tm *t = localtime(&now);
  snprintf(buf, max_len, "%04d-%02d-%02d %02d:%02d:%02d",
           t->tm_year + 1900, t->tm_mon + 1, t->tm_mday,
           t->tm_hour, t->tm_min, t->tm_sec);
}

static void handle_get_blacklist(int client_socket, char *query_string) {
  char blocker[50] = "";

  if (query_string) {
    char *b_ptr = strstr(query_string, "blocker=");
    if (b_ptr)
      sscanf(b_ptr + 8, "%[^& ]", blocker);
  }

  char response_header[] = "HTTP/1.1 200 OK\r\nContent-Type: application/json; "
                           "charset=UTF-8\r\n\r\n";
  send(client_socket, response_header, strlen(response_header), 0);

  char *json = malloc(MAX_BLACKLIST * 512);
  if (!json) {
    log_message(LOG_ERROR, "Failed to allocate memory for blacklist JSON");
    return;
  }
  memset(json, 0, MAX_BLACKLIST * 512);
  get_blacklist_json(json, blocker);
  send(client_socket, json, strlen(json), 0);
  free(json);

  log_message(LOG_INFO, "Blacklist fetched - blocker:%s",
              blocker[0] ? blocker : "all");
}

static void handle_add_blacklist(int client_socket, char *body) {
  char blocker[50] = "", blocked[50] = "";

  parse_json_string(body, "blocker", blocker, sizeof(blocker));
  parse_json_string(body, "blocked", blocked, sizeof(blocked));

  if (strlen(blocker) == 0 || strlen(blocked) == 0) {
    char resp[] = "HTTP/1.1 400 Bad Request\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"参数不完整\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  if (strcmp(blocker, blocked) == 0) {
    char resp[] = "HTTP/1.1 400 Bad Request\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"不能拉黑自己\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  if (is_user_blocked(blocker, blocked)) {
    char resp[] = "HTTP/1.1 409 Conflict\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"该用户已在黑名单中\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  if (blacklist_count >= MAX_BLACKLIST) {
    char resp[] = "HTTP/1.1 500 Internal Server Error\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"黑名单数量已达上限\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  char blocked_real_name[50] = "";
  for (int i = 0; i < user_count; i++) {
    if (strcmp(users[i].username, blocked) == 0) {
      strcpy(blocked_real_name, users[i].real_name);
      break;
    }
  }

  BlacklistEntry entry;
  memset(&entry, 0, sizeof(BlacklistEntry));
  entry.id = next_blacklist_id++;
  strcpy(entry.blocker, blocker);
  strcpy(entry.blocked, blocked);
  strcpy(entry.blocked_real_name, blocked_real_name);
  get_current_time_str(entry.create_time, sizeof(entry.create_time));

  blacklist[blacklist_count++] = entry;
  save_data();
  log_message(LOG_INFO, "User added to blacklist: %s blocked %s", blocker, blocked);

  char resp[256];
  snprintf(resp, sizeof(resp),
           "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n"
           "{\"status\":\"success\",\"id\":%d}",
           entry.id);
  send(client_socket, resp, strlen(resp), 0);
}

static void handle_remove_blacklist(int client_socket, char *body) {
  char blocker[50] = "", blocked[50] = "";
  int id = -1;

  char *id_ptr = strstr(body, "\"id\":");
  if (id_ptr)
    sscanf(id_ptr + 5, "%d", &id);
  parse_json_string(body, "blocker", blocker, sizeof(blocker));
  parse_json_string(body, "blocked", blocked, sizeof(blocked));

  int found = -1;
  for (int i = 0; i < blacklist_count; i++) {
    if (id > 0) {
      if (blacklist[i].id == id) {
        found = i;
        break;
      }
    } else {
      if (strcmp(blacklist[i].blocker, blocker) == 0 &&
          strcmp(blacklist[i].blocked, blocked) == 0) {
        found = i;
        break;
      }
    }
  }

  if (found == -1) {
    char resp[] = "HTTP/1.1 404 Not Found\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"黑名单记录不存在\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  for (int i = found; i < blacklist_count - 1; i++) {
    blacklist[i] = blacklist[i + 1];
  }
  blacklist_count--;
  save_data();
  log_message(LOG_INFO, "User removed from blacklist");

  char response[] = "HTTP/1.1 200 OK\r\nContent-Type: "
                    "application/json\r\n\r\n{\"status\":\"success\"}";
  send(client_socket, response, strlen(response), 0);
}

static void handle_update_status(int client_socket, char *body) {
  int id = -1;
  char new_status[20] = "", worker[50] = "";

  char *id_ptr = strstr(body, "\"id\":");
  if (id_ptr)
    sscanf(id_ptr + 5, "%d", &id);

  parse_json_string(body, "status", new_status, sizeof(new_status));
  parse_json_string(body, "worker", worker, sizeof(worker));

  for (int i = 0; i < order_count; i++) {
    if (orders[i].id == id) {
      if (strcmp(new_status, "accepted") == 0 && strlen(worker) > 0) {
        if (is_user_blocked(orders[i].creator, worker)) {
          log_message(LOG_WARN, "Order accept blocked: %s is in %s's blacklist",
                      worker, orders[i].creator);
          char resp[] = "HTTP/1.1 403 Forbidden\r\nContent-Type: "
                        "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"发布者已将您加入黑名单，无法接取该订单\"}";
          send(client_socket, resp, strlen(resp), 0);
          return;
        }
      }
      strcpy(orders[i].status, new_status);
      // Only set worker if it's a pending order being accepted
      if (strcmp(new_status, "accepted") == 0 && strlen(worker) > 0) {
        strcpy(orders[i].worker, worker);
      }
      save_data();
      log_message(LOG_INFO, "Order %d status updated to: %s", id, new_status);
      char response[] = "HTTP/1.1 200 OK\r\nContent-Type: "
                        "application/json\r\n\r\n{\"status\":\"success\"}";
      send(client_socket, response, strlen(response), 0);
      return;
    }
  }

  log_message(LOG_WARN, "Order not found or invalid: ID=%d", id);
  char response[] = "HTTP/1.1 404 Not Found\r\nContent-Type: "
                    "application/json\r\n\r\n{\"status\":\"error\"}";
  send(client_socket, response, strlen(response), 0);
}

static void handle_update_profile(int client_socket, char *body) {
  char username[50] = "", real_name[50] = "", major[50] = "", pwd[50] = "";

  parse_json_string(body, "username", username, sizeof(username));
  parse_json_string(body, "realName", real_name, sizeof(real_name));
  parse_json_string(body, "major", major, sizeof(major));
  parse_json_string(body, "password", pwd, sizeof(pwd));

  for (int i = 0; i < user_count; i++) {
    if (strcmp(users[i].username, username) == 0) {
      if (strlen(real_name) > 0)
        strcpy(users[i].real_name, real_name);
      if (strlen(major) > 0)
        strcpy(users[i].major, major);
      if (strlen(pwd) > 0)
        strcpy(users[i].password, pwd);
      save_data();
      log_message(LOG_INFO, "Profile updated for user: %s", username);
      char response[] = "HTTP/1.1 200 OK\r\nContent-Type: "
                        "application/json\r\n\r\n{\"status\":\"success\"}";
      send(client_socket, response, strlen(response), 0);
      return;
    }
  }

  log_message(LOG_WARN, "User not found for profile update: %s", username);
  char response[] = "HTTP/1.1 404 Not Found\r\nContent-Type: "
                    "application/json\r\n\r\n{\"status\":\"error\"}";
  send(client_socket, response, strlen(response), 0);
}

static void handle_submit_cert(int client_socket, char *body) {
  char username[50] = "", student_id[30] = "", dorm_building[50] = "";
  char phone[20] = "", description[500] = "";
  int app_id = -1;

  parse_json_string(body, "username", username, sizeof(username));
  parse_json_string(body, "studentId", student_id, sizeof(student_id));
  parse_json_string(body, "dormBuilding", dorm_building, sizeof(dorm_building));
  parse_json_string(body, "phone", phone, sizeof(phone));
  parse_json_string(body, "description", description, sizeof(description));
  char *id_ptr = strstr(body, "\"id\":");
  if (id_ptr)
    sscanf(id_ptr + 5, "%d", &app_id);

  if (strlen(username) == 0 || strlen(student_id) == 0 ||
      strlen(dorm_building) == 0 || strlen(phone) == 0) {
    char resp[] = "HTTP/1.1 400 Bad Request\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"请填写完整信息\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  int user_idx = -1;
  for (int i = 0; i < user_count; i++) {
    if (strcmp(users[i].username, username) == 0) {
      user_idx = i;
      break;
    }
  }
  if (user_idx == -1) {
    char resp[] = "HTTP/1.1 404 Not Found\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"用户不存在\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  CertApplication *app = NULL;
  if (app_id > 0) {
    for (int i = 0; i < cert_app_count; i++) {
      if (cert_apps[i].id == app_id &&
          strcmp(cert_apps[i].username, username) == 0) {
        app = &cert_apps[i];
        break;
      }
    }
  }

  if (app) {
    strcpy(app->student_id, student_id);
    strcpy(app->dorm_building, dorm_building);
    strcpy(app->phone, phone);
    strcpy(app->description, description);
    strcpy(app->status, "pending");
    app->audit_time[0] = '\0';
    app->auditor[0] = '\0';
    app->audit_opinion[0] = '\0';
    get_current_time_str(app->apply_time, sizeof(app->apply_time));
    log_message(LOG_INFO, "Cert application resubmitted: ID=%d user=%s",
                app->id, username);
  } else {
    if (cert_app_count >= MAX_CERT_APPS) {
      char resp[] = "HTTP/1.1 500 Internal Server Error\r\nContent-Type: "
                    "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"申请数量已达上限\"}";
      send(client_socket, resp, strlen(resp), 0);
      return;
    }

    CertApplication new_app;
    memset(&new_app, 0, sizeof(CertApplication));
    new_app.id = next_cert_id++;
    strcpy(new_app.username, username);
    strcpy(new_app.real_name, users[user_idx].real_name);
    strcpy(new_app.student_id, student_id);
    strcpy(new_app.dorm_building, dorm_building);
    strcpy(new_app.phone, phone);
    strcpy(new_app.description, description);
    strcpy(new_app.status, "pending");
    get_current_time_str(new_app.apply_time, sizeof(new_app.apply_time));

    cert_apps[cert_app_count++] = new_app;
    log_message(LOG_INFO, "Cert application submitted: ID=%d user=%s",
                new_app.id, username);
    app_id = new_app.id;
  }

  strcpy(users[user_idx].student_id, student_id);
  strcpy(users[user_idx].dorm_building, dorm_building);
  strcpy(users[user_idx].phone, phone);
  if (strlen(users[user_idx].certified) == 0)
    strcpy(users[user_idx].certified, "pending");
  get_current_time_str(users[user_idx].cert_apply_time,
                       sizeof(users[user_idx].cert_apply_time));

  save_data();

  char resp[256];
  snprintf(resp, sizeof(resp),
           "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n"
           "{\"status\":\"success\",\"id\":%d}",
           app_id);
  send(client_socket, resp, strlen(resp), 0);
}

static void handle_get_cert_apps(int client_socket, char *query_string) {
  char username[50] = "", status[50] = "";

  if (query_string) {
    char *u_ptr = strstr(query_string, "username=");
    if (u_ptr)
      sscanf(u_ptr + 9, "%[^& ]", username);
    char *s_ptr = strstr(query_string, "status=");
    if (s_ptr)
      sscanf(s_ptr + 7, "%[^& ]", status);
  }

  char response_header[] = "HTTP/1.1 200 OK\r\nContent-Type: application/json; "
                           "charset=UTF-8\r\n\r\n";
  send(client_socket, response_header, strlen(response_header), 0);

  char *json = malloc(MAX_CERT_APPS * 2048);
  if (!json) {
    log_message(LOG_ERROR, "Failed to allocate memory for cert apps JSON");
    return;
  }
  memset(json, 0, MAX_CERT_APPS * 2048);
  get_cert_apps_json(json, username, status);
  send(client_socket, json, strlen(json), 0);
  free(json);

  log_message(LOG_INFO, "Cert apps fetched - username:%s status:%s",
              username[0] ? username : "all", status[0] ? status : "all");
}

static void handle_audit_cert(int client_socket, char *body) {
  int id = -1;
  char action[20] = "", auditor[50] = "", opinion[500] = "";

  char *id_ptr = strstr(body, "\"id\":");
  if (id_ptr)
    sscanf(id_ptr + 5, "%d", &id);
  parse_json_string(body, "action", action, sizeof(action));
  parse_json_string(body, "auditor", auditor, sizeof(auditor));
  parse_json_string(body, "opinion", opinion, sizeof(opinion));

  if (id <= 0 || (strcmp(action, "approve") != 0 && strcmp(action, "reject") != 0)) {
    char resp[] = "HTTP/1.1 400 Bad Request\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"参数错误\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  CertApplication *app = NULL;
  for (int i = 0; i < cert_app_count; i++) {
    if (cert_apps[i].id == id) {
      app = &cert_apps[i];
      break;
    }
  }

  if (!app) {
    char resp[] = "HTTP/1.1 404 Not Found\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"申请不存在\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  if (strcmp(app->status, "pending") != 0) {
    char resp[] = "HTTP/1.1 400 Bad Request\r\nContent-Type: "
                  "application/json\r\n\r\n{\"status\":\"error\",\"message\":\"该申请已审核\"}";
    send(client_socket, resp, strlen(resp), 0);
    return;
  }

  if (strcmp(action, "approve") == 0) {
    strcpy(app->status, "approved");
  } else {
    strcpy(app->status, "rejected");
  }
  strcpy(app->auditor, auditor);
  strcpy(app->audit_opinion, opinion);
  get_current_time_str(app->audit_time, sizeof(app->audit_time));

  for (int i = 0; i < user_count; i++) {
    if (strcmp(users[i].username, app->username) == 0) {
      if (strcmp(action, "approve") == 0) {
        strcpy(users[i].certified, "yes");
      } else {
        strcpy(users[i].certified, "rejected");
      }
      strcpy(users[i].cert_audit_time, app->audit_time);
      break;
    }
  }

  save_data();
  log_message(LOG_INFO, "Cert application %s: ID=%d by %s", action, id, auditor);

  char response[] = "HTTP/1.1 200 OK\r\nContent-Type: "
                    "application/json\r\n\r\n{\"status\":\"success\"}";
  send(client_socket, response, strlen(response), 0);
}

static void handle_get_user(int client_socket, char *query_string) {
  char username[50] = "";
  if (query_string) {
    char *u_ptr = strstr(query_string, "username=");
    if (u_ptr)
      sscanf(u_ptr + 9, "%[^& ]", username);
  }

  char response_header[] = "HTTP/1.1 200 OK\r\nContent-Type: application/json; "
                           "charset=UTF-8\r\n\r\n";
  send(client_socket, response_header, strlen(response_header), 0);

  char json[2048];
  memset(json, 0, sizeof(json));
  get_user_json(json, username);
  send(client_socket, json, strlen(json), 0);
}

void handle_request(int client_socket) {
  char buffer[BUFFER_SIZE];
  memset(buffer, 0, BUFFER_SIZE);
  int bytes_read = read(client_socket, buffer, BUFFER_SIZE - 1);

  if (bytes_read <= 0) {
    close(client_socket);
    return;
  }

  // Ensure full body for POST
  if (strstr(buffer, "POST ")) {
    char *cl_ptr = strstr(buffer, "Content-Length: ");
    if (cl_ptr) {
      int clen = atoi(cl_ptr + 16);
      char *b_start = strstr(buffer, "\r\n\r\n");
      if (b_start) {
        b_start += 4;
        long current_body_len = bytes_read - (b_start - buffer);
        while (current_body_len < clen && bytes_read < BUFFER_SIZE - 1) {
          int n = read(client_socket, buffer + bytes_read,
                       BUFFER_SIZE - 1 - bytes_read);
          if (n <= 0)
            break;
          bytes_read += n;
          current_body_len += n;
        }
      }
    }
  }

  if (strstr(buffer, "GET / ") || strstr(buffer, "GET /index.html")) {
    send_file(client_socket, "frontend/index.html", "text/html; charset=UTF-8");
  } else if (strstr(buffer, "GET /style.css")) {
    send_file(client_socket, "frontend/css/style.css", "text/css");
  } else if (strstr(buffer, "GET /script.js")) {
    send_file(client_socket, "frontend/js/script.js", "application/javascript");
  } else if (strstr(buffer, "POST /api/register")) {
    char *body = strstr(buffer, "\r\n\r\n");
    if (body) {
      body += 4;
      handle_register(client_socket, body);
    }
  } else if (strstr(buffer, "POST /api/login")) {
    char *body = strstr(buffer, "\r\n\r\n");
    if (body) {
      body += 4;
      handle_login(client_socket, body);
    }
  } else if (strstr(buffer, "GET /api/orders")) {
    char *path_start = strstr(buffer, "GET /api/orders");
    char *q = strstr(path_start, "?");
    handle_get_orders(client_socket, q);
  } else if (strstr(buffer, "POST /api/orders")) {
    char *body = strstr(buffer, "\r\n\r\n");
    if (body) {
      body += 4;
      handle_create_order(client_socket, body);
    }
  } else if (strstr(buffer, "POST /api/update_status")) {
    char *body = strstr(buffer, "\r\n\r\n");
    if (body) {
      body += 4;
      handle_update_status(client_socket, body);
    }
  } else if (strstr(buffer, "POST /api/update_profile")) {
    char *body = strstr(buffer, "\r\n\r\n");
    if (body) {
      body += 4;
      handle_update_profile(client_socket, body);
    }
  } else if (strstr(buffer, "POST /api/cert/submit")) {
    char *body = strstr(buffer, "\r\n\r\n");
    if (body) {
      body += 4;
      handle_submit_cert(client_socket, body);
    }
  } else if (strstr(buffer, "GET /api/cert/apps")) {
    char *path_start = strstr(buffer, "GET /api/cert/apps");
    char *q = strstr(path_start, "?");
    handle_get_cert_apps(client_socket, q);
  } else if (strstr(buffer, "POST /api/cert/audit")) {
    char *body = strstr(buffer, "\r\n\r\n");
    if (body) {
      body += 4;
      handle_audit_cert(client_socket, body);
    }
  } else if (strstr(buffer, "GET /api/users")) {
    char response_header[] = "HTTP/1.1 200 OK\r\nContent-Type: application/json; "
                             "charset=UTF-8\r\n\r\n";
    send(client_socket, response_header, strlen(response_header), 0);

    char *json = malloc(MAX_USERS * 1024);
    if (!json) {
      log_message(LOG_ERROR, "Failed to allocate memory for users JSON");
      return;
    }
    memset(json, 0, MAX_USERS * 1024);
    get_users_json(json);
    send(client_socket, json, strlen(json), 0);
    free(json);
    log_message(LOG_INFO, "Users list fetched");
  } else if (strstr(buffer, "GET /api/user")) {
    char *path_start = strstr(buffer, "GET /api/user");
    char *q = strstr(path_start, "?");
    handle_get_user(client_socket, q);
  } else if (strstr(buffer, "GET /api/blacklist")) {
    char *path_start = strstr(buffer, "GET /api/blacklist");
    char *q = strstr(path_start, "?");
    handle_get_blacklist(client_socket, q);
  } else if (strstr(buffer, "POST /api/blacklist/add")) {
    char *body = strstr(buffer, "\r\n\r\n");
    if (body) {
      body += 4;
      handle_add_blacklist(client_socket, body);
    }
  } else if (strstr(buffer, "POST /api/blacklist/remove")) {
    char *body = strstr(buffer, "\r\n\r\n");
    if (body) {
      body += 4;
      handle_remove_blacklist(client_socket, body);
    }
  } else {
    log_message(LOG_WARN, "404 Not Found: %.50s", buffer);
    char response[] = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n";
    send(client_socket, response, strlen(response), 0);
  }

  close(client_socket);
}
