import { NextRequest, NextResponse } from "next/server";
import {
  createSearchFundingMonitor,
  createPortfolioFetchMonitor,
  listTinyFishMonitors,
  cancelTinyFishMonitor,
} from "@/lib/tinyfish";

export async function GET() {
  try {
    const monitors = await listTinyFishMonitors();
    return NextResponse.json({ monitors, count: monitors.length });
  } catch (err) {
    console.error("Failed to list monitors:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list monitors" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, query, url, scheduleCron } = body;

    if (type === "fetch") {
      if (!url) {
        return NextResponse.json({ error: "URL is required for fetch monitor" }, { status: 400 });
      }
      const res = await createPortfolioFetchMonitor({
        name: name || `Portfolio Monitor: ${url}`,
        url,
        scheduleCron,
      });
      return NextResponse.json(res);
    }

    // Default to search monitor
    if (!query) {
      return NextResponse.json({ error: "Query is required for search monitor" }, { status: 400 });
    }

    const res = await createSearchFundingMonitor({
      name: name || `Funding Monitor: ${query}`,
      query,
      scheduleCron,
    });
    return NextResponse.json(res);
  } catch (err) {
    console.error("Failed to create monitor:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create monitor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Monitor ID is required" }, { status: 400 });
    }

    const res = await cancelTinyFishMonitor(id);
    return NextResponse.json(res);
  } catch (err) {
    console.error("Failed to cancel monitor:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to cancel monitor" },
      { status: 500 }
    );
  }
}
