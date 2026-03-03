import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD V1: THE QUEST MAP — FundFlow Visual Style
// Journey-focused — Visual path with waypoints, daily quests,
// SuperBetter power-ups, and milestone celebrations
// ═══════════════════════════════════════════════════════════════════

const DATA = {
  patient: { name: "Sarah", trialDay: 9, trialLength: 21 },
  today: {
    circadianScore: 74, scoreChange: +3,
    lightMinutes: 52, lightPrescribed: 60, lightEffectivePercent: 81, lightRawPercent: 87,
    bedtimeDeviationMin: 45, wakeDeviationMin: 10,
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
    { day: 7, label: "One week", reached: true },
    { day: 14, label: "Halfway", reached: false },
    { day: 21, label: "Complete!", reached: false },
  ]
};

// ─── DESIGN TOKENS (FundFlow-inspired) ────────────────────────────
const t = {
  // Background
  pageBg: "#F0EAFA",
  // Sidebar
  sidebarBg: "#1A1040",
  sidebarText: "rgba(255,255,255,0.55)",
  sidebarTextActive: "#FFFFFF",
  sidebarAccent: "#7C5CFC",
  sidebarHover: "rgba(124,92,252,0.12)",
  // Cards
  cardBg: "#FFFFFF",
  cardShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)",
  cardRadius: 20,
  // Text
  textPrimary: "#1A1040",
  textSecondary: "#6E6893",
  textMuted: "#A09ABF",
  // Accents
  purple: "#7C5CFC",
  purpleSoft: "#EDE8FF",
  purpleGlow: "rgba(124,92,252,0.15)",
  blue: "#5B8DEF",
  blueSoft: "#E3EDFD",
  green: "#34C77B",
  greenSoft: "#E0F9EC",
  orange: "#F5A623",
  orangeSoft: "#FFF3D6",
  red: "#EF5B5B",
  redSoft: "#FDEAEA",
  // Chart
  chartLine: "#7C5CFC",
  chartFill: "rgba(124,92,252,0.08)",
  // Misc
  border: "#EEEAF5",
  divider: "#F0ECF8",
  ringBg: "#EEEAF5",
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; background: transparent; }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 12px rgba(124,92,252,0.25); } 50% { box-shadow: 0 0 24px rgba(124,92,252,0.4); } }
`;

// ─── CARD ─────────────────────────────────────────────────────────
function Card({ title, badge, children, style, delay = 0 }) {
  return (
    <div style={{
      background: t.cardBg,
      borderRadius: t.cardRadius,
      boxShadow: t.cardShadow,
      padding: 24,
      animation: `fadeSlideIn 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
      ...style,
    }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: t.textSecondary }}>{title}</span>
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── JOURNEY PATH ─────────────────────────────────────────────────
function JourneyPath({ days, milestones, currentDay, streak }) {
  const totalDays = 21;
  const pointsPerRow = 7;
  const rows = Math.ceil(totalDays / pointsPerRow);

  const getPos = (dayNum) => {
    const row = Math.floor((dayNum - 1) / pointsPerRow);
    const col = (dayNum - 1) % pointsPerRow;
    const reversed = row % 2 === 1;
    const actualCol = reversed ? (pointsPerRow - 1 - col) : col;
    return { x: 44 + actualCol * 76, y: 36 + row * 68 };
  };

  const getDayData = (dayNum) => days.find(d => d.day === dayNum) || { day: dayNum, score: null, status: "future" };

  const pathPoints = Array.from({ length: totalDays }, (_, i) => getPos(i + 1));
  let pathD = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
  for (let i = 1; i < pathPoints.length; i++) {
    const prev = pathPoints[i - 1], curr = pathPoints[i];
    pathD += ` C ${prev.x + (curr.x - prev.x) * 0.5} ${prev.y} ${prev.x + (curr.x - prev.x) * 0.5} ${curr.y} ${curr.x} ${curr.y}`;
  }

  const litPoints = pathPoints.slice(0, currentDay);
  let litD = litPoints.length >= 2 ? `M ${litPoints[0].x} ${litPoints[0].y}` : "";
  for (let i = 1; i < litPoints.length; i++) {
    const prev = litPoints[i - 1], curr = litPoints[i];
    litD += ` C ${prev.x + (curr.x - prev.x) * 0.5} ${prev.y} ${prev.x + (curr.x - prev.x) * 0.5} ${curr.y} ${curr.x} ${curr.y}`;
  }

  const streakStart = currentDay - streak + 1;

  return (
    <svg width="100%" height={rows * 68 + 24} viewBox={`0 0 580 ${rows * 68 + 24}`}>
      <defs>
        <linearGradient id="pathGradV1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={t.purple} />
          <stop offset="100%" stopColor={t.blue} />
        </linearGradient>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* BG path */}
      <path d={pathD} fill="none" stroke={t.ringBg} strokeWidth={3} strokeLinecap="round" />
      {/* Lit path */}
      {litD && <path d={litD} fill="none" stroke="url(#pathGradV1)" strokeWidth={3} strokeLinecap="round" />}

      {Array.from({ length: totalDays }, (_, i) => {
        const dayNum = i + 1;
        const pos = getPos(dayNum);
        const data = getDayData(dayNum);
        const isCurrent = dayNum === currentDay;
        const isPast = dayNum < currentDay;
        const isFuture = dayNum > currentDay;
        const isInStreak = dayNum >= streakStart && dayNum <= currentDay;
        const milestone = milestones.find(m => m.day === dayNum);

        let fill = t.ringBg;
        if (data.status === "hit") fill = t.green;
        else if (data.status === "partial") fill = t.orange;
        else if (data.status === "missed") fill = t.red;
        else if (isFuture) fill = "#E8E4F2";

        const r = isCurrent ? 14 : milestone ? 12 : 8;

        return (
          <g key={dayNum}>
            {isInStreak && isPast && <circle cx={pos.x} cy={pos.y} r={r + 5} fill="none" stroke={t.purple} strokeWidth={1.5} opacity={0.3} />}
            {isCurrent && (
              <circle cx={pos.x} cy={pos.y} r={20} fill="none" stroke={t.purple} strokeWidth={2} opacity={0.2}>
                <animate attributeName="r" values="20;24;20" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.06;0.2" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={pos.x} cy={pos.y} r={r} fill={isCurrent ? t.purple : fill}
              stroke={isCurrent ? t.purple : "#fff"} strokeWidth={isCurrent ? 3 : 2}
              filter={isCurrent ? "url(#nodeGlow)" : undefined} />
            <text x={pos.x} y={pos.y + 0.5} textAnchor="middle" dominantBaseline="central"
              style={{
                fontSize: isCurrent ? 11 : milestone ? 10 : 8,
                fontFamily: "'Inter', sans-serif", fontWeight: isCurrent ? 700 : 600,
                fill: (isCurrent || data.status === "hit" || data.status === "missed") ? "#fff" : t.textSecondary,
              }}>
              {dayNum}
            </text>
            {milestone && (
              <text x={pos.x} y={pos.y + r + 14} textAnchor="middle"
                style={{ fontSize: 9, fontFamily: "'Inter'", fill: milestone.reached ? t.purple : t.textMuted, fontWeight: 600 }}>
                {milestone.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── SCORE GAUGE ──────────────────────────────────────────────────
function ScoreGauge({ score, change }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let start = null;
    const run = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 900, 1);
      setAnim(Math.round((1 - Math.pow(1 - p, 4)) * score));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [score]);

  const cx = 60, cy = 55, r = 40, sw = 10;
  const arc = (from, to) => {
    const x1 = cx + r * Math.cos(from), y1 = cy - r * Math.sin(from);
    const x2 = cx + r * Math.cos(to), y2 = cy - r * Math.sin(to);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${Math.abs(from - to) > Math.PI ? 1 : 0} 1 ${x2} ${y2}`;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={120} height={72} viewBox="0 0 120 72">
        <defs>
          <linearGradient id="gaugeGV1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={t.red} />
            <stop offset="50%" stopColor={t.orange} />
            <stop offset="100%" stopColor={t.green} />
          </linearGradient>
        </defs>
        <path d={arc(Math.PI, 0)} fill="none" stroke={t.ringBg} strokeWidth={sw} strokeLinecap="round" />
        <path d={arc(Math.PI, Math.PI - (anim / 100) * Math.PI)} fill="none" stroke="url(#gaugeGV1)" strokeWidth={sw} strokeLinecap="round" />
        <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: 30, fontFamily: "'Inter'", fontWeight: 800, fill: t.textPrimary }}>{anim}</text>
        <text x={cx} y={cy + 13} textAnchor="middle" style={{ fontSize: 10, fontFamily: "'Inter'", fill: t.textMuted, fontWeight: 500 }}>of 100</text>
      </svg>
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: t.greenSoft }}>
          <span style={{ fontSize: 12, fontFamily: "'Inter'", fontWeight: 600, color: t.green }}>↑ +{change}</span>
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Inter'", marginTop: 6 }}>Circadian score</div>
      </div>
    </div>
  );
}

// ─── STREAK BADGE ─────────────────────────────────────────────────
function StreakBadge({ current, best }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 18px", borderRadius: 16,
      background: `linear-gradient(135deg, ${t.purple}, #9B7EFC)`,
      boxShadow: `0 4px 16px ${t.purpleGlow}`,
    }}>
      <span style={{ fontSize: 24 }}>🔥</span>
      <div>
        <div style={{ fontSize: 22, fontFamily: "'Inter'", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{current}</div>
        <div style={{ fontSize: 11, fontFamily: "'Inter'", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>day streak · best {best}</div>
      </div>
    </div>
  );
}

// ─── QUEST CARD ───────────────────────────────────────────────────
function QuestCard({ quest, powerUp, badGuy }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 16, background: t.purpleSoft, borderRadius: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.purple}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 18 }}>⚔️</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontFamily: "'Inter'", fontWeight: 700, color: t.purple, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Today's Quest</div>
          <div style={{ fontSize: 14, fontFamily: "'Inter'", color: t.textPrimary, lineHeight: 1.5, fontWeight: 500 }}>{quest}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 16, background: t.greenSoft, borderRadius: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.green}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 18 }}>⚡</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontFamily: "'Inter'", fontWeight: 700, color: t.green, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Power-up</div>
          <div style={{ fontSize: 14, fontFamily: "'Inter'", color: t.textPrimary, lineHeight: 1.5, fontWeight: 500 }}>{powerUp}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 16, background: t.redSoft, borderRadius: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.red}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 18 }}>👾</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontFamily: "'Inter'", fontWeight: 700, color: t.red, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Bad Guy</div>
          <div style={{ fontSize: 14, fontFamily: "'Inter'", color: t.textPrimary, lineHeight: 1.5, fontWeight: 500 }}>{badGuy}</div>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {rows.map((r, i) => {
        const pct = (r.val / r.max) * 100;
        const full = pct >= 100;
        const color = full ? t.green : pct >= 50 ? t.orange : t.red;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13 }}>{r.icon}</span>
            </div>
            <span style={{ flex: "0 0 110px", fontSize: 13, fontFamily: "'Inter'", color: t.textSecondary, fontWeight: 500 }}>{r.label}</span>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: t.ringBg, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: "width 700ms cubic-bezier(0.16, 1, 0.3, 1)" }} />
            </div>
            <span style={{ flex: "0 0 44px", textAlign: "right", fontSize: 13, fontFamily: "'JetBrains Mono'", fontWeight: 500, color: t.textPrimary }}>{r.val}/{r.max}</span>
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
          <linearGradient id="trendGradV1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.purple} stopOpacity={0.15} />
            <stop offset="100%" stopColor={t.purple} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.textMuted, fontFamily: "'Inter'" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} hide />
        <Area type="monotone" dataKey="score" stroke={t.purple} strokeWidth={2.5} fill="url(#trendGradV1)" dot={{ r: 3, fill: t.purple, stroke: "#fff", strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────
function Sidebar({ trialDay, trialLength }) {
  const [active, setActive] = useState("journey");
  const navItems = [
    { id: "journey", label: "My Journey" },
    { id: "health", label: "My Health" },
    { id: "light", label: "Light Therapy" },
    { id: "sleep", label: "Sleep Log" },
    { id: "messages", label: "Messages" },
  ];
  const progress = (trialDay / trialLength) * 100;

  return (
    <div style={{
      width: 220, height: "100%", display: "flex", flexDirection: "column",
      background: t.sidebarBg, borderRadius: 24, padding: 20,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${t.purple}, #9B7EFC)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16 }}>☀️</span>
        </div>
        <span style={{ fontSize: 17, fontFamily: "'Inter'", fontWeight: 700, color: "#fff" }}>Circadian</span>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 28, padding: "14px 16px", borderRadius: 14, background: "rgba(124,92,252,0.1)" }}>
        <div style={{ fontSize: 11, fontFamily: "'Inter'", color: t.sidebarText, fontWeight: 500, marginBottom: 8 }}>Quest Progress</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontFamily: "'Inter'", fontWeight: 800, color: "#fff" }}>Day {trialDay}</span>
          <span style={{ fontSize: 12, color: t.sidebarText }}>/ {trialLength}</span>
        </div>
        <div style={{ width: "100%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.1)" }}>
          <div style={{ width: `${progress}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${t.purple}, #9B7EFC)` }} />
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
            borderRadius: 12, border: "none", cursor: "pointer",
            background: active === item.id ? t.sidebarHover : "transparent",
            transition: "background 150ms",
          }}>
            <span style={{
              fontSize: 14, fontFamily: "'Inter'", fontWeight: active === item.id ? 600 : 500,
              color: active === item.id ? t.sidebarTextActive : t.sidebarText,
            }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* CTA */}
      <button style={{
        width: "100%", padding: "13px 0", borderRadius: 14, border: "none",
        background: `linear-gradient(135deg, ${t.purple}, #9B7EFC)`, color: "#fff",
        fontSize: 14, fontFamily: "'Inter'", fontWeight: 700, cursor: "pointer",
        boxShadow: `0 4px 16px rgba(124,92,252,0.35)`,
      }}>
        Start Session
      </button>

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${t.purple}44, ${t.blue}44)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>S</div>
        <div>
          <div style={{ fontSize: 13, fontFamily: "'Inter'", fontWeight: 600, color: "#fff" }}>Sarah</div>
          <div style={{ fontSize: 11, fontFamily: "'Inter'", color: t.sidebarText }}>Patient</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function DashboardV1Styled() {
  return (
    <div style={{
      width: 1194, height: 834,
      background: t.pageBg,
      fontFamily: "'Inter', sans-serif", overflow: "hidden", display: "flex",
    }}>
      <style>{globalCSS}</style>

      {/* Sidebar */}
      <div style={{ padding: 16, paddingRight: 8, zIndex: 2 }}>
        <Sidebar trialDay={DATA.patient.trialDay} trialLength={DATA.patient.trialLength} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 1 }}>
        {/* Header */}
        <div style={{ padding: "20px 32px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: t.textPrimary, marginBottom: 4 }}>My Journey</h1>
              <p style={{ fontSize: 14, color: t.textSecondary, fontWeight: 500 }}>Day 9 of your quest — building momentum</p>
            </div>
            <StreakBadge current={DATA.streak.current} best={DATA.streak.best} />
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflow: "auto", padding: "0 32px 32px" }}>
          {/* Quest Map */}
          <Card title="Quest Map" delay={100} style={{ marginBottom: 16 }}>
            <JourneyPath days={DATA.last14Days} milestones={DATA.milestones} currentDay={DATA.patient.trialDay} streak={DATA.streak.current} />
          </Card>

          {/* Two columns: Score + Quests */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card title="Today's Score" delay={200}>
                <ScoreGauge score={DATA.today.circadianScore} change={DATA.today.scoreChange} />
              </Card>
              <Card title="Score Trend" delay={300}>
                <MiniTrend days={DATA.last14Days} />
              </Card>
            </div>
            <Card title="Quests & Battles" delay={250}>
              <QuestCard quest={DATA.today.quest} powerUp={DATA.today.powerUp} badGuy={DATA.today.badGuy} />
            </Card>
          </div>

          {/* Score Breakdown */}
          <Card title="Score Breakdown" delay={400} style={{ marginBottom: 16 }}>
            <ScoreBreakdown b={DATA.scoreBreakdown} />
          </Card>
        </div>
      </div>
    </div>
  );
}
