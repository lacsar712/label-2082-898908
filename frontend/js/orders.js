const Orders = (() => {
    const STATUS_MAP = {
        'pending': '待接单',
        'accepted': '进行中',
        'delivered': '待收货',
        'completed': '已完成',
        'cancelled': '已撤回'
    };

    let elements = {};
    let showToast = () => {};
    let openChatWith = () => {};
    let openRouteFromOrder = () => {};
    let toggleBlacklist = () => {};

    function init(deps) {
        elements = deps.elements || {};
        showToast = deps.showToast || showToast;
        openChatWith = deps.openChatWith || openChatWith;
        openRouteFromOrder = deps.openRouteFromOrder || openRouteFromOrder;
        toggleBlacklist = deps.toggleBlacklist || toggleBlacklist;

        bindContainerEvents();
    }

    function bindContainerEvents() {
        if (elements.orderList) {
            elements.orderList.addEventListener('click', handleOrderCardClick);
        }
        if (elements.myOrdersList) {
            elements.myOrdersList.addEventListener('click', handleOrderCardClick);
        }
        if (elements.mutualAidList) {
            elements.mutualAidList.addEventListener('click', handleOrderCardClick);
        }
    }

    function handleOrderCardClick(e) {
        const target = e.target;
        const card = target.closest('.order-card');
        if (!card) return;

        const statusBtn = target.closest('[data-action="update-status"]');
        if (statusBtn) {
            e.stopPropagation();
            const orderId = parseInt(statusBtn.dataset.orderId);
            const newStatus = statusBtn.dataset.status;
            handleUpdateStatus(orderId, newStatus);
            return;
        }

        const chatBtn = target.closest('[data-action="chat"]');
        if (chatBtn) {
            e.stopPropagation();
            const username = chatBtn.dataset.username;
            openChatWith(username);
            return;
        }

        const blacklistBtn = target.closest('[data-action="blacklist"]');
        if (blacklistBtn) {
            e.stopPropagation();
            const username = blacklistBtn.dataset.username;
            toggleBlacklist(username, blacklistBtn);
            return;
        }

        const routeBtn = target.closest('[data-action="view-route"]');
        if (routeBtn) {
            e.stopPropagation();
            const orderData = {
                pickup: routeBtn.dataset.pickup,
                delivery: routeBtn.dataset.delivery,
                package: routeBtn.dataset.packageName,
                status: routeBtn.dataset.status
            };
            openRouteFromOrder(orderData);
            return;
        }
    }

    async function handleUpdateStatus(id, status) {
        const user = AppState.getUser();
        if (!user) return;

        try {
            const { resp, data } = await Api.updateOrderStatus(id, status, user.username);
            if (!resp.ok) {
                showToast(data.message || '操作失败，请重试');
                return;
            }

            if (status === 'accepted') showToast('接单成功，请尽快送达！');
            else if (status === 'delivered') showToast('已送达，等待发单人确认。');
            else if (status === 'completed') showToast('任务完成，感谢使用！');
            else if (status === 'cancelled') showToast('已成功撤回该订单。');

            if (document.getElementById('dashboard-tab').classList.contains('hidden')) {
                fetchMyOrders();
            } else {
                fetchOrders();
            }
        } catch (err) {
            showToast('操作失败');
        }
    }

    async function fetchOrders() {
        try {
            const filter = AppState.getFilter();
            const [ordersResult, usersResult] = await Promise.all([
                Api.getOrders({ category: filter }),
                Api.getUsers()
            ]);
            const orders = ordersResult.data;
            const users = usersResult.data;

            users.forEach(u => {
                AppState.setUserCert(u.username, u.certified === 'yes');
            });

            renderOrders(orders, elements.orderList);
            if (elements.activeCount) {
                elements.activeCount.textContent = orders.filter(o => o.status !== 'completed').length;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchMyOrders() {
        try {
            const user = AppState.getUser();
            if (!user) return;

            const view = AppState.getMyOrdersView();
            const params = view === 'created'
                ? { creator: user.username }
                : { worker: user.username };

            const [ordersResult, usersResult] = await Promise.all([
                Api.getOrders(params),
                Api.getUsers()
            ]);
            const orders = ordersResult.data;
            const users = usersResult.data;

            users.forEach(u => {
                AppState.setUserCert(u.username, u.certified === 'yes');
            });

            renderOrders(orders, elements.myOrdersList, true);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchMutualAidOrders() {
        const user = AppState.getUser();
        if (!user) return [];

        const onlyMine = elements.mutualOnlyMine?.checked;
        const selectedBuilding = elements.mutualBuildingSelect?.value || user.dormBuilding;
        const range = onlyMine ? 0 : 1;
        const targetBuilding = onlyMine ? user.dormBuilding : selectedBuilding;

        try {
            const [ordersResult, usersResult] = await Promise.all([
                Api.getNearbyOrders(targetBuilding, range),
                Api.getUsers()
            ]);
            const orders = ordersResult.data;
            const users = usersResult.data;

            users.forEach(u => {
                AppState.setUserCert(u.username, u.certified === 'yes');
            });

            return orders.filter(o => o.creator !== user.username);
        } catch (err) {
            console.error('Failed to load mutual aid orders:', err);
            return [];
        }
    }

    function renderOrders(orders, container, isMyOrders = false) {
        if (!container) return;
        container.innerHTML = '';

        let displayOrders = orders;
        if (!isMyOrders) {
            const user = AppState.getUser();
            displayOrders = orders.filter(o => o.status === 'pending' && o.creator !== user?.username);
        }

        if (displayOrders.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">暂无订单数据</div>';
            return;
        }

        const frag = document.createDocumentFragment();
        displayOrders.forEach(order => {
            const card = createOrderCard(order, isMyOrders);
            frag.appendChild(card);
        });
        container.appendChild(frag);
    }

    function createOrderCard(order, isMyOrders) {
        const user = AppState.getUser();
        const card = document.createElement('div');
        card.className = `order-card ${order.status}`;

        card.appendChild(createCardHeader(order));
        card.appendChild(createCardBody(order));
        card.appendChild(createCardFooter(order, isMyOrders, user));
        card.appendChild(createCardActions(order, isMyOrders, user));

        return card;
    }

    function createCardHeader(order) {
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';

        const badge = document.createElement('span');
        badge.className = `badge ${order.status}`;
        badge.textContent = STATUS_MAP[order.status] || order.status;

        const reward = document.createElement('span');
        reward.style.color = '#f43f5e';
        reward.style.fontWeight = '800';
        reward.style.fontSize = '1.2rem';
        reward.textContent = order.reward;

        header.appendChild(badge);
        header.appendChild(reward);
        return header;
    }

    function createCardBody(order) {
        const body = document.createElement('div');
        body.className = 'order-body';

        const h3 = document.createElement('h3');
        h3.textContent = order.package;
        body.appendChild(h3);

        body.appendChild(createInfoRow('fa-map-marker-alt', order.pickup));
        body.appendChild(createInfoRow('fa-door-open', `送至: ${order.delivery}`));

        const creatorRow = document.createElement('div');
        creatorRow.className = 'info-row';
        const creatorIcon = document.createElement('i');
        creatorIcon.className = 'fas fa-user-circle';
        const creatorText = document.createElement('span');
        creatorText.textContent = `发布人: ${order.creator}`;
        creatorRow.appendChild(creatorIcon);
        creatorRow.appendChild(creatorText);
        if (AppState.getUserCert(order.creator)) {
            creatorRow.appendChild(createInlineCertBadge('认证用户'));
        }
        body.appendChild(creatorRow);

        if (order.worker) {
            const workerRow = document.createElement('div');
            workerRow.className = 'info-row';
            const workerIcon = document.createElement('i');
            workerIcon.className = 'fas fa-hands-helping';
            const workerText = document.createElement('span');
            workerText.textContent = `接单人: ${order.worker}`;
            workerRow.appendChild(workerIcon);
            workerRow.appendChild(workerText);
            if (AppState.getUserCert(order.worker)) {
                workerRow.appendChild(createInlineCertBadge('认证跑腿员'));
            }
            body.appendChild(workerRow);
        }

        return body;
    }

    function createInfoRow(iconClass, text) {
        const row = document.createElement('div');
        row.className = 'info-row';
        const icon = document.createElement('i');
        icon.className = `fas ${iconClass}`;
        const span = document.createElement('span');
        span.textContent = text;
        row.appendChild(icon);
        row.appendChild(span);
        return row;
    }

    function createInlineCertBadge(title) {
        const badge = document.createElement('span');
        badge.className = 'cert-badge inline-badge';
        badge.title = title;
        badge.innerHTML = '<i class="fas fa-check-circle"></i>';
        return badge;
    }

    function createCardFooter(order, isMyOrders, user) {
        const footer = document.createElement('div');
        footer.className = 'order-footer';

        if (!isMyOrders && order.status === 'pending') {
            footer.appendChild(createStatusBtn(order.id, 'accepted', '确认接单', 'btn-primary'));
        }

        if (isMyOrders && AppState.getMyOrdersView() === 'accepted' && order.status === 'accepted') {
            footer.appendChild(createStatusBtn(order.id, 'delivered', '确认送达', 'btn-primary'));
        }

        if (isMyOrders && AppState.getMyOrdersView() === 'created' && (order.status === 'accepted' || order.status === 'delivered')) {
            const btn = createStatusBtn(order.id, 'completed', '确认收货并支付 / 评价', 'btn-primary');
            btn.style.background = 'var(--accent)';
            btn.style.color = '#fff';
            footer.appendChild(btn);
        }

        if (isMyOrders && AppState.getMyOrdersView() === 'created' && order.status === 'pending') {
            const btn = createStatusBtn(order.id, 'cancelled', '', 'btn-outline');
            btn.style.color = '#ef4444';
            btn.innerHTML = '<i class="fas fa-undo"></i> 撤回发布';
            footer.appendChild(btn);
        }

        return footer;
    }

    function createStatusBtn(orderId, status, text, className) {
        const btn = document.createElement('button');
        btn.className = className;
        btn.textContent = text;
        btn.dataset.action = 'update-status';
        btn.dataset.orderId = orderId;
        btn.dataset.status = status;
        return btn;
    }

    function createCardActions(order, isMyOrders, user) {
        const actions = document.createElement('div');
        actions.className = 'card-actions';

        actions.appendChild(createRouteBtn(order));

        const canShowCreatorActions = order.creator !== user?.username;
        const canShowWorkerActions = order.worker && order.worker !== user?.username;
        const canShowMyCreatedWorkerActions = isMyOrders && order.creator === user?.username && order.worker && order.worker !== user?.username;
        const canShowMyAcceptedCreatorActions = isMyOrders && order.worker === user?.username && order.creator !== user?.username;

        if (canShowCreatorActions) {
            actions.appendChild(createChatBtn(order.creator, '私信发布人'));
            actions.appendChild(createBlacklistBtn(order.creator, '发布人'));
        }

        if (canShowWorkerActions) {
            actions.appendChild(createChatBtn(order.worker, '私信接单人'));
            actions.appendChild(createBlacklistBtn(order.worker, '接单人'));
        }

        if (canShowMyCreatedWorkerActions) {
            actions.appendChild(createChatBtn(order.worker, '私信接单人'));
        }

        if (canShowMyAcceptedCreatorActions) {
            actions.appendChild(createChatBtn(order.creator, '私信发布人'));
        }

        return actions;
    }

    function createRouteBtn(order) {
        const btn = document.createElement('button');
        btn.className = 'block-action-btn view-route-btn';
        btn.dataset.action = 'view-route';
        btn.dataset.pickup = order.pickup;
        btn.dataset.delivery = order.delivery;
        btn.dataset.packageName = order.package;
        btn.dataset.status = order.status;
        btn.innerHTML = '<i class="fas fa-route"></i> 查看路线';
        return btn;
    }

    function createChatBtn(username, label) {
        const btn = document.createElement('button');
        btn.className = 'msg-pm-btn';
        btn.dataset.action = 'chat';
        btn.dataset.username = username;
        btn.innerHTML = `<i class="fas fa-comment-dots"></i> ${label}`;
        return btn;
    }

    function createBlacklistBtn(username, roleLabel) {
        const isBlocked = AppState.isUserBlacklisted(username);
        const btn = document.createElement('button');
        btn.className = `block-action-btn ${isBlocked ? 'blocked' : ''}`;
        btn.dataset.action = 'blacklist';
        btn.dataset.username = username;
        if (isBlocked) {
            btn.innerHTML = `<i class="fas fa-check"></i> 已拉黑${roleLabel}`;
        } else {
            btn.innerHTML = `<i class="fas fa-ban"></i> 拉黑${roleLabel}`;
        }
        return btn;
    }

    function renderMutualAidOrders(orders, userBuilding, container) {
        if (!container) return;
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">暂无附近楼栋的待接单任务</div>';
            return;
        }

        const sorted = [...orders].sort((a, b) => (a.buildingDist || 99) - (b.buildingDist || 99));

        const frag = document.createDocumentFragment();
        sorted.forEach(order => {
            const card = createMutualAidCard(order, userBuilding);
            frag.appendChild(card);
        });
        container.appendChild(frag);
    }

    function createMutualAidCard(order, userBuilding) {
        const card = document.createElement('div');
        card.className = `order-card ${order.status}`;

        card.appendChild(createCardHeader(order));

        const body = document.createElement('div');
        body.className = 'order-body';

        const h3 = document.createElement('h3');
        h3.textContent = order.package;
        body.appendChild(h3);

        body.appendChild(createInfoRow('fa-map-marker-alt', order.pickup));
        body.appendChild(createInfoRow('fa-door-open', `送至: ${order.delivery}`));

        const buildingRow = document.createElement('div');
        buildingRow.className = 'info-row';
        const buildingIcon = document.createElement('i');
        buildingIcon.className = 'fas fa-building';
        const buildingText = document.createElement('span');
        buildingText.textContent = order.buildingTag || '-';
        buildingRow.appendChild(buildingIcon);
        buildingRow.appendChild(buildingText);

        const rel = getBuildingRelation(order.buildingTag, userBuilding);
        if (rel.label) {
            const tagBadge = document.createElement('span');
            tagBadge.className = `building-tag-badge ${rel.cls}`;
            tagBadge.innerHTML = `<i class="fas fa-map-pin"></i> ${rel.label}`;
            buildingRow.appendChild(tagBadge);
        }
        body.appendChild(buildingRow);

        const creatorRow = document.createElement('div');
        creatorRow.className = 'info-row';
        const creatorIcon = document.createElement('i');
        creatorIcon.className = 'fas fa-user-circle';
        const creatorText = document.createElement('span');
        creatorText.textContent = `发布人: ${order.creator}`;
        creatorRow.appendChild(creatorIcon);
        creatorRow.appendChild(creatorText);
        if (AppState.getUserCert(order.creator)) {
            creatorRow.appendChild(createInlineCertBadge('认证用户'));
        }
        body.appendChild(creatorRow);

        card.appendChild(body);

        const footer = document.createElement('div');
        footer.className = 'order-footer';
        if (order.status === 'pending') {
            footer.appendChild(createStatusBtn(order.id, 'accepted', '确认接单', 'btn-primary'));
        }
        card.appendChild(footer);

        return card;
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

    return {
        init,
        fetchOrders,
        fetchMyOrders,
        fetchMutualAidOrders,
        renderOrders,
        renderMutualAidOrders,
        handleUpdateStatus,
        getBuildingRelation,
        parseBuildingNum
    };
})();
