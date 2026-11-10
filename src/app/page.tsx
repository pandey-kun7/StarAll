"use client";

import React, { useState } from "react";
import { StartupInput, ResearchRun, ResearchProgressEvent } from "@/lib/types";
import { StartupForm } from "@/components/StartupForm";
import { ResearchProgress } from "@/components/ResearchProgress";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const [currentRun, setCurrentRun] = useState<ResearchRun | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<ResearchProgressEvent | null>(null);
  const [eventsLog, setEventsLog] = useState<ResearchProgressEvent[]>([]);

  const handleStartResearch = async (input: StartupInput, demoId?: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentEvent({
      step: "init",
      progress: 5,
      message: "Starting autonomous funding radar pipeline...",
      timestamp: new Date().toISOString(),
    });
    setEventsLog([]);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream, application/json",
        },
        body: JSON.stringify({
          ...input,
          demoId,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${response.status}`);
      }

      // Check if SSE stream
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const eventData = JSON.parse(line.replace("data: ", ""));
                if (eventData.step === "result" && eventData.run) {
                  setCurrentRun(eventData.run);
                } else if (eventData.step === "error") {
                  throw new Error(eventData.error || "Research failed.");
                } else {
                  setCurrentEvent(eventData);
                  setEventsLog((prev) => [...prev, eventData]);
                }
              } catch (e) {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      } else {
        // Fallback standard JSON
        const run: ResearchRun = await response.json();
        setCurrentRun(run);
      }
    } catch (err) {
      console.error("Error executing research:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during research.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentRun(null);
    setError(null);
    setCurrentEvent(null);
    setEventsLog([]);
  };

  return (
    <div className="space-y-6">
      {/* Hero Intro */}
      {!currentRun && !isLoading && (
        <div className="max-w-2xl py-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight leading-tight">
            Forensic investor intelligence grounded in verified funding rounds.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Discover active lead investors backed by disclosed comparable deals from the last 18 months. Every claim is linked to public primary evidence.
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-800/40 text-red-200 flex items-start space-x-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-300">Notice</h4>
            <p className="text-slate-300 mt-0.5">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main View Router */}
      {isLoading ? (
        <ResearchProgress currentEvent={currentEvent} events={eventsLog} />
      ) : currentRun ? (
        <ResultsDashboard run={currentRun} onReset={handleReset} />
      ) : (
        <StartupForm onSubmit={handleStartResearch} isLoading={isLoading} />
      )}
    </div>
  );
}
