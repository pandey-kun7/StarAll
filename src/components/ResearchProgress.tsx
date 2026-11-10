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
    <div className="bg-[#ffffff] border border-[#e8e4dc] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-amber-800">
            Investigation in progress
          </span>
          <h3 className="text-sm font-semibold text-stone-900 mt-0.5">
            Extracting funding evidence &amp; calculating fit scores
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xl font-mono font-bold text-amber-900">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-[#f0ece1] h-1.5 rounded-full overflow-hidden border border-[#ded8cb] mb-6">
        <div
          className="h-full bg-stone-900 transition-all duration-300 rounded-full"
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
                  ? "bg-[#f8f6f0] border-[#ded8cb] text-stone-900"
                  : isCurrent
                  ? "bg-[#ffffff] border-stone-900 text-stone-900 shadow-xs"
                  : "bg-[#fbfaf7] border-[#eeebe2] text-stone-400"
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-800 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-amber-800 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-stone-300 flex-shrink-0" />
                )}
                <span className="text-[11px] font-mono text-stone-500">
                  Step {idx + 1}
                </span>
              </div>
              <p className="text-xs font-medium truncate">{st.label}</p>
            </div>
          );
        })}
      </div>

      {/* Activity Log */}
      <div className="bg-[#f8f6f0] border border-[#e8e4dc] rounded-lg p-3.5 font-mono text-xs text-stone-800 space-y-1 max-h-44 overflow-y-auto">
        <div className="text-[11px] text-stone-500 font-medium mb-1.5">
          Live execution trace
        </div>
        {events.length === 0 ? (
          <p className="text-stone-400 italic">Initializing agent pipeline...</p>
        ) : (
          events.map((ev, i) => (
            <div key={i} className="flex items-start space-x-2 text-[11px] leading-relaxed">
              <span className="text-stone-500 flex-shrink-0">
                {ev.timestamp.slice(11, 19)}
              </span>
              <span className="text-amber-800 font-semibold flex-shrink-0">
                [{ev.step}]
              </span>
              <span className="text-stone-800">{ev.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
