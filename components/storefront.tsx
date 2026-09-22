"use client";

import Image from "next/image";
import { areas } from "./areas";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { products, sizes, categories, categoryOf, storyFor, type Product, type BagItem } from "./catalogue";

function ShirtPhoto({ index, name }: { index: number; name: string }) {
  const product = products[index];
  return <Image src={product.image || `/tees/${product.id}.png`} alt={name + " — product render"} width={1122} height={1402} className="concept-photo" sizes="(max-width:760px) 100vw, 50vw" />;
}

export default function Storefront({ productId, categoryId, children, wishlistPage = false }: { productId?: string; categoryId?: string; children?: ReactNode; wishlistPage?: boolean }) {
  const currentProduct = products.find((product) => product.id === productId);
  const category = categories.find((item) => item.id === categoryId);
  const listedProducts = products.filter((product) => categoryOf(product) === categoryId);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistReady, setWishlistReady] = useState(false);
  const [wishlistNotice, setWishlistNotice] = useState("");
  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem("slc-wishlist") || "[]");
      if (Array.isArray(stored)) setWishlist([...new Set(stored.filter((id): id is string => typeof id === "string" && products.some(product => product.id === id)))]);
    } catch { /* Start with an empty wishlist if storage is unavailable. */ }
    setWishlistReady(true);
  }, []);
  function toggleWishlist(product: Product) {
    const saved = wishlist.includes(product.id);
    const next = saved ? wishlist.filter(id => id !== product.id) : [...wishlist, product.id];
    setWishlist(next);
    try {
      localStorage.setItem("slc-wishlist", JSON.stringify(next));
      setWishlistNotice(saved ? `${product.name} removed from your wishlist.` : `${product.name} saved to your wishlist.`);
    } catch { setWishlistNotice("Saved for this page only. Your browser could not remember this wishlist."); }
  }
  function wishlistButton(product: Product) {
    const saved = wishlist.includes(product.id);
    return <button type="button" className="wishlist-toggle" disabled={!wishlistReady} aria-pressed={saved} onClick={() => toggleWishlist(product)} aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} wishlist`}>
      <span aria-hidden="true">{saved ? "♥" : "♡"}</span> {saved ? "Saved" : "Save to wishlist"}
    </button>;
  }
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
          {areas.map((area) => <a key={area.id} href={`/${area.id}`} onClick={() => setMenuOpen(false)}>{area.name}</a>)}
        </nav>
        <a className="wishlist-nav" href="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}>♡ <span>{wishlist.length}</span></a>
        <button className="bag-button" onClick={() => setBagOpen(true)} aria-label={`Open bag with ${bag.length} items`}>
          BAG <span>{String(bag.length).padStart(2, "0")}</span>
        </button>
      </header>
      {!children && <nav className="category-nav" aria-label="Wardrobe categories">
        <a href="/wardrobe">Wardrobe</a>
        {categories.map((item) => <a href={`/shop/${item.id}`} key={item.id} aria-current={categoryId === item.id ? "page" : undefined}>{item.name}</a>)}
      </nav>}

      <p className="wishlist-announcement" role="status">{wishlistNotice}</p>
      {children || (wishlistPage ? <section className="collection wishlist-page">
        <div className="section-heading"><h1>Your wishlist.</h1></div>
        <p>Keep your favourites here. Saved on this browser.</p>
        {!wishlistReady ? <p>Loading your wishlist…</p> : wishlist.length === 0 ? <p>No favourites yet. <a href="/wardrobe">Explore the Wardrobe →</a></p> : <div className="product-grid">
          {wishlist.map(id => products.find(product => product.id === id)!).map(product => <article className="product" key={product.id}>
            <a className="product-photo" href={`/products/${product.id}`}><ShirtPhoto index={products.indexOf(product)} name={product.name} /></a>
            <h2><a href={`/products/${product.id}`}>{product.name}</a></h2>
            <p>{product.colourName}</p>
            {wishlistButton(product)}
            <a className="view-product" href={`/products/${product.id}`}>View details →</a>
          </article>)}
        </div>}
      </section> : currentProduct ? (
        <section className="product-page">
          <a className="back-link" href={`/shop/${categoryOf(currentProduct)}`}>← Back to {categories.find((item) => item.id === categoryOf(currentProduct))?.name.toLowerCase()}</a>
          <div className="product-detail-grid">
            <div className="detail-photo">
              <ShirtPhoto index={products.indexOf(currentProduct)} name={currentProduct.name} />
              <p className="render-caption">Design visualisation. Final product details may vary.</p>
            </div>
            <div className="detail-copy">
              <p className="eyebrow">{categories.find((item) => item.id === categoryOf(currentProduct))?.name}</p>
              <h1>{currentProduct.name}</h1>
              <blockquote className="product-quote">{currentProduct.lineOne} {currentProduct.lineTwo}</blockquote>
              <div className="supporting-lines">{storyFor(currentProduct).map((line) => <p key={line}>{line}</p>)}</div>
              <p>{currentProduct.description || "An oversized heavyweight cotton tee with a statement design and the Soft Life Club signature."}</p>
              <dl className="product-facts">
                <div><dt>Colour shown</dt><dd>{currentProduct.colourName}</dd></div>
                {!currentProduct.concept && <>
                <div><dt>Material</dt><dd>100% cotton</dd></div>
                <div><dt>Fit</dt><dd>Oversized</dd></div>
                <div><dt>Fabric</dt><dd>Premium heavyweight</dd></div>
                <div><dt>Finish</dt><dd>Embroidered logo</dd></div>
                </>}
                {currentProduct.concept && <div><dt>Product details</dt><dd>Final materials, sizing and specifications to be confirmed.</dd></div>}
              </dl>
              {!currentProduct.concept ? <>
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
              </> : null}
              {wishlistButton(currentProduct)}
              <p className="availability-note">This collection is not available to order yet.</p>
            </div>
          </div>
        </section>
      ) : (<>
      <section className="hero">
        <div className="hero-copy">
          <p>SOFT LIFE CLUB</p>
          <h1>{category ? category.name : "The SLC Wardrobe."}</h1>
          <p className="hero-description">{category ? category.description : "Statement tees, everyday layers and the finishing touches."}</p>
          <a className="hero-link" href="#collection">SHOP THE COLLECTION</a>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="section-heading">
          <div>
            <h2>{category ? "The collection" : "Shop by category"}</h2>
          </div>
          <p>{category ? listedProducts.length + (listedProducts.length === 1 ? " piece" : " pieces") : "Five ways to wear SLC"}</p>
        </div>

        {!category ? <div className="product-grid category-grid">
          {categories.map((item) => <a className="category-card" key={item.id} href={`/shop/${item.id}`}>
            <div className="product-photo"><ShirtPhoto index={products.findIndex((product) => product.id === item.cover)} name={item.name} /></div>
            <h3>{item.name}</h3><p>{item.description}</p><span>Explore {item.name.toLowerCase()} →</span>
          </a>)}
        </div> : <div className="product-grid">
          {listedProducts.map((product) => {
            const index = products.indexOf(product);
            return (
              <article className="product" key={product.id}>
                <a className="product-photo" href={`/products/${product.id}`} aria-label={`View ${product.name}`}><ShirtPhoto index={index} name={product.name} /></a>
                <div className="product-info">
                  <div>
                    <h3><a href={`/products/${product.id}`}>{product.name}</a></h3>
                    <p>{product.colourName}</p>
                  </div>
                  <p className="card-quote">{product.lineOne} {product.lineTwo}</p>
                  {wishlistButton(product)}
                  <a className="view-product" href={`/products/${product.id}`}>View details →</a>
                </div>
              </article>
            );
          })}
        </div>}
      </section>

      </>))}
      {!children && <section className="community-banner"><p className="eyebrow">BE PART OF WHAT’S NEXT</p><h2>Join SLC.</h2><p>Get updates as Wardrobe, Love, Escapes and Society grow.</p><a href="/join">Join the waitlist →</a></section>}

      <footer>
        <a className="footer-mark" href="#top" aria-label="Soft Life Club home">
          <Image src="/soft-life-club-logo.png" alt="Soft Life Club" width={1200} height={1300} className="footer-logo" />
        </a>
        <div><p>SOFT LIFE CLUB</p><p>Luxury comfort. Expensive peace.</p></div>
        <div className="footer-links"><a href="/wardrobe">Wardrobe</a><a href="/society">Society</a><a href="/partners">Partner with SLC</a><a href="/join">Join SLC</a></div>
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
              <button disabled>ORDERING UNAVAILABLE</button>
            </div>
          </div>
        )}
      </aside>
    </main>
  );
}
