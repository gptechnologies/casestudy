export type EntityType = "system" | "deliverable" | "flow";

export type Criticality = "low" | "medium" | "high" | "critical";
export type AutomationLevel = "manual" | "semi-manual" | "automated";
export type Frequency = "daily" | "weekly" | "monthly" | "quarterly" | "ad-hoc" | "real-time";

export interface Contributor {
  id: string;
  name: string;
  team?: string;
  createdAt: string;
}

export interface SystemNode {
  id: string;
  name: string;
  category: string;
  description: string;
  owner: string;
  criticality: Criticality;
  xPosition: number;
  yPosition: number;
  createdAt: string;
  updatedAt: string;
}

export interface Deliverable {
  id: string;
  name: string;
  category: string;
  description: string;
  owner: string;
  audience: string;
  frequency: Frequency;
  xPosition: number;
  yPosition: number;
  createdAt: string;
  updatedAt: string;
}

export interface Flow {
  id: string;
  sourceType: EntityType;
  sourceId: string;
  targetType: EntityType;
  targetId: string;
  label: string;
  frequency: Frequency;
  automationLevel: AutomationLevel;
  notes: string;
  createdAt: string;
}

export type QuestionKey =
  | "data_exists"
  | "inputs"
  | "input_sources"
  | "pre_entry_transformations"
  | "outputs"
  | "output_destinations"
  | "post_exit_transformations"
  | "business_purpose"
  | "deliverables_supported"
  | "owners_and_users"
  | "pain_points"
  | "risks_and_controls"
  | "data_moving"
  | "flow_frequency"
  | "flow_automation"
  | "flow_transformation"
  | "flow_breakpoints"
  | "flow_downstream"
  | "deliverable_description"
  | "deliverable_audience"
  | "deliverable_frequency"
  | "deliverable_sources"
  | "deliverable_manual_steps"
  | "deliverable_delays";

export interface Response {
  id: string;
  contributorId: string;
  contributorName: string;
  entityType: EntityType;
  entityId: string;
  questionKey: QuestionKey;
  responseText: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface EntityTag {
  entityType: EntityType;
  entityId: string;
  tagId: string;
}
