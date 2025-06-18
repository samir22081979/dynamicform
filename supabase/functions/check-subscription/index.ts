
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to perform writes (upsert) in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating to free plan");
      await supabaseClient.from("users").upsert({
        id: user.id,
        plan: 'free',
        subscription_status: 'inactive',
        subscription_end: null,
      });
      return new Response(JSON.stringify({ subscribed: false, plan: 'free' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
    });
    
    let plan = 'free';
    let subscriptionStatus = 'inactive';
    let subscriptionEnd = null;
    
    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      subscriptionEnd = currentPeriodEnd.toISOString();
      
      // Check if subscription is active or canceled but still in current period
      if (subscription.status === 'active') {
        plan = 'paid';
        subscriptionStatus = 'active';
        logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      } else if (subscription.status === 'canceled' && subscription.cancel_at_period_end) {
        // Subscription is canceled but still active until period end
        if (currentPeriodEnd > new Date()) {
          plan = 'paid'; // Still has access until period ends
          subscriptionStatus = 'canceled_at_period_end';
          logStep("Canceled subscription still active until period end", { subscriptionId: subscription.id, endDate: subscriptionEnd });
        } else {
          plan = 'free';
          subscriptionStatus = 'expired';
          logStep("Canceled subscription has expired", { subscriptionId: subscription.id });
        }
      } else {
        logStep("Subscription in other status", { status: subscription.status });
      }
    } else {
      logStep("No subscription found");
    }

    // Update user plan in Supabase
    await supabaseClient.from("users").upsert({
      id: user.id,
      plan: plan,
      subscription_status: subscriptionStatus,
      subscription_end: subscriptionEnd,
    });

    logStep("Updated user plan", { subscribed: plan === 'paid', plan, subscriptionStatus, subscriptionEnd });
    return new Response(JSON.stringify({
      subscribed: plan === 'paid',
      plan: plan,
      subscription_status: subscriptionStatus,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
