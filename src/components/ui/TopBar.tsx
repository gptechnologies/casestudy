"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  User,
  Eye,
  EyeOff,
  ClipboardList,
  Map,
  Home,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { SYSTEM_CATEGORIES } from "@/lib/map-config";
import AddModal from "./AddModal";

export default function TopBar() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<"system" | "deliverable">("system");
  const [showFilters, setShowFilters] = useState(false);

  const contributorName = useAppStore((s) => s.contributorName);
  const setContributorName = useAppStore((s) => s.setContributorName);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const filterCategory = useAppStore((s) => s.filterCategory);
  const setFilterCategory = useAppStore((s) => s.setFilterCategory);
  const filterTag = useAppStore((s) => s.filterTag);
  const setFilterTag = useAppStore((s) => s.setFilterTag);
  const showUnansweredOnly = useAppStore((s) => s.showUnansweredOnly);
  const setShowUnansweredOnly = useAppStore((s) => s.setShowUnansweredOnly);
  const tags = useAppStore((s) => s.tags);
  const systems = useAppStore((s) => s.systems);
  const deliverables = useAppStore((s) => s.deliverables);
  const flows = useAppStore((s) => s.flows);

  return (
    <>
      <div className="h-14 flex-shrink-0 bg-bg-secondary border-b border-border-subtle flex items-center px-4 gap-3">
        <a href="/" className="flex items-center gap-1.5 mr-1 text-text-tertiary hover:text-accent transition-colors" title="Home">
          <Home size={15} />
        </a>

        <div className="flex items-center gap-2 mr-2">
          <Map size={18} className="text-accent" />
          <span className="text-[14px] font-semibold text-text-primary tracking-tight">
            Systems Map
          </span>
        </div>

        <div className="h-6 w-px bg-border-subtle" />

        <div className="flex items-center gap-3 text-[11px] text-text-tertiary">
          <span>{systems.length} systems</span>
          <span>{deliverables.length} deliverables</span>
          <span>{flows.length} flows</span>
        </div>

        <div className="h-6 w-px bg-border-subtle" />

        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search systems, deliverables..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-[12px] bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
            showFilters || filterCategory || filterTag || showUnansweredOnly
              ? "bg-accent-muted text-accent border-accent/30"
              : "bg-bg-primary text-text-secondary border-border-subtle hover:border-border-default"
          }`}
        >
          <Filter size={12} />
          Filters
          {(filterCategory || filterTag || showUnansweredOnly) && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          )}
        </button>

        <div className="flex-1" />

        <button
          onClick={() => { setAddType("system"); setShowAddModal(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
        >
          <Plus size={12} />
          System
        </button>
        <button
          onClick={() => { setAddType("deliverable"); setShowAddModal(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-bg-primary text-text-secondary border border-border-subtle hover:border-accent hover:text-accent transition-colors"
        >
          <Plus size={12} />
          Deliverable
        </button>

        <div className="h-6 w-px bg-border-subtle" />

        <a
          href="/intake"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-text-secondary border border-border-subtle hover:border-accent hover:text-accent transition-colors"
        >
          <ClipboardList size={12} />
          Intake
        </a>
        <a
          href="/workflows"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-text-secondary border border-border-subtle hover:border-accent hover:text-accent transition-colors"
        >
          <GitBranch size={12} />
          Workflows
        </a>
        <a
          href="/assistant"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-text-secondary border border-border-subtle hover:border-accent hover:text-accent transition-colors"
        >
          <Sparkles size={12} />
          AI
        </a>

        <div className="h-6 w-px bg-border-subtle" />

        <div className="flex items-center gap-2">
          <User size={14} className="text-text-tertiary" />
          <input
            value={contributorName}
            onChange={(e) => setContributorName(e.target.value)}
            placeholder="Your name"
            className="w-32 px-2 py-1.5 rounded-lg text-[12px] bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
          />
        </div>
      </div>

      {showFilters && (
        <div className="flex-shrink-0 bg-bg-secondary/80 border-b border-border-subtle px-4 py-2.5 flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1 rounded-lg text-[11px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">All categories</option>
            {SYSTEM_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-2.5 py-1 rounded-lg text-[11px] bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">All tags</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowUnansweredOnly(!showUnansweredOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
              showUnansweredOnly
                ? "bg-warning/10 text-warning border-warning/30"
                : "bg-bg-primary text-text-secondary border-border-subtle hover:border-border-default"
            }`}
          >
            {showUnansweredOnly ? <Eye size={12} /> : <EyeOff size={12} />}
            Unanswered only
          </button>

          {(filterCategory || filterTag || showUnansweredOnly) && (
            <button
              onClick={() => {
                setFilterCategory("");
                setFilterTag("");
                setShowUnansweredOnly(false);
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-text-tertiary hover:text-text-secondary transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {showAddModal && (
        <AddModal
          type={addType}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}
