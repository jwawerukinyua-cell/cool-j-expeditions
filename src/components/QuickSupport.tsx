import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Compass, CheckCircle2 } from "lucide-react";

interface QuickSupportProps {
  selectedRegion?: string;
  selectedActivity?: string;
  selectedDuration?: string;
  selectedGuests?: number;
  selectedBudget?: string;
}

export default function QuickSupport({
  selectedRegion,
  selectedActivity,
  selectedDuration,
  selectedGuests,
  selectedBudget,
}: QuickSupportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customQuery, setCustomQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const QUICK_QUESTIONS = [
    "⛰️ Mount Kenya trekking packages",
    "🦁 2-day Ol Pejeta safari cost",
    "🐆 Best time of year to climb",
    "💳 Payment and booking terms",
  ];

  const handleQuickQuestionClick = (question: string) => {
    setCustomQuery(`Jambo! I would like to ask about: ${question}`);
  };

  // Build the context-aware WhatsApp link
  const handleSendWhatsApp = () => {
    let baseText = "";
    if (customQuery.trim()) {
      baseText = customQuery.trim();
    } else {
      baseText = "Jambo Cool J! I would like to ask some quick questions about your custom expeditions.";
    }

    // Add auto-detected page context if available
    let contextString = "";
    if (selectedRegion || selectedActivity || selectedDuration || selectedGuests) {
      contextString += "\n\n💡 [My Portal Selections]";
      if (selectedRegion) contextString += `\n📍 Region: ${selectedRegion}`;
      if (selectedActivity) contextString += `\n🧗 Activity: ${selectedActivity}`;
      if (selectedDuration) contextString += `\n⏳ Duration: ${selectedDuration}`;
      if (selectedGuests) contextString += `\n👥 Explorers: ${selectedGuests} pax`;
      if (selectedBudget) contextString += `\n💰 Budget: ${selectedBudget}`;
    }

    const fullMessage = encodeURIComponent(baseText + contextString);
    const whatsappUrl = `https://wa.me/254720572251?text=${fullMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const hasContext = !!(selectedRegion || selectedActivity || selectedDuration || selectedGuests);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="absolute bottom-16 right-0 w-[340px] max-w-[calc(100vw-2rem)] bg-white border border-[#EEE8DF] rounded-2xl shadow-2xl overflow-hidden z-50 text-gray-800"
          >
            {/* Header */}
            <div className="bg-[#0b3d2e] text-[#C9A24A] p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-emerald-950 flex items-center justify-center border border-[#C9A24A]/30 text-white font-extrabold text-sm">
                    CJ
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-400 border border-[#0b3d2e] rounded-full animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Guiding Team Support</h4>
                  <span className="text-[10px] text-[#C9A24A] font-medium block">Replies instantly on WhatsApp</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
              {/* Introduction */}
              <p className="text-[11px] text-gray-500 leading-normal">
                Jambo! Ask our expert local guiding team any questions about high-altitude routing, safaris, and booking procedures.
              </p>

              {/* Context auto-detected badge */}
              {hasContext && (
                <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-[10px] text-emerald-800 space-y-1">
                  <span className="font-extrabold uppercase tracking-wider block text-[9px] text-emerald-700">
                    💡 Active Journey Context Detected
                  </span>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono">
                    {selectedRegion && <div>📍 {selectedRegion}</div>}
                    {selectedDuration && <div>⏳ {selectedDuration}</div>}
                    {selectedGuests && <div>👥 {selectedGuests} Explorers</div>}
                    {selectedBudget && <div>💰 {selectedBudget}</div>}
                  </div>
                </div>
              )}

              {/* Quick Preset Prompts */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Quick Inquiries:</span>
                <div className="flex flex-col gap-1">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickQuestionClick(q)}
                      className="text-left text-[10px] font-bold text-gray-700 hover:text-[#0b3d2e] bg-[#FAF8F5] hover:bg-[#EEE8DF] py-1.5 px-2.5 rounded-lg border border-[#EEE8DF]/50 transition-colors cursor-pointer block truncate"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input area */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                  Custom Inquiry Message:
                </label>
                <textarea
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Type your question here... (e.g. 'Is Mt Kenya climbable in December?')"
                  className="w-full h-20 text-[11px] p-2 bg-[#FCFAF5] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A24A] focus:border-[#C9A24A] resize-none"
                />
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20ba5c] text-white font-extrabold py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg hover:scale-[1.01]"
              >
                <Send className="h-3 w-3" /> Connect on WhatsApp
              </button>
            </div>

            {/* Footer */}
            <div className="bg-[#FAF8F5] px-4 py-2 text-center text-[9px] text-gray-400 border-t border-[#EEE8DF] font-mono">
              ⚡ Secure & Direct • Guided by Professionals
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#25D366] hover:bg-[#20ba5c] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center border-2 border-white cursor-pointer relative"
        id="quick-support-bubble-btn"
        title="Quick WhatsApp Support"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 text-[8px] font-black text-white items-center justify-center">
            1
          </span>
        </span>
      </button>
    </div>
  );
}
