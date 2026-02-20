# BANF Wix Element ID Mapping Guide

Generated: 2026-02-20 00:37

## How to Use This Document

For each page, create the listed elements in the Wix Editor and assign
the exact element IDs shown. The Velo page code will then bind to these IDs.

### Steps:
1. Open Wix Editor for the BANF DEV site
2. Navigate to the page listed below
3. Add each element (drag from panel)
4. Right-click element → 'Set ID' → use the ID from this document
5. Save the page

---
## 📄 Home (mainPage)
URL: `/`
Description: BANF main landing page with all key sections
Total Elements: 49

| Element ID | Type | Purpose | Events |
|------------|------|---------|--------|
| `#heroSection` | Section | Hero banner section | - |
| `#heroTitle` | Text | Main title: Bengali Association of North Florida | - |
| `#heroSubtitle` | Text | Tagline about culture/community | - |
| `#heroStatsFamilies` | Text | 80+ Active Families stat | - |
| `#heroStatsEvents` | Text | 10+ Events Yearly stat | - |
| `#heroStatsYears` | Text | 17 Years Strong stat | - |
| `#heroStatsSponsors` | Text | 45+ Sponsors stat | - |
| `#btnJoinMember` | Button | Join/Become a Member CTA | onClick |
| `#btnUpcomingEvents` | Button | Upcoming Events CTA | onClick |
| `#quickAccessBar` | Container | Quick access icon bar | - |
| `#btnPayDues` | Button | Pay Dues quick link | onClick |
| `#btnEventsQuick` | Button | Events quick link | onClick |
| `#btnRadioQuick` | Button | Radio quick link | onClick |
| `#btnMagazineQuick` | Button | Magazine quick link | onClick |
| `#btnJaxGuide` | Button | Jax Guide quick link | onClick |
| `#btnSurveys` | Button | Surveys quick link | onClick |
| `#btnComplaints` | Button | Complaints quick link | onClick |
| `#btnSponsorsQuick` | Button | Sponsors quick link | onClick |
| `#btnContactQuick` | Button | Contact quick link | onClick |
| `#presidentSection` | Section | President's welcome message section | - |
| `#presidentPhoto` | Image | President photo | - |
| `#presidentName` | Text | Dr. Ranadhir Ghosh | - |
| `#presidentTitle` | Text | President, BANF 2025-26 | - |
| `#presidentMessageBN` | RichTextBox | Bengali message text | - |
| `#presidentMessageEN` | RichTextBox | English message text | - |
| `#btnLangToggle` | Button | Toggle Bengali/English | onClick |
| `#ecSection` | Section | Executive Committee section | - |
| `#ecSectionTitle` | Text | Executive Committee heading | - |
| `#ecRepeater` | Repeater | EC member cards repeater | - |
| `#ecMemberPhoto` | Image | Member photo (inside repeater) | - |
| `#ecMemberName` | Text | Member name (inside repeater) | - |
| `#ecMemberRole` | Text | Member role (inside repeater) | - |
| `#ecMemberBio` | Text | Member bio (inside repeater) | - |
| `#ecMemberEmail` | Button | Email link (inside repeater) | onClick |
| `#eventsSection` | Section | Event Calendar section | - |
| `#eventsSectionTitle` | Text | 2026 Event Calendar heading | - |
| `#eventsRepeater` | Repeater | Event cards repeater | - |
| `#eventName` | Text | Event name (inside repeater) | - |
| `#eventDate` | Text | Event date (inside repeater) | - |
| `#eventDesc` | Text | Event description (inside repeater) | - |
| `#eventBadge` | Text | Event status badge (inside repeater) | - |
| `#btnFullCalendar` | Button | View Full Calendar | onClick |
| `#footerSection` | Section | Site footer | - |
| `#footerAbout` | Text | About BANF footer text | - |
| `#footerEmail` | Text | info@jaxbengali.org | - |
| `#footerCopyright` | Text | © 2026 BANF | - |
| `#btnFacebook` | Button | Facebook social link | onClick |
| `#btnInstagram` | Button | Instagram social link | onClick |
| `#btnYouTube` | Button | YouTube social link | onClick |

---
## 📄 Service Portals (page)
URL: `/portals`
Description: Member/Admin portals and all BANF digital services
Total Elements: 11

| Element ID | Type | Purpose | Events |
|------------|------|---------|--------|
| `#portalsSection` | Section | Service portals section | - |
| `#portalTitle` | Text | Service Portals heading | - |
| `#memberPortalBox` | Container | Member portal card | - |
| `#adminPortalBox` | Container | Admin portal card | - |
| `#btnMemberLogin` | Button | Member Login | onClick |
| `#btnAdminLogin` | Button | Admin Login | onClick |
| `#servicesRepeater` | Repeater | All services grid | - |
| `#serviceName` | Text | Service name (repeater) | - |
| `#serviceDesc` | Text | Service description (repeater) | - |
| `#serviceIcon` | Image | Service icon (repeater) | - |
| `#btnServiceAction` | Button | Service CTA button (repeater) | onClick |

---
## 📄 Membership (page)
URL: `/membership`
Description: Membership plans, pricing, benefits, and registration
Total Elements: 19

| Element ID | Type | Purpose | Events |
|------------|------|---------|--------|
| `#membershipSection` | Section | Membership section | - |
| `#membershipTitle` | Text | Membership & Benefits heading | - |
| `#earlyBirdBanner` | Text | Early bird pricing banner | - |
| `#memberPortalLogin` | Container | Member login box | - |
| `#btnLogin` | Button | Login button | onClick |
| `#btnSignUp` | Button | Sign Up button | onClick |
| `#plansContainer` | Container | Membership plans container | - |
| `#studentPlan` | Container | Student plan card | - |
| `#regularPlan` | Container | Regular plan card | - |
| `#couplePlan` | Container | Couple plan card | - |
| `#familyPlan` | Container | Family Premium plan card | - |
| `#studentPrice` | Text | $165/year | - |
| `#regularPrice` | Text | $210/year | - |
| `#couplePrice` | Text | $330/year | - |
| `#familyPrice` | Text | $410/year | - |
| `#selectivePlans` | Container | Selective plans section | - |
| `#cultureSpecial` | Container | Culture Special card | - |
| `#religiousSpecial` | Container | Religious Special card | - |
| `#benefitsGrid` | Container | Member benefits grid | - |

---
## 📄 Careers (page)
URL: `/careers`
Description: Professional networking and career mentorship
Total Elements: 10

| Element ID | Type | Purpose | Events |
|------------|------|---------|--------|
| `#careersSection` | Section | Careers section | - |
| `#careersTitle` | Text | Careers & Professional Network | - |
| `#careersRepeater` | Repeater | Professional cards repeater | - |
| `#profPhoto` | Image | Professional photo (repeater) | - |
| `#profName` | Text | Name (repeater) | - |
| `#profTitle` | Text | Job title (repeater) | - |
| `#profCompany` | Text | Company (repeater) | - |
| `#profBio` | Text | Bio (repeater) | - |
| `#profSkills` | Text | Skills tags (repeater) | - |
| `#btnConnect` | Button | Connect button (repeater) | onClick |

---
## 📄 BANF Radio (page)
URL: `/radio`
Description: 24/7 Bengali & English music radio
Total Elements: 10

| Element ID | Type | Purpose | Events |
|------------|------|---------|--------|
| `#radioSection` | Section | BANF Radio section | - |
| `#radioTitle` | Text | BANF Radio 24/7 | - |
| `#radioPlayer` | Container | Radio player container | - |
| `#btnPlayPause` | Button | Play/Pause button | onClick |
| `#nowPlaying` | Text | Now playing info | - |
| `#scheduleGrid` | Container | Schedule time grid | - |
| `#btnLiveRadio` | Button | Live Radio tab | onClick |
| `#btnArchive` | Button | Archive tab | onClick |
| `#btnYouTube` | Button | YouTube link | onClick |
| `#btnSpotify` | Button | Spotify link | onClick |

---
## 📄 E-Magazine (page)
URL: `/magazine`
Description: Jagriti community literary magazine
Total Elements: 12

| Element ID | Type | Purpose | Events |
|------------|------|---------|--------|
| `#magazineSection` | Section | E-Magazine section | - |
| `#magazineTitle` | Text | Jagriti E-Magazine | - |
| `#latestIssue` | Container | Latest issue card | - |
| `#latestIssueTitle` | Text | Latest issue title | - |
| `#btnReadNow` | Button | Read Now | onClick |
| `#btnPastIssues` | Button | Past Issues | onClick |
| `#categoriesGrid` | Container | Content categories grid | - |
| `#btnArticles` | Button | Articles category | onClick |
| `#btnPoems` | Button | Poems category | onClick |
| `#btnStories` | Button | Stories category | onClick |
| `#btnRecipes` | Button | Recipes category | onClick |
| `#btnSubmitArticle` | Button | Submit Article | onClick |

---
## 📄 Sponsorship (page)
URL: `/sponsors`
Description: Sponsorship tiers and partnership opportunities
Total Elements: 9

| Element ID | Type | Purpose | Events |
|------------|------|---------|--------|
| `#sponsorSection` | Section | Sponsorship section | - |
| `#sponsorTitle` | Text | Sponsorship Opportunities | - |
| `#titleSponsor` | Container | Title Sponsor card | - |
| `#platinumCard` | Container | Platinum tier card | - |
| `#goldCard` | Container | Gold tier card | - |
| `#silverCard` | Container | Silver tier card | - |
| `#bronzeCard` | Container | Bronze tier card | - |
| `#btnContactSponsor` | Button | Contact for Sponsorship | onClick |
| `#btnPlaceAd` | Button | Place Ad | onClick |

---
## 📄 Contact (page)
URL: `/contact`
Description: Contact form and organization info
Total Elements: 11

| Element ID | Type | Purpose | Events |
|------------|------|---------|--------|
| `#contactSection` | Section | Contact section | - |
| `#contactTitle` | Text | Get in Touch | - |
| `#contactForm` | Container | Contact form container | - |
| `#inputName` | TextInput | Name input | - |
| `#inputEmail` | TextInput | Email input | - |
| `#inputSubject` | TextInput | Subject input | - |
| `#inputMessage` | TextArea | Message textarea | - |
| `#btnSendMessage` | Button | Send Message | onClick |
| `#contactInfo` | Container | Contact information box | - |
| `#contactEmail` | Text | info@jaxbengali.org | - |
| `#contactLocation` | Text | Jacksonville, Florida | - |

---
## 📄 Photo Gallery (page)
URL: `/gallery`
Description: Community event photo gallery
Total Elements: 9

| Element ID | Type | Purpose | Events |
|------------|------|---------|--------|
| `#gallerySection` | Section | Photo Gallery section | - |
| `#galleryTitle` | Text | Photo Gallery | - |
| `#albumsRepeater` | Repeater | Photo albums repeater | - |
| `#albumCover` | Image | Album cover (repeater) | - |
| `#albumName` | Text | Album name (repeater) | - |
| `#albumCount` | Text | Photo count (repeater) | - |
| `#albumAccess` | Text | Access type (repeater) | - |
| `#btnViewAlbum` | Button | View album (repeater) | onClick |
| `#btnSubmitPhotos` | Button | Submit Photos | onClick |

---
## 📄 Jacksonville Guide (page)
URL: `/jax-guide`
Description: Bengali-friendly resources guide for Jacksonville
Total Elements: 8

| Element ID | Type | Purpose | Events |
|------------|------|---------|--------|
| `#jaxSection` | Section | Jacksonville Guide section | - |
| `#jaxTitle` | Text | Jacksonville Newcomer Guide | - |
| `#categoriesRepeater` | Repeater | Guide categories | - |
| `#categoryIcon` | Image | Category icon (repeater) | - |
| `#categoryName` | Text | Category name (repeater) | - |
| `#categoryDesc` | Text | Category description (repeater) | - |
| `#btnExploreGuide` | Button | Explore Full Guide | onClick |
| `#btnSubmitListing` | Button | Submit a Listing | onClick |
