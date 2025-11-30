import Stripe from "stripe";
import { NextResponse } from "next/server";
import { q } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

function mapPlan(priceId: string) {
  if (priceId === process.env.STRIPE_PRICE_PREMIUM)
    return { plan: "premium", credits: 30 };
  if (priceId === process.env.STRIPE_PRICE_ENTERPRISE)
    return { plan: "enterprise", credits: 150 };
  return { plan: "unknown", credits: 0 };
}

async function upsertSubscription(userId: number, data: any) {
  const exists = await q(
    "SELECT id FROM subscriptions WHERE user_id=$1 LIMIT 1",
    [userId]
  );

  if (exists.rows.length) {
    await q(
      `UPDATE subscriptions 
       SET stripe_subscription_id=$1,
           stripe_price_id=$2,
           plan=$3,
           credits_remaining=$4,
           status=$5,
           current_period_end=to_timestamp($6)
       WHERE user_id=$7`,
      [
        data.stripe_subscription_id,
        data.stripe_price_id,
        data.plan,
        data.credits,
        data.status,
        data.current_period_end,
        userId,
      ]
    );
  } else {
    await q(
      `INSERT INTO subscriptions(
         user_id,
         stripe_subscription_id,
         stripe_price_id,
         plan,
         credits_remaining,
         status,
         current_period_end
       )
       VALUES($1,$2,$3,$4,$5,$6,to_timestamp($7))`,
      [
        userId,
        data.stripe_subscription_id,
        data.stripe_price_id,
        data.plan,
        data.credits,
        data.status,
        data.current_period_end,
      ]
    );
  }
}

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

  // ================
  // 🎯 OBSŁUGA SUBSKRYPCJI
  // ================
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;

    // znajdź usera
    const ur = await q(
      "SELECT id FROM users WHERE stripe_customer_id=$1 LIMIT 1",
      [customerId]
    );

    if (!ur.rows.length) {
      return NextResponse.json({ ok: true });
    }

    const userId = ur.rows[0].id;

    const priceId = sub.items.data[0]?.price?.id ?? "";
    const mapped = mapPlan(priceId);

    let status = sub.status; // active, past_due, unpaid, canceled, paused…

    // Stripe paused
    if (sub.pause_collection) {
      status = "paused";
    }

    // Stripe resumed → "active"
    if (!sub.pause_collection && sub.status === "active") {
      status = "active";
    }

    // canceled / deleted
    if (event.type === "customer.subscription.deleted") {
      status = "canceled";
    }

    const periodEnd =
      "current_period_end" in sub ? (sub as any).current_period_end : null;

    await upsertSubscription(userId, {
      stripe_subscription_id: sub.id,
      stripe_price_id: priceId,
      plan: mapped.plan,
      credits: mapped.credits,
      status,
      current_period_end: periodEnd,
    });
  }

  return NextResponse.json({ received: true });
}
