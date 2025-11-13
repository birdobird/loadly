import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { q } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "unauth" }, { status: 401 });

  const { priceId } = await req.json();
  const email = session.user.email;

  const ur = await q(
    "SELECT id, stripe_customer_id FROM users WHERE email=$1",
    [email]
  );
  const user = ur.rows[0];
  let customerId = user?.stripe_customer_id;

  if (!customerId) {
    const c = await stripe.customers.create({ email });
    customerId = c.id;
    await q("UPDATE users SET stripe_customer_id=$1 WHERE email=$2", [
      customerId,
      email,
    ]);
  }

  const s = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/pricing?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=1`,
  });

  return NextResponse.json({ url: s.url });
}
