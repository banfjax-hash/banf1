// Home Page - BANF Landing Page
import wixWindow from 'wix-window';
import wixLocation from 'wix-location';

$w.onReady(function () {
    // Initialize navigation
    setupNavigation();
    
    // Load featured content
    loadFeaturedEvents();
    loadLatestNews();
    loadQuickStats();
});

// Navigation Setup
function setupNavigation() {
    // Main menu items
    const menuItems = [
        { id: 'btnHome', page: '/' },
        { id: 'btnEvents', page: '/events' },
        { id: 'btnMembers', page: '/members' },
        { id: 'btnGallery', page: '/gallery' },
        { id: 'btnMagazine', page: '/magazine' },
        { id: 'btnRadio', page: '/radio' },
        { id: 'btnSponsors', page: '/sponsors' },
        { id: 'btnVolunteer', page: '/volunteer' },
        { id: 'btnContact', page: '/contact' },
        { id: 'btnLogin', page: '/login' }
    ];
    
    menuItems.forEach(item => {
        if ($w(`#${item.id}`).exists) {
            $w(`#${item.id}`).onClick(() => {
                wixLocation.to(item.page);
            });
        }
    });
}

// Load Featured Events
async function loadFeaturedEvents() {
    try {
        const { getUpcomingEvents } = await import('backend/events.jsw');
        const events = await getUpcomingEvents(3);
        
        if ($w('#repeaterEvents').exists && events.length > 0) {
            $w('#repeaterEvents').data = events;
            $w('#repeaterEvents').onItemReady(($item, itemData) => {
                $item('#txtEventName').text = itemData.title;
                $item('#txtEventDate').text = formatDate(itemData.date);
                $item('#txtEventVenue').text = itemData.venue;
                $item('#btnEventDetails').onClick(() => {
                    wixLocation.to(`/events/${itemData._id}`);
                });
            });
        }
    } catch (e) {
        console.log('Events loading:', e.message);
    }
}

// Load Latest News/Announcements
async function loadLatestNews() {
    try {
        const { getAnnouncements } = await import('backend/communication-hub.jsw');
        const news = await getAnnouncements(5);
        
        if ($w('#repeaterNews').exists && news.length > 0) {
            $w('#repeaterNews').data = news;
            $w('#repeaterNews').onItemReady(($item, itemData) => {
                $item('#txtNewsTitle').text = itemData.title;
                $item('#txtNewsDate').text = formatDate(itemData.createdAt);
            });
        }
    } catch (e) {
        console.log('News loading:', e.message);
    }
}

// Load Quick Stats
async function loadQuickStats() {
    try {
        const { getDashboardStats } = await import('backend/dashboard-service.jsw');
        const stats = await getDashboardStats();
        
        if (stats) {
            if ($w('#txtMemberCount').exists) $w('#txtMemberCount').text = String(stats.totalMembers || '500+');
            if ($w('#txtEventCount').exists) $w('#txtEventCount').text = String(stats.totalEvents || '50+');
            if ($w('#txtSponsorCount').exists) $w('#txtSponsorCount').text = String(stats.totalSponsors || '20+');
        }
    } catch (e) {
        console.log('Stats loading:', e.message);
    }
}

// Utility function
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
