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
      "Built-in AI Visitor Chatbot Assistant",
      "Downloadable QR Code Overlay",
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
      "Built-in AI Visitor Chatbot Assistant",
      "Downloadable QR Code Overlay",
      "Premium Priority Support",
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
      "Built-in AI Visitor Chatbot Assistant",
      "Downloadable QR Code Overlay",
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
    if (!session) {
      signIn("google");
      return;
    }

    setLoadingPlan(planId);
    setErrorMsg("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize checkout session");
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e) {
      setErrorMsg(e.message || "An error occurred during checkout initialization.");
      setLoadingPlan("");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-100 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Flexible Credit Plans
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Purchase credits to design custom business card styles using AI, powered by Gemini LLM. Custom layouts cost 5 credits.
          </p>
        </div>

        {/* Alerts for Stripe Redirect callback */}
        {success && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-emerald-300 flex items-center gap-3 shadow-sm max-w-xl mx-auto">
            <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider block">Purchase Complete!</span>
              <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">Your credits have been added successfully. You can now use them to customize layouts with AI.</p>
            </div>
          </div>
        )}

        {canceled && (
          <div className="p-4 bg-amber-950/40 border border-amber-500/20 rounded-2xl text-amber-300 flex items-center gap-3 shadow-sm max-w-xl mx-auto">
            <FaTimesCircle className="text-amber-500 text-lg flex-shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider block">Purchase Canceled</span>
              <p className="text-[11px] text-amber-400 mt-0.5 font-medium">The checkout session was canceled. No charges were made.</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-red-300 flex items-center gap-3 shadow-sm max-w-xl mx-auto">
            <FaTimesCircle className="text-red-500 text-lg flex-shrink-0" />
            <span className="text-xs font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-slate-950 border rounded-3xl p-8 flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${
                plan.recommended 
                  ? "border-violet-500 shadow-xl ring-2 ring-violet-500/10" 
                  : "border-slate-800"
              }`}
            >
              {plan.recommended && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-base font-extrabold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium">one-time</span>
                </div>
              </div>

              {/* Credit Badge */}
              <div className="flex items-center gap-2 p-3 bg-amber-950/20 rounded-2xl border border-amber-500/10 mb-6 shadow-inner">
                <FaCoins className="text-amber-500 text-sm animate-bounce" />
                <div>
                  <span className="text-xs font-black text-amber-400">{plan.credits} AI Credits</span>
                  <p className="text-[10px] text-amber-500/80 leading-tight">Generate up to {Math.floor(plan.credits / 5)} custom styles.</p>
                </div>
              </div>

              {/* Features List */}
              <ul className="flex-1 flex flex-col gap-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <FaCheck className="text-violet-500 text-[10px] mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleCheckout(plan.id)}
                disabled={loadingPlan !== ""}
                className={`w-full py-3.5 text-xs font-bold rounded-xl active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                  plan.recommended 
                    ? "bg-violet-600 hover:bg-violet-700 text-white hover:shadow-violet-500/10" 
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                {loadingPlan === plan.id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <span>Buy Credits</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <FaSpinner className="text-4xl text-violet-500 animate-spin" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
