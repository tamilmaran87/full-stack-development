export const YEAR_COLORS = {
  "1st Year": "#10B981",
  "2nd Year": "#6366F1",
  "3rd Year": "#F59E0B",
  "4th Year": "#EF4444",
  "PG":       "#8B5CF6",
};

export const CAT_COLORS = {
  Photography: "#F59E0B",
  Tech:        "#6366F1",
  Arts:        "#EC4899",
  Dance:       "#F97316",
  Science:     "#8B5CF6",
};

export const ALL_CATEGORIES = ["All", "Tech", "Arts", "Photography", "Dance", "Science"];
export const YEARS     = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG"];
export const DEPTS     = ["Computer Science","IT","Electronics","Electrical","Mechanical","Civil","Chemical","Physics","Arts","Commerce","MBA","Other"];

export const fmtPrice  = (p) => (p === 0 || p === "0.00" || p === "0") ? "Free" : `₹${Number(p).toLocaleString("en-IN")}`;
export const fmtDate   = (d) => new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
export const fmtTime   = (t) => { try { return new Date(`2000-01-01T${t}`).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}); } catch { return t; } };
export const fmtDT     = (d) => new Date(d).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});

export const QUICK_QUERIES = [
  { label: "All Registrations",    sql: "SELECT r.reg_id, s.full_name, s.email, s.phone, s.year_of_study, s.department,\n       e.title AS event_title, e.club, e.price, r.registered_at\nFROM registrations r\nJOIN students s ON r.student_id = s.student_id\nJOIN events   e ON r.event_id   = e.id\nORDER BY r.registered_at DESC" },
  { label: "Show All Events",      sql: "SELECT id, title, club, category, price, capacity FROM events ORDER BY event_date" },
  { label: "Show Tables",          sql: "SHOW TABLES" },
  { label: "Describe Events",      sql: "DESCRIBE events" },
  { label: "Count Registrations",  sql: "SELECT COUNT(*) AS total FROM registrations" },
  { label: "Free Events",          sql: "SELECT title, club, capacity FROM events WHERE price = 0" },
  { label: "Paid Events",          sql: "SELECT title, club, price FROM events WHERE price > 0 ORDER BY price DESC" },
  { label: "CS Students",          sql: "SELECT full_name, email, year_of_study FROM students WHERE department = 'Computer Science'" },
  { label: "Event Summary View",   sql: "SELECT * FROM v_event_summary" },
  { label: "Update Price",         sql: "UPDATE events SET price = 250 WHERE id = 'e4'" },
];
