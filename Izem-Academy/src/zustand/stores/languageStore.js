import { create } from "zustand";
import config from "../../lang/config.json";

const defaultLanguageCode = config.defaultLanguage || "ar";
const defaultLanguageConfig = config.languages.find(
  (lang) => lang.code === defaultLanguageCode
);

const useLanguageStore = create((set, get) => ({
  messages: {},
  language: defaultLanguageConfig.code,
  dir: defaultLanguageConfig.direction,
  availableLanguages: [],

  setLanguage: (lang) => {
    if (lang in get().messages) {
      const langConfig =
        get().availableLanguages.find((l) => l.code === lang) ||
        defaultLanguageConfig;
      set({
        language: lang,
        dir: langConfig.direction,
      });
      localStorage.setItem("app-language", lang);
      document.documentElement.dir = langConfig.direction;
      document.documentElement.lang = lang;
    }
  },

  getCurrentLanguageConfig: () => {
    const state = get();
    return (
      state.availableLanguages.find((lang) => lang.code === state.language) ||
      defaultLanguageConfig
    );
  },

  initializeLanguages: async () => {
    const loadedMessages = await Promise.all(
      config.languages
        .filter((lang) => lang.enabled)
        .map(async (lang) => [
          lang.code,
          (await import(`../../lang/${lang.code}.json`)).default,
        ])
    );

    const messagesObject = Object.fromEntries(loadedMessages);
    const enabledLanguages = config.languages.filter(
      (lang) => lang.enabled && lang.code in messagesObject
    );

    const saved = localStorage.getItem("app-language");
    const initialLang =
      saved && saved in messagesObject ? saved : config.defaultLanguage;
    const currentLangConfig =
      enabledLanguages.find((lang) => lang.code === initialLang) ||
      enabledLanguages[0];

    set({
      messages: messagesObject,
      language: initialLang,
      dir: currentLangConfig?.direction || "ltr",
      availableLanguages: enabledLanguages,
    });

    document.documentElement.dir = currentLangConfig?.direction || "ltr";
    document.documentElement.lang = initialLang;
  },
}));

// Initialize the store when imported
useLanguageStore.getState().initializeLanguages();

export default useLanguageStore;
