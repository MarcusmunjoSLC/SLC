"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  lineOne: string;
  lineTwo?: string;
  colour: string;
  colourName: string;
};

type BagItem = Product & { size: string };

const products: Product[] = [
  { id: "peace-over-everything", name: "Peace Over Everything Tee", lineOne: "SOFT LIFE CLUB", lineTwo: "peace over everything", colour: "#eeeae0", colourName: "Cream" },
  { id: "pay-me-yet", name: "Pay Me Yet Tee", lineOne: "WHY ARE YOU SPEAKING TO ME?", lineTwo: "YOU DIDN’T PAY ME YET.", colour: "#42372f", colourName: "Mocha" },
  { id: "rich-in-peace", name: "Rich In Peace Tee", lineOne: "RICH IN PEACE", lineTwo: "SOFT LIFE CLUB", colour: "#e7e0d5", colourName: "Sand" },
  { id: "protect-your-peace", name: "Protect Your Peace Tee", lineOne: "PROTECT YOUR PEACE.", lineTwo: "COLLECT YOUR MONEY.", colour: "#e9e3d8", colourName: "Cream" },
  { id: "dont-chase", name: "I Don’t Chase Tee", lineOne: "I DON’T CHASE.", lineTwo: "I CHOOSE.", colour: "#352b26", colourName: "Mocha" },
  { id: "bare-minimum", name: "Bare Minimum Tee", lineOne: "LUXURY IS THE", lineTwo: "BARE MINIMUM.", colour: "#f4f3ef", colourName: "White" },
  { id: "moisturized", name: "Too Moisturized Tee", lineOne: "TOO MOISTURIZED", lineTwo: "TO ARGUE.", colour: "#151515", colourName: "Black" },
  { id: "fully-booked", name: "Fully Booked Tee", lineOne: "MY SCHEDULE IS FULLY BOOKED…", lineTwo: "WITH DOING NOTHING.", colour: "#ece7dd", colourName: "Cream" },
  { id: "hard-boundaries", name: "Hard Boundaries Tee", lineOne: "SOFT LIFE.", lineTwo: "HARD BOUNDARIES.", colour: "#d8cdbd", colourName: "Sand" },
];

const sizes = ["S", "M", "L", "XL"];

export default function Storefront() {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = window.localStorage.getItem("soft-life-club-bag");
    if (stored) setBag(JSON.parse(stored));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("soft-life-club-bag", JSON.stringify(bag));
  }, [bag]);

  const groupedBag = useMemo(() => {
    return bag.reduce<Record<string, { item: BagItem; quantity: number }>>((grouped, item) => {
      const key = `${item.id}-${item.size}`;
      grouped[key] ??= { item, quantity: 0 };
      grouped[key].quantity += 1;
      return grouped;
    }, {});
  }, [bag]);

  function addToBag(product: Product) {
    const size = selectedSize[product.id];
    if (!size) return;
    setBag((current) => [...current, { ...product, size }]);
    setBagOpen(true);
  }

  function removeOne(id: string, size: string) {
    setBag((current) => {
      const index = current.findIndex((item) => item.id === id && item.size === size);
      if (index < 0) return current;
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  return (
    <main>
      <div className="announcement">FREE DELIVERY DETAILS TO BE CONFIRMED</div>
      <header className="site-header">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <span /> <span />
        </button>
        <a className="wordmark" href="#top" aria-label="Soft Life Club home">
          <Image src="/soft-life-club-logo.png" alt="Soft Life Club" width={1200} height={1300} priority className="brand-logo" />
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          <a href="#collection" onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our world</a>
          <a href="#details" onClick={() => setMenuOpen(false)}>Details</a>
        </nav>
        <button className="bag-button" onClick={() => setBagOpen(true)} aria-label={`Open bag with ${bag.length} items`}>
          BAG <span>{String(bag.length).padStart(2, "0")}</span>
        </button>
      </header>

      <section className="hero" id="top">
        <Image src="/collection-board.jpeg" alt="Soft Life Club oversized T-shirt collection in cream, mocha, sand and black" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p>EST. 2024 · THE OVERSIZED COLLECTION</p>
          <h1>Luxury comfort.<br />Expensive peace.</h1>
          <a className="hero-link" href="#collection">SHOP THE COLLECTION</a>
        </div>
      </section>

      <section className="intro" id="story">
        <p className="eyebrow">SOFT LIFE IS A LIFESTYLE</p>
        <h2>Dress for the life<br />you refuse to rush.</h2>
        <p className="intro-copy">Premium heavyweight cotton. An oversized fit. Quiet statements for people with hard boundaries.</p>
      </section>

      <section className="collection" id="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE FIRST DROP</p>
            <h2>Choose your peace.</h2>
          </div>
          <p>{products.length} pieces · S—XL</p>
        </div>

        <div className="product-grid">
          {products.map((product, index) => {
            const isDark = ["#42372f", "#352b26", "#151515"].includes(product.colour);
            return (
              <article className="product" key={product.id}>
                <div className={`product-art ${isDark ? "dark" : ""}`} style={{ backgroundColor: product.colour }}>
                  <span className="product-number">0{index + 1}</span>
                  <div>
                    <strong>{product.lineOne}</strong>
                    {product.lineTwo && <span>{product.lineTwo}</span>}
                  </div>
                  <small>SLC</small>
                </div>
                <div className="product-info">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.colourName} · Price to be added</p>
                  </div>
                  <fieldset>
                    <legend>Select size</legend>
                    <div className="size-row">
                      {sizes.map((size) => (
                        <button
                          className={selectedSize[product.id] === size ? "selected" : ""}
                          key={size}
                          onClick={() => setSelectedSize((current) => ({ ...current, [product.id]: size }))}
                          aria-pressed={selectedSize[product.id] === size}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <button className="add-button" disabled={!selectedSize[product.id]} onClick={() => addToBag(product)}>
                    {selectedSize[product.id] ? "ADD TO BAG" : "CHOOSE A SIZE"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="details" id="details">
        <div><span>01</span><h3>100% cotton</h3><p>Premium heavyweight fabric made for structure and softness.</p></div>
        <div><span>02</span><h3>Oversized fit</h3><p>A relaxed silhouette designed for everyday comfort.</p></div>
        <div><span>03</span><h3>Embroidered logo</h3><p>Finished with the signature Soft Life Club mark.</p></div>
      </section>

      <footer>
        <a className="footer-mark" href="#top" aria-label="Soft Life Club home">
          <Image src="/soft-life-club-logo.png" alt="Soft Life Club" width={1200} height={1300} className="footer-logo" />
        </a>
        <div><p>SOFT LIFE CLUB</p><p>Luxury comfort. Expensive peace.</p></div>
        <div className="footer-links"><a href="#collection">Shop</a><a href="mailto:hello@softlifeclub.com">Contact</a><a href="#top">Back to top</a></div>
      </footer>

      {bagOpen && <button className="backdrop" onClick={() => setBagOpen(false)} aria-label="Close bag" />}
      <aside className={bagOpen ? "bag-drawer open" : "bag-drawer"} aria-hidden={!bagOpen}>
        <div className="bag-heading"><h2>Your bag</h2><button onClick={() => setBagOpen(false)} aria-label="Close bag">×</button></div>
        {bag.length === 0 ? (
          <div className="empty-bag"><p>Your bag is taking it easy.</p><button onClick={() => setBagOpen(false)}>CONTINUE SHOPPING</button></div>
        ) : (
          <div className="bag-content">
            <div className="bag-items">
              {Object.values(groupedBag).map(({ item, quantity }) => (
                <div className="bag-item" key={`${item.id}-${item.size}`}>
                  <div className="bag-swatch" style={{ backgroundColor: item.colour }} />
                  <div><h3>{item.name}</h3><p>{item.colourName} · Size {item.size}</p><p>Quantity {quantity}</p></div>
                  <button onClick={() => removeOne(item.id, item.size)} aria-label={`Remove one ${item.name}`}>−</button>
                </div>
              ))}
            </div>
            <div className="checkout-panel">
              <p>Prices and Stripe checkout will activate once your real product prices are added.</p>
              <button disabled>CHECKOUT NOT YET ACTIVE</button>
            </div>
          </div>
        )}
      </aside>
    </main>
  );
}
