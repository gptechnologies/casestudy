"use client";

import { Map, ClipboardList, GitBranch, ArrowRight, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/map",
    icon: Map,
    title: "Systems Map",
    description: "Interactive spatial map of all systems, deliverables, and information flows across the firm.",
  },
  {
    href: "/intake",
    icon: ClipboardList,
    title: "Guided Intake",
    description: "Structured form for submitting system-level observations and answering diagnostic questions.",
  },
  {
    href: "/workflows",
    icon: GitBranch,
    title: "Workflows & Pain Points",
    description: "Document cross-system workflows, manual processes, and recurring friction points.",
  },
  {
    href: "/assistant",
    icon: Sparkles,
    title: "AI Assistant",
    description: "Describe systems or workflows in plain English and let AI add them to the map.",
  },
];

const TIMELINE = [
  {
    phase: "Week 1",
    title: "Map & Mobilize",
    items: [
      "Introduce the workflow mapping concept and goals to the team",
      "Build a complete map of all known data sources across the firm",
      "Host a demo session: how to login, add systems & workflows",
      "Set up low-friction ingestion (voice-to-text, screen recording upload) so people can contribute while they work",
      "Identify 1\u20132 no-regret quick fixes surfaced during mapping",
    ],
  },
  {
    phase: "Week 2",
    title: "Structure & Prioritize",
    items: [
      "Auto-generate SOP templates from documented workflows/systems, stored centrally (e.g. SharePoint)",
      "Score and prioritize pain points by complexity, frequency, business impact, and control risk",
      "Flag key-person dependencies and control gaps as part of prioritization",
    ],
  },
  {
    phase: "Weeks 3\u201312",
    title: "Execute & Govern",
    items: [
      "5-day sprints targeting the #1 priority item each week; move to next if resolved early",
      "Monthly review cadence with senior leaders to reassess mappings and priorities",
      "Maintain an incoming request pipeline with a staging area for senior sign-off",
    ],
  },
];

export default function CoverPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6 py-16">
      <div className="max-w-5xl w-full">
        {/* Two-column hero */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-16 mb-12">
          {/* Left column -- intro */}
          <div>
            <div className="mb-10">
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-accent mb-4">
                30-60-90 Case Study
              </p>
              <h1 className="text-[36px] font-bold text-text-primary leading-tight tracking-tight mb-2">
                Jai Mangat
              </h1>
              <p className="text-[18px] text-text-secondary font-medium">
                ATW Partners
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[15px] text-text-secondary leading-relaxed">
                Before redesigning processes or building reports, the first step is to make the
                firm&apos;s information flows visible. In a fast-growing environment, siloed tools and
                team-specific workbooks create hidden dependencies, inconsistent definitions, and
                slow response times for leadership.
              </p>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                This tool maps systems, data flows, deliverables, and the people who depend on
                them. It captures both the objective reality of how data moves and the subjective
                experience of using these systems day to day. The goal is to build a living
                diagnostic that can identify the highest-value standardization, reporting, and
                automation opportunities while understanding the network effects of any change.
              </p>
            </div>
          </div>

          {/* Right column -- timeline */}
          <div className="relative pl-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-text-tertiary mb-6">
              90-Day Roadmap
            </p>

            {/* Vertical accent line */}
            <div className="absolute left-0 top-10 bottom-0 w-[2px] bg-accent/25" />

            <div className="space-y-6">
              {TIMELINE.map((phase, i) => (
                <div key={i} className="relative">
                  {/* Dot on the timeline */}
                  <div className="absolute -left-6 top-[5px] w-[10px] h-[10px] rounded-full bg-accent border-2 border-bg-primary" style={{ transform: "translateX(-4px)" }} />

                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-0.5">
                    {phase.phase}
                  </p>
                  <p className="text-[14px] font-semibold text-text-primary mb-2">
                    {phase.title}
                  </p>
                  <ul className="space-y-1.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex gap-2 text-[12px] text-text-secondary leading-relaxed">
                        <span className="text-text-tertiary mt-[3px] flex-shrink-0">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-subtle mb-10" />

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 px-5 py-4 rounded-xl border border-border-subtle bg-bg-secondary hover:border-accent/40 hover:bg-bg-surface transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center">
                <item.icon size={18} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {item.title}
                </p>
                <p className="text-[12px] text-text-tertiary leading-relaxed mt-0.5">
                  {item.description}
                </p>
              </div>
              <ArrowRight size={16} className="text-text-tertiary group-hover:text-accent transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
