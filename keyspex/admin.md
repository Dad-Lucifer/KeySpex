# Admin.md — KeySpex Admin Dashboard (Containers → Pages)

> **Audience:** an AI coding agent (and human reviewers) extending the existing KeySpex project (landing page + login/signup already exist).
> **Source of truth:** the supplied dashboard screenshot (`Image_1.png`, an "Enterprise OS" dashboard) for layout, density and component anatomy; `DESIGN.md` for KeySpex brand tokens, logo rules and typography; this file for everything else.
> **Mission, in order:**
> 1. Build **every UI component visible in the screenshot** as a standalone, reusable component inside **`src/containers/`**.
> 2. Build **every component the screenshot does NOT show but the product needs**, by *deriving* it from the screenshot's components using the **Derivation Protocol (§9)**. Never design from a blank page.
> 3. **Import and compose** those containers into route-level files inside **`src/pages/`** (§12).
> 4. Use mock data only. Invent no backend.

---

## 0. HOW TO USE THIS FILE (READ FIRST)

### 0.1 Precedence (higher wins on conflict)

1. **§1 Hard rules** and **§2 Screenshot defects** (things that must NOT be copied).
2. **Admin.md** (this file).
3. **DESIGN.md** → logo rules (§2), color palette (§5), typography (§6), accessibility (§13).
4. **The screenshot** → layout, density, anatomy, spacing, copy structure.
5. Your own judgment → only where marked **[DISCRETION]**.

### 0.2 Anti-hallucination protocol

Before coding:

1. **Inspect the repo**: `package.json`, `vite.config.*`, `tsconfig*.json`, `components.json`, `src/`, the router (if any), how login/signup is wired, existing tokens in `globals.css`. Preserve everything that works. **Do not modify the landing page.**
2. Detect installed versions (React, Tailwind v3/v4, Shadcn, react-router). Follow the installed API, do not assume.
3. When something is unspecified: pick the **most restrained** option consistent with §8/§9, add `// TODO(keyspex):`, and list it in the final report.
4. Never claim a check passed unless the command ran and you read the output.

### 0.3 Relationship to DESIGN.md

The admin is a **dense, utilitarian sibling** of the landing page. It inherits brand identity but is *not* editorial:

| Topic | Landing page (DESIGN.md) | Admin (this file) |
|---|---|---|
| Whitespace | Very generous | Compact, information-dense (§8) |
| Cards | Avoided; hairlines only | **Cards are the primary container** (§8.2) |
| Colors | White/black/royal blue only | Same base **plus semantic status colors** (§7.2), **admin-only** |
| Gradients | Forbidden (except hero wash) | Allowed **only** as the chart area fill (§10.3) |
| Radius | ≤ 14 px | ≤ 14 px (same) |
| Logo | Navbar/footer | Sidebar header (§10.1.2), same rules |
| Font | Plus Jakarta Sans | Same + one monospace for IDs (§8.4) |
| Motion | Restrained | Even more restrained; functional only (§17) |

---

## 1. HARD RULES

1. **Branding:** the product is **KeySpex Admin**. The screenshot's "Enterprise OS" name, its blue grid logo tile, "Core Banking & Payroll engines operational", and "v4.8" are **not** KeySpex facts. Use the supplied KeySpex logo (DESIGN.md §2: cropped derivative only, never recolored/redrawn/animated).
2. **Demo data only.** Everything shown is illustrative. The page must say so (§10.2 "Demo Environment" badge). Never imply real customers, real money, or a live system.
3. **No backend invention.** No fake API calls, fake latency claims, fake auth tokens, fake FX rates, fake exports of data that doesn't exist.
4. **Derived numbers are computed, never hard-coded** (§13.3). Screenshot values are the *seed* the mock data must reproduce.
5. **Currency is INR (₹)** with **Indian digit grouping** (₹8,45,000) and lakh/crore compact forms (₹4.20L, ₹1.2Cr). Use `Intl.NumberFormat("en-IN")`.
6. **Containers first, pages second.** A page file contains composition and data wiring only — no bespoke markup that should be a container.
7. **No new design language.** Every new component must visibly belong to the same family as the screenshot's components (§9).
8. **Allowed new dependencies:** `react-router-dom` (only if no router exists), `@fontsource-variable/jetbrains-mono`, and Shadcn-installed peers (Radix, `cmdk`, `react-day-picker`, `date-fns`, `sonner`) when you add the matching Shadcn components. **Forbidden:** chart libraries, state libraries, axios/react-query, UI kits (MUI/Chakra/AntD), icon packs other than Lucide, CSS-in-JS.
9. **No emoji as icons.** Lucide only, stroke 1.75.
10. **Accessibility is not optional** (§18).

---

## 2. SCREENSHOT DEFECTS — DO NOT REPLICATE

The screenshot is a *rendering with visible bugs and inconsistencies*. Reproduce the **design intent**, fix the defects:

| # | Defect in screenshot | Required fix |
|---|---|---|
| 1 | KPI values overflow cards (₹12,00,000 and ₹1,25,000 exceed their card edge) | KPI grid uses **container queries** (§10.3.1); values are `nowrap` and sized so they always fit; verify at 1280 and 1536 px viewports. |
| 2 | KPI captions truncated: "Rec: ₹7…", "4 Clie…" | Captions **wrap** or are shortened by design; never ellipsized. |
| 3 | KPI sub-rows wrap awkwardly ("8 on / track", "1 / Onboarding") | Each `count + label` pair is `whitespace-nowrap`; the row uses `flex-wrap` with gaps. |
| 4 | KPI cards' content sits at inconsistent vertical offsets | Use a 3-row grid inside each card (header / value / meta) with fixed row sizing so values align across the row. |
| 5 | "Revenue Overview" title wraps to 2 lines, orphaned "H1/H2 FY24" caption floats | Title stays on one line; fiscal caption becomes a **muted `SectionLabel` aligned right** or is omitted (§10.7). |
| 6 | Chart x-label "Oct (Current)" wraps unevenly | Two-line label by design: `Oct` then `(Current)` under it, centered, both blue. |
| 7 | Sidebar background ends mid-page (white below ~1320 px) | Sidebar is **`position: sticky; top: 0; height: 100dvh`** and its own scroll container. |
| 8 | Event time wraps ("10:30 / AM") | Time is `whitespace-nowrap`; meta row wraps as whole units. |
| 9 | Activity card has a large empty bottom area | Acceptable *only* because the grid stretches it to match the Events card; the table region is `flex-1`; add an `EmptyHint` row if fewer than 4 rows. |
| 10 | "Live Environment" badge next to text "Illustrative demo data" | Badge reads **"Demo Environment"** (§10.2). |
| 11 | Data inconsistencies: 16 Active + 1 Onboarding ≠ 18 employees; 15.5% vs computed 15.4%; Nov 10 is outside "Next 14d" | Mock data must be **internally consistent** (§13.4); percentages computed to 1 decimal. |
| 12 | Footer bar claims "Core Banking & Payroll engines operational", server and latency | Replace with an honest demo status bar (§10.1.9). |
| 13 | Search says "invoices" though no invoice module exists | Placeholder: **"Search employees, projects, clients…"**. |
| 14 | Hard-coded 2024 dates | All dates are **relative to today** (§13.2). |

---

## 3. SCOPE

**In scope:** admin shell, 12 sidebar destinations + Settings, all containers, mock data, formatters, selectors, responsive behavior, accessibility, derived components for pages not in the screenshot.

**Out of scope:** real authentication, APIs, databases, file storage, payments, PDF generation engines, i18n, dark mode, a theme toggle, notifications backend, any landing-page change.

**Auth integration:** inspect how login/signup work today. If an auth state/context exists, guard `/admin/*` with it. If not, create `AdminRoute` that renders children, with `// TODO(keyspex): connect to real auth` and mention it in the report. The topbar user comes from `useCurrentUser()` which returns the existing user if available, otherwise the **mock user** (`Alex Rivera`, `Super Admin`, `superadmin@brand.com` as in the screenshot — flagged as demo).

---

## 4. ROUTES AND FOLDER ARCHITECTURE (BINDING)

### 4.1 Routes

```
/                       → existing landing page (untouched)
/login, /signup         → existing
/admin                  → <Navigate to="/admin/dashboard" replace />
/admin/dashboard
/admin/budgets-revenue
/admin/payroll
/admin/payment-timeline
/admin/employees
/admin/clients
/admin/projects
/admin/tasks
/admin/contracts
/admin/calendar
/admin/reports
/admin/activity
/admin/settings
*                       → NotFound (inside shell for /admin/*, global otherwise)
```

All admin pages are loaded with `React.lazy` + `Suspense` (fallback = `PageSkeleton`) so the landing bundle stays small.

### 4.2 Folder structure

```
src/
├── containers/                         # ALL admin UI building blocks live here
│   ├── layout/                         # shell chrome (visible in screenshot)
│   │   ├── AdminShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SidebarBrand.tsx
│   │   ├── SidebarNavGroup.tsx
│   │   ├── SidebarNavItem.tsx
│   │   ├── SidebarUserCard.tsx
│   │   ├── Topbar.tsx
│   │   ├── SidebarToggle.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── GlobalSearch.tsx            # trigger + ⌘K command palette
│   │   ├── CurrencyPill.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── HelpButton.tsx
│   │   ├── UserMenu.tsx
│   │   ├── PageHeader.tsx
│   │   ├── DateRangeSelect.tsx
│   │   ├── CurrencySelect.tsx
│   │   ├── ExportMenu.tsx
│   │   ├── CreateNewMenu.tsx
│   │   └── StatusBar.tsx
│   ├── primitives/                     # small shared atoms/molecules (visible in screenshot)
│   │   ├── AdminCard.tsx
│   │   ├── CardHeader.tsx
│   │   ├── CardFooter.tsx
│   │   ├── SectionLabel.tsx
│   │   ├── IconTile.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── DeltaChip.tsx
│   │   ├── MonoCode.tsx
│   │   ├── Money.tsx
│   │   ├── DateTile.tsx
│   │   ├── AvatarInitials.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── SegmentedControl.tsx
│   │   ├── LegendItem.tsx
│   │   ├── KebabMenu.tsx
│   │   └── MetricRow.tsx
│   ├── charts/
│   │   ├── AreaLineChart.tsx
│   │   ├── RadialGauge.tsx
│   │   └── RankedBarList.tsx
│   ├── dashboard/                      # the 6 KPI cards + 6 data cards from the screenshot
│   │   ├── KpiCard.tsx
│   │   ├── KpiGrid.tsx
│   │   ├── RevenueOverviewCard.tsx
│   │   ├── BudgetUtilizationCard.tsx
│   │   ├── AllocationSegments.tsx
│   │   ├── RevenueByProjectCard.tsx
│   │   ├── UpcomingObligationsCard.tsx
│   │   ├── ObligationRow.tsx
│   │   ├── RecentActivityCard.tsx
│   │   ├── ActivityTable.tsx
│   │   ├── UpcomingEventsCard.tsx
│   │   └── EventItem.tsx
│   └── derived/                        # NOT in the screenshot → built via §9
│       ├── data-display/   DataTable, TablePagination, FilterBar, DetailSheet, Timeline, KanbanBoard, KanbanColumn, TaskCard, CalendarMonthGrid, StatTrend, DonutChart, BarChart, Sparkline, EmptyState, ErrorState, Skeletons …
│       ├── forms/          FormField, TextInput, SelectInput, TextArea, SwitchRow, DateField, EntityFormDialog, ConfirmDialog
│       └── feedback/       Toaster wrapper, InlineAlert
├── pages/
│   └── admin/
│       ├── DashboardPage.tsx
│       ├── BudgetsRevenuePage.tsx
│       ├── PayrollPage.tsx
│       ├── PaymentTimelinePage.tsx
│       ├── EmployeesPage.tsx
│       ├── ClientsPage.tsx
│       ├── ProjectsPage.tsx
│       ├── TasksPage.tsx
│       ├── ContractsPage.tsx
│       ├── CalendarPage.tsx
│       ├── ReportsPage.tsx
│       ├── ActivityLogPage.tsx
│       ├── SettingsPage.tsx
│       └── NotFoundPage.tsx
├── routes/AdminRoutes.tsx              # route table, lazy imports, AdminShell as layout route
├── data/admin/                         # mock entities (§13)
│   ├── seed.ts  employees.ts  clients.ts  projects.ts  tasks.ts  payments.ts  contracts.ts  events.ts  activity.ts  budget.ts  user.ts  nav.ts
├── types/admin.ts                      # all entity types (§13.1)
├── lib/admin/
│   ├── format.ts                       # formatINR, formatINRCompact, formatPercent, relative time
│   ├── dates.ts                        # daysFromToday, fiscalYearLabel, greeting, ranges
│   ├── selectors.ts                    # derived metrics (KPIs, totals)
│   ├── csv.ts                          # real client-side CSV export
│   └── chart-math.ts                   # scales, nice ticks, monotone curve
└── hooks/admin/  useSidebar.ts  useMediaQuery.ts  useHotkey.ts  useDemoUser.ts
```

**Import rule:** pages import from `@/containers/...` and `@/data/admin/...`. Containers never import from `pages/`. Containers receive data via **props** (they do not import mock data themselves, except `layout/` which reads `nav.ts`).
**Naming:** one component per file, named export + file name identical, `PascalCase.tsx`. Props typed with an exported `type XProps`.

---

## 5. BUILD ORDER (FOLLOW STRICTLY)

| Phase | Work | Gate |
|---|---|---|
| 0 | Inspect repo; add router, fonts, Shadcn components (`button sheet separator tooltip dropdown-menu select popover calendar command dialog table skeleton sonner switch`); tokens in §7 | App still builds; landing untouched |
| 1 | `lib/admin/*`, `types/admin.ts`, `data/admin/*` with consistent seed | Selectors reproduce screenshot numbers (§13.4 test) |
| 2 | `containers/primitives/*` | Each renders in isolation |
| 3 | `containers/charts/*` | Renders from props; sr-only table present |
| 4 | `containers/layout/*` → `AdminShell` | Sidebar/topbar match §10.1; mobile Sheet works |
| 5 | `containers/dashboard/*` | Each card matches §10.3–10.9 |
| 6 | `pages/admin/DashboardPage.tsx` | Page matches screenshot structure at 1440; no overflow 390–1920 |
| 7 | `containers/derived/*` via §9 | Each has a "Derived from" header comment |
| 8 | Remaining 12 pages (§12) | Every sidebar link resolves; no empty route |
| 9 | QA (§19) and final report | Real command output |

---

## 6. SCREENSHOT MEASUREMENT KEY

The screenshot is **1652 px wide** and was rendered at ≈ **1.29×** a 1280 px viewport. **Convert: CSS px ≈ screenshot px ÷ 1.29.** All sizes in this file are already converted and snapped to the 4 px grid. Do not use raw screenshot pixel values.

Page anatomy at a 1280 viewport:

```
┌────────────┬──────────────────────────────────────────────────────────────┐
│ SidebarBrand│ Topbar (64px)                                               │
│ (64px)      ├──────────────────────────────────────────────────────────────┤
│─────────────│ <main> padding 24px                                         │
│ Sidebar     │  PageHeader                                                 │
│ 256px       │  ─────────────────────────────────────────────────          │
│ (sticky,    │  KpiGrid (6 cards)                                          │
│  100dvh,    │  ┌─ col 7/12 ───────────────┐ ┌─ col 5/12 ─────────┐        │
│  scrolls)   │  │ RevenueOverviewCard      │ │ BudgetUtilization  │        │
│             │  │ RevenueByProjectCard     │ │ UpcomingObligations│        │
│             │  └──────────────────────────┘ └────────────────────┘        │
│ UserCard    │  ┌ RecentActivityCard ──────┐ ┌ UpcomingEventsCard ┐ (equal h)│
│ (pinned)    │  └──────────────────────────┘ └────────────────────┘        │
│             │  StatusBar                                                  │
└────────────┴──────────────────────────────────────────────────────────────┘
```

Note the dashboard body is **two independent stacks** (left: Revenue Overview + Revenue by Project; right: Budget Utilization + Upcoming Obligations), followed by a **second row** (Recent Activity + Upcoming Events) that is `items-stretch` so both cards are equal height.

---

## 7. DESIGN TOKENS FOR THE ADMIN

### 7.1 Inherited from DESIGN.md (do not redefine)

Royal Blue `#0866F5` (`--primary`), Deep Black `#090B10`, White `#FFFFFF`, Soft White `#F8FAFC`, Border Gray `#E5E7EB`, Muted `#64748B`, body `#334155`, blue tints `#F3F8FF / #E8F1FE / #D3E4FD / #A9CBFB`, hover `#0556D1`, active `#0445A8`, focus ring `rgba(8,102,245,.40)`.

### 7.2 Admin-only additions (add under a `/* admin */` block in `globals.css`; **never used on the landing page**)

```css
:root {
  /* surfaces */
  --adm-page: #FFFFFF;
  --adm-sidebar: #F8FAFC;
  --adm-card: #FFFFFF;
  --adm-card-border: #DCE4F0;       /* card outline (slightly bluer than --border) */
  --adm-hairline: #E5E7EB;          /* dividers inside cards */
  --adm-tile: #F1F5FB;              /* allocation tiles, segmented-control track, hover rows (#F8FAFC) */
  --adm-track: #EAF0FA;             /* progress/gauge tracks */
  --adm-nav-active: #D3E4FD;        /* active sidebar item bg */
  --adm-selected-row: #F3F8FF;

  /* semantic status (bg / fg / border). Target ≥ 4.5:1 for fg on bg — verify with a contrast checker */
  --adm-success-bg: #DCFCE7; --adm-success-fg: #15803D; --adm-success-bd: #BBF7D0;
  --adm-warning-bg: #FEF3C7; --adm-warning-fg: #B45309; --adm-warning-bd: #FDE68A;
  --adm-danger-bg:  #FEE2E2; --adm-danger-fg:  #B91C1C; --adm-danger-bd:  #FECACA;
  --adm-info-bg:    #E8F1FE; --adm-info-fg:    #0556D1; --adm-info-bd:    #D3E4FD;
  --adm-neutral-bg: #F1F5F9; --adm-neutral-fg: #475569; --adm-neutral-bd: #E2E8F0;
  --adm-purple-bg:  #EDE9FE; --adm-purple-fg:  #6D28D9; --adm-purple-bd:  #DDD6FE;

  /* chart */
  --adm-chart-current: #0866F5;
  --adm-chart-previous: #94A3B8;
  --adm-chart-grid: #E5E9F2;
  --adm-chart-axis: #CBD5E1;
}
```

**Tone vocabulary (shared by every component):** `info` (blue, the default "scheduled/primary"), `success` (green), `warning` (amber), `danger` (red), `neutral` (slate), `purple` (client/people accent). **Only these six tones exist.** Never add a seventh color.

**Tone usage convention (derived from the screenshot — keep consistent everywhere):**

| Meaning | Tone |
|---|---|
| Completed, Reconciled, Active, On track, Paid, positive delta | `success` |
| Scheduled, Verified, Project Deadline, primary info | `info` |
| Due soon, Overdue-soon, Financial, Near deadline, Onboarding | `warning` |
| Overdue, Alert, Failed, Rejected, negative delta | `danger` |
| Pending, Updated, Operations, Draft, Inactive, system/bot | `neutral` |
| Client Meeting, People-related accents | `purple` |

### 7.3 Shadows / radius / spacing (admin)

- Card shadow: `0 1px 2px rgba(9,11,16,.04)` (the border does the work). Popovers/dropdowns/tooltips: `0 2px 4px rgba(9,11,16,.04), 0 12px 32px -8px rgba(9,11,16,.10)`.
- Radius: card **14**, inner boxes (event items, allocation tiles) **10**, buttons/inputs **10**, chips **999**, icon tiles **8**, date tiles **8**, avatars (sidebar user) **10**, avatars (activity) **999**, progress **999**.
- Spacing base 4 px. **Page padding 24** (16 on < md). **Card gap 24** (16 on < md). **KPI gap 16.** **Card padding 20** (KPI card 16).

---

## 8. TYPOGRAPHY AND DENSITY

### 8.1 Fonts
- **UI:** Plus Jakarta Sans variable (already used by the landing page).
- **Monospace (IDs/codes/system meta only):** `@fontsource-variable/jetbrains-mono`; token `--font-mono`. Used for `CLI-2001`, `PRJ-3001`, `EMP-1004`, `CON-5001`, `PAY-6001`, `TSK-4012`, and StatusBar metrics. Nowhere else.
- All numbers/money: `font-variant-numeric: tabular-nums`.

### 8.2 Scale

| Role | Size / Weight / Line | Color |
|---|---|---|
| Page title (H1) | 26 / 700 / 1.2, tracking −0.02em | `#090B10` |
| Card title (H2/H3) | 20 / 600 / 1.25, tracking −0.01em | `#090B10` |
| Card subtitle | 13 / 400 / 1.45 | `#64748B` |
| KPI label | 11 / 600, uppercase, tracking 0.06em | `#64748B` |
| KPI value | 22 (card < 220 px) / 26 (≥ 220 px) / 700 / 1.1 | `#090B10` |
| Section label (sidebar groups, "ALLOCATION SEGMENTS", table headers) | 11 / 600, uppercase, tracking 0.08em | `#64748B` |
| Body / row title | 14 / 600 (titles) or 400 | `#090B10` / `#334155` |
| Row meta | 13 / 400 | `#64748B` |
| Chip | 12 / 600 | per tone fg |
| Mono code | 12 / 500, tracking 0.02em | `#64748B` (or bold blue when it is a link) |
| Link | 14 / 600 | `#0866F5` |
| Button | 14 / 600 | per variant |
| Sidebar item | 14 / 500 (active 600) | `#334155` (active `#0556D1`) |

### 8.3 Density rules
- Row heights: nav item **40**, table row **56** (comfortable) / **44** (compact), list row (obligation/event) **auto, min 64**.
- Icons: **18 px** in nav/buttons, **20 px** inside `IconTile`, stroke 1.75.
- Interactive hit area ≥ **40 px** desktop, **44 px** touch (< lg).

### 8.4 Money display
Always via `Money`/`formatINR`. Compact forms (`₹4.20L`, `₹9.2L`, axis `₹2L`) via `formatINRCompact(value, digits)`. Never concatenate `"₹" + number` by hand.

---

## 9. DERIVATION PROTOCOL — HOW TO BUILD COMPONENTS THE SCREENSHOT DOES NOT SHOW

**Principle:** *every missing component is a recombination of a screenshot component ("donor") plus the shared tokens.* If you cannot name a donor, stop and choose the closest one — do not invent a new visual language.

### 9.1 The 8-step recipe

1. **Name the need** (e.g., "Employees table").
2. **Find the donor(s)** in §9.2. A component can have one *structural* donor and one *stylistic* donor.
3. **Inherit** all donor tokens: container chrome, padding, header pattern, typography roles (§8.2), tone mapping (§7.2), spacing.
4. **List what is new** (e.g., sortable column headers, pagination). Add only that.
5. **Compose the new piece from existing primitives** (`AdminCard`, `CardHeader`, `StatusBadge`, `AvatarInitials`, `MonoCode`, `Money`, `DateTile`, `ProgressBar`, `SegmentedControl`, `KebabMenu`, `IconTile`, `MetricRow`).
6. **Use Shadcn only as a headless/behavioral base** (dropdown, dialog, sheet, select, command, calendar, switch) and **restyle it to the tokens** — no default Shadcn look.
7. **Add the file header comment:**
   ```ts
   /** Derived from: RecentActivityCard/ActivityTable (structure), StatusBadge (style).
    *  New: sortable headers, row selection, pagination. */
   ```
8. **Run the Family Test (§9.4).**

### 9.2 Donor matrix (need → donor → inherit → add → never)

| Missing component | Structural donor | Style donor | Inherit | Add | Never |
|---|---|---|---|---|---|
| **DataTable** (all list pages) | `ActivityTable` | `StatusBadge`, `AvatarInitials`, `MonoCode` | Header row (11px caps muted + hairline), 56px rows, hairline row dividers, right-aligned numeric cols, status chip col | Sortable headers (chevron icon), row hover `#F8FAFC`, row selected `--adm-selected-row`, checkbox col (optional), sticky header, scroll container `overflow-x-auto` | Zebra stripes, heavy borders, filled header bg |
| **TablePagination** | `CardFooter` | `Button` outline | Footer hairline + muted left text | "Showing 1–10 of 48", prev/next `Button size=sm outline`, page-size `Select` | Numbered page bubbles |
| **FilterBar** | `PageHeader` action row (`DateRangeSelect`, `CurrencySelect`) | Topbar search input | Select/input look (40px, border `#DCE4F0`, radius 10, icon left) | Search input, 1–3 `Select`s, "Clear" link button | Chips-in-input, collapsible drawers on desktop |
| **DetailSheet** (right drawer for an entity) | `AdminCard` + `CardHeader` | `MetricRow` | Header (title + subtitle + hairline), sections separated by `SectionLabel` + hairline | Shadcn `Sheet` from right (width `min(100vw, 480px)`), close button, footer action bar | Full-page modals for read-only detail |
| **EntityFormDialog** | `AdminCard` | Topbar search input (field style) | Dialog chrome = card chrome; header/title pattern; footer buttons `outline` + `primary` | Shadcn `Dialog`, form fields (§ below), validation, loading/success/error | Multi-step wizards (unless a spec says so) |
| **FormField / TextInput / SelectInput / TextArea** | Topbar search + `DateRangeSelect` | `SectionLabel` | Control height 40, radius 10, 1px `#DCE4F0`, focus ring royal blue, placeholder `#94A3B8` | Label (13/600), helper text (13 muted), error text (13 `danger-fg`, `aria-describedby`, red border) | Floating labels, underlined inputs |
| **SwitchRow** | `MetricRow` | — | Label left / control right row | Shadcn `Switch` (checked `#0866F5`) | iOS-green toggles |
| **Tabs / view toggles** | `SegmentedControl` | — | Same control | `role="tablist"` variant when it switches panels | Underlined tabs, pills with colors |
| **Timeline** (payment timeline, entity history) | `ObligationRow` (row anatomy) | Landing `ProcessStep` (rail + ring + dashed connector from DESIGN.md §10.7) | `DateTile` + title + meta + right amount/status | Vertical rail (1px `#E5E7EB`), 10px ring nodes (white fill, 2px blue stroke), dashed segments (`#A9CBFB`), grouped by week with `SectionLabel` | Icon-in-circle nodes, colored lines |
| **KanbanBoard / KanbanColumn / TaskCard** | `UpcomingEventsCard` → `EventItem` | `StatusBadge`, `AvatarInitials`, `MonoCode` | Bordered inner box (radius 10, 1px `#DCE4F0`, padding 12), title 14/600, chip top-right, meta row with clock icon + dot separator | Columns: To do / In progress / In review / Done (column header = `SectionLabel` + count chip); due date; assignee avatar; drag handle (HTML5 DnD or keyboard "Move to…" menu — **keyboard alternative mandatory**) | Colored column headers, shadows on cards |
| **CalendarMonthGrid** | `DateTile`, `EventItem` | `StatusBadge` tones | 7×6 grid with hairlines; day number 13/600; "today" = royal-blue ring; event chip = 22px tone-bg pill with 12/600 text | Prev/next/today buttons, "+N more" popover, month/agenda `SegmentedControl` | Full-color event blocks, drag-resize |
| **DonutChart (multi-segment)** | `RadialGauge` | `AllocationSegments` colors | Track, stroke width, round caps, center label typography | Multiple arcs with 2° gaps, legend via `LegendItem`, hover tooltip | 3D, exploded slices, pie with labels on slices |
| **BarChart** | `AreaLineChart` (axes/grid/ticks/tooltip) | `RankedBarList` (bar fill colors) | Margins, grid `--adm-chart-grid`, axis labels 12px muted, tooltip card | Vertical bars radius 4 top, 24px max width, current period = blue, previous = `#94A3B8` | Gradient bars, value labels on every bar |
| **Sparkline** | `AreaLineChart` | — | Current-series stroke + area fill | 80×28 no axes, no labels, `aria-hidden` + adjacent text value | Axes, tooltips |
| **StatTrend** (mini KPI with delta) | `KpiCard` | `DeltaChip` | KpiCard anatomy | Optional `Sparkline` bottom-right | New card chrome |
| **EmptyState** | `AdminCard` + `SectionLabel` | `IconTile` | Centered 32px `IconTile` (neutral), title 14/600, text 13 muted, optional `Button` | — | Illustrations |
| **ErrorState** | EmptyState | `StatusBadge danger` | Same as EmptyState with danger tile | "Retry" button | Alarming full-red blocks |
| **Skeletons** | each component's own layout | `--adm-tile` | Match final geometry exactly (no layout shift) | Shadcn `Skeleton` restyled `bg-[--adm-tile]`, subtle 1.2s pulse (disabled for reduced motion) | Spinners as page loaders |
| **Toasts** | `AdminCard` | tone colors | Border `#DCE4F0`, radius 10, tone icon | Shadcn `sonner`, bottom-right, 4s | Full-color toasts |
| **ConfirmDialog** | `EntityFormDialog` | — | Same | Destructive = `Button` with danger bg `#B91C1C` | Auto-confirming |
| **FileRow / DocumentRow** (contracts) | `ObligationRow` | `IconTile`, `MonoCode` | Row anatomy | File-type `IconTile` (`FileText`), size/date meta, `KebabMenu` | Thumbnails, fake previews |
| **ReportCard** | `AdminCard` + `CardHeader` | `KebabMenu` | Card chrome | Description, "Export CSV" button, last-run caption | Gradient banners |
| **SettingsSection** | `AdminCard` | `MetricRow`, `FormField` | Card + header; rows | Save/Cancel `CardFooter` | Accordions |
| **Breadcrumbs (deeper levels)** | `Breadcrumbs` | — | Same | Extra crumbs; last crumb `aria-current="page"` | Home icon |
| **Avatar group** | `AvatarInitials` | — | Initials tones | −8px overlap, 2px white ring, "+N" neutral | Photos |
| **Progress ring (small)** | `RadialGauge` | — | Same math | 28–40px, no labels | — |
| **Stepper (if a spec demands)** | Landing `ProcessSection` | `DateTile` | Rail + ring | Horizontal on ≥ md | Numbered colored circles |

### 9.3 Shared component vocabulary (anatomy cheat-sheet)

Every new component must be expressible in these patterns:

- **Card:** `AdminCard` → `CardHeader` (title, subtitle, right slot) → hairline → body → optional hairline → `CardFooter` (muted text left, blue link right).
- **List row:** `[DateTile | AvatarInitials | IconTile]` + `[title 14/600 / meta 13 muted with MonoCode]` + `[right: Money bold / StatusBadge]`.
- **Metric:** `SectionLabel` or label 13 → value (bold, tabular) → delta/caption.
- **Header actions:** outline `Button` (40px, icon left 18px) for secondary; primary `Button` for the single main action.
- **Status:** `StatusBadge` tone + text (never color alone).
- **Reference code:** `MonoCode`.

### 9.4 The Family Test (every derived component must pass)

Place the new component next to `RevenueByProjectCard` on a 1440 screenshot. A reviewer must not be able to tell which one was designed later. Checklist:

- [ ] Same card chrome (border `#DCE4F0`, radius 14, padding 20, shadow-xs).
- [ ] Same title/subtitle sizes and colors; hairline under header.
- [ ] Same chips, same tone mapping, same mono codes.
- [ ] No new colors, no gradients (except chart area), no new radii, no shadows heavier than xs inside the page.
- [ ] Same 4 px spacing grid and 14 px body text.
- [ ] Has loading, empty, error states.
- [ ] Keyboard and screen-reader complete.
- [ ] Responsive: stacks gracefully at 390 px.

---

## 10. CONTAINER SPECIFICATIONS (FROM THE SCREENSHOT)

> Each entry: **file**, **props**, **anatomy**, **exact visual rules**, **states**.

### 10.1 `containers/layout/`

#### 10.1.1 `AdminShell.tsx`
Layout route component. CSS grid: `grid-template-columns: var(--sidebar-w) 1fr`; `--sidebar-w: 256px` (expanded), `72px` (collapsed), `0` (< lg, sidebar is a Sheet).
Renders: skip link ("Skip to content" → `#admin-main`), `Sidebar`, column with `Topbar` + `<main id="admin-main" tabIndex={-1}>` (`<Outlet/>`, padding 24/16) + `StatusBar`.
`useSidebar()` context: `{ collapsed, toggle, mobileOpen, setMobileOpen }`; persist `collapsed` to `localStorage` in try/catch (default expanded). Route change closes the mobile sheet and moves focus to `<main>`; sets `document.title = "{Page} — KeySpex Admin"`.

#### 10.1.2 `Sidebar.tsx` + `SidebarBrand.tsx`
- Container: bg `--adm-sidebar`, border-right `--adm-hairline`, `sticky top-0 h-dvh flex flex-col`; nav area `overflow-y-auto`, user card pinned at the bottom. Width per §10.1.1. `<aside aria-label="Admin navigation">` containing `<nav aria-label="Admin">`.
- **SidebarBrand:** height 64, `padding-inline 16`, bottom hairline. Contains the **KeySpex logo** (`/brand/keyspex-logo.png`) at **height 44, width auto**, linking to `/admin/dashboard` (`aria-label="KeySpex Admin dashboard"`). No container/tile around it, no animation. **Collapsed (72 px):** show the symbol-only crop `/brand/keyspex-symbol.png` at 36 px if it exists; otherwise keep the full logo clipped is **not allowed** — instead hide the brand and keep only the toggle. (Rule: never distort or crop the logo in CSS.)
- Nav groups (6) in this exact order, from `data/admin/nav.ts`:

| Group label | Items (label → route → Lucide icon) |
|---|---|
| OVERVIEW | Dashboard → `/admin/dashboard` → `LayoutDashboard` |
| FINANCIAL MANAGEMENT | Budgets & Revenue → `/admin/budgets-revenue` → `Wallet`; Payroll & Salaries → `/admin/payroll` → `Banknote`; Payment Timeline → `/admin/payment-timeline` → `ReceiptText` |
| PEOPLE MANAGEMENT | Employees → `/admin/employees` → `Contact` (or `IdCard`); Clients → `/admin/clients` → `Building2` |
| PROJECT MANAGEMENT | Projects & Assignments → `/admin/projects` → `FolderKanban`; Task Management → `/admin/tasks` → `CircleCheckBig` |
| BUSINESS OPERATIONS | Contracts & Documents → `/admin/contracts` → `FileText`; Event Calendar → `/admin/calendar` → `CalendarDays` |
| INSIGHTS | Reports & Exports → `/admin/reports` → `ChartLine` (fallback `LineChart`); Activity Log → `/admin/activity` → `History` |

(If an icon name does not exist in the installed `lucide-react`, use the nearest same-meaning icon and note it. Never substitute an emoji.)

- **`SidebarNavGroup`:** `SectionLabel` (11/600 caps, color `#64748B`) with padding `16px 16px 8px`; group spacing 8. Group label hidden when collapsed (replaced by a 1px hairline).
- **`SidebarNavItem`** (`NavLink`): height **40**, margin-inline 8, padding-inline 12, radius 10, gap 12, icon 18, label 14/500 `#334155`.
  - Hover: bg `#EEF3FA`.
  - **Active** (`aria-current="page"`): bg `--adm-nav-active` `#D3E4FD`, text `#0556D1` weight 600, icon `#0556D1`.
  - Focus-visible: 2px royal-blue ring, offset −2px.
  - Collapsed: icon centered, label in `Tooltip` (right side).
- **`SidebarUserCard`:** pinned bottom, top hairline, padding 16. `AvatarInitials` (36px, **radius 10 square**, tone info) + name 14/600 + email 13 muted truncated + `Settings` icon button (36px, `aria-label="Account settings"`, navigates to `/admin/settings`). Collapsed: avatar only.

#### 10.1.3 `Topbar.tsx`
Height **64**, sticky top, bg white/90 + backdrop-blur, bottom hairline, padding-inline 24. Left → right:
1. `SidebarToggle` — icon button 40px (`PanelLeftClose`/`PanelLeftOpen`; on < lg `Menu`), `aria-label` "Collapse sidebar" / "Open menu", `aria-expanded`.
2. `Breadcrumbs` — "Overview › Dashboard": 14px, ancestors `#64748B`, separator `ChevronRight` 14px, current `#090B10` 500 with `aria-current="page"`. Built from the nav config (group label → item label). Hidden < md.
3. `GlobalSearch` — flex-1, max-width **480px**, height 40, radius 10, border `#DCE4F0`, bg `#F8FAFC`, search icon left 18px `#64748B`, placeholder **"Search employees, projects, clients…"** (§2 #13), right-aligned `kbd` hint `⌘K` (or `Ctrl K` on non-Mac; detect). It is a **button styled as an input** that opens the command palette (Shadcn `CommandDialog`). `⌘/Ctrl+K` toggles it globally. Palette groups: Pages (from nav), Employees, Clients, Projects, Tasks, Contracts (from mock data, max 5 per group); selecting navigates (to the entity's list page with `?q=` or detail sheet). Empty: "No results for “{q}”." < md: collapses to a 40px icon button.
4. `CurrencyPill` — `₹ INR (₹)` pill: height 32, radius 999, border `#DCE4F0`, bg `#F8FAFC`, 13/600. Opens the same single-option menu as `CurrencySelect` (§10.2). Hidden < lg.
5. `NotificationBell` — 40px icon button, `Bell` 20px, **count badge** (16px circle, bg `#DC2626`, white 11/700, top-right; shows `9+` over 9; hidden at 0). Opens a popover list (derived: `ObligationRow`-style rows, max 5, from derived "alerts" selector: overdue payments, due-soon obligations). `aria-label="Notifications, 3 unread"`.
6. `HelpButton` — `CircleHelp` icon button; opens a small popover with 3 text links to docs placeholders (`// TODO`) — **no invented URLs**; links render disabled if none configured.
7. Vertical divider (1px × 28px `--adm-hairline`).
8. `UserMenu` — `AvatarInitials` **solid** variant (32px circle, bg `#0866F5`, white `User` icon) + name 14/600 + role 13 muted (hidden < md); dropdown: Settings, then separator, "Sign out". Beside it a **logout icon button** (`LogOut`, `aria-label="Sign out"`) — as in the screenshot. Sign out calls the existing auth sign-out if present, else navigates to `/login` (`TODO`).

#### 10.1.4 `PageHeader.tsx`
```
Props: { title: string; badge?: ReactNode; description?: string; actions?: ReactNode; className? }
```
Layout (≥ lg): left block (title row: H1 + `StatusBadge`; description 14 `#64748B`, max-width 520), right block (`actions`, `flex-wrap gap-3 justify-end`); bottom hairline with `margin-top 16; margin-bottom 24`. < lg: stacked, actions full-width wrap.
**Dashboard instance:** title `Good {morning|afternoon|evening}, {firstName|Admin}`; badge `StatusBadge tone="info" dot` **"Demo Environment"**; description **"Here’s your business performance at a glance. Illustrative demo data."**; actions in this order: `DateRangeSelect`, `CurrencySelect`, `ExportMenu` (outline, `Download` icon, "Export Report"), `CreateNewMenu` (primary, `Plus` icon, "Create New"). In the screenshot "Create New" wraps below; here all four sit on one row ≥ xl and wrap naturally below.

#### 10.1.5 `DateRangeSelect.tsx`
Trigger: outline field-style button, height 40, `Calendar` icon, text **"This Month: {Mon D} – {Mon D, YYYY}"**, `ChevronDown`. Popover: presets list (This Month, Last Month, Last 3 Months, This Quarter, Fiscal Year to Date, Custom…) + Shadcn `Calendar` (range mode) for Custom. Props: `{ value: DateRange; onChange(r: DateRange): void }`. Range state lives in the page (default = current month). Changing it re-runs selectors (`getKpis(range)`).

#### 10.1.6 `CurrencySelect.tsx`
Trigger label **"INR (₹) Default"**, `IndianRupee` icon, `ChevronDown`. **Only INR is listed** (no FX data exists). Render a footnote in the menu: "More currencies need exchange-rate data (not configured)." Do **not** invent other currencies.

#### 10.1.7 `ExportMenu.tsx`
Outline button + dropdown: **"Download CSV"** (real: `lib/admin/csv.ts` serializes the *currently displayed* dataset — e.g., KPIs + series for the dashboard — with Indian-formatted numbers kept as raw numerics), **"Print / Save as PDF"** (`window.print()` with a print stylesheet that hides sidebar/topbar/actions). Shows a `sonner` toast "CSV downloaded". No other formats.

#### 10.1.8 `CreateNewMenu.tsx`
Primary button "Create New" + dropdown, items derived from the sidebar modules (no invented modules): New Project, New Task, New Employee, New Client, New Contract, New Event. Selecting navigates to the module route with `?new=1`, which the page uses to open its `EntityFormDialog`.

#### 10.1.9 `StatusBar.tsx`
Bottom-of-content bar: card chrome (border `#DCE4F0`, radius 10, padding 12/16), left: green 8px dot + **"KeySpex Admin • Demo environment — data is illustrative"** (14 `#334155`); right (≥ md): mono 12 muted: `MODE: DEMO   DATA: MOCK   UPDATED: {local time}`. **No fake server/latency/refresh claims.** Margin-top 24.

### 10.2 `containers/primitives/` (exact specs)

| Component | Props (TS) | Spec |
|---|---|---|
| `AdminCard` | `{ as?: "section"\|"div"\|"article"; padded?: boolean; className?; children; "aria-labelledby"?: string }` | `bg #fff; border 1px --adm-card-border; radius 14; shadow-xs; p-5 (padded default true); min-w-0; flex flex-col`. |
| `CardHeader` | `{ id?: string; title: string; subtitle?: string; actions?: ReactNode; divider?: boolean (default true); titleAdornment?: ReactNode }` | Row: left (title H2 20/600 + adornment, subtitle 13 muted mt-0.5) / right actions (aligned top). Divider: 1px `--adm-hairline`, `mt-4 mb-4`. Title never wraps on one-line cards (`truncate`); allowed to wrap only < sm. |
| `CardFooter` | `{ children?; href?: string; linkLabel?: string; icon?: ReactNode }` | Top hairline, `pt-3.5 mt-auto`, flex between; left 13/14 muted (icon 16 optional), right link (14/600 blue + `ArrowRight` 16). |
| `SectionLabel` | `{ children; className? }` | 11/600 caps tracking .08em `#64748B`. |
| `IconTile` | `{ icon: LucideIcon; tone?: Tone; size?: 32\|36 }` | Square 32 (radius 8), tone bg; icon 18, tone fg (info default). `aria-hidden`. |
| `StatusBadge` | `{ tone: Tone; dot?: boolean; children; size?: "sm"\|"md" }` | Inline-flex, height 22 (sm 20), px 8, radius 999, 12/600, tone bg + fg + 1px tone border; dot 6px tone fg. |
| `DeltaChip` | `{ value: number; suffix?: "%"; invert?: boolean }` | `ArrowUp/ArrowDown` 14 + `+14.2%`; positive → success tone, negative → danger (invert flips). |
| `MonoCode` | `{ children; variant?: "muted"\|"link"\|"strong"; href?: string }` | Mono 12/500; `muted` `#64748B`; `link` bold `#0866F5` (anchor if href); `strong` bold `#090B10`. |
| `Money` | `{ value: number; compact?: boolean; digits?: number; tone?: "default"\|"info"\|"success"\|"danger"; className? }` | Uses `formatINR` / `formatINRCompact`; tabular; tone → text color (`#090B10`, `#0866F5`, `#15803D`, `#B91C1C`). `aria-label` = full-form text when compact. |
| `DateTile` | `{ date: Date\|string; tone?: Tone }` | 36 × 40, radius 8, tone bg + 1px tone border; month 10/700 caps tone fg; day 18/700 `#090B10`. `aria-hidden` (adjacent text carries the date). |
| `AvatarInitials` | `{ name: string; size?: 28\|32\|36; shape?: "circle"\|"rounded"; tone?: Tone; variant?: "initials"\|"bot"\|"solid-user" }` | Initials 12/700 on tone bg; tone auto-selected from a stable hash of `name` among info/purple/warning/success/neutral when omitted; `bot` shows `Bot` icon on neutral; `solid-user` = royal-blue bg + white `User` icon. |
| `ProgressBar` | `{ value: number /*0-100*/; tone?: "primary"\|"mid"\|"slate"\|"soft"; label: string; height?: 8 }` | Track `--adm-track`, radius 999, fill by tone: `primary #0866F5`, `mid #4C94F8`, `slate #475569`, `soft #A9C1E8`; `role="progressbar"` + `aria-valuenow/min/max` + `aria-label`; width transition 600 ms (none for reduced-motion). |
| `SegmentedControl` | `{ options: {value:string;label:string}[]; value; onChange; ariaLabel: string; size?: "sm"\|"md" }` | `role="radiogroup"`, items `role="radio"`; track `--adm-tile`, border `#DCE4F0`, radius 10, p-0.5; item height 28 (md 32), px 12, 13/600; active: bg white, border `#DCE4F0`, shadow-xs, text `#090B10`; inactive `#64748B`; arrow-key navigation. |
| `LegendItem` | `{ color: string; label: string; shape?: "square"\|"dash" }` | 10px square radius 2 (or 14×2 dashed line) + 13/500 label. |
| `KebabMenu` | `{ items: {label;onSelect;destructive?;icon?}[]; ariaLabel }` | 32px ghost icon button `EllipsisVertical`; Shadcn dropdown restyled. |
| `MetricRow` | `{ label: string; value: ReactNode; tone?: "default"\|"info"\|"success"\|"danger" }` | Flex between, py-2.5, label 14 `#334155`, value 14/700 tabular with tone color. |

### 10.3 `containers/dashboard/` — KPI row

#### 10.3.1 `KpiGrid.tsx` + `KpiCard.tsx`

`KpiGrid` props: `{ items: KpiCardProps[] }`. Layout uses a **container query** on the content wrapper (`container-type: inline-size`):

| Content width | Columns |
|---|---|
| ≥ 1180 px | 6 |
| 720–1179 px | 3 (2 rows) |
| 400–719 px | 2 |
| < 400 px | 1 |

Gap 16. (At a 1280 viewport the content is ≈ 975 px → **3 × 2**; at ≥ 1536 viewport → **6 × 1**; this is the fix for screenshot defect #1.)

```ts
type KpiCardProps = {
  id: string;
  label: string;                       // single line, uppercase via CSS
  icon: LucideIcon; iconTone: Tone;
  value: ReactNode;                    // Money | number
  meta?: ReactNode;                    // chips/captions row
  href?: string;                       // optional: whole card links to a page
  loading?: boolean;
};
```
**Anatomy** (grid rows `auto 1fr auto`, min-height 128, padding 16, `AdminCard`):
```
┌──────────────────────────────┐
│ TOTAL REVENUE          [▣]   │ ← label (truncate + title attr) / IconTile 32
│                              │
│ ₹8,45,000                    │ ← value nowrap, 22px (26px when card ≥ 220px)
│ [↑ +14.2%] Recurring ₹7,10,000│ ← meta: flex-wrap gap-x-2 gap-y-1, 12px muted
└──────────────────────────────┘
```
Values never ellipsize or overflow: if `scrollWidth > clientWidth`, drop to 20px then to compact form (`₹12L`) automatically (ResizeObserver) — acceptance test in §19.

**The six KPI instances (from the screenshot; all values computed by `getKpis()`):**

| # | label | icon (tone) | value | meta |
|---|---|---|---|---|
| 1 | TOTAL REVENUE | `TrendingUp` (info) | Σ billed revenue in range → **₹8,45,000** | `DeltaChip +14.2%` (vs previous period) + caption "Recurring ₹7,10,000" (seed) |
| 2 | OUTSTANDING | `ClipboardClock` / fallback `ClipboardList` (warning) | Σ unpaid invoices → **₹1,25,000** | `StatusBadge warning dot` "3 Overdue" + caption "4 Clients" |
| 3 | TOTAL BUDGET | `Landmark` (info) | annual cap → **₹12,00,000** | `StatusBadge info` "70.4% Committed" + caption "Annual FY {fiscalYearLabel}" |
| 4 | SALARY PAYABLE | `Banknote` (info) | next payroll total → **₹2,40,000** | `StatusBadge info (outline)` "Due {Mon D}" (next payroll date) + caption "18 Staff" |
| 5 | ACTIVE PROJECTS | `Layers` (info) | count → **12** | three inline counts: `8 on track` (success text), `2 near` (warning text, title "Near deadline"), `2 alert` (danger text), separated by 3px dots |
| 6 | TOTAL EMPLOYEES | `Users` (info) | count → **18** | `● 16 Active` (success dot) + `1 Onboarding`; tooltip adds "1 On leave" |

### 10.4 `RevenueOverviewCard.tsx` (+ `AreaLineChart`)

```ts
type RevenueOverviewCardProps = {
  periods: { id: "6M"|"YTD"|"1Y"; label: string }[];
  period: "6M"|"YTD"|"1Y"; onPeriodChange(p): void;
  labels: string[];                 // month labels
  current: number[]; previous: number[];
  fiscalCaption?: string;           // e.g., "H1 FY26-27" (optional, muted, right-aligned in header)
  projectedBreach?: { amount: number; monthLabel: string }; // for footer sentence
  loading?: boolean;
};
```
**Anatomy**
```
┌──────────────────────────────────────────────────────────────┐
│ Revenue Overview                       ■ Current  ▬ Previous  [6M|YTD|1Y]│
│ Comparative trajectory across trailing periods               │
│ ──────────────────────────────────────────────────────────── │
│ ₹10L ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈●        │
│ ₹8L  …           ╭──────╮   area fill                         │
│ ₹6L  …      ╭────╯                                            │
│ ₹4L  …  ╭───╯  ┈┈ previous (dashed) ┈┈                        │
│ ₹2L  ──╯                                                       │
│ ₹0   May   Jun   Jul   Aug   Sep    Oct                        │
│                                    (Current)                   │
│ ──────────────────────────────────────────────────────────── │
│ ↗ Monthly run-rate projected to breach ₹9.2L in Nov.   Full Financials → │
└──────────────────────────────────────────────────────────────┘
```
- Header right cluster: `LegendItem` Current (`#0866F5` square) + Previous (`#94A3B8` square — or dashed) + `SegmentedControl` (6M / YTD / 1Y, default 6M). Cluster wraps under the title < xl.
- Footer (`CardFooter`): left icon `TrendingUp` (success, 18) + text "Monthly run-rate projected to breach **₹9.2L** in {Mon}." (bold amount via `Money compact digits=1`), right link "Full Financials" → `/admin/budgets-revenue`. The projection is **computed** (linear extrapolation of last 3 points) — if insufficient data, hide the footer sentence.
- Period behavior: `6M` = last 6 months (default), `YTD` = Apr→today (fiscal) , `1Y` = last 12 months; the x-axis labels adapt; the **last current point always equals KPI Total Revenue** for `6M` default context.
- **Approximate seed** read from screenshot (₹ lakh): current `[2.0, 4.5, 5.3, 7.0, 8.1, 8.45]`, previous `[2.8, 4.1, 4.8, 4.6, 6.6, 7.3]`. Any believable alternative is allowed, but **final current point = Total Revenue**.

### 10.5 `containers/charts/AreaLineChart.tsx`

```ts
type Series = { id: string; label: string; points: number[]; tone: "current"|"previous" };
type AreaLineChartProps = {
  labels: string[]; series: Series[];
  height?: number;                 // default 220
  yTicks?: number[];               // default nice ticks 0..max (step 2L for ≤10L)
  formatY?: (v:number)=>string;    // default: v => formatINRCompact(v, 0)  → ₹0, ₹2L …
  formatTooltip?: (v:number)=>string; // default: formatINR
  highlightLast?: boolean;         // default true: blue labels + "(Current)"
  currentLabelSuffix?: string;     // default "(Current)"
  ariaLabel: string;
};
```
**Rendering rules (SVG, no library):**
- Width from `ResizeObserver` on the wrapper; `viewBox = 0 0 W H`; margins `{ top: 12, right: 12, bottom: 44, left: 48 }`.
- X scale: points evenly spaced, **first point at the left plot edge, last at the right plot edge** (matches the screenshot: line begins on the y-axis and the last dot sits on the right edge). Y scale: linear `0 → niceMax`.
- Grid: horizontal lines at each tick, stroke `--adm-chart-grid` 1px; baseline stroke `--adm-chart-axis`. No vertical grid. Y labels 12px `#64748B`, right-aligned at `x = left − 10`; X labels 12px `#64748B` centered, `y = H − 22`.
- Curve: **monotone cubic interpolation** (no overshoot) via `lib/admin/chart-math.ts` (`monotonePath(points)`).
- **Current**: stroke `#0866F5` 2.5px, round caps/joins; **area** = path closed to baseline filled with `linearGradient` top `rgba(8,102,245,0.18)` → bottom `rgba(8,102,245,0)` (the **only** gradient allowed in the admin). Interior markers: r 4, fill white, stroke `#0866F5` 2px. **Last marker:** r 5.5, solid `#0866F5` with 2px white ring.
- **Previous**: stroke `#94A3B8` 1.5px, `stroke-dasharray: 5 5`, area flat fill `rgba(148,163,184,0.06)`, drawn *behind* current; no markers.
- Last X label: `#0866F5`/600 with a second line `(Current)` 11px under it (§2 #6).
- Hover/focus: vertical guide line (1px `#CBD5E1`), enlarge nearest marker, tooltip (white card, border `#DCE4F0`, radius 10, shadow-md, 12/13px) listing label + month + both series values. Keyboard: the plot is `tabIndex=0`; ←/→ move the active index; tooltip updates (`aria-live="polite"` text).
- Accessibility: `role="img"` + `aria-label`; **sr-only `<table>`** with months × series values.
- Animation: line draws via opacity fade 300 ms only (no path-drawing animation); none under reduced motion.
- Loading: skeleton of identical height. Empty: `EmptyState` "No revenue data for this period."

### 10.6 `BudgetUtilizationCard.tsx` (+ `RadialGauge`, `AllocationSegments`)

```ts
type BudgetUtilizationCardProps = {
  cap: number; committed: number;                  // percent & remaining computed
  segments: { id: string; label: string; amount: number }[]; // Operations, Payroll, Infra & SaaS
  menuItems?: KebabItem[];
};
```
- Header: **"Budget Utilization"**, subtitle **"Fiscal cap vs commitments"**, `KebabMenu` right ("View details", "Export CSV").
- Body (two columns ≥ sm; stacked < sm): left `RadialGauge` (size **132**), right three `MetricRow`s: **Allocated Cap** `Money` default; **Committed / Spent** `Money tone=info`; **Remaining Buffer** `Money tone=success`. Hairline below.
- `SectionLabel` **"ALLOCATION SEGMENTS"**, then 3 tiles (`grid-cols-3 gap-3`): tile bg `--adm-tile`, radius 10, padding 12, centered: label 13 muted, amount `Money compact digits=2` 18/700, percentage 12 muted (= segment ÷ committed, 1 decimal). Tiles reflow to 1 column < 400 px.
- `RadialGauge` props: `{ value: number; size?: number; strokeWidth?: number; label?: string; valueLabel?: string; ariaLabel: string }`. **Math:** `r = (size − stroke)/2`, `C = 2πr`, progress `dasharray = (C·v/100) ${C}`; track circle full `--adm-track`; progress `#0866F5`, `stroke-linecap: round`; **both circles rotated `rotate(60 cx cy)`** so the arc begins at ≈ 5 o'clock and sweeps clockwise (matches the screenshot); stroke **12**; center text: value 24/700 tabular (`70.4%`), label 11 caps tracking .08em muted (`UTILIZED`). `role="img"`, `aria-label="70.4 percent of budget utilized"`.

### 10.7 `RevenueByProjectCard.tsx` (+ `RankedBarList`)

```ts
type RankedItem = { rank: number; name: string; code: string; amount: number; sharePct: number };
type RevenueByProjectCardProps = { items: RankedItem[]; badgeLabel?: string /* "Top 4 Accounts" */ };
```
- Header: **"Revenue by Project"** / **"Portfolio share and billing realization"**; right `StatusBadge tone="neutral"` **"Top 4 Accounts"** (13/600 on `--adm-tile` — neutral chip).
- Rows (gap 20): line 1 — rank square (24×24, radius 6, `--adm-info-bg`, number 12/700 `#0556D1`) + name 15/500 `#090B10` + `MonoCode muted` code; right: `Money` 15/700 + share `MonoCode` `40.2%` (right-aligned fixed width 56). Line 2 — `ProgressBar` (height 8, width = `sharePct`% **of the track**; tones by rank: 1 `primary`, 2 `mid`, 3 `slate`, 4 `soft`).
- `sharePct = amount / totalRevenue × 100`, 1 decimal, computed by selector (seed: 40.2 / 24.8 / 19.5 / 15.4).
- Rows link to `/admin/projects?open={code}`.

### 10.8 `UpcomingObligationsCard.tsx` + `ObligationRow.tsx`

```ts
type Obligation = { id:string; date:Date; title:string; clientName:string; clientCode:string; amount:number;
                    status:"due_soon"|"scheduled"|"pending_auth"; dueLabel?:string; meta?:string };
type UpcomingObligationsCardProps = { items: Obligation[]; windowDays: number /* 14 */; viewAllHref: string };
```
- Header: **"Upcoming Obligations"** / **"Imminent payouts & disbursements"**; right link **"View All"** (14/600 blue) → `/admin/payment-timeline`.
- `ObligationRow` (padding 14 0, hairline between): `DateTile` (tone by status: `due_soon`→warning, `scheduled`→info, `pending_auth`→neutral) + body (title 15/600; meta 13 muted: `{clientName} • <MonoCode>{clientCode}</MonoCode>`; for payroll rows: `Core Team (18 Staff) • Auto-ACH`) + right column (`Money` 15/700; `StatusBadge`: due soon → warning **"Due in {n} days"** (computed), scheduled → info **"Scheduled"**, pending auth → neutral **"Pending Auth"**).
- Footer: left **"Total Pipeline Outflow (Next 14d)"** (13 muted), right `Money` 14/700 = Σ items **within `windowDays`** (§13.4 test).
- Seed (offsets from today): +3 AWS Cloud Infra Renewal ₹65,000 (Apex Global • CLI-2001); +6 October Payroll Run ₹2,40,000 (Core Team (18 Staff) • Auto-ACH); +10 Milestone 2 Disbursement ₹1,10,000 (Nexa Systems • CLI-2002, pending auth); +13 SaaS Tooling & Licenses ₹35,000 (Vertex Labs • CLI-2003). Titles/amounts are copied from the screenshot; **dates are relative** and the payroll title uses the **current month name** ({Month} Payroll Run).

### 10.9 `RecentActivityCard.tsx` + `ActivityTable.tsx`

```ts
type ActivityRow = { id:string; actor:{ name:string; role:string; kind:"person"|"bot" };
  action: ReactNode /* text + MonoCode refs */; context?: string; at: Date;
  status:"completed"|"verified"|"reconciled"|"updated"|"failed" };
type RecentActivityCardProps = { rows: ActivityRow[]; auditLogHref: string; live?: boolean };
```
- Header: **"Recent Activity"** with a 8px `success` dot (`aria-hidden`; sr-only "live") ; right link **"Full Audit Log →"** → `/admin/activity`.
- Table (semantic `<table>`): columns **ACTOR** (≈ 30%), **ACTION & TARGET** (≈ 40%), **TIME** (≈ 15%, `whitespace-nowrap`), **STATUS** (≈ 15%, right-aligned). Header cells use `SectionLabel`; header row has top+bottom hairline; rows ≥ 64px with hairline dividers; no zebra.
  - Actor cell: `AvatarInitials` 36 (circle) + name 15/600 + role 13 muted. Bot: `variant="bot"`.
  - Action cell: line 1 text 14 `#090B10` with entity refs as `MonoCode variant="link"` (contracts/employees/payments) or `strong` (tasks); line 2 context 13 muted.
  - Time: relative ("10m ago", "1h ago", "3h ago", "5h ago") via `formatRelative`; `title` = absolute timestamp.
  - Status: `StatusBadge` — completed/reconciled → success dot, verified → info dot, updated → neutral dot, failed → danger dot.
- **Responsive:** < md the table becomes a stacked list (each row: avatar + name/role; action; time + status line).
- Seed (4 rows, from screenshot): Alex Rivera/Super Admin — "Created Contract CON-5001" / Apex Global (CLI-2001) — 10m — Completed; Riya Sharma/HR Operations — "Approved Salary Slip for EMP-1004" / DevOps Lead • {Month} Run — 1h — Verified; Finance Bot/Automated Job — "Recorded Inward Payment PAY-6001" / ₹85,000 from Nexa Systems — 3h — Reconciled; Marcus Vance/Project Lead — "Reassigned Task TSK-4012" / Fintech Banking UI (PRJ-3002) — 5h — Updated.

### 10.10 `UpcomingEventsCard.tsx` + `EventItem.tsx`

```ts
type EventCategory = "project_deadline"|"operations"|"financial"|"client_meeting";
type CalendarEvent = { id:string; start:Date; title:string; category:EventCategory; timeLabel:string; contextLabel:string; contextCode?:string };
```
- Header: **"Upcoming Events"** / **"Schedules, reviews, and client syncs"**; right `CalendarPlus` icon button (`aria-label="Add event"` → `/admin/calendar?new=1`).
- `EventItem` (the **donor for Kanban cards**): bordered box (1px `#DCE4F0`, radius 10, padding 12, gap 12): `DateTile` + body (title 15/600 + category chip right; meta row: `Clock` 14 + time `whitespace-nowrap` + `•` + context 13 muted with optional `MonoCode`). Category → tone: Project Deadline → info; Operations → neutral; Financial → warning; Client Meeting → purple. DateTile tone = same tone. Stack gap 12.
- Footer: left **"{n} meetings queued this cycle"** (13 muted; n = events in list), right link **"Open Full Calendar"** → `/admin/calendar`.
- Seed (4): Sprint 14 Milestone Review — Project Deadline — 10:30 AM — PRJ-3001 (Cloud Migration); Monthly Payroll Reconciliation — Operations — 04:00 PM — Finance & HR Core Team; Executive Q4 Budget Review — Financial — 02:00 PM — Leadership Council Room; Client Sync: Apex Global — Client Meeting — 11:00 AM — CLI-2001 (Google Meet). Dates relative to today (+4, +6, +8, +10); "Q4" label computed or kept generic ("Executive Quarterly Budget Review" if not Q4).

---

## 11. DASHBOARD PAGE COMPOSITION — `pages/admin/DashboardPage.tsx`

The page is **composition + wiring only**:

```tsx
export default function DashboardPage() {
  const [range, setRange] = useState(defaultMonthRange());
  const [period, setPeriod] = useState<"6M"|"YTD"|"1Y">("6M");
  const user = useCurrentUser();
  const data = useDashboardData(range, period);   // selectors over mock data; returns loading/error too

  return (
    <>
      <PageHeader
        title={`Good ${greeting()}, ${user.firstName ?? "Admin"}`}
        badge={<StatusBadge tone="info" dot>Demo Environment</StatusBadge>}
        description="Here’s your business performance at a glance. Illustrative demo data."
        actions={<>
          <DateRangeSelect value={range} onChange={setRange} />
          <CurrencySelect />
          <ExportMenu getRows={data.exportRows} filename="dashboard" />
          <CreateNewMenu />
        </>}
      />
      <KpiGrid items={data.kpis} />
      <div className="mt-6 grid grid-cols-1 gap-6 @[1000px]:grid-cols-12">
        <div className="flex flex-col gap-6 @[1000px]:col-span-7">
          <RevenueOverviewCard … />
          <RevenueByProjectCard … />
        </div>
        <div className="flex flex-col gap-6 @[1000px]:col-span-5">
          <BudgetUtilizationCard … />
          <UpcomingObligationsCard … />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 @[1000px]:grid-cols-12">
        <div className="@[1000px]:col-span-7"><RecentActivityCard … /></div>
        <div className="@[1000px]:col-span-5"><UpcomingEventsCard … /></div>
      </div>
    </>
  );
}
```
(`@[1000px]` = container query on the `<main>` wrapper; use the installed Tailwind's container-query syntax. Below it all cards stack in this order: Revenue Overview, Budget Utilization, Revenue by Project, Upcoming Obligations, Recent Activity, Upcoming Events — **set explicit `order-*` classes** to guarantee that sequence.)

**Page states:** *loading* → skeleton versions of every card (same geometry); *error* → `ErrorState` inside the failing card only; *empty range* → each card's own `EmptyState`. Shell and header never disappear.

---

## 12. REMAINING PAGES — COMPOSITION BLUEPRINTS (USE §9 FOR ANYTHING NEW)

Every page: `PageHeader` (title, description, 1 primary action) → optional `FilterBar` → content → (no StatusBar duplication; it is in the shell). Every list page supports `?q=`, `?new=1`, and a `DetailSheet` opened via `?open={code}`. Mock data only; mutations update **in-memory state** and show a `sonner` toast (no persistence claims). Where a page needs a metric strip, reuse `KpiGrid` (computed KPIs, 3–4 cards).

| Page | Header primary action | Content (containers) — **existing** vs **derived** |
|---|---|---|
| **BudgetsRevenuePage** | "Add Budget Line" → `EntityFormDialog` | `KpiGrid` (Total Budget, Committed, Remaining, Revenue) · `BudgetUtilizationCard` (reuse) · `RevenueOverviewCard` (reuse) · `RevenueByProjectCard` (reuse) · **derived:** `BudgetLinesTable` (DataTable; cols: Category, Allocated, Committed, Remaining, % used with `ProgressBar`), `BarChart` (budget vs actual by category) |
| **PayrollPage** | "Run Payroll" → `ConfirmDialog` (mock: toast only, state "Processed (demo)") | `KpiGrid` (Salary Payable, Staff, Next Run, Paid This Cycle) · `UpcomingObligationsCard` filtered to payroll · **derived:** `PayrollTable` (cols: Employee `AvatarInitials`+name+`MonoCode`, Role, Gross, Deductions, Net, Status `StatusBadge`), `DonutChart` (payroll by department). Seed: 18 employees; net pay distribution **6 × ₹16,000 + 6 × ₹13,000 + 6 × ₹11,000 = ₹2,40,000**. Deductions are a generic number — **do not name statutory components (PF/TDS/ESI) or compliance claims**. |
| **PaymentTimelinePage** | "Record Payment" → `EntityFormDialog` | `SegmentedControl` (All / Inward / Outward) · `UpcomingObligationsCard` · **derived:** `Timeline` of `ObligationRow`-style entries grouped by week (past: neutral nodes w/ success badge; future: ring nodes), `FilterBar` (client, status, range) |
| **EmployeesPage** | "Add Employee" | `KpiGrid` (Total, Active, Onboarding, On leave) · **derived:** `FilterBar` (search, department, status), `DataTable` (Employee, ID `MonoCode`, Role, Department, Status badge, Joined), `DetailSheet` (profile `MetricRow`s, assigned projects list), `TablePagination` |
| **ClientsPage** | "Add Client" | `KpiGrid` (Clients, With Outstanding, Active Projects, Revenue) · **derived:** `DataTable` (Client, CLI code, Active projects, Outstanding `Money`, Last activity), `DetailSheet` (projects, payments `ObligationRow`s, contracts `FileRow`s) |
| **ProjectsPage** | "New Project" | `RevenueByProjectCard` (reuse, top) · **derived:** `SegmentedControl` (Table / Board), `DataTable` (Project, code, Client, Health `StatusBadge` on-track/near/alert, Progress `ProgressBar`, Due), `KanbanBoard` by health?? → **no**: Board groups by *stage* (Planning / In Progress / Review / Delivered) using `TaskCard`-style `ProjectCard`; `DetailSheet` with assignments (`AvatarInitials` group) |
| **TasksPage** | "New Task" | **derived:** `KanbanBoard` (To do / In progress / In review / Done), `TaskCard` (title, `MonoCode` TSK-####, project code, due `Clock` meta, assignee avatar, priority `StatusBadge`), keyboard "Move to…" menu, list view via `DataTable`, `DetailSheet` |
| **ContractsPage** | "Add Contract" (metadata form only — **no file upload**) | `KpiGrid` (Active, Expiring ≤ 30d, Draft) · **derived:** `DataTable` of contracts (CON code, Client, Value `Money`, Start/End, Status badge) and `FileRow` list for linked documents (name + type, no real files) |
| **CalendarPage** | "Add Event" | `UpcomingEventsCard` (reuse, in a side column) · **derived:** `CalendarMonthGrid` (+ agenda `SegmentedControl`), `EventFormDialog` (title, category, date, time, context) |
| **ReportsPage** | — | **derived:** grid of `ReportCard`s from a static list of report definitions built **only from existing mock entities** (Revenue summary, Budget utilization, Payroll register, Client outstanding, Project health, Activity log); each has "Export CSV" (real, via `csv.ts`) and a `DataTable` preview in a `DetailSheet`. PDF = print. No scheduled reports (no backend). |
| **ActivityLogPage** | — | **derived:** `FilterBar` (actor, status, range), `DataTable` built from the `ActivityTable` anatomy (≥ 40 deterministic rows for pagination), `DetailSheet` showing raw fields (`MetricRow`s) |
| **SettingsPage** | — (Save in each section footer) | **derived:** `SettingsSection` cards: *Profile* (display only from user), *Preferences* (currency fixed to INR, date format, default dashboard range), *Notifications* (`SwitchRow`s, local state). No password/security forms (no backend) — show an `InlineAlert`: "Account security is managed by your sign-in provider." only if true; otherwise omit. |
| **NotFoundPage** | "Back to dashboard" | `EmptyState` |

**Derivation example (follow this style for every derived component):**
*"Tasks Kanban card"* → donor `EventItem` (box, padding, title, chip, meta row) + `AvatarInitials` + `MonoCode`. New: priority chip, drag affordance. No new colors.

---

## 13. MOCK DATA, SELECTORS AND FORMATTING

### 13.1 Types (`types/admin.ts`)

```ts
export type Tone = "info"|"success"|"warning"|"danger"|"neutral"|"purple";
export type HealthStatus = "on_track"|"near"|"alert";
export type Client   = { id: `CLI-${number}`; name: string };
export type Employee = { id: `EMP-${number}`; name: string; role: string; department: string; status: "active"|"onboarding"|"on_leave"; netPay: number; joinedAt: string };
export type Project  = { id: `PRJ-${number}`; name: string; clientId: Client["id"]; billed: number; health: HealthStatus; progress: number; dueAt: string; stage: "planning"|"in_progress"|"review"|"delivered" };
export type Task     = { id: `TSK-${number}`; title: string; projectId: Project["id"]; assigneeId: Employee["id"]; status: "todo"|"in_progress"|"in_review"|"done"; priority: "low"|"medium"|"high"; dueAt: string };
export type Payment  = { id: `PAY-${number}`; direction: "inward"|"outward"; title: string; clientId?: Client["id"]; amount: number; dueAt: string; paidAt?: string; status: "paid"|"scheduled"|"pending_auth"|"overdue" };
export type Contract = { id: `CON-${number}`; clientId: Client["id"]; title: string; value: number; startAt: string; endAt: string; status: "draft"|"active"|"expired" };
export type AdminEvent = CalendarEvent;
export type Activity = ActivityRow;
export type BudgetLine = { id: string; category: "Operations"|"Payroll"|"Infra & SaaS"; allocated: number; committed: number };
export type DemoUser = { name: string; firstName: string; role: string; email: string };
```

### 13.2 Dates
All seed dates are produced by `daysFromToday(n)` / `monthsAgo(n)` in `lib/admin/dates.ts` — **never literals**. Helpers: `greeting(date)` (before 12 → morning, before 17 → afternoon, else evening), `defaultMonthRange()`, `fiscalYearLabel(date)` (Indian FY Apr–Mar → `"26-27"` when Oct 2026), `formatRelative(date)` ("just now", "10m ago", "1h ago", "yesterday", "3d ago"), `formatShortDate`.

### 13.3 Formatters (`lib/admin/format.ts`)

```ts
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatINR = (n: number) => inr.format(n);                 // ₹8,45,000

export function formatINRCompact(n: number, digits = 2): string {       // ₹4.20L · ₹9.2L · ₹2L · ₹1.20Cr
  const a = Math.abs(n), sign = n < 0 ? "−" : "";
  const trim = (v: number) => (digits === 0 ? Math.round(v).toString() : v.toFixed(digits));
  if (a >= 1e7) return `${sign}₹${trim(a / 1e7)}Cr`;
  if (a >= 1e5) return `${sign}₹${trim(a / 1e5)}L`;
  return `${sign}${formatINR(a)}`;
}
export const formatPercent = (v: number, digits = 1) => `${v.toFixed(digits)}%`;
```
(Axis ticks use `digits = 0` → `₹2L`; the chart's `₹0` tick must render `₹0`.)

### 13.4 Seed + consistency tests (must hold; write them as a small dev-only `assertSeed()` that throws in development)

| Quantity | Value | How derived |
|---|---|---|
| Total revenue | ₹8,45,000 | Σ project `billed`: 3,40,000 + 2,10,000 + 1,65,000 + 1,30,000 |
| Shares | 40.2 / 24.8 / 19.5 / 15.4 % | `billed / total`, 1 decimal (they sum within rounding of 100) |
| Total budget | ₹12,00,000 | Σ `BudgetLine.allocated` |
| Committed | ₹8,45,000 → **70.4%** | Σ `committed`; segments Operations 4,20,000 (49.7%), Payroll 2,80,000 (33.1%), Infra & SaaS 1,45,000 (17.2%) → Σ 8,45,000 ✓ |
| Remaining buffer | ₹3,55,000 | cap − committed |
| Outstanding | ₹1,25,000; 3 overdue; 4 clients | Σ unpaid inward payments; ≥ 4 clients have an unpaid item, 3 items overdue |
| Salary payable | ₹2,40,000; 18 staff | Σ employee `netPay` (6×16,000 + 6×13,000 + 6×11,000) |
| Employees | 18 = 16 active + 1 onboarding + 1 on leave | counts by status |
| Active projects | 12 = 8 on track + 2 near + 2 alert | requires **12 projects**; the top 4 carry the revenue figures above, the rest have `billed: 0` or are excluded from revenue |
| Obligations | 4 items, Σ **₹4,50,000** within 14 days | offsets +3, +6, +10, +13 (§10.8) |
| Events | 4 | §10.10 |
| Clients (fictional, demo) | CLI-2001 Apex Global, CLI-2002 Nexa Systems, CLI-2003 Vertex Labs, CLI-2004 *a fourth neutral fictional name (e.g., "Orbit Retail")* + ≥ 2 more for the "4 clients outstanding" and list pages | |
| Project ↔ client | PRJ-3001 Enterprise Cloud Migration → Apex Global; PRJ-3002 Fintech Core Banking UI → Nexa Systems; PRJ-3003 HealthTech Telehealth App → Vertex Labs; PRJ-3004 Retail POS Modernization → CLI-2004 | |

Everything derived goes through `lib/admin/selectors.ts` (`getKpis`, `getRevenueSeries`, `getBudget`, `getRankedProjects`, `getObligations`, `getRecentActivity`, `getUpcomingEvents`). **Containers receive the results as props.** Selectors are pure and unit-testable.

---

## 14. STATES (EVERY CONTAINER)

| State | Rule |
|---|---|
| **Loading** | Skeleton with identical geometry (no layout shift); `aria-busy="true"` on the card. |
| **Empty** | `EmptyState` inside the card body with a concrete message (e.g., "No obligations in the next 14 days."). |
| **Error** | `ErrorState` inside the card with "Retry"; other cards unaffected. |
| **Hover** | Rows `#F8FAFC`; links underline; buttons per DESIGN.md §7 adapted (no lift in admin; color change only). |
| **Focus** | 2px royal-blue ring + 2px offset on every interactive element. |
| **Disabled** | 50% opacity, `cursor-not-allowed`, no tooltip tricks. |
| **Selected** | `--adm-selected-row` bg + 2px royal-blue left edge (tables/lists). |

Simulate loading in the data hook with a short (≤ 400 ms) timeout in dev only; **do not** present this as network latency.

---

## 15. RESPONSIVE BEHAVIOR

| Viewport | Behavior |
|---|---|
| ≥ 1280 | Sidebar 256 (collapsible to 72), full topbar, KPI per container width (§10.3.1), two-column dashboard when `<main>` ≥ 1000 px. |
| 1024–1279 | Sidebar **auto-collapsed to 72** by default (user may expand as an overlay-free push), `CurrencyPill` visible, breadcrumbs visible. |
| 768–1023 | Sidebar becomes a left **Sheet** (width `min(86vw, 300px)`); Topbar: toggle, breadcrumbs hidden, search as icon, bell, user avatar. Dashboard single column; KPI 3 or 2 cols by container width. |
| < 768 | Topbar: toggle + logo-less title? → show page title (14/600) instead of breadcrumbs; actions in `PageHeader` stack (full-width buttons, `Create New` first); KPI 2 cols (1 col < 400); tables → stacked list rows; charts keep full width, height 200; padding 16. |

No horizontal page scroll at any width 320–1920. Wide tables scroll **inside** their card (`overflow-x-auto`, with a subtle right fade only if needed — no gradient: use a 1px inner border instead).

---

## 16. ICON MAP (LUCIDE, STROKE 1.75)

Nav: see §10.1.2. UI: `Search`, `Bell`, `CircleHelp`, `LogOut`, `User`, `Settings`, `PanelLeftClose`, `PanelLeftOpen`, `Menu`, `ChevronRight`, `ChevronDown`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Plus`, `Download`, `Calendar`, `CalendarPlus`, `Clock`, `EllipsisVertical`, `IndianRupee`, `TrendingUp`, `ClipboardClock`/`ClipboardList`, `Landmark`, `Banknote`, `Layers`, `Users`, `Bot`, `FileText`, `Check`, `X`. Import individually. If a name is missing in the installed version, choose the closest and record it.

---

## 17. MOTION

Functional only. `150–250 ms` color/background transitions; `600 ms` progress-bar width on first paint; `300 ms` chart fade; sheet/dialog use Shadcn's default slide/fade (≤ 250 ms). **No** count-up numbers, page-transition animations, bouncing badges, shimmer on data, parallax, or auto-refreshing animations. Everything respects `prefers-reduced-motion` (disable all of the above).

---

## 18. ACCESSIBILITY

- Landmarks: skip link, `<aside>`/`<nav aria-label="Admin">`, `<header>` (topbar), `<main id="admin-main">`, `<footer>`/StatusBar.
- One `<h1>` per page (`PageHeader`); card titles are `<h2>` (or `<h3>` when nested in a section with an `<h2>`).
- Nav: `aria-current="page"` on the active item; collapsed items keep accessible names (tooltips are supplementary).
- Tables: real `<table>`, `<th scope="col">`, `<caption class="sr-only">`; sortable headers are `<button>` with `aria-sort`.
- Charts: `role="img"` + `aria-label` + sr-only data table; color never the only channel (chips have text; the dashed vs solid line differs by pattern).
- Command palette: Shadcn `CommandDialog` (focus trap, ESC, announce results count).
- Sheets/dialogs: labelled title + description, focus return to trigger.
- Live regions: toasts via sonner (`role="status"`); validation errors via `aria-describedby`.
- Keyboard: every interactive element reachable; Kanban has a non-drag alternative; `⌘/Ctrl+K`; `Esc` closes overlays.
- Targets ≥ 40 px (≥ 44 px < lg). Contrast per §7.2 (verify the status-tone pairs with a checker and report any < 4.5:1 and fix by darkening the foreground, not by changing the tone vocabulary).

---

## 19. QA CHECKLIST AND DEFINITION OF DONE

**Commands (run for real; paste real results):** `npx tsc --noEmit`, lint (if configured), `npm run build`, then `npm run preview` and screenshots at **390, 768, 1024, 1280, 1440, 1920**.

**Dashboard fidelity checks (compare to `Image_1.png`):**
- [ ] Sidebar: 6 groups, 12 items, active "Dashboard" tinted blue, user card pinned bottom, sidebar full height at any scroll.
- [ ] Topbar: toggle, breadcrumbs, search with `⌘K`, INR pill, bell badge **3**, help, divider, user (name + role) and sign-out.
- [ ] Header: greeting, "Demo Environment" badge, description, 4 actions.
- [ ] 6 KPI cards with correct labels/icons/values/meta; **no overflow or ellipsis at 1280 and 1536** (§2 #1–4).
- [ ] Revenue Overview: legend, 6M/YTD/1Y, y-axis ₹0–₹10L step ₹2L, 6 months, dashed previous, markers, final dot at the right edge, "Oct/(Current)" blue, footer sentence + link.
- [ ] Budget Utilization: gauge 70.4%, three metric rows with blue/green coloring, 3 allocation tiles with correct amounts/percentages.
- [ ] Revenue by Project: 4 ranked rows, bar widths = share %, tone progression blue → mid-blue → slate → soft.
- [ ] Upcoming Obligations: 4 rows with correct tile tones and badges, footer total ₹4,50,000 (= computed).
- [ ] Recent Activity: 4 rows, correct badge tones; Upcoming Events: 4 boxed items, correct category tones; equal card heights in the second row.
- [ ] StatusBar is honest (demo).
- [ ] Every selector-derived number matches §13.4 (run `assertSeed()`).

**System checks:**
- [ ] All 12 sidebar links + Settings resolve to a built page; no placeholder "coming soon" pages.
- [ ] Every page composes `containers/*`; no page contains bespoke card markup.
- [ ] Every derived container has a "Derived from" comment and passes the Family Test (§9.4).
- [ ] No horizontal overflow 320–1920; mobile Sheet nav opens/closes, closes on selection.
- [ ] Keyboard-only walkthrough; reduced-motion emulation; no console errors; no unused imports; landing page unchanged (diff shows no edits to landing files other than the route table).
- [ ] No forbidden dependency added; added packages listed with justification.

**Definition of done:** the dashboard is visually indistinguishable in structure from the screenshot (minus the fixed defects), every other page feels like the same product, and all numbers are computed from consistent mock data.

---

## 20. FINAL REPORT FORMAT (agent output)

1. What was built (containers count by folder; pages list).
2. Commands run + real results (typecheck, lint, build; "not run" if skipped).
3. Screenshots reviewed (viewport list).
4. Deviations from Admin.md (should be none) and the screenshot defects you fixed (reference §2 numbers).
5. Derived components list with each one's donor.
6. Lucide icon substitutions (if any).
7. TODOs for the owner: real auth hookup, real data source, help-link URLs, symbol-only logo crop for collapsed sidebar, any additional currencies (needs FX source).
8. Dependencies added and why.

---

*End of Admin.md. Rule of thumb: if a component isn't in the screenshot, find its donor, inherit its anatomy, add only what's new, and keep it indistinguishable from the family.*
