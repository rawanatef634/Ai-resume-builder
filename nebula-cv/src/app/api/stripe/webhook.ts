import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.text();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-11-17.clover",
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      req.headers.get("stripe-signature")!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const data = event.data.object as Stripe.Subscription;
  const userId = data.metadata?.user_id as string;

  if (!userId) return NextResponse.json({ received: true });

  if (event.type === "checkout.session.completed") {
    await supabase
      .from("profiles")
      .update({ plan: "pro" })
      .eq("user_id", userId);
  }

  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
