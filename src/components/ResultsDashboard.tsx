"use client";

import React, { useState } from "react";
import { ResearchRun, InvestorProfile } from "@/lib/types";
import { RankedInvestorsList } from "./RankedInvestorsList";
import { ComparableCompaniesList } from "./ComparableCompaniesList";
import { EvidenceModal } from "./EvidenceModal";
import { ExportActions } from "./ExportActions";
import { MonitorModal } from "./MonitorModal";
import {
  Building2,
  Users,
  Award,
  ShieldCheck,
  Calendar,
  Sliders,
  FileCode,
  Bell,
  AlertTriangle,
} from "lucide-react";

interface ResultsDashboardProps {
  run: ResearchRun;
  onReset: () => void;
}

export function ResultsDashboard({ run, onReset }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"investors" | "comparables" | "methodology" | "raw">("investors");
  const [selectedInvestorForEvidence, setSelectedInvestorForEvidence] = useState<InvestorProfile | null>(null);
  const [isMonitorModalOpen, setIsMonitorModalOpen] = useState(false);

  const profile = run.startup_profile;
  const topScore = run.investors[0]?.total_score || 0;

  return (
    <div className="space-y-6">
      {/* Top Dossier Summary Header */}
      <div className="bg-[#ffffff] border border-[#e8e4dc] rounded-xl p-6 shadow-sm">
        {/* Warnings Banner if present */}
        {run.research_warnings && run.research_warnings.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-[#fffbeb] border border-[#fef3c7] text-amber-900 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {run.research_warnings.map((w, idx) => (
                <p key={idx}>{w}</p>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#f0ece1] text-stone-900 border border-[#ded8cb]">
                {profile.sector}
              </span>
              <span className="px-2 py-0.5 rounded text-xs text-stone-700 bg-[#faf8f4] border border-[#e8e4dc]">
                {profile.sub_sector}
              </span>
              <span className="px-2 py-0.5 rounded text-xs text-stone-600 bg-[#faf8f4] border border-[#e8e4dc]">
                Stage: {profile.stage}
              </span>
              <span className="px-2 py-0.5 rounded text-xs text-stone-600 bg-[#faf8f4] border border-[#e8e4dc]">
                Geo: {profile.geography}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-stone-900 leading-snug">
              &ldquo;{profile.original_description}&rdquo;
            </h2>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
              <span>Target customer: <strong className="text-stone-900 font-medium">{profile.target_customer}</strong></span>
              <span>Business model: <strong className="text-stone-900 font-medium">{profile.business_model}</strong></span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-stone-600 pt-0.5">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>
                Configured lookback window: <strong className="text-stone-900 font-mono">{profile.lookback_start}</strong> to <strong className="text-stone-900 font-mono">{profile.lookback_end}</strong> ({profile.lookback_months} months)
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 flex-shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMonitorModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#f6f3eb] border border-[#d6d0c4] text-stone-800 text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-xs"
              >
                <Bell className="w-3.5 h-3.5 text-amber-800" />
                <span>Set recurring monitor</span>
              </button>
              <ExportActions run={run} />
            </div>
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
            >
              Start new startup search
            </button>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-[#eeebe2]">
          <div className="p-3 rounded-lg bg-[#faf8f4] border border-[#e8e4dc]">
            <div className="flex items-center space-x-1.5 text-stone-500 text-xs mb-1">
              <Building2 className="w-3.5 h-3.5 text-stone-700" />
              <span>Comparables found</span>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold text-stone-900 font-mono">{run.comparable_companies.length}</span>
              <span className="text-xs text-stone-600 font-medium">&ge;10 verified</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#faf8f4] border border-[#e8e4dc]">
            <div className="flex items-center space-x-1.5 text-stone-500 text-xs mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Funding events</span>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold text-stone-900 font-mono">{run.funding_events.length}</span>
              <span className="text-xs text-stone-500">within window</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#faf8f4] border border-[#e8e4dc]">
            <div className="flex items-center space-x-1.5 text-stone-500 text-xs mb-1">
              <Users className="w-3.5 h-3.5 text-stone-700" />
              <span>Qualified investors</span>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold text-stone-900 font-mono">{run.investors.length}</span>
              <span className="text-xs text-stone-500">ranked</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#faf8f4] border border-[#e8e4dc]">
            <div className="flex items-center space-x-1.5 text-stone-500 text-xs mb-1">
              <Award className="w-3.5 h-3.5 text-amber-800" />
              <span>Top fit match</span>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold text-stone-900 font-mono">{topScore}</span>
              <span className="text-xs text-stone-500">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e8e4dc] space-x-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("investors")}
          className={`pb-2.5 px-3.5 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === "investors"
              ? "border-stone-900 text-stone-900 font-semibold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Award className="w-3.5 h-3.5 text-stone-700" />
          <span>Ranked investors ({run.investors.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("comparables")}
          className={`pb-2.5 px-3.5 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === "comparables"
              ? "border-stone-900 text-stone-900 font-semibold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-stone-700" />
          <span>Comparable companies ({run.comparable_companies.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("methodology")}
          className={`pb-2.5 px-3.5 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === "methodology"
              ? "border-stone-900 text-stone-900 font-semibold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-stone-700" />
          <span>Scoring model &amp; weights</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("raw")}
          className={`pb-2.5 px-3.5 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === "raw"
              ? "border-stone-900 text-stone-900 font-semibold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-stone-700" />
          <span>JSON payload</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "investors" && (
        <RankedInvestorsList
          investors={run.investors}
          onOpenEvidence={(inv) => setSelectedInvestorForEvidence(inv)}
        />
      )}

      {activeTab === "comparables" && (
        <ComparableCompaniesList companies={run.comparable_companies} />
      )}

      {activeTab === "methodology" && (
        <div className="bg-[#ffffff] border border-[#e8e4dc] rounded-xl p-5 space-y-5 text-xs text-stone-700 shadow-sm">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-1">
              Deterministic 100-point ranking model
            </h3>
            <p className="text-stone-600">
              Every score is computed without probabilistic variance using verified signals and diminishing returns on portfolio deal count.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-[#faf8f4] border border-[#e8e4dc] space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>1. Sector fit</span>
                <span className="text-amber-800 font-mono">Max 25 pts</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Evaluates thesis alignment with {profile.sub_sector}. Incompatible mandates (such as semiconductor-only funds for software marketplaces) receive 0 points.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#faf8f4] border border-[#e8e4dc] space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>2. Stage match</span>
                <span className="text-amber-800 font-mono">Max 20 pts</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Matches the founder&apos;s current round stage ({profile.stage}) against demonstrated investor stage deployment.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#faf8f4] border border-[#e8e4dc] space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>3. Comparable portfolio evidence</span>
                <span className="text-amber-800 font-mono">Max 20 pts</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Applies diminishing returns to prevent high-volume generalists from perpetually displacing high-conviction domain specialists.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#faf8f4] border border-[#e8e4dc] space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>4. Geography alignment</span>
                <span className="text-amber-800 font-mono">Max 10 pts</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Mandate coverage for the founder&apos;s operating region ({profile.geography}).
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#faf8f4] border border-[#e8e4dc] space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>5. Cheque-size fit</span>
                <span className="text-amber-800 font-mono">Max 10 pts</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Disclosed or observed round sizes. Undisclosed cheques are scored neutrally (50%), never penalized as zero.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#faf8f4] border border-[#e8e4dc] space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>6. Recency and deployment</span>
                <span className="text-amber-800 font-mono">Max 10 pts</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Verified cheque activity within the configured {profile.lookback_months}-month window ({profile.lookback_start} to {profile.lookback_end}).
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#faf8f4] border border-[#e8e4dc] space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>7. Approach route accessibility</span>
                <span className="text-amber-800 font-mono">Max 5 pts</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Actionable intake paths: official applications, open pitch forms, or verified warm introductions via portfolio founders.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "raw" && (
        <div className="bg-[#ffffff] border border-[#e8e4dc] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#e8e4dc] text-xs">
            <span className="font-mono text-stone-900 font-medium">Schema version: {run.schema_version}</span>
            <span className="text-stone-500 font-mono text-[11px]">Request ID: {run.request_id}</span>
          </div>
          <pre className="p-3.5 rounded-lg bg-[#f8f6f0] border border-[#e8e4dc] font-mono text-[11px] text-stone-800 overflow-x-auto max-h-[550px]">
            {JSON.stringify(run, null, 2)}
          </pre>
        </div>
      )}

      {/* Modals */}
      <EvidenceModal
        investor={selectedInvestorForEvidence}
        onClose={() => setSelectedInvestorForEvidence(null)}
      />

      <MonitorModal
        profile={profile}
        isOpen={isMonitorModalOpen}
        onClose={() => setIsMonitorModalOpen(false)}
      />
    </div>
  );
}
