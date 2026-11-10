import { NextRequest, NextResponse } from "next/server";
import { executeResearchPipeline } from "@/lib/orchestrator";
import { StartupInput } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input: StartupInput = {
      description: body.description || "",
      stage: body.stage,
      country: body.country,
      sector: body.sector,
      businessModel: body.businessModel,
      fundingTarget: body.fundingTarget,
      preferredMarkets: body.preferredMarkets,
      lookbackMonths: body.lookbackMonths,
    };

    if (!input.description || input.description.trim().length === 0) {
      return NextResponse.json(
        { error: "Startup description is required." },
        { status: 400 }
      );
    }

    const demoId = body.demoId as string | undefined;

    // Check if client wants SSE stream
    const acceptHeader = req.headers.get("accept");
    if (acceptHeader?.includes("text/event-stream")) {
      const responseStream = new TransformStream();
      const writer = responseStream.writable.getWriter();
      const encoder = new TextEncoder();

      // Run pipeline asynchronously while writing SSE events
      executeResearchPipeline(input, {
        demoId,
        onProgress: (ev) => {
          const data = `data: ${JSON.stringify(ev)}\n\n`;
          writer.write(encoder.encode(data)).catch(() => {});
        },
      })
        .then((run) => {
          const finalData = `data: ${JSON.stringify({ step: "result", run })}\n\n`;
          writer.write(encoder.encode(finalData));
          writer.close();
        })
        .catch((err) => {
          const errData = `data: ${JSON.stringify({ step: "error", error: err.message })}\n\n`;
          writer.write(encoder.encode(errData));
          writer.close();
        });

      return new Response(responseStream.readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Standard synchronous JSON response
    const run = await executeResearchPipeline(input, { demoId });
    return NextResponse.json(run);
  } catch (err) {
    console.error("Research API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
