"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, MENU_BY_ID } from "./menu";

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

type Basket = Record<string, number>;
type OrderForm = { name: string; date: string; phone: string; notes: string };

const EMPTY_FORM: OrderForm = { name: "", date: "", phone: "", notes: "" };

function waLink(message: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

const WORKSHOP_HREF = waLink(
  "Hi Frosted Moon ☾ I would like to join the cookie painting workshop. Are there seats left?"
);

function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`placeholder ${className ?? ""}`}>
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  const [basket, setBasket] = useState<Basket>({});
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fm-basket");
      if (saved) setBasket(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("fm-basket", JSON.stringify(basket));
    } catch {}
  }, [basket]);

  const add = (id: string) =>
    setBasket((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));

  const dec = (id: string) =>
    setBasket((b) => {
      const next = { ...b };
      if ((next[id] ?? 0) <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    });

  const remove = (id: string) =>
    setBasket((b) => {
      const next = { ...b };
      delete next[id];
      return next;
    });

  const basketItems = useMemo(
    () =>
      Object.entries(basket)
        .filter(([id]) => MENU_BY_ID[id])
        .map(([id, qty]) => ({ ...MENU_BY_ID[id], qty })),
    [basket]
  );

  const basketCount = basketItems.reduce((sum, item) => sum + item.qty, 0);
  const basketTotal = basketItems.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const orderHref = useMemo(() => {
    const lines = basketItems.map(
      (item) => `• ${item.qty} x ${item.name} — ₹${item.qty * item.price}`
    );
    const message = [
      "Hi Frosted Moon ☾",
      "",
      "I would like to place an order:",
      ...lines,
      "",
      `Total: ₹${basketTotal}`,
      "",
      `Name: ${form.name}`,
      `Needed for: ${form.date}`,
      `Phone: ${form.phone}`,
      `Notes: ${form.notes}`,
    ].join("\n");
    return waLink(message);
  }, [basketItems, basketTotal, form]);

  const setField = (field: keyof OrderForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="page">
      {/* 1. Sticky nav */}
      <nav className="nav">
        <div className="nav-left">
          <a href="#" className="brand">
            <span className="moon brand-moon">☾</span>
            <span className="wordmark">frosted moon</span>
          </a>
          <div className="nav-links">
            <a href="#menu">Menu</a>
            <a href="#workshop">Workshops</a>
            <a href="#story">Our story</a>
          </div>
        </div>
        <div className="nav-right">
          <span className="nav-city">Kota, Rajasthan</span>
          <a href="#order" className="basket-pill">
            Basket ({basketCount})
          </a>
        </div>
      </nav>

      {/* 2. Hero */}
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">
            <span className="moon">☾</span> FRESH, EGGLESS, HOMEMADE
          </p>
          <h1>
            Sweet little things, baked
            <br />
            <em>under the moon.</em>
          </h1>
          <p className="hero-body">
            Hi, so glad you are here. Nikita bakes cakes, cookies, and dreamy
            dessert jars from her own kitchen in Kota. Every treat is eggless
            and made just for you. Pick what makes you smile and she will start
            baking.
          </p>
          <div className="hero-buttons">
            <a href="#menu" className="btn-primary">
              See the treats →
            </a>
            <a href="#workshop" className="link-underline">
              Join a workshop
            </a>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/jar-rasmalai.jpg"
            alt="Rasmalai tres leches dessert jar"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            priority
          />
        </div>
      </header>

      {/* 3. Eggless value strip */}
      <section className="values">
        <div className="value">
          <span className="value-icon icon-mint">☾</span>
          <div>
            <h3>Always eggless</h3>
            <p>No eggs, not ever</p>
          </div>
        </div>
        <div className="value">
          <span className="value-icon icon-blush">♥</span>
          <div>
            <h3>Baked fresh</h3>
            <p>Made after you order</p>
          </div>
        </div>
        <div className="value">
          <span className="value-icon icon-butter">✦</span>
          <div>
            <h3>Delivered in Kota</h3>
            <p>Right to your door</p>
          </div>
        </div>
      </section>

      {/* 4. Menu */}
      <section id="menu" className="menu">
        <div className="section-header">
          <span className="moon section-moon">☾</span>
          <h2>Pick your happy treat</h2>
          <p>Every single one is eggless. Prices are in ₹.</p>
        </div>

        <div className="featured">
          <div className="featured-image">
            <Image
              src="/images/jar-mango.jpg"
              alt="Mango Cloud Trifle"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="featured-body">
            <span className="featured-tag">THIS MONTH&apos;S MOON</span>
            <h3>Mango Cloud Trifle</h3>
            <p className="featured-tagline">soft, cloudy, and very mango</p>
            <p className="featured-copy">
              Layers of sweet Alphonso mango, fluffy cream, and light sponge,
              all tucked into a little jar. Cold, spoonable, and gone far too
              quickly.
            </p>
            <div className="featured-cta">
              <span className="featured-price">₹180</span>
              <button
                className="btn-primary"
                onClick={() => add("mango-trifle")}
              >
                Add to basket
              </button>
            </div>
          </div>
        </div>

        {CATEGORIES.map((category) => (
          <div key={category.title} className="category">
            <div className="category-header">
              <span className="category-chip">{category.title}</span>
              <span className="category-blurb">{category.blurb}</span>
            </div>
            <div className="item-grid">
              {category.items.map((item) => (
                <div key={item.id} className="item">
                  {item.image ? (
                    <div className="item-photo">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="104px"
                      />
                    </div>
                  ) : (
                    <Placeholder label="soon" className="item-photo" />
                  )}
                  <div className="item-body">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <div className="item-row">
                      <span className="item-price">₹{item.price}</span>
                      <button
                        className="btn-ghost"
                        onClick={() => add(item.id)}
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 5. Order */}
      <section id="order" className="order">
        <div className="order-basket">
          <h2 className="order-title">
            <span className="moon">☾</span> Your basket
          </h2>
          <p className="order-helper">
            Fill it up, add your details, and send it over to Nikita in one
            tap.
          </p>
          {basketItems.length === 0 ? (
            <p className="basket-empty">
              It is empty for now. Tap a treat above and watch it land here.
            </p>
          ) : (
            <div className="basket-list">
              {basketItems.map((item) => (
                <div key={item.id} className="basket-row">
                  <div className="basket-item-info">
                    <span className="basket-item-name">{item.name}</span>
                    <span className="basket-item-each">₹{item.price} each</span>
                  </div>
                  <div className="basket-controls">
                    <button
                      className="step"
                      aria-label={`Remove one ${item.name}`}
                      onClick={() => dec(item.id)}
                    >
                      −
                    </button>
                    <span className="basket-qty">{item.qty}</span>
                    <button
                      className="step"
                      aria-label={`Add one ${item.name}`}
                      onClick={() => add(item.id)}
                    >
                      +
                    </button>
                    <span className="basket-line-total">
                      ₹{item.qty * item.price}
                    </span>
                    <button
                      className="basket-remove"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => remove(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <div className="basket-total">
                <span>Total</span>
                <span>₹{basketTotal}</span>
              </div>
            </div>
          )}
        </div>
        <div className="order-form">
          <h2 className="order-title">Tell Nikita a bit more</h2>
          <input
            className="input"
            type="text"
            placeholder="What is your name?"
            value={form.name}
            onChange={setField("name")}
          />
          <input
            className="input"
            type="text"
            placeholder="When would you like it?"
            value={form.date}
            onChange={setField("date")}
          />
          <input
            className="input"
            type="tel"
            placeholder="Your phone number"
            value={form.phone}
            onChange={setField("phone")}
          />
          <textarea
            className="input"
            rows={2}
            placeholder="Want a message on the cake, or have an allergy? Tell us here."
            value={form.notes}
            onChange={setField("notes")}
          />
          {basketItems.length > 0 ? (
            <a
              className="btn-primary btn-send"
              href={orderHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Send my order on WhatsApp →
            </a>
          ) : (
            <span className="btn-disabled">Pop a treat in first</span>
          )}
        </div>
      </section>

      {/* 6. Workshop */}
      <section id="workshop" className="workshop">
        <div className="workshop-photo">
          <Image
            src="/images/workshop.jpg"
            alt="Cookie paintings on mini easels at a Frosted Moon workshop"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="workshop-body">
          <span className="featured-tag">COME PLAY</span>
          <h2>
            Paint a cookie,
            <br />
            then eat it
          </h2>
          <p className="workshop-copy">
            Grab a friend and spend a sweet evening painting big cookies into
            tiny artworks. You get edible eggless paints, your own little
            easel, and a goody bag to take home. Best part? You get to eat your
            masterpiece.
          </p>
          <div className="workshop-chips">
            <span className="chip chip-mint">Mini easel</span>
            <span className="chip chip-blush">Goody bag</span>
            <span className="chip chip-butter">Eggless paints</span>
          </div>
          <a
            className="btn-primary btn-send"
            href={WORKSHOP_HREF}
            target="_blank"
            rel="noopener noreferrer"
          >
            Save me a seat →
          </a>
        </div>
      </section>

      {/* 7. Story */}
      <section id="story" className="story">
        <span className="moon story-moon">☾</span>
        <p className="story-statement">
          Frosted Moon started with mom life, a few dreams, and one tiny
          kitchen. Nikita bakes it all herself, and she pours a little love
          into every box she ties up.
        </p>
        <p className="story-signoff">With love, Nikita ☾ the mama baker</p>
      </section>

      {/* 8. Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-wordmark">
              <span className="moon">☾</span> frosted moon
            </p>
            <p className="footer-line">
              A little eggless home bakery in Kota, made with love and baked
              just for you.
            </p>
          </div>
          <div className="footer-col">
            <h4>Treats</h4>
            <a href="#menu">Dessert jars</a>
            <a href="#menu">Cookies</a>
            <a href="#menu">Bento cakes</a>
          </div>
          <div className="footer-col">
            <h4>Say hi</h4>
            <a href={waLink("Hi Frosted Moon ☾")} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/frosted__moon"
              target="_blank"
              rel="noopener noreferrer"
            >
              @frosted__moon
            </a>
            <a href="#workshop">Workshops</a>
          </div>
          <div className="footer-col">
            <h4>Moon notes</h4>
            <form
              className="footer-signup"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="input footer-input"
                type="email"
                placeholder="Your email"
                aria-label="Email for moon notes"
              />
              <button className="btn-primary btn-join" type="submit">
                Join
              </button>
            </form>
          </div>
        </div>
        <p className="footer-bottom">
          Frosted Moon · Baked with love in Kota, Rajasthan
        </p>
      </footer>
    </div>
  );
}
