import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// CIRCADIAN OS — Onboarding Redesign v2
// iPad Landscape · iOS 26 Liquid Glass · Apple Health Color System
// ═══════════════════════════════════════════════════════════════════

// ─── iOS 26 SYSTEM COLORS ─────────────────────────────────────────
// Sourced from Apple HIG system palette (light mode)
const ios = {
  blue:       "#007AFF",
  blueSoft:   "rgba(0, 122, 255, 0.10)",
  blueHover:  "rgba(0, 122, 255, 0.85)",
  teal:       "#30B0C7",
  tealSoft:   "rgba(48, 176, 199, 0.10)",
  cyan:       "#32ADE6",
  cyanSoft:   "rgba(50, 173, 230, 0.10)",
  green:      "#34C759",
  greenSoft:  "rgba(52, 199, 89, 0.10)",
  indigo:     "#5856D6",
  indigoSoft: "rgba(88, 86, 214, 0.10)",
  orange:     "#FF9500",
  orangeSoft: "rgba(255, 149, 0, 0.08)",
  red:        "#FF3B30",
  yellow:     "#FFCC00",
  gray:       "#8E8E93",
  gray2:      "#AEAEB2",
  gray3:      "#C7C7CC",
  gray4:      "#D1D1D6",
  gray5:      "#E5E5EA",
  gray6:      "#F2F2F7",
};

const t = {
  // Backgrounds — iOS system
  bg: "#FFFFFF",
  bgSecondary: ios.gray6,
  bgGrouped: "#F2F2F7",

  // Surfaces — Liquid Glass
  glass: "rgba(255, 255, 255, 0.60)",
  glassThin: "rgba(255, 255, 255, 0.40)",
  glassBorder: "rgba(255, 255, 255, 0.75)",
  glassShadow: "0 1px 12px rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.03)",
  glassInset: "inset 0 1px 1px rgba(255,255,255,0.7)",
  blur: "blur(20px) saturate(180%)",

  // Text — iOS label colors
  label: "#000000",
  secondaryLabel: "#3C3C43",  // 60% opacity on iOS, but we use solid for web
  tertiaryLabel: "#3C3C4399", // with opacity
  quaternaryLabel: "#3C3C432E",
  textOnAccent: "#FFFFFF",

  // Primary accent — iOS systemBlue (the default tint)
  accent: ios.blue,
  accentSoft: ios.blueSoft,

  // Semantic colors mapped to Health app conventions
  healthLight: ios.orange,    // Light therapy → orange (like Activity ring)
  healthLightSoft: ios.orangeSoft,
  healthSleep: ios.cyan,      // Sleep → cyan (matches Health sleep category)
  healthSleepSoft: ios.cyanSoft,
  healthProgress: ios.green,  // Progress → green (like Move ring)
  healthProgressSoft: ios.greenSoft,

  // Radii — iOS 26 continuous corners
  radiusXL: "24px",
  radiusLG: "18px",
  radiusMD: "14px",
  radiusSM: "10px",
  radiusPill: "9999px",

  // Typography — SF Pro
  font: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',

  // iPad landscape spacing
  pagePadding: "32px",
};

// ─── KEYFRAME ANIMATIONS ──────────────────────────────────────────
const globalStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }

  @keyframes sunPulse {
    0%, 100% { filter: drop-shadow(0 0 16px rgba(255,149,0,0.25)); }
    50% { filter: drop-shadow(0 0 32px rgba(255,149,0,0.4)); }
  }

  @keyframes ringPulse {
    0%, 100% { opacity: 0.15; transform: translate(-50%,-50%) scale(1); }
    50% { opacity: 0.08; transform: translate(-50%,-50%) scale(1.12); }
  }

  @keyframes dotPop {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes slideRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes progressGrow {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
`;

// ─── SF SYMBOL–STYLE ICONS ────────────────────────────────────────

const SunIcon = ({ size = 64, color = ios.orange }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="12" fill={color} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 32 + Math.cos(rad) * 18;
      const y1 = 32 + Math.sin(rad) * 18;
      const x2 = 32 + Math.cos(rad) * 24;
      const y2 = 32 + Math.sin(rad) * 24;
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth="3" strokeLinecap="round" />
      );
    })}
  </svg>
);

const SunSmallIcon = ({ size = 24, color = ios.orange }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4.5" fill={color} />
    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      return (
        <line key={i}
          x1={12 + Math.cos(rad) * 7} y1={12 + Math.sin(rad) * 7}
          x2={12 + Math.cos(rad) * 9.5} y2={12 + Math.sin(rad) * 9.5}
          stroke={color} strokeWidth="2" strokeLinecap="round" />
      );
    })}
  </svg>
);

const ClockIcon = ({ size = 24, color = ios.cyan }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.8" />
    <line x1="12" y1="12" x2="12" y2="6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="12" x2="16" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.2" fill={color} />
  </svg>
);

const PlayIcon = ({ size = 24, color = ios.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="4" stroke={color} strokeWidth="1.8" />
    <polygon points="10,7.5 17.5,12 10,16.5" fill={color} />
  </svg>
);

const CheckIcon = ({ size = 24, color = ios.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={color} opacity="0.12" />
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <polyline points="7.5,12 10.5,15 16.5,9" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const WaveformIcon = ({ size = 24, color = ios.orange }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <line x1="3" y1="8" x2="3" y2="16" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <line x1="7" y1="5" x2="7" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <line x1="11" y1="9" x2="11" y2="15" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <line x1="15" y1="4" x2="15" y2="20" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <line x1="19" y1="7" x2="19" y2="17" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <line x1="23" y1="10" x2="23" y2="14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const ChartUpIcon = ({ size = 24, color = ios.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <polyline points="3,17 8,11 13,14 21,5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <polyline points="17,5 21,5 21,9" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const MoonIcon = ({ size = 24, color = ios.cyan }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = ({ size = 18, color = "#FFF" }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M4 9h10M10 5l4 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── SHARED COMPONENTS ────────────────────────────────────────────

const PageDots = ({ total, current }) => (
  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        width: i === current ? "20px" : "6px",
        height: "6px",
        borderRadius: "3px",
        background: i === current ? ios.blue : ios.gray3,
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }} />
    ))}
  </div>
);

const GlassCard = ({ children, style = {}, delay = 0 }) => (
  <div style={{
    background: t.glass,
    backdropFilter: t.blur,
    WebkitBackdropFilter: t.blur,
    border: `1px solid ${t.glassBorder}`,
    borderRadius: t.radiusLG,
    boxShadow: `${t.glassShadow}, ${t.glassInset}`,
    padding: "16px 18px",
    animation: `fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
    ...style,
  }}>
    {children}
  </div>
);

const PrimaryButton = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    padding: "14px 28px",
    background: ios.blue,
    border: "none", borderRadius: t.radiusMD,
    fontFamily: t.font, fontSize: "17px", fontWeight: 600,
    color: "#FFF", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "6px",
    boxShadow: "0 2px 12px rgba(0,122,255,0.25)",
    transition: "all 0.2s ease",
    ...style,
  }}>
    {children}
  </button>
);

const SecondaryButton = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    padding: "14px 20px",
    background: "rgba(0,0,0,0.04)",
    border: "none", borderRadius: t.radiusMD,
    fontFamily: t.font, fontSize: "17px", fontWeight: 500,
    color: t.secondaryLabel, cursor: "pointer",
    transition: "all 0.2s ease",
    ...style,
  }}>
    {children}
  </button>
);

// ─── LANDSCAPE SPLIT LAYOUT ───────────────────────────────────────
const SplitLayout = ({ left, right, direction = "forward", animKey }) => (
  <div style={{
    display: "flex", width: "100%", height: "100%",
    minHeight: 0,
  }}>
    {/* Left: visual / illustration side */}
    <div style={{
      flex: "0 0 42%", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {left}
    </div>
    {/* Right: content side */}
    <div key={animKey} style={{
      flex: 1, display: "flex", flexDirection: "column",
      justifyContent: "center",
      padding: "32px 40px 32px 24px",
      animation: direction === "forward"
        ? "slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) both"
        : "slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
    }}>
      {right}
    </div>
  </div>
);

// ─── STEP ITEM ────────────────────────────────────────────────────
const StepItem = ({ icon, iconBg, title, subtitle, number, delay = 0 }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "14px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: t.radiusMD,
    border: "1px solid rgba(255,255,255,0.6)",
    animation: `fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
  }}>
    <div style={{
      width: "44px", height: "44px", borderRadius: "12px",
      background: iconBg, display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: t.font, fontWeight: 600, fontSize: "15px",
        color: t.label, lineHeight: 1.3,
      }}>{title}</div>
      <div style={{
        fontFamily: t.font, fontWeight: 400, fontSize: "13px",
        color: t.secondaryLabel, lineHeight: 1.4, marginTop: "1px", opacity: 0.7,
      }}>{subtitle}</div>
    </div>
    <div style={{
      width: "24px", height: "24px", borderRadius: "50%",
      background: ios.gray5, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: t.font, fontSize: "12px", fontWeight: 600, color: ios.gray,
    }}>{number}</div>
  </div>
);

// ─── INFO ROW ─────────────────────────────────────────────────────
const InfoRow = ({ icon, iconBg, title, description, delay = 0 }) => (
  <GlassCard delay={delay} style={{ padding: "14px 16px" }}>
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <div style={{
        width: "38px", height: "38px", borderRadius: "10px",
        background: iconBg, display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: t.font, fontWeight: 600, fontSize: "15px",
          color: t.label, lineHeight: 1.3, marginBottom: "2px",
        }}>{title}</div>
        <div style={{
          fontFamily: t.font, fontWeight: 400, fontSize: "13px",
          color: t.secondaryLabel, lineHeight: 1.5, opacity: 0.75,
        }}>{description}</div>
      </div>
    </div>
  </GlassCard>
);

// ═══════════════════════════════════════════════════════════════════
// SCREEN 1 — WELCOME
// ═══════════════════════════════════════════════════════════════════
const WelcomeLeft = () => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", width: "100%", height: "100%",
    background: `linear-gradient(160deg, ${ios.gray6} 0%, rgba(255,149,0,0.04) 100%)`,
    position: "relative",
  }}>
    {/* iPad emitting light — the iPad IS the device */}
    <div style={{
      position: "relative",
      animation: "float 4s ease-in-out infinite",
    }}>
      {/* Light rays emanating from iPad screen */}
      <div style={{
        position: "absolute", top: "-30px", left: "50%",
        transform: "translateX(-50%)",
        width: "200px", height: "120px",
        background: "radial-gradient(ellipse at 50% 100%, rgba(255,149,0,0.15) 0%, rgba(255,149,0,0.05) 40%, transparent 70%)",
        animation: "ringPulse 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* iPad body */}
      <svg width="160" height="200" viewBox="0 0 160 200" style={{
        position: "relative", zIndex: 1,
        filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.08))",
      }}>
        {/* Device frame */}
        <rect x="10" y="10" width="140" height="180" rx="16" fill="#1C1C1E" />
        {/* Screen */}
        <rect x="18" y="24" width="124" height="152" rx="4" fill="#F9F4ED" />
        {/* Screen glow overlay */}
        <rect x="18" y="24" width="124" height="152" rx="4" fill={ios.orange} opacity="0.08" />
        {/* Kairos sun icon on screen */}
        <circle cx="80" cy="80" r="18" fill={ios.orange} opacity="0.2" />
        <circle cx="80" cy="80" r="12" fill={ios.orange} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={i}
              x1={80 + Math.cos(rad) * 16} y1={80 + Math.sin(rad) * 16}
              x2={80 + Math.cos(rad) * 22} y2={80 + Math.sin(rad) * 22}
              stroke={ios.orange} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          );
        })}
        {/* Timer text on screen */}
        <text x="80" y="118" textAnchor="middle" fontFamily={t.font}
          fontSize="11" fontWeight="600" fill="#3C3C43" opacity="0.6">42:00</text>
        {/* Progress bar on screen */}
        <rect x="45" y="130" width="70" height="4" rx="2" fill={ios.gray4} />
        <rect x="45" y="130" width="50" height="4" rx="2" fill={ios.orange} />
        {/* Camera dot */}
        <circle cx="80" cy="17" r="2" fill="#3A3A3C" />
        {/* Home indicator */}
        <rect x="60" y="182" width="40" height="3" rx="1.5" fill="#3A3A3C" opacity="0.3" />
      </svg>

      {/* Light emission effect */}
      <div style={{
        position: "absolute", top: "10%", left: "-20px", right: "-20px", bottom: "20%",
        background: "radial-gradient(ellipse at 50% 40%, rgba(255,149,0,0.06) 0%, transparent 60%)",
        pointerEvents: "none", zIndex: 0,
        animation: "sunPulse 3s ease-in-out infinite",
      }} />
    </div>

    {/* Feature tags below */}
    <div style={{
      display: "flex", gap: "8px", marginTop: "24px", flexWrap: "wrap",
      justifyContent: "center", padding: "0 24px",
    }}>
      {[
        { icon: <SunSmallIcon size={14} />, label: "Screen Light Therapy", color: ios.orange },
        { icon: <MoonIcon size={14} color={ios.cyan} />, label: "Sleep", color: ios.cyan },
        { icon: <ChartUpIcon size={14} color={ios.green} />, label: "Insights", color: ios.green },
      ].map((tag, i) => (
        <div key={i} style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "5px 12px",
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(10px)",
          borderRadius: t.radiusPill,
          border: "1px solid rgba(255,255,255,0.7)",
          fontFamily: t.font, fontSize: "12px", fontWeight: 500,
          color: tag.color,
          animation: `dotPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.4 + i * 0.1}s both`,
        }}>
          {tag.icon} {tag.label}
        </div>
      ))}
    </div>
  </div>
);

const WelcomeRight = ({ onNext }) => (
  <div style={{
    display: "flex", flexDirection: "column",
    justifyContent: "center", height: "100%",
  }}>
    <div style={{ animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }}>
      <p style={{
        fontFamily: t.font, fontSize: "13px", fontWeight: 600,
        color: ios.blue, textTransform: "uppercase", letterSpacing: "0.8px",
        marginBottom: "8px",
      }}>Welcome</p>

      <h1 style={{
        fontFamily: t.font, fontWeight: 700, fontSize: "28px",
        color: t.label, lineHeight: 1.15, marginBottom: "12px",
        letterSpacing: "-0.4px",
      }}>
        Kairos
      </h1>

      <p style={{
        fontFamily: t.font, fontWeight: 400, fontSize: "16px",
        color: t.secondaryLabel, lineHeight: 1.55,
        maxWidth: "340px", opacity: 0.8,
      }}>
        This iPad delivers therapeutic light through your screen while you watch your favorite content — gently restoring your natural rhythm, one morning at a time.
      </p>
    </div>

    {/* Bottom area */}
    <div style={{ marginTop: "auto", paddingTop: "24px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both",
      }}>
        <PageDots total={3} current={0} />
        <PrimaryButton onClick={onNext}>
          Get Started <ArrowIcon size={16} />
        </PrimaryButton>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// SCREEN 2 — YOUR DAILY ROUTINE
// ═══════════════════════════════════════════════════════════════════
const RoutineLeft = () => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", width: "100%", height: "100%",
    background: `linear-gradient(160deg, ${ios.gray6} 0%, rgba(0,122,255,0.03) 100%)`,
    padding: "32px 24px",
  }}>
    {/* Mini timeline visualization */}
    <div style={{
      display: "flex", flexDirection: "column", gap: "0px",
      alignItems: "center",
      animation: "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
    }}>
      {[
        { time: "7:00", label: "Wake up", color: ios.cyan, icon: "☀️" },
        { time: "7:05", label: "Open Kairos", color: ios.orange, icon: "▶" },
        { time: "7:47", label: "42 min done!", color: ios.green, icon: "✓" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          {/* Timeline spine */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: item.color, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", color: "#FFF", fontWeight: 700,
              boxShadow: `0 2px 8px ${item.color}33`,
            }}>
              {item.icon}
            </div>
            {i < 2 && <div style={{
              width: "2px", height: "36px",
              background: `linear-gradient(to bottom, ${item.color}40, ${ios.gray4})`,
            }} />}
          </div>
          <div style={{ paddingTop: "4px" }}>
            <div style={{
              fontFamily: t.font, fontSize: "12px", fontWeight: 600,
              color: item.color, marginBottom: "1px",
            }}>{item.time}</div>
            <div style={{
              fontFamily: t.font, fontSize: "14px", fontWeight: 500,
              color: t.label,
            }}>{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RoutineRight = ({ onNext, onBack }) => (
  <div style={{
    display: "flex", flexDirection: "column",
    justifyContent: "center", height: "100%",
  }}>
    <div style={{ animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
      <p style={{
        fontFamily: t.font, fontSize: "13px", fontWeight: 600,
        color: ios.orange, textTransform: "uppercase", letterSpacing: "0.8px",
        marginBottom: "8px",
      }}>Every Morning</p>

      <h1 style={{
        fontFamily: t.font, fontWeight: 700, fontSize: "26px",
        color: t.label, lineHeight: 1.15, marginBottom: "8px",
        letterSpacing: "-0.3px",
      }}>
        Your Daily Routine
      </h1>

      <p style={{
        fontFamily: t.font, fontWeight: 400, fontSize: "15px",
        color: t.secondaryLabel, lineHeight: 1.5,
        maxWidth: "340px", marginBottom: "20px", opacity: 0.75,
      }}>
        Three simple steps. That's all it takes.
      </p>
    </div>

    {/* Steps */}
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <StepItem
        number="1"
        icon={<SunSmallIcon size={20} />}
        iconBg={ios.orangeSoft}
        title="Open Kairos on your iPad"
        subtitle="The screen emits therapeutic light automatically"
        delay={0.1}
      />
      <StepItem
        number="2"
        icon={<PlayIcon size={20} />}
        iconBg={ios.blueSoft}
        title="Watch your favorite content"
        subtitle="Netflix, YouTube — anything you enjoy"
        delay={0.2}
      />
      <StepItem
        number="3"
        icon={<CheckIcon size={20} />}
        iconBg={ios.greenSoft}
        title="Complete 42 minutes"
        subtitle="Kairos tracks your time automatically"
        delay={0.3}
      />
    </div>

    {/* Bottom */}
    <div style={{ marginTop: "auto", paddingTop: "20px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <SecondaryButton onClick={onBack}>Back</SecondaryButton>
          <PageDots total={3} current={1} />
        </div>
        <PrimaryButton onClick={onNext}>
          Next <ArrowIcon size={16} />
        </PrimaryButton>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// SCREEN 3 — THE SCIENCE
// ═══════════════════════════════════════════════════════════════════
const ScienceLeft = () => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", width: "100%", height: "100%",
    background: `linear-gradient(160deg, ${ios.gray6} 0%, rgba(52,199,89,0.03) 100%)`,
    padding: "32px 24px",
  }}>
    {/* Circadian rhythm visualization */}
    <div style={{ animation: "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both" }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Background ring */}
        <circle cx="100" cy="100" r="80" fill="none" stroke={ios.gray5} strokeWidth="8" />
        {/* Progress ring - green */}
        <circle cx="100" cy="100" r="80" fill="none"
          stroke={ios.green} strokeWidth="8" strokeLinecap="round"
          strokeDasharray="502.65" strokeDashoffset="125.66"
          transform="rotate(-90 100 100)"
          style={{ animation: "fadeIn 1s ease 0.3s both" }}
        />
        {/* Inner ring */}
        <circle cx="100" cy="100" r="65" fill="none" stroke={ios.gray5} strokeWidth="6" />
        <circle cx="100" cy="100" r="65" fill="none"
          stroke={ios.orange} strokeWidth="6" strokeLinecap="round"
          strokeDasharray="408.41" strokeDashoffset="81.68"
          transform="rotate(-90 100 100)"
          style={{ animation: "fadeIn 1s ease 0.5s both" }}
        />
        {/* Innermost ring */}
        <circle cx="100" cy="100" r="50" fill="none" stroke={ios.gray5} strokeWidth="5" />
        <circle cx="100" cy="100" r="50" fill="none"
          stroke={ios.cyan} strokeWidth="5" strokeLinecap="round"
          strokeDasharray="314.16" strokeDashoffset="47.12"
          transform="rotate(-90 100 100)"
          style={{ animation: "fadeIn 1s ease 0.7s both" }}
        />
        {/* Center text */}
        <text x="100" y="95" textAnchor="middle" fontFamily={t.font}
          fontSize="28" fontWeight="700" fill={t.label}>74</text>
        <text x="100" y="115" textAnchor="middle" fontFamily={t.font}
          fontSize="11" fontWeight="500" fill={ios.gray}>SCORE</text>
      </svg>
    </div>

    {/* Ring legend */}
    <div style={{
      display: "flex", gap: "16px", marginTop: "16px",
      animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both",
    }}>
      {[
        { label: "Light", color: ios.orange },
        { label: "Sleep", color: ios.cyan },
        { label: "Score", color: ios.green },
      ].map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: "5px",
          fontFamily: t.font, fontSize: "11px", fontWeight: 600,
          color: ios.gray,
        }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: item.color,
          }} />
          {item.label}
        </div>
      ))}
    </div>
  </div>
);

const ScienceRight = ({ onNext, onBack }) => (
  <div style={{
    display: "flex", flexDirection: "column",
    justifyContent: "center", height: "100%",
  }}>
    <div style={{ animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
      <p style={{
        fontFamily: t.font, fontSize: "13px", fontWeight: 600,
        color: ios.green, textTransform: "uppercase", letterSpacing: "0.8px",
        marginBottom: "8px",
      }}>The Science</p>

      <h1 style={{
        fontFamily: t.font, fontWeight: 700, fontSize: "26px",
        color: t.label, lineHeight: 1.15, marginBottom: "8px",
        letterSpacing: "-0.3px",
      }}>
        How Kairos Works
      </h1>

      <p style={{
        fontFamily: t.font, fontWeight: 400, fontSize: "15px",
        color: t.secondaryLabel, lineHeight: 1.5,
        maxWidth: "340px", marginBottom: "18px", opacity: 0.75,
      }}>
        Your iPad screen does more than display — it heals.
      </p>
    </div>

    {/* Info rows */}
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <InfoRow
        icon={<WaveformIcon size={20} />}
        iconBg={ios.orangeSoft}
        title="Calibrated Light Therapy"
        description="Your iPad screen emits precise wavelengths that signal your body's clock to reset."
        delay={0.1}
      />
      <InfoRow
        icon={<ClockIcon size={20} />}
        iconBg={ios.cyanSoft}
        title="Consistent Daily Rhythm"
        description="Same time each morning — a rhythm your body learns to trust."
        delay={0.2}
      />
      <InfoRow
        icon={<ChartUpIcon size={20} />}
        iconBg={ios.greenSoft}
        title="Track Your Progress"
        description="Watch your circadian score improve day by day."
        delay={0.3}
      />
    </div>

    {/* Bottom */}
    <div style={{ marginTop: "auto", paddingTop: "20px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <SecondaryButton onClick={onBack}>Back</SecondaryButton>
          <PageDots total={3} current={2} />
        </div>
        <PrimaryButton onClick={onNext}>
          Begin Journey <ArrowIcon size={16} />
        </PrimaryButton>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN — iPad Landscape Frame
// ═══════════════════════════════════════════════════════════════════
export default function CircadianOnboardingRedesign() {
  const [screen, setScreen] = useState(0);
  const [dir, setDir] = useState("forward");
  const [key, setKey] = useState(0);

  const next = () => {
    if (screen < 2) { setDir("forward"); setKey(k => k + 1); setScreen(s => s + 1); }
  };
  const back = () => {
    if (screen > 0) { setDir("back"); setKey(k => k + 1); setScreen(s => s - 1); }
  };

  const leftPanels = [
    <WelcomeLeft key="wl" />,
    <RoutineLeft key="rl" />,
    <ScienceLeft key="sl" />,
  ];

  const rightPanels = [
    <WelcomeRight key={`wr-${key}`} onNext={next} />,
    <RoutineRight key={`rr-${key}`} onNext={next} onBack={back} />,
    <ScienceRight key={`sr-${key}`} onNext={next} onBack={back} />,
  ];

  return (
    <div style={{
      width: "100vw", minHeight: "100vh",
      background: "#E5E5EA",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      fontFamily: t.font,
    }}>
      <style>{globalStyles}</style>

      {/* iPad Landscape Frame */}
      <div style={{
        width: "100%", maxWidth: "980px",
        height: "640px",
        background: t.bg,
        borderRadius: "24px",
        boxShadow: "0 4px 40px rgba(0,0,0,0.08), 0 1px 8px rgba(0,0,0,0.04)",
        overflow: "hidden",
        position: "relative",
        display: "flex", flexDirection: "column",
      }}>
        {/* Status bar — iPad landscape style */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 24px 0",
          flexShrink: 0,
          position: "relative", zIndex: 10,
        }}>
          <span style={{
            fontFamily: t.font, fontSize: "14px", fontWeight: 600,
            color: t.label,
          }}>9:41</span>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <svg width="16" height="12" viewBox="0 0 16 12">
              <path d="M1.5 6.5C4 3.5 8 2 12 2c1.5 0 2.8.3 4 .8" stroke={t.label} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
              <path d="M4 9C5.5 7 8 6 10.5 6c1 0 2 .2 3 .5" stroke={t.label} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
              <circle cx="10" cy="11" r="1.5" fill={t.label} />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill={t.label}>
              <rect x="0" y="0.5" width="22" height="11" rx="2.5" stroke={t.label} strokeWidth="1" fill="none" />
              <rect x="23" y="3.5" width="2" height="5" rx="1" />
              <rect x="2" y="2.5" width="16" height="7" rx="1.5" fill={ios.green} />
            </svg>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <SplitLayout
            left={leftPanels[screen]}
            right={rightPanels[screen]}
            direction={dir}
            animKey={key}
          />
        </div>

        {/* Home indicator */}
        <div style={{
          display: "flex", justifyContent: "center", paddingBottom: "8px",
          flexShrink: 0,
        }}>
          <div style={{
            width: "134px", height: "5px", borderRadius: "3px",
            background: "rgba(0,0,0,0.12)",
          }} />
        </div>
      </div>
    </div>
  );
}
