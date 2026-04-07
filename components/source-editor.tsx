"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LetterDraft } from "@/lib/types";

interface SourceEditorProps {
  draft: LetterDraft;
  onFieldChange: <K extends keyof LetterDraft>(field: K, value: LetterDraft[K]) => void;
}

export function SourceEditor({ draft, onFieldChange }: SourceEditorProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="departmentName">Department Name</Label>
          <Input
            id="departmentName"
            value={draft.departmentName}
            onChange={(event) => onFieldChange("departmentName", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={draft.date} onChange={(event) => onFieldChange("date", event.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          rows={3}
          value={draft.address}
          onChange={(event) => onFieldChange("address", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" value={draft.subject} onChange={(event) => onFieldChange("subject", event.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="salutation">Salutation</Label>
        <Input
          id="salutation"
          value={draft.salutation}
          onChange={(event) => onFieldChange("salutation", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">English Draft</Label>
        <Textarea
          id="body"
          rows={12}
          placeholder="Type the main letter content in English..."
          value={draft.body}
          onChange={(event) => onFieldChange("body", event.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="closing">Closing</Label>
          <Input id="closing" value={draft.closing} onChange={(event) => onFieldChange("closing", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signature">Signature</Label>
          <Input
            id="signature"
            value={draft.signature}
            onChange={(event) => onFieldChange("signature", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
