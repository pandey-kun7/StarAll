import fs from "fs";
import path from "path";
import { ResearchRun } from "./types";

const memoryStore = new Map<string, ResearchRun>();

function getStorageDir(): string {
  const dir = path.join(process.cwd(), ".data", "runs");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function saveResearchRun(run: ResearchRun): void {
  memoryStore.set(run.request_id, run);

  try {
    const dir = getStorageDir();
    const filePath = path.join(dir, `${run.request_id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(run, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist run to disk:", err);
  }
}

export function getResearchRun(id: string): ResearchRun | null {
  if (memoryStore.has(id)) {
    return memoryStore.get(id)!;
  }

  try {
    const dir = getStorageDir();
    const filePath = path.join(dir, `${id}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as ResearchRun;
      memoryStore.set(id, data);
      return data;
    }
  } catch (err) {
    console.warn("Could not read run from disk:", err);
  }

  return null;
}
