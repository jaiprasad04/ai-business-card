"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { FaCoins, FaCheck, FaSpinner, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

const plans = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 100,
    price: "$10",
    description: "Great for individuals wanting premium templates.",
    features: [
      "100 AI Generation Credits",
      "Generate up to 20 Custom AI Styles",
      "Built-in AI Visitor Chatbot",
      "Downloadable QR Code",
      "Basic Support",
    ],
  },
  {
    id: "pro",
    name: "Professional Pack",
    credits: 300,
    price: "$25",
    description: "Perfect for active freelancers and networkers.",
    features: [
      "300 AI Generation Credits",
      "Generate up to 60 Custom AI Styles",
      "Built-in AI Visitor Chatbot",
      "Downloadable QR Code",
      "Priority Support",
      "Saves 15% on credits",
    ],
    recommended: true,
  },
  {
    id: "business",
    name: "Business Pack",
    credits: 750,
    price: "$50",
    description: "Ideal for agencies and corporate teams.",
    features: [
      "750 AI Generation Credits",
      "Generate up to 150 Custom AI Styles",
      "Built-in AI Visitor Chatbot",
      "Downloadable QR Code",
      "Dedicated 24/7 Support",
      "Saves 33% on credits",
    ],
  },
];

function PricingContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const [loadingPlan, setLoadingPlan] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckout = async (planId) => {
    if (!session) { signIn("google"); return; }
    setLoadingPlan(planId);
    setErrorMsg("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (!res.ok) throw new Error("Failed to initialize checkout");
      const { url } = await res.json();
      if (url) window.location.href = url;
      else throw new Error("No checkout URL returned");
    } catch (e) {
      setErrorMsg(e.message || "An error occurred.");
      setLoadingPlan("");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">Flexible Credit Plans</h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Purchase credits to design custom business card styles using AI. Custom layouts cost 5 credits each.
          </p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 flex items-center gap-3 max-w-xl mx-auto">
            <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />
            <div>
              <span className="font-bold text-sm block">Purchase Complete!</span>
              <p className="text-xs text-emerald-600 mt-0.5">Your credits have been added. Go generate something amazing.</p>
            </div>
          </div>
        )}
        {canceled && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 flex items-center gap-3 max-w-xl mx-auto">
            <FaTimesCircle className="text-amber-500 text-lg flex-shrink-0" />
            <div>
              <span className="font-bold text-sm block">Purchase Canceled</span>
              <p className="text-xs text-amber-600 mt-0.5">No charges were made. You can try again anytime.</p>
            </div>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 max-w-xl mx-auto">
            <FaTimesCircle className="text-red-500 text-lg flex-shrink-0" />
            <span className="text-sm">{errorMsg}</span>
          </div>
        )}

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white border rounded-2xl p-7 flex flex-col relative transition-all hover:shadow-lg ${
                plan.recommended
                  ? "border-violet-400 shadow-md ring-2 ring-violet-500/10"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.recommended && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-5">
                <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-xs text-gray-400 font-medium">one-time</span>
                </div>
              </div>

              {/* Credit badge */}
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl mb-5">
                <FaCoins className="text-amber-500 text-sm" />
                <div>
                  <span className="text-xs font-bold text-amber-700">{plan.credits} AI Credits</span>
                  <p className="text-[10px] text-amber-600 leading-tight">Up to {Math.floor(plan.credits / 5)} custom styles</p>
                </div>
              </div>

              {/* Features */}
              <ul className="flex-1 flex flex-col gap-2.5 mb-7">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <FaCheck className="text-violet-500 text-[10px] mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loadingPlan !== ""}
                className={`w-full py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  plan.recommended
                    ? "bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                } disabled:opacity-50`}
              >
                {loadingPlan === plan.id ? <FaSpinner className="animate-spin" /> : "Get Started"}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400">
          Secure payment via Stripe. Credits never expire. No subscriptions.
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <FaSpinner className="text-3xl text-violet-500 animate-spin" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
