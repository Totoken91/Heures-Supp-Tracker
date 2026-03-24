import * as SQLite from 'expo-sqlite';
import { OvertimeEntry, Settings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

let db: SQLite.SQLiteDatabase;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('heures-supp.db');
    await initDatabase(db);
  }
  return db;
}

async function initDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS overtime_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      total_hours REAL NOT NULL,
      note TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_entries_date ON overtime_entries(date);
  `);
}

// --- CRUD Heures Supplémentaires ---

export async function addEntry(entry: Omit<OvertimeEntry, 'id' | 'created_at'>): Promise<number> {
  const database = await getDatabase();
  const result = await database.runAsync(
    'INSERT INTO overtime_entries (date, start_time, end_time, total_hours, note) VALUES (?, ?, ?, ?, ?)',
    entry.date, entry.start_time, entry.end_time, entry.total_hours, entry.note
  );
  return result.lastInsertRowId;
}

export async function updateEntry(id: number, entry: Omit<OvertimeEntry, 'id' | 'created_at'>): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'UPDATE overtime_entries SET date = ?, start_time = ?, end_time = ?, total_hours = ?, note = ? WHERE id = ?',
    entry.date, entry.start_time, entry.end_time, entry.total_hours, entry.note, id
  );
}

export async function deleteEntry(id: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM overtime_entries WHERE id = ?', id);
}

export async function getEntriesByMonth(yearMonth: string): Promise<OvertimeEntry[]> {
  const database = await getDatabase();
  return database.getAllAsync<OvertimeEntry>(
    "SELECT * FROM overtime_entries WHERE strftime('%Y-%m', date) = ? ORDER BY date DESC, start_time DESC",
    yearMonth
  );
}

export async function getAllEntries(): Promise<OvertimeEntry[]> {
  const database = await getDatabase();
  return database.getAllAsync<OvertimeEntry>(
    'SELECT * FROM overtime_entries ORDER BY date DESC, start_time DESC'
  );
}

// --- Réglages ---

export async function getSetting(key: string): Promise<string | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?', key
  );
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    key, value
  );
}

export async function getSettings(): Promise<Settings> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM settings'
  );

  const settings = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    if (row.key in settings) {
      const val = row.value;
      if (['weeklyLegalHours', 'rate25Threshold', 'rate50Threshold', 'hourlyRate'].includes(row.key)) {
        (settings as Record<string, unknown>)[row.key] = parseFloat(val);
      } else {
        (settings as Record<string, unknown>)[row.key] = val;
      }
    }
  }
  return settings;
}

export async function saveSettings(settings: Settings): Promise<void> {
  const entries = Object.entries(settings);
  for (const [key, value] of entries) {
    await setSetting(key, String(value));
  }
}
