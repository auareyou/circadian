import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════════════
// CIRCADIAN OS — Option A: The Full Picture
// iOS 26 Liquid Glass Edition — With Sidebar Navigation
// ═══════════════════════════════════════════════════════════════════

const DATA = {
  patient: { name: "Sarah", trialDay: 9, trialLength: 21 },
  today: {
    circadianScore: 74, scoreChange: +3,
    lightMinutes: 52, lightPrescribed: 60, lightEffectivePercent: 81, lightRawPercent: 87,
    bedtimeTarget: "22:30", bedtimeActual: "23:15", bedtimeDeviationMin: 45,
    wakeTarget: "07:00", wakeActual: "07:10", wakeDeviationMin: 10,
    naps: 0, nightWakings: 1, nightWakingDurationMin: 12,
    message: "Your wake time was spot on today. Your plant is growing.",
    quest: "Start your light session before 9:30am tomorrow"
  },
  streak: { current: 5, best: 7 },
  last14Days: [
    { day: 1, date: "02-20", score: 45, light: 30, lightPrescribed: 60, bedtimeDev: 90, wakeDev: 60, status: "partial" },
    { day: 2, date: "02-21", score: 52, light: 42, lightPrescribed: 60, bedtimeDev: 60, wakeDev: 30, status: "partial" },
    { day: 3, date: "02-22", score: 48, light: 25, lightPrescribed: 60, bedtimeDev: 75, wakeDev: 45, status: "missed" },
    { day: 4, date: "02-23", score: 61, light: 55, lightPrescribed: 60, bedtimeDev: 30, wakeDev: 20, status: "partial" },
    { day: 5, date: "02-24", score: 58, light: 48, lightPrescribed: 60, bedtimeDev: 45, wakeDev: 15, status: "partial" },
    { day: 6, date: "02-25", score: 65, light: 58, lightPrescribed: 60, bedtimeDev: 20, wakeDev: 10, status: "hit" },
    { day: 7, date: "02-26", score: 70, light: 60, lightPrescribed: 60, bedtimeDev: 15, wakeDev: 5, status: "hit" },
    { day: 8, date: "02-27", score: 68, light: 55, lightPrescribed: 60, bedtimeDev: 25, wakeDev: 10, status: "partial" },
    { day: 9, date: "02-28", score: 74, light: 52, lightPrescribed: 60, bedtimeDev: 45, wakeDev: 10, status: "hit" },
    { day: 10, date: "03-01", score: null, light: null, lightPrescribed: 60, bedtimeDev: null, wakeDev: null, status: "future" },
    { day: 11, date: "03-02", score: null, light: null, lightPrescribed: 60, bedtimeDev: null, wakeDev: null, status: "future" },
    { day: 12, date: "03-03", score: null, light: null, lightPrescribed: 60, bedtimeDev: null, wakeDev: null, status: "future" },
    { day: 13, date: "03-04", score: null, light: null, lightPrescribed: 60, bedtimeDev: null, wakeDev: null, status: "future" },
    { day: 14, date: "03-05", score: null, light: null, lightPrescribed: 60, bedtimeDev: null, wakeDev: null, status: "future" }
  ],
  sleepTimeline: [
    { day: 1, segments: [{ start: "00:00", end: "06:00", type: "sleep" }, { start: "14:00", end: "15:30", type: "nap" }, { start: "23:30", end: "24:00", type: "sleep" }] },
    { day: 2, segments: [{ start: "00:00", end: "06:30", type: "sleep" }, { start: "13:00", end: "13:45", type: "nap" }, { start: "23:00", end: "24:00", type: "sleep" }] },
    { day: 6, segments: [{ start: "00:00", end: "07:10", type: "sleep" }, { start: "22:20", end: "24:00", type: "sleep" }] },
    { day: 7, segments: [{ start: "00:00", end: "07:05", type: "sleep" }, { start: "22:30", end: "24:00", type: "sleep" }] },
    { day: 9, segments: [{ start: "00:00", end: "03:00", type: "sleep" }, { start: "03:00", end: "03:12", type: "waking" }, { start: "03:12", end: "07:10", type: "sleep" }, { start: "23:15", end: "24:00", type: "sleep" }] }
  ],
  scoreBreakdown: {
    lightTherapy: 43, lightTherapyMax: 50,
    noNapping: 10, noNappingMax: 10,
    noNightWakings: 5, noNightWakingsMax: 10,
    consistentBedtime: 6, consistentBedtimeMax: 10,
    consistentWakeTime: 10, consistentWakeTimeMax: 10
  }
};

// ─── DESIGN TOKENS (Circadian + iOS 26 Liquid Glass) ────────────────
const t = {
  bg: "#FAFAF7",
  surface: "rgba(255, 255, 255, 0.55)",
  surfaceHover: "rgba(255, 255, 255, 0.7)",
  surfaceAlt: "#F5F0E8",
  surfaceSolid: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textMuted: "#9C9C9C",
  accent: "#E8A838",
  accentSoft: "#FFF3D6",
  success: "#4CAF82",
  successSoft: "#E8F5E9",
  warning: "#E8A838",
  danger: "#D4785C",
  dangerSoft: "#FDEAE4",
  chartLine: "#2D7A5F",
  chartFill: "rgba(45, 122, 95, 0.08)",
  ringBg: "#EAEAEA",
  ringFill: "#4CAF82",
  // Liquid Glass
  glass: "rgba(255, 255, 255, 0.42)",
  glassBorder: "rgba(255, 255, 255, 0.65)",
  glassHighlight: "rgba(255, 255, 255, 0.35)",
  glassShadow: "0 2px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03)",
  glassInset: "inset 0 1px 1px rgba(255,255,255,0.6)",
  blur: "blur(20px) saturate(180%)",
  // Concentric radii
  radiusOuter: 24,
  radiusInner: 16, // outer - padding(8)
  radiusPill: 9999,
};

// ─── GLOBAL STYLES ──────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; background: transparent; }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes arcDraw {
    from { stroke-dashoffset: var(--arc-length); }
    to   { stroke-dashoffset: var(--arc-target); }
  }
`;

// ─── GLASS CARD ─────────────────────────────────────────────────────
function GlassCard({ title, children, style, delay = 0 }) {
  return (
    <div style={{
      background: t.glass,
      backdropFilter: t.blur,
      WebkitBackdropFilter: t.blur,
      borderRadius: t.radiusOuter,
      border: `1px solid ${t.glassBorder}`,
      boxShadow: `${t.glassShadow}, ${t.glassInset}`,
      padding: 24,
      position: "relative",
      overflow: "hidden",
      animation: `fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
      ...style,
    }}>
      {/* Specular highlight — top edge refraction */}
      <div style={{
        position: "absolute", top: 0, left: 24, right: 24, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 70%, transparent)",
        pointerEvents: "none"
      }} />
      {title && (
        <div style={{
          fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          color: t.textSecondary, marginBottom: 16, letterSpacing: "0.01em"
        }}>{title}</div>
      )}
      {children}
    </div>
  );
}

// ─── RADIAL GAUGE ───────────────────────────────────────────────────
function RadialGauge({ score, change }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let start = null;
    const dur = 900;
    const run = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      // spring-like ease out
      const e = 1 - Math.pow(1 - p, 4);
      setAnim(Math.round(e * score));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [score]);

  const cx = 130, cy = 120, r = 85, sw = 14;
  const arc = (from, to) => {
    const x1 = cx + r * Math.cos(from), y1 = cy - r * Math.sin(from);
    const x2 = cx + r * Math.cos(to), y2 = cy - r * Math.sin(to);
    const large = Math.abs(from - to) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const bgPath = arc(Math.PI, 0);
  const fillEnd = Math.PI - (anim / 100) * Math.PI;
  const fillPath = arc(Math.PI, fillEnd);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={260} height={150} viewBox="0 0 260 150">
        <defs>
          <linearGradient id="gaugeLG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={t.danger} />
            <stop offset="45%" stopColor={t.warning} />
            <stop offset="100%" stopColor={t.success} />
          </linearGradient>
          <filter id="glowArc">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={bgPath} fill="none" stroke={t.ringBg} strokeWidth={sw} strokeLinecap="round" opacity={0.5} />
        <path d={fillPath} fill="none" stroke="url(#gaugeLG)" strokeWidth={sw} strokeLinecap="round" filter="url(#glowArc)" />
        <text x={cx} y={cy - 10} textAnchor="middle" style={{ fontSize: 72, fontFamily: "'DM Serif Display', serif", fill: t.textPrimary }}>{anim}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontSize: 14, fontFamily: "'DM Sans', sans-serif", fill: t.textSecondary }}>out of 100</text>
        <text x={cx} y={cy + 36} textAnchor="middle" style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif", fill: t.success, fontWeight: 500 }}>+{change} ↑ from yesterday</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 44 }}>🌿</span>
        <span style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: t.textMuted }}>Healthy</span>
      </div>
    </div>
  );
}

// ─── TREND CHART ────────────────────────────────────────────────────
function TrendChart({ days }) {
  const chartData = days.map(d => ({ name: `D${d.day}`, score: d.score, isFuture: d.status === "future" }));
  const CustomDot = ({ cx, cy, payload }) => {
    if (!cx || !cy) return null;
    if (payload.isFuture) return <circle cx={cx} cy={cy} r={3.5} fill="none" stroke={t.ringBg} strokeWidth={1.5} strokeDasharray="3 2" />;
    return (
      <>
        <circle cx={cx} cy={cy} r={5} fill={t.chartLine} />
        <circle cx={cx} cy={cy} r={3} fill="#fff" />
      </>
    );
  };
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]?.value !== null && payload?.[0]?.value !== undefined) {
      return (
        <div style={{
          background: t.glass, backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)",
          padding: "8px 14px", borderRadius: 14, border: `1px solid ${t.glassBorder}`,
          boxShadow: t.glassShadow, fontFamily: "'DM Sans', sans-serif", fontSize: 13
        }}>
          <div style={{ fontWeight: 500, color: t.textPrimary }}>{payload[0].payload.name}</div>
          <div style={{ color: t.chartLine, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{payload[0].value}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.chartLine} stopOpacity={0.15} />
            <stop offset="100%" stopColor={t.chartLine} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={`${t.ringBg}88`} horizontal vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: t.textMuted, fontFamily: "'DM Sans'" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} ticks={[25, 50, 75, 100]} tick={{ fontSize: 11, fill: t.textMuted, fontFamily: "'DM Sans'" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: t.ringBg, strokeDasharray: "4 4" }} />
        <Area type="monotone" dataKey="score" stroke={t.chartLine} strokeWidth={2.5} fill="url(#areaGrad)" dot={<CustomDot />} connectNulls={false} animationDuration={700} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── SCORE BREAKDOWN ────────────────────────────────────────────────
function ScoreBreakdown({ b }) {
  const rows = [
    { label: "Light therapy", val: b.lightTherapy, max: b.lightTherapyMax },
    { label: "No napping", val: b.noNapping, max: b.noNappingMax },
    { label: "No night wakings", val: b.noNightWakings, max: b.noNightWakingsMax },
    { label: "Bedtime timing", val: b.consistentBedtime, max: b.consistentBedtimeMax },
    { label: "Wake timing", val: b.consistentWakeTime, max: b.consistentWakeTimeMax },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {rows.map((r, i) => {
        const pct = (r.val / r.max) * 100;
        const full = pct >= 100;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ flex: "0 0 140px", fontSize: 14, fontFamily: "'DM Sans'", color: t.textSecondary }}>{r.label}</span>
            <div style={{
              flex: 1, height: 8, borderRadius: 4, background: `${t.ringBg}66`, overflow: "hidden",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: `${pct}%`, height: "100%", borderRadius: 4,
                background: full ? `linear-gradient(90deg, ${t.success}, ${t.success}cc)` : `linear-gradient(90deg, ${t.success}, ${t.success}bb)`,
                boxShadow: full ? `0 0 8px ${t.success}44` : "none",
                transition: "width 700ms cubic-bezier(0.16, 1, 0.3, 1)"
              }} />
            </div>
            <span style={{ flex: "0 0 50px", textAlign: "right", fontSize: 14, fontFamily: "'JetBrains Mono'", color: t.textPrimary }}>{r.val}/{r.max}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── LIGHT THERAPY CHART ────────────────────────────────────────────
function LightChart({ days }) {
  return (
    <div>
      <div style={{ marginBottom: 16, fontFamily: "'DM Sans'", fontSize: 15, color: t.textPrimary }}>
        Today: <strong style={{ fontWeight: 600 }}>52 / 60 min</strong>
        <span style={{ color: t.textSecondary, fontSize: 13, marginLeft: 8 }}>(87% raw · 81% effective)</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 110 }}>
        {days.map((d, i) => {
          const maxH = 96;
          const actH = d.light !== null ? (d.light / 60) * maxH : 0;
          const pct = d.light !== null ? (d.light / 60) * 100 : 0;
          const color = d.status === "future" ? t.ringBg : pct >= 80 ? t.success : pct >= 50 ? t.warning : t.danger;
          const isFuture = d.status === "future";
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: maxH }}>
                <div style={{
                  width: 10, height: maxH, borderRadius: 5,
                  background: `${t.ringBg}${isFuture ? '44' : '66'}`,
                }} />
                {d.light !== null && (
                  <div style={{
                    width: 10, height: actH, borderRadius: 5,
                    background: `linear-gradient(to top, ${color}, ${color}cc)`,
                    boxShadow: pct >= 80 ? `0 0 6px ${color}33` : "none",
                    transition: "height 500ms cubic-bezier(0.16, 1, 0.3, 1)"
                  }} />
                )}
              </div>
              <span style={{ fontSize: 9, fontFamily: "'DM Sans'", color: t.textMuted }}>D{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SLEEP GANTT ────────────────────────────────────────────────────
function SleepGantt({ timeline }) {
  const timeToX = (str) => {
    const [h, m] = str.split(":").map(Number);
    let mins = h * 60 + m;
    if (mins < 480) mins += 1440;
    return ((mins - 1200) / 720) * 100;
  };
  const hours = [20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8];
  const targetStart = timeToX("22:30"), targetEnd = timeToX("07:00");
  const sorted = [...timeline].sort((a, b) => b.day - a.day);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, paddingLeft: 36 }}>
        {hours.map(h => (
          <span key={h} style={{ fontSize: 10, fontFamily: "'DM Sans'", color: t.textMuted, width: 36, textAlign: "center" }}>
            {String(h).padStart(2, "0")}:00
          </span>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        {/* Target zone */}
        <div style={{
          position: "absolute", left: `calc(36px + ${targetStart}%)`, width: `${targetEnd - targetStart}%`,
          top: 0, bottom: 0, background: t.accentSoft, opacity: 0.25, borderRadius: 8, pointerEvents: "none"
        }} />
        {sorted.map(day => (
          <div key={day.day} style={{ display: "flex", alignItems: "center", height: 28, marginBottom: 4 }}>
            <span style={{ width: 30, fontSize: 11, fontFamily: "'DM Sans'", color: t.textMuted, textAlign: "right", paddingRight: 6 }}>D{day.day}</span>
            <div style={{ flex: 1, position: "relative", height: 18 }}>
              {day.segments.map((seg, si) => {
                const left = timeToX(seg.start), right = timeToX(seg.end), w = right - left;
                const isSleep = seg.type === "sleep", isNap = seg.type === "nap", isWake = seg.type === "waking";
                return (
                  <div key={si} style={{
                    position: "absolute", left: `${left}%`, width: `${w}%`, top: 3, height: 12, borderRadius: 6,
                    background: isWake ? "transparent" : isNap ? `${t.warning}55` : t.chartLine,
                    opacity: isSleep ? 0.8 : 1,
                    boxShadow: isSleep ? `0 1px 4px ${t.chartLine}22` : "none"
                  }}>
                    {isWake && (
                      <div style={{
                        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                        width: 5, height: 5, borderRadius: "50%", background: t.danger
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SIDEBAR NAVIGATION ──────────────────────────────────────────────
function Sidebar({ trialDay, trialLength }) {
  const [active, setActive] = useState("health");

  // SVG icons (20x20 viewBox, stroke-based)
  const icons = {
    health: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <path d="M10 18s-7-5.5-7-10a4.5 4.5 0 0 1 7-3.5 4.5 4.5 0 0 1 7 3.5c0 4.5-7 10-7 10z"
          stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    sleep: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <path d="M17 12A5 5 0 1 1 7.5 5a7 7 0 0 0 9.5 7z"
          stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    light: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <circle cx={10} cy={10} r={3} stroke="currentColor" strokeWidth={1.5} fill="none" />
        <line x1={10} y1={2} x2={10} y2={4} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={10} y1={16} x2={10} y2={18} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={18} y1={10} x2={16} y2={10} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={4} y1={10} x2={2} y2={10} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={15.66} y1={4.34} x2={14.25} y2={5.75} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={5.75} y1={14.25} x2={4.34} y2={15.66} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={15.66} y1={15.66} x2={14.25} y2={14.25} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={5.75} y1={5.75} x2={4.34} y2={4.34} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    ),
    messages: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <path d="M3 5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5l-4 3v-3H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
          stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    settings: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <circle cx={10} cy={10} r={2.5} stroke="currentColor" strokeWidth={1.5} fill="none" />
        <path d="M10 1v2.5M10 16.5v2.5M19 10h-2.5M6.5 10h-2.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <path d="M15.66 4.34l-1.77 1.77M7.11 12.89l-1.77 1.77M15.66 15.66l-1.77-1.77M7.11 7.11l-1.77-1.77"
          stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    ),
  };

  const navItems = [
    { id: "health", label: "My health", icon: icons.health },
    { id: "sleep", label: "Sleep log", icon: icons.sleep },
    { id: "light", label: "Light therapy", icon: icons.light },
    { id: "messages", label: "Messages", icon: icons.messages },
    { id: "settings", label: "Settings", icon: icons.settings },
  ];

  const progressPercent = (trialDay / trialLength) * 100;

  return (
    <div style={{
      width: 200,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: t.glass,
      backdropFilter: t.blur,
      WebkitBackdropFilter: t.blur,
      borderRadius: t.radiusOuter,
      border: `1px solid ${t.glassBorder}`,
      boxShadow: `${t.glassShadow}, ${t.glassInset}`,
      padding: 16,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Specular highlight — top edge refraction */}
      <div style={{
        position: "absolute", top: 0, left: 16, right: 16, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 70%, transparent)",
        pointerEvents: "none"
      }} />

      {/* Header: Wordmark */}
      <div style={{
        fontSize: 18,
        fontFamily: "'DM Serif Display', serif",
        fontWeight: 400,
        color: t.textPrimary,
        marginBottom: 12,
      }}>
        Circadian
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, ${t.glassBorder}, transparent)`,
        marginBottom: 12,
      }} />

      {/* Trial Progress Section */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
          color: t.textSecondary,
          marginBottom: 8,
          fontWeight: 500,
        }}>
          Trial progress
        </div>
        <div style={{
          fontSize: 11,
          fontFamily: "'DM Sans', sans-serif",
          color: t.textMuted,
          marginBottom: 6,
        }}>
          Day {trialDay} of {trialLength}
        </div>
        {/* Progress bar */}
        <div style={{
          width: "100%",
          height: 4,
          borderRadius: 2,
          background: `${t.ringBg}66`,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: "100%",
            borderRadius: 2,
            background: t.accent,
            transition: "width 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }} />
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flex: 1,
      }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: t.radiusPill,
              border: "none",
              background: active === item.id ? t.accentSoft : "transparent",
              cursor: "pointer",
              transition: "background 200ms ease",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (active !== item.id) {
                e.currentTarget.style.background = `${t.accentSoft}44`;
              }
            }}
            onMouseLeave={(e) => {
              if (active !== item.id) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {/* Icon */}
            <div style={{
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: active === item.id ? t.accent : t.textMuted,
              transition: "color 200ms ease",
            }}>
              {item.icon}
            </div>
            {/* Label */}
            <span style={{
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              color: active === item.id ? t.textPrimary : t.textMuted,
              fontWeight: active === item.id ? 500 : 400,
              transition: "color 200ms ease",
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Avatar at bottom */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 12,
        paddingTop: 12,
        borderTop: `1px solid ${t.glassBorder}`,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: t.accentSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          color: t.accent,
        }}>
          S
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────
export default function OptionAFullPicture() {
  return (
    <div style={{
      width: 1194, height: 834,
      background: `linear-gradient(135deg, #FAFAF7 0%, #F0EDE4 50%, #E8E4DA 100%)`,
      fontFamily: "'DM Sans', sans-serif",
      overflow: "hidden",
      position: "relative",
      display: "flex",
    }}>
      <style>{globalCSS}</style>

      {/* Ambient background orbs — soft light refraction */}
      <div style={{
        position: "fixed", top: -120, right: -80, width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(232,168,56,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />
      <div style={{
        position: "fixed", bottom: -100, left: -60, width: 350, height: 350,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(76,175,130,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />

      {/* Sidebar */}
      <div style={{
        padding: 24,
        paddingRight: 12,
        display: "flex",
        flexDirection: "column",
        zIndex: 2,
      }}>
        <Sidebar trialDay={DATA.patient.trialDay} trialLength={DATA.patient.trialLength} />
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        zIndex: 1,
      }}>
        {/* Content Header */}
        <div style={{
          padding: "24px 48px",
          paddingBottom: 0,
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}>
          <h1 style={{
            fontSize: 28,
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            color: t.textPrimary,
            marginBottom: 24,
          }}>
            My health
          </h1>
        </div>

        {/* Scrollable Content */}
        <div style={{
          padding: "0 48px 48px",
          flex: 1,
          overflow: "auto",
          position: "relative",
        }}>
          {/* Top Row: Score + Trend */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <GlassCard title="Circadian score" delay={100}>
              <RadialGauge score={DATA.today.circadianScore} change={DATA.today.scoreChange} />
            </GlassCard>
            <GlassCard title="14-day trend" delay={200}>
              <TrendChart days={DATA.last14Days} />
            </GlassCard>
          </div>

          {/* Score Breakdown */}
          <GlassCard title="Score breakdown" delay={300} style={{ marginBottom: 20 }}>
            <ScoreBreakdown b={DATA.scoreBreakdown} />
          </GlassCard>

          {/* Light Therapy */}
          <GlassCard title="Light therapy" delay={400} style={{ marginBottom: 20 }}>
            <LightChart days={DATA.last14Days} />
          </GlassCard>

          {/* Sleep Pattern */}
          <GlassCard title="Sleep pattern" delay={500} style={{ marginBottom: 20 }}>
            <SleepGantt timeline={DATA.sleepTimeline} />
          </GlassCard>
        </div>
      </div>

      {/* iOS 26 scroll edge blur — bottom gradient */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: 48,
        background: "linear-gradient(to top, rgba(250,250,247,0.9), transparent)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        pointerEvents: "none", zIndex: 10
      }} />
    </div>
  );
}
