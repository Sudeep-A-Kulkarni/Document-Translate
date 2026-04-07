import { TranslatedLetterDraft } from "@/lib/types";

export function composeLetterText(draft: TranslatedLetterDraft) {
  return [
    draft.departmentName,
    draft.address,
    draft.date,
    "",
    `Subject: ${draft.subject}`,
    "",
    draft.salutation,
    "",
    draft.body,
    "",
    draft.closing,
    draft.signature
  ]
    .join("\n")
    .trim();
}
