import { useState } from "react";
import { api } from "../api.js";
import { YEAR_COLORS, CAT_COLORS, fmtPrice, fmtDT } from "../utils.js";

export default function RegistrationsView({ events, registrations, onRefresh, showToast }) {
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = registrations
    .filter(r => selectedEvent === "all" || r.event_id === selectedEvent)
    .filter(r => !search ||
      r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.department?.toLowerCase().includes(search.toLowerCase()) ||
      r.event_title?.toLowerCase().includes(search.toLowerCase())
    );

  const removeReg = async (regId, name) => {
    if (!window.confirm(`Remove ${name} from this event?`)) return;
    try {
      await api.removeRegistration(regId);
      await onRefresh();
      showToast(`Removed ${name}`);
    } catch (err) {
      showToast(err.message, false);
    }
  };

  const exportCSV = () => {
    const headers = ["#","Name","Email","Phone","Year","Department","Event","Club","Price","Registered At"];
    const rows = filtered.map((r,i) => [i+1, r.full_name, r.email, r.phone, r.year_of_study, r.department, r.event_title, r.club, r.price, fmtDT(r.registered_at)]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "registrations.csv";
    a.click();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Event filter */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        <button onClick={() => setSelectedEvent("all")}
          style={{ padding:"7px 14px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:700, background: selectedEvent==="all" ? "#6366F1" : "rgba(255,255,255,0.06)", color: selectedEvent==="all" ? "#fff" : "rgba(255,255,255,0.5)", transition:"all .15s" }}>
          All Events ({registrations.length})
        </button>
        {events.map(ev => (
          <button key={ev.id} onClick={() => setSelectedEvent(ev.id)}
            style={{ padding:"7px 14px", borderRadius:8, border: selectedEvent===ev.id ? `1px solid ${ev.color}55` : "1px solid transparent", cursor:"pointer", fontSize:12, fontWeight:700, background: selectedEvent===ev.id ? ev.color+"25" : "rgba(255,255,255,0.05)", color: selectedEvent===ev.id ? ev.color : "rgba(255,255,255,0.45)", transition:"all .15s" }}>
            {ev.emoji} {ev.title} ({ev.registered})
          </button>
        ))}
      </div>

      {/* Search + Export */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <input placeholder="Search name, email, department, event…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex:"1 1 280px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"9px 14px", color:"#F1F5F9", fontSize:13, outline:"none" }} />
        <button onClick={exportCSV}
          style={{ padding:"9px 16px", borderRadius:8, border:"1px solid rgba(16,185,129,0.3)", background:"rgba(16,185,129,0.08)", color:"#10B981", cursor:"pointer", fontWeight:700, fontSize:12, whiteSpace:"nowrap" }}>
          ↓ Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX:"auto", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#0D0F14" }}>
              {["#","Name","Email","Phone","Year","Department","Event","Price","Registered At",""].map(h => (
                <th key={h} style={{ padding:"11px 13px", textAlign:"left", color:"rgba(255,255,255,0.35)", fontWeight:700, fontSize:10, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} style={{ padding:"40px", textAlign:"center", color:"rgba(255,255,255,0.2)" }}>No registrations found</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.reg_id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", transition:"background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding:"11px 13px", color:"rgba(255,255,255,0.25)", fontSize:11, fontWeight:600 }}>{i+1}</td>
                <td style={{ padding:"11px 13px", color:"#F1F5F9", fontWeight:700 }}>{r.full_name}</td>
                <td style={{ padding:"11px 13px", color:"rgba(255,255,255,0.5)" }}>{r.email}</td>
                <td style={{ padding:"11px 13px", color:"rgba(255,255,255,0.45)" }}>{r.phone}</td>
                <td style={{ padding:"11px 13px" }}>
                  <span style={{ background:(YEAR_COLORS[r.year_of_study]||"#888")+"22", color:YEAR_COLORS[r.year_of_study]||"#aaa", borderRadius:5, padding:"3px 8px", fontSize:11, fontWeight:700 }}>{r.year_of_study}</span>
                </td>
                <td style={{ padding:"11px 13px", color:"rgba(255,255,255,0.5)" }}>{r.department}</td>
                <td style={{ padding:"11px 13px" }}>
                  <span style={{ color:r.color, fontWeight:700, fontSize:12 }}>{r.emoji} {r.event_title}</span>
                </td>
                <td style={{ padding:"11px 13px", color: Number(r.price)===0 ? "#10B981" : "#F59E0B", fontWeight:700 }}>{fmtPrice(r.price)}</td>
                <td style={{ padding:"11px 13px", color:"rgba(255,255,255,0.35)", fontSize:11 }}>{fmtDT(r.registered_at)}</td>
                <td style={{ padding:"11px 13px" }}>
                  <button onClick={() => removeReg(r.reg_id, r.full_name)}
                    style={{ padding:"4px 10px", borderRadius:6, border:"1px solid rgba(239,68,68,0.3)", background:"transparent", color:"#EF4444", cursor:"pointer", fontSize:11, fontWeight:700 }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
