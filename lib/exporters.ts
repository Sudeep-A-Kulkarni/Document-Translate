import { DOCUMENT_PADDING_MM, PAPER_SIZES } from "@/lib/paper-sizes";
import { LANGUAGE_LABELS } from "@/lib/translation";
import { DocumentLanguage, PaperSize, TargetLanguage, TranslatedLetterDraft } from "@/lib/types";

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

export async function exportLetterAsPdf(
  element: HTMLElement,
  language: DocumentLanguage,
  paperSize: PaperSize = "a4"
) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const paper = PAPER_SIZES[paperSize];
  const maxCanvasPixels = 20_000_000;
  const estimatedPixels = element.scrollWidth * element.scrollHeight;
  const scale = Math.min(2, Math.sqrt(maxCanvasPixels / Math.max(estimatedPixels, 1)));
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  });

  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [paper.widthMm, paper.heightMm]
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageWidth = pageWidth - DOCUMENT_PADDING_MM.horizontal * 2;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;
  const verticalMargin = DOCUMENT_PADDING_MM.vertical;

  let renderedHeight = imageHeight;
  let positionY = verticalMargin;

  pdf.addImage(imageData, "PNG", DOCUMENT_PADDING_MM.horizontal, positionY, imageWidth, imageHeight);
  renderedHeight -= pageHeight - verticalMargin * 2;

  while (renderedHeight > 0) {
    positionY = renderedHeight - imageHeight + verticalMargin;
    pdf.addPage();
    pdf.addImage(imageData, "PNG", DOCUMENT_PADDING_MM.horizontal, positionY, imageWidth, imageHeight);
    renderedHeight -= pageHeight - verticalMargin * 2;
  }

  pdf.save(`administrative-letter-${paper.label.toLowerCase()}-${LANGUAGE_LABELS[language].toLowerCase()}.pdf`);
}

export const exportDocumentAsPdf = exportLetterAsPdf;
