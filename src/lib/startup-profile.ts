import { StartupInput, StartupProfile } from "./types";

/**
 * Calculates the exact lookback date range based on runtime date
 */
export function calculateDateWindow(months: number = 18): { lookback_start: string; lookback_end: string } {
  const now = new Date();
  const endDate = now.toISOString().split("T")[0]; // YYYY-MM-DD

  const startDateObj = new Date(now);
  startDateObj.setMonth(startDateObj.getMonth() - months);
  const startDate = startDateObj.toISOString().split("T")[0];

  return {
    lookback_start: startDate,
    lookback_end: endDate,
  };
}

/**
 * Normalizes and analyzes founder input into a structured profile
 */
export function buildStartupProfile(input: StartupInput): StartupProfile {
  const desc = input.description.trim();
  const lower = desc.toLowerCase();

  // Determine lookback window
  const lookbackMonths = input.lookbackMonths && [12, 15, 18].includes(input.lookbackMonths)
    ? input.lookbackMonths
    : 18;
  const { lookback_start, lookback_end } = calculateDateWindow(lookbackMonths);

  // Analyze Sector & Sub-sector
  let sector = input.sector || "Software / Technology";
  let subSector = "B2B SaaS";
  let productType = "Software Application";
  let businessModel = input.businessModel || "B2B Subscription / SaaS";
  let targetCustomer = "Enterprise & Mid-Market";
  const keywords: string[] = [];
  const synonyms: string[] = [];
  const adjacentCategories: string[] = [];

  // Deep-Tech / Hardware / Semiconductors
  if (
    lower.includes("semiconductor") ||
    lower.includes("gallium") ||
    lower.includes("chip") ||
    lower.includes("hardware") ||
    lower.includes("robotics") ||
    lower.includes("battery") ||
    lower.includes("sensors")
  ) {
    sector = "Deep-Tech & Hardware";
    subSector = lower.includes("semiconductor") || lower.includes("chip") || lower.includes("gallium")
      ? "Advanced Semiconductors & Power Electronics"
      : lower.includes("robotics")
      ? "Robotics & Automation"
      : "Advanced Hardware & Deep Tech";
    productType = "Hardware & Component Manufacturing / Fabless IP";
    businessModel = "OEM / Component Sales & Licensing";
    targetCustomer = "EV Manufacturers, Data Centers, Industrial OEMs";
    keywords.push("semiconductors", "wide-bandgap", "GaN", "power electronics", "deep tech", "clean hardware");
    synonyms.push("power ICs", "energy efficiency chips", "compound semiconductors", "power conversion");
    adjacentCategories.push("Electric Vehicles (EV)", "Renewable Grid Infrastructure", "Data Center Power Systems");
  }
  // Climate / CleanTech / FoodTech / Biotech
  else if (
    lower.includes("fermentation") ||
    lower.includes("protein") ||
    lower.includes("food") ||
    lower.includes("climate") ||
    lower.includes("carbon") ||
    lower.includes("biotech") ||
    lower.includes("dairy")
  ) {
    sector = "Climate-Tech & AgriFood Bio";
    subSector = lower.includes("fermentation") || lower.includes("protein") || lower.includes("dairy")
      ? "Precision Fermentation & Novel Food Ingredients"
      : "Carbon & Climate Infrastructure";
    productType = "Bio-manufactured Proteins / Sustainable Ingredients";
    businessModel = "B2B Ingredient Supply & Formulation Licensing";
    targetCustomer = "Food Manufacturers, CPG Brands, Dairy Processors";
    keywords.push("precision fermentation", "alternative protein", "synbio", "sustainable food", "dairy-identical");
    synonyms.push("microbial protein", "recombinant casein", "cellular agriculture", "bioprocessing");
    adjacentCategories.push("Industrial Biotechnology", "Sustainable Packaging", "Decarbonization Solutions");
  }
  // Waste Management / Recycling / Circular Economy / Clean Tech
  else if (
    lower.includes("garbage") ||
    lower.includes("waste") ||
    lower.includes("recycling") ||
    lower.includes("trash") ||
    lower.includes("litter") ||
    lower.includes("circular economy") ||
    lower.includes("reverse vending")
  ) {
    sector = "Climate-Tech & Circular Economy";
    subSector = "Smart Waste Management & Recycling Incentives";
    productType = "Incentivized Waste Collection & Recycling Platform";
    businessModel = input.businessModel || "Marketplace Rewards & Municipal B2B SaaS";
    targetCustomer = "Consumers, Municipalities, FMCG Brands, Waste Haulers";
    keywords.push("waste management", "recycling incentives", "circular economy", "waste diversion", "clean tech", "reverse vending");
    synonyms.push("incentivized recycling", "smart recycling bin", "trash rewards", "municipal waste tech");
    adjacentCategories.push("Smart Cities Infrastructure", "Carbon Accounting & ESG", "Reverse Logistics");
  }
  // AI Dev Tools / Code / Developer Infrastructure
  else if (
    lower.includes("code") ||
    lower.includes("developer") ||
    lower.includes("testing") ||
    lower.includes("regression") ||
    lower.includes("patch") ||
    lower.includes("security") ||
    lower.includes("github") ||
    lower.includes("agent")
  ) {
    sector = "Developer Tools & AI Infrastructure";
    subSector = lower.includes("testing") || lower.includes("regression")
      ? "AI Automated Testing & Quality Engineering"
      : lower.includes("security") || lower.includes("patch")
      ? "Autonomous Code Security & Remediation"
      : "AI Coding Assistants & Software Engineering Agents";
    productType = "Developer Platform & CLI / IDE Agent Integration";
    businessModel = "B2B SaaS / Usage-based Developer Tier";
    targetCustomer = "Software Engineering Teams, CTOs, DevOps Leads";
    keywords.push("developer tools", "code generation", "automated testing", "AI agents", "code review", "DevSecOps");
    synonyms.push("coding agent", "test generation", "automated bug fixing", "AI software engineer", "pull request analysis");
    adjacentCategories.push("DevOps Automation", "Application Security (AppSec)", "Continuous Integration (CI/CD)");
  }
  // Fintech
  else if (
    lower.includes("fintech") ||
    lower.includes("payment") ||
    lower.includes("banking") ||
    lower.includes("lending") ||
    lower.includes("credit")
  ) {
    sector = "Financial Technology (Fintech)";
    subSector = "Payments & Financial Infrastructure";
    productType = "Financial API & Workflow Platform";
    businessModel = "Transaction Fee + SaaS Platform Fee";
    targetCustomer = "SMBs, Financial Institutions, Marketplaces";
    keywords.push("fintech", "payments", "embedded finance", "banking infrastructure");
    synonyms.push("digital payment rail", "automated treasury", "credit underwriting");
    adjacentCategories.push("RegTech & Compliance", "Accounting Automation", "InsurTech");
  }
  // HealthTech
  else if (
    lower.includes("health") ||
    lower.includes("clinical") ||
    lower.includes("medical") ||
    lower.includes("doctor") ||
    lower.includes("patient")
  ) {
    sector = "HealthTech & Digital Health";
    subSector = "Clinical AI & Healthcare Workflow";
    productType = "HIPAA-Compliant SaaS & Diagnostics Support";
    businessModel = "Enterprise Healthcare Subscription";
    targetCustomer = "Hospitals, Clinics, Healthcare Systems, Payers";
    keywords.push("healthtech", "clinical AI", "patient care", "medical workflows");
    synonyms.push("healthcare automation", "EHR integration", "clinical decision support");
    adjacentCategories.push("Telehealth", "Medical Devices", "Biopharma Software");
  }
  // AI & Enterprise Software
  else if (
    lower.includes("ai") ||
    lower.includes("intelligence") ||
    lower.includes("agent") ||
    lower.includes("model") ||
    lower.includes("llm")
  ) {
    sector = input.sector || "AI Software & Enterprise Applications";
    subSector = "Autonomous AI Workflows";
    productType = "Enterprise AI Application";
    businessModel = input.businessModel || "B2B Subscription SaaS";
    targetCustomer = "Enterprise Teams & Operators";
    keywords.push("artificial intelligence", "enterprise SaaS", "workflow automation", "AI software");
    synonyms.push("AI agent", "productivity software", "intelligent automation");
    adjacentCategories.push("Knowledge Management", "Data Analytics", "Back-office Automation");
  }
  // Arbitrary Generic Startup Description
  else {
    const words = desc.split(/\s+/).filter(w => w.length > 3).slice(0, 4);
    const capitalized = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

    sector = input.sector || "Emerging Technology & Industry Innovation";
    subSector = capitalized || "Innovative Solutions";
    productType = "Platform & Application";
    businessModel = input.businessModel || "B2B SaaS / Marketplace";
    targetCustomer = "Target Market Customers & Operators";
    keywords.push(...words.map(w => w.toLowerCase()), "startup funding", "venture-backed");
    synonyms.push(desc.slice(0, 30), "growth platform", "tech solutions");
    adjacentCategories.push("Industry Technology", "Digital Transformation", "Workflow Systems");
  }

  // Parse Stage
  const rawStage = (input.stage || "seed").toLowerCase();
  let stage = "Seed";
  let likelyFundingStage = "Seed / Early Stage";

  if (rawStage.includes("idea") || rawStage.includes("pre-seed")) {
    stage = "Pre-Seed";
    likelyFundingStage = "Pre-Seed to Seed";
  } else if (rawStage.includes("series a")) {
    stage = "Series A";
    likelyFundingStage = "Series A";
  } else if (rawStage.includes("series b")) {
    stage = "Series B+";
    likelyFundingStage = "Series B & Growth";
  } else if (rawStage.includes("not sure")) {
    stage = "Seed";
    likelyFundingStage = "Seed (estimated from description)";
  }

  // Parse Geography
  const geography = input.country && input.country.trim().length > 0
    ? input.country.trim()
    : "United States / Global";

  const targetMarkets = input.preferredMarkets && input.preferredMarkets.length > 0
    ? input.preferredMarkets
    : [geography, "North America", "Europe"];

  // Problem statement extraction
  const problemStatement = `Accelerating and automating ${subSector.toLowerCase()} to eliminate manual inefficiencies and improve speed and precision.`;

  return {
    original_description: desc,
    stage,
    likely_funding_stage: likelyFundingStage,
    geography,
    target_markets: targetMarkets,
    sector,
    sub_sector: subSector,
    problem_statement: problemStatement,
    target_customer: targetCustomer,
    product_type: productType,
    business_model: businessModel,
    keywords,
    synonyms,
    adjacent_categories: adjacentCategories,
    funding_target: input.fundingTarget || null,
    lookback_months: lookbackMonths,
    lookback_start,
    lookback_end,
    confidence_scores: {
      sector_confidence: 0.92,
      stage_confidence: 0.88,
      geography_confidence: 0.95,
    },
  };
}
