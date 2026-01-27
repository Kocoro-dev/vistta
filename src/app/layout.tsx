import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono, Bricolage_Grotesque, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { CookieConsent } from "@/components/cookie-consent";
import { AttributionTracker } from "@/components/attribution-tracker";
import "./globals.css";

const GTM_ID = "GTM-5PDBMJRW";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vistta | Transformación Visual Inmobiliaria",
  description:
    "Transforma espacios con inteligencia artificial. Redecora y renueva habitaciones virtualmente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Google Consent Mode v2 - MUST load BEFORE GTM */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Set default consent state to denied
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });

              // Check for existing consent in localStorage
              (function() {
                try {
                  var consent = localStorage.getItem('vistta_cookie_consent');
                  var prefs = localStorage.getItem('vistta_cookie_prefs');

                  if (consent === 'accepted' && prefs) {
                    var p = JSON.parse(prefs);
                    gtag('consent', 'update', {
                      'ad_storage': p.marketing ? 'granted' : 'denied',
                      'analytics_storage': p.analytics ? 'granted' : 'denied',
                      'ad_user_data': p.marketing ? 'granted' : 'denied',
                      'ad_personalization': p.marketing ? 'granted' : 'denied'
                    });
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body
        className={`${bricolageGrotesque.variable} ${manrope.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Toaster position="bottom-right" />
        <CookieConsent />
        <AttributionTracker trackSessions />
      </body>
    </html>
  );
}
