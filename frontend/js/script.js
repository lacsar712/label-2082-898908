document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        authOverlay: document.getElementById('auth-overlay'),
        mainApp: document.getElementById('main-app'),
        loginForm: document.getElementById('login-form'),
        registerForm: document.getElementById('register-form'),
        tabLogin: document.getElementById('tab-login'),
        tabRegister: document.getElementById('tab-register'),
        displayName: document.getElementById('display-name'),
        displayMajor: document.getElementById('display-major'),
        welcomeName: document.getElementById('welcome-name'),
        logoutBtn: document.getElementById('logout-btn'),
        orderList: document.getElementById('order-list'),
        myOrdersList: document.getElementById('my-orders-list'),
        activeCount: document.getElementById('active-count'),
        orderForm: document.getElementById('order-form'),
        pkgSize: document.getElementById('pkg-size'),
        navItems: document.querySelectorAll('.nav-item'),
        filterPills: document.querySelectorAll('.pill'),
        viewSections: document.querySelectorAll('.view-section'),
        showCreated: document.getElementById('show-created'),
        showAccepted: document.getElementById('show-accepted'),
        profileRealName: document.getElementById('profile-realname'),
        profileMajor: document.getElementById('profile-major-disp'),
        toast: document.getElementById('toast'),
        editProfileBtn: document.getElementById('edit-profile-btn'),
        accountSecBtn: document.getElementById('account-sec-btn'),
        profileModal: document.getElementById('profile-modal'),
        securityModal: document.getElementById('security-modal'),
        profileForm: document.getElementById('profile-form'),
        securityForm: document.getElementById('security-form'),
        editRealname: document.getElementById('edit-realname'),
        editMajor: document.getElementById('edit-major'),
        editPassword: document.getElementById('edit-password'),
        sidebarCertBadge: document.getElementById('sidebar-cert-badge'),
        profileCertBadge: document.getElementById('profile-cert-badge'),
        certEntryBtn: document.getElementById('cert-entry-btn'),
        navCertApply: document.getElementById('nav-cert-apply'),
        navCertRecord: document.getElementById('nav-cert-record'),
        navCertAudit: document.getElementById('nav-cert-audit'),
        certForm: document.getElementById('cert-form'),
        certAppId: document.getElementById('cert-app-id'),
        certStudentId: document.getElementById('cert-student-id'),
        certDorm: document.getElementById('cert-dorm'),
        certPhone: document.getElementById('cert-phone'),
        certDescription: document.getElementById('cert-description'),
        certSubmitBtn: document.getElementById('cert-submit-btn'),
        certRecordList: document.getElementById('cert-record-list'),
        certAuditList: document.getElementById('cert-audit-list'),
        auditFilterPending: document.getElementById('audit-filter-pending'),
        auditFilterAll: document.getElementById('audit-filter-all'),
        auditModal: document.getElementById('audit-modal'),
        auditForm: document.getElementById('audit-form'),
        auditAppId: document.getElementById('audit-app-id'),
        auditAction: document.getElementById('audit-action'),
        auditOpinion: document.getElementById('audit-opinion'),
        auditApplicantInfo: document.getElementById('audit-applicant-info'),
        auditSubmitBtn: document.getElementById('audit-submit-btn'),
        blacklistList: document.getElementById('blacklist-list'),
        blacklistCount: document.getElementById('blacklist-count'),
        calcPickup: document.getElementById('calc-pickup'),
        calcDelivery: document.getElementById('calc-delivery'),
        calcSize: document.getElementById('calc-size'),
        calcUrgent: document.getElementById('calc-urgent'),
        calcRain: document.getElementById('calc-rain'),
        calcDistanceInfo: document.getElementById('calc-distance-info'),
        calcRange: document.getElementById('calc-range'),
        calcBarFill: document.getElementById('calc-bar-fill'),
        calcBarMarker: document.getElementById('calc-bar-marker'),
        calcSuggested: document.getElementById('calc-suggested'),
        calcBase: document.getElementById('calc-base'),
        calcDistanceFee: document.getElementById('calc-distance-fee'),
        calcSizeFee: document.getElementById('calc-size-fee'),
        calcUrgentRow: document.getElementById('calc-urgent-row'),
        calcUrgentFee: document.getElementById('calc-urgent-fee'),
        calcRainRow: document.getElementById('calc-rain-row'),
        calcRainFee: document.getElementById('calc-rain-fee'),
        calcTotal: document.getElementById('calc-total'),
        calcSaveBtn: document.getElementById('calc-save-btn'),
        calcApplyBtn: document.getElementById('calc-apply-btn'),
        calcSavedList: document.getElementById('calc-saved-list'),
        mutualOnlyMine: document.getElementById('mutual-only-mine'),
        mutualBuildingSelect: document.getElementById('mutual-building-select'),
        mutualAidList: document.getElementById('mutual-aid-list'),
        mutualAidCurrentBuilding: document.getElementById('mutual-aid-current-building'),
        buildingSelectModal: document.getElementById('building-select-modal'),
        buildingSelectForm: document.getElementById('building-select-form'),
        buildingSelectDorm: document.getElementById('building-select-dorm'),
        eventBannerContainer: document.getElementById('event-banner-container'),
        weatherCardContainer: document.getElementById('weather-card-container'),
        navEventCalendar: document.getElementById('nav-event-calendar'),
        navEventManage: document.getElementById('nav-event-manage'),
        navNotifications: document.getElementById('nav-notifications'),
        calendarMonthLabel: document.getElementById('calendar-month-label'),
        calendarPrevMonth: document.getElementById('calendar-prev-month'),
        calendarNextMonth: document.getElementById('calendar-next-month'),
        calendarGrid: document.getElementById('calendar-grid'),
        calendarSubscribeBtn: document.getElementById('calendar-subscribe-btn'),
        eventDetailModal: document.getElementById('event-detail-modal'),
        eventDetailDate: document.getElementById('event-detail-date'),
        eventDetailList: document.getElementById('event-detail-list'),
        eventDetailClose: document.getElementById('event-detail-close'),
        eventManageList: document.getElementById('event-manage-list'),
        eventAddBtn: document.getElementById('event-add-btn'),
        eventEditModal: document.getElementById('event-edit-modal'),
        eventEditForm: document.getElementById('event-edit-form'),
        eventEditId: document.getElementById('event-edit-id'),
        eventEditTitle: document.getElementById('event-edit-title'),
        eventEditDate: document.getElementById('event-edit-date'),
        eventEditType: document.getElementById('event-edit-type'),
        eventEditDesc: document.getElementById('event-edit-desc'),
        eventEditClose: document.getElementById('event-edit-close'),
        eventEditCancel: document.getElementById('event-edit-cancel'),
        subscribeModal: document.getElementById('subscribe-modal'),
        subscribeForm: document.getElementById('subscribe-form'),
        subscribeClose: document.getElementById('subscribe-close'),
        subscribeCancel: document.getElementById('subscribe-cancel'),
        subscribeTypePeak: document.getElementById('subscribe-type-peak'),
        subscribeTypePromotion: document.getElementById('subscribe-type-promotion'),
        subscribeTypeHoliday: document.getElementById('subscribe-type-holiday'),
        subscribeTypeOther: document.getElementById('subscribe-type-other'),
        notificationList: document.getElementById('notification-list'),
        notificationMarkAllBtn: document.getElementById('notification-mark-all-btn'),
        notificationUnreadCount: document.getElementById('notification-unread-count'),
        msgConversationList: document.getElementById('msg-conversation-list'),
        msgSearchInput: document.getElementById('msg-search-input'),
        msgEmptyState: document.getElementById('msg-empty-state'),
        msgChat: document.getElementById('msg-chat'),
        msgChatMessages: document.getElementById('msg-chat-messages'),
        msgChatName: document.getElementById('msg-chat-name'),
        msgChatAvatar: document.getElementById('msg-chat-avatar'),
        msgInput: document.getElementById('msg-input'),
        msgSendBtn: document.getElementById('msg-send-btn'),
        msgBackBtn: document.getElementById('msg-back-btn'),
        msgUnreadCount: document.getElementById('msg-unread-count'),
        msgSidebar: document.getElementById('msg-sidebar'),
        navDataDashboard: document.getElementById('nav-data-dashboard'),
        statTotalUsers: document.getElementById('stat-total-users'),
        statTotalOrders: document.getElementById('stat-total-orders'),
        statTodayUsers: document.getElementById('stat-today-users'),
        statTodayOrders: document.getElementById('stat-today-orders'),
        statusBarChart: document.getElementById('status-bar-chart'),
        trendLineChart: document.getElementById('trend-line-chart')
    };

    function showToast(msg) {
        const t = elements.toast;
        t.textContent = msg;
        t.classList.remove('hidden');
        setTimeout(() => t.classList.add('hidden'), 3000);
    }

    Orders.init({
        elements,
        showToast,
        openChatWith: (u) => window.openChatWith(u),
        openRouteFromOrder: (o) => window.openRouteFromOrder(o),
        toggleBlacklist: (u, b) => window.toggleBlacklist(u, b)
    });

    // --- Authentication ---
    async function refreshUserInfo() {
        const user = AppState.getUser();
        if (!user) return;
        try {
            const { data } = await Api.getUser(user.username);
            if (data && data.username) {
                AppState.updateUser(data);
                updateCertBadges();
                updateAdminNav();
            }
        } catch (err) {
            console.error('Failed to refresh user info:', err);
        }
    }

    function updateCertBadges() {
        const user = AppState.getUser();
        const isCertified = user && user.certified === 'yes';
        if (elements.sidebarCertBadge) {
            elements.sidebarCertBadge.style.display = isCertified ? 'inline-flex' : 'none';
        }
        if (elements.profileCertBadge) {
            elements.profileCertBadge.style.display = isCertified ? 'inline-flex' : 'none';
        }
    }

    function updateAdminNav() {
        const isAdmin = AppState.isAdmin();
        if (elements.navCertAudit) {
            elements.navCertAudit.style.display = isAdmin ? 'flex' : 'none';
        }
        if (elements.navEventManage) {
            elements.navEventManage.style.display = isAdmin ? 'flex' : 'none';
        }
        if (elements.navDataDashboard) {
            elements.navDataDashboard.style.display = isAdmin ? 'flex' : 'none';
        }
    }

    function updateUIForLogin() {
        const user = AppState.getUser();
        if (user) {
            elements.authOverlay.classList.add('hidden');
            elements.mainApp.classList.remove('hidden');
            elements.displayName.textContent = user.realName;
            elements.displayMajor.textContent = user.major;
            elements.welcomeName.textContent = user.realName;
            const pkgCustomerDisp = document.getElementById('pkg-customer-disp');
            if (pkgCustomerDisp) pkgCustomerDisp.textContent = user.realName;

            updateCertBadges();
            updateAdminNav();
            refreshUserInfo();
            loadBlacklistCache();
            loadEventBanners();
            loadWeatherCard();
            updateMsgUnreadCount();

            document.querySelector('[data-tab="dashboard"]').click();
        } else {
            elements.authOverlay.classList.remove('hidden');
            elements.mainApp.classList.add('hidden');
        }
    }

    elements.tabLogin.onclick = () => {
        elements.loginForm.classList.remove('hidden');
        elements.registerForm.classList.add('hidden');
        elements.tabLogin.classList.add('active');
        elements.tabRegister.classList.remove('active');
    };

    elements.tabRegister.onclick = () => {
        elements.loginForm.classList.add('hidden');
        elements.registerForm.classList.remove('hidden');
        elements.tabLogin.classList.remove('active');
        elements.tabRegister.classList.add('active');
    };

    elements.loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-user').value;
        const password = document.getElementById('login-pass').value;
        try {
            const { resp, data } = await Api.login(username, password);
            if (!resp.ok) {
                showToast('账号或密码错误');
                return;
            }
            if (data.status === 'success') {
                AppState.setUser(data);
                updateUIForLogin();
                showToast('登录成功！');
                elements.loginForm.reset();
            } else {
                showToast('账号或密码错误');
            }
        } catch (err) { showToast('服务器连接失败'); }
    };

    elements.registerForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            username: document.getElementById('reg-user').value,
            password: document.getElementById('reg-pass').value,
            realName: document.getElementById('reg-name').value,
            major: document.getElementById('reg-major').value
        };
        try {
            const { resp, data } = await Api.register(payload);
            if (resp.ok && data.status === 'success') {
                AppState.setUser(data);
                updateUIForLogin();
                showToast('注册成功！');
                elements.registerForm.reset();
            } else {
                showToast(data.message || '注册失败');
            }
        } catch (err) { showToast('注册失败'); }
    };

    elements.logoutBtn.onclick = () => {
        AppState.setUser(null);
        elements.orderList.innerHTML = '';
        elements.myOrdersList.innerHTML = '';
        elements.loginForm.reset();
        elements.registerForm.reset();
        elements.tabLogin.click();
        updateUIForLogin();
    };

    // --- Navigation & Tabs ---
    elements.navItems.forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            elements.navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            elements.viewSections.forEach(v => v.classList.add('hidden'));
            document.getElementById(`${tab}-tab`).classList.remove('hidden');

            if (tab === 'dashboard') { Orders.fetchOrders(); loadEventBanners(); loadWeatherCard(); }
            if (tab === 'my-orders') Orders.fetchMyOrders();
            if (tab === 'profile') loadProfile();
            if (tab === 'cert-apply') loadCertApplyForm();
            if (tab === 'cert-record') loadCertRecords();
            if (tab === 'leaderboard') loadLeaderboard();
            if (tab === 'cert-audit') loadAuditList();
            if (tab === 'blacklist') loadBlacklist();
            if (tab === 'price-calc') loadPriceCalculator();
            if (tab === 'route-plan') loadRoutePlan();
            if (tab === 'mutual-aid') loadMutualAid();
            if (tab === 'event-calendar') loadEventCalendar();
            if (tab === 'event-manage') loadEventManage();
            if (tab === 'notifications') loadNotifications();
            if (tab === 'messages') loadMessages();
            if (tab === 'data-dashboard') loadDashboardStats('week');
        };
    });

    // --- Order Logic ---
    window.updateStatus = async (id, status) => {
        Orders.handleUpdateStatus(id, status);
    };

    function addCertBadgeToName(username, nameEl) {
        if (AppState.getUserCert(username)) {
            const badge = document.createElement('span');
            badge.className = 'cert-badge inline-badge';
            badge.innerHTML = '<i class="fas fa-check-circle"></i>';
            badge.title = '认证跑腿员';
            nameEl.parentNode.insertBefore(badge, nameEl.nextSibling);
        }
    }

    async function fetchUserCertStatus(username) {
        if (AppState.getUserCert(username) !== undefined) {
            return AppState.getUserCert(username);
        }
        try {
            const { data } = await Api.getUser(username);
            const isCertified = data.certified === 'yes';
            AppState.setUserCert(username, isCertified);
            return isCertified;
        } catch (err) {
            console.error('Failed to fetch user cert status:', err);
            return false;
        }
    }

    // Filter Logic
    elements.filterPills.forEach(pill => {
        pill.onclick = () => {
            elements.filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            let ds = pill.dataset.filter;
            AppState.setFilter((ds === '全部') ? '' : ds);
            Orders.fetchOrders();
        };
    });

    // My Orders Toggle
    elements.showCreated.onclick = () => {
        elements.showCreated.classList.add('active');
        elements.showAccepted.classList.remove('active');
        AppState.setMyOrdersView('created');
        Orders.fetchMyOrders();
    };
    elements.showAccepted.onclick = () => {
        elements.showAccepted.classList.add('active');
        elements.showCreated.classList.remove('active');
        AppState.setMyOrdersView('accepted');
        Orders.fetchMyOrders();
    };

    // Post Order
    elements.orderForm.onsubmit = async (e) => {
        e.preventDefault();
        const user = AppState.getUser();
        const payload = {
            package: document.getElementById('pkg-name').value,
            pickup: document.getElementById('pkg-pickup').value,
            delivery: document.getElementById('pkg-delivery').value,
            reward: document.getElementById('pkg-reward').value,
            size: document.getElementById('pkg-size').value,
            creator: user.username
        };
        try {
            const { resp } = await Api.createOrder(payload);
            if (resp.ok) {
                showToast('发布成功！');
                elements.orderForm.reset();
                document.querySelector('[data-tab="dashboard"]').click();
            } else {
                showToast('发布失败');
            }
        } catch (err) { showToast('发布失败'); }
    };

    // --- Profile ---
    async function loadProfile() {
        const user = AppState.getUser();
        elements.profileRealName.textContent = user.realName;
        elements.profileMajor.textContent = user.major;

        try {
            const { data: createdOrders } = await Api.getOrders({ creator: user.username });
            document.getElementById('stat-created').textContent = createdOrders.length;

            const { data: workerOrders } = await Api.getOrders({ worker: user.username });
            const completedCount = workerOrders.filter(o => o.status === 'completed').length;
            document.getElementById('stat-delivered').textContent = completedCount;

            document.getElementById('stat-credit').textContent = '98';
        } catch (err) {
            console.error('Failed to load profile stats:', err);
        }
    }

    elements.editProfileBtn.onclick = () => {
        const user = AppState.getUser();
        elements.editRealname.value = user.realName;
        elements.editMajor.value = user.major;
        const editDormBuilding = document.getElementById('edit-dorm-building');
        if (editDormBuilding) editDormBuilding.value = user.dormBuilding || '';
        elements.profileModal.classList.remove('hidden');
    };

    elements.accountSecBtn.onclick = () => {
        elements.editPassword.value = '';
        elements.securityModal.classList.remove('hidden');
    };

    elements.profileForm.onsubmit = async (e) => {
        e.preventDefault();
        const user = AppState.getUser();
        const editDormBuilding = document.getElementById('edit-dorm-building');
        const payload = {
            username: user.username,
            realName: elements.editRealname.value,
            major: elements.editMajor.value
        };
        if (editDormBuilding && editDormBuilding.value) {
            payload.dormBuilding = editDormBuilding.value;
        }
        try {
            const { resp } = await Api.updateProfile(payload);
            if (resp.ok) {
                AppState.updateUser({
                    realName: payload.realName,
                    major: payload.major,
                    ...(payload.dormBuilding ? { dormBuilding: payload.dormBuilding } : {})
                });
                loadProfile();
                updateUIForLogin();
                elements.profileModal.classList.add('hidden');
                showToast('个人资料修改成功！');
            }
        } catch (err) { showToast('修改失败'); }
    };

    elements.securityForm.onsubmit = async (e) => {
        e.preventDefault();
        const user = AppState.getUser();
        const payload = {
            username: user.username,
            password: elements.editPassword.value
        };
        try {
            const { resp } = await Api.updateProfile(payload);
            if (resp.ok) {
                elements.securityModal.classList.add('hidden');
                showToast('新密码修改成功，请重新登录');
                setTimeout(() => elements.logoutBtn.click(), 1500);
            }
        } catch (err) { showToast('修改失败'); }
    };

    // --- Certification ---
    elements.certEntryBtn.onclick = () => {
        document.querySelector('[data-tab="cert-apply"]').click();
    };

    async function loadCertApplyForm() {
        const user = AppState.getUser();
        elements.certForm.reset();
        elements.certAppId.value = '';

        try {
            const { data: apps } = await Api.getCertApps(user.username);

            if (apps && apps.length > 0) {
                const latestApp = apps.sort((a, b) => b.id - a.id)[0];
                if (latestApp.status === 'pending') {
                    elements.certStudentId.value = latestApp.studentId || '';
                    elements.certDorm.value = latestApp.dormBuilding || '';
                    elements.certPhone.value = latestApp.phone || '';
                    elements.certDescription.value = latestApp.description || '';
                    elements.certSubmitBtn.textContent = '申请审核中，请耐心等待';
                    elements.certSubmitBtn.disabled = true;
                    elements.certSubmitBtn.style.opacity = '0.6';
                    elements.certSubmitBtn.style.cursor = 'not-allowed';
                } else if (latestApp.status === 'approved') {
                    elements.certStudentId.value = latestApp.studentId || '';
                    elements.certDorm.value = latestApp.dormBuilding || '';
                    elements.certPhone.value = latestApp.phone || '';
                    elements.certDescription.value = latestApp.description || '';
                    elements.certSubmitBtn.textContent = '您已通过认证';
                    elements.certSubmitBtn.disabled = true;
                    elements.certSubmitBtn.style.opacity = '0.6';
                    elements.certSubmitBtn.style.cursor = 'not-allowed';
                } else if (latestApp.status === 'rejected') {
                    elements.certAppId.value = latestApp.id;
                    elements.certStudentId.value = latestApp.studentId || '';
                    elements.certDorm.value = latestApp.dormBuilding || '';
                    elements.certPhone.value = latestApp.phone || '';
                    elements.certDescription.value = latestApp.description || '';
                    elements.certSubmitBtn.textContent = '重新提交申请';
                    elements.certSubmitBtn.disabled = false;
                    elements.certSubmitBtn.style.opacity = '1';
                    elements.certSubmitBtn.style.cursor = 'pointer';
                }
            } else {
                elements.certSubmitBtn.textContent = '提交认证申请';
                elements.certSubmitBtn.disabled = false;
                elements.certSubmitBtn.style.opacity = '1';
                elements.certSubmitBtn.style.cursor = 'pointer';
            }
        } catch (err) {
            console.error('Failed to load cert apps:', err);
            elements.certSubmitBtn.textContent = '提交认证申请';
            elements.certSubmitBtn.disabled = false;
        }
    }

    elements.certForm.onsubmit = async (e) => {
        e.preventDefault();
        const user = AppState.getUser();
        const payload = {
            username: user.username,
            studentId: elements.certStudentId.value,
            dormBuilding: elements.certDorm.value,
            phone: elements.certPhone.value,
            description: elements.certDescription.value
        };
        if (elements.certAppId.value) {
            payload.id = parseInt(elements.certAppId.value);
        }

        try {
            const { resp, data } = await Api.submitCert(payload);
            if (resp.ok && data.status === 'success') {
                showToast('认证申请提交成功！');
                await refreshUserInfo();
                loadCertApplyForm();
            } else {
                showToast(data.message || '提交失败');
            }
        } catch (err) {
            showToast('提交失败');
        }
    };

    async function loadCertRecords() {
        const user = AppState.getUser();
        try {
            const { data: apps } = await Api.getCertApps(user.username);
            renderCertRecords(apps);
        } catch (err) {
            console.error('Failed to load cert records:', err);
            elements.certRecordList.innerHTML = '<div style="text-align: center; color: #64748b; padding: 40px;">加载失败</div>';
        }
    }

    function renderCertRecords(apps) {
        if (!apps || apps.length === 0) {
            elements.certRecordList.innerHTML = '<div style="text-align: center; color: #64748b; padding: 40px;">暂无认证记录</div>';
            return;
        }

        const sortedApps = apps.sort((a, b) => b.id - a.id);
        let html = '';

        sortedApps.forEach(app => {
            const statusMap = {
                'pending': { label: '审核中', icon: 'fa-clock', class: 'active' },
                'approved': { label: '已通过', icon: 'fa-check', class: 'success' },
                'rejected': { label: '已驳回', icon: 'fa-times', class: 'rejected' }
            };
            const status = statusMap[app.status] || statusMap.pending;

            html += `
                <div class="timeline-item ${status.class}">
                    <div class="timeline-dot"><i class="fas ${status.icon}"></i></div>
                    <div class="timeline-card">
                        <div class="timeline-header">
                            <span class="timeline-status">${status.label}</span>
                            <span class="timeline-time">${app.applyTime}</span>
                        </div>
                        <div class="timeline-detail">
                            <p><strong>学号：</strong>${app.studentId || '-'}</p>
                            <p><strong>宿舍楼栋：</strong>${app.dormBuilding || '-'}</p>
                            <p><strong>手机号：</strong>${app.phone || '-'}</p>
                            ${app.description ? `<p><strong>申请说明：</strong>${app.description}</p>` : ''}
                        </div>
                        ${app.auditTime ? `
                            <div class="timeline-opinion ${app.status}">
                                <p><strong>审核时间：</strong>${app.auditTime}</p>
                                <p><strong>审核人：</strong>${app.auditor || '-'}</p>
                                ${app.auditOpinion ? `<p><strong>审核意见：</strong>${app.auditOpinion}</p>` : ''}
                            </div>
                        ` : ''}
                        ${app.status === 'rejected' ? `
                            <div class="cert-record-actions">
                                <button class="btn-resubmit" data-action="resubmit-cert">重新提交申请</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        elements.certRecordList.innerHTML = html;

        elements.certRecordList.querySelectorAll('[data-action="resubmit-cert"]').forEach(btn => {
            btn.onclick = () => {
                document.querySelector('[data-tab="cert-apply"]').click();
            };
        });
    }

    window.resubmitCert = (appId) => {
        document.querySelector('[data-tab="cert-apply"]').click();
    };

    // --- Admin Audit ---
    elements.auditFilterPending.onclick = () => {
        AppState.setAuditFilter('pending');
        elements.auditFilterPending.classList.add('active');
        elements.auditFilterAll.classList.remove('active');
        loadAuditList();
    };

    elements.auditFilterAll.onclick = () => {
        AppState.setAuditFilter('');
        elements.auditFilterAll.classList.add('active');
        elements.auditFilterPending.classList.remove('active');
        loadAuditList();
    };

    async function loadAuditList() {
        try {
            const filter = AppState.getAuditFilter();
            const { data: apps } = filter
                ? await Api.getCertAppsByStatus(filter)
                : await Api.getCertApps();
            renderAuditList(apps);
        } catch (err) {
            console.error('Failed to load audit list:', err);
            elements.certAuditList.innerHTML = '<div style="text-align: center; color: #64748b; padding: 40px;">加载失败</div>';
        }
    }

    function renderAuditList(apps) {
        if (!apps || apps.length === 0) {
            elements.certAuditList.innerHTML = '<div style="text-align: center; color: #64748b; padding: 40px;">暂无认证申请</div>';
            return;
        }

        const sortedApps = apps.sort((a, b) => b.id - a.id);
        let html = '';

        const statusMap = {
            'pending': { label: '待审核', class: 'pending' },
            'approved': { label: '已通过', class: 'approved' },
            'rejected': { label: '已驳回', class: 'rejected' }
        };

        sortedApps.forEach(app => {
            const status = statusMap[app.status] || statusMap.pending;
            const initial = (app.realName || app.username || 'U').charAt(0).toUpperCase();

            html += `
                <div class="audit-card ${status.class}">
                    <div class="audit-header">
                        <div class="audit-user">
                            <div class="audit-avatar">${initial}</div>
                            <div class="audit-user-info">
                                <h3>${app.realName || app.username}</h3>
                                <p>@${app.username}</p>
                            </div>
                        </div>
                        <span class="audit-status-badge ${status.class}">${status.label}</span>
                    </div>
                    <div class="audit-details">
                        <div class="audit-detail-item">
                            <div class="label">学号</div>
                            <div class="value">${app.studentId || '-'}</div>
                        </div>
                        <div class="audit-detail-item">
                            <div class="label">宿舍楼栋</div>
                            <div class="value">${app.dormBuilding || '-'}</div>
                        </div>
                        <div class="audit-detail-item">
                            <div class="label">手机号</div>
                            <div class="value">${app.phone || '-'}</div>
                        </div>
                        <div class="audit-detail-item">
                            <div class="label">申请时间</div>
                            <div class="value">${app.applyTime || '-'}</div>
                        </div>
                    </div>
                    ${app.description ? `
                        <div class="audit-desc">
                            <strong>申请说明：</strong>${app.description}
                        </div>
                    ` : ''}
                    ${app.status === 'pending' ? `
                        <div class="audit-actions">
                            <button class="btn-approve" data-action="open-audit" data-app-id="${app.id}" data-audit-action="approve">
                                <i class="fas fa-check"></i> 通过
                            </button>
                            <button class="btn-reject" data-action="open-audit" data-app-id="${app.id}" data-audit-action="reject">
                                <i class="fas fa-times"></i> 驳回
                            </button>
                        </div>
                    ` : `
                        <div class="audit-footer">
                            <span>审核人：${app.auditor || '-'}</span>
                            <span>审核时间：${app.auditTime || '-'}</span>
                        </div>
                        ${app.auditOpinion ? `
                            <div class="timeline-opinion ${status.class}" style="margin-top: 10px;">
                                <strong>审核意见：</strong>${app.auditOpinion}
                            </div>
                        ` : ''}
                    `}
                </div>
            `;
        });

        elements.certAuditList.innerHTML = html;

        elements.certAuditList.querySelectorAll('[data-action="open-audit"]').forEach(btn => {
            btn.onclick = () => {
                openAuditModal(parseInt(btn.dataset.appId), btn.dataset.auditAction);
            };
        });
    }

    async function openAuditModal(appId, action) {
        elements.auditAppId.value = appId;
        elements.auditAction.value = action;
        elements.auditOpinion.value = '';

        try {
            const { data: apps } = await Api.getCertApps();
            const app = apps.find(a => a.id === appId);
            if (app) {
                const actionLabel = action === 'approve' ? '通过' : '驳回';
                elements.auditModal.querySelector('h2').innerHTML = `<i class="fas fa-user-check"></i> 认证审核 - ${actionLabel}`;
                elements.auditApplicantInfo.innerHTML = `
                    <p style="margin-bottom: 8px;"><strong>申请人：</strong>${app.realName || app.username}</p>
                    <p style="margin-bottom: 8px;"><strong>学号：</strong>${app.studentId || '-'}</p>
                    <p><strong>申请说明：</strong>${app.description || '无'}</p>
                `;
                elements.auditSubmitBtn.textContent = `确认${actionLabel}`;
                elements.auditSubmitBtn.style.background = action === 'approve' ? '#10b981' : '#ef4444';
            }
            elements.auditModal.classList.remove('hidden');
        } catch (err) {
            console.error('Failed to fetch app details:', err);
            elements.auditModal.classList.remove('hidden');
        }
    }

    window.openAuditModal = openAuditModal;

    elements.auditForm.onsubmit = async (e) => {
        e.preventDefault();
        const user = AppState.getUser();
        const payload = {
            id: parseInt(elements.auditAppId.value),
            action: elements.auditAction.value,
            auditor: user.username,
            opinion: elements.auditOpinion.value
        };

        try {
            const { resp, data } = await Api.auditCert(payload);
            if (resp.ok && data.status === 'success') {
                showToast('审核成功！');
                elements.auditModal.classList.add('hidden');
                loadAuditList();
                await refreshUserInfo();
            } else {
                showToast(data.message || '审核失败');
            }
        } catch (err) {
            showToast('审核失败');
        }
    };

    // --- Leaderboard ---
    async function loadLeaderboard() {
        try {
            const [{ data: orders }, { data: users }] = await Promise.all([
                Api.getOrders({ status: 'completed' }),
                Api.getUsers()
            ]);

            const workerStats = {};
            orders.forEach(order => {
                if (order.worker) {
                    if (!workerStats[order.worker]) {
                        workerStats[order.worker] = 0;
                    }
                    workerStats[order.worker]++;
                }
            });

            const leaderboard = users
                .filter(u => workerStats[u.username])
                .map(u => ({
                    ...u,
                    count: workerStats[u.username] || 0
                }))
                .sort((a, b) => b.count - a.count);

            renderLeaderboard(leaderboard);
        } catch (err) {
            console.error('Failed to load leaderboard:', err);
            document.getElementById('leaderboard-list').innerHTML = '<div style="text-align: center; color: #64748b; padding: 40px;">加载失败</div>';
        }
    }

    function renderLeaderboard(users) {
        const container = document.getElementById('leaderboard-list');
        const currentUser = AppState.getUser();
        if (!users || users.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #64748b; padding: 40px;">暂无排行数据</div>';
            return;
        }

        const frag = document.createDocumentFragment();
        users.forEach((user, index) => {
            const initial = (user.realName || user.username || 'U').charAt(0).toUpperCase();
            const isCertified = user.certified === 'yes';
            const isBlocked = AppState.isUserBlacklisted(user.username);
            const isCurrentUser = user.username === currentUser?.username;

            const item = document.createElement('div');
            item.className = 'leaderboard-item';

            item.innerHTML = `
                <div class="leaderboard-rank">${index + 1}</div>
                <div class="leaderboard-avatar">${initial}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">
                        <span>${user.realName || user.username}</span>
                        ${isCertified ? '<span class="cert-badge"><i class="fas fa-check-circle"></i> 已认证</span>' : ''}
                    </div>
                    <div class="leaderboard-major">${user.major || '-'}</div>
                </div>
                <div class="leaderboard-stats">
                    <div class="leaderboard-count">${user.count}</div>
                    <div class="leaderboard-label">完成单量</div>
                </div>
            `;

            if (!isCurrentUser) {
                const blockBtn = document.createElement('button');
                blockBtn.className = `block-action-btn ${isBlocked ? 'blocked' : ''}`;
                if (isBlocked) {
                    blockBtn.innerHTML = '<i class="fas fa-check"></i> 已拉黑';
                } else {
                    blockBtn.innerHTML = '<i class="fas fa-ban"></i> 拉黑';
                }
                blockBtn.onclick = () => {
                    window.toggleBlacklist(user.username, blockBtn);
                };
                item.appendChild(blockBtn);
            }

            frag.appendChild(item);
        });

        container.innerHTML = '';
        container.appendChild(frag);
    }

    // --- Blacklist ---
    async function loadBlacklistCache() {
        const user = AppState.getUser();
        if (!user) return;
        try {
            const { data: list } = await Api.getBlacklist(user.username);
            AppState.clearUserBlacklistCache();
            list.forEach(item => {
                AppState.setUserBlacklist(item.blocked, item);
            });
        } catch (err) {
            console.error('Failed to load blacklist cache:', err);
        }
    }

    async function loadBlacklist() {
        const user = AppState.getUser();
        if (!user) return;
        try {
            const { data: list } = await Api.getBlacklist(user.username);
            renderBlacklist(list);
        } catch (err) {
            console.error('Failed to load blacklist:', err);
            elements.blacklistList.innerHTML = '<div style="text-align: center; color: #64748b; padding: 40px;">加载失败</div>';
        }
    }

    function renderBlacklist(list) {
        if (!list || list.length === 0) {
            elements.blacklistList.innerHTML = '<div style="text-align: center; color: #64748b; padding: 40px;">暂无黑名单用户</div>';
            elements.blacklistCount.textContent = '共 0 人';
            return;
        }

        elements.blacklistCount.textContent = `共 ${list.length} 人`;

        const sortedList = list.sort((a, b) => b.id - a.id);
        const frag = document.createDocumentFragment();

        sortedList.forEach(item => {
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.blocked)}`;

            const blkItem = document.createElement('div');
            blkItem.className = 'blacklist-item';
            blkItem.dataset.username = item.blocked;

            blkItem.innerHTML = `
                <div class="blacklist-avatar">
                    <img src="${avatarUrl}" alt="${item.blocked}">
                </div>
                <div class="blacklist-info">
                    <div class="blacklist-name">
                        <span>${item.blockedRealName || item.blocked}</span>
                    </div>
                    <div class="blacklist-time">
                        <i class="fas fa-clock"></i> 拉黑时间：${item.createTime || '-'}
                    </div>
                </div>
            `;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'blacklist-remove-btn';
            removeBtn.innerHTML = '<i class="fas fa-user-plus"></i> 移出黑名单';
            removeBtn.onclick = () => {
                window.removeFromBlacklist(item.blocked, item.id, removeBtn);
            };
            blkItem.appendChild(removeBtn);

            frag.appendChild(blkItem);
        });

        elements.blacklistList.innerHTML = '';
        elements.blacklistList.appendChild(frag);
    }

    window.toggleBlacklist = async (username, btnEl) => {
        const user = AppState.getUser();
        if (!user) return;
        if (username === user.username) return;

        const isBlocked = AppState.isUserBlacklisted(username);

        try {
            if (isBlocked) {
                await removeFromBlacklist(username, null, btnEl);
            } else {
                await addToBlacklist(username, btnEl);
            }
        } catch (err) {
            showToast('操作失败，请重试');
        }
    };

    async function addToBlacklist(username, btnEl = null) {
        const user = AppState.getUser();
        if (!user) return;

        try {
            const { resp, data } = await Api.addToBlacklist(user.username, username);
            if (resp.ok && data.status === 'success') {
                AppState.setUserBlacklist(username, { id: data.id, blocked: username });
                showToast('已加入黑名单');
                if (btnEl) {
                    btnEl.classList.add('blocked');
                    btnEl.innerHTML = `<i class="fas fa-check"></i> 已拉黑`;
                }
                if (!document.getElementById('blacklist-tab').classList.contains('hidden')) {
                    loadBlacklist();
                }
            } else {
                showToast(data.message || '操作失败');
            }
        } catch (err) {
            showToast('操作失败');
            throw err;
        }
    }

    window.removeFromBlacklist = async (username, id = null, btnEl = null) => {
        const user = AppState.getUser();
        if (!user) return;

        try {
            const payload = { blocker: user.username, blocked: username };
            if (id) payload.id = id;

            const { resp, data } = await Api.removeFromBlacklist(payload);
            if (resp.ok && data.status === 'success') {
                AppState.setUserBlacklist(username, null);
                showToast('已移出黑名单');
                if (btnEl) {
                    btnEl.classList.remove('blocked');
                    btnEl.innerHTML = `<i class="fas fa-ban"></i> 加入黑名单`;
                }
                if (!document.getElementById('blacklist-tab').classList.contains('hidden')) {
                    loadBlacklist();
                }
                if (!document.getElementById('dashboard-tab').classList.contains('hidden')) {
                    Orders.fetchOrders();
                }
                if (!document.getElementById('leaderboard-tab').classList.contains('hidden')) {
                    loadLeaderboard();
                }
            } else {
                showToast(data.message || '操作失败');
            }
        } catch (err) {
            showToast('操作失败');
            throw err;
        }
    };

    // --- Price Calculator ---
    const STATION_COORDS = {
        '菜鸟驿站-南门': { x: 0, y: 0 },
        '顺丰速运-西门': { x: -2, y: 1 },
        '京东派-北区': { x: 1, y: 3 },
        '中通圆通-东门': { x: 3, y: 1 }
    };

    const DORM_COORDS = {
        '1号楼': { x: 0, y: 2 },
        '2号楼': { x: 0.5, y: 2.2 },
        '3号楼': { x: 1, y: 2.5 },
        '4号楼': { x: 1.5, y: 2.8 },
        '5号楼': { x: 2, y: 3 },
        '6号楼': { x: -0.5, y: 2.5 },
        '7号楼': { x: -1, y: 2.8 },
        '8号楼': { x: -1.5, y: 3.2 },
        '9号楼': { x: 0.5, y: 3.5 },
        '10号楼': { x: 1, y: 3.8 },
        '11号楼': { x: 1.5, y: 4 },
        '12号楼': { x: 2, y: 4.2 },
        '13号楼': { x: 2.5, y: 3.5 },
        '14号楼': { x: -1, y: 4 },
        '15号楼': { x: -2, y: 3.5 }
    };

    const SIZE_FEE = {
        small: { label: '小件', fee: 0 },
        medium: { label: '中件', fee: 0.5 },
        large: { label: '大件', fee: 1.5 },
        xlarge: { label: '超大件', fee: 3 }
    };

    const BASE_FEE = 3;
    const URGENCY_FEE = 1.5;
    const RAIN_FEE = 1;
    const MIN_PRICE = 2;
    const MAX_PRICE = 20;

    function calcDistance(pickup, delivery) {
        const p1 = STATION_COORDS[pickup] || { x: 0, y: 0 };
        const p2 = DORM_COORDS[delivery] || { x: 0, y: 0 };
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function distanceToFee(distance) {
        if (distance <= 1) return 0;
        if (distance <= 2) return 0.5;
        if (distance <= 3) return 1;
        if (distance <= 4) return 1.5;
        return 2;
    }

    function calculatePrice() {
        const pickup = elements.calcPickup.value;
        const delivery = elements.calcDelivery.value;
        const size = elements.calcSize.value;
        const isUrgent = elements.calcUrgent.checked;
        const isRain = elements.calcRain.checked;

        const distance = calcDistance(pickup, delivery);
        const distanceFee = distanceToFee(distance);
        const sizeFee = SIZE_FEE[size].fee;
        const urgentFee = isUrgent ? URGENCY_FEE : 0;
        const rainFee = isRain ? RAIN_FEE : 0;

        const total = BASE_FEE + distanceFee + sizeFee + urgentFee + rainFee;
        const clampedTotal = Math.max(MIN_PRICE, Math.min(MAX_PRICE, total));
        const rangeMin = Math.max(MIN_PRICE, clampedTotal - 1);
        const rangeMax = Math.min(MAX_PRICE, clampedTotal + 1);

        return {
            pickup, delivery, size, isUrgent, isRain,
            distance: distance.toFixed(1), distanceFee, sizeFee, urgentFee, rainFee,
            baseFee: BASE_FEE, total: clampedTotal,
            rangeMin: rangeMin.toFixed(2), rangeMax: rangeMax.toFixed(2)
        };
    }

    function updateCalcDisplay(result) {
        elements.calcDistanceInfo.textContent = `预估距离：约 ${result.distance} 校园单位 | 距离越远费用越高`;
        elements.calcRange.textContent = `¥${result.rangeMin} - ¥${result.rangeMax}`;
        elements.calcSuggested.textContent = result.total.toFixed(2);
        elements.calcBase.textContent = `¥${result.baseFee.toFixed(2)}`;
        elements.calcDistanceFee.textContent = `¥${result.distanceFee.toFixed(2)}`;
        elements.calcSizeFee.textContent = `¥${result.sizeFee.toFixed(2)}`;
        elements.calcUrgentRow.style.display = result.isUrgent ? 'flex' : 'none';
        elements.calcUrgentFee.textContent = `¥${result.urgentFee.toFixed(2)}`;
        elements.calcRainRow.style.display = result.isRain ? 'flex' : 'none';
        elements.calcRainFee.textContent = `¥${result.rainFee.toFixed(2)}`;
        elements.calcTotal.textContent = `¥${result.total.toFixed(2)}`;
        const percent = ((result.total - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
        elements.calcBarFill.style.width = `${percent}%`;
        elements.calcBarMarker.style.left = `${percent}%`;
    }

    function loadPriceCalculator() {
        updateCalcDisplay(calculatePrice());
        loadSavedSchemes();
    }

    if (elements.calcPickup) {
        [elements.calcPickup, elements.calcDelivery, elements.calcSize].forEach(el => {
            el.onchange = () => updateCalcDisplay(calculatePrice());
        });
        elements.calcUrgent.onchange = () => updateCalcDisplay(calculatePrice());
        elements.calcRain.onchange = () => updateCalcDisplay(calculatePrice());
    }

    function loadSavedSchemes() {
        const schemes = AppState.getSavedSchemes();

        if (schemes.length === 0) {
            elements.calcSavedList.innerHTML = `
                <div style="text-align: center; color: #94a3b8; padding: 30px; font-size: 0.9rem;">
                    暂无保存的方案
                </div>
            `;
            return;
        }

        const frag = document.createDocumentFragment();
        schemes.forEach((scheme, idx) => {
            const sizeLabel = SIZE_FEE[scheme.size]?.label || scheme.size;
            const card = document.createElement('div');
            card.className = 'saved-scheme-card';

            const header = document.createElement('div');
            header.className = 'saved-scheme-header';
            const nameSpan = document.createElement('span');
            nameSpan.className = 'saved-scheme-name';
            nameSpan.textContent = scheme.name;
            const delBtn = document.createElement('button');
            delBtn.className = 'saved-scheme-delete';
            delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            delBtn.onclick = (e) => { e.stopPropagation(); deleteSavedScheme(idx); };
            header.appendChild(nameSpan);
            header.appendChild(delBtn);

            const info = document.createElement('div');
            info.className = 'saved-scheme-info';
            info.innerHTML = `
                <div><i class="fas fa-store" style="width: 14px;"></i> ${scheme.pickup}</div>
                <div><i class="fas fa-home" style="width: 14px;"></i> ${scheme.delivery}</div>
                <div><i class="fas fa-box" style="width: 14px;"></i> ${sizeLabel}</div>
            `;

            const price = document.createElement('div');
            price.className = 'saved-scheme-price';
            let tagsHtml = '';
            if (scheme.isUrgent) tagsHtml += '<span class="saved-tag urgent">加急</span>';
            if (scheme.isRain) tagsHtml += '<span class="saved-tag rain">雨天</span>';
            price.innerHTML = `<span>¥${scheme.total.toFixed(2)}</span><div class="tags">${tagsHtml}</div>`;

            card.appendChild(header);
            card.appendChild(info);
            card.appendChild(price);
            card.onclick = () => applySavedScheme(idx);
            frag.appendChild(card);
        });
        elements.calcSavedList.innerHTML = '';
        elements.calcSavedList.appendChild(frag);
    }

    if (elements.calcSaveBtn) {
        elements.calcSaveBtn.onclick = () => {
            if (!AppState.getUser()) { showToast('请先登录'); return; }
            const result = calculatePrice();
            const schemeName = prompt('请输入方案名称（如：南门→13号楼常规）', '我的方案');
            if (!schemeName || !schemeName.trim()) return;
            const schemes = AppState.getSavedSchemes();
            schemes.unshift({ ...result, name: schemeName.trim(), createdAt: Date.now() });
            if (schemes.length > 10) schemes.pop();
            AppState.saveSchemes(schemes);
            loadSavedSchemes();
            showToast('方案已保存！');
        };
    }

    function applySavedScheme(idx) {
        if (!AppState.getUser()) return;
        const schemes = AppState.getSavedSchemes();
        const scheme = schemes[idx];
        if (!scheme) return;
        elements.calcPickup.value = scheme.pickup;
        elements.calcDelivery.value = scheme.delivery;
        elements.calcSize.value = scheme.size;
        elements.calcUrgent.checked = scheme.isUrgent;
        elements.calcRain.checked = scheme.isRain;
        updateCalcDisplay(calculatePrice());
        showToast('已应用方案');
    }

    window.applySavedScheme = applySavedScheme;

    function deleteSavedScheme(idx) {
        if (!AppState.getUser()) return;
        if (!confirm('确定删除该方案？')) return;
        const schemes = AppState.getSavedSchemes();
        schemes.splice(idx, 1);
        AppState.saveSchemes(schemes);
        loadSavedSchemes();
        showToast('已删除');
    }

    window.deleteSavedScheme = deleteSavedScheme;

    if (elements.calcApplyBtn) {
        elements.calcApplyBtn.onclick = () => {
            const result = calculatePrice();
            document.getElementById('pkg-pickup').value = result.pickup;
            document.getElementById('pkg-delivery').value = result.delivery;
            document.getElementById('pkg-reward').value = result.total.toFixed(2);
            document.getElementById('pkg-size').value = result.size;
            let pkgDesc = '';
            const sizeLabel = SIZE_FEE[result.size]?.label || '常规';
            pkgDesc += `${result.delivery.slice(0, -1)}${result.delivery.slice(-1)}${sizeLabel}包裹`;
            if (result.isUrgent) pkgDesc += '【加急】';
            if (result.isRain) pkgDesc += '【雨天】';
            document.getElementById('pkg-name').value = pkgDesc;
            document.querySelector('[data-tab="post-task"]').click();
            showToast('已带入发布表单，请确认后发布');
        };
    }

    // --- Route Planning ---
    const ROUTE_NODES = {
        '菜鸟驿站-南门': { x: 300, y: 370, type: 'station', label: '菜鸟驿站' },
        '顺丰速运-西门': { x: 60, y: 210, type: 'station', label: '顺丰速运' },
        '京东派-北区': { x: 280, y: 40, type: 'station', label: '京东派' },
        '中通圆通-东门': { x: 540, y: 210, type: 'station', label: '中通圆通' },
        '南门广场': { x: 300, y: 330, type: 'landmark', label: '南门广场', icon: 'fa-square' },
        '图书馆': { x: 300, y: 210, type: 'landmark', label: '图书馆', icon: 'fa-book' },
        '一食堂': { x: 170, y: 270, type: 'landmark', label: '第一食堂', icon: 'fa-utensils' },
        '二食堂': { x: 430, y: 270, type: 'landmark', label: '第二食堂', icon: 'fa-utensils' },
        '教学楼A': { x: 160, y: 150, type: 'landmark', label: '教学楼A', icon: 'fa-school' },
        '教学楼B': { x: 440, y: 150, type: 'landmark', label: '教学楼B', icon: 'fa-school' },
        '体育馆': { x: 90, y: 90, type: 'landmark', label: '体育馆', icon: 'fa-dumbbell' },
        '实验楼': { x: 510, y: 90, type: 'landmark', label: '实验楼', icon: 'fa-flask' },
        '北区广场': { x: 290, y: 80, type: 'landmark', label: '北区广场', icon: 'fa-tree' },
        '行政楼': { x: 300, y: 290, type: 'landmark', label: '行政楼', icon: 'fa-building' },
        '中心花园': { x: 240, y: 200, type: 'landmark', label: '中心花园', icon: 'fa-seedling' },
        '1号楼': { x: 200, y: 60, type: 'dorm', label: '1号楼' },
        '2号楼': { x: 230, y: 55, type: 'dorm', label: '2号楼' },
        '3号楼': { x: 260, y: 50, type: 'dorm', label: '3号楼' },
        '4号楼': { x: 320, y: 50, type: 'dorm', label: '4号楼' },
        '5号楼': { x: 350, y: 55, type: 'dorm', label: '5号楼' },
        '6号楼': { x: 380, y: 60, type: 'dorm', label: '6号楼' },
        '7号楼': { x: 150, y: 120, type: 'dorm', label: '7号楼' },
        '8号楼': { x: 120, y: 140, type: 'dorm', label: '8号楼' },
        '9号楼': { x: 450, y: 120, type: 'dorm', label: '9号楼' },
        '10号楼': { x: 480, y: 140, type: 'dorm', label: '10号楼' },
        '11号楼': { x: 200, y: 30, type: 'dorm', label: '11号楼' },
        '12号楼': { x: 400, y: 30, type: 'dorm', label: '12号楼' },
        '13号楼': { x: 410, y: 100, type: 'dorm', label: '13号楼' },
        '14号楼': { x: 190, y: 100, type: 'dorm', label: '14号楼' },
        '15号楼': { x: 350, y: 110, type: 'dorm', label: '15号楼' }
    };

    const ROUTE_EDGES = [
        { from: '菜鸟驿站-南门', to: '南门广场', distance: 80, stairs: 0 },
        { from: '南门广场', to: '行政楼', distance: 70, stairs: 0 },
        { from: '行政楼', to: '图书馆', distance: 120, stairs: 0 },
        { from: '南门广场', to: '二食堂', distance: 150, stairs: 0 },
        { from: '南门广场', to: '一食堂', distance: 150, stairs: 0 },
        { from: '顺丰速运-西门', to: '一食堂', distance: 120, stairs: 20 },
        { from: '一食堂', to: '中心花园', distance: 80, stairs: 0 },
        { from: '中心花园', to: '图书馆', distance: 70, stairs: 0 },
        { from: '中心花园', to: '教学楼A', distance: 100, stairs: 0 },
        { from: '一食堂', to: '教学楼A', distance: 130, stairs: 30 },
        { from: '教学楼A', to: '体育馆', distance: 90, stairs: 0 },
        { from: '体育馆', to: '14号楼', distance: 50, stairs: 0 },
        { from: '14号楼', to: '7号楼', distance: 40, stairs: 0 },
        { from: '7号楼', to: '8号楼', distance: 35, stairs: 0 },
        { from: '14号楼', to: '1号楼', distance: 60, stairs: 0 },
        { from: '1号楼', to: '2号楼', distance: 35, stairs: 0 },
        { from: '2号楼', to: '3号楼', distance: 35, stairs: 0 },
        { from: '3号楼', to: '北区广场', distance: 40, stairs: 0 },
        { from: '3号楼', to: '11号楼', distance: 70, stairs: 0 },
        { from: '中通圆通-东门', to: '二食堂', distance: 120, stairs: 20 },
        { from: '二食堂', to: '图书馆', distance: 100, stairs: 0 },
        { from: '二食堂', to: '教学楼B', distance: 130, stairs: 30 },
        { from: '图书馆', to: '教学楼B', distance: 100, stairs: 0 },
        { from: '教学楼B', to: '实验楼', distance: 90, stairs: 0 },
        { from: '实验楼', to: '9号楼', distance: 40, stairs: 0 },
        { from: '9号楼', to: '10号楼', distance: 40, stairs: 0 },
        { from: '9号楼', to: '13号楼', distance: 45, stairs: 0 },
        { from: '13号楼', to: '6号楼', distance: 50, stairs: 0 },
        { from: '6号楼', to: '5号楼', distance: 35, stairs: 0 },
        { from: '5号楼', to: '4号楼', distance: 35, stairs: 0 },
        { from: '4号楼', to: '北区广场', distance: 50, stairs: 0 },
        { from: '5号楼', to: '12号楼', distance: 60, stairs: 0 },
        { from: '京东派-北区', to: '北区广场', distance: 50, stairs: 0 },
        { from: '北区广场', to: '15号楼', distance: 40, stairs: 0 },
        { from: '15号楼', to: '13号楼', distance: 70, stairs: 0 },
        { from: '15号楼', to: '教学楼B', distance: 80, stairs: 15 },
        { from: '北区广场', to: '教学楼A', distance: 100, stairs: 15 },
        { from: '教学楼A', to: '教学楼B', distance: 180, stairs: 0 },
        { from: '图书馆', to: '15号楼', distance: 120, stairs: 0 }
    ];

    function buildAdjacencyList() {
        const adj = {};
        for (const node of Object.keys(ROUTE_NODES)) adj[node] = [];
        for (const edge of ROUTE_EDGES) {
            adj[edge.from].push({ to: edge.to, distance: edge.distance, stairs: edge.stairs });
            adj[edge.to].push({ to: edge.from, distance: edge.distance, stairs: edge.stairs });
        }
        return adj;
    }

    function dijkstra(start, end, weightType = 'distance') {
        const adj = buildAdjacencyList();
        const distances = {}; const prev = {}; const visited = new Set();
        for (const node of Object.keys(ROUTE_NODES)) { distances[node] = Infinity; prev[node] = null; }
        distances[start] = 0;
        const queue = [{ node: start, dist: 0 }];
        while (queue.length > 0) {
            queue.sort((a, b) => a.dist - b.dist);
            const { node: current } = queue.shift();
            if (visited.has(current)) continue;
            visited.add(current);
            if (current === end) break;
            for (const neighbor of adj[current]) {
                const weight = weightType === 'distance' ? neighbor.distance : (neighbor.stairs * 10 + neighbor.distance * 0.5);
                const alt = distances[current] + weight;
                if (alt < distances[neighbor.to]) {
                    distances[neighbor.to] = alt;
                    prev[neighbor.to] = { node: current, distance: neighbor.distance, stairs: neighbor.stairs };
                    queue.push({ node: neighbor.to, dist: alt });
                }
            }
        }
        const path = []; let totalDistance = 0; let totalStairs = 0; let current = end;
        while (current !== null && prev[current] !== undefined) {
            path.unshift(current);
            if (prev[current]) { totalDistance += prev[current].distance; totalStairs += prev[current].stairs; }
            current = prev[current] ? prev[current].node : null;
        }
        if (path.length > 0) path.unshift(start);
        return { path, distance: totalDistance, stairs: totalStairs };
    }

    const routeElements = {
        pickup: document.getElementById('route-pickup'),
        delivery: document.getElementById('route-delivery'),
        distance: document.getElementById('route-distance'),
        time: document.getElementById('route-time'),
        stairs: document.getElementById('route-stairs'),
        map: document.getElementById('route-map'),
        bgPaths: document.getElementById('route-bg-paths'),
        landmarks: document.getElementById('route-landmarks'),
        activePath: document.getElementById('route-active-path'),
        points: document.getElementById('route-points'),
        sections: document.getElementById('route-sections'),
        orderBadge: document.getElementById('route-order-badge'),
        orderName: document.getElementById('route-order-name'),
        orderStatus: document.getElementById('route-order-status')
    };

    const LANDMARK_ICONS = {
        dormitory: 'fas fa-bed',
        teaching: 'fas fa-graduation-cap',
        canteen: 'fas fa-utensils',
        library: 'fas fa-book',
        express: 'fas fa-box',
        shop: 'fas fa-shopping-bag',
        sports: 'fas fa-running',
        gate: 'fas fa-door-open',
        admin: 'fas fa-building'
    };

    function loadRoutePlan() {
        if (!routeElements.pickup || !routeElements.delivery) return;
        routeElements.pickup.innerHTML = '<option value="">ѡ�����</option>';
        routeElements.delivery.innerHTML = '<option value="">ѡ���յ�</option>';
        for (const node of Object.values(ROUTE_NODES)) {
            const opt1 = document.createElement('option');
            opt1.value = node.id;
            opt1.textContent = node.name;
            routeElements.pickup.appendChild(opt1);
            const opt2 = document.createElement('option');
            opt2.value = node.id;
            opt2.textContent = node.name;
            routeElements.delivery.appendChild(opt2);
        }
        const recalc = () => {
            const start = routeElements.pickup.value;
            const end = routeElements.delivery.value;
            if (!start || !end) {
                routeElements.distance.textContent = '--';
                routeElements.time.textContent = '--';
                routeElements.stairs.textContent = '--';
                if (routeElements.activePath) routeElements.activePath.setAttribute('d', '');
                if (routeElements.sections) routeElements.sections.innerHTML = '';
                return;
            }
            const adj = buildAdjacencyList();
            const result = dijkstra(adj, start, end, 'stairs');
            routeElements.distance.textContent = result.distance.toFixed(0) + ' m';
            routeElements.time.textContent = Math.ceil(result.distance / 80) + ' ����';
            routeElements.stairs.textContent = result.stairs > 0 ? result.stairs + ' ��' : '��';
            drawRoute(result.path);
            renderRouteSections(result.path, adj);
        };
        routeElements.pickup.onchange = recalc;
        routeElements.delivery.onchange = recalc;
        if (routeElements.map) {
            drawLandmarks();
            drawBackgroundEdges();
        }
        routeElements.orderBadge?.classList.add('hidden');
    }

    function drawLandmarks() {
        if (!routeElements.landmarks) return;
        routeElements.landmarks.innerHTML = '';
        for (const node of Object.values(ROUTE_NODES)) {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', '10');
            circle.setAttribute('fill', node.type === 'gate' ? '#f59e0b' : (node.type === 'dormitory' ? '#6366f1' : (node.type === 'teaching' ? '#0ea5e9' : '#10b981')));
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '2');
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('y', '4');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#fff');
            text.setAttribute('font-size', '10');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('font-family', 'Font Awesome 6 Free');
            text.textContent = getLandmarkIconChar(node.type);
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('y', '24');
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', '#475569');
            label.setAttribute('font-size', '10');
            label.textContent = node.name;
            g.appendChild(circle);
            g.appendChild(text);
            g.appendChild(label);
            routeElements.landmarks.appendChild(g);
        }
    }

    function getLandmarkIconChar(type) {
        const map = { dormitory: '\uf236', teaching: '\uf19d', canteen: '\uf2e7', library: '\uf02d', express: '\uf466', shop: '\uf290', sports: '\uf70c', gate: '\uf52b', admin: '\uf1ad' };
        return map[type] || '\uf041';
    }

    function drawBackgroundEdges() {
        if (!routeElements.bgPaths) return;
        routeElements.bgPaths.innerHTML = '';
        for (const edge of ROUTE_EDGES) {
            const a = ROUTE_NODES[edge.from];
            const b = ROUTE_NODES[edge.to];
            if (!a || !b) continue;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', a.x);
            line.setAttribute('y1', a.y);
            line.setAttribute('x2', b.x);
            line.setAttribute('y2', b.y);
            line.setAttribute('stroke', edge.stairs > 0 ? '#fbbf24' : '#cbd5e1');
            line.setAttribute('stroke-width', edge.stairs > 0 ? '2' : '1');
            line.setAttribute('stroke-dasharray', edge.stairs > 0 ? '4,4' : 'none');
            routeElements.bgPaths.appendChild(line);
        }
    }

    function drawRoute(path) {
        if (!routeElements.activePath || path.length < 2) {
            if (routeElements.activePath) routeElements.activePath.setAttribute('d', '');
            if (routeElements.points) routeElements.points.innerHTML = '';
            return;
        }
        let d = '';
        for (let i = 0; i < path.length; i++) {
            const node = ROUTE_NODES[path[i]];
            if (!node) continue;
            d += (i === 0 ? 'M' : 'L') + node.x + ',' + node.y + ' ';
        }
        routeElements.activePath.setAttribute('d', d.trim());
        routeElements.points.innerHTML = '';
        for (let i = 0; i < path.length; i++) {
            const node = ROUTE_NODES[path[i]];
            if (!node) continue;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', i === 0 || i === path.length - 1 ? '7' : '4');
            circle.setAttribute('fill', i === 0 ? '#10b981' : (i === path.length - 1 ? '#ef4444' : '#6366f1'));
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '2');
            routeElements.points.appendChild(circle);
        }
    }

    function renderRouteSections(path, adj) {
        if (!routeElements.sections) return;
        routeElements.sections.innerHTML = '';
        if (path.length < 2) return;
        for (let i = 0; i < path.length - 1; i++) {
            const from = ROUTE_NODES[path[i]];
            const to = ROUTE_NODES[path[i + 1]];
            if (!from || !to) continue;
            const edge = adj[path[i]].find(n => n.to === path[i + 1]);
            const item = document.createElement('div');
            item.className = 'route-section-item';
            const arrow = edge && edge.stairs > 0 ? '<i class="fas fa-stairs" style="color:#f59e0b"></i>' : '<i class="fas fa-walking" style="color:#6366f1"></i>';
            item.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:0.9rem;">${arrow}</span>
                    <span style="font-size:0.85rem;font-weight:500;">${from.name} �� ${to.name}</span>
                </div>
                <div style="font-size:0.75rem;color:#64748b;">${edge ? edge.distance : 0}m${edge && edge.stairs > 0 ? ' �� Լ' + edge.stairs + '��' : ''}</div>
            `;
            routeElements.sections.appendChild(item);
        }
    }

    window.openRouteFromOrder = (order) => {
        if (!routeElements.pickup || !routeElements.delivery) {
            elements.navItems.forEach(i => i.classList.remove('active'));
            const routeNav = Array.from(elements.navItems).find(i => i.dataset.tab === 'route-plan');
            routeNav?.classList.add('active');
            elements.viewSections.forEach(v => v.classList.add('hidden'));
            document.getElementById('route-plan-tab').classList.remove('hidden');
            loadRoutePlan();
        }
        const building = order.building || '';
        const dest = order.destination || '';
        const pickupNode = findNodeByNameOrBuilding(building);
        const deliveryNode = findNodeByNameOrBuilding(dest);
        if (pickupNode) routeElements.pickup.value = pickupNode;
        if (deliveryNode) routeElements.delivery.value = deliveryNode;
        if (routeElements.orderBadge) {
            routeElements.orderBadge.classList.remove('hidden');
            routeElements.orderBadge.innerHTML = `
                <i class="fas fa-route"></i> ���Զ��� #${order.id}
                <span class="close-x" onclick="document.getElementById('route-order-badge').classList.add('hidden')">&times;</span>
            `;
        }
        if (routeElements.orderName) routeElements.orderName.textContent = order.item || '';
        if (routeElements.orderStatus) {
            const statusMap = { posted: '���ӵ�', accepted: '���ʹ�', delivered: '��ȷ��', completed: '�����', cancelled: '��ȡ��' };
            routeElements.orderStatus.textContent = statusMap[order.status] || order.status;
            routeElements.orderStatus.className = 'status-badge status-' + (order.status || 'posted');
        }
        routeElements.pickup.dispatchEvent(new Event('change'));
        elements.navItems.forEach(i => i.classList.remove('active'));
        const routeNav = Array.from(elements.navItems).find(i => i.dataset.tab === 'route-plan');
        routeNav?.classList.add('active');
        elements.viewSections.forEach(v => v.classList.add('hidden'));
        document.getElementById('route-plan-tab').classList.remove('hidden');
    };

    function findNodeByNameOrBuilding(name) {
        if (!name) return null;
        for (const node of Object.values(ROUTE_NODES)) {
            if (node.name === name || name.includes(node.name) || node.name.includes(name)) return node.id;
        }
        return null;
    }

    // --- Mutual Aid ---
    async function loadMutualAid() {
        const mutualAidList = document.getElementById('mutual-aid-list');
        if (!mutualAidList) return;
        try {
            await Orders.fetchMutualAidOrders();
        } catch (err) {
            console.error('Failed to load mutual aid:', err);
            if (mutualAidList) mutualAidList.innerHTML = '<p style="color:#ef4444;padding:20px;text-align:center;">���ػ�������ʧ��</p>';
        }
    }

    // --- Event Calendar ---
    function loadEventCalendar() {
        const calendarEl = document.getElementById('event-calendar');
        const eventListEl = document.getElementById('event-day-list');
        if (!calendarEl) return;
        const today = AppState.getCurrentCalendarDate() || new Date();
        AppState.setCurrentCalendarDate(today);
        renderCalendar(today);
        renderEventsForDate(today);
        const prevBtn = document.getElementById('cal-prev');
        const nextBtn = document.getElementById('cal-next');
        const todayBtn = document.getElementById('cal-today');
        if (prevBtn) prevBtn.onclick = () => {
            const d = AppState.getCurrentCalendarDate();
            d.setMonth(d.getMonth() - 1);
            AppState.setCurrentCalendarDate(new Date(d));
            renderCalendar(AppState.getCurrentCalendarDate());
        };
        if (nextBtn) nextBtn.onclick = () => {
            const d = AppState.getCurrentCalendarDate();
            d.setMonth(d.getMonth() + 1);
            AppState.setCurrentCalendarDate(new Date(d));
            renderCalendar(AppState.getCurrentCalendarDate());
        };
        if (todayBtn) todayBtn.onclick = () => {
            AppState.setCurrentCalendarDate(new Date());
            renderCalendar(AppState.getCurrentCalendarDate());
            renderEventsForDate(AppState.getCurrentCalendarDate());
        };
        loadAllEvents();
    }

    async function loadAllEvents() {
        try {
            const { data } = await Api.getEvents();
            AppState.setAllEvents(data || []);
            renderCalendar(AppState.getCurrentCalendarDate());
            renderEventsForDate(AppState.getCurrentCalendarDate());
        } catch (err) {
            console.error('Failed to load events:', err);
        }
    }

    function renderCalendar(date) {
        const calendarEl = document.getElementById('event-calendar');
        if (!calendarEl) return;
        const year = date.getFullYear();
        const month = date.getMonth();
        document.getElementById('cal-title').textContent = year + ' �� ' + (month + 1) + ' ��';
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startWeekday = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        const today = new Date();
        const todayStr = formatDateStr(today);
        let html = '<div class="cal-weekday">��</div><div class="cal-weekday">һ</div><div class="cal-weekday">��</div><div class="cal-weekday">��</div><div class="cal-weekday">��</div><div class="cal-weekday">��</div><div class="cal-weekday">��</div>';
        for (let i = 0; i < startWeekday; i++) html += '<div class="cal-day cal-empty"></div>';
        const events = AppState.getAllEvents() || [];
        for (let d = 1; d <= daysInMonth; d++) {
            const curDate = new Date(year, month, d);
            const dStr = formatDateStr(curDate);
            const dayEvents = events.filter(e => e.date === dStr);
            const isToday = dStr === todayStr;
            const hasEvents = dayEvents.length > 0;
            let cls = 'cal-day';
            if (isToday) cls += ' cal-today';
            if (hasEvents) cls += ' cal-has-event';
            html += `<div class="${cls}" data-date="${dStr}"><div class="cal-num">${d}</div>${hasEvents ? `<div class="cal-dot" title="${dayEvents.length}���"></div>` : ''}</div>`;
        }
        calendarEl.innerHTML = html;
        calendarEl.querySelectorAll('.cal-day[data-date]').forEach(el => {
            el.onclick = () => {
                const [y, m, day] = el.dataset.date.split('-').map(Number);
                AppState.setCurrentCalendarDate(new Date(y, m - 1, day));
                renderEventsForDate(AppState.getCurrentCalendarDate());
            };
        });
    }

    function formatDateStr(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function renderEventsForDate(date) {
        const eventListEl = document.getElementById('event-day-list');
        if (!eventListEl) return;
        const dStr = formatDateStr(date);
        const events = (AppState.getAllEvents() || []).filter(e => e.date === dStr);
        if (events.length === 0) {
            eventListEl.innerHTML = '<p style="color:#64748b;padding:20px;text-align:center;">�������޻</p>';
            return;
        }
        const frag = document.createDocumentFragment();
        for (const ev of events) {
            const card = document.createElement('div');
            card.className = 'event-card';
            const typeColors = { academic: '#3b82f6', cultural: '#a855f7', sports: '#f59e0b', volunteer: '#10b981', other: '#6b7280' };
            const typeLabels = { academic: 'ѧ��', cultural: '����', sports: '����', volunteer: '־Ը', other: '����' };
            card.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                        <h4 style="margin:0 0 8px;font-size:1rem;color:#0f172a;">${ev.title}</h4>
                        <p style="margin:4px 0;font-size:0.85rem;color:#475569;"><i class="fas fa-clock" style="color:#6366f1;"></i> ${ev.time || '--'}</p>
                        <p style="margin:4px 0;font-size:0.85rem;color:#475569;"><i class="fas fa-map-marker-alt" style="color:#ef4444;"></i> ${ev.location || '--'}</p>
                        <p style="margin:4px 0;font-size:0.85rem;color:#475569;"><i class="fas fa-user" style="color:#10b981;"></i> ${ev.organizer || '--'}</p>
                        ${ev.description ? `<p style="margin:8px 0 0;font-size:0.8rem;color:#64748b;">${ev.description}</p>` : ''}
                    </div>
                    <span class="event-type-tag" style="background:${typeColors[ev.type] || '#6b7280'}">${typeLabels[ev.type] || '����'}</span>
                </div>
            `;
            frag.appendChild(card);
        }
        eventListEl.innerHTML = '';
        eventListEl.appendChild(frag);
    }

    // --- Event Management (Admin) ---
    async function loadEventManage() {
        const eventManageList = document.getElementById('event-manage-list');
        if (!eventManageList) return;
        const user = AppState.getUser();
        if (!AppState.isAdmin()) {
            eventManageList.innerHTML = '<p style="color:#ef4444;padding:20px;text-align:center;">������Ա�ɷ���</p>';
            return;
        }
        try {
            const { data } = await Api.getEvents();
            if (!data || data.length === 0) {
                eventManageList.innerHTML = '<p style="color:#64748b;padding:20px;text-align:center;">���޻</p>';
                return;
            }
            const typeLabels = { academic: 'ѧ��', cultural: '����', sports: '����', volunteer: '־Ը', other: '����' };
            const frag = document.createDocumentFragment();
            for (const ev of data) {
                const card = document.createElement('div');
                card.className = 'event-card';
                const delBtn = document.createElement('button');
                delBtn.className = 'btn-danger btn-small';
                delBtn.style.marginLeft = '8px';
                delBtn.innerHTML = '<i class="fas fa-trash"></i> ɾ��';
                delBtn.onclick = async () => {
                    if (!confirm('ȷ��ɾ���û��')) return;
                    try {
                        await Api.deleteEvent(ev.id);
                        showToast('���ɾ��');
                        loadEventManage();
                    } catch (err) { showToast('ɾ��ʧ��'); }
                };
                card.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                        <div>
                            <h4 style="margin:0 0 8px;font-size:1rem;color:#0f172a;">${ev.title}</h4>
                            <p style="margin:4px 0;font-size:0.85rem;color:#475569;">?? ${ev.date} ${ev.time || ''}</p>
                            <p style="margin:4px 0;font-size:0.85rem;color:#475569;">?? ${ev.location || '--'}</p>
                            <p style="margin:4px 0;font-size:0.85rem;color:#475569;">?? ${ev.organizer || '--'}</p>
                            <span class="event-type-tag">${typeLabels[ev.type] || '����'}</span>
                        </div>
                    </div>
                `;
                const btnWrap = document.createElement('div');
                btnWrap.style.marginTop = '12px';
                btnWrap.appendChild(delBtn);
                card.appendChild(btnWrap);
                frag.appendChild(card);
            }
            eventManageList.innerHTML = '';
            eventManageList.appendChild(frag);
        } catch (err) {
            eventManageList.innerHTML = '<p style="color:#ef4444;padding:20px;text-align:center;">����ʧ��</p>';
        }
    }

    // --- Subscription Modal ---
    async function openSubscribeModal() {
        const modal = document.getElementById('subscribe-modal');
        const listEl = document.getElementById('subscribe-types-list');
        if (!modal || !listEl) return;
        modal.classList.remove('hidden');
        const user = AppState.getUser();
        if (!user) return;
        try {
            const { data: subs } = await Api.getSubscriptions(user.username);
            AppState.setUserSubscriptions(subs || []);
            const types = [
                { key: 'academic', label: 'ѧ������', icon: 'fa-graduation-cap' },
                { key: 'cultural', label: '�����ݳ�', icon: 'fa-palette' },
                { key: 'sports', label: '��������', icon: 'fa-running' },
                { key: 'volunteer', label: '־Ը����', icon: 'fa-hands-helping' },
                { key: 'other', label: '�����', icon: 'fa-star' }
            ];
            listEl.innerHTML = '';
            const frag = document.createDocumentFragment();
            for (const t of types) {
                const subscribed = AppState.isUserSubscribedToType(t.key);
                const item = document.createElement('label');
                item.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px;background:#f8fafc;border-radius:8px;cursor:pointer;margin-bottom:8px;';
                item.innerHTML = `
                    <input type="checkbox" value="${t.key}" ${subscribed ? 'checked' : ''} style="width:18px;height:18px;">
                    <i class="fas ${t.icon}" style="color:#6366f1;width:20px;"></i>
                    <span style="font-size:0.95rem;">${t.label}</span>
                `;
                frag.appendChild(item);
            }
            listEl.appendChild(frag);
        } catch (err) { console.error(err); }
    }

    document.addEventListener('click', (e) => {
        if (e.target.id === 'open-subscribe-btn') openSubscribeModal();
        if (e.target.id === 'save-subscribe-btn') saveSubscriptions();
    });

    async function saveSubscriptions() {
        const user = AppState.getUser();
        if (!user) return;
        const checks = document.querySelectorAll('#subscribe-types-list input[type="checkbox"]');
        const selected = Array.from(checks).filter(c => c.checked).map(c => c.value);
        try {
            const { data: subs } = await Api.getSubscriptions(user.username);
            const current = (subs || []).map(s => s.event_type);
            for (const type of selected) {
                if (!current.includes(type)) {
                    await Api.subscribe(user.username, type);
                }
            }
            for (const type of current) {
                if (!selected.includes(type)) {
                    await Api.unsubscribe(user.username, type);
                }
            }
            const { data: newSubs } = await Api.getSubscriptions(user.username);
            AppState.setUserSubscriptions(newSubs || []);
            showToast('�����ѱ���');
            document.getElementById('subscribe-modal')?.classList.add('hidden');
        } catch (err) {
            showToast('����ʧ��');
        }
    }

    // --- Notifications ---
    async function loadNotifications() {
        const listEl = document.getElementById('notifications-list');
        const badgeEl = document.getElementById('notif-badge');
        if (!listEl) return;
        const user = AppState.getUser();
        if (!user) return;
        try {
            const { data } = await Api.getNotifications(user.username);
            if (!data || data.length === 0) {
                listEl.innerHTML = '<p style="color:#64748b;padding:20px;text-align:center;">����֪ͨ</p>';
                if (badgeEl) badgeEl.classList.add('hidden');
                return;
            }
            const unread = data.filter(n => n.is_read !== 1).length;
            if (badgeEl) {
                if (unread > 0) {
                    badgeEl.classList.remove('hidden');
                    badgeEl.textContent = unread > 9 ? '9+' : unread;
                } else badgeEl.classList.add('hidden');
            }
            const frag = document.createDocumentFragment();
            for (const n of data) {
                const item = document.createElement('div');
                item.className = 'notification-item';
                if (n.is_read !== 1) item.style.background = '#eff6ff';
                const iconMap = { event: 'fa-calendar-alt', order: 'fa-box', system: 'fa-bell' };
                item.innerHTML = `
                    <div style="display:flex;align-items:flex-start;gap:10px;">
                        <div class="notif-icon" style="background:${n.type === 'event' ? '#6366f1' : (n.type === 'order' ? '#10b981' : '#f59e0b')}">
                            <i class="fas ${iconMap[n.type] || 'fa-bell'}"></i>
                        </div>
                        <div style="flex:1;">
                            <div style="font-size:0.9rem;font-weight:500;color:#0f172a;margin-bottom:4px;">${n.title || '֪ͨ'}</div>
                            ${n.content ? `<div style="font-size:0.8rem;color:#475569;">${n.content}</div>` : ''}
                            <div style="font-size:0.7rem;color:#94a3b8;margin-top:4px;">${n.created_at || ''}</div>
                        </div>
                        ${n.is_read !== 1 ? '<span class="unread-dot"></span>' : ''}
                    </div>
                `;
                if (n.is_read !== 1) {
                    item.onclick = async () => {
                        try {
                            await Api.markNotificationRead(n.id, user.username);
                            item.style.background = '';
                            item.querySelector('.unread-dot')?.remove();
                            const curCount = parseInt(badgeEl?.textContent || '0');
                            if (curCount > 1) badgeEl.textContent = curCount - 1;
                            else badgeEl?.classList.add('hidden');
                        } catch (e) { /* ignore */ }
                    };
                }
                frag.appendChild(item);
            }
            listEl.innerHTML = '';
            listEl.appendChild(frag);
        } catch (err) {
            listEl.innerHTML = '<p style="color:#ef4444;padding:20px;text-align:center;">����ʧ��</p>';
        }
    }

    // --- Weather Card ---
    async function loadWeatherCard() {
        const card = document.getElementById('weather-card');
        if (!card) return;
        try {
            const { data } = await Api.getWeather();
            if (!data) return;
            AppState.setCurrentWeather(data);
            const weatherIcons = { '��': 'fa-sun', '����': 'fa-cloud-sun', '��': 'fa-cloud', 'С��': 'fa-cloud-rain', '����': 'fa-cloud-showers-heavy', '����': 'fa-cloud-showers-heavy', '������': 'fa-bolt' };
            const tips = [];
            if (parseInt(data.temperature) > 30) tips.push('?? ����ע�����');
            if (parseInt(data.temperature) < 5) tips.push('?? ��������ע�Ᵽů');
            if (data.weather.includes('��')) tips.push('? �ǵô�ɡ');
            if (data.wind.includes('6��') || data.wind.includes('7��') || data.wind.includes('8��')) tips.push('?? ���ע�ⰲȫ');
            card.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;" id="weather-toggle">
                    <div>
                        <div style="font-size:1.5rem;font-weight:bold;color:#0f172a;">
                            <i class="fas ${weatherIcons[data.weather] || 'fa-cloud'}"></i> ${data.temperature}��C ${data.weather}
                        </div>
                        <div style="font-size:0.8rem;color:#64748b;margin-top:4px;">${data.wind} �� ${data.humidity || ''}</div>
                    </div>
                    <i class="fas fa-chevron-up" style="color:#94a3b8;" id="weather-chevron"></i>
                </div>
                <div id="weather-detail" style="${AppState.getWeatherCollapsed() ? 'display:none;' : 'display:block;'}margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.8rem;color:#475569;">
                        <div><i class="fas fa-thermometer-half" style="color:#ef4444;"></i> ��� ${data.feels_like || data.temperature}��C</div>
                        <div><i class="fas fa-tint" style="color:#3b82f6;"></i> ʪ�� ${data.humidity || '--'}</div>
                        <div><i class="fas fa-wind" style="color:#06b6d4;"></i> ${data.wind || '--'}</div>
                        <div><i class="fas fa-eye" style="color:#8b5cf6;"></i> �ܼ��� ${data.visibility || '--'}</div>
                    </div>
                    ${tips.length > 0 ? `<div style="margin-top:10px;padding:8px;background:#fef3c7;border-radius:6px;font-size:0.8rem;color:#92400e;">${tips.join(' �� ')}</div>` : ''}
                </div>
            `;
            const toggle = document.getElementById('weather-toggle');
            const chevron = document.getElementById('weather-chevron');
            const detail = document.getElementById('weather-detail');
            if (toggle) toggle.onclick = () => {
                const collapsed = AppState.toggleWeatherCollapsed();
                if (detail) detail.style.display = collapsed ? 'none' : 'block';
                if (chevron) {
                    chevron.className = collapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
                    chevron.style.color = '#94a3b8';
                }
            };
        } catch (err) { console.error('Weather load failed:', err); }
    }

    // --- Package Size Guide ---
    const packageGuideBtn = document.getElementById('pkg-guide-btn');
    const packageGuideModal = document.getElementById('pkg-guide-modal');
    if (packageGuideBtn) packageGuideBtn.onclick = () => packageGuideModal?.classList.remove('hidden');
    const closeGuideBtns = document.querySelectorAll('.close-guide, [data-close-guide]');
    closeGuideBtns.forEach(b => b.onclick = () => packageGuideModal?.classList.add('hidden'));

    // --- Private Messaging ---
    let msgPollInterval = null;

    async function loadMessages() {
        const convList = document.getElementById('msg-conversations');
        const threadArea = document.getElementById('msg-thread');
        if (!convList) return;
        const user = AppState.getUser();
        if (!user) return;
        try {
            const { data } = await Api.getConversations(user.username);
            if (!data || data.length === 0) {
                convList.innerHTML = '<p style="color:#64748b;padding:20px;text-align:center;">���޶Ի������������Ƭ˽�ſ�ʼ����</p>';
                return;
            }
            convList.innerHTML = '';
            const frag = document.createDocumentFragment();
            for (const c of data) {
                const item = document.createElement('div');
                item.className = 'msg-conv-item';
                const peer = c.participant_1 === user.username ? c.participant_2 : c.participant_1;
                item.dataset.peer = peer;
                item.dataset.threadId = c.thread_id;
                const isActive = AppState.getCurrentMsgPeer() === peer;
                if (isActive) item.classList.add('active');
                const unread = (c.unread_count || 0) > 0;
                item.innerHTML = '<div style="display:flex;align-items:center;gap:10px;"><div class="msg-avatar">' + (peer[0]?.toUpperCase() || '?') + '</div><div style="flex:1;"><div style="font-size:0.9rem;font-weight:500;color:#0f172a;">' + peer + '</div><div style="font-size:0.75rem;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px;">' + (c.last_message || '��ʼ����') + '</div></div>' + (unread ? '<span class="unread-badge">' + c.unread_count + '</span>' : '') + '</div>';
                item.onclick = () => openThread(peer, c.thread_id);
                frag.appendChild(item);
            }
            convList.appendChild(frag);
            if (!AppState.getCurrentMsgPeer() && data.length > 0) {
                const first = data[0];
                const firstPeer = first.participant_1 === user.username ? first.participant_2 : first.participant_1;
                openThread(firstPeer, first.thread_id);
            }
        } catch (err) {
            convList.innerHTML = '<p style="color:#ef4444;padding:20px;text-align:center;">����ʧ��</p>';
        }
        if (!msgPollInterval) {
            msgPollInterval = setInterval(pollUnreadMsg, 30000);
            AppState.setMsgPollInterval(msgPollInterval);
        }
    }

    async function pollUnreadMsg() {
        const user = AppState.getUser();
        if (!user) return;
        try {
            const { data } = await Api.getUnreadMsgCount(user.username);
            const badge = document.getElementById('msg-badge');
            if (badge) {
                const cnt = data?.total || 0;
                if (cnt > 0) {
                    badge.classList.remove('hidden');
                    badge.textContent = cnt > 9 ? '9+' : cnt;
                } else badge.classList.add('hidden');
            }
        } catch (e) { /* ignore */ }
    }

    window.openChatWith = async (peer) => {
        if (!peer) return;
        elements.navItems.forEach(i => i.classList.remove('active'));
        const msgNav = Array.from(elements.navItems).find(i => i.dataset.tab === 'messages');
        msgNav?.classList.add('active');
        elements.viewSections.forEach(v => v.classList.add('hidden'));
        document.getElementById('messages-tab')?.classList.remove('hidden');
        const user = AppState.getUser();
        if (!user) return;
        try {
            const { data: convs } = await Api.getConversations(user.username);
            let threadId = null;
            const existing = convs?.find(c =>
                (c.participant_1 === user.username && c.participant_2 === peer) ||
                (c.participant_2 === user.username && c.participant_1 === peer));
            if (existing) threadId = existing.thread_id;
            await loadMessages();
            openThread(peer, threadId);
        } catch (err) { console.error(err); }
    };

    async function openThread(peer, threadId) {
        AppState.setCurrentMsgPeer(peer);
        AppState.setCurrentMsgThread(threadId);
        const header = document.getElementById('msg-thread-header');
        const msgList = document.getElementById('msg-list');
        const input = document.getElementById('msg-input');
        const sendBtn = document.getElementById('msg-send-btn');
        if (header) {
            header.innerHTML = '<div style="display:flex;align-items:center;gap:10px;"><div class="msg-avatar">' + (peer[0]?.toUpperCase() || '?') + '</div><div><div style="font-weight:500;color:#0f172a;">' + peer + '</div><div style="font-size:0.75rem;color:#64748b;">����</div></div></div>';
        }
        if (!threadId) {
            if (msgList) msgList.innerHTML = '<p style="color:#64748b;padding:20px;text-align:center;">���͵�һ����Ϣ��ʼ�Ի�</p>';
            setupMsgSend(peer, null);
            updateActiveConvHighlight(peer);
            return;
        }
        try {
            const user = AppState.getUser();
            const { data } = await Api.getThreadMessages(threadId);
            await Api.markThreadRead(threadId, user.username);
            if (msgList) {
                msgList.innerHTML = '';
                const frag = document.createDocumentFragment();
                for (const m of data || []) {
                    const isMine = m.sender === user.username;
                    const bubble = document.createElement('div');
                    bubble.className = 'msg-bubble ' + (isMine ? 'msg-mine' : 'msg-theirs');
                    bubble.innerHTML = '<div style="font-size:0.7rem;color:' + (isMine ? '#c7d2fe' : '#94a3b8') + ';margin-bottom:3px;">' + (isMine ? '��' : m.sender) + '</div><div>' + m.content + '</div><div style="font-size:0.65rem;color:' + (isMine ? '#c7d2fe' : '#94a3b8') + ';margin-top:4px;text-align:right;">' + formatMsgTime(m.created_at) + '</div>';
                    frag.appendChild(bubble);
                }
                msgList.appendChild(frag);
                msgList.scrollTop = msgList.scrollHeight;
            }
            setupMsgSend(peer, threadId);
            updateActiveConvHighlight(peer);
        } catch (err) { console.error(err); }
    }

    function updateActiveConvHighlight(peer) {
        document.querySelectorAll('.msg-conv-item').forEach(el => {
            el.classList.toggle('active', el.dataset.peer === peer);
        });
    }

    function setupMsgSend(peer, threadId) {
        const input = document.getElementById('msg-input');
        const sendBtn = document.getElementById('msg-send-btn');
        const form = document.getElementById('msg-send-form');
        if (!input) return;
        const draft = AppState.getMsgDraft(peer) || '';
        input.value = draft;
        input.oninput = () => AppState.setMsgDraft(peer, input.value);
        const doSend = async () => {
            const text = input.value.trim();
            if (!text) return;
            const user = AppState.getUser();
            if (!user) return;
            try {
                await Api.sendMessage(user.username, peer, text);
                input.value = '';
                AppState.setMsgDraft(peer, '');
                const newThreadId = threadId || (await findThreadId(user.username, peer));
                AppState.setCurrentMsgThread(newThreadId);
                openThread(peer, newThreadId);
                loadMessages();
            } catch (err) { showToast('����ʧ��'); }
        };
        if (sendBtn) sendBtn.onclick = doSend;
        if (form) form.onsubmit = (e) => { e.preventDefault(); doSend(); };
    }

    async function findThreadId(u1, u2) {
        try {
            const { data } = await Api.getConversations(u1);
            const c = data?.find(x =>
                (x.participant_1 === u1 && x.participant_2 === u2) ||
                (x.participant_2 === u1 && x.participant_1 === u2));
            return c?.thread_id;
        } catch { return null; }
    }

    function formatMsgTime(t) {
        if (!t) return '';
        try {
            const d = new Date(t);
            return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
        } catch { return ''; }
    }

    // --- Event Banners ---
    async function loadEventBanners() {
        const bannerEl = document.getElementById('event-banners');
        if (!bannerEl) return;
        try {
            const { data } = await Api.getEvents();
            const today = new Date();
            const tStr = formatDateStr(today);
            const upcoming = (data || [])
                .filter(e => e.date >= tStr)
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 3);
            if (upcoming.length === 0) {
                bannerEl.innerHTML = '';
                return;
            }
            const typeColors = { academic: '#3b82f6', cultural: '#a855f7', sports: '#f59e0b', volunteer: '#10b981', other: '#6b7280' };
            const typeLabels = { academic: 'ѧ��', cultural: '����', sports: '����', volunteer: '־Ը', other: '����' };
            bannerEl.innerHTML = '';
            const frag = document.createDocumentFragment();
            for (const ev of upcoming) {
                const banner = document.createElement('div');
                banner.className = 'event-banner';
                const bg = typeColors[ev.type] || '#6b7280';
                banner.style.cssText = 'background: linear-gradient(135deg, ' + bg + 'dd, ' + bg + '99);';
                banner.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;"><div><div style="font-size:0.7rem;opacity:0.9;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:10px;display:inline-block;">' + (typeLabels[ev.type] || '����') + '</div><div style="font-size:1rem;font-weight:bold;margin-top:6px;">' + ev.title + '</div><div style="font-size:0.8rem;opacity:0.9;margin-top:4px;"><i class="fas fa-calendar"></i> ' + ev.date + ' ' + (ev.time || '') + ' �� <i class="fas fa-map-marker-alt"></i> ' + (ev.location || '--') + '</div></div><i class="fas fa-chevron-right" style="font-size:1.2rem;opacity:0.8;"></i></div>';
                banner.onclick = () => {
                    elements.navItems.forEach(i => i.classList.remove('active'));
                    const calNav = Array.from(elements.navItems).find(i => i.dataset.tab === 'event-calendar');
                    calNav?.classList.add('active');
                    elements.viewSections.forEach(v => v.classList.add('hidden'));
                    document.getElementById('event-calendar-tab')?.classList.remove('hidden');
                    const [y, m, d] = ev.date.split('-').map(Number);
                    AppState.setCurrentCalendarDate(new Date(y, m - 1, d));
                    loadEventCalendar();
                };
                frag.appendChild(banner);
            }
            bannerEl.appendChild(frag);
        } catch (err) { console.error('Event banners failed:', err); }
    }

    // --- Create Event Form ---
    const eventForm = document.getElementById('create-event-form');
    if (eventForm) {
        eventForm.onsubmit = async (e) => {
            e.preventDefault();
            const user = AppState.getUser();
            if (!AppState.isAdmin()) { showToast('������Ա�ɷ����'); return; }
            const payload = {
                title: document.getElementById('event-title').value.trim(),
                date: document.getElementById('event-date').value,
                time: document.getElementById('event-time').value,
                location: document.getElementById('event-location').value.trim(),
                type: document.getElementById('event-type').value,
                organizer: document.getElementById('event-organizer').value.trim() || user.real_name || user.username,
                description: document.getElementById('event-desc').value.trim()
            };
            if (!payload.title || !payload.date) { showToast('����д���������'); return; }
            try {
                await Api.createEvent(payload);
                showToast('������ɹ�');
                eventForm.reset();
                loadEventBanners();
            } catch (err) { showToast('����ʧ��'); }
        };
    }

    // --- Data Dashboard ---
    async function loadDashboardStats(range) {
        const chartOrders = document.getElementById('chart-orders');
        const chartRevenue = document.getElementById('chart-revenue');
        const statCards = document.querySelectorAll('.stat-card-value');
        const rangeBtns = document.querySelectorAll('[data-range]');
        rangeBtns.forEach(b => b.classList.toggle('active', b.dataset.range === range));
        AppState.setCurrentStatsRange(range);
        try {
            const { data } = await Api.getStats(range);
            if (!data) return;
            if (statCards[0]) statCards[0].textContent = data.total_orders || 0;
            if (statCards[1]) statCards[1].textContent = data.completed_orders || 0;
            if (statCards[2]) statCards[2].textContent = (data.total_revenue || 0).toFixed(2) + ' Ԫ';
            if (statCards[3]) statCards[3].textContent = data.active_users || 0;
            if (chartOrders && data.daily_orders) {
                const max = Math.max(...data.daily_orders.map(d => d.count), 1);
                chartOrders.innerHTML = '';
                const ofrag = document.createDocumentFragment();
                for (const d of data.daily_orders) {
                    const bar = document.createElement('div');
                    bar.className = 'chart-bar';
                    bar.innerHTML = '<div class="chart-bar-fill" style="height:' + (d.count / max * 100) + '%"></div><div class="chart-bar-label">' + d.label + '</div><div class="chart-bar-value">' + d.count + '</div>';
                    ofrag.appendChild(bar);
                }
                chartOrders.appendChild(ofrag);
            }
            if (chartRevenue && data.daily_revenue) {
                const max = Math.max(...data.daily_revenue.map(d => d.revenue), 1);
                chartRevenue.innerHTML = '';
                const rfrag = document.createDocumentFragment();
                for (const d of data.daily_revenue) {
                    const bar = document.createElement('div');
                    bar.className = 'chart-bar';
                    bar.innerHTML = '<div class="chart-bar-fill chart-revenue" style="height:' + (d.revenue / max * 100) + '%"></div><div class="chart-bar-label">' + d.label + '</div><div class="chart-bar-value">��' + d.revenue.toFixed(0) + '</div>';
                    rfrag.appendChild(bar);
                }
                chartRevenue.appendChild(rfrag);
            }
        } catch (err) { console.error('Dashboard failed:', err); }
    }

    document.querySelectorAll('[data-range]').forEach(btn => {
        btn.onclick = () => loadDashboardStats(btn.dataset.range);
    });

    // --- Final: update UI ---
    updateUIForLogin();
});
