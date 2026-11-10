import { StartupInput, ComparableCompany } from "../types";
import { HARDWARE_GAN_COMPARABLES } from "./hardware-gan";
import { B2B_AI_REVIEW_COMPARABLES } from "./b2b-ai-review";
import { CLIMATE_FERMENT_COMPARABLES } from "./climate-ferment";
import { CLIMATE_WASTE_COMPARABLES } from "./climate-waste";

export {
  HARDWARE_GAN_COMPARABLES,
  B2B_AI_REVIEW_COMPARABLES,
  CLIMATE_FERMENT_COMPARABLES,
  CLIMATE_WASTE_COMPARABLES,
};

export interface DemoPreset {
  id: string;
  name: string;
  badge: string;
  market_category: string;
  input: StartupInput;
  comparables: ComparableCompany[];
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "demo-waste",
    name: "Smart Waste Marketplace & Incentivized Recycling",
    badge: "Climate-Tech & Circular Economy",
    market_category: "Circular Economy / Waste Tech",
    input: {
      description: "Verified circular waste marketplace connecting households, collectors, and processors with reward incentives, smart collection logistics, and traceable environmental outcome reporting.",
      stage: "Seed",
      country: "United States / Global",
      sector: "Climate-Tech & Circular Economy",
      businessModel: "Marketplace Rewards & Municipal B2B SaaS",
      fundingTarget: "$3.0M",
      preferredMarkets: ["North America", "Europe"],
      lookbackMonths: 18,
    },
    comparables: CLIMATE_WASTE_COMPARABLES,
  },
  {
    id: "demo-hardware",
    name: "GaN Power Semiconductors for EV Charging",
    badge: "Deep-Tech & Hardware",
    market_category: "Hard Tech / Semiconductors",
    input: {
      description: "Next-generation Gallium Nitride (GaN) power semiconductor architectures and integrated gate drivers for ultra-fast electric vehicle charging and high-density AI data center power supplies.",
      stage: "Seed",
      country: "United States / Europe",
      sector: "Deep-Tech & Hardware",
      businessModel: "Fabless Semiconductor IP & Component Sales",
      fundingTarget: "$4.0M",
      preferredMarkets: ["North America", "Europe", "Asia"],
      lookbackMonths: 18,
    },
    comparables: HARDWARE_GAN_COMPARABLES,
  },
  {
    id: "demo-b2b-ai",
    name: "Autonomous AI Code Review & Regression Patching",
    badge: "B2B SaaS & AI Dev Tools",
    market_category: "Developer Infrastructure / AI Agents",
    input: {
      description: "Autonomous AI software engineering agent that analyzes pull requests, discovers regression bugs through deterministic simulation, and generates verified code remediation patches.",
      stage: "Seed",
      country: "United States",
      sector: "Developer Tools & AI Infrastructure",
      businessModel: "B2B SaaS / Usage-Based Dev Tier",
      fundingTarget: "$2.5M",
      preferredMarkets: ["North America", "Global"],
      lookbackMonths: 18,
    },
    comparables: B2B_AI_REVIEW_COMPARABLES,
  },
  {
    id: "demo-climate",
    name: "Precision Fermentation Dairy-Identical Proteins",
    badge: "Climate-Tech & AgriFood Bio",
    market_category: "Novel Food / Biotechnology",
    input: {
      description: "Precision fermentation platform producing animal-free, dairy-identical casein and whey proteins to craft melting cheeses and nutrition products with 90% lower carbon footprint.",
      stage: "Seed",
      country: "United States / Europe",
      sector: "Climate-Tech & AgriFood Bio",
      businessModel: "B2B Ingredient Supply & Licensing",
      fundingTarget: "$3.5M",
      preferredMarkets: ["Europe", "North America"],
      lookbackMonths: 18,
    },
    comparables: CLIMATE_FERMENT_COMPARABLES,
  },
];
