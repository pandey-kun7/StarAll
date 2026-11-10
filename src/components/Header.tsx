"use client";

import React from "react";
import { Radar, ShieldCheck, Database } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-[#232d3e] bg-[#0a0d14]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#18202e] border border-[#2a364a] flex items-center justify-center">
            <Radar className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-semibold tracking-tight text-slate-100">Funding Radar</span>
              <span className="px-1.5 py-0.5 text-[11px] font-mono text-slate-400 rounded bg-[#18202e] border border-[#2a364a]">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Investor intelligence powered by TinyFish &amp; TinySet
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#121722] border border-[#232d3e] text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>TinySet live extraction</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#121722] border border-amber-500/30 text-xs text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified sources only</span>
          </div>
        </div>
      </div>
    </header>
  );
}
