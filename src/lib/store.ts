import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  SystemNode,
  Deliverable,
  Flow,
  Response,
  Tag,
  EntityTag,
  EntityType,
  Criticality,
  AutomationLevel,
  Frequency,
  Workflow,
} from "./types";
import { generateId, now } from "./utils";
import { DEFAULT_TAGS } from "./map-config";

interface SelectedEntity {
  type: EntityType;
  id: string;
}

interface AppState {
  contributorName: string;
  setContributorName: (name: string) => void;

  systems: SystemNode[];
  deliverables: Deliverable[];
  flows: Flow[];
  responses: Response[];
  tags: Tag[];
  entityTags: EntityTag[];

  selectedEntity: SelectedEntity | null;
  setSelectedEntity: (entity: SelectedEntity | null) => void;

  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  filterTag: string;
  setFilterTag: (tag: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showUnansweredOnly: boolean;
  setShowUnansweredOnly: (v: boolean) => void;

  addSystem: (data: Partial<SystemNode>) => SystemNode;
  updateSystem: (id: string, data: Partial<SystemNode>) => void;
  deleteSystem: (id: string) => void;

  addDeliverable: (data: Partial<Deliverable>) => Deliverable;
  updateDeliverable: (id: string, data: Partial<Deliverable>) => void;
  deleteDeliverable: (id: string) => void;

  addFlow: (data: Partial<Flow>) => Flow;
  updateFlow: (id: string, data: Partial<Flow>) => void;
  deleteFlow: (id: string) => void;

  addResponse: (data: Omit<Response, "id" | "createdAt" | "updatedAt">) => void;
  updateResponse: (id: string, text: string) => void;

  addEntityTag: (entityType: EntityType, entityId: string, tagId: string) => void;
  removeEntityTag: (entityType: EntityType, entityId: string, tagId: string) => void;

  workflows: Workflow[];
  addWorkflow: (data: Omit<Workflow, "id" | "createdAt" | "updatedAt">) => Workflow;
  updateWorkflow: (id: string, data: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;

  getResponsesForEntity: (entityType: EntityType, entityId: string) => Response[];
  getTagsForEntity: (entityType: EntityType, entityId: string) => Tag[];
  getEntityName: (entityType: EntityType, entityId: string) => string;
}

const initTags: Tag[] = DEFAULT_TAGS.map((t) => ({ ...t, id: generateId() }));

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      contributorName: "",
      setContributorName: (name) => set({ contributorName: name }),

      systems: [],
      deliverables: [],
      flows: [],
      responses: [],
      tags: initTags,
      entityTags: [],

      selectedEntity: null,
      setSelectedEntity: (entity) => set({ selectedEntity: entity }),

      filterCategory: "",
      setFilterCategory: (cat) => set({ filterCategory: cat }),
      filterTag: "",
      setFilterTag: (tag) => set({ filterTag: tag }),
      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),
      showUnansweredOnly: false,
      setShowUnansweredOnly: (v) => set({ showUnansweredOnly: v }),

      addSystem: (data) => {
        const sys: SystemNode = {
          id: data.id || generateId(),
          name: data.name || "New System",
          category: data.category || "Other",
          description: data.description || "",
          owner: data.owner || "",
          criticality: data.criticality || ("medium" as Criticality),
          xPosition: data.xPosition ?? 100,
          yPosition: data.yPosition ?? 100,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ systems: [...s.systems, sys] }));
        return sys;
      },
      updateSystem: (id, data) =>
        set((s) => ({
          systems: s.systems.map((sys) =>
            sys.id === id ? { ...sys, ...data, updatedAt: now() } : sys
          ),
        })),
      deleteSystem: (id) =>
        set((s) => ({
          systems: s.systems.filter((sys) => sys.id !== id),
          flows: s.flows.filter(
            (f) =>
              !(f.sourceType === "system" && f.sourceId === id) &&
              !(f.targetType === "system" && f.targetId === id)
          ),
          responses: s.responses.filter(
            (r) => !(r.entityType === "system" && r.entityId === id)
          ),
          entityTags: s.entityTags.filter(
            (et) => !(et.entityType === "system" && et.entityId === id)
          ),
          selectedEntity:
            s.selectedEntity?.type === "system" && s.selectedEntity?.id === id
              ? null
              : s.selectedEntity,
        })),

      addDeliverable: (data) => {
        const del: Deliverable = {
          id: data.id || generateId(),
          name: data.name || "New Deliverable",
          category: data.category || "Other",
          description: data.description || "",
          owner: data.owner || "",
          audience: data.audience || "",
          frequency: data.frequency || ("monthly" as Frequency),
          xPosition: data.xPosition ?? 400,
          yPosition: data.yPosition ?? 400,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ deliverables: [...s.deliverables, del] }));
        return del;
      },
      updateDeliverable: (id, data) =>
        set((s) => ({
          deliverables: s.deliverables.map((d) =>
            d.id === id ? { ...d, ...data, updatedAt: now() } : d
          ),
        })),
      deleteDeliverable: (id) =>
        set((s) => ({
          deliverables: s.deliverables.filter((d) => d.id !== id),
          flows: s.flows.filter(
            (f) =>
              !(f.sourceType === "deliverable" && f.sourceId === id) &&
              !(f.targetType === "deliverable" && f.targetId === id)
          ),
          responses: s.responses.filter(
            (r) => !(r.entityType === "deliverable" && r.entityId === id)
          ),
          entityTags: s.entityTags.filter(
            (et) => !(et.entityType === "deliverable" && et.entityId === id)
          ),
          selectedEntity:
            s.selectedEntity?.type === "deliverable" && s.selectedEntity?.id === id
              ? null
              : s.selectedEntity,
        })),

      addFlow: (data) => {
        const flow: Flow = {
          id: data.id || generateId(),
          sourceType: data.sourceType || "system",
          sourceId: data.sourceId || "",
          targetType: data.targetType || "system",
          targetId: data.targetId || "",
          label: data.label || "",
          frequency: data.frequency || ("ad-hoc" as Frequency),
          automationLevel: data.automationLevel || ("manual" as AutomationLevel),
          notes: data.notes || "",
          createdAt: now(),
        };
        set((s) => ({ flows: [...s.flows, flow] }));
        return flow;
      },
      updateFlow: (id, data) =>
        set((s) => ({
          flows: s.flows.map((f) => (f.id === id ? { ...f, ...data } : f)),
        })),
      deleteFlow: (id) =>
        set((s) => ({
          flows: s.flows.filter((f) => f.id !== id),
          responses: s.responses.filter(
            (r) => !(r.entityType === "flow" && r.entityId === id)
          ),
          entityTags: s.entityTags.filter(
            (et) => !(et.entityType === "flow" && et.entityId === id)
          ),
          selectedEntity:
            s.selectedEntity?.type === "flow" && s.selectedEntity?.id === id
              ? null
              : s.selectedEntity,
        })),

      addResponse: (data) => {
        const resp: Response = {
          ...data,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ responses: [...s.responses, resp] }));
      },
      updateResponse: (id, text) =>
        set((s) => ({
          responses: s.responses.map((r) =>
            r.id === id ? { ...r, responseText: text, updatedAt: now() } : r
          ),
        })),

      addEntityTag: (entityType, entityId, tagId) =>
        set((s) => {
          const exists = s.entityTags.some(
            (et) =>
              et.entityType === entityType &&
              et.entityId === entityId &&
              et.tagId === tagId
          );
          if (exists) return {};
          return { entityTags: [...s.entityTags, { entityType, entityId, tagId }] };
        }),
      removeEntityTag: (entityType, entityId, tagId) =>
        set((s) => ({
          entityTags: s.entityTags.filter(
            (et) =>
              !(
                et.entityType === entityType &&
                et.entityId === entityId &&
                et.tagId === tagId
              )
          ),
        })),

      workflows: [],
      addWorkflow: (data) => {
        const wf: Workflow = {
          ...data,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ workflows: [...s.workflows, wf] }));
        return wf;
      },
      updateWorkflow: (id, data) =>
        set((s) => ({
          workflows: s.workflows.map((w) =>
            w.id === id ? { ...w, ...data, updatedAt: now() } : w
          ),
        })),
      deleteWorkflow: (id) =>
        set((s) => ({
          workflows: s.workflows.filter((w) => w.id !== id),
        })),

      getResponsesForEntity: (entityType, entityId) =>
        get().responses.filter(
          (r) => r.entityType === entityType && r.entityId === entityId
        ),
      getTagsForEntity: (entityType, entityId) => {
        const tagIds = get()
          .entityTags.filter(
            (et) => et.entityType === entityType && et.entityId === entityId
          )
          .map((et) => et.tagId);
        return get().tags.filter((t) => tagIds.includes(t.id));
      },
      getEntityName: (entityType, entityId) => {
        if (entityType === "system") {
          return get().systems.find((s) => s.id === entityId)?.name || "Unknown";
        }
        if (entityType === "deliverable") {
          return get().deliverables.find((d) => d.id === entityId)?.name || "Unknown";
        }
        if (entityType === "flow") {
          const flow = get().flows.find((f) => f.id === entityId);
          return flow?.label || "Unnamed Flow";
        }
        return "Unknown";
      },
    }),
    {
      name: "systems-map-store",
    }
  )
);
