import Database from "better-sqlite3";

const db = new Database("complaints.db");

db.prepare(
  `
CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  category TEXT,
  location TEXT,
  status TEXT DEFAULT 'Submitted',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`
).run();

console.log("Connected to SQLite database");

export default db;
