"use client";

import React, { useState } from "react";
import { StartupInput } from "@/lib/types";
import { DEMO_PRESETS, DemoPreset } from "@/lib/demos";
import { Search, SlidersHorizontal, Clock, Globe, Rocket, Compass } from "lucide-react";

interface StartupFormProps {
  onSubmit: (input: StartupInput, demoId?: string) => void;
  isLoading: boolean;
}

export function StartupForm({ onSubmit, isLoading }: StartupFormProps) {
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState("Seed");
  const [country, setCountry] = useState("United States / Global");
  const [lookbackMonths, setLookbackMonths] = useState<number>(18);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sector, setSector] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [fundingTarget, setFundingTarget] = useState("");

  const stages = [
    { label: "Pre-seed", value: "Pre-Seed" },
    { label: "Seed", value: "Seed" },
    { label: "Series A", value: "Series A" },
    { label: "Series B", value: "Series B" },
    { label: "Unspecified early stage", value: "Not sure" },
  ];

  const handleDemoSelect = (demo: DemoPreset) => {
    setDescription(demo.input.description);
    setStage(demo.input.stage || "Seed");
    setCountry(demo.input.country || "United States");
    setSector(demo.input.sector || "");
    setBusinessModel(demo.input.businessModel || "");
    setFundingTarget(demo.input.fundingTarget || "");
    setLookbackMonths(demo.input.lookbackMonths || 18);
    onSubmit(demo.input, demo.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isLoading) return;

    onSubmit({
      description: description.trim(),
      stage,
      country: country.trim(),
      sector: sector.trim() || undefined,
      businessModel: businessModel.trim() || undefined,
      fundingTarget: fundingTarget.trim() || undefined,
      lookbackMonths,
    });
  };

  return (
    <div className="bg-[#ffffff] border border-[#e8e4dc] rounded-xl p-6 sm:p-7 shadow-sm">
      {/* Reference Profiles Section */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-amber-800" />
            <span className="text-xs font-semibold text-stone-900">
              Reference startup profiles
            </span>
          </div>
          <span className="text-[11px] text-stone-500">Pre-audited verified benchmark datasets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {DEMO_PRESETS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              disabled={isLoading}
              onClick={() => handleDemoSelect(demo)}
              className="text-left p-3 rounded-lg bg-[#fcfbf9] hover:bg-[#f6f3eb] border border-[#e8e4dc] hover:border-[#d1cbc0] transition-colors flex flex-col justify-between group disabled:opacity-50"
            >
              <div>
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-[#f0ece1] text-stone-700 border border-[#ded8cb] mb-1.5">
                  {demo.badge}
                </span>
                <p className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                  {demo.name}
                </p>
                <p className="text-[11px] text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {demo.input.description}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#eeebe2] flex items-center justify-between text-[11px] text-stone-500">
                <span>{demo.comparables.length} verified deals</span>
                <span className="text-amber-800 font-medium group-hover:underline">Load profile</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e8e4dc]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#ffffff] px-3 text-stone-500 font-medium">
            Or research your startup
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-stone-900 mb-1.5">
            Startup description and core mechanics
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            rows={4}
            placeholder="Describe what your company builds, who it sells to, and key technical or commercial differentiators..."
            className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d6d0c4] rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800/20 transition-all text-xs leading-relaxed"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center space-x-1.5">
              <Rocket className="w-3.5 h-3.5 text-amber-800" />
              <span>Current stage</span>
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 bg-[#ffffff] border border-[#d6d0c4] rounded-lg text-stone-800 text-xs focus:outline-none focus:border-stone-800"
            >
              {stages.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-800" />
              <span>Geography</span>
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. United States, Europe, Global"
              className="w-full px-3 py-2 bg-[#ffffff] border border-[#d6d0c4] rounded-lg text-stone-800 text-xs placeholder:text-stone-400 focus:outline-none focus:border-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-800" />
              <span>Lookback window</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#f5f2eb] p-1 rounded-lg border border-[#e2ddd3]">
              {[12, 15, 18].map((months) => (
                <button
                  key={months}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setLookbackMonths(months)}
                  className={`py-1 text-xs rounded transition-all ${
                    lookbackMonths === months
                      ? "bg-[#ffffff] text-stone-900 font-bold shadow-xs border border-[#d6d0c4]"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {months} mo
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-stone-600 hover:text-stone-900 flex items-center space-x-1 transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{showAdvanced ? "Hide optional parameters" : "Configure optional sector, business model, and cheque target"}</span>
          </button>

          {showAdvanced && (
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#faf8f4] border border-[#e8e4dc]">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Sector override
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="e.g. Climate Tech, Developer Infrastructure"
                  className="w-full px-2.5 py-1.5 bg-[#ffffff] border border-[#d6d0c4] rounded text-stone-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Business model
                </label>
                <input
                  type="text"
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value)}
                  placeholder="e.g. B2B SaaS, Marketplace, Usage-based"
                  className="w-full px-2.5 py-1.5 bg-[#ffffff] border border-[#d6d0c4] rounded text-stone-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Cheque target
                </label>
                <input
                  type="text"
                  value={fundingTarget}
                  onChange={(e) => setFundingTarget(e.target.value)}
                  placeholder="e.g. $1.5M - $3M"
                  className="w-full px-2.5 py-1.5 bg-[#ffffff] border border-[#d6d0c4] rounded text-stone-800 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-stone-500">
            Every candidate must link to a primary funding announcement within the configured lookback window.
          </p>

          <button
            type="submit"
            disabled={!description.trim() || isLoading}
            className="px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium text-xs flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-stone-50 border-t-transparent rounded-full animate-spin" />
                <span>Scanning active deals...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Find matching investors</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
