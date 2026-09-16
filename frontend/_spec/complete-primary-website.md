# Spec for Complete Primary Website Implementation
branch: claude/feature/complete-primary-website
figma_component: N/A (Using GIP Console v3.dc.html as complete reference)

## Summary
Implement the complete GIP (Grounded Investigation Platform) website as defined in the primary v3.dc.html reference file. This is a full-featured investigation platform with 8 distinct screens (Login + 7 app screens) featuring real-time investigation workflows, data visualization, system integrations, and comprehensive audit trails. The implementation must achieve exact visual and functional parity with the reference design, including all colors, typography, spacing, interactions, animations, and data flows.

## Functional Requirements

### Global Structure
- Responsive container layout (100vh min, scrollable content)
- Consistent header across all app screens (58px height, white background)
- Persistent footer input area for new investigations
- Left padding/border on audit timeline spine pattern
- Real-time UTC clock (updates every second)
- User authentication state management

### Header (All App Screens)
- Logo: "GIP" (Spectral serif, 22px) + "Investigation" (9px uppercase)
- Navigation tabs: 6 clickable tabs with active state styling
  - Investigate, Runs, Memory, Integrations, Settings, Audit
  - Active: light background + accent color text + bold weight
  - Hover: color change + background tint
- Status badge: "payments · prod-eu" with 5px accent dot
- UTC clock: Monospace, updates in real-time, "HH:MM UTC" format
- Administration link: Text + "2FA" badge, requires second factor
- User avatar: 29x29px circle with initials, background color #EDE8F0

### Screen 1: Login
- Full viewport dark background (#33253C)
- Centered white card (max 432px width)
- Logo + tagline section
- SSO button (Okta integration)
- Email/password form with validation
- Divider: "or use email"
- Sign in button
- Service status footer (green dot + operational status)
- Session expiry notice
- All styling from reference lines 28-84

### Screen 2: Investigation (Main Screen)
- Coverage bar (sticky, below header)
  - Domain segments: 5 colored squares (8x8px, 2px radius)
  - Gates: 3 status chips
  - Budget metrics: Right-aligned values + labels
- Three state machine:

#### Idle State
- Large headline: "What would you like investigated?" (Spectral, 28-40px clamp)
- Descriptive subtitle
- Quick-start suggestion buttons (3+ items)
  - Tag badge + question text + metadata
  - Hover: accent border + shadow

#### Started State
- Question card: Question text + metadata (run ID, intent, space, trigger)
- Timeline of investigation events
  - Each event: spine (3px bar) + label badge + text + metadata
  - Expandable detail sections
  - Animations: v3rise (fade + slide up)
- Busy indicator: Pulsing dot + text
  - Animation: v3pulse (opacity + scale)

#### Answer State
- Full answer card with:
  - Verdict badge (colored)
  - Confidence metric
  - Answer text (multi-paragraph, Spectral serif)
  - Claim verdicts section with status badges
  - Evidence gathered grid (210px auto-fit columns)
  - Action buttons: Open dossier, Export evidence, Flag for postmortem
  - New investigation button

### Screen 3: Runs
- Filter controls (Status, Completed, With gaps, etc.)
- Grid layout (auto-fit 300px columns)
- Run cards:
  - Spine (3px colored left border)
  - Run ID + status badge
  - Goal text
  - Coverage meter (62px width, 4px height)
  - Grounding status badge
  - Duration (monospace)

### Screen 4: Memory
- Stats grid: 4 metrics cards (190px min-width auto-fit)
  - Large value (Spectral serif, 30px)
  - Label below
- Episodes list:
  - Summary text
  - Intent badge
  - Citation meter + ratio
  - Status badge
  - Border on left with spine pattern

### Screen 5: Integrations
- MCP Servers section:
  - Server cards in list format
  - Health status (dot + text)
  - Domain label (monospace)
  - Metrics: p95, calls, errors, tools
  - Circuit breaker status
  - Health badge (color-coded)
- Model Routing table:
  - Role, model, failover, state
  - Rows with bottom borders
  - Status badges

### Screen 6: Settings
- "REASON REQUIRED" notice (accent background)
- Setting groups:
  - Group header (dark background)
  - Settings rows with:
    - Key (monospace)
    - Note/description
    - Current value
    - Default value
    - Source badge (color-coded)
- All configuration from reference lines 380-408

### Screen 7: Audit
- Timeline with spine pattern:
  - Timestamp (right-aligned, monospace)
  - Colored dot (outcome-based)
  - Vertical connecting line
  - Action (monospace, bold)
  - Detail text
  - Actor (right-aligned)
  - Outcome badge (color-coded)
- 8 audit entries with various outcomes

### Screen 8: Footer Input Area
- Gradient overlay (top fade)
- Input box with textarea:
  - Placeholder: "Ask why something broke — name a service and a time window"
  - Multiline support (rows=1, expands on content)
  - Submit button (primary color)
- Help text below (11px gray)

## Design Reference
- **File**: D:\Agentic AI Project\primary\GIP Console v3.dc.html
- **Complete HTML Structure**: Lines 1-715 (full design)
- **Login Screen**: Lines 28-84
- **App Container**: Lines 86-434
- **Investigation Screen**: Lines 115-271
- **Runs Screen**: Lines 273-309
- **Memory Screen**: Lines 311-336
- **Integrations Screen**: Lines 338-378
- **Settings Screen**: Lines 380-409
- **Audit Screen**: Lines 411-431
- **JavaScript Logic**: Lines 437-711

## Color Palette
- Accent (Primary): #5A4270
- Deep (Dark): #33253C
- Light Background: #F5F2F4
- White: #FFFFFF
- Off-white: #FBFAFC
- Success/Good: #3F7A52
- Warning: #9A6C14
- Danger/Bad: #A9503C
- Text Primary: #241E29
- Text Secondary: #6B6473
- Text Tertiary: #8B8391
- Borders: rgba(35,29,40, various opacities)

## Typography
- Display (Headings): Spectral, serif, weights 300-400, 16-40px
- Body: Public Sans, sans-serif, weights 400-600, 12-14.5px
- Monospace: IBM Plex Mono, 9-12px, weights 400-500

## Key Styling Details
- Border radius: 8-16px (varies by component)
- Spacing multiples: 3, 6, 9, 11, 13, 16, 18, 20, 22px
- Shadows: Subtle drop shadows on cards and hovers
- Animations:
  - v3pulse: 1.1s ease-in-out infinite (opacity 0.3-1, scale 0.8-1)
  - v3rise: 0.26s ease-out (opacity 0 to 1, translateY 5px to 0)
- Inline styles throughout (no external CSS classes beyond Tailwind base)

## Functional Behavior
- Tab switching without page reload
- Investigation state machine transitions
- Timeline event expansion/collapse
- Real-time clock updates
- Form validation and submission
- Navigation between screens
- Audit log viewing with status filtering
- Settings display with source indicators

## Possible Edge Cases
- No data in any screen (empty states)
- Very long text truncation/wrapping
- Small screen responsiveness (mobile/tablet)
- Investigation with blocked gates/evidence gaps
- Multiple claim verdicts (supported/partial/unsupported)
- Circuit breaker states (open/half-open/closed)
- Setting source variations (DEFAULT, DB, ENV)
- Missing metadata or optional fields in timeline events

## Acceptance Criteria
- [ ] Login screen matches primary v3 exactly (colors, layout, buttons, form)
- [ ] Header displays on all 7 app screens with correct styling
- [ ] Investigation screen Idle state matches reference (headline, description, suggestions)
- [ ] Investigation Started state shows timeline with spine + animations
- [ ] Investigation Answer state displays verdict + claims + evidence grid
- [ ] Runs screen shows run cards with correct layout and status colors
- [ ] Memory screen displays stats grid + episodes list
- [ ] Integrations screen shows MCP servers + routing table
- [ ] Settings screen displays grouped configuration with source badges
- [ ] Audit screen shows timeline with spine pattern and outcome dots
- [ ] All colors match palette exactly (#5A4270, #3F7A52, #A9503C, etc.)
- [ ] All typography matches (Spectral serif, Public Sans body, IBM Plex Mono mono)
- [ ] All spacing/gaps match multiples (3, 6, 9, 11, 13, 16, 18, 20, 22)
- [ ] Animations present: v3pulse (pulsing dot), v3rise (timeline entry fade)
- [ ] Hover states work correctly (color changes, shadows, borders)
- [ ] UTC clock updates every second
- [ ] Tab navigation switches screens without errors
- [ ] Responsive layout works on 375px (mobile), 768px (tablet), 1024px+ (desktop)
- [ ] No console errors, TypeScript strict mode compliance
- [ ] All badges and status indicators display with correct colors
- [ ] Timeline events expandable/collapsible with details
- [ ] Form inputs and buttons functional
- [ ] No console warnings about missing keys or prop types

## Open Questions (Answered)
- Should login use mock authentication? (Yes, use mock flow like current implementation)
- Should investigation timeline stream events or show all at once? (Stream with v3rise animation per reference)
- Should we implement the actual investigation logic or show mock data? (Mock data for now, matching reference script)
- Are the exact hex colors required or can we use theme variables? (Exact hex values as defined in reference)

## Testing Guidelines
### Manual Testing
1. **Login Screen**: 
   - Click SSO button behavior
   - Email/password form validation
   - Sign in functionality
   
2. **Header Navigation**:
   - Click each tab, verify correct screen loads
   - Check active tab styling
   - Verify clock updates every second

3. **Investigation Screen**:
   - Idle state displays on initial load
   - Click suggestion → transitions to Started state
   - Timeline events appear one-by-one with animation
   - Click "Show details" on timeline event → expands
   - Answer appears below timeline
   - Click "New investigation" → back to Idle

4. **Other Screens**:
   - Verify data displays correctly
   - Check grid/table layouts
   - Verify status colors match palette

5. **Visual Comparison**:
   - Screenshot current implementation vs primary v3.dc.html
   - Compare side-by-side: colors, spacing, typography, layout
   - No visual differences should be visible

### Responsive Testing
- Resize to 375px → layout adapts correctly
- Resize to 768px → grid wraps appropriately
- All text readable, no overflow

## Implementation Notes
- Exact structure from reference HTML (not interpretation)
- All inline styles converted to React inline objects
- Colors from palette with exact hex values
- Animations using CSS keyframes
- Mock data structure from reference JavaScript
- State machine for Investigation screen transitions
- No external CSS files (inline only)
