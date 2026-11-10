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
      <div className="bg-[#ffffff] border border-[#e8e4dc] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-xs">
        <div>
          <h3 className="text-xs font-semibold text-stone-900 flex items-center space-x-2">
            <span>Discovered comparable companies</span>
            <span className="px-1.5 py-0.5 rounded bg-[#f0ece1] text-stone-700 border border-[#ded8cb] text-[11px] font-mono">
              {companies.length} records
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
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
              className="bg-[#ffffff] border border-[#e8e4dc] hover:border-[#cfc9bc] rounded-xl p-5 transition-colors shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f8f6f0] border border-[#ded8cb] flex items-center justify-center text-xs font-semibold text-stone-700 font-mono flex-shrink-0">
                    <Building className="w-4 h-4 text-stone-700" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-stone-900">
                        {comp.company_name}
                      </h4>
                      {comp.company_website && (
                        <a
                          href={comp.company_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stone-500 hover:text-stone-800 transition-colors flex items-center space-x-1 text-xs"
                        >
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#f0ece1] text-stone-700 border border-[#ded8cb]">
                        {comp.sub_sector}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {comp.description}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      HQ: {comp.headquarters} | Stage: {comp.funding_stage}
                    </p>
                  </div>
                </div>

                {/* Similarity Badge */}
                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-1">
                  <div className="px-2 py-0.5 rounded bg-[#f0ece1] border border-[#ded8cb] text-stone-900 text-xs font-mono font-medium">
                    {comp.similarity_score}% match
                  </div>
                  <span className="text-[10px] text-stone-500 max-w-xs text-right">
                    {comp.similarity_rationale.slice(0, 50)}...
                  </span>
                </div>
              </div>

              {/* Verified Funding Event */}
              {latestRound && (
                <div className="mt-3.5 p-3 rounded-lg bg-[#faf8f4] border border-[#e8e4dc] text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[#eeebe2]">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-stone-900">
                        {latestRound.round_type}
                      </span>
                      <span className="text-stone-500 font-mono text-[11px] flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{latestRound.round_date}</span>
                      </span>
                      <span className="font-mono text-stone-900 font-medium flex items-center space-x-0.5">
                        <DollarSign className="w-3 h-3 text-stone-400" />
                        <span>{latestRound.amount_formatted}</span>
                      </span>
                    </div>

                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#fef3c7] border border-[#fde68a] text-amber-900">
                      {latestRound.verification_status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Participating Investors */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <Users className="w-3.5 h-3.5 text-stone-500 mr-0.5" />
                    <span className="text-[11px] text-stone-500">Participating investors:</span>
                    {latestRound.participating_investors.map((inv, i) => (
                      <span
                        key={i}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                          inv.role === "lead"
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : "bg-[#ffffff] text-stone-700 border-[#e8e4dc]"
                        }`}
                      >
                        {inv.name} {inv.role === "lead" ? "(Lead)" : ""}
                      </span>
                    ))}
                  </div>

                  {/* Primary Source Citation */}
                  {primaryEvidence && (
                    <div className="pt-2 border-t border-[#eeebe2] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px]">
                      <div className="flex items-center space-x-1.5 text-stone-600 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span className="text-stone-800 truncate">
                          {primaryEvidence.page_title} ({primaryEvidence.publisher})
                        </span>
                      </div>
                      <a
                        href={primaryEvidence.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-800 hover:text-amber-900 hover:underline flex items-center space-x-1 flex-shrink-0 font-medium"
                      >
                        <span>View announcement source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {primaryEvidence?.passage && (
                    <div className="mt-2 p-2 rounded bg-[#f8f6f0] border border-[#e8e4dc] text-[11px] text-stone-700 italic leading-relaxed">
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
