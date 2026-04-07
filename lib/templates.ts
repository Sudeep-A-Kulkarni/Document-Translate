import { DocumentType, LetterDraft } from "@/lib/types";

const baseDate = new Intl.DateTimeFormat("en-CA").format(new Date());

const baseDraft: LetterDraft = {
  documentType: "leave",
  targetLanguage: "hi",
  departmentName: "Office of Administrative Services",
  address: "District Administrative Complex\nCivil Lines, New Delhi - 110001",
  date: baseDate,
  subject: "",
  salutation: "Respected Sir/Madam,",
  body: "",
  closing: "Yours faithfully,",
  signature: "Administrative Officer"
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  leave: "Leave Letter",
  permission: "Permission Letter",
  notice: "Notice",
  circular: "Circular",
  custom: "Custom"
};

const templates: Record<DocumentType, Omit<LetterDraft, "targetLanguage">> = {
  leave: {
    ...baseDraft,
    documentType: "leave",
    subject: "Request for casual leave on account of personal work",
    body:
      "I respectfully submit that I need casual leave for two working days due to urgent personal work. I request that leave be granted from 10 April 2026 to 11 April 2026. All pending duties have been briefed to the concerned assistant for smooth functioning of the office."
  },
  permission: {
    ...baseDraft,
    documentType: "permission",
    subject: "Permission to organize a departmental awareness session",
    body:
      "This is to request permission to conduct a departmental awareness session on record management and citizen grievance handling on 15 April 2026 in the conference hall. The session will help staff follow updated procedures and improve service delivery."
  },
  notice: {
    ...baseDraft,
    documentType: "notice",
    subject: "Notice regarding office cleanliness drive",
    salutation: "To all staff members,",
    body:
      "All officers and staff are informed that a cleanliness drive will be conducted in the office premises on 12 April 2026 from 3:00 PM onwards. All sections are requested to ensure participation and proper disposal of old or unused material."
  },
  circular: {
    ...baseDraft,
    documentType: "circular",
    subject: "Circular on revised attendance reporting procedure",
    salutation: "To all section heads,",
    body:
      "It is hereby informed that the attendance reporting procedure has been revised with immediate effect. All section heads shall submit the consolidated attendance statement to the administration branch by 10:30 AM each working day."
  },
  custom: {
    ...baseDraft,
    documentType: "custom",
    subject: "",
    body: ""
  }
};

export function createDraft(documentType: DocumentType, targetLanguage = baseDraft.targetLanguage): LetterDraft {
  return {
    ...templates[documentType],
    targetLanguage
  };
}
