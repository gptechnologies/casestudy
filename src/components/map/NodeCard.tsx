"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Database,
  BarChart3,
  Globe,
  Users,
  FileSpreadsheet,
  MessageSquare,
  FolderOpen,
  Wrench,
  Box,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { CATEGORY_COLORS, CRITICALITY_COLORS } from "@/lib/map-config";
import { useAppStore } from "@/lib/store";
import { EntityType, Criticality } from "@/lib/types";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  "OMS / PMS": Database,
  "Market Data": Globe,
  Analytics: BarChart3,
  "CRM / Deal Management": Users,
  Spreadsheets: FileSpreadsheet,
  Communication: MessageSquare,
  "File Storage": FolderOpen,
  "Custom / Internal": Wrench,
  Other: Box,
};

interface SystemNodeData {
  label: string;
  category: string;
  entityType: EntityType;
  entityId: string;
  criticality?: Criticality;
  description?: string;
  responseCount?: number;
  [key: string]: unknown;
}

function SystemNodeCard({ data, selected }: NodeProps & { data: SystemNodeData }) {
  const isDeliverable = data.entityType === "deliverable";
  const categoryColor = CATEGORY_COLORS[data.category] || "#78716c";
  const IconComponent = isDeliverable ? FileText : (CATEGORY_ICONS[data.category] || Box);
  const critColor = data.criticality ? CRITICALITY_COLORS[data.criticality] : undefined;

  const selectedEntity = useAppStore((s) => s.selectedEntity);
  const isSelected =
    selectedEntity?.type === data.entityType && selectedEntity?.id === data.entityId;

  const responses = useAppStore((s) => s.responses);
  const responseCount = responses.filter(
    (r) => r.entityType === data.entityType && r.entityId === data.entityId
  ).length;

  const entityTags = useAppStore((s) => s.entityTags);
  const tags = useAppStore((s) => s.tags);
  const nodeTags = entityTags
    .filter(
      (et) => et.entityType === data.entityType && et.entityId === data.entityId
    )
    .map((et) => tags.find((t) => t.id === et.tagId))
    .filter(Boolean);

  return (
    <div
      className={`
        group relative min-w-[180px] max-w-[220px] rounded-xl transition-all duration-200
        ${isDeliverable
          ? "border-2 border-dashed"
          : "border border-solid"
        }
        ${isSelected
          ? "ring-2 ring-accent shadow-lg shadow-accent/20"
          : "hover:shadow-lg hover:shadow-black/30"
        }
      `}
      style={{
        background: "var(--bg-surface)",
        borderColor: isSelected ? "var(--accent)" : categoryColor + "40",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div className="p-3">
        <div className="flex items-start gap-2.5 mb-2">
          <div
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: categoryColor + "20" }}
          >
            <IconComponent size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-text-primary leading-tight truncate">
              {data.label}
            </p>
            <p className="text-[10px] text-text-tertiary mt-0.5 uppercase tracking-wider">
              {isDeliverable ? "Deliverable" : data.category}
            </p>
          </div>
        </div>

        {data.description && (
          <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2 mb-2">
            {data.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 flex-wrap">
          {critColor && !isDeliverable && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wide"
              style={{ background: critColor + "20", color: critColor }}
            >
              <AlertTriangle size={8} />
              {data.criticality}
            </span>
          )}
          {responseCount > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-accent-muted text-accent">
              {responseCount} response{responseCount !== 1 ? "s" : ""}
            </span>
          )}
          {responseCount === 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-warning/10 text-warning">
              needs input
            </span>
          )}
        </div>

        {nodeTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {nodeTags.slice(0, 3).map((tag) => (
              <span
                key={tag!.id}
                className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                style={{ background: tag!.color + "20", color: tag!.color }}
              >
                {tag!.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SystemNodeCard);
