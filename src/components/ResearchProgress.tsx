"use client";

import React from "react";
import { ResearchProgressEvent } from "@/lib/types";
import { CheckCircle2, Circle, Loader2, Sparkles, Database, Search, ShieldCheck, Award } from "lucide-react";

interface ResearchProgressProps {
  currentEvent: ResearchProgressEvent | null;
  events: ResearchProgressEvent[];
}

export function ResearchProgress({ currentEvent, events }: ResearchProgressProps) {
  const steps = [
    { key: "profile", label: "Analyze profile", icon: Sparkles },
    { key: "tinyset_discovery", label: "TinySet web discovery", icon: Database },
    { key: "verification", label: "Verify primary evidence", icon: ShieldCheck },
    { key: "enrichment", label: "Cheque sizes & routes", icon: Search },
    { key: "ranking", label: "Deterministic ranking", icon: Award },
  ];

  const currentStepIndex = (() => {
    if (!currentEvent) return 0;
    if (currentEvent.step === "init") return 0;
    if (currentEvent.step === "profile") return 0;
    if (currentEvent.step === "tinyset_discovery") return 1;
    if (currentEvent.step === "verification") return 2;
    if (currentEvent.step === "enrichment") return 3;
    if (currentEvent.step === "ranking") return 4;
    if (currentEvent.step === "complete") return 5;
    return 0;
  })();

  const progressPercent = currentEvent?.progress || 15;

  return (
    <div className="bg-[#121722] border border-[#232d3e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-sky-400">
            Investigation in progress
          </span>
          <h3 className="text-sm font-semibold text-slate-100 mt-0.5">
            Extracting funding evidence &amp; calculating fit scores
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xl font-mono font-bold text-sky-400">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-[#0a0d14] h-1.5 rounded-full overflow-hidden border border-[#232d3e] mb-6">
        <div
          className="h-full bg-sky-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-6">
        {steps.map((st, idx) => {
          const isDone = currentStepIndex > idx;
          const isCurrent = currentStepIndex === idx;

          return (
            <div
              key={st.key}
              className={`p-2.5 rounded-lg border transition-all ${
                isDone
                  ? "bg-[#141d2a] border-[#25354b] text-slate-200"
                  : isCurrent
                  ? "bg-[#182333] border-sky-500/60 text-slate-100"
                  : "bg-[#0c1017] border-[#1e2736] text-slate-400"
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                )}
                <span className="text-[11px] font-mono text-slate-400">
                  Step {idx + 1}
                </span>
              </div>
              <p className="text-xs font-medium truncate">{st.label}</p>
            </div>
          );
        })}
      </div>

      {/* Activity Log */}
      <div className="bg-[#0c1017] border border-[#20293a] rounded-lg p-3.5 font-mono text-xs text-slate-300 space-y-1 max-h-44 overflow-y-auto">
        <div className="text-[11px] text-slate-400 font-medium mb-1.5">
          Live execution trace
        </div>
        {events.length === 0 ? (
          <p className="text-slate-400 italic">Initializing agent pipeline...</p>
        ) : (
          events.map((ev, i) => (
            <div key={i} className="flex items-start space-x-2 text-[11px] leading-relaxed">
              <span className="text-slate-400 flex-shrink-0">
                {ev.timestamp.slice(11, 19)}
              </span>
              <span className="text-sky-400/80 font-semibold flex-shrink-0">
                [{ev.step}]
              </span>
              <span className="text-slate-300">{ev.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
