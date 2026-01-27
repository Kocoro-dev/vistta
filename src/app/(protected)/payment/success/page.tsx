import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PaymentSuccessContent } from "./payment-success-content";

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get recent payment for this user
  const { data: paymentData } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const payment = paymentData as {
    id: string;
    amount: number;
    plan_type: string;
    stripe_session_id: string;
    created_at: string;
  } | null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<PaymentLoadingState />}>
        <PaymentSuccessContent
          payment={payment}
          userEmail={user.email || ""}
        />
      </Suspense>
    </div>
  );
}

function PaymentLoadingState() {
  return (
    <div className="text-center">
      <div className="h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-neutral-500">Procesando pago...</p>
    </div>
  );
}
