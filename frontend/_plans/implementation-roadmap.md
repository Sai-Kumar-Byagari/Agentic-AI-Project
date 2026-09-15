# Implementation Roadmap - Authentication & Dashboard

**Status:** Phase 1 - Login & Dashboard  
**Branch:** claude/feature/agentic-auth-dashboard  
**Target Completion:** Incremental builds with testing at each stage  

---

## Part 1: Project Structure & Setup

### Folder Organization

```
src/
├── main.jsx                          # Entry point (unchanged)
├── Root.tsx                          # Redux provider wrapper
├── App.tsx                           # Route definitions + ProtectedRoute
├── index.css                         # Global styles + Tailwind imports
│
├── pages/
│   ├── AuthScreen.tsx                # Login page container
│   └── Dashboard.tsx                 # Dashboard page container
│
├── components/
│   ├── common/
│   │   ├── ErrorBoundary.tsx         # Error boundary wrapper
│   │   ├── ProtectedRoute.tsx        # Route guard for authenticated pages
│   │   └── LoadingSpinner.tsx        # Reusable loading state
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx             # Email/password form
│   │   ├── SSOButton.tsx             # Okta SSO button
│   │   └── LoginCard.tsx             # Card wrapper (logo + form + status)
│   │
│   └── dashboard/
│       ├── DashboardHeader.tsx       # Header (logo, nav tabs, user avatar)
│       ├── KPICard.tsx               # Single KPI stat card (reusable)
│       ├── KPIGrid.tsx               # Grid of 4 KPI cards
│       ├── RunOutcomesChart.tsx      # 7-day stacked bar chart
│       ├── EvidenceSourcesList.tsx   # List of connected sources
│       ├── AttentionQueueTable.tsx   # Priority-sorted run table
│       ├── RecentRunsGrid.tsx        # Grid of recent runs
│       ├── NavigationTabs.tsx        # Tab switcher (Investigate, Runs, etc.)
│       └── InvestigateView.tsx       # Main dashboard view (contains all above)
│
├── hooks/
│   ├── useAuth.ts                    # Auth state management
│   ├── useDashboard.ts               # Dashboard data fetching
│   ├── useFormValidation.ts          # Email/password validation
│   └── useLocalStorage.ts            # LocalStorage wrapper (fallback)
│
├── redux/
│   ├── store.ts                      # Redux store configuration
│   └── slices/
│       ├── authSlice.ts              # Auth state (user, token, loading, error)
│       └── dashboardSlice.ts         # Dashboard state (KPIs, runs, etc.)
│
├── services/
│   ├── authService.ts                # Login, SSO, logout API calls
│   ├── dashboardService.ts           # Stats, chart, sources, queue API calls
│   └── logService.ts                 # Error logging service (stub for now)
│
├── api/
│   ├── axiosInstance.ts              # Axios config + interceptors
│   └── endpoints.ts                  # API endpoint constants
│
├── types/
│   ├── auth.types.ts                 # Auth-related types
│   ├── dashboard.types.ts            # Dashboard-related types
│   └── common.types.ts               # Shared types
│
├── constants/
│   ├── colors.ts                     # Primary v3 color palette
│   ├── formOptions.ts                # Validation patterns, error messages
│   └── mockData.ts                   # Mock API responses
│
├── utils/
│   ├── crypto.ts                     # AES-GCM encryption/decryption (stub)
│   ├── cookies.ts                    # Cookie read/write helpers
│   ├── dateUtils.ts                  # Date formatting
│   └── apiError.ts                   # Error normalization
│
└── __tests__/
    ├── hooks/
    │   ├── useAuth.test.ts
    │   ├── useDashboard.test.ts
    │   └── useFormValidation.test.ts
    │
    ├── components/
    │   ├── LoginForm.test.tsx
    │   ├── Dashboard.test.tsx
    │   └── DashboardHeader.test.tsx
    │
    └── services/
        ├── authService.test.ts
        └── dashboardService.test.ts
```

---

## Part 2: Dependencies & Configuration

### Key Dependencies (Already in package.json)
```
React 19.2.5
React DOM 19.2.5
React Router v7.14.2
Redux Toolkit 2.12.0
React Redux 9.3.0
Axios 1.16.1
Tailwind CSS 4.2.4
TypeScript 6.0.3
Vite 8.0.10
Vitest 4.1.10 (testing)
Testing Library React 16.3.2
Lucide React 1.14.0 (icons)
```

### New Dependencies to Install (None required; use built-ins)
- ✅ No additional npm packages needed
- Use Tailwind for styling (already available)
- Use lucide-react for icons (already available)
- Use Vitest for testing (already available)

### Configuration Files (Review/Update)

**vite.config.js**
- Ensure React plugin enabled
- Path alias: `@` → `src/`
- Environment variable loading: `VITE_*`

**tsconfig.json**
- Strict mode: `true`
- Target: `ES2020`
- Module resolution: `bundler`

**eslint.config.js**
- React hooks rules enabled
- No `@ts-ignore` comments allowed

---

## Part 3: Redux Store Architecture

### Auth Slice (src/redux/slices/authSlice.ts)

```typescript
interface AuthState {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'responder' | 'admin' | 'security_reviewer';
    avatar: string;
  } | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  expiresAt: number | null; // Unix timestamp
}

// Actions
- setUser (on successful login)
- clearAuth (on logout)
- setLoading (during auth calls)
- setError (on auth failures)
- refreshToken (token refresh success)
```

### Dashboard Slice (src/redux/slices/dashboardSlice.ts)

```typescript
interface DashboardState {
  kpis: KPICard[];
  runOutcomes: BarChartData[];
  evidenceSources: EvidenceSource[];
  attentionQueue: QueueItem[];
  recentRuns: RunItem[];
  isLoading: boolean;
  error: string | null;
  activeTab: 'investigate' | 'runs' | 'memory' | 'integrations' | 'settings' | 'audit';
  filters: {
    service?: string;
    timeWindow?: string;
    status?: string;
  };
}

// Actions
- setKPIs, setRunOutcomes, setEvidenceSources, etc. (data setters)
- setActiveTab (navigation)
- setFilters (search/filter)
- setLoading, setError
```

### Store Configuration (src/redux/store.ts)

```typescript
- Combine auth and dashboard reducers
- Enable Redux DevTools (dev mode)
- Enable thunk middleware (async actions)
- Persist auth state to localStorage (optional; consider security)
```

---

## Part 4: Custom Hooks

### useAuth (src/hooks/useAuth.ts)

**Responsibilities:**
- Login (email/password)
- SSO login (Okta)
- Logout
- Token refresh on 401
- Session expiration check
- Auto-login from persisted token

**Returns:**
```typescript
{
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null,
  login: (email, password) => Promise<void>,
  ssoLogin: () => void,
  logout: () => Promise<void>,
  refreshToken: () => Promise<void>
}
```

**Implementation Steps:**
1. Dispatch Redux actions (setLoading, setError, setUser)
2. Call authService methods
3. Handle encryption/decryption (if VITE_ENCRYPTION_KEY set)
4. Manage httpOnly cookie (axios handles via interceptor)
5. Return loading/error states + methods

---

### useDashboard (src/hooks/useDashboard.ts)

**Responsibilities:**
- Fetch KPI stats
- Fetch run outcomes chart
- Fetch evidence sources
- Fetch attention queue
- Fetch recent runs
- Apply filters (service, time window, status)
- Handle loading/error states

**Returns:**
```typescript
{
  kpis: KPICard[],
  runOutcomes: BarChartData[],
  evidenceSources: EvidenceSource[],
  attentionQueue: QueueItem[],
  recentRuns: RunItem[],
  isLoading: boolean,
  error: string | null,
  setFilters: (filters) => void,
  refetch: () => Promise<void>
}
```

**Implementation Steps:**
1. On mount, dispatch Redux loading state
2. Call dashboardService to fetch all data
3. For phase 1, return mock data (via mockData.ts)
4. Handle errors gracefully (show fallback UI, not blank)
5. Memoize results to avoid unnecessary re-renders

---

### useFormValidation (src/hooks/useFormValidation.ts)

**Responsibilities:**
- Email validation (regex pattern)
- Password validation (non-empty, min 8 chars)
- Real-time error messages
- Form submission validation

**Returns:**
```typescript
{
  email: string,
  setEmail: (value) => void,
  emailError: string | null,
  password: string,
  setPassword: (value) => void,
  passwordError: string | null,
  isValid: boolean,
  resetForm: () => void
}
```

---

## Part 5: Service Layer

### authService (src/services/authService.ts)

**Methods:**
```typescript
login(email, password): Promise<{ user, sessionToken, expiresIn }>
ssoCallback(code, state): Promise<{ user, sessionToken, expiresIn }>
logout(): Promise<{ status: 'success' }>
refreshToken(): Promise<{ sessionToken, expiresIn }>
forgotPassword(email): Promise<{ status: 'success' }>
```

**Error Handling:**
- Catch axios errors
- Normalize to ApiError format (apiError.ts)
- Return meaningful messages to UI

---

### dashboardService (src/services/dashboardService.ts)

**Methods:**
```typescript
getStats(timeframe = '7d'): Promise<{ kpis: KPICard[] }>
getRunOutcomes(days = 7): Promise<{ bars: BarChartData[] }>
getEvidenceSources(): Promise<{ sources: EvidenceSource[] }>
getAttentionQueue(limit = 10): Promise<{ queue: QueueItem[] }>
getRecentRuns(limit = 8): Promise<{ runs: RunItem[] }>
searchRuns(filters): Promise<{ runs: RunItem[] }>
exportRuns(format = 'csv'): Promise<Blob>
```

**Mock Data Integration:**
- For phase 1, check if VITE_USE_MOCK_DATA is true
- Return hardcoded mock data from mockData.ts
- Log API call info to console for debugging

---

## Part 6: Component Breakdown

### Login Components

**LoginCard (src/components/auth/LoginCard.tsx)**
- Layout: Centered card on dark background
- Children: Logo, headline, LoginForm, status badge
- Styling: max-width 432px, Tailwind classes

**LoginForm (src/components/auth/LoginForm.tsx)**
- Email input with validation
- Password input with show/hide toggle
- Submit button (on click or Enter in password field)
- SSO button above form
- Divider: "or use email"
- Forgot password link
- Error message display

**SSOButton (src/components/auth/SSOButton.tsx)**
- Okta-branded button
- On click: Log intent (for now, mock login)
- Later: Redirect to Okta auth URL

**AuthScreen (src/pages/AuthScreen.tsx)**
- Container page
- Error Boundary wrapper
- Calls useAuth hook
- Redirects to /dashboard on successful login
- Displays loading spinner during submission

---

### Dashboard Components

**DashboardHeader (src/components/dashboard/DashboardHeader.tsx)**
- Sticky top, height 58px
- Left: Logo + "GIP Investigation"
- Center: NavigationTabs
- Right: Service badge, clock, admin link, user avatar
- Fixed styling (no scroll effect)

**NavigationTabs (src/components/dashboard/NavigationTabs.tsx)**
- Horizontal button row
- Tabs: Investigate, Runs, Memory, Integrations, Settings, Audit
- Active tab highlighted
- On click: Dispatch setActiveTab in Redux
- Phase 1: Only Investigate tab functional

**KPICard (src/components/dashboard/KPICard.tsx)**
- Single stat card (reusable)
- Props: label, value, delta, deltaFg, bg, fg
- Displays: Icon/mark box, label, large value, delta indicator
- Responsive: Grows to fit grid

**KPIGrid (src/components/dashboard/KPIGrid.tsx)**
- Grid container (auto-fit, minmax 210px)
- 4 KPI cards as children
- Spacing: 14px gap
- Responsive: Wraps on tablet

**RunOutcomesChart (src/components/dashboard/RunOutcomesChart.tsx)**
- Stacked bar chart (7 days)
- Each day: verified (primary color) + withheld (muted)
- Heights from API: "95px", "25px"
- CSS bar rendering (no chart library)
- Legend below
- Card wrapper with header

**EvidenceSourcesList (src/components/dashboard/EvidenceSourcesList.tsx)**
- List of 6 sources
- Each row: dot (status color), name, status label, last check time
- Dot colors: green (#3F7A52) connected, red (#A9503C) down
- Note below: "A source that is down does not degrade..."

**AttentionQueueTable (src/components/dashboard/AttentionQueueTable.tsx)**
- Table-like layout (grid columns or flexbox)
- Columns: State badge, Question, Who, Age (time)
- Rows sorted by priority (Paused first, then Withheld, then Running)
- Clickable rows (navigate to run detail on click)
- Limited to first 4-5 items visible

**RecentRunsGrid (src/components/dashboard/RecentRunsGrid.tsx)**
- Grid of run cards (auto-fit, minmax 300px)
- Each card: Run ID, outcome badge, question, service, coverage %, duration
- Clickable card (navigate to run dossier)
- Shows 6-8 runs

**InvestigateView (src/components/dashboard/InvestigateView.tsx)**
- Main dashboard layout
- Stacks sections vertically: KPIs → Chart → Sources → Queue → Runs
- Scrollable content area (flex-1, overflow-y)
- Max-width container (1240px centered)

**Dashboard (src/pages/Dashboard.tsx)**
- Main page container
- Error Boundary wrapper
- Calls useDashboard hook
- Renders DashboardHeader + current active tab view (InvestigateView for phase 1)
- Handles loading/error states (spinner or error banner)

---

## Part 7: Step-by-Step Coding Sequence

### Stage 1: Setup & Infrastructure (30 min)

1. **Create folder structure**
   - Create all folders listed in Part 1
   - Create placeholder files (empty .tsx/.ts)

2. **Setup Redux store**
   - authSlice.ts (with initial state, reducers, selectors)
   - dashboardSlice.ts (with initial state, reducers, selectors)
   - store.ts (combine slices, configure store)

3. **Create constants & types**
   - colors.ts (color palette from primary v3)
   - formOptions.ts (validation patterns, error messages)
   - auth.types.ts (User, LoginRequest, LoginResponse, etc.)
   - dashboard.types.ts (KPICard, RunItem, etc.)
   - mockData.ts (mock responses for all endpoints)

4. **Setup API infrastructure**
   - axiosInstance.ts (config, interceptors for auth token refresh)
   - endpoints.ts (API constants)
   - apiError.ts (error normalization)

5. **Commit:** "setup: initialize project structure and Redux store"

---

### Stage 2: Auth Hooks & Services (45 min)

1. **Create useAuth hook**
   - Dispatch Redux actions
   - Call authService methods
   - Handle login/SSO/logout/refresh flows
   - Return auth state + methods

2. **Create useFormValidation hook**
   - Email/password validation logic
   - Real-time error messages
   - Form state management

3. **Create authService**
   - login() method (mock API call, return user + token)
   - ssoCallback() method (mock Okta flow)
   - logout() method (clear token)
   - refreshToken() method (get new token)
   - forgotPassword() method (email sending, backend job)

4. **Test hooks (stub test files)**
   - useAuth.test.ts (3-4 basic test cases)
   - useFormValidation.test.ts (1-2 test cases)

5. **Commit:** "feat: implement auth hooks and services with mock data"

---

### Stage 3: Login UI Components (1 hour)

1. **Create LoginCard component**
   - Dark background (#33253C)
   - White card (max 432px)
   - Tailwind styling only
   - Props for logo, headline, form children

2. **Create LoginForm component**
   - Email input (with validation feedback)
   - Password input with show/hide toggle
   - Submit button
   - Error message display
   - Calls useAuth.login() on submit
   - Calls useFormValidation hook

3. **Create SSOButton component**
   - Okta-branded button
   - On click: Mock login (dispatch setUser in Redux)

4. **Create AuthScreen page**
   - Error Boundary wrapper
   - Uses useAuth hook
   - Redirects to /dashboard on successful auth
   - Loading spinner during auth

5. **Test components**
   - LoginForm.test.tsx (5-6 test cases: validation, submit, SSO click)

6. **Commit:** "feat: build login screen with email/password and SSO flows"

---

### Stage 4: Dashboard Hooks & Services (45 min)

1. **Create useDashboard hook**
   - Fetch stats, chart, sources, queue, runs
   - Return mock data for phase 1
   - Handle loading/error states
   - Memoize to prevent re-renders
   - Provide refetch() method

2. **Create dashboardService**
   - getStats() → return mock KPI data
   - getRunOutcomes() → return mock chart data
   - getEvidenceSources() → return mock source list
   - getAttentionQueue() → return mock queue
   - getRecentRuns() → return mock runs
   - searchRuns() → filter mock data by criteria
   - exportRuns() → return CSV blob (stub for now)

3. **Test hook**
   - useDashboard.test.ts (4-5 basic test cases)

4. **Commit:** "feat: implement dashboard data hooks and mock services"

---

### Stage 5: Dashboard UI Components (1.5 hours)

1. **Create KPICard component (reusable)**
   - Label, value, delta, color props
   - Responsive sizing
   - Tailwind styling

2. **Create KPIGrid component**
   - Grid wrapper (auto-fit)
   - Maps over KPI array, renders KPICard for each

3. **Create RunOutcomesChart component**
   - Stacked bar chart (CSS bars, not charting library)
   - 7 bars (one per day)
   - Verified + Withheld heights from API
   - Legend below

4. **Create EvidenceSourcesList component**
   - List of sources with status dots
   - Styled rows, connection time

5. **Create AttentionQueueTable component**
   - Table-like layout (grid or flex)
   - Sortable by priority
   - Clickable rows

6. **Create RecentRunsGrid component**
   - Grid of run cards
   - Cards show outcome, question, service, coverage, duration

7. **Create DashboardHeader component**
   - Sticky header (58px height)
   - Logo, nav tabs, badges, clock, avatar
   - Calls NavigationTabs child

8. **Create NavigationTabs component**
   - Tab buttons (Investigate, Runs, Memory, etc.)
   - Active state styling
   - Dispatches Redux setActiveTab

9. **Create InvestigateView component**
   - Main dashboard layout
   - Stacks all sections (KPIs → Chart → Sources → Queue → Runs)
   - Scrollable content area
   - Max-width container

10. **Test components**
    - Dashboard.test.tsx (5-6 test cases: render sections, responsive, tab switching)
    - DashboardHeader.test.tsx (2-3 test cases: tabs, avatar)

11. **Commit:** "feat: build dashboard components with mock data and responsive layout"

---

### Stage 6: Routing & App Integration (30 min)

1. **Update App.tsx**
   - Define routes: /login → AuthScreen, /dashboard → Dashboard
   - Create ProtectedRoute wrapper (checks isAuthenticated)
   - Redirect /login to /dashboard if already auth'd
   - Redirect /dashboard to /login if not auth'd

2. **Create Root.tsx (if not exists)**
   - Redux Provider wrapper
   - Error Boundary top-level

3. **Update main.jsx**
   - Mount Root component

4. **Test routing**
   - Basic navigation tests

5. **Commit:** "feat: add routing and protected routes"

---

### Stage 7: Error Handling & Edge Cases (1 hour)

1. **Create ErrorBoundary component**
   - Class component with error state
   - Log errors via logService
   - Render fallback UI (not blank screen)
   - Show error message + retry button

2. **Implement axios interceptors (axiosInstance.ts)**
   - On 401: Call refreshToken()
   - Retry failed request with new token
   - If refresh fails: Logout + redirect to /login

3. **Add fallback UI for errors**
   - Loading skeleton in KPI cards
   - Error banner in dashboard sections
   - Retry buttons on error states

4. **Handle edge cases**
   - Session expiration: Redirect to login
   - Network timeout: Show error + retry option
   - Empty data: Show "No data" message (not spinner forever)
   - Mobile viewport: Touch-friendly buttons (min 44px), no hover-only interactions

5. **Commit:** "feat: add error boundaries and error handling"

---

### Stage 8: Testing & Quality (1 hour)

1. **Complete unit tests**
   - useAuth.test.ts (8-10 test cases)
   - useDashboard.test.ts (6-8 test cases)
   - useFormValidation.test.ts (4-6 test cases)
   - LoginForm.test.tsx (8-10 test cases)
   - Dashboard.test.tsx (6-8 test cases)

2. **Integration tests**
   - Full login → dashboard flow
   - Session persistence across reload
   - Logout clears auth

3. **Accessibility testing**
   - Keyboard navigation (Tab through form, buttons)
   - Form labels semantic
   - Color contrast WCAG AA
   - aria-labels on custom components

4. **Performance checks**
   - No console errors/warnings
   - LCP < 2.5s (Lighthouse)
   - CLS < 0.1 (Lighthouse)
   - Memory leaks in hooks (useEffect cleanup)

5. **Run full test suite**
   - `npm test` - All tests passing
   - Coverage report - 80%+ line coverage

6. **TypeScript strict mode**
   - `npm run lint` - No linting errors
   - No `@ts-ignore` comments

7. **Commit:** "test: add comprehensive unit and integration tests"

---

### Stage 9: Documentation & Handoff (30 min)

1. **Create SETUP.md** (how to run locally)
   - Prerequisites (Node 18+, npm)
   - Install: `npm install`
   - Run dev: `npm run local`
   - Build: `npm run build`
   - Test: `npm test`

2. **Create ARCHITECTURE.md** (codebase overview)
   - Folder structure explanation
   - Redux store layout
   - Hook responsibilities
   - Component hierarchy

3. **Create API_INTEGRATION.md** (switching from mock to live)
   - How to replace mock data with real API calls
   - Where to update service methods
   - How to handle real auth tokens

4. **Update README.md** (if needed)

5. **Commit:** "docs: add setup and architecture documentation"

---

## Part 8: Testing Strategy

### Unit Tests

**Coverage Target:** 80%+ line coverage

**Test Structure:**
```
useAuth.test.ts
├── Login with valid credentials
├── Login with invalid credentials
├── SSO login flow
├── Logout clears session
├── Token refresh on 401
└── Error handling

LoginForm.test.tsx
├── Email validation (valid/invalid)
├── Password visibility toggle
├── Form submission on button click
├── Form submission on Enter key
├── Error message display
└── SSO button click

useDashboard.test.ts
├── Fetch KPI stats
├── Fetch chart data
├── Fetch evidence sources
├── Fetch attention queue
└── Error handling

Dashboard.test.tsx
├── Render all sections (KPIs, chart, sources, queue, runs)
├── Responsive grid layout
├── Navigation tab switching
├── User avatar display
└── Logout functionality
```

### Integration Tests

```
Login → Dashboard Flow
├── User logs in
├── Redirects to /dashboard
├── Dashboard loads data
└── Session persists on reload

Session Expiration
├── Token expires
├── 401 received
├── Token refreshed
└── Request retried with new token

Logout
├── User clicks logout
├── Session cleared
├── Redirected to /login
└── Auth token removed
```

### E2E Tests (Phase 2)

- Full user flow with Cypress/Playwright
- Multi-tab session handling
- Network error simulation

---

## Part 9: Performance Checklist

### Optimization Strategies

**Code Splitting:**
- Lazy load Dashboard components (React.lazy)
- Separate bundles for auth vs dashboard

**Memoization:**
- Memoize KPICard, RunOutcomesChart (expensive renders)
- useCallback on event handlers
- useMemo on derived data

**Caching:**
- Cache dashboard data in Redux
- Invalidate cache on manual refetch
- TTL-based cache expiration (phase 2)

**Lazy Loading:**
- Load dashboard data on-demand (not on login)
- Paginate AttentionQueue (show first 5, load more on click)

**Bundle Size:**
- Tree-shake unused code
- Minify Tailwind classes
- Remove dev-only dependencies from production build

### Lighthouse Targets

- **LCP (Largest Contentful Paint):** < 2.5s
- **CLS (Cumulative Layout Shift):** < 0.1
- **INP (Interaction to Next Paint):** < 200ms
- **Performance Score:** 85+
- **Accessibility Score:** 95+

---

## Part 10: Timeline Estimate

| Stage | Task | Estimated Time | Cumulative |
|-------|------|-----------------|-----------|
| 1 | Setup & Infrastructure | 30 min | 30 min |
| 2 | Auth Hooks & Services | 45 min | 1h 15m |
| 3 | Login UI Components | 1 hour | 2h 15m |
| 4 | Dashboard Hooks & Services | 45 min | 3h 00m |
| 5 | Dashboard UI Components | 1.5 hours | 4h 30m |
| 6 | Routing & App Integration | 30 min | 5h 00m |
| 7 | Error Handling & Edge Cases | 1 hour | 6h 00m |
| 8 | Testing & Quality | 1 hour | 7h 00m |
| 9 | Documentation & Handoff | 30 min | 7h 30m |

**Total Estimated Time:** 7.5 hours (1 full working day)

**Actual Time:** May vary based on:
- Complexity of UI matching (design precision)
- Testing thoroughness
- Debugging unforeseen issues
- Number of edge cases discovered

---

## Part 11: Branch & Commit Strategy

**Branch Name:** `claude/feature/agentic-auth-dashboard`

**Commit Pattern:**
```
setup: initialize project structure and Redux store
feat: implement auth hooks and services with mock data
feat: build login screen with email/password and SSO flows
feat: implement dashboard data hooks and mock services
feat: build dashboard components with mock data and responsive layout
feat: add routing and protected routes
feat: add error boundaries and error handling
test: add comprehensive unit and integration tests
docs: add setup and architecture documentation
```

**PR Checklist Before Merge:**
- [ ] All tests passing (npm test)
- [ ] No linting errors (npm run lint)
- [ ] TypeScript strict mode clean
- [ ] No console errors/warnings
- [ ] Lighthouse score 85+ (performance)
- [ ] Responsive on 375px, 768px, 1440px
- [ ] Accessibility score 95+
- [ ] Design matches primary v3 exactly
- [ ] Code review approved
- [ ] Documentation complete

---

## Part 12: Handoff to Backend Integration

**When Backend APIs Ready:**

1. **Remove mock data**
   - Delete mockData.ts
   - Update service methods to call real API

2. **Update endpoints.ts**
   - Point to actual backend URLs
   - Confirm request/response schemas match spec

3. **Test integration**
   - Login with real backend
   - Fetch real dashboard data
   - Verify encryption/decryption (if enabled)

4. **Remove temporary files**
   - Clean up stub implementations
   - Remove test/demo credentials

5. **Deploy to staging**
   - Full E2E testing with real APIs
   - Load testing
   - Security audit

---

## Success Criteria

✅ **Phase 1 Complete When:**

1. Login screen renders and matches primary v3 exactly
2. Email/password + SSO authentication flows work (with mock data)
3. Dashboard displays all sections (KPIs, chart, sources, queue, runs)
4. Responsive layout tested on 375px, 768px, 1440px
5. All 80+ tests passing with 80%+ coverage
6. No console errors/warnings
7. Error Boundary catches and displays errors gracefully
8. TypeScript strict mode clean
9. Lighthouse score 85+ (performance), 95+ (accessibility)
10. Documentation complete (SETUP.md, ARCHITECTURE.md, API_INTEGRATION.md)
11. Code review approved
12. Merged to main branch

---

**Ready to proceed to Stage 1 (Project Setup)?**

Review this roadmap, ask any clarifying questions, then we'll move to **Part 2: Building Project Structure**.
