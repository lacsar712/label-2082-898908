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
}
