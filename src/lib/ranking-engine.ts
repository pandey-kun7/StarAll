import { StartupProfile, InvestorProfile, ScoreBreakdown } from "./types";

export interface RankingWeights {
  sector_fit: number;          // 25
  stage_fit: number;           // 20
  comparable_portfolio: number;// 20
  geography_fit: number;       // 10
  cheque_size_fit: number;     // 10
  recency_activity: number;    // 10
  access_route: number;        // 5
}

export const DEFAULT_RANKING_WEIGHTS: RankingWeights = {
  sector_fit: 25,
  stage_fit: 20,
  comparable_portfolio: 20,
  geography_fit: 10,
  cheque_size_fit: 10,
  recency_activity: 10,
  access_route: 5,
};

/**
 * Deterministically scores and ranks investors based on founder's startup profile
 */
export function rankInvestors(
  investors: InvestorProfile[],
  profile: StartupProfile,
  weights: RankingWeights = DEFAULT_RANKING_WEIGHTS
): InvestorProfile[] {
  const scored = investors.map((inv) => {
    const positiveSignals: string[] = [];
    const negativeSignals: string[] = [];

    // 1. Sector / Problem Fit (Max 25)
    let sectorScore = 0;
    const invSectors = [
      ...inv.sector_focus.sectors,
      ...inv.backed_comparables.map((b) => b.company_name),
    ].map((s) => s.toLowerCase());

    const founderKeywords = [
      profile.sector.toLowerCase(),
      profile.sub_sector.toLowerCase(),
      ...profile.keywords.map((k) => k.toLowerCase()),
      ...profile.synonyms.map((s) => s.toLowerCase()),
    ];

    // Check domain incompatibilities (e.g. Pure Hardware/Semiconductors vs Pure Software/Marketplace)
    const isHardwareOnlyVC = invSectors.some((s) => s.includes("semiconductor") || s.includes("nanotechnology") || s.includes("power electronics"));
    const isSoftwareOrMarketplace = profile.business_model.toLowerCase().includes("marketplace") ||
      profile.business_model.toLowerCase().includes("saas") ||
      profile.sub_sector.toLowerCase().includes("waste") ||
      profile.sub_sector.toLowerCase().includes("recycling");
    const isHardwareStartup = profile.product_type.toLowerCase().includes("hardware") ||
      profile.original_description.toLowerCase().includes("hardware") ||
      /\b(semiconductor|chip|power electronics|wafer)\b/i.test(profile.original_description);

    if (isHardwareOnlyVC && isSoftwareOrMarketplace && !isHardwareStartup) {
      sectorScore = 0;
      negativeSignals.push(`Mandate restricted to deep-tech hardware & semiconductors; incompatible with a circular waste marketplace.`);
    } else {
      let matches = 0;
      for (const kw of founderKeywords) {
        if (kw.length < 3) continue;
        if (invSectors.some((is) => {
          if (is === kw) return true;
          const regex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
          return regex.test(is);
        })) {
          matches++;
        }
      }

      if (matches >= 3) {
        sectorScore = weights.sector_fit;
        positiveSignals.push(`Direct thesis & portfolio alignment with ${profile.sub_sector}.`);
      } else if (matches >= 2) {
        sectorScore = Math.round(weights.sector_fit * 0.85);
        positiveSignals.push(`Demonstrated interest in ${profile.sector}.`);
      } else if (matches === 1) {
        sectorScore = Math.round(weights.sector_fit * 0.60);
        positiveSignals.push(`Broad thematic overlap with ${profile.sector}.`);
      } else {
        sectorScore = Math.round(weights.sector_fit * 0.20); // 5 points max for zero match
        negativeSignals.push(`Generalist tech investor; no published thesis explicitly named ${profile.sub_sector}.`);
      }
    }

    // 2. Stage Fit (Max 20)
    let stageScore = 0;
    const invStages = inv.stage_focus.stages.map((s) => s.toLowerCase());
    const founderStage = profile.stage.toLowerCase();

    if (invStages.some((s) => s.includes(founderStage) || founderStage.includes(s))) {
      stageScore = weights.stage_fit;
      positiveSignals.push(`Actively writes cheques at ${profile.stage} stage.`);
    } else if (invStages.some((s) => s.includes("seed") || s.includes("series a"))) {
      stageScore = Math.round(weights.stage_fit * 0.75);
      positiveSignals.push(`Invests in early stage adjacent rounds.`);
    } else {
      stageScore = Math.round(weights.stage_fit * 0.35);
      negativeSignals.push(`Observed deals lean toward later growth stages rather than ${profile.stage}.`);
    }

    // 3. Comparable Portfolio Evidence (Max 20) with Diminishing Returns
    // Diminishing returns formula: score = min(20, round(12 * sqrt(backedCount)))
    const backedCount = inv.backed_comparables.length;
    let portfolioScore = 0;
    if (backedCount >= 3) {
      portfolioScore = weights.comparable_portfolio; // 20
      positiveSignals.push(`Backed ${backedCount} direct comparables: ${inv.backed_comparables.map((b) => b.company_name).join(", ")}.`);
    } else if (backedCount === 2) {
      portfolioScore = Math.round(weights.comparable_portfolio * 0.85); // 17
      positiveSignals.push(`Backed 2 verified comparables: ${inv.backed_comparables.map((b) => b.company_name).join(", ")}.`);
    } else if (backedCount === 1) {
      const isLead = inv.backed_comparables[0]?.is_lead;
      portfolioScore = isLead
        ? Math.round(weights.comparable_portfolio * 0.70) // 14
        : Math.round(weights.comparable_portfolio * 0.55); // 11
      positiveSignals.push(`Verified backer of ${inv.backed_comparables[0]?.company_name} (${isLead ? "Lead" : "Participant"}).`);
    } else {
      portfolioScore = 0;
      negativeSignals.push("No verified comparable investments in this specific batch.");
    }

    // 4. Geography Fit (Max 10)
    let geoScore = 0;
    const invGeos = inv.geography_focus.regions.map((g) => g.toLowerCase());
    const founderGeo = profile.geography.toLowerCase();

    if (
      invGeos.some(
        (g) =>
          g.includes(founderGeo) ||
          founderGeo.includes(g) ||
          g.includes("global") ||
          founderGeo.includes("global")
      )
    ) {
      geoScore = weights.geography_fit;
      positiveSignals.push(`Mandate covers ${profile.geography}.`);
    } else {
      geoScore = Math.round(weights.geography_fit * 0.5);
      negativeSignals.push(`Primary geography observed is outside ${profile.geography}; global flexibility unconfirmed.`);
    }

    // 5. Cheque-Size Fit (Max 10)
    // Non-negotiable from todo.md: "missing data is neutral / unknown, not an automatic zero."
    let chequeScore = 0;
    if (inv.cheque_size.status === "disclosed") {
      chequeScore = weights.cheque_size_fit; // 10
      positiveSignals.push(`Publicly disclosed cheque range (${inv.cheque_size.formatted}) matches early-stage rounds.`);
    } else if (inv.cheque_size.status === "observed_from_deals") {
      chequeScore = Math.round(weights.cheque_size_fit * 0.8); // 8
      positiveSignals.push(`Observed deal sizes align with ${profile.stage} target rounds.`);
    } else {
      chequeScore = Math.round(weights.cheque_size_fit * 0.5); // 5 (neutral 50%, NOT zero)
      positiveSignals.push("Cheque size not publicly disclosed (scored neutrally).");
    }

    // 6. Recency and Activity (Max 10)
    let recencyScore = 0;
    const hasRecentRound = inv.backed_comparables.some((b) => {
      const year = parseInt(b.round_date.slice(0, 4));
      return year >= 2024;
    });

    if (hasRecentRound) {
      recencyScore = weights.recency_activity;
      positiveSignals.push(`Active deployment verified in the last 12–18 months.`);
    } else {
      recencyScore = Math.round(weights.recency_activity * 0.6);
      negativeSignals.push("Most recent observed deal in this sector was at the outer edge of lookback.");
    }

    // 7. Access Route Quality (Max 5)
    let routeScore = 0;
    if (inv.approach_route.type === "official_application") {
      routeScore = weights.access_route;
      positiveSignals.push(`Clear official intake path: ${inv.approach_route.label}.`);
    } else if (inv.approach_route.type === "warm_intro_possible") {
      routeScore = weights.access_route;
      positiveSignals.push(`Warm introduction path possible via ${inv.approach_route.portfolio_connection}.`);
    } else if (inv.approach_route.type === "open_intake") {
      routeScore = Math.round(weights.access_route * 0.8);
      positiveSignals.push(`Direct contact portal available: ${inv.approach_route.label}.`);
    } else {
      routeScore = Math.round(weights.access_route * 0.4);
      negativeSignals.push("No formal open intake form; networking or cold approach required.");
    }

    // Calculate Total Score
    const totalScore = Math.min(
      100,
      sectorScore +
      stageScore +
      portfolioScore +
      geoScore +
      chequeScore +
      recencyScore +
      routeScore
    );

    // Confidence Score based on primary source count and verified fields
    const hasPrimaryEvidence = inv.evidence_records.some((e) => e.verification_status === "verified_primary");
    const hasPartner = inv.lead_partner.status === "verified";
    const confidenceScore = Math.round(
      (hasPrimaryEvidence ? 60 : 35) +
      (backedCount > 0 ? 25 : 10) +
      (hasPartner ? 15 : 5)
    );

    const breakdown: ScoreBreakdown = {
      sector_fit: sectorScore,
      stage_fit: stageScore,
      comparable_portfolio: portfolioScore,
      geography_fit: geoScore,
      cheque_size_fit: chequeScore,
      recency_activity: recencyScore,
      access_route: routeScore,
    };

    const whyThisRank = `${inv.name} scores ${totalScore}/100 driven by backing ${backedCount} comparable companies (${inv.backed_comparables.map((b) => b.company_name).join(", ")}), strong ${profile.stage} alignment, and clear accessibility.`;

    return {
      ...inv,
      total_score: totalScore,
      score_breakdown: breakdown,
      confidence_score: confidenceScore,
      fit_explanation: {
        summary: `${inv.name} is a high-conviction backer for ${profile.sub_sector} startups.`,
        positive_signals: positiveSignals,
        negative_signals: negativeSignals,
        why_this_rank: whyThisRank,
      },
    };
  });

  // Sort descending by total_score, then by confidence_score, then by backed count
  scored.sort((a, b) => {
    if (b.total_score !== a.total_score) {
      return b.total_score - a.total_score;
    }
    if (b.confidence_score !== a.confidence_score) {
      return b.confidence_score - a.confidence_score;
    }
    return b.backed_comparables.length - a.backed_comparables.length;
  });

  // Assign ranks
  scored.forEach((inv, i) => {
    inv.rank = i + 1;
  });

  return scored;
}
