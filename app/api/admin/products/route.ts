import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request: Request) {
  const user = await requireAdmin(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  const user = await requireAdmin(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const payload = {
    name: body.name,
    slug: body.slug,
    description: body.description || null,
    image_url: body.image_url || null,
    category: body.category || null,
    price_amount:
      body.price_amount === "" || body.price_amount == null
        ? null
        : Number(body.price_amount),
    currency: body.currency || "gbp",
    stripe_price_id: body.stripe_price_id || null,
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    stock: Number(body.stock || 0),
    sizing_guide: body.sizing_guide || null,
    is_active: Boolean(body.is_active),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }

  const payload = {
    name: body.name,
    slug: body.slug,
    description: body.description || null,
    image_url: body.image_url || null,
    category: body.category || null,
    price_amount:
      body.price_amount === "" || body.price_amount == null
        ? null
        : Number(body.price_amount),
    currency: body.currency || "gbp",
    stripe_price_id: body.stripe_price_id || null,
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    stock: Number(body.stock || 0),
    sizing_guide: body.sizing_guide || null,
    is_active: Boolean(body.is_active),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(payload)
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}
