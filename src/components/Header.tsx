"use client";

import React from "react";
import { Radar, ShieldCheck, Database } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-[#e8e4dc] bg-[#fbfaf7]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#f0ece1] border border-[#ded8cb] flex items-center justify-center">
            <Radar className="w-5 h-5 text-stone-800" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-semibold tracking-tight text-stone-900">StarAll</span>
              <span className="px-1.5 py-0.5 text-[11px] font-mono text-stone-600 rounded bg-[#f0ece1] border border-[#ded8cb]">
                v1.0
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Investor intelligence powered by TinyFish &amp; TinySet
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#f0ece1] border border-[#ded8cb] text-xs text-stone-700">
            <Database className="w-3.5 h-3.5 text-stone-700" />
            <span>TinySet live extraction</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#fef3c7] border border-[#fde68a] text-xs font-medium text-amber-900">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Verified sources only</span>
          </div>
        </div>
      </div>
    </header>
  );
}
