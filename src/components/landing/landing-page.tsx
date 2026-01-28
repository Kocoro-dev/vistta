"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LandingContent } from "@/lib/content";

// Components
import { HeroBadge } from "@/components/landing/hero-badge";
import { FacePile } from "@/components/landing/face-pile";
import { HeroSlider } from "@/components/landing/hero-slider";
import { TrustLogos } from "@/components/landing/trust-logos";
import { FeatureFork } from "@/components/landing/feature-fork";
import { BentoGrid } from "@/components/landing/bento-grid";
import { StatsSection } from "@/components/landing/stats-section";
import { StyleTabs } from "@/components/landing/style-tabs";
import { SocialProofSplit } from "@/components/landing/social-proof-split";
import { PricingCards } from "@/components/landing/pricing-cards";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { FAQ } from "@/components/landing/faq";
import { LiveActivityToast } from "@/components/landing/live-activity-toast";
import { ValueProposition } from "@/components/landing/value-proposition";

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
  const stylesRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .fromTo(
          ".hero-badge",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo(
          ".hero-title-line",
          { opacity: 0, y: 80, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.15 },
          "-=0.3"
        )
        .fromTo(
          heroSubtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          ".hero-face-pile",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ".hero-cta-btn",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(
          heroSliderRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2 },
          "-=0.3"
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
      <header className="site-header fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center">
              <img src="/logo-negro-Vistta.svg" alt="Vistta" className="h-6" />
            </Link>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <a
                href="#plataforma"
                onClick={(e) => {
                  e.preventDefault();
                  const lenis = (window as any).lenis;
                  const target = document.getElementById('plataforma');
                  if (lenis && target) {
                    lenis.scrollTo(target, { offset: -80 });
                  } else if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-[13px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
              >
                Plataforma
              </a>
              <a
                href="#productos"
                onClick={(e) => {
                  e.preventDefault();
                  const lenis = (window as any).lenis;
                  const target = document.getElementById('productos');
                  if (lenis && target) {
                    lenis.scrollTo(target, { offset: -80 });
                  } else if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-[13px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
              >
                Productos
              </a>
              <a
                href="#comparativa"
                onClick={(e) => {
                  e.preventDefault();
                  const lenis = (window as any).lenis;
                  const target = document.getElementById('comparativa');
                  if (lenis && target) {
                    lenis.scrollTo(target, { offset: -80 });
                  } else if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-[13px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
              >
                Comparativa
              </a>
              <a
                href="#precios"
                onClick={(e) => {
                  e.preventDefault();
                  const lenis = (window as any).lenis;
                  const target = document.getElementById('precios');
                  if (lenis && target) {
                    lenis.scrollTo(target, { offset: -80 });
                  } else if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-[13px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
              >
                Precios
              </a>
              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  const lenis = (window as any).lenis;
                  const target = document.getElementById('faq');
                  if (lenis && target) {
                    lenis.scrollTo(target, { offset: -80 });
                  } else if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-[13px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-[13px] text-neutral-600 hover:text-neutral-900 font-medium px-4 py-2 border border-neutral-200 hover:border-neutral-300 transition-all"
            >
              Accede al panel
            </Link>
            <Link
              href="/registro"
              className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 text-[13px] font-medium transition-all hover:scale-[1.02]"
            >
              Empieza gratis
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section ref={heroRef} className="pt-32 pb-24 px-6 lg:px-12 min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Badge */}
          <div className="hero-badge mb-8">
            <HeroBadge text={content.heroBadge.text} />
          </div>

          {/* Main headline */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
            <div className="lg:col-span-8" style={{ perspective: "1000px" }}>
              <h1 ref={heroTitleRef} className="text-[clamp(2.5rem,6vw,5.5rem)] font-medium text-neutral-900 text-display leading-[0.95]">
                <span className="hero-title-line block">{content.hero.title_line1}</span>
                <span className="hero-title-line block text-neutral-400">{content.hero.title_line2}</span>
              </h1>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end">
              <p ref={heroSubtitleRef} className="text-[17px] text-neutral-600 leading-relaxed mb-6">
                Tecnología de inteligencia artificial para mejorar o rediseñar las imágenes de tus propiedades en segundos. Fácil de usar y en solo unos minutos.
              </p>

              {/* Face Pile */}
              <div className="hero-face-pile mb-8">
                <FacePile
                  count={content.facePile.count}
                  suffix={content.facePile.suffix}
                />
              </div>

              {/* CTAs */}
              <div ref={heroCTARef} className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/registro"
                  className="hero-cta-btn group inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3.5 text-[14px] font-medium transition-all hover:scale-[1.02]"
                >
                  {content.hero.cta_primary}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Slider */}
          <div ref={heroSliderRef} id="demo">
            <HeroSlider
              beforeImage="/examples/antes-hero.webp"
              afterImage="/examples/despues-hero.jpeg"
            />
          </div>
        </div>
      </section>

      {/* 2. Trust Logos */}
      <TrustLogos label={content.trust.label} logos={content.trust.logos} />

      {/* 3. Value Proposition */}
      <ValueProposition id="plataforma" />

      {/* 4. Feature Fork */}
      <div id="productos">
        <FeatureFork content={content.fork} />
      </div>

      {/* 4. Bento Grid */}
      <BentoGrid content={content.bento} />

      {/* 5. Stats Section */}
      <StatsSection content={content.stats} />

      {/* 6. Style Tabs */}
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

      {/* 7. Social Proof Split */}
      <SocialProofSplit content={content.socialProof} />

      {/* 8. Reality Check Comparison */}
      <div id="comparativa">
        <ComparisonTable />
      </div>

      {/* 9. Pricing */}
      <div id="precios">
        <PricingCards content={content.pricing} />
      </div>

      {/* 10. FAQ */}
      <section id="faq" className="py-32 px-6 lg:px-12 bg-neutral-50">
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

      {/* 11. Final CTA */}
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
            href="/registro"
            className="final-cta-text group inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 text-[15px] font-medium transition-all hover:scale-[1.02]"
          >
            {content.cta.cta}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="py-12 px-6 lg:px-12 border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <img src="/logo-negro-Vistta.svg" alt="Vistta" className="h-5" />
              <span className="text-[13px] text-neutral-400">
                © {new Date().getFullYear()} {content.footer.copyright}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/terminos" className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors">
                Términos de servicio
              </Link>
              <Link href="/privacidad" className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors">
                Política de privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 13. Live Activity Toast */}
      <LiveActivityToast />

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
