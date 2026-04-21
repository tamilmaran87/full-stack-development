import { useState, useRef, useCallback } from "react";
import { api } from "../api.js";
import { QUICK_QUERIES, YEAR_COLORS, CAT_COLORS, fmtPrice } from "../utils.js";

function highlightSQL(sql) {
  const kw = /\b(SELECT|FROM|WHERE|UPDATE|SET|DELETE|INSERT|INTO|VALUES|JOIN|LEFT|RIGHT|INNER|ON|AS|AND|OR|NOT|IN|LIKE|ORDER|BY|ASC|DESC|LIMIT|SHOW|TABLES|DESCRIBE|ALTER|TABLE|MODIFY|COLUMN|ADD|COUNT|SUM|AVG|DISTINCT|GROUP|HAVING|IGNORE|DUPLICATE|KEY|AUTO_INCREMENT|PRIMARY|FOREIGN|REFERENCES|CASCADE|DEFAULT|CURRENT_TIMESTAMP)\b/g;
  let h = sql.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  h = h.replace(kw,            '<span style="color:#818CF8;font-weight:700">$1</span>');
  h = h.replace(/('[^']*')/g,  '<span style="color:#34D399">$1</span>');
  h = h.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span style="color:#FCD34D">$1</span>');
  return h;
}

export default function SQLTerminal({ onDbChange }) {
  const [sql, setSql]         = useState(QUICK_QUERIES[0].sql);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const taRef = useRef();

  const run = useCallback(async () => {
    if (!sql.trim()) return;
    setLoading(true);
    const start = Date.now();
    try {
      const res = await api.runSQL(sql.trim());
      setResult({ ...res, clientTime: Date.now() - start });
      const upper = sql.trim().toUpperCase();
      if (upper.startsWith("UPDATE") || upper.startsWith("DELETE") || upper.startsWith("INSERT")) onDbChange();
    } catch (err) {
      setResult({ ok: false, rows: [], msg: `ERROR: ${err.message}`, clientTime: Date.now() - start });
    }
    setLoading(false);
    setHistory(h => [sql.trim(), ...h.filter(x => x !== sql.trim())].slice(0, 30));
    setHistIdx(-1);
  }, [sql, onDbChange]);

  const onKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); }
    if (e.key === "ArrowUp" && history.length && e.altKey) {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx); setSql(history[idx]);
    }
  };

  const cols = result?.rows?.[0] ? Object.keys(result.rows[0]) : [];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", minHeight:0 }}>
      {/* Quick query pills */}
      <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:6, flexWrap:"wrap" }}>
        {QUICK_QUERIES.map(q => (
          <button key={q.label} onClick={() => setSql(q.sql)}
            style={{ padding:"4px 10px", borderRadius:6, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.55)", cursor:"pointer", fontSize:11, fontWeight:600, transition:"all .15s" }}
            onMouseEnter={e => e.target.style.background = "rgba(99,102,241,0.18)"}
            onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.04)"}>
            {q.label}
          </button>
        ))}
      </div>

      {/* Editor area */}
      <div style={{ position:"relative", background:"#0D0F14", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ position:"absolute", top:12, left:16, fontSize:11, color:"rgba(255,255,255,0.18)", fontFamily:"'JetBrains Mono',monospace", pointerEvents:"none", userSelect:"none" }}>
          mysql&gt; <span style={{ color:"rgba(255,255,255,0.1)" }}>Ctrl+Enter to run</span>
        </div>
        <textarea
          ref={taRef}
          value={sql}
          onChange={e => setSql(e.target.value)}
          onKeyDown={onKey}
          rows={6}
          spellCheck={false}
          style={{ width:"100%", background:"transparent", border:"none", outline:"none", color:"#E2E8F0", fontFamily:"'JetBrains Mono','Fira Code','Courier New',monospace", fontSize:13, lineHeight:1.7, padding:"36px 16px 12px", resize:"vertical", minHeight:120 }}
        />
        <div style={{ position:"absolute", bottom:10, right:12, display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>{sql.length} chars</span>
          <button onClick={run} disabled={loading}
            style={{ padding:"7px 22px", borderRadius:8, border:"none", background: loading ? "rgba(99,102,241,0.5)" : "#6366F1", color:"#fff", fontWeight:700, cursor: loading ? "not-allowed" : "pointer", fontSize:12, letterSpacing:".05em" }}>
            {loading ? "Running…" : "▶ RUN"}
          </button>
        </div>
      </div>

      {/* Result pane */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {!result && !loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", color:"rgba(255,255,255,0.15)", gap:8, padding:40 }}>
            <div style={{ fontSize:36 }}>🗄️</div>
            <div style={{ fontSize:13 }}>Run a query to see results</div>
          </div>
        )}
        {result && (
          <>
            <div style={{ padding:"8px 16px", background: result.ok ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:12, fontFamily:"'JetBrains Mono',monospace", color: result.ok ? "#34D399" : "#F87171", display:"flex", justifyContent:"space-between" }}>
              <span>{result.msg}</span>
              <span style={{ color:"rgba(255,255,255,0.25)" }}>{result.clientTime}ms</span>
            </div>
            {result.rows && result.rows.length > 0 && (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>
                  <thead>
                    <tr style={{ borderBottom:"2px solid rgba(255,255,255,0.1)", background:"#0D0F14" }}>
                      {cols.map(c => <th key={c} style={{ padding:"8px 14px", textAlign:"left", color:"rgba(255,255,255,0.4)", fontWeight:700, fontSize:10, letterSpacing:".07em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background: i%2===0 ? "transparent" : "rgba(255,255,255,0.012)" }}>
                        {cols.map(c => {
                          const val = row[c];
                          if (c === "year_of_study") return (
                            <td key={c} style={{ padding:"8px 14px", whiteSpace:"nowrap" }}>
                              <span style={{ background:(YEAR_COLORS[val]||"#888")+"22", color:YEAR_COLORS[val]||"#aaa", borderRadius:5, padding:"2px 8px", fontWeight:700, fontSize:11 }}>{val}</span>
                            </td>
                          );
                          if (c === "category") return <td key={c} style={{ padding:"8px 14px", color:CAT_COLORS[val]||"#aaa", fontWeight:700, whiteSpace:"nowrap" }}>{val}</td>;
                          if (c === "price") return <td key={c} style={{ padding:"8px 14px", color: val==0?"#10B981":"#F59E0B", fontWeight:700, whiteSpace:"nowrap" }}>{fmtPrice(val)}</td>;
                          return <td key={c} style={{ padding:"8px 14px", color:"rgba(255,255,255,0.65)", whiteSpace:"nowrap", maxWidth:240, overflow:"hidden", textOverflow:"ellipsis" }}>{val === null ? <span style={{ color:"rgba(255,255,255,0.2)" }}>NULL</span> : String(val)}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
