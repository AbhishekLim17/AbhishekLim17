# Customization

The README and every SVG in `/assets` are **generated** by one dependency-free
script. Don't hand-edit them — change the source and rebuild:

```bash
node tools/build.mjs
```

Needs Node 18+. No `npm install`.

## What to edit in `tools/build.mjs`

| Block | Controls |
|---|---|
| `PALETTE` (`C`, `G`) | Colours. `G` is the five-step green ramp used by the banner mosaic and the fragment strips next to each heading. Swap it for any ramp (e.g. orange) to re-theme everything. |
| `CONTENT` | All text: name, role, tagline, About blocks, links, focus chips, systems, principles, skills, footer. The README (including image alt text) is generated from the same data. |
| `CONTENT.skills` | `icon` is a key in `tools/icons.json`; use `mono: 'AB', color: '#hex'` for a pixel-font monogram when there is no brand glyph. |

The mosaic and fragment strips are seeded by their text, so output is
deterministic — rebuilding without changes produces identical files.

## Adding a brand icon

`tools/icons.json` holds the SVG path data (from [Simple Icons](https://simpleicons.org),
CC0) for each icon used. To add one, copy its `{ title, hex, path }` entry into
that file, then reference the key from `CONTENT.skills`.

## Generated files

| File | Purpose |
|---|---|
| `assets/banner.svg` | Pixel-font name over a twinkling green mosaic (SMIL animation) |
| `assets/about.svg` | Who I am / What I do / How I work |
| `assets/connect.svg`, `assets/link-*.svg` | Connect heading + clickable link tiles |
| `assets/contrib.svg` | Heading above the 3D contribution graph |
| `assets/focus.svg` | Currently engineering |
| `assets/systems.svg` | Selected systems |
| `assets/principles.svg` | Engineering principles |
| `assets/skills.svg` | Skill grid |
| `assets/footer.svg` | Footer strip |

Animation uses native SVG SMIL (`<animate>`) — no CSS or JavaScript — because
GitHub renders README images as inert `<img>` elements.

## 3D contribution graph

`profile-3d-contrib/*.svg` is written by the
`.github/workflows/profile-3d-contrib.yml` workflow (daily, on manual dispatch,
and when that workflow file changes on `main`). It uses
[github-profile-3d-contrib](https://github.com/yoshi389111/github-profile-3d-contrib)
with the built-in `GITHUB_TOKEN`, so no secrets are needed. Both actions in the
workflow are pinned to commit SHAs; bump them deliberately.

To run it on demand: **Actions → profile-3d-contrib → Run workflow**.
To pick another style, change the filename in the README's `<img>` (the action
also emits `profile-green-animate.svg`, `profile-season-animate.svg`,
`profile-night-rainbow.svg`, and more).
