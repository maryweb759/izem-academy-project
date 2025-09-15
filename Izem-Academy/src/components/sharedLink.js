import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { FormattedMessage } from "react-intl";
import useLanguageStore from "../zustand/stores/languageStore";

const ShareLinkButton = ({ referral_code }) => {
  const [copied, setCopied] = useState(false);
  const { dir } = useLanguageStore();
  const isRTL = dir === "rtl";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://pullandpush.net/register/${referral_code}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div
      className="p-4 flex items-center gap-2 border-t border-border cursor-pointer hover:bg-gray-100 transition-colors duration-200 relative"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="w-6 h-6 text-green-500" />
      ) : (
        <Copy className="w-6 h-6 text-border" />
      )}
      <div>
        <span className="text-[#404040] text-lg sm:text-[20px] font-semiBold font-roboto leading-none">
          <FormattedMessage
            id="Account.menu.share"
            defaultMessage="شارك رابطك مع الاصدقاء"
          />
        </span>
        {copied && (
          <span
            className={`${
              isRTL ? "left-4" : "right-4"
            } absolute top-1/2 -translate-y-1/2 text-sm text-green-500 bg-white px-2 py-1 rounded-md shadow-sm`}
          >
            <FormattedMessage
              id="Account.menu.share.copied"
              defaultMessage="تم النسخ"
            />
          </span>
        )}
      </div>
    </div>
  );
};

export default ShareLinkButton;
