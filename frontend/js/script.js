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
        calcSavedList: document.getElementById('calc-saved-list')
    };

    let auditFilter = 'pending';
    const userBlacklistCache = {};

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

            if (tab === 'dashboard') fetchOrders();
            if (tab === 'my-orders') fetchMyOrders();
            if (tab === 'profile') loadProfile();
            if (tab === 'cert-apply') loadCertApplyForm();
            if (tab === 'cert-record') loadCertRecords();
            if (tab === 'leaderboard') loadLeaderboard();
            if (tab === 'cert-audit') loadAuditList();
            if (tab === 'blacklist') loadBlacklist();
            if (tab === 'price-calc') loadPriceCalculator();
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
                ${order.creator !== currentUser.username || (order.worker && order.worker !== currentUser.username) ? `
                <div class="card-actions">
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
                </div>` : ''}
            `;
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
        elements.profileModal.classList.remove('hidden');
    };

    elements.accountSecBtn.onclick = () => {
        elements.editPassword.value = '';
        elements.securityModal.classList.remove('hidden');
    };

    elements.profileForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            username: currentUser.username,
            realName: elements.editRealname.value,
            major: elements.editMajor.value
        };
        try {
            const resp = await fetch('/api/update_profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (resp.ok) {
                currentUser.realName = payload.realName;
                currentUser.major = payload.major;
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

    // Init
    updateUIForLogin();
});
