import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD V3: THE BATTLE DASHBOARD
// SuperBetter-inspired: bad guys as externalized enemies,
// power-ups as strengths, daily quests, and a "power level"
// that builds with streaks.
// ═══════════════════════════════════════════════════════════════════
// DESIGN PHILOSOPHY:
// The patient is a hero battling their circadian disruption.
// Bad guys (napping, late bedtime, night wakings) are ENEMIES,
// not personal failures. Power-ups are STRENGTHS to celebrate.
// The "power level" replaces the abstract score — it FEELS earned.
// Streaks charge up a "shield" that protects against setbacks.
// Hooked: Daily quest = trigger. Power level = variable reward.
// Shield charging = investment.

const DATA = {
  patient: { name: "Sarah", trialDay: 9, trialLength: 21 },
  today: {
    circadianScore: 74, scoreChange: +3,
    lightMinutes: 52, lightPrescribed: 60, lightEffectivePercent: 81,
    bedtimeDeviationMin: 45, wakeDeviationMin: 10,
    naps: 0, nightWakings: 1,
  },
  streak: { current: 5, best: 7 },
  powerLevel: {
    current: 74, tier: "Silver",
    nextTier: "Gold", nextTierAt: 80,
    tiers: [
      { name: "Bronze", min: 0, color: "#CD7F32" },
      { name: "Silver", min: 50, color: "#A8B5C4" },
      { name: "Gold", min: 80, color: "#E8A838" },
      { name: "Diamond", min: 95, color: "#7FDBFF" },
    ]
  },
  powerUps: [
    { id: "wake", label: "Perfect wake time", emoji: "⏰", active: true, detail: "Only 10 min off — practically on target", streak: 4 },
    { id: "nap", label: "No nap defense", emoji: "🛡️", active: true, detail: "Zero naps — strong willpower", streak: 9 },
    { id: "light", label: "Light warrior", emoji: "☀️", active: true, detail: "52/60 min completed — solid session", streak: 5 },
  ],
  badGuys: [
    { id: "bedtime", label: "Late Bedtime", emoji: "👾", severity: "medium", detail: "Crept in 45 min late (target: 10:30pm)", tip: "Set a wind-down alarm at 10:00pm" },
    { id: "waking", label: "Night Waker", emoji: "👻", severity: "mild", detail: "One 12-min waking — minor disruption", tip: "Avoid screens if you wake up" },
  ],
  dailyQuests: [
    { id: "q1", label: "Start light session before 9:30am", completed: false, xp: 15, emoji: "🌅" },
    { id: "q2", label: "In bed by 10:45pm tonight", completed: false, xp: 10, emoji: "🛏️" },
    { id: "q3", label: "No naps today", completed: true, xp: 5, emoji: "💪" },
  ],
  last14Days: [
    { day: 1, score: 45, status: "partial" },
    { day: 2, score: 52, status: "partial" },
    { day: 3, score: 48, status: "missed" },
    { day: 4, score: 61, status: "partial" },
    { day: 5, score: 58, status: "partial" },
    { day: 6, score: 65, status: "hit" },
    { day: 7, score: 70, status: "hit" },
    { day: 8, score: 68, status: "partial" },
    { day: 9, score: 74, status: "hit" },
    { day: 10, score: null, status: "future" },
    { day: 11, score: null, status: "future" },
    { day: 12, score: null, status: "future" },
    { day: 13, score: null, status: "future" },
    { day: 14, score: null, status: "future" },
  ],
  scoreBreakdown: {
    lightTherapy: 43, lightTherapyMax: 50,
    noNapping: 10, noNappingMax: 10,
    noNightWakings: 5, noNightWakingsMax: 10,
    consistentBedtime: 6, consistentBedtimeMax: 10,
    consistentWakeTime: 10, consistentWakeTimeMax: 10,
  },
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
  // Battle-specific
  xpPurple: "#7C6BC4", xpPurpleSoft: "#EDE8FA",
  shieldBlue: "#5B8DEF", shieldBlueSoft: "#E3EDFD",
  bronze: "#CD7F32", silver: "#A8B5C4", gold: "#E8A838", diamond: "#7FDBFF",
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; background: transparent; }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shieldPulse { 0%,100% { box-shadow: 0 0 12px rgba(91,141,239,0.3); } 50% { box-shadow: 0 0 24px rgba(91,141,239,0.5); } }
  @keyframes badGuyBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
`;

function GlassCard({ title, icon, badge, children, style, delay = 0 }) {
  return (
    <div style={{
      background: t.glass, backdropFilter: t.blur, WebkitBackdropFilter: t.blur,
      borderRadius: t.radiusOuter, border: `1px solid ${t.glassBorder}`,
      boxShadow: `${t.glassShadow}, ${t.glassInset}`,
      padding: 24, position: "relative", overflow: "hidden",
      animation: `fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
      ...style,
    }}>
      <div style={{ position: "absolute", top: 0, left: 24, right: 24, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 70%, transparent)", pointerEvents: "none" }} />
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 500, color: t.textSecondary }}>
            {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
            {title}
          </div>
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── POWER LEVEL GAUGE ────────────────────────────────────────────
// A vertical "power meter" instead of a radial gauge
function PowerLevelMeter({ score, change, tier, nextTier, nextTierAt, tiers }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let start = null;
    const dur = 1000;
    const run = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setAnim(Math.round(e * score));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [score]);

  const currentTier = tiers.find(t2 => t2.name === tier);
  const tierColor = currentTier?.color || t.accent;

  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 24 }}>
      {/* Power bar */}
      <div style={{ width: 48, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        {/* Tier markers */}
        {tiers.map(tr => (
          <div key={tr.name} style={{
            position: "absolute", bottom: `${tr.min}%`, left: -4, right: -4,
            height: 2, background: tr.color, opacity: 0.3,
          }}>
            <span style={{
              position: "absolute", right: "calc(100% + 6px)", top: -6,
              fontSize: 9, fontFamily: "'DM Sans'", color: t.textMuted, whiteSpace: "nowrap",
            }}>{tr.name}</span>
          </div>
        ))}
        {/* Bar background */}
        <div style={{
          width: 32, flex: 1, borderRadius: 16, background: `${t.ringBg}44`, overflow: "hidden",
          position: "relative", display: "flex", flexDirection: "column-reverse",
        }}>
          <div style={{
            width: "100%", height: `${anim}%`, borderRadius: 16,
            background: `linear-gradient(to top, ${tierColor}88, ${tierColor})`,
            boxShadow: `0 0 12px ${tierColor}44`,
            transition: "height 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
          }} />
        </div>
      </div>

      {/* Score details */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 56, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, lineHeight: 1 }}>{anim}</div>
        <div style={{ fontSize: 14, fontFamily: "'DM Sans'", color: tierColor, fontWeight: 600, marginTop: 4 }}>
          {tier} tier
        </div>
        <div style={{ fontSize: 13, fontFamily: "'DM Sans'", color: t.success, marginTop: 8 }}>
          +{change} from yesterday
        </div>
        <div style={{ fontSize: 12, fontFamily: "'DM Sans'", color: t.textMuted, marginTop: 4 }}>
          {nextTierAt - score} more to reach {nextTier}
        </div>
      </div>
    </div>
  );
}

// ─── SHIELD (streak visualization) ────────────────────────────────
function Shield({ streak, best }) {
  const shieldStrength = Math.min((streak / 7) * 100, 100);
  const shieldLevel = streak >= 7 ? "Maximum" : streak >= 5 ? "Strong" : streak >= 3 ? "Building" : "Forming";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: `linear-gradient(135deg, ${t.shieldBlue}, ${t.shieldBlue}88)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: streak >= 3 ? `0 0 16px ${t.shieldBlue}44` : "none",
        animation: streak >= 5 ? "shieldPulse 2s ease-in-out infinite" : "none",
        position: "relative",
      }}>
        <span style={{ fontSize: 28 }}>🛡️</span>
        {/* Streak number overlay */}
        <div style={{
          position: "absolute", bottom: -4, right: -4,
          width: 20, height: 20, borderRadius: "50%",
          background: t.accent, color: "#fff",
          fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{streak}</div>
      </div>
      <div>
        <div style={{ fontSize: 16, fontFamily: "'DM Sans'", fontWeight: 600, color: t.textPrimary }}>{shieldLevel} shield</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div style={{ width: 80, height: 5, borderRadius: 3, background: `${t.ringBg}66`, overflow: "hidden" }}>
            <div style={{ width: `${shieldStrength}%`, height: "100%", borderRadius: 3, background: t.shieldBlue, transition: "width 700ms" }} />
          </div>
          <span style={{ fontSize: 11, fontFamily: "'DM Sans'", color: t.textMuted }}>{streak} days · best: {best}</span>
        </div>
      </div>
    </div>
  );
}

// ─── POWER-UPS ────────────────────────────────────────────────────
function PowerUps({ powerUps }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {powerUps.map(pu => (
        <div key={pu.id} style={{
          display: "flex", alignItems: "center", gap: 14, padding: 14,
          background: pu.active ? t.successSoft : `${t.ringBg}33`,
          borderRadius: t.radiusInner, opacity: pu.active ? 1 : 0.5,
          border: pu.active ? `1px solid ${t.success}22` : "1px solid transparent",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: pu.active ? `${t.success}22` : `${t.ringBg}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 22 }}>{pu.emoji}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontFamily: "'DM Sans'", fontWeight: 600, color: t.textPrimary }}>{pu.label}</div>
            <div style={{ fontSize: 12, fontFamily: "'DM Sans'", color: t.textSecondary, marginTop: 2 }}>{pu.detail}</div>
          </div>
          {pu.streak > 0 && (
            <div style={{
              padding: "3px 10px", borderRadius: t.radiusPill,
              background: t.accentSoft, fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 600, color: t.accent,
            }}>
              {pu.streak}x
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── BAD GUYS ─────────────────────────────────────────────────────
function BadGuys({ badGuys }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {badGuys.map(bg => (
        <div key={bg.id} style={{
          display: "flex", alignItems: "flex-start", gap: 14, padding: 14,
          background: bg.severity === "medium" ? t.dangerSoft : t.warningSoft,
          borderRadius: t.radiusInner,
          border: `1px solid ${bg.severity === "medium" ? t.danger : t.warning}22`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `${bg.severity === "medium" ? t.danger : t.warning}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "badGuyBounce 1.5s ease-in-out infinite",
          }}>
            <span style={{ fontSize: 22 }}>{bg.emoji}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontFamily: "'DM Sans'", fontWeight: 600, color: t.textPrimary }}>{bg.label}</div>
            <div style={{ fontSize: 12, fontFamily: "'DM Sans'", color: t.textSecondary, marginTop: 2 }}>{bg.detail}</div>
            <div style={{
              fontSize: 12, fontFamily: "'DM Sans'", color: bg.severity === "medium" ? t.danger : t.warning,
              fontWeight: 500, marginTop: 6, fontStyle: "italic",
            }}>
              Battle tip: {bg.tip}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── DAILY QUESTS ─────────────────────────────────────────────────
function DailyQuests({ quests }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {quests.map(q => (
        <div key={q.id} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
          background: q.completed ? `${t.success}08` : "transparent",
          borderRadius: t.radiusInner,
          border: `1px solid ${q.completed ? `${t.success}22` : `${t.ringBg}44`}`,
        }}>
          {/* Checkbox */}
          <div style={{
            width: 24, height: 24, borderRadius: 8,
            background: q.completed ? t.success : "transparent",
            border: q.completed ? "none" : `2px solid ${t.ringBg}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 14,
          }}>
            {q.completed && "✓"}
          </div>
          <span style={{ fontSize: 16 }}>{q.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 14, fontFamily: "'DM Sans'", color: t.textPrimary,
              textDecoration: q.completed ? "line-through" : "none",
              opacity: q.completed ? 0.6 : 1,
            }}>{q.label}</div>
          </div>
          <div style={{
            padding: "3px 10px", borderRadius: t.radiusPill,
            background: q.completed ? t.successSoft : t.xpPurpleSoft,
            fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 600,
            color: q.completed ? t.success : t.xpPurple,
          }}>
            +{q.xp} XP
          </div>
        </div>
      ))}
      {/* Total XP earned today */}
      <div style={{
        display: "flex", justifyContent: "flex-end", paddingTop: 8,
        borderTop: `1px solid ${t.glassBorder}`,
      }}>
        <span style={{ fontSize: 13, fontFamily: "'DM Sans'", color: t.textMuted }}>
          Today: <span style={{ fontFamily: "'JetBrains Mono'", color: t.xpPurple, fontWeight: 600 }}>
            {quests.filter(q => q.completed).reduce((s, q) => s + q.xp, 0)} / {quests.reduce((s, q) => s + q.xp, 0)} XP
          </span>
        </span>
      </div>
    </div>
  );
}

// ─── BATTLE LOG (mini trend) ──────────────────────────────────────
function BattleLog({ days }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
      {days.map((d, i) => {
        const isFuture = d.status === "future";
        const h = d.score !== null ? (d.score / 100) * 70 : 0;
        const color = d.status === "hit" ? t.success : d.status === "partial" ? t.warning : d.status === "missed" ? t.danger : `${t.ringBg}44`;
        const isCurrent = d.day === DATA.patient.trialDay;

        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1 }}>
            <div style={{
              width: "100%", maxWidth: 32, height: h || 4, borderRadius: 6,
              background: isFuture ? `${t.ringBg}33` : `linear-gradient(to top, ${color}88, ${color})`,
              border: isCurrent ? `2px solid ${t.accent}` : "none",
              transition: "height 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }} />
            <span style={{
              fontSize: 9, fontFamily: "'DM Sans'",
              color: isCurrent ? t.accent : t.textMuted, fontWeight: isCurrent ? 600 : 400,
            }}>D{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────
function Sidebar({ trialDay, trialLength }) {
  const [active, setActive] = useState("battle");
  const navItems = [
    { id: "battle", label: "Battle HQ", icon: "⚔️" },
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
        <div style={{ fontSize: 12, fontFamily: "'DM Sans'", color: t.textSecondary, marginBottom: 8, fontWeight: 500 }}>Campaign progress</div>
        <div style={{ fontSize: 11, fontFamily: "'DM Sans'", color: t.textMuted, marginBottom: 6 }}>Day {trialDay} of {trialLength}</div>
        <div style={{ width: "100%", height: 4, borderRadius: 2, background: `${t.ringBg}66`, overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${t.shieldBlue}, ${t.xpPurple})` }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            borderRadius: 9999, border: "none",
            background: active === item.id ? t.xpPurpleSoft : "transparent",
            cursor: "pointer", transition: "background 200ms",
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 13, fontFamily: "'DM Sans'", color: active === item.id ? t.textPrimary : t.textMuted, fontWeight: active === item.id ? 500 : 400 }}>{item.label}</span>
          </button>
        ))}
      </div>
      <button style={{
        width: "100%", padding: "12px 0", borderRadius: 9999, border: "none",
        background: `linear-gradient(135deg, ${t.shieldBlue}, ${t.xpPurple})`, color: "#fff",
        fontSize: 14, fontFamily: "'DM Sans'", fontWeight: 600, cursor: "pointer",
        boxShadow: `0 4px 12px ${t.shieldBlue}44`, marginTop: 12,
      }}>
        Start session
      </button>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function DashboardV3BattleDashboard() {
  return (
    <div style={{
      width: 1194, height: 834,
      background: "linear-gradient(135deg, #FAFAF7 0%, #F0EDE4 50%, #E8E4DA 100%)",
      fontFamily: "'DM Sans', sans-serif", overflow: "hidden", position: "relative", display: "flex",
    }}>
      <style>{globalCSS}</style>
      <div style={{ position: "fixed", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(91,141,239,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,107,196,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Sidebar */}
      <div style={{ padding: 24, paddingRight: 12, display: "flex", flexDirection: "column", zIndex: 2 }}>
        <Sidebar trialDay={DATA.patient.trialDay} trialLength={DATA.patient.trialLength} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", zIndex: 1 }}>
        <div style={{ padding: "24px 40px", paddingBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 28, fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: t.textPrimary }}>Battle HQ</h1>
              <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 4 }}>Day 9 — you're climbing toward Gold tier</p>
            </div>
            <Shield streak={DATA.streak.current} best={DATA.streak.best} />
          </div>
        </div>

        <div style={{ padding: "0 40px 48px", flex: 1, overflow: "auto" }}>
          {/* Top row: Power Level + Daily Quests */}
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, marginBottom: 20 }}>
            <GlassCard title="Power level" icon="⚡" delay={100} style={{ minHeight: 240 }}>
              <PowerLevelMeter
                score={DATA.today.circadianScore}
                change={DATA.today.scoreChange}
                tier={DATA.powerLevel.tier}
                nextTier={DATA.powerLevel.nextTier}
                nextTierAt={DATA.powerLevel.nextTierAt}
                tiers={DATA.powerLevel.tiers}
              />
            </GlassCard>
            <GlassCard
              title="Daily quests"
              icon="📋"
              badge={
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: t.xpPurple, fontWeight: 600, padding: "3px 10px", background: t.xpPurpleSoft, borderRadius: 9999 }}>
                  {DATA.dailyQuests.filter(q => q.completed).length}/{DATA.dailyQuests.length} done
                </span>
              }
              delay={150}
            >
              <DailyQuests quests={DATA.dailyQuests} />
            </GlassCard>
          </div>

          {/* Two columns: Power-ups vs Bad Guys */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <GlassCard
              title="Active power-ups"
              icon="⚡"
              badge={<span style={{ fontSize: 11, fontFamily: "'DM Sans'", color: t.success, fontWeight: 600 }}>{DATA.powerUps.filter(p => p.active).length} active</span>}
              delay={200}
            >
              <PowerUps powerUps={DATA.powerUps} />
            </GlassCard>
            <GlassCard
              title="Bad guys to battle"
              icon="👾"
              badge={<span style={{ fontSize: 11, fontFamily: "'DM Sans'", color: t.danger, fontWeight: 600 }}>{DATA.badGuys.length} spotted</span>}
              delay={250}
            >
              <BadGuys badGuys={DATA.badGuys} />
            </GlassCard>
          </div>

          {/* Battle Log */}
          <GlassCard title="Battle log" icon="📊" delay={300} style={{ marginBottom: 20 }}>
            <BattleLog days={DATA.last14Days} />
          </GlassCard>
        </div>
      </div>

      {/* Bottom blur */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 48, background: "linear-gradient(to top, rgba(250,250,247,0.9), transparent)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", pointerEvents: "none", zIndex: 10 }} />
    </div>
  );
}
