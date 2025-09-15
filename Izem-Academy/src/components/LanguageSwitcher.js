import React, { useState } from "react";
import useLanguageStore from "../zustand/stores/languageStore";

const LanguageSwitcher = () => {
  const { language, setLanguage, availableLanguages, dir } = useLanguageStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setIsDropdownOpen(false);
  };

  // Transformez la première lettre en majuscule
  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100"
      >
        {displayLanguage}
      </button>

      {isDropdownOpen && (
        <div
          className={`absolute left-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50`}
        >
          <ul className="py-1">
            {availableLanguages.map((lang) => (
              <li
                key={lang.code}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  language === lang.code ? "bg-gray-50" : ""
                }`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                {lang.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
