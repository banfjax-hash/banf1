# BANF Wix Home Page - Element ID Mapping Guide

## Overview

This document maps HTML elements to Wix Velo element IDs for the BANF Home page.

When designing the page in Wix Editor, assign these exact IDs to elements for the JavaScript code to work.

---

## 🔧 How to Add IDs in Wix Editor

1. Click on an element
2. Open Properties Panel (right side)
3. Find "ID" field at the top
4. Enter the ID **without** the `#` symbol

Example: For `#btnJoinBANF`, enter `btnJoinBANF` in the ID field

---

## Navigation Elements

| Element Type | Wix ID | Description | Link Target |
|-------------|--------|-------------|-------------|
| Image | `imgLogo` | Site logo | `/` (Home) |
| Button/Text | `navHome` | Home nav link | `/` |
| Button/Text | `navEvents` | Events nav link | `/events` |
| Button/Text | `navMembers` | Members nav link | `/members` |
| Button/Text | `navGallery` | Gallery nav link | `/gallery` |
| Button/Text | `navMagazine` | Magazine nav link | `/magazine` |
| Button/Text | `navRadio` | Radio nav link | `/radio` |
| Button/Text | `navSponsors` | Sponsors nav link | `/sponsors` |
| Button/Text | `navVolunteer` | Volunteer nav link | `/volunteer` |
| Button/Text | `navContact` | Contact nav link | `/contact` |
| Button | `btnLogin` | Login button | Opens login modal |
| Button | `btnRegister` | Register button | Opens signup modal |
| Button | `btnUserMenu` | User dropdown menu | Shows user options |

---

## Hero Section

| Element Type | Wix ID | Description | Content/Action |
|-------------|--------|-------------|----------------|
| Text | `txtBengaliWelcome` | Bengali welcome text | স্বাগতম - নর্থ ফ্লোরিডার বাঙালি সমাজে |
| Text | `txtEnglishWelcome` | English welcome | Welcome to BANF |
| Text | `txtTagline` | Tagline text | Celebrating Bengali Heritage Since 1988 |
| Button | `btnJoinBANF` | Join CTA button | Opens registration/payment |
| Button | `btnExploreEvents` | Events CTA button | `/events` |
| Image | `imgHero` | Hero background image | - |

---

## Stats Section

| Element Type | Wix ID | Description | Default Value |
|-------------|--------|-------------|---------------|
| Text | `txtMemberCount` | Member count | 500+ |
| Text | `txtEventCount` | Event count | 50+ |
| Text | `txtSponsorCount` | Sponsor count | 25+ |
| Text | `txtYearsCount` | Years active | 35+ |

---

## Quick Access Section

| Element Type | Wix ID | Description | Link Target |
|-------------|--------|-------------|-------------|
| Box/Button | `quickEvents` | Events quick link | `/events` |
| Box/Button | `quickMembers` | Members quick link | `/members` |
| Box/Button | `quickGallery` | Gallery quick link | `/gallery` |
| Box/Button | `quickMagazine` | Magazine quick link | `/magazine` |
| Box/Button | `quickRadio` | Radio quick link | `/radio` |
| Box/Button | `quickVolunteer` | Volunteer quick link | `/volunteer` |
| Box/Button | `quickDonate` | Donate quick link | `/donate` |
| Box/Button | `quickCommunity` | Community quick link | `/community` |

---

## Featured Events Section

| Element Type | Wix ID | Description |
|-------------|--------|-------------|
| Repeater | `repeaterEvents` | Events repeater container |
| Text | `txtNoEvents` | "No events" message (hidden by default) |
| Button | `btnViewAllEvents` | View all events button |

### Inside Repeater Item:
| Element Type | Wix ID | Description |
|-------------|--------|-------------|
| Text | `txtEventTitle` | Event title |
| Text | `txtEventDate` | Event date |
| Text | `txtEventVenue` | Event venue |
| Image | `imgEvent` | Event image |
| Button | `btnEventDetails` | View details button |
| Button | `btnRegister` | Register button |

---

## News Section

| Element Type | Wix ID | Description |
|-------------|--------|-------------|
| Repeater | `repeaterNews` | News repeater container |
| Button | `btnViewAllNews` | View all news button |

### Inside Repeater Item:
| Element Type | Wix ID | Description |
|-------------|--------|-------------|
| Text | `txtNewsTitle` | News title |
| Text | `txtNewsDate` | News date |
| Text | `txtNewsPreview` | News preview text |

---

## Radio Widget Section

| Element Type | Wix ID | Description |
|-------------|--------|-------------|
| Text | `txtRadioStatus` | Radio status (LIVE/Offline) |
| Text | `txtCurrentShow` | Current show name |
| Text | `txtNextShow` | Next show info |
| Button | `btnPlayRadio` | Play radio button |
| Button | `btnRadioSchedule` | View schedule button |

---

## Contact Form Section

| Element Type | Wix ID | Description |
|-------------|--------|-------------|
| Text Input | `inputName` | Name field |
| Text Input | `inputEmail` | Email field |
| Text Box | `inputMessage` | Message field |
| Button | `btnSubmitContact` | Submit button |
| Text | `txtContactSuccess` | Success message (hidden) |

---

## User/Member Section

| Element Type | Wix ID | Description |
|-------------|--------|-------------|
| Text | `txtWelcome` | Welcome message |
| Box | `boxMemberSection` | Member-only content |
| Button | `btnMemberLogin` | Member login button |
| Button | `btnLogout` | Logout button |
| Button | `btnProfile` | Profile button |
| Button | `btnPayment` | Payment button |

---

## Page Structure (Boxes/Containers)

| Element Type | Wix ID | Description |
|-------------|--------|-------------|
| Box | `boxHeader` | Header container |
| Box | `boxHero` | Hero section |
| Box | `boxStats` | Stats section |
| Box | `boxQuickAccess` | Quick access section |
| Box | `boxEvents` | Events section |
| Box | `boxNews` | News section |
| Box | `boxRadio` | Radio section |
| Box | `boxContact` | Contact section |
| Box | `boxFooter` | Footer section |

---

## Wix Editor Setup Steps

### 1. Create Page Structure
1. Add Strip/Section for each major section
2. Give each section a proper ID (boxHero, boxEvents, etc.)

### 2. Add Navigation
1. Add menu or buttons for navigation
2. Assign nav IDs (navHome, navEvents, etc.)
3. **Don't set links manually** - JS handles navigation

### 3. Add Hero Section
1. Add text elements with IDs: txtBengaliWelcome, txtEnglishWelcome, txtTagline
2. Add buttons with IDs: btnJoinBANF, btnExploreEvents

### 4. Add Stats Section
1. Add 4 text elements: txtMemberCount, txtEventCount, txtSponsorCount, txtYearsCount
2. Add labels below each (not controlled by code)

### 5. Add Quick Access
1. Add boxes/buttons for each service
2. Assign IDs: quickEvents, quickMembers, etc.

### 6. Add Events Repeater
1. Add a Repeater element
2. ID: `repeaterEvents`
3. Inside repeater item, add elements with IDs:
   - txtEventTitle, txtEventDate, txtEventVenue
   - imgEvent, btnEventDetails, btnRegister

### 7. Add Contact Form
1. Add input elements: inputName, inputEmail, inputMessage
2. Add submit button: btnSubmitContact
3. Add success text (hidden): txtContactSuccess

---

## Linking Methods Used

### `wixLocation.to(path)`
Navigates to a page within the site.
```javascript
wixLocation.to('/events');
wixLocation.to('/events/' + eventId);
```

### `wixUsers.promptLogin()`
Opens Wix's built-in login modal.
```javascript
wixUsers.promptLogin({ mode: 'login' });
wixUsers.promptLogin({ mode: 'signup' });
```

### `wixWindow.openLightbox(name, data)`
Opens a custom lightbox.
```javascript
wixWindow.openLightbox('Alert', { message: 'Hello!' });
```

---

## Testing Checklist

- [ ] All navigation links work
- [ ] Login/Register buttons show Wix modal
- [ ] Hero CTAs navigate correctly
- [ ] Quick access cards link to correct pages
- [ ] Events repeater displays data
- [ ] Contact form submits successfully
- [ ] Stats display correctly
- [ ] Radio widget shows status
- [ ] User state changes on login/logout

---

## Files Reference

| File | Purpose |
|------|---------|
| `Home.mainPage.js` | Main page JavaScript code |
| `Home.html` | HTML template (design reference) |
| `masterPage.js` | Site-wide navigation code |
| `backend/*.jsw` | Backend API functions |

---

## Collection Dependencies

The Home page reads from these collections:
- `Events` - Featured events
- `NewsAnnouncements` - Latest news
- `Feedback` - Contact form submissions (write)

Make sure these collections exist and have proper permissions.
