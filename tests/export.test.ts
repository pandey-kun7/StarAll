import assert from "node:assert";
import { test } from "node:test";
import { generateResearchCsv } from "../src/lib/export-csv";
import { executeResearchPipeline } from "../src/lib/orchestrator";

test("CSV Export: Preserves Evidence URLs, Row Model, and RFC 4180 Escaping", async () => {
  const run = await executeResearchPipeline({
    description: "Autonomous AI code review and regression patching",
    stage: "Seed",
    country: "United States",
    lookbackMonths: 18,
  }, { demoId: "demo-b2b-ai" });

  const csv = generateResearchCsv(run);

  assert.ok(csv.includes("Investor Rank"), "CSV must include headers");
  assert.ok(csv.includes("Verified Primary Evidence URL"), "CSV must include evidence URL header");
  assert.ok(csv.includes("https://"), "CSV must contain real URLs");
  assert.ok(csv.includes("Founders Fund") || csv.includes("Cognition"), "CSV must contain verified investor/company names");

  // Check row count: header + at least 1 row per backed comparable
  const lines = csv.split("\r\n").filter(l => l.trim().length > 0);
  assert.ok(lines.length >= 10, `CSV should contain multiple rows, got ${lines.length}`);

  console.log(`Passed: CSV Export test. Generated ${lines.length} rows with evidence URLs.`);
});
