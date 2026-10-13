# Impeccable audit re-check (kota-bakery)

Re-checked 2026-10-13 against `AUDIT.md`, after IMPK0-IMPK3. Contrast = WCAG relative luminance ratio.

## Findings

- P0 newsletter form discards email: **fixed** (IMPK0). Form removed from `components/landing.tsx`. Loose end fixed here: `.footer-grid` still had 4 columns for 3 children, now `1.4fr 1fr 1fr`. `footer.moonNotesHeading` remains in `lib/site-content.ts` as stored content shape; left alone, since removing it could break saved editor data.
- P1 basket stepper / remove under 44px: **fixed** (IMPK1). `.step` stays 26px visually, with a 44x44 `::before` hit area. `.basket-remove` has the same 44x44 hit area.
- P1 low-contrast tokens: **fixed** (IMPK2), plus a loose end fixed here. `--softer` (#c3a988, 1.7-2.1:1) was still used as text on `.placeholder span`, `.basket-remove` and `.footer-bottom`. Those now use `--soft`. `.btn-disabled` still uses `--softer`; left alone because disabled controls are exempt from WCAG 1.4.3.
- P1 nav links vanish under 900px: **fixed** (IMPK1). `.nav-links` is a full-width pill row under 900px, with `min-height: 44px` per link.
- P2 hero headline word-join: **fixed** (IMPK3). `headline` now ends in a trailing space, in `lib/site-content.ts:182`.
- P2 h1 to h3 heading skip: **fixed** (IMPK3). Value titles are `h2`, and `.value h2` is styled to match the old `h3`. The featured `h3` sits under the menu `h2`, so the outline is valid.
- P2 "soon" placeholder at 9px: **fixed** (IMPK3). It is now 12px.
- P3 no `prefers-reduced-motion`: **left alone**. The audit calls it a preventive note, and all transitions are 0.1-0.15s hover/focus states.
- P3 weak `.input` focus ring: **fixed** (IMPK3). It has a 2px clay outline with a 2px offset, and the border colour change stays.
- Taste advisories (italic serif headline, kicker labels, eyebrow chip, cream palette, glow effects): **left alone, taste call**. They are documented brand commitments in `PRODUCT.md`.

## Measured contrast (text on surface)

| Token | Hex | bone | panel | linen |
|---|---|---|---|---|
| --soft | #746653 | 5.29 | 4.82 | 4.53 |
| --clay | #9f5233 | 5.34 | 4.87 | 4.58 |
| --clay-text | #8a5e41 | 5.30 | 4.83 | 4.54 |
| --muted | #6a6965 | 5.21 | 4.75 | 4.47 |
| --clay-dark | #85442a | 6.97 | 6.36 | 5.97 |
| --softer (disabled only) | #c3a988 | 2.13 | 1.94 | 1.83 |

- Chips: mint-text on mint 4.51, blush-text on blush 4.52, butter-text on butter 4.54.
- `--soft` on the blush surface is 4.27 and `--clay-text` is 4.29. Neither is used there.
- `--muted` on linen is 4.47, just under 4.5. It is only used on bone and panel surfaces, so I left it. Check this if it moves onto linen.
- Button label on solid clay: white 5.63, bone on clay-dark 6.97.

## Sizes

- Stepper and remove hit areas: 44x44 (visible stepper circle 26px).
- Mobile nav links: min-height 44px.
- Placeholder "soon": 12px mono. `.footer-bottom`: 12px. `.value p`: 12px.
- Input focus outline: 2px with 2px offset.
