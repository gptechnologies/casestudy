"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Map, User, Database, FileText, ArrowRightLeft } from "lucide-react";
import { useAppStore } from "@/lib/store";
import ResponseForm from "@/components/forms/ResponseForm";
import { EntityType } from "@/lib/types";

export default function IntakePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedType, setSelectedType] = useState<EntityType>("system");
  const [selectedId, setSelectedId] = useState<string>("");

  const contributorName = useAppStore((s) => s.contributorName);
  const setContributorName = useAppStore((s) => s.setContributorName);
  const systems = useAppStore((s) => s.systems);
  const deliverables = useAppStore((s) => s.deliverables);
  const flows = useAppStore((s) => s.flows);
  const responses = useAppStore((s) => s.responses);

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

  const entities =
    selectedType === "system"
      ? systems
      : selectedType === "deliverable"
      ? deliverables
      : flows;

  const selectedEntity = entities.find((e) => e.id === selectedId);
  const entityName =
    selectedType === "flow"
      ? (selectedEntity as { label?: string })?.label || "Unnamed Flow"
      : (selectedEntity as { name?: string })?.name || "";

  const getResponseCount = (entityType: EntityType, entityId: string) =>
    responses.filter(
      (r) => r.entityType === entityType && r.entityId === entityId
    ).length;

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
              <Map size={16} className="text-accent" />
              <span className="text-[14px] font-semibold text-text-primary">
                Guided Intake
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

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold text-text-primary mb-2">
            Submit Information
          </h1>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            Help us map how information flows across the firm. Select a system, deliverable,
            or flow below and answer as many questions as you can. Your responses will be
            attributed to your name and added to the systems map.
          </p>
        </div>

        {/* Type selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setSelectedType("system");
              setSelectedId("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
              selectedType === "system"
                ? "bg-accent-muted text-accent border-accent/30"
                : "bg-bg-secondary text-text-secondary border-border-subtle hover:border-border-default"
            }`}
          >
            <Database size={15} />
            Systems ({systems.length})
          </button>
          <button
            onClick={() => {
              setSelectedType("deliverable");
              setSelectedId("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
              selectedType === "deliverable"
                ? "bg-accent-muted text-accent border-accent/30"
                : "bg-bg-secondary text-text-secondary border-border-subtle hover:border-border-default"
            }`}
          >
            <FileText size={15} />
            Deliverables ({deliverables.length})
          </button>
          <button
            onClick={() => {
              setSelectedType("flow");
              setSelectedId("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
              selectedType === "flow"
                ? "bg-accent-muted text-accent border-accent/30"
                : "bg-bg-secondary text-text-secondary border-border-subtle hover:border-border-default"
            }`}
          >
            <ArrowRightLeft size={15} />
            Flows ({flows.length})
          </button>
        </div>

        {/* Entity selector */}
        <div className="mb-8">
          <label className="block text-[12px] font-medium text-text-secondary mb-2">
            Select {selectedType}
          </label>
          <div className="grid gap-2">
            {entities.map((entity) => {
              const name =
                selectedType === "flow"
                  ? (entity as { label?: string }).label || "Unnamed Flow"
                  : (entity as { name?: string }).name || "Unnamed";
              const isSelected = selectedId === entity.id;
              const respCount = getResponseCount(selectedType, entity.id);

              return (
                <button
                  key={entity.id}
                  onClick={() => setSelectedId(entity.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-accent-muted border-accent/30 ring-1 ring-accent"
                      : "bg-bg-secondary border-border-subtle hover:border-border-default"
                  }`}
                >
                  <div>
                    <p
                      className={`text-[13px] font-medium ${
                        isSelected ? "text-accent" : "text-text-primary"
                      }`}
                    >
                      {name}
                    </p>
                    {"category" in entity && (
                      <p className="text-[11px] text-text-tertiary mt-0.5">
                        {(entity as { category: string }).category}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {respCount > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent-muted text-accent">
                        {respCount} responses
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-warning/10 text-warning">
                        needs input
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            {entities.length === 0 && (
              <div className="text-center py-8 text-[13px] text-text-tertiary">
                No {selectedType}s have been added yet. Add them from the map view.
              </div>
            )}
          </div>
        </div>

        {/* Response form */}
        {selectedId && selectedEntity && (
          <div className="bg-bg-secondary border border-border-subtle rounded-xl p-6">
            <ResponseForm
              key={selectedId}
              entityType={selectedType}
              entityId={selectedId}
              entityName={entityName}
              contributorName={contributorName}
            />
          </div>
        )}
      </div>
    </div>
  );
}
