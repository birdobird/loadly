import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { q } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "unauth" }, { status: 401 });

  const u = await q("SELECT stripe_customer_id FROM users WHERE email=$1", [
    session.user.email,
  ]);

  const customerId = u.rows[0]?.stripe_customer_id;
  if (!customerId)
    return NextResponse.json({ error: "no_customer" }, { status: 400 });

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.NEXTAUTH_URL!,
  });

  return NextResponse.json({ url: portal.url });
}
