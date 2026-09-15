# Spec for Agentic AI Platform - Authentication & Dashboard

**branch:** claude/feature/agentic-auth-dashboard

## Summary

Building the authentication and dashboard modules for the Agentic AI Platform - an on-call automation system where AI models automatically investigate incidents triggered in Slack, connect to Grafana and other observability tools, and return findings. Phase 1 focuses on the core login interface and main dashboard screen, with exact UI fidelity to the finalized primary design (GIP Console v3.dc.html) combined with functional enhancements from the secondary design (dashboard metrics, explorer, schedules).

**Key principle:** Every interaction surfaces evidence and confidence levels. The responder learns in under 3 seconds whether an answer was verified against evidence, withheld for named gaps, or still being gathered.

## Functional Requirements

### Authentication (Login Screen)

- **SSO Integration (Okta)**
  - Primary authentication via Okta SSO with branded button
  - Fallback email/password login method
  - "Forgot password" link (recovery flow implemented by backend)
  - Session management via httpOnly cookies (never localStorage)
  - Logout capability with session clearing

- **UI Components**
  - Logo section with "GIP · Grounded Investigation Platform" branding
  - Headline: "Evidence first, then the answer."
  - Subheading: "Sign in with your corporate identity to reach the spaces your team owns."
  - Two-method card: SSO button + email/password form
  - Divider with "or use email" text
  - Service status indicator (green dot + "All services operational")
  - Environment badge (e.g., "prod-eu · egress blocked")
  - Disclaimer: "Sessions expire after 8 hours. Every action you take is written to the audit record."

- **Form Validation**
  - Email field: Real-time validation against email pattern
  - Password field: Show/hide toggle for security
  - Form submit on button click or Enter key in password field
  - Error states: Display error messages above form without clearing form data
  - Loading state: Disable form, show spinner during submission

- **Security Requirements**
  - Encrypt request payloads (AES-GCM when VITE_ENCRYPTION_KEY is set)
  - Encrypt response payloads similarly
  - Store auth tokens in httpOnly, Secure, SameSite cookies only
  - Never expose tokens in URL parameters or localStorage
  - Implement CSRF protection via origin validation
  - Clear all auth tokens on logout

### Dashboard (Main Screen)

- **Header**
  - Logo + "GIP Investigation" branding (left)
  - Navigation menu with active state indicator
  - Service/environment badge (e.g., "payments · prod-eu")
  - UTC clock display
  - "Administration" link with 2FA badge (optional)
  - User avatar with initials (top-right)

- **Navigation Tabs**
  - Investigate (default): Live investigation chat interface
  - Runs: Historical run dossiers explorer
  - Memory: Platform learning and data retention
  - Integrations: MCP server health and connectivity status
  - Settings: Platform configuration
  - Audit: Change history and access logs

- **Dashboard Metrics Section** (Investigate view, default)
  - **KPI Cards** (responsive grid 4 cols on desktop, wrap on tablet)
    - Total runs this week
    - Verified answers (percentage or count)
    - Average time to answer
    - Evidence sources connected
    - Each card shows value + label + optional delta indicator

  - **Run Outcomes Chart** (Last 7 days)
    - Stacked bar chart showing daily breakdown
    - Verified answers (primary color)
    - Withheld answers (muted color)
    - Legend below chart with color indicators
    - Period selector or date range picker

  - **Evidence Sources** 
    - List of connected observability sources (Prometheus, Loki, Tempo, etc.)
    - Status indicator per source (green = connected, red = down)
    - Connection timestamp or last check time
    - Note: "A source that is down does not degrade an answer quietly"

  - **Attention Queue**
    - Ordered by "what blocks a person, not by time"
    - Table columns: Status badge | Question | Who (owner) | Age
    - Clickable rows to navigate to run details
    - Shows active/pending/paused runs requiring user input

  - **Recent/Active Runs** 
    - Grid or table of recent investigation runs
    - Fields: Run ID | Status | Question | Service | Coverage % | Duration
    - Status badges: Verified | Withheld | Running | Paused
    - Click to open run dossier

- **Color Theme & Typography** (Matching Primary v3)
  - Primary color: #5A4270 (purple)
  - Deep/dark: #33253C (dark purple)
  - Light background: #F5F2F4 (off-white)
  - Text primary: #241E29 (dark)
  - Text secondary: #6B6473 (gray)
  - Success: #3F7A52 (green)
  - Fonts: Public Sans (primary), Spectral (headings), IBM Plex Mono (technical)

## Figma Design Reference

- File: GIP Console v3.dc.html (primary finalized version)
- Component name: Login screen + Dashboard/Investigate view
- Key visual constraints:
  - Login page: Centered card on dark background, max-width 432px
  - Dashboard: Full viewport, sticky header 58px, scrollable content area
  - Spacing: 11px, 20px, 30px increments
  - Border radius: 10px - 16px (elements), 999px (pills/buttons)
  - Shadows: Subtle elevation shadows, no harsh outlines
  - Responsive: Desktop-first (1440px), tablet support (768px), mobile constraints TBD

## Possible Edge Cases

- **Session Expiration**: User session expires after 8 hours; handle 401 responses with redirect to login
- **Network Failures**: Encrypt/decrypt failures should log error and show fallback UI (not blank screen)
- **Missing Environment Variables**: If encryption key missing, run in plaintext mode (dev mode flag)
- **Slow API Responses**: Show loading states for auth calls; timeout after 30s with user-friendly error
- **Browser Storage Unavailable**: Gracefully handle localStorage failures (private window, etc.)
- **Multiple Tabs**: Handle auth token refresh race conditions; use session-scoped keys for pending operations
- **CORS/CSRF Violations**: Validate origin, show clear security error (not generic error)
- **Icon/Font Loading Failures**: Fallback to system fonts and placeholder icons
- **Modal Focus Management**: When modals/popovers appear, trap focus within them; escape key closes
- **High Contrast/Dark Mode**: Ensure compliance with WCAG AA; support system prefers-color-scheme
- **Mobile Viewport**: Touch-friendly hit targets (min 44px), no hover-only interactions

## Acceptance Criteria

### Authentication
- [ ] User can sign in via Okta SSO button (mock redirect for now)
- [ ] User can sign in via email/password with mock credentials (demo@bank.example / password123)
- [ ] Form validation shows real-time errors for invalid email pattern
- [ ] Password field has show/hide toggle; input type switches between text/password
- [ ] Successful login clears form, redirects to dashboard, sets httpOnly auth cookie
- [ ] Failed login shows error message (e.g., "Invalid credentials") without clearing form
- [ ] "Forgot password" link is present and clickable (links to /reset, backend handles flow)
- [ ] Session status and environment badges render correctly
- [ ] All text and colors match primary v3 design exactly

### Dashboard
- [ ] Page loads and displays sticky header with navigation and user avatar
- [ ] Navigation tabs are clickable; active tab highlighted (only Investigate implemented initially)
- [ ] Investigate view shows 4 KPI cards with mock data values
- [ ] KPI cards display value + label + optional delta with color coding
- [ ] Run Outcomes chart renders stacked bar chart for last 7 days with legend
- [ ] Evidence Sources section lists 4-6 mock sources with status indicators
- [ ] Attention Queue displays 3-5 mock run items in table format, sorted by priority
- [ ] Recent Runs section shows grid/table of 6-8 mock runs with clickable rows
- [ ] Layout is responsive: grid adjusts cols on tablet, single column on mobile
- [ ] All colors, fonts, spacing match primary v3 design exactly
- [ ] No horizontal scrolling on any viewport width >= 375px
- [ ] Scrollbar styling consistent (custom webkit scrollbar)
- [ ] Logout button clears auth cookie and redirects to login

### Technical Requirements
- [ ] Built with React 19.2.5 + TypeScript (strict mode)
- [ ] Uses Redux Toolkit for auth state management (login, logout, session)
- [ ] Uses custom hooks for business logic (useAuth, useDashboard)
- [ ] All API calls use axios with interceptors for auth token refresh
- [ ] Encryption/decryption middleware applied to payloads when VITE_ENCRYPTION_KEY set
- [ ] Error Boundary wraps entire app; logs errors to backend via logService
- [ ] Form inputs use controlled components; validation via regex patterns
- [ ] No prop drilling; use Redux for cross-component state
- [ ] Images/icons use lucide-react or SVG inlined (no external CDN images)
- [ ] CSS via Tailwind (inline class names, no custom CSS files for now)
- [ ] Testing: Unit tests for useAuth hook, form validation, Redux slices
- [ ] Types: All props, state, API responses have TypeScript interfaces
- [ ] Accessibility: Semantic HTML, ARIA labels where needed, keyboard navigation

## Open Questions

1. **Backend API Ready?** Confirm login and dashboard endpoints exist (for mock data, we'll use hardcoded data in React for now)
2. **Okta Configuration?** Need Okta tenant URL, client ID, redirect URI for SSO setup
3. **Analytics?** Should login/dashboard interactions be tracked? If yes, what events?
4. **Feature Flags?** Any gradual rollout or A/B testing on login or dashboard layouts?
5. **Notifications?** Real-time updates to KPI metrics or Attention Queue? (WebSocket or polling?)
6. **Search/Filter?** Dashboard search to filter runs by service, time window, status?
7. **Export Functionality?** Can users export run data or audit logs from dashboard?
8. **Role-Based Access?** Different dashboards for Responder vs Admin vs Security Reviewer roles?

## Testing Guidelines

Create test files in the ./src/__tests__ folder for:

1. **useAuth Hook** (src/__tests__/hooks/useAuth.test.ts)
   - Test successful login with mock credentials
   - Test SSO redirect flow
   - Test failed login error handling
   - Test logout and session clearing
   - Test token refresh on 401
   - Test encryption/decryption of payloads

2. **LoginForm Component** (src/__tests__/components/LoginForm.test.tsx)
   - Test email validation (valid/invalid patterns)
   - Test password visibility toggle
   - Test form submission on button click and Enter key
   - Test error message display on failed login
   - Test SSO button click

3. **useDashboard Hook** (src/__tests__/hooks/useDashboard.test.ts)
   - Test fetching KPI data
   - Test fetching run outcomes chart data
   - Test fetching evidence sources
   - Test fetching attention queue
   - Test error handling and fallback UI

4. **Dashboard Component** (src/__tests__/components/Dashboard.test.tsx)
   - Test layout renders all sections (header, KPIs, chart, sources, queue)
   - Test responsive grid layout on different viewport sizes
   - Test navigation tab switching (only Investigate implemented)
   - Test user avatar with initials
   - Test logout functionality

5. **Integration Tests**
   - Test full login -> dashboard flow
   - Test session persistence across page reload
   - Test logout clears session

**Coverage Target:** Minimum 80% line coverage for auth and dashboard modules

## API Contract Documentation

See separate file: `_api_contracts/auth-dashboard-api.md` for request/response schemas, status codes, error handling, and mock data structure.

**Note:** API contracts are temporary and will be shared with backend team. Once backend implements these contracts, replace mock data with actual API calls via service layer.

## Implementation Notes

- **Incremental Build:** Start with Login screen (auth flow), then Dashboard (UI structure + mock data). Do not build all tabs (Runs, Memory, Integrations, Settings, Audit) in phase 1.
- **Mock Data:** Use hardcoded mock data in React state for dashboard metrics until backend APIs ready.
- **Styling:** Use Tailwind CSS with inline class names. Do not create separate CSS files yet.
- **Navigation:** Use React Router v7 for routes: `/login`, `/dashboard` (default)
- **State Management:** Redux Toolkit for auth (login, logout, user info), component state for UI (active tab, form inputs)
- **Error Logging:** Implement logService to capture and send errors to backend API endpoint

## Success Criteria for Phase 1

- [ ] Login screen renders with exact UI match to primary v3
- [ ] Authentication flow (SSO + email/password) functional with mock data
- [ ] Dashboard displays with all sections (header, KPIs, chart, sources, queue)
- [ ] Responsive layout works on 375px (mobile), 768px (tablet), 1440px (desktop)
- [ ] No console errors or warnings; Error Boundary catches and logs issues
- [ ] Tests pass with 80%+ coverage
- [ ] TypeScript strict mode enabled, no @ts-ignore comments
- [ ] Accessibility: Tab navigation works, form labels semantic, color contrast WCAG AA
- [ ] Performance: LCP < 2.5s, CLS < 0.1, INP < 200ms (Lighthouse targets)
