import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const { items } = (await request.json()) as { items: CartItem[] };

    if (!items?.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const productIds = [...new Set(items.map((item) => item.productId))];

    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("id,name,stripe_price_id,sizes,stock,is_active")
      .in("id", productIds);

    if (error) throw new Error(error.message);

    const byId = new Map((products || []).map((product) => [product.id, product]));

    const lineItems = items.map((item) => {
      const product = byId.get(item.productId);

      if (!product || !product.is_active) {
        throw new Error("One of the products is unavailable.");
      }

      if (!product.stripe_price_id) {
        throw new Error(`${product.name} does not have a price yet.`);
      }

      if (!product.sizes?.includes(item.size)) {
        throw new Error(`Choose a valid size for ${product.name}.`);
      }

      if (item.quantity < 1 || item.quantity > product.stock) {
        throw new Error(`Not enough stock for ${product.name}.`);
      }

      return {
        price: product.stripe_price_id,
        quantity: item.quantity,
      };
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        cart: JSON.stringify(items),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout could not be created.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
