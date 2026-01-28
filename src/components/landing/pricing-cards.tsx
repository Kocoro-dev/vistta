"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { PricingContent } from "@/lib/content";
import { cn } from "@/lib/utils";

interface PricingCardsProps {
  content: PricingContent;
  className?: string;
}

export function PricingCards({ content, className }: PricingCardsProps) {
  return (
    <section className={cn("py-32 px-6 lg:px-12", className)}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="max-w-xl mb-20">
          <span className="text-label text-neutral-400 mb-6 block">
            {content.label}
          </span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
            {content.title}
          </h2>
        </div>

        {/* Pricing Cards */}
        <div
          className="grid md:grid-cols-2 gap-6 max-w-4xl"
          style={{ perspective: "1000px" }}
        >
          {content.plans.map((plan, i) => (
            <div
              key={i}
              className={cn(
                "pricing-card relative overflow-hidden",
                "border transition-all duration-500",
                "hover:-translate-y-1",
                plan.highlighted
                  ? "bg-neutral-900 text-white border-neutral-800"
                  : "bg-white border-neutral-200 hover:border-neutral-300"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0">
                  <span className="inline-block bg-orange-500 text-white text-[11px] font-medium tracking-wide uppercase px-4 py-1.5">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8 lg:p-12">
                {/* Plan name */}
                <span
                  className={cn(
                    "text-label mb-8 block",
                    plan.highlighted ? "text-neutral-500" : "text-neutral-400"
                  )}
                >
                  {plan.name}
                </span>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className={cn(
                      "text-[48px] lg:text-[56px] font-medium text-display",
                      plan.highlighted ? "text-white" : "text-neutral-900"
                    )}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={cn(
                        "text-[15px] ml-1",
                        plan.highlighted ? "text-neutral-500" : "text-neutral-500"
                      )}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p
                  className={cn(
                    "text-[15px] mb-8",
                    plan.highlighted ? "text-neutral-400" : "text-neutral-500"
                  )}
                >
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className={cn(
                        "flex items-start gap-3 text-[14px]",
                        plan.highlighted ? "text-neutral-300" : "text-neutral-600"
                      )}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 mt-0.5 flex-shrink-0",
                          plan.highlighted ? "text-orange-500" : "text-neutral-400"
                        )}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/registro"
                  className={cn(
                    "block w-full text-center py-4 text-[14px] font-medium transition-all",
                    plan.highlighted
                      ? "bg-white hover:bg-neutral-100 text-neutral-900"
                      : "bg-neutral-900 hover:bg-neutral-800 text-white"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
