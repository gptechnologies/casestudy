import { QuestionKey, EntityType } from "./types";

export interface QuestionDefinition {
  key: QuestionKey;
  label: string;
  placeholder: string;
  group: "deterministic" | "subjective" | "risk";
}

export const SYSTEM_QUESTIONS: QuestionDefinition[] = [
  {
    key: "data_exists",
    label: "What data exists in this system?",
    placeholder: "Describe the key data objects, tables, fields, or records held here...",
    group: "deterministic",
  },
  {
    key: "inputs",
    label: "What are the primary inputs into this system?",
    placeholder: "List the data feeds, files, or manual entries that come into this system...",
    group: "deterministic",
  },
  {
    key: "input_sources",
    label: "Where do those inputs come from?",
    placeholder: "Name the upstream systems, teams, or external sources...",
    group: "deterministic",
  },
  {
    key: "pre_entry_transformations",
    label: "What transformations occur before data enters this system?",
    placeholder: "Describe any cleaning, reformatting, calculations, or manual steps...",
    group: "deterministic",
  },
  {
    key: "outputs",
    label: "What outputs leave this system?",
    placeholder: "List the reports, exports, data feeds, or files produced...",
    group: "deterministic",
  },
  {
    key: "output_destinations",
    label: "Where do those outputs go?",
    placeholder: "Name the downstream systems, teams, or external recipients...",
    group: "deterministic",
  },
  {
    key: "post_exit_transformations",
    label: "What transformations occur after data exits this system?",
    placeholder: "Describe any reformatting, aggregation, or manual rework after export...",
    group: "deterministic",
  },
  {
    key: "business_purpose",
    label: "Why are people coming to this system?",
    placeholder: "What decision or workflow does this system support?",
    group: "subjective",
  },
  {
    key: "deliverables_supported",
    label: "What deliverables rely on this system?",
    placeholder: "List the reports, decks, memos, or outputs that depend on this data...",
    group: "subjective",
  },
  {
    key: "owners_and_users",
    label: "Who uses and owns this system?",
    placeholder: "Name the primary users, teams, and the person responsible for it...",
    group: "subjective",
  },
  {
    key: "pain_points",
    label: "What are the biggest pain points?",
    placeholder: "Describe recurring issues, manual workarounds, or friction...",
    group: "risk",
  },
  {
    key: "risks_and_controls",
    label: "What are the main risks or control issues?",
    placeholder: "Note versioning concerns, access issues, audit gaps, key-person dependency...",
    group: "risk",
  },
];

export const FLOW_QUESTIONS: QuestionDefinition[] = [
  {
    key: "data_moving",
    label: "What data is moving?",
    placeholder: "Describe the data being transferred in this flow...",
    group: "deterministic",
  },
  {
    key: "flow_frequency",
    label: "How often does this data move?",
    placeholder: "Daily, weekly, monthly, ad-hoc, real-time...",
    group: "deterministic",
  },
  {
    key: "flow_automation",
    label: "Is this manual, semi-manual, or automated?",
    placeholder: "Describe the level of automation and any manual steps involved...",
    group: "deterministic",
  },
  {
    key: "flow_transformation",
    label: "What transformation occurs in transit?",
    placeholder: "Any reformatting, calculation, or aggregation during the transfer...",
    group: "deterministic",
  },
  {
    key: "flow_breakpoints",
    label: "What breaks most often?",
    placeholder: "Common failure points, error-prone steps, or timing issues...",
    group: "risk",
  },
  {
    key: "flow_downstream",
    label: "What downstream reporting depends on this flow?",
    placeholder: "List any deliverables or processes that would break if this flow failed...",
    group: "subjective",
  },
];

export const DELIVERABLE_QUESTIONS: QuestionDefinition[] = [
  {
    key: "deliverable_description",
    label: "What is this deliverable?",
    placeholder: "Describe the output, report, or document...",
    group: "deterministic",
  },
  {
    key: "deliverable_audience",
    label: "Who is the audience?",
    placeholder: "Partners, investors, compliance, internal teams...",
    group: "subjective",
  },
  {
    key: "deliverable_frequency",
    label: "How frequently is it produced?",
    placeholder: "Daily, weekly, monthly, quarterly, ad-hoc...",
    group: "deterministic",
  },
  {
    key: "deliverable_sources",
    label: "Which systems feed this deliverable?",
    placeholder: "List the upstream systems and data sources...",
    group: "deterministic",
  },
  {
    key: "deliverable_manual_steps",
    label: "Which steps are manual?",
    placeholder: "Describe any copy-paste, reformatting, or manual assembly...",
    group: "risk",
  },
  {
    key: "deliverable_delays",
    label: "Where do delays or errors usually happen?",
    placeholder: "Common bottlenecks, late data, or error-prone steps...",
    group: "risk",
  },
];

export function getQuestionsForEntity(entityType: EntityType): QuestionDefinition[] {
  switch (entityType) {
    case "system":
      return SYSTEM_QUESTIONS;
    case "flow":
      return FLOW_QUESTIONS;
    case "deliverable":
      return DELIVERABLE_QUESTIONS;
  }
}
