export type DocumentType = "leave" | "permission" | "notice" | "circular" | "custom";
export type TargetLanguage = "hi" | "mr";
export type DocumentLanguage = "en" | TargetLanguage;
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
