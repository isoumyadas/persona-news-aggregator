import fs from "fs/promises";
import path from "path";
import { NewsArticle } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const HISTORY_FILE = path.join(DATA_DIR, "historicalUpdates.json");

export interface HistoricalRecord {
  id: string;
  domain: "tech" | "finance";
  article: NewsArticle;
  discoveredAt: string; // Stamped when the system found it
}

export async function initDb() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(HISTORY_FILE);
    } catch {
      await fs.writeFile(HISTORY_FILE, JSON.stringify([]));
    }
  } catch (err) {
    console.error("Failed to init local JSON historical database", err);
  }
}

export async function appendToHistory(records: HistoricalRecord[]) {
  await initDb();
  try {
    const raw = await fs.readFile(HISTORY_FILE, "utf-8");
    const history: HistoricalRecord[] = JSON.parse(raw);
    
    // De-duplicate: Ensure we don't save the same article over and over every 24hr loop
    const existingIds = new Set(history.map((r) => r.article.id));
    
    const newRecords = records.filter(r => !existingIds.has(r.article.id));
    
    if (newRecords.length > 0) {
      // Prepend so newest discoveries are at the top
      history.unshift(...newRecords);
      await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
    }
  } catch (err) {
    console.error("Failed to append to json history", err);
  }
}

export async function getHistoricalUpdates(domain: "tech" | "finance"): Promise<HistoricalRecord[]> {
  await initDb();
  try {
    const raw = await fs.readFile(HISTORY_FILE, "utf-8");
    const history: HistoricalRecord[] = JSON.parse(raw);
    return history.filter(r => r.domain === domain);
  } catch (err) {
    return [];
  }
}
