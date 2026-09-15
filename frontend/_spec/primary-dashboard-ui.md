# Spec for Primary Dashboard UI Implementation
branch: claude/feature/primary-dashboard-ui
figma_component: N/A (Using primary v3 HTML design reference)

## Summary
Implement the complete dashboard UI to match the finalized primary v3 design. The dashboard is the main post-login interface that displays real-time incident metrics, run outcomes, evidence sources, attention queue, and recent runs. This spec focuses on implementing ONLY the primary design—secondary features will be integrated in future iterations.

## Functional Requirements
- Display sticky header (58px) with logo, title, live UTC clock, and logout button
- Render KPI cards in responsive grid (auto-fit 210px columns) showing key metrics:
  - Total Incidents
  - Avg Response Time
  - Success Rate
  - Active Investigations
- Display 7-day run outcomes as stacked bar chart with daily breakdown
- Show evidence sources list with source name, type, and integration status
- Display attention queue table with sortable columns (ID, Type, Status, Created, Updated)
- Show recent runs grid with run ID, incident type, status, and timestamp
- Implement mock data for all sections (no API calls yet)
- Support responsive layout on mobile, tablet, and desktop viewports
- Maintain primary v3 color theme (#5A4270 primary, #33253C deep, #F5F2F4 light)
- Include loading states and error handling with graceful fallbacks

## Primary v3 Design Reference
- File: D:\Agentic AI Project\GIPConsole_primary\GIP Console v3.dc.html
- Key visual constraints:
  - Dark background (#33253C) with light text for contrast
  - Primary purple accent (#5A4270) for interactive elements
  - White cards with subtle shadows for data sections
  - Public Sans font family for clean, modern appearance
  - Responsive grid layout using CSS Grid and Flexbox
  - Consistent padding/spacing following the primary design

## Possible Edge Cases
- Missing or empty data sections (show "No data available" state)
- Long text truncation in table cells and card titles
- Dashboard load delays (show skeleton loaders)
- Screen size smaller than minimum viewport (425px)
- User session expiration during dashboard interaction
- Chart rendering with zero data points
- Timezone display accuracy (ensure UTC format)

## Acceptance Criteria
- [ ] Header renders with logo, title, UTC clock, and logout button (sticky at 58px)
- [ ] KPI grid displays all 4 cards with mock data in responsive layout
- [ ] 7-day run outcomes chart renders with proper stacked bar visualization
- [ ] Evidence sources list displays with all columns (name, type, status)
- [ ] Attention queue table renders with sortable columns and pagination
- [ ] Recent runs grid displays with proper card layout and timestamps
- [ ] All sections use mock data (VITE_USE_MOCK_DATA=true)
- [ ] Colors match primary v3 theme exactly (#5A4270, #33253C, #F5F2F4)
- [ ] Layout is responsive on mobile (375px), tablet (768px), and desktop (1024px+)
- [ ] Error boundary catches and displays component errors gracefully
- [ ] Logout button navigates to login screen and clears auth state
- [ ] No console errors or TypeScript strict mode violations
- [ ] Performance: Dashboard loads within 3 seconds with mock data

## Open Questions
- Should pagination be implemented for attention queue and recent runs, or show all items?
  - **Answer:** Implement pagination (5-10 items per page) for better UX with large datasets
- Should the UTC clock update in real-time or show static time?
  - **Answer:** Update in real-time every second for authenticity
- Should charts be interactive (click to drill down) or display-only?
  - **Answer:** Display-only for now; interactivity added in secondary phase

## Testing Guidelines
Create test files in the ./tests folder for the following cases:
- Dashboard component renders without crashing with mock data
- Header displays correct UTC time format
- KPI cards display all 4 metrics with proper formatting
- Chart renders with correct data structure
- Evidence sources list populates correctly
- Attention queue table sorts and paginates
- Recent runs grid displays correct timestamps
- Logout button triggers auth clearing and navigation
- Responsive layout adapts to viewport changes (mobile, tablet, desktop)
- Error boundary displays fallback UI when child component errors
