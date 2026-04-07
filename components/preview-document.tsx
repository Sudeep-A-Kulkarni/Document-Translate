"use client";

import type { RefObject } from "react";
import { LoaderCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LANGUAGE_LABELS } from "@/lib/translation";
import { TargetLanguage, TranslatedLetterDraft } from "@/lib/types";

interface PreviewDocumentProps {
  translatedDraft: TranslatedLetterDraft;
  targetLanguage: TargetLanguage;
  isTranslating: boolean;
  previewRef: RefObject<HTMLDivElement>;
}

export function PreviewDocument({
  translatedDraft,
  targetLanguage,
  isTranslating,
  previewRef
}: PreviewDocumentProps) {
  return (
    <Card className="overflow-hidden border-border/70 bg-white/70 shadow-paper backdrop-blur">
      <CardHeader className="border-b border-border/70 bg-secondary/55">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Translated Preview</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Official letter format in {LANGUAGE_LABELS[targetLanguage]}
            </p>
          </div>
          {isTranslating ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Translating
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="paper-grid bg-[#fdfcf7] p-4 sm:p-6">
        <div
          ref={previewRef}
          className="deva-font mx-auto min-h-[900px] w-full max-w-[794px] rounded-[28px] border border-stone-200 bg-white px-6 py-8 text-[15px] leading-7 text-slate-900 shadow-paper sm:px-10"
        >
          <header className="border-b border-dashed border-stone-300 pb-5 text-center">
            <h1 className="text-2xl font-bold tracking-wide">{translatedDraft.departmentName || "Department Name"}</h1>
            <p className="mt-3 whitespace-pre-line text-sm">{translatedDraft.address || "Office address will appear here"}</p>
            <p className="mt-4 text-sm font-medium">{translatedDraft.date}</p>
          </header>

          <section className="mt-8 space-y-5">
            <p>
              <span className="font-semibold">Subject: </span>
              <span>{translatedDraft.subject || "-"}</span>
            </p>
            <p>{translatedDraft.salutation || "-"}</p>
            <div className="whitespace-pre-line">{translatedDraft.body || "Translated document content will appear here."}</div>
            <div className="pt-3">
              <p>{translatedDraft.closing || "-"}</p>
              <p className="mt-4 font-semibold">{translatedDraft.signature || "-"}</p>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
