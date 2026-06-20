const Api = (() => {
    async function request(url, options = {}) {
        const resp = await fetch(url, options);
        return resp;
    }

    async function requestJSON(url, options = {}) {
        const resp = await request(url, options);
        const data = await resp.json();
        return { resp, data };
    }

    async function login(username, password) {
        return requestJSON('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
    }

    async function register(payload) {
        return requestJSON('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    async function getUser(username) {
        return requestJSON(`/api/user?username=${encodeURIComponent(username)}`);
    }

    async function getUsers() {
        return requestJSON('/api/users');
    }

    async function updateProfile(payload) {
        return requestJSON('/api/update_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    async function getOrders(params = {}) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
            if (v) query.append(k, v);
        });
        const qs = query.toString();
        return requestJSON(`/api/orders${qs ? `?${qs}` : ''}`);
    }

    async function getNearbyOrders(building, range) {
        return requestJSON(`/api/orders/nearby?building=${encodeURIComponent(building)}&range=${range}`);
    }

    async function createOrder(payload) {
        return requestJSON('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    async function updateOrderStatus(id, status, worker) {
        return requestJSON('/api/update_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status, worker })
        });
    }

    async function getCertApps(username) {
        const url = username
            ? `/api/cert/apps?username=${encodeURIComponent(username)}`
            : '/api/cert/apps';
        return requestJSON(url);
    }

    async function getCertAppsByStatus(status) {
        const url = status
            ? `/api/cert/apps?status=${encodeURIComponent(status)}`
            : '/api/cert/apps';
        return requestJSON(url);
    }

    async function submitCert(payload) {
        return requestJSON('/api/cert/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    async function auditCert(payload) {
        return requestJSON('/api/cert/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    async function getBlacklist(blocker) {
        return requestJSON(`/api/blacklist?blocker=${encodeURIComponent(blocker)}`);
    }

    async function addToBlacklist(blocker, blocked) {
        return requestJSON('/api/blacklist/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blocker, blocked })
        });
    }

    async function removeFromBlacklist(payload) {
        return requestJSON('/api/blacklist/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    async function getEvents() {
        return requestJSON('/api/events');
    }

    async function createEvent(payload) {
        return requestJSON('/api/events/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    async function updateEvent(payload) {
        return requestJSON('/api/events/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    async function deleteEvent(id) {
        return requestJSON('/api/events/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
    }

    async function getSubscriptions(username) {
        return requestJSON(`/api/subscriptions?username=${encodeURIComponent(username)}`);
    }

    async function subscribe(username, eventType) {
        return requestJSON('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, event_type: eventType })
        });
    }

    async function unsubscribe(username, eventType) {
        return requestJSON('/api/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, event_type: eventType })
        });
    }

    async function getNotifications(username) {
        return requestJSON(`/api/notifications?username=${encodeURIComponent(username)}`);
    }

    async function markNotificationRead(id, username) {
        return requestJSON('/api/notifications/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, username })
        });
    }

    async function getWeather() {
        return requestJSON('/api/weather');
    }

    async function getUnreadMsgCount(username) {
        return requestJSON(`/api/messages/unread?username=${encodeURIComponent(username)}`);
    }

    async function getConversations(username) {
        return requestJSON(`/api/messages/conversations?username=${encodeURIComponent(username)}`);
    }

    async function getThreadMessages(threadId) {
        return requestJSON(`/api/messages?threadId=${threadId}`);
    }

    async function markThreadRead(threadId, username) {
        return requestJSON('/api/messages/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ threadId, username })
        });
    }

    async function sendMessage(sender, receiver, content) {
        return requestJSON('/api/messages/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender, receiver, content })
        });
    }

    async function getStats(range) {
        return requestJSON(`/api/stats?range=${range}`);
    }

    return {
        login,
        register,
        getUser,
        getUsers,
        updateProfile,
        getOrders,
        getNearbyOrders,
        createOrder,
        updateOrderStatus,
        getCertApps,
        getCertAppsByStatus,
        submitCert,
        auditCert,
        getBlacklist,
        addToBlacklist,
        removeFromBlacklist,
        getEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        getSubscriptions,
        subscribe,
        unsubscribe,
        getNotifications,
        markNotificationRead,
        getWeather,
        getUnreadMsgCount,
        getConversations,
        getThreadMessages,
        markThreadRead,
        sendMessage,
        getStats
    };
})();
