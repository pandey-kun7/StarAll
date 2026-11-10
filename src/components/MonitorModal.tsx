"use client";

import React, { useState, useEffect } from "react";
import { StartupProfile } from "@/lib/types";
import { X, Bell, Plus, Check, Trash2, Loader2, AlertCircle } from "lucide-react";

interface MonitorModalProps {
  profile: StartupProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function MonitorModal({ profile, isOpen, onClose }: MonitorModalProps) {
  const [monitorName, setMonitorName] = useState(`Funding monitor: ${profile.sub_sector}`);
  const [query, setQuery] = useState(
    `${profile.keywords.slice(0, 3).join(" ")} ${profile.stage} funding round announcement 2025 OR 2026`
  );
  const [scheduleCron, setScheduleCron] = useState("0 9 * * 1"); // Weekly Mondays at 9am
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [isLoadingMonitors, setIsLoadingMonitors] = useState(false);
  const [latestRunResults, setLatestRunResults] = useState<any[] | null>(null);

  const fetchMonitors = async () => {
    setIsLoadingMonitors(true);
    try {
      const res = await fetch("/api/monitors");
      if (res.ok) {
        const data = await res.json();
        setMonitors(data.monitors || []);
      }
    } catch (e) {
      console.warn("Could not fetch monitors:", e);
    } finally {
      setIsLoadingMonitors(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMonitors();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    setCreateSuccess(false);

    try {
      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "search",
          name: monitorName,
          query,
          scheduleCron,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create monitor");
      }

      const data = await res.json();
      setCreateSuccess(true);
      if (data.run?.results) {
        setLatestRunResults(data.run.results);
      }
      fetchMonitors();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create monitor");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/monitors?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      fetchMonitors();
    } catch (e) {
      console.warn("Could not delete monitor:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0d14]/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#121722] border border-[#232d3e] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#232d3e] flex items-center justify-between bg-[#0e131d]">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-[#18202e] border border-sky-500/30 flex items-center justify-center">
              <Bell className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Recurring funding monitors
              </h3>
              <p className="text-xs text-slate-400">
                Automatically track newly announced rounds and investor activity on a schedule
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
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/40 text-red-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {createSuccess && (
            <div className="p-3.5 rounded-lg bg-sky-950/30 border border-sky-800/40 text-sky-200 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-semibold text-xs">
                <Check className="w-3.5 h-3.5 text-sky-400" />
                <span>Monitor scheduled. Initial search executed.</span>
              </div>
              {latestRunResults && latestRunResults.length > 0 && (
                <div className="mt-1 text-xs space-y-1 text-slate-300">
                  <span className="font-medium text-slate-400 block">Initial deals discovered:</span>
                  {latestRunResults.slice(0, 3).map((r, i) => (
                    <div key={i} className="text-slate-300 truncate">
                      <strong className="text-slate-100">{r.title}</strong> &ndash; {r.snippet.slice(0, 80)}...
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCreate} className="space-y-3.5 p-4 rounded-lg bg-[#0c1017] border border-[#20293a]">
            <span className="text-xs font-semibold text-slate-200 block">
              Set up automated query monitor
            </span>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Monitor name
              </label>
              <input
                type="text"
                value={monitorName}
                onChange={(e) => setMonitorName(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#141a24] border border-[#283548] rounded text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Search query
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#141a24] border border-[#283548] rounded text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                TinyFish monitors will poll new search index events matching this query on the configured schedule.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Schedule (Cron)
                </label>
                <select
                  value={scheduleCron}
                  onChange={(e) => setScheduleCron(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#141a24] border border-[#283548] rounded text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="0 9 * * 1">Weekly (Mondays at 9:00 AM)</option>
                  <option value="0 9 * * *">Daily (9:00 AM)</option>
                  <option value="0 */6 * * *">Every 6 hours</option>
                  <option value="0 * * * *">Hourly</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-1.5 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50 transition-colors"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create monitor</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Active Monitors List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-slate-400">
                Active monitors ({monitors.length})
              </span>
              {isLoadingMonitors && <Loader2 className="w-3 h-3 text-sky-400 animate-spin" />}
            </div>

            {monitors.length > 0 ? (
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {monitors.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-lg bg-[#0c1017] border border-[#20293a] flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-200 truncate">{m.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#18202e] text-slate-300 border border-[#263244]">
                          {m.status}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{m.type}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {m.type === "search" ? m.config?.query : m.config?.url}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-[#18202e] transition-colors flex-shrink-0"
                      title="Delete monitor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-[#0c1017] border border-[#20293a] text-center text-slate-400 text-xs">
                No active monitors configured yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#232d3e] bg-[#0e131d] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#18202e] hover:bg-[#202b3d] text-slate-200 font-medium text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
