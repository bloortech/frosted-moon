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

export const CATEGORIES: MenuCategory[] = [
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

export const MENU_BY_ID: Record<string, MenuItem> = Object.fromEntries(
  CATEGORIES.flatMap((c) => c.items).map((item) => [item.id, item])
);
