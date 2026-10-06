import React, { useState, useEffect } from "react";
import { Share2, Link, Mail, Send, Check, MessageCircle } from "lucide-react";

interface ShareWidgetProps {
  title?: string;
  text?: string;
}

export default function ShareWidget({
  title = "Cool J Expeditions - Mount Kenya, Safari & Gorilla Climbs",
  text = "Plan your bucket-list adventure with Cool J Expeditions! Custom climbs, safaris, and local authenticity."
}: ShareWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("https://ais-pre-fhuvww6mrokigui5cm3kbx-454258292215.europe-west3.run.app");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${text} ${shareUrl}`);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.776.782 2.796.783 3.182 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.769-5.768-5.769zm10.009 5.808c-.021 5.518-4.498 9.992-10.016 9.992-1.761 0-3.411-.462-4.85-1.267l-5.465 1.433 1.458-5.327c-.886-1.503-1.391-3.262-1.391-5.138.021-5.519 4.498-9.993 10.016-9.993 5.519 0 9.992 4.474 10.016 9.993zm-5.454 4.156c-.234-.117-1.385-.684-1.6-.762-.215-.078-.371-.117-.527.117-.156.234-.605.762-.742.918-.137.156-.273.176-.508.059-.234-.117-.988-.364-1.882-1.161-.696-.621-1.166-1.388-1.303-1.622-.137-.234-.015-.36.103-.477.106-.105.234-.273.352-.41.117-.137.156-.234.234-.391.078-.156.039-.293-.02-.41-.059-.117-.527-1.27-.723-1.738-.19-.458-.383-.396-.527-.404l-.45-.008c-.156 0-.41.059-.625.293s-.82.801-.82 1.953c0 1.152.84 2.266.957 2.422.117.156 1.652 2.522 4.004 3.537.559.242.996.386 1.336.495.562.179 1.074.154 1.479.093.451-.068 1.385-.566 1.58-1.113.195-.547.195-1.016.137-1.113-.059-.098-.215-.156-.449-.273z"/>
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodedText}`,
      color: "bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-sm border border-emerald-400/40",
    },
    {
      name: "X (Twitter)",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "bg-[#111] hover:bg-black text-white border border-white/20 shadow-sm",
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "bg-[#1877F2] hover:bg-[#1464CC] text-white shadow-sm border border-blue-400/30",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "bg-[#0A66C2] hover:bg-[#084e96] text-white shadow-sm border border-sky-400/30",
    },
    {
      name: "Telegram",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.942z"/>
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: "bg-[#2AABEE] hover:bg-[#2292cc] text-white shadow-sm border border-cyan-300/40",
    },
    {
      name: "Email Mailbox",
      icon: <Mail className="w-4.5 h-4.5" />,
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
      color: "bg-gradient-to-r from-[#C9A24A] to-[#8F5C38] hover:opacity-90 text-white font-extrabold shadow-sm border border-amber-300/40",
    }
  ];

  return (
    <div className="relative z-40">
      {/* FLOATING ACTION BUTTON FOR SHARE ON DESKTOP/MOBILE */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        {isExpanded && (
          <div className="bg-[#FAF8F5] text-gray-900 p-4 rounded-2xl shadow-2xl border-2 border-[#C9A24A]/40 flex flex-col gap-3 animate-in slide-in-from-bottom-5 duration-200 w-80 backdrop-blur-xl">
            <div className="flex justify-between items-center border-b border-[#E8DFC8] pb-2">
              <span className="font-serif font-black text-sm text-[#0b3d2e] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#C9A24A]" />
                Share Expedition Itinerary
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-700 text-xs font-bold h-6 w-6 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* QUICK LINK COPY */}
            <div className="flex items-center gap-1.5 bg-white border border-[#DDD5C7] rounded-xl p-1.5 shadow-inner">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="text-xs text-gray-600 bg-transparent flex-1 outline-none px-2 font-mono overflow-ellipsis"
              />
              <button
                onClick={handleCopy}
                className={`text-[11px] font-black px-3 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-[#0b3d2e] hover:bg-[#082b20] text-[#C9A24A] border border-[#C9A24A]/50"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    Copied
                  </>
                ) : (
                  <>
                    <Link className="w-3.5 h-3.5 text-[#C9A24A]" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* PLATFORMS GRID */}
            <div className="grid grid-cols-3 gap-2">
              {shareLinks.map((plat) => (
                <a
                  key={plat.name}
                  href={plat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all duration-200 group relative cursor-pointer hover:scale-[1.03] ${plat.color}`}
                  title={`Share on ${plat.name}`}
                >
                  <div className="transform group-hover:scale-110 transition-transform duration-150">
                    {plat.icon}
                  </div>
                  <span className="text-[10px] font-bold mt-1.5 block tracking-tight">
                    {plat.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-[#0b3d2e] hover:bg-[#06241c] text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-[#C9A24A] hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer group"
          aria-label="Share Expedition"
        >
          <Share2 className="w-6 h-6 text-[#C9A24A] group-hover:rotate-12 transition-transform" />
          <span className="absolute right-16 bg-[#0b3d2e] border border-[#C9A24A] text-[#FAF8F5] text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Share Expedition ⚡
          </span>
        </button>
      </div>

      {/* INLINE WIDGET FOR PAGES/FOOTERS */}
      <div className="bg-gradient-to-br from-[#0b3d2e]/80 to-[#062219]/90 border-2 border-[#C9A24A]/40 rounded-2xl p-6 sm:p-7 text-white max-w-2xl mx-auto my-6 font-sans shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <h4 className="text-lg font-serif font-black tracking-tight text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#C9A24A]/20 border border-[#C9A24A]/50 text-[#C9A24A]">
              <Share2 className="w-5 h-5" />
            </span>
            <span>Share & Connect With Cool J</span>
          </h4>
          <span className="text-[10px] font-mono font-bold text-[#C9A24A] bg-black/40 px-2.5 py-1 rounded-full border border-[#C9A24A]/30">
            DIRECT COMMUNITY DESK
          </span>
        </div>
        
        <p className="text-xs text-gray-200 mb-5 leading-relaxed font-light">
          Share this trip planner with expedition partners, climbing teams, and safari enthusiasts across verified channels:
        </p>

        {/* COPY LINK FIELD */}
        <div className="flex items-center gap-2 bg-black/50 border border-[#C9A24A]/30 rounded-xl p-2 mb-4 shadow-inner">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="text-xs text-gray-200 bg-transparent flex-1 outline-none px-2 font-mono overflow-ellipsis"
          />
          <button
            onClick={handleCopy}
            className={`text-xs font-black px-4 py-2 rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-md ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-[#C9A24A] to-[#D9B85A] hover:brightness-105 text-[#0b3d2e] border border-[#C9A24A]"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                Copied Link
              </>
            ) : (
              <>
                <Link className="w-3.5 h-3.5 text-[#0b3d2e]" />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* HORIZONTAL PLATFORMS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {shareLinks.map((plat) => (
            <a
              key={plat.name}
              href={plat.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer ${plat.color}`}
            >
              {plat.icon}
              <span className="truncate">{plat.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
