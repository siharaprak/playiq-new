import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy', {
    apiVersion: '2023-10-16' as any,
  });

  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
  }

  // Bind bypass service role instance for updating row securely
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const applicationId = session.client_reference_id;

      if (applicationId) {
         // Fulfill the Beta Application State
         const { error } = await supabaseAdmin
           .from('beta_applications')
           .update({ status: 'paid' })
           .eq('id', applicationId);
           
         if (error) {
           console.error("Failed to update beta_application status to paid:", error);
         } else {
           console.log(`Payment locked. Beta App [${applicationId}] marked paid.`);
         }
      } else {
         console.warn("Received checkout.session.completed with no client_reference_id mapping.");
      }
      break;
    }
    
    // In advanced configurations you can handle expired/canceled events to free beta inventory
    case 'checkout.session.expired': {
       const session = event.data.object as Stripe.Checkout.Session;
       const applicationId = session.client_reference_id;
       if (applicationId) {
          await supabaseAdmin.from('beta_applications').update({ status: 'canceled' }).eq('id', applicationId);
       }
       break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
