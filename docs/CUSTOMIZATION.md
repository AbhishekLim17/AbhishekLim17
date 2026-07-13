# Customization

## Design tokens

Every SVG in `/assets` uses the same fixed palette, hardcoded as hex values
(SVGs embedded in a GitHub README can't reference external CSS variables,
so there's no shared stylesheet — each file repeats these values directly).

| Token | Value | Used for |
|---|---|---|
| Background | `#050505` | canvas / page background |
| Card | `#101010` | panels, boxes, chips |
| Card Inner | `#0A0A0A` | card body backgrounds |
| Border | `#2A2A2A` | strokes, dividers, box outlines |
| Subtle Grid | `#141414` | background grid pattern lines |
| Accent | `#FF7A00` | active nodes, highlighted boxes, key text |
| Text | `#FFFFFF` | primary text |
| Muted | `#8A8A8A` | secondary / caption text |

To re-theme, find-and-replace these hex values across all files in
`/assets`, plus the `title_color` / `icon_color` / `bg_color` query
parameters on the GitHub Analytics image URLs in `README.md`.

## SVG asset inventory

| File | Purpose | Key elements |
|---|---|---|
| `hero.svg` | Top banner with name, title, neural network | Animated data-flow pulses, pulsing nodes |
| `status-bar.svg` | Terminal-style status panel | Fade-in text rows, blinking cursor, scanline sweep |
| `projects.svg` | Featured project cards (2-up layout) | Status indicators, tech tags, research bar |
| `architecture.svg` | System architecture diagram | Router → provider fallback chain, data-flow pulse |
| `tech-grid.svg` | Technology ecosystem (6 categories) | Category cards with tech badges, connecting particles |
| `connect-bar.svg` | Contact links bar | GitHub, Email, LinkedIn with pulse indicators |
| `divider.svg` | Section separator | Three-dot animated pattern |
| `grid.svg` | Decorative panel frame | Corner brackets, status dot |
| `footer.svg` | Bottom banner | Runtime status, attribution |

## Editing the SVGs

All animation uses native SVG SMIL (`<animate>`, `<animateMotion>`) rather
than CSS or JavaScript. This is a deliberate constraint, not an oversight:

- GitHub sanitizes embedded SVGs and strips `<script>` tags entirely, so
  JS-driven animation silently fails.
- Some CSS animation techniques are also stripped or ignored depending on
  how GitHub's sanitizer is configured at the time.
- SMIL survives GitHub's sanitization consistently, which is why every
  pulse, glow, and moving particle in this profile is built with it.

If you add new motion, keep it SMIL-based, and keep every SVG's outer
`<rect>` background explicit (`fill="#050505"`) — without it, the graphic
will look broken to anyone viewing your profile in GitHub's light theme.

## Editing content sections

`README.md` is organized as independent blocks separated by `divider.svg`.
You can reorder, remove, or add blocks without touching the others. The
sections as shipped:

1. Hero (`hero.svg`)
2. AI System Status (`status-bar.svg` — animated terminal panel)
3. About (plain text)
4. Currently Building (`projects.svg` — two project cards + research bar)
5. Engineering Principles (markdown table)
6. System Architecture (`architecture.svg`)
7. Technology Ecosystem (`tech-grid.svg` — six category cards)
8. GitHub Analytics (external stat card services)
9. Connect (`connect-bar.svg` + text fallback links)
10. Footer (`footer.svg`)
11. Profile view counter (external badge service)

## Updating "Currently Building"

This section should reflect real, active work — not a permanent list. When
a project ships or wraps up, either move it into a future **Selected Work**
section (not included by default, but easy to add as a table: project,
one-line description, link) or remove it. Keeping finished work listed as
"currently building" undercuts the credibility the rest of the design is
built around.

To update the project cards, edit `assets/projects.svg` directly — update
the project names, descriptions, tech tags, and status labels. The research
direction bar at the bottom can also be edited independently.

## Updating contact details

Contact information appears in two places:

1. **`assets/connect-bar.svg`** — the visual SVG bar showing GitHub,
   Email, and LinkedIn with animated indicators
2. **`README.md`** — text fallback links below the SVG bar (these are the
   actual clickable links since SVGs can't contain hyperlinks on GitHub)

Update both when changing contact details.

## Regenerating the architecture diagram

`architecture.svg` deliberately mirrors a real system (LLM router with a
provider fallback chain, session storage, lead capture) rather than a
generic multi-model diagram. If your actual system changes shape, redraw
the boxes and connections to match it — an architecture diagram that
doesn't match what you actually built is worse than no diagram at all.

## GitHub Analytics URLs

The profile uses three external card services:

- **Stats card**: `github-readme-stats.vercel.app` — general GitHub stats
- **Streak card**: `streak-stats.demolab.com` — contribution streak
  (migrated from the deprecated `herokuapp.com` endpoint)
- **Top Languages**: `github-readme-stats.vercel.app` — language breakdown
- **View counter**: `komarev.com/ghpvc` — profile view badge

If any of these services go down, the cards will show broken images.
Consider self-hosting the stats services for long-term reliability.
