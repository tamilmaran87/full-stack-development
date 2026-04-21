import { useState } from "react";
import { api } from "../api.js";
import { ALL_CATEGORIES, YEARS, DEPTS, fmtPrice, fmtDate, fmtTime, YEAR_COLORS, CAT_COLORS } from "../utils.js";
import { Modal, ProgressBar, Field, inputStyle } from "./UI.jsx";

function RegisterForm({ event, onSuccess, onClose }) {
  const [form, setForm] = useState({ full_name:"", email:"", phone:"", year_of_study:"2nd Year", department:"Computer Science" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const f = (k,v) => setForm(p => ({...p,[k]:v}));

  const submit = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) { setErr("Fill all required fields."); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setErr("Enter a valid email."); return; }
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g,""))) { setErr("Enter a valid 10-digit phone number."); return; }
    setLoading(true); setErr("");
    try {
      const studentId = "s" + Date.now().toString(36);
      await api.register({ event_id: event.id, student_id: studentId, ...form });
      onSuccess();
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div style={{ marginBottom:16, padding:14, background:`${event.color}15`, borderRadius:10, border:`1px solid ${event.color}33` }}>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>{event.emoji} {event.title} · {event.club}</div>
        <div style={{ fontSize:14, fontWeight:700, color: Number(event.price)===0?"#10B981":"#F59E0B", marginTop:4 }}>
          {fmtPrice(event.price)} {Number(event.price)>0 && <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>(entry fee)</span>}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div style={{ gridColumn:"1/-1" }}>
          <Field label="Full Name *"><input placeholder="Your full name" value={form.full_name} onChange={e=>f("full_name",e.target.value)} style={inputStyle} /></Field>
        </div>
        <Field label="Email *"><input type="email" placeholder="you@college.edu" value={form.email} onChange={e=>f("email",e.target.value)} style={inputStyle} /></Field>
        <Field label="Phone *"><input type="tel" placeholder="10-digit mobile" value={form.phone} onChange={e=>f("phone",e.target.value)} style={inputStyle} /></Field>
        <Field label="Year of Study">
          <select value={form.year_of_study} onChange={e=>f("year_of_study",e.target.value)} style={{...inputStyle,appearance:"auto"}}>
            {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
        <Field label="Department">
          <select value={form.department} onChange={e=>f("department",e.target.value)} style={{...inputStyle,appearance:"auto"}}>
            {DEPTS.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
      </div>
      {err && <div style={{ marginTop:10, color:"#EF4444", fontSize:12, fontWeight:600 }}>⚠ {err}</div>}
      <div style={{ display:"flex", gap:10, marginTop:20 }}>
        <button onClick={onClose} style={{ flex:1, padding:"11px 0", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontWeight:600 }}>Cancel</button>
        <button onClick={submit} disabled={loading} style={{ flex:2, padding:"11px 0", borderRadius:10, border:"none", background: event.color, color:"#000", fontWeight:800, cursor: loading?"not-allowed":"pointer", fontSize:14 }}>
          {loading ? "Registering…" : "Confirm Registration →"}
        </button>
      </div>
    </>
  );
}

export default function BrowseEvents({ events, registeredIds, onRefresh, showToast }) {
  const [cat, setCat]           = useState("All");
  const [search, setSearch]     = useState("");
  const [detailEv, setDetailEv] = useState(null);
  const [regEv, setRegEv]       = useState(null);

  const filtered = events.filter(e =>
    (cat === "All" || e.category === cat) &&
    (!search || e.title.toLowerCase().includes(search.toLowerCase()) || e.club.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRegSuccess = async () => {
    setRegEv(null); setDetailEv(null);
    await onRefresh();
    showToast("Registered successfully! 🎉");
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:"-.03em", marginBottom:6 }}>Upcoming Events</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, margin:0 }}>{events.length} events across {new Set(events.map(e=>e.club)).size} clubs</p>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap" }}>
        <input placeholder="Search events…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:"1 1 220px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:9, padding:"9px 14px", color:"#F1F5F9", fontSize:13, outline:"none" }} />
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {ALL_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding:"8px 14px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:700, transition:"all .15s", background: cat===c ? "#6366F1" : "rgba(255,255,255,0.06)", color: cat===c ? "#fff" : "rgba(255,255,255,0.45)" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:18 }}>
        {filtered.map(ev => {
          const isReg = registeredIds.has(ev.id);
          const full  = ev.registered >= ev.capacity;
          return (
            <div key={ev.id} onClick={() => setDetailEv(ev)}
              style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:22, cursor:"pointer", transition:"all .2s", position:"relative", overflow:"hidden" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=ev.color+"66"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 12px 40px ${ev.color}22`; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>

              <div style={{ position:"absolute", top:-20, left:-20, width:70, height:70, borderRadius:"50%", background:ev.color+"18", filter:"blur(18px)", pointerEvents:"none" }} />
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {(ev.tags || []).map(t => <span key={t} style={{ fontSize:10, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", padding:"3px 7px", borderRadius:4, background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)" }}>{t}</span>)}
                </div>
                <span style={{ fontSize:24 }}>{ev.emoji}</span>
              </div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:ev.color, marginBottom:4 }}>{ev.club}</div>
              <h3 style={{ margin:"0 0 8px", fontSize:16, fontWeight:700, color:"#F1F5F9", lineHeight:1.3 }}>{ev.title}</h3>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:6 }}>📅 {fmtDate(ev.event_date)} · ⏰ {fmtTime(ev.event_time)}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:12 }}>📍 {ev.venue}</div>
              <div style={{ fontSize:13, fontWeight:800, color: Number(ev.price)===0?"#10B981":"#F59E0B", marginBottom:12 }}>{fmtPrice(ev.price)}</div>
              <ProgressBar value={ev.registered} max={ev.capacity} color={ev.color} />
              <button onClick={e => { e.stopPropagation(); if (!isReg && !full) setRegEv(ev); }} disabled={full && !isReg}
                style={{ marginTop:14, width:"100%", padding:"9px 0", borderRadius:8, border:"none", cursor: full&&!isReg?"not-allowed":"pointer", fontWeight:700, fontSize:13, transition:"all .2s",
                  background: isReg ? "rgba(16,185,129,0.12)" : full ? "rgba(255,255,255,0.05)" : ev.color,
                  color:      isReg ? "#10B981" : full ? "rgba(255,255,255,0.2)" : "#000" }}>
                {isReg ? "✓ Registered" : full ? "Event Full" : `Register — ${fmtPrice(ev.price)}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Modal open={!!detailEv} onClose={() => setDetailEv(null)} title="">
        {detailEv && (
          <>
            <div style={{ fontSize:40, marginBottom:8 }}>{detailEv.emoji}</div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:detailEv.color, marginBottom:6 }}>{detailEv.club} · {detailEv.category}</div>
            <h2 style={{ margin:"0 0 10px", fontSize:22, color:"#F1F5F9" }}>{detailEv.title}</h2>
            <p style={{ color:"rgba(255,255,255,0.55)", fontSize:14, lineHeight:1.7, marginBottom:20 }}>{detailEv.description}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {[["📅 Date",fmtDate(detailEv.event_date)],["⏰ Time",fmtTime(detailEv.event_time)],["📍 Venue",detailEv.venue],["💰 Price",fmtPrice(detailEv.price)]].map(([k,v])=>(
                <div key={k} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px 14px" }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:3 }}>{k}</div>
                  <div style={{ fontSize:13, color:"#F1F5F9", fontWeight:700 }}>{v}</div>
                </div>
              ))}
            </div>
            <ProgressBar value={detailEv.registered} max={detailEv.capacity} color={detailEv.color} />
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button onClick={() => setDetailEv(null)} style={{ flex:1, padding:"11px 0", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontWeight:600 }}>Close</button>
              {!registeredIds.has(detailEv.id) ? (
                <button onClick={() => { setRegEv(detailEv); setDetailEv(null); }} disabled={detailEv.registered>=detailEv.capacity}
                  style={{ flex:2, padding:"11px 0", borderRadius:10, border:"none", background: detailEv.registered>=detailEv.capacity?"rgba(255,255,255,0.05)":detailEv.color, color: detailEv.registered>=detailEv.capacity?"rgba(255,255,255,0.2)":"#000", fontWeight:800, cursor: detailEv.registered>=detailEv.capacity?"not-allowed":"pointer", fontSize:14 }}>
                  {detailEv.registered>=detailEv.capacity ? "Event Full" : `Register — ${fmtPrice(detailEv.price)}`}
                </button>
              ) : (
                <div style={{ flex:2, padding:"11px 0", textAlign:"center", borderRadius:10, background:"rgba(16,185,129,0.1)", color:"#10B981", fontWeight:700, fontSize:14 }}>✓ You're registered</div>
              )}
            </div>
          </>
        )}
      </Modal>

      {/* Register Modal */}
      <Modal open={!!regEv} onClose={() => setRegEv(null)} title={`Register — ${regEv?.title}`}>
        {regEv && <RegisterForm event={regEv} onSuccess={handleRegSuccess} onClose={() => setRegEv(null)} />}
      </Modal>
    </div>
  );
}
