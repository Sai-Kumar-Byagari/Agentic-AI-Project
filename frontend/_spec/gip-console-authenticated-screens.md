# Spec for gip-console-authenticated-screens
branch: claude/feature/gip-console-authenticated-screens
figma_component (if used): GIP Console v3.dc.html (static reference, not Figma)

## Summary
Complete the remaining authenticated screens of the GIP (Grounded Investigation Platform) React application by reproducing the exact UI/UX defined in the reference file `primary/GIP Console v3.dc.html`. The reference is the single source of truth for all layout, typography, colour, spacing, borders, cards, meters, badges and interaction behaviour. This is a faithful reproduction, not a redesign.

After login (which already exists and must NOT be changed), the app presents a shared authenticated shell with a horizontal top navigation and six screens: Investigate, Runs, Memory, Integrations, Settings, and Audit. The centrepiece is the Investigate screen, which drives a progressive, state-machine-based agent investigation flow: intent → plan → reasoning → tool calls → evidence → coverage/gates → blocked/re-plan iterations → grounding validation → streamed, verified final answer with claim verdicts and evidence citations.

All screen content is backed by structured mock data exposed through service functions/interfaces so that the mock layer can later be swapped for real APIs (Slack, Grafana/Prometheus, Loki, Tempo, ArgoCD, GitHub, MCP servers, model providers, memory store) without touching UI components.

## Functional Requirements

### Shared authenticated shell (locked visual spec)
- Horizontal top header, 58px tall, white background, bottom border `rgba(35,29,40,.10)`. Do NOT convert to a sidebar.
- Left: `GIP` wordmark (Spectral) + `Investigation` label (uppercase, letter-spaced).
- Center-left nav: Investigate, Runs, Memory, Integrations, Settings, Audit. Active item uses accent purple text `#5A4270` on `rgba(90,66,112,.10)` background, weight 600; inactive items are muted grey weight 400.
- Right cluster: environment indicator (`payments · prod-eu` with accent dot), UTC clock (IBM Plex Mono), Administration link with `2FA` marker (links to admin, requires second factor), and user avatar chip (`RK`).
- Navigation switches screens client-side without a page reload.

### Screen 1 — Investigate
- Idle state: "What would you like investigated?" heading (Spectral, light), supporting description, "Start from a recent question" section with suggestion cards (tag chip, question text, asked-time meta), and a bottom composer.
- Composer: textarea supporting typing, Enter to submit, Shift+Enter for newline, and an Investigate button; helper text about answers staying withheld while evidence is uncovered.
- Sub-header strip shows live Coverage (5 domain segments + `X / 5 domains`), three gate chips (Coverage, Structural, Claim judge), and a budget cluster (iterations, elapsed, tools, tokens) that update as the run progresses.
- Progressive investigation timeline that reveals events one at a time (planning, reasoning, tool call, tool result, blocked, re-plan iterations, gate pass/reject, final gate accept) with per-row coloured spines and typed labels (ITERATION, REASONING, TOOL, METRICS/LOGS/TRACES/DEPLOYS/CODE, BLOCKED, GATE).
- Evidence domains tracked: metrics, logs, traces, deploys, code. Coverage segments turn success-green as each domain is discovered.
- Gates: Coverage (OPEN → PASS at 5/5), Structural (OPEN → PASS), Claim judge (OPEN → REJECT → PASS). Answer stays withheld while required domains remain uncovered; the flow must show a BLOCKED state and a claim REJECT followed by targeted re-planning before acceptance.
- Final answer card (visually separated from timeline): Verified badge, confidence value, `N claims · N observations · N iterations`, streamed answer paragraphs (Spectral), claim verdicts (SUPPORTED / PARTIAL) with citations, evidence grid (evidence ID, source/tool, summary), and action buttons: Open dossier (→ Runs), Export evidence trail, Flag for post-mortem, New investigation (resets state).
- Clicking a suggestion card starts that investigation immediately.

### Screen 2 — Runs
- Filter chips: All, Completed, With gaps, Grounding rejected, Active; active filter styled with accent border/background. Keyset/page info (`keyset · 50 / page`).
- Investigation cards (grid, NOT a data table), each with coloured status spine, run ID (mono), status badge (COMPLETED / WITH GAPS / FAILED / RUNNING / CANCELLED), goal text, coverage meter + ratio, grounding badge (ACCEPTED / REJECTED / PENDING / SKIPPED), and duration.
- Filters update the displayed run collection.

### Screen 3 — Memory
- Top stat cards: episodes stored, cited when recalled, playbooks active, awaiting promotion (large Spectral numeral + label).
- `Episodes` list; each row: summary, intent chip (ROOT_CAUSE / IMPACT / CHANGE), relevance meter + citation ratio, status badge (PINNED / ACTIVE / REVIEW). Keep as investigation episodes, not a generic vector-DB UI.

### Screen 4 — Integrations
- `MCP servers` section: rows with health dot, name, domain, metric columns (p95, calls 24h, errors, tools), breaker state, and health badge (HEALTHY / DEGRADED / UNHEALTHY).
- `Model routing` section: compact rows with role, model (mono), failover target, and state badge (PRIMARY). Keep the two sections visually separate.

### Screen 5 — Settings
- `REASON REQUIRED` banner explaining every change writes an audit entry (actor, before, after, reason).
- Setting groups: Agent loop (agent.max_iterations, context.token_budget, limits.concurrent_runs), Reliability (reliability.grounding_enabled, reliability.max_retries, tools.default_timeout_ms), Memory & security (memory.min_confidence, security.allow_public_egress).
- Each row: setting key (mono), description note, current value, default value, and source badge (DEFAULT / DB / ENV). Prepare state/action architecture for editing without inventing backend behaviour.

### Screen 6 — Audit
- Chronological timeline (NOT a table): each event has timestamp, timeline dot (colour by outcome), action (mono), detail, actor, and outcome badge (OK / DENIED).
- Action types include settings.update, grounding.rejected, mcp.breaker.reset, provider.activate, coverage.blocked, apikey.create, auth.login.failed, memory.episode.retire.

### Data & architecture
- All reference data reproduced as structured, typed mock data in a data/constants layer, accessed via service functions so APIs can replace it later. No scattered hardcoded strings in JSX.
- Reusable components for repeated patterns (badges/tones, meters, timeline rows, cards). Investigation flow implemented as a proper React state-driven machine with progressive reveal and streamed answer.

## Figma Design Reference (only if referenced)
- File: `primary/GIP Console v3.dc.html` (static HTML/JS reference console, treated as the design spec)
- Component name: GIP Console v3 (authenticated app shell + six screens)
- Key visual constraints:
  - Fonts: Public Sans (UI), Spectral (display/answer prose), IBM Plex Mono (IDs, metrics, keys, timestamps). Do not substitute.
  - Palette: accent `#5A4270`, deep `#33253C`, success `#3F7A52`, warn `#9A6C14`, error `#A9503C`, page bg `#F5F2F4`, card bg `#FFFFFF`, panel bg `#FBFAFC`, muted text `#6B6473`/`#8B8391`, primary text `#241E29`.
  - Borders subtle (`rgba(35,29,40,.07–.13)`); compact rounded cards (radius ~8–16px); shadows only where present in the reference.
  - Operational-console density — compact, not spacious; not a marketing landing page. No gradients, animations, or icons beyond what the reference shows (only the timeline pulse `v3pulse` and row rise `v3rise`).

## Possible Edge Cases
- Rapid resubmission / clicking a new investigation while one is mid-stream must cancel timers and reset cleanly (no leaked intervals/timeouts, no overlapping streams).
- Empty or whitespace-only composer input must not start a run.
- Shift+Enter inserts a newline and must not submit; Enter alone submits.
- Scroll pinning: timeline auto-scrolls to bottom only while the user is near the bottom; scrolling up must not yank them back down.
- New investigation must fully reset coverage, gates, iteration/tool/token counters, elapsed timer, timeline, and answer.
- Filters on Runs with no matching results should render an empty state gracefully.
- Elapsed timer must stop/clear on unmount and on reset (no memory leaks, no console errors).
- Responsive widths (1440, 1366, 1280, 1024) must not cause horizontal page overflow; nav, cards, composer, settings rows, and audit timeline must remain usable via wrapping/scrolling in the reference's spirit.
- Long question text and long answer paragraphs must wrap without breaking layout.

## Acceptance Criteria
- Existing login UI and functionality are unchanged.
- Authenticated shell header/nav matches the reference exactly (height, positioning, typography, colours, borders, active-state styling); nav switches screens without reload.
- All six screens exist and visually reproduce the reference (dimensions, cards, meters, badges, timeline, spacing).
- Investigate flow works end to end: submit question → progressive timeline reveal → coverage segments fill → gates update → BLOCKED then claim REJECT then targeted re-plan → final gate PASS → streamed verified answer with claim verdicts and evidence, then reset via New investigation.
- Answer is displayed only after the flow reaches completion; withheld while required domains are uncovered.
- Runs filters update the collection; Open dossier navigates to Runs context.
- Memory, Integrations, Settings, and Audit render their reference data and states.
- Fonts (Public Sans, Spectral, IBM Plex Mono) and the reference palette are used; no redesign, no gradients/animations/icons beyond the reference.
- Mock data is structured and typed behind service functions, ready to swap for APIs.
- Responsive behaviour verified at 1440×900, 1366×768, 1280×800, 1024×768 with no horizontal overflow.
- `npm run build` passes, `npm run lint` passes, `npm run type-check` passes, and the browser console is clean (no errors, key warnings, or failed imports introduced by these changes).

## Open Questions
- Should Export evidence trail / Flag for post-mortem perform any real action now, or remain UI-only state handlers until backend exists? (Assumed UI-only.)
- Is a real router route per screen required, or is in-app screen state sufficient to match the reference's single-view switching? (Assumed in-app state, aligning with the reference; add routes only if existing app conventions require it.)
- Should the investigation stream speed be configurable (reference exposes a `streamSpeed` prop) or fixed to the reference default (~620ms)? (Assumed fixed default, optionally constant.)
- Do Settings rows need working inline edit + reason capture in this pass, or is read-only presentation with prepared action architecture acceptable? (Assumed read-only presentation + prepared actions.)

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Navigation: clicking each nav item switches to the correct screen and applies active styling; login is not affected.
- Investigate submit: Enter submits a non-empty question; whitespace-only input does not start a run; Shift+Enter does not submit.
- Investigation state machine: progressing the flow fills coverage domains, transitions gate states (including a REJECT before final PASS), and only reveals the final answer after completion.
- Reset: New investigation clears timeline, coverage, gates, counters, and answer, and cancels any pending timers.
- Suggestion cards: clicking a suggestion starts that investigation with its question text.
- Runs filters: selecting a filter narrows the run list; Open dossier switches to the Runs screen.
- Mock data services: service functions return the expected shaped/typed data for Runs, Memory, Integrations, Settings, and Audit.
