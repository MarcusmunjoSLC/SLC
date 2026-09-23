"use client";

import Image from "next/image";
import { useWishlist } from "./use-wishlist";
import SizeGuide from "./size-guide";
import { areas } from "./areas";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  products as fallbackProducts,
  sizes as fallbackSizes,
  categories,
  categoryOf,
  storyFor,
  type Product,
  type BagItem,
} from "./catalogue";

import { getSupabase } from "../lib/supabase-browser";

type StoreProduct = Product & {
  sizes?: string[];
  stock?: number;
  priceAmount?: number | null;
  stripePriceId?: string | null;
};

function ShirtPhoto({
  product,
  name,
}: {
  product: StoreProduct;
  name: string;
}) {
  return (
    <Image
      src={product.image || `/tees/${product.id}.png`}
      alt={`${name} — product render`}
      width={1122}
      height={1402}
      className="concept-photo"
      sizes="(max-width:760px) 100vw, 50vw"
    />
  );
}

function sizesFor(product: StoreProduct) {
  return product.sizes && product.sizes.length
    ? product.sizes
    : fallbackSizes;
}

function storyForProduct(product: StoreProduct): string[] {
  if (product.supporting && product.supporting.length) {
    return product.supporting;
  }

  const fallback = storyFor(product);

  return Array.isArray(fallback) ? fallback : [];
}

export default function Storefront({
  productId,
  categoryId,
  children,
  wishlistPage = false,
}: {
  productId?: string;
  categoryId?: string;
  children?: ReactNode;
  wishlistPage?: boolean;
}) {
  const [shopProducts, setShopProducts] =
    useState<StoreProduct[]>(fallbackProducts);

  const [productsReady, setProductsReady] =
    useState(false);

  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagReady, setBagReady] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedSize, setSelectedSize] =
    useState<Record<string, string>>({});

  const {
    wishlist,
    wishlistReady,
    loading: wishlistLoading,
    notice: wishlistNotice,
    toggleWishlist,
    user,
  } = useWishlist();

  /*
   * Load the live product catalogue from Supabase.
   *
   * If Supabase ever fails, the hard-coded catalogue
   * remains available as a backup.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const supabase = getSupabase();

        const { data, error } = await supabase
          .from("products")
          .select(`
            slug,
            name,
            line_one,
            line_two,
            colour,
            colour_name,
            category,
            image_url,
            concept,
            description,
            supporting,
            sizes,
            stock,
            price_amount,
            stripe_price_id
          `)
          .eq("is_active", true);

        if (error) {
          throw error;
        }

        const mapped: StoreProduct[] =
          (data || []).map((row) => ({
            /*
             * The website uses the slug as its product ID.
             * The actual Supabase UUID stays internal.
             */
            id: row.slug,
            name: row.name,
            lineOne: row.line_one || "",
            lineTwo: row.line_two || undefined,
            colour: row.colour || "#eeeeee",
            colourName: row.colour_name || "",
            category: row.category || "t-shirts",
            image: row.image_url || undefined,
            concept: Boolean(row.concept),
            description: row.description || undefined,

            supporting:
              Array.isArray(row.supporting) &&
              row.supporting.length >= 2
                ? [
                    row.supporting[0],
                    row.supporting[1],
                  ]
                : undefined,

            sizes: Array.isArray(row.sizes)
              ? row.sizes
              : fallbackSizes,

            stock: Number(row.stock || 0),

            priceAmount:
              row.price_amount === null
                ? null
                : Number(row.price_amount),

            stripePriceId:
              row.stripe_price_id || null,
          }));

        /*
         * Keep your original SLC catalogue order
         * where possible.
         *
         * Brand-new admin products appear afterwards.
         */
        const originalOrder = new Map(
          fallbackProducts.map((product, index) => [
            product.id,
            index,
          ])
        );

        mapped.sort((a, b) => {
          const aPosition =
            originalOrder.get(a.id) ?? 9999;

          const bPosition =
            originalOrder.get(b.id) ?? 9999;

          if (aPosition !== bPosition) {
            return aPosition - bPosition;
          }

          return a.name.localeCompare(b.name);
        });

        if (!cancelled) {
          setShopProducts(mapped);
        }
      } catch (error) {
        console.error(
          "Could not load SLC products from Supabase.",
          error
        );

        if (!cancelled) {
          setShopProducts(fallbackProducts);
        }
      } finally {
        if (!cancelled) {
          setProductsReady(true);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Restore the shopping bag only after the product
   * catalogue has loaded.
   */
  useEffect(() => {
    if (!productsReady) {
      return;
    }

    try {
      const stored = JSON.parse(
        window.localStorage.getItem(
          "soft-life-club-bag"
        ) || "[]"
      );

      if (Array.isArray(stored)) {
        setBag(
          stored.flatMap((item) => {
            const product =
              shopProducts.find(
                (candidate) =>
                  candidate.id === item?.id
              );

            if (!product) {
              return [];
            }

            const availableSizes =
              sizesFor(product);

            if (
              !availableSizes.includes(item.size)
            ) {
              return [];
            }

            return [
              {
                ...product,
                size: item.size,
              },
            ];
          })
        );
      }
    } catch {
      // Invalid local bag starts empty.
    }

    setBagReady(true);
  }, [productsReady, shopProducts]);

  useEffect(() => {
    if (bagReady) {
      try {
        window.localStorage.setItem(
          "soft-life-club-bag",
          JSON.stringify(bag)
        );
      } catch {}
    }
  }, [bag, bagReady]);

  const currentProduct =
    shopProducts.find(
      (product) => product.id === productId
    );

  const category =
    categories.find(
      (item) => item.id === categoryId
    );

  const listedProducts =
    shopProducts.filter(
      (product) =>
        categoryOf(product) === categoryId
    );

  const groupedBag = useMemo(() => {
    return bag.reduce<
      Record<
        string,
        {
          item: BagItem;
          quantity: number;
        }
      >
    >((grouped, item) => {
      const key = `${item.id}-${item.size}`;

      grouped[key] ??= {
        item,
        quantity: 0,
      };

      grouped[key].quantity += 1;

      return grouped;
    }, {});
  }, [bag]);

  function wishlistButton(
    product: StoreProduct
  ) {
    const saved =
      wishlist.includes(product.id);

    return (
      <button
        type="button"
        className="wishlist-toggle"
        disabled={!wishlistReady}
        aria-pressed={saved}
        onClick={() =>
          toggleWishlist(product)
        }
        aria-label={`${
          saved ? "Remove" : "Save"
        } ${product.name} ${
          saved ? "from" : "to"
        } wishlist`}
      >
        <span aria-hidden="true">
          {saved ? "♥" : "♡"}
        </span>{" "}
        {saved
          ? "Saved"
          : "Save to wishlist"}
      </button>
    );
  }

  function addToBag(product: StoreProduct) {
    const size =
      selectedSize[product.id];

    if (!size) {
      return;
    }

    setBag((current) => [
      ...current,
      {
        ...product,
        size,
      },
    ]);

    setBagOpen(true);
  }

  function removeOne(
    id: string,
    size: string
  ) {
    setBag((current) => {
      const index =
        current.findIndex(
          (item) =>
            item.id === id &&
            item.size === size
        );

      if (index < 0) {
        return current;
      }

      return current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );
    });
  }

  const wishlistProducts =
    wishlist
      .map((id) =>
        shopProducts.find(
          (product) =>
            product.id === id
        )
      )
      .filter(
        (
          product
        ): product is StoreProduct =>
          Boolean(product)
      );

  return (
    <main id="top">
      <header className="site-header">
        <button
          className="menu-button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation"
        >
          <span />
          <span />
        </button>

        <a
          className="wordmark"
          href="/"
          aria-label="Soft Life Club home"
        >
          <Image
            src="/soft-life-club-logo.png"
            alt="Soft Life Club"
            width={1200}
            height={1300}
            priority
            className="brand-logo"
          />
        </a>

        <nav
          className={
            menuOpen
              ? "nav open"
              : "nav"
          }
          aria-label="Main navigation"
        >
          {areas.map((area) => (
            <a
              key={area.id}
              href={`/${area.id}`}
              onClick={() =>
                setMenuOpen(false)
              }
            >
              {area.name}
            </a>
          ))}
        </nav>

        <a
          className="account-link"
          href="/account"
        >
          {user ? "Account" : "Log in"}
        </a>

        <a
          className="wishlist-nav"
          href="/wishlist"
          aria-label={`Wishlist with ${wishlist.length} items`}
        >
          ♡ <span>{wishlist.length}</span>
        </a>

        <button
          className="bag-button"
          onClick={() =>
            setBagOpen(true)
          }
          aria-label={`Open bag with ${bag.length} items`}
        >
          BAG{" "}
          <span>
            {String(
              bag.length
            ).padStart(2, "0")}
          </span>
        </button>
      </header>

      {!children && (
        <nav
          className="category-nav"
          aria-label="Wardrobe categories"
        >
          <a href="/wardrobe">
            Wardrobe
          </a>

          {categories.map((item) => (
            <a
              href={`/shop/${item.id}`}
              key={item.id}
              aria-current={
                categoryId === item.id
                  ? "page"
                  : undefined
              }
            >
              {item.name}
            </a>
          ))}
        </nav>
      )}

      <p
        className="wishlist-announcement"
        role="status"
      >
        {wishlistNotice}
      </p>

      {children ||
        (wishlistPage ? (
          <section className="collection wishlist-page">
            <div className="section-heading">
              <h1>Your wishlist.</h1>
            </div>

            <p>
              {user
                ? "Your favourites, saved to your account."
                : "Your guest wishlist is saved on this browser."}
            </p>

            {!user && (
              <p>
                <a href="/account">
                  Log in or create an account
                </a>{" "}
                to save a separate wishlist
                across devices.
              </p>
            )}

            {wishlistLoading ? (
              <p>
                {wishlistNotice ||
                  "Loading your wishlist…"}
              </p>
            ) : wishlistProducts.length ===
              0 ? (
              <p>
                No favourites yet.{" "}
                <a href="/wardrobe">
                  Explore the Wardrobe →
                </a>
              </p>
            ) : (
              <div className="product-grid">
                {wishlistProducts.map(
                  (product) => (
                    <article
                      className="product"
                      key={product.id}
                    >
                      <a
                        className="product-photo"
                        href={`/products/${product.id}`}
                      >
                        <ShirtPhoto
                          product={product}
                          name={product.name}
                        />
                      </a>

                      <h2>
                        <a
                          href={`/products/${product.id}`}
                        >
                          {product.name}
                        </a>
                      </h2>

                      <p>
                        {product.colourName}
                      </p>

                      {wishlistButton(
                        product
                      )}

                      <a
                        className="view-product"
                        href={`/products/${product.id}`}
                      >
                        View details →
                      </a>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        ) : currentProduct ? (
          <section className="product-page">
            <a
              className="back-link"
              href={`/shop/${categoryOf(
                currentProduct
              )}`}
            >
              ← Back to{" "}
              {categories
                .find(
                  (item) =>
                    item.id ===
                    categoryOf(
                      currentProduct
                    )
                )
                ?.name.toLowerCase()}
            </a>

            <div className="product-detail-grid">
              <div className="detail-photo">
                <ShirtPhoto
                  product={currentProduct}
                  name={currentProduct.name}
                />

                <p className="render-caption">
                  Design visualisation.
                  Final product details
                  may vary.
                </p>
              </div>

              <div className="detail-copy">
                <p className="eyebrow">
                  {
                    categories.find(
                      (item) =>
                        item.id ===
                        categoryOf(
                          currentProduct
                        )
                    )?.name
                  }
                </p>

                <h1>
                  {currentProduct.name}
                </h1>

                <blockquote className="product-quote">
                  {currentProduct.lineOne}{" "}
                  {currentProduct.lineTwo}
                </blockquote>

                <div className="supporting-lines">
                  {storyForProduct(
                    currentProduct
                  ).map((line) => (
                    <p key={line}>
                      {line}
                    </p>
                  ))}
                </div>

                <p>
                  {currentProduct.description ||
                    "An oversized heavyweight cotton tee with a statement design and the Soft Life Club signature."}
                </p>

                <dl className="product-facts">
                  <div>
                    <dt>
                      Colour shown
                    </dt>
                    <dd>
                      {
                        currentProduct.colourName
                      }
                    </dd>
                  </div>

                  {!currentProduct.concept && (
                    <>
                      <div>
                        <dt>
                          Material
                        </dt>
                        <dd>
                          100% cotton
                        </dd>
                      </div>

                      <div>
                        <dt>Fit</dt>
                        <dd>
                          Oversized
                        </dd>
                      </div>

                      <div>
                        <dt>
                          Fabric
                        </dt>
                        <dd>
                          Premium heavyweight
                        </dd>
                      </div>

                      <div>
                        <dt>
                          Finish
                        </dt>
                        <dd>
                          Embroidered logo
                        </dd>
                      </div>
                    </>
                  )}

                  {currentProduct.concept && (
                    <div>
                      <dt>
                        Product details
                      </dt>
                      <dd>
                        Final materials,
                        sizing and
                        specifications to
                        be confirmed.
                      </dd>
                    </div>
                  )}
                </dl>

                {!currentProduct.concept ? (
                  <>
                    <fieldset>
                      <legend>
                        Choose your size
                      </legend>

                      <div className="size-row">
                        {sizesFor(
                          currentProduct
                        ).map((size) => (
                          <button
                            key={size}
                            className={
                              selectedSize[
                                currentProduct
                                  .id
                              ] === size
                                ? "selected"
                                : ""
                            }
                            aria-pressed={
                              selectedSize[
                                currentProduct
                                  .id
                              ] === size
                            }
                            onClick={() =>
                              setSelectedSize(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  [currentProduct.id]:
                                    size,
                                })
                              )
                            }
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <button
                      className="add-button"
                      disabled={
                        !bagReady ||
                        !selectedSize[
                          currentProduct.id
                        ]
                      }
                      onClick={() =>
                        addToBag(
                          currentProduct
                        )
                      }
                    >
                      {selectedSize[
                        currentProduct.id
                      ]
                        ? "ADD TO BAG"
                        : "CHOOSE A SIZE"}
                    </button>
                  </>
                ) : null}

                <SizeGuide
                  product={currentProduct}
                />

                {wishlistButton(
                  currentProduct
                )}

                <p className="availability-note">
                  This collection is not
                  available to order yet.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p>
                  SOFT LIFE CLUB
                </p>

                <h1>
                  {category
                    ? category.name
                    : "The SLC Wardrobe."}
                </h1>

                <p className="hero-description">
                  {category
                    ? category.description
                    : "Statement tees, everyday layers and the finishing touches."}
                </p>

                <a
                  className="hero-link"
                  href="#collection"
                >
                  SHOP THE COLLECTION
                </a>
              </div>
            </section>

            <section
              className="collection"
              id="collection"
            >
              <div className="section-heading">
                <div>
                  <h2>
                    {category
                      ? "The collection"
                      : "Shop by category"}
                  </h2>
                </div>

                <p>
                  {category
                    ? `${listedProducts.length} ${
                        listedProducts.length ===
                        1
                          ? "piece"
                          : "pieces"
                      }`
                    : "Five ways to wear SLC"}
                </p>
              </div>

              {!category ? (
                <div className="product-grid category-grid">
                  {categories.map(
                    (item) => {
                      const coverProduct =
                        shopProducts.find(
                          (product) =>
                            product.id ===
                            item.cover
                        );

                      if (
                        !coverProduct
                      ) {
                        return null;
                      }

                      return (
                        <a
                          className="category-card"
                          key={item.id}
                          href={`/shop/${item.id}`}
                        >
                          <div className="product-photo">
                            <ShirtPhoto
                              product={
                                coverProduct
                              }
                              name={
                                item.name
                              }
                            />
                          </div>

                          <h3>
                            {item.name}
                          </h3>

                          <p>
                            {
                              item.description
                            }
                          </p>

                          <span>
                            Explore{" "}
                            {item.name.toLowerCase()}{" "}
                            →
                          </span>
                        </a>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="product-grid">
                  {listedProducts.map(
                    (product) => (
                      <article
                        className="product"
                        key={product.id}
                      >
                        <a
                          className="product-photo"
                          href={`/products/${product.id}`}
                          aria-label={`View ${product.name}`}
                        >
                          <ShirtPhoto
                            product={product}
                            name={
                              product.name
                            }
                          />
                        </a>

                        <div className="product-info">
                          <div>
                            <h3>
                              <a
                                href={`/products/${product.id}`}
                              >
                                {
                                  product.name
                                }
                              </a>
                            </h3>

                            <p>
                              {
                                product.colourName
                              }
                            </p>
                          </div>

                          <p className="card-quote">
                            {
                              product.lineOne
                            }{" "}
                            {
                              product.lineTwo
                            }
                          </p>

                          {wishlistButton(
                            product
                          )}

                          <a
                            className="view-product"
                            href={`/products/${product.id}`}
                          >
                            View details →
                          </a>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
            </section>
          </>
        ))}

      {!children && (
        <section className="community-banner">
          <p className="eyebrow">
            BE PART OF WHAT’S NEXT
          </p>

          <h2>Join SLC.</h2>

          <p>
            Get updates as Wardrobe,
            Love, Escapes and Society
            grow.
          </p>

          <a href="/join">
            Join the waitlist →
          </a>
        </section>
      )}

      <footer>
        <a
          className="footer-mark"
          href="#top"
          aria-label="Soft Life Club home"
        >
          <Image
            src="/soft-life-club-logo.png"
            alt="Soft Life Club"
            width={1200}
            height={1300}
            className="footer-logo"
          />
        </a>

        <div>
          <p>SOFT LIFE CLUB</p>
          <p>
            Luxury comfort. Expensive
            peace.
          </p>
        </div>

        <div className="footer-links">
          <a href="/wardrobe">
            Wardrobe
          </a>

          <a href="/society">
            Society
          </a>

          <a href="/partners">
            Partner with SLC
          </a>

          <a href="/join">
            Join SLC
          </a>
        </div>
      </footer>

      {bagOpen && (
        <button
          className="backdrop"
          onClick={() =>
            setBagOpen(false)
          }
          aria-label="Close bag"
        />
      )}

      <aside
        className={
          bagOpen
            ? "bag-drawer open"
            : "bag-drawer"
        }
        aria-hidden={!bagOpen}
      >
        <div className="bag-heading">
          <h2>Your bag</h2>

          <button
            onClick={() =>
              setBagOpen(false)
            }
            aria-label="Close bag"
          >
            ×
          </button>
        </div>

        {bag.length === 0 ? (
          <div className="empty-bag">
            <p>Your bag is empty.</p>

            <button
              onClick={() =>
                setBagOpen(false)
              }
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <div className="bag-content">
            <div className="bag-items">
              {Object.values(
                groupedBag
              ).map(
                ({
                  item,
                  quantity,
                }) => {
                  const product =
                    shopProducts.find(
                      (candidate) =>
                        candidate.id ===
                        item.id
                    );

                  return (
                    <div
                      className="bag-item"
                      key={`${item.id}-${item.size}`}
                    >
                      {product && (
                        <div className="bag-swatch">
                          <ShirtPhoto
                            product={
                              product
                            }
                            name={
                              item.name
                            }
                          />
                        </div>
                      )}

                      <div>
                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          {
                            item.colourName
                          }{" "}
                          · Size{" "}
                          {item.size}
                        </p>

                        <p>
                          Quantity{" "}
                          {quantity}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeOne(
                            item.id,
                            item.size
                          )
                        }
                        aria-label={`Remove one ${item.name}`}
                      >
                        −
                      </button>
                    </div>
                  );
                }
              )}
            </div>

            <div className="checkout-panel">
              <p>
                This collection is not
                available to order yet.
              </p>

              <button disabled>
                ORDERING UNAVAILABLE
              </button>
            </div>
          </div>
        )}
      </aside>
    </main>
  );
}