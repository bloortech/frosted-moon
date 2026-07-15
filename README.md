# Frosted Moon ☾

Single-page site for Frosted Moon — an eggless home bakery in Kota, Rajasthan
(Instagram [@frosted__moon](https://www.instagram.com/frosted__moon)). Customers
browse the menu, build a basket, and send a pre-filled WhatsApp order in one tap.

Built with Next.js (App Router) + TypeScript, plain CSS. Nikita updates the menu,
prices, photos and hero copy herself from a built-in editor — no code, no redeploy.

## Develop

```bash
npm install
npm run dev
```

## The site editor

Nikita edits the live site in place at **`/admin`** (sign in with `ADMIN_PASSWORD`):

- **Text** — click any headline, description, price, or category name and type.
- **Photos** — hover a photo and press **Replace photo** to upload a new one.
- **Menu** — add / remove / reorder treats within a category.
- **WhatsApp number** — set it in the editor toolbar.
- Press **Save changes** and it's live immediately.

Everything is stored in **Vercel Blob** as a single JSON document
(`site/content.json`) plus the uploaded image files — no database. Until the first
save, the site shows the built-in defaults in [lib/site-content.ts](lib/site-content.ts),
so it renders fine even before storage is wired up.

### How it fits together

| Piece | File |
|---|---|
| Editable content shape + defaults | [lib/site-content.ts](lib/site-content.ts) |
| Read/write the JSON in Blob | [lib/content-store.ts](lib/content-store.ts) |
| Public homepage (reads Blob) | [app/page.tsx](app/page.tsx) → [components/landing.tsx](components/landing.tsx) |
| Inline editor | [app/admin/page.tsx](app/admin/page.tsx) + [components/editor/](components/editor/) |
| Save / upload APIs | [app/api/content/route.ts](app/api/content/route.ts), [app/api/upload/route.ts](app/api/upload/route.ts) |
| Password gate | [middleware.ts](middleware.ts), [lib/auth.ts](lib/auth.ts) |

## Configuration

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Password for the `/admin` editor. Set a real one before launch. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob access. **Injected automatically** when you create a Blob store — don't set it by hand. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Default WhatsApp order number (country code + number, digits only). Once Nikita sets the number in the editor, that saved value wins. |

## Deploying on Vercel

1. **Create the Blob store** — Vercel dashboard → your project → **Storage** →
   **Create Database** → **Blob** → connect it to the project. This sets
   `BLOB_READ_WRITE_TOKEN` for you. **The store must be public** (the menu photos
   load directly in visitors' browsers). A private store makes every save fail
   with "Cannot use public access on a private store" — if you see that, recreate
   the store as public, reconnect it, and redeploy.
2. **Set `ADMIN_PASSWORD`** — Project → Settings → Environment Variables.
3. **Redeploy** so both env vars are picked up.
4. Visit `/admin`, sign in, and edit away.

To edit locally, run `vercel env pull .env.local` (copies the Blob token down),
then `npm run dev` and open `http://localhost:3000/admin`.

The original design handoff (spec + reference prototype) is in
[design_handoff_frosted_moon/](design_handoff_frosted_moon/).
