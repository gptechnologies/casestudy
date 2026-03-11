"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { SYSTEM_CATEGORIES, DELIVERABLE_CATEGORIES } from "@/lib/map-config";
import { Criticality, Frequency } from "@/lib/types";

interface AddModalProps {
  type: "system" | "deliverable";
  onClose: () => void;
}

export default function AddModal({ type, onClose }: AddModalProps) {
  const addSystem = useAppStore((s) => s.addSystem);
  const addDeliverable = useAppStore((s) => s.addDeliverable);
  const setSelectedEntity = useAppStore((s) => s.setSelectedEntity);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(
    type === "system" ? "Other" : "Other"
  );
  const [description, setDescription] = useState("");
  const [criticality, setCriticality] = useState<Criticality>("medium");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [audience, setAudience] = useState("");

  const categories = type === "system" ? SYSTEM_CATEGORIES : DELIVERABLE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomX = 200 + Math.random() * 400;
    const randomY = 150 + Math.random() * 300;

    if (type === "system") {
      const sys = addSystem({
        name,
        category,
        description,
        criticality,
        xPosition: randomX,
        yPosition: randomY,
      });
      setSelectedEntity({ type: "system", id: sys.id });
    } else {
      const del = addDeliverable({
        name,
        category,
        description,
        audience,
        frequency,
        xPosition: randomX,
        yPosition: randomY,
      });
      setSelectedEntity({ type: "deliverable", id: del.id });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-bg-secondary border border-border-subtle rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="text-[14px] font-semibold text-text-primary">
            Add {type === "system" ? "System" : "Deliverable"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-text-secondary mb-1.5">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                type === "system"
                  ? "e.g., Bloomberg, Enfusion, Shared Drive"
                  : "e.g., Partner Reporting Package"
              }
              autoFocus
              className="w-full px-3 py-2 rounded-lg text-[13px] bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-text-secondary mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-[13px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-text-secondary mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this system or deliverable..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-[13px] bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
            />
          </div>

          {type === "system" && (
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1.5">
                Criticality
              </label>
              <select
                value={criticality}
                onChange={(e) => setCriticality(e.target.value as Criticality)}
                className="w-full px-3 py-2 rounded-lg text-[13px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          )}

          {type === "deliverable" && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-text-secondary mb-1.5">
                  Audience
                </label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g., Partners, Investment Committee, Compliance"
                  className="w-full px-3 py-2 rounded-lg text-[13px] bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-text-secondary mb-1.5">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Frequency)}
                  className="w-full px-3 py-2 rounded-lg text-[13px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="ad-hoc">Ad Hoc</option>
                  <option value="real-time">Real-time</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[12px] font-medium text-text-secondary bg-bg-primary border border-border-subtle hover:bg-bg-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 rounded-lg text-[12px] font-medium bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add {type === "system" ? "System" : "Deliverable"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
