"use client";

import React, { useState, useMemo } from "react";
import { InvestorProfile } from "@/lib/types";
import { InvestorCard } from "./InvestorCard";
import { Filter, ArrowUpDown, Search, ShieldCheck } from "lucide-react";

interface RankedInvestorsListProps {
  investors: InvestorProfile[];
  onOpenEvidence: (investor: InvestorProfile) => void;
}

export function RankedInvestorsList({ investors, onOpenEvidence }: RankedInvestorsListProps) {
  const [stageFilter, setStageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [chequeOnly, setChequeOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"overall" | "stage" | "geo" | "portfolio" | "confidence">("overall");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSorted = useMemo(() => {
    return investors
      .filter((inv) => {
        if (
          searchQuery &&
          !inv.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !inv.backed_comparables.some((b) => b.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          return false;
        }

        if (stageFilter !== "all") {
          const hasStage = inv.stage_focus.stages.some((s) => s.toLowerCase().includes(stageFilter.toLowerCase()));
          if (!hasStage) return false;
        }

        if (typeFilter !== "all" && inv.investor_type !== typeFilter) {
          return false;
        }

        if (chequeOnly && inv.cheque_size.status === "not_publicly_disclosed") {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "stage":
            return b.score_breakdown.stage_fit - a.score_breakdown.stage_fit;
          case "geo":
            return b.score_breakdown.geography_fit - a.score_breakdown.geography_fit;
          case "portfolio":
            return b.score_breakdown.comparable_portfolio - a.score_breakdown.comparable_portfolio;
          case "confidence":
            return b.confidence_score - a.confidence_score;
          case "overall":
          default:
            return a.rank - b.rank;
        }
      });
  }, [investors, stageFilter, typeFilter, chequeOnly, sortBy, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-[#ffffff] border border-[#e8e4dc] rounded-xl p-3.5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by firm name or portfolio deal..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#ffffff] border border-[#d6d0c4] rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-800"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#ffffff] border border-[#d6d0c4] rounded-lg text-stone-800 focus:outline-none focus:border-stone-800 text-xs"
            >
              <option value="all">All stages</option>
              <option value="seed">Seed</option>
              <option value="series a">Series A</option>
              <option value="series b">Series B</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#ffffff] border border-[#d6d0c4] rounded-lg text-stone-800 focus:outline-none focus:border-stone-800 text-xs"
            >
              <option value="all">All investor types</option>
              <option value="venture_capital">Venture capital</option>
              <option value="corporate_venture">Corporate venture</option>
              <option value="angel_network">Angel group</option>
            </select>

            <label className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#faf8f4] border border-[#e8e4dc] rounded-lg text-stone-700 cursor-pointer select-none text-xs">
              <input
                type="checkbox"
                checked={chequeOnly}
                onChange={(e) => setChequeOnly(e.target.checked)}
                className="rounded border-[#d6d0c4] bg-[#ffffff] text-stone-900 focus:ring-0"
              />
              <span>Disclosed cheques only</span>
            </label>

            <div className="flex items-center space-x-1 border-l border-[#e8e4dc] pl-2">
              <ArrowUpDown className="w-3 h-3 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1.5 bg-[#ffffff] border border-[#d6d0c4] rounded-lg text-stone-800 focus:outline-none focus:border-stone-800 text-xs"
              >
                <option value="overall">Sort by overall fit</option>
                <option value="stage">Sort by stage match</option>
                <option value="portfolio">Sort by portfolio count</option>
                <option value="confidence">Sort by evidence confidence</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count Line */}
      <div className="flex items-center justify-between px-1 text-xs text-stone-500">
        <span>
          Showing <strong className="text-stone-900">{filteredAndSorted.length}</strong> of{" "}
          <strong className="text-stone-900">{investors.length}</strong> qualified investors
        </span>
        <span className="text-[11px] text-amber-900 flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>Every backed deal links to primary public sources</span>
        </span>
      </div>

      {/* Cards Ledger */}
      {filteredAndSorted.length > 0 ? (
        <div className="space-y-3.5">
          {filteredAndSorted.map((inv) => (
            <InvestorCard
              key={inv.id}
              investor={inv}
              onOpenEvidence={onOpenEvidence}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#ffffff] border border-[#e8e4dc] rounded-xl p-10 text-center text-stone-500 shadow-xs">
          <Filter className="w-6 h-6 text-stone-400 mx-auto mb-2" />
          <h4 className="text-stone-800 font-semibold text-xs mb-1">No investors match current filter criteria</h4>
          <p className="text-xs text-stone-500">Reset the filters or clear the search term to view all discovered investors.</p>
          <button
            type="button"
            onClick={() => {
              setStageFilter("all");
              setTypeFilter("all");
              setChequeOnly(false);
              setSearchQuery("");
            }}
            className="mt-3 px-3 py-1.5 rounded-lg bg-[#f0ece1] text-stone-800 border border-[#ded8cb] text-xs font-medium hover:bg-[#e8e2d4] transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
