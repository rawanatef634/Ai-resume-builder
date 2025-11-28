// src/app/components/CoverLetterPreview.tsx
import React, { forwardRef } from "react";
import type { ResumeHeader } from "./ResumeHeaderForm";

interface CoverLetterPreviewProps {
  header: ResumeHeader;
  coverLetter: string;
}

export const CoverLetterPreview = forwardRef<
  HTMLDivElement,
  CoverLetterPreviewProps
>(({ header, coverLetter }, ref) => {
  const hasContent = Boolean(coverLetter?.trim());

  return (
    <div className="flex h-[800px] items-start justify-center overflow-y-auto">
      <div
        ref={ref}
        data-print-resume /* reuse same print rules so PDF looks good */
        className="w-full max-w-[850px] border border-gray-300 bg-white px-12 py-10 text-black shadow-2xl"
        style={{
          minHeight: "297mm",
          maxWidth: "210mm",
        }}
      >
        {/* Header */}
        <header className="border-b-2 border-gray-800 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {header.fullName || "Your Name"}
          </h1>
          <p className="mt-1 text-[11px] text-gray-700">
            {header.location && <span>{header.location}</span>}
            {header.email && (
              <>
                {header.location && " · "}
                <span>{header.email}</span>
              </>
            )}
            {header.phone && (
              <>
                {(header.location || header.email) && " · "}
                <span>{header.phone}</span>
              </>
            )}
          </p>
        </header>

        {/* Body */}
        <main className="mt-6 text-[13px] leading-relaxed text-gray-900">
          {hasContent ? (
            coverLetter.split("\n").map((line, idx) =>
              line.trim() === "" ? (
                <div key={idx} className="h-4" />
              ) : (
                <p key={idx} className="mb-1">
                  {line}
                </p>
              ),
            )
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg font-semibold">
                  Your cover letter will appear here
                </p>
                <p className="mt-2 text-sm">
                  Go to the <span className="font-medium">Cover letter</span>{" "}
                  tab and click &quot;Generate&quot; to get a tailored letter.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
});

CoverLetterPreview.displayName = "CoverLetterPreview";
