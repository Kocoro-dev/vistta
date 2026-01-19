"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSlider } from "@/components/landing/hero-slider";
import { StyleTabs } from "@/components/landing/style-tabs";
import { FAQ } from "@/components/landing/faq";
import { LandingContent } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  content: LandingContent;
}

export function LandingPage({ content }: LandingPageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroCTARef = useRef<HTMLDivElement>(null);
  const heroSliderRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const stylesRef = useRef<HTMLElement>(null);
  const testimonialRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .fromTo(
          ".hero-label",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 }
        )
        .fromTo(
          ".hero-title-line",
          { opacity: 0, y: 80, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.15 },
          "-=0.4"
        )
        .fromTo(
          heroSubtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          ".hero-cta-btn",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(
          heroSliderRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2 },
          "-=0.3"
        );

      // Trust logos animation
      gsap.fromTo(
        ".trust-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".trust-section",
            start: "top 85%",
          },
        }
      );

      // Problem section - cards stagger in
      gsap.fromTo(
        ".problem-card",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: problemRef.current,
            start: "top 70%",
          },
        }
      );

      // Problem text reveal
      gsap.fromTo(
        ".problem-text",
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: problemRef.current,
            start: "top 75%",
          },
        }
      );

      // Steps section - numbers scale up
      gsap.fromTo(
        ".step-number",
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 65%",
          },
        }
      );

      gsap.fromTo(
        ".step-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 60%",
          },
        }
      );

      // Styles section parallax
      gsap.fromTo(
        ".styles-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: stylesRef.current,
            start: "top 75%",
          },
        }
      );

      // Testimonial section - quote reveal
      gsap.fromTo(
        ".testimonial-quote",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: testimonialRef.current,
            start: "top 70%",
          },
        }
      );

      // Pricing cards
      gsap.fromTo(
        ".pricing-card",
        { opacity: 0, y: 80, rotateY: -5 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pricingRef.current,
            start: "top 70%",
          },
        }
      );

      // Final CTA - dramatic entrance
      gsap.fromTo(
        ".final-cta-text",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 75%",
          },
        }
      );

      // Parallax effect on hero slider
      gsap.to(heroSliderRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Header background on scroll
      ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        toggleClass: { className: "header-scrolled", targets: ".site-header" },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="site-header fixed top-0 left-0 right-0 z-50 transition-all duration-500">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="text-[15px] font-medium tracking-tight text-neutral-900">
            VISTTA
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-[13px] text-neutral-600 hover:text-neutral-900 font-medium px-4 py-2 transition-colors"
            >
              Acceder
            </Link>
            <Link
              href="/login"
              className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 text-[13px] font-medium transition-all hover:scale-[1.02]"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-24 px-6 lg:px-12 min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Label */}
          <div className="mb-8">
            <span className="hero-label text-label text-neutral-500">
              {content.hero.label}
            </span>
          </div>

          {/* Main headline */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            <div className="lg:col-span-8" style={{ perspective: "1000px" }}>
              <h1 ref={heroTitleRef} className="text-[clamp(2.5rem,6vw,5.5rem)] font-medium text-neutral-900 text-display leading-[0.95]">
                <span className="hero-title-line block">{content.hero.title_line1}</span>
                <span className="hero-title-line block text-neutral-400">{content.hero.title_line2}</span>
              </h1>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end">
              <p ref={heroSubtitleRef} className="text-[17px] text-neutral-600 leading-relaxed mb-8">
                {content.hero.description}
              </p>
              <div ref={heroCTARef} className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="hero-cta-btn group inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3.5 text-[14px] font-medium transition-all hover:scale-[1.02]"
                >
                  {content.hero.cta_primary}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="#demo"
                  className="hero-cta-btn inline-flex items-center justify-center gap-2 border border-neutral-200 hover:border-neutral-400 text-neutral-700 px-6 py-3.5 text-[14px] font-medium transition-all hover:bg-neutral-50"
                >
                  {content.hero.cta_secondary}
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Slider */}
          <div ref={heroSliderRef} id="demo">
            <HeroSlider
              beforeImage={content.hero.slider_before_image}
              afterImage={content.hero.slider_after_image}
            />
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="trust-section py-12 px-6 lg:px-12 border-y border-neutral-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-4">
            <span className="trust-item text-label text-neutral-400">{content.trust.label}</span>
            {content.trust.logos.map((logo) => (
              <span key={logo} className="trust-item text-[18px] font-medium text-neutral-300 tracking-tight">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section ref={problemRef} className="py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Left column */}
            <div className="lg:col-span-5">
              <span className="problem-text text-label text-neutral-400 mb-6 block">{content.problem.label}</span>
              <h2 className="problem-text text-[clamp(2rem,4vw,3rem)] font-medium text-neutral-900 text-editorial leading-[1.1] mb-6">
                {content.problem.title}
              </h2>
              <p className="problem-text text-[17px] text-neutral-500 leading-relaxed">
                {content.problem.description}
              </p>
            </div>

            {/* Right column - Cards */}
            <div className="lg:col-span-7 space-y-4">
              {content.problem.cards.map((card, i) => (
                <div key={i} className="problem-card group p-8 border border-neutral-200 hover:border-neutral-300 transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[32px] font-medium text-neutral-200">{card.number}</span>
                    <ArrowUpRight className="h-5 w-5 text-neutral-300 group-hover:text-neutral-900 group-hover:rotate-45 transition-all duration-300" />
                  </div>
                  <h3 className="text-[20px] font-medium text-neutral-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}

              <div className="problem-card group p-8 bg-neutral-900 text-white transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[32px] font-medium text-neutral-600">→</span>
                  <span className="text-label text-orange-500">{content.problem.solution.label}</span>
                </div>
                <h3 className="text-[20px] font-medium mb-2">
                  {content.problem.solution.title}
                </h3>
                <p className="text-[15px] text-neutral-400 leading-relaxed">
                  {content.problem.solution.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section ref={stepsRef} className="py-32 px-6 lg:px-12 bg-neutral-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-xl mb-20">
            <span className="text-label text-neutral-400 mb-6 block">{content.steps.label}</span>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
              {content.steps.title_line1}
              <br />
              {content.steps.title_line2}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-neutral-200">
            {content.steps.steps.map((step, i) => (
              <div key={i} className="bg-neutral-50 p-8 lg:p-12">
                <span className="step-number text-[72px] lg:text-[96px] font-medium text-neutral-200 text-display leading-none block">
                  {step.number}
                </span>
                <div className="step-content">
                  <h3 className="text-[20px] font-medium text-neutral-900 mt-8 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles Section */}
      <section ref={stylesRef} className="py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="styles-header grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-6">
              <span className="text-label text-neutral-400 mb-6 block">{content.styles.label}</span>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
                {content.styles.title}
              </h2>
            </div>
            <div className="lg:col-span-6 flex items-end">
              <p className="text-[17px] text-neutral-500 leading-relaxed">
                {content.styles.description}
              </p>
            </div>
          </div>

          <StyleTabs styles={content.styles.styles} />
        </div>
      </section>

      {/* Testimonial */}
      <section ref={testimonialRef} className="py-32 px-6 lg:px-12 bg-neutral-900 text-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="testimonial-quote max-w-4xl">
            <span className="text-label text-neutral-500 mb-12 block">{content.testimonial.label}</span>
            <blockquote className="text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.3] text-editorial mb-12">
              &quot;{content.testimonial.quote}
              <span className="text-orange-500">{content.testimonial.highlight}</span>&quot;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-neutral-800 rounded-full overflow-hidden">
                {content.testimonial.author_image && (
                  <img
                    src={content.testimonial.author_image}
                    alt={content.testimonial.author_name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium text-[15px]">{content.testimonial.author_name}</p>
                <p className="text-[14px] text-neutral-500">{content.testimonial.author_role}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section ref={pricingRef} className="py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-xl mb-20">
            <span className="text-label text-neutral-400 mb-6 block">{content.pricing.label}</span>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
              {content.pricing.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-neutral-200 max-w-4xl" style={{ perspective: "1000px" }}>
            {content.pricing.plans.map((plan, i) => (
              <div
                key={i}
                className={`pricing-card p-8 lg:p-12 ${
                  plan.highlighted
                    ? "bg-neutral-900 text-white"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <span className={`text-label ${plan.highlighted ? "text-neutral-500" : "text-neutral-400"}`}>
                    {plan.name}
                  </span>
                  {plan.badge && (
                    <span className="text-label text-orange-500">{plan.badge}</span>
                  )}
                </div>
                <div className="mb-6">
                  <span className={`text-[48px] font-medium text-display ${plan.highlighted ? "" : "text-neutral-900"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-[15px] ml-1 ${plan.highlighted ? "text-neutral-500" : "text-neutral-500"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-[15px] mb-8 ${plan.highlighted ? "text-neutral-400" : "text-neutral-500"}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-10">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-3 text-[14px] ${
                        plan.highlighted ? "text-neutral-300" : "text-neutral-600"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${plan.highlighted ? "bg-orange-500" : "bg-neutral-300"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block w-full text-center py-3.5 text-[14px] font-medium transition-all ${
                    plan.highlighted
                      ? "bg-white hover:bg-neutral-100 text-neutral-900"
                      : "border border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 lg:px-12 bg-neutral-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-4">
              <span className="text-label text-neutral-400 mb-6 block">{content.faq.label}</span>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
                {content.faq.title}
              </h2>
            </div>
            <div className="lg:col-span-8">
              <FAQ items={content.faq.items} />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="py-32 px-6 lg:px-12 border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="final-cta-text text-[clamp(2rem,5vw,4rem)] font-medium text-neutral-900 text-display leading-[0.95] mb-8">
            {content.cta.title_line1}
            <br />
            {content.cta.title_line2}
          </h2>
          <p className="final-cta-text text-[17px] text-neutral-500 mb-10 max-w-lg mx-auto">
            {content.cta.description}
          </p>
          <Link
            href="/login"
            className="final-cta-text group inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 text-[15px] font-medium transition-all hover:scale-[1.02]"
          >
            {content.cta.cta}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <span className="text-[15px] font-medium text-neutral-900 tracking-tight">
                VISTTA
              </span>
              <p className="text-[14px] text-neutral-500 mt-3 leading-relaxed">
                {content.footer.brand_description}
              </p>
            </div>
            {content.footer.columns.map((column) => (
              <div key={column.title}>
                <h4 className="text-label text-neutral-400 mb-4">{column.title}</h4>
                <ul className="space-y-3 text-[14px]">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-neutral-600 hover:text-neutral-900 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-neutral-200 text-[13px] text-neutral-400">
            <p>© {new Date().getFullYear()} {content.footer.copyright}</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .site-header {
          background: rgba(255, 255, 255, 0);
          backdrop-filter: none;
        }
        .site-header.header-scrolled {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
