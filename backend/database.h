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

void save_data();
void load_data();
void save_cert_data();
void load_cert_data();
void save_blacklist_data();
void load_blacklist_data();

#endif
