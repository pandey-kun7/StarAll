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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#ffffff] border border-[#e8e4dc] rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#e8e4dc] flex items-center justify-between bg-[#fbfaf7]">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Primary source citations
              </h3>
              <p className="text-xs text-stone-500">
                Verified evidence records for <strong className="text-stone-800">{investor.name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-800 hover:bg-[#f0ece1] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs">
          <div className="p-3 rounded-lg bg-[#faf8f4] border border-[#e8e4dc] grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-stone-500 block">Total citations</span>
              <span className="text-sm font-semibold text-stone-900 font-mono">{investor.evidence_records.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">Confidence level</span>
              <span className="text-sm font-semibold text-amber-900 font-mono">{investor.confidence_score}%</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">Lead investments</span>
              <span className="text-sm font-semibold text-stone-900 font-mono">
                {investor.backed_comparables.filter(b => b.is_lead).length}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] text-stone-600 font-medium">
              Direct primary sources
            </div>

            {investor.evidence_records.map((ev, i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-[#faf8f4] border border-[#e8e4dc] space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#fef3c7] text-amber-900 border border-[#fde68a] capitalize">
                      {ev.verification_status.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] font-medium text-stone-800">
                      {ev.publisher}
                    </span>
                  </div>

                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-800 hover:text-amber-900 hover:underline flex items-center space-x-1 font-medium"
                  >
                    <span>View original link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h4 className="text-xs font-semibold text-stone-900">
                  {ev.page_title}
                </h4>

                <div className="p-2.5 rounded bg-[#f8f6f0] border border-[#e8e4dc] text-stone-700 leading-relaxed italic">
                  &ldquo;{ev.passage}&rdquo;
                </div>

                <div className="pt-0.5 flex items-center justify-between text-[10px] text-stone-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>Published: {ev.publication_date || "Confirmed in announcement"}</span>
                  </span>
                  <span>Retrieved: {ev.retrieval_timestamp.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#e8e4dc] bg-[#fbfaf7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#f0ece1] hover:bg-[#e8e2d4] text-stone-800 font-medium text-xs transition-colors border border-[#ded8cb]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
