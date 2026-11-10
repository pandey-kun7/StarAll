import { NextRequest, NextResponse } from "next/server";
import { getResearchRun } from "@/lib/storage";

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

  return NextResponse.json(run);
}
