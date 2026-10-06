import React, { useState } from "react";
import { Shield, Lock, EyeOff, CheckCircle2, UserCheck, Cookie, Globe2, RefreshCw } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "privacy" | "cookies";
}

export default function PrivacyPolicyModal({ isOpen, onClose, defaultTab = "privacy" }: PrivacyPolicyModalProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "cookies">(defaultTab);
  const [clearMessage, setClearMessage] = useState("");

  if (!isOpen) return null;

  const handleClearCookies = () => {
    try {
      localStorage.removeItem("cool_j_cookie_consent");
      localStorage.removeItem("cool_j_selected_currency");
      setClearMessage("Local browser preferences have been successfully reset.");
      setTimeout(() => setClearMessage(""), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-[#0b3d2e] border border-[#C9A24A]/40 text-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full relative shadow-2xl my-8 font-sans animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP ACCENT DECORATIVE CORNER BAR */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C9A24A] via-emerald-600 to-[#C9A24A] rounded-t-3xl" />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer text-lg font-bold"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3.5 mb-4 border-b border-[#C9A24A]/20 pb-4">
          <div className="bg-[#C9A24A]/10 p-2.5 rounded-2xl border border-[#C9A24A]/30">
            <Shield className="w-7 h-7 text-[#C9A24A]" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-white font-serif">
              Privacy, Data & Cookie Policy
            </h3>
            <p className="text-[11px] text-gray-300 font-mono tracking-wide uppercase mt-0.5">
              COOL J EXPEDITIONS • (THE GREAT SOUTH OUTDOORS AND CLIMBERS) • GUEST TRUST ASSURANCE
            </p>
          </div>
        </div>

        {/* POLICY TABS */}
        <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "privacy"
                ? "bg-[#C9A24A] text-black font-extrabold shadow"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Privacy & Data Protection
          </button>
          <button
            onClick={() => setActiveTab("cookies")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "cookies"
                ? "bg-[#C9A24A] text-black font-extrabold shadow"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Cookie className="w-3.5 h-3.5" /> International Cookie Policy
          </button>
        </div>

        {/* CONTENT SCROLLABLE VIEW */}
        <div className="space-y-6 text-sm text-gray-200 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {activeTab === "privacy" ? (
            <>
              {/* OFFICIAL REGISTERED BUSINESS ENTITY NOTICE */}
              <div className="bg-[#051C14] border border-[#C9A24A]/40 rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-2 text-[#C9A24A] font-bold text-xs font-mono uppercase mb-1.5">
                  <Shield className="w-4 h-4 shrink-0" /> Registered Business Name & Legal Disclosure
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  <strong>Cool J Expeditions</strong> operates officially under the registered business entity name <strong className="text-[#C9A24A]">The Great South Outdoors and Climbers</strong> (Registered Business Name, Kenya).
                </p>
                <p className="text-[11px] text-gray-300 leading-relaxed mt-1.5">
                  All expedition contracts, Kenya Wildlife Service (KWS) ranger permits, guest manifests, bank transfers, and Lipa na M-PESA settlements are legally administered under this registered business identity, ensuring complete transparency and guest security.
                </p>
              </div>

              <p className="leading-relaxed text-gray-300 text-xs sm:text-sm">
                At <strong>Cool J Expeditions</strong> (under <strong>The Great South Outdoors and Climbers</strong>, Nanyuki, Kenya), our primary policy is built on direct, non-exploitative relationships. Your personal adventure planning data is fully confidential and strictly used to configure Mount Kenya summits, safaris, and cross-border gorilla tracks.
              </p>

              {/* KEY CORE PILLARS */}
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#C9A24A] font-bold text-xs font-mono uppercase">
                    <Lock className="w-4 h-4" /> Secure Booking Info
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Names, emails, and phone records collected during quotes are utilized strictly to issue authentic flight, ranger, and park-permit manifests.
                  </p>
                </div>

                <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#C9A24A] font-bold text-xs font-mono uppercase">
                    <EyeOff className="w-4 h-4" /> Zero Data Selling
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    We despise spam as much as garbage on hiking paths. We will never sell, lease, or distribute your communications to marketing brokers.
                  </p>
                </div>

                <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#C9A24A] font-bold text-xs font-mono uppercase">
                    <UserCheck className="w-4 h-4" /> Direct Coordination
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    All itinerary builders and simulation runs store no tracking cookies or static payment credentials.
                  </p>
                </div>

                <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#C9A24A] font-bold text-xs font-mono uppercase">
                    <CheckCircle2 className="w-4 h-4" /> Sustainable Community
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Your direct booking data handles are registered solely for municipal reporting structures on porter educational funds.
                  </p>
                </div>
              </div>

              {/* DETAILED BULLET POINTS */}
              <div className="space-y-4 pt-2 border-t border-[#C9A24A]/10">
                <div>
                  <h4 className="text-[#C9A24A] font-extrabold text-xs uppercase tracking-wider mb-1.5">
                    1. Information Collection & Safe Use
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    We collect personal specifications (such as names, dietary conditions for high-altitude camps, and fitness details) solely to ensure high-safety guiding standards on challenging tracks like Batian Peak or Point Lenana.
                  </p>
                </div>

                <div>
                  <h4 className="text-[#C9A24A] font-extrabold text-xs uppercase tracking-wider mb-1.5">
                    2. Real-Time Interactions (AI Planner & Weather Tools)
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Our AI Journey Architect uses server-side processing for routing proposals. None of your individual prompts or personalized travel ideas are retained as raw training resources.
                  </p>
                </div>

                <div>
                  <h4 className="text-[#C9A24A] font-extrabold text-xs uppercase tracking-wider mb-1.5">
                    3. International Visitor Rights (GDPR & CCPA)
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    International travelers enjoy full rights of access, correction, and permanent erasure of their inquiry history upon request at <a href="mailto:jmichanjs@gmail.com" className="underline text-white hover:text-[#C9A24A]">jmichanjs@gmail.com</a>.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#C9A24A] font-bold text-xs font-mono uppercase">
                  <Globe2 className="w-4 h-4" /> Global Cookie Standards Compliance
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  We adhere to the European Union / UK General Data Protection Regulation (GDPR), the ePrivacy Directive, the California Consumer Privacy Act (CCPA/CPRA), and the Kenya Data Protection Act (2019).
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[#C9A24A] font-extrabold text-xs uppercase tracking-wider mb-1">
                    1. Strictly Essential Storage
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    These storage keys are necessary for the website to function properly. They hold your dynamic expedition calculations, preferred dates, vehicle configurations, and inquiry references so your quotes remain accurate while navigating.
                  </p>
                </div>

                <div>
                  <h4 className="text-[#C9A24A] font-extrabold text-xs uppercase tracking-wider mb-1">
                    2. Functional Preferences
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Saves your chosen currency (USD, EUR, GBP, KES), audio guide settings, and cookie preference acceptance so you are not prompted repeatedly on return visits.
                  </p>
                </div>

                <div>
                  <h4 className="text-[#C9A24A] font-extrabold text-xs uppercase tracking-wider mb-1">
                    3. Zero Third-Party Advertising Trackers
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    We do not load third-party ad networks, behavioural tracking pixels, or cross-site profiling scripts. Your browsing session stays completely private.
                  </p>
                </div>

                <div>
                  <h4 className="text-[#C9A24A] font-extrabold text-xs uppercase tracking-wider mb-1">
                    4. Managing & Clearing Your Data
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    You can clear all stored site data from your browser at any time using the button below or directly via your browser settings.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleClearCookies}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-colors tracking-wide flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reset Local Preferences
                    </button>
                    {clearMessage && (
                      <span className="text-xs font-mono text-emerald-400 font-bold animate-in fade-in">
                        ✓ {clearMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="bg-[#C9A24A]/10 border border-[#C9A24A]/30 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-bold text-[#C9A24A] block">
              🛡️ Certified compliant with International GDPR, CCPA, and Kenya Data Protection Act (2019) standards.
            </span>
          </div>

        </div>

        {/* FOOTER BUTTONS */}
        <div className="mt-6 pt-4 border-t border-[#C9A24A]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-[11px] text-gray-400 font-mono leading-tight">
            <span>Operated under: </span>
            <strong className="text-gray-200 font-semibold">The Great South Outdoors and Climbers</strong>
            <span className="block text-[10px] text-gray-500">Direct Basecamp: Nanyuki, Kenya</span>
          </div>
          <button
            onClick={onClose}
            className="bg-[#C9A24A] hover:bg-[#b08c3e] text-black font-extrabold text-xs px-6 py-2.5 rounded-xl tracking-wider transition-colors cursor-pointer shadow self-end sm:self-auto"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
}
