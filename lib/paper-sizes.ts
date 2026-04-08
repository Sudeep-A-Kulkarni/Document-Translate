import { PaperSize } from "@/lib/types";

const MM_TO_PX = 96 / 25.4;

export interface PaperSizeDefinition {
  label: string;
  widthMm: number;
  heightMm: number;
}

export const PAPER_SIZE_OPTIONS: PaperSize[] = [
  "a0",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "letter",
  "legal",
  "tabloid",
  "executive",
  "folio"
];

export const PAPER_SIZES: Record<PaperSize, PaperSizeDefinition> = {
  a0: { label: "A0", widthMm: 841, heightMm: 1189 },
  a1: { label: "A1", widthMm: 594, heightMm: 841 },
  a2: { label: "A2", widthMm: 420, heightMm: 594 },
  a3: { label: "A3", widthMm: 297, heightMm: 420 },
  a4: { label: "A4", widthMm: 210, heightMm: 297 },
  a5: { label: "A5", widthMm: 148, heightMm: 210 },
  a6: { label: "A6", widthMm: 105, heightMm: 148 },
  letter: { label: "Letter", widthMm: 216, heightMm: 279 },
  legal: { label: "Legal", widthMm: 216, heightMm: 356 },
  tabloid: { label: "Tabloid", widthMm: 279, heightMm: 432 },
  executive: { label: "Executive", widthMm: 184, heightMm: 267 },
  folio: { label: "Folio", widthMm: 216, heightMm: 330 }
};

export const DOCUMENT_PADDING_MM = {
  horizontal: 16,
  vertical: 18
};

export function getPaperPixelDimensions(paperSize: PaperSize) {
  const definition = PAPER_SIZES[paperSize];

  return {
    widthPx: Math.round(definition.widthMm * MM_TO_PX),
    heightPx: Math.round(definition.heightMm * MM_TO_PX)
  };
}

export function getPaperPaddingPx() {
  return {
    horizontalPx: Math.round(DOCUMENT_PADDING_MM.horizontal * MM_TO_PX),
    verticalPx: Math.round(DOCUMENT_PADDING_MM.vertical * MM_TO_PX)
  };
}
