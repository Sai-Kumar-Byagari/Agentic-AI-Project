# Spec for Primary Investigation Dashboard Screen
branch: claude/feature/primary-investigation-dashboard
figma_component: N/A (Using primary v3 HTML design reference)

## Summary
Create an exact visual and functional implementation of the Investigation Dashboard screen from GIP Console v3.dc.html. This is the main post-login interface where users investigate incidents through a multi-state workflow (idle → started → answer). The implementation must match the primary design pixel-perfect, including header layout, coverage bar, state transitions, and timeline display patterns.

## Functional Requirements
- **Header**: 58px white bar with logo, navigation tabs, status badge, UTC clock, admin link, and user avatar
- **Navigation**: 6 tabs (Investigate, Runs, Memory, Integrations, Settings, Audit) with active state styling
- **Coverage Bar**: Display operational status of evidence sources with three sections:
  1. Coverage: Domain segments (5 colored squares) + operational count
  2. Gates: Three status chips (grounding, evals, compliance) showing state
  3. Budget: Three metrics right-aligned (timeout, parallelism, memory)
- **Three Screen States**:
  1. **Idle State**: Prompt text "What would you like investigated?" with quick-start suggestion buttons
  2. **Started State**: Question display + investigation timeline with spine pattern + busy loader
  3. **Answer State**: Complete answer with supporting claims and observations
- **Timeline Display**: Events with spine (3px colored bar), label badges, expandable details
- **Scrollable Content**: Main content area scrolls, header and coverage bar remain sticky
- **Data Integration**: Flow mock data through Redux to all UI sections
- **Real-time Clock**: UTC clock updates every second in header
- **Responsive Layout**: Flex/grid-based, adapts to mobile/tablet/desktop

## Primary v3 Design Reference
- **File**: D:\Agentic AI Project\primary\GIP Console v3.dc.html
- **Screens Section**: Lines 86-271 (isApp and isInvestigate sections)
- **Key Visual Constraints**:
  - Header: 58px height, white background (#FFFFFF), 1px bottom border
  - Content background: #F5F2F4 (light beige)
  - Cards: #FFFFFF with 1px border rgba(35,29,40,.10)
  - Coverage bar: #FBFAFC background, 11px 22px padding
  - Typography: Spectral serif headings, Public Sans body, IBM Plex Mono technical
  - Colors: Primary #5A4270, Success #3F7A52, Danger #A9503C
  - All styling via inline objects (no external CSS)

## Exact Layout Structure
```
Container (100vh, flex-column)
├─ Header (58px fixed)
│  ├─ Logo (GIP + Investigation)
│  ├─ Nav Tabs (6 tabs, active state)
│  ├─ Status Badge (payments · prod-eu)
│  ├─ UTC Clock (monospace)
│  ├─ Admin Link (2FA)
│  └─ User Avatar + Logout
├─ Coverage Bar (flex:none, sticky)
│  ├─ Coverage Section (domains + count)
│  ├─ Gates Section (3 chips)
│  ├─ Spacer (flex:1)
│  └─ Budget Section (3 metrics)
└─ Main Content (flex:1, overflow-y:auto)
   ├─ Idle State Container
   │  ├─ Headline + Description
   │  └─ Quick-Start Suggestions (3-4 buttons)
   ├─ Started State Container
   │  ├─ Question Card
   │  ├─ Timeline Events (4-5 items)
   │  ├─ Busy Indicator (pulse animation)
   │  └─ Answer Section (appears after timeline)
   └─ Answer State Container
      ├─ Answer Text
      ├─ Verdict Badge
      └─ Claims List (3+ claims)
```

## Coverage Bar Details
**Section 1 - Coverage:**
- Label: "Coverage" (uppercase, 10px, gray)
- Domain segments: 5 colored squares (8x8px, 2px border-radius)
  - First 4 domains: #3F7A52 (success/green)
  - Last domain: #A9503C (danger/red)
- Coverage label: "4 of 5 sources" (IBM Plex Mono, 11px, dark gray)

**Section 2 - Gates:**
- Three chips: "grounding · active", "evals · pass", "compliance · pass"
- Styling: rgba(63,122,82,.12) background, #3F7A52 text, 3-8px padding, 4px border-radius
- Wrap on small screens

**Section 3 - Budget:**
- Three metrics right-aligned:
  1. "50m" + "TIMEOUT" label
  2. "12" + "PARALLELISM" label
  3. "2.1GB" + "MEMORY" label
- Values: IBM Plex Mono, 12px, dark (#33253C)
- Labels: 10px uppercase gray, 6px gap from value
- Total gap: 16px between metrics

## Investigation Workflow States

### Idle State
**Trigger**: Initial page load (investigation.idle = true)

**Display**:
- Coverage bar visible and sticky
- Centered content area with max-width 800px
- Large headline: "What would you like investigated?" (Spectral serif, 28-40px clamp)
- Descriptive subtitle (14.5px, gray text, max-width 560px)
- Label above suggestions: "Start from a recent question" (10px uppercase, gray)
- Quick-start suggestion buttons (minimum 3):
  - Button structure:
    - Tag badge (10px monospace, light bg, accent color, 3-7px padding)
    - Question text (flex:1, 13.5px, left-aligned)
    - Metadata (10.5px monospace, gray, right-aligned)
  - Hover state: border accent color, subtle shadow
  - Click action: Transition to Started state with selected question

### Started State
**Trigger**: User clicks suggestion or enters question (investigation.started = true, investigation.idle = false)

**Display**:
- Question card at top:
  - Question text (Spectral serif, 21px, bold)
  - Metadata row: run ID, intent, space, trigger (monospace, 10.5px gray)
  - Background: white, 1px border, 14px border-radius, 18px 20px padding

- Timeline events (4+ events):
  - Each event uses TimelineItem component
  - Spine: 3px colored bar (primary color by default)
  - Label: Badge with 10px monospace uppercase text, accent background
  - Content: Question text (13.5px, flex-growing), metadata right (10px monospace)
  - Detail: Expandable section (show/hide toggle), gray background, border-left accent
  - Spacing: 9px between events, card-like styling (border, radius)

- Busy indicator (while busy = true):
  - Pulsing dot animation + text "Gathering evidence..."
  - Pulsing dot: 7px circle, accent color, 1.1s ease-in-out animation
  - Text: 12.5px gray, next to dot

- Answer section (after busy = false):
  - Appears below timeline
  - Shows verdict badge (small, monospace, uppercase, color-coded)
  - Main answer text (13.5px, line-height 1.7)
  - Claims section:
    - Label: "Supporting Claims" (11px uppercase bold)
    - Each claim: checkmark + text in subtle gray box
    - Multiple claims listed

### Answer State
**Trigger**: Timeline loads and answer data populated (investigation.answer != null)

**Display**: (same as Started State after busy finishes)
- Full answer section visible with all claims and observations
- Can still see question card above timeline
- Timeline events remain visible (user can scroll to see all)

## Edge Cases
- No mock data: Show empty states with helpful text
- Long question text: Wrap and maintain readability
- Many timeline events (8+): Vertical scroll within content area
- Small screen: Stack layout, maintain 16px minimum gutter
- Missing detail sections: Still show spine and main event text
- Admin link accessibility: Link visible but non-functional in current phase
- Multiple investigations: Each has isolated state in Redux

## Acceptance Criteria
- [ ] Header displays all 6 elements: logo, tabs, status, clock, admin, avatar
- [ ] Header height exactly 58px, white background, bottom border visible
- [ ] Coverage bar shows all 3 sections with correct styling and spacing
- [ ] Domain segments are colored squares (not circles), not circles
- [ ] Gates chips display with light green background and darker green text
- [ ] Budget metrics right-aligned with proper spacing
- [ ] Idle state shows headline, description, and 3+ suggestion buttons
- [ ] Clicking suggestion transitions to Started state with that question
- [ ] Timeline events render with spine, label badge, content, and metadata
- [ ] Timeline events have expandable detail sections
- [ ] Busy indicator shows pulsing animation during investigation
- [ ] Answer section displays after timeline with verdict, text, and claims
- [ ] UTC clock updates every second in real-time
- [ ] Logout button navigates to login and clears auth state
- [ ] All colors match primary v3 palette exactly
- [ ] All fonts match primary v3 (Spectral, Public Sans, IBM Plex Mono)
- [ ] Spacing/gaps match primary v3 (6, 9, 11, 13, 16, 20, 22px multiples)
- [ ] No console errors, TypeScript strict mode compliance
- [ ] Responsive: Works on 375px (mobile), 768px (tablet), 1024px+ (desktop)
- [ ] Component visual comparison: Side-by-side with primary v3 HTML shows exact match

## Open Questions
- Should timeline events be sortable/filterable? (Answer: No, display all in order for now)
- Should users be able to re-run investigations? (Answer: No, single run per question in this phase)
- Should answer section have any interactive elements? (Answer: No, display-only in this phase)
- Should we support different question types/categories? (Answer: No, use generic investigation for all)

## Testing Guidelines
### Manual Testing
1. **Header Navigation**: Click each tab, verify screen switches without errors
2. **Idle State**: Verify headline, description, and 3+ suggestions visible
3. **State Transitions**: 
   - Click suggestion → Idle → Started
   - Verify question displays in card
   - Verify timeline events appear one-by-one
   - Verify busy indicator shows and animates
4. **Timeline Events**:
   - Verify each event has spine, label, text, meta
   - Click "Show details" → detail section expands
   - Click again → detail section collapses
5. **Answer Display**:
   - After timeline loads, answer appears below
   - Verify verdict badge displayed
   - Verify all claims listed with checkmarks
6. **Clock**: UTC clock in header updates every second
7. **Logout**: Click logout → redirects to login, auth state clears
8. **Responsive**: 
   - Resize to 375px width → layout stacks properly
   - Resize to 768px → grid wraps appropriately
   - All text readable, no overflow

### Visual Verification
- Create screenshot comparison: current screen vs. primary v3 HTML
- Check: header height, colors, fonts, spacing, alignment
- Check: coverage bar segments (squares, not circles), spacing
- Check: timeline spine color, label styling, detail sections
- Check: answer section layout and claim styling

### Automated Tests (Optional)
- Mock Redux state → verify investigation state changes
- Simulate click suggestion → verify startInvestigation action dispatched
- Verify Redux selectors return correct state values
- Timeline events render with expected structure

## Technical Notes
- Investigation screen is SwiftUI-like declarative component
- Redux manages state transitions: idle → started → busy → answer
- Mock data pre-populated in Redux for development
- Timeline events use TimelineItem reusable component
- All styling inline (no external CSS files)
- Fonts imported via Google Fonts in index.html
- Colors stored in constants/colors.ts for consistency
- No external UI libraries (no Material-UI, shadcn, etc)

## Deliverables
1. InvestigationScreen.tsx - Main component with all three states
2. TimelineItem.tsx - Reusable component for event display
3. Mock data in constants/mockData.ts
4. Redux state in appSlice.ts
5. Integration in AppLayout.tsx
6. Visual comparison document (screenshot pairs)
