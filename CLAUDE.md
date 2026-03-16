# Haus of Confidence — Platform

Unified medspa management platform for [Haus of Confidence](https://hausofconfidence.com/), a premier medspa in Scottsdale, AZ.

## Deployment

```bash
vercel --prod
```

Live at: https://hoc-platform.vercel.app

## Project Structure

```
hoc_platform/
├── app.html              # Main SPA — dashboard, appointments (waitlist, recurring, print day sheet, provider calendar), patients (referrals, loyalty points, review requests), payments (gift card redemption), messages, before/after photos, kiosk, camera, treatment plans, rebooking prompts, member view
├── analytics.html        # Revenue, retention, provider performance charts, commission/payroll tracking, CSV export (Chart.js)
├── charting.html          # SOAP notes, injectable logs, consent form builder + assignment, clinical documentation
├── memberships.html       # Membership plans (edit/create), packages (builder + sell), subscribers (manage), financing (Cherry/CareCredit/Affirm)
├── inventory.html         # Injectable/supply tracking, expiry alerts, reorder, retail products (skincare, gift cards, quick sale)
├── booking.html           # Patient-facing online booking (standalone, no sidebar)
├── patient-portal.html    # Patient-facing portal — demo mode as Maria G, membership, appointments, payments
├── settings.html          # Business info, hours, notifications, integrations, loyalty program, data export/reset
├── hoc-style.css          # Shared stylesheet — all colors, layout, components
├── hoc-sidebar.js         # Shared sidebar renderer with location switcher
├── hoc.js                 # Shared data layer — localStorage CRUD, seed data, formatters, providers/services lists
├── hoc-chat.js            # Floating help chat widget — built-in knowledge base (~55 topics), no API
└── CLAUDE.md              # This file
```

## Architecture

- **Static HTML + vanilla JS** — no build step, no framework
- **localStorage** for all data (demo/prototype)
- **Vercel** for hosting (static deployment)
- **hoc-style.css** is the single source of truth for design tokens (colors, fonts, spacing)
- **hoc-sidebar.js** renders the sidebar identically across all pages; app.html intercepts internal links via JS to do SPA navigation
- **hoc.js** contains shared data keys, seed data, formatters, provider/service lists
- **hoc-chat.js** is a self-contained IIFE that injects a floating "?" help widget on every page. Knowledge base is hardcoded — no external API.

## Locations

1. **Old Town — Winfield Scott** (`scottsdale-main`): 4205 N Winfield Scott Plaza, Suite 6, Scottsdale, AZ 85251 — traditional medspa
2. **Old Town — Brown Ave** (`scottsdale-flagship`): 4236 N. Brown Ave, Scottsdale, AZ — surgical, regenerative, stem cell center

Location switcher is in the sidebar. Active location stored in `localStorage('hoc_location')`.

## Brand

- **Primary:** #F00573 (hot pink/magenta)
- **Secondary:** #722A82 (deep purple)
- **Dark accent:** #741450 (burgundy)
- **Signature gradient:** `linear-gradient(135deg, #F00573, #722A82)` — used on all primary buttons
- **Sidebar:** White (#ffffff) with dark text (#1a1814), pink active state
- **Heading font:** Poppins (600 weight)
- **Body font:** Montserrat (400/500 weight)
- **Tagline:** "A Premier Medspa"

## Providers

| Name | Title | Locations |
|------|-------|-----------|
| Sara Ameli | DNP, FNP-C · Founder | Both |
| Dr. Todd Malan | Cosmetic Surgeon | Flagship |
| Dr. Margaret Husami | NMD | Flagship |
| Shay | Aesthetician | Main |
| Cierra | Aesthetician | Main |

## Key Features

- **Dashboard** — real-time stats, today's schedule, rebooking reminders for overdue patients, active treatment plan progress
- **Appointments** — list view + multi-provider calendar view (side-by-side columns per provider), CRUD with modal
- **Patients** — full profile with appointment history, payment history, lifetime value, total visits
- **Payments** — Quick Charge panel, transaction history, Stripe integration ready, dashboard revenue updates in real-time
- **Messages** — persistent threads in localStorage, send/receive, suggested replies
- **Before & After** — camera with canvas guide overlays per body zone, session management, comparison view
- **Charting** — SOAP notes, injectable tracking, save draft / sign & save, consent form builder with preview/print
- **Analytics** — revenue charts, provider leaderboard, retention funnel, top patients, commission/payroll tracker
- **Memberships** — create/edit plans, manage subscribers (pause/cancel/change), package builder, financing connectors (Cherry/CareCredit/Affirm)
- **Inventory** — stock levels, expiry tracking, reorder alerts, lot numbers
- **Booking** — patient-facing service/provider/date/time picker
- **Patient Portal** — patient-facing lookup by email/phone, view appointments/payments/profile
- **Kiosk** — walk-in intake form with medical history, consent, signature pad
- **Treatment Plans** — multi-session plans with progress tracking, stored in `hoc_txplans`
- **Help Chat** — floating widget on every page with 40+ topic knowledge base

## Key Conventions

- CSS variables use `--pri` (pink), `--sec` (purple) prefix system. Legacy `--gold` vars are aliased to `--pri` for backward compat in app.html.
- Provider names do NOT use "Dr." prefix for Sara Ameli (she's a DNP, not MD). Use "Sara Ameli" everywhere.
- Seed data uses `hoc_seed_v3` flag. Bump this when changing seed data structure.
- app.html has its own inline `<style>` block (not using hoc-style.css) because it predates the shared stylesheet. The other pages use hoc-style.css.
- The camera guide overlay uses a `<canvas id="cam-guide-canvas">` with `requestAnimationFrame` loop for real-time drawing. Zone outlines are drawn via canvas 2D context, not SVG.
- The ZONES object in app.html defines silhouette SVGs (`.silhouette` property) for review/compare views, but the live camera uses canvas drawing via `drawGuide()`.
- Consent forms are stored in localStorage key `hoc_consent_forms`. Three seed forms are created on first load.
- Treatment plans are stored in localStorage key `hoc_txplans`.

## Rules

- Every time any feature is added, changed, or removed from the platform, update the knowledge base in hoc-chat.js to reflect the change. This is required on every task — never skip it.
