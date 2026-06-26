# Design - Sistem Pengaduan Sekolah

A locked design system for this app. Every page redesign reads this file before emitting code.

## Genre
modern-minimal

## Macrostructure family
- Marketing/auth pages: Split-pane credential screen with operational context panel.
- App pages: Workbench dashboard with compact header, filter rail, dense tables, and quiet cards.
- Content pages: Document detail with metadata rail and restrained attachment treatment.

## Theme
- `--color-paper` warm off-white app canvas
- `--color-surface` clean panel surface
- `--color-ink` deep green-black text
- `--color-rule` low-contrast olive rule
- `--color-accent` teal green for primary actions
- `--color-focus` brighter teal focus ring

## Typography
- Display: Inter/system sans, weight 700, style normal
- Body: Inter/system sans, weight 400
- Mono: system monospace, weight 500

## Spacing
4-point named scale in `frontend/tokens.css`.

## Motion
- Reveal pattern: none for app surfaces
- State changes: transform and opacity only
- Reduced motion: opacity-only, <= 150 ms

## Microinteractions stance
- Silent success; use existing toast only for completed data actions.
- Focus rings are visible immediately.
- Hover movement is small and reserved for command surfaces.

## CTA Voice
- Primary CTA: solid teal, 6px radius, concise verb copy.
- Secondary CTA: quiet bordered button.

## What Pages Must Share
- Warm paper canvas, teal primary action, same button radius, same dense table rhythm.
- App pages prioritize scanning and repeated action over decorative composition.

## Exports
See `frontend/tokens.css`.
