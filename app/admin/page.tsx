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

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        setSessionToken(session?.access_token || "");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (sessionToken) loadProducts();
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

  function update<K extends keyof Product>(field: K, value: Product[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveProduct() {
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
      <main style={{ maxWidth: 460, margin: "80px auto", padding: 24 }}>
        <h1>SLC Admin</h1>
        <div style={{ display: "grid", gap: 12 }}>
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
          <button type="button" onClick={signIn} style={{ padding: 14 }}>
            Sign in
          </button>
          {message && <p>{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: "40px auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>SLC Admin</h1>
          <p>Add products now. Add prices when you are ready.</p>
        </div>
        <button type="button" onClick={signOut}>
          Sign out
        </button>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Product name"
          style={{ padding: 12 }}
        />

        <input
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="product-slug"
          style={{ padding: 12 }}
        />

        <input
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          placeholder="Category"
          style={{ padding: 12 }}
        />

        <input
          value={form.image_url}
          onChange={(e) => update("image_url", e.target.value)}
          placeholder="Image URL"
          style={{ padding: 12 }}
        />

        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Description"
          style={{ padding: 12, minHeight: 90 }}
        />

        <input
          value={form.price_amount}
          onChange={(e) =>
            update(
              "price_amount",
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          type="number"
          placeholder="Display price in pence/cents - optional"
          style={{ padding: 12 }}
        />

        <input
          value={form.stripe_price_id}
          onChange={(e) => update("stripe_price_id", e.target.value)}
          placeholder="Stripe Price ID - leave blank for now"
          style={{ padding: 12 }}
        />

        <input
          value={form.sizes.join(", ")}
          onChange={(e) =>
            update(
              "sizes",
              e.target.value
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean)
            )
          }
          placeholder="Sizes: XS, S, M, L, XL"
          style={{ padding: 12 }}
        />

        <input
          value={form.stock}
          onChange={(e) => update("stock", Number(e.target.value))}
          type="number"
          placeholder="Stock"
          style={{ padding: 12 }}
        />

        <textarea
          value={form.sizing_guide}
          onChange={(e) => update("sizing_guide", e.target.value)}
          placeholder="Sizing / model guide"
          style={{ padding: 12, minHeight: 90 }}
        />

        <label>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
          />{" "}
          Visible on website
        </label>

        <button type="button" onClick={saveProduct} style={{ padding: 14 }}>
          {form.id ? "Update Product" : "Add Product"}
        </button>

        {message && <p>{message}</p>}
      </div>

      <hr style={{ margin: "36px 0" }} />

      <h2>Products</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => setForm(product)}
            style={{
              padding: 16,
              textAlign: "left",
              background: "white",
              border: "1px solid #ddd",
            }}
          >
            <strong>{product.name}</strong>
            <div>
              {product.stripe_price_id
                ? "Stripe checkout ready"
                : "No price yet - checkout disabled"}
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
