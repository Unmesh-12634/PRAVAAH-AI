"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageOption } from "@/data/translations";

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageOption[];
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: "en",
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  languages: SUPPORTED_LANGUAGES,
  isTranslating: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("en");
  const [isTranslating, setIsTranslating] = useState(false);

  // Initialize from cookie or localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("pravaah_lang") as SupportedLanguage | null;
      if (savedLang && TRANSLATIONS[savedLang]) {
        setCurrentLanguage(savedLang);
      } else {
        // Check googtrans cookie
        const match = document.cookie.match(/googtrans=\/[a-zA-Z-]+\/([a-zA-Z-]+)/);
        if (match && match[1] && (TRANSLATIONS as any)[match[1]]) {
          setCurrentLanguage(match[1] as SupportedLanguage);
        }
      }
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setIsTranslating(true);
    setCurrentLanguage(lang);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("pravaah_lang", lang);

        // 1. Set Google Translate cookies across root and domain
        const host = window.location.hostname;
        document.cookie = `googtrans=/en/${lang}; path=/;`;
        document.cookie = `googtrans=/auto/${lang}; path=/;`;
        document.cookie = `googtrans=/en/${lang}; path=/; domain=${host};`;
        if (host.includes(".")) {
          document.cookie = `googtrans=/en/${lang}; path=/; domain=.${host};`;
        }

        // 2. Trigger Google Translate .goog-te-combo in the DOM
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (combo) {
          combo.value = lang;
          combo.dispatchEvent(new Event("change", { bubbles: true }));
          combo.dispatchEvent(new Event("input", { bubbles: true }));
        }

        // 3. Dispatch global custom event for any sub-components
        window.dispatchEvent(new CustomEvent("pravaah_language_changed", { detail: { lang } }));
      } catch (e) {
        console.error("Error updating language cookies:", e);
      } finally {
        setTimeout(() => setIsTranslating(false), 300);
      }
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
      if (dict && dict[key]) {
        return dict[key];
      }
      return fallback || TRANSLATIONS.en[key] || key;
    },
    [currentLanguage]
  );

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        isTranslating,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
