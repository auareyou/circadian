import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD V2: THE LIVING GARDEN
// Each health metric is a plant in your garden.
// Streaks are "growth rings" shown as concentric circles.
// The garden evolves visually as the patient progresses.
// ═══════════════════════════════════════════════════════════════════
// DESIGN PHILOSOPHY:
// The garden IS the data. No abstract charts upfront — instead,
// the patient sees a living ecosystem that reflects their health.
// Tap any plant to see the underlying data (progressive disclosure).
// Streaks = growth rings (like a tree). More rings = deeper roots.
// SuperBetter: Each plant is a "power-up" — celebrating strengths.
// Hooked: Variable reward = garden changes daily. Investment = tending plants.

const DATA = {
  patient: { name: "Sarah", trialDay: 9, trialLength: 21 },
  today: {
    circadianScore: 74, scoreChange: +3,
    lightMinutes: 52, lightPrescribed: 60, lightEffectivePercent: 81,
    bedtimeDeviationMin: 45, wakeDeviationMin: 10,
    naps: 0, nightWakings: 1,
  },
  streak: { current: 5, best: 7 },
  garden: {
    sunflower: { label: "Light therapy", health: 86, streak: 5, emoji: "🌻", metric: "52/60 min", detail: "87% raw · 81% effective" },
    lavender: { label: "Wake timing", health: 100, streak: 7, emoji: "💜", metric: "7:10 am", detail: "Only 10 min off target" },
    fern: { label: "No napping", health: 100, streak: 9, emoji: "🌿", metric: "0 naps", detail: "Perfect — no naps today" },
    bluebell: { label: "Bedtime timing", health: 60, streak: 0, emoji: "🔔", metric: "11:15 pm", detail: "45 min late — needs attention" },
    moss: { label: "Sleep quality", health: 50, streak: 2, emoji: "🍀", metric: "1 waking", detail: "12 min night waking" },
  },
  last14Days: [
    { day: 1, score: 45, light: 30, status: "partial" },
    { day: 2, score: 52, light: 42, status: "partial" },
    { day: 3, score: 48, light: 25, status: "missed" },
    { day: 4, score: 61, light: 55, status: "partial" },
    { day: 5, score: 58, light: 48, status: "partial" },
    { day: 6, score: 65, light: 58, status: "hit" },
    { day: 7, score: 70, light: 60, status: "hit" },
    { day: 8, score: 68, light: 55, status: "partial" },
    { day: 9, score: 74, light: 52, status: "hit" },
    { day: 10, score: null, light: null, status: "future" },
    { day: 11, score: null, light: null, status: "future" },
    { day: 12, score: null, light: null, status: "future" },
    { day: 13, score: null, light: null, status: "future" },
    { day: 14, score: null, light: null, status: "future" },
  ],
  scoreBreakdown: {
    lightTherapy: 43, lightTherapyMax: 50,
    noNapping: 10, noNappingMax: 10,
    noNightWakings: 5, noNightWakingsMax: 10,
    consistentBedtime: 6, consistentBedtimeMax: 10,
    consistentWakeTime: 10, consistentWakeTimeMax: 10,
  },
  dailyWeather: "Mostly sunny — your garden is growing well today",
};

const t = {
  bg: "#FAFAF7", textPrimary: "#1A1A1A", textSecondary: "#6B6B6B", textMuted: "#9C9C9C",
  accent: "#E8A838", accentSoft: "#FFF3D6",
  success: "#4CAF82", successSoft: "#E8F5E9",
  warning: "#E8A838", warningSoft: "#FFF8E1",
  danger: "#D4785C", dangerSoft: "#FDEAE4",
  chartLine: "#2D7A5F", ringBg: "#EAEAEA",
  glass: "rgba(255, 255, 255, 0.42)", glassBorder: "rgba(255, 255, 255, 0.65)",
  glassShadow: "0 2px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03)",
  glassInset: "inset 0 1px 1px rgba(255,255,255,0.6)",
  blur: "blur(20px) saturate(180%)",
  radiusOuter: 24, radiusInner: 16, radiusPill: 9999,
  // Garden-specific
  soil: "#8B7355", soilLight: "#C4A77D",
  gardenGreen: "#5A8C5A", gardenGreenLight: "#8BBF8B",
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; background: transparent; }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
  @keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
`;

function GlassCard({ title, icon, children, style, delay = 0, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: t.glass, backdropFilter: t.blur, WebkitBackdropFilter: t.blur,
      borderRadius: t.radiusOuter, border: `1px solid ${t.glassBorder}`,
      boxShadow: `${t.glassShadow}, ${t.glassInset}`,
      padding: 24, position: "relative", overflow: "hidden",
      animation: `fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
      cursor: onClick ? "pointer" : "default",
      transition: "transform 200ms ease, box-shadow 200ms ease",
      ...style,
    }}>
      <div style={{ position: "absolute", top: 0, left: 24, right: 24, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 70%, transparent)", pointerEvents: "none" }} />
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 500, color: t.textSecondary, marginBottom: 16 }}>
          {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── PLANT CARD ───────────────────────────────────────────────────
// Each metric rendered as a "plant" with growth rings for streaks
function PlantCard({ plant, isExpanded, onToggle, delay }) {
  const healthColor = plant.health >= 80 ? t.success : plant.health >= 50 ? t.warning : t.danger;
  const healthBg = plant.health >= 80 ? t.successSoft : plant.health >= 50 ? t.warningSoft : t.dangerSoft;
  const growthStage = plant.health >= 80 ? "Thriving" : plant.health >= 50 ? "Growing" : "Needs water";
  const ringCount = Math.min(plant.streak, 7);

  return (
    <div
      onClick={onToggle}
      style={{
        background: t.glass, backdropFilter: t.blur, WebkitBackdropFilter: t.blur,
        borderRadius: t.radiusOuter, border: `1px solid ${t.glassBorder}`,
        boxShadow: `${t.glassShadow}, ${t.glassInset}`,
        padding: 20, position: "relative", overflow: "hidden",
        animation: `fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
        cursor: "pointer", transition: "transform 150ms ease",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 70%, transparent)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Plant with growth rings */}
        <div style={{ position: "relative", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Growth rings (streak indicator) */}
          {Array.from({ length: ringCount }, (_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: 44 + i * 6, height: 44 + i * 6,
              borderRadius: "50%",
              border: `1.5px solid ${healthColor}`,
              opacity: 0.15 + (i * 0.08),
              transition: "all 500ms ease",
            }} />
          ))}
          {/* Plant emoji */}
          <span style={{
            fontSize: 32, position: "relative", zIndex: 1,
            animation: plant.health >= 80 ? "sway 3s ease-in-out infinite" : "none",
            filter: plant.health < 50 ? "grayscale(0.4)" : "none",
          }}>
            {plant.emoji}
          </span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 15, fontFamily: "'DM Sans'", fontWeight: 600, color: t.textPrimary }}>{plant.label}</div>
            <div style={{
              padding: "3px 10px", borderRadius: t.radiusPill,
              background: healthBg, fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 500, color: healthColor,
            }}>
              {growthStage}
            </div>
          </div>
          <div style={{ fontSize: 20, fontFamily: "'JetBrains Mono'", fontWeight: 500, color: t.textPrimary, marginTop: 4 }}>{plant.metric}</div>
          {plant.streak > 0 && (
            <div style={{ fontSize: 11, fontFamily: "'DM Sans'", color: t.textMuted, marginTop: 2 }}>
              {plant.streak} day growth streak
            </div>
          )}
        </div>

        {/* Expand indicator */}
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: `${t.ringBg}44`, display: "flex", alignItems: "center", justifyContent: "center",
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease",
          fontSize: 12, color: t.textMuted,
        }}>▼</div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div style={{
          marginTop: 16, paddingTop: 16,
          borderTop: `1px solid ${t.glassBorder}`,
          animation: "fadeSlideIn 300ms ease both",
        }}>
          <div style={{ fontSize: 13, fontFamily: "'DM Sans'", color: t.textSecondary, marginBottom: 8 }}>{plant.detail}</div>
          {/* Health bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontFamily: "'DM Sans'", color: t.textMuted }}>Plant health</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: `${t.ringBg}66`, overflow: "hidden" }}>
              <div style={{ width: `${plant.health}%`, height: "100%", borderRadius: 3, background: healthColor, transition: "width 700ms" }} />
            </div>
            <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono'", color: t.textPrimary }}>{plant.health}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GARDEN OVERVIEW (visual) ─────────────────────────────────────
function GardenOverview({ garden, score }) {
  const plants = Object.values(garden);
  const avgHealth = Math.round(plants.reduce((s, p) => s + p.health, 0) / plants.length);
  const gardenState = avgHealth >= 80 ? "Flourishing" : avgHealth >= 60 ? "Growing" : "Needs care";
  const gardenEmoji = avgHealth >= 80 ? "🌈" : avgHealth >= 60 ? "🌤️" : "🌧️";

  return (
    <div style={{ textAlign: "center" }}>
      {/* Weather/mood line */}
      <div style={{
        fontSize: 13, fontFamily: "'DM Sans'", color: t.textSecondary,
        marginBottom: 20, fontStyle: "italic",
      }}>
        {gardenEmoji} {DATA.dailyWeather}
      </div>

      {/* Central garden visualization */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 24,
        padding: "20px 0", marginBottom: 16,
      }}>
        {plants.map((plant, i) => {
          const height = 40 + (plant.health / 100) * 60;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 28 + (plant.health / 100) * 12,
                animation: plant.health >= 80 ? "breathe 3s ease-in-out infinite" : "none",
                animationDelay: `${i * 300}ms`,
                filter: plant.health < 50 ? "grayscale(0.5) opacity(0.7)" : "none",
                transition: "all 500ms ease",
              }}>
                {plant.emoji}
              </span>
              {/* Stem */}
              <div style={{
                width: 3, height: height, borderRadius: 2,
                background: `linear-gradient(to top, ${t.soil}, ${plant.health >= 50 ? t.gardenGreen : t.soilLight})`,
                transition: "height 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              }} />
              {/* Soil dot */}
              <div style={{
                width: 24, height: 6, borderRadius: 3,
                background: t.soil, opacity: 0.3,
              }} />
              <span style={{ fontSize: 9, fontFamily: "'DM Sans'", color: t.textMuted, maxWidth: 60, textAlign: "center", lineHeight: 1.2 }}>
                {plant.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Score + Garden state */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 12, fontFamily: "'DM Sans'", color: t.textMuted, marginTop: 2 }}>circadian score</div>
        </div>
        <div style={{ width: 1, height: 40, background: t.glassBorder }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontFamily: "'DM Serif Display', serif", color: t.textPrimary }}>{gardenState}</div>
          <div style={{ fontSize: 12, fontFamily: "'DM Sans'", color: t.textMuted, marginTop: 2 }}>garden status</div>
        </div>
      </div>
    </div>
  );
}

// ─── GROWTH CALENDAR ──────────────────────────────────────────────
// Shows 21 days as soil plots — filled/blooming based on status
function GrowthCalendar({ days, currentDay, totalDays }) {
  const allDays = Array.from({ length: totalDays }, (_, i) => {
    const found = days.find(d => d.day === i + 1);
    return found || { day: i + 1, score: null, status: "future" };
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
      {allDays.map((d, i) => {
        const isCurrent = d.day === currentDay;
        const isFuture = d.status === "future";
        let plotEmoji = "🟫";
        if (d.status === "hit") plotEmoji = "🌸";
        else if (d.status === "partial") plotEmoji = "🌱";
        else if (d.status === "missed") plotEmoji = "🥀";
        else if (isFuture) plotEmoji = "⬜";

        return (
          <div key={i} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            padding: 6, borderRadius: 12,
            background: isCurrent ? t.accentSoft : "transparent",
            border: isCurrent ? `2px solid ${t.accent}` : "2px solid transparent",
          }}>
            <span style={{ fontSize: 20 }}>{plotEmoji}</span>
            <span style={{
              fontSize: 10, fontFamily: "'DM Sans'",
              color: isCurrent ? t.accent : t.textMuted, fontWeight: isCurrent ? 600 : 400,
            }}>D{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── STREAK RINGS ─────────────────────────────────────────────────
function StreakRings({ current, best }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {Array.from({ length: Math.min(current, 7) }, (_, i) => (
          <div key={i} style={{
            position: "absolute", width: 30 + i * 8, height: 30 + i * 8,
            borderRadius: "50%", border: `2px solid ${t.success}`,
            opacity: 0.2 + i * 0.1,
          }} />
        ))}
        <span style={{ fontSize: 22, position: "relative", zIndex: 1 }}>🌳</span>
      </div>
      <div>
        <div style={{ fontSize: 24, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, lineHeight: 1 }}>{current} rings</div>
        <div style={{ fontSize: 11, fontFamily: "'DM Sans'", color: t.textMuted }}>growth streak · deepest: {best}</div>
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
          <linearGradient id="gardenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.gardenGreen} stopOpacity={0.2} />
            <stop offset="100%" stopColor={t.gardenGreen} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.textMuted, fontFamily: "'DM Sans'" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} hide />
        <Area type="monotone" dataKey="score" stroke={t.gardenGreen} strokeWidth={2} fill="url(#gardenGrad)" dot={{ r: 3, fill: t.gardenGreen, stroke: "#fff", strokeWidth: 1.5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────
function Sidebar({ trialDay, trialLength }) {
  const [active, setActive] = useState("garden");
  const navItems = [
    { id: "garden", label: "My garden", icon: "🌻" },
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
      borderRadius: 24, border: `1px solid ${t.glassBorder}`,
      boxShadow: `${t.glassShadow}, ${t.glassInset}`,
      padding: 16, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 16, right: 16, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 70%, transparent)", pointerEvents: "none" }} />
      <div style={{ fontSize: 18, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, marginBottom: 12 }}>Circadian</div>
      <div style={{ height: 1, background: `linear-gradient(90deg, ${t.glassBorder}, transparent)`, marginBottom: 12 }} />
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontFamily: "'DM Sans'", color: t.textSecondary, marginBottom: 8, fontWeight: 500 }}>Growing season</div>
        <div style={{ fontSize: 11, fontFamily: "'DM Sans'", color: t.textMuted, marginBottom: 6 }}>Day {trialDay} of {trialLength}</div>
        <div style={{ width: "100%", height: 4, borderRadius: 2, background: `${t.ringBg}66`, overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", borderRadius: 2, background: t.gardenGreen }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            borderRadius: 9999, border: "none",
            background: active === item.id ? t.successSoft : "transparent",
            cursor: "pointer", transition: "background 200ms",
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 13, fontFamily: "'DM Sans'", color: active === item.id ? t.textPrimary : t.textMuted, fontWeight: active === item.id ? 500 : 400 }}>{item.label}</span>
          </button>
        ))}
      </div>
      <button style={{
        width: "100%", padding: "12px 0", borderRadius: 9999, border: "none",
        background: `linear-gradient(135deg, ${t.gardenGreen}, ${t.gardenGreenLight})`, color: "#fff",
        fontSize: 14, fontFamily: "'DM Sans'", fontWeight: 600, cursor: "pointer",
        boxShadow: `0 4px 12px ${t.gardenGreen}44`, marginTop: 12,
      }}>
        Start session
      </button>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function DashboardV2LivingGarden() {
  const [expandedPlant, setExpandedPlant] = useState(null);
  const garden = DATA.garden;

  return (
    <div style={{
      width: 1194, height: 834,
      background: "linear-gradient(135deg, #FAFAF7 0%, #F0EDE4 50%, #E8E4DA 100%)",
      fontFamily: "'DM Sans', sans-serif", overflow: "hidden", position: "relative", display: "flex",
    }}>
      <style>{globalCSS}</style>
      <div style={{ position: "fixed", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(90,140,90,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,168,56,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Sidebar */}
      <div style={{ padding: 24, paddingRight: 12, display: "flex", flexDirection: "column", zIndex: 2 }}>
        <Sidebar trialDay={DATA.patient.trialDay} trialLength={DATA.patient.trialLength} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", zIndex: 1 }}>
        <div style={{ padding: "24px 40px", paddingBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 28, fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: t.textPrimary }}>My garden</h1>
              <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 4 }}>Your health, growing day by day</p>
            </div>
            <StreakRings current={DATA.streak.current} best={DATA.streak.best} />
          </div>
        </div>

        <div style={{ padding: "0 40px 48px", flex: 1, overflow: "auto" }}>
          {/* Garden Overview — the hero */}
          <GlassCard title="Garden overview" icon="🌻" delay={100} style={{ marginBottom: 20 }}>
            <GardenOverview garden={garden} score={DATA.today.circadianScore} />
          </GlassCard>

          {/* Plant cards (individual metrics) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {Object.entries(garden).map(([key, plant], i) => (
              <PlantCard
                key={key}
                plant={plant}
                isExpanded={expandedPlant === key}
                onToggle={() => setExpandedPlant(expandedPlant === key ? null : key)}
                delay={200 + i * 80}
              />
            ))}
          </div>

          {/* Two columns: Calendar + Trend */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <GlassCard title="Growth calendar" icon="📅" delay={600}>
              <GrowthCalendar days={DATA.last14Days} currentDay={DATA.patient.trialDay} totalDays={DATA.patient.trialLength} />
            </GlassCard>
            <GlassCard title="Score trend" icon="📈" delay={700}>
              <MiniTrend days={DATA.last14Days} />
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Bottom blur */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 48, background: "linear-gradient(to top, rgba(250,250,247,0.9), transparent)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", pointerEvents: "none", zIndex: 10 }} />
    </div>
  );
}
