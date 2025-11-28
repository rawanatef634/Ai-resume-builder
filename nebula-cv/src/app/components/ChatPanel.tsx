// src/components/ChatPanel.tsx
"use client";

import { useState } from "react";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

interface ChatPanelProps {
  onResumeJson: (json: any) => void;
}

const INITIAL_QUESTIONS = [
  "Describe your most recent frontend role. You can write in Arabic or English.",
  "Which frontend technologies do you use regularly? (e.g., React, Vue, Angular, TypeScript, Tailwind CSS)",
  "Describe one project you are proud of. What was the impact on performance, UX, or business?",
  "What is your education background? (degrees, universities, dates, location).",
];

export function ChatPanel({ onResumeJson }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "We will collect key information about your frontend experience. Answer in Arabic or English. I will ask a few focused questions.",
    },
    { role: "assistant", content: INITIAL_QUESTIONS[0] },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/build-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: [
            ...messages.filter((m) => m.role === "user"),
            userMessage,
          ].map((m) => m.content),
        }),
      });

      const data = await res.json();

      if (data.resumeJson) {
        onResumeJson(data.resumeJson);
      }

      if (currentQuestionIndex < INITIAL_QUESTIONS.length - 1) {
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: INITIAL_QUESTIONS[nextIdx],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Thank you. You can continue refining your experience, or paste a job link to tailor your resume.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "An error occurred while processing your answers. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[550px] flex-col rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <h3 className="text-xl font-bold text-white">Guided Interview</h3>
          <p className="mt-1 text-sm text-slate-400">
            Question {currentQuestionIndex + 1} of {INITIAL_QUESTIONS.length}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          <span className="text-sm font-medium text-cyan-300">Arabic & English</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-base leading-relaxed text-white shadow-lg"
                : "max-w-[90%] rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-base leading-relaxed text-slate-200"
            }
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-200" />
          </div>
        )}
      </div>
      
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
            placeholder="Type your answer in Arabic or English..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}