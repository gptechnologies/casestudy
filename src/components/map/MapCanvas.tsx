"use client";

import { useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  BackgroundVariant,
  MarkerType,
  type NodeChange,
} from "@xyflow/react";
import NodeCard from "./NodeCard";
import FlowEdge from "./EdgeLabel";
import { useAppStore } from "@/lib/store";

const nodeTypes: NodeTypes = {
  systemNode: NodeCard as unknown as NodeTypes["systemNode"],
};

const edgeTypes: EdgeTypes = {
  flowEdge: FlowEdge as unknown as EdgeTypes["flowEdge"],
};

export default function MapCanvas() {
  const systems = useAppStore((s) => s.systems);
  const deliverables = useAppStore((s) => s.deliverables);
  const flows = useAppStore((s) => s.flows);
  const setSelectedEntity = useAppStore((s) => s.setSelectedEntity);
  const updateSystem = useAppStore((s) => s.updateSystem);
  const updateDeliverable = useAppStore((s) => s.updateDeliverable);
  const addFlow = useAppStore((s) => s.addFlow);
  const filterCategory = useAppStore((s) => s.filterCategory);
  const filterTag = useAppStore((s) => s.filterTag);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const showUnansweredOnly = useAppStore((s) => s.showUnansweredOnly);
  const responses = useAppStore((s) => s.responses);
  const entityTags = useAppStore((s) => s.entityTags);

  const filteredSystems = useMemo(() => {
    let result = systems;
    if (filterCategory) result = result.filter((s) => s.category === filterCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    if (filterTag) {
      result = result.filter((s) =>
        entityTags.some(
          (et) =>
            et.entityType === "system" &&
            et.entityId === s.id &&
            et.tagId === filterTag
        )
      );
    }
    if (showUnansweredOnly) {
      result = result.filter(
        (s) =>
          !responses.some(
            (r) => r.entityType === "system" && r.entityId === s.id
          )
      );
    }
    return result;
  }, [systems, filterCategory, searchQuery, filterTag, showUnansweredOnly, responses, entityTags]);

  const filteredDeliverables = useMemo(() => {
    let result = deliverables;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }
    if (filterTag) {
      result = result.filter((d) =>
        entityTags.some(
          (et) =>
            et.entityType === "deliverable" &&
            et.entityId === d.id &&
            et.tagId === filterTag
        )
      );
    }
    if (showUnansweredOnly) {
      result = result.filter(
        (d) =>
          !responses.some(
            (r) => r.entityType === "deliverable" && r.entityId === d.id
          )
      );
    }
    return result;
  }, [deliverables, searchQuery, filterTag, showUnansweredOnly, responses, entityTags]);

  const visibleIds = useMemo(() => {
    const ids = new Set<string>();
    filteredSystems.forEach((s) => ids.add(s.id));
    filteredDeliverables.forEach((d) => ids.add(d.id));
    return ids;
  }, [filteredSystems, filteredDeliverables]);

  const storeNodes: Node[] = useMemo(
    () => [
      ...filteredSystems.map((sys) => ({
        id: sys.id,
        type: "systemNode" as const,
        position: { x: sys.xPosition, y: sys.yPosition },
        data: {
          label: sys.name,
          category: sys.category,
          entityType: "system" as const,
          entityId: sys.id,
          criticality: sys.criticality,
          description: sys.description,
        },
      })),
      ...filteredDeliverables.map((del) => ({
        id: del.id,
        type: "systemNode" as const,
        position: { x: del.xPosition, y: del.yPosition },
        data: {
          label: del.name,
          category: del.category,
          entityType: "deliverable" as const,
          entityId: del.id,
          description: del.description,
        },
      })),
    ],
    [filteredSystems, filteredDeliverables]
  );

  const storeEdges: Edge[] = useMemo(
    () =>
      flows
        .filter((f) => visibleIds.has(f.sourceId) && visibleIds.has(f.targetId))
        .map((flow) => ({
          id: flow.id,
          source: flow.sourceId,
          target: flow.targetId,
          type: "flowEdge" as const,
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: "#64748b" },
          data: {
            label: flow.label,
            automationLevel: flow.automationLevel,
            flowId: flow.id,
          },
        })),
    [flows, visibleIds]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);

  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      changes.forEach((change) => {
        if (change.type === "position" && change.position && !change.dragging) {
          const nodeId = change.id;
          const sys = systems.find((s) => s.id === nodeId);
          if (sys) {
            updateSystem(nodeId, {
              xPosition: change.position.x,
              yPosition: change.position.y,
            });
            return;
          }
          const del = deliverables.find((d) => d.id === nodeId);
          if (del) {
            updateDeliverable(nodeId, {
              xPosition: change.position.x,
              yPosition: change.position.y,
            });
          }
        }
      });
    },
    [onNodesChange, systems, deliverables, updateSystem, updateDeliverable]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const sourceIsSys = systems.some((s) => s.id === connection.source);
      const targetIsSys = systems.some((s) => s.id === connection.target);

      const flow = addFlow({
        sourceType: sourceIsSys ? "system" : "deliverable",
        sourceId: connection.source,
        targetType: targetIsSys ? "system" : "deliverable",
        targetId: connection.target,
        label: "New Flow",
      });

      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            id: flow.id,
            type: "flowEdge",
            markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: "#64748b" },
            data: {
              label: flow.label,
              automationLevel: flow.automationLevel,
              flowId: flow.id,
            },
          },
          eds
        )
      );
    },
    [systems, addFlow, setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const d = node.data as { entityType: string; entityId: string };
      setSelectedEntity({ type: d.entityType as "system" | "deliverable", id: d.entityId });
    },
    [setSelectedEntity]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const d = edge.data as { flowId?: string } | undefined;
      if (d?.flowId) {
        setSelectedEntity({ type: "flow", id: d.flowId });
      }
    },
    [setSelectedEntity]
  );

  const onPaneClick = useCallback(() => {
    setSelectedEntity(null);
  }, [setSelectedEntity]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        defaultEdgeOptions={{
          type: "flowEdge",
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: "#64748b" },
        }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={2}
        snapToGrid
        snapGrid={[20, 20]}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--border-subtle)"
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            const d = node.data as { entityType?: string };
            return d?.entityType === "deliverable" ? "#f59e0b" : "#6366f1";
          }}
          maskColor="rgba(15, 17, 23, 0.8)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
