import { useState, useEffect, useCallback } from "react";
import { api } from "./api.js";
import { fmtPrice } from "./utils.js";
import { Toast, Spinner, StatCard } from "./components/UI.jsx";
import BrowseEvents      from "./components/BrowseEvents.jsx";
import RegistrationsView from "./components/RegistrationsView.jsx";
import EventsManager     from "./components/EventsManager.jsx";
import SQLTerminal        from "./components/SQLTerminal.jsx";

const CURRENT_STUDENT_ID = "demo_student_001"; // In a real app: from auth session

export default function App() {
  const [tab, setTab]                 = useState("browse");
  const [adminTab, setAdminTab]       = useState("registrations");
  const [events, setEvents]           = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats]             = useState({ total_events:0, total_students:0, total_registrations:0, total_revenue:0 });
  const [loading, setLoading]         = useState(true);
  const [dbStatus, setDbStatus]       = useState("checking");
  const [toast, setToast]             = useState(null);

  const showToast = (msg, ok=true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const refresh = useCallback(async () => {
    try {
      const [ev, regs, st] = await Promise.all([api.getEvents(), api.getRegistrations(), api.stats()]);
      setEvents(ev);
      setRegistrations(regs);
      setStats(st);
    } catch (err) {
      showToast("DB error: " + err.message, false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await api.health();
        setDbStatus("connected");
      } catch {
        setDbStatus("error");
      }
      await refresh();
      setLoading(false);
    })();
  }, []);

  // IDs this session user has registered for
  const myRegisteredIds = new Set(
    registrations.filter(r => r.student_id === CURRENT_STUDENT_ID).map(r => r.event_id)
  );
  const myEvents = events.filter(e => myRegisteredIds.has(e.id));

  const MAIN_TABS = [
    { id:"browse",  icon:"🗓",  label:"Browse Events" },
    { id:"myevents",icon:"✅",  label:`My Events (${myRegisteredIds.size})` },
    { id:"admin",   icon:"⚙️", label:"Admin" },
  ];

  const ADMIN_TABS = [
    { id:"registrations", label:`Registrations (${stats.total_registrations})` },
    { id:"events",        label:"Events & Pricing" },
    { id:"sql",           label:"⌨ SQL Terminal" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0A0C0F", color:"#F1F5F9" }}>
      <Toast toast={toast} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header style={{ padding:"14px 28px", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(10,12,15,0.95)", backdropFilter:"blur(14px)", position:"sticky", top:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#6366F1,#8B5CF6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🏛</div>
          <div>
            <div style={{ fontWeight:800, fontSize:15, letterSpacing:"-.02em" }}>ClubHub</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:".1em", textTransform:"uppercase" }}>Student Event Portal</div>
          </div>
        </div>

        <nav style={{ display:"flex", gap:3 }}>
          {MAIN_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:700, transition:"all .2s", background: tab===t.id ? "rgba(99,102,241,0.2)" : "transparent", color: tab===t.id ? "#818CF8" : "rgba(255,255,255,0.4)" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background: dbStatus==="connected"?"#10B981":"#EF4444", boxShadow:`0 0 6px ${dbStatus==="connected"?"#10B981":"#EF4444"}` }} />
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>
            {dbStatus === "connected" ? "MySQL · clubhub_db" : "DB Disconnected"}
          </span>
        </div>
      </header>

      <main style={{ maxWidth:1160, margin:"0 auto", padding:"28px 20px 40px" }}>
        {loading ? <Spinner /> : (
          <>
            {/* ── Browse ───────────────────────────────────────────────── */}
            {tab === "browse" && (
              <BrowseEvents
                events={events}
                registeredIds={myRegisteredIds}
                onRefresh={refresh}
                showToast={showToast}
              />
            )}

            {/* ── My Events ────────────────────────────────────────────── */}
            {tab === "myevents" && (
              <div>
                <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:"-.03em", marginBottom:6 }}>My Registrations</h1>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:24 }}>Signed up for {myEvents.length} event{myEvents.length!==1?"s":""}</p>
                {myEvents.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,0.25)" }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
                    <div style={{ fontSize:16, marginBottom:16 }}>No registrations yet</div>
                    <button onClick={() => setTab("browse")} style={{ padding:"10px 20px", borderRadius:9, border:"none", background:"#6366F1", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13 }}>Browse Events</button>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {myEvents.map(ev => {
                      const reg = registrations.find(r => r.event_id===ev.id && r.student_id===CURRENT_STUDENT_ID);
                      return (
                        <div key={ev.id} style={{ background:"#111318", border:`1px solid ${ev.color}33`, borderRadius:16, padding:"20px 24px", display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>
                          <span style={{ fontSize:32 }}>{ev.emoji}</span>
                          <div style={{ flex:1, minWidth:200 }}>
                            <div style={{ fontWeight:700, color:"#F1F5F9", fontSize:16 }}>{ev.title}</div>
                            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:3 }}>{ev.club} · {ev.event_date} at {ev.event_time}</div>
                            <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>📍 {ev.venue}</div>
                            {reg && <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:6 }}>Registered: {reg.registered_at}</div>}
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                            <span style={{ fontSize:14, fontWeight:800, color: Number(ev.price)===0?"#10B981":"#F59E0B" }}>{fmtPrice(ev.price)}</span>
                            <span style={{ fontSize:12, color:"#10B981", fontWeight:700 }}>✓ Confirmed</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Admin ────────────────────────────────────────────────── */}
            {tab === "admin" && (
              <div>
                <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:"-.03em", marginBottom:4 }}>Admin Dashboard</h1>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:20 }}>Manage events, view registrations, run SQL queries</p>

                {/* Stats */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12, marginBottom:24 }}>
                  <StatCard label="Total Events"        value={stats.total_events}        color="#6366F1" />
                  <StatCard label="Students Registered" value={stats.total_students}       color="#10B981" />
                  <StatCard label="Registrations"       value={stats.total_registrations}  color="#F59E0B" />
                  <StatCard label="Total Revenue"       value={`₹${Number(stats.total_revenue).toLocaleString("en-IN")}`} color="#EC4899" sub="from paid events" />
                </div>

                {/* Admin sub-tabs */}
                <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                  {ADMIN_TABS.map(t => (
                    <button key={t.id} onClick={() => setAdminTab(t.id)}
                      style={{ padding:"10px 20px", background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, color: adminTab===t.id?"#818CF8":"rgba(255,255,255,0.35)", borderBottom: adminTab===t.id?"2px solid #6366F1":"2px solid transparent", transition:"all .15s" }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {adminTab === "registrations" && (
                  <RegistrationsView events={events} registrations={registrations} onRefresh={refresh} showToast={showToast} />
                )}
                {adminTab === "events" && (
                  <EventsManager events={events} onRefresh={refresh} showToast={showToast} />
                )}
                {adminTab === "sql" && (
                  <div style={{ background:"#0D0F14", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden", display:"flex", flexDirection:"column", minHeight:560 }}>
                    <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", fontSize:11, color:"rgba(255,255,255,0.25)", fontFamily:"monospace" }}>
                      Connected to: <span style={{ color:"#34D399" }}>clubhub_db</span> · 3 tables: <span style={{ color:"#818CF8" }}>events, students, registrations</span>
                    </div>
                    <SQLTerminal onDbChange={refresh} />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
