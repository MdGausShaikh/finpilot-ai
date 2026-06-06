import BetterSqlite3 from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseDir = path.join(__dirname, "../database");
const dbPath = path.join(databaseDir, "finpilot.db");

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

const sqlite = new BetterSqlite3(dbPath);

console.log("SQLite database connected successfully");

export const db = {
  run(query, params = [], callback) {
    try {
      const result = sqlite.prepare(query).run(params);

      if (typeof callback === "function") {
        callback.call({ lastID: result.lastInsertRowid, changes: result.changes }, null);
      }

      return result;
    } catch (error) {
      if (typeof callback === "function") {
        callback(error);
        return;
      }

      throw error;
    }
  },

  get(query, params = [], callback) {
    try {
      const row = sqlite.prepare(query).get(params);

      if (typeof callback === "function") {
        callback(null, row);
      }

      return row;
    } catch (error) {
      if (typeof callback === "function") {
        callback(error);
        return;
      }

      throw error;
    }
  },

  all(query, params = [], callback) {
    try {
      const rows = sqlite.prepare(query).all(params);

      if (typeof callback === "function") {
        callback(null, rows);
      }

      return rows;
    } catch (error) {
      if (typeof callback === "function") {
        callback(error);
        return;
      }

      throw error;
    }
  },

  serialize(callback) {
    if (typeof callback === "function") {
      callback();
    }
  }
};

export function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS income (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        category TEXT,
        member TEXT,
        amount REAL NOT NULL,
        note TEXT,
        date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        category TEXT,
        member TEXT,
        amount REAL NOT NULL,
        payment_mode TEXT,
        note TEXT,
        date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS family_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        role TEXT,
        income_contribution REAL DEFAULT 0,
        expense_share REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        type TEXT,
        target_amount REAL,
        current_amount REAL,
        monthly_contribution REAL,
        target_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS investments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        type TEXT,
        invested_amount REAL,
        current_value REAL,
        monthly_sip REAL,
        expected_return REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database tables initialized successfully");
  });
}