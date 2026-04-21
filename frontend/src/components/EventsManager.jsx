import { useState } from "react";
import { api } from "../api.js";
import { fmtPrice, fmtDate, DEPTS } from "../utils.js";
import { Field, inputStyle, Modal } from "./UI.jsx";

const CATEGORIES = ["Tech","Arts","Photography","Dance","Science","Sports","Other"];
const YEARS      = ["1st Year","2nd Year","3rd Year","4th Year","PG"];

function EventForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ maxWidth:640 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {[["Event Title *","title","text"],["Club Name *","club","text"],["Venue","venue","text"],["Date *","event_date","date"],["Time","event_time","time"],["Emoji","emoji","text"]].map(([label,key,type]) => (
          <div key={key}>
            <Field label={label}>
              <input type={type} value={form[key]||""} onChange={e => f(key, e.target.value)} style={inputStyle} />
            </Field>
          </div>
        ))}
        <Field label="Capacity">
          <input type="number" value={form.capacity||30} onChange={e => f("capacity", e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Price (₹)">
          <input type="number" value={form.price||0} onChange={e => f("price", e.target.value)} style={inputStyle} min="0" step="10" />
        </Field>
        <Field label="Category">
          <select value={form.category||"Tech"} onChange={e => f("category", e.target.value)} style={{ ...inputStyle, appearance:"auto" }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Accent Color">
          <input type="color" value={form.color||"#6366F1"} onChange={e => f("color", e.target.value)} style={{ ...inputStyle, height:40, padding:4 }} />
        </Field>
        <div style={{ gridColumn:"1/-1" }}>
          <Field label="Description">
            <textarea rows={3} value={form.description||""} onChange={e => f("description", e.target.value)} style={{ ...inputStyle, resize:"vertical" }} />
          </Field>
        </div>
      </div>
      <div style={{ display:"flex", gap:10, marginTop:20 }}>
        <button onClick={onCancel} style={{ flex:1, padding:"11px 0", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontWeight:600 }}>Cancel</button>
        <button onClick={() => onSave(form)} style={{ flex:2, padding:"11px 0", borderRadius:10, border:"none", background:form.color||"#6366F1", color:"#000", fontWeight:800, cursor:"pointer", fontSize:14 }}>
          {initial._isNew ? "Create Event" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default function EventsManager({ events, onRefresh, showToast }) {
  const [editForm, setEditForm]   = useState(null);
  const [editPriceId, setEditPriceId] = useState(null);
  const [priceVal, setPriceVal]   = useState("");
  const [sqlLog, setSqlLog]       = useState([]);

  const logSQL = (sql) => setSqlLog(l => [`-- ${new Date().toLocaleTimeString()}\n${sql}`, ...l].slice(0, 10));

  const saveForm = async (form) => {
    try {
      if (form._isNew) {
        const id = "e" + Date.now().toString(36);
        const sql = `INSERT INTO events (id,title,club,category,event_date,event_time,venue,capacity,price,description,color,emoji)\nVALUES ('${id}','${form.title}','${form.club}','${form.category}','${form.event_date}','${form.event_time}','${form.venue}',${form.capacity},${form.price},'${form.description}','${form.color}','${form.emoji}')`;
        logSQL(sql);
        await api.createEvent({ ...form, id });
        showToast("Event created!");
      } else {
        const sql = `UPDATE events SET title='${form.title}', club='${form.club}', price=${form.price}, capacity=${form.capacity} WHERE id='${form.id}'`;
        logSQL(sql);
        await api.updateEvent(form.id, form);
        showToast("Event updated!");
      }
      setEditForm(null);
      await onRefresh();
    } catch (err) {
      showToast(err.message, false);
    }
  };

  const applyPrice = async (ev) => {
    const newP = parseFloat(priceVal);
    if (isNaN(newP) || newP < 0) { showToast("Enter a valid price", false); return; }
    const sql = `UPDATE events SET price = ${newP} WHERE id = '${ev.id}'`;
    logSQL(sql);
    try {
      await api.updateEvent(ev.id, { price: newP });
      await onRefresh();
      showToast(`✓ Price updated: ${fmtPrice(ev.price)} → ${fmtPrice(newP)}`);
      setEditPriceId(null); setPriceVal("");
    } catch (err) {
      showToast(err.message, false);
    }
  };

  const deleteEvent = async (ev) => {
    if (!window.confirm(`Delete "${ev.title}" and all ${ev.registered} registrations?`)) return;
    const sql = `DELETE FROM events WHERE id = '${ev.id}'`;
    logSQL(sql);
    try {
      await api.deleteEvent(ev.id);
      await onRefresh();
      showToast(`Deleted "${ev.title}"`);
    } catch (err) {
      showToast(err.message, false);
    }
  };

  return (
    <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
      {/* Events list */}
      <div style={{ flex:"1 1 520px", display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ margin:0, color:"#F1F5F9", fontWeight:700, fontSize:16 }}>All Events</h3>
          <button onClick={() => setEditForm({ _isNew:true, title:"", club:"", category:"Tech", event_date:"", event_time:"10:00", venue:"", capacity:30, price:0, description:"", color:"#6366F1", emoji:"🎯" })}
            style={{ padding:"8px 16px", borderRadius:9, border:"none", background:"#6366F1", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13 }}>
            + New Event
          </button>
        </div>

        {events.map(ev => (
          <div key={ev.id} style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"16px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
              <span style={{ fontSize:28 }}>{ev.emoji}</span>
              <div style={{ flex:1, minWidth:160 }}>
                <div style={{ fontWeight:700, color:"#F1F5F9", fontSize:15 }}>{ev.title}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{ev.club} · {fmtDate(ev.event_date)} · {ev.venue}</div>
                <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ flex:1, maxWidth:180, height:4, borderRadius:99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
                    <div style={{ width:`${Math.min((ev.registered/ev.capacity)*100,100)}%`, height:"100%", background: ev.registered/ev.capacity>=.9?"#EF4444":ev.color, borderRadius:99, transition:"width .6s" }} />
                  </div>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:600, whiteSpace:"nowrap" }}>{ev.registered}/{ev.capacity}</span>
                </div>
              </div>

              {/* Inline price editor */}
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {editPriceId === ev.id ? (
                  <>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>₹</span>
                    <input type="number" value={priceVal} autoFocus min="0"
                      onChange={e => setPriceVal(e.target.value)}
                      onKeyDown={e => { if(e.key==="Enter") applyPrice(ev); if(e.key==="Escape"){ setEditPriceId(null); setPriceVal(""); }}}
                      placeholder={String(ev.price)}
                      style={{ width:90, background:"rgba(255,255,255,0.08)", border:"1px solid #6366F1", borderRadius:7, padding:"6px 10px", color:"#F1F5F9", fontSize:13, outline:"none" }} />
                    <button onClick={() => applyPrice(ev)} style={{ padding:"6px 12px", borderRadius:7, border:"none", background:"#10B981", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:12 }}>✓</button>
                    <button onClick={() => { setEditPriceId(null); setPriceVal(""); }} style={{ padding:"6px 10px", borderRadius:7, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:12 }}>✕</button>
                  </>
                ) : (
                  <div title="Click to edit price" onClick={() => { setEditPriceId(ev.id); setPriceVal(String(ev.price)); }}
                    style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"7px 14px", cursor:"pointer", transition:"all .15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#6366F1"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                    <span style={{ fontSize:14, fontWeight:800, color: Number(ev.price)===0?"#10B981":"#F59E0B" }}>{fmtPrice(ev.price)}</span>
                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>✏</span>
                  </div>
                )}
              </div>

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => setEditForm({ ...ev })} style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${ev.color}44`, background:"transparent", color:ev.color, cursor:"pointer", fontSize:12, fontWeight:700 }}>Edit</button>
                <button onClick={() => deleteEvent(ev)} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid rgba(239,68,68,0.3)", background:"transparent", color:"#EF4444", cursor:"pointer", fontSize:12, fontWeight:700 }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SQL log panel */}
      {sqlLog.length > 0 && (
        <div style={{ flex:"0 0 320px", background:"#0D0F14", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:16, maxHeight:600, overflowY:"auto" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:10, fontWeight:700 }}>SQL Log</div>
          {sqlLog.map((s, i) => (
            <pre key={i} style={{ margin:"0 0 12px", fontSize:11, color:"rgba(255,255,255,0.55)", fontFamily:"'JetBrains Mono',monospace", lineHeight:1.6, background:"rgba(255,255,255,0.03)", borderRadius:7, padding:"8px 10px", overflowX:"auto" }}>{s}</pre>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal open={!!editForm} onClose={() => setEditForm(null)} title={editForm?._isNew ? "Create New Event" : `Edit: ${editForm?.title}`} width={680}>
        {editForm && <EventForm initial={editForm} onSave={saveForm} onCancel={() => setEditForm(null)} />}
      </Modal>
    </div>
  );
}
