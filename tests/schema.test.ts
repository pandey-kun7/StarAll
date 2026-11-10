import assert from "node:assert";
import { test } from "node:test";
import { executeResearchPipeline } from "../src/lib/orchestrator";

test("JSON Response Schema: Adheres to Section 5 Versioned Contract", async () => {
  const run = await executeResearchPipeline({
    description: "GaN next-gen power semiconductors for electric vehicles",
    stage: "Seed",
    country: "Europe / Global",
    lookbackMonths: 18,
  }, { demoId: "demo-hardware" });

  assert.strictEqual(run.schema_version, "1.0.0");
  assert.ok(run.request_id.startsWith("run_"));
  assert.ok(run.generated_at);
  assert.ok(run.lookback_start);
  assert.ok(run.lookback_end);

  // Startup profile fields
  assert.ok(run.startup_profile.sector);
  assert.ok(run.startup_profile.sub_sector);
  assert.ok(run.startup_profile.keywords.length > 0);

  // Comparable companies
  assert.ok(run.comparable_companies.length >= 10, `Must have >= 10 comparables, got ${run.comparable_companies.length}`);
  for (const comp of run.comparable_companies) {
    assert.ok(comp.company_name);
    assert.ok(comp.company_website);
    assert.ok(comp.similarity_rationale);
    assert.ok(comp.funding_events.length > 0);
    for (const fe of comp.funding_events) {
      assert.ok(fe.round_date);
      assert.ok(fe.round_type);
      assert.ok(fe.primary_source_url.startsWith("http"));
      assert.ok(fe.evidence_records.length > 0);
      assert.ok(["verified_primary", "verified_secondary"].includes(fe.verification_status));
    }
  }

  // Investors
  assert.ok(run.investors.length > 0);
  for (const inv of run.investors) {
    assert.ok(inv.rank > 0);
    assert.ok(inv.total_score >= 0 && inv.total_score <= 100);
    assert.ok(inv.score_breakdown);
    assert.ok(inv.fit_explanation.why_this_rank);
    assert.ok(inv.approach_route.type);
    assert.ok(inv.cheque_size.status);
    assert.ok(inv.lead_partner.status);
  }

  // Methodology
  assert.strictEqual(run.ranking_methodology.version, "1.0.0");
  assert.strictEqual(run.ranking_methodology.max_score, 100);

  console.log(`Passed: JSON Schema Contract test. Validated ${run.comparable_companies.length} comparables & ${run.investors.length} investors.`);
});
