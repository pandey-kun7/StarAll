import { ResearchRun } from "./types";

/**
 * Escapes a CSV cell value according to RFC 4180
 */
function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Generates an audit-ready CSV export from a research run
 * Row model: One row per Investor - Backed Comparable Company relationship
 * Preserves evidence URLs, claim statuses, and score breakdowns
 */
export function generateResearchCsv(run: ResearchRun): string {
  const headers = [
    "Investor Rank",
    "Investor Name",
    "Total Fit Score (0-100)",
    "Confidence Score",
    "Sector Fit (Max 25)",
    "Stage Fit (Max 20)",
    "Portfolio Score (Max 20)",
    "Geography Fit (Max 10)",
    "Cheque Size Fit (Max 10)",
    "Recency Score (Max 10)",
    "Access Route Score (Max 5)",
    "Comparable Company Backed",
    "Company Website",
    "Funding Round",
    "Round Date",
    "Investor Role",
    "Disclosed Round Size",
    "Verified Primary Evidence URL",
    "Evidence Snippet",
    "Cheque Size Status",
    "Cheque Size Range",
    "Verified Lead Partner",
    "Partner Status",
    "Approach Route Type",
    "Approach Label",
    "Approach URL / Portal",
    "Warm Intro Connection Guidance",
    "Investor Website",
  ];

  const rows: string[] = [headers.join(",")];

  for (const inv of run.investors) {
    if (inv.backed_comparables.length === 0) {
      // Row with no specific comparable
      rows.push([
        escapeCsv(inv.rank),
        escapeCsv(inv.name),
        escapeCsv(inv.total_score),
        escapeCsv(inv.confidence_score),
        escapeCsv(inv.score_breakdown.sector_fit),
        escapeCsv(inv.score_breakdown.stage_fit),
        escapeCsv(inv.score_breakdown.comparable_portfolio),
        escapeCsv(inv.score_breakdown.geography_fit),
        escapeCsv(inv.score_breakdown.cheque_size_fit),
        escapeCsv(inv.score_breakdown.recency_activity),
        escapeCsv(inv.score_breakdown.access_route),
        escapeCsv("None in this batch"),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(inv.evidence_records[0]?.url || ""),
        escapeCsv(inv.evidence_records[0]?.passage || ""),
        escapeCsv(inv.cheque_size.status),
        escapeCsv(inv.cheque_size.formatted),
        escapeCsv(inv.lead_partner.name || "Not publicly verified"),
        escapeCsv(inv.lead_partner.status),
        escapeCsv(inv.approach_route.type),
        escapeCsv(inv.approach_route.label),
        escapeCsv(inv.approach_route.url || ""),
        escapeCsv(inv.approach_route.guidance),
        escapeCsv(inv.website || ""),
      ].join(","));
    } else {
      for (const comp of inv.backed_comparables) {
        rows.push([
          escapeCsv(inv.rank),
          escapeCsv(inv.name),
          escapeCsv(inv.total_score),
          escapeCsv(inv.confidence_score),
          escapeCsv(inv.score_breakdown.sector_fit),
          escapeCsv(inv.score_breakdown.stage_fit),
          escapeCsv(inv.score_breakdown.comparable_portfolio),
          escapeCsv(inv.score_breakdown.geography_fit),
          escapeCsv(inv.score_breakdown.cheque_size_fit),
          escapeCsv(inv.score_breakdown.recency_activity),
          escapeCsv(inv.score_breakdown.access_route),
          escapeCsv(comp.company_name),
          escapeCsv(comp.company_website),
          escapeCsv(comp.round_type),
          escapeCsv(comp.round_date),
          escapeCsv(comp.role),
          escapeCsv(comp.amount_formatted),
          escapeCsv(comp.evidence_url),
          escapeCsv(comp.evidence_snippet),
          escapeCsv(inv.cheque_size.status),
          escapeCsv(inv.cheque_size.formatted),
          escapeCsv(inv.lead_partner.name || "Not publicly verified"),
          escapeCsv(inv.lead_partner.status),
          escapeCsv(inv.approach_route.type),
          escapeCsv(inv.approach_route.label),
          escapeCsv(inv.approach_route.url || ""),
          escapeCsv(inv.approach_route.guidance),
          escapeCsv(inv.website || ""),
        ].join(","));
      }
    }
  }

  return rows.join("\r\n");
}
