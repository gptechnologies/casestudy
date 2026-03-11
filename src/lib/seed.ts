import { SystemNode, Deliverable, Flow, Criticality, Frequency, AutomationLevel } from "./types";
import { generateId, now } from "./utils";

export interface SeedData {
  systems: SystemNode[];
  deliverables: Deliverable[];
  flows: Flow[];
}

export function createSeedData(): SeedData {
  const ts = now();

  const excel: SystemNode = {
    id: generateId(),
    name: "Excel / Microsoft Suite",
    category: "Spreadsheets",
    description:
      "Primary workbook environment for deal-level analysis, distribution calculations, ad hoc reporting, and last-mile presentation. Heavily used by deal teams in individual formats.",
    owner: "",
    criticality: "critical" as Criticality,
    xPosition: 450,
    yPosition: 280,
    createdAt: ts,
    updatedAt: ts,
  };

  const enfusion: SystemNode = {
    id: generateId(),
    name: "Enfusion",
    category: "OMS / PMS",
    description:
      "Order management and portfolio management system. Core system of record for positions, trades, and portfolio data.",
    owner: "",
    criticality: "critical" as Criticality,
    xPosition: 80,
    yPosition: 120,
    createdAt: ts,
    updatedAt: ts,
  };

  const bloomberg: SystemNode = {
    id: generateId(),
    name: "Bloomberg",
    category: "Market Data",
    description:
      "Market data terminal for pricing, analytics, news, and reference data. Primary source of live and historical market information.",
    owner: "",
    criticality: "high" as Criticality,
    xPosition: 80,
    yPosition: 420,
    createdAt: ts,
    updatedAt: ts,
  };

  const factset: SystemNode = {
    id: generateId(),
    name: "FactSet",
    category: "Analytics",
    description:
      "Financial data and analytics platform used for research, portfolio analytics, and performance attribution.",
    owner: "",
    criticality: "high" as Criticality,
    xPosition: 80,
    yPosition: 580,
    createdAt: ts,
    updatedAt: ts,
  };

  const affiniti: SystemNode = {
    id: generateId(),
    name: "Affiniti",
    category: "CRM / Deal Management",
    description:
      "CRM and relationship management platform for deal pipeline tracking, investor relations, and contact management.",
    owner: "",
    criticality: "medium" as Criticality,
    xPosition: 450,
    yPosition: 560,
    createdAt: ts,
    updatedAt: ts,
  };

  const systems = [excel, enfusion, bloomberg, factset, affiniti];

  const partnerReport: Deliverable = {
    id: generateId(),
    name: "Partner Reporting Package",
    category: "Partner Reporting",
    description:
      "Periodic reporting package distributed to partners with portfolio updates, performance, and distribution information.",
    owner: "",
    audience: "Partners / LPs",
    frequency: "quarterly" as Frequency,
    xPosition: 820,
    yPosition: 120,
    createdAt: ts,
    updatedAt: ts,
  };

  const distAnalysis: Deliverable = {
    id: generateId(),
    name: "Distribution Analysis",
    category: "Distribution Analysis",
    description:
      "Ad hoc and periodic analysis of distributions across investments. Currently handled in deal-team-specific workbooks.",
    owner: "",
    audience: "Partners / Internal",
    frequency: "ad-hoc" as Frequency,
    xPosition: 820,
    yPosition: 340,
    createdAt: ts,
    updatedAt: ts,
  };

  const investMemos: Deliverable = {
    id: generateId(),
    name: "Investment Memos",
    category: "Investment Memo",
    description:
      "Deal-level memos prepared for investment committee review, combining financial data with qualitative analysis.",
    owner: "",
    audience: "Investment Committee",
    frequency: "ad-hoc" as Frequency,
    xPosition: 820,
    yPosition: 540,
    createdAt: ts,
    updatedAt: ts,
  };

  const deliverables = [partnerReport, distAnalysis, investMemos];

  const flows: Flow[] = [
    {
      id: generateId(),
      sourceType: "system",
      sourceId: enfusion.id,
      targetType: "system",
      targetId: excel.id,
      label: "Positions & trades export",
      frequency: "daily" as Frequency,
      automationLevel: "semi-manual" as AutomationLevel,
      notes: "",
      createdAt: ts,
    },
    {
      id: generateId(),
      sourceType: "system",
      sourceId: bloomberg.id,
      targetType: "system",
      targetId: excel.id,
      label: "Pricing & market data",
      frequency: "daily" as Frequency,
      automationLevel: "manual" as AutomationLevel,
      notes: "",
      createdAt: ts,
    },
    {
      id: generateId(),
      sourceType: "system",
      sourceId: factset.id,
      targetType: "system",
      targetId: excel.id,
      label: "Analytics & attribution",
      frequency: "weekly" as Frequency,
      automationLevel: "manual" as AutomationLevel,
      notes: "",
      createdAt: ts,
    },
    {
      id: generateId(),
      sourceType: "system",
      sourceId: excel.id,
      targetType: "deliverable",
      targetId: partnerReport.id,
      label: "Formatted report output",
      frequency: "quarterly" as Frequency,
      automationLevel: "manual" as AutomationLevel,
      notes: "",
      createdAt: ts,
    },
    {
      id: generateId(),
      sourceType: "system",
      sourceId: excel.id,
      targetType: "deliverable",
      targetId: distAnalysis.id,
      label: "Distribution calcs",
      frequency: "ad-hoc" as Frequency,
      automationLevel: "manual" as AutomationLevel,
      notes: "",
      createdAt: ts,
    },
    {
      id: generateId(),
      sourceType: "system",
      sourceId: affiniti.id,
      targetType: "deliverable",
      targetId: investMemos.id,
      label: "Deal pipeline data",
      frequency: "ad-hoc" as Frequency,
      automationLevel: "semi-manual" as AutomationLevel,
      notes: "",
      createdAt: ts,
    },
    {
      id: generateId(),
      sourceType: "system",
      sourceId: enfusion.id,
      targetType: "deliverable",
      targetId: partnerReport.id,
      label: "Portfolio snapshots",
      frequency: "quarterly" as Frequency,
      automationLevel: "semi-manual" as AutomationLevel,
      notes: "",
      createdAt: ts,
    },
  ];

  return { systems, deliverables, flows };
}
