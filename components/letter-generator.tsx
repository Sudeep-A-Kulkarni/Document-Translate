"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileDown, LoaderCircle } from "lucide-react";

import { exportDocumentAsPdf } from "@/lib/exporters";
import { LANGUAGE_LABELS, TRANSLATION_LANGUAGE_OPTIONS } from "@/lib/translation";
import { DocumentLanguage, TargetLanguage, TranslationErrorResponse, TranslationResponse } from "@/lib/types";

function createStarterDocument() {
  const date = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());

  return `Department Name
Office Address
City - 000000

Date: ${date}

Subject:

Respected Sir/Madam,

Start writing here.

Yours faithfully,

Signature`;
}

export function LetterGenerator() {
  const [sourceText, setSourceText] = useState(createStarterDocument);
  const [language, setLanguage] = useState<DocumentLanguage>("en");
  const [translations, setTranslations] = useState<Record<TargetLanguage, string>>({
    hi: "",
    mr: ""
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const translationCacheRef = useRef<Record<TargetLanguage, Map<string, string>>>({
    hi: new Map(),
    mr: new Map()
  });

  useEffect(() => {
    if (language === "en") {
      setIsTranslating(false);
      setError(null);
      return;
    }

    if (!sourceText.trim()) {
      setTranslations((current) => ({
        ...current,
        [language]: ""
      }));
      setError(null);
      setIsTranslating(false);
      return;
    }

    const cachedTranslation = translationCacheRef.current[language].get(sourceText);
    if (cachedTranslation) {
      setTranslations((current) => ({
        ...current,
        [language]: cachedTranslation
      }));
      setError(null);
      setIsTranslating(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsTranslating(true);
      setError(null);

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: sourceText,
            target: language
          })
        });

        const data = (await response.json()) as TranslationResponse | TranslationErrorResponse;

        if (requestId !== requestIdRef.current) {
          return;
        }

        if (!response.ok || !("translatedText" in data)) {
          throw new Error(("error" in data && data.error) || "Translation is unavailable right now.");
        }

        translationCacheRef.current[language].set(sourceText, data.translatedText);
        setTranslations((current) => ({
          ...current,
          [language]: data.translatedText
        }));
      } catch (translationError) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(
          translationError instanceof Error ? translationError.message : "Translation is unavailable right now."
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setIsTranslating(false);
        }
      }
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [language, sourceText]);

  const visibleText = useMemo(() => {
    if (language === "en") {
      return sourceText;
    }

    return translations[language] || sourceText;
  }, [language, sourceText, translations]);

  const handleDownloadPdf = async () => {
    if (!previewRef.current) {
      return;
    }

    await exportDocumentAsPdf(previewRef.current, language);
  };

  const statusText = error
    ? error
    : isTranslating
      ? "Translating..."
      : "";

  return (
    <main className="min-h-screen bg-[#ece6dc] px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <header className="sticky top-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white/92 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <select
              aria-label="Select language"
              className="h-10 rounded-xl border border-stone-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none ring-0"
              value={language}
              onChange={(event) => setLanguage(event.target.value as DocumentLanguage)}
            >
              {TRANSLATION_LANGUAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {LANGUAGE_LABELS[option]}
                </option>
              ))}
            </select>
            <span className={`text-sm ${error ? "text-red-600" : "text-slate-500"}`}>
              {statusText}
            </span>
          </div>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={language !== "en" && isTranslating}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isTranslating && language !== "en" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            PDF
          </button>
        </header>

        <section className="mx-auto w-full max-w-[860px] rounded-[28px] border border-stone-200 bg-white shadow-paper">
          {language === "en" ? (
            <textarea
              spellCheck={false}
              value={sourceText}
              onChange={(event) => setSourceText(event.target.value)}
              className="min-h-[78vh] w-full resize-none rounded-[28px] border-0 bg-transparent px-6 py-7 text-[15px] leading-8 text-slate-900 outline-none sm:px-10 sm:py-10 sm:text-[16px]"
            />
          ) : (
            <div
              className="deva-font min-h-[78vh] whitespace-pre-wrap px-6 py-7 text-[15px] leading-8 text-slate-900 sm:px-10 sm:py-10 sm:text-[16px]"
            >
              {visibleText}
            </div>
          )}
        </section>
      </div>

      <div className="fixed left-[-200vw] top-0">
        <div
          ref={previewRef}
          className={`w-[794px] bg-white px-14 py-16 text-[16px] leading-8 text-slate-900 ${
            language === "en" ? "" : "deva-font"
          } whitespace-pre-wrap`}
        >
          {visibleText}
        </div>
      </div>
    </main>
  );
}
