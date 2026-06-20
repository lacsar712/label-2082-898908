const AppState = (() => {
    let currentUser = JSON.parse(localStorage.getItem('user')) || null;
    let currentFilter = '';
    let myOrdersView = 'created';
    let auditFilter = 'pending';
    let currentMsgThread = null;
    let currentMsgPeer = null;
    let currentCalendarDate = new Date();
    let allEvents = [];
    let userSubscriptions = [];
    let currentRouteType = 'fastest';
    let currentRouteOrder = null;
    let currentStatsRange = 'week';
    let weatherCollapsed = localStorage.getItem('weatherCollapsed') === 'true';
    let currentWeather = null;
    let msgPollInterval = null;

    const userCertCache = {};
    const userBlacklistCache = {};
    const userRealNameCache = {};
    const msgDrafts = JSON.parse(localStorage.getItem('msg_drafts') || '{}');

    const EVENT_TYPE_INFO = {
        peak: { label: '快递高峰', icon: 'fa-boxes', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f97316)' },
        promotion: { label: '驿站促销', icon: 'fa-tags', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
        holiday: { label: '寒暑假提醒', icon: 'fa-plane-departure', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
        other: { label: '其他活动', icon: 'fa-calendar-star', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }
    };

    function getUser() {
        return currentUser;
    }

    function setUser(user) {
        currentUser = user;
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }

    function updateUser(partial) {
        if (currentUser) {
            currentUser = { ...currentUser, ...partial };
            localStorage.setItem('user', JSON.stringify(currentUser));
        }
    }

    function getFilter() {
        return currentFilter;
    }

    function setFilter(filter) {
        currentFilter = filter;
    }

    function getMyOrdersView() {
        return myOrdersView;
    }

    function setMyOrdersView(view) {
        myOrdersView = view;
    }

    function getAuditFilter() {
        return auditFilter;
    }

    function setAuditFilter(filter) {
        auditFilter = filter;
    }

    function getCurrentMsgThread() {
        return currentMsgThread;
    }

    function setCurrentMsgThread(threadId) {
        currentMsgThread = threadId;
    }

    function getCurrentMsgPeer() {
        return currentMsgPeer;
    }

    function setCurrentMsgPeer(peer) {
        currentMsgPeer = peer;
    }

    function getCalendarDate() {
        return currentCalendarDate;
    }

    function getAllEvents() {
        return allEvents;
    }

    function setAllEvents(events) {
        allEvents = events;
    }

    function getUserSubscriptions() {
        return userSubscriptions;
    }

    function setUserSubscriptions(subs) {
        userSubscriptions = subs;
    }

    function getRouteType() {
        return currentRouteType;
    }

    function setRouteType(type) {
        currentRouteType = type;
    }

    function getRouteOrder() {
        return currentRouteOrder;
    }

    function setRouteOrder(order) {
        currentRouteOrder = order;
    }

    function getStatsRange() {
        return currentStatsRange;
    }

    function setStatsRange(range) {
        currentStatsRange = range;
    }

    function isWeatherCollapsed() {
        return weatherCollapsed;
    }

    function toggleWeatherCollapsed() {
        weatherCollapsed = !weatherCollapsed;
        localStorage.setItem('weatherCollapsed', String(weatherCollapsed));
        return weatherCollapsed;
    }

    function getCurrentWeather() {
        return currentWeather;
    }

    function setCurrentWeather(weather) {
        currentWeather = weather;
    }

    function getMsgPollInterval() {
        return msgPollInterval;
    }

    function setMsgPollInterval(interval) {
        msgPollInterval = interval;
    }

    function clearMsgPollInterval() {
        if (msgPollInterval) {
            clearInterval(msgPollInterval);
            msgPollInterval = null;
        }
    }

    function getUserCertCache() {
        return userCertCache;
    }

    function setUserCert(username, isCertified) {
        userCertCache[username] = isCertified;
    }

    function getUserCert(username) {
        return userCertCache[username];
    }

    function getUserBlacklistCache() {
        return userBlacklistCache;
    }

    function setUserBlacklist(username, value) {
        if (value) {
            userBlacklistCache[username] = value;
        } else {
            delete userBlacklistCache[username];
        }
    }

    function isUserBlacklisted(username) {
        return !!userBlacklistCache[username];
    }

    function clearUserBlacklistCache() {
        for (const key of Object.keys(userBlacklistCache)) {
            delete userBlacklistCache[key];
        }
    }

    function getUserRealNameCache() {
        return userRealNameCache;
    }

    function setUserRealName(username, realName) {
        userRealNameCache[username] = realName;
    }

    function getUserRealName(username) {
        return userRealNameCache[username];
    }

    function getMsgDrafts() {
        return msgDrafts;
    }

    function setMsgDraft(threadId, content) {
        msgDrafts[threadId] = content;
        localStorage.setItem('msg_drafts', JSON.stringify(msgDrafts));
    }

    function deleteMsgDraft(threadId) {
        delete msgDrafts[threadId];
        localStorage.setItem('msg_drafts', JSON.stringify(msgDrafts));
    }

    function getMsgDraft(threadId) {
        return msgDrafts[threadId];
    }

    function getSavedSchemes() {
        if (!currentUser) return [];
        const key = `price_schemes_${currentUser.username}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    function saveSchemes(schemes) {
        if (!currentUser) return;
        const key = `price_schemes_${currentUser.username}`;
        localStorage.setItem(key, JSON.stringify(schemes));
    }

    function isAdmin() {
        return currentUser && currentUser.username === 'admin';
    }

    function isUserSubscribedToType(eventType) {
        return userSubscriptions.some(s => s.eventType === eventType);
    }

    return {
        EVENT_TYPE_INFO,
        getUser,
        setUser,
        updateUser,
        getFilter,
        setFilter,
        getMyOrdersView,
        setMyOrdersView,
        getAuditFilter,
        setAuditFilter,
        getCurrentMsgThread,
        setCurrentMsgThread,
        getCurrentMsgPeer,
        setCurrentMsgPeer,
        getCalendarDate,
        getAllEvents,
        setAllEvents,
        getUserSubscriptions,
        setUserSubscriptions,
        getRouteType,
        setRouteType,
        getRouteOrder,
        setRouteOrder,
        getStatsRange,
        setStatsRange,
        isWeatherCollapsed,
        toggleWeatherCollapsed,
        getCurrentWeather,
        setCurrentWeather,
        getMsgPollInterval,
        setMsgPollInterval,
        clearMsgPollInterval,
        getUserCertCache,
        setUserCert,
        getUserCert,
        getUserBlacklistCache,
        setUserBlacklist,
        isUserBlacklisted,
        clearUserBlacklistCache,
        getUserRealNameCache,
        setUserRealName,
        getUserRealName,
        getMsgDrafts,
        setMsgDraft,
        deleteMsgDraft,
        getMsgDraft,
        getSavedSchemes,
        saveSchemes,
        isAdmin,
        isUserSubscribedToType
    };
})();
