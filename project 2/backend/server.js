require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Marantamil8754",
  database: "clubhub_db",
  waitForConnections: true,
  connectionLimit: 10,
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const [[{ total_events }]]        = await pool.query("SELECT COUNT(*) AS total_events FROM events");
    const [[{ total_students }]]      = await pool.query("SELECT COUNT(*) AS total_students FROM students");
    const [[{ total_registrations }]] = await pool.query("SELECT COUNT(*) AS total_registrations FROM registrations");
    const [[{ total_revenue }]]       = await pool.query("SELECT COALESCE(SUM(e.price), 0) AS total_revenue FROM registrations r JOIN events e ON r.event_id = e.id");
    res.json({ total_events, total_students, total_registrations, total_revenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, COUNT(r.reg_id) AS registered
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      GROUP BY e.id
      ORDER BY e.event_date
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/events", async (req, res) => {
  const { id, title, club, category, event_date, event_time, venue, capacity, price, description, color, emoji } = req.body;
  try {
    await pool.query(
      "INSERT INTO events (id,title,club,category,event_date,event_time,venue,capacity,price,description,color,emoji) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [id, title, club, category, event_date, event_time, venue, capacity || 30, price || 0, description, color || "#6366F1", emoji || "🎯"]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/events/:id", async (req, res) => {
  const allowed = ["title","club","category","event_date","event_time","venue","capacity","price","description","color","emoji"];
  const fields = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  if (!Object.keys(fields).length) return res.status(400).json({ error: "Nothing to update" });
  try {
    const sets = Object.keys(fields).map(k => `${k} = ?`).join(", ");
    await pool.query(`UPDATE events SET ${sets} WHERE id = ?`, [...Object.values(fields), req.params.id]);
    const [[event]] = await pool.query("SELECT e.*, COUNT(r.reg_id) AS registered FROM events e LEFT JOIN registrations r ON e.id=r.event_id WHERE e.id=? GROUP BY e.id", [req.params.id]);
    res.json({ ok: true, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM registrations WHERE event_id = ?", [req.params.id]);
    await pool.query("DELETE FROM events WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/registrations", async (req, res) => {
  try {
    let sql = `
      SELECT r.reg_id, r.registered_at,
             s.student_id, s.full_name, s.email, s.phone, s.year_of_study, s.department,
             e.id AS event_id, e.title AS event_title, e.club, e.category, e.color, e.emoji, e.price
      FROM registrations r
      JOIN students s ON r.student_id = s.student_id
      JOIN events   e ON r.event_id   = e.id
    `;
    const params = [];
    if (req.query.event_id) {
      sql += " WHERE r.event_id = ?";
      params.push(req.query.event_id);
    }
    sql += " ORDER BY r.registered_at DESC";
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/registrations", async (req, res) => {
  const { event_id, student_id, full_name, email, phone, year_of_study, department } = req.body;
  try {
    await pool.query(
      "INSERT IGNORE INTO students (student_id,full_name,email,phone,year_of_study,department) VALUES (?,?,?,?,?,?)",
      [student_id, full_name, email, phone, year_of_study, department]
    );
    await pool.query("INSERT INTO registrations (event_id, student_id) VALUES (?,?)", [event_id, student_id]);
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Already registered" });
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/registrations/:reg_id", async (req, res) => {
  try {
    await pool.query("DELETE FROM registrations WHERE reg_id = ?", [req.params.reg_id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sql", async (req, res) => {
  const { sql } = req.body;
  if (!sql) return res.status(400).json({ error: "No SQL provided" });
  const start = Date.now();
  try {
    const [rows] = await pool.query(sql);
    res.json({ ok: true, rows: Array.isArray(rows) ? rows : [], affected: rows.affectedRows ?? null, msg: `Query OK — ${Array.isArray(rows) ? rows.length : rows.affectedRows} row(s)`, time: Date.now() - start });
  } catch (err) {
    res.status(400).json({ ok: false, rows: [], msg: `ERROR: ${err.message}`, time: Date.now() - start });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students ORDER BY full_name");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`✅ ClubHub API running on http://localhost:${PORT}`);
});
