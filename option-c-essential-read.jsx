import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// CIRCADIAN OS — Option C: The Essential Read (with Sidebar)
// iOS 26 Liquid Glass Edition
// ═══════════════════════════════════════════════════════════════════

const DATA = {
  patient: { name: "Sarah", trialDay: 9, trialLength: 21 },
  today: {
    circadianScore: 74, scoreChange: +3,
    lightMinutes: 52, lightPrescribed: 60,
    bedtimeTarget: "22:30", bedtimeActual: "23:15", bedtimeDeviationMin: 45,
    wakeTarget: "07:00", wakeActual: "07:10", wakeDeviationMin: 10,
    naps: 0, nightWakings: 1, nightWakingDurationMin: 12,
    message: "Your wake time was spot on today. Your plant is growing.",
    quest: "Start your light session before 9:30am tomorrow"
  },
  streak: { current: 5, best: 7 },
  plantState: "healthy",
  last14Days: [
    { day: 1, status: "partial" }, { day: 2, status: "partial" }, { day: 3, status: "missed" },
    { day: 4, status: "partial" }, { day: 5, status: "partial" }, { day: 6, status: "hit" },
    { day: 7, status: "hit" }, { day: 8, status: "partial" }, { day: 9, status: "hit" },
    { day: 10, status: "future" }, { day: 11, status: "future" }, { day: 12, status: "future" },
    { day: 13, status: "future" }, { day: 14, status: "future" }
  ]
};

const t = {
  textPrimary: "#1A1A1A", textSecondary: "#6B6B6B", textMuted: "#9C9C9C",
  accent: "#E8A838", accentSoft: "#FFF3D6",
  success: "#4CAF82", warning: "#E8A838", danger: "#D4785C", dangerSoft: "#FDEAE4",
  ringBg: "#EAEAEA",
  // Liquid Glass
  glass: "rgba(255, 255, 255, 0.42)",
  glassBorder: "rgba(255, 255, 255, 0.65)",
  glassShadow: "0 2px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03)",
  glassInset: "inset 0 1px 1px rgba(255,255,255,0.6)",
  glassSheet: "rgba(255, 255, 255, 0.72)",
  blur: "blur(20px) saturate(180%)",
  blurHeavy: "blur(32px) saturate(200%)",
  radiusOuter: 24, radiusPill: 9999,
  shadowGlow: "0 0 24px rgba(232, 168, 56, 0.15)",
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.75; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes plantGlow {
    0%, 100% { filter: drop-shadow(0 0 12px rgba(232, 168, 56, 0.0)); }
    50% { filter: drop-shadow(0 0 20px rgba(232, 168, 56, 0.12)); }
  }
  @keyframes gentlePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(232, 168, 56, 0.0); }
    50% { box-shadow: 0 0 20px 4px rgba(232, 168, 56, 0.08); }
  }
`;

// ─── DOT GRID ───────────────────────────────────────────────────────
function DotGrid({ days }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      {days.map((d, i) => {
        const isFuture = d.status === "future";
        const size = isFuture ? 6 : 12;
        let fill = t.ringBg;
        if (d.status === "hit") fill = t.success;
        else if (d.status === "partial") fill = t.warning;

        return (
          <div key={i}>
            <svg width={size + 4} height={size + 4} viewBox={`0 0 ${size + 4} ${size + 4}`}>
              {d.status === "partial" ? (
                <>
                  <defs><clipPath id={`hc-${i}`}><rect x="0" y="0" width={(size + 4) / 2} height={size + 4} /></clipPath></defs>
                  <circle cx={(size + 4) / 2} cy={(size + 4) / 2} r={size / 2} fill="none" stroke={t.warning} strokeWidth={1.5} />
                  <circle cx={(size + 4) / 2} cy={(size + 4) / 2} r={size / 2} fill={t.warning} clipPath={`url(#hc-${i})`} />
                </>
              ) : d.status === "missed" ? (
                <circle cx={(size + 4) / 2} cy={(size + 4) / 2} r={size / 2} fill="none" stroke={`${t.danger}66`} strokeWidth={1.5} />
              ) : isFuture ? (
                <circle cx={(size + 4) / 2} cy={(size + 4) / 2} r={size / 2} fill={t.ringBg} opacity={0.4} />
              ) : (
                <>
                  <circle cx={(size + 4) / 2} cy={(size + 4) / 2} r={size / 2} fill={fill} />
                  <circle cx={(size + 4) / 2 - 1} cy={(size + 4) / 2 - 2} r={1.5} fill="rgba(255,255,255,0.4)" />
                </>
              )}
            </svg>
          </div>
        );
      })}
    </div>
  );
}

// ─── DETAIL ROW ─────────────────────────────────────────────────────
function DetailRow({ label, value, sub, check }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.04)"
    }}>
      <span style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.4 }}>{label}</span>
      <div style={{ textAlign: "right" }}>
        <span style={{ fontSize: 18, fontFamily: "'JetBrains Mono', monospace", color: t.textPrimary }}>
          {value}
        </span>
        {check && <span style={{ color: t.success, marginLeft: 6, fontSize: 15 }}>✓</span>}
        {sub && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>({sub})</div>}
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────
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
      <div style={{ position: "absolute", top: 0, left: 16, right: 16, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 50%, transparent)", pointerEvents: "none" }} />
      <div style={{ fontSize: 18, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, padding: "8px 8px 16px" }}>Circadian</div>
      <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "0 8px 16px" }} />
      <div style={{ padding: "0 8px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: t.textMuted, marginBottom: 8 }}>Trial progress</div>
        <div style={{ height: 4, borderRadius: 2, background: t.ringBg, overflow: "hidden" }}>
          <div style={{ width: `${(DATA.patient.trialDay / DATA.patient.trialLength) * 100}%`, height: "100%", borderRadius: 2, background: t.accent }} />
        </div>
        <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 6 }}>Day {DATA.patient.trialDay} of {DATA.patient.trialLength}</div>
      </div>
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
              transition: "all 200ms ease", minHeight: 44,
            }}>
              <span style={{ color: isActive ? t.accent : t.textMuted }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
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
export default function OptionCEssentialRead() {
  const [showSheet, setShowSheet] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setShowHint(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const wakeOnTarget = DATA.today.wakeDeviationMin <= 15;

  return (
    <div style={{
      width: 1194, height: 834,
      background: "linear-gradient(160deg, #FAFAF7 0%, #F2EDE3 40%, #EBE5D8 70%, #E4DFD2 100%)",
      fontFamily: "'DM Sans', sans-serif",
      overflow: "hidden", position: "relative",
      display: "flex", flexDirection: "row"
    }}>
      <style>{globalCSS}</style>

      {/* Ambient light orbs — refracted light behind glass */}
      <div style={{
        position: "absolute", top: "15%", left: "30%", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,168,56,0.07) 0%, transparent 65%)",
        pointerEvents: "none", filter: "blur(40px)"
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "25%", width: 250, height: 250, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(76,175,130,0.05) 0%, transparent 65%)",
        pointerEvents: "none", filter: "blur(30px)"
      }} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 8,
        position: "relative",
        overflow: "hidden",
        height: 834,
        width: "auto",
        paddingBottom: 24
      }}>

        {/* Plant — with glass platform */}
        <div
          onClick={() => { setShowSheet(!showSheet); if (!showSheet) setShowHint(false); }}
          style={{
            cursor: "pointer", userSelect: "none",
            display: "flex", flexDirection: "column", alignItems: "center",
            animation: "plantGlow 3s ease-in-out infinite",
            transform: showSheet ? "translateY(-80px) scale(0.9)" : "translateY(0) scale(1)",
            opacity: showSheet ? 0.7 : 1,
            transition: "all 450ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Glass pedestal */}
          <div style={{
            width: 180, height: 180,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(12px) saturate(150%)",
            WebkitBackdropFilter: "blur(12px) saturate(150%)",
            border: "1px solid rgba(255,255,255,0.45)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.03), inset 0 2px 4px rgba(255,255,255,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "breathe 3s ease-in-out infinite, gentlePulse 3s ease-in-out infinite",
            transition: "transform 150ms ease",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <span style={{ fontSize: 80, lineHeight: 1 }}>🌿</span>
          </div>
        </div>

        {/* Streak — glass capsule */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: t.glass, backdropFilter: "blur(12px) saturate(160%)", WebkitBackdropFilter: "blur(12px) saturate(160%)",
          borderRadius: t.radiusPill, border: `1px solid ${t.glassBorder}`,
          padding: "8px 20px", marginTop: 12,
          boxShadow: `${t.glassShadow}, ${t.glassInset}`,
          animation: mounted ? "fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both" : "none",
          transform: showSheet ? "translateY(-80px) scale(0.9)" : "translateY(0) scale(1)",
          opacity: showSheet ? 0.7 : 1,
          transition: "all 450ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <span style={{ fontSize: 32, fontFamily: "'DM Serif Display', serif", color: t.textPrimary, lineHeight: 1 }}>
            {DATA.streak.current}
          </span>
          <span style={{ fontSize: 15, color: t.textSecondary }}>day streak</span>
          <span style={{ fontSize: 20, animation: "flicker 2s ease-in-out infinite" }}>🔥</span>
        </div>

        {/* Message */}
        <p style={{
          fontSize: 16, color: t.textPrimary, textAlign: "center",
          maxWidth: 400, lineHeight: 1.6, marginTop: 12,
          animation: mounted ? "fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both" : "none",
          transform: showSheet ? "translateY(-80px) scale(0.9)" : "translateY(0) scale(1)",
          opacity: showSheet ? 0.7 : 1,
          transition: "all 450ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          {DATA.today.message}
        </p>

        {/* Quest Card — Liquid Glass */}
        <div style={{
          background: t.glass,
          backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)",
          borderRadius: t.radiusOuter, border: `1px solid ${t.glassBorder}`,
          boxShadow: `${t.glassShadow}, ${t.glassInset}`,
          padding: "16px 28px", maxWidth: 400, marginTop: 8,
          position: "relative", overflow: "hidden",
          animation: mounted ? "fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both" : "none",
          transform: showSheet ? "translateY(-80px) scale(0.9)" : "translateY(0) scale(1)",
          opacity: showSheet ? 0.7 : 1,
          transition: "all 450ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          {/* Specular highlight */}
          <div style={{
            position: "absolute", top: 0, left: 20, right: 20, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 50%, transparent)",
            pointerEvents: "none"
          }} />
          <div style={{ fontSize: 12, fontWeight: 500, color: t.accent, marginBottom: 6 }}>Today's quest</div>
          <div style={{ fontSize: 15, color: t.textPrimary, display: "flex", alignItems: "center", gap: 8 }}>
            {DATA.today.quest} <span style={{ fontSize: 18 }}>☀️</span>
          </div>
        </div>

        {/* Hint */}
        <p style={{
          fontSize: 13, color: t.textMuted, marginTop: 20,
          opacity: showHint && !showSheet ? 1 : 0,
          transition: "opacity 400ms ease",
        }}>
          Tap your plant to see details
        </p>

        {/* Overlay */}
        {showSheet && (
          <div
            onClick={() => setShowSheet(false)}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.06)",
              backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
              zIndex: 10
            }}
          />
        )}

        {/* Bottom Sheet — iOS 26 Liquid Glass */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "58%",
          background: t.glassSheet,
          backdropFilter: t.blurHeavy, WebkitBackdropFilter: t.blurHeavy,
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          border: "1px solid rgba(255,255,255,0.6)", borderBottom: "none",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.7)",
          zIndex: 20,
          transform: showSheet ? "translateY(0)" : "translateY(100%)",
          transition: "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex", flexDirection: "column",
          padding: "0 64px 32px",
          overflow: "hidden"
        }}>
          {/* Specular top edge */}
          <div style={{
            position: "absolute", top: 0, left: 48, right: 48, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 70%, transparent)",
            pointerEvents: "none"
          }} />

          {/* Handle bar */}
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
            <div style={{
              width: 40, height: 5, borderRadius: 9999,
              background: "rgba(0,0,0,0.1)"
            }} />
          </div>

          {/* Title */}
          <div style={{
            fontSize: 13, fontWeight: 500, color: t.textSecondary, marginBottom: 20, marginTop: 4
          }}>Today</div>

          {/* Detail Grid — concentric inner glass cards */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "0 80px", maxWidth: 700, margin: "0 auto", width: "100%"
          }}>
            <DetailRow label="Circadian score" value={`${DATA.today.circadianScore} / 100`} />
            <DetailRow label="Light therapy" value={`${DATA.today.lightMinutes} / ${DATA.today.lightPrescribed} min`} />
            <DetailRow
              label="Bedtime"
              value={DATA.today.bedtimeActual}
              sub={`target: ${DATA.today.bedtimeTarget}`}
            />
            <DetailRow
              label="Wake time"
              value={DATA.today.wakeActual}
              sub={`target: ${DATA.today.wakeTarget}`}
              check={wakeOnTarget}
            />
            <DetailRow
              label="Night wakings"
              value={`${DATA.today.nightWakings}`}
              sub={`${DATA.today.nightWakingDurationMin} min`}
            />
            <DetailRow label="Naps" value="None" check={true} />
          </div>

          {/* Dot Grid */}
          <div style={{ marginTop: 28 }}>
            <DotGrid days={DATA.last14Days} />
          </div>
        </div>
      </div>
    </div>
  );
}
