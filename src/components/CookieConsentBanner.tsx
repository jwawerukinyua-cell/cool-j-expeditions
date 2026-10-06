import React, { useState, useEffect } from "react";
import { Cookie, ShieldCheck, Check, SlidersHorizontal } from "lucide-react";

interface CookieConsentBannerProps {
  onOpenPrivacyModal: () => void;
}

export default function CookieConsentBanner({ onOpenPrivacyModal }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [functionalCookies, setFunctionalCookies] = useState(true);
  const [analyticsCookies, setAnalyticsCookies] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cool_j_cookie_consent");
      if (!consent) {
        // Small delay for smooth entry
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("cool_j_cookie_consent", JSON.stringify({
        essential: true,
        functional: true,
        analytics: true,
        date: new Date().toISOString()
      }));
    } catch (e) {
      console.error(e);
    }
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem("cool_j_cookie_consent", JSON.stringify({
        essential: true,
        functional: false,
        analytics: false,
        date: new Date().toISOString()
      }));
    } catch (e) {
      console.error(e);
    }
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    try {
      localStorage.setItem("cool_j_cookie_consent", JSON.stringify({
        essential: true,
        functional: functionalCookies,
        analytics: analyticsCookies,
        date: new Date().toISOString()
      }));
    } catch (e) {
      console.error(e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-6 duration-300 font-sans"
      id="cookie-consent-container"
    >
      <div className="bg-[#0b3d2e] text-[#FAF8F5] border border-[#C9A24A]/40 rounded-2xl shadow-2xl p-5 backdrop-blur-xl relative overflow-hidden">
        {/* Subtle gold top line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A24A] via-emerald-400 to-[#C9A24A]" />

        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-[#C9A24A]/20 text-[#C9A24A] rounded-xl shrink-0 mt-0.5 border border-[#C9A24A]/30">
            <Cookie className="h-5 w-5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5 font-serif">
                Cookie & Privacy Preferences
              </h4>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#C9A24A] font-bold">
                GDPR & DPA 2019
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              We use essential local storage & cookies to remember your currency selections, calculate dynamic quotes, and verify guest reviews. We never sell your personal data or use invasive third-party ad trackers.
            </p>

            {/* Expandable Preferences */}
            {isPreferencesOpen && (
              <div className="pt-2 pb-1 space-y-2 border-t border-white/10 mt-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs py-1">
                  <div>
                    <span className="font-bold text-white block">Strictly Essential</span>
                    <span className="text-[10px] text-gray-400">Required for quote builder & safety manifests</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Always Active
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-t border-white/5">
                  <div>
                    <span className="font-bold text-white block">Functional & Currency</span>
                    <span className="text-[10px] text-gray-400">Saves USD/EUR/GBP choice & saved itineraries</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={functionalCookies}
                      onChange={(e) => setFunctionalCookies(e.target.checked)}
                    />
                    <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#C9A24A]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-t border-white/5">
                  <div>
                    <span className="font-bold text-white block">Anonymous Analytics</span>
                    <span className="text-[10px] text-gray-400">Helps us monitor server uptime and page speeds</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={analyticsCookies}
                      onChange={(e) => setAnalyticsCookies(e.target.checked)}
                    />
                    <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#C9A24A]"></div>
                  </label>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              {!isPreferencesOpen ? (
                <>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 bg-[#C9A24A] hover:bg-[#b08c3e] text-black font-extrabold text-xs py-2 px-3 rounded-xl transition-colors tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    id="cookie-accept-all-btn"
                  >
                    <Check className="w-3.5 h-3.5" /> Accept All
                  </button>

                  <button
                    onClick={handleEssentialOnly}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors tracking-wide cursor-pointer border border-white/10"
                    id="cookie-essential-only-btn"
                  >
                    Essential Only
                  </button>

                  <button
                    onClick={() => setIsPreferencesOpen(true)}
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center cursor-pointer border border-white/5"
                    title="Customize Preferences"
                    aria-label="Customize cookie preferences"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveCustom}
                    className="flex-1 bg-[#C9A24A] hover:bg-[#b08c3e] text-black font-extrabold text-xs py-2 px-3 rounded-xl transition-colors tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setIsPreferencesOpen(false)}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors tracking-wide cursor-pointer"
                  >
                    Back
                  </button>
                </>
              )}
            </div>

            <div className="pt-1 flex justify-between items-center text-[10px] text-gray-400">
              <button
                onClick={onOpenPrivacyModal}
                className="underline hover:text-[#C9A24A] transition-colors cursor-pointer text-left"
              >
                Read Cookie & Data Policy
              </button>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Secure & Encrypted
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
