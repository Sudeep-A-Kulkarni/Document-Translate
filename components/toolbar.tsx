"use client";

import { Download, FileText, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOCUMENT_TYPE_LABELS } from "@/lib/templates";
import { LANGUAGE_LABELS } from "@/lib/translation";
import { DocumentType, TargetLanguage } from "@/lib/types";

interface ToolbarProps {
  documentType: DocumentType;
  targetLanguage: TargetLanguage;
  onDocumentTypeChange: (value: DocumentType) => void;
  onTargetLanguageChange: (value: TargetLanguage) => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onCopy: () => void;
  exportDisabled?: boolean;
}

export function Toolbar({
  documentType,
  targetLanguage,
  onDocumentTypeChange,
  onTargetLanguageChange,
  onExportDocx,
  onExportPdf,
  onCopy,
  exportDisabled
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-white/75 p-5 shadow-sm backdrop-blur">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={targetLanguage} onValueChange={(value) => onTargetLanguageChange(value as TargetLanguage)}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="document-type">Document Type</Label>
          <Select value={documentType} onValueChange={(value) => onDocumentTypeChange(value as DocumentType)}>
            <SelectTrigger id="document-type">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onExportDocx} disabled={exportDisabled} className="flex-1 sm:flex-none">
          <FileText className="h-4 w-4" />
          Download Word
        </Button>
        <Button onClick={onExportPdf} disabled={exportDisabled} variant="secondary" className="flex-1 sm:flex-none">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button onClick={onCopy} disabled={exportDisabled} variant="outline" className="flex-1 sm:flex-none">
          <Languages className="h-4 w-4" />
          Copy Text
        </Button>
      </div>
    </div>
  );
}
