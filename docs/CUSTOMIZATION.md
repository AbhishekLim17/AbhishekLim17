# Customization

## Design tokens

Every SVG in `/assets` uses the same fixed palette, hardcoded as hex values
(SVGs embedded in a GitHub README can't reference external CSS variables,
so there's no shared stylesheet — each file repeats these values directly).

| Token | Value | Used for |
|---|---|---|
| Background | `#050505` | canvas / page background |
| Card | `#101010` | panels, boxes, chips |
| Border | `#2A2A2A` | strokes, dividers, box outlines |
| Accent | `#FF7A00` | active nodes, highlighted boxes, key text |
| Text | `#FFFFFF` | primary text |
| Muted | `#8A8A8A` | secondary / caption text |

To re-theme, find-and-replace these hex values across all files in
`/assets`, plus the `title_color` / `icon_color` / `bg_color` query
parameters on the GitHub Analytics image URLs in `README.md`.

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
2. AI System Status (plain code block, not an image — easiest to edit)
3. About
4. Currently Building
5. Engineering Principles
6. System Architecture (`architecture.svg`)
7. Technology Ecosystem
8. GitHub Analytics
9. Connect
10. Footer (`footer.svg`)

## Updating "Currently Building"

This section should reflect real, active work — not a permanent list. When
a project ships or wraps up, either move it into a future **Selected Work**
section (not included by default, but easy to add as a table: project,
one-line description, link) or remove it. Keeping finished work listed as
"currently building" undercuts the credibility the rest of the design is
built around.

## Regenerating the architecture diagram

`architecture.svg` deliberately mirrors a real system (LLM router with a
provider fallback chain, session storage, lead capture) rather than a
generic multi-model diagram. If your actual system changes shape, redraw
the boxes and connections to match it — an architecture diagram that
doesn't match what you actually built is worse than no diagram at all.
