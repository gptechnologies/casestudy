"use client";

import { useEffect, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import MapCanvas from "@/components/map/MapCanvas";
import DetailPanel from "@/components/panels/DetailPanel";
import TopBar from "@/components/ui/TopBar";
import { useAppStore } from "@/lib/store";
import { createSeedData } from "@/lib/seed";

export default function MapPage() {
  const [mounted, setMounted] = useState(false);
  const systems = useAppStore((s) => s.systems);
  const addSystem = useAppStore((s) => s.addSystem);
  const addDeliverable = useAppStore((s) => s.addDeliverable);
  const addFlow = useAppStore((s) => s.addFlow);
  const selectedEntity = useAppStore((s) => s.selectedEntity);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (systems.length === 0) {
      const seed = createSeedData();
      seed.systems.forEach((sys) => addSystem(sys));
      seed.deliverables.forEach((del) => addDeliverable(del));
      seed.flows.forEach((flow) => addFlow(flow));
    }
  }, [mounted, systems.length, addSystem, addDeliverable, addFlow]);

  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-text-secondary">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 relative">
            <MapCanvas />
          </div>
          {selectedEntity && <DetailPanel />}
        </div>
      </div>
    </ReactFlowProvider>
  );
}
