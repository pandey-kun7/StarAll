import assert from "node:assert";
import { test } from "node:test";
import { rankInvestors, DEFAULT_RANKING_WEIGHTS } from "../src/lib/ranking-engine";
import { buildStartupProfile } from "../src/lib/startup-profile";
import { InvestorProfile } from "../src/lib/types";

test("Ranking Engine: Specialist vs High-Volume Generalist (Diminishing Returns)", () => {
  const profile = buildStartupProfile({
    description: "Next-generation Gallium Nitride power semiconductors for EV charging",
    stage: "Seed",
    country: "United States",
    lookbackMonths: 18,
  });

  const specialist: InvestorProfile = {
    id: "inv_specialist",
    name: "GaN Specialist Ventures",
    investor_type: "venture_capital",
    rank: 0,
    total_score: 0,
    score_breakdown: { sector_fit: 0, stage_fit: 0, comparable_portfolio: 0, geography_fit: 0, cheque_size_fit: 0, recency_activity: 0, access_route: 0 },
    confidence_score: 85,
    fit_explanation: { summary: "", positive_signals: [], negative_signals: [], why_this_rank: "" },
    backed_comparables: [
      {
        company_name: "Cambridge GaN Devices",
        company_website: "https://camgandevices.com",
        round_type: "Seed",
        round_date: "2024-05-10",
        role: "Lead Investor",
        amount_formatted: "$5M",
        evidence_url: "https://camgandevices.com",
        evidence_snippet: "GaN Specialist Ventures led $5M seed round",
        is_lead: true,
      },
    ],
    stage_focus: { stages: ["Seed", "Pre-Seed"], source: "official_thesis" },
    geography_focus: { regions: ["United States", "Global"], source: "official_thesis" },
    sector_focus: { sectors: ["Semiconductors", "Gallium Nitride", "Deep Tech"], source: "official_thesis" },
    cheque_size: { min_usd: 1000000, max_usd: 5000000, formatted: "$1M - $5M", status: "disclosed" },
    lead_partner: { name: "Dr. Silicon", title: "Partner", status: "verified" },
    approach_route: { type: "official_application", label: "Specialist Pitch", guidance: "Apply online" },
    evidence_records: [],
  };

  const generalist: InvestorProfile = {
    id: "inv_generalist",
    name: "Mega Global Capital",
    investor_type: "venture_capital",
    rank: 0,
    total_score: 0,
    score_breakdown: { sector_fit: 0, stage_fit: 0, comparable_portfolio: 0, geography_fit: 0, cheque_size_fit: 0, recency_activity: 0, access_route: 0 },
    confidence_score: 70,
    fit_explanation: { summary: "", positive_signals: [], negative_signals: [], why_this_rank: "" },
    backed_comparables: [
      {
        company_name: "Other Tech 1",
        company_website: "https://tech1.com",
        round_type: "Series C",
        round_date: "2024-01-10",
        role: "Participant",
        amount_formatted: "$100M",
        evidence_url: "https://tech1.com",
        evidence_snippet: "Mega backed Series C",
        is_lead: false,
      },
      {
        company_name: "Other Tech 2",
        company_website: "https://tech2.com",
        round_type: "Series D",
        round_date: "2024-02-10",
        role: "Participant",
        amount_formatted: "$150M",
        evidence_url: "https://tech2.com",
        evidence_snippet: "Mega backed Series D",
        is_lead: false,
      },
    ],
    stage_focus: { stages: ["Series B", "Series C", "Growth"], source: "observed_deals" },
    geography_focus: { regions: ["Global"], source: "official_thesis" },
    sector_focus: { sectors: ["Internet", "Consumer Software"], source: "official_thesis" },
    cheque_size: { min_usd: 20000000, max_usd: 100000000, formatted: "$20M - $100M", status: "disclosed" },
    lead_partner: { name: null, title: null, status: "not_found" },
    approach_route: { type: "no_public_route_found", label: "None", guidance: "No portal" },
    evidence_records: [],
  };

  const ranked = rankInvestors([generalist, specialist], profile);

  // Specialist must rank #1 over the late-stage/unfocused generalist
  assert.strictEqual(ranked[0].id, "inv_specialist", "Specialist must outrank generalist on stage & sector fit");
  assert.strictEqual(ranked[0].rank, 1);
  assert.ok(ranked[0].total_score > ranked[1].total_score, "Specialist score must exceed generalist");
  console.log("Passed: Specialist vs Generalist test. Specialist score:", ranked[0].total_score, "Generalist score:", ranked[1].total_score);
});

test("Ranking Engine: Undisclosed Cheque is Scored Neutrally, Not Zero", () => {
  const profile = buildStartupProfile({
    description: "Autonomous AI code reviews",
    stage: "Seed",
  });

  const undisclosedChequeInvestor: InvestorProfile = {
    id: "inv_unknown_cheque",
    name: "Stealth Angel Network",
    investor_type: "angel_network",
    rank: 0,
    total_score: 0,
    score_breakdown: { sector_fit: 0, stage_fit: 0, comparable_portfolio: 0, geography_fit: 0, cheque_size_fit: 0, recency_activity: 0, access_route: 0 },
    confidence_score: 60,
    fit_explanation: { summary: "", positive_signals: [], negative_signals: [], why_this_rank: "" },
    backed_comparables: [],
    stage_focus: { stages: ["Seed"], source: "observed_deals" },
    geography_focus: { regions: ["Global"], source: "observed_deals" },
    sector_focus: { sectors: ["Developer Tools"], source: "observed_deals" },
    cheque_size: { min_usd: null, max_usd: null, formatted: "Not publicly disclosed", status: "not_publicly_disclosed" },
    lead_partner: { name: null, title: null, status: "not_found" },
    approach_route: { type: "open_intake", label: "Portal", guidance: "Website" },
    evidence_records: [],
  };

  const ranked = rankInvestors([undisclosedChequeInvestor], profile);
  assert.strictEqual(
    ranked[0].score_breakdown.cheque_size_fit,
    Math.round(DEFAULT_RANKING_WEIGHTS.cheque_size_fit * 0.5),
    "Undisclosed cheque must receive neutral 50% score (5 pts), NOT zero"
  );
  console.log("Passed: Neutral cheque score test. Cheque points:", ranked[0].score_breakdown.cheque_size_fit);
});

test("Ranking Engine: Pure Semiconductor/Hardware VC receives zero sector score for Circular Waste Marketplace", () => {
  const profile = buildStartupProfile({
    description: "Urban waste marketplace connecting households, haulers, and recyclers with incentive tokens and municipal tracking.",
    stage: "Seed",
    country: "United States",
  });

  const semiconductorInvestor: InvestorProfile = {
    id: "inv_semi",
    name: "Pure Silicon Capital",
    investor_type: "venture_capital",
    rank: 0,
    total_score: 0,
    score_breakdown: { sector_fit: 0, stage_fit: 0, comparable_portfolio: 0, geography_fit: 0, cheque_size_fit: 0, recency_activity: 0, access_route: 0 },
    confidence_score: 80,
    fit_explanation: { summary: "", positive_signals: [], negative_signals: [], why_this_rank: "" },
    backed_comparables: [],
    stage_focus: { stages: ["Seed"], source: "official_thesis" },
    geography_focus: { regions: ["United States"], source: "official_thesis" },
    sector_focus: { sectors: ["Semiconductors", "Power Electronics", "Nanotechnology"], source: "official_thesis" },
    cheque_size: { min_usd: 1000000, max_usd: 5000000, formatted: "$1M - $5M", status: "disclosed" },
    lead_partner: { name: null, title: null, status: "not_found" },
    approach_route: { type: "open_intake", label: "Portal", guidance: "Website" },
    evidence_records: [],
  };

  const ranked = rankInvestors([semiconductorInvestor], profile);
  assert.strictEqual(
    ranked[0].score_breakdown.sector_fit,
    0,
    "Hardware-only semiconductor VC must receive 0 sector points for a circular waste marketplace"
  );
  assert.ok(
    ranked[0].fit_explanation.negative_signals.some(s => s.toLowerCase().includes("incompatible") || s.toLowerCase().includes("restricted")),
    "Negative signals must explicitly explain the domain incompatibility"
  );
  console.log("Passed: Domain incompatibility test. Sector fit points:", ranked[0].score_breakdown.sector_fit);
});
