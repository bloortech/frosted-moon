# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing codebase: Next.js (App Router) + TypeScript, plain CSS, single public
page (`app/page.tsx` → `components/landing.tsx`) plus a built-in `/admin`
content editor. No external design system beyond the tokens in the original
design handoff.

## Users

[Inferred, not interview-confirmed — no interactive question tool was available
this session.]

- **Customers** browsing on mobile (primarily, via Instagram/WhatsApp referral)
  who want to see the menu, build a small order, and send it to the baker over
  WhatsApp without creating an account or using a checkout flow.
- **Nikita**, the baker/owner, a non-technical single operator who updates
  menu items, prices, photos, and hero copy herself through `/admin`, with no
  developer in the loop day to day.

## Product Purpose

A single-page marketing + ordering site for Frosted Moon, a one-person,
eggless home bakery in Kota, Rajasthan (Instagram `@frosted__moon`). Replaces
ad hoc Instagram/WhatsApp DM ordering with a page that shows the menu, lets a
visitor build a basket, and sends a pre-filled WhatsApp message to the baker.
Also promotes cookie-painting workshops. Success = visitors can find a treat,
understand it's eggless and homemade, and reach WhatsApp with their order
details already in the message.

## Positioning

Not a generic bakery storefront: fully eggless, baked to order from a home
kitchen in Kota, with a warm/personal "made by one person for you" voice, and
ordering happens over WhatsApp (not a cart/checkout/payment flow) — low friction
for a market that already orders via chat.

## Operating Context

- Primary flow: browse menu → add items to basket → fill name/date/phone/notes
  → tap "Send my order on WhatsApp" → deep link opens WhatsApp with the order
  pre-filled.
- Secondary flow: Nikita signs into `/admin` (password-gated via
  `ADMIN_PASSWORD` + `middleware.ts`) and edits text, photos, menu items, and
  the WhatsApp number inline, saving to Vercel Blob (`site/content.json`).
  Before the first save, defaults in `lib/site-content.ts` render.
- No backend database, no payments, no login for customers.

## Capabilities and Constraints

- Basket state and the order form are local React state (no persistence
  confirmed beyond what's in code).
- WhatsApp ordering is a client-built `wa.me` deep link; no server-side order
  record exists outside of what's sent to WhatsApp.
- Content storage (Vercel Blob, `site/content.json`) requires the Blob store
  to be **public** or saves fail (per README).
- Workshops (cookie painting) are promoted on the same page, with their own
  WhatsApp CTA.
- Undecided/unconfirmed: real WhatsApp number in production, final photos for
  items currently on placeholders (choco chip, red velvet & Oreo, coconut
  shortbread, signature mini cake, workshop photo).

## Brand Commitments

- Name: "Frosted Moon," crescent-moon motif (☾), warm/cozy "home bakery, made
  with love" voice, signed "With love, Nikita ☾ the mama baker."
- Design handoff at `design_handoff_frosted_moon/README.md` is the original,
  high-fidelity spec: specific palette (bone `#fcf9ee`, clay accent `#c46a45`,
  warm panel `#f7ede2`, ink `#1c1a17`, etc.), Newsreader (display) + Hanken
  Grotesk (body) typography, sharp-cornered cards with pill-shaped buttons,
  no shadows, hairline dividers only. Treat this as binding unless the user
  says otherwise.

## Evidence on Hand

- `design_handoff_frosted_moon/README.md` — full original spec (copy, tokens,
  section-by-section layout, interactions).
- `design_handoff_frosted_moon/reference/Frosted Moon.dc.html` — visual/copy
  reference only, not runnable production code.
- `design_handoff_frosted_moon/reference/images/` — real product photos.
- No testimonials, pricing validation beyond the handoff, or user research are
  on hand; none should be invented.

## Product Principles

1. Ordering friction stays at "pick treats, send a WhatsApp message" — no
   accounts, carts-as-checkout, or payment integration unless explicitly asked.
2. Nikita (non-technical) must be able to change any visible text, photo, menu
   item, or the WhatsApp number from `/admin` without a code change or
   redeploy.
3. Eggless + homemade + personal/handmade feel is the core promise; copy and
   visuals should keep reinforcing it, not generic "bakery" framing.
4. Honor the frosted-moon handoff's palette, type, and spacing as the design
   system of record until the user changes it.

## Accessibility & Inclusion

No product-specific accessibility requirement was established in this session;
general web a11y baseline (contrast, keyboard operability, alt text) applies
by default and is covered in the audit pass rather than here.
