import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD V1: THE QUEST MAP
// Journey-focused — Visual path with waypoints, daily quests,
// SuperBetter power-ups, and milestone celebrations
// ═══════════════════════════════════════════════════════════════════
// DESIGN PHILOSOPHY:
// The trial IS a quest. Each day is a waypoint on a winding path.
// Streaks are shown as consecutive lit waypoints (torch metaphor).
// Power-ups celebrate what's going RIGHT (SuperBetter).
// Bad guys are externalized obstacles to battle, not personal failures.
// The dashboard answers: "Where am I on my journey?"

const DATA = {
  patient: { name: "Sarah", trialDay: 9, trialLength: 21 },
  today: {
    circadianScore: 74, scoreChange: +3,
    lightMinutes: 52, lightPrescribed: 60, lightEffectivePercent: 81, lightRawPercent: 87,
    bedtimeTarget: "22:30", bedtimeActual: "23:15", bedtimeDeviationMin: 45,
    wakeTarget: "07:00", wakeActual: "07:10", wakeDeviationMin: 10,
    naps: 0, nightWakings: 1, nightWakingDurationMin: 12,
    quest: "Start your light session before 9:30am tomorrow",
    powerUp: "Your wake time was spot on today!",
    badGuy: "Late bedtime crept in — battle it tonight"
  },
  streak: { current: 5, best: 7 },
  last14Days: [
    { day: 1, date: "02-20", score: 45, light: 30, status: "partial" },
    { day: 2, date: "02-21", score: 52, light: 42, status: "partial" },
    { day: 3, date: "02-22", score: 48, light: 25, status: "missed" },
    { day: 4, date: "02-23", score: 61, light: 55, status: "partial" },
    { day: 5, date: "02-24", score: 58, light: 48, status: "partial" },
    { day: 6, date: "02-25", score: 65, light: 58, status: "hit" },
    { day: 7, date: "02-26", score: 70, light: 60, status: "hit" },
    { day: 8, date: "02-27", score: 68, light: 55, status: "partial" },
    { day: 9, date: "02-28", score: 74, light: 52, status: "hit" },
    { day: 10, date: "03-01", score: null, light: null, status: "future" },
    { day: 11, date: "03-02", score: null, light: null, status: "future" },
    { day: 12, date: "03-03", score: null, light: null, status: "future" },
    { day: 13, date: "03-04", score: null, light: null, status: "future" },
    { day: 14, date: "03-05", score: null, light: null, status: "future" },
  ],
  scoreBreakdown: {
    lightTherapy: 43, lightTherapyMax: 50,
    noNapping: 10, noNappingMax: 10,
    noNightWakings: 5, noNightWakingsMax: 10,
    consistentBedtime: 6, consistentBedtimeMax: 10,
    consistentWakeTime: 10, consistentWakeTimeMax: 10
  },
  milestones: [
    { day: 1, label: "First light", reached: true },
    { day: 7, label: "One week strong", reached: true },
    { day: 14, label: "Halfway hero", reached: false },
    { day: 21, label: "Trial complete", reached: false },
  ]
};

const t = {
  bg: "#FAFAF7", surface: "rgba(255, 255, 255, 0.55)",
  textPrimary: "#1A1A1A", textSecondary: "#6B6B6B", textMuted: "#9C9C9C",
  accent: "#E8A838", accentSoft: "#FFF3D6",
  success: "#4CAF82", successSoft: "#E8F5E9",
  warning: "#E8A838", danger: "#D4785C", dangerSoft: "#FDEAE4",
  chartLine: "#2D7A5F", chartFill: "rgba(45, 122, 95, 0.08)",
  ringBg: "#EAEAEA",
  glass: "rgba(255, 255, 255, 0.42)", glassBorder: "rgba(255, 255, 255, 0.65)",
  glassShadow: "0 2px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03)",
  glassInset: "inset 0 1px 1px rgba(255,255,255,0.6)",
  blur: "blur(20px) saturate(180%)",
  radiusOuter: 24, radiusInner: 16, radiusPill: 9999,
  // Quest-specific
  pathColor: "#D4C5A9",
  pathLit: "#E8A838",
  questPurple: "#7C6BC4",
  questPurpleSoft: "#EDE8FA",
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; background: transparent; }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(232,168,56,0.3); } 50% { box-shadow: 0 0 16px rgba(232,168,56,0.5); } }
`;

function GlassCard({ title, icon, children, style, delay = 0 }) {
  return (
    <div style={{
      background: t.glass, backdropFilter: t.blur, WebkitBackdropFilter: t.blur,
      borderRadius: t.radiusOuter, border: `1px solid ${t.glassBorder}`,
      boxShadow: `${t.glassShadow}, ${t.glassInset}`,
      padding: 24, position: "relative", overflow: "hidden",
      animation: `fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
      ...style,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 24, right: 24, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 70%, transparent)",
        pointerEvents: "none"
      }} />
      {title && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          color: t.textSecondary, marginBottom: 16, letterSpacing: "0.01em"
        }}>
          {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── JOURNEY PATH ─────────────────────────────────────────────────
// Visual winding path showing all 21 days as waypoints
function JourneyPath({ days, milestones, currentDay, streak }) {
  const totalDays = 21;
  const pointsPerRow = 7;
  const rows = Math.ceil(totalDays / pointsPerRow);

  const getWaypointPos = (dayNum) => {
    const row = Math.floor((dayNum - 1) / pointsPerRow);
    const col = (dayNum - 1) % pointsPerRow;
    const reversed = row % 2 === 1;
    const actualCol = reversed ? (pointsPerRow - 1 - col) : col;
    const x = 40 + actualCol * 80;
    const y = 36 + row * 70;
    return { x, y };
  };

  const getDayData = (dayNum) => {
    return days.find(d => d.day === dayNum) || { day: dayNum, score: null, status: "future" };
  };

  // Build path segments
  const pathPoints = [];
  for (let d = 1; d <= totalDays; d++) {
    pathPoints.push(getWaypointPos(d));
  }

  let pathD = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
  for (let i = 1; i < pathPoints.length; i++) {
    const prev = pathPoints[i - 1];
    const curr = pathPoints[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.5;
    const cpx2 = prev.x + (curr.x - prev.x) * 0.5;
    pathD += ` C ${cpx1} ${prev.y} ${cpx2} ${curr.y} ${curr.x} ${curr.y}`;
  }

  // Streak glow: last N completed waypoints
  const streakStart = currentDay - streak + 1;

  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height={rows * 70 + 20} viewBox={`0 0 600 ${rows * 70 + 20}`}>
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={t.pathLit} />
            <stop offset="100%" stopColor={t.pathColor} />
          </linearGradient>
          <filter id="waypointGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background path */}
        <path d={pathD} fill="none" stroke={t.pathColor} strokeWidth={3} strokeLinecap="round" opacity={0.4} />

        {/* Lit path up to current day */}
        {(() => {
          const litPoints = pathPoints.slice(0, currentDay);
          if (litPoints.length < 2) return null;
          let litD = `M ${litPoints[0].x} ${litPoints[0].y}`;
          for (let i = 1; i < litPoints.length; i++) {
            const prev = litPoints[i - 1];
            const curr = litPoints[i];
            const cpx1 = prev.x + (curr.x - prev.x) * 0.5;
            const cpx2 = prev.x + (curr.x - prev.x) * 0.5;
            litD += ` C ${cpx1} ${prev.y} ${cpx2} ${curr.y} ${curr.x} ${curr.y}`;
          }
          return <path d={litD} fill="none" stroke={t.pathLit} strokeWidth={3} strokeLinecap="round" opacity={0.8} />;
        })()}

        {/* Waypoints */}
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNum = i + 1;
          const pos = getWaypointPos(dayNum);
          const data = getDayData(dayNum);
          const isCurrent = dayNum === currentDay;
          const isPast = dayNum < currentDay;
          const isFuture = dayNum > currentDay;
          const isInStreak = dayNum >= streakStart && dayNum <= currentDay;
          const milestone = milestones.find(m => m.day === dayNum);

          let fillColor = t.ringBg;
          if (data.status === "hit") fillColor = t.success;
          else if (data.status === "partial") fillColor = t.warning;
          else if (data.status === "missed") fillColor = t.danger;
          else if (isFuture) fillColor = `${t.ringBg}66`;

          const radius = isCurrent ? 14 : milestone ? 12 : 8;

          return (
            <g key={dayNum}>
              {/* Streak glow ring */}
              {isInStreak && isPast && (
                <circle cx={pos.x} cy={pos.y} r={radius + 4} fill="none" stroke={t.pathLit} strokeWidth={2} opacity={0.4} />
              )}
              {/* Current day pulse */}
              {isCurrent && (
                <circle cx={pos.x} cy={pos.y} r={18} fill="none" stroke={t.accent} strokeWidth={2} opacity={0.3}>
                  <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Waypoint circle */}
              <circle
                cx={pos.x} cy={pos.y} r={radius}
                fill={isCurrent ? t.accent : fillColor}
                stroke={isCurrent ? t.accent : "rgba(255,255,255,0.6)"}
                strokeWidth={isCurrent ? 3 : 1.5}
                filter={isCurrent ? "url(#waypointGlow)" : undefined}
              />
              {/* Day label */}
              <text
                x={pos.x} y={pos.y + (isCurrent ? 1 : 0.5)}
                textAnchor="middle" dominantBaseline="central"
                style={{
                  fontSize: isCurrent ? 11 : milestone ? 10 : 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: isCurrent ? 700 : 500,
                  fill: (isCurrent || data.status === "hit") ? "#fff" : data.status === "missed" ? "#fff" : t.textSecondary,
                }}
              >
                {dayNum}
              </text>
              {/* Milestone flag */}
              {milestone && (
                <text
                  x={pos.x} y={pos.y + radius + 14}
                  textAnchor="middle"
                  style={{ fontSize: 9, fontFamily: "'DM Sans'", fill: milestone.reached ? t.accent : t.textMuted, fontWeight: 500 }}
                >
                  {milestone.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── SCORE GAUGE (compact) ────────────────────────────────────────
function ScoreGauge({ score, change }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let start = null;
    const dur = 900;
    const run = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setAnim(Math.round(e * score));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [score]);

  const size = 120, cx = 60, cy = 55, r = 40, sw = 8;
  const arc = (from, to) => {
    const x1 = cx + r * Math.cos(from), y1 = cy - r * Math.sin(from);
    const x2 = cx + r * Math.cos(to), y2 = cy - r * Math.sin(to);
    const large = Math.abs(from - to) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const fillEnd = Math.PI - (anim / 100) * Math.PI;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={size} height={70} viewBox="0 0 120 70">
        <defs>
          <linearGradient id="gaugeG1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={t.danger} />
            <stop offset="45%" stopColor={t.warning} />
            <stop offset="100%" stopColor={t.success} />
          </linearGradient>
        </defs>
        <path d={arc(Math.PI, 0)} fill="none" stroke={t.ringBg} strokeWidth={sw} strokeLinecap="round" opacity={0.4} />
        <path d={arc(Math.PI, fillEnd)} fill="none" stroke="url(#gaugeG1)" strokeWidth={sw} strokeLinecap="round" />
        <text x={cx} y={cy - 2} textAnchor="middle" style={{ fontSize: 32, fontFamily: "'DM Serif Display', serif", fill: t.textPrimary }}>{anim}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontSize: 10, fontFamily: "'DM Sans'", fill: t.textSecondary }}>of 100</text>
      </svg>
      <div>
        <div style={{ fontSize: 14, fontFamily: "'DM Sans'", fontWeight: 600, color: t.success }}>+{change} from yesterday</div>
        <div style={{ fontSize: 12, color: t.textMuted, fontFamily: "'DM Sans'", marginTop: 2 }}>Circadian score</div>
      </div>
    </div>
  );
}

// ─── STREAK TORCH ─────────────────────────────────────────────────
function StreakTorch({ current, best }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: `linear-gradient(135deg, ${t.accent}, #F0C060)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 12px ${t.accent}44`,
        animation: current >= 3 ? "glow 2s ease-in-out infinite" : "none",
      }}>
        <span style={{ fontSize: 24 }}>🔥</span>
      </div>
      <div>
        <div style={{ fontSize: 28, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, lineHeight: 1 }}>{current}</div>
        <div style={{ fontSize: 11, fontFamily: "'DM Sans'", color: t.textMuted }}>day streak · best: {best}</div>
      </div>
    </div>
  );
}

// ─── QUEST CARD ───────────────────────────────────────────────────
function QuestCard({ quest, powerUp, badGuy }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Today's Quest */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12, padding: 14,
        background: t.questPurpleSoft, borderRadius: t.radiusInner,
      }}>
        <span style={{ fontSize: 20, marginTop: 1 }}>⚔️</span>
        <div>
          <div style={{ fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 600, color: t.questPurple, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Today's Quest</div>
          <div style={{ fontSize: 14, fontFamily: "'DM Sans'", color: t.textPrimary, lineHeight: 1.4 }}>{quest}</div>
        </div>
      </div>
      {/* Power-up */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12, padding: 14,
        background: t.successSoft, borderRadius: t.radiusInner,
      }}>
        <span style={{ fontSize: 20, marginTop: 1 }}>⚡</span>
        <div>
          <div style={{ fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 600, color: t.success, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Power-up activated</div>
          <div style={{ fontSize: 14, fontFamily: "'DM Sans'", color: t.textPrimary, lineHeight: 1.4 }}>{powerUp}</div>
        </div>
      </div>
      {/* Bad Guy */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12, padding: 14,
        background: t.dangerSoft, borderRadius: t.radiusInner,
      }}>
        <span style={{ fontSize: 20, marginTop: 1 }}>👾</span>
        <div>
          <div style={{ fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 600, color: t.danger, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Bad Guy spotted</div>
          <div style={{ fontSize: 14, fontFamily: "'DM Sans'", color: t.textPrimary, lineHeight: 1.4 }}>{badGuy}</div>
        </div>
      </div>
    </div>
  );
}

// ─── SCORE BREAKDOWN ──────────────────────────────────────────────
function ScoreBreakdown({ b }) {
  const rows = [
    { label: "Light therapy", val: b.lightTherapy, max: b.lightTherapyMax, icon: "☀️" },
    { label: "No napping", val: b.noNapping, max: b.noNappingMax, icon: "🚫" },
    { label: "No night wakings", val: b.noNightWakings, max: b.noNightWakingsMax, icon: "🌙" },
    { label: "Bedtime timing", val: b.consistentBedtime, max: b.consistentBedtimeMax, icon: "🛏️" },
    { label: "Wake timing", val: b.consistentWakeTime, max: b.consistentWakeTimeMax, icon: "⏰" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r, i) => {
        const pct = (r.val / r.max) * 100;
        const full = pct >= 100;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{r.icon}</span>
            <span style={{ flex: "0 0 120px", fontSize: 13, fontFamily: "'DM Sans'", color: t.textSecondary }}>{r.label}</span>
            <div style={{
              flex: 1, height: 6, borderRadius: 3, background: `${t.ringBg}66`, overflow: "hidden",
            }}>
              <div style={{
                width: `${pct}%`, height: "100%", borderRadius: 3,
                background: full ? t.success : pct >= 50 ? t.warning : t.danger,
                transition: "width 700ms cubic-bezier(0.16, 1, 0.3, 1)"
              }} />
            </div>
            <span style={{ flex: "0 0 42px", textAlign: "right", fontSize: 12, fontFamily: "'JetBrains Mono'", color: t.textPrimary }}>{r.val}/{r.max}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── MINI TREND ───────────────────────────────────────────────────
function MiniTrend({ days }) {
  const chartData = days.filter(d => d.score !== null).map(d => ({ name: `D${d.day}`, score: d.score }));
  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.chartLine} stopOpacity={0.15} />
            <stop offset="100%" stopColor={t.chartLine} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.textMuted, fontFamily: "'DM Sans'" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} hide />
        <Area type="monotone" dataKey="score" stroke={t.chartLine} strokeWidth={2} fill="url(#miniGrad)" dot={{ r: 3, fill: t.chartLine, stroke: "#fff", strokeWidth: 1.5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────
function Sidebar({ trialDay, trialLength }) {
  const [active, setActive] = useState("journey");
  const navItems = [
    { id: "journey", label: "My journey", icon: "🗺️" },
    { id: "health", label: "My health", icon: "❤️" },
    { id: "light", label: "Light therapy", icon: "☀️" },
    { id: "sleep", label: "Sleep log", icon: "🌙" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];
  const progressPercent = (trialDay / trialLength) * 100;

  return (
    <div style={{
      width: 200, height: "100%", display: "flex", flexDirection: "column",
      background: t.glass, backdropFilter: t.blur, WebkitBackdropFilter: t.blur,
      borderRadius: t.radiusOuter, border: `1px solid ${t.glassBorder}`,
      boxShadow: `${t.glassShadow}, ${t.glassInset}`,
      padding: 16, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 16, right: 16, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 70%, transparent)", pointerEvents: "none" }} />
      <div style={{ fontSize: 18, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, marginBottom: 12 }}>Circadian</div>
      <div style={{ height: 1, background: `linear-gradient(90deg, ${t.glassBorder}, transparent)`, marginBottom: 12 }} />
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontFamily: "'DM Sans'", color: t.textSecondary, marginBottom: 8, fontWeight: 500 }}>Quest progress</div>
        <div style={{ fontSize: 11, fontFamily: "'DM Sans'", color: t.textMuted, marginBottom: 6 }}>Day {trialDay} of {trialLength}</div>
        <div style={{ width: "100%", height: 4, borderRadius: 2, background: `${t.ringBg}66`, overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${t.accent}, ${t.success})`, transition: "width 500ms" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            borderRadius: t.radiusPill, border: "none",
            background: active === item.id ? t.accentSoft : "transparent",
            cursor: "pointer", transition: "background 200ms",
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 13, fontFamily: "'DM Sans'", color: active === item.id ? t.textPrimary : t.textMuted, fontWeight: active === item.id ? 500 : 400 }}>{item.label}</span>
          </button>
        ))}
      </div>
      {/* Start session CTA */}
      <button style={{
        width: "100%", padding: "12px 0", borderRadius: t.radiusPill, border: "none",
        background: `linear-gradient(135deg, ${t.accent}, #F0C060)`, color: "#fff",
        fontSize: 14, fontFamily: "'DM Sans'", fontWeight: 600, cursor: "pointer",
        boxShadow: `0 4px 12px ${t.accent}44`, marginTop: 12,
      }}>
        Start session
      </button>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function DashboardV1QuestMap() {
  return (
    <div style={{
      width: 1194, height: 834,
      background: "linear-gradient(135deg, #FAFAF7 0%, #F0EDE4 50%, #E8E4DA 100%)",
      fontFamily: "'DM Sans', sans-serif", overflow: "hidden", position: "relative", display: "flex",
    }}>
      <style>{globalCSS}</style>
      <div style={{ position: "fixed", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,168,56,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,175,130,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Sidebar */}
      <div style={{ padding: 24, paddingRight: 12, display: "flex", flexDirection: "column", zIndex: 2 }}>
        <Sidebar trialDay={DATA.patient.trialDay} trialLength={DATA.patient.trialLength} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", zIndex: 1 }}>
        <div style={{ padding: "24px 40px", paddingBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 28, fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: t.textPrimary }}>My journey</h1>
              <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 4, fontFamily: "'DM Sans'" }}>Day 9 of your quest — you're building momentum</p>
            </div>
            <StreakTorch current={DATA.streak.current} best={DATA.streak.best} />
          </div>
        </div>

        <div style={{ padding: "0 40px 48px", flex: 1, overflow: "auto" }}>
          {/* Journey Path — the hero section */}
          <GlassCard title="Quest map" icon="🗺️" delay={100} style={{ marginBottom: 20 }}>
            <JourneyPath days={DATA.last14Days} milestones={DATA.milestones} currentDay={DATA.patient.trialDay} streak={DATA.streak.current} />
          </GlassCard>

          {/* Two columns: Score + Quests */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <GlassCard title="Today's score" icon="📊" delay={200}>
                <ScoreGauge score={DATA.today.circadianScore} change={DATA.today.scoreChange} />
              </GlassCard>
              <GlassCard title="Score trend" icon="📈" delay={300}>
                <MiniTrend days={DATA.last14Days} />
              </GlassCard>
            </div>
            <GlassCard title="Quests & battles" icon="⚔️" delay={250}>
              <QuestCard quest={DATA.today.quest} powerUp={DATA.today.powerUp} badGuy={DATA.today.badGuy} />
            </GlassCard>
          </div>

          {/* Score Breakdown */}
          <GlassCard title="Score breakdown" icon="🧩" delay={400} style={{ marginBottom: 20 }}>
            <ScoreBreakdown b={DATA.scoreBreakdown} />
          </GlassCard>
        </div>
      </div>

      {/* Bottom blur */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 48, background: "linear-gradient(to top, rgba(250,250,247,0.9), transparent)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", pointerEvents: "none", zIndex: 10 }} />
    </div>
  );
}
