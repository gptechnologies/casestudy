import { Criticality, Tag } from "./types";

export const SYSTEM_CATEGORIES = [
  "OMS / PMS",
  "Market Data",
  "Analytics",
  "CRM / Deal Management",
  "Spreadsheets",
  "Communication",
  "File Storage",
  "Custom / Internal",
  "Other",
] as const;

export const DELIVERABLE_CATEGORIES = [
  "Partner Reporting",
  "Portfolio Reporting",
  "Investment Memo",
  "Distribution Analysis",
  "Performance Report",
  "Compliance Filing",
  "Ad Hoc Request",
  "Internal Analysis",
  "Other",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "OMS / PMS": "#6366f1",
  "Market Data": "#0ea5e9",
  Analytics: "#8b5cf6",
  "CRM / Deal Management": "#f59e0b",
  Spreadsheets: "#22c55e",
  Communication: "#ec4899",
  "File Storage": "#64748b",
  "Custom / Internal": "#14b8a6",
  Other: "#78716c",
};

export const CRITICALITY_COLORS: Record<Criticality, string> = {
  low: "#64748b",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

export const DEFAULT_TAGS: Omit<Tag, "id">[] = [
  { name: "manual", color: "#f97316" },
  { name: "high-risk", color: "#ef4444" },
  { name: "partner-facing", color: "#6366f1" },
  { name: "duplicate-logic", color: "#f59e0b" },
  { name: "needs-standardization", color: "#8b5cf6" },
  { name: "key-person-dependency", color: "#ec4899" },
  { name: "bottleneck", color: "#dc2626" },
  { name: "automation-candidate", color: "#22c55e" },
];

export const AUTOMATION_LEVEL_COLORS = {
  manual: "#f97316",
  "semi-manual": "#f59e0b",
  automated: "#22c55e",
};
