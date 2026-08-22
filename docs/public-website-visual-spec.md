# ACOMI Public Website — Phase W2 Visual + Content Specification

**Document type:** Design, UX, content, IA, and implementation specification  
**Date:** 2026-08-22  
**Phase:** W2 — specify only; do not implement  
**Intended public site:** `https://www.acomi.in`  
**Repository:** `K:\AcomiPublicWebsite` (GitHub: `ketankumbhar204/AcomiPublicWebsite`)  
**Product truth:** `K:\AcomiMobile\docs\public-website-product-context.md` (W1, read-only)

This document is the blueprint for Phase W3. Another developer should be able to implement the site from this file without reinterpreting product positioning.

**Out of scope for W2:** React/Vite project, CSS, npm, asset generation, AWS, DNS, S3, CloudFront, AcomiWeb, AcomiMobile, Backend, commits, pushes.

Evidence labels match W1: **VERIFIED** · **DOCUMENTED** · **HISTORICAL / STALE** · **PLANNED** · **UNKNOWN** · **PLACEHOLDER**

---

## 1. W2 objective

Produce an implementable visual and content specification for a **standalone marketing website** at `www.acomi.in` that:

1. Sells ACOMI to **space owners/operators** (primary buyer).
2. Uses only **VERIFIED** product claims from W1.
3. Reuses useful **layout/visual patterns** from the old CountIn marketing site without reusing CountIn identity, WhatsApp-first claims, pricing, or invented social proof.
4. Sends conversion traffic to the existing product: `https://app.acomi.in/register` and `https://app.acomi.in/login`.
5. Stays visually consistent with ACOMI product branding (teal “A” mark, Plus Jakarta Sans, green CTAs, light green canvas).

---

## 2. References inspected

| Source | Path / URL | Role |
|--------|------------|------|
| W1 product analysis | `K:\AcomiMobile\docs\public-website-product-context.md` | Product, claims, CTAs, domains, assets |
| ACOMI Play Store assets | `K:\AcomiMobile\docs\play-store-assets\` | Logo, feature graphic, phone screenshots |
| ACOMI theme tokens | Mobile `src/theme/colors.ts`, Web `src/shared/theme/colors.ts` | Brand colors |
| ACOMI web product | `K:\AcomiWeb` — **not modified** | Confirm app is separate from www |
| Old CountIn marketing site | `K:\countin old website\CountInWeb_UI` | Visual/UX reference only |
| Git branch model | AcomiMobile, AcomiWeb: `main`, `develop`, `production`, `aws-production` | Branch strategy for this repo |
| This repo | `K:\AcomiPublicWebsite` | Empty GitHub clone; W2 docs only |

Old CountIn path note: the folder is `CountInWeb_UI` (underscore), not `CountInWeb\_UI`.

---

## 3. Old CountIn website analysis

### 3.1 What it is

A **single-page** Vite + React + TypeScript + Tailwind v4 marketing landing (`src/pages/LandingPage.tsx`). No product login. Stack: React 19, Vite 8, Tailwind 4, Lucide, Framer Motion.

Section order:

1. Navbar (sticky)
2. Hero (copy + fake dashboard mock)
3. TrustProblems (6 problem cards)
4. Features (8 feature cards)
5. WhatsAppAutomation (chat mock + API claims)
6. DashboardPreview (fake analytics stats)
7. HowItWorks (3 steps)
8. Pricing (₹499 / ₹2,499 / ₹4,999)
9. Testimonials (3 named quotes)
10. FinalCta (dark band)
11. Footer

### 3.2 Visual system (measured from source)

| Token | Old CountIn value | Notes |
|-------|-------------------|--------|
| Font | Plus Jakarta Sans 400/500/600/700 | **Same family as ACOMI product** |
| Action green | `#25D366` (`wa-500`) | **Identical to ACOMI `primary`** |
| Hover green | `#20BD5A` (`wa-600`) | **Identical to ACOMI `primaryHover`** |
| Teal | `#128C7E` (`wa-dark`) | **Identical to ACOMI `primaryDark`** |
| Soft canvas | `#ECFDF5` (`brand-50`) | Close to ACOMI `#F3FAF6` / Android `#ECFDF5` |
| Page default | `bg-white text-slate-800` | White page, not green canvas |
| Container | `max-w-6xl` (1152px) + `px-4 sm:px-6 lg:px-8` | Centered |
| Section padding | `py-20 sm:py-24` | Strong vertical rhythm |
| Card radius | `rounded-2xl` (16px); pricing `rounded-3xl` | |
| Button radius | `rounded-xl` (12px) | `px-5 py-3 text-sm font-semibold` |
| Navbar | `h-16`, `sticky`, `bg-white/80 backdrop-blur-xl`, bottom border | |
| Eyebrow | `text-xs font-semibold uppercase tracking-[0.2em] text-wa-600` | |
| H1 | `text-4xl sm:text-5xl lg:text-[3.25rem]` bold | |
| H2 | `text-3xl sm:text-4xl` bold | |
| Body | `text-lg leading-relaxed text-slate-600` | |
| Card | White, `border-slate-200/80`, `shadow-sm`, hover green tint | |
| Motion | Framer `whileInView` fade/slide; hero floating cards infinite | |
| Breakpoint | `md:` hamburger; `sm:` 2-col; `lg:` 3–4 col / hero split | |

### 3.3 Why the old layout works

- Owner-first above the fold.
- Predictable marketing rhythm: problem → product → proof → steps → CTA.
- Reusable primitives: `Container`, `Button`, `SectionHeading`, `FeatureCard`.
- Phone/desktop split: hamburger under `md`, stacked CTAs.
- Green/teal already matches ACOMI tokens — the **palette can be kept**; the **story cannot**.

### 3.4 Why the old content cannot be reused

The old site is a **WhatsApp-first PG SaaS pitch** with invented traction. ACOMI is an **in-app operations product** with password login, invitation onboarding, and no WhatsApp automation. W1 forbids those claims.

---

## 4. Reusable visual patterns

Keep the **pattern**, replace identity and claims.

| Pattern | Keep? | ACOMI adaptation |
|---------|-------|------------------|
| Sticky 64px navbar, blur, logo left, links center, CTAs right | **Yes** | ACOMI “A” mark + wordmark; product links; Get started / Sign in |
| Mobile hamburger + full-width stacked CTAs | **Yes** | Same, no “Start free trial” |
| Two-column hero (copy left, visual right) | **Yes** | Real Play Store screenshots, not fake dashboard HTML |
| Pill eyebrow + large H1 + 1 paragraph + two buttons | **Yes** | No live ping; no city-trust line |
| Soft green radial wash behind hero | **Yes** | Subtle; no purple |
| `SectionHeading` (eyebrow / title / description, centered) | **Yes** | Teal eyebrow, slate title |
| 2/3-column problem cards with icon well | **Yes** | Map to real ACOMI capabilities; rose icon wells OK for problems |
| Feature cards, 16px radius, green icon tile, hover border | **Yes** | Occupancy/Members/Meals/Payments first |
| Numbered 3-step “How it works” with desktop connector | **Yes** | Create space → beds or menus → members/operations |
| Dark rounded final CTA band | **Yes as CTA only** | “Start with one space”; Get started + Sign in |
| Footer: brand + link groups + legal row | **Yes** | No fake email/social; link privacy/deletion on app |
| Container ~1152–1200px, 16/24/32 horizontal padding | **Yes** | Spec **1200px** max |
| Section `80px` / `96px` vertical padding | **Yes** | |
| Lucide line icons | **Yes** | Not WhatsApp `MessageCircle` as logo |
| CSS fade/slide on scroll | **Yes, CSS only** | `prefers-reduced-motion`; no Framer required |
| Skip-friendly semantic `<header> <main> <footer>` | **Yes** | Add skip link |

---

## 5. Patterns to reject

| Pattern | Why reject |
|---------|------------|
| Name **Countin** / **CountIn** | Retired |
| WhatsApp speech-bubble logo | Implies WhatsApp product; ACOMI mark is **A** on teal |
| Purple Vite favicon (`#863bff`) | W1: no purple |
| Hero “Smart PG Management with **WhatsApp Automation**” | Unsafe / PLANNED |
| Entire `#whatsapp` section | Unsafe |
| Fake dashboard (94% occupancy, ₹4,28,500, 200 YES replies) | Invented stats |
| `#dashboard` analytics (48 tenants, 18% YoY, 87% donut) | Fake; reports **PLANNED** |
| Pricing ₹499 / ₹2,499 / ₹4,999 and WhatsApp credits | No pricing page; commercial model unfinalized |
| Testimonials (Anita, Rohit, Farhan) | Invented |
| “Trusted by PG owners across Pune, Bengaluru & Hyderabad” | Unverified |
| “Start free trial”, “Watch demo”, “Book a walkthrough”, “Talk to sales”, “no credit card” | Forbidden CTAs |
| `hello@countin.in`, Careers, generic Twitter/LinkedIn/YouTube | Fake company surface |
| Infinite floating hero cards + `animate-ping` | Excessive motion; implies live traction |
| Tenant-as-buyer language; “beds booked” | Marketplace misunderstanding |
| UPI collection / payment links | ACOMI is proofs + ledger, not a gateway |
| Food-waste % claims | Reports **PLANNED** |
| “Official WhatsApp Business APIs” | Not current product |
| Copying CountIn `src/` into AcomiPublicWebsite | Would import forbidden claims |

---

## 6. ACOMI visual direction

**Feel:** A serious, light, operational product site — closer to a well-made owner tool than a consumer travel brand.

| Do | Do not |
|----|--------|
| Teal **A** + ACOMI wordmark | CountIn C, WhatsApp bubble, web-app leftover “C” |
| Light green/white canvas `#F3FAF6` + white cards | Dark-mode-first site (dark **CTA band only** is OK) |
| Real phone screenshots | Fake KPI dashboards, stock photos, generic AI art |
| Green filled primary buttons | Gradient-text “AI” headlines |
| Calm spacing, 16px cards, 12px buttons | Glassmorphism, purple gradients, cream serif |
| Owner-operator vocabulary | Booking, marketplace, “find a PG” |

**Brand split (from W1):** Teal (`#128C7E`) = identity (logo, eyebrows). Green (`#25D366`) = action (primary CTA, active states).

---

## 7. Brand tokens

Implement as CSS custom properties in W3 (names below). Do not invent extra brand hues.

```
--color-primary:        #25D366;   /* CTA fill */
--color-primary-hover:  #20BD5A;
--color-primary-dark:   #128C7E;   /* logo tile, eyebrows */
--color-background:     #F3FAF6;   /* page canvas */
--color-surface:        #FFFFFF;   /* cards, navbar */
--color-text:           #0F172A;
--color-text-secondary: #64748B;
--color-muted:          #94A3B8;
--color-border:         #DCEFE3;   /* product border; marketing may use #E2E8F0 for hairlines */
--color-success:        #059669;
--color-danger:         #DC2626;
--color-warning:        #D97706;
--color-problem-well:   #FFF1F2;   /* rose-50 problem icons only */
--color-problem-icon:   #E11D48;
--color-cta-band:       #0C1F18;   /* dark final CTA only — not page chrome */
```

Focus ring: `2px solid #25D366` with `2px` offset on light surfaces.

---

## 8. Typography

**Family:** Plus Jakarta Sans. Load weights **400, 500, 600, 700** only.

**Loading (W3):** Self-host woff2 **or** Google Fonts with `preconnect` + `display=swap`. Prefer self-host for privacy (no extra third-party if avoidable).

| Role | Size desktop | Size mobile | Weight | Color | Notes |
|------|--------------|-------------|--------|-------|--------|
| Eyebrow | 12px | 12px | 600 | `#128C7E` | Uppercase, `letter-spacing: 0.2em` |
| H1 | 52px / 1.1 | 36px / 1.15 | 700 | `#0F172A` | One H1 per page |
| H2 | 36px / 1.2 | 28px | 700 | `#0F172A` | Section titles |
| H3 | 20px / 1.3 | 18px | 600 | `#0F172A` | Cards |
| Lead | 18px / 1.65 | 16px / 1.6 | 400 | `#64748B` | Hero + section intros |
| Body | 16px / 1.6 | 15px / 1.55 | 400 | `#64748B` | |
| Button | 14px | 14px | 600 | — | `text-transform: none` |
| Caption | 13px | 12px | 400 | `#94A3B8` | Screenshot captions |
| Nav link | 14px | 14px | 500 | `#64748B` hover `#0F172A` | |

**Buttons:** sentence case (“Get started”, “Sign in”).

---

## 9. Information architecture

Multi-page (not the old CountIn single scroller). W1 structure.

| Route | File (W3) | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Conversion homepage |
| `/features` | `FeaturesPage` | Module detail + screenshots |
| `/how-it-works` | `HowItWorksPage` | Owner workflow (and invitation, secondary) |
| `/who-its-for` | `WhoItsForPage` | Five space types |
| `/platforms` | `PlatformsPage` | Web + Android only |
| `/about` | `AboutPage` | Thin product origin — no company fiction |

**Do not create in W3:** `/pricing`, `/blog`, `/careers`, `/investors`, `/customer-stories`, `/contact` (until a real email exists).

**External (never clone into www):**

| Label | URL |
|-------|-----|
| Get started | `https://app.acomi.in/register` |
| Sign in | `https://app.acomi.in/login` |
| Open web app | `https://app.acomi.in/` |
| Privacy | `https://app.acomi.in/privacy` |
| Delete account | `https://app.acomi.in/delete-account` |

Canonical host for all marketing pages: `https://www.acomi.in/...`  
Never canonicalize marketing pages to `app.acomi.in`.

---

## 10. Navigation specification

### 10.1 Desktop (`≥768px`)

```
[A] ACOMI     Features  How it works  Who it's for  Platforms     Sign in    [Get started]
```

- Height: **64px**
- Background: `rgba(255,255,255,0.88)` + `backdrop-filter: blur(16px)`
- Bottom border: `1px solid #E2E8F0`
- `position: sticky; top: 0; z-index: 50`
- Logo: 36×36 teal rounded-xl (`border-radius: 12px`) with white **A** from Play Store icon (do not typeset “C”). Wordmark “ACOMI” 16px/600 `#0F172A`. Link to `/`.
- Nav links: in-site routes, not `#whatsapp` / `#pricing`.
- **Sign in:** ghost/outline button → `app.acomi.in/login` (`target` same tab).
- **Get started:** primary green → `app.acomi.in/register`.
- Active route: text `#0F172A` + 2px teal underline or green tint chip.

### 10.2 Mobile (`<768px`)

- Logo + hamburger (44×44 min tap).
- Overlay/panel: stacked links, then Sign in (full width ghost), Get started (full width primary).
- Close on route change. `aria-expanded`, focus trap optional but recommended.

### 10.3 Skip link

First focusable: “Skip to content” → `#main`. Visually hidden until focus.

---

## 11. Homepage specification

**Page goal:** An owner understands ACOMI in 15 seconds and can create an account.

**Section order (required):**

| # | ID | Section |
|---|-----|---------|
| 1 | — | Navbar |
| 2 | `hero` | Hero |
| 3 | `problems` | Problems |
| 4 | `modules` | Core modules (4 primary + 2 secondary) |
| 5 | `screenshots` | Product screenshots strip |
| 6 | `space-types` | Space types |
| 7 | `owner-member` | Owner vs member |
| 8 | `how-it-works` | How it works (3 steps) |
| 9 | `platforms` | Web + Android |
| 10 | `trust` | Trust / privacy |
| 11 | `cta` | Final CTA |
| 12 | — | Footer |

Page background: `#F3FAF6`. Alternate sections may use `#FFFFFF` for rhythm (problems and screenshots: white; modules and how-it-works: canvas).

Detailed sections: §13–23.

---

## 12. Hero options

### Concept A — Operations headline (recommended)

- **Eyebrow:** Operations for owners
- **H1:** Run occupancy, meals, and dues
- **Lead:** ACOMI is software for PGs, hostels, co-living spaces, rentals, and messes. Run one space or several — on web and Android.
- **Visual:** Feature graphic **or** framed dashboard + occupancy phones
- **Why:** Exact Play Store positioning; W1 preferred; no WhatsApp; no fake stats.

### Concept B — Audience list first

- **H1:** Operations for PGs, hostels, co-living, rentals, and messes
- **Lead:** Run occupancy, meals, and dues from one space.
- **Why:** Clear who it is for; weaker punch than A.

### Concept C — “One place” 

- **H1:** Everyday space operations, in one place
- **Lead:** Occupancy, members, meals, and dues for Indian PGs, hostels, messes, co-living, and rentals.
- **Why:** Softer; less distinctive than the Play Store line.

**Reject:** Any hero that leads with WhatsApp, OTP, pricing, trials, or invented occupancy %.

---

## 13. Recommended hero

**Use Concept A.**

| Element | Specification |
|---------|----------------|
| Layout | CSS grid, 2 columns from `lg` (1024px); stack on smaller. Gap 48px. Vertical padding `64px / 80px`. |
| Eyebrow | Pill: white, border `rgba(18,140,126,0.2)`, text `#128C7E`, 12px/600. **No ping animation.** Copy: `For PG, hostel, mess, co-living, and rental owners` |
| H1 | `Run occupancy, meals, and dues` |
| Lead | `ACOMI helps owners run a space: occupancy, members, meals, and dues. Create a space, invite people, and operate from the web app or Android.` Status: **VERIFIED** |
| Primary CTA | Get started → `https://app.acomi.in/register` · green `#25D366` · optional arrow icon |
| Secondary CTA | Sign in → `https://app.acomi.in/login` · ghost white + slate ring |
| Visual | Desktop: overlapping two phones — `02-dashboard.png` (front) + `04-accommodation.png` (back, 8px offset). Mobile: single `02-dashboard.png`, max-width 320px, centered. |
| Accents | Soft radial green 15% opacity top-center; one teal blob `blur(80px)` opacity 10%. No floating fake notification cards. |
| Do not show | Occupancy %, rupee totals, city names, “live” dots |

**SEO:** This H1 is the homepage H1. Do not add a second H1.

---

## 14. Problem section

**ID:** `problems`  
**Eyebrow:** The daily grind  
**H2:** Operations that still live in notebooks and chats  
**Lead:** ACOMI is built for the work owners already do — occupancy, members, meals, dues, and issues — in one space.

**Layout:** 2 columns `sm+`, 3 columns `lg+`. Cards: 16px radius, white, 1px `#E2E8F0`, padding 24px, rose icon well 40×40.

Map each card to a **VERIFIED** capability. Do not mention WhatsApp automation, UPI collection, or wastage %.

| Title | Copy | Icon (Lucide) | Maps to |
|-------|------|---------------|---------|
| Unclear occupancy | Who is in which bed should not live in a register. See buildings, rooms, and beds, and move people in or out in one place. | `BedDouble` | Accommodation / occupancy |
| Scattered member records | Names, mobiles, documents, and stays sit in chats and sheets. Keep residents and customers in one member list. | `Users` | Members |
| Manual meal planning | Breakfast, lunch, and dinner still get planned ad hoc. Build a menu, share it, and see headcount in ACOMI. | `UtensilsCrossed` | Meals |
| Dues without a ledger | Expected, collected, and pending are hard to see when proofs live in galleries. Record proofs and review them in ACOMI. | `Wallet` | Payments (not a gateway) |
| Issues that get lost | Maintenance, food, and service issues disappear in chats. Raise and track complaints with a status. | `MessageSquareWarning` | Complaints |
| Several spaces, several systems | Owners who run more than one PG or mess need a switcher, not a new notebook. ACOMI supports multiple spaces. | `Building2` | My Spaces |

**Do not** use the old “Food wastage” or “Tenant communication on WhatsApp” cards as written.

**Animation:** fade/slide-up 400ms, stagger ≤50ms, `prefers-reduced-motion: none`.

---

## 15. Feature / module section

**ID:** `modules`  
**Eyebrow:** Product  
**H2:** One space. The operations that matter.  
**Lead:** Occupancy, members, meals, and dues are the core. Complaints and inventory are there when you need them.

### Emphasis (do not treat all six as equal)

| Priority | Module | Homepage treatment |
|----------|--------|-------------------|
| **Primary** | Occupancy, Members, Meals, Payments | Large 4-up grid; each card links to `/features#...` |
| **Secondary** | Complaints | Smaller card or 5th tile |
| **Tertiary** | Inventory | Mention on `/features`; optional compact 6th tile with less visual weight |

Play Store feature graphic lists **Occupancy · Members · Meals · Payments** — that is the homepage emphasis. **VERIFIED.**

### Card copy (homepage)

| Module | Headline | Short description | Icon | Screenshot on `/features` |
|--------|----------|-------------------|------|---------------------------|
| Occupancy | Know your occupancy | Buildings, rooms, and beds. Allocate, reserve, move in, transfer, vacate. Hidden for Mess spaces. | `Building2` | `04-accommodation.png` |
| Members | Residents and customers in one list | Add a record without the app, or invite someone to join on their mobile. | `Users` | `05-members.png` |
| Meals | Plan breakfast, lunch, and dinner | Menu library, daily plan, share as text, polls, and headcount. | `UtensilsCrossed` | `06-meals.png` |
| Payments | Expected, collected, and pending | Operational ledger and payment proofs — not a card or UPI gateway. | `IndianRupee` | `07-payments.png` |
| Complaints | Track issues | Maintenance, food, and service complaints with status and comments. | `Wrench` | `08-operations.png` |
| Inventory | Stock and assets | Categories, items, and suppliers seeded by space type. | `Package` | No Play screenshot — icon-only |

**Card style:** Same as old `FeatureCard` (16px, white, green icon well `#E8F8EF`, icon `#128C7E`). Hover: border `rgba(37,211,102,0.35)`, shadow slightly raised. No gradient icon blob required.

**CTA:** Text link “See features” → `/features`.

---

## 16. Screenshot strategy

**Principle:** Product-led. Use real ACOMI Play Store **final** screenshots. Do not recreate dashboards with invented numbers. Empty states in payments/complaints shots are acceptable if captions stay honest (“example of the payments screen”).

### 16.1 Asset selection

Prefer `K:\AcomiMobile\docs\play-store-assets\screenshots\final\` (already have teal marketing chrome + phone UI).

| File | Caption (from asset) | Homepage | Features page |
|------|----------------------|----------|---------------|
| `02-dashboard.png` | See your space at a glance | Hero + strip | Yes |
| `03-spaces.png` | Manage your spaces | Owner vs member | Optional |
| `04-accommodation.png` | Know your occupancy | Strip | Occupancy block |
| `05-members.png` | Manage members | Strip optional | Members block |
| `06-meals.png` | Plan meals | Strip | Meals block |
| `07-payments.png` | Track payments | Optional | Payments block |
| `08-operations.png` | Track issues | Optional | Complaints block |

**Do not use as primary marketing:** repo-root `acomi-ui*.png` until reviewed for debug chrome/PII. **Do not use** CountIn `hero.png` or WhatsApp chat mock.

### 16.2 Framing

- Homepage strip: 3 phones (`02`, `04`, `06`) in a horizontal row on desktop; horizontal scroll with snap on mobile (`scroll-snap`, 280px width, gap 16px). Native overflow, no JS carousel required.
- Features page: alternating **text left / screenshot right** (reverse each row). Screenshot max-height 640px; object-fit contain.
- **Do not** wrap in fake `dashboard.countin.in` browser chrome.
- The **final** PNGs already include a teal header band — do not add a second marketing frame on top.
- **Raw** screenshots (`screenshots/raw/`) only if you need unframed UI; then add a simple 12px rounded white bezel + shadow, no fake OS stats.

### 16.3 Crop / optimize (W3)

- Source: 1080×1920 PNG.
- Serve **WebP** (and PNG fallback) at 540px and 1080px widths (`srcset`).
- Lazy-load below-the-fold images (`loading="lazy"`); hero image `fetchpriority="high"`.
- Do not upscale the 1024×500 feature graphic as a full-bleed hero photo.

### 16.4 Desktop web UI

W1: no desktop app screenshots in the Play pack. **Do not fake a browser dashboard.** Platforms page copy: “The same product on `app.acomi.in`” without a fabricated web capture.

---

## 17. Space types

**ID:** `space-types`  
**Eyebrow:** Who it’s for  
**H2:** Built for how Indian shared living actually runs  
**Lead:** Five space types. Mess is meal-first — no bed map.

| Type | Label | Description | Do not say |
|------|-------|-------------|------------|
| PG | PG | Paying Guest. Rooms, beds, members, meals, dues. | Marketplace listing |
| Mess | Mess | Mess / canteen. Menus, customers, meal billing, headcount. | Buildings, rooms, beds |
| Hostel | Hostel | Hostel-style accommodation and occupancy. | |
| Co-living | Co-living | Shared accommodation, occupancy, members. | |
| Rental | Rental | Flats / rooms occupancy. | Hotel PMS |

**Visual:** 5 cards (2+2+1 on tablet; 5-up or 3+2 on desktop). Optional emoji from product (`🏠 🍽️ 🛏️ 🏘️ 🏢`) **or** Lucide only — pick one system; prefer Lucide for a serious look.

**CTA:** “See who it’s for” → `/who-its-for`

**Who-its-for page:** One section per type, Mess section explicitly: “Accommodation structure is not used for Mess spaces.”

---

## 18. Owner vs member

**ID:** `owner-member`  
**Eyebrow:** How access works  
**H2:** Owners run the space. Members join by invitation.  
**Lead:** ACOMI is not a listing or booking site. People do not browse PGs on this website.

Two equal cards (stack on mobile), visually similar to the product onboarding split (teal owner / cooler member — from screenshot `03-spaces.png`).

**Owner / operator (primary)**

- Create a space (PG, Mess, Hostel, Co-living, or Rental)
- Set up beds **or** menus, depending on type
- Add members as records, or invite a mobile number
- Manage occupancy, meals, dues, and complaints

CTA on this card only: Get started → register.

**Member (tenant, customer, staff)**

- Join after an owner invites your Indian mobile number
- There is no public join code and no marketplace
- Complete profile when asked
- Use stay, meals, payment proofs, and complaints that apply to you

No “Find a PG” CTA.

**Also state (caption, 13px):** Owners can add a member **without** that person installing ACOMI. **VERIFIED.**

---

## 19. How it works

**ID:** `how-it-works`  
**Eyebrow:** Get started  
**H2:** Three steps. One space.  
**Lead:** Create the space first. Layout or menus second. People and day-to-day operations third.

Recommended steps (refined from W1; Mess-safe):

| Step | Title | Body |
|------|-------|------|
| 01 | Create your space | Register with an Indian mobile number and password. Choose PG, Mess, Hostel, Co-living, or Rental. |
| 02 | Set up beds or menus | For PGs, hostels, co-living, and rentals, set up buildings, rooms, and beds. For a mess, start with customers and the menu. |
| 03 | Add members and run operations | Add or invite people. Track occupancy, meals, dues, and issues as they happen. |

**Reject old CountIn steps** (Excel import + WhatsApp polls + “tonight’s dinner”).

**Visual:** 3 columns on `lg`, numbered teal step label, 56×56 icon well, connector line on desktop only.

**CTA:** Get started → register.

`/how-it-works` repeats these steps with slightly longer copy and a short “Joining as a member” subsection (invitation only).

---

## 20. Platforms

**ID:** `platforms`  
**Eyebrow:** Where you work  
**H2:** Use ACOMI where the work happens  
**Lead:** The same product on the web and on Android.

| Surface | What to say | What not to say |
|---------|-------------|-----------------|
| Web | Operate from `app.acomi.in` in the browser. | “Desktop analytics suite” |
| Android | ACOMI Android app (`com.acomi`). | “Download on Google Play” until listing **VERIFIED** |
| iOS | Omit, or one line “iOS is not offered as a public download yet.” | App Store badge |

**Layout:** Two cards. Web card CTA: “Open the web app” → `https://app.acomi.in/`. Android card: no store badge; optional “Get started on web first”.

`/platforms` can add: sign-in is Indian mobile + password on both. **VERIFIED.**

---

## 21. Trust / privacy

**ID:** `trust`  
**Eyebrow:** Your account  
**H2:** Access is yours to control  
**Lead:** No fake customer logos. State only what the product does.

Four compact facts (not certification badges):

1. Sign in with an Indian mobile number and a password. Passwords are stored as hashes.
2. People in a space see operations according to their role (Owner, Manager, Tenant, Customer, Staff).
3. You can delete your account in the app or on the web.
4. Privacy details: `app.acomi.in/privacy`.

Links: Privacy policy · Delete account (external).

**Never:** ISO, SOC, bank-grade, “data hosted in India-ready cloud” (old CountIn CTA — **UNKNOWN**), 24/7 support.

---

## 22. Final CTA

**ID:** `cta`

Dark band (`#0C1F18` or `#0F172A`), `border-radius: 24px`, padding `56px 32px`, max-width inside container.

| Element | Copy |
|---------|------|
| Eyebrow | ACOMI |
| H2 | Start with one space |
| Lead | Create your first PG, mess, hostel, co-living space, or rental and run occupancy, meals, and dues from there. |
| Primary | Get started → register |
| Secondary | Sign in → login (ghost on dark: white 12% fill) |

**Do not:** Start free trial, Book a demo, Contact sales, no credit card, cancel anytime.

---

## 23. Footer

White, top border, padding `56px 0 32px`.

**Columns (desktop 4; mobile stack):**

1. **Brand:** 36px A mark + ACOMI. One line: `Operations for PGs, hostels, co-living, rentals, and messes.` No CountIn tagline.
2. **Product:** Features, How it works, Who it’s for, Platforms, About
3. **Account:** Get started, Sign in (external)
4. **Legal:** Privacy, Delete account (external)

**Bottom row:** `© {year} ACOMI` only. **No** invented legal entity, phone, address, or `hello@countin.in`.

**No** Careers, social icons, or placeholder Contact.

Leave a **comment in W3 code** that a Contact column can be added when a real email exists.

---

## 24. Responsive specification

| Name | Width | Behavior |
|------|-------|----------|
| Mobile | `<768px` | Single column; hamburger; hero visual under copy; screenshot strip snap-scroll; CTAs full width stacked; footer stacked; type scale §8 |
| Tablet | `768–1023px` | Nav can show links if space; 2-col cards; hero still stacked until `lg` |
| Desktop | `1024–1199px` | 2-col hero; 3-col problems; 4-col modules may wrap 2×2 |
| Wide | `≥1200px` | Content container **1200px** centered; 4-col modules; 3 screenshot phones |

**Container:** `width: min(1200px, 100% - 32px)` (16px pad mobile, 24px `sm`, 32px `lg`).

**Navbar:** sticky all breakpoints.

**Screenshots:** never force 9:16 full-bleed on desktop; max width ~280–320px per phone.

**Horizontal scroll:** allowed **only** for the screenshot strip on mobile. No page-wide overflow.

**Section spacing:** mobile `64px` vertical; desktop `96px`.

---

## 25. Accessibility specification

- Semantic `header`, `nav`, `main#main`, `footer`, `section` with `aria-labelledby` pointing at H2 ids.
- One H1 per page; H2 for sections; H3 for cards.
- All CTAs are **links** (`<a>`) to external app or internal routes — not `<button>` that does nothing (old CountIn bug).
- Focus visible: 2px green ring, never `outline: none` without replacement.
- Contrast: `#0F172A` on white; white on `#25D366` (test); **do not** put `#25D366` text on `#F3FAF6` as body copy.
- Alt text: e.g. `ACOMI dashboard on a phone showing space health and setup`; never empty on informative shots; logo alt `ACOMI`.
- `prefers-reduced-motion: reduce` → disable scroll fade, transform, blur animations.
- Tap targets ≥ 44×44px.
- No forms on marketing pages (no fake newsletter).
- `html lang="en"`.
- External links: identifiable (not only color). `rel="noopener noreferrer"` if `target="_blank"` — prefer same-tab for app CTAs.

---

## 26. SEO specification

**Canonical origin:** `https://www.acomi.in`  
**OG image (all pages until dedicated art exists):** copy of Play Store feature graphic `1024×500` — W1 notes it is light; acceptable for v1.

| Page | Title (≤60 chars) | Meta description (≤155) | H1 |
|------|-------------------|-------------------------|----|
| `/` | ACOMI — Run occupancy, meals, and dues | Operations software for Indian PGs, hostels, co-living, rentals, and messes. Web and Android. | Run occupancy, meals, and dues |
| `/features` | Features — ACOMI | Occupancy, members, meals, payments, complaints, and inventory in one space. | Operations in one space |
| `/how-it-works` | How it works — ACOMI | Create a space, set up beds or menus, add members, and run day-to-day operations. | Three steps. One space. |
| `/who-its-for` | Who ACOMI is for | Built for PG, mess, hostel, co-living, and rental owners — not a PG marketplace. | Built for owners of Indian shared living |
| `/platforms` | Web and Android — ACOMI | Use ACOMI in the browser at app.acomi.in or on Android. | Use ACOMI where the work happens |
| `/about` | About ACOMI | ACOMI is operations software for occupancy, members, meals, and dues. | About ACOMI |

**Canonical:** `https://www.acomi.in` + path (no trailing slash except home — pick one and 301 the other in W4).

**Open Graph:** `og:type=website`, `og:locale=en_IN`, `og:site_name=ACOMI`, title/description as above, `og:image` feature graphic.

**Keywords/topics (for authors, not meta keyword stuffing):** PG operations, hostel occupancy, mess meal planning, co-living, rental rooms, member invitations, payment proofs. Do **not** target “WhatsApp PG software” as a current claim.

**Structured data:** Optional `SoftwareApplication` JSON-LD: name ACOMI, applicationCategory BusinessApplication, operatingSystem “Web, Android”, url `https://www.acomi.in`. **Do not** set `aggregateRating` or `offers` price.

**sitemap.xml:** the six routes.  
**robots.txt:** `Allow: /` · Sitemap URL on www. Do not crawl `app` from this property.

**hreflang:** English only for v1.

---

## 27. Content rules

1. Always **ACOMI**. Never CountIn, Residine, Amico.
2. Prefer **VERIFIED**. Never publish **PLANNED** as current.
3. Owner is the buyer. Members are invited.
4. Mess ≠ beds.
5. Payments = proofs + ledger, not gateway/UPI collect/autopay.
6. Auth = Indian mobile + password, not OTP.
7. No counts, cities, testimonials, logos, certifications, pricing, trials.
8. Use: Owner, Manager, Member, Space, Occupancy, PG, Mess, Hostel, Co-living, Rental, Dues, Payment proof, Invitation.
9. Avoid: Admin (unless necessary), Guest, Booking, Checkout, Marketplace, Subscriber (except meal **Subscription** billing if mentioned on Features).
10. Do not duplicate full privacy policy; link it.
11. English only on www v1 (product has 6 in-app locales — do not claim the marketing site is localized).

---

## 28. CTA rules

| Allowed | Destination |
|---------|-------------|
| Get started | `https://app.acomi.in/register` |
| Sign in | `https://app.acomi.in/login` |
| Explore ACOMI / See features | `/features` or `#modules` |
| See how it works | `/how-it-works` |
| Open the web app | `https://app.acomi.in/` |
| Privacy / Delete account | app.acomi.in URLs |

**Forbidden:** Start free trial, Book a demo, Contact sales, Talk to sales, WhatsApp us, Download on Google Play, Download on App Store, Login with OTP, Start managing (on member cards).

Primary always **Get started**. Secondary **Sign in**. Internal links are tertiary.

Design pricing **slot** on Features later (empty); do not ship prices.

---

## 29. Asset inventory

Copy into `AcomiPublicWebsite/public/brand/` and `public/screenshots/` at W3. Do not duplicate entire Mobile repo.

| Path (source) | Dimensions | Purpose | Website use | Crop? | Optimize? |
|---------------|------------|---------|-------------|-------|-----------|
| `docs/play-store-assets/icon/acomi-play-store-512.png` | 512×512 | Logo mark | Nav, footer, favicon, apple-touch | No | Yes — also SVG later if traced |
| `docs/play-store-assets/icon/acomi-round-512.png` | 512×512 | Round logo | Optional PWA | No | Yes |
| `docs/play-store-assets/feature-graphic/acomi-feature-graphic.png` | 1024×500 | OG / social | `og:image`, optional about banner | No | Yes; do not stretch |
| `screenshots/final/02-dashboard.png` | 1080×1920 | Dashboard | Hero, strip, features | Optional slight top chrome | WebP srcset |
| `screenshots/final/03-spaces.png` | 1080×1920 | Owner vs member | Owner/member section | No | WebP |
| `screenshots/final/04-accommodation.png` | 1080×1920 | Occupancy | Strip + features | No | WebP |
| `screenshots/final/05-members.png` | 1080×1920 | Members | Features | No | WebP |
| `screenshots/final/06-meals.png` | 1080×1920 | Meals | Strip + features | No | WebP |
| `screenshots/final/07-payments.png` | 1080×1920 | Payments | Features | No | WebP |
| `screenshots/final/08-operations.png` | 1080×1920 | Complaints | Features | No | WebP |
| `icon/acomi-launcher-*.png` | 1080×1080 | Adaptive layers | Skip for www | — | — |
| Accommodation illustrations | various | UI art | Optional who-its-for accents | Maybe | Optional |
| CountIn `favicon.svg` / `hero.png` | — | Old brand | **Do not copy** | — | — |

Favicon W3: generate 32px ICO + SVG from the teal **A** (not purple Vite logo).

---

## 30. Future implementation recommendations

### 30.1 Repo and branches

AcomiMobile / AcomiWeb use:

- `develop` — active work  
- `main` — default on GitHub  
- `production` — release line  
- `aws-production` — AWS-hosted production (Web currently checked out here)

**This repo should follow the same model.** GitHub clone is **empty** (no commits). W2 works on local **`develop`**. Do not commit in W2. First W3 commit should be on `develop`. Promote to `main` / `production` / `aws-production` only when deploying (later phases). Do not implement AWS in W3 unless asked.

### 30.2 Stack

- Vite + React + TypeScript  
- React Router (multi-page)  
- **Tailwind v4** for marketing layout speed (old site proved the spacing system) **or** CSS modules with the tokens in §7 — pick Tailwind unless the team prefers zero utility CSS  
- Lucide React for icons  
- **Do not** add Framer Motion unless CSS is insufficient  
- **Do not** add MUI, TanStack Query, Axios, or AcomiWeb source  
- **Do not** call `api.acomi.in` from www  

Prerender or `ssg` if easy (Vite plugin / simple static export) so `/features` etc. are real HTML for SEO. Client-only SPA is acceptable for W3 if each route has unique `document.title` + meta via a small helmet helper — prefer prerender if it does not delay W3.

### 30.3 Likely components

`Layout`, `Navbar`, `Footer`, `Container`, `Button` (link-styled), `SectionHeading`, `FeatureCard`, `ProblemCard`, `StepCard`, `PhoneScreenshot`, `CtaBand`, `SkipLink`.

### 30.4 Hosting (not W2/W3 unless approved)

Separate S3 + CloudFront from `acomi-web-prod`. See W1 §18.

---

## 31. W3 implementation checklist

- [ ] Scaffold Vite React TS app **in this repo only**
- [ ] Tailwind (or token CSS) with §7–8 values
- [ ] Routes: `/` `/features` `/how-it-works` `/who-its-for` `/platforms` `/about`
- [ ] Navbar + footer + skip link
- [ ] Homepage sections in §11 order with copy from this spec
- [ ] Copy Play Store assets into `public/` and wire WebP where possible
- [ ] All primary/secondary CTAs hit `app.acomi.in/register` and `/login`
- [ ] Privacy + delete-account footer links
- [ ] Unique title/description per page
- [ ] `lang="en"`, heading hierarchy, focus rings, reduced motion
- [ ] No CountIn strings, no WhatsApp automation, no pricing, no testimonials
- [ ] No Play/App Store badges
- [ ] Lighthouse: aim Performance ≥90, Accessibility ≥90 on mobile (local)
- [ ] README: how to run locally; that production host is www, not app
- [ ] Commit on **`develop`** when the owner asks

---

## 32. Open questions (owner decisions)

Do not assume answers in W3 copy.

1. Legal entity, registered address, privacy email (privacy page still `[TO BE PROVIDED]`).
2. Whether to write Terms of Service.
3. Google Play live URL — store badge or not.
4. App Store / public iOS — omit until verified.
5. Support email — `/contact` stays omitted until one exists.
6. When (if ever) to add Pricing; keep layout slot empty.
7. Whether `acomi.in` (apex) redirects to `www.acomi.in`, and which is canonical.
8. Whether any real customer proof will exist before launch.
9. Whether to self-host Plus Jakarta Sans vs Google Fonts.
10. Whether the web-app leftover “C” mark will be fixed before www launch (www must still use **A**).
11. Higher-resolution feature graphic for OG (current file ~18KB / 1024×500).

---

## Content matrix (homepage)

| Section | Heading | Supporting copy (summary) | CTA | Asset | Status |
|---------|---------|---------------------------|-----|-------|--------|
| Hero | Run occupancy, meals, and dues | Operations for five space types; web + Android | Get started / Sign in | `02-dashboard`, `04-accommodation` | VERIFIED |
| Problems | Operations that still live in notebooks and chats | Six problems mapped to real modules | — | Lucide | VERIFIED |
| Modules | One space. The operations that matter. | Occupancy, Members, Meals, Payments (+ complaints/inventory) | See features | Icons | VERIFIED |
| Screenshots | (captions from Play assets) | Real UI, including empty states | — | `final/*.png` | VERIFIED |
| Space types | Built for how Indian shared living actually runs | Five types; Mess meal-first | Who it’s for | Icons | VERIFIED |
| Owner vs member | Owners run the space. Members join by invitation. | Not a marketplace | Get started (owner card) | `03-spaces.png` | VERIFIED |
| How it works | Three steps. One space. | Create → beds or menus → members/ops | Get started | Icons | VERIFIED |
| Platforms | Use ACOMI where the work happens | Web + Android; no store badges | Open web app | Logo | VERIFIED / UNKNOWN store |
| Trust | Access is yours to control | Password, roles, deletion, privacy links | Privacy / Delete | — | VERIFIED + PLACEHOLDER legal entity |
| Final CTA | Start with one space | First space | Get started / Sign in | — | VERIFIED |

---

## Old CountIn vs ACOMI mapping

| Old CountIn section | Keep? | Modify? | Remove? | ACOMI replacement |
|---------------------|-------|---------|---------|-------------------|
| Navbar | Pattern | Logo, links, CTAs | Countin, WhatsApp, Pricing, trial | ACOMI nav §10 |
| Hero | Pattern | Headline, visual | WhatsApp Automation, fake dashboard, cities, Watch demo | Hero A §13 |
| Problems | Pattern | All six texts | Wastage %, WhatsApp comms as product | §14 |
| Features | Pattern | Module set + emphasis | WhatsApp polls, rent nudges, cash-flow analytics | §15 |
| WhatsApp automation | No | — | Entire section | Omit |
| Dashboard / analytics | No | — | Fake KPIs | Real screenshots §16 |
| How it works | Pattern | All three steps | WhatsApp rollout, Excel import | §19 |
| Pricing | No | — | Entire section | Omit; slot later |
| Testimonials | No | — | Entire section | Trust facts §21 |
| Final CTA | Pattern | Copy + CTAs | Trial, walkthrough, India-cloud claim | §22 |
| Footer | Pattern | Links | hello@countin.in, social, Careers | §23 |
| Favicon | No | — | Purple Vite | Teal A |

---

## Design system (W3 values)

| Token | Value |
|-------|--------|
| Page max | 1200px |
| Space 1–8 | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px |
| Radius sm / button / card / band | 8 / 12 / 16 / 24 px |
| Shadow card | `0 1px 2px rgba(15,23,42,0.06)` |
| Shadow hover | `0 8px 24px rgba(18,140,126,0.08)` |
| Shadow CTA band | `0 24px 48px rgba(15,23,42,0.25)` |
| Button primary | bg `#25D366`, hover `#20BD5A`, radius 12, px 20, py 12, font 14/600, white text |
| Button ghost | white, ring `#E2E8F0`, text `#0F172A` |
| Badge / pill | radius 9999, border teal 20% |
| Eyebrow | 12px/600, tracking 0.2em, `#128C7E` |
| Screenshot | radius 16, shadow as card hover, max-width 320px |
| Breakpoints | 768 / 1024 / 1200 |

**Animation:** scroll reveal `opacity 0→1`, `translateY(12px→0)`, 400ms ease-out, once. Button hover: background 150ms. No infinite loops. Honor `prefers-reduced-motion`.

**Performance:** no AcomiWeb bundle; few JS routes; lazy images; font subset if self-hosted; avoid Framer; Core Web Vitals — LCP = hero screenshot or H1, not a huge PNG without srcset.

---

## Recommended W3 implementation (blueprint)

**Pages:** `/` `/features` `/how-it-works` `/who-its-for` `/platforms` `/about`

**Homepage order:** Navbar → Hero A → Problems → Modules → Screenshots → Space types → Owner vs member → How it works → Platforms → Trust → Final CTA → Footer

**Hero:** “Run occupancy, meals, and dues”

**Primary CTA:** Get started → `https://app.acomi.in/register`  
**Secondary CTA:** Sign in → `https://app.acomi.in/login`

**Design system:** 1200px container, 16px cards, 12px buttons, Plus Jakarta Sans, canvas `#F3FAF6`, CTA `#25D366`, eyebrow/logo teal `#128C7E`, Play Store **A** mark.

**Required assets:** 512px icon + seven `screenshots/final` PNGs + feature graphic for OG.

**Components:** Layout, Navbar, Footer, Container, Button (as link), SectionHeading, FeatureCard, ProblemCard, StepCard, PhoneScreenshot, CtaBand, SkipLink.

**Router:** React Router static routes; no auth on www.

**Responsive:** mobile-first; hamburger `<768px`; 2-col hero `≥1024px`.

**SEO:** titles/descriptions in §26; canonical www; no app.acomi.in canonical.

**Performance:** static/light SPA; WebP screenshots; no product API; no MUI.

**Branch:** implement on `develop`.

---

*End of W2 specification. Do not implement until W3 is requested.*
