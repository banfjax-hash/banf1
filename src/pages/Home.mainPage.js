// Home.mainPage.js
// BANF - Bengali Association of North Florida
// Velo page code for the main landing page

import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import { getECMembers } from 'backend/members.jsw';
import { getUpcomingEvents } from 'backend/events.jsw';
import { getSiteStats } from 'backend/site-stats.jsw';

$w.onReady(async function () {
    console.log("🏠 Home page loading...");

    // ── Initialize Hero Section ──
    initHeroSection();

    // ── Load Dynamic Data ──
    await Promise.all([
        loadSiteStats(),
        loadECMembers(),
        loadEvents(),
    ]);

    // ── Quick Access Bar ──
    initQuickAccessBar();

    // ── President's Message Language Toggle ──
    initLanguageToggle();

    // ── Scroll Animations ──
    initScrollAnimations();

    console.log("✅ Home page ready");
});

// ═══════════════════════════════════════════════════════════
// Hero Section
// ═══════════════════════════════════════════════════════════

function initHeroSection() {
    $w('#btnJoinMember').onClick(() => {
        wixLocation.to('/membership');
    });

    $w('#btnUpcomingEvents').onClick(() => {
        wixLocation.to('/events');
    });
}

async function loadSiteStats() {
    try {
        const stats = await getSiteStats();
        $w('#heroStatsFamilies').text = `${stats.families}+`;
        $w('#heroStatsEvents').text = `${stats.events}+`;
        $w('#heroStatsYears').text = `${stats.years}`;
        $w('#heroStatsSponsors').text = `${stats.sponsors}+`;
    } catch (err) {
        console.error("Stats load error:", err);
    }
}

// ═══════════════════════════════════════════════════════════
// Quick Access Bar
// ═══════════════════════════════════════════════════════════

function initQuickAccessBar() {
    const quickLinks = {
        '#btnPayDues': '/membership',
        '#btnEventsQuick': '/events',
        '#btnRadioQuick': '/radio',
        '#btnMagazineQuick': '/magazine',
        '#btnJaxGuide': '/jax-guide',
        '#btnSurveys': '/surveys',
        '#btnComplaints': '/complaints',
        '#btnSponsorsQuick': '/sponsors',
        '#btnContactQuick': '/contact',
    };

    Object.entries(quickLinks).forEach(([btnId, url]) => {
        try {
            $w(btnId).onClick(() => wixLocation.to(url));
        } catch (e) {
            // Element might not exist yet
        }
    });
}

// ═══════════════════════════════════════════════════════════
// President's Message - Language Toggle
// ═══════════════════════════════════════════════════════════

let showBengali = true;

function initLanguageToggle() {
    // Show Bengali by default, hide English
    $w('#presidentMessageBN').show();
    $w('#presidentMessageEN').hide();

    $w('#btnLangToggle').onClick(() => {
        showBengali = !showBengali;
        if (showBengali) {
            $w('#presidentMessageBN').show('fade', { duration: 300 });
            $w('#presidentMessageEN').hide('fade', { duration: 300 });
            $w('#btnLangToggle').label = 'English';
        } else {
            $w('#presidentMessageEN').show('fade', { duration: 300 });
            $w('#presidentMessageBN').hide('fade', { duration: 300 });
            $w('#btnLangToggle').label = 'বাংলা';
        }
    });
}

// ═══════════════════════════════════════════════════════════
// Executive Committee
// ═══════════════════════════════════════════════════════════

async function loadECMembers() {
    try {
        const members = await getECMembers();

        $w('#ecRepeater').onItemReady(($item, itemData) => {
            $item('#ecMemberPhoto').src = itemData.photo;
            $item('#ecMemberName').text = itemData.name;
            $item('#ecMemberRole').text = itemData.role;
            $item('#ecMemberBio').text = itemData.bio;
            $item('#ecMemberEmail').onClick(() => {
                wixLocation.to(`mailto:${itemData.email}`);
            });
        });

        $w('#ecRepeater').data = members;
    } catch (err) {
        console.error("EC members load error:", err);
    }
}

// ═══════════════════════════════════════════════════════════
// Events Calendar
// ═══════════════════════════════════════════════════════════

async function loadEvents() {
    try {
        const events = await getUpcomingEvents();

        $w('#eventsRepeater').onItemReady(($item, itemData) => {
            $item('#eventName').text = itemData.name;
            $item('#eventDate').text = formatDate(itemData.date);
            $item('#eventDesc').text = itemData.description;
            $item('#eventBadge').text = itemData.status;
        });

        $w('#eventsRepeater').data = events;
    } catch (err) {
        console.error("Events load error:", err);
    }

    $w('#btnFullCalendar').onClick(() => {
        wixLocation.to('/events');
    });
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
    });
}

// ═══════════════════════════════════════════════════════════
// Scroll Animations
// ═══════════════════════════════════════════════════════════

function initScrollAnimations() {
    const sections = [
        '#presidentSection', '#ecSection', '#eventsSection',
        '#footerSection'
    ];

    sections.forEach(sectionId => {
        try {
            $w(sectionId).onViewportEnter(() => {
                $w(sectionId).show('fade', { duration: 500 });
            });
        } catch (e) {
            // Section might not exist
        }
    });
}
