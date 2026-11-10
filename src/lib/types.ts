import { z } from "zod";

export const VerificationStatusSchema = z.enum([
  "verified_primary",
  "verified_secondary",
  "inferred",
  "unverified",
  "not_found"
]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const SourceTypeSchema = z.enum([
  "company_announcement",
  "investor_news",
  "founder_post",
  "regulatory_filing",
  "accelerator_grant",
  "reputable_news",
  "aggregator_fallback"
]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

export const ApproachRouteTypeSchema = z.enum([
  "official_application",
  "open_intake",
  "warm_intro_possible",
  "public_contact",
  "no_public_route_found"
]);
export type ApproachRouteType = z.infer<typeof ApproachRouteTypeSchema>;

export const InvestorTypeSchema = z.enum([
  "venture_capital",
  "angel_network",
  "accelerator_incubator",
  "corporate_venture",
  "family_office",
  "grant_foundation",
  "unknown"
]);
export type InvestorType = z.infer<typeof InvestorTypeSchema>;

export const ChequeSizeStatusSchema = z.enum([
  "disclosed",
  "observed_from_deals",
  "not_publicly_disclosed"
]);
export type ChequeSizeStatus = z.infer<typeof ChequeSizeStatusSchema>;

export const LeadPartnerStatusSchema = z.enum([
  "verified",
  "not_found"
]);
export type LeadPartnerStatus = z.infer<typeof LeadPartnerStatusSchema>;

export interface StartupInput {
  description: string;
  stage?: string; // idea | pre-seed | seed | Series A | Series B+ | not sure
  country?: string; // US, Europe, UK, India, Global, etc.
  sector?: string;
  businessModel?: string; // B2B, B2C, Marketplace, Infra, Hardware, etc.
  fundingTarget?: string; // e.g. "$1.5M"
  preferredMarkets?: string[];
  lookbackMonths?: number; // 12, 15, 18 (default 18)
}

export interface StartupProfile {
  original_description: string;
  stage: string;
  likely_funding_stage: string;
  geography: string;
  target_markets: string[];
  sector: string;
  sub_sector: string;
  problem_statement: string;
  target_customer: string;
  product_type: string;
  business_model: string;
  keywords: string[];
  synonyms: string[];
  adjacent_categories: string[];
  funding_target: string | null;
  lookback_months: number;
  lookback_start: string; // YYYY-MM-DD
  lookback_end: string;   // YYYY-MM-DD
  confidence_scores: {
    sector_confidence: number;
    stage_confidence: number;
    geography_confidence: number;
  };
}

export interface EvidenceRecord {
  url: string;
  page_title: string;
  publisher: string;
  publication_date?: string;
  retrieval_timestamp: string;
  source_type: SourceType;
  passage: string;
  extracted_claim: string;
  verification_status: VerificationStatus;
}

export interface RoundInvestor {
  name: string;
  role: "lead" | "co_lead" | "participant" | "existing_investor" | "grant_provider" | "accelerator" | "unknown";
  verified: boolean;
}

export interface FundingEvent {
  round_id: string;
  company_name: string;
  round_type: string;
  round_date: string; // YYYY-MM-DD
  amount_usd: number | null;
  currency: string;
  amount_formatted: string;
  is_within_lookback: boolean;
  lead_investors: string[];
  participating_investors: RoundInvestor[];
  primary_source_url: string;
  evidence_records: EvidenceRecord[];
  verification_status: VerificationStatus;
}

export interface ComparableCompany {
  id: string;
  company_name: string;
  company_website: string;
  description: string;
  sector: string;
  sub_sector: string;
  headquarters: string;
  markets_served: string[];
  funding_stage: string;
  similarity_rationale: string;
  similarity_score: number; // 0-100
  funding_events: FundingEvent[];
  primary_sources_count: number;
  overall_status: VerificationStatus;
  notes?: string;
}

export interface ScoreBreakdown {
  sector_fit: number;          // Max 25
  stage_fit: number;           // Max 20
  comparable_portfolio: number;// Max 20
  geography_fit: number;       // Max 10
  cheque_size_fit: number;     // Max 10 (neutral if undisclosed)
  recency_activity: number;    // Max 10
  access_route: number;        // Max 5
}

export interface BackedComparable {
  company_name: string;
  company_website: string;
  round_type: string;
  round_date: string;
  role: string;
  amount_formatted: string;
  evidence_url: string;
  evidence_snippet: string;
  is_lead: boolean;
}

export interface InvestorApproachRoute {
  type: ApproachRouteType;
  label: string;
  url?: string;
  guidance: string;
  evidence_url?: string;
  portfolio_connection?: string;
}

export interface InvestorProfile {
  id: string;
  name: string;
  canonical_domain?: string;
  website?: string;
  investor_type: InvestorType;
  rank: number;
  total_score: number; // 0-100
  score_breakdown: ScoreBreakdown;
  confidence_score: number; // 0-100
  fit_explanation: {
    summary: string;
    positive_signals: string[];
    negative_signals: string[];
    why_this_rank: string;
  };
  backed_comparables: BackedComparable[];
  stage_focus: {
    stages: string[];
    source: "observed_deals" | "official_thesis" | "unknown";
  };
  geography_focus: {
    regions: string[];
    source: "observed_deals" | "official_thesis" | "unknown";
  };
  sector_focus: {
    sectors: string[];
    source: "observed_deals" | "official_thesis" | "unknown";
  };
  cheque_size: {
    min_usd: number | null;
    max_usd: number | null;
    formatted: string;
    status: ChequeSizeStatus;
    evidence?: string;
  };
  lead_partner: {
    name: string | null;
    title: string | null;
    status: LeadPartnerStatus;
    evidence?: string;
    deal_context?: string;
  };
  approach_route: InvestorApproachRoute;
  evidence_records: EvidenceRecord[];
}

export interface RankingMethodology {
  version: string;
  max_score: number;
  weights: {
    sector_fit: number;
    stage_fit: number;
    comparable_portfolio: number;
    geography_fit: number;
    cheque_size_fit: number;
    recency_activity: number;
    access_route: number;
  };
  description: string;
}

export interface SourceCoverage {
  total_sources_consulted: number;
  primary_sources_count: number;
  secondary_sources_count: number;
  failed_sources_count: number;
  retrieval_errors: Array<{ url: string; reason: string }>;
}

export interface ResearchProgressEvent {
  step: "init" | "profile" | "tinyset_discovery" | "verification" | "enrichment" | "ranking" | "complete" | "error";
  progress: number; // 0-100
  message: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface ResearchRun {
  schema_version: "1.0.0";
  request_id: string;
  generated_at: string;
  lookback_start: string;
  lookback_end: string;
  status: "idle" | "running" | "completed" | "failed";
  startup_profile: StartupProfile;
  comparable_companies: ComparableCompany[];
  funding_events: FundingEvent[];
  investors: InvestorProfile[];
  ranking_methodology: RankingMethodology;
  research_warnings: string[];
  source_coverage: SourceCoverage;
  progress_log: ResearchProgressEvent[];
}
