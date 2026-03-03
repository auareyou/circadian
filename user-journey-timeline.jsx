import { useState } from "react";

// ─── Design tokens (light mode) ───
const T = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F5F0",
  border: "#E8E8E0",
  borderLight: "#F0F0EA",
  text: "#1A1A2E",
  textSecondary: "#4A4A5A",
  muted: "#8A8A9A",
  mutedLight: "#B0B0BA",
  amber: "#D4891A",
  amberLight: "#FEF7E8",
  amberBorder: "#F5D89A",
  teal: "#2BA89E",
  tealLight: "#E8F8F6",
  tealBorder: "#A0DDD8",
  coral: "#D94F4F",
  coralLight: "#FEF0F0",
  coralBorder: "#F5B0B0",
  green: "#22A05B",
  greenLight: "#EDFAF2",
  greenBorder: "#A0DDB8",
  blue: "#4A7AB5",
  blueLight: "#EEF3FA",
  blueBorder: "#A8C4E0",
};

// ─── Journey Data ───
const OUT_OF_SCOPE_BEFORE = {
  label: "Before scope",
  items: [
    { icon: "🏥", label: "Clinical enrollment", sub: "Patient consents to trial" },
    { icon: "📦", label: "iPad provisioned & shipped", sub: "MDM-configured, app pre-installed" },
    { icon: "📬", label: "Patient receives package", sub: "Welcome card + iPad + light frame" },
  ],
};

const PHASES = [
  {
    id: "day1",
    label: "Day 1",
    subtitle: "Onboarding",
    color: T.amber,
    colorLight: T.amberLight,
    colorBorder: T.amberBorder,
    emoji: "🌅",
    designGoal: "High intention window — front-load all setup while motivation peaks",
    hookModel: "Investment phase: patient builds stored value (alarm time, connected apps, calibration)",
    steps: [
      { icon: "👋", label: "Welcome card", sub: "Physical card in package → power on", type: "setup", screen: "01-02" },
      { icon: "📖", label: "3-screen intro", sub: "What this is · How it works · Your commitment", type: "setup", screen: "03-05" },
      { icon: "🔑", label: "Patient ID entry", sub: "Confirm identity, link to care team", type: "setup", screen: "06" },
      { icon: "⏰", label: "Set alarm time", sub: "Patient picks wake time (7–11 AM window)", type: "setup", screen: "07" },
      { icon: "📱", label: "Connect content apps", sub: "Netflix, YouTube, TikTok — pre-connect now", type: "setup", screen: "08" },
      { icon: "☀️", label: "Test light position", sub: "Calibrate device in light frame", type: "setup", screen: "09" },
      { icon: "▶️", label: "First session", sub: "Starts immediately — timer begins when content plays", type: "session", screen: "10" },
      { icon: "🎉", label: "First session complete", sub: "Big celebration · SuperBetter 'epic win' moment", type: "milestone", screen: "11" },
    ],
  },
  {
    id: "regular",
    label: "Regular Days",
    subtitle: "Daily Sessions",
    color: T.teal,
    colorLight: T.tealLight,
    colorBorder: T.tealBorder,
    emoji: "🔄",
    designGoal: "Minimize friction — notification-driven flow, zero navigation needed",
    hookModel: "Trigger → Action → Variable Reward → Investment cycle repeats daily",
    steps: [
      { icon: "🔔", label: "Alarm notification", sub: "External trigger at chosen time", type: "trigger", screen: "12" },
      { icon: "📋", label: "Daily survey", sub: "Single question, 10 seconds, large touch targets", type: "action", screen: "13" },
      { icon: "🎬", label: "Content selection", sub: "Timer NOT running · recent apps first", type: "action", screen: "14" },
      { icon: "▶️", label: "Session in progress", sub: "Content dominates · minimal chrome · easy switch/pause", type: "session", screen: "15" },
      { icon: "☕", label: "Break (optional)", sub: "5 min first half · 15 min second half", type: "action", screen: "16" },
      { icon: "🏆", label: "42-min win moment", sub: "Quest complete! Remaining time = bonus power-up", type: "milestone", screen: "17" },
      { icon: "🌅", label: "Cinema dim", sub: "Gradual fade like theater lights — no abrupt stop", type: "session", screen: "18" },
      { icon: "📊", label: "Daily summary", sub: "Stats, streak, power-ups earned", type: "milestone", screen: "19" },
      { icon: "🗺️", label: "Progress dashboard", sub: "Optional — for curious/motivated patients", type: "optional", screen: "20" },
    ],
  },
  {
    id: "lastday",
    label: "Last Day",
    subtitle: "Offboarding",
    color: T.coral,
    colorLight: T.coralLight,
    colorBorder: T.coralBorder,
    emoji: "✨",
    designGoal: "Graceful closure — same routine, special messaging, no medical language",
    hookModel: "SuperBetter 'post-game': celebrate the journey, affirm the player's identity",
    steps: [
      { icon: "🌟", label: "Last day notification", sub: "Special framing: 'Your final session!'", type: "trigger", screen: "21" },
      { icon: "📋", label: "Final survey", sub: "Same familiar flow + 'Final Session' badge", type: "action", screen: "22" },
      { icon: "▶️", label: "Final session", sub: "Same UI, subtle final badge — no extra pressure", type: "session", screen: "23" },
      { icon: "🌅", label: "Final cinema dim", sub: "'Journey complete' — acknowledges the whole trial", type: "session", screen: "24" },
      { icon: "🏆", label: "Journey summary", sub: "Full trial recap: sessions, streaks, power-ups", type: "milestone", screen: "25" },
      { icon: "☀️", label: "Thank you & goodbye", sub: "Warm close · return instructions · no medical language", type: "milestone", screen: "26" },
    ],
  },
];

const OUT_OF_SCOPE_AFTER = {
  label: "After scope",
  items: [
    { icon: "📦", label: "iPad returned", sub: "Patient returns device at next visit" },
    { icon: "📊", label: "Data analyzed", sub: "Care team reviews adherence data" },
    { icon: "🔬", label: "Trial results", sub: "Clinical outcomes assessed" },
  ],
};

// ─── Step type styling (light mode) ───
const stepTypeColors = {
  setup: { bg: T.amberLight, border: T.amberBorder },
  trigger: { bg: T.tealLight, border: T.tealBorder },
  action: { bg: T.surfaceAlt, border: T.border },
  session: { bg: T.blueLight, border: T.blueBorder },
  milestone: { bg: T.greenLight, border: T.greenBorder },
  optional: { bg: T.surface, border: T.borderLight },
};

// ─── Components ───

const ScopeBoundary = ({ label, side }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "12px 0",
  }}>
    <div style={{
      width: 2, height: 40,
      background: `linear-gradient(180deg, ${side === "start" ? "transparent" : T.amber}, ${side === "start" ? T.amber : "transparent"})`,
    }} />
    <div style={{
      padding: "8px 20px", borderRadius: 20,
      background: T.amber, color: "#FFFFFF",
      fontSize: 11, fontWeight: 800, letterSpacing: 1,
      textTransform: "uppercase", whiteSpace: "nowrap",
      boxShadow: "0 2px 8px rgba(212,137,26,0.3)",
    }}>
      {label}
    </div>
    <div style={{
      width: 2, height: 40,
      background: `linear-gradient(180deg, ${side === "start" ? T.amber : "transparent"}, ${side === "start" ? "transparent" : T.amber})`,
    }} />
  </div>
);

const OutOfScopeSection = ({ data }) => (
  <div style={{
    padding: "16px 20px", borderRadius: 16,
    background: T.surfaceAlt,
    border: `1px dashed ${T.border}`,
    opacity: 0.6,
  }}>
    <div style={{
      fontSize: 9, color: T.muted, fontWeight: 700,
      letterSpacing: 2, textTransform: "uppercase", marginBottom: 12,
    }}>
      {data.label} — out of scope
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{item.icon}</span>
          <div>
            <div style={{ fontSize: 12, color: T.textSecondary, fontWeight: 500 }}>{item.label}</div>
            <div style={{ fontSize: 10, color: T.muted }}>{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PhaseCard = ({ phase, isExpanded, onToggle }) => (
  <div style={{
    borderRadius: 20, overflow: "hidden",
    border: `1px solid ${isExpanded ? phase.colorBorder : T.border}`,
    background: T.surface,
    boxShadow: isExpanded ? "0 2px 12px rgba(0,0,0,0.04)" : "none",
    transition: "all 0.3s ease",
  }}>
    {/* Phase header */}
    <div
      onClick={onToggle}
      style={{
        padding: "20px 24px", cursor: "pointer",
        background: isExpanded ? phase.colorLight : T.surface,
        display: "flex", alignItems: "center", gap: 16,
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: phase.colorLight,
        border: `2px solid ${phase.colorBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, flexShrink: 0,
      }}>
        {phase.emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{phase.label}</span>
          <span style={{ fontSize: 13, color: phase.color, fontWeight: 600 }}>{phase.subtitle}</span>
        </div>
        <div style={{ fontSize: 12, color: T.textSecondary, marginTop: 4, lineHeight: 1.5 }}>
          {phase.designGoal}
        </div>
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: T.surfaceAlt,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, color: T.muted, flexShrink: 0,
        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s",
      }}>
        ▼
      </div>
    </div>

    {/* Expanded: steps + Hooked model note */}
    {isExpanded && (
      <div style={{ padding: "0 24px 24px" }}>
        {/* Hook model callout */}
        <div style={{
          padding: "10px 16px", borderRadius: 12,
          background: phase.colorLight,
          border: `1px solid ${phase.colorBorder}`,
          marginBottom: 16,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>🪝</span>
          <span style={{ fontSize: 11, color: phase.color, fontWeight: 500, lineHeight: 1.5 }}>
            {phase.hookModel}
          </span>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {phase.steps.map((step, i) => {
            const typeStyle = stepTypeColors[step.type] || stepTypeColors.action;
            return (
              <div key={i} style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                {/* Timeline connector */}
                <div style={{
                  width: 32, display: "flex", flexDirection: "column", alignItems: "center",
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: 2, flex: 1,
                    background: i === 0 ? "transparent" : phase.colorBorder,
                  }} />
                  <div style={{
                    width: 10, height: 10, borderRadius: 5,
                    background: step.type === "milestone" ? phase.color : phase.colorLight,
                    border: step.type === "milestone" ? `2px solid ${phase.color}` : `2px solid ${phase.colorBorder}`,
                    flexShrink: 0,
                  }} />
                  <div style={{
                    width: 2, flex: 1,
                    background: i === phase.steps.length - 1 ? "transparent" : phase.colorBorder,
                  }} />
                </div>

                {/* Step card */}
                <div style={{
                  flex: 1, padding: "10px 14px", margin: "3px 0",
                  borderRadius: 12,
                  background: typeStyle.bg,
                  border: `1px solid ${typeStyle.border}`,
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ fontSize: 18, width: 28, textAlign: "center", flexShrink: 0 }}>{step.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: T.text,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      {step.label}
                      {step.type === "optional" && (
                        <span style={{
                          fontSize: 9, padding: "2px 6px", borderRadius: 4,
                          background: T.surfaceAlt, color: T.muted,
                          border: `1px solid ${T.border}`,
                        }}>OPTIONAL</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{step.sub}</div>
                  </div>
                  <div style={{
                    fontSize: 9, color: T.muted, fontWeight: 600,
                    padding: "2px 8px", borderRadius: 6,
                    background: T.surfaceAlt,
                    border: `1px solid ${T.borderLight}`,
                    flexShrink: 0,
                  }}>
                    #{step.screen}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);

// ─── Horizontal Mini-Timeline ───
const MiniTimeline = () => {
  const beforeCount = OUT_OF_SCOPE_BEFORE.items.length;
  const afterCount = OUT_OF_SCOPE_AFTER.items.length;

  return (
    <div style={{
      padding: "20px 24px", borderRadius: 16,
      background: T.surface,
      border: `1px solid ${T.border}`,
    }}>
      <div style={{
        fontSize: 9, color: T.muted, fontWeight: 700,
        letterSpacing: 2, textTransform: "uppercase", marginBottom: 16,
      }}>
        Scope overview
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 0, overflow: "hidden" }}>
        {/* Out of scope before */}
        <div style={{
          flex: beforeCount, height: 8, borderRadius: "4px 0 0 4px",
          background: T.surfaceAlt,
          border: `1px dashed ${T.border}`,
          borderRight: "none",
        }} />

        {/* Scope start marker */}
        <div style={{
          width: 3, height: 20, background: T.amber,
          borderRadius: 2, flexShrink: 0,
        }} />

        {/* In scope phases */}
        {PHASES.map((phase, i) => (
          <div key={phase.id} style={{
            flex: phase.steps.length, height: 8,
            background: phase.colorLight,
            borderTop: `2px solid ${phase.color}`,
            marginRight: i < PHASES.length - 1 ? 2 : 0,
          }} />
        ))}

        {/* Scope end marker */}
        <div style={{
          width: 3, height: 20, background: T.amber,
          borderRadius: 2, flexShrink: 0,
        }} />

        {/* Out of scope after */}
        <div style={{
          flex: afterCount, height: 8, borderRadius: "0 4px 4px 0",
          background: T.surfaceAlt,
          border: `1px dashed ${T.border}`,
          borderLeft: "none",
        }} />
      </div>

      {/* Labels */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginTop: 8 }}>
        <div style={{ flex: beforeCount, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: T.mutedLight }}>Pre-trial</div>
        </div>
        <div style={{ width: 3, flexShrink: 0 }} />
        {PHASES.map((phase, i) => (
          <div key={phase.id} style={{
            flex: phase.steps.length, textAlign: "center",
            marginRight: i < PHASES.length - 1 ? 2 : 0,
          }}>
            <div style={{ fontSize: 9, color: phase.color, fontWeight: 700 }}>{phase.label}</div>
            <div style={{ fontSize: 8, color: T.muted }}>{phase.steps.length} steps</div>
          </div>
        ))}
        <div style={{ width: 3, flexShrink: 0 }} />
        <div style={{ flex: afterCount, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: T.mutedLight }}>Post-trial</div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", gap: 16, marginTop: 16,
        paddingTop: 12, borderTop: `1px solid ${T.borderLight}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 3, height: 14, background: T.amber, borderRadius: 1 }} />
          <span style={{ fontSize: 10, color: T.muted }}>Scope boundary</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 6, background: T.surfaceAlt, border: `1px dashed ${T.border}`, borderRadius: 2 }} />
          <span style={{ fontSize: 10, color: T.muted }}>Out of scope</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 6, background: T.tealLight, borderTop: `2px solid ${T.teal}`, borderRadius: 0 }} />
          <span style={{ fontSize: 10, color: T.muted }}>In scope</span>
        </div>
      </div>
    </div>
  );
};

// ─── Step type legend ───
const StepTypeLegend = () => (
  <div style={{
    padding: "16px 20px", borderRadius: 16,
    background: T.surface,
    border: `1px solid ${T.border}`,
  }}>
    <div style={{
      fontSize: 9, color: T.muted, fontWeight: 700,
      letterSpacing: 2, textTransform: "uppercase", marginBottom: 12,
    }}>
      Step types
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {[
        { type: "setup", label: "Setup", desc: "One-time onboarding" },
        { type: "trigger", label: "Trigger", desc: "Entry point" },
        { type: "action", label: "Action", desc: "User action" },
        { type: "session", label: "Session", desc: "Light therapy" },
        { type: "milestone", label: "Milestone", desc: "Celebration" },
        { type: "optional", label: "Optional", desc: "Non-critical" },
      ].map(({ type, label, desc }) => {
        const style = stepTypeColors[type];
        return (
          <div key={type} style={{
            padding: "6px 12px", borderRadius: 10,
            background: style.bg, border: `1px solid ${style.border}`,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: T.text }}>{label}</span>
            <span style={{ fontSize: 9, color: T.muted }}>{desc}</span>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── RPG Model Callout ───
const RPGModel = () => (
  <div style={{
    padding: "20px 24px", borderRadius: 16,
    background: `linear-gradient(135deg, ${T.amberLight}, ${T.tealLight})`,
    border: `1px solid ${T.border}`,
  }}>
    <div style={{
      fontSize: 9, color: T.amber, fontWeight: 700,
      letterSpacing: 2, textTransform: "uppercase", marginBottom: 12,
    }}>
      Quest-based RPG model
    </div>
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {[
        { icon: "⚔️", title: "Main Quest", desc: "Onboard → Complete all sessions → Return iPad", color: T.amber, bg: T.amberLight, border: T.amberBorder },
        { icon: "🎯", title: "Daily Quest", desc: "One light session (binary: done or not done)", color: T.teal, bg: T.tealLight, border: T.tealBorder },
        { icon: "⚡", title: "Power-ups", desc: "No breaks · Focused · On-time start · Consistent sleep", color: T.green, bg: T.greenLight, border: T.greenBorder },
        { icon: "🏆", title: "Milestones", desc: "42-min win zone · Streak achievements · Journey complete", color: T.coral, bg: T.coralLight, border: T.coralBorder },
      ].map((item, i) => (
        <div key={i} style={{
          flex: "1 1 180px", padding: "12px 16px", borderRadius: 12,
          background: T.surface,
          border: `1px solid ${item.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.title}</span>
          </div>
          <div style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5 }}>{item.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ───
export default function UserJourneyTimeline() {
  const [expanded, setExpanded] = useState({ day1: true, regular: true, lastday: true });

  const togglePhase = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const totalSteps = PHASES.reduce((sum, p) => sum + p.steps.length, 0);
  const totalScreens = 26;

  return (
    <div style={{
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      background: T.bg, minHeight: "100vh", color: T.text,
      maxWidth: 900, margin: "0 auto", padding: "32px 24px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>☀️</span>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: 0.5 }}>
              Patient Journey
            </div>
            <div style={{ fontSize: 14, color: T.muted }}>
              Circadian OS · Light Therapy iPad App
            </div>
          </div>
        </div>

        {/* Key stats */}
        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          {[
            { val: "3", label: "Phases", color: T.amber, bg: T.amberLight, border: T.amberBorder },
            { val: String(totalSteps), label: "Steps mapped", color: T.teal, bg: T.tealLight, border: T.tealBorder },
            { val: String(totalScreens), label: "Screens designed", color: T.green, bg: T.greenLight, border: T.greenBorder },
            { val: "1–14", label: "Days in trial", color: T.coral, bg: T.coralLight, border: T.coralBorder },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "12px 20px", borderRadius: 14,
              background: s.bg,
              border: `1px solid ${s.border}`,
              textAlign: "center", flex: "1 1 100px",
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: T.textSecondary, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini timeline - scope overview */}
      <MiniTimeline />

      <div style={{ height: 24 }} />

      {/* RPG model */}
      <RPGModel />

      <div style={{ height: 24 }} />

      {/* Step type legend */}
      <StepTypeLegend />

      <div style={{ height: 32 }} />

      {/* === JOURNEY FLOW === */}

      {/* Out of scope: before */}
      <OutOfScopeSection data={OUT_OF_SCOPE_BEFORE} />

      {/* Scope start */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ScopeBoundary label="Scope starts — patient has iPad" side="start" />
      </div>

      {/* Phases */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {PHASES.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isExpanded={expanded[phase.id]}
            onToggle={() => togglePhase(phase.id)}
          />
        ))}
      </div>

      {/* Scope end */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ScopeBoundary label="Scope ends — last session complete" side="end" />
      </div>

      {/* Out of scope: after */}
      <OutOfScopeSection data={OUT_OF_SCOPE_AFTER} />

      {/* Footer note */}
      <div style={{
        marginTop: 32, padding: "16px 20px", borderRadius: 14,
        background: T.surface,
        border: `1px solid ${T.borderLight}`,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          Screen references (#01–#26) correspond to the wireframe set in <span style={{ color: T.amber, fontWeight: 600 }}>circadian-wireframes.jsx</span>
        </div>
      </div>
    </div>
  );
}
