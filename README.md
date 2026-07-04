# Frosted Moon ☾

Single-page site for Frosted Moon — an eggless home bakery in Kota, Rajasthan
(Instagram [@frosted__moon](https://www.instagram.com/frosted__moon)). Customers
browse the menu, build a basket, and send a pre-filled WhatsApp order in one tap.

Built with Next.js (App Router) + TypeScript, plain CSS. No backend — the basket
and order form live in local React state, and ordering is a `wa.me` deep link.

## Develop

```bash
npm install
npm run dev
```

## Configuration

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number for order links — country code + number, digits only (e.g. `91XXXXXXXXXX`). Falls back to a placeholder if unset. |

Set it in `.env.local` for local dev and in Vercel → Project → Settings →
Environment Variables for deploys.

## Before launch

- [ ] Set the real WhatsApp number in `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [ ] Confirm prices with Nikita (menu data lives in [app/menu.ts](app/menu.ts))
- [ ] Swap striped placeholders for real photos when available: workshop photo,
      choco chip, red velvet & Oreo, coconut shortbread, signature mini cake
      (drop files in `public/images/` and add the `image` field in `app/menu.ts`)

The original design handoff (spec + reference prototype) is in
[design_handoff_frosted_moon/](design_handoff_frosted_moon/).
