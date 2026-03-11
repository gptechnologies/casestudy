"use client";

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { AUTOMATION_LEVEL_COLORS } from "@/lib/map-config";
import { AutomationLevel } from "@/lib/types";
import { useAppStore } from "@/lib/store";

interface FlowEdgeData {
  label?: string;
  automationLevel?: AutomationLevel;
  flowId?: string;
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
  const isSelected =
    selectedEntity?.type === "flow" && selectedEntity?.id === data?.flowId;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isSelected ? "var(--accent)" : color,
          strokeWidth: isSelected ? 3 : 2,
          opacity: isSelected ? 1 : 0.7,
        }}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-auto cursor-pointer"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            <div
              className={`
                px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap
                border transition-all
                ${isSelected ? "ring-1 ring-accent" : ""}
              `}
              style={{
                background: "var(--bg-elevated)",
                borderColor: color + "50",
                color: "var(--text-secondary)",
              }}
            >
              {data.label}
              <span
                className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: color }}
              />
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(FlowEdge);
