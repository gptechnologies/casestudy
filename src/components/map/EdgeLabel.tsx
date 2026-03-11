"use client";

import { memo, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { AUTOMATION_LEVEL_COLORS } from "@/lib/map-config";
import { AutomationLevel } from "@/lib/types";
import { useAppStore } from "@/lib/store";

interface FlowEntry {
  id: string;
  label: string;
  automationLevel: AutomationLevel;
}

interface FlowEdgeData {
  label?: string;
  automationLevel?: AutomationLevel;
  flowId?: string;
  flows?: FlowEntry[];
  [key: string]: unknown;
}

function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps & { data?: FlowEdgeData }) {
  const [expanded, setExpanded] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  });

  const autoLevel = data?.automationLevel || "manual";
  const color =
    AUTOMATION_LEVEL_COLORS[autoLevel as keyof typeof AUTOMATION_LEVEL_COLORS] ||
    "#64748b";

  const selectedEntity = useAppStore((s) => s.selectedEntity);
  const setSelectedEntity = useAppStore((s) => s.setSelectedEntity);

  const flowsList = data?.flows || [];
  const isMulti = flowsList.length > 1;
  const anySelected =
    selectedEntity?.type === "flow" &&
    flowsList.some((f) => f.id === selectedEntity.id);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: anySelected ? "var(--accent)" : color,
          strokeWidth: anySelected ? 3 : 2,
          opacity: anySelected ? 1 : 0.7,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            zIndex: expanded ? 50 : 1,
          }}
        >
          {isMulti ? (
            <div>
              {/* Count badge */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className={`
                  px-2.5 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap
                  border transition-all cursor-pointer
                  ${anySelected ? "ring-1 ring-accent" : ""}
                `}
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: anySelected ? "var(--accent)" : color + "50",
                  color: anySelected ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {flowsList.length} flows
                <span className="ml-1.5 text-[8px] opacity-60">
                  {expanded ? "\u25B2" : "\u25BC"}
                </span>
              </button>

              {/* Expanded list */}
              {expanded && (
                <div
                  className="mt-1 rounded-lg border overflow-hidden shadow-lg"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-subtle)",
                    minWidth: 160,
                  }}
                >
                  {flowsList.map((f) => {
                    const fColor =
                      AUTOMATION_LEVEL_COLORS[
                        f.automationLevel as keyof typeof AUTOMATION_LEVEL_COLORS
                      ] || "#64748b";
                    const fSelected =
                      selectedEntity?.type === "flow" &&
                      selectedEntity.id === f.id;

                    return (
                      <button
                        key={f.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEntity({ type: "flow", id: f.id });
                        }}
                        className={`
                          w-full flex items-center gap-2 px-3 py-1.5 text-left
                          text-[10px] transition-colors border-b last:border-b-0
                          ${fSelected
                            ? "bg-accent/10 text-accent"
                            : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
                          }
                        `}
                        style={{ borderColor: "var(--border-subtle)" }}
                      >
                        <span
                          className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                          style={{ background: fColor }}
                        />
                        <span className="truncate font-medium">
                          {f.label || "Unnamed flow"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            data?.label && (
              <div
                className={`
                  px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap
                  border transition-all cursor-pointer
                  ${anySelected ? "ring-1 ring-accent" : ""}
                `}
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: color + "50",
                  color: "var(--text-secondary)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (flowsList[0]) {
                    setSelectedEntity({ type: "flow", id: flowsList[0].id });
                  }
                }}
              >
                {data.label}
                <span
                  className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: color }}
                />
              </div>
            )
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(FlowEdge);
