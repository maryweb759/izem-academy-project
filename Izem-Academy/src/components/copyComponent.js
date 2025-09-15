import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { FormattedMessage } from "react-intl";

const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className="p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
        onClick={handleCopy}
      >
        {copied ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-green-500 absolute -top-6 right-0 whitespace-nowrap">
              <FormattedMessage id="Payement.copy" defaultMessage="تم النسخ" />
            </span>
            <Check size={18} className="text-green-500" />
          </div>
        ) : (
          <Copy size={18} />
        )}
      </button>
    </div>
  );
};

export default CopyButton;
