"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Product = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  category: string;

  line_one: string;
  line_two: string;
  colour: string;
  colour_name: string;
  concept: boolean;
  supporting: string[];

  price_amount: number | "";
  currency: string;
  stripe_price_id: string;

  sizes: string[];
  stock: number;
  sizing_guide: string;
  is_active: boolean;
};

const emptyProduct: Product = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  category: "",

  line_one: "",
  line_two: "",
  colour: "",
  colour_name: "",
  concept: false,
  supporting: ["", ""],

  price_amount: "",
  currency: "gbp",
  stripe_price_id: "",

  sizes: [],
  stock: 0,
  sizing_guide: "",
  is_active: false,
};

export default function AdminPage() {
  const [sessionToken, setSessionToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>(emptyProduct);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setSessionToken(data.session?.access_token || "");
    });

    const { data: listener } =
      supabaseBrowser.auth.onAuthStateChange((_event, session) => {
        setSessionToken(session?.access_token || "");
      });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (sessionToken) {
      loadProducts();
    }
  }, [sessionToken]);

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    };
  }

  async function signIn() {
    setMessage("");

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    }
  }

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    setProducts([]);
  }

  async function loadProducts() {
    const response = await fetch("/api/admin/products", {
      headers: authHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Could not load products.");
      return;
    }

    setProducts(data.products || []);
  }

  function update<K extends keyof Product>(
    field: K,
    value: Product[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveProduct() {
    setMessage("");

    const response = await fetch("/api/admin/products", {
      method: form.id ? "PATCH" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Could not save product.");
      return;
    }

    setForm(emptyProduct);
    setMessage("Product saved.");
    await loadProducts();
  }

  if (!sessionToken) {
    return (
      <main
        style={{
          maxWidth: 460,
          margin: "80px auto",
          padding: 24,
        }}
      >
        <h1>SLC Admin</h1>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            type="email"
            style={{ padding: 12 }}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            style={{ padding: 12 }}
          />

          <button
            type="button"
            onClick={signIn}
            style={{ padding: 14 }}
          >
            Sign in
          </button>

          {message && <p>{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "40px auto",
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1>SLC Admin</h1>
          <p>
            Manage SLC products, images, colours, sizes,
            descriptions, stock and pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={signOut}
          style={{ padding: 12 }}
        >
          Sign out
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 28,
        }}
      >
        <h2>Product Details</h2>

        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Product name"
          style={{ padding: 12 }}
        />

        <input
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="Product slug"
          style={{ padding: 12 }}
        />

        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          style={{ padding: 12 }}
        >
          <option value="">Select category</option>
          <option value="t-shirts">T-shirts</option>
          <option value="joggers">Joggers</option>
          <option value="sports-bras">Sports bras</option>
          <option value="sunglasses">Sunglasses</option>
          <option value="tracksuits">Tracksuits</option>
        </select>

        <input
          value={form.image_url}
          onChange={(e) => update("image_url", e.target.value)}
          placeholder="Image URL e.g. /joggers.png"
          style={{ padding: 12 }}
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            update("description", e.target.value)
          }
          placeholder="Product description"
          style={{
            padding: 12,
            minHeight: 100,
          }}
        />

        <h2>SLC Quote</h2>

        <input
          value={form.line_one}
          onChange={(e) => update("line_one", e.target.value)}
          placeholder="Main quote"
          style={{ padding: 12 }}
        />

        <input
          value={form.line_two}
          onChange={(e) => update("line_two", e.target.value)}
          placeholder="Second quote line"
          style={{ padding: 12 }}
        />

        <h2>Colour</h2>

        <input
          value={form.colour_name}
          onChange={(e) =>
            update("colour_name", e.target.value)
          }
          placeholder="Colour name e.g. Cream"
          style={{ padding: 12 }}
        />

        <input
          value={form.colour}
          onChange={(e) => update("colour", e.target.value)}
          placeholder="Colour code e.g. #eeeae0"
          style={{ padding: 12 }}
        />

        <h2>Product Story</h2>

        <input
          value={form.supporting?.[0] || ""}
          onChange={(e) =>
            update("supporting", [
              e.target.value,
              form.supporting?.[1] || "",
            ])
          }
          placeholder="Story line 1"
          style={{ padding: 12 }}
        />

        <input
          value={form.supporting?.[1] || ""}
          onChange={(e) =>
            update("supporting", [
              form.supporting?.[0] || "",
              e.target.value,
            ])
          }
          placeholder="Story line 2"
          style={{ padding: 12 }}
        />

        <label>
          <input
            type="checkbox"
            checked={form.concept}
            onChange={(e) =>
              update("concept", e.target.checked)
            }
          />{" "}
          Concept product
        </label>

        <h2>Sizes & Stock</h2>

        <input
          value={form.sizes.join(", ")}
          onChange={(e) =>
            update(
              "sizes",
              e.target.value
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean)
            )
          }
          placeholder="Sizes: XS, S, M, L, XL"
          style={{ padding: 12 }}
        />

        <input
          value={form.stock}
          onChange={(e) =>
            update("stock", Number(e.target.value))
          }
          type="number"
          placeholder="Stock"
          style={{ padding: 12 }}
        />

        <textarea
          value={form.sizing_guide}
          onChange={(e) =>
            update("sizing_guide", e.target.value)
          }
          placeholder="Sizing / model guide"
          style={{
            padding: 12,
            minHeight: 90,
          }}
        />

        <h2>Pricing</h2>

        <input
          value={form.price_amount}
          onChange={(e) =>
            update(
              "price_amount",
              e.target.value === ""
                ? ""
                : Number(e.target.value)
            )
          }
          type="number"
          placeholder="Price in pence/cents - leave blank for now"
          style={{ padding: 12 }}
        />

        <input
          value={form.stripe_price_id}
          onChange={(e) =>
            update("stripe_price_id", e.target.value)
          }
          placeholder="Stripe Price ID - leave blank for now"
          style={{ padding: 12 }}
        />

        <label>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              update("is_active", e.target.checked)
            }
          />{" "}
          Visible on website
        </label>

        <button
          type="button"
          onClick={saveProduct}
          style={{
            padding: 16,
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          {form.id ? "Update Product" : "Add Product"}
        </button>

        {form.id && (
          <button
            type="button"
            onClick={() => setForm(emptyProduct)}
            style={{
              padding: 12,
              cursor: "pointer",
            }}
          >
            Cancel editing
          </button>
        )}

        {message && <p>{message}</p>}
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2>Products</h2>

      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 16,
        }}
      >
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() =>
              setForm({
                ...emptyProduct,
                ...product,
                supporting:
                  product.supporting || ["", ""],
                sizes: product.sizes || [],
              })
            }
            style={{
              padding: 16,
              textAlign: "left",
              background: "white",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            <strong>{product.name}</strong>

            <div>
              {product.category || "No category"}
              {" · "}
              {product.colour_name || "No colour"}
            </div>

            <div>
              {product.stripe_price_id
                ? "Checkout ready"
                : "No price yet — checkout disabled"}
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}