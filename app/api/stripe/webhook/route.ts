import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature.", { status: 400 });
  }

  const rawBody = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      let cart = null;

      try {
        cart = session.metadata?.cart
          ? JSON.parse(session.metadata.cart)
          : null;
      } catch {}

      await supabaseAdmin.from("orders").upsert(
        {
          stripe_session_id: session.id,
          customer_email: session.customer_details?.email || null,
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
          cart,
        },
        { onConflict: "stripe_session_id" }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook verification failed.";

    return new NextResponse(message, { status: 400 });
  }
}
