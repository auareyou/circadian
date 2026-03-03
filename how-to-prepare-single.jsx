import { useState } from "react";

const T = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F5F0",
  border: "#E8E8E0",
  borderLight: "#F0F0EA",
  text: "#1A1A2E",
  textSecondary: "#4A4A5A",
  muted: "#8A8A9A",
  mutedLight: "#C0C0CA",
  amber: "#D4891A",
  amberLight: "#FEF7E8",
  amberBorder: "#F5D89A",
  teal: "#2BA89E",
  tealLight: "#E8F8F6",
  tealBorder: "#A0DDD8",
  green: "#22A05B",
  greenLight: "#EDFAF2",
  greenBorder: "#A0DDB8",
  coral: "#D94F4F",
  coralLight: "#FEF0F0",
  coralBorder: "#F5B0B0",
};

/* ─── Landscape iPad Frame ─── */
const IPadLandscape = ({ children }) => (
  <div style={{
    width: 740, minHeight: 480,
    background: T.surface, borderRadius: 24,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
    overflow: "hidden", display: "flex", flexDirection: "column",
    border: `1px solid ${T.border}`,
  }}>
    {/* Status bar */}
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 20px 4px", fontSize: 11, fontWeight: 600,
      color: T.text, flexShrink: 0,
    }}>
      <span>9:41</span>
      <span style={{ fontSize: 10 }}>●●● 🔋</span>
    </div>
    <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
    <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 8px", flexShrink: 0 }}>
      <div style={{ width: 120, height: 4, borderRadius: 2, background: T.border }} />
    </div>
  </div>
);

/* ─── Morning timeline ─── */
const TimelineArc = () => (
  <div style={{
    padding: "14px 16px 12px", borderRadius: 16,
    background: T.amberLight, border: `1px solid ${T.amberBorder}`,
  }}>
    <div style={{ position: "relative", height: 36, marginBottom: 4 }}>
      <div style={{
        position: "absolute", top: 14, left: "4%", right: "2%", height: 8,
        borderRadius: 4, background: T.amberBorder,
      }} />
      <div style={{
        position: "absolute", top: 14, left: "4%", width: "48%", height: 8,
        borderRadius: 4, background: T.amber,
      }} />
      <div style={{
        position: "absolute", top: 8, left: "22%", width: "32%", height: 20,
        borderRadius: 10, background: `${T.teal}18`,
        border: `2px solid ${T.teal}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: T.teal, letterSpacing: 0.5 }}>
          60 MIN SESSION
        </span>
      </div>
      {[
        { x: 4, active: true }, { x: 28, active: true, highlight: true },
        { x: 52, active: true }, { x: 74, active: false }, { x: 96, active: false },
      ].map((h, i) => (
        <div key={i} style={{
          position: "absolute", top: 12, left: `${h.x}%`, transform: "translateX(-50%)",
          width: h.highlight ? 12 : 8, height: h.highlight ? 12 : 8, borderRadius: "50%",
          background: h.active ? T.amber : T.amberBorder,
          border: h.highlight ? `2px solid ${T.surface}` : "none",
          boxShadow: h.highlight ? `0 0 0 2px ${T.amber}` : "none",
        }} />
      ))}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0 2px" }}>
      {[
        { label: "7 AM", sub: "Wake up" }, { label: "8 AM", sub: "Start session" },
        { label: "9 AM", sub: "Latest start" }, { label: "10 AM", sub: "" },
        { label: "11 AM", sub: "Finish by" },
      ].map((h, i) => (
        <div key={i} style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: i < 3 ? T.amber : T.muted }}>{h.label}</div>
          {h.sub && <div style={{ fontSize: 9, color: T.muted, marginTop: 1 }}>{h.sub}</div>}
        </div>
      ))}
    </div>
  </div>
);

/* ─── Frame status diagram (landscape) ─── */
const FrameStatusDiagram = () => (
  <div style={{ display: "flex", gap: 10 }}>
    {[
      { color: T.green, border: T.greenBorder, bg: T.greenLight, emoji: "😊", label: "Green", sub: "Light is working, time counting", badge: "48:22", badgeBg: T.green },
      { color: T.coral, border: T.coralBorder, bg: T.coralLight, emoji: "😕", label: "Red", sub: "Adjust your position", badge: "PAUSED", badgeBg: T.coral },
    ].map((s, i) => (
      <div key={i} style={{
        flex: 1, borderRadius: 16, overflow: "hidden",
        border: `1.5px solid ${s.border}`, background: s.bg,
      }}>
        <div style={{
          margin: "12px 12px 0", borderRadius: 10, height: 70,
          border: `4px solid ${s.color}`, background: T.surface,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <div style={{ fontSize: 24 }}>{s.emoji}</div>
          <div style={{
            position: "absolute", bottom: 4, right: 4,
            padding: "2px 6px", borderRadius: 4,
            background: s.badgeBg, color: "#FFF", fontSize: 8, fontWeight: 700,
          }}>{s.badge}</div>
        </div>
        <div style={{ padding: "8px 10px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.label}</div>
          <div style={{ fontSize: 10, color: T.textSecondary, marginTop: 2 }}>{s.sub}</div>
        </div>
      </div>
    ))}
  </div>
);

/* ─── Daily flow (horizontal for landscape) ─── */
const DailyFlow = () => (
  <div style={{
    display: "flex", alignItems: "center", gap: 0,
    padding: "12px 10px", borderRadius: 16,
    background: T.surfaceAlt, border: `1px solid ${T.borderLight}`,
  }}>
    {[
      { icon: "🔔", label: "Alarm", time: "<1 sec", color: T.amber, bg: T.amberLight },
      { icon: "📋", label: "Check-in", time: "<1 min", color: T.teal, bg: T.tealLight },
      { icon: "☀️", label: "Light session", time: "60 min", color: T.amber, bg: T.amberLight },
      { icon: "🎉", label: "Done!", time: "", color: T.green, bg: T.greenLight },
    ].map((s, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", flex: i === 2 ? 1.5 : 1 }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: s.bg, border: `1.5px solid ${s.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, margin: "0 auto",
          }}>{s.icon}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginTop: 5 }}>{s.label}</div>
          {s.time && <div style={{ fontSize: 10, color: s.color, fontWeight: 600, marginTop: 1 }}>{s.time}</div>}
        </div>
        {i < 3 && (
          <div style={{ width: 24, height: 2, background: T.border, flexShrink: 0, position: "relative" }}>
            <div style={{ position: "absolute", right: -2, top: -3, fontSize: 8, color: T.mutedLight }}>›</div>
          </div>
        )}
      </div>
    ))}
  </div>
);

/* ─── Activity grid ─── */
const ActivityGrid = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
    {[
      { icon: "🎬", label: "Watch shows" }, { icon: "📱", label: "Scroll feeds" },
      { icon: "📰", label: "Read news" }, { icon: "💬", label: "Video calls" },
      { icon: "🌐", label: "Browse web" }, { icon: "📧", label: "Check email" },
    ].map((a, i) => (
      <div key={i} style={{
        textAlign: "center", padding: "10px 4px",
        borderRadius: 12, background: T.tealLight, border: `1px solid ${T.tealBorder}`,
      }}>
        <div style={{ fontSize: 20, marginBottom: 2 }}>{a.icon}</div>
        <div style={{ fontSize: 9, fontWeight: 600, color: T.teal }}>{a.label}</div>
      </div>
    ))}
  </div>
);

/* ─── Divider ─── */
const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 10px" }}>
    <div style={{ flex: 1, height: 1, background: T.border }} />
    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: T.muted }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: T.border }} />
  </div>
);

/* ─── Main ─── */
export default function HowToPrepareSingle() {
  return (
    <div style={{
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      background: T.bg, minHeight: "100vh",
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      padding: "32px 24px",
    }}>
      <IPadLandscape>
        <div style={{ padding: "12px 24px 16px" }}>

          {/* ── Hero + Daily flow: side by side ── */}
          <div style={{ display: "flex", gap: 20, marginBottom: 8 }}>
            {/* Left: Hero */}
            <div style={{
              flex: 1, textAlign: "center", padding: "20px 16px",
              borderRadius: 20,
              background: `linear-gradient(180deg, ${T.amberLight}, ${T.surface})`,
              border: `1px solid ${T.amberBorder}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: 6 }}>☀️</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>How to Prepare</div>
              <div style={{
                fontSize: 12, color: T.textSecondary, marginTop: 8, lineHeight: 1.6, maxWidth: 240,
              }}>
                This iPad gives you gentle <span style={{ fontWeight: 700, color: T.amber }}>morning light</span> to
                support your body's natural rhythm.
              </div>
            </div>
            {/* Right: Daily routine */}
            <div style={{ flex: 1.2, display: "flex", flexDirection: "column" }}>
              <Divider label="Your daily routine" />
              <DailyFlow />
              <div style={{
                marginTop: 8, padding: "8px 10px", borderRadius: 10,
                background: T.surfaceAlt, textAlign: "center",
              }}>
                <span style={{ fontSize: 11, color: T.muted }}>
                  Light comes through the screen automatically while you browse.
                </span>
              </div>
            </div>
          </div>

          {/* ── Timeline: full width ── */}
          <Divider label="Your morning window" />
          <TimelineArc />

          {/* ── Activities + Frame status: side by side ── */}
          <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
            {/* Left: Activities */}
            <div style={{ flex: 1 }}>
              <Divider label="While the light is on" />
              <ActivityGrid />
              <div style={{
                marginTop: 6, display: "flex", gap: 6,
              }}>
                {[
                  { icon: "📐", text: "iPad in front of you" },
                  { icon: "👀", text: "Look at the screen" },
                ].map((r, i) => (
                  <div key={i} style={{
                    flex: 1, display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 10px", borderRadius: 10,
                    background: T.surfaceAlt, border: `1px solid ${T.borderLight}`,
                  }}>
                    <span style={{ fontSize: 14 }}>{r.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: T.text }}>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Frame status */}
            <div style={{ flex: 1 }}>
              <Divider label="The frame tells you" />
              <FrameStatusDiagram />
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                {[
                  { icon: "👀", text: "Red = eyes not visible" },
                  { icon: "📏", text: "Red = too close or far" },
                ].map((item, i) => (
                  <div key={i} style={{
                    flex: 1, display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 8px", borderRadius: 8,
                  }}>
                    <span style={{ fontSize: 12 }}>{item.icon}</span>
                    <span style={{ fontSize: 10, color: T.muted }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div style={{
            marginTop: 12, padding: "12px 16px", borderRadius: 14,
            background: T.surfaceAlt, border: `1px solid ${T.borderLight}`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>💪</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
              Try to finish in one go
            </span>
            <span style={{ fontSize: 12, color: T.muted }}>—</span>
            <span style={{ fontSize: 12, color: T.muted }}>Your session is recorded automatically</span>
          </div>
        </div>
      </IPadLandscape>
    </div>
  );
}
