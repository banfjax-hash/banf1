/**
 * ============================================================
 * BANF - Bengali Association of North Florida
 * HOME PAGE - MAIN PAGE CODE (Home.mainPage.js)
 * ============================================================
 * 
 * WIX VELO PAGE CODE
 * This file runs when the Home page loads.
 * 
 * ELEMENT ID NAMING CONVENTION:
 * - Buttons: btn[Name] (e.g., btnJoinBANF, btnLogin)
 * - Text: txt[Name] (e.g., txtWelcome, txtMemberCount)
 * - Images: img[Name] (e.g., imgHero, imgLogo)
 * - Containers: box[Name] (e.g., boxHero, boxEvents)
 * - Repeaters: repeater[Name] (e.g., repeaterEvents)
 * - Input: input[Name] (e.g., inputEmail)
 * 
 * LINKING METHODS:
 * - wixLocation.to('/page') - Navigate to page
 * - wixWindow.openLightbox('name') - Open lightbox
 * - wixUsers.promptLogin() - Show login modal
 */

import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import wixData from 'wix-data';

// ============================================================
// CONSTANTS - PAGE PATHS
// ============================================================
const PAGES = {
    HOME: '/',
    EVENTS: '/events',
    MEMBERS: '/members',
    GALLERY: '/gallery',
    MAGAZINE: '/magazine',
    RADIO: '/radio',
    SPONSORS: '/sponsors',
    VOLUNTEER: '/volunteer',
    CONTACT: '/contact',
    ADMIN: '/admin',
    LOGIN: '/login',
    REGISTER: '/members/register',
    PAYMENT: '/members/payment',
    PROFILE: '/members/profile',
    HERITAGE: '/heritage',
    LEADERSHIP: '/leadership',
    FEEDBACK: '/contact/feedback',
    NEWCOMER: '/newcomer-guide',
    DONATE: '/donate',
    COMMUNITY: '/community'
};

// ============================================================
// ELEMENT IDS - Map HTML elements to Wix element IDs
// ============================================================
const ELEMENTS = {
    // Hero Section
    hero: {
        bengaliWelcome: '#txtBengaliWelcome',
        englishWelcome: '#txtEnglishWelcome',
        tagline: '#txtTagline',
        btnJoin: '#btnJoinBANF',
        btnExplore: '#btnExploreEvents',
        imgHero: '#imgHero'
    },
    
    // Stats Section
    stats: {
        memberCount: '#txtMemberCount',
        eventCount: '#txtEventCount',
        sponsorCount: '#txtSponsorCount',
        yearsCount: '#txtYearsCount'
    },
    
    // Navigation
    nav: {
        home: '#navHome',
        events: '#navEvents',
        members: '#navMembers',
        gallery: '#navGallery',
        magazine: '#navMagazine',
        radio: '#navRadio',
        sponsors: '#navSponsors',
        volunteer: '#navVolunteer',
        contact: '#navContact',
        btnLogin: '#btnLogin',
        btnRegister: '#btnRegister',
        btnUserMenu: '#btnUserMenu',
        logo: '#imgLogo'
    },
    
    // Quick Access
    quickAccess: {
        events: '#quickEvents',
        members: '#quickMembers',
        gallery: '#quickGallery',
        magazine: '#quickMagazine',
        radio: '#quickRadio',
        volunteer: '#quickVolunteer',
        donate: '#quickDonate',
        community: '#quickCommunity'
    },
    
    // Featured Events
    events: {
        repeater: '#repeaterEvents',
        noEvents: '#txtNoEvents',
        viewAll: '#btnViewAllEvents'
    },
    
    // News Section
    news: {
        repeater: '#repeaterNews',
        viewAll: '#btnViewAllNews'
    },
    
    // Radio Widget
    radio: {
        status: '#txtRadioStatus',
        currentShow: '#txtCurrentShow',
        nextShow: '#txtNextShow',
        btnPlay: '#btnPlayRadio',
        btnSchedule: '#btnRadioSchedule'
    },
    
    // Contact Form
    contact: {
        inputName: '#inputName',
        inputEmail: '#inputEmail',
        inputMessage: '#inputMessage',
        btnSubmit: '#btnSubmitContact',
        successMsg: '#txtContactSuccess'
    },
    
    // User Menu
    user: {
        welcomeText: '#txtWelcome',
        memberSection: '#boxMemberSection',
        loginBtn: '#btnMemberLogin',
        logoutBtn: '#btnLogout',
        profileBtn: '#btnProfile',
        paymentBtn: '#btnPayment'
    }
};

// ============================================================
// PAGE READY - MAIN ENTRY POINT
// ============================================================
$w.onReady(async function () {
    console.log('🏠 BANF Home Page Loading...');
    
    try {
        // Initialize all components
        await Promise.all([
            setupNavigation(),
            setupHeroSection(),
            setupQuickAccess(),
            setupUserState(),
            loadStats(),
            loadFeaturedEvents(),
            loadLatestNews(),
            loadRadioStatus(),
            setupContactForm()
        ]);
        
        console.log('✅ BANF Home Page Ready!');
    } catch (error) {
        console.error('Home page initialization error:', error);
    }
});

// ============================================================
// NAVIGATION SETUP
// ============================================================
function setupNavigation() {
    const navLinks = [
        { selector: ELEMENTS.nav.home, path: PAGES.HOME },
        { selector: ELEMENTS.nav.events, path: PAGES.EVENTS },
        { selector: ELEMENTS.nav.members, path: PAGES.MEMBERS },
        { selector: ELEMENTS.nav.gallery, path: PAGES.GALLERY },
        { selector: ELEMENTS.nav.magazine, path: PAGES.MAGAZINE },
        { selector: ELEMENTS.nav.radio, path: PAGES.RADIO },
        { selector: ELEMENTS.nav.sponsors, path: PAGES.SPONSORS },
        { selector: ELEMENTS.nav.volunteer, path: PAGES.VOLUNTEER },
        { selector: ELEMENTS.nav.contact, path: PAGES.CONTACT }
    ];
    
    navLinks.forEach(({ selector, path }) => {
        bindClickHandler(selector, () => wixLocation.to(path));
    });
    
    // Logo click
    bindClickHandler(ELEMENTS.nav.logo, () => wixLocation.to(PAGES.HOME));
    
    // Login button - shows Wix login modal
    bindClickHandler(ELEMENTS.nav.btnLogin, handleLogin);
    
    // Register button
    bindClickHandler(ELEMENTS.nav.btnRegister, () => {
        wixUsers.promptLogin({ mode: 'signup' })
            .then(() => wixLocation.to(PAGES.MEMBERS))
            .catch(err => console.log('Registration cancelled'));
    });
    
    return Promise.resolve();
}

// ============================================================
// HERO SECTION
// ============================================================
function setupHeroSection() {
    // Set hero text content
    setText(ELEMENTS.hero.bengaliWelcome, 'স্বাগতম - নর্থ ফ্লোরিডার বাঙালি সমাজে');
    setText(ELEMENTS.hero.englishWelcome, 'Welcome to BANF');
    setText(ELEMENTS.hero.tagline, 'Celebrating Bengali Heritage Since 1988');
    
    // Hero CTAs
    bindClickHandler(ELEMENTS.hero.btnJoin, () => {
        if (wixUsers.currentUser.loggedIn) {
            wixLocation.to(PAGES.PAYMENT);
        } else {
            wixUsers.promptLogin({ mode: 'signup' })
                .then(() => wixLocation.to(PAGES.PAYMENT));
        }
    });
    
    bindClickHandler(ELEMENTS.hero.btnExplore, () => wixLocation.to(PAGES.EVENTS));
    
    return Promise.resolve();
}

// ============================================================
// QUICK ACCESS SECTION
// ============================================================
function setupQuickAccess() {
    const quickLinks = [
        { selector: ELEMENTS.quickAccess.events, path: PAGES.EVENTS },
        { selector: ELEMENTS.quickAccess.members, path: PAGES.MEMBERS },
        { selector: ELEMENTS.quickAccess.gallery, path: PAGES.GALLERY },
        { selector: ELEMENTS.quickAccess.magazine, path: PAGES.MAGAZINE },
        { selector: ELEMENTS.quickAccess.radio, path: PAGES.RADIO },
        { selector: ELEMENTS.quickAccess.volunteer, path: PAGES.VOLUNTEER },
        { selector: ELEMENTS.quickAccess.donate, path: PAGES.DONATE },
        { selector: ELEMENTS.quickAccess.community, path: PAGES.COMMUNITY }
    ];
    
    quickLinks.forEach(({ selector, path }) => {
        bindClickHandler(selector, () => wixLocation.to(path));
    });
    
    return Promise.resolve();
}

// ============================================================
// USER STATE MANAGEMENT
// ============================================================
async function setupUserState() {
    const user = wixUsers.currentUser;
    
    if (user.loggedIn) {
        // User is logged in
        hideElement(ELEMENTS.nav.btnLogin);
        hideElement(ELEMENTS.nav.btnRegister);
        showElement(ELEMENTS.nav.btnUserMenu);
        showElement(ELEMENTS.user.memberSection);
        
        // Get user details
        try {
            const userEmail = await user.getEmail();
            const member = await user.getMember();
            const firstName = member?.contactDetails?.firstName || 'Member';
            
            setText(ELEMENTS.user.welcomeText, `Welcome, ${firstName}!`);
        } catch (err) {
            setText(ELEMENTS.user.welcomeText, 'Welcome!');
        }
        
        // User menu actions
        bindClickHandler(ELEMENTS.user.profileBtn, () => wixLocation.to(PAGES.PROFILE));
        bindClickHandler(ELEMENTS.user.paymentBtn, () => wixLocation.to(PAGES.PAYMENT));
        bindClickHandler(ELEMENTS.user.logoutBtn, handleLogout);
        
    } else {
        // User is not logged in
        showElement(ELEMENTS.nav.btnLogin);
        showElement(ELEMENTS.nav.btnRegister);
        hideElement(ELEMENTS.nav.btnUserMenu);
        hideElement(ELEMENTS.user.memberSection);
        
        // Member login button
        bindClickHandler(ELEMENTS.user.loginBtn, handleLogin);
    }
    
    return Promise.resolve();
}

// ============================================================
// STATS LOADING
// ============================================================
async function loadStats() {
    // Default stats
    const defaultStats = {
        members: '500+',
        events: '50+',
        sponsors: '25+',
        years: '35+'
    };
    
    try {
        // Try to load from backend
        const { getDashboardStats } = await import('backend/dashboard-service.jsw');
        const stats = await getDashboardStats();
        
        setText(ELEMENTS.stats.memberCount, stats?.totalMembers || defaultStats.members);
        setText(ELEMENTS.stats.eventCount, stats?.totalEvents || defaultStats.events);
        setText(ELEMENTS.stats.sponsorCount, stats?.totalSponsors || defaultStats.sponsors);
        setText(ELEMENTS.stats.yearsCount, stats?.yearsActive || defaultStats.years);
    } catch (err) {
        // Use defaults
        setText(ELEMENTS.stats.memberCount, defaultStats.members);
        setText(ELEMENTS.stats.eventCount, defaultStats.events);
        setText(ELEMENTS.stats.sponsorCount, defaultStats.sponsors);
        setText(ELEMENTS.stats.yearsCount, defaultStats.years);
    }
    
    return Promise.resolve();
}

// ============================================================
// FEATURED EVENTS
// ============================================================
async function loadFeaturedEvents() {
    try {
        // Query upcoming events from collection
        const result = await wixData.query('Events')
            .gt('date', new Date())
            .ascending('date')
            .limit(6)
            .find();
        
        const events = result.items;
        
        if (events.length > 0) {
            hideElement(ELEMENTS.events.noEvents);
            
            const repeater = $w(ELEMENTS.events.repeater);
            if (repeater) {
                repeater.data = events;
                
                repeater.onItemReady(($item, itemData) => {
                    // Set event details in repeater item
                    if ($item('#txtEventTitle')) $item('#txtEventTitle').text = itemData.title || 'Event';
                    if ($item('#txtEventDate')) $item('#txtEventDate').text = formatDate(itemData.date);
                    if ($item('#txtEventVenue')) $item('#txtEventVenue').text = itemData.venue || 'TBA';
                    if ($item('#imgEvent') && itemData.imageUrl) $item('#imgEvent').src = itemData.imageUrl;
                    
                    // Event card click
                    if ($item('#btnEventDetails')) {
                        $item('#btnEventDetails').onClick(() => {
                            wixLocation.to(`${PAGES.EVENTS}/${itemData._id}`);
                        });
                    }
                    
                    // Register button
                    if ($item('#btnRegister')) {
                        $item('#btnRegister').onClick(() => handleEventRegistration(itemData._id));
                    }
                });
            }
        } else {
            showElement(ELEMENTS.events.noEvents);
        }
        
        // View all events button
        bindClickHandler(ELEMENTS.events.viewAll, () => wixLocation.to(PAGES.EVENTS));
        
    } catch (err) {
        console.log('Events loading error:', err.message);
        showElement(ELEMENTS.events.noEvents);
    }
    
    return Promise.resolve();
}

// ============================================================
// LATEST NEWS
// ============================================================
async function loadLatestNews() {
    try {
        const result = await wixData.query('NewsAnnouncements')
            .descending('_createdDate')
            .limit(5)
            .find();
        
        const news = result.items;
        
        const repeater = $w(ELEMENTS.news.repeater);
        if (repeater && news.length > 0) {
            repeater.data = news;
            
            repeater.onItemReady(($item, itemData) => {
                if ($item('#txtNewsTitle')) $item('#txtNewsTitle').text = itemData.title;
                if ($item('#txtNewsDate')) $item('#txtNewsDate').text = timeAgo(itemData._createdDate);
                if ($item('#txtNewsPreview')) {
                    const preview = (itemData.content || '').substring(0, 100) + '...';
                    $item('#txtNewsPreview').text = preview;
                }
            });
        }
        
        bindClickHandler(ELEMENTS.news.viewAll, () => wixLocation.to('/news'));
        
    } catch (err) {
        console.log('News loading error:', err.message);
    }
    
    return Promise.resolve();
}

// ============================================================
// RADIO STATUS
// ============================================================
async function loadRadioStatus() {
    try {
        const { getRadioStatus } = await import('backend/radio.jsw');
        const status = await getRadioStatus();
        
        if (status?.isLive) {
            setText(ELEMENTS.radio.status, '🔴 LIVE NOW');
        } else {
            setText(ELEMENTS.radio.status, '📻 BANF Radio');
        }
        
        setText(ELEMENTS.radio.currentShow, status?.currentShow || 'BANF Radio');
        setText(ELEMENTS.radio.nextShow, `Next: ${status?.nextShow || 'Stay Tuned'}`);
        
    } catch (err) {
        setText(ELEMENTS.radio.status, '📻 BANF Radio');
    }
    
    bindClickHandler(ELEMENTS.radio.btnPlay, () => wixLocation.to(PAGES.RADIO));
    bindClickHandler(ELEMENTS.radio.btnSchedule, () => wixLocation.to(`${PAGES.RADIO}/schedule`));
    
    return Promise.resolve();
}

// ============================================================
// CONTACT FORM
// ============================================================
function setupContactForm() {
    bindClickHandler(ELEMENTS.contact.btnSubmit, async () => {
        const name = getValue(ELEMENTS.contact.inputName);
        const email = getValue(ELEMENTS.contact.inputEmail);
        const message = getValue(ELEMENTS.contact.inputMessage);
        
        if (!name || !email || !message) {
            wixWindow.openLightbox('Alert', { message: 'Please fill all fields' });
            return;
        }
        
        try {
            // Save to Feedback collection
            await wixData.insert('Feedback', {
                name: name,
                email: email,
                message: message,
                type: 'Contact Form',
                status: 'New',
                _createdDate: new Date()
            });
            
            // Clear form
            setValue(ELEMENTS.contact.inputName, '');
            setValue(ELEMENTS.contact.inputEmail, '');
            setValue(ELEMENTS.contact.inputMessage, '');
            
            // Show success
            showElement(ELEMENTS.contact.successMsg);
            setTimeout(() => hideElement(ELEMENTS.contact.successMsg), 5000);
            
        } catch (err) {
            console.error('Contact form error:', err);
            wixWindow.openLightbox('Alert', { message: 'Error sending message. Please try again.' });
        }
    });
    
    return Promise.resolve();
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Login handler - shows Wix login modal
 */
async function handleLogin() {
    try {
        await wixUsers.promptLogin({ mode: 'login' });
        // Refresh page after login
        wixLocation.to(wixLocation.url);
    } catch (err) {
        console.log('Login cancelled or failed');
    }
}

/**
 * Logout handler
 */
async function handleLogout() {
    await wixUsers.logout();
    wixLocation.to(PAGES.HOME);
}

/**
 * Event registration handler
 */
async function handleEventRegistration(eventId) {
    if (!wixUsers.currentUser.loggedIn) {
        await wixUsers.promptLogin({ mode: 'login' });
    }
    wixLocation.to(`${PAGES.EVENTS}/register/${eventId}`);
}

/**
 * Safely bind click handler to element
 */
function bindClickHandler(selector, handler) {
    try {
        const element = $w(selector);
        if (element && typeof element.onClick === 'function') {
            element.onClick(handler);
        }
    } catch (e) {
        // Element doesn't exist - skip silently
    }
}

/**
 * Safely set text content
 */
function setText(selector, text) {
    try {
        const element = $w(selector);
        if (element && element.text !== undefined) {
            element.text = String(text);
        }
    } catch (e) {
        // Element doesn't exist
    }
}

/**
 * Safely get input value
 */
function getValue(selector) {
    try {
        const element = $w(selector);
        return element?.value || '';
    } catch (e) {
        return '';
    }
}

/**
 * Safely set input value
 */
function setValue(selector, value) {
    try {
        const element = $w(selector);
        if (element && element.value !== undefined) {
            element.value = value;
        }
    } catch (e) {
        // Element doesn't exist
    }
}

/**
 * Safely show element
 */
function showElement(selector) {
    try {
        const element = $w(selector);
        if (element && typeof element.show === 'function') {
            element.show();
        }
    } catch (e) {
        // Element doesn't exist
    }
}

/**
 * Safely hide element
 */
function hideElement(selector) {
    try {
        const element = $w(selector);
        if (element && typeof element.hide === 'function') {
            element.hide();
        }
    } catch (e) {
        // Element doesn't exist
    }
}

/**
 * Format date for display
 */
function formatDate(date) {
    if (!date) return 'TBA';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Time ago helper
 */
function timeAgo(date) {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];
    
    for (const { label, seconds: intervalSeconds } of intervals) {
        const count = Math.floor(seconds / intervalSeconds);
        if (count >= 1) {
            return `${count} ${label}${count > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'Just now';
}

// ============================================================
// EXPORTS (for Wix event handlers)
// ============================================================

/**
 * Button click handlers that can be connected in Wix Editor
 */
export function btnJoinBANF_click(event) {
    if (wixUsers.currentUser.loggedIn) {
        wixLocation.to(PAGES.PAYMENT);
    } else {
        wixUsers.promptLogin({ mode: 'signup' })
            .then(() => wixLocation.to(PAGES.PAYMENT));
    }
}

export function btnLogin_click(event) {
    handleLogin();
}

export function btnLogout_click(event) {
    handleLogout();
}

export function btnEvents_click(event) {
    wixLocation.to(PAGES.EVENTS);
}

export function btnMembers_click(event) {
    wixLocation.to(PAGES.MEMBERS);
}

export function btnGallery_click(event) {
    wixLocation.to(PAGES.GALLERY);
}

export function btnMagazine_click(event) {
    wixLocation.to(PAGES.MAGAZINE);
}

export function btnRadio_click(event) {
    wixLocation.to(PAGES.RADIO);
}

export function btnSponsors_click(event) {
    wixLocation.to(PAGES.SPONSORS);
}

export function btnVolunteer_click(event) {
    wixLocation.to(PAGES.VOLUNTEER);
}

export function btnContact_click(event) {
    wixLocation.to(PAGES.CONTACT);
}

export function btnDonate_click(event) {
    wixLocation.to(PAGES.DONATE);
}

export function btnHeritage_click(event) {
    wixLocation.to(PAGES.HERITAGE);
}

export function btnNewcomer_click(event) {
    wixLocation.to(PAGES.NEWCOMER);
}
