"use client";

import React from "react";
import { InvestorProfile } from "@/lib/types";
import { X, ExternalLink, ShieldCheck, Calendar } from "lucide-react";

interface EvidenceModalProps {
  investor: InvestorProfile | null;
  onClose: () => void;
}

export function EvidenceModal({ investor, onClose }: EvidenceModalProps) {
  if (!investor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0d14]/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#121722] border border-[#232d3e] rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#232d3e] flex items-center justify-between bg-[#0e131d]">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-[#18202e] border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Primary source citations
              </h3>
              <p className="text-xs text-slate-400">
                Verified evidence records for <strong className="text-slate-200">{investor.name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-[#18202e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs">
          <div className="p-3 rounded-lg bg-[#0c1017] border border-[#20293a] grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block">Total citations</span>
              <span className="text-sm font-semibold text-slate-100 font-mono">{investor.evidence_records.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Confidence level</span>
              <span className="text-sm font-semibold text-sky-400 font-mono">{investor.confidence_score}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Lead investments</span>
              <span className="text-sm font-semibold text-slate-100 font-mono">
                {investor.backed_comparables.filter(b => b.is_lead).length}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] text-slate-400 font-medium">
              Direct primary sources
            </div>

            {investor.evidence_records.map((ev, i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-[#0c1017] border border-[#20293a] space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-950/40 text-amber-300 border border-amber-500/30 capitalize">
                      {ev.verification_status.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] font-medium text-slate-300">
                      {ev.publisher}
                    </span>
                  </div>

                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-medium"
                  >
                    <span>View original link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h4 className="text-xs font-semibold text-slate-100">
                  {ev.page_title}
                </h4>

                <div className="p-2.5 rounded bg-[#121722] border border-[#1e2634] text-slate-300 leading-relaxed italic">
                  &ldquo;{ev.passage}&rdquo;
                </div>

                <div className="pt-0.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Published: {ev.publication_date || "Confirmed in announcement"}</span>
                  </span>
                  <span>Retrieved: {ev.retrieval_timestamp.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#232d3e] bg-[#0e131d] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#18202e] hover:bg-[#202b3d] text-slate-200 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
