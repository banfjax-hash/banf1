# BANF Data Seeding Guide
> Populate all Wix Data collections with realistic sample data for testing

---

## Quick Start (After Publishing)

```javascript
// In your Wix site's frontend code or browser console:
import { seedAllCollections } from 'backend/seed-data.jsw';

// Seed everything in one call (idempotent — skips existing data)
const result = await seedAllCollections();
console.log(result.summary);
// → "Seeded: 29, Skipped: 0, Failed: 0"
```

---

## What Gets Seeded (30 Collections, 100+ Records)

### Tier 1 — Core UI Collections (pages depend on these)

| Collection | Records | Key Fields |
|---|---|---|
| **Members** | 8 | name, email, phone, plan, status, paymentStatus |
| **ECMembers** | 6 | name, role, bio, email, initials, order |
| **MemberProfiles** | 3 | firstName, lastName, profession, hometown, engagementScore |
| **MembershipPlans** | 4 | planType, name, price, earlyBirdPrice, benefits |
| **Events** | 7 | name, date, location, status, category (2 past + 5 upcoming) |
| **Sponsors** | 5 | companyName, tier, pledgedAmount, paidAmount, status |
| **SponsorTiers** | 5 | tierKey, name, minAmount, logoSize |
| **RadioSchedule** | 7 | timeSlot, showName, emoji, isLive |
| **RadioNowPlaying** | 1 | title, artist |
| **EMagazines** | 3 | title, issueNumber, issueDate, isPublished |
| **EMagazineArticles** | 4 | title, authorName, category, content |
| **Announcements** | 3 | title, content, priority, isActive |
| **JacksonvilleGuide** | 4 | name, category, address, rating, bengaliOwned |
| **PhotoAlbums** | 3 | name, date, photoCount, category |
| **Photos** | 3 | caption, photographer, isFeatured |

### Tier 2 — Admin & Operational Collections

| Collection | Records | Key Fields |
|---|---|---|
| **Admins** | 3 | name, email, role, isActive |
| **FinancialRecords** | 6 | type (income/expense), category, amount |
| **Transactions** | 4 | type (credit/debit), amount, status |
| **Volunteers** | 3 | name, skills, hoursLogged |
| **Vendors** | 3 | companyName, category, services, rating |
| **Documents** | 3 | title, fileName, category, isPublic |
| **Complaints** | 1 | complaintId, category, status |
| **Surveys** | 1 | title, questions, status |
| **Scholarships** | 1 | name, amount, deadline, requirements |
| **ContactSubmissions** | 2 | name, subject, message, status |
| **CarpoolOffers** | 1 | driverName, destination, availableSeats |
| **ImportantMessages** | 1 | title, content, priority |
| **SongRequests** | 3 | songTitle, artist, status |
| **Guides** | 2 | title, content, category |

### Tier 3 — Auto-Generated at Runtime (No Seed Needed)

These 90+ collections are created automatically when users interact with the site:
- Activity Logs: `ActivityLog`, `MemberActivityLog`, `EventActivityLog`, etc.
- Queues: `PushQueue`, `SMSQueue`, `WhatsAppQueue`
- Registrations: `EventRegistrations`, `EventRSVPs`, `ScholarshipApplications`
- Email: `ContactGroups`, `GroupContacts`, `SentEmails`, `InboxMessages` (use `setup-collections.jsw`)
- Payments: `Payments`, `MembershipPayments`, `SponsorPayments`, `EventPayments`

---

## Available Commands

### From Frontend Code or Test Page

```javascript
import {
    seedAllCollections,
    seedCollection,
    clearCollection,
    resetAllCollections,
    getAvailableSeedCollections
} from 'backend/seed-data.jsw';
```

| Function | Description |
|---|---|
| `seedAllCollections()` | Seeds all 30 collections. **Idempotent** — skips if data exists. |
| `seedCollection("Events")` | Seed a single collection by name. |
| `clearCollection("Events")` | ⚠️ Delete ALL records from a collection. |
| `resetAllCollections()` | ⚠️ **DESTRUCTIVE** — clears everything, then re-seeds. |
| `getAvailableSeedCollections()` | List all collections and record counts (no DB calls). |

### Typical Testing Workflow

```javascript
// 1. First-time setup — seed everything
const r1 = await seedAllCollections();
console.log(r1.summary);

// 2. Check what's available
const info = getAvailableSeedCollections();
console.log(info);  // { totalCollections: 30, totalRecords: 105 }

// 3. Reset a single collection (e.g., after testing mutations)
await clearCollection("Events");
await seedCollection("Events");

// 4. Nuclear option — reset everything
const r4 = await resetAllCollections();
console.log(r4.summary);
```

---

## Data Characteristics

All sample data is **BANF-relevant** (Bangladeshi-American community in Jacksonville, FL):

- **Members**: Realistic Bengali names, 904 area code phones, FL addresses
- **Events**: Real Bengali festivals (Pohela Boishakh, Durga Puja, Ekushey)
- **Sponsors**: Local Bengali-owned businesses in Jacksonville
- **Radio**: Bangla music shows with Bengali/English names
- **Magazine**: Community articles about culture, recipes, youth
- **Guide**: Real Jacksonville locations (restaurants, grocery, mosque, dental)
- **Financial**: Realistic income/expense patterns for a community org

### Data Relations

The seed data uses **cross-references** where possible:
- Members who are also Volunteers (Sultana, Anwar, Taslima)
- Sponsors that are also in JacksonvilleGuide (Bengal Tiger, Dhaka Grocery)
- ECMembers that are also Admins (Dr. Mahmud, Rezaul Karim)
- Events with matching PhotoAlbums (Bijoya, Cricket, Ekushey)

> **Note:** Wix Data `_id` fields are auto-generated on insert, so cross-collection
> `_id` references (like `albumId` in Photos) will be empty in seed data.
> Use the backend's `seedCollection` to populate them at runtime if needed.

---

## Seed Data Files

| File | Purpose |
|---|---|
| [`seed-data/banf_seed_data.json`](seed-data/banf_seed_data.json) | Raw JSON — all seed data in portable format |
| [`src/backend/seed-data.jsw`](src/backend/seed-data.jsw) | Velo backend module — run on live site to populate DB |

---

## Extending Seed Data

To add seed data for a new collection:

1. Add the collection name and records to the `SEED_DATA` object in `src/backend/seed-data.jsw`
2. Also add to `seed-data/banf_seed_data.json` for the portable copy
3. Run `seedCollection("NewCollectionName")` from your site

```javascript
// Example: Adding seed data for a new "Donations" collection
// In SEED_DATA object, add:
Donations: [
    { donorName: "Rahim Ahmed", amount: 100, date: new Date("2026-01-15"), campaign: "Puja Fund", status: "completed" },
    { donorName: "Anonymous", amount: 500, date: new Date("2026-02-01"), campaign: "Scholarship", status: "completed" }
]
```
