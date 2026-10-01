# ACOMI Public Website — Redesign Analysis

**Status:** Analysis and redesign plan only. No application code, APIs, routes, or UI were changed.

**Date:** 2026-09-27  
**Local site inspected conceptually against:** `http://localhost:5174` plus screenshots supplied in conversation  
**Repos:** `K:\AcomiPublicWebsite`, `K:\AcomiWeb`, `K:\AcomiMobile` (capability check), `K:\Projects\Acomi\Backend\acomi-backend`

**Evidence rule:** Capabilities below are **VERIFIED** from current source unless marked **NOT VERIFIED**, **PARTIAL**, or **requires new development**.

Related older docs (do not treat as current IA): `docs/CONTEXT.md` (2026-08-22, written when the site was operator-only), `docs/public-website-product-context.md`, `docs/public-website-visual-spec.md`.

---

## 1. Executive summary

ACOMI is two products on one brand:

1. **Operations software** (Web App + Android) for owners/operators of **PG, Hostel, Co-living, Rental, and Mess**.
2. **Public discovery** (Public Website + signed-in Find a place) for people looking for a **place** or a **meal service**, with **Get Contact Details** via enquiry — **not** public owner phone numbers.

The public homepage still explains the **operator product** first (occupancy, headcount, payments, WhatsApp, inventory, complaints). Places and Meals exist and work, but they are not the first story after “How can ACOMI help you?” Footer, Pricing, and Who it’s for still contain **operator-marketplace denial** copy that contradicts live `/places` and `/meals`.

**Recommended direction:** Keep one site. Make the first screen a clear fork — **Find a place / Find meals** vs **Run a property / Run a mess** — then reuse existing discovery and existing owner/mess landing pages. Do not invent verification, live beds, booking, or automatic WhatsApp.

---

## 2. Current website audit

### 2.1 Routes (from `src/App.tsx`)

| Route | Page | Purpose | Primary audience | Secondary | Main CTA | Secondary CTA | Important sections | Data | Web App links | Places/Meals links | Problems | Rec |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | HomePage | Brand + 4-intent hero + long operator feature tour | Mixed; visually **operators** | Seekers (hero cards only) | Get started free (user-type modal) | See how it works | Hero, metric strip, problem, two modes, headcount, payments, people, screenshots, WhatsApp, space types, how-it-works, owner/member, multi-space, inventory, complaints, platforms, final CTA | Mostly **illustrative DEMO** (`src/data/demo.ts`). Hero phones are marketing shots. | Sign in / Create account → auth modal or `app.acomi.in` | Hero seeker cards → location then `/places` or `/meals`. Nav has Places/Meals. | Home is 15+ sections; seeker path buried after operator demo cards; hero footnote still operator-only; metric strip is DEMO | **Modify** — shorten; put discovery next |
| `/places` | PlacesPage | Discover lodging | Seekers | Owners (see listings) | Get Contact Details | Location + search | Location modal, search, type/rent/amenity filters, infinite list, detail drawer | **API-driven** `GET /spaces/discover` + `/locations/search` | Enquire may send user to app/Android | Self | Auto-open location; list cards often lack mess-style extras (N/A). Rent filter is server `minRent`/`maxRent` | **Keep** (tune copy/nav) |
| `/places/:id` | PropertyDetailPage | Listing detail | Seekers | — | Get Contact Details | Map if `mapUrl` | Cover, chips, amenities, description, map | **API** `GET /spaces/discover/{id}` | Enquire / Open app | Places | Representative images when no real photo | **Keep** |
| `/meals` | MealsPage | Discover mess | Seekers | Vendors | Get Contact Details | Location + search | Location modal, search, infinite list; sidebar is hint only (no meal-price API filter) | **API** `type=MESS`. **Do not send minRent** (excludes messes). Menu/timing/foodType/subscription chips only if fields exist (usually empty) | Same enquiry | Self | `/register-mess` coming-soon vs drawer that already works | **Keep** |
| `/meals/:id` | MessDetailPage | Mess detail | Seekers | — | Get Contact Details | Map if present | Price if monthly/meal; chips | **API** detail | Enquire | Meals | Monthly/map often missing on cards | **Keep** |
| `/features` | FeaturesPage | Operator feature tour | Owners/vendors | — | Get started | Feature anchors | Repeats Home sections (metrics, two modes, occupancy, headcount, payments, members, screenshots, complaints, inventory, multi-space) | Illustrative | Auth | Weak | Heavy duplication with Home | **Merge** into owner/mess pages or slim Features |
| `/how-it-works` | HowItWorksPage | Operator onboarding story | Owners/vendors | Invited members | Final CTA | — | Create space → set up → invite → run day; PG vs mess flows; invite steps | Static copy | Implicit | None | No seeker “how enquiry works” | **Modify** — add seeker column or split |
| `/who-its-for` | WhoItsForPage | Operator audiences | Owners/vendors | — | Final CTA | — | Mess/PG/hostel/co-living/rental operator cards; owner vs invited member | Static | — | **Contradicts discovery** | SEO + body: “This site is not for people looking for a PG” / “Not a listing marketplace” | **Modify** immediately (copy) |
| `/platforms` | PlatformsPage | Web vs Android | Both | — | Open web app | Android | Web + Android; **no iOS download** | Static + `app.acomi.in` | Yes | No | Android Play URL exists in `openAcomiAndroidApp.ts`; page copy still says “No store URL is published” in `platformsPage.android.note` — **copy inconsistency** | **Modify** copy |
| `/pricing` | PricingPage | Explain no public price list | Owners | — | Get started | How it works | Create space / invite / run day | Static | Auth | No | Invite card: “no public listings” — **false now** | **Modify** |
| `/about` | AboutPage | Company/product types | Mixed | — | Final CTA | — | Space types, web/Android | Static | — | Weak | Operator framing | **Modify** |
| `/property-owners` | PropertyOwnersPage | Owner landing | Property owners | — | List / get started | How it works | Hero, problem, types, occupancy, payments, operations, multi-space, platforms, WhatsApp, how-it-works, trust, CTA | Illustrative | Register/login | No | Long; good audience focus | **Keep** (primary owner page) |
| `/mess-vendors` | MessVendorsPage | Mess landing | Mess/tiffin operators | — | List mess / get started | — | Parallel to owners | Illustrative | Register/login | No | Good | **Keep** |
| `/register-space` | RegisterSpacePage | Lead capture | Property owners | — | List Your Property (drawer) | Home | PageHero + auto-opens property listing drawer | Lead API `POST /property-registrations` — **does not create a space or user** | After verification, team may contact | — | Honest “registration received” | **Keep** |
| `/register-mess` | RegisterMessPage | Placeholder | Mess vendors | — | Back home / change choice | — | **Coming soon** badge | None | — | — | **Conflicts** with floating “List Your Mess” + `POST /mess-registrations` | **Modify** — wire like register-space or redirect |
| `/notifications` | NotificationsPage | Account notifications | Signed-in users | — | — | — | Inbox | API (auth) | Session | — | Not marketing | **Keep** (app chrome) |
| `/my-enquiries` | MyEnquiriesPage | Seeker enquiry history | Signed-in seekers | — | Find places | — | Enquiry statuses | API | Session | Places | Correct privacy model | **Keep** |
| `/404` | NotFoundPage | Error | All | — | Home | — | — | — | — | — | — | **Keep** |

### 2.2 Global chrome

- **Navbar:** Home, Explore (Features, How it works, Who it’s for, Platforms), Places, Meals, language, Sign in, Create account. User-type switcher hidden on Home/Places/Meals.
- **Floating CTAs:** List Your Property / List Your Mess (hidden on Places/Meals).
- **Footer:** Product links (no Places/Meals), account, privacy/delete on **Web App**. Tagline is operator-oriented.

### 2.3 Home sections (order)

`Hero` → `HeroMetricStrip` → `ProblemSection` → `TwoModesSection` → `HeadcountSection` → `PaymentsSection` → `PersonSection` → `ScreenshotsSection` → `WhatsAppSection` → `SpaceTypesSection` → `HowItWorksHomeSection` → `OwnerMemberSection` → `MultiSpaceSection` → `InventorySection` → `ComplaintsSection` → `PlatformsSection` → `FinalCta`.

---

## 3. Current Web App capability audit

**Source:** `K:\AcomiWeb\src\app\router\routes.tsx`, `src\shared\types\space.ts`.

**Space types (VERIFIED):** `PG`, `MESS`, `HOSTEL`, `CO_LIVING`, `RENTAL`.  
**Serviced / corporate accommodation as a type:** **NOT VERIFIED** — not a `SpaceType`. Do not market it as a first-class listing type.

### Accommodation (non-MESS)

| Capability | Status |
|---|---|
| Spaces, create space | VERIFIED (`/create-space`, space dashboard) |
| Buildings, floors, rooms, beds | VERIFIED (accommodation + bed-inventory + occupancy wizard) |
| Members / tenants | VERIFIED (`members`, import, add-hub) |
| Occupancy, vacancies, reservations, move-ins | VERIFIED (`occupancy`, occupancy wizard, space-health) |
| Payments, rent, deposits, proofs (ledger, not a payment gateway) | VERIFIED (`payments`) |
| Complaints | VERIFIED |
| Inventory | VERIFIED |
| Enquiries (owner side is admin-mediated on public; members have My Enquiries) | VERIFIED member `/my-enquiries`; admin enquiries in admin console |
| Multi-space / global dashboard | VERIFIED (`my-spaces`, `global-*`) |
| Reports / notices / activity / attention | VERIFIED routes: `globalReports`, `globalNotices`, `globalActivity`, `globalAttention` — **depth of each report NOT fully audited** (exists as product surfaces) |

### Meals (MESS and lodging-with-meals)

| Capability | Status |
|---|---|
| Mess space (no rooms/beds required) | VERIFIED |
| Customers | VERIFIED |
| Menu library, locations, share | VERIFIED (`meals/library`, `locations`, `share`) |
| Participation / polls; breakfast, lunch, dinner | VERIFIED (`participation`, `poll`) |
| Headcount | VERIFIED (`meal-headcount`) |
| Meal plans / customer plans | VERIFIED (`plans`, `plans/customer`) |
| Day meal payments | VERIFIED (`payments/day-meals`) |
| Complaints, inventory | VERIFIED (same modules) |

### General

| Capability | Status |
|---|---|
| Owner/operator vs invited member/customer | VERIFIED (invite by 10-digit Indian mobile; roles) |
| Notifications | VERIFIED |
| WhatsApp **automatic sending** | **NOT IMPLEMENTED** as a sender. Product generates **shareable text**. Public site already footnotes this. |
| Web + Android | VERIFIED. **iOS public download: not offered** (`platformsPage`). |
| Find a place (signed-in) | VERIFIED (`find-a-place`) — same discover APIs as public site |
| Join space / accept invitations | VERIFIED |
| Admin: properties, mess leads, enquiry review, credits | VERIFIED (admin routes) |

**Payments:** operational **expected / collected / under review / pending** with proofs. Not “pay rent on ACOMI” as a gateway unless separately verified — **NOT VERIFIED as a payment gateway**.

---

## 4. Backend / API capability audit

### Public / anonymous

| API | Purpose | Notes |
|---|---|---|
| `GET /api/v1/spaces/discover` | Paginated discover | `search`, `location` (address match), `type` / `types`, `minRent`, `maxRent`, `amenities`, `sort`, `page`/`size` (default 20). **No owner/contact values.** |
| `GET /api/v1/spaces/discover/{spaceId}` | Detail | Address parts, `mapUrl`, `hasContact`, prices, amenities, `foodIncludedInRent`, `genderPolicy`, `sharingNotes`, membership flags |
| `GET /api/v1/locations/{states,districts,talukas,areas,search}` | India location reference | Search `q` + optional ranking `state`/`district`/`taluk` |
| `POST /api/v1/property-registrations` | Property lead | OTP/verification token; **does not create space or user** |
| `POST /api/v1/mess-registrations` | Mess lead | Same class of lead capture (public website client) |

### Authenticated (relevant to public journeys)

| API | Purpose |
|---|---|
| `POST /api/v1/spaces/{spaceId}/enquiries` | Contact enquiry |
| `GET /api/v1/enquiries/me`, `GET /enquiries/{id}` | My enquiries |
| `POST /enquiries/{id}/email-contact` | Email owner contact (WEB channel) |

**Enquiry privacy (VERIFIED):** Owner contact is **not** on discover payloads. WEB enquiries deliver via **email** (and optionally app). ANDROID SHARED can show contact in-app. Web free daily enquiry cap exists (`InquiryAccessService` — 5/day). Admin can review/share/reject.

### Discover gaps (do not promise on public site)

- **No** `minMeal` / `maxMeal` query. Sending `minRent` with `type=MESS` filters on property `startingPrice` and **drops messes**.
- Card payloads **often omit** mess `monthlyPrice` / `mapUrl`.
- Discover **does not** expose menu, meal timing, food type, subscription, or reliable `mealsServed` for filters.
- **No** live bed vacancy on public cards.
- **No** guaranteed response time, verification badge, or brokerage model in API.

### Listing photos

Public/mobile use a **deterministic representative image** when no verified listing photo exists. Real verified photo wins. Do not call these “real property photos.”

---

## 5. Screenshot / UX analysis

Screenshots from this conversation (home hero, occupancy strip, Places, app find-a-place) plus local `/` structure:

### First 10 seconds

1. Nav: Home, Explore, Places, Meals — Places/Meals **are** visible.
2. Hero: “How can ACOMI help you?” + four equal cards (place, meals, own property, run food).
3. Immediately below: four **illustrative** product cards (occupancy 80% donut, meal bars, payments, people).
4. Then a long operator story. A seeker who clicked nothing is in a **PMS demo**, not a marketplace.

### Hero assessment

The **four-path hero is the right positioning** for a dual-audience site. Problems:

- H1 is a question, not a definition of ACOMI.
- Subtitle is “choose what describes you” — good for IA, weak for trust.
- Footnote: “Built for Indian mess, PG, hostel and co-living operators” — **erases seekers**.
- Phones (PG / MESS) compete with the four cards; they sell the **app**, not discovery.
- “Get started free” opens the same user-type modal as the cards — **CTA duplication**.

**Do not replace the four cards with a single search bar** unless owners lose a first-screen path. Competitors (Hostro, PGTribes, ThePgFinder) lead with **search + verified/booking claims ACOMI cannot make**. ACOMI should lead with **honest fork + location**, not fake marketplace claims.

### Other UX issues

- Occupancy card previously squeezed donut + counts (since stacked in a later UI tweak; still illustrative).
- Product-feature density on Home is high; repetition with Features/owner pages.
- Floating List Property/Mess is strong for owners, **noise** for seekers after they already chose a path.
- Mobile: four cards + phones + 15 sections = long scroll; Explore hides How it works.

### Trust

- DEMO figures (₹1,28,450, 78/86 plates) look like real metrics if “Illustrative product data” is easy to miss.
- Enquiry: must say contact is **requested through ACOMI**, not published.

### Is ACOMI understandable?

**Partial.** Operators get “dashboard for mess/PG.” Seekers get Places/Meals in nav but Home still says the site is for operators (Who it’s for, Pricing invite line, hero footnote).

---

## 6. Audience analysis

### A. Tenants / customers (seekers)

**Need:** PG, hostel, co-living, rental, mess/tiffin/meals near a **location**.  
**Have today:** Places, Meals, location API, discover, enquiry.  
**Do not have:** Instant book, live beds, public phone, verified-KYC badge, meal-price server filter, corporate housing type.

### B. Owners / operators / vendors

**Need:** Run occupancy or meals, members/customers, dues proofs, complaints, inventory, multi-space, web+Android.  
**Have today:** Full Web App + Android + owner/mess marketing pages + lead drawers.  
**Join path:** Register/login → create space **or** list via lead form (admin converts). Invited people do **not** get the operator console.

### Journey clarity target

| Intent | Should land |
|---|---|
| I need a place | Location → `/places` |
| I need a meal | Location → `/meals` |
| I manage a place | `/property-owners` → list or `app.acomi.in/register` |
| I manage meals | `/mess-vendors` → list mess or register |

---

## 7. Current problems

1. **Two products, one operator homepage.**
2. **Copy contradiction:** Who it’s for + Pricing still deny public listings.
3. **`/register-mess` is Coming Soon** while mess lead API + drawer work.
4. **Features ≈ Home** (duplicate).
5. **How it works** ignores enquiry.
6. **Footer** omits Places/Meals.
7. **Hero footnote** operator-only.
8. **Illustrative metrics** can be read as ACOMI’s live stats.
9. **WhatsApp title** can be read as auto-send; footnote is easy to miss.
10. **Platforms** copy vs Play Store helper inconsistency.
11. **CTA pile-up:** Get started, Create account, List property, List mess, Open web app.
12. **Seeker filters** oversold if we imply meal menus/prices always exist.
13. **Who it’s for SEO** still “Not a PG marketplace.”
14. **No seeker trust block:** enquiry privacy, 5 free web enquiries/day, Android vs email — **not explained on Home**.

---

## 8. Recommended positioning

**Use only verified capabilities.**

1. **Primary:** ACOMI helps you **find** a stay or a meal service — and helps operators **run** that stay or mess.
2. **Supporting:** Search by location. Ask for contact through ACOMI. Owners run occupancy, meals, dues, and day-to-day work on web and Android.
3. **Seeker VP:** See listed PGs, hostels, co-living, rentals, and messes. Filter what the server supports. Request contact without public phone numbers on the page.
4. **Owner VP:** One space (or several) for beds, people, rent proofs, complaints, inventory.
5. **Mess VP:** Customers, menu, polls, headcount, meal dues — not rooms.
6. **Primary CTA (Home):** Split — **Search places** / **Search meals** (seekers) and **List property** / **List mess** (operators).
7. **Secondary CTA:** How ACOMI works (both journeys) + Sign in.

**Do not claim:** guaranteed availability, verified properties, guaranteed savings, guaranteed reply time, automatic WhatsApp, live inventory, instant booking, zero brokerage (unless legal/product later **VERIFIED**).

---

## 9. Recommended information architecture

Proposed IA (reuse existing routes; rename in nav only where needed):

```
HOME /
├── Places          /places  (+ /places/:id)
├── Meals           /meals   (+ /meals/:id)
├── For owners      /property-owners
├── For mess        /mess-vendors
├── How ACOMI works /how-it-works   (add seeker + operator)
├── Explore         Features (slim), Platforms, Pricing, About
└── Sign in / Create account
```

**Evaluate and reject as required new routes:** `/for-owners`, `/for-mess`, `/login`, `/register` on the **public** origin — login/register already live on `app.acomi.in` and the public auth modal. Do not add duplicate public `/login` unless consolidating auth (would be **new work**).

**Keep** `/register-space`. **Fix** `/register-mess` to match (not Coming Soon).

**Merge** Features into owner/mess pages over time; keep `/features` as redirect or slim TOC.

**Modify** `/who-its-for` to include seekers **or** retire it into How it works.

---

## 10. Home page proposal

Recommended **shorter** Home (not the 15-section dump):

| # | Section | Purpose | Audience | Heading (draft) | Support | CTA | Data | Reuse | New? |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Hero | Define ACOMI + 4 paths | Both | Stay. Meals. One ACOMI. / or keep question + definition line | Location-based search for people; operations for owners | Four cards; drop extra “Get started” or make it “I’m not sure” | Static | `Hero`, `HeroIntentCard`, `LocationSelectModal` | Optional shorter H1 |
| 2 | Discovery preview | Prove Places/Meals exist | Seekers | Places and meals you can actually browse | Location + types we support | Browse places / Browse meals | Optional **real** 4-card sample from discover **or** deep-link only | `PropertyCard`/`MessCard` | Small strip component |
| 3 | How contact works | Trust | Seekers | Contact is requested through ACOMI | No public owner phone on listings; email/app after review | See places | Static, accurate | Enquire copy | Short 3-step |
| 4 | For operators | Product | Owners/vendors | Run the property or the mess | Occupancy or headcount; dues proofs; invites | For owners / For mess | Illustrative, labeled | Owner/Mess hero snippets, metric strip **or** one screenshot | Do not repeat all Home sections |
| 5 | Platforms | Access | Both | Web and Android | Same account | Open app / Play | Static | `PlatformsSection` | Fix Play URL copy |
| 6 | Final CTA | Conversion | Split | Find a place or start a space | — | Places, Meals, List property, List mess | — | `FinalCta` rewritten | Copy only |

**Drop from Home or move:** Problem, TwoModes, Headcount, Payments, Person, Screenshots, WhatsApp, Space types, HowItWorks home, OwnerMember, MultiSpace, Inventory, Complaints — **already on Features + owner + mess pages**.

---

## 11. Tenant / customer journey

**Ideal (already mostly built):**

Home → choose place or meals → **location popup** (`/locations/search`) → `/places` or `/meals` → search (name; location stays separate) → filters (places: type, rent, amenities) → card → detail → **Get Contact Details** → auth if needed → enquiry → `/my-enquiries` / email / Android.

**Expose prominently (supported):**

- Location (required UX, server `location`)
- PG, Hostel, Co-living, Rental (`types`)
- Rent range (places only, `minRent`/`maxRent`)
- Amenities, food included (when API has them)
- Contact **availability** (`hasContact` chip), not the number
- Map **only if** `mapUrl`
- Gender / sharing **when present** (`genderPolicy`, `sharingNotes`)
- Mess name search; **not** invented meal filters

**Do not expose as live inventory:** vacant beds, guaranteed seats, menu unless API fields exist.

---

## 12. Owner / operator journey

**Categories (map to Web App, not a laundry list on Home):**

**Property operations:** buildings, floors, rooms, beds, occupancy, members.  
**Money:** expected/collected/review/pending, deposits, proofs — **not** “payment gateway.”  
**Meals (if mess or food-included lodging):** customers, menu, polls, headcount, meal dues.  
**Operations:** complaints, inventory, notifications, **shareable** WhatsApp text.  
**Multi-space:** my spaces, global attention/activity/members/meals/payments/complaints/notices/reports.

**Ideal:** Home → For owners → understand → List Your Property (lead) **and/or** Create account → create space → configure → run.

Lead form ≠ live space. Say so (already in register success copy).

---

## 13. Mess / vendor journey

Same shape: Home → For mess → List Your Mess (`POST /mess-registrations`) **and/or** register → create **MESS** space → menu, customers, poll, headcount.

**Separate landing pages (`/property-owners`, `/mess-vendors`) should stay** — different nouns (beds vs plates). Shared: auth, How it works (two columns), platforms.

`/register-mess` should open the mess drawer like `/register-space`, not Coming Soon.

---

## 14. Places strategy

Keep server-side pagination (size 20), location ≠ search, auto location prompt, Get Contact Details, info chips, representative images.

Improve (later phases): Home preview of real listings; footer/nav consistency; don’t imply ratings (none in discover). Gender/sharing as filters only if backend adds them — **today not discover query params** (gender is detail field only).

---

## 15. Meals strategy

Keep `type=MESS`, no rent filters, location + name search, same enquiry.

Be explicit: meal price/menu chips are **information-if-present**. Sidebar stays educational until meal filters exist (**requires new backend**).

---

## 16. Page-by-page recommendations

### Home `/`

- **Goal:** Dual-audience fork in one screen.
- **Hero:** One line what ACOMI is + current four cards.
- **Primary CTAs:** the four cards. **Secondary:** How it works.
- **Sections:** as table in §10.
- **Reuse:** Hero, location modal, cards, platforms.
- **API:** optional discover preview.
- **New backend:** none required for Phase 1 copy/IA.
- **Mobile:** stack cards; phones below or hide on small screens.
- **SEO:** title should mention find stay/meals **and** run operations. Current title is operator-only.

### Places / Meals / details

- Keep implementation. Add short “how contact works” line on list pages.
- SEO: already path-specific.

### For owners / For mess

- Keep as deep product pages. Link from Home once, not 10 feature sections.

### How it works

- **Add** seeker steps: location → results → enquiry → contact via ACOMI.
- Keep operator steps: create/invite/run.

### Who it’s for

- Rewrite or merge. Must include seekers.

### Features

- Slim table of contents linking to owner/mess anchors. Stop cloning Home.

### Platforms / Pricing / About

- Fix contradictions (listings exist; Play URL if shipped).
- Pricing: remove “no public listings.” Keep “no public price list” if still true.

### Register space / mess

- Both should be real lead pages.

### Notifications / My enquiries

- Keep as signed-in utilities.

---

## 17. Visual design recommendations

**Do not redesign in this phase.** Guidance only.

| | |
|---|---|
| **KEEP** | ACOMI green; mint/orange/purple/blue domains; rounded cards; BrandMark; location modal pattern; listing cards; “illustrative” labeling (make stronger) |
| **IMPROVE** | Hero hierarchy (definition first); section spacing; occupancy/metric card layout; type scale so seeker vs operator equal; footer; CTA count |
| **REMOVE** | Duplicate feature galleries on Home; Coming Soon mess register; operator-only denials of listings |
| **INTRODUCE** | Seeker 3-step contact explainer; optional live listing strip; quieter floating CTAs after seeker intent |

Floating List buttons: keep for marketing pages; already hidden on Places/Meals — good.

---

## 18. Data / API mapping

| Surface | Use real API | Keep illustrative |
|---|---|---|
| Places/Meals list & detail | Yes | Representative image badge when no photo |
| Home listing strip (if added) | Yes, public discover only | — |
| Occupancy %, payments ₹, headcount 78/86 | No | Yes, labeled DEMO |
| WhatsApp bubbles | No | Yes + “not automatic sending” |
| Owner contact | Never on public cards | After enquiry policy |
| Occupancy vacancies | No public live beds | Operator product shots only |

---

## 19. Keep / Modify / Remove / New

| Item | Action |
|---|---|
| `/places`, `/meals`, details, enquiry, location | **Keep** |
| Four-intent hero | **Keep**, tighten copy |
| `/property-owners`, `/mess-vendors` | **Keep** |
| `/register-space` + property lead API | **Keep** |
| Auth modal, my-enquiries, notifications | **Keep** |
| Home feature stack | **Modify** (cut/move) |
| `/features` | **Merge**/slim |
| `/who-its-for`, Pricing invite line, hero footnote | **Modify** (copy) |
| `/register-mess` Coming Soon | **Modify** |
| Platforms Play Store sentence | **Modify** |
| Footer | **Modify** (add Places/Meals) |
| How it works seeker column | **Modify** |
| Automatic WhatsApp, live inventory, verified, booking | **Do not add** without product |
| `/for-owners` aliases | **New** only if redirects wanted (optional) |
| Meal price server filters | **New** backend if required |
| Home live listing strip | **New** component, existing API |

---

## 20. Prioritized implementation roadmap

### Phase 1 — Highest impact (copy + IA, low risk)

| Change | Why | Likely files | Backend | Risk | Deps |
|---|---|---|---|---|---|
| Rewrite Who it’s for, Pricing, hero footnote, Home SEO | Stop contradicting Places/Meals | `en.json` + hi/mr, `HomePage` seo, WhoItsFor, Pricing | None | Low | None |
| Footer + Explore: Places, Meals, For owners, For mess | Navigation matches product | `Footer.tsx`, `links.ts`, Navbar | None | Low | None |
| Home: cut to hero + discovery + contact explainer + operator teaser + platforms + CTA | Seekers see a path | `HomePage.tsx` (compose only) | None | Medium (design) | Copy |
| `/register-mess` = drawer like register-space | Lead API already exists | `ComingSoonPages.tsx` / new thin page | None | Low | Mess drawer |
| How it works: enquiry steps | Trust | `HowItWorksPage.tsx`, i18n | None | Low | Copy |

### Phase 2 — Important

| Change | Why | Files | Backend | Risk | Deps |
|---|---|---|---|---|---|
| Slim Features; cross-link owner/mess | Less duplication | `FeaturesPage.tsx` | None | Low | Phase 1 IA |
| Home optional real listing strip | Proof of marketplace | New small section + discover hooks | None | Medium (empty states) | Discover quality |
| Platforms Play Store consistency | Honesty | `PlatformsPage` i18n, `openAcomiAndroidApp.ts` | None | Low | Confirm store listing live |
| Quieter floating CTAs on Home after scroll | Less owner-bias | `PersistentListingActions` | None | Low | — |

### Phase 3 — Enhancement (many need product)

| Change | Why | Backend |
|---|---|---|
| Meal price / menu filters on `/meals` | Parity with user expectation | **New** discover fields/filters |
| Gender/sharing as discover query | Seeker filters | **New** if not in `SpaceDiscoverQuery` |
| Live vacancy | Marketplace expectation | **New** + privacy review |
| iOS | Platforms story | **New** app |
| Auto WhatsApp | Marketing already tempted | **New** (do not imply until built) |

---

## 21. Open questions / confirmation

1. Is public Play Store listing live and should Platforms show the URL? (`openAcomiAndroidApp.ts` vs `platformsPage.android.note`.)
2. Should `/who-its-for` be deleted or rewritten?
3. Should Home show **real** discover cards (can be empty in new cities)?
4. Is “Get started free” still accurate (no public price, but enquiry credits exist)?
5. Admin SLA for enquiry share — any number we can publish? **Do not invent.**
6. Mess registration page: confirm Coming Soon was leftover, not a legal hold.
7. Corporate/serviced housing: confirm **out of scope** (no `SpaceType`).
8. Reports/notices depth — market as “available in the app” vs name each report? **Reports contents NOT fully verified.**

---

## Appendix A — Recommended nav / journeys / CTAs

**A. Nav:** Home · Places · Meals · For owners · For mess · How it works · Sign in · Create account. Explore: Platforms, Pricing, About, Features (slim).

**B. Home:** §10.

**C. Seeker:** §11.

**D. Owner:** §12.

**E. Mess:** §13.

**F. Places:** §14.

**G. Meals:** §15.

**H. How it works:** dual columns.

**I. Owner page:** keep `/property-owners`.

**J. Footer:** Places, Meals, For owners, For mess, How it works, Platforms, Pricing, About, Web app, Privacy, Delete account.

**K. CTAs:**  
- Seeker: Search places / Search meals.  
- Owner: List property / Open web app.  
- Mess: List mess / Open web app.  
- Avoid a fifth identical “Get started” on the same fold as the four cards.

---

## Appendix B — External IA (not ACOMI facts)

Indian PG sites often lead with **city search, verified listings, zero brokerage, instant book**. Those are **competitor patterns**, not ACOMI capabilities. ACOMI’s honest difference: **operations product + mediated contact enquiry + location-based browse**. Do not copy verification/booking language.

---

## Appendix C — Files inspected (non-exhaustive)

**Public:** `App.tsx`, `HomePage.tsx`, `Hero.tsx`, `userTypes.ts`, `Navbar.tsx`, `Footer.tsx`, `links.ts`, Places/Meals/detail pages, Features, HowItWorks, WhoItsFor, Platforms, Pricing, About, PropertyOwners, MessVendors, RegisterSpace, ComingSoonPages, PersistentListingActions, property/mess registration APIs, `demo.ts`, `en.json` (hero, whoItsFor, pricing, platforms, whatsapp), discover hooks (prior work).

**Web:** `routes.tsx`, `space.ts` SpaceType.

**Backend:** `SpaceDiscoverController`, discover DTOs, `LocationController`, `SpaceType`, `PropertyRegistrationController`, enquiry controller + `InquiryAccessService`.

**Mobile:** used only to confirm Find a place / same discover model (prior session).

**Screenshots:** home hero four cards; occupancy/meals/payments strip; Places (and web-app find-a-place as contrast).
