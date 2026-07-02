# Design - Sistem Pengaduan Sekolah

A locked design system for this app. Every page redesign reads this file before emitting code.

## Genre
editorial-operations

## Macrostructure family
- Marketing/auth pages: Split-pane editorial credential screen with a black context panel, oversized headline, and compact form rail.
- App pages: Magazine workbench with hard topbar, left navigation rail, boxed filters, dense tables, and bordered metric blocks.
- Content pages: Dossier detail with a strong title block, metadata rail, restrained attachment treatment, and red-only emphasis.

## Theme
- `--color-paper` white editorial canvas
- `--color-surface` near-white panel surface
- `--color-ink` hard black text and dominant tone
- `--color-rule` neutral print rule
- `--color-accent` aggressive red for primary actions and single-point emphasis
- `--color-focus` black focus ring with white offset

## Typography
- Display: Archivo Black fallback stack, weight 400, style normal
- Body: Work Sans/system sans, weight 400
- Mono: Space Mono/system monospace, weight 500
- Display tracking: 0
- UI tracking: 0.04em only on compact labels and buttons

## Spacing
4-point named scale in `frontend/tokens.css`.

## Motion
- Reveal pattern: none for app surfaces
- State changes: transform and opacity only
- Reduced motion: opacity-only, <= 150 ms

## Microinteractions stance
- Silent success; use existing toast only for completed data actions.
- Focus rings are visible immediately.
- Hover movement is removed for most controls; state changes use border, ink, and red accent.

## CTA Voice
- Primary CTA: black fill, square corners, uppercase concise verb copy; hover turns red.
- Secondary CTA: square black outline, white fill, uppercase concise verb copy.

## What Pages Must Share
- White canvas, black typography, square controls, thick borders, and red accent used sparingly.
- App pages prioritize scanning and repeated action over decorative composition.
- No shadows, gradients, rounded cards, or soft dashboard chrome.

## Exports
See `frontend/tokens.css`.
