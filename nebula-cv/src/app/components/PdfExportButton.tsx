// src/app/components/PdfExportButton.tsx
"use client";

import { useReactToPrint } from "react-to-print";
import { MutableRefObject } from "react";
import { Download } from "lucide-react";

interface PdfExportButtonProps {
  resumeRef: MutableRefObject<HTMLDivElement | null>;
  coverLetterRef: MutableRefObject<HTMLDivElement | null>;
  previewMode: "resume" | "coverLetter";
  disabled: boolean;
}

export function PdfExportButton({
  resumeRef,
  coverLetterRef,
  previewMode,
  disabled,
}: PdfExportButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef:
      previewMode === "resume" ? resumeRef : coverLetterRef,
    documentTitle:
      previewMode === "resume"
        ? "NebulaCV-Resume"
        : "NebulaCV-CoverLetter",
  });

  return (
    <button
      onClick={handlePrint}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download className="h-5 w-5" />
      {previewMode === "resume"
        ? "Download resume as PDF"
        : "Download cover letter as PDF"}
    </button>
  );
}
