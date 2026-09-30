"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

export default function GoogleTranslateScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      (window as any).googleTranslateElementInit = function () {
        if ((window as any).google && (window as any).google.translate) {
          try {
            new (window as any).google.translate.TranslateElement(
              {
                pageLanguage: "en",
                includedLanguages: "en,te,hi,ta,or,bn",
                autoDisplay: false,
              },
              "google_translate_element"
            );
          } catch (e) {
            // Silently handle any initialization race conditions
          }
        }
      };
    }
  }, []);

  return (
    <div suppressHydrationWarning className="hidden">
      <div id="google_translate_element" style={{ display: "none" }} suppressHydrationWarning />
      {mounted && (
        <Script
          id="google-translate-script"
          strategy="afterInteractive"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
      )}
    </div>
  );
}
