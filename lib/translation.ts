import { DocumentLanguage, TargetLanguage, TranslatableField } from "@/lib/types";

export const TRANSLATABLE_FIELDS: TranslatableField[] = [
  "departmentName",
  "address",
  "subject",
  "salutation",
  "body",
  "closing",
  "signature"
];

export const LANGUAGE_LABELS: Record<DocumentLanguage, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi"
};

export const TRANSLATION_LANGUAGE_OPTIONS: DocumentLanguage[] = ["en", "hi", "mr"];
