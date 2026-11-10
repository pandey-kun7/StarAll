import { NextRequest, NextResponse } from "next/server";
import { getResearchRun } from "@/lib/storage";
import { generateResearchCsv } from "@/lib/export-csv";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const run = getResearchRun(id);

  if (!run) {
    return NextResponse.json(
      { error: `Research run with id "${id}" not found.` },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "json";

  if (format === "csv") {
    const csvContent = generateResearchCsv(run);
    const filename = `funding_radar_${run.startup_profile.sector.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${run.request_id}.csv`;

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  // JSON export
  const filename = `funding_radar_${run.request_id}.json`;
  return new Response(JSON.stringify(run, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
