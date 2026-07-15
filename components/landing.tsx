"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CONTENT,
  menuById,
  type SiteContent,
} from "@/lib/site-content";
import { useEditable, useEditor } from "@/components/editor/editor-context";
import { EditableText } from "@/components/editor/editable-text";
import { EditablePrice } from "@/components/editor/editable-price";
import { EditableMedia } from "@/components/editor/editable-media";
import {
  useListControls,
  ListItemControls,
  AddItemButton,
} from "@/components/editor/list-controls";

type Basket = Record<string, number>;
type OrderForm = { name: string; date: string; phone: string; address: string; notes: string };

const EMPTY_FORM: OrderForm = { name: "", date: "", phone: "", address: "", notes: "" };

const NAV_HREFS = ["#menu", "#workshop", "#story"];
const VALUE_ICONS = [
  { icon: "☾", cls: "icon-mint" },
  { icon: "♥", cls: "icon-blush" },
  { icon: "✦", cls: "icon-butter" },
];
const CHIP_CLASSES = ["chip-mint", "chip-blush", "chip-butter"];
const FOOTER_TREAT_HREFS = ["#menu", "#menu", "#menu"];

/** A nav / footer link: a real anchor on the public site, an editable label in edit mode. */
function EditableLink({
  href,
  path,
  value,
  className,
  editing,
}: {
  href: string;
  path: string;
  value: string;
  className?: string;
  editing: boolean;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={editing ? (e) => e.preventDefault() : undefined}
    >
      <EditableText as="span" rich={false} path={path} value={value} placeholder="Link" />
    </a>
  );
}

/**
 * The whole Frosted Moon homepage, driven by editable content. On the public
 * route it renders `content` straight through. Wrapped in <SiteEditor> (which
 * provides the editor context) the same markup becomes editable in place.
 */
export function Landing({ content }: { content: SiteContent }) {
  const { editing } = useEditor();

  // Editable slices — reactive in edit mode, the server prop otherwise.
  const nav = useEditable("nav", content.nav, DEFAULT_CONTENT.nav);
  const hero = useEditable("hero", content.hero, DEFAULT_CONTENT.hero);
  const values = useEditable("values", content.values, DEFAULT_CONTENT.values);
  const menu = useEditable("menu", content.menu, DEFAULT_CONTENT.menu);
  const featured = useEditable("featured", content.featured, DEFAULT_CONTENT.featured);
  const order = useEditable("order", content.order, DEFAULT_CONTENT.order);
  const workshop = useEditable("workshop", content.workshop, DEFAULT_CONTENT.workshop);
  const story = useEditable("story", content.story, DEFAULT_CONTENT.story);
  const footer = useEditable("footer", content.footer, DEFAULT_CONTENT.footer);
  const categories = useEditable("categories", content.categories, DEFAULT_CONTENT.categories);
  const whatsappNumber = useEditable(
    "whatsappNumber",
    content.whatsappNumber,
    DEFAULT_CONTENT.whatsappNumber
  );

  const byId = useMemo(() => menuById(categories), [categories]);
  const phone = whatsappNumber || "919999999999";
  const waLink = (message: string) =>
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const featuredItem = byId[featured.itemId];

  // ---- basket (unchanged behaviour) ---------------------------------------
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

  const add = (id: string) => setBasket((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));
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
        .filter(([id]) => byId[id])
        .map(([id, qty]) => ({ ...byId[id], qty })),
    [basket, byId]
  );

  const basketCount = basketItems.reduce((sum, item) => sum + item.qty, 0);
  const basketTotal = basketItems.reduce((sum, item) => sum + item.qty * item.price, 0);

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
      `Deliver to: ${form.address}`,
      `Notes: ${form.notes}`,
    ].join("\n");
    return waLink(message);
  }, [basketItems, basketTotal, form, phone]);

  const setFormField =
    (field: keyof OrderForm) =>
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
            {nav.links.map((label, i) => (
              <EditableLink
                key={i}
                href={NAV_HREFS[i] ?? "#"}
                path={`nav.links.${i}`}
                value={label}
                editing={editing}
              />
            ))}
          </div>
        </div>
        <div className="nav-right">
          <EditableText
            className="nav-city"
            rich={false}
            path="nav.city"
            value={nav.city}
            placeholder="City"
          />
          <a href="#order" className="basket-pill">
            Basket ({basketCount})
          </a>
        </div>
      </nav>

      {/* 2. Hero */}
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">
            <span className="moon">☾</span>{" "}
            <EditableText path="hero.eyebrow" value={hero.eyebrow} placeholder="Eyebrow" />
          </p>
          <h1>
            <EditableText path="hero.headline" value={hero.headline} placeholder="Headline" />
            <br />
            <em>
              <EditableText
                path="hero.headlineEm"
                value={hero.headlineEm}
                placeholder="Emphasis line"
              />
            </em>
          </h1>
          <EditableText
            as="p"
            className="hero-body"
            path="hero.body"
            value={hero.body}
            placeholder="Intro paragraph"
          />
          <div className="hero-buttons">
            <a href="#menu" className="btn-primary" onClick={editing ? (e) => e.preventDefault() : undefined}>
              <EditableText rich={false} path="hero.ctaPrimary" value={hero.ctaPrimary} placeholder="Button" />
            </a>
            <a href="#workshop" className="link-underline" onClick={editing ? (e) => e.preventDefault() : undefined}>
              <EditableText rich={false} path="hero.ctaSecondary" value={hero.ctaSecondary} placeholder="Link" />
            </a>
          </div>
        </div>
        <div className="hero-image">
          <EditableMedia path="hero.image">
            <Image
              src={hero.image}
              alt="Rasmalai tres leches dessert jar"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              priority
            />
          </EditableMedia>
        </div>
      </header>

      {/* 3. Eggless value strip */}
      <section className="values">
        {values.map((value, i) => (
          <div className="value" key={i}>
            <span className={`value-icon ${VALUE_ICONS[i]?.cls ?? "icon-mint"}`}>
              {VALUE_ICONS[i]?.icon ?? "☾"}
            </span>
            <div>
              <EditableText as="h3" path={`values.${i}.title`} value={value.title} placeholder="Title" />
              <EditableText as="p" path={`values.${i}.body`} value={value.body} placeholder="Detail" />
            </div>
          </div>
        ))}
      </section>

      {/* 4. Menu */}
      <section id="menu" className="menu">
        <div className="section-header">
          <span className="moon section-moon">☾</span>
          <EditableText as="h2" path="menu.heading" value={menu.heading} placeholder="Menu heading" />
          <EditableText as="p" path="menu.sub" value={menu.sub} placeholder="Menu subheading" />
        </div>

        <div className="featured">
          <div className="featured-image">
            <EditableMedia path="featured.image">
              <Image
                src={featured.image}
                alt={featuredItem?.name ?? "Featured treat"}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </EditableMedia>
          </div>
          <div className="featured-body">
            <EditableText
              className="featured-tag"
              path="featured.tag"
              value={featured.tag}
              placeholder="Tag"
            />
            <h3>{featuredItem?.name ?? "Featured treat"}</h3>
            <EditableText
              as="p"
              className="featured-tagline"
              path="featured.tagline"
              value={featured.tagline}
              placeholder="Short tagline"
            />
            <EditableText
              as="p"
              className="featured-copy"
              path="featured.copy"
              value={featured.copy}
              placeholder="Description"
            />
            <div className="featured-cta">
              <span className="featured-price">₹{featuredItem?.price ?? 0}</span>
              <button
                className="btn-primary"
                onClick={() => featuredItem && add(featuredItem.id)}
                disabled={!featuredItem}
              >
                Add to basket
              </button>
            </div>
            {editing && (
              <p className="fm-note">
                This highlight follows the “{featuredItem?.name ?? featured.itemId}” item —
                edit its name and price down in the menu.
              </p>
            )}
          </div>
        </div>

        {categories.map((category, ci) => (
          <CategoryBlock key={ci} category={category} ci={ci} editing={editing} add={add} />
        ))}
      </section>

      {/* 5. Order */}
      <section id="order" className="order">
        <div className="order-basket">
          <h2 className="order-title">
            <span className="moon">☾</span>{" "}
            <EditableText path="order.basketTitle" value={order.basketTitle} placeholder="Basket title" />
          </h2>
          <EditableText
            as="p"
            className="order-helper"
            path="order.basketHelper"
            value={order.basketHelper}
            placeholder="Helper text"
          />
          {basketItems.length === 0 ? (
            <EditableText
              as="p"
              className="basket-empty"
              path="order.emptyText"
              value={order.emptyText}
              placeholder="Empty basket text"
            />
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
                    <span className="basket-line-total">₹{item.qty * item.price}</span>
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
          <EditableText
            as="h2"
            className="order-title"
            path="order.formTitle"
            value={order.formTitle}
            placeholder="Form title"
          />
          <input
            className="input"
            type="text"
            placeholder="What is your name?"
            value={form.name}
            onChange={setFormField("name")}
          />
          <input
            className="input"
            type="text"
            placeholder="When would you like it?"
            value={form.date}
            onChange={setFormField("date")}
          />
          <input
            className="input"
            type="tel"
            placeholder="Your phone number"
            value={form.phone}
            onChange={setFormField("phone")}
          />
          <input
            className="input"
            type="text"
            placeholder="Where should we deliver this to?"
            value={form.address}
            onChange={setFormField("address")}
          />
          <textarea
            className="input"
            rows={2}
            placeholder="Want a message on the cake, or have an allergy? Tell us here."
            value={form.notes}
            onChange={setFormField("notes")}
          />
          {basketItems.length > 0 ? (
            <a
              className="btn-primary btn-send"
              href={orderHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={editing ? (e) => e.preventDefault() : undefined}
            >
              <EditableText rich={false} path="order.sendLabel" value={order.sendLabel} placeholder="Send button" />
            </a>
          ) : (
            <EditableText
              className="btn-disabled"
              rich={false}
              path="order.disabledLabel"
              value={order.disabledLabel}
              placeholder="Disabled label"
            />
          )}
        </div>
      </section>

      {/* 6. Workshop */}
      <section id="workshop" className="workshop">
        <div className="workshop-photo">
          <EditableMedia path="workshop.image">
            <Image
              src={workshop.image}
              alt="Cookie paintings on mini easels at a Frosted Moon workshop"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </EditableMedia>
        </div>
        <div className="workshop-body">
          <EditableText className="featured-tag" path="workshop.tag" value={workshop.tag} placeholder="Tag" />
          <EditableText as="h2" path="workshop.heading" value={workshop.heading} placeholder="Heading" />
          <EditableText
            as="p"
            className="workshop-copy"
            path="workshop.copy"
            value={workshop.copy}
            placeholder="Description"
          />
          <div className="workshop-chips">
            {workshop.chips.map((chip, i) => (
              <EditableText
                key={i}
                className={`chip ${CHIP_CLASSES[i] ?? "chip-mint"}`}
                rich={false}
                path={`workshop.chips.${i}`}
                value={chip}
                placeholder="Chip"
              />
            ))}
          </div>
          <a
            className="btn-primary btn-send"
            href={waLink(
              "Hi Frosted Moon ☾ I would like to join the cookie painting workshop. Are there seats left?"
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={editing ? (e) => e.preventDefault() : undefined}
          >
            <EditableText rich={false} path="workshop.ctaLabel" value={workshop.ctaLabel} placeholder="Button" />
          </a>
        </div>
      </section>

      {/* 7. Story */}
      <section id="story" className="story">
        <span className="moon story-moon">☾</span>
        <EditableText
          as="p"
          className="story-statement"
          path="story.statement"
          value={story.statement}
          placeholder="Story"
        />
        <EditableText
          as="p"
          className="story-signoff"
          path="story.signoff"
          value={story.signoff}
          placeholder="Sign-off"
        />
      </section>

      {/* 8. Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-wordmark">
              <span className="moon">☾</span> frosted moon
            </p>
            <EditableText
              as="p"
              className="footer-line"
              path="footer.line"
              value={footer.line}
              placeholder="Footer blurb"
            />
          </div>
          <div className="footer-col">
            <EditableText as="h4" path="footer.treatsHeading" value={footer.treatsHeading} placeholder="Heading" />
            {footer.treatsLinks.map((label, i) => (
              <EditableLink
                key={i}
                href={FOOTER_TREAT_HREFS[i] ?? "#menu"}
                path={`footer.treatsLinks.${i}`}
                value={label}
                editing={editing}
              />
            ))}
          </div>
          <div className="footer-col">
            <EditableText as="h4" path="footer.sayHiHeading" value={footer.sayHiHeading} placeholder="Heading" />
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
            <EditableText
              as="h4"
              path="footer.moonNotesHeading"
              value={footer.moonNotesHeading}
              placeholder="Heading"
            />
            <form className="footer-signup" onSubmit={(e) => e.preventDefault()}>
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
        <EditableText
          as="p"
          className="footer-bottom"
          path="footer.bottom"
          value={footer.bottom}
          placeholder="Bottom line"
        />
      </footer>
    </div>
  );
}

/** One menu category. Split out so item add/remove/reorder controls are local. */
function CategoryBlock({
  category,
  ci,
  editing,
  add,
}: {
  category: SiteContent["categories"][number];
  ci: number;
  editing: boolean;
  add: (id: string) => void;
}) {
  const list = useListControls(`categories.${ci}.items`);

  const addItem = () =>
    list.add({
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: "New treat",
      description: "A little description of this treat.",
      price: 0,
    });

  return (
    <div className="category">
      <div className="category-header">
        <EditableText
          className="category-chip"
          rich={false}
          path={`categories.${ci}.title`}
          value={category.title}
          placeholder="Category name"
        />
        <EditableText
          className="category-blurb"
          path={`categories.${ci}.blurb`}
          value={category.blurb}
          placeholder="Short blurb"
        />
      </div>
      <div className="item-grid">
        {category.items.map((item, ii) => (
          <div key={item.id} className={`item${editing ? " fm-relative" : ""}`}>
            {editing && (
              <ListItemControls
                index={ii}
                length={list.length}
                onMove={list.move}
                onRemove={list.remove}
              />
            )}
            <div className="item-photo">
              <EditableMedia path={`categories.${ci}.items.${ii}.image`}>
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="104px" />
                ) : (
                  <div className="placeholder fm-photo-fill">
                    <span>soon</span>
                  </div>
                )}
              </EditableMedia>
            </div>
            <div className="item-body">
              <EditableText
                as="h4"
                rich={false}
                path={`categories.${ci}.items.${ii}.name`}
                value={item.name}
                placeholder="Treat name"
              />
              <EditableText
                as="p"
                path={`categories.${ci}.items.${ii}.description`}
                value={item.description}
                placeholder="Description"
              />
              <div className="item-row">
                <EditablePrice
                  className="item-price"
                  path={`categories.${ci}.items.${ii}.price`}
                  value={item.price}
                />
                <button className="btn-ghost" onClick={() => add(item.id)}>
                  Add +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fm-add-row">
          <AddItemButton label="Add a treat" onClick={addItem} />
        </div>
      )}
    </div>
  );
}
