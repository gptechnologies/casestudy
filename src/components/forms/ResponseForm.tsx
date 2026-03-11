"use client";

import { useState } from "react";
import { CheckCircle2, Send, ChevronDown, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getQuestionsForEntity, type QuestionDefinition } from "@/lib/questions";
import { EntityType } from "@/lib/types";

interface ResponseFormProps {
  entityType: EntityType;
  entityId: string;
  entityName: string;
  contributorName: string;
}

function QuestionGroupForm({
  title,
  questions,
  answers,
  setAnswer,
}: {
  title: string;
  questions: QuestionDefinition[];
  answers: Record<string, string>;
  setAnswer: (key: string, value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-border-subtle rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-text-secondary bg-bg-surface hover:bg-bg-elevated transition-colors"
      >
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {title}
      </button>
      {isOpen && (
        <div className="p-5 space-y-5 bg-bg-secondary">
          {questions.map((q) => (
            <div key={q.key}>
              <label className="block text-[13px] font-medium text-text-primary mb-2">
                {q.label}
              </label>
              <textarea
                value={answers[q.key] || ""}
                onChange={(e) => setAnswer(q.key, e.target.value)}
                placeholder={q.placeholder}
                rows={3}
                className="w-full px-4 py-3 rounded-lg text-[13px] leading-relaxed bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResponseForm({
  entityType,
  entityId,
  entityName,
  contributorName,
}: ResponseFormProps) {
  const addResponse = useAppStore((s) => s.addResponse);
  const questions = getQuestionsForEntity(entityType);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const grouped = {
    deterministic: questions.filter((q) => q.group === "deterministic"),
    subjective: questions.filter((q) => q.group === "subjective"),
    risk: questions.filter((q) => q.group === "risk"),
  };

  const setAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const filledCount = Object.values(answers).filter((v) => v.trim()).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(answers).forEach(([key, value]) => {
      if (value.trim()) {
        addResponse({
          contributorId: contributorName,
          contributorName: contributorName || "Anonymous",
          entityType,
          entityId,
          questionKey: key as typeof questions[number]["key"],
          responseText: value,
        });
      }
    });
    setSubmitted(true);
    setAnswers({});
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <CheckCircle2 size={48} className="text-success mb-4" />
        <h3 className="text-[16px] font-semibold text-text-primary mb-2">
          Responses submitted
        </h3>
        <p className="text-[13px] text-text-secondary text-center mb-6">
          Your responses for <span className="font-medium text-text-primary">{entityName}</span> have been saved
          under <span className="font-medium text-accent">{contributorName || "Anonymous"}</span>.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-4 py-2 rounded-lg text-[12px] font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
        >
          Submit more
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-text-primary">{entityName}</h3>
        <span className="text-[11px] text-text-tertiary">
          {filledCount}/{questions.length} answered
        </span>
      </div>

      {grouped.deterministic.length > 0 && (
        <QuestionGroupForm
          title="Deterministic Questions"
          questions={grouped.deterministic}
          answers={answers}
          setAnswer={setAnswer}
        />
      )}
      {grouped.subjective.length > 0 && (
        <QuestionGroupForm
          title="Subjective Questions"
          questions={grouped.subjective}
          answers={answers}
          setAnswer={setAnswer}
        />
      )}
      {grouped.risk.length > 0 && (
        <QuestionGroupForm
          title="Risk & Friction"
          questions={grouped.risk}
          answers={answers}
          setAnswer={setAnswer}
        />
      )}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={filledCount === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={14} />
          Submit {filledCount} Response{filledCount !== 1 ? "s" : ""}
        </button>
      </div>
    </form>
  );
}
