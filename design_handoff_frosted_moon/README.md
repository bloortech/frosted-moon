# Handoff: Frosted Moon — home bakery landing page

## Overview
Frosted Moon is a one-person, eggless home bakery in Kota, Rajasthan (Instagram `@frosted__moon`, baker: Nikita). Right now orders come in through Instagram/WhatsApp DMs. This design is a single-page marketing + ordering landing page so customers can browse the menu, build a basket, and send a pre-filled WhatsApp order in one tap. It also promotes her cookie-painting workshops.

The goal for this handoff: rebuild the design as a **simple Next.js app** that deploys to a **Vercel preview**.

## About the Design Files
The files in `reference/` are a **design reference created in HTML** — a working prototype that shows the intended look, copy, and behavior. They are **not production code to copy line-for-line**.

`reference/Frosted Moon.dc.html` is authored in a proprietary component format ("Design Component") and will not run on its own outside its original environment. **Do not try to run or import it.** Open it as a text/visual reference only, to read exact colors, copy, spacing, and structure. Recreate the UI natively in Next.js + React using ordinary components and your preferred styling approach (plain CSS Modules or Tailwind — either is fine; see below).

The `reference/images/` folder contains the real product photos to use in the build.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions below are final. Recreate them faithfully. The one deliberately loose part is imagery for items that have no photo yet — those are shown as placeholders and should stay as tasteful placeholders until real photos arrive.

## Recommended stack
- **Next.js (App Router)**, TypeScript, single page at `app/page.tsx`.
- Styling: **Tailwind CSS** is a good fit, but plain CSS Modules is equally fine. There is no external design system to honor — the tokens below are the whole system.
- No backend, no database. Ordering is a **WhatsApp deep link** built on the client (`https://wa.me/<number>?text=<encoded>`). State (basket + form) is local React state.
- Fonts via `next/font/google`: **Newsreader** and **Hanken Grotesk**.
- Images via `next/image`, served from `public/images/`.

## The single page — sections top to bottom

Overall canvas: centered column, `max-width: 1200px`, page background `#fcf9ee` (bone). Body background behind the column `#e7e3d6`. Default body font Hanken Grotesk; display font Newsreader. Crescent glyph used as a brand motif is the Unicode character `☾` (U+263E), colored `#c46a45`.

### 1. Sticky nav
- Sticky top, `z-index` above content, `padding: 20px 48px`, bottom border `1px solid #efe7d6`, background `rgba(252,249,238,0.95)` with `backdrop-filter: blur(6px)`.
- Left: `☾` (17px, `#c46a45`) + wordmark "frosted moon" (Newsreader, 21px, `#1c1a17`, letter-spacing .01em). Then nav links "Menu", "Workshops", "Our story" (Hanken, 13px, `#4a4843`, gap 24px) that smooth-scroll to `#menu`, `#workshop`, `#story`.
- Right: "Kota, Rajasthan" (13px, `#c46a45`); a pill link "Basket (N)" — border `1px solid #c46a45`, text `#c46a45`, `padding: 8px 16px`, `border-radius: 20px`, N = total item count. Scrolls to `#order`.
- Use `scroll-margin-top: 76px` on each scroll target so the sticky nav doesn't overlap.

### 2. Hero (two columns, `1.05fr 1fr`)
- Left cell: background `#f7ede2`, `padding: 70px 48px`, vertically centered, `min-height: 580px`.
  - Eyebrow row: `☾` (15px `#c46a45`) + "FRESH, EGGLESS, HOMEMADE" (monospace, 11px, letter-spacing .16em, `#b07a56`).
  - Headline (Newsreader, 58px, line-height 1.03, letter-spacing -.02em, `#1c1a17`): "Sweet little things, baked" then a line break and the italic phrase "under the moon." in italic `#c46a45`.
  - Body (17px, line-height 1.65, `#6a6965`, max-width 430px): "Hi, so glad you are here. Nikita bakes cakes, cookies, and dreamy dessert jars from her own kitchen in Kota. Every treat is eggless and made just for you. Pick what makes you smile and she will start baking."
  - Buttons row: primary "See the treats →" (background `#c46a45`, text `#fcf9ee`, `padding: 14px 26px`, 13px, `border-radius: 20px`) → scrolls to `#menu`. Secondary "Join a workshop" (13px, `#1c1a17`, bottom border `1px solid #c46a45`) → scrolls to `#workshop`.
- Right cell: background `#d8d4c8`, full-bleed image `images/jar-rasmalai.jpg`, `object-fit: cover`, `min-height: 580px`.

### 3. Eggless value strip (three columns)
- Grid `1fr 1fr 1fr`, 1px gaps over `#efe7d6` background, top+bottom border `1px solid #efe7d6`. Each cell background `#fcf9ee`, `padding: 26px 40px`, flex row, gap 16px, items centered.
- Each cell: a 40px circle icon chip + title (Newsreader 18px `#1c1a17`) + subtitle (12px `#6a6965`):
  - `☾` on mint `#d6f0e0` — "Always eggless" / "No eggs, not ever"
  - `♥` on blush `#f6dcd4` — "Baked fresh" / "Made after you order"
  - `✦` on butter `#f3e6c4` — "Delivered in Kota" / "Right to your door"

### 4. Menu (`id="menu"`, `padding: 70px 48px 44px`)
- Centered header: `☾` (16px `#c46a45`), title "Pick your happy treat" (Newsreader 40px, letter-spacing -.02em, `#1c1a17`), subtitle "Every single one is eggless. Prices are in ₹." (14px `#6a6965`).
- **Featured card** (two columns `1fr 1fr`, background `#f7ede2`, `margin-bottom: 48px`):
  - Left: `images/jar-mango.jpg`, cover, `min-height: 360px`.
  - Right: `padding: 44px`, centered. A pill tag "THIS MONTH'S MOON" (11px `#b07a56` on `#f3e6c4`, radius 20px). Title "Mango Cloud Trifle" (Newsreader 32px). Italic tagline "soft, cloudy, and very mango" (Newsreader italic 15px `#c46a45`). Body: "Layers of sweet Alphonso mango, fluffy cream, and light sponge, all tucked into a little jar. Cold, spoonable, and gone far too quickly." Price "₹180" (Newsreader 22px) + solid button "Add to basket" (`#c46a45` bg) that adds the `mango-trifle` item.
- **Three category groups.** Each group: a header row with a category chip (12px `#b07a56` on `#f7ede2`, radius 20px) + an italic blurb (Newsreader italic 13px `#a89a86`). Then a two-column grid (`gap: 26px 40px`) of item rows.
- **Item row** layout: grid `104px 1fr`, gap 20px, `padding-bottom: 24px`, bottom border `1px solid #efe7d6`.
  - Left: 104×104 image (`object-fit: cover`) if a photo exists, else a placeholder square with a 45° repeating-stripe background (`#f7ede2`/`#fbf2e7`, 8px bands) centered "soon" label (monospace 9px `#c3a988`).
  - Right: item name (Newsreader 20px `#1c1a17`), description (13px `#6a6965`), then a row with price "₹N" (15px) and a ghost "Add +" button (border `1px solid #c46a45`, text `#c46a45`, `padding: 7px 18px`, radius 20px; on hover fill `#c46a45` / text `#fcf9ee`).

Menu data (all eggless; ids are stable keys for the basket):

**Dessert Jars** — blurb "cold, layered, and made to order"
- `mango-trifle` · Mango Cloud Trifle · "Alphonso mango, soft cream, and light sponge in a jar." · ₹180 · `images/jar-mango.jpg`
- `rasmalai` · Rasmalai Tres Leches · "Milk-soaked sponge, saffron cream, pistachio, and a little gold." · ₹220 · `images/jar-rasmalai.jpg`
- `mango-box` · Family Mango Box · "The same happy mango trifle, sized to share. Feeds 3 or 4." · ₹550 · `images/jar-mango-box.jpg`

**Cookies** — blurb "baked fresh the morning they go out"
- `trailmix` · Loaded Trail-Mix Cookie · "Almond, pista, pumpkin seed, and cranberry on a soft base." · ₹90 · `images/cookies-nut.jpg`
- `chocochip` · Brown-Butter Choco Chip · "The bestseller. Gooey middle, crisp little edges." · ₹70 · no photo (placeholder)
- `redvelvet` · Red Velvet and Oreo · "Cocoa-red dough with white chocolate and crushed Oreo." · ₹80 · no photo
- `coconut` · Coconut Shortbread · "Buttery, melts in your mouth, with a hint of toasted coconut." · ₹70 · no photo

**Bento and Mini Cakes** — blurb "a small cake for a good little day"
- `bento-mango` · Mango Bento Cake · "Feeds 1 or 2, with your own message piped on top. Order a day ahead." · ₹450 · `images/bento-mango.jpg`
- `mini-cake` · Signature Mini Cake · "A 6-inch cake in the flavour you love. Order two days ahead." · ₹650 · no photo

### 5. Order (`id="order"`, background `#f7ede2`, `padding: 60px 48px`, two columns `1fr 1fr`, gap 56px)
- **Left — basket.** Header `☾` + "Your basket" (Newsreader 28px). Helper line: "Fill it up, add your details, and send it over to Nikita in one tap."
  - Empty state: "It is empty for now. Tap a treat above and watch it land here." (14px `#a89a86`, top border `1px solid #ecd9c4`).
  - Filled: one row per basket item — name (Newsreader 16px), "₹N each" (12px `#a89a86`), then quantity stepper (round − and + buttons, 26px, border `1px solid #d9b99e`, `#c46a45` glyph on `#fcf9ee`), the qty number, the line total "₹N", and an "×" remove button (`#c3a988`). Below the list: a Total row (top border `2px solid #c46a45`) with "Total" and "₹N" (Newsreader 18px `#c46a45`).
- **Right — details form.** Title "Tell Nikita a bit more" (Newsreader 28px). Four underline-only inputs (border-bottom `1px solid #d9b99e`, transparent, 15px):
  - name → placeholder "What is your name?"
  - date → "When would you like it?"
  - phone → "Your phone number"
  - notes (textarea, 2 rows) → "Want a message on the cake, or have an allergy? Tell us here."
  - CTA: when basket has items, an anchor "Send my order on WhatsApp →" (`#c46a45` bg, `#fcf9ee` text, radius 24px) whose `href` is the WhatsApp deep link (below). When empty, a disabled-looking chip "Pop a treat in first" (border `1px solid #e3cdb6`, `#c3a988`).

### 6. Workshop (`id="workshop"`, `padding: 70px 48px`, two columns `1fr 1fr`)
- Left: 4:3 placeholder with the same striped pattern, centered "workshop photo" label (swap for a real photo when available).
- Right: pill "COME PLAY" (11px `#b07a56` on `#f3e6c4`). Heading "Paint a cookie, then eat it" (Newsreader 38px, with a line break after "cookie,"). Body: "Grab a friend and spend a sweet evening painting big cookies into tiny artworks. You get edible eggless paints, your own little easel, and a goody bag to take home. Best part? You get to eat your masterpiece." Three feature chips: "Mini easel" (`#5b8b6f` on `#d6f0e0`), "Goody bag" (`#b5726a` on `#f6dcd4`), "Eggless paints" (`#a58a4a` on `#f3e6c4`), all radius 20px. CTA "Save me a seat →" (`#c46a45` bg, radius 24px) → WhatsApp link with the workshop message.

### 7. Story (`id="story"`, `padding: 20px 48px 72px`)
- Centered, max-width 620px. `☾` (18px `#c46a45`). Statement (Newsreader 28px, line-height 1.4, `#1c1a17`): "Frosted Moon started with mom life, a few dreams, and one tiny kitchen. Nikita bakes it all herself, and she pours a little love into every box she ties up." Sign-off: "With love, Nikita ☾ the mama baker" (14px `#6a6965`).

### 8. Footer (`padding: 48px`, background `#f7ede2`, top border `1px solid #efe7d6`)
- Four columns (`1.4fr 1fr 1fr 1fr`):
  1. `☾` + "frosted moon" (Newsreader 20px) + line "A little eggless home bakery in Kota, made with love and baked just for you."
  2. "Treats": Dessert jars / Cookies / Bento cakes (scroll to #menu).
  3. "Say hi": WhatsApp / @frosted__moon / Workshops.
  4. "Moon notes": email input (underline `#d9b99e`) + "Join" (`#c46a45`).
- Bottom line: "Frosted Moon · Baked with love in Kota, Rajasthan" (12px `#c3a988`).

## Interactions & Behavior
- **Basket:** `add(id)` increments qty; `dec(id)` decrements and removes at 0; `remove(id)` deletes. Basket count in the nav pill = sum of quantities. Totals computed from qty × price.
- **Add buttons** on every menu item and the featured card add that item to the basket.
- **WhatsApp order deep link** (built client-side, opens in a new tab):
  - Base: `https://wa.me/<PHONE>?text=<encodeURIComponent(message)>`
  - Message format (newline-separated):
    ```
    Hi Frosted Moon ☾

    I would like to place an order:
    • 2 x Mango Cloud Trifle — ₹360
    • 1 x Brown-Butter Choco Chip — ₹70

    Total: ₹430

    Name: <form.name>
    Needed for: <form.date>
    Phone: <form.phone>
    Notes: <form.notes>
    ```
  - Per-item "Order" links (optional, if you keep them) use: `Hi Frosted Moon ☾ I would love to order the <name> (₹<price>). Is it available?`
  - Workshop CTA message: `Hi Frosted Moon ☾ I would like to join the cookie painting workshop. Are there seats left?`
- **Hover states:** ghost "Add +" fills `#c46a45`/`#fcf9ee`; primary buttons can darken slightly.
- **Smooth scroll** for in-page nav; respect `scroll-margin-top: 76px`.
- **Responsive:** below ~900px, collapse all two-column grids to one column, stack hero image under text, and let the menu become a single column. Keep the sticky nav; it can wrap or hide the middle links on small screens.

## State Management
- `basket`: `Record<itemId, quantity>` in React state (a `useReducer` or `useState` is plenty). No persistence required; optionally mirror to `localStorage` so a refresh keeps the basket.
- `form`: `{ name, date, phone, notes }` controlled inputs.
- Derived on render: `basketItems[]` (joined with menu data), `basketTotal`, `basketCount`, and the WhatsApp `href`.

## Design Tokens
Colors:
- Bone (page): `#fcf9ee`
- Warm panel / sections: `#f7ede2`
- Card/linen edges: `#efe7d6`, `#ecd9c4`
- Ink (text): `#1c1a17`
- Muted text: `#6a6965`; softer muted: `#a89a86`, `#c3a988`
- Clay accent (brand): `#c46a45`; clay text on light: `#b07a56`
- Input/hairline border: `#d9b99e` (warm), `#bcbab2` (neutral)
- Pastel chips: mint `#d6f0e0` (text `#5b8b6f`), blush `#f6dcd4` (text `#b5726a`), butter `#f3e6c4` (text `#a58a4a`)
- Body backdrop behind page column: `#e7e3d6`; hero image bg `#d8d4c8`

Typography:
- Display: **Newsreader** (400, 500, + italics). Sizes used: 58 / 40 / 38 / 32 / 28 / 21 / 20 / 18 / 16px. Tight negative tracking on big sizes (-.02em).
- UI/body: **Hanken Grotesk** (300–600). Sizes: 17 / 15 / 14 / 13 / 12px.
- Eyebrows/labels: monospace, 11px, letter-spacing .16em.

Radii: pills/chips `20px`; buttons `20–24px`; cards/images `0px` (sharp). Round stepper buttons `50%`.

Spacing: section padding ~`60–70px` vertical / `48px` horizontal; element gaps ~`14–26px`.

Shadows: **none.** Elevation comes from the tonal shift between `#fcf9ee` and `#f7ede2` and 1px hairlines only.

## Assets
Real photos are in `reference/images/` — copy them into the Next.js app's `public/images/`:
- `jar-mango.jpg` — mango cloud trifle (hero-featured)
- `jar-rasmalai.jpg` — rasmalai tres leches (hero image)
- `jar-mango-box.jpg` — family mango box
- `cookies-nut.jpg` — loaded trail-mix cookie
- `bento-mango.jpg` — mango bento cake

Still needed (currently placeholders): a workshop photo, and photos for choco chip, red velvet & Oreo, coconut shortbread, and the signature mini cake. Keep the striped placeholder until supplied.

Brand config to replace before launch:
- `PHONE` for WhatsApp links is a placeholder `919999999999`. Put the real number (country code + number, digits only) in an env var, e.g. `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Confirm all prices with Nikita.

## Files
- `reference/Frosted Moon.dc.html` — the full design (visual + copy reference only; do not run/import).
- `reference/images/*` — the product photos to reuse.

---

## Deploying to a Vercel preview (suggested workflow)
1. Put this folder in a Git repo (new or existing). Open the repo with **Claude Code**.
2. Prompt Claude Code, e.g.: *"Read design_handoff_frosted_moon/README.md and build the described single-page site as a Next.js (App Router) app with Tailwind. Use the photos in the reference/images folder. Implement the basket + WhatsApp deep-link flow with local state. Put the WhatsApp number in NEXT_PUBLIC_WHATSAPP_NUMBER."*
3. Let it scaffold (`npx create-next-app`), build `app/page.tsx` and components, and run it locally to check.
4. Commit and push to GitHub. If the repo is linked to Vercel, every push builds a **preview deployment** automatically; otherwise run `vercel` (or import the repo at vercel.com) once to link it. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in Vercel's Environment Variables.
5. Open the preview URL Vercel prints, review on desktop + mobile, and iterate with Claude Code.
