export type DocumentType = "leave" | "permission" | "notice" | "circular" | "custom";
export type TargetLanguage = "hi" | "mr";
export type DocumentLanguage = "en" | TargetLanguage;
export type PaperSize =
  | "a0"
  | "a1"
  | "a2"
  | "a3"
  | "a4"
  | "a5"
  | "a6"
  | "letter"
  | "legal"
  | "tabloid"
  | "executive"
  | "folio";
export type TranslatableField =
  | "departmentName"
  | "address"
  | "subject"
  | "salutation"
  | "body"
  | "closing"
  | "signature";

export interface LetterDraft {
  documentType: DocumentType;
  targetLanguage: TargetLanguage;
  departmentName: string;
  address: string;
  date: string;
  subject: string;
  salutation: string;
  body: string;
  closing: string;
  signature: string;
}

export type TranslatedLetterDraft = Omit<LetterDraft, "documentType" | "targetLanguage" | "date"> & {
  date: string;
};

export interface TranslationResponse {
  translatedText: string;
}

export interface TranslationErrorResponse {
  error: string;
}
