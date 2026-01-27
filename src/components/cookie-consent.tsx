"use client";

import { useEffect, useState } from "react";

type ConsentState = "pending" | "accepted" | "rejected";

interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = "vistta_cookie_consent";
const CONSENT_PREFS_KEY = "vistta_cookie_prefs";

/**
 * Cookie Consent Banner - CMP para Google Consent Mode v2
 *
 * Este componente muestra el banner de consentimiento y gestiona
 * la comunicación con Google Tag Manager via Consent Mode v2.
 */
export function CookieConsent() {
  const [consentState, setConsentState] = useState<ConsentState>("pending");
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    analytics: true,
    marketing: true,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for existing consent
    const savedConsent = localStorage.getItem(CONSENT_KEY);

    if (savedConsent === "accepted" || savedConsent === "rejected") {
      setConsentState(savedConsent);
      // Consent already applied by head script, no need to show banner
    } else {
      // No consent yet, show banner after small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateGoogleConsent = (granted: boolean, prefs?: ConsentPreferences) => {
    const effectivePrefs = prefs || preferences;

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: granted && effectivePrefs.marketing ? "granted" : "denied",
        analytics_storage: granted && effectivePrefs.analytics ? "granted" : "denied",
        ad_user_data: granted && effectivePrefs.marketing ? "granted" : "denied",
        ad_personalization: granted && effectivePrefs.marketing ? "granted" : "denied",
      });

      // Push event for GTM to trigger tags
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "cookie_consent_update",
        consent_analytics: granted && effectivePrefs.analytics,
        consent_marketing: granted && effectivePrefs.marketing,
      });
    }
  };

  const handleAcceptAll = () => {
    const prefs = { analytics: true, marketing: true };
    localStorage.setItem(CONSENT_KEY, "accepted");
    localStorage.setItem(CONSENT_PREFS_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setConsentState("accepted");
    updateGoogleConsent(true, prefs);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const prefs = { analytics: false, marketing: false };
    localStorage.setItem(CONSENT_KEY, "rejected");
    localStorage.setItem(CONSENT_PREFS_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setConsentState("rejected");
    updateGoogleConsent(false, prefs);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const hasAnyConsent = preferences.analytics || preferences.marketing;
    const state = hasAnyConsent ? "accepted" : "rejected";
    localStorage.setItem(CONSENT_KEY, state);
    localStorage.setItem(CONSENT_PREFS_KEY, JSON.stringify(preferences));
    setConsentState(state);
    updateGoogleConsent(hasAnyConsent, preferences);
    setShowPreferences(false);
    setIsVisible(false);
  };

  // Don't render if consent already given
  if (consentState !== "pending" || !isVisible) {
    return null;
  }

  return (
    <>
      <style>{`
        .cmp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 9998;
          opacity: 0;
          animation: cmp-fade-in 0.3s ease forwards;
        }

        .cmp-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          animation: cmp-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cmp-banner-inner {
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.25rem 1.5rem;
        }

        .cmp-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .cmp-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .cmp-text {
          flex: 1;
        }

        .cmp-text h3 {
          color: #fafafa;
          font-size: 0.9375rem;
          font-weight: 500;
          margin: 0 0 0.375rem 0;
          font-family: var(--font-heading), system-ui, sans-serif;
          letter-spacing: -0.02em;
        }

        .cmp-text p {
          color: #a3a3a3;
          font-size: 0.8125rem;
          line-height: 1.5;
          margin: 0;
          font-family: var(--font-sans), system-ui, sans-serif;
        }

        .cmp-text a {
          color: #a3a3a3;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s ease;
        }

        .cmp-text a:hover {
          color: #fafafa;
        }

        .cmp-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        @media (min-width: 480px) {
          .cmp-buttons {
            flex-direction: row;
          }
        }

        .cmp-btn {
          padding: 0.625rem 1.25rem;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-family: var(--font-sans), system-ui, sans-serif;
          white-space: nowrap;
        }

        .cmp-btn-primary {
          background: #c2410c;
          color: #ffffff;
        }

        .cmp-btn-primary:hover {
          background: #9a3412;
        }

        .cmp-btn-secondary {
          background: transparent;
          color: #a3a3a3;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .cmp-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fafafa;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .cmp-btn-text {
          background: transparent;
          color: #737373;
          padding: 0.625rem 1rem;
        }

        .cmp-btn-text:hover {
          color: #a3a3a3;
        }

        /* Preferences Modal */
        .cmp-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10000;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          max-width: 440px;
          width: calc(100% - 2rem);
          max-height: calc(100vh - 2rem);
          overflow-y: auto;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
          animation: cmp-fade-in 0.3s ease forwards;
        }

        .cmp-modal h3 {
          color: #fafafa;
          font-size: 1rem;
          font-weight: 500;
          margin: 0 0 1.25rem 0;
          font-family: var(--font-heading), system-ui, sans-serif;
          letter-spacing: -0.02em;
        }

        .cmp-modal-section {
          margin-bottom: 1.25rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .cmp-modal-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .cmp-modal-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .cmp-modal-section h4 {
          color: #fafafa;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
          font-family: var(--font-sans), system-ui, sans-serif;
        }

        .cmp-modal-section p {
          color: #737373;
          font-size: 0.75rem;
          line-height: 1.5;
          margin: 0;
          font-family: var(--font-sans), system-ui, sans-serif;
        }

        .cmp-toggle {
          position: relative;
          width: 40px;
          height: 22px;
          flex-shrink: 0;
        }

        .cmp-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .cmp-toggle-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background: #262626;
          transition: 0.3s;
        }

        .cmp-toggle-slider:before {
          content: "";
          position: absolute;
          height: 16px;
          width: 16px;
          left: 3px;
          bottom: 3px;
          background: #737373;
          transition: 0.3s;
        }

        .cmp-toggle input:checked + .cmp-toggle-slider {
          background: #c2410c;
        }

        .cmp-toggle input:checked + .cmp-toggle-slider:before {
          transform: translateX(18px);
          background: #ffffff;
        }

        .cmp-toggle input:disabled + .cmp-toggle-slider {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cmp-modal-buttons {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .cmp-modal-buttons .cmp-btn {
          flex: 1;
        }

        @keyframes cmp-slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes cmp-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* Preferences Modal Overlay */}
      {showPreferences && (
        <div className="cmp-overlay" onClick={() => setShowPreferences(false)} />
      )}

      {/* Main Banner */}
      {!showPreferences && (
        <div className="cmp-banner">
          <div className="cmp-banner-inner">
            <div className="cmp-content">
              <div className="cmp-text">
                <h3>Utilizamos cookies</h3>
                <p>
                  Usamos cookies para mejorar tu experiencia, analizar el tráfico y
                  personalizar contenido. Puedes aceptar todas, rechazarlas o{" "}
                  <button
                    onClick={() => setShowPreferences(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#a3a3a3",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                      cursor: "pointer",
                      padding: 0,
                      font: "inherit",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#a3a3a3")}
                  >
                    configurar tus preferencias
                  </button>
                  . Más info en nuestra{" "}
                  <a href="/privacidad" target="_blank" rel="noopener">
                    política de privacidad
                  </a>
                  .
                </p>
              </div>
              <div className="cmp-buttons">
                <button className="cmp-btn cmp-btn-text" onClick={handleRejectAll}>
                  Rechazar
                </button>
                <button
                  className="cmp-btn cmp-btn-secondary"
                  onClick={() => setShowPreferences(true)}
                >
                  Preferencias
                </button>
                <button className="cmp-btn cmp-btn-primary" onClick={handleAcceptAll}>
                  Aceptar todo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="cmp-modal">
          <h3>Preferencias de cookies</h3>

          <div className="cmp-modal-section">
            <div className="cmp-modal-section-header">
              <h4>Cookies esenciales</h4>
              <label className="cmp-toggle">
                <input type="checkbox" checked disabled />
                <span className="cmp-toggle-slider" />
              </label>
            </div>
            <p>
              Necesarias para el funcionamiento básico del sitio. No se pueden
              desactivar.
            </p>
          </div>

          <div className="cmp-modal-section">
            <div className="cmp-modal-section-header">
              <h4>Cookies analíticas</h4>
              <label className="cmp-toggle">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences((p) => ({ ...p, analytics: e.target.checked }))
                  }
                />
                <span className="cmp-toggle-slider" />
              </label>
            </div>
            <p>
              Nos ayudan a entender cómo usas el sitio para mejorar la experiencia.
              Incluye Google Analytics.
            </p>
          </div>

          <div className="cmp-modal-section">
            <div className="cmp-modal-section-header">
              <h4>Cookies de marketing</h4>
              <label className="cmp-toggle">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences((p) => ({ ...p, marketing: e.target.checked }))
                  }
                />
                <span className="cmp-toggle-slider" />
              </label>
            </div>
            <p>
              Permiten mostrarte anuncios relevantes en otras plataformas. Incluye
              Meta Pixel y Google Ads.
            </p>
          </div>

          <div className="cmp-modal-buttons">
            <button
              className="cmp-btn cmp-btn-secondary"
              onClick={() => setShowPreferences(false)}
            >
              Cancelar
            </button>
            <button className="cmp-btn cmp-btn-primary" onClick={handleSavePreferences}>
              Guardar preferencias
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Type declarations for window
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}
