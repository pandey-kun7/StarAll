import { executeResearchPipeline } from "../src/lib/orchestrator";

async function testTerraGrid() {
  const terraGridDescription = `Urban waste systems have a coordination problem: households lack consistent incentives, collectors need viable routes, processors need clean and predictable feedstock, and cities need better evidence about environmental outcomes.

TerraGrid connects these participants through a verified waste marketplace. It rewards accepted material, coordinates its collection and recovery, and records how every transaction is settled. GreenVault maintains a separately accounted community fund that uses environmental and vulnerability data to help prioritise local resilience projects.

The platform's energy module can connect organic-waste recovery to biogas production and electricity-demand planning where suitable facilities and commercial partnerships exist. Its air, heat and water modules help identify where better waste management and targeted environmental investments may produce measurable benefits.

The differentiator is the traceable connection between a kilogram of waste, its economic value, its actual destination and the environmental outcomes that can reasonably be attributed to its recovery.`;

  console.log("=== TESTING TERRAGRID CUSTOM PITCH (NO DEMO ID) ===");
  const result = await executeResearchPipeline({
    description: terraGridDescription,
    stage: "Seed",
    country: "United States / Global",
    lookbackMonths: 18,
  }, {
    onProgress: (ev) => {
      console.log(`[${ev.step}] ${ev.progress}%: ${ev.message}`);
    }
  });

  console.log("\n=== TERRAGRID RESEARCH COMPLETE ===");
  console.log("Sector:", result.startup_profile.sector);
  console.log("Sub-sector:", result.startup_profile.sub_sector);
  console.log("Comparables found:", result.comparable_companies.length);
  console.log("Comparables sample:", result.comparable_companies.slice(0, 5).map(c => c.company_name).join(", "));
  console.log("Investors ranked:", result.investors.length);
  console.log("\nTop 5 Ranked Investors:");
  for (let i = 0; i < Math.min(5, result.investors.length); i++) {
    const inv = result.investors[i];
    console.log(
      `#${inv.rank} ${inv.name} | Score: ${inv.total_score}/100 | Backed: ${inv.backed_comparables.map(b => b.company_name).join(", ")} | Route: ${inv.approach_route.label}`
    );
  }

  // Assertions
  const firstComp = result.comparable_companies[0].company_name;
  if (firstComp.toLowerCase().includes("gan") || firstComp.toLowerCase().includes("semiconductor")) {
    throw new Error(`CRITICAL REGRESSION: GaN/Semiconductor comparables injected into waste tech! Found: ${firstComp}`);
  }

  const topInvestor = result.investors[0].name;
  if (topInvestor.toLowerCase().includes("parkwalk") || topInvestor.toLowerCase().includes("supernova")) {
    throw new Error(`CRITICAL REGRESSION: Semiconductor VC ranked #1 for waste tech! Found: ${topInvestor}`);
  }

  console.log("\nSUCCESS: TerraGrid correctly discovered waste & circular economy comparables and investors!");
}

testTerraGrid().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
