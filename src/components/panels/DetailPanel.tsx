"use client";

import { useState } from "react";
import {
  X,
  Trash2,
  Tag,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Save,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getQuestionsForEntity, type QuestionDefinition } from "@/lib/questions";
import { SYSTEM_CATEGORIES, DELIVERABLE_CATEGORIES, CRITICALITY_COLORS } from "@/lib/map-config";
import { formatDate } from "@/lib/utils";
import { EntityType, Criticality, AutomationLevel, Frequency } from "@/lib/types";

function QuestionGroup({
  title,
  questions,
  entityType,
  entityId,
}: {
  title: string;
  questions: QuestionDefinition[];
  entityType: EntityType;
  entityId: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const responses = useAppStore((s) => s.responses);
  const contributorName = useAppStore((s) => s.contributorName);
  const addResponse = useAppStore((s) => s.addResponse);
  const updateResponse = useAppStore((s) => s.updateResponse);

  const entityResponses = responses.filter(
    (r) => r.entityType === entityType && r.entityId === entityId
  );

  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary hover:text-text-secondary transition-colors"
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {title}
        <span className="ml-auto text-[10px] font-normal normal-case tracking-normal text-text-tertiary">
          {entityResponses.filter((r) =>
            questions.some((q) => q.key === r.questionKey)
          ).length}
          /{questions.length}
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {questions.map((q) => {
            const existing = entityResponses.find(
              (r) => r.questionKey === q.key
            );
            return (
              <QuestionField
                key={q.key}
                question={q}
                entityType={entityType}
                entityId={entityId}
                existingResponse={existing}
                contributorName={contributorName}
                addResponse={addResponse}
                updateResponse={updateResponse}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function QuestionField({
  question,
  entityType,
  entityId,
  existingResponse,
  contributorName,
  addResponse,
  updateResponse,
}: {
  question: QuestionDefinition;
  entityType: EntityType;
  entityId: string;
  existingResponse?: { id: string; responseText: string; contributorName: string; updatedAt: string };
  contributorName: string;
  addResponse: (data: {
    contributorId: string;
    contributorName: string;
    entityType: EntityType;
    entityId: string;
    questionKey: typeof question.key;
    responseText: string;
  }) => void;
  updateResponse: (id: string, text: string) => void;
}) {
  const [value, setValue] = useState(existingResponse?.responseText || "");
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    if (!value.trim()) return;
    if (existingResponse) {
      updateResponse(existingResponse.id, value);
    } else {
      addResponse({
        contributorId: contributorName,
        contributorName: contributorName || "Anonymous",
        entityType,
        entityId,
        questionKey: question.key,
        responseText: value,
      });
    }
    setIsDirty(false);
  };

  return (
    <div>
      <label className="block text-[12px] font-medium text-text-primary mb-1.5">
        {question.label}
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsDirty(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSave();
            }
          }}
          placeholder={question.placeholder}
          rows={2}
          className="w-full px-3 py-2 rounded-lg text-[12px] leading-relaxed bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
        />
        {isDirty && value.trim() && (
          <button
            onClick={handleSave}
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            <Save size={10} />
            Save
          </button>
        )}
      </div>
      {existingResponse && (
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-text-tertiary">
            {existingResponse.contributorName}
          </span>
          <span className="text-[10px] text-text-tertiary">
            {formatDate(existingResponse.updatedAt)}
          </span>
        </div>
      )}
    </div>
  );
}

function ResponseHistory({
  entityType,
  entityId,
}: {
  entityType: EntityType;
  entityId: string;
}) {
  const responses = useAppStore((s) => s.responses);
  const entityResponses = responses
    .filter((r) => r.entityType === entityType && r.entityId === entityId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (entityResponses.length === 0) return null;

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={12} className="text-text-tertiary" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
          All Responses ({entityResponses.length})
        </span>
      </div>
      <div className="space-y-2">
        {entityResponses.map((r) => (
          <div
            key={r.id}
            className="px-3 py-2 rounded-lg bg-bg-primary border border-border-subtle"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-accent">
                {r.contributorName}
              </span>
              <span className="text-[9px] text-text-tertiary">
                {formatDate(r.updatedAt)}
              </span>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {r.responseText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DetailPanel() {
  const selectedEntity = useAppStore((s) => s.selectedEntity);
  const setSelectedEntity = useAppStore((s) => s.setSelectedEntity);
  const systems = useAppStore((s) => s.systems);
  const deliverables = useAppStore((s) => s.deliverables);
  const flowsData = useAppStore((s) => s.flows);
  const updateSystem = useAppStore((s) => s.updateSystem);
  const updateDeliverable = useAppStore((s) => s.updateDeliverable);
  const updateFlow = useAppStore((s) => s.updateFlow);
  const deleteSystem = useAppStore((s) => s.deleteSystem);
  const deleteDeliverable = useAppStore((s) => s.deleteDeliverable);
  const deleteFlow = useAppStore((s) => s.deleteFlow);
  const tags = useAppStore((s) => s.tags);
  const entityTags = useAppStore((s) => s.entityTags);
  const addEntityTag = useAppStore((s) => s.addEntityTag);
  const removeEntityTag = useAppStore((s) => s.removeEntityTag);

  if (!selectedEntity) return null;

  const { type, id } = selectedEntity;

  let entity: { name: string; description?: string; category?: string } | null = null;
  if (type === "system") entity = systems.find((s) => s.id === id) || null;
  if (type === "deliverable") entity = deliverables.find((d) => d.id === id) || null;
  if (type === "flow") {
    const f = flowsData.find((fl) => fl.id === id);
    entity = f ? { name: f.label || "Unnamed Flow", description: f.notes } : null;
  }

  if (!entity) return null;

  const questions = getQuestionsForEntity(type);
  const grouped = {
    deterministic: questions.filter((q) => q.group === "deterministic"),
    subjective: questions.filter((q) => q.group === "subjective"),
    risk: questions.filter((q) => q.group === "risk"),
  };

  const currentTags = entityTags
    .filter((et) => et.entityType === type && et.entityId === id)
    .map((et) => et.tagId);

  const handleDelete = () => {
    if (type === "system") deleteSystem(id);
    if (type === "deliverable") deleteDeliverable(id);
    if (type === "flow") deleteFlow(id);
  };

  return (
    <div className="w-[380px] h-full flex-shrink-0 bg-bg-secondary border-l border-border-subtle overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-secondary border-b border-border-subtle px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
              {type}
            </span>
            {type === "system" && (
              <input
                value={entity.name}
                onChange={(e) => updateSystem(id, { name: e.target.value })}
                className="block w-full mt-1 text-[15px] font-semibold text-text-primary bg-transparent border-none outline-none focus:ring-0 p-0"
              />
            )}
            {type === "deliverable" && (
              <input
                value={entity.name}
                onChange={(e) => updateDeliverable(id, { name: e.target.value })}
                className="block w-full mt-1 text-[15px] font-semibold text-text-primary bg-transparent border-none outline-none focus:ring-0 p-0"
              />
            )}
            {type === "flow" && (
              <input
                value={entity.name}
                onChange={(e) => updateFlow(id, { label: e.target.value })}
                className="block w-full mt-1 text-[15px] font-semibold text-text-primary bg-transparent border-none outline-none focus:ring-0 p-0"
              />
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-md text-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={() => setSelectedEntity(null)}
              className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Metadata fields */}
        <div className="mt-3 space-y-2">
          {type === "system" && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-medium text-text-tertiary w-16">Category</label>
                <select
                  value={(systems.find((s) => s.id === id) as { category: string })?.category || ""}
                  onChange={(e) => updateSystem(id, { category: e.target.value })}
                  className="flex-1 px-2 py-1 rounded text-[11px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {SYSTEM_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-medium text-text-tertiary w-16">Criticality</label>
                <select
                  value={(systems.find((s) => s.id === id))?.criticality || "medium"}
                  onChange={(e) => updateSystem(id, { criticality: e.target.value as Criticality })}
                  className="flex-1 px-2 py-1 rounded text-[11px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {(["low", "medium", "high", "critical"] as Criticality[]).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-medium text-text-tertiary w-16">Owner</label>
                <input
                  value={(systems.find((s) => s.id === id))?.owner || ""}
                  onChange={(e) => updateSystem(id, { owner: e.target.value })}
                  placeholder="Who owns this system?"
                  className="flex-1 px-2 py-1 rounded text-[11px] bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </>
          )}
          {type === "deliverable" && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-medium text-text-tertiary w-16">Category</label>
                <select
                  value={(deliverables.find((d) => d.id === id))?.category || ""}
                  onChange={(e) => updateDeliverable(id, { category: e.target.value })}
                  className="flex-1 px-2 py-1 rounded text-[11px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {DELIVERABLE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-medium text-text-tertiary w-16">Audience</label>
                <input
                  value={(deliverables.find((d) => d.id === id))?.audience || ""}
                  onChange={(e) => updateDeliverable(id, { audience: e.target.value })}
                  placeholder="Who receives this?"
                  className="flex-1 px-2 py-1 rounded text-[11px] bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-medium text-text-tertiary w-16">Frequency</label>
                <select
                  value={(deliverables.find((d) => d.id === id))?.frequency || "monthly"}
                  onChange={(e) => updateDeliverable(id, { frequency: e.target.value as Frequency })}
                  className="flex-1 px-2 py-1 rounded text-[11px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {(["daily", "weekly", "monthly", "quarterly", "ad-hoc", "real-time"] as Frequency[]).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          {type === "flow" && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-medium text-text-tertiary w-16">Automation</label>
                <select
                  value={(flowsData.find((f) => f.id === id))?.automationLevel || "manual"}
                  onChange={(e) => updateFlow(id, { automationLevel: e.target.value as AutomationLevel })}
                  className="flex-1 px-2 py-1 rounded text-[11px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {(["manual", "semi-manual", "automated"] as AutomationLevel[]).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-medium text-text-tertiary w-16">Frequency</label>
                <select
                  value={(flowsData.find((f) => f.id === id))?.frequency || "ad-hoc"}
                  onChange={(e) => updateFlow(id, { frequency: e.target.value as Frequency })}
                  className="flex-1 px-2 py-1 rounded text-[11px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {(["daily", "weekly", "monthly", "quarterly", "ad-hoc", "real-time"] as Frequency[]).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Tag size={10} className="text-text-tertiary" />
            <span className="text-[10px] font-medium text-text-tertiary">Tags</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => {
              const isActive = currentTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() =>
                    isActive
                      ? removeEntityTag(type, id, tag.id)
                      : addEntityTag(type, id, tag.id)
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all ${
                    isActive
                      ? "border-transparent"
                      : "border-border-subtle opacity-40 hover:opacity-70"
                  }`}
                  style={{
                    background: isActive ? tag.color + "25" : "transparent",
                    color: isActive ? tag.color : "var(--text-tertiary)",
                  }}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div>
        {grouped.deterministic.length > 0 && (
          <QuestionGroup
            title="Deterministic"
            questions={grouped.deterministic}
            entityType={type}
            entityId={id}
          />
        )}
        {grouped.subjective.length > 0 && (
          <QuestionGroup
            title="Subjective"
            questions={grouped.subjective}
            entityType={type}
            entityId={id}
          />
        )}
        {grouped.risk.length > 0 && (
          <QuestionGroup
            title="Risk & Friction"
            questions={grouped.risk}
            entityType={type}
            entityId={id}
          />
        )}
      </div>

      {/* Response History */}
      <ResponseHistory entityType={type} entityId={id} />
    </div>
  );
}
