#ifndef TYPES_H
#define TYPES_H

#define MAX_ORDERS 500
#define MAX_USERS 100
#define MAX_CERT_APPS 200
#define MAX_BLACKLIST 500
#define BUFFER_SIZE 20480

typedef struct {
  char username[50];
  char password[50];
  char real_name[50];
  char major[50];
  char student_id[30];
  char dorm_building[50];
  char phone[20];
  char certified[10];
  char cert_apply_time[30];
  char cert_audit_time[30];
} User;

typedef struct {
  int id;
  char creator[50];
  char worker[50];
  char package_info[100];
  char pickup_addr[100];
  char delivery_addr[100];
  char reward[20];
  char category[50];
  char status[20];
  char building_tag[50];
} Order;

typedef struct {
  int id;
  char username[50];
  char real_name[50];
  char student_id[30];
  char dorm_building[50];
  char phone[20];
  char description[500];
  char status[20];
  char apply_time[30];
  char audit_time[30];
  char auditor[50];
  char audit_opinion[500];
} CertApplication;

typedef struct {
  int id;
  char blocker[50];
  char blocked[50];
  char blocked_real_name[50];
  char create_time[30];
} BlacklistEntry;

#endif
