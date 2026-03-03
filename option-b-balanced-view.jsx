import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// CIRCADIAN OS — Option B: The Balanced View
// iOS 26 Liquid Glass Edition
// ═══════════════════════════════════════════════════════════════════

const DATA = {
  patient: { name: "Sarah", trialDay: 9, trialLength: 21 },
  today: {
    circadianScore: 74, scoreChange: +3,
    lightMinutes: 52, lightPrescribed: 60,
    message: "Your consistency is building momentum.",
    quest: "Start your light session before 9:30am tomorrow"
  },
  streak: { current: 5, best: 7 },
  last14Days: [
    { day: 1, date: "02-20", score: 45, light: 30, bedtimeDev: 90, wakeDev: 60, status: "partial" },
    { day: 2, date: "02-21", score: 52, light: 42, bedtimeDev: 60, wakeDev: 30, status: "partial" },
    { day: 3, date: "02-22", score: 48, light: 25, bedtimeDev: 75, wakeDev: 45, status: "missed" },
    { day: 4, date: "02-23", score: 61, light: 55, bedtimeDev: 30, wakeDev: 20, status: "partial" },
    { day: 5, date: "02-24", score: 58, light: 48, bedtimeDev: 45, wakeDev: 15, status: "partial" },
    { day: 6, date: "02-25", score: 65, light: 58, bedtimeDev: 20, wakeDev: 10, status: "hit" },
    { day: 7, date: "02-26", score: 70, light: 60, bedtimeDev: 15, wakeDev: 5, status: "hit" },
    { day: 8, date: "02-27", score: 68, light: 55, bedtimeDev: 25, wakeDev: 10, status: "partial" },
    { day: 9, date: "02-28", score: 74, light: 52, bedtimeDev: 45, wakeDev: 10, status: "hit" },
    { day: 10, date: "03-01", score: null, light: null, bedtimeDev: null, wakeDev: null, status: "future" },
    { day: 11, date: "03-02", score: null, light: null, bedtimeDev: null, wakeDev: null, status: "future" },
    { day: 12, date: "03-03", score: null, light: null, bedtimeDev: null, wakeDev: null, status: "future" },
    { day: 13, date: "03-04", score: null, light: null, bedtimeDev: null, wakeDev: null, status: "future" },
    { day: 14, date: "03-05", score: null, light: null, bedtimeDev: null, wakeDev: null, status: "future" }
  ],
  bestDay: { day: 7, date: "02-26", score: 70, reason: "Full light session + perfect sleep timing" }
};

// ─── DESIGN TOKENS ──────────────────────────────────────────────────
const t = {
  textPrimary: "#1A1A1A", textSecondary: "#6B6B6B", textMuted: "#9C9C9C",
  accent: "#E8A838", accentSoft: "#FFF3D6",
  success: "#4CAF82", warning: "#E8A838", danger: "#D4785C", dangerSoft: "#FDEAE4",
  chartLine: "#2D7A5F", ringBg: "#EAEAEA", ringFill: "#4CAF82",
  // Liquid Glass tokens
  glass: "rgba(255, 255, 255, 0.42)",
  glassThin: "rgba(255, 255, 255, 0.3)",
  glassBorder: "rgba(255, 255, 255, 0.65)",
  glassShadow: "0 2px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03)",
  glassInset: "inset 0 1px 1px rgba(255,255,255,0.6)",
  blur: "blur(20px) saturate(180%)",
  radiusOuter: 24, radiusInner: 16, radiusPill: 9999,
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; background: transparent; }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// ─── GLASS CARD ─────────────────────────────────────────────────────
function GlassCard({ title, children, style, delay = 0 }) {
  return (
    <div style={{
      background: t.glass,
      backdropFilter: t.blur, WebkitBackdropFilter: t.blur,
      borderRadius: t.radiusOuter, border: `1px solid ${t.glassBorder}`,
      boxShadow: `${t.glassShadow}, ${t.glassInset}`,
      padding: 24, position: "relative", overflow: "hidden",
      animation: `fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
      ...style,
    }}>
      {/* Specular highlight */}
      <div style={{
        position: "absolute", top: 0, left: 24, right: 24, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 70%, transparent)",
        pointerEvents: "none"
      }} />
      {title && (
        <div style={{
          fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          color: t.textSecondary, marginBottom: 16
        }}>{title}</div>
      )}
      {children}
    </div>
  );
}

// ─── SUN ICON ───────────────────────────────────────────────────────
function SunIcon({ score }) {
  // SVG sun with glass-like glow
  const color = score >= 75 ? t.accent : score >= 50 ? "#D4A84A" : t.textMuted;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <defs>
        <filter id="sunGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="18" cy="18" r="8" fill={color} filter="url(#sunGlow)" opacity={0.9} />
      {score >= 50 && [0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <line key={i}
          x1={18 + 11 * Math.cos(a * Math.PI / 180)} y1={18 + 11 * Math.sin(a * Math.PI / 180)}
          x2={18 + 14 * Math.cos(a * Math.PI / 180)} y2={18 + 14 * Math.sin(a * Math.PI / 180)}
          stroke={color} strokeWidth={score >= 75 ? 2 : 1.5} strokeLinecap="round"
          opacity={score >= 75 ? 0.8 : 0.5}
        />
      ))}
      {score < 75 && score >= 50 && (
        <circle cx="24" cy="14" r="6" fill="rgba(255,255,255,0.6)" />
      )}
      {score < 50 && (
        <>
          <circle cx="22" cy="14" r="7" fill="rgba(200,200,200,0.5)" />
          <circle cx="28" cy="16" r="5" fill="rgba(200,200,200,0.4)" />
        </>
      )}
    </svg>
  );
}

// ─── DOT GRID ───────────────────────────────────────────────────────
function DotGrid({ days }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {days.map((d, i) => {
        const isFuture = d.status === "future";
        const size = isFuture ? 6 : 12;
        let fill = t.ringBg;
        if (d.status === "hit") fill = t.success;
        else if (d.status === "partial") fill = t.warning;
        else if (d.status === "missed") fill = "transparent";

        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <svg width={size + 4} height={size + 4} viewBox={`0 0 ${size + 4} ${size + 4}`}>
              {d.status === "partial" ? (
                <>
                  {/* Half-filled dot */}
                  <defs>
                    <clipPath id={`half-${i}`}>
                      <rect x="0" y="0" width={(size + 4) / 2} height={size + 4} />
                    </clipPath>
                  </defs>
                  <circle cx={(size + 4) / 2} cy={(size + 4) / 2} r={size / 2} fill="none" stroke={t.warning} strokeWidth={1.5} />
                  <circle cx={(size + 4) / 2} cy={(size + 4) / 2} r={size / 2} fill={t.warning} clipPath={`url(#half-${i})`} />
                </>
              ) : d.status === "missed" ? (
                <circle cx={(size + 4) / 2} cy={(size + 4) / 2} r={size / 2} fill="none" stroke={`${t.danger}66`} strokeWidth={1.5} />
              ) : isFuture ? (
                <circle cx={(size + 4) / 2} cy={(size + 4) / 2} r={size / 2} fill={t.ringBg} opacity={0.5} />
              ) : (
                <>
                  <circle cx={(size + 4) / 2} cy={(size + 4) / 2} r={size / 2} fill={fill} />
                  {/* Tiny glass highlight */}
                  <circle cx={(size + 4) / 2 - 1} cy={(size + 4) / 2 - 2} r={2} fill="rgba(255,255,255,0.4)" />
                </>
              )}
            </svg>
            {!isFuture && (
              <span style={{ fontSize: 9, fontFamily: "'DM Sans'", color: t.textMuted }}>D{d.day}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PROGRESS RING (with glass interior) ────────────────────────────
function ProgressRing({ value, max }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let start = null;
    const dur = 700;
    const run = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setAnim(e * (value / max));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [value, max]);

  const r = 46, sw = 8, cx = 58, cy = 58;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - anim);

  return (
    <svg width={116} height={116} viewBox="0 0 116 116">
      <defs>
        <filter id="ringGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.ringFill} />
          <stop offset="100%" stopColor="#3ABD8E" />
        </linearGradient>
      </defs>
      {/* Glass-like inner fill */}
      <circle cx={cx} cy={cy} r={r - sw / 2} fill="rgba(255,255,255,0.15)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${t.ringBg}88`} strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} filter="url(#ringGlow)" />
      <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: 22, fontFamily: "'JetBrains Mono', monospace", fill: t.textPrimary }}>{value}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: 12, fontFamily: "'DM Sans'", fill: t.textSecondary }}>/ {max}</text>
      <text x={cx} y={cy + 28} textAnchor="middle" style={{ fontSize: 10, fontFamily: "'DM Sans'", fill: t.textMuted }}>min</text>
    </svg>
  );
}

// ─── DEVIATION BARS ─────────────────────────────────────────────────
function DeviationBars({ label, days, field }) {
  const completed = days.filter(d => d[field] !== null);
  const maxDev = 90, barMaxH = 38;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 500, color: t.textSecondary, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ position: "relative", height: barMaxH + 2 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `${t.textMuted}33` }} />
        <div style={{ display: "flex", gap: 6, paddingTop: 2 }}>
          {completed.map((d, i) => {
            const dev = d[field];
            const h = Math.max(2, (dev / maxDev) * barMaxH);
            const color = dev <= 15 ? t.success : dev <= 45 ? t.warning : t.danger;
            return (
              <div key={i} style={{
                width: 12, height: h, borderRadius: 6, position: "relative", overflow: "hidden",
                background: `linear-gradient(to bottom, ${color}cc, ${color})`,
                boxShadow: `0 1px 3px ${color}22`,
                transition: "height 500ms cubic-bezier(0.16, 1, 0.3, 1)"
              }}>
                {/* Glass highlight on bar */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "40%",
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
                  borderRadius: "6px 6px 0 0"
                }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ────────────────────────────────────────────────────────
function Sidebar() {
  const [active, setActive] = useState("health");
  const items = [
    { id: "health", label: "My health", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 17s-6-4.5-6-8.5A3.5 3.5 0 0 1 10 5a3.5 3.5 0 0 1 6 3.5c0 4-6 8.5-6 8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: "sleep", label: "Sleep log", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 10A6 6 0 1 1 7 3a8 8 0 0 0 9 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: "light", label: "Light therapy", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 3v1.5M10 15.5V17M3 10h1.5M15.5 10H17M5.05 5.05l1.06 1.06M13.89 13.89l1.06 1.06M5.05 14.95l1.06-1.06M13.89 6.11l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { id: "messages", label: "Messages", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 5h12a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 16 15h-7l-4 3v-3H4a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 4 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: "settings", label: "Settings", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4M4.4 15.6l1.4-1.4M14.2 5.8l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  ];

  return (
    <div style={{
      width: 200, flexShrink: 0, padding: 16,
      display: "flex", flexDirection: "column",
      background: t.glass, backdropFilter: t.blur, WebkitBackdropFilter: t.blur,
      borderRadius: t.radiusOuter, border: `1px solid ${t.glassBorder}`,
      boxShadow: `${t.glassShadow}, ${t.glassInset}`,
      margin: "16px 0 16px 16px",
      position: "relative", overflow: "hidden",
      animation: "fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) both",
    }}>
      {/* Specular highlight */}
      <div style={{ position: "absolute", top: 0, left: 16, right: 16, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 50%, transparent)", pointerEvents: "none" }} />

      {/* Wordmark */}
      <div style={{ fontSize: 18, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, padding: "8px 8px 16px" }}>
        Circadian
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "0 8px 16px" }} />

      {/* Trial progress */}
      <div style={{ padding: "0 8px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: t.textMuted, marginBottom: 8 }}>Trial progress</div>
        <div style={{ height: 4, borderRadius: 2, background: t.ringBg, overflow: "hidden" }}>
          <div style={{ width: `${(DATA.patient.trialDay / DATA.patient.trialLength) * 100}%`, height: "100%", borderRadius: 2, background: t.accent }} />
        </div>
        <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 6 }}>Day {DATA.patient.trialDay} of {DATA.patient.trialLength}</div>
      </div>

      {/* Nav items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {items.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 12, border: "none",
              background: isActive ? t.accentSoft : "transparent",
              cursor: "pointer", width: "100%",
              color: isActive ? t.accent : t.textSecondary,
              fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: isActive ? 500 : 400,
              transition: "all 200ms ease",
              minHeight: 44, // touch target
            }}>
              <span style={{ color: isActive ? t.accent : t.textMuted }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 600, color: t.textSecondary,
        margin: "8px auto 4px",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4)"
      }}>S</div>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────
export default function OptionBBalancedView() {
  return (
    <div style={{
      width: 1194, height: 834,
      background: "linear-gradient(135deg, #FAFAF7 0%, #F0EDE4 50%, #E8E4DA 100%)",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", position: "relative"
    }}>
      <style>{globalCSS}</style>

      {/* Ambient orbs */}
      <div style={{
        position: "fixed", top: -100, right: -60, width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,168,56,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: -80, left: -40, width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(76,175,130,0.06) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <Sidebar />

      <div style={{ flex: 1, overflow: "auto", position: "relative", display: "flex", flexDirection: "column" }}>
        {/* Header with "My Health" title */}
        <div style={{
          padding: "24px 48px 0",
          position: "relative", zIndex: 1
        }}>
          <h1 style={{ fontSize: 24, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, fontWeight: 400, margin: 0 }}>My Health</h1>
        </div>

        <div style={{ padding: "24px 48px 48px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Score Card — Full Width */}
          <GlassCard delay={100}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
              <SunIcon score={DATA.today.circadianScore} />
              <span style={{ fontSize: 48, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, lineHeight: 1 }}>
                {DATA.today.circadianScore}
              </span>
              <span style={{ fontSize: 15, color: t.textPrimary, maxWidth: 340, lineHeight: 1.5 }}>
                {DATA.today.message}
              </span>
            </div>
            <DotGrid days={DATA.last14Days} />
          </GlassCard>

          {/* Three Column Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {/* Light Therapy */}
            <GlassCard title="Light therapy" delay={200}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <ProgressRing value={DATA.today.lightMinutes} max={DATA.today.lightPrescribed} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 24 }}>🌿</span>
                  <span style={{ fontSize: 14, color: t.textSecondary }}>Healthy</span>
                </div>
              </div>
            </GlassCard>

            {/* Sleep Consistency */}
            <GlassCard title="Sleep consistency" delay={300}>
              <DeviationBars label="Bedtime deviation" days={DATA.last14Days} field="bedtimeDev" />
              <DeviationBars label="Wake time deviation" days={DATA.last14Days} field="wakeDev" />
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4, textAlign: "center" }}>Smaller bars = more consistent</div>
            </GlassCard>

            {/* Best Day — accent-tinted glass */}
            <div style={{
              background: "rgba(255, 243, 214, 0.45)",
              backdropFilter: t.blur, WebkitBackdropFilter: t.blur,
              borderRadius: t.radiusOuter, border: `1px solid rgba(232, 168, 56, 0.25)`,
              boxShadow: `${t.glassShadow}, inset 0 1px 1px rgba(255,255,255,0.5)`,
              padding: 24, position: "relative", overflow: "hidden",
              animation: "fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) 400ms both"
            }}>
              {/* Specular highlight */}
              <div style={{
                position: "absolute", top: 0, left: 24, right: 24, height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7) 50%, transparent)",
                pointerEvents: "none"
              }} />
              <div style={{ fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 500, color: t.textSecondary, marginBottom: 16 }}>Best day</div>
              {/* Star */}
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: "absolute", top: 20, right: 20 }}>
                <defs>
                  <filter id="starGlow"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={t.accent} filter="url(#starGlow)" />
              </svg>
              <div style={{ fontSize: 20, fontFamily: "'DM Sans'", fontWeight: 500, color: t.textPrimary, marginBottom: 6 }}>Day {DATA.bestDay.day}</div>
              <div style={{ fontSize: 20, fontFamily: "'JetBrains Mono', monospace", color: t.textPrimary, marginBottom: 12 }}>Score: {DATA.bestDay.score}</div>
              <div style={{ fontSize: 15, color: t.textPrimary, lineHeight: 1.5 }}>{DATA.bestDay.reason}</div>
            </div>
          </div>

          {/* Quest Bar — iOS 26 floating pill style */}
          <div style={{
            background: t.glassThin, backdropFilter: t.blur, WebkitBackdropFilter: t.blur,
            borderRadius: t.radiusOuter, border: `1px solid ${t.glassBorder}`,
            boxShadow: `${t.glassShadow}, ${t.glassInset}`,
            padding: "16px 24px",
            borderLeft: `3px solid ${t.accent}`,
            display: "flex", alignItems: "center", gap: 12,
            animation: "fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) 500ms both"
          }}>
            <span style={{ fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 500, color: t.accent }}>Today's quest</span>
            <span style={{ fontSize: 15, color: t.textPrimary }}>{DATA.today.quest}</span>
            <span style={{ fontSize: 20, marginLeft: "auto" }}>☀️</span>
          </div>
        </div>
      </div>
    </div>
  );
}