import { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD V3: THE BATTLE DASHBOARD — FundFlow Visual Style
// SuperBetter-inspired: bad guys as externalized enemies,
// power-ups as strengths, daily quests with XP, power level tiers,
// and a shield that charges with streaks.
// ═══════════════════════════════════════════════════════════════════

const DATA = {
  patient: { name: "Sarah", trialDay: 9, trialLength: 21 },
  today: { circadianScore: 74, scoreChange: +3 },
  streak: { current: 5, best: 7 },
  powerLevel: {
    current: 74, tier: "Silver", nextTier: "Gold", nextTierAt: 80,
    tiers: [
      { name: "Bronze", min: 0, color: "#CD7F32" },
      { name: "Silver", min: 50, color: "#A8B5C4" },
      { name: "Gold", min: 80, color: "#F5A623" },
      { name: "Diamond", min: 95, color: "#7FDBFF" },
    ]
  },
  powerUps: [
    { id: "wake", label: "Perfect Wake Time", emoji: "⏰", active: true, detail: "Only 10 min off target", streak: 4 },
    { id: "nap", label: "No Nap Defense", emoji: "🛡️", active: true, detail: "Zero naps — strong willpower", streak: 9 },
    { id: "light", label: "Light Warrior", emoji: "☀️", active: true, detail: "52/60 min completed", streak: 5 },
  ],
  badGuys: [
    { id: "bedtime", label: "Late Bedtime", emoji: "👾", severity: "medium", detail: "Crept in 45 min late", tip: "Set a wind-down alarm at 10:00pm" },
    { id: "waking", label: "Night Waker", emoji: "👻", severity: "mild", detail: "One 12-min waking", tip: "Avoid screens if you wake up" },
  ],
  dailyQuests: [
    { id: "q1", label: "Start light session before 9:30am", completed: false, xp: 15, emoji: "🌅" },
    { id: "q2", label: "In bed by 10:45pm tonight", completed: false, xp: 10, emoji: "🛏️" },
    { id: "q3", label: "No naps today", completed: true, xp: 5, emoji: "💪" },
  ],
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
};

const t = {
  pageBg: "#F0EAFA",
  sidebarBg: "#1A1040", sidebarText: "rgba(255,255,255,0.55)", sidebarTextActive: "#FFFFFF",
  sidebarHover: "rgba(91,141,239,0.12)",
  cardBg: "#FFFFFF", cardShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)", cardRadius: 20,
  textPrimary: "#1A1040", textSecondary: "#6E6893", textMuted: "#A09ABF",
  purple: "#7C5CFC", purpleSoft: "#EDE8FF",
  blue: "#5B8DEF", blueSoft: "#E3EDFD",
  green: "#34C77B", greenSoft: "#E0F9EC",
  orange: "#F5A623", orangeSoft: "#FFF3D6",
  red: "#EF5B5B", redSoft: "#FDEAEA",
  border: "#EEEAF5", ringBg: "#EEEAF5",
  xpPurple: "#7C5CFC", xpPurpleSoft: "#EDE8FF",
  shieldBlue: "#5B8DEF",
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; background: transparent; }
  @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shieldPulse { 0%,100% { box-shadow: 0 0 12px rgba(91,141,239,0.3); } 50% { box-shadow: 0 0 24px rgba(91,141,239,0.5); } }
  @keyframes badGuyBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
`;

function Card({ title, badge, children, style, delay = 0 }) {
  return (
    <div style={{
      background: t.cardBg, borderRadius: t.cardRadius, boxShadow: t.cardShadow,
      padding: 24, animation: `fadeSlideIn 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
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

// ─── POWER LEVEL METER ────────────────────────────────────────────
function PowerLevelMeter({ score, change, tier, nextTier, nextTierAt, tiers }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let start = null;
    const run = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1000, 1);
      setAnim(Math.round((1 - Math.pow(1 - p, 4)) * score));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [score]);

  const currentTier = tiers.find(t2 => t2.name === tier);
  const tierColor = currentTier?.color || t.purple;

  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 28 }}>
      {/* Vertical power bar */}
      <div style={{ width: 44, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        {tiers.map(tr => (
          <div key={tr.name} style={{
            position: "absolute", bottom: `${tr.min}%`, left: -8, right: -8,
            height: 2, background: tr.color, opacity: 0.25, borderRadius: 1,
          }}>
            <span style={{
              position: "absolute", right: "calc(100% + 8px)", top: -7,
              fontSize: 9, fontFamily: "'Inter'", color: t.textMuted, fontWeight: 600, whiteSpace: "nowrap",
            }}>{tr.name}</span>
          </div>
        ))}
        <div style={{
          width: 28, flex: 1, borderRadius: 14, background: t.ringBg, overflow: "hidden",
          display: "flex", flexDirection: "column-reverse",
        }}>
          <div style={{
            width: "100%", height: `${anim}%`, borderRadius: 14,
            background: `linear-gradient(to top, ${tierColor}88, ${tierColor})`,
            boxShadow: `0 0 12px ${tierColor}33`,
            transition: "height 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
          }} />
        </div>
      </div>

      {/* Score details */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 52, fontFamily: "'Inter'", fontWeight: 800, color: t.textPrimary, lineHeight: 1 }}>{anim}</div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8,
          padding: "5px 12px", borderRadius: 8, background: `${tierColor}15`, width: "fit-content",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: tierColor }} />
          <span style={{ fontSize: 13, fontFamily: "'Inter'", fontWeight: 700, color: tierColor }}>{tier} Tier</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <span style={{ padding: "3px 8px", borderRadius: 6, background: t.greenSoft, fontSize: 12, fontFamily: "'Inter'", fontWeight: 600, color: t.green }}>↑ +{change}</span>
          <span style={{ fontSize: 12, fontFamily: "'Inter'", color: t.textMuted, fontWeight: 500 }}>from yesterday</span>
        </div>
        <div style={{ fontSize: 12, fontFamily: "'Inter'", color: t.textMuted, marginTop: 8, fontWeight: 500 }}>
          <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 600, color: t.purple }}>{nextTierAt - score}</span> more to {nextTier}
        </div>
      </div>
    </div>
  );
}

// ─── SHIELD ───────────────────────────────────────────────────────
function Shield({ streak, best }) {
  const strength = Math.min((streak / 7) * 100, 100);
  const level = streak >= 7 ? "Maximum" : streak >= 5 ? "Strong" : streak >= 3 ? "Building" : "Forming";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 18px", borderRadius: 16,
      background: `linear-gradient(135deg, ${t.blue}, #7BA4F5)`,
      boxShadow: "0 4px 16px rgba(91,141,239,0.25)",
      animation: streak >= 5 ? "shieldPulse 2s ease-in-out infinite" : "none",
    }}>
      <div style={{ position: "relative" }}>
        <span style={{ fontSize: 26 }}>🛡️</span>
        <div style={{
          position: "absolute", bottom: -4, right: -6,
          width: 18, height: 18, borderRadius: 6,
          background: t.orange, color: "#fff",
          fontSize: 10, fontFamily: "'Inter'", fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{streak}</div>
      </div>
      <div>
        <div style={{ fontSize: 16, fontFamily: "'Inter'", fontWeight: 700, color: "#fff" }}>{level} Shield</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }}>
            <div style={{ width: `${strength}%`, height: "100%", borderRadius: 2, background: "#fff" }} />
          </div>
          <span style={{ fontSize: 11, fontFamily: "'Inter'", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>best {best}</span>
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
          background: pu.active ? t.greenSoft : t.ringBg, borderRadius: 14,
          border: pu.active ? `1px solid ${t.green}18` : "1px solid transparent",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: pu.active ? `${t.green}18` : t.ringBg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 20 }}>{pu.emoji}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontFamily: "'Inter'", fontWeight: 700, color: t.textPrimary }}>{pu.label}</div>
            <div style={{ fontSize: 12, fontFamily: "'Inter'", color: t.textSecondary, marginTop: 2, fontWeight: 500 }}>{pu.detail}</div>
          </div>
          {pu.streak > 0 && (
            <span style={{
              padding: "4px 10px", borderRadius: 8, background: t.orangeSoft,
              fontSize: 12, fontFamily: "'JetBrains Mono'", fontWeight: 700, color: t.orange,
            }}>{pu.streak}x</span>
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
      {badGuys.map(bg => {
        const isMedium = bg.severity === "medium";
        const color = isMedium ? t.red : t.orange;
        const bgColor = isMedium ? t.redSoft : t.orangeSoft;
        return (
          <div key={bg.id} style={{
            display: "flex", alignItems: "flex-start", gap: 14, padding: 14,
            background: bgColor, borderRadius: 14, border: `1px solid ${color}12`,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: `${color}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "badGuyBounce 1.5s ease-in-out infinite",
            }}>
              <span style={{ fontSize: 20 }}>{bg.emoji}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontFamily: "'Inter'", fontWeight: 700, color: t.textPrimary }}>{bg.label}</div>
              <div style={{ fontSize: 12, fontFamily: "'Inter'", color: t.textSecondary, marginTop: 2, fontWeight: 500 }}>{bg.detail}</div>
              <div style={{ fontSize: 12, fontFamily: "'Inter'", color, fontWeight: 600, marginTop: 8, fontStyle: "italic" }}>Battle tip: {bg.tip}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── DAILY QUESTS ─────────────────────────────────────────────────
function DailyQuests({ quests }) {
  const earned = quests.filter(q => q.completed).reduce((s, q) => s + q.xp, 0);
  const total = quests.reduce((s, q) => s + q.xp, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {quests.map(q => (
        <div key={q.id} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
          borderRadius: 14, border: `1px solid ${q.completed ? `${t.green}18` : t.border}`,
          background: q.completed ? `${t.green}06` : "transparent",
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 8,
            background: q.completed ? t.green : "transparent",
            border: q.completed ? "none" : `2px solid ${t.ringBg}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700,
          }}>
            {q.completed && "✓"}
          </div>
          <span style={{ fontSize: 15 }}>{q.emoji}</span>
          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: 14, fontFamily: "'Inter'", fontWeight: 600, color: t.textPrimary,
              textDecoration: q.completed ? "line-through" : "none",
              opacity: q.completed ? 0.5 : 1,
            }}>{q.label}</span>
          </div>
          <span style={{
            padding: "4px 10px", borderRadius: 8,
            background: q.completed ? t.greenSoft : t.purpleSoft,
            fontSize: 12, fontFamily: "'JetBrains Mono'", fontWeight: 700,
            color: q.completed ? t.green : t.purple,
          }}>+{q.xp} XP</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10, borderTop: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 13, fontFamily: "'Inter'", color: t.textMuted, fontWeight: 500 }}>
          Today: <span style={{ fontFamily: "'JetBrains Mono'", color: t.purple, fontWeight: 700 }}>{earned} / {total} XP</span>
        </span>
      </div>
    </div>
  );
}

// ─── BATTLE LOG ───────────────────────────────────────────────────
function BattleLog({ days, currentDay }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
      {days.map((d, i) => {
        const isFuture = d.status === "future";
        const h = d.score !== null ? (d.score / 100) * 68 : 0;
        const color = d.status === "hit" ? t.green : d.status === "partial" ? t.orange : d.status === "missed" ? t.red : t.ringBg;
        const isCurrent = d.day === currentDay;

        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
            <div style={{
              width: "100%", maxWidth: 32, height: h || 4, borderRadius: 8,
              background: isFuture ? `${t.ringBg}66` : `linear-gradient(to top, ${color}88, ${color})`,
              border: isCurrent ? `2px solid ${t.purple}` : "none",
              transition: "height 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }} />
            <span style={{
              fontSize: 9, fontFamily: "'Inter'", fontWeight: isCurrent ? 700 : 500,
              color: isCurrent ? t.purple : t.textMuted,
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
    { id: "battle", label: "Battle HQ" },
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
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${t.blue}, ${t.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16 }}>⚔️</span>
        </div>
        <span style={{ fontSize: 17, fontFamily: "'Inter'", fontWeight: 700, color: "#fff" }}>Circadian</span>
      </div>

      <div style={{ marginBottom: 28, padding: "14px 16px", borderRadius: 14, background: "rgba(91,141,239,0.1)" }}>
        <div style={{ fontSize: 11, fontFamily: "'Inter'", color: t.sidebarText, fontWeight: 500, marginBottom: 8 }}>Campaign</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontFamily: "'Inter'", fontWeight: 800, color: "#fff" }}>Day {trialDay}</span>
          <span style={{ fontSize: 12, color: t.sidebarText }}>/ {trialLength}</span>
        </div>
        <div style={{ width: "100%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.1)" }}>
          <div style={{ width: `${progress}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${t.blue}, ${t.purple})` }} />
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
        background: `linear-gradient(135deg, ${t.blue}, ${t.purple})`, color: "#fff",
        fontSize: 14, fontFamily: "'Inter'", fontWeight: 700, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(91,141,239,0.3)",
      }}>Start Session</button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.blue}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>S</div>
        <div>
          <div style={{ fontSize: 13, fontFamily: "'Inter'", fontWeight: 600, color: "#fff" }}>Sarah</div>
          <div style={{ fontSize: 11, fontFamily: "'Inter'", color: t.sidebarText }}>Patient</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function DashboardV3Styled() {
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
              <h1 style={{ fontSize: 26, fontWeight: 800, color: t.textPrimary, marginBottom: 4 }}>Battle HQ</h1>
              <p style={{ fontSize: 14, color: t.textSecondary, fontWeight: 500 }}>Day 9 — climbing toward Gold tier</p>
            </div>
            <Shield streak={DATA.streak.current} best={DATA.streak.best} />
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "0 32px 32px" }}>
          {/* Top: Power Level + Daily Quests */}
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, marginBottom: 16 }}>
            <Card title="Power Level" delay={100} style={{ minHeight: 240 }}>
              <PowerLevelMeter
                score={DATA.today.circadianScore} change={DATA.today.scoreChange}
                tier={DATA.powerLevel.tier} nextTier={DATA.powerLevel.nextTier}
                nextTierAt={DATA.powerLevel.nextTierAt} tiers={DATA.powerLevel.tiers}
              />
            </Card>
            <Card title="Daily Quests"
              badge={<span style={{ fontSize: 12, fontFamily: "'JetBrains Mono'", color: t.purple, fontWeight: 700, padding: "4px 10px", background: t.purpleSoft, borderRadius: 8 }}>
                {DATA.dailyQuests.filter(q => q.completed).length}/{DATA.dailyQuests.length} done
              </span>}
              delay={150}>
              <DailyQuests quests={DATA.dailyQuests} />
            </Card>
          </div>

          {/* Power-ups vs Bad Guys */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Card title="Active Power-ups"
              badge={<span style={{ fontSize: 12, fontFamily: "'Inter'", color: t.green, fontWeight: 700 }}>{DATA.powerUps.filter(p => p.active).length} active</span>}
              delay={200}>
              <PowerUps powerUps={DATA.powerUps} />
            </Card>
            <Card title="Bad Guys to Battle"
              badge={<span style={{ fontSize: 12, fontFamily: "'Inter'", color: t.red, fontWeight: 700 }}>{DATA.badGuys.length} spotted</span>}
              delay={250}>
              <BadGuys badGuys={DATA.badGuys} />
            </Card>
          </div>

          {/* Battle Log */}
          <Card title="Battle Log" delay={300} style={{ marginBottom: 16 }}>
            <BattleLog days={DATA.last14Days} currentDay={DATA.patient.trialDay} />
          </Card>
        </div>
      </div>
    </div>
  );
}
