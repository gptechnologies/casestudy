"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  GitBranch,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  User,
  AlertTriangle,
  Workflow,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import type { Workflow as WorkflowType } from "@/lib/types";

export default function WorkflowsPage() {
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const workflows = useAppStore((s) => s.workflows);
  const addWorkflow = useAppStore((s) => s.addWorkflow);
  const deleteWorkflow = useAppStore((s) => s.deleteWorkflow);
  const systems = useAppStore((s) => s.systems);
  const contributorName = useAppStore((s) => s.contributorName);
  const setContributorName = useAppStore((s) => s.setContributorName);

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

  const workflowItems = workflows.filter((w) => w.category === "workflow");
  const painPoints = workflows.filter((w) => w.category === "pain-point");

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
              <GitBranch size={16} className="text-accent" />
              <span className="text-[14px] font-semibold text-text-primary">
                Workflows & Pain Points
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User size={14} className="text-text-tertiary" />
              <input
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder="Your name"
                className="w-40 px-3 py-1.5 rounded-lg text-[12px] bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold text-text-primary mb-2">
            Cross-System Workflows
          </h1>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            Document workflows that span multiple systems and highlight recurring pain
            points. These help us understand the real cost of fragmented processes and
            identify where standardization or automation would have the most impact.
          </p>
        </div>

        {showForm && (
          <WorkflowForm
            systems={systems}
            contributorName={contributorName}
            addWorkflow={addWorkflow}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* Workflows */}
        {workflowItems.length > 0 && (
          <Section
            title="Workflows"
            icon={<Workflow size={14} className="text-accent" />}
            items={workflowItems}
            expandedId={expandedId}
            onToggle={setExpandedId}
            onDelete={deleteWorkflow}
            systems={systems}
          />
        )}

        {/* Pain points */}
        {painPoints.length > 0 && (
          <Section
            title="Pain Points"
            icon={<AlertTriangle size={14} className="text-warning" />}
            items={painPoints}
            expandedId={expandedId}
            onToggle={setExpandedId}
            onDelete={deleteWorkflow}
            systems={systems}
          />
        )}

        {workflows.length === 0 && !showForm && (
          <div className="text-center py-16">
            <GitBranch size={36} className="text-text-tertiary mx-auto mb-4 opacity-40" />
            <p className="text-[14px] text-text-tertiary mb-4">
              No workflows or pain points documented yet.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              <Plus size={14} />
              Add your first one
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  items,
  expandedId,
  onToggle,
  onDelete,
  systems,
}: {
  title: string;
  icon: React.ReactNode;
  items: WorkflowType[];
  expandedId: string | null;
  onToggle: (id: string | null) => void;
  onDelete: (id: string) => void;
  systems: { id: string; name: string }[];
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary">
          {title} ({items.length})
        </span>
      </div>
      <div className="space-y-2">
        {items.map((wf) => {
          const isExpanded = expandedId === wf.id;
          const sysNames = wf.systemIds
            .map((sid) => systems.find((s) => s.id === sid)?.name)
            .filter(Boolean);

          return (
            <div
              key={wf.id}
              className="rounded-xl border border-border-subtle bg-bg-secondary overflow-hidden"
            >
              <button
                onClick={() => onToggle(isExpanded ? null : wf.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-bg-surface transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="text-text-tertiary flex-shrink-0" />
                ) : (
                  <ChevronRight size={14} className="text-text-tertiary flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary truncate">
                    {wf.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {sysNames.map((name) => (
                      <span
                        key={name}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent-muted text-accent"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-text-tertiary">
                    {wf.contributorName}
                  </span>
                  <span className="text-[9px] text-text-tertiary">
                    {formatDate(wf.createdAt)}
                  </span>
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border-subtle pt-3">
                  <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {wf.description}
                  </p>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => onDelete(wf.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-danger hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 size={10} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkflowForm({
  systems,
  contributorName,
  addWorkflow,
  onClose,
}: {
  systems: { id: string; name: string }[];
  contributorName: string;
  addWorkflow: (data: Omit<WorkflowType, "id" | "createdAt" | "updatedAt">) => WorkflowType;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [category, setCategory] = useState<"workflow" | "pain-point">("workflow");

  const toggleSystem = (id: string) => {
    setSelectedSystems((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addWorkflow({
      title: title.trim(),
      description: description.trim(),
      systemIds: selectedSystems,
      contributorName: contributorName || "Anonymous",
      category,
    });

    setTitle("");
    setDescription("");
    setSelectedSystems([]);
    onClose();
  };

  return (
    <div className="mb-8 bg-bg-secondary border border-border-subtle rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-text-primary">
          New Workflow / Pain Point
        </h2>
        <button
          onClick={onClose}
          className="text-[11px] text-text-tertiary hover:text-text-secondary transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCategory("workflow")}
            className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium border transition-all ${
              category === "workflow"
                ? "bg-accent-muted text-accent border-accent/30"
                : "bg-bg-primary text-text-secondary border-border-subtle hover:border-border-default"
            }`}
          >
            Workflow
          </button>
          <button
            type="button"
            onClick={() => setCategory("pain-point")}
            className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium border transition-all ${
              category === "pain-point"
                ? "bg-warning/10 text-warning border-warning/30"
                : "bg-bg-primary text-text-secondary border-border-subtle hover:border-border-default"
            }`}
          >
            Pain Point
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="block text-[12px] font-medium text-text-secondary mb-1.5">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Aggregate OI across DEXs"
            className="w-full px-3 py-2 rounded-lg text-[13px] bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
          />
        </div>

        {/* Systems multi-select */}
        <div>
          <label className="block text-[12px] font-medium text-text-secondary mb-1.5">
            Systems involved
          </label>
          <div className="flex flex-wrap gap-1.5">
            {systems.map((sys) => {
              const selected = selectedSystems.includes(sys.id);
              return (
                <button
                  key={sys.id}
                  type="button"
                  onClick={() => toggleSystem(sys.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                    selected
                      ? "bg-accent-muted text-accent border-accent/30"
                      : "bg-bg-primary text-text-secondary border-border-subtle hover:border-border-default"
                  }`}
                >
                  {sys.name}
                </button>
              );
            })}
            {systems.length === 0 && (
              <span className="text-[11px] text-text-tertiary">
                No systems added yet — add them from the map first.
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[12px] font-medium text-text-secondary mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the workflow step by step, or explain the pain point..."
            rows={5}
            className="w-full px-3 py-2 rounded-lg text-[13px] leading-relaxed bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!title.trim() || !description.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={12} />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
