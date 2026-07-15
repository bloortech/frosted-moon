/**
 * The shape of everything Nikita can edit, plus the built-in defaults that mirror
 * today's site. This file is deliberately free of any server/Blob imports so it
 * can be pulled into the client <Landing> component (for types + fallback values)
 * without dragging the storage layer into the browser bundle.
 */

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

export type MenuCategory = {
  title: string;
  blurb: string;
  items: MenuItem[];
};

export type ValueCard = { title: string; body: string };

export type SiteContent = {
  nav: {
    /** The three nav link labels (Menu / Workshops / Our story). */
    links: string[];
    city: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    /** The italic second line ("under the moon.") — kept separate so its styling survives editing. */
    headlineEm: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    image: string;
  };
  /** The three "always eggless / baked fresh / delivered" cards (icons stay in code). */
  values: ValueCard[];
  menu: {
    heading: string;
    sub: string;
  };
  featured: {
    /** Which menu item this highlight showcases; its name + price are read from the menu so they stay in sync. */
    itemId: string;
    tag: string;
    tagline: string;
    copy: string;
    image: string;
  };
  order: {
    basketTitle: string;
    basketHelper: string;
    emptyText: string;
    formTitle: string;
    sendLabel: string;
    disabledLabel: string;
  };
  workshop: {
    tag: string;
    heading: string;
    copy: string;
    /** The three little chips (Mini easel / Goody bag / Eggless paints). */
    chips: string[];
    ctaLabel: string;
    image: string;
  };
  story: {
    statement: string;
    signoff: string;
  };
  footer: {
    line: string;
    treatsHeading: string;
    treatsLinks: string[];
    sayHiHeading: string;
    moonNotesHeading: string;
    bottom: string;
  };
  /** WhatsApp order number: country code + number, digits only. */
  whatsappNumber: string;
  categories: MenuCategory[];
};

const DEFAULT_CATEGORIES: MenuCategory[] = [
  {
    title: "Dessert Jars",
    blurb: "cold, layered, and made to order",
    items: [
      {
        id: "mango-trifle",
        name: "Mango Cloud Trifle",
        description: "Alphonso mango, soft cream, and light sponge in a jar.",
        price: 180,
        image: "/images/jar-mango.jpg",
      },
      {
        id: "rasmalai",
        name: "Rasmalai Tres Leches",
        description:
          "Milk-soaked sponge, saffron cream, pistachio, and a little gold.",
        price: 220,
        image: "/images/jar-rasmalai.jpg",
      },
      {
        id: "mango-box",
        name: "Family Mango Box",
        description: "The same happy mango trifle, sized to share. Feeds 3 or 4.",
        price: 550,
        image: "/images/jar-mango-box.jpg",
      },
    ],
  },
  {
    title: "Cookies",
    blurb: "baked fresh the morning they go out",
    items: [
      {
        id: "trailmix",
        name: "Loaded Trail-Mix Cookie",
        description:
          "Almond, pista, pumpkin seed, and cranberry on a soft base.",
        price: 90,
        image: "/images/cookies-nut.jpg",
      },
      {
        id: "chocochip",
        name: "Brown-Butter Choco Chip",
        description: "The bestseller. Gooey middle, crisp little edges.",
        price: 70,
      },
      {
        id: "redvelvet",
        name: "Red Velvet and Oreo",
        description: "Cocoa-red dough with white chocolate and crushed Oreo.",
        price: 80,
        image: "/images/cookies-redvelvet.jpg",
      },
      {
        id: "coconut",
        name: "Coconut Shortbread",
        description:
          "Buttery, melts in your mouth, with a hint of toasted coconut.",
        price: 70,
      },
    ],
  },
  {
    title: "Bento and Mini Cakes",
    blurb: "a small cake for a good little day",
    items: [
      {
        id: "bento-mango",
        name: "Mango Bento Cake",
        description:
          "Feeds 1 or 2, with your own message piped on top. Order a day ahead.",
        price: 450,
        image: "/images/bento-mango.jpg",
      },
      {
        id: "mini-cake",
        name: "Signature Mini Cake",
        description:
          "A 6-inch cake in the flavour you love. Order two days ahead.",
        price: 650,
      },
    ],
  },
];

/** The site exactly as it ships today — used until Nikita saves her first edit. */
export const DEFAULT_CONTENT: SiteContent = {
  nav: {
    links: ["Menu", "Workshops", "Our story"],
    city: "Kota, Rajasthan",
  },
  hero: {
    eyebrow: "FRESH, EGGLESS, HOMEMADE",
    headline: "Sweet little things, baked",
    headlineEm: "under the moon.",
    body: "Hi, so glad you are here. Nikita bakes cakes, cookies, and dreamy dessert jars from her own kitchen in Kota. Every treat is eggless and made just for you. Pick what makes you smile and she will start baking.",
    ctaPrimary: "See the treats →",
    ctaSecondary: "Join a workshop",
    image: "/images/jar-rasmalai.jpg",
  },
  values: [
    { title: "Always eggless", body: "No eggs, not ever" },
    { title: "Baked fresh", body: "Made after you order" },
    { title: "Delivered in Kota", body: "Right to your door" },
  ],
  menu: {
    heading: "Pick your happy treat",
    sub: "Every single one is eggless. Prices are in ₹.",
  },
  featured: {
    itemId: "mango-trifle",
    tag: "THIS MONTH'S MOON",
    tagline: "soft, cloudy, and very mango",
    copy: "Layers of sweet Alphonso mango, fluffy cream, and light sponge, all tucked into a little jar. Cold, spoonable, and gone far too quickly.",
    image: "/images/jar-mango.jpg",
  },
  order: {
    basketTitle: "Your basket",
    basketHelper: "Fill it up, add your details, and send it over to Nikita in one tap.",
    emptyText: "It is empty for now. Tap a treat above and watch it land here.",
    formTitle: "Tell Nikita a bit more",
    sendLabel: "Send my order on WhatsApp →",
    disabledLabel: "Pop a treat in first",
  },
  workshop: {
    tag: "COME PLAY",
    heading: "Paint a cookie,\nthen eat it",
    copy: "Grab a friend and spend a sweet evening painting big cookies into tiny artworks. You get edible eggless paints, your own little easel, and a goody bag to take home. Best part? You get to eat your masterpiece.",
    chips: ["Mini easel", "Goody bag", "Eggless paints"],
    ctaLabel: "Save me a seat →",
    image: "/images/workshop.jpg",
  },
  story: {
    statement:
      "Frosted Moon started with mom life, a few dreams, and one tiny kitchen. Nikita bakes it all herself, and she pours a little love into every box she ties up.",
    signoff: "With love, Nikita ☾ the mama baker",
  },
  footer: {
    line: "A little eggless home bakery in Kota, made with love and baked just for you.",
    treatsHeading: "Treats",
    treatsLinks: ["Dessert jars", "Cookies", "Bento cakes"],
    sayHiHeading: "Say hi",
    moonNotesHeading: "Moon notes",
    bottom: "Frosted Moon · Baked with love in Kota, Rajasthan",
  },
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999",
  categories: DEFAULT_CATEGORIES,
};

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Deep-merge a saved payload over the defaults so the working copy is always
 * complete. Objects merge key-by-key (a field added in code later still shows a
 * default); arrays and scalars from the saved copy win outright (Nikita owns the
 * whole menu list once she's edited it).
 */
export function mergeContent(defaults: SiteContent, saved: unknown): SiteContent {
  const merge = (a: unknown, b: unknown): unknown => {
    if (b === undefined) return a;
    if (!isPlainObject(a) || !isPlainObject(b)) return b;
    const out: Record<string, unknown> = { ...a };
    for (const key of Object.keys(b)) out[key] = merge(a[key], b[key]);
    return out;
  };
  return merge(defaults, saved) as SiteContent;
}

/** Flatten every menu item into an id→item map (for basket lookups). */
export function menuById(categories: MenuCategory[]): Record<string, MenuItem> {
  return Object.fromEntries(
    categories.flatMap((c) => c.items).map((item) => [item.id, item])
  );
}
