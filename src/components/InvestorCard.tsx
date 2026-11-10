"use client";

import React, { useState } from "react";
import { InvestorProfile } from "@/lib/types";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  ShieldCheck,
  Building,
  DollarSign,
  UserCheck,
  Send,
  Link as LinkIcon,
  HelpCircle,
} from "lucide-react";

interface InvestorCardProps {
  investor: InvestorProfile;
  onOpenEvidence: (investor: InvestorProfile) => void;
}

export function InvestorCard({ investor, onOpenEvidence }: InvestorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getApproachBadge = () => {
    switch (investor.approach_route.type) {
      case "official_application":
        return { label: "Official application", icon: Send };
      case "open_intake":
        return { label: "Open pitch intake", icon: ExternalLink };
      case "warm_intro_possible":
        return { label: "Warm intro via portfolio", icon: UserCheck };
      case "public_contact":
        return { label: "Direct contact portal", icon: LinkIcon };
      default:
        return { label: "No open portal listed", icon: HelpCircle };
    }
  };

  const approachBadge = getApproachBadge();
  const ApproachIcon = approachBadge.icon;

  return (
    <div className="bg-[#121722] border border-[#232d3e] hover:border-[#2d3a4d] rounded-xl p-5 sm:p-5 transition-colors shadow-sm">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          {/* Rank Badge */}
          <div className="w-11 h-11 rounded-lg bg-[#0c1017] border border-[#232d3e] flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-[10px] text-slate-400 font-mono">Rank</span>
            <span className="text-base font-mono font-bold text-slate-100 leading-none">
              #{investor.rank}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100 tracking-tight">
                {investor.name}
              </h3>
              {investor.website && (
                <a
                  href={investor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-sky-300 transition-colors"
                  title="Visit website"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-[#18202e] text-slate-300 border border-[#263244] capitalize">
                {investor.investor_type.replace(/_/g, " ")}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Focus: {investor.sector_focus.sectors.slice(0, 3).join(", ")} | {investor.geography_focus.regions.slice(0, 2).join(", ")}
            </p>
          </div>
        </div>

        {/* Score & Confidence */}
        <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-1">
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#182333] border border-sky-500/30 text-sky-300">
            <Award className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-base font-mono font-bold">{investor.total_score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>{investor.confidence_score}% confidence</span>
          </span>
        </div>
      </div>

      {/* Backed Comparables in Lookback Window */}
      <div className="mt-3.5 pt-3 border-t border-[#1e2736]">
        <div className="text-xs text-slate-300 mb-2 flex items-center space-x-1.5 font-medium">
          <Building className="w-3.5 h-3.5 text-sky-400" />
          <span>Backed comparable companies ({investor.backed_comparables.length}):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {investor.backed_comparables.map((comp, idx) => (
            <a
              key={idx}
              href={comp.evidence_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#0c1017] border border-[#232d3e] hover:border-sky-500/40 text-xs text-slate-200 hover:text-sky-300 transition-colors group"
            >
              <span className="font-medium">{comp.company_name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({comp.round_type})</span>
              <span className={`text-[10px] px-1 rounded ${comp.is_lead ? "bg-sky-500/10 text-sky-300 font-medium" : "text-slate-400"}`}>
                {comp.is_lead ? "Lead" : "Participant"}
              </span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400 opacity-60 group-hover:opacity-100" />
            </a>
          ))}
        </div>
      </div>

      {/* Metadata Metrics Row */}
      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {/* Cheque Size */}
        <div className="p-2.5 rounded-lg bg-[#0c1017] border border-[#20293a]">
          <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
            <DollarSign className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] font-medium">Cheque size</span>
          </div>
          <p className="font-semibold text-slate-200 truncate font-mono">{investor.cheque_size.formatted}</p>
          <span className="text-[10px] text-slate-400">
            {investor.cheque_size.status === "disclosed"
              ? "Official range"
              : investor.cheque_size.status === "observed_from_deals"
              ? "Observed from disclosed rounds"
              : "Not publicly disclosed"}
          </span>
        </div>

        {/* Lead Partner */}
        <div className="p-2.5 rounded-lg bg-[#0c1017] border border-[#20293a]">
          <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
            <UserCheck className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] font-medium">Lead partner</span>
          </div>
          <p className="font-semibold text-slate-200 truncate">
            {investor.lead_partner.name || "Not publicly verified"}
          </p>
          <span className="text-[10px] text-slate-400">
            {investor.lead_partner.status === "verified"
              ? "Verified in announcement"
              : "Not found in public records"}
          </span>
        </div>

        {/* Approach Route */}
        <div className="p-2.5 rounded-lg bg-[#0c1017] border border-[#20293a]">
          <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
            <ApproachIcon className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] font-medium">Approach route</span>
          </div>
          <p className="font-semibold text-slate-200 truncate">{investor.approach_route.label}</p>
          {investor.approach_route.url && (
            <a
              href={investor.approach_route.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center space-x-0.5 mt-0.5"
            >
              <span>Open intake portal</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>

      {/* Accordion Toggle Bar */}
      <div className="mt-3.5 pt-2.5 flex items-center justify-between border-t border-[#1e2736]">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-300 hover:text-sky-300 flex items-center space-x-1 transition-colors"
        >
          <span>{isExpanded ? "Hide score breakdown" : "Why this investor fits"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => onOpenEvidence(investor)}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 transition-colors font-medium"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Inspect citations ({investor.evidence_records.length})</span>
        </button>
      </div>

      {/* Expanded Rationale & Score Grid */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#1e2736] space-y-3.5 text-xs">
          <div className="p-3 rounded-lg bg-[#0c1017] border border-[#20293a]">
            <p className="text-slate-300 leading-relaxed mb-2.5">
              {investor.fit_explanation.why_this_rank}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1e2736]">
              <div>
                <span className="text-[11px] font-semibold text-sky-400 block mb-1">
                  Positive signals
                </span>
                <ul className="space-y-1 text-slate-400">
                  {investor.fit_explanation.positive_signals.map((pos, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-sky-400 font-bold">+</span>
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {investor.fit_explanation.negative_signals.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-amber-400 block mb-1">
                    Cautions &amp; gaps
                  </span>
                  <ul className="space-y-1 text-slate-400">
                    {investor.fit_explanation.negative_signals.map((neg, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-amber-400 font-bold">&ndash;</span>
                        <span>{neg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 7-Factor Score Breakdown */}
          <div>
            <div className="text-[11px] text-slate-400 font-medium mb-1.5">
              Deterministic 100-point breakdown
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5 font-mono text-center">
              <div className="p-2 rounded bg-[#0c1017] border border-[#20293a]">
                <span className="text-[10px] text-slate-400 block font-sans">Sector (25)</span>
                <span className="font-bold text-slate-100">{investor.score_breakdown.sector_fit}</span>
              </div>
              <div className="p-2 rounded bg-[#0c1017] border border-[#20293a]">
                <span className="text-[10px] text-slate-400 block font-sans">Stage (20)</span>
                <span className="font-bold text-slate-100">{investor.score_breakdown.stage_fit}</span>
              </div>
              <div className="p-2 rounded bg-[#0c1017] border border-[#20293a]">
                <span className="text-[10px] text-slate-400 block font-sans">Portfolio (20)</span>
                <span className="font-bold text-slate-100">{investor.score_breakdown.comparable_portfolio}</span>
              </div>
              <div className="p-2 rounded bg-[#0c1017] border border-[#20293a]">
                <span className="text-[10px] text-slate-400 block font-sans">Geo (10)</span>
                <span className="font-bold text-slate-100">{investor.score_breakdown.geography_fit}</span>
              </div>
              <div className="p-2 rounded bg-[#0c1017] border border-[#20293a]">
                <span className="text-[10px] text-slate-400 block font-sans">Cheque (10)</span>
                <span className="font-bold text-slate-100">{investor.score_breakdown.cheque_size_fit}</span>
              </div>
              <div className="p-2 rounded bg-[#0c1017] border border-[#20293a]">
                <span className="text-[10px] text-slate-400 block font-sans">Recency (10)</span>
                <span className="font-bold text-slate-100">{investor.score_breakdown.recency_activity}</span>
              </div>
              <div className="p-2 rounded bg-[#0c1017] border border-[#20293a]">
                <span className="text-[10px] text-slate-400 block font-sans">Route (5)</span>
                <span className="font-bold text-slate-100">{investor.score_breakdown.access_route}</span>
              </div>
            </div>
          </div>

          {/* Approach Guidance Box */}
          <div className="p-3 rounded-lg bg-[#141a24] border border-[#253245] text-slate-300">
            <span className="text-[11px] font-semibold text-slate-200 block mb-0.5">
              Approach guidance
            </span>
            <p className="text-slate-400 leading-relaxed">
              {investor.approach_route.guidance}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
