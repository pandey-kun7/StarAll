import { NextResponse } from "next/server";
import { DEMO_PRESETS } from "@/lib/demos";

export async function GET() {
  const summaries = DEMO_PRESETS.map((d) => ({
    id: d.id,
    name: d.name,
    badge: d.badge,
    market_category: d.market_category,
    input: d.input,
    comparable_count: d.comparables.length,
    sample_comparables: d.comparables.slice(0, 3).map((c) => ({
      name: c.company_name,
      stage: c.funding_stage,
      latest_amount: c.funding_events[0]?.amount_formatted,
      lead_investor: c.funding_events[0]?.lead_investors[0] || "Undisclosed",
    })),
  }));

  return NextResponse.json({
    demos: summaries,
    count: summaries.length,
  });
}
