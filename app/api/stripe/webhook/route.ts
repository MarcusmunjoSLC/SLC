import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const supabaseAdmin = getSupabaseAdmin();

    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
      return new NextResponse(
        "Missing Stripe signature.",
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      return new NextResponse(
        "Stripe webhook is not configured yet.",
        { status: 500 }
      );
    }

    const rawBody = await request.text();

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      let cart = null;

      try {
        cart = session.metadata?.cart
          ? JSON.parse(session.metadata.cart)
          : null;
      } catch {
        cart = null;
      }

      const { error } = await supabaseAdmin
        .from("orders")
        .upsert(
          {
            stripe_session_id: session.id,
            customer_email:
              session.customer_details?.email || null,
            amount_total: session.amount_total,
            currency: session.currency,
            payment_status: session.payment_status,
            cart,
          },
          {
            onConflict: "stripe_session_id",
          }
        );

      if (error) {
        throw new Error(error.message);
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Webhook verification failed.";

    return new NextResponse(
      message,
      { status: 400 }
    );
  }
}