document.addEventListener('DOMContentLoaded', () => {
    // State management
    let currentUser = JSON.parse(localStorage.getItem('user')) || null;
    let currentFilter = '';
    let myOrdersView = 'created'; // 'created' or 'accepted'

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
        notificationUnreadCount: document.getElementById('notification-unread-count')
    };

    let auditFilter = 'pending';
    const userBlacklistCache = {};

    let currentCalendarDate = new Date();
    let allEvents = [];
    let userSubscriptions = [];
    const EVENT_TYPE_INFO = {
        peak: { label: '快递高峰', icon: 'fa-boxes', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f97316)' },
        promotion: { label: '驿站促销', icon: 'fa-tags', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
        holiday: { label: '寒暑假提醒', icon: 'fa-plane-departure', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
        other: { label: '其他活动', icon: 'fa-calendar-star', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }
    };

    // --- Authentication ---
    async function refreshUserInfo() {
        if (!currentUser) return;
        try {
            const resp = await fetch(`/api/user?username=${encodeURIComponent(currentUser.username)}`);
            const data = await resp.json();
            if (data && data.username) {
                currentUser = { ...currentUser, ...data };
                localStorage.setItem('user', JSON.stringify(currentUser));
                updateCertBadges();
                updateAdminNav();
            }
        } catch (err) {
            console.error('Failed to refresh user info:', err);
        }
    }

    function updateCertBadges() {
        const isCertified = currentUser && currentUser.certified === 'yes';
        if (elements.sidebarCertBadge) {
            elements.sidebarCertBadge.style.display = isCertified ? 'inline-flex' : 'none';
        }
        if (elements.profileCertBadge) {
            elements.profileCertBadge.style.display = isCertified ? 'inline-flex' : 'none';
        }
    }

    function updateAdminNav() {
        if (elements.navCertAudit) {
            const isAdmin = currentUser && currentUser.username === 'admin';
            elements.navCertAudit.style.display = isAdmin ? 'flex' : 'none';
        }
        if (elements.navEventManage) {
            const isAdmin = currentUser && currentUser.username === 'admin';
            elements.navEventManage.style.display = isAdmin ? 'flex' : 'none';
        }
    }

    function updateUIForLogin() {
        if (currentUser) {
            elements.authOverlay.classList.add('hidden');
            elements.mainApp.classList.remove('hidden');
            elements.displayName.textContent = currentUser.realName;
            elements.displayMajor.textContent = currentUser.major;
            elements.welcomeName.textContent = currentUser.realName;
            const pkgCustomerDisp = document.getElementById('pkg-customer-disp');
            if (pkgCustomerDisp) pkgCustomerDisp.textContent = currentUser.realName;

            updateCertBadges();
            updateAdminNav();
            refreshUserInfo();
            loadBlacklistCache();
            loadEventBanners();
            loadWeatherCard();

            // Go to dashboard by default to clear any previous account's tab state
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
            const resp = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!resp.ok) {
                showToast('账号或密码错误');
                return;
            }
            const data = await resp.json();
            if (data.status === 'success') {
                currentUser = data;
                localStorage.setItem('user', JSON.stringify(data));
                updateUIForLogin();
                showToast('登录成功！');
                // Clear form
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
            const resp = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
            if (resp.ok && data.status === 'success') {
                currentUser = data;
                localStorage.setItem('user', JSON.stringify(data));
                updateUIForLogin();
                showToast('注册成功！');
                elements.registerForm.reset();
            } else {
                showToast(data.message || '注册失败');
            }
        } catch (err) { showToast('注册失败'); }
    };

    elements.logoutBtn.onclick = () => {
        localStorage.removeItem('user');
        currentUser = null;
        // Clear sensitive UI elements
        elements.orderList.innerHTML = '';
        elements.myOrdersList.innerHTML = '';
        elements.loginForm.reset();
        elements.registerForm.reset();

        // Ensure returning to login tab
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

            if (tab === 'dashboard') { fetchOrders(); loadEventBanners(); loadWeatherCard(); }
            if (tab === 'my-orders') fetchMyOrders();
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
        };
    });

    // --- Order Logic ---
    async function fetchOrders() {
        try {
            let url = `/api/orders?category=${encodeURIComponent(currentFilter)}`;
            const [ordersResp, usersResp] = await Promise.all([
                fetch(url),
                fetch('/api/users')
            ]);
            const orders = await ordersResp.json();
            const users = await usersResp.json();

            users.forEach(u => {
                userCertCache[u.username] = u.certified === 'yes';
            });

            renderOrders(orders, elements.orderList);
            elements.activeCount.textContent = orders.filter(o => o.status !== 'completed').length;
        } catch (err) { console.error(err); }
    }

    async function fetchMyOrders() {
        try {
            let url = myOrdersView === 'created'
                ? `/api/orders?creator=${currentUser.username}`
                : `/api/orders?worker=${currentUser.username}`;
            const [ordersResp, usersResp] = await Promise.all([
                fetch(url),
                fetch('/api/users')
            ]);
            const orders = await ordersResp.json();
            const users = await usersResp.json();

            users.forEach(u => {
                userCertCache[u.username] = u.certified === 'yes';
            });

            renderOrders(orders, elements.myOrdersList, true);
        } catch (err) { console.error(err); }
    }

    function renderOrders(orders, container, isMyOrders = false) {
        container.innerHTML = '';
        if (!isMyOrders) {
            orders = orders.filter(o => o.status === 'pending' && o.creator !== currentUser.username);
        }

        if (orders.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">暂无订单数据</div>';
            return;
        }
        orders.forEach(order => {
            const card = document.createElement('div');
            card.className = `order-card ${order.status}`;

            const statusMap = { 'pending': '待接单', 'accepted': '进行中', 'delivered': '待收货', 'completed': '已完成', 'cancelled': '已撤回' };

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="badge ${order.status}">${statusMap[order.status]}</span>
                    <span style="color: #f43f5e; font-weight: 800; font-size: 1.2rem;">${order.reward}</span>
                </div>
                <div class="order-body">
                    <h3>${order.package}</h3>
                    <div class="info-row"><i class="fas fa-map-marker-alt"></i> <span>${order.pickup}</span></div>
                    <div class="info-row"><i class="fas fa-door-open"></i> <span>送至: ${order.delivery}</span></div>
                    <div class="info-row"><i class="fas fa-user-circle"></i> <span>发布人: ${order.creator}</span> ${userCertCache[order.creator] ? '<span class="cert-badge inline-badge" title="认证用户"><i class="fas fa-check-circle"></i></span>' : ''}</div>
                    ${order.worker ? `<div class="info-row"><i class="fas fa-hands-helping"></i> <span>接单人: ${order.worker}</span> ${userCertCache[order.worker] ? '<span class="cert-badge inline-badge" title="认证跑腿员"><i class="fas fa-check-circle"></i></span>' : ''}</div>` : ''}
                </div>
                <div class="order-footer">
                    ${!isMyOrders && order.status === 'pending' ?
                    `<button class="btn-primary" onclick="updateStatus(${order.id}, 'accepted')">确认接单</button>` : ''}

                    ${isMyOrders && myOrdersView === 'accepted' && order.status === 'accepted' ?
                    `<button class="btn-primary" onclick="updateStatus(${order.id}, 'delivered')">确认送达</button>` : ''}

                    ${isMyOrders && myOrdersView === 'created' && (order.status === 'accepted' || order.status === 'delivered') ?
                    `<button class="btn-primary" style="background:var(--accent);color:#fff" onclick="updateStatus(${order.id}, 'completed')">确认收货并支付 / 评价</button>` : ''}

                    ${isMyOrders && myOrdersView === 'created' && order.status === 'pending' ?
                    `<button class="btn-outline" style="color: #ef4444;" onclick="updateStatus(${order.id}, 'cancelled')"><i class="fas fa-undo"></i> 撤回发布</button>` : ''}
                </div>
                <div class="card-actions">
                    <button class="block-action-btn view-route-btn" 
                            data-pickup="${order.pickup}" 
                            data-delivery="${order.delivery}"
                            data-package="${order.package}"
                            data-status="${order.status}">
                        <i class="fas fa-route"></i> 查看路线
                    </button>
                    ${order.creator !== currentUser.username ? `
                    <button class="block-action-btn ${userBlacklistCache[order.creator] ? 'blocked' : ''}" 
                            onclick="toggleBlacklist('${order.creator}', this)">
                        <i class="fas ${userBlacklistCache[order.creator] ? 'fa-check' : 'fa-ban'}"></i>
                        ${userBlacklistCache[order.creator] ? '已拉黑发布人' : '拉黑发布人'}
                    </button>` : ''}
                    ${order.worker && order.worker !== currentUser.username ? `
                    <button class="block-action-btn ${userBlacklistCache[order.worker] ? 'blocked' : ''}" 
                            onclick="toggleBlacklist('${order.worker}', this)">
                        <i class="fas ${userBlacklistCache[order.worker] ? 'fa-check' : 'fa-ban'}"></i>
                        ${userBlacklistCache[order.worker] ? '已拉黑接单人' : '拉黑接单人'}
                    </button>` : ''}
                </div>
            `;

            const routeBtn = card.querySelector('.view-route-btn');
            if (routeBtn) {
                routeBtn.onclick = () => {
                    const orderData = {
                        pickup: order.pickup,
                        delivery: order.delivery,
                        package: order.package,
                        status: order.status
                    };
                    openRouteFromOrder(orderData);
                };
            }

            container.appendChild(card);
        });
    }

    function addCertBadgeToName(username, nameEl) {
        if (userCertCache[username]) {
            const badge = document.createElement('span');
            badge.className = 'cert-badge inline-badge';
            badge.innerHTML = '<i class="fas fa-check-circle"></i>';
            badge.title = '认证跑腿员';
            nameEl.parentNode.insertBefore(badge, nameEl.nextSibling);
        }
    }

    const userCertCache = {};

    async function fetchUserCertStatus(username) {
        if (userCertCache[username] !== undefined) {
            return userCertCache[username];
        }
        try {
            const resp = await fetch(`/api/user?username=${encodeURIComponent(username)}`);
            const data = await resp.json();
            userCertCache[username] = data.certified === 'yes';
            return userCertCache[username];
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
            currentFilter = (ds === '全部') ? '' : ds;
            fetchOrders();
        };
    });

    // My Orders Toggle
    elements.showCreated.onclick = () => {
        elements.showCreated.classList.add('active');
        elements.showAccepted.classList.remove('active');
        myOrdersView = 'created';
        fetchMyOrders();
    };
    elements.showAccepted.onclick = () => {
        elements.showAccepted.classList.add('active');
        elements.showCreated.classList.remove('active');
        myOrdersView = 'accepted';
        fetchMyOrders();
    };

    // Post Order
    elements.orderForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            package: document.getElementById('pkg-name').value,
            pickup: document.getElementById('pkg-pickup').value,
            delivery: document.getElementById('pkg-delivery').value,
            reward: document.getElementById('pkg-reward').value,
            creator: currentUser.username
        };
        try {
            const resp = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (resp.ok) {
                showToast('发布成功！');
                elements.orderForm.reset();
                document.querySelector('[data-tab="dashboard"]').click();
            } else {
                showToast('发布失败');
            }
        } catch (err) { showToast('发布失败'); }
    }

    // Status Update
    window.updateStatus = async (id, status) => {
        const payload = { id, status, worker: currentUser.username };
        try {
            const resp = await fetch('/api/update_status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!resp.ok) {
                const data = await resp.json().catch(() => ({}));
                showToast(data.message || '操作失败，请重试');
                return;
            }

            if (status === 'accepted') showToast('接单成功，请尽快送达！');
            else if (status === 'delivered') showToast('已送达，等待发单人确认。');
            else if (status === 'completed') showToast('任务完成，感谢使用！');
            else if (status === 'cancelled') showToast('已成功撤回该订单。');

            if (document.getElementById('dashboard-tab').classList.contains('hidden')) fetchMyOrders();
            else fetchOrders();
        } catch (err) { showToast('操作失败'); }
    };

    // --- Profile ---
    async function loadProfile() {
        elements.profileRealName.textContent = currentUser.realName;
        elements.profileMajor.textContent = currentUser.major;

        // Fetch real stats from backend
        try {
            // Count orders created by this user (发布任务)
            const createdResp = await fetch(`/api/orders?creator=${currentUser.username}`);
            const createdOrders = await createdResp.json();
            document.getElementById('stat-created').textContent = createdOrders.length;

            // Count orders completed as worker (代取成功)
            const workerResp = await fetch(`/api/orders?worker=${currentUser.username}`);
            const workerOrders = await workerResp.json();
            const completedCount = workerOrders.filter(o => o.status === 'completed').length;
            document.getElementById('stat-delivered').textContent = completedCount;

            // Credit score stays at 98 (static)
            document.getElementById('stat-credit').textContent = '98';
        } catch (err) {
            console.error('Failed to load profile stats:', err);
        }
    }

    elements.editProfileBtn.onclick = () => {
        elements.editRealname.value = currentUser.realName;
        elements.editMajor.value = currentUser.major;
        const editDormBuilding = document.getElementById('edit-dorm-building');
        if (editDormBuilding) editDormBuilding.value = currentUser.dormBuilding || '';
        elements.profileModal.classList.remove('hidden');
    };

    elements.accountSecBtn.onclick = () => {
        elements.editPassword.value = '';
        elements.securityModal.classList.remove('hidden');
    };

    elements.profileForm.onsubmit = async (e) => {
        e.preventDefault();
        const editDormBuilding = document.getElementById('edit-dorm-building');
        const payload = {
            username: currentUser.username,
            realName: elements.editRealname.value,
            major: elements.editMajor.value
        };
        if (editDormBuilding && editDormBuilding.value) {
            payload.dormBuilding = editDormBuilding.value;
        }
        try {
            const resp = await fetch('/api/update_profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (resp.ok) {
                currentUser.realName = payload.realName;
                currentUser.major = payload.major;
                if (payload.dormBuilding) {
                    currentUser.dormBuilding = payload.dormBuilding;
                }
                localStorage.setItem('user', JSON.stringify(currentUser));
                loadProfile();
                updateUIForLogin();
                elements.profileModal.classList.add('hidden');
                showToast('个人资料修改成功！');
            }
        } catch (err) { showToast('修改失败'); }
    };

    elements.securityForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            username: currentUser.username,
            password: elements.editPassword.value
        };
        try {
            const resp = await fetch('/api/update_profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
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
        elements.certForm.reset();
        elements.certAppId.value = '';

        try {
            const resp = await fetch(`/api/cert/apps?username=${encodeURIComponent(currentUser.username)}`);
            const apps = await resp.json();

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
        const payload = {
            username: currentUser.username,
            studentId: elements.certStudentId.value,
            dormBuilding: elements.certDorm.value,
            phone: elements.certPhone.value,
            description: elements.certDescription.value
        };
        if (elements.certAppId.value) {
            payload.id = parseInt(elements.certAppId.value);
        }

        try {
            const resp = await fetch('/api/cert/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
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
        try {
            const resp = await fetch(`/api/cert/apps?username=${encodeURIComponent(currentUser.username)}`);
            const apps = await resp.json();
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
                                <button class="btn-resubmit" onclick="resubmitCert(${app.id})">重新提交申请</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        elements.certRecordList.innerHTML = html;
    }

    window.resubmitCert = (appId) => {
        document.querySelector('[data-tab="cert-apply"]').click();
    };

    // --- Admin Audit ---
    elements.auditFilterPending.onclick = () => {
        auditFilter = 'pending';
        elements.auditFilterPending.classList.add('active');
        elements.auditFilterAll.classList.remove('active');
        loadAuditList();
    };

    elements.auditFilterAll.onclick = () => {
        auditFilter = '';
        elements.auditFilterAll.classList.add('active');
        elements.auditFilterPending.classList.remove('active');
        loadAuditList();
    };

    async function loadAuditList() {
        try {
            let url = '/api/cert/apps';
            if (auditFilter) {
                url += `?status=${encodeURIComponent(auditFilter)}`;
            }
            const resp = await fetch(url);
            const apps = await resp.json();
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
                            <button class="btn-approve" onclick="openAuditModal(${app.id}, 'approve')">
                                <i class="fas fa-check"></i> 通过
                            </button>
                            <button class="btn-reject" onclick="openAuditModal(${app.id}, 'reject')">
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
    }

    window.openAuditModal = (appId, action) => {
        elements.auditAppId.value = appId;
        elements.auditAction.value = action;
        elements.auditOpinion.value = '';

        fetch(`/api/cert/apps`)
            .then(r => r.json())
            .then(apps => {
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
            })
            .catch(err => {
                console.error('Failed to fetch app details:', err);
                elements.auditModal.classList.remove('hidden');
            });
    };

    elements.auditForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            id: parseInt(elements.auditAppId.value),
            action: elements.auditAction.value,
            auditor: currentUser.username,
            opinion: elements.auditOpinion.value
        };

        try {
            const resp = await fetch('/api/cert/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
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
            const [ordersResp, usersResp] = await Promise.all([
                fetch('/api/orders?status=completed'),
                fetch('/api/users')
            ]);
            const orders = await ordersResp.json();
            const users = await usersResp.json();

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
        if (!users || users.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #64748b; padding: 40px;">暂无排行数据</div>';
            return;
        }

        let html = '';
        users.forEach((user, index) => {
            const initial = (user.realName || user.username || 'U').charAt(0).toUpperCase();
            const isCertified = user.certified === 'yes';

            html += `
                <div class="leaderboard-item">
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
                    ${user.username !== currentUser.username ? `
                    <button class="block-action-btn ${userBlacklistCache[user.username] ? 'blocked' : ''}"
                            onclick="toggleBlacklist('${user.username}', this)">
                        <i class="fas ${userBlacklistCache[user.username] ? 'fa-check' : 'fa-ban'}"></i>
                        ${userBlacklistCache[user.username] ? '已拉黑' : '拉黑'}
                    </button>
                    ` : ''}
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // --- Blacklist ---
    async function loadBlacklistCache() {
        if (!currentUser) return;
        try {
            const resp = await fetch(`/api/blacklist?blocker=${encodeURIComponent(currentUser.username)}`);
            const list = await resp.json();
            for (const key of Object.keys(userBlacklistCache)) {
                delete userBlacklistCache[key];
            }
            list.forEach(item => {
                userBlacklistCache[item.blocked] = item;
            });
        } catch (err) {
            console.error('Failed to load blacklist cache:', err);
        }
    }

    async function loadBlacklist() {
        if (!currentUser) return;
        try {
            const resp = await fetch(`/api/blacklist?blocker=${encodeURIComponent(currentUser.username)}`);
            const list = await resp.json();
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
        let html = '';

        sortedList.forEach(item => {
            const initial = (item.blockedRealName || item.blocked || 'U').charAt(0).toUpperCase();
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.blocked)}`;

            html += `
                <div class="blacklist-item" data-username="${item.blocked}">
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
                    <button class="blacklist-remove-btn" onclick="removeFromBlacklist('${item.blocked}', ${item.id})">
                        <i class="fas fa-user-plus"></i> 移出黑名单
                    </button>
                </div>
            `;
        });

        elements.blacklistList.innerHTML = html;
    }

    window.toggleBlacklist = async (username, btnEl) => {
        if (!currentUser) return;
        if (username === currentUser.username) return;

        const isBlocked = !!userBlacklistCache[username];

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
        if (!currentUser) return;

        try {
            const resp = await fetch('/api/blacklist/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blocker: currentUser.username,
                    blocked: username
                })
            });
            const data = await resp.json();
            if (resp.ok && data.status === 'success') {
                userBlacklistCache[username] = { id: data.id, blocked: username };
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
        if (!currentUser) return;

        try {
            const payload = { blocker: currentUser.username, blocked: username };
            if (id) payload.id = id;

            const resp = await fetch('/api/blacklist/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
            if (resp.ok && data.status === 'success') {
                delete userBlacklistCache[username];
                showToast('已移出黑名单');
                if (btnEl) {
                    btnEl.classList.remove('blocked');
                    btnEl.innerHTML = `<i class="fas fa-ban"></i> 加入黑名单`;
                }
                if (!document.getElementById('blacklist-tab').classList.contains('hidden')) {
                    loadBlacklist();
                }
                if (!document.getElementById('dashboard-tab').classList.contains('hidden')) {
                    fetchOrders();
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

    function showToast(msg) {
        const t = elements.toast;
        t.textContent = msg;
        t.classList.remove('hidden');
        setTimeout(() => t.classList.add('hidden'), 3000);
    }

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
            pickup,
            delivery,
            size,
            isUrgent,
            isRain,
            distance: distance.toFixed(1),
            distanceFee,
            sizeFee,
            urgentFee,
            rainFee,
            baseFee: BASE_FEE,
            total: clampedTotal,
            rangeMin: rangeMin.toFixed(2),
            rangeMax: rangeMax.toFixed(2)
        };
    }

    function updateCalcDisplay(result) {
        elements.calcDistanceInfo.textContent = `预估距离：约 ${result.distance} 校园单位 | 距离越远费用越高`;
        elements.calcRange.textContent = `¥${result.rangeMin} - ¥${result.rangeMax}`;
        elements.calcSuggested.textContent = result.total.toFixed(2);
        elements.calcBase.textContent = `¥${result.baseFee.toFixed(2)}`;
        elements.calcDistanceFee.textContent = `¥${result.distanceFee.toFixed(2)}`;
        elements.calcSizeFee.textContent = `¥${result.sizeFee.toFixed(2)}`;

        if (result.isUrgent) {
            elements.calcUrgentRow.style.display = 'flex';
            elements.calcUrgentFee.textContent = `¥${result.urgentFee.toFixed(2)}`;
        } else {
            elements.calcUrgentRow.style.display = 'none';
        }

        if (result.isRain) {
            elements.calcRainRow.style.display = 'flex';
            elements.calcRainFee.textContent = `¥${result.rainFee.toFixed(2)}`;
        } else {
            elements.calcRainRow.style.display = 'none';
        }

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
        if (!currentUser) return;
        const key = `price_schemes_${currentUser.username}`;
        const schemes = JSON.parse(localStorage.getItem(key) || '[]');

        if (schemes.length === 0) {
            elements.calcSavedList.innerHTML = `
                <div style="text-align: center; color: #94a3b8; padding: 30px; font-size: 0.9rem;">
                    暂无保存的方案
                </div>
            `;
            return;
        }

        let html = '';
        schemes.forEach((scheme, idx) => {
            const sizeLabel = SIZE_FEE[scheme.size]?.label || scheme.size;
            html += `
                <div class="saved-scheme-card" onclick="applySavedScheme(${idx})">
                    <div class="saved-scheme-header">
                        <span class="saved-scheme-name">${scheme.name}</span>
                        <button class="saved-scheme-delete" onclick="event.stopPropagation(); deleteSavedScheme(${idx})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="saved-scheme-info">
                        <div><i class="fas fa-store" style="width: 14px;"></i> ${scheme.pickup}</div>
                        <div><i class="fas fa-home" style="width: 14px;"></i> ${scheme.delivery}</div>
                        <div><i class="fas fa-box" style="width: 14px;"></i> ${sizeLabel}</div>
                    </div>
                    <div class="saved-scheme-price">
                        <span>¥${scheme.total.toFixed(2)}</span>
                        <div class="tags">
                            ${scheme.isUrgent ? '<span class="saved-tag urgent">加急</span>' : ''}
                            ${scheme.isRain ? '<span class="saved-tag rain">雨天</span>' : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        elements.calcSavedList.innerHTML = html;
    }

    function getSavedSchemes() {
        if (!currentUser) return [];
        const key = `price_schemes_${currentUser.username}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    function saveSchemesToStorage(schemes) {
        if (!currentUser) return;
        const key = `price_schemes_${currentUser.username}`;
        localStorage.setItem(key, JSON.stringify(schemes));
    }

    if (elements.calcSaveBtn) {
        elements.calcSaveBtn.onclick = () => {
            if (!currentUser) {
                showToast('请先登录');
                return;
            }
            const result = calculatePrice();
            const schemeName = prompt('请输入方案名称（如：南门→13号楼常规）', '我的方案');
            if (!schemeName || !schemeName.trim()) return;

            const schemes = getSavedSchemes();
            schemes.unshift({
                ...result,
                name: schemeName.trim(),
                createdAt: Date.now()
            });

            if (schemes.length > 10) schemes.pop();
            saveSchemesToStorage(schemes);
            loadSavedSchemes();
            showToast('方案已保存！');
        };
    }

    window.applySavedScheme = (idx) => {
        if (!currentUser) return;
        const schemes = getSavedSchemes();
        const scheme = schemes[idx];
        if (!scheme) return;

        elements.calcPickup.value = scheme.pickup;
        elements.calcDelivery.value = scheme.delivery;
        elements.calcSize.value = scheme.size;
        elements.calcUrgent.checked = scheme.isUrgent;
        elements.calcRain.checked = scheme.isRain;
        updateCalcDisplay(calculatePrice());
        showToast('已应用方案');
    };

    window.deleteSavedScheme = (idx) => {
        if (!currentUser) return;
        if (!confirm('确定删除该方案？')) return;
        const schemes = getSavedSchemes();
        schemes.splice(idx, 1);
        saveSchemesToStorage(schemes);
        loadSavedSchemes();
        showToast('已删除');
    };

    if (elements.calcApplyBtn) {
        elements.calcApplyBtn.onclick = () => {
            const result = calculatePrice();
            document.getElementById('pkg-pickup').value = result.pickup;
            document.getElementById('pkg-delivery').value = result.delivery;
            document.getElementById('pkg-reward').value = result.total.toFixed(2);

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
        for (const node of Object.keys(ROUTE_NODES)) {
            adj[node] = [];
        }
        for (const edge of ROUTE_EDGES) {
            adj[edge.from].push({ to: edge.to, distance: edge.distance, stairs: edge.stairs });
            adj[edge.to].push({ to: edge.from, distance: edge.distance, stairs: edge.stairs });
        }
        return adj;
    }

    function dijkstra(start, end, weightType = 'distance') {
        const adj = buildAdjacencyList();
        const distances = {};
        const prev = {};
        const visited = new Set();

        for (const node of Object.keys(ROUTE_NODES)) {
            distances[node] = Infinity;
            prev[node] = null;
        }
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

        const path = [];
        let totalDistance = 0;
        let totalStairs = 0;
        let current = end;

        while (current !== null && prev[current] !== undefined) {
            path.unshift(current);
            if (prev[current]) {
                totalDistance += prev[current].distance;
                totalStairs += prev[current].stairs;
            }
            current = prev[current] ? prev[current].node : null;
        }

        if (path.length > 0) {
            path.unshift(start);
        }

        return { path, distance: totalDistance, stairs: totalStairs };
    }

    let currentRouteType = 'fastest';
    let currentRouteOrder = null;

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

    function initRouteMap() {
        drawBackgroundPaths();
        drawLandmarks();
        updateRoute();
    }

    function drawBackgroundPaths() {
        const svgNs = 'http://www.w3.org/2000/svg';
        routeElements.bgPaths.innerHTML = '';

        for (const edge of ROUTE_EDGES) {
            const from = ROUTE_NODES[edge.from];
            const to = ROUTE_NODES[edge.to];
            if (!from || !to) continue;

            const line = document.createElementNS(svgNs, 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            line.setAttribute('class', 'route-bg-path');
            routeElements.bgPaths.appendChild(line);
        }
    }

    function drawLandmarks() {
        const svgNs = 'http://www.w3.org/2000/svg';
        routeElements.landmarks.innerHTML = '';

        for (const [name, node] of Object.entries(ROUTE_NODES)) {
            if (node.type !== 'landmark') continue;

            const circle = document.createElementNS(svgNs, 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', 5);
            circle.setAttribute('class', 'route-landmark-circle');
            routeElements.landmarks.appendChild(circle);

            const text = document.createElementNS(svgNs, 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y - 10);
            text.setAttribute('class', 'route-landmark-label');
            text.textContent = node.label;
            routeElements.landmarks.appendChild(text);
        }
    }

    function drawActiveRoute(path) {
        const svgNs = 'http://www.w3.org/2000/svg';
        routeElements.activePath.innerHTML = '';
        routeElements.points.innerHTML = '';

        if (path.length < 2) return;

        let pathD = '';
        path.forEach((nodeName, idx) => {
            const node = ROUTE_NODES[nodeName];
            if (!node) return;
            if (idx === 0) {
                pathD += `M ${node.x} ${node.y}`;
            } else {
                pathD += ` L ${node.x} ${node.y}`;
            }
        });

        const pathEl = document.createElementNS(svgNs, 'path');
        pathEl.setAttribute('d', pathD);
        pathEl.setAttribute('class', 'route-active-path');
        pathEl.style.animation = 'none';
        routeElements.activePath.appendChild(pathEl);

        pathEl.getBoundingClientRect();
        pathEl.style.animation = '';

        path.forEach((nodeName, idx) => {
            const node = ROUTE_NODES[nodeName];
            if (!node) return;

            const isStart = idx === 0;
            const isEnd = idx === path.length - 1;
            const isLandmark = node.type === 'landmark';

            if (isStart || isEnd || isLandmark) {
                const circle = document.createElementNS(svgNs, 'circle');
                circle.setAttribute('cx', node.x);
                circle.setAttribute('cy', node.y);
                circle.setAttribute('r', isStart || isEnd ? 9 : 6);

                if (isStart) {
                    circle.setAttribute('class', 'route-point-start pulse-animation');
                } else if (isEnd) {
                    circle.setAttribute('class', 'route-point-end pulse-animation');
                } else {
                    circle.setAttribute('class', 'route-point-landmark');
                }

                routeElements.points.appendChild(circle);

                const label = document.createElementNS(svgNs, 'text');
                label.setAttribute('x', node.x);
                label.setAttribute('y', isStart ? node.y + 24 : (isEnd ? node.y - 16 : node.y - 12));
                label.setAttribute('class', `route-point-label ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`);
                label.textContent = node.label;
                routeElements.points.appendChild(label);
            }
        });
    }

    function renderRouteSections(path, result) {
        if (path.length < 2) {
            routeElements.sections.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 30px;">选择起点和终点查看路线详情</div>';
            return;
        }

        let html = '';
        let cumulativeDist = 0;
        let cumulativeTime = 0;

        const adj = buildAdjacencyList();
        const edgeMap = {};
        for (const edge of ROUTE_EDGES) {
            edgeMap[`${edge.from}-${edge.to}`] = edge;
            edgeMap[`${edge.to}-${edge.from}`] = edge;
        }

        for (let i = 0; i < path.length; i++) {
            const nodeName = path[i];
            const node = ROUTE_NODES[nodeName];
            const isStart = i === 0;
            const isEnd = i === path.length - 1;
            const hasStairs = i > 0 && edgeMap[`${path[i - 1]}-${path[i]}`]?.stairs > 0;
            const edge = i > 0 ? edgeMap[`${path[i - 1]}-${path[i]}`] : null;

            if (edge) {
                cumulativeDist += edge.distance;
                cumulativeTime += Math.ceil(edge.distance / 80);
            }

            let itemClass = '';
            let icon = 'fa-map-marker-alt';
            let title = node.label;
            let desc = '';

            if (isStart) {
                itemClass = 'start';
                icon = 'fa-store';
                title = `${node.label}（起点）`;
                desc = '从取件驿站出发，开始配送';
            } else if (isEnd) {
                itemClass = 'end';
                icon = 'fa-home';
                title = `${node.label}（终点）`;
                desc = '到达目的地，配送完成';
            } else if (hasStairs) {
                itemClass = 'stairs';
                icon = 'fa-stairs';
                title = `途经 ${node.label}`;
                desc = `经过 ${edge.stairs} 级台阶，请注意慢行`;
            } else {
                icon = node.icon || 'fa-map-pin';
                title = `途经 ${node.label}`;
                desc = '沿主路直行';
            }

            const sectionDist = edge ? edge.distance : 0;
            const sectionTime = edge ? Math.ceil(edge.distance / 80) : 0;

            html += `
                <div class="route-section-item ${itemClass}">
                    <div class="route-section-icon">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="route-section-content">
                        <div class="route-section-title">${title}</div>
                        <div class="route-section-desc">${desc}</div>
                        ${!isStart ? `
                        <div class="route-section-meta">
                            <span><i class="fas fa-walking"></i> 本段约 ${sectionDist}米</span>
                            <span><i class="fas fa-clock"></i> 约 ${sectionTime}分钟</span>
                            ${hasStairs ? `<span><i class="fas fa-stairs"></i> ${edge.stairs}级台阶</span>` : ''}
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        html += `
            <div class="route-section-item end" style="border-top: 1px dashed #e2e8f0; padding-top: 20px; margin-top: 10px;">
                <div class="route-section-icon" style="background: linear-gradient(135deg, var(--primary), #8b5cf6); color: white;">
                    <i class="fas fa-flag-checkered"></i>
                </div>
                <div class="route-section-content">
                    <div class="route-section-title">全程总结</div>
                    <div class="route-section-desc">共经过 ${path.length - 1} 个路段</div>
                    <div class="route-section-meta">
                        <span><i class="fas fa-walking"></i> 总距离 ${result.distance}米</span>
                        <span><i class="fas fa-clock"></i> 总时间 ${Math.ceil(result.distance / 80)}分钟</span>
                        <span><i class="fas fa-stairs"></i> 台阶 ${result.stairs}级</span>
                    </div>
                </div>
            </div>
        `;

        routeElements.sections.innerHTML = html;
    }

    function updateRoute() {
        const pickup = routeElements.pickup?.value;
        const delivery = routeElements.delivery?.value;

        if (!pickup || !delivery) return;

        const weightType = currentRouteType === 'fastest' ? 'distance' : 'stairs';
        const result = dijkstra(pickup, delivery, weightType);

        const distance = result.distance;
        const timeMinutes = Math.ceil(distance / 80);

        routeElements.distance.textContent = `${distance}米`;
        routeElements.time.textContent = `${timeMinutes}分钟`;
        routeElements.stairs.textContent = `${result.stairs}级`;

        drawActiveRoute(result.path);
        renderRouteSections(result.path, result);
    }

    document.querySelectorAll('.route-tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.route-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRouteType = btn.dataset.routeType;
            updateRoute();
        };
    });

    if (routeElements.pickup) {
        routeElements.pickup.onchange = () => {
            currentRouteOrder = null;
            if (routeElements.orderBadge) {
                routeElements.orderBadge.style.display = 'none';
            }
            updateRoute();
        };
        routeElements.delivery.onchange = () => {
            currentRouteOrder = null;
            if (routeElements.orderBadge) {
                routeElements.orderBadge.style.display = 'none';
            }
            updateRoute();
        };
    }

    window.openRouteFromOrder = (order) => {
        if (!order) return;

        currentRouteOrder = order;

        const navItem = document.querySelector('[data-tab="route-plan"]');
        if (navItem) navItem.click();
    };

    function loadRoutePlan() {
        if (!routeElements.pickup || !routeElements.delivery) return;

        if (currentRouteOrder) {
            routeElements.pickup.value = currentRouteOrder.pickup;
            routeElements.delivery.value = currentRouteOrder.delivery;

            if (routeElements.orderBadge) {
                routeElements.orderBadge.style.display = 'flex';
                routeElements.orderName.textContent = currentRouteOrder.package;

                const statusMap = { 'pending': '待接单', 'accepted': '进行中', 'delivered': '待收货', 'completed': '已完成', 'cancelled': '已撤回' };
                routeElements.orderStatus.textContent = statusMap[currentRouteOrder.status] || currentRouteOrder.status;
                routeElements.orderStatus.className = `badge ${currentRouteOrder.status}`;
            }
        } else {
            if (routeElements.orderBadge) {
                routeElements.orderBadge.style.display = 'none';
            }
        }

        initRouteMap();
    }

    async function loadMutualAid() {
        if (!currentUser) return;

        if (!currentUser.dormBuilding || currentUser.dormBuilding.trim() === '') {
            elements.buildingSelectModal.classList.remove('hidden');
            elements.mutualAidList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">请先选择所属楼栋</div>';
            return;
        }

        elements.buildingSelectModal.classList.add('hidden');

        const building = currentUser.dormBuilding;
        const onlyMine = elements.mutualOnlyMine.checked;
        const selectedBuilding = elements.mutualBuildingSelect.value || building;

        elements.mutualBuildingSelect.value = selectedBuilding;

        const range = onlyMine ? 0 : 1;
        const targetBuilding = onlyMine ? building : selectedBuilding;

        elements.mutualAidCurrentBuilding.textContent = targetBuilding;

        try {
            const url = `/api/orders/nearby?building=${encodeURIComponent(targetBuilding)}&range=${range}`;
            const [ordersResp, usersResp] = await Promise.all([
                fetch(url),
                fetch('/api/users')
            ]);
            const orders = await ordersResp.json();
            const users = await usersResp.json();

            users.forEach(u => {
                userCertCache[u.username] = u.certified === 'yes';
            });

            const filtered = orders.filter(o => o.creator !== currentUser.username);
            renderMutualAidOrders(filtered, building);
        } catch (err) {
            console.error('Failed to load mutual aid orders:', err);
            elements.mutualAidList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">加载失败</div>';
        }
    }

    function parseBuildingNum(buildingStr) {
        if (!buildingStr) return 0;
        const match = buildingStr.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    function getBuildingRelation(orderBuilding, userBuilding) {
        const userNum = parseBuildingNum(userBuilding);
        const orderNum = parseBuildingNum(orderBuilding);
        if (userNum === 0 || orderNum === 0) return { label: '', cls: '' };
        const diff = Math.abs(orderNum - userNum);
        if (diff === 0) return { label: '本楼', cls: 'same-building' };
        if (diff === 1) return { label: '相邻楼', cls: 'adjacent-building' };
        return { label: `${diff}栋之隔`, cls: 'nearby-building' };
    }

    function renderMutualAidOrders(orders, userBuilding) {
        const container = elements.mutualAidList;
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">暂无附近楼栋的待接单任务</div>';
            return;
        }

        orders.sort((a, b) => (a.buildingDist || 99) - (b.buildingDist || 99));

        orders.forEach(order => {
            const card = document.createElement('div');
            card.className = `order-card ${order.status}`;

            const statusMap = { 'pending': '待接单', 'accepted': '进行中', 'delivered': '待收货', 'completed': '已完成', 'cancelled': '已撤回' };

            const rel = getBuildingRelation(order.buildingTag, userBuilding);

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="badge ${order.status}">${statusMap[order.status]}</span>
                    <span style="color: #f43f5e; font-weight: 800; font-size: 1.2rem;">${order.reward}</span>
                </div>
                <div class="order-body">
                    <h3>${order.package}</h3>
                    <div class="info-row"><i class="fas fa-map-marker-alt"></i> <span>${order.pickup}</span></div>
                    <div class="info-row"><i class="fas fa-door-open"></i> <span>送至: ${order.delivery}</span></div>
                    <div class="info-row">
                        <i class="fas fa-building"></i>
                        <span>${order.buildingTag || '-'}</span>
                        ${rel.label ? `<span class="building-tag-badge ${rel.cls}"><i class="fas fa-map-pin"></i> ${rel.label}</span>` : ''}
                    </div>
                    <div class="info-row"><i class="fas fa-user-circle"></i> <span>发布人: ${order.creator}</span> ${userCertCache[order.creator] ? '<span class="cert-badge inline-badge" title="认证用户"><i class="fas fa-check-circle"></i></span>' : ''}</div>
                </div>
                <div class="order-footer">
                    ${order.status === 'pending' ?
                    `<button class="btn-primary" onclick="updateStatus(${order.id}, 'accepted')">确认接单</button>` : ''}
                </div>
            `;

            container.appendChild(card);
        });
    }

    elements.buildingSelectForm.onsubmit = async (e) => {
        e.preventDefault();
        const dorm = elements.buildingSelectDorm.value;
        if (!dorm) {
            showToast('请选择楼栋');
            return;
        }

        try {
            const resp = await fetch('/api/update_profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: currentUser.username,
                    dormBuilding: dorm
                })
            });
            if (resp.ok) {
                currentUser.dormBuilding = dorm;
                localStorage.setItem('user', JSON.stringify(currentUser));
                elements.buildingSelectModal.classList.add('hidden');
                showToast(`已设置所属楼栋：${dorm}`);
                loadMutualAid();
            } else {
                showToast('设置失败');
            }
        } catch (err) {
            showToast('设置失败');
        }
    };

    if (elements.mutualOnlyMine) {
        elements.mutualOnlyMine.onchange = () => {
            if (elements.mutualOnlyMine.checked) {
                elements.mutualBuildingSelect.value = currentUser.dormBuilding || '';
            }
            loadMutualAid();
        };
    }

    if (elements.mutualBuildingSelect) {
        elements.mutualBuildingSelect.onchange = () => {
            elements.mutualOnlyMine.checked = false;
            loadMutualAid();
        };
    }

    // --- Event Calendar Functions ---
    async function fetchAllEvents() {
        try {
            const resp = await fetch('/api/events');
            allEvents = await resp.json();
            return allEvents;
        } catch (err) {
            console.error('Failed to fetch events:', err);
            allEvents = [];
            return [];
        }
    }

    async function fetchUserSubscriptions() {
        if (!currentUser) return [];
        try {
            const resp = await fetch(`/api/subscriptions?username=${encodeURIComponent(currentUser.username)}`);
            userSubscriptions = await resp.json();
            return userSubscriptions;
        } catch (err) {
            console.error('Failed to fetch subscriptions:', err);
            userSubscriptions = [];
            return [];
        }
    }

    function isUserSubscribedToType(eventType) {
        return userSubscriptions.some(s => s.eventType === eventType);
    }

    function getEventsByDate(dateStr) {
        return allEvents.filter(e => e.date === dateStr);
    }

    function formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function parseDate(dateStr) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    function getDaysDiff(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        return Math.round((d2 - d1) / oneDay);
    }

    // --- Event Banners (Dashboard) ---
    async function loadEventBanners() {
        if (!elements.eventBannerContainer) return;

        await Promise.all([fetchAllEvents(), fetchUserSubscriptions()]);

        const today = new Date();
        const upcomingEvents = allEvents
            .filter(e => {
                const eventDate = parseDate(e.date);
                const diff = getDaysDiff(today, eventDate);
                return diff >= 0 && diff <= 3 && isUserSubscribedToType(e.type);
            })
            .sort((a, b) => {
                const da = parseDate(a.date);
                const db = parseDate(b.date);
                return da - db;
            })
            .slice(0, 3);

        if (upcomingEvents.length === 0) {
            elements.eventBannerContainer.innerHTML = '';
            elements.eventBannerContainer.style.display = 'none';
            return;
        }

        elements.eventBannerContainer.style.display = 'block';
        let html = '';

        upcomingEvents.forEach(event => {
            const typeInfo = EVENT_TYPE_INFO[event.type] || EVENT_TYPE_INFO.other;
            const eventDate = parseDate(event.date);
            const diff = getDaysDiff(today, eventDate);
            let timeLabel = '';
            if (diff === 0) timeLabel = '今天';
            else if (diff === 1) timeLabel = '明天';
            else timeLabel = `${diff}天后`;

            html += `
                <div class="event-banner event-banner-${event.type}">
                    <div class="event-banner-icon">
                        <i class="fas ${typeInfo.icon}"></i>
                    </div>
                    <div class="event-banner-content">
                        <div class="event-banner-title">
                            <span class="event-banner-tag">${typeInfo.label}</span>
                            ${event.title}
                        </div>
                        <div class="event-banner-desc">
                            <i class="fas fa-calendar-day"></i> ${event.date}（${timeLabel}）
                            <span style="margin-left: 12px;">${event.description.substring(0, 40)}${event.description.length > 40 ? '...' : ''}</span>
                        </div>
                    </div>
                    <button class="event-banner-close" onclick="this.parentElement.style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });

        elements.eventBannerContainer.innerHTML = html;
    }

    // --- Calendar Rendering ---
    async function loadEventCalendar() {
        await Promise.all([fetchAllEvents(), fetchUserSubscriptions()]);
        renderCalendar();
    }

    function renderCalendar() {
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        elements.calendarMonthLabel.textContent = `${year}年${month + 1}月`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startWeekday = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const today = new Date();
        let html = `
            <div class="calendar-weekday">日</div>
            <div class="calendar-weekday">一</div>
            <div class="calendar-weekday">二</div>
            <div class="calendar-weekday">三</div>
            <div class="calendar-weekday">四</div>
            <div class="calendar-weekday">五</div>
            <div class="calendar-weekday">六</div>
        `;

        for (let i = 0; i < startWeekday; i++) {
            html += `<div class="calendar-day empty"></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = formatDate(date);
            const dayEvents = getEventsByDate(dateStr);
            const isToday = isSameDay(date, today);
            const hasEvents = dayEvents.length > 0;

            let dotsHtml = '';
            if (hasEvents) {
                const displayedTypes = [...new Set(dayEvents.slice(0, 4).map(e => e.type))];
                dotsHtml = '<div class="calendar-event-dots">';
                displayedTypes.forEach(type => {
                    const color = (EVENT_TYPE_INFO[type] || EVENT_TYPE_INFO.other).color;
                    dotsHtml += `<span class="calendar-event-dot dot-${type}" style="background:${color};"></span>`;
                });
                dotsHtml += '</div>';
            }

            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-event' : ''}" 
                     data-date="${dateStr}" 
                     onclick="${hasEvents ? `showEventDetail('${dateStr}')` : ''}">
                    <span class="calendar-day-number">${day}</span>
                    ${dotsHtml}
                </div>
            `;
        }

        elements.calendarGrid.innerHTML = html;
    }

    if (elements.calendarPrevMonth) {
        elements.calendarPrevMonth.onclick = () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar();
        };
    }

    if (elements.calendarNextMonth) {
        elements.calendarNextMonth.onclick = () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar();
        };
    }

    // --- Event Detail Modal ---
    window.showEventDetail = (dateStr) => {
        const dayEvents = getEventsByDate(dateStr);
        elements.eventDetailDate.textContent = dateStr;

        if (dayEvents.length === 0) {
            elements.eventDetailList.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:20px;">当日暂无活动</div>';
        } else {
            let html = '';
            dayEvents.forEach(event => {
                const typeInfo = EVENT_TYPE_INFO[event.type] || EVENT_TYPE_INFO.other;
                html += `
                    <div class="event-detail-item event-detail-${event.type}">
                        <div class="event-detail-header">
                            <span class="event-detail-type" style="background:${typeInfo.gradient};">
                                <i class="fas ${typeInfo.icon}"></i> ${typeInfo.label}
                            </span>
                            ${currentUser && currentUser.username === 'admin' ? `
                                <div class="event-detail-actions">
                                    <button class="event-detail-edit-btn" onclick="event.stopPropagation(); openEventEditModal(${event.id})">
                                        <i class="fas fa-edit"></i> 编辑
                                    </button>
                                    <button class="event-detail-delete-btn" onclick="event.stopPropagation(); deleteEvent(${event.id})">
                                        <i class="fas fa-trash"></i> 删除
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                        <h3 class="event-detail-title">${event.title}</h3>
                        <p class="event-detail-description">${event.description}</p>
                        <div class="event-detail-meta">
                            <span><i class="fas fa-user"></i> 发布人：${event.createdBy || 'admin'}</span>
                            <span><i class="fas fa-clock"></i> ${event.createTime || '-'}</span>
                        </div>
                    </div>
                `;
            });
            elements.eventDetailList.innerHTML = html;
        }

        elements.eventDetailModal.classList.remove('hidden');
    };

    if (elements.eventDetailClose) {
        elements.eventDetailClose.onclick = () => {
            elements.eventDetailModal.classList.add('hidden');
        };
    }

    // --- Event Manage (Admin) ---
    async function loadEventManage() {
        if (!elements.eventManageList) return;
        await fetchAllEvents();

        if (allEvents.length === 0) {
            elements.eventManageList.innerHTML = '<div style="text-align:center;color:#64748b;padding:40px;">暂无活动数据</div>';
            return;
        }

        const sortedEvents = [...allEvents].sort((a, b) => {
            const da = parseDate(a.date);
            const db = parseDate(b.date);
            return db - da;
        });

        let html = '';
        sortedEvents.forEach(event => {
            const typeInfo = EVENT_TYPE_INFO[event.type] || EVENT_TYPE_INFO.other;
            html += `
                <div class="event-manage-card">
                    <div class="event-manage-header">
                        <span class="event-type-badge event-type-${event.type}" style="background:${typeInfo.gradient};">
                            <i class="fas ${typeInfo.icon}"></i> ${typeInfo.label}
                        </span>
                        <span class="event-manage-date"><i class="fas fa-calendar-day"></i> ${event.date}</span>
                    </div>
                    <h3 class="event-manage-title">${event.title}</h3>
                    <p class="event-manage-desc">${event.description}</p>
                    <div class="event-manage-actions">
                        <button class="btn-outline" onclick="openEventEditModal(${event.id})">
                            <i class="fas fa-edit"></i> 编辑
                        </button>
                        <button class="btn-outline" style="color:#ef4444;" onclick="deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                    </div>
                </div>
            `;
        });

        elements.eventManageList.innerHTML = html;
    }

    if (elements.eventAddBtn) {
        elements.eventAddBtn.onclick = () => {
            openEventEditModal(null);
        };
    }

    window.openEventEditModal = (eventId) => {
        elements.eventEditForm.reset();
        elements.eventEditId.value = eventId || '';

        if (eventId) {
            const event = allEvents.find(e => e.id === eventId);
            if (event) {
                elements.eventEditTitle.value = event.title;
                elements.eventEditDate.value = event.date;
                elements.eventEditType.value = event.type;
                elements.eventEditDesc.value = event.description;
            }
        } else {
            elements.eventEditDate.value = formatDate(new Date());
        }

        elements.eventEditModal.classList.remove('hidden');
    };

    if (elements.eventEditClose) {
        elements.eventEditClose.onclick = () => elements.eventEditModal.classList.add('hidden');
    }
    if (elements.eventEditCancel) {
        elements.eventEditCancel.onclick = () => elements.eventEditModal.classList.add('hidden');
    }

    elements.eventEditForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title: elements.eventEditTitle.value,
            date: elements.eventEditDate.value,
            type: elements.eventEditType.value,
            description: elements.eventEditDesc.value,
            created_by: currentUser.username
        };

        const eventId = elements.eventEditId.value;
        const url = eventId ? '/api/events/update' : '/api/events/create';
        if (eventId) payload.id = parseInt(eventId);

        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
            if (resp.ok && data.status === 'success') {
                showToast(eventId ? '活动已更新！' : '活动已创建！');
                elements.eventEditModal.classList.add('hidden');
                await fetchAllEvents();
                if (!document.getElementById('event-manage-tab').classList.contains('hidden')) {
                    loadEventManage();
                }
                if (!document.getElementById('event-calendar-tab').classList.contains('hidden')) {
                    renderCalendar();
                }
            } else {
                showToast(data.message || '操作失败');
            }
        } catch (err) {
            showToast('操作失败');
        }
    };

    window.deleteEvent = async (eventId) => {
        if (!confirm('确定删除该活动？')) return;
        try {
            const resp = await fetch('/api/events/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: eventId })
            });
            const data = await resp.json();
            if (resp.ok && data.status === 'success') {
                showToast('活动已删除');
                elements.eventDetailModal.classList.add('hidden');
                await fetchAllEvents();
                if (!document.getElementById('event-manage-tab').classList.contains('hidden')) {
                    loadEventManage();
                }
                if (!document.getElementById('event-calendar-tab').classList.contains('hidden')) {
                    renderCalendar();
                }
            } else {
                showToast(data.message || '删除失败');
            }
        } catch (err) {
            showToast('删除失败');
        }
    };

    // --- Subscription Modal ---
    if (elements.calendarSubscribeBtn) {
        elements.calendarSubscribeBtn.onclick = async () => {
            await fetchUserSubscriptions();
            elements.subscribeTypePeak.checked = isUserSubscribedToType('peak');
            elements.subscribeTypePromotion.checked = isUserSubscribedToType('promotion');
            elements.subscribeTypeHoliday.checked = isUserSubscribedToType('holiday');
            elements.subscribeTypeOther.checked = isUserSubscribedToType('other');
            elements.subscribeModal.classList.remove('hidden');
        };
    }

    if (elements.subscribeClose) {
        elements.subscribeClose.onclick = () => elements.subscribeModal.classList.add('hidden');
    }
    if (elements.subscribeCancel) {
        elements.subscribeCancel.onclick = () => elements.subscribeModal.classList.add('hidden');
    }

    elements.subscribeForm.onsubmit = async (e) => {
        e.preventDefault();
        const selectedTypes = [];
        if (elements.subscribeTypePeak.checked) selectedTypes.push('peak');
        if (elements.subscribeTypePromotion.checked) selectedTypes.push('promotion');
        if (elements.subscribeTypeHoliday.checked) selectedTypes.push('holiday');
        if (elements.subscribeTypeOther.checked) selectedTypes.push('other');

        try {
            const currentTypes = userSubscriptions.map(s => s.eventType);
            const toAdd = selectedTypes.filter(t => !currentTypes.includes(t));
            const toRemove = currentTypes.filter(t => !selectedTypes.includes(t));

            for (const type of toAdd) {
                await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: currentUser.username, event_type: type })
                });
            }
            for (const type of toRemove) {
                await fetch('/api/unsubscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: currentUser.username, event_type: type })
                });
            }

            await fetchUserSubscriptions();
            showToast('订阅设置已保存！');
            elements.subscribeModal.classList.add('hidden');
            if (!document.getElementById('dashboard-tab').classList.contains('hidden')) {
                loadEventBanners();
            }
        } catch (err) {
            showToast('保存失败');
        }
    };

    // --- Notifications ---
    async function loadNotifications() {
        if (!elements.notificationList) return;
        try {
            const resp = await fetch(`/api/notifications?username=${encodeURIComponent(currentUser.username)}`);
            const notifications = await resp.json();
            renderNotifications(notifications);
        } catch (err) {
            console.error('Failed to load notifications:', err);
            elements.notificationList.innerHTML = '<div style="text-align:center;color:#64748b;padding:40px;">加载失败</div>';
        }
    }

    function renderNotifications(notifications) {
        if (!notifications || notifications.length === 0) {
            elements.notificationList.innerHTML = '<div style="text-align:center;color:#64748b;padding:40px;">暂无通知</div>';
            if (elements.notificationUnreadCount) {
                elements.notificationUnreadCount.style.display = 'none';
            }
            return;
        }

        const unreadCount = notifications.filter(n => n.readFlag !== 'yes').length;
        if (elements.notificationUnreadCount) {
            if (unreadCount > 0) {
                elements.notificationUnreadCount.textContent = unreadCount > 99 ? '99+' : unreadCount;
                elements.notificationUnreadCount.style.display = 'inline-flex';
            } else {
                elements.notificationUnreadCount.style.display = 'none';
            }
        }

        const sorted = [...notifications].sort((a, b) => b.id - a.id);
        let html = '';

        sorted.forEach(notif => {
            const typeInfo = EVENT_TYPE_INFO[notif.eventType] || EVENT_TYPE_INFO.other;
            const isUnread = notif.readFlag !== 'yes';
            html += `
                <div class="notification-item ${isUnread ? 'unread' : ''}" data-id="${notif.id}" onclick="markNotificationRead(${notif.id}, this)">
                    <div class="notification-icon notification-icon-${notif.eventType}" style="background:${typeInfo.gradient};">
                        <i class="fas ${typeInfo.icon}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">
                            ${notif.eventTitle}
                            ${isUnread ? '<span class="notification-unread-dot"></span>' : ''}
                        </div>
                        <div class="notification-body">${notif.content}</div>
                        <div class="notification-meta">
                            <span><i class="fas fa-calendar-day"></i> 活动日期：${notif.eventDate}</span>
                            <span><i class="fas fa-clock"></i> ${notif.createTime || '-'}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        elements.notificationList.innerHTML = html;
    }

    window.markNotificationRead = async (id, el) => {
        try {
            await fetch('/api/notifications/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, username: currentUser.username })
            });
            if (el) {
                el.classList.remove('unread');
                const dot = el.querySelector('.notification-unread-dot');
                if (dot) dot.remove();
            }
            loadNotifications();
        } catch (err) {
            console.error('Failed to mark notification read:', err);
        }
    };

    if (elements.notificationMarkAllBtn) {
        elements.notificationMarkAllBtn.onclick = async () => {
            try {
                const resp = await fetch(`/api/notifications?username=${encodeURIComponent(currentUser.username)}`);
                const notifications = await resp.json();
                const unread = notifications.filter(n => n.readFlag !== 'yes');
                for (const n of unread) {
                    await fetch('/api/notifications/read', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: n.id, username: currentUser.username })
                    });
                }
                showToast('已全部标记为已读');
                loadNotifications();
            } catch (err) {
                showToast('操作失败');
            }
        };
    }

    // --- Weather Card (Dashboard) ---
    const WEATHER_TYPES = {
        sunny: { label: '晴', icon: 'fa-sun', iconClass: 'sunny' },
        partlyCloudy: { label: '多云', icon: 'fa-cloud-sun', iconClass: 'cloudy' },
        cloudy: { label: '阴', icon: 'fa-cloud', iconClass: 'cloudy' },
        lightRain: { label: '小雨', icon: 'fa-cloud-rain', iconClass: 'rainy' },
        heavyRain: { label: '大雨', icon: 'fa-cloud-showers-heavy', iconClass: 'rainy' },
        thunderstorm: { label: '雷阵雨', icon: 'fa-cloud-bolt', iconClass: 'rainy' },
        snow: { label: '小雪', icon: 'fa-snowflake', iconClass: 'snowy' },
        heavySnow: { label: '大雪', icon: 'fa-snowflake', iconClass: 'snowy' },
        windy: { label: '大风', icon: 'fa-wind', iconClass: 'windy' },
        hot: { label: '高温', icon: 'fa-sun', iconClass: 'hot' },
        cold: { label: '寒冷', icon: 'fa-temperature-arrow-down', iconClass: 'snowy' },
        fog: { label: '雾霾', icon: 'fa-smog', iconClass: 'foggy' }
    };

    let weatherCollapsed = localStorage.getItem('weatherCollapsed') === 'true';

    function generateMockWeather() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const hour = now.getHours();

        let possibleTypes;
        if (month >= 6 && month <= 8) {
            possibleTypes = ['sunny', 'partlyCloudy', 'cloudy', 'thunderstorm', 'lightRain', 'heavyRain', 'hot', 'fog', 'windy'];
        } else if (month === 12 || month <= 2) {
            possibleTypes = ['sunny', 'partlyCloudy', 'cloudy', 'cold', 'snow', 'heavySnow', 'fog', 'windy'];
        } else {
            possibleTypes = ['sunny', 'partlyCloudy', 'cloudy', 'lightRain', 'heavyRain', 'fog', 'windy'];
        }

        const typeKey = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
        const type = WEATHER_TYPES[typeKey];

        let temp;
        if (typeKey === 'hot') {
            temp = Math.floor(Math.random() * 6) + 33;
        } else if (typeKey === 'cold' || typeKey === 'snow' || typeKey === 'heavySnow') {
            temp = Math.floor(Math.random() * 8) - 3;
        } else if (month >= 6 && month <= 8) {
            temp = Math.floor(Math.random() * 12) + 24;
        } else if (month === 12 || month <= 2) {
            temp = Math.floor(Math.random() * 12) + 0;
        } else {
            temp = Math.floor(Math.random() * 15) + 12;
        }

        let humidity;
        if (['lightRain', 'heavyRain', 'thunderstorm'].includes(typeKey)) {
            humidity = Math.floor(Math.random() * 15) + 75;
        } else if (typeKey === 'hot' || typeKey === 'sunny') {
            humidity = Math.floor(Math.random() * 20) + 30;
        } else if (typeKey === 'fog') {
            humidity = Math.floor(Math.random() * 10) + 85;
        } else {
            humidity = Math.floor(Math.random() * 30) + 45;
        }

        let windLevel, windLabel;
        if (typeKey === 'windy' || typeKey === 'thunderstorm' || typeKey === 'heavyRain' || typeKey === 'heavySnow') {
            windLevel = Math.floor(Math.random() * 3) + 5;
            windLabel = ['5级', '6级', '7级'][windLevel - 5];
        } else {
            windLevel = Math.floor(Math.random() * 4) + 1;
            windLabel = ['1级', '2级', '3级', '4级'][windLevel - 1];
        }

        const windDirections = ['东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风', '北风'];
        const windDir = windDirections[Math.floor(Math.random() * windDirections.length)];

        return {
            typeKey,
            typeLabel: type.label,
            icon: type.icon,
            iconClass: type.iconClass,
            temperature: temp,
            humidity,
            windLevel,
            windLabel: `${windDir} ${windLabel}`
        };
    }

    function generateWeatherSuggestions(weather) {
        const suggestions = [];

        suggestions.push({
            level: 'info',
            icon: 'fa-sun',
            title: '今日天气速览',
            desc: `${weather.typeLabel}，气温${weather.temperature}°C，相对湿度${weather.humidity}%，${weather.windLabel}`
        });

        if (['lightRain', 'heavyRain', 'thunderstorm'].includes(weather.typeKey)) {
            suggestions.push({
                level: 'warn',
                icon: 'fa-umbrella',
                title: '包裹防潮提醒',
                desc: '雨天配送请携带防水袋，对纸质包裹、电子商品做好防潮保护，避免淋湿损坏。'
            });
            if (weather.typeKey === 'thunderstorm') {
                suggestions.push({
                    level: 'alert',
                    icon: 'fa-bolt',
                    title: '雷雨安全提示',
                    desc: '雷电天气请避免在空旷区域、大树下停留，注意人身安全优先于配送时效。'
                });
            }
            if (weather.typeKey === 'heavyRain') {
                suggestions.push({
                    level: 'warn',
                    icon: 'fa-shoe-prints',
                    title: '出行注意防滑',
                    desc: '地面积水较多，请穿着防滑鞋，小心路滑，低速通过积水区域。'
                });
            }
        }

        if (weather.typeKey === 'hot' || weather.temperature >= 32) {
            suggestions.push({
                level: 'warn',
                icon: 'fa-sun',
                title: '避免包裹暴晒',
                desc: '高温天气请勿将包裹长时间置于阳光下，食品、化妆品、电子类商品注意遮阳。'
            });
            suggestions.push({
                level: 'safe',
                icon: 'fa-bottle-water',
                title: '防暑降温建议',
                desc: '配送途中及时补充水分，备好防暑用品，合理安排休息避免中暑。'
            });
        }

        if (weather.temperature <= 3 || weather.typeKey === 'cold') {
            suggestions.push({
                level: 'info',
                icon: 'fa-mitten',
                title: '防寒保暖提示',
                desc: '气温较低，配送时注意佩戴手套、围巾，做好防寒保暖措施。'
            });
        }

        if (['snow', 'heavySnow'].includes(weather.typeKey)) {
            suggestions.push({
                level: 'alert',
                icon: 'fa-person-walking',
                title: '雪天路滑小心',
                desc: '路面结冰湿滑，请减速慢行，上下楼梯注意防滑，确保人身及包裹安全。'
            });
            if (weather.typeKey === 'heavySnow') {
                suggestions.push({
                    level: 'warn',
                    icon: 'fa-box',
                    title: '包裹防湿防冻',
                    desc: '大雪天请用防水袋包裹商品，怕冻物品（如生鲜、液态）做好保温措施。'
                });
            }
        }

        if (weather.typeKey === 'windy' || weather.windLevel >= 5) {
            suggestions.push({
                level: 'warn',
                icon: 'fa-box-open',
                title: '轻件固定提醒',
                desc: '大风天气请将小件、轻质包裹固定好，避免途中被风吹落或吹散。'
            });
            suggestions.push({
                level: 'alert',
                icon: 'fa-triangle-exclamation',
                title: '高空坠物风险',
                desc: '注意避开广告牌、树木、临时搭建物等易被风吹落的区域，谨防高空坠物。'
            });
        }

        if (weather.typeKey === 'fog') {
            suggestions.push({
                level: 'warn',
                icon: 'fa-eye',
                title: '低能见度注意',
                desc: '雾霾天气能见度低，穿越道路请减速观察，注意来往车辆，确保交通安全。'
            });
            suggestions.push({
                level: 'info',
                icon: 'fa-face-mask',
                title: '防护用品建议',
                desc: '空气质量较差，请佩戴口罩做好防护，减少长时间户外停留。'
            });
        }

        if (weather.humidity >= 80) {
            suggestions.push({
                level: 'info',
                icon: 'fa-droplet',
                title: '高湿度防潮建议',
                desc: '空气湿度较大，建议对衣物、纸质文件、数码产品等包裹做好防潮封装。'
            });
        }

        if (suggestions.length === 1) {
            suggestions.push({
                level: 'safe',
                icon: 'fa-circle-check',
                title: '配送条件良好',
                desc: '今日天气状况良好，适合配送，请注意交通安全，祝您好运连连！'
            });
        }

        return suggestions;
    }

    async function fetchWeatherData() {
        try {
            const resp = await fetch('/api/weather');
            if (resp.ok) {
                const data = await resp.json();
                if (data && data.typeKey && WEATHER_TYPES[data.typeKey]) {
                    const t = WEATHER_TYPES[data.typeKey];
                    return {
                        typeKey: data.typeKey,
                        typeLabel: t.label,
                        icon: t.icon,
                        iconClass: t.iconClass,
                        temperature: data.temperature ?? 25,
                        humidity: data.humidity ?? 60,
                        windLevel: data.windLevel ?? 2,
                        windLabel: data.windLabel || '东风 2级'
                    };
                }
            }
        } catch (e) {
            // Fallback to mock data
        }
        return generateMockWeather();
    }

    let currentWeather = null;

    async function loadWeatherCard() {
        if (!elements.weatherCardContainer) return;

        currentWeather = await fetchWeatherData();
        const suggestions = generateWeatherSuggestions(currentWeather);

        const summaryText = `${currentWeather.typeLabel} · ${currentWeather.temperature}°C · ${currentWeather.humidity}% · ${currentWeather.windLabel}`;

        const suggestionsHTML = suggestions.map(s => `
            <div class="weather-suggestion-item">
                <div class="weather-suggestion-icon ${s.level}">
                    <i class="fas ${s.icon}"></i>
                </div>
                <div class="weather-suggestion-text">
                    <div class="weather-suggestion-title">${s.title}</div>
                    <div class="weather-suggestion-desc">${s.desc}</div>
                </div>
            </div>
        `).join('');

        const html = `
            <div class="weather-card ${weatherCollapsed ? 'collapsed' : ''}" id="weather-card-el">
                <div class="weather-card-header" id="weather-card-toggle">
                    <div class="weather-card-icon ${currentWeather.iconClass}">
                        <i class="fas ${currentWeather.icon}"></i>
                    </div>
                    <div class="weather-info-main">
                        <div class="weather-temperature">
                            <span class="weather-temp-value">${currentWeather.temperature}</span>
                            <span class="weather-temp-unit">°C</span>
                        </div>
                        <div class="weather-condition">${currentWeather.typeLabel}</div>
                        <div class="weather-summary-line">
                            <span class="weather-meta-item"><i class="fas fa-droplet"></i> 湿度 ${currentWeather.humidity}%</span>
                            <span class="weather-meta-item"><i class="fas fa-wind"></i> ${currentWeather.windLabel}</span>
                        </div>
                    </div>
                    <div class="weather-collapsed-summary">
                        <span>${currentWeather.typeLabel} ${currentWeather.temperature}°C</span>
                        <span style="color: #94a3b8; font-size: 0.85rem;">·</span>
                        <span style="color: #94a3b8; font-size: 0.85rem; font-weight: 500;">配送建议${suggestions.length}条</span>
                    </div>
                    <button class="weather-toggle-btn" title="${weatherCollapsed ? '展开' : '折叠'}">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="weather-card-body">
                    <div class="weather-suggestions-title">
                        <i class="fas fa-lightbulb"></i> 今日配送建议
                    </div>
                    <div class="weather-suggestions-list">
                        ${suggestionsHTML}
                    </div>
                </div>
            </div>
        `;

        elements.weatherCardContainer.innerHTML = html;

        const toggleEl = document.getElementById('weather-card-toggle');
        if (toggleEl) {
            toggleEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const cardEl = document.getElementById('weather-card-el');
                if (cardEl) {
                    weatherCollapsed = !weatherCollapsed;
                    cardEl.classList.toggle('collapsed', weatherCollapsed);
                    localStorage.setItem('weatherCollapsed', String(weatherCollapsed));
                    const btn = toggleEl.querySelector('.weather-toggle-btn');
                    if (btn) {
                        btn.title = weatherCollapsed ? '展开' : '折叠';
                    }
                }
            });
        }
    }

    // Init
    updateUIForLogin();
});
