import { useState } from "react";
import { Phone, Facebook, Instagram, Send, Music2, Linkedin, X } from "lucide-react";

export default function ContactBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null; // completely hide if dismissed

  return (
    <div dir="ltr" className="w-full bg-brandBg flex items-center justify-between px-3 py-2">
      {/* Left: Phone */}
      <div className="flex items-center gap-1.5 text-white text-xs sm:text-sm">
        <Phone size={14} />
        <span className="truncate">+213668578890</span>
      </div>

      {/* Right: Social icons */}
      <div className="flex items-center gap-2">
        {[
          { Icon: Facebook, label: "Facebook" },
          { Icon: Instagram, label: "Instagram" },
          { Icon: Send, label: "Telegram" },
          { Icon: Music2, label: "TikTok" },
          { Icon: Linkedin, label: "LinkedIn" },
        ].map(({ Icon, label }) => (
          <a
            key={label}
            href="#"
            aria-label={label}
            className="bg-white rounded-full p-1.5 flex items-center justify-center hover:opacity-80"
          >
            <Icon className="w-4 h-4 text-brandYellow" />
          </a>
        ))}

        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className=" p-1.5 flex items-center justify-center hover:opacity-80"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
