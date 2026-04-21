import { useState } from "react";

// ── Toast ──────────────────────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position:"fixed", top:20, right:20, zIndex:9999,
      padding:"12px 20px", borderRadius:10, fontWeight:700, fontSize:13,
      color:"#fff", maxWidth:340, animation:"fadeUp .25s ease",
      background: toast.ok === false ? "#EF4444" : "#10B981",
      boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
    }}>{toast.msg}</div>
  );
}

// ── Spinner ────────────────────────────────────────────────────────────────
export function Spinner({ size=36 }) {
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:60 }}>
      <div style={{ width:size, height:size, border:"3px solid rgba(255,255,255,0.1)", borderTopColor:"#6366F1", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width=520 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(8px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#13151A", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:32, maxWidth:width, width:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:"#F1F5F9" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:22, lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background:"#111318", border:`1px solid ${color}30`, borderRadius:14, padding:"18px 22px" }}>
      <div style={{ fontSize:26, fontWeight:800, color }}>{value}</div>
      <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", marginTop:2, fontWeight:600 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{sub}</div>}
    </div>
  );
}

// ── FormField ──────────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:5, display:"block" }}>{label}</label>
      {children}
    </div>
  );
}

export const inputStyle = {
  width:"100%", boxSizing:"border-box",
  background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
  borderRadius:8, padding:"9px 12px", color:"#F1F5F9", fontSize:13, outline:"none",
};

// ── ProgressBar ────────────────────────────────────────────────────────────
export function ProgressBar({ value, max, color }) {
  const pct = max ? Math.min((value / max) * 100, 100) : 0;
  const isFull = pct >= 90;
  return (
    <div>
      <div style={{ height:5, borderRadius:99, background:"rgba(255,255,255,0.08)", overflow:"hidden", marginBottom:4 }}>
        <div style={{ height:"100%", width:`${pct}%`, background: isFull ? "#EF4444" : color, borderRadius:99, transition:"width .6s ease" }} />
      </div>
      <div style={{ fontSize:11, color: isFull ? "#EF4444" : "rgba(255,255,255,0.4)", fontWeight:500 }}>
        {isFull ? `⚠ Only ${max - value} spots left!` : `${value} / ${max} registered`}
      </div>
    </div>
  );
}
