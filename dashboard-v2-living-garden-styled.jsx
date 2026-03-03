import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD V2: THE LIVING GARDEN — FundFlow Visual Style
// Each health metric is a plant in your garden.
// Streaks are "growth rings" shown as concentric circles.
// The garden evolves visually as the patient progresses.
// ═══════════════════════════════════════════════════════════════════

const DATA = {
  patient: { name: "Sarah", trialDay: 9, trialLength: 21 },
  today: { circadianScore: 74, scoreChange: +3 },
  streak: { current: 5, best: 7 },
  garden: {
    sunflower: { label: "Light Therapy", health: 86, streak: 5, emoji: "🌻", metric: "52/60 min", detail: "87% raw · 81% effective" },
    lavender: { label: "Wake Timing", health: 100, streak: 7, emoji: "💜", metric: "7:10 am", detail: "Only 10 min off target" },
    fern: { label: "No Napping", health: 100, streak: 9, emoji: "🌿", metric: "0 naps", detail: "Perfect — no naps today" },
    bluebell: { label: "Bedtime", health: 60, streak: 0, emoji: "🔔", metric: "11:15 pm", detail: "45 min late — needs attention" },
    moss: { label: "Sleep Quality", health: 50, streak: 2, emoji: "🍀", metric: "1 waking", detail: "12 min night waking" },
  },
  last14Days: [
    { day: 1, score: 45, status: "partial" }, { day: 2, score: 52, status: "partial" },
    { day: 3, score: 48, status: "missed" }, { day: 4, score: 61, status: "partial" },
    { day: 5, score: 58, status: "partial" }, { day: 6, score: 65, status: "hit" },
    { day: 7, score: 70, status: "hit" }, { day: 8, score: 68, status: "partial" },
    { day: 9, score: 74, status: "hit" },
    { day: 10, score: null, status: "future" }, { day: 11, score: null, status: "future" },
    { day: 12, score: null, status: "future" }, { day: 13, score: null, status: "future" },
    { day: 14, score: null, status: "future" },
  ],
  dailyWeather: "Mostly sunny — your garden is growing well",
};

const t = {
  pageBg: "#F0EAFA",
  sidebarBg: "#1A1040", sidebarText: "rgba(255,255,255,0.55)", sidebarTextActive: "#FFFFFF",
  sidebarAccent: "#34C77B", sidebarHover: "rgba(52,199,123,0.12)",
  cardBg: "#FFFFFF", cardShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)", cardRadius: 20,
  textPrimary: "#1A1040", textSecondary: "#6E6893", textMuted: "#A09ABF",
  purple: "#7C5CFC", purpleSoft: "#EDE8FF",
  green: "#34C77B", greenSoft: "#E0F9EC", greenDark: "#218C54",
  blue: "#5B8DEF", blueSoft: "#E3EDFD",
  orange: "#F5A623", orangeSoft: "#FFF3D6",
  red: "#EF5B5B", redSoft: "#FDEAEA",
  border: "#EEEAF5", ringBg: "#EEEAF5",
  gardenGreen: "#4CAF82", gardenBrown: "#8B7355",
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; background: transparent; }
  @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
  @keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
`;

function Card({ title, badge, children, style, delay = 0, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: t.cardBg, borderRadius: t.cardRadius, boxShadow: t.cardShadow,
      padding: 24, animation: `fadeSlideIn 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
      cursor: onClick ? "pointer" : "default", transition: "transform 150ms, box-shadow 150ms",
      ...style,
    }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 14, fontFamily: "'Inter'", fontWeight: 600, color: t.textSecondary }}>{title}</span>
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── GARDEN OVERVIEW ──────────────────────────────────────────────
function GardenOverview({ garden, score, change }) {
  const plants = Object.values(garden);
  const avgHealth = Math.round(plants.reduce((s, p) => s + p.health, 0) / plants.length);
  const gardenState = avgHealth >= 80 ? "Flourishing" : avgHealth >= 60 ? "Growing" : "Needs care";

  return (
    <div>
      {/* Weather line */}
      <div style={{
        padding: "10px 16px", borderRadius: 12, background: t.greenSoft,
        fontSize: 13, fontFamily: "'Inter'", color: t.greenDark, fontWeight: 500,
        marginBottom: 24, textAlign: "center",
      }}>
        🌤️ {DATA.dailyWeather}
      </div>

      {/* Garden visual */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 28, padding: "16px 0", marginBottom: 20 }}>
        {plants.map((plant, i) => {
          const stemH = 36 + (plant.health / 100) * 56;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{
                fontSize: 26 + (plant.health / 100) * 10,
                animation: plant.health >= 80 ? `breathe 3s ease-in-out ${i * 300}ms infinite` : "none",
                filter: plant.health < 50 ? "grayscale(0.5) opacity(0.6)" : "none",
                transition: "all 500ms",
              }}>{plant.emoji}</span>
              <div style={{
                width: 3, height: stemH, borderRadius: 2,
                background: `linear-gradient(to top, ${t.gardenBrown}, ${plant.health >= 50 ? t.gardenGreen : t.gardenBrown}88)`,
                transition: "height 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              }} />
              <div style={{ width: 20, height: 4, borderRadius: 2, background: t.gardenBrown, opacity: 0.2 }} />
              <span style={{ fontSize: 9, fontFamily: "'Inter'", color: t.textMuted, fontWeight: 500, textAlign: "center", maxWidth: 56, lineHeight: 1.2 }}>{plant.label}</span>
            </div>
          );
        })}
      </div>

      {/* Score + Status row */}
      <div style={{ display: "flex", justifyContent: "center", gap: 32, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44, fontFamily: "'Inter'", fontWeight: 800, color: t.textPrimary, lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 12, fontFamily: "'Inter'", color: t.textMuted, marginTop: 4, fontWeight: 500 }}>circadian score</div>
        </div>
        <div style={{ width: 1, height: 44, background: t.border }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontFamily: "'Inter'", fontWeight: 700, color: t.green }}>{gardenState}</div>
          <div style={{ fontSize: 12, fontFamily: "'Inter'", color: t.textMuted, marginTop: 4, fontWeight: 500 }}>garden status</div>
        </div>
        <div style={{ width: 1, height: 44, background: t.border }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: t.greenSoft }}>
            <span style={{ fontSize: 14, fontFamily: "'Inter'", fontWeight: 700, color: t.green }}>↑ +{change}</span>
          </div>
          <div style={{ fontSize: 12, fontFamily: "'Inter'", color: t.textMuted, marginTop: 4, fontWeight: 500 }}>from yesterday</div>
        </div>
      </div>
    </div>
  );
}

// ─── PLANT CARD ───────────────────────────────────────────────────
function PlantCard({ plant, isExpanded, onToggle, delay }) {
  const color = plant.health >= 80 ? t.green : plant.health >= 50 ? t.orange : t.red;
  const bgColor = plant.health >= 80 ? t.greenSoft : plant.health >= 50 ? t.orangeSoft : t.redSoft;
  const status = plant.health >= 80 ? "Thriving" : plant.health >= 50 ? "Growing" : "Needs water";
  const ringCount = Math.min(plant.streak, 7);

  return (
    <div onClick={onToggle} style={{
      background: t.cardBg, borderRadius: t.cardRadius, boxShadow: t.cardShadow,
      padding: 20, cursor: "pointer", transition: "transform 150ms, box-shadow 150ms",
      animation: `fadeSlideIn 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Plant with growth rings */}
        <div style={{ position: "relative", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {Array.from({ length: ringCount }, (_, i) => (
            <div key={i} style={{
              position: "absolute", width: 36 + i * 6, height: 36 + i * 6, borderRadius: "50%",
              border: `1.5px solid ${color}`, opacity: 0.12 + i * 0.06,
            }} />
          ))}
          <span style={{
            fontSize: 28, position: "relative", zIndex: 1,
            animation: plant.health >= 80 ? "sway 3s ease-in-out infinite" : "none",
            filter: plant.health < 50 ? "grayscale(0.4)" : "none",
          }}>{plant.emoji}</span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontFamily: "'Inter'", fontWeight: 700, color: t.textPrimary }}>{plant.label}</span>
            <span style={{ padding: "4px 12px", borderRadius: 8, background: bgColor, fontSize: 11, fontFamily: "'Inter'", fontWeight: 600, color }}>{status}</span>
          </div>
          <div style={{ fontSize: 20, fontFamily: "'JetBrains Mono'", fontWeight: 600, color: t.textPrimary, marginTop: 4 }}>{plant.metric}</div>
          {plant.streak > 0 && (
            <div style={{ fontSize: 11, fontFamily: "'Inter'", color: t.textMuted, marginTop: 2, fontWeight: 500 }}>{plant.streak} day growth streak</div>
          )}
        </div>

        <div style={{
          width: 28, height: 28, borderRadius: 8, background: t.ringBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms",
          fontSize: 11, color: t.textMuted,
        }}>▼</div>
      </div>

      {isExpanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${t.border}`, animation: "fadeSlideIn 250ms ease both" }}>
          <div style={{ fontSize: 13, fontFamily: "'Inter'", color: t.textSecondary, marginBottom: 10, fontWeight: 500 }}>{plant.detail}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontFamily: "'Inter'", color: t.textMuted, fontWeight: 500 }}>Health</span>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: t.ringBg, overflow: "hidden" }}>
              <div style={{ width: `${plant.health}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: "width 700ms" }} />
            </div>
            <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono'", fontWeight: 600, color: t.textPrimary }}>{plant.health}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GROWTH CALENDAR ──────────────────────────────────────────────
function GrowthCalendar({ days, currentDay, totalDays }) {
  const allDays = Array.from({ length: totalDays }, (_, i) => {
    const found = days.find(d => d.day === i + 1);
    return found || { day: i + 1, score: null, status: "future" };
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
      {allDays.map((d, i) => {
        const isCurrent = d.day === currentDay;
        let emoji = "⬜";
        if (d.status === "hit") emoji = "🌸";
        else if (d.status === "partial") emoji = "🌱";
        else if (d.status === "missed") emoji = "🥀";

        return (
          <div key={i} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: 6, borderRadius: 10,
            background: isCurrent ? t.purpleSoft : "transparent",
            border: isCurrent ? `2px solid ${t.purple}` : "2px solid transparent",
          }}>
            <span style={{ fontSize: 18 }}>{emoji}</span>
            <span style={{ fontSize: 10, fontFamily: "'Inter'", color: isCurrent ? t.purple : t.textMuted, fontWeight: isCurrent ? 700 : 500 }}>D{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── STREAK RINGS ─────────────────────────────────────────────────
function StreakRings({ current, best }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 18px", borderRadius: 16,
      background: `linear-gradient(135deg, ${t.green}, #4DD98B)`,
      boxShadow: `0 4px 16px rgba(52,199,123,0.25)`,
    }}>
      <div style={{ position: "relative", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {Array.from({ length: Math.min(current, 5) }, (_, i) => (
          <div key={i} style={{
            position: "absolute", width: 22 + i * 6, height: 22 + i * 6, borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.4)",
          }} />
        ))}
        <span style={{ fontSize: 18, position: "relative", zIndex: 1 }}>🌳</span>
      </div>
      <div>
        <div style={{ fontSize: 20, fontFamily: "'Inter'", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{current} rings</div>
        <div style={{ fontSize: 11, fontFamily: "'Inter'", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>growth streak · best {best}</div>
      </div>
    </div>
  );
}

// ─── MINI TREND ───────────────────────────────────────────────────
function MiniTrend({ days }) {
  const chartData = days.filter(d => d.score !== null).map(d => ({ name: `D${d.day}`, score: d.score }));
  return (
    <ResponsiveContainer width="100%" height={110}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="gardenTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.green} stopOpacity={0.15} />
            <stop offset="100%" stopColor={t.green} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.textMuted, fontFamily: "'Inter'" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} hide />
        <Area type="monotone" dataKey="score" stroke={t.green} strokeWidth={2.5} fill="url(#gardenTrend)" dot={{ r: 3, fill: t.green, stroke: "#fff", strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────
function Sidebar({ trialDay, trialLength }) {
  const [active, setActive] = useState("garden");
  const navItems = [
    { id: "garden", label: "My Garden" },
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
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${t.green}, #4DD98B)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16 }}>🌻</span>
        </div>
        <span style={{ fontSize: 17, fontFamily: "'Inter'", fontWeight: 700, color: "#fff" }}>Circadian</span>
      </div>

      <div style={{ marginBottom: 28, padding: "14px 16px", borderRadius: 14, background: "rgba(52,199,123,0.1)" }}>
        <div style={{ fontSize: 11, fontFamily: "'Inter'", color: t.sidebarText, fontWeight: 500, marginBottom: 8 }}>Growing Season</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontFamily: "'Inter'", fontWeight: 800, color: "#fff" }}>Day {trialDay}</span>
          <span style={{ fontSize: 12, color: t.sidebarText }}>/ {trialLength}</span>
        </div>
        <div style={{ width: "100%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.1)" }}>
          <div style={{ width: `${progress}%`, height: "100%", borderRadius: 3, background: t.green }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", cursor: "pointer",
            background: active === item.id ? t.sidebarHover : "transparent", transition: "background 150ms",
          }}>
            <span style={{ fontSize: 14, fontFamily: "'Inter'", fontWeight: active === item.id ? 600 : 500, color: active === item.id ? t.sidebarTextActive : t.sidebarText }}>{item.label}</span>
          </button>
        ))}
      </div>

      <button style={{
        width: "100%", padding: "13px 0", borderRadius: 14, border: "none",
        background: `linear-gradient(135deg, ${t.green}, #4DD98B)`, color: "#fff",
        fontSize: 14, fontFamily: "'Inter'", fontWeight: 700, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(52,199,123,0.3)",
      }}>Start Session</button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.green}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>S</div>
        <div>
          <div style={{ fontSize: 13, fontFamily: "'Inter'", fontWeight: 600, color: "#fff" }}>Sarah</div>
          <div style={{ fontSize: 11, fontFamily: "'Inter'", color: t.sidebarText }}>Patient</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function DashboardV2Styled() {
  const [expandedPlant, setExpandedPlant] = useState(null);

  return (
    <div style={{
      width: 1194, height: 834, background: t.pageBg,
      fontFamily: "'Inter', sans-serif", overflow: "hidden", display: "flex",
    }}>
      <style>{globalCSS}</style>

      <div style={{ padding: 16, paddingRight: 8, zIndex: 2 }}>
        <Sidebar trialDay={DATA.patient.trialDay} trialLength={DATA.patient.trialLength} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 1 }}>
        <div style={{ padding: "20px 32px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: t.textPrimary, marginBottom: 4 }}>My Garden</h1>
              <p style={{ fontSize: 14, color: t.textSecondary, fontWeight: 500 }}>Your health, growing day by day</p>
            </div>
            <StreakRings current={DATA.streak.current} best={DATA.streak.best} />
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "0 32px 32px" }}>
          {/* Garden Overview */}
          <Card title="Garden Overview" delay={100} style={{ marginBottom: 16 }}>
            <GardenOverview garden={DATA.garden} score={DATA.today.circadianScore} change={DATA.today.scoreChange} />
          </Card>

          {/* Plant cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {Object.entries(DATA.garden).map(([key, plant], i) => (
              <PlantCard key={key} plant={plant} isExpanded={expandedPlant === key}
                onToggle={() => setExpandedPlant(expandedPlant === key ? null : key)} delay={200 + i * 60} />
            ))}
          </div>

          {/* Two columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Card title="Growth Calendar" delay={550}>
              <GrowthCalendar days={DATA.last14Days} currentDay={DATA.patient.trialDay} totalDays={DATA.patient.trialLength} />
            </Card>
            <Card title="Score Trend" delay={600}>
              <MiniTrend days={DATA.last14Days} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
