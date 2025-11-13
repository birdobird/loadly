import Stripe from "stripe";
import { NextResponse } from "next/server";
import { q } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  const raw = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "invalid_webhook" }, { status: 400 });
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const priceId = sub.items.data[0].price.id;
    const plan =
      priceId === process.env.STRIPE_PRICE_PREMIUM
        ? "premium"
        : priceId === process.env.STRIPE_PRICE_ENTERPRISE
        ? "enterprise"
        : "unknown";
    const credits = plan === "premium" ? 30 : plan === "enterprise" ? 150 : 0;

    const ur = await q("SELECT id FROM users WHERE stripe_customer_id=$1", [
      customerId,
    ]);
    if (ur.rows[0]) {
      const userId = ur.rows[0].id;
      const existing = await q(
        "SELECT id FROM subscriptions WHERE user_id=$1",
        [userId]
      );
      if (existing.rows[0]) {
        await q(
          "UPDATE subscriptions SET stripe_subscription_id=$1, stripe_price_id=$2, plan=$3, credits_remaining=$4, current_period_end=to_timestamp($5) WHERE user_id=$6",
          [sub.id, priceId, plan, credits, sub.billing_cycle_anchor!, userId]
        );
      } else {
        await q(
          "INSERT INTO subscriptions(user_id, stripe_subscription_id, stripe_price_id, plan, credits_remaining, current_period_end) VALUES($1,$2,$3,$4,$5,to_timestamp($6))",
          [userId, sub.id, priceId, plan, credits, sub.billing_cycle_anchor!]
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
