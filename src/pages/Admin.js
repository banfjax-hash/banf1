// Admin Dashboard Page
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { verifyAdmin, getAdminDashboard } from 'backend/admin-auth.jsw';
import { getDashboardStats, getRecentActivity } from 'backend/dashboard-service.jsw';

let isAdmin = false;

$w.onReady(async function () {
    await checkAdminAccess();
});

async function checkAdminAccess() {
    try {
        if (!wixUsers.currentUser.loggedIn) {
            showLoginRequired();
            return;
        }
        
        const adminCheck = await verifyAdmin();
        
        if (adminCheck.isAdmin) {
            isAdmin = true;
            showAdminDashboard();
            await loadDashboardData();
        } else {
            showAccessDenied();
        }
    } catch (e) {
        console.error('Admin check error:', e);
        showAccessDenied();
    }
}

function showLoginRequired() {
    if ($w('#boxLoginRequired').exists) $w('#boxLoginRequired').show();
    if ($w('#boxAdminDashboard').exists) $w('#boxAdminDashboard').hide();
    if ($w('#boxAccessDenied').exists) $w('#boxAccessDenied').hide();
    
    if ($w('#btnGoToLogin').exists) {
        $w('#btnGoToLogin').onClick(() => {
            wixLocation.to('/members');
        });
    }
}

function showAccessDenied() {
    if ($w('#boxLoginRequired').exists) $w('#boxLoginRequired').hide();
    if ($w('#boxAdminDashboard').exists) $w('#boxAdminDashboard').hide();
    if ($w('#boxAccessDenied').exists) $w('#boxAccessDenied').show();
}

function showAdminDashboard() {
    if ($w('#boxLoginRequired').exists) $w('#boxLoginRequired').hide();
    if ($w('#boxAccessDenied').exists) $w('#boxAccessDenied').hide();
    if ($w('#boxAdminDashboard').exists) $w('#boxAdminDashboard').show();
    
    setupAdminNavigation();
}

async function loadDashboardData() {
    try {
        // Load stats
        const stats = await getDashboardStats();
        
        if (stats) {
            if ($w('#txtTotalMembers').exists) $w('#txtTotalMembers').text = String(stats.totalMembers || 0);
            if ($w('#txtActiveMembers').exists) $w('#txtActiveMembers').text = String(stats.activeMembers || 0);
            if ($w('#txtTotalEvents').exists) $w('#txtTotalEvents').text = String(stats.totalEvents || 0);
            if ($w('#txtUpcomingEvents').exists) $w('#txtUpcomingEvents').text = String(stats.upcomingEvents || 0);
            if ($w('#txtTotalSponsors').exists) $w('#txtTotalSponsors').text = String(stats.totalSponsors || 0);
            if ($w('#txtTotalRevenue').exists) $w('#txtTotalRevenue').text = `$${(stats.totalRevenue || 0).toLocaleString()}`;
            if ($w('#txtPendingPayments').exists) $w('#txtPendingPayments').text = String(stats.pendingPayments || 0);
        }
        
        // Load recent activity
        const activity = await getRecentActivity(10);
        
        if ($w('#repeaterActivity').exists && activity.length > 0) {
            $w('#repeaterActivity').data = activity;
            $w('#repeaterActivity').onItemReady(($item, itemData) => {
                $item('#txtActivityType').text = itemData.type;
                $item('#txtActivityDesc').text = itemData.description;
                $item('#txtActivityTime').text = formatTimeAgo(itemData.timestamp);
            });
        }
        
    } catch (e) {
        console.error('Error loading dashboard:', e);
    }
}

function setupAdminNavigation() {
    const adminMenuItems = [
        { id: 'btnAdminMembers', page: '/admin/members' },
        { id: 'btnAdminEvents', page: '/admin/events' },
        { id: 'btnAdminFinance', page: '/admin/finance' },
        { id: 'btnAdminSponsors', page: '/admin/sponsors' },
        { id: 'btnAdminContent', page: '/admin/content' },
        { id: 'btnAdminReports', page: '/admin/reports' },
        { id: 'btnAdminSettings', page: '/admin/settings' }
    ];
    
    adminMenuItems.forEach(item => {
        if ($w(`#${item.id}`).exists) {
            $w(`#${item.id}`).onClick(() => {
                wixLocation.to(item.page);
            });
        }
    });
    
    // Quick actions
    if ($w('#btnAddMember').exists) {
        $w('#btnAddMember').onClick(() => showModal('addMember'));
    }
    
    if ($w('#btnAddEvent').exists) {
        $w('#btnAddEvent').onClick(() => showModal('addEvent'));
    }
    
    if ($w('#btnSendAnnouncement').exists) {
        $w('#btnSendAnnouncement').onClick(() => showModal('announcement'));
    }
    
    // Refresh data
    if ($w('#btnRefreshData').exists) {
        $w('#btnRefreshData').onClick(async () => {
            $w('#btnRefreshData').disable();
            await loadDashboardData();
            $w('#btnRefreshData').enable();
        });
    }
}

function showModal(modalType) {
    // Show appropriate modal based on type
    const modalMap = {
        'addMember': '#modalAddMember',
        'addEvent': '#modalAddEvent',
        'announcement': '#modalAnnouncement'
    };
    
    const modalId = modalMap[modalType];
    if (modalId && $w(modalId).exists) {
        $w(modalId).show();
    }
}

function formatTimeAgo(timestamp) {
    if (!timestamp) return '';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return time.toLocaleDateString();
}
