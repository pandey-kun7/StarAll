"use client";

import React from "react";
import { ComparableCompany } from "@/lib/types";
import { Building, ExternalLink, ShieldCheck, Calendar, DollarSign, Users } from "lucide-react";

interface ComparableCompaniesListProps {
  companies: ComparableCompany[];
}

export function ComparableCompaniesList({ companies }: ComparableCompaniesListProps) {
  return (
    <div className="space-y-3.5">
      <div className="bg-[#121722] border border-[#232d3e] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm">
        <div>
          <h3 className="text-xs font-semibold text-slate-100 flex items-center space-x-2">
            <span>Discovered comparable companies</span>
            <span className="px-1.5 py-0.5 rounded bg-[#18202e] text-slate-300 border border-[#263244] text-[11px] font-mono">
              {companies.length} records
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every company announced a verified funding round in the configured lookback window.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {companies.map((comp) => {
          const latestRound = comp.funding_events[0];
          const primaryEvidence = latestRound?.evidence_records[0];

          return (
            <div
              key={comp.id}
              className="bg-[#121722] border border-[#232d3e] hover:border-[#2d3a4d] rounded-xl p-5 transition-colors shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0c1017] border border-[#232d3e] flex items-center justify-center text-xs font-semibold text-slate-300 font-mono flex-shrink-0">
                    <Building className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-100">
                        {comp.company_name}
                      </h4>
                      {comp.company_website && (
                        <a
                          href={comp.company_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-sky-300 transition-colors flex items-center space-x-1 text-xs"
                        >
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#18202e] text-slate-300 border border-[#263244]">
                        {comp.sub_sector}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {comp.description}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      HQ: {comp.headquarters} | Stage: {comp.funding_stage}
                    </p>
                  </div>
                </div>

                {/* Similarity Badge */}
                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-1">
                  <div className="px-2 py-0.5 rounded bg-[#182333] border border-sky-500/30 text-sky-300 text-xs font-mono font-medium">
                    {comp.similarity_score}% match
                  </div>
                  <span className="text-[10px] text-slate-400 max-w-xs text-right">
                    {comp.similarity_rationale.slice(0, 50)}...
                  </span>
                </div>
              </div>

              {/* Verified Funding Event */}
              {latestRound && (
                <div className="mt-3.5 p-3 rounded-lg bg-[#0c1017] border border-[#20293a] text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[#1c2433]">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-slate-200">
                        {latestRound.round_type}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px] flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{latestRound.round_date}</span>
                      </span>
                      <span className="font-mono text-slate-100 font-medium flex items-center space-x-0.5">
                        <DollarSign className="w-3 h-3 text-slate-400" />
                        <span>{latestRound.amount_formatted}</span>
                      </span>
                    </div>

                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-950/40 border border-amber-600/30 text-amber-300">
                      {latestRound.verification_status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Participating Investors */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
                    <span className="text-[11px] text-slate-400">Participating investors:</span>
                    {latestRound.participating_investors.map((inv, i) => (
                      <span
                        key={i}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                          inv.role === "lead"
                            ? "bg-sky-500/10 text-sky-300 border-sky-500/30"
                            : "bg-[#141a24] text-slate-300 border-[#232d3e]"
                        }`}
                      >
                        {inv.name} {inv.role === "lead" ? "(Lead)" : ""}
                      </span>
                    ))}
                  </div>

                  {/* Primary Source Citation */}
                  {primaryEvidence && (
                    <div className="pt-2 border-t border-[#18202c] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px]">
                      <div className="flex items-center space-x-1.5 text-slate-400 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="text-slate-300 truncate">
                          {primaryEvidence.page_title} ({primaryEvidence.publisher})
                        </span>
                      </div>
                      <a
                        href={primaryEvidence.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 flex-shrink-0"
                      >
                        <span>View announcement source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {primaryEvidence?.passage && (
                    <div className="mt-2 p-2 rounded bg-[#0f141f] border border-[#1e2634] text-[11px] text-slate-300 italic leading-relaxed">
                      &ldquo;{primaryEvidence.passage}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
