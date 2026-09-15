"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { products, sizes, type Product, type BagItem } from "./catalogue";

// Display individual regions of the original supplied board without altering it.
const frames = [
  [0, 0, 471, 647], [476, 0, 439, 647], [921, 0, 481, 647],
  [349, 658, 285, 230], [603, 658, 283, 230], [850, 658, 285, 230],
  [350, 889, 286, 231], [603, 889, 282, 231], [851, 889, 285, 231],
];
function ShirtPhoto({ index, name }: { index: number; name: string }) {
  const [x, y, width, height] = frames[index];
  return <div className="shirt-photo" style={{ aspectRatio: `${width}/${height}` }}>
    {/* The source is a contact sheet; CSS reveals only this shirt's region. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/collection-board.jpeg" alt={name} loading="lazy"
      style={{ width: `${1402 / width * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} />
  </div>;
}

export default function Storefront({ productId }: { productId?: string }) {
  const currentProduct = products.find((product) => product.id === productId);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagReady, setBagReady] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem("soft-life-club-bag") || "[]");
      if (Array.isArray(stored)) setBag(stored.flatMap((item) => {
        const product = products.find((product) => product.id === item?.id);
        return product && sizes.includes(item.size) ? [{ ...product, size: item.size }] : [];
      }));
    } catch { /* An unavailable or invalid local bag starts empty. */ }
    setBagReady(true);
  }, []);

  useEffect(() => {
    if (bagReady) {
      try { window.localStorage.setItem("soft-life-club-bag", JSON.stringify(bag)); } catch {}
    }
  }, [bag, bagReady]);

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
    <main id="top">
      <header className="site-header">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <span /> <span />
        </button>
        <a className="wordmark" href="/" aria-label="Soft Life Club home">
          <Image src="/soft-life-club-logo.png" alt="Soft Life Club" width={1200} height={1300} priority className="brand-logo" />
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          <a href="/#collection" onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="#details" onClick={() => setMenuOpen(false)}>Details</a>
        </nav>
        <button className="bag-button" onClick={() => setBagOpen(true)} aria-label={`Open bag with ${bag.length} items`}>
          BAG <span>{String(bag.length).padStart(2, "0")}</span>
        </button>
      </header>

      {currentProduct ? (
        <section className="product-page">
          <a className="back-link" href="/#collection">← Back to collection</a>
          <div className="product-detail-grid">
            <div className="detail-photo">
              <ShirtPhoto index={products.indexOf(currentProduct)} name={currentProduct.name} />
            </div>
            <div className="detail-copy">
              <p className="eyebrow">THE OVERSIZED COLLECTION</p>
              <h1>{currentProduct.name}</h1>
              <p className="product-status">Coming soon</p>
              <p>An oversized heavyweight cotton tee featuring “{currentProduct.lineOne}{currentProduct.lineTwo ? " " + currentProduct.lineTwo : ""}”.</p>
              <dl className="product-facts">
                <div><dt>Colour shown</dt><dd>{currentProduct.colourName}</dd></div>
                <div><dt>Material</dt><dd>100% cotton</dd></div>
                <div><dt>Fit</dt><dd>Oversized</dd></div>
                <div><dt>Fabric</dt><dd>Premium heavyweight</dd></div>
                <div><dt>Finish</dt><dd>Embroidered logo</dd></div>
              </dl>
              <fieldset>
                <legend>Choose your size</legend>
                <div className="size-row">
                  {sizes.map((size) => <button key={size}
                    className={selectedSize[currentProduct.id] === size ? "selected" : ""}
                    aria-pressed={selectedSize[currentProduct.id] === size}
                    onClick={() => setSelectedSize((current) => ({ ...current, [currentProduct.id]: size }))}>{size}</button>)}
                </div>
              </fieldset>
              <button className="add-button" disabled={!bagReady || !selectedSize[currentProduct.id]} onClick={() => addToBag(currentProduct)}>
                {selectedSize[currentProduct.id] ? "ADD TO BAG" : "CHOOSE A SIZE"}
              </button>
              <p className="availability-note">This collection is not available to order yet.</p>
            </div>
          </div>
        </section>
      ) : (<>
      <section className="hero">
        <div className="hero-copy">
          <p>SOFT LIFE CLUB</p>
          <h1>Oversized T-shirts.</h1>
          <p className="hero-description">100% cotton. Heavyweight comfort.</p>
          <a className="hero-link" href="#collection">SHOP THE COLLECTION</a>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="section-heading">
          <div>
            <h2>Shop the collection</h2>
          </div>
          <p>{products.length} pieces · S—XL</p>
        </div>

        <div className="product-grid">
          {products.map((product, index) => {
            return (
              <article className="product" key={product.id}>
                <a className="product-photo" href={`/products/${product.id}`} aria-label={`View ${product.name}`}><ShirtPhoto index={index} name={product.name} /></a>
                <div className="product-info">
                  <div>
                    <h3><a href={`/products/${product.id}`}>{product.name}</a></h3>
                    <p>{product.colourName} · Coming soon</p>
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
                  <button className="add-button" disabled={!bagReady || !selectedSize[product.id]} onClick={() => addToBag(product)}>
                    {selectedSize[product.id] ? "ADD TO BAG" : "CHOOSE A SIZE"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      </>)}
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
        <div className="footer-links"><a href="/#collection">Shop</a><a href="#top">Back to top</a></div>
      </footer>

      {bagOpen && <button className="backdrop" onClick={() => setBagOpen(false)} aria-label="Close bag" />}
      <aside className={bagOpen ? "bag-drawer open" : "bag-drawer"} aria-hidden={!bagOpen}>
        <div className="bag-heading"><h2>Your bag</h2><button onClick={() => setBagOpen(false)} aria-label="Close bag">×</button></div>
        {bag.length === 0 ? (
          <div className="empty-bag"><p>Your bag is empty.</p><button onClick={() => setBagOpen(false)}>CONTINUE SHOPPING</button></div>
        ) : (
          <div className="bag-content">
            <div className="bag-items">
              {Object.values(groupedBag).map(({ item, quantity }) => (
                <div className="bag-item" key={`${item.id}-${item.size}`}>
                  <div className="bag-swatch"><ShirtPhoto index={products.findIndex((product) => product.id === item.id)} name={item.name} /></div>
                  <div><h3>{item.name}</h3><p>{item.colourName} · Size {item.size}</p><p>Quantity {quantity}</p></div>
                  <button onClick={() => removeOne(item.id, item.size)} aria-label={`Remove one ${item.name}`}>−</button>
                </div>
              ))}
            </div>
            <div className="checkout-panel">
              <p>This collection is not available to order yet.</p>
              <button disabled>COMING SOON</button>
            </div>
          </div>
        )}
      </aside>
    </main>
  );
}
