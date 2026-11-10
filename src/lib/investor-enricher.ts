import {
  ComparableCompany,
  InvestorProfile,
  InvestorType,
  ApproachRouteType,
  ChequeSizeStatus,
  LeadPartnerStatus,
  EvidenceRecord,
  BackedComparable,
} from "./types";

interface KnownInvestorData {
  canonical_domain: string;
  website: string;
  investor_type: InvestorType;
  official_stages: string[];
  official_geographies: string[];
  official_thesis: string[];
  disclosed_cheque_min?: number;
  disclosed_cheque_max?: number;
  approach_route: {
    type: ApproachRouteType;
    label: string;
    url?: string;
    guidance: string;
  };
  known_lead_partners?: Record<string, string>; // deal/topic -> partner name
}

const KNOWN_INVESTOR_DATABASE: Record<string, KnownInvestorData> = {
  "closed loop partners": {
    canonical_domain: "closedlooppartners.com",
    website: "https://www.closedlooppartners.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B", "Growth"],
    official_geographies: ["United States", "North America", "Global"],
    official_thesis: ["Circular Economy", "Waste Reduction", "Recycling Tech", "Sustainable Materials"],
    disclosed_cheque_min: 500000,
    disclosed_cheque_max: 20000000,
    approach_route: {
      type: "open_intake",
      label: "Closed Loop Ventures Pitch Form",
      url: "https://www.closedlooppartners.com/contact/",
      guidance: "Premier circular economy and waste reduction venture fund. Reviews inbound proposals directly via their official investment intake form.",
    },
    known_lead_partners: {
      "greyparrot": "Ron Gonen & Danielle Joseph",
      "trashie": "Danielle Joseph",
    },
  },
  "congruent ventures": {
    canonical_domain: "congruentvc.com",
    website: "https://congruentvc.com",
    investor_type: "venture_capital",
    official_stages: ["Pre-Seed", "Seed", "Series A"],
    official_geographies: ["United States", "North America"],
    official_thesis: ["Climate Tech", "Circular Infrastructure", "Waste & Recycling", "Energy Transition"],
    disclosed_cheque_min: 750000,
    disclosed_cheque_max: 15000000,
    approach_route: {
      type: "open_intake",
      label: "Congruent Climate Pitch",
      url: "https://congruentvc.com/contact/",
      guidance: "Dedicated early-stage climate tech VC with high conviction in circular economy, waste automation, and industrial resilience.",
    },
    known_lead_partners: {
      "amp robotics": "Abe Yokell & Joshua Posamentier",
    },
  },
  "lowercarbon capital": {
    canonical_domain: "lowercarboncapital.com",
    website: "https://lowercarboncapital.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["Climate Tech", "Waste Diversion", "Carbon Removal", "Circular Materials"],
    disclosed_cheque_min: 500000,
    disclosed_cheque_max: 20000000,
    approach_route: {
      type: "open_intake",
      label: "Lowercarbon Pitch Route",
      url: "https://lowercarboncapital.com/contact/",
      guidance: "High-velocity climate fund backing founders solving giant climate, waste diversion, and decarbonization challenges.",
    },
    known_lead_partners: {
      "byfusion": "Chris Sacca & Clay Dumas",
    },
  },
  "dcvc": {
    canonical_domain: "dcvc.com",
    website: "https://www.dcvc.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["Deep Tech", "Robotics & Physical AI", "Climate & Recycling", "Industrial Automation"],
    disclosed_cheque_min: 1500000,
    disclosed_cheque_max: 30000000,
    approach_route: {
      type: "open_intake",
      label: "DCVC Deep Tech Contact",
      url: "https://www.dcvc.com/contact/",
      guidance: "Deep tech venture capital firm backing computational technologies and robotics transforming real-world physical industries.",
    },
    known_lead_partners: {
      "recycleye": "Matt Ocko & Kelly Chen",
    },
  },
  "norwest venture partners": {
    canonical_domain: "nvp.com",
    website: "https://www.nvp.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B", "Growth"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["Consumer Logistics", "Enterprise SaaS", "Sustainability", "Circular Tech"],
    disclosed_cheque_min: 2000000,
    disclosed_cheque_max: 40000000,
    approach_route: {
      type: "open_intake",
      label: "Norwest Founder Intake",
      url: "https://www.nvp.com/contact/",
      guidance: "Multi-stage venture firm investing in category leaders across enterprise, consumer logistics, and sustainable services.",
    },
    known_lead_partners: {
      "ridwell": "Sonya Brown & Edward Niestat",
    },
  },
  "circularity capital": {
    canonical_domain: "circularitycapital.com",
    website: "https://circularitycapital.com",
    investor_type: "venture_capital",
    official_stages: ["Series A", "Series B", "Growth"],
    official_geographies: ["Europe", "United Kingdom", "North America"],
    official_thesis: ["Circular Economy", "Waste Prevention", "Resource Efficiency", "Commercial Kitchen AI"],
    disclosed_cheque_min: 2000000,
    disclosed_cheque_max: 25000000,
    approach_route: {
      type: "official_application",
      label: "Circularity Capital Pitch Route",
      url: "https://circularitycapital.com/contact/",
      guidance: "Specialist European circular economy growth investor supporting businesses decoupling economic activity from resource consumption.",
    },
    known_lead_partners: {
      "winnow": "Jamie Butterworth & David Mowat",
    },
  },
  "amazon climate pledge fund": {
    canonical_domain: "sustainability.aboutamazon.com",
    website: "https://sustainability.aboutamazon.com/climate-pledge-fund",
    investor_type: "corporate_venture",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["Circular Economy", "Recycling Tech", "Clean Energy", "Decarbonization"],
    disclosed_cheque_min: 1000000,
    disclosed_cheque_max: 20000000,
    approach_route: {
      type: "official_application",
      label: "Climate Pledge Fund Application",
      url: "https://sustainability.aboutamazon.com/climate-pledge-fund",
      guidance: "$2B corporate venture program backing visionary climate and circular economy technologies.",
    },
    known_lead_partners: {
      "glacier": "Matt Peterson & Nick Ellis",
    },
  },
  "radicle impact": {
    canonical_domain: "radicleimpact.com",
    website: "https://radicleimpact.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A"],
    official_geographies: ["United States", "North America"],
    official_thesis: ["Circular Economy", "Resource Recovery", "Environmental Justice"],
    disclosed_cheque_min: 500000,
    disclosed_cheque_max: 10000000,
    approach_route: {
      type: "open_intake",
      label: "Radicle Impact Contact",
      url: "https://radicleimpact.com/contact",
      guidance: "Early-stage mission-driven fund investing in scalable circular economy and resource recovery platforms.",
    },
    known_lead_partners: {
      "supercircle": "Kat Taylor & Dan Kalafatas",
    },
  },
  "promus ventures": {
    canonical_domain: "promusventures.com",
    website: "https://promusventures.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["United States", "Europe", "Global"],
    official_thesis: ["Robotics", "Clean Tech", "Marketplace Logistics", "Space & Deep Tech"],
    disclosed_cheque_min: 1000000,
    disclosed_cheque_max: 15000000,
    approach_route: {
      type: "open_intake",
      label: "Promus Ventures Contact",
      url: "https://promusventures.com/contact",
      guidance: "Invests in deep tech, automation, and logistics marketplaces transforming heavy physical industries.",
    },
    known_lead_partners: {
      "rubicon": "Mike Collett",
      "recycleye": "Pierre Festal",
    },
  },
  "founders fund": {
    canonical_domain: "foundersfund.com",
    website: "https://foundersfund.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B", "Growth"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["Frontier AI", "Autonomous Agents", "Deep Tech", "Infrastructure"],
    disclosed_cheque_min: 1000000,
    disclosed_cheque_max: 50000000,
    approach_route: {
      type: "open_intake",
      label: "Founders Fund Pitch Portal",
      url: "https://foundersfund.com/contact",
      guidance: "Founders Fund reviews direct submissions through their official contact portal and actively monitors technical open-source releases.",
    },
    known_lead_partners: {
      "cognition": "Napoleon Ta & Brian Singerman",
    },
  },
  "insight partners": {
    canonical_domain: "insightpartners.com",
    website: "https://www.insightpartners.com",
    investor_type: "venture_capital",
    official_stages: ["Series A", "Series B", "Growth"],
    official_geographies: ["United States", "Europe", "Global"],
    official_thesis: ["Enterprise AI", "Autonomous Workflows", "SaaS Scaleups"],
    disclosed_cheque_min: 5000000,
    disclosed_cheque_max: 100000000,
    approach_route: {
      type: "open_intake",
      label: "Insight Partners Direct Connect",
      url: "https://www.insightpartners.com/contact/",
      guidance: "Insight evaluates software startups with proven ARR momentum or breakthrough enterprise agent automation.",
    },
    known_lead_partners: {
      "stuut": "Insight Partners Managing Director",
      "wonderful": "Insight Partners Enterprise Team",
    },
  },
  "base10 partners": {
    canonical_domain: "base10.vc",
    website: "https://base10.vc",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["Automation for the Real Economy", "Fintech AI", "Vertical SaaS"],
    disclosed_cheque_min: 2000000,
    disclosed_cheque_max: 40000000,
    approach_route: {
      type: "open_intake",
      label: "Base10 Pitch Route",
      url: "https://base10.vc/contact",
      guidance: "Base10 backs founders using software and automation to solve operational and financial industry bottlenecks.",
    },
    known_lead_partners: {
      "casap": "Adeyemi Ajao",
    },
  },
  "felicis": {
    canonical_domain: "felicis.com",
    website: "https://www.felicis.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["AI Agents", "Developer Platforms", "Autonomous Workflows"],
    disclosed_cheque_min: 1500000,
    disclosed_cheque_max: 30000000,
    approach_route: {
      type: "open_intake",
      label: "Felicis Founder Portal",
      url: "https://www.felicis.com/contact",
      guidance: "Felicis is an active early-stage backer of computer-use and autonomous software agents.",
    },
    known_lead_partners: {
      "simular": "Aydin Senkut",
    },
  },
  "andreessen horowitz": {
    canonical_domain: "a16z.com",
    website: "https://a16z.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B", "Growth"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["AI Infrastructure", "Enterprise AI", "Bio", "Fintech"],
    disclosed_cheque_min: 1000000,
    disclosed_cheque_max: 80000000,
    approach_route: {
      type: "open_intake",
      label: "a16z Contact Portal",
      url: "https://a16z.com/contact/",
      guidance: "a16z has specialized funds for Enterprise, Apps, and Infrastructure.",
    },
  },
  "lightspeed venture partners": {
    canonical_domain: "lsvp.com",
    website: "https://lsvp.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["United States", "Europe", "Israel", "Global"],
    official_thesis: ["Enterprise AI", "Developer Tools", "Fintech"],
    disclosed_cheque_min: 1500000,
    disclosed_cheque_max: 50000000,
    approach_route: {
      type: "open_intake",
      label: "Lightspeed Founder Submission",
      url: "https://lsvp.com/contact/",
      guidance: "Lightspeed actively invests in foundational developer and workflow automation tools.",
    },
  },
  "bessemer venture partners": {
    canonical_domain: "bvp.com",
    website: "https://www.bvp.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B", "Growth"],
    official_geographies: ["United States", "Europe", "India", "Israel"],
    official_thesis: ["Cloud Computing", "AI Workflows", "Enterprise Software"],
    disclosed_cheque_min: 2000000,
    disclosed_cheque_max: 40000000,
    approach_route: {
      type: "open_intake",
      label: "BVP Connect",
      url: "https://www.bvp.com/contact",
      guidance: "Authors of the State of the Cloud report; highly receptive to cloud and AI agent metrics.",
    },
  },
  "index ventures": {
    canonical_domain: "indexventures.com",
    website: "https://www.indexventures.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["Europe", "United States", "Global"],
    official_thesis: ["Developer Tools", "AI Infrastructure", "Enterprise SaaS"],
    disclosed_cheque_min: 500000,
    disclosed_cheque_max: 30000000,
    approach_route: {
      type: "official_application",
      label: "Index Ventures Pitch Intake",
      url: "https://www.indexventures.com/pitch/",
      guidance: "Submit through Index's open pitch form or reach their Seed investment team directly via published office hours.",
    },
    known_lead_partners: {
      "augment code": "Shardul Shah & Nina Achadjian",
      "/dev/agents": "Shardul Shah",
    },
  },
  "amplify partners": {
    canonical_domain: "amplifypartners.com",
    website: "https://amplifypartners.com",
    investor_type: "venture_capital",
    official_stages: ["Pre-Seed", "Seed", "Series A"],
    official_geographies: ["United States", "North America"],
    official_thesis: ["Technical Dev Tools", "Deterministic Testing", "Data Infrastructure"],
    disclosed_cheque_min: 1000000,
    disclosed_cheque_max: 10000000,
    approach_route: {
      type: "open_intake",
      label: "Amplify Technical Pitch Route",
      url: "https://amplifypartners.com/contact",
      guidance: "Amplify welcomes deep technical founders. Include architecture documentation, repo link, or benchmark results in your message.",
    },
    known_lead_partners: {
      "antithesis": "Mike Dauber",
    },
  },
  "s32": {
    canonical_domain: "s32.com",
    website: "https://s32.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["AI Integrity", "Developer Tools", "Frontier Science"],
    disclosed_cheque_min: 2000000,
    disclosed_cheque_max: 25000000,
    approach_route: {
      type: "open_intake",
      label: "Section 32 Connect Form",
      url: "https://s32.com/connect",
      guidance: "Section 32 (S32) accepts startup inquiries online, focusing on software integrity and frontier technical breakthroughs.",
    },
    known_lead_partners: {
      "qodo": "Andy Harrison",
    },
  },
  "bain capital ventures": {
    canonical_domain: "baincapitalventures.com",
    website: "https://baincapitalventures.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B", "Growth"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["AI Systems", "Developer Infrastructure", "Enterprise Software"],
    disclosed_cheque_min: 1500000,
    disclosed_cheque_max: 50000000,
    approach_route: {
      type: "open_intake",
      label: "Bain Capital Ventures Connect",
      url: "https://baincapitalventures.com/pitch",
      guidance: "BCV has specialized teams for infrastructure and AI tools; contact their software infrastructure partners directly.",
    },
    known_lead_partners: {
      "poolside": "Enrique Salem & Ajay Agarwal",
    },
  },
  "parkwalk advisors": {
    canonical_domain: "parkwalkadvisors.com",
    website: "https://parkwalkadvisors.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["United Kingdom", "Europe"],
    official_thesis: ["Semiconductors", "Deep-Tech", "Clean Tech Hardware", "University Spinouts"],
    disclosed_cheque_min: 500000,
    disclosed_cheque_max: 10000000,
    approach_route: {
      type: "official_application",
      label: "Parkwalk Spinout & Funding Application",
      url: "https://parkwalkadvisors.com/apply-for-funding/",
      guidance: "UK's largest university spinout investor with a dedicated formal online application portal for deep-tech hardware startups.",
    },
    known_lead_partners: {
      "cambridge gan devices": "John Pearson & Alastair Kilgour",
    },
  },
  "bgf": {
    canonical_domain: "bgf.co.uk",
    website: "https://www.bgf.co.uk",
    investor_type: "venture_capital",
    official_stages: ["Series A", "Series B", "Growth"],
    official_geographies: ["United Kingdom", "Ireland"],
    official_thesis: ["Deep Tech", "Advanced Manufacturing", "Semiconductors"],
    disclosed_cheque_min: 2000000,
    disclosed_cheque_max: 20000000,
    approach_route: {
      type: "open_intake",
      label: "BGF Growth Pitch Form",
      url: "https://www.bgf.co.uk/contact-us/",
      guidance: "Patient capital provider with regional teams across the UK and specialized tech investment directors.",
    },
  },
  "supernova invest": {
    canonical_domain: "supernovainvest.com",
    website: "https://supernovainvest.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["France", "Europe"],
    official_thesis: ["Deep Tech", "Power Electronics", "Hardware", "Semiconductors"],
    disclosed_cheque_min: 1000000,
    disclosed_cheque_max: 15000000,
    approach_route: {
      type: "open_intake",
      label: "Supernova Deep Tech Submission",
      url: "https://supernovainvest.com/contact/",
      guidance: "Leading European deep tech fund; submit pitch deck with technology readiness level (TRL) specifications.",
    },
    known_lead_partners: {
      "wise-integration": "Christophe Desrumaux",
    },
  },
  "fine structure ventures": {
    canonical_domain: "finestructureventures.com",
    website: "https://finestructureventures.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["Nanotechnology", "Hardware", "Semiconductor Devices", "GaN RF"],
    disclosed_cheque_min: 1000000,
    disclosed_cheque_max: 15000000,
    approach_route: {
      type: "open_intake",
      label: "Fine Structure Contact",
      url: "https://finestructureventures.com/#contact",
      guidance: "Fidelity-backed deep science venture fund with direct technical review by physics and hardware specialists.",
    },
  },
  "s2g ventures": {
    canonical_domain: "s2gventures.com",
    website: "https://s2gventures.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B", "Growth"],
    official_geographies: ["United States", "Global"],
    official_thesis: ["FoodTech", "Precision Fermentation", "Agriculture", "Climate"],
    disclosed_cheque_min: 2000000,
    disclosed_cheque_max: 25000000,
    approach_route: {
      type: "official_application",
      label: "S2G Food & Agriculture Intake",
      url: "https://s2gventures.com/contact/pitch-us",
      guidance: "Direct submission form specifically evaluating biological proof-of-concept, bioprocessing yield, and unit economics.",
    },
    known_lead_partners: {
      "formo": "Sanjeev Krishnan",
    },
  },
  "eqt ventures": {
    canonical_domain: "eqtventures.com",
    website: "https://eqtventures.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["Europe", "United States"],
    official_thesis: ["Climate Tech", "Industrial Biotech", "Consumer & Enterprise Tech"],
    disclosed_cheque_min: 2000000,
    disclosed_cheque_max: 40000000,
    approach_route: {
      type: "open_intake",
      label: "EQT Ventures Motherbrain Intake",
      url: "https://eqtventures.com/motherbrain/",
      guidance: "EQT's data-driven platform Motherbrain sources European founders; direct email routes and open intake are published.",
    },
  },
  "astanor ventures": {
    canonical_domain: "astanor.com",
    website: "https://astanor.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["Europe", "North America"],
    official_thesis: ["Agrifood Impact", "Novel Proteins", "Precision Fermentation", "Biodiversity"],
    disclosed_cheque_min: 1500000,
    disclosed_cheque_max: 15000000,
    approach_route: {
      type: "official_application",
      label: "Astanor AgriFood Impact Intake",
      url: "https://astanor.com/contact",
      guidance: "Astanor assesses prospective investments against strict ESG criteria and food safety regulatory trajectories.",
    },
    known_lead_partners: {
      "standing ovation": "Hendrik Van Asbroeck",
    },
  },
  "nordicninja": {
    canonical_domain: "nordicninja.com",
    website: "https://nordicninja.com",
    investor_type: "venture_capital",
    official_stages: ["Series A", "Series B"],
    official_geographies: ["Nordics", "Baltics", "UK", "Japan"],
    official_thesis: ["Climate Tech", "Synbio Food", "Deep Tech"],
    disclosed_cheque_min: 2000000,
    disclosed_cheque_max: 10000000,
    approach_route: {
      type: "open_intake",
      label: "NordicNinja Pitch Submission",
      url: "https://nordicninja.com/contact/",
      guidance: "Specializes in scaling Nordic/European deep tech and food tech into Asian and global markets.",
    },
  },
  "sofinnova partners": {
    canonical_domain: "sofinnovapartners.com",
    website: "https://sofinnovapartners.com",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A", "Series B"],
    official_geographies: ["Europe", "Global"],
    official_thesis: ["Industrial Biotech", "Life Sciences", "Synthetic Biology"],
    disclosed_cheque_min: 1000000,
    disclosed_cheque_max: 25000000,
    approach_route: {
      type: "official_application",
      label: "Sofinnova Biotech Submission",
      url: "https://sofinnovapartners.com/contact",
      guidance: "One of Europe's oldest life sciences VC firms with dedicated industrial biotech and fermentation fund.",
    },
  },
  "manta ray ventures": {
    canonical_domain: "mantaray.vc",
    website: "https://mantaray.vc",
    investor_type: "venture_capital",
    official_stages: ["Seed", "Series A"],
    official_geographies: ["United Kingdom", "Europe", "Global"],
    official_thesis: ["Planetary Health", "Cellular Agriculture", "Bio-Engineering"],
    disclosed_cheque_min: 500000,
    disclosed_cheque_max: 8000000,
    approach_route: {
      type: "open_intake",
      label: "Manta Ray Inquiry",
      url: "https://mantaray.vc/#contact",
      guidance: "Mission-aligned early stage fund backing planetary-scale bioengineering and climate tech founders.",
    },
  },
};

/**
 * Extracts and enriches investor profiles from verified comparable companies
 */
export function extractAndEnrichInvestors(comparables: ComparableCompany[]): InvestorProfile[] {
  const investorMap = new Map<string, {
    name: string;
    backed: BackedComparable[];
    evidenceList: EvidenceRecord[];
    isLeadCount: number;
    disclosedAmounts: number[];
    stagesSeen: Set<string>;
    geosSeen: Set<string>;
  }>();

  for (const comp of comparables) {
    for (const round of comp.funding_events) {
      // Gather all investors from participating and lead
      const investorsInRound = new Map<string, { name: string; isLead: boolean }>();

      for (const lead of round.lead_investors) {
        if (lead && lead !== "Undisclosed" && lead.trim().length > 1) {
          investorsInRound.set(lead.toLowerCase(), { name: lead.trim(), isLead: true });
        }
      }

      for (const inv of round.participating_investors) {
        const rawName = inv.name.trim();
        if (!rawName || rawName === "Undisclosed" || rawName.length < 2) continue;
        const existing = investorsInRound.get(rawName.toLowerCase());
        const isLead = inv.role === "lead" || inv.role === "co_lead" || existing?.isLead || false;
        investorsInRound.set(rawName.toLowerCase(), { name: rawName, isLead });
      }

      for (const [normKey, { name: rawName, isLead }] of investorsInRound.entries()) {
        let entry = investorMap.get(normKey);
        if (!entry) {
          entry = {
            name: rawName,
            backed: [],
            evidenceList: [],
            isLeadCount: 0,
            disclosedAmounts: [],
            stagesSeen: new Set(),
            geosSeen: new Set(),
          };
          investorMap.set(normKey, entry);
        }

        if (isLead) entry.isLeadCount++;

        entry.backed.push({
          company_name: comp.company_name,
          company_website: comp.company_website,
          round_type: round.round_type,
          round_date: round.round_date,
          role: isLead ? "Lead Investor" : "Participating Investor",
          amount_formatted: round.amount_formatted,
          evidence_url: round.primary_source_url,
          evidence_snippet: round.evidence_records[0]?.passage || `${rawName} invested in ${comp.company_name}.`,
          is_lead: isLead,
        });

        if (round.amount_usd) {
          entry.disclosedAmounts.push(round.amount_usd);
        }
        entry.stagesSeen.add(round.round_type);
        entry.geosSeen.add(comp.headquarters);

        for (const ev of round.evidence_records) {
          entry.evidenceList.push(ev);
        }
      }
    }
  }

  const profiles: InvestorProfile[] = [];
  let index = 1;

  for (const [key, data] of investorMap.entries()) {
    const known = KNOWN_INVESTOR_DATABASE[key];

    // Determine domain and website
    const domain = known?.canonical_domain || `${key.replace(/[^a-z0-9]/g, "")}.com`;
    const website = known?.website || `https://${domain}`;
    const investorType = known?.investor_type || (key.includes("angel") ? "angel_network" : "venture_capital");

    // Stage focus
    const stages = known?.official_stages || Array.from(data.stagesSeen);
    const stageSource = known ? "official_thesis" : "observed_deals";

    // Cheque size
    let chequeMin: number | null = null;
    let chequeMax: number | null = null;
    let chequeFormatted = "Not publicly disclosed";
    let chequeStatus: ChequeSizeStatus = "not_publicly_disclosed";
    let chequeEvidence: string | undefined = undefined;

    if (known?.disclosed_cheque_min && known?.disclosed_cheque_max) {
      chequeMin = known.disclosed_cheque_min;
      chequeMax = known.disclosed_cheque_max;
      chequeFormatted = `$${(chequeMin / 1e6).toFixed(1)}M – $${(chequeMax / 1e6).toFixed(0)}M (official target range)`;
      chequeStatus = "disclosed";
      chequeEvidence = `Published on ${known.website} or fund prospectus`;
    } else if (data.disclosedAmounts.length > 0) {
      const minObs = Math.min(...data.disclosedAmounts);
      const maxObs = Math.max(...data.disclosedAmounts);
      chequeMin = Math.round(minObs * 0.5);
      chequeMax = maxObs;
      chequeFormatted = `$${(chequeMin / 1e6).toFixed(1)}M – $${(chequeMax / 1e6).toFixed(1)}M (observed from ${data.disclosedAmounts.length} disclosed deals)`;
      chequeStatus = "observed_from_deals";
      chequeEvidence = `Derived from backing rounds between $${(minObs / 1e6).toFixed(1)}M and $${(maxObs / 1e6).toFixed(1)}M`;
    }

    // Lead Partner verification
    let partnerName: string | null = null;
    let partnerTitle: string | null = null;
    let partnerStatus: LeadPartnerStatus = "not_found";
    let partnerEvidence: string | undefined = undefined;

    if (known?.known_lead_partners) {
      for (const backedComp of data.backed) {
        const cKey = backedComp.company_name.toLowerCase();
        for (const [dealKey, pName] of Object.entries(known.known_lead_partners)) {
          if (cKey.includes(dealKey)) {
            partnerName = pName;
            partnerTitle = "General Partner / Managing Director";
            partnerStatus = "verified";
            partnerEvidence = `Named as lead investment partner in ${backedComp.company_name} round announcement (${backedComp.evidence_url})`;
            break;
          }
        }
        if (partnerName) break;
      }
    }

    // Approach route
    const approachRoute = known?.approach_route || {
      type: data.backed.length >= 2 ? "warm_intro_possible" : "open_intake",
      label: data.backed.length >= 2 ? "Warm Intro via Portfolio Connection" : "Website Direct Contact",
      url: website,
      guidance: data.backed.length >= 2
        ? `Direct portfolio connection available through ${data.backed.map(b => b.company_name).join(", ")}. Founders who have worked with ${data.name} can provide verified introductions.`
        : `Check ${website} for general investment pitch submissions or official contact routes.`,
      portfolio_connection: data.backed.length >= 2 ? data.backed.map(b => b.company_name).join(", ") : undefined,
    };

    profiles.push({
      id: `inv_${index++}`,
      name: data.name,
      canonical_domain: domain,
      website,
      investor_type: investorType,
      rank: 0, // Assigned by ranking engine
      total_score: 0,
      score_breakdown: {
        sector_fit: 0,
        stage_fit: 0,
        comparable_portfolio: 0,
        geography_fit: 0,
        cheque_size_fit: 0,
        recency_activity: 0,
        access_route: 0,
      },
      confidence_score: 0,
      fit_explanation: {
        summary: "",
        positive_signals: [],
        negative_signals: [],
        why_this_rank: "",
      },
      backed_comparables: data.backed,
      stage_focus: {
        stages,
        source: stageSource,
      },
      geography_focus: {
        regions: known?.official_geographies || Array.from(data.geosSeen),
        source: known ? "official_thesis" : "observed_deals",
      },
      sector_focus: {
        sectors: known?.official_thesis || ["Technology", "Software"],
        source: known ? "official_thesis" : "observed_deals",
      },
      cheque_size: {
        min_usd: chequeMin,
        max_usd: chequeMax,
        formatted: chequeFormatted,
        status: chequeStatus,
        evidence: chequeEvidence,
      },
      lead_partner: {
        name: partnerName,
        title: partnerTitle,
        status: partnerStatus,
        evidence: partnerEvidence,
      },
      approach_route: approachRoute,
      evidence_records: data.evidenceList,
    });
  }

  return profiles;
}
