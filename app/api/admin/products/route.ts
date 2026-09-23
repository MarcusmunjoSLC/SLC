import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request: Request) {
  const user = await requireAdmin(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    products: data,
  });
}

function buildProduct(body: any) {
  return {
    name: body.name,
    slug: body.slug,

    description: body.description || null,
    image_url: body.image_url || null,
    category: body.category || null,

    line_one: body.line_one || null,
    line_two: body.line_two || null,

    colour: body.colour || null,
    colour_name: body.colour_name || null,

    concept: Boolean(body.concept),

    supporting: Array.isArray(body.supporting)
      ? body.supporting
      : [],

    price_amount:
      body.price_amount === "" ||
      body.price_amount === null ||
      body.price_amount === undefined
        ? null
        : Number(body.price_amount),

    currency: body.currency || "gbp",

    stripe_price_id:
      body.stripe_price_id || null,

    sizes: Array.isArray(body.sizes)
      ? body.sizes
      : [],

    stock: Number(body.stock || 0),

    sizing_guide:
      body.sizing_guide || null,

    is_active:
      Boolean(body.is_active),

    updated_at:
      new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  const user = await requireAdmin(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  if (!body.name || !body.slug) {
    return NextResponse.json(
      {
        error:
          "Product name and slug are required.",
      },
      { status: 400 }
    );
  }

  const supabaseAdmin = getSupabaseAdmin();
  const product = buildProduct(body);

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    product: data,
  });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  if (!body.id) {
    return NextResponse.json(
      { error: "Missing product ID." },
      { status: 400 }
    );
  }

  if (!body.name || !body.slug) {
    return NextResponse.json(
      {
        error:
          "Product name and slug are required.",
      },
      { status: 400 }
    );
  }

  const supabaseAdmin = getSupabaseAdmin();
  const product = buildProduct(body);

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(product)
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    product: data,
  });
}