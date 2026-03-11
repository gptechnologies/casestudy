"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  User,
  Upload,
  Video,
  CheckCircle,
  Loader2,
  AlertCircle,
  Database,
  GitBranch,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

type Mode = "system" | "workflow";

interface SystemResult {
  name: string;
  category: string;
  description: string;
  criticality: string;
}

interface WorkflowResult {
  title: string;
  description: string;
  systemNames: string[];
  category: "workflow" | "pain-point";
}

export default function AssistantPage() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("system");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ type: Mode; name: string } | null>(null);

  const contributorName = useAppStore((s) => s.contributorName);
  const setContributorName = useAppStore((s) => s.setContributorName);
  const systems = useAppStore((s) => s.systems);
  const addSystem = useAppStore((s) => s.addSystem);
  const addWorkflow = useAppStore((s) => s.addWorkflow);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setCreated(null);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          text: text.trim(),
          existingSystemNames: systems.map((s) => s.name),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      if (mode === "system") {
        const r = data.result as SystemResult;
        const maxX = systems.length > 0 ? Math.max(...systems.map((s) => s.xPosition)) : 0;
        addSystem({
          name: r.name,
          category: r.category,
          description: r.description,
          criticality: r.criticality as "low" | "medium" | "high" | "critical",
          xPosition: maxX + 250,
          yPosition: 200 + Math.random() * 200,
        });
        setCreated({ type: "system", name: r.name });
      } else {
        const r = data.result as WorkflowResult;
        const matchedIds = r.systemNames
          .map((name) => {
            const lower = name.toLowerCase();
            return systems.find((s) => s.name.toLowerCase().includes(lower) || lower.includes(s.name.toLowerCase()));
          })
          .filter(Boolean)
          .map((s) => s!.id);

        addWorkflow({
          title: r.title,
          description: r.description,
          systemIds: matchedIds,
          contributorName: contributorName || "AI Assistant",
          category: r.category === "pain-point" ? "pain-point" : "workflow",
        });
        setCreated({ type: "workflow", name: r.title });
      }

      setText("");
    } catch {
      setError("Failed to connect to AI service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-subtle">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/map"
              className="flex items-center gap-1.5 text-[12px] font-medium text-text-tertiary hover:text-accent transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Map
            </a>
            <div className="h-5 w-px bg-border-subtle" />
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              <span className="text-[14px] font-semibold text-text-primary">
                AI Assistant
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User size={14} className="text-text-tertiary" />
            <input
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="Your name"
              className="w-40 px-3 py-1.5 rounded-lg text-[12px] bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold text-text-primary mb-2">
            Describe it, we&apos;ll map it
          </h1>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            Tell us about a system or workflow in plain English. The AI will extract the
            structured details and add it to the app for you.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("system"); setCreated(null); setError(""); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
              mode === "system"
                ? "bg-accent-muted text-accent border-accent/30"
                : "bg-bg-secondary text-text-secondary border-border-subtle hover:border-border-default"
            }`}
          >
            <Database size={15} />
            Add System
          </button>
          <button
            onClick={() => { setMode("workflow"); setCreated(null); setError(""); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
              mode === "workflow"
                ? "bg-accent-muted text-accent border-accent/30"
                : "bg-bg-secondary text-text-secondary border-border-subtle hover:border-border-default"
            }`}
          >
            <GitBranch size={15} />
            Add Workflow
          </button>
        </div>

        {/* Input */}
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-6 mb-4">
          <label className="block text-[12px] font-medium text-text-secondary mb-2">
            {mode === "system"
              ? "Describe the system or tool"
              : "Describe the workflow or pain point"}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              mode === "system"
                ? 'e.g., "Bloomberg is our market data terminal. We pull pricing, reference data, and corporate actions from it daily into Excel."'
                : 'e.g., "I aggregate open interest from 10 different DEXs, download the OI data from each, then append and aggregate everything in Excel to get a final number."'
            }
            rows={5}
            className="w-full px-3 py-2.5 rounded-lg text-[13px] leading-relaxed bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
          />

          {/* File upload placeholder */}
          <div className="mt-4 border-2 border-dashed border-border-subtle rounded-xl p-6 flex flex-col items-center gap-3 opacity-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center">
                <Upload size={18} className="text-text-tertiary" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center">
                <Video size={18} className="text-text-tertiary" />
              </div>
            </div>
            <p className="text-[12px] text-text-tertiary text-center">
              Drop a screen recording or file here
            </p>
            <button
              disabled
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-bg-elevated text-text-tertiary border border-border-subtle cursor-not-allowed"
            >
              Upload (coming soon)
            </button>
          </div>

          {/* Submit */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              {loading ? "Processing..." : "Create with AI"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 mb-4">
            <AlertCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-danger">{error}</p>
          </div>
        )}

        {/* Success */}
        {created && (
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-success/10 border border-success/20">
            <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-medium text-success mb-1">
                {created.type === "system" ? "System" : "Workflow"} created successfully
              </p>
              <p className="text-[12px] text-text-secondary">
                &ldquo;{created.name}&rdquo; has been added.{" "}
                {created.type === "system" ? (
                  <a href="/map" className="text-accent hover:underline">
                    View on map
                  </a>
                ) : (
                  <a href="/workflows" className="text-accent hover:underline">
                    View in workflows
                  </a>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Existing systems hint for workflow mode */}
        {mode === "workflow" && systems.length > 0 && (
          <div className="mt-6 px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle">
            <p className="text-[11px] font-medium text-text-tertiary mb-2">
              The AI will try to match systems you mention to these existing ones:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {systems.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent-muted text-accent"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
