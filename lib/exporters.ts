import { LANGUAGE_LABELS } from "@/lib/translation";
import { DocumentLanguage, TargetLanguage, TranslatedLetterDraft } from "@/lib/types";

type DocxModule = typeof import("docx");

function createParagraphs(
  docx: DocxModule,
  text: string,
  options?: { bold?: boolean; spacingAfter?: number }
) {
  const { Paragraph, TextRun } = docx;

  return text
    .split("\n")
    .filter((line, index, lines) => line.trim() !== "" || (index < lines.length - 1 && lines[index + 1]?.trim() !== ""))
    .map(
      (line) =>
        new Paragraph({
          spacing: { after: options?.spacingAfter ?? 140 },
          children: [
            new TextRun({
              text: line || " ",
              bold: options?.bold ?? false,
              font: "Noto Sans Devanagari"
            })
          ]
        })
    );
}

export async function exportLetterAsDocx(draft: TranslatedLetterDraft, language: TargetLanguage) {
  const docx = await import("docx");
  const { AlignmentType, Document, Packer, Paragraph, TextRun } = docx;
  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: draft.departmentName,
                bold: true,
                size: 30,
                font: "Noto Sans Devanagari"
              })
            ]
          }),
          ...createParagraphs(docx, draft.address, { spacingAfter: 80 }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: draft.date,
                font: "Noto Sans Devanagari"
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: "Subject: ",
                bold: true,
                font: "Noto Sans Devanagari"
              }),
              new TextRun({
                text: draft.subject,
                font: "Noto Sans Devanagari"
              })
            ]
          }),
          ...createParagraphs(docx, draft.salutation, { spacingAfter: 120 }),
          ...createParagraphs(docx, draft.body, { spacingAfter: 120 }),
          ...createParagraphs(docx, draft.closing, { spacingAfter: 100 }),
          ...createParagraphs(docx, draft.signature, { bold: true, spacingAfter: 100 })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(document);
  const url = URL.createObjectURL(blob);
  const anchor = documentRef(url, `administrative-letter-${LANGUAGE_LABELS[language].toLowerCase()}.docx`);
  anchor.click();
  cleanupDownload(url, anchor);
}

function documentRef(url: string, fileName: string) {
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  window.document.body.appendChild(anchor);
  return anchor;
}

function cleanupDownload(url: string, anchor: HTMLAnchorElement) {
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
    anchor.remove();
  }, 0);
}

export async function exportLetterAsPdf(element: HTMLElement, language: DocumentLanguage) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  });

  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageWidth = pageWidth - 16;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;

  let renderedHeight = imageHeight;
  let positionY = 8;

  pdf.addImage(imageData, "PNG", 8, positionY, imageWidth, imageHeight);
  renderedHeight -= pageHeight - 16;

  while (renderedHeight > 0) {
    positionY = renderedHeight - imageHeight + 8;
    pdf.addPage();
    pdf.addImage(imageData, "PNG", 8, positionY, imageWidth, imageHeight);
    renderedHeight -= pageHeight - 16;
  }

  pdf.save(`administrative-letter-${LANGUAGE_LABELS[language].toLowerCase()}.pdf`);
}

export const exportDocumentAsPdf = exportLetterAsPdf;
