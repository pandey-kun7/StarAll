import { TinyFish } from "@tiny-fish/sdk";
import fs from "fs";
import path from "path";

let cachedClient: TinyFish | null = null;

export function getTinyFishApiKey(): string | null {
  if (process.env.TINYFISH_API_KEY && process.env.TINYFISH_API_KEY.trim().length > 0) {
    return process.env.TINYFISH_API_KEY.trim();
  }

  // Fallback to local config file if present in home directory
  try {
    const homeDir = process.env.USERPROFILE || process.env.HOME || "C:\\Users\\Administrator";
    const configPath = path.join(homeDir, ".tinyfish", "config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (config.api_key) {
        return config.api_key;
      }
    }
  } catch (err) {
    console.warn("Could not read ~/.tinyfish/config.json:", err);
  }

  return null;
}

export function getTinyFishClient(): TinyFish {
  if (cachedClient) {
    return cachedClient;
  }

  const apiKey = getTinyFishApiKey();
  if (!apiKey) {
    throw new Error(
      "TinyFish API key not found. Please set TINYFISH_API_KEY environment variable or configure ~/.tinyfish/config.json"
    );
  }

  cachedClient = new TinyFish({ apiKey });
  return cachedClient;
}

export interface TinySetSpecColumn {
  name: string;
  label?: string;
  type: "string" | "number" | "boolean" | "url" | "date";
  is_primary_key: boolean;
  retrieval_hint?: string;
}

export interface TinySetSpec {
  name: string;
  description: string;
  columns: TinySetSpecColumn[];
  keep_when?: { column: string };
}

/**
 * Creates and populates a dataset using TinySet
 */
export async function createAndPopulateTinySet(
  specOrPrompt: { spec?: TinySetSpec; prompt?: string },
  targetRows: number = 15,
  onEvent?: (event: { type: string; text?: string; rowCount?: number }) => void
): Promise<{ datasetId: string; rows: Array<Record<string, unknown>> }> {
  const client = getTinyFishClient();

  onEvent?.({ type: "init", text: "Initializing TinySet extraction job..." });

  const createParams: Parameters<typeof client.datasets.create>[0] = {
    target_rows: targetRows,
    populate: true,
  };

  if (specOrPrompt.spec) {
    createParams.spec = specOrPrompt.spec;
  } else if (specOrPrompt.prompt) {
    createParams.prompt = specOrPrompt.prompt;
  } else {
    throw new Error("Must provide either spec or prompt for TinySet");
  }

  const dataset = await client.datasets.create(createParams);
  const datasetId = dataset.id;

  onEvent?.({
    type: "created",
    text: `TinySet dataset created: "${dataset.name}" (ID: ${datasetId}). Running live web crawler...`,
  });

  // Poll for completion or stream events with a timeout
  const startTime = Date.now();
  const maxWaitMs = 120_000; // 2 minutes max
  let completed = false;
  let allRows: Array<Record<string, unknown>> = [];

  while (!completed && Date.now() - startTime < maxWaitMs) {
    await new Promise((res) => setTimeout(res, 4000));

    try {
      const current = await client.datasets.get(datasetId);
      const rowCount = current.row_count || 0;
      const status = current.status;

      onEvent?.({
        type: "progress",
        text: `TinySet status: ${status}, extracted ${rowCount}/${targetRows} companies...`,
        rowCount,
      });

      if (status === "ready" || status === "failed" || status === "cancelled" || rowCount >= targetRows) {
        completed = true;
      }
    } catch (err) {
      console.warn("Polling error in TinySet:", err);
    }
  }

  // Fetch final rows
  try {
    const rowsRes = await client.datasets.rows(datasetId, { limit: Math.max(targetRows, 25) });
    allRows = rowsRes.rows.map((r) => r.data as Record<string, unknown>);
  } catch (err) {
    console.error("Error fetching dataset rows:", err);
  }

  return { datasetId, rows: allRows };
}

/**
 * Searches the web using TinyFish Search
 */
export async function searchTinyFish(query: string, options?: { page?: number; afterDate?: string; beforeDate?: string }) {
  const client = getTinyFishClient();
  try {
    const res = await client.search.query({
      query,
      page: options?.page,
      after_date: options?.afterDate,
      before_date: options?.beforeDate,
    });
    return res.results || [];
  } catch (err) {
    console.warn(`TinyFish search failed for query "${query}":`, err);
    return [];
  }
}

/**
 * Fetches and parses clean web content using TinyFish Fetch
 */
export async function fetchTinyFishContent(urls: string[]) {
  if (urls.length === 0) return [];
  const client = getTinyFishClient();
  try {
    const res = await client.fetch.getContents({
      urls,
      format: "markdown",
    });
    return res.results || [];
  } catch (err) {
    console.warn("TinyFish fetch failed for URLs:", urls, err);
    return [];
  }
}

/**
 * Creates a recurring Search Monitor to track new funding rounds automatically
 */
export async function createSearchFundingMonitor(params: {
  name: string;
  query: string;
  scheduleCron?: string; // e.g. "0 9 * * 1" (Weekly Mondays at 9am)
  recencyMinutes?: number;
}) {
  const client = getTinyFishClient();
  const scheduleCron = params.scheduleCron || "0 9 * * 1";
  const res = await client.monitors.create({
    type: "search",
    name: params.name,
    schedule_cron: scheduleCron,
    config: {
      query: params.query,
      recency_minutes: params.recencyMinutes || 10080, // 7 days in minutes
      result_limit: 15,
    },
  });
  return res;
}

/**
 * Creates a recurring Fetch Monitor to watch an investor's portfolio or news page
 */
export async function createPortfolioFetchMonitor(params: {
  name: string;
  url: string;
  scheduleCron?: string;
}) {
  const client = getTinyFishClient();
  const scheduleCron = params.scheduleCron || "0 9 * * 1";
  const res = await client.monitors.create({
    type: "fetch",
    name: params.name,
    schedule_cron: scheduleCron,
    config: {
      url: params.url,
      format: "markdown",
    },
  });
  return res;
}

/**
 * Lists all active monitors in TinyFish
 */
export async function listTinyFishMonitors() {
  const client = getTinyFishClient();
  const res = await client.monitors.list();
  return res.monitors || [];
}

/**
 * Cancels and deletes a TinyFish monitor
 */
export async function cancelTinyFishMonitor(monitorId: string) {
  const client = getTinyFishClient();
  return await client.monitors.cancel(monitorId);
}

