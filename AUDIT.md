# Kota Bakery (Frosted Moon) — Impeccable Technical Audit

Run 2026-10-13 against `feature/site-editor` (commit `d481c5f`). Public page only
(`app/page.tsx` → `components/landing.tsx` + `app/globals.css`); `/admin` editor
chrome was read but not scored. Dev server was started on `localhost:3101`
(3000 left free for other concurrent audits) and stopped after the scan —
confirmed down via `curl` (connection refused). Diagnostic only: no design or
code changes were made.

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 1 | Body/label text set in `--soft`/`--clay-text`/`--softer` tokens fails WCAG AA contrast in ~15 places; heading hierarchy skips h1→h3 |
| 2 | Performance | 4 | Lean deps, `next/image` used correctly (lazy + sized), no layout thrash found |
| 3 | Theming | 3 | Consistent CSS-variable token system; no dark mode (none promised), a few tokens pass contrast only on large/bold text |
| 4 | Responsive Design | 2 | Basket quantity buttons are 26×26px (well under 44px touch target) on the primary mobile flow; nav links vanish under 900px with no replacement |
| 5 | Implementation Integrity | 3 | Coherent, product-specific implementation; one real functional dead-end (newsletter form) and one content bug (headline word-join) |
| **Total** | | **13/20** | **Acceptable — significant work needed, led by accessibility** |

## Implementation Integrity Verdict

**Pass, with two concrete defects.** This is not generic/interchangeable
scaffolding — copy, menu data, and the WhatsApp ordering flow are specific to
Frosted Moon and match `PRODUCT.md`/the design handoff. The two real bugs below
(dead newsletter form, headline word-join) are genuine functional defects, not
taste calls.

## Executive Summary

- Audit Health Score: **13/20** (Acceptable)
- Issues found: **1 P0, 3 P1, 3 P2, 2 P3**
- Top issues:
  1. Footer newsletter "Join" button silently discards the visitor's email — no handler, no feedback (P0, functional).
  2. Basket quantity stepper buttons are 26×26px, under the 44px touch-target floor, on a site whose own `PRODUCT.md` says customers browse "primarily on mobile" (P1, responsive/a11y).
  3. Low-contrast text tokens (`--soft` ~2.1–2.6:1, `--clay-text`/`--clay` ~2.8–3.6:1, chip text colors ~2.6–3.7:1) used for real body copy and prices in ~15 places, all failing WCAG AA 4.5:1 (P1, accessibility — confirmed by both manual luminance calculation and the bundled detector).
  4. Hero headline splits "baked" / "under the moon." across a bare `<br>` with no text fallback; several text-extraction/AT paths collapse it to "bakedunder the moon." (P2, content/accessibility).
  5. Heading hierarchy skips h1 → h3 with no h2 in the values strip (P2, semantic HTML).
- Recommended next steps: fix the newsletter dead-end and touch targets first (both are real breakage, not polish), then run a token-level contrast pass before any further visual work.

## Detailed Findings by Severity

### P0 Blocking

**[P0] Newsletter signup silently discards input**
- **Location**: `components/landing.tsx:566-576` (`footer-signup` form), `onSubmit={(e) => e.preventDefault()}`
- **Category**: Implementation Integrity
- **Impact**: A visitor who types their email and clicks "Join" gets zero feedback and the email goes nowhere — no API call, no storage, no confirmation state. It looks and behaves like a working signup form (focus states, button, placeholder all present) but is a dead end. This is the same class of bug as content stuck at `opacity: 0`: the user cannot tell anything went wrong.
- **WCAG/Standard**: N/A (functional defect, not a11y)
- **Recommendation**: Either wire it to a real capture (even a simple mailto/WhatsApp fallback consistent with the rest of the site's no-backend approach) or remove the field entirely until there's somewhere for the data to go. Removing is the lower-risk fix given `PRODUCT.md`'s "no backend database" constraint.
- **Suggested command**: `$impeccable harden`

### P1 Major

**[P1] Basket quantity buttons under the 44px touch-target floor**
- **Location**: `app/globals.css:603-619` (`.step`, 26×26px); used in `components/landing.tsx:353-367`
- **Category**: Responsive Design
- **Impact**: The +/- stepper is the only way to change quantity once an item is in the basket. At 26×26px it is roughly a third of the recommended tap target, on a page whose own product doc says mobile via Instagram/WhatsApp referral is the primary channel. Mis-taps are likely on the exact screen size this site is built for.
- **WCAG/Standard**: WCAG 2.5.5 (Target Size, AAA) / common mobile guidance (44×44px minimum)
- **Recommendation**: Grow `.step` to at least 44×44px (padding or a larger hit area via `::before`/pseudo-expansion if the visual circle must stay small), and give `.basket-remove` (no explicit size, `padding: 2px 4px`) the same treatment.
- **Suggested command**: `$impeccable adapt`

**[P1] Systemic low-contrast text tokens on real content**
- **Location**: `app/globals.css` — `--soft` (`#a89a86`) used at lines 485, 562, 594, 680, 1227 for category blurbs, basket "each" prices, and placeholders; `--clay-text`/`--clay` (`#b07a56`/`#c46a45`) used at lines 259, 421, 475 for eyebrow, featured tag, category chip; chip colors (`--mint-text`, `--blush-text`, `--butter-text`) for workshop chips
- **Category**: Accessibility
- **Impact**: Measured contrast ratios: `--soft` on bone/panel ≈ 2.1–2.6:1, `--clay-text` ≈ 2.8–3.5:1, chip text ≈ 2.6–3.7:1 — all below the 4.5:1 AA floor for normal text (confirmed independently by manual luminance calculation and the bundled `impeccable detect` scan, which flagged the same pairs against the live page and the static design handoff). This hits category descriptions, per-item prices in the basket, and all five input placeholders — functional content, not decoration.
- **WCAG/Standard**: WCAG 2.1 AA 1.4.3 (Contrast — Minimum)
- **Recommendation**: Darken `--soft` and `--clay-text` (or restrict `--clay-text`/`--clay` to large/bold text ≥18.66px where the 3:1 large-text rule actually covers them) and re-run the detector.
- **Suggested command**: `$impeccable polish`

**[P1] Nav links disappear under 900px with no replacement**
- **Location**: `app/globals.css:864-866` (`.nav-links { display: none; }` inside `@media (max-width: 900px)`)
- **Category**: Responsive Design
- **Impact**: "Menu / Workshop / Story" jump links vanish on tablet and mobile and nothing replaces them (no hamburger, no sticky in-page tabs). The content is still reachable by scrolling, which keeps this out of P0, but quick navigation is lost on exactly the devices `PRODUCT.md` says are primary.
- **WCAG/Standard**: N/A (UX, not a hard a11y violation since content remains reachable)
- **Recommendation**: Add a minimal mobile nav (hamburger or a persistent 3-item pill row) instead of dropping the links outright.
- **Suggested command**: `$impeccable adapt`

### P2 Minor

**[P2] Hero headline word-join across `<br>`**
- **Location**: `lib/site-content.ts:182-183` (`headline: "Sweet little things, baked"`, `headlineEm: "under the moon."`), rendered via a bare `<br/>` in `components/landing.tsx:202-212`
- **Category**: Accessibility / Implementation Integrity
- **Impact**: Confirmed via raw HTML (`curl`): `<span>...baked</span><br/><em><span>under the moon.</span></em>`. Several text-extraction paths (confirmed by the bundled detector's own scan) read this as "bakedunder the moon." — no word boundary survives the `<br>`. Screen-reader behavior on a bare `<br>` varies by AT; relying on it as the only separator between two words is fragile.
- **WCAG/Standard**: WCAG 1.3.1 (Info and Relationships) — borderline, flagged as robustness rather than a hard failure
- **Recommendation**: Add a literal trailing space (or non-breaking space) to `headline` before the `<br>`, e.g. `"Sweet little things, baked "`.
- **Suggested command**: `$impeccable clarify`

**[P2] Heading hierarchy skips a level**
- **Location**: `components/landing.tsx:202` (`<h1>` hero) → `components/landing.tsx:250` (`<h3>` value titles); no `<h2>` in between
- **Category**: Accessibility
- **Impact**: Screen reader users navigating by heading level see h1 then h3 with nothing at h2, breaking the document outline.
- **WCAG/Standard**: WCAG 1.3.1 / 2.4.6 (heading structure)
- **Recommendation**: Either promote the value-strip titles to `<h2>` or demote them to non-heading emphasis (`<p><strong>`) if they're not meant to be in the outline.
- **Suggested command**: `$impeccable polish`

**[P2] `"soon"` placeholder text at 9px**
- **Location**: `app/globals.css` `.placeholder` rule (used in `components/landing.tsx:646-648` for menu items missing a photo)
- **Category**: Accessibility
- **Impact**: Functional UI text below the 11px legibility floor, confirmed by the detector at both the handoff reference and the live page. Low-severity since it's a content-filled placeholder a baker will replace with a real photo, but it's wired into the design system as-is today.
- **WCAG/Standard**: No absolute WCAG floor; defensible quality bar per the detector's own rule
- **Recommendation**: Bump to at least 11px, ideally 12-14px.
- **Suggested command**: `$impeccable typeset`

### P3 Polish

**[P3] No `prefers-reduced-motion` handling**
- **Location**: `app/globals.css` — all transitions are short (0.1-0.15s) hover/focus states only, no scroll-triggered or large-layout animation exists to need a motion-safe fallback
- **Category**: Accessibility
- **Impact**: Low — nothing on this page currently uses motion aggressive enough to need a reduced-motion variant. Flagging so it's covered before any future `$impeccable animate` pass adds motion.
- **Recommendation**: Add a `prefers-reduced-motion` block only if/when motion beyond simple hover transitions is introduced.
- **Suggested command**: n/a (preventive note only)

**[P3] Weak visual focus ring on `.input`**
- **Location**: `app/globals.css:667-685` — `.input { outline: none; }`, `:focus` only changes `border-bottom-color` to clay
- **Category**: Accessibility
- **Impact**: Keyboard users get a subtle border-color change rather than a clear focus indicator on the order form's five text inputs. Buttons and links were checked and are untouched (no `outline: none`), so they still get the browser default ring.
- **WCAG/Standard**: WCAG 2.4.7 (Focus Visible) — passes technically (a visible change occurs) but is weak
- **Recommendation**: Add a visible outline or box-shadow alongside the border-color change.
- **Suggested command**: `$impeccable polish`

## Patterns & Systemic Issues

- **Low-contrast "accent" tokens reused as body text**: `--soft`, `--clay-text`, `--clay`, and the three chip-text colors were all designed to read well against their *own* chip/background pairing at larger sizes, then got reused for small body copy (category blurbs, prices, placeholders) where they fail AA. This is one root cause (five tokens, misapplied) rather than many unrelated defects — fixing the token definitions (or restricting their use to large/bold text) clears most of the P1 contrast findings at once.
- **Mobile-first claim vs. mobile-last touch targets**: `PRODUCT.md` is explicit that customers arrive on mobile, but the basket stepper and nav collapse behavior were both built to desktop-first assumptions (small circular buttons, link row that just disappears) rather than reserving mobile-safe hit areas.

## Positive Findings

- Image handling is correct throughout: `next/image` with proper `sizes`, `priority` only on the true above-the-fold hero image, `loading="lazy"` everywhere else, and a remote-pattern allowlist scoped to the actual Blob storage host — no perf red flags.
- Dependency footprint is minimal (`next`, `react`, `react-dom`, `@vercel/blob`, `server-only`) — no bloat, nothing unused found.
- `alt` text is specific and correct on every image checked (treat names, not filenames or "image of...").
- `<html lang="en">` and a correct viewport meta tag are both present.
- The WhatsApp ordering flow (`components/landing.tsx:134-153`) itself is clean, readable, and does exactly what `PRODUCT.md` describes — no hidden complexity, no unused state.
- Visual identity (palette, Newsreader/Hanken Grotesk pairing, pill buttons, no shadows) matches `design_handoff_frosted_moon/README.md` closely; this is intentional brand execution, not generic AI-template drift, even though a couple of surface patterns (italic serif hero, eyebrow chip, kicker labels, cream palette) are flagged by the detector as common "AI landing page" shapes — these are explicit, documented brief decisions per `PRODUCT.md`'s Brand Commitments, not unintentional defects.

## Recommended Actions

1. **[P0] `$impeccable harden`**: Fix or remove the dead newsletter signup form so it never silently discards a visitor's email.
2. **[P1] `$impeccable adapt`**: Grow the basket +/- and remove buttons to a real 44×44px touch target; restore a mobile nav affordance under 900px.
3. **[P1] `$impeccable polish`**: Darken `--soft` / `--clay-text` (or restrict them to large/bold text) so category blurbs, basket prices, and placeholders clear WCAG AA contrast.
4. **[P2] `$impeccable clarify`**: Add the missing space before the hero's `<br>` so "baked" and "under the moon." never fuse.
5. **[P2] `$impeccable polish`**: Fix the h1→h3 heading-level skip in the value strip.
6. **[P2] `$impeccable typeset`**: Bump the `"soon"` placeholder text off the 9px floor.

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `$impeccable audit` after fixes to see your score improve.
