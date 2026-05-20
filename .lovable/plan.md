

# OCAS Atelier — Phase 1 + 2 End-to-End

Building the marketing site, full auth with roles, and the core dashboard (applications + analytics) in one pass. Dark mode default, blue→purple gradient aesthetic inspired by Landio.

## 1. Design system (dark-first)
- Update `src/index.css` with HSL tokens: deep navy background (`222 47% 6%`), primary blue (`199 89% 48%`), accent violet (`258 90% 66%`), gradient utilities, glassmorphism surfaces, semantic success/warning/error.
- Extend `tailwind.config.ts` with: display font (Cal Sans via Inter fallback), extra animations (`fade-in`, `fade-up`, `scale-in`, `float`, `shimmer`, `gradient-shift`, `count-up`), `.story-link` and `.hover-scale` utilities, glass and gradient-border helpers.
- Add Inter + Cal Sans via Google Fonts in `index.html`; set dark class on `<html>` by default with a toggle stored in localStorage.

## 2. Marketing site
Single `/` route composed of sections, plus dedicated `/features`, `/pricing`, `/about` pages sharing the same nav/footer.

**Landing sections (in order):**
- Sticky nav with blur-on-scroll, gradient wordmark logo, Sign In + Get Started buttons, mobile sheet menu.
- Hero: gradient headline "Automate Your Career Search with AI", subhead, dual CTAs, floating glass dashboard mockup, trust badge strip.
- Logo cloud (placeholder company marks).
- Features grid (3 cards: Real-Time Intelligence, Measurable Impact, Seamless Integration) with gradient icon tiles and hover lift.
- How It Works — 3-step horizontal timeline with connector line.
- Services showcase — alternating image/text rows; one row shows an animated code snippet (typing effect).
- Animated stats counter strip (applications sent, interviews landed, etc.).
- Testimonials carousel with avatars and star ratings.
- Pricing — 3 tiers with middle tier highlighted (gradient border, "Most Popular" badge), monthly/yearly toggle.
- Comparison table (OCAS vs generic job boards).
- FAQ accordion.
- Final CTA band + footer (links, social, newsletter input).

## 3. Lovable Cloud — backend
- Enable Cloud; create tables:
  - `profiles` (id → auth.users, full_name, avatar_url, company_name, setup_completed)
  - `user_roles` (id, user_id, role enum: `manager` | `employee` | `client`) — separate table, security-definer `has_role()` function, RLS via that function
  - `employees` (id, user_id, manager_id)
  - `job_applications` (id, client_id, position, company, status enum, applied_date, notes, source)
  - `activity_logs` (id, user_id, action, metadata, created_at)
- RLS on all tables; managers can read team data via `has_role`, clients only their own applications.
- Trigger auto-creates `profiles` + assigns default `client` role on signup.
- Email+password auth only (per your choice); auto-confirm on for smooth testing.

## 4. Auth flow
- `/auth/signup` — email/password + role select (Client / Employee), terms checkbox, `emailRedirectTo: window.location.origin`.
- `/auth/signin` — email/password, remember me, forgot link.
- `/auth/forgot-password` → `/reset-password` page (required) that handles `type=recovery` and calls `updateUser({ password })`.
- `/auth/access-code` — clients enter a code that flips `setup_completed` on their profile (code validation stub for now).
- `useAuth` hook with `onAuthStateChange` listener set up before `getSession()`; protected route wrapper redirects unauthenticated users.

## 5. Dashboard (authed `/app/*`)
- Shell: collapsible shadcn sidebar (Dashboard, Applications, Analytics, Profile, Team), top bar with user menu, theme toggle, notifications bell.
- **Dashboard home** — welcome header, 4 stat cards (Total Apps, Interviews, Offers, Response Rate) with count-up animation and trend indicator, recent applications table (5 rows), quick actions, activity feed.
- **Applications** — filterable/sortable table (status, date range, company search), status badges, row detail drawer, add/edit/delete with optimistic updates, bulk actions, CSV export.
- **Analytics** — Recharts: applications over time (area), status breakdown (pie), top companies (bar), weekly success rate (line); date-range picker.
- **Profile** — personal info form, resume upload to Cloud Storage bucket, preferences (target roles, locations).
- **Team** (managers only, gated by `has_role`) — employees list, client assignments, per-employee performance metrics, add-member dialog.

## 6. Animations & polish
- Scroll-triggered fade/slide-up via Intersection Observer hook.
- Floating hero mockup (continuous 6s ease-in-out), gradient-shift on primary buttons, card lift on hover, shimmer skeletons for loading, toast notifications (sonner) for all mutations.
- Responsive down to 380px (current viewport) — mobile nav drawer, stacked pricing, horizontal-scroll tables where needed.

## 7. Out of scope for this pass (follow-ups)
- Actual auto-apply automation / job board integrations
- Resume parsing, AI cover letters, interview practice
- Email sending, Stripe billing, custom domain
- Social OAuth providers

