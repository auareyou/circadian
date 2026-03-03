import { useState } from "react";

/*
 * NARRATIVE STRUCTURE — Progressive Disclosure
 *
 * Each page answers the single question the previous page raised.
 * The patient starts knowing nothing.
 *
 *   Page 1: "What is this?"
 *   → They just received an iPad. Explain what it does and why.
 *   → One concept only: morning light through the screen.
 *   → This naturally raises: "OK, so what do I actually do?"
 *
 *   Page 2: "What do I do each day?"
 *   → Now they understand the device. Show the daily routine.
 *   → When to do it, what the steps are, what they can enjoy while it works.
 *   → This naturally raises: "How will I know if I'm doing it right?"
 *
 *   Page 3: "How do I know it's working?"
 *   → Now they know what to do. Teach the feedback system.
 *   → Green frame = good, red = adjust. Simple troubleshooting. You're ready.
 *   → Ends with confidence, not more information.
 */

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
const IPadLandscape = ({ children, footer }) => (
  <div style={{
    width: 740, height: 500,
    background: T.surface, borderRadius: 24,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
    overflow: "hidden", display: "flex", flexDirection: "column",
    border: `1px solid ${T.border}`,
  }}>
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 20px 4px", fontSize: 11, fontWeight: 600,
      color: T.text, flexShrink: 0,
    }}>
      <span>9:41</span>
      <span style={{ fontSize: 10 }}>●●● 🔋</span>
    </div>
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      {children}
    </div>
    {footer}
    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 6px", flexShrink: 0 }}>
      <div style={{ width: 120, height: 4, borderRadius: 2, background: T.border }} />
    </div>
  </div>
);

const ProgressDots = ({ total, current }) => (
  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        width: i === current ? 22 : 6, height: 6, borderRadius: 3,
        background: i === current ? T.amber : i < current ? T.amberBorder : T.borderLight,
        transition: "all 0.3s",
      }} />
    ))}
  </div>
);

const NavFooter = ({ page, setPage, total }) => (
  <div style={{
    padding: "10px 24px", flexShrink: 0,
    borderTop: `1px solid ${T.borderLight}`,
    display: "flex", alignItems: "center", gap: 16,
  }}>
    <div style={{ flex: 1 }}>
      <ProgressDots total={total} current={page} />
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      {page > 0 && (
        <button onClick={() => setPage(page - 1)} style={{
          padding: "10px 24px", borderRadius: 12,
          background: T.surfaceAlt, border: `1px solid ${T.border}`,
          color: T.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>Back</button>
      )}
      <button
        onClick={() => page < total - 1 && setPage(page + 1)}
        style={{
          padding: "10px 32px", borderRadius: 12,
          background: page < total - 1 ? T.amber : T.green,
          border: "none", color: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 2px 8px ${page < total - 1 ? "rgba(212,137,26,0.3)" : "rgba(34,160,91,0.3)"}`,
        }}
      >{page < total - 1 ? "Next" : "Start my first session"}</button>
    </div>
  </div>
);


/* ─────────────────────────────────────────────
 *  PAGE 1: "What is this?"
 *
 *  The patient just received a mysterious iPad.
 *  This page answers ONE question: what does it do?
 *
 *  Left: warm hero with the core concept
 *  Right: three simple facts that build understanding
 * ───────────────────────────────────────────── */
const Page1 = () => (
  <div style={{ flex: 1, display: "flex", padding: "16px 24px", gap: 24 }}>

    {/* Left: Hero — greeting + the big idea */}
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 20px", borderRadius: 24,
      background: `linear-gradient(180deg, ${T.amberLight} 0%, ${T.surface} 100%)`,
      border: `1px solid ${T.amberBorder}`,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 56, marginBottom: 10 }}>☀️</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.amber, marginBottom: 4 }}>
        Welcome to your light therapy
      </div>
      <div style={{ fontSize: 23, fontWeight: 800, color: T.text, lineHeight: 1.2 }}>
        Light therapy, delivered<br/>through your screen
      </div>
      <div style={{
        fontSize: 13, color: T.textSecondary, marginTop: 10,
        lineHeight: 1.7, maxWidth: 260,
      }}>
        Similar to natural sunlight, it supports your body's daily rhythm. Here's what to expect.
      </div>
    </div>

    {/* Right: Three things to know */}
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      justifyContent: "center", gap: 12,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 2,
        textTransform: "uppercase", color: T.muted, marginBottom: 2,
      }}>Three things to know</div>

      {[
        {
          num: "1", icon: "📺", title: "The light comes from the screen",
          desc: "It turns on automatically during your session.",
          color: T.amber, bg: T.amberLight, border: T.amberBorder,
        },
        {
          num: "2", icon: "🎬", title: "You can browse while it works",
          desc: "Watch shows, read, or video call. The light delivers while you do your thing.",
          color: T.teal, bg: T.tealLight, border: T.tealBorder,
        },
        {
          num: "3", icon: "⏱️", title: "One session each morning",
          desc: "60 minutes, once a day. Details on the next page.",
          color: T.green, bg: T.greenLight, border: T.greenBorder,
        },
      ].map((item, i) => (
        <div key={i} style={{
          display: "flex", gap: 14, padding: "14px 16px",
          borderRadius: 18, background: item.bg,
          border: `1.5px solid ${item.border}`,
          alignItems: "flex-start",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: T.surface, border: `1.5px solid ${item.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
          }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{item.title}</div>
            <div style={{
              fontSize: 11, color: T.textSecondary, marginTop: 3, lineHeight: 1.55,
            }}>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);


/* ─────────────────────────────────────────────
 *  PAGE 2: "What do I do each day?"
 *
 *  Now they understand what the device does.
 *  This page shows the daily routine: when, what, how.
 *
 *  Top: morning timeline (when)
 *  Bottom-left: the two steps (what)
 *  Bottom-right: what you can do during + positioning (how)
 * ───────────────────────────────────────────── */
const Page2 = () => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 24px" }}>

    {/* Header */}
    <div style={{ textAlign: "center", marginBottom: 10 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>Your Daily Routine</div>
      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>The same two steps, every morning</div>
    </div>

    {/* Morning timeline */}
    <div style={{
      padding: "12px 16px 10px", borderRadius: 16,
      background: T.amberLight, border: `1px solid ${T.amberBorder}`,
      marginBottom: 12,
    }}>
      <div style={{ position: "relative", height: 32, marginBottom: 4 }}>
        <div style={{
          position: "absolute", top: 12, left: "3%", right: "2%", height: 8,
          borderRadius: 4, background: T.amberBorder,
        }} />
        <div style={{
          position: "absolute", top: 12, left: "3%", width: "46%", height: 8,
          borderRadius: 4, background: T.amber,
        }} />
        <div style={{
          position: "absolute", top: 6, left: "20%", width: "34%", height: 20,
          borderRadius: 10, background: `${T.teal}18`, border: `2px solid ${T.teal}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: T.teal }}>YOUR 60-MIN SESSION</span>
        </div>
        {[
          { x: 3 }, { x: 27, hl: true }, { x: 51 }, { x: 73 }, { x: 97 },
        ].map((h, i) => (
          <div key={i} style={{
            position: "absolute", top: 10, left: `${h.x}%`, transform: "translateX(-50%)",
            width: h.hl ? 12 : 8, height: h.hl ? 12 : 8, borderRadius: "50%",
            background: i < 3 ? T.amber : T.amberBorder,
            border: `2px solid ${T.surface}`,
            boxShadow: h.hl ? `0 0 0 2px ${T.amber}` : "none",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", padding: "0 1%" }}>
        {[
          { label: "7 AM", sub: "Wake up" }, { label: "8 AM", sub: "Start here" },
          { label: "9 AM", sub: "Latest start" }, { label: "10 AM", sub: "" },
          { label: "11 AM", sub: "Done by" },
        ].map((h, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: i < 3 ? T.amber : T.muted }}>{h.label}</div>
            {h.sub && <div style={{ fontSize: 9, color: T.textSecondary }}>{h.sub}</div>}
          </div>
        ))}
      </div>
    </div>

    {/* Bottom: Two steps + activities */}
    <div style={{ display: "flex", gap: 16, flex: 1 }}>

      {/* Left: The two steps */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", color: T.muted, marginBottom: 8,
        }}>Every morning</div>

        {/* Step 1 */}
        <div style={{
          display: "flex", gap: 12, padding: "12px 14px",
          borderRadius: 16, background: T.tealLight, border: `1.5px solid ${T.tealBorder}`,
          alignItems: "center",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: T.teal, color: "#FFF",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 800, flexShrink: 0,
          }}>1</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Quick check-in</div>
            <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 1 }}>One question about how you slept</div>
          </div>
          <div style={{
            padding: "3px 10px", borderRadius: 8,
            background: T.surface, border: `1px solid ${T.tealBorder}`,
            fontSize: 11, fontWeight: 700, color: T.teal,
          }}>{"< 1 min"}</div>
        </div>

        {/* Connector */}
        <div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
          <div style={{ width: 2, height: 10, background: T.border }} />
        </div>

        {/* Step 2 */}
        <div style={{
          display: "flex", gap: 12, padding: "12px 14px",
          borderRadius: 16, background: T.amberLight, border: `1.5px solid ${T.amberBorder}`,
          alignItems: "center",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: T.amber, color: "#FFF",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 800, flexShrink: 0,
          }}>2</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Light session</div>
            <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 1 }}>Use the web while the light works</div>
          </div>
          <div style={{
            padding: "3px 10px", borderRadius: 8,
            background: T.surface, border: `1px solid ${T.amberBorder}`,
            fontSize: 11, fontWeight: 700, color: T.amber,
          }}>60 min</div>
        </div>

        {/* Connector */}
        <div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
          <div style={{ width: 2, height: 10, background: T.border }} />
        </div>

        {/* Done */}
        <div style={{
          textAlign: "center", padding: "10px",
          borderRadius: 14, background: T.greenLight, border: `1.5px solid ${T.greenBorder}`,
        }}>
          <span style={{ fontSize: 16, marginRight: 6 }}>🎉</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>That's it for the day!</span>
        </div>
      </div>

      {/* Right: What you can do + rules */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", color: T.muted, marginBottom: 0,
        }}>During your session, you can</div>

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

        {/* Two rules */}
        <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
          {[
            { icon: "📐", text: "Keep iPad in front of you" },
            { icon: "👀", text: "Look at the screen" },
            { icon: "💪", text: "Try to finish in one go" },
          ].map((r, i) => (
            <div key={i} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 6,
              padding: "8px 10px", borderRadius: 10,
              background: T.surfaceAlt, border: `1px solid ${T.borderLight}`,
            }}>
              <span style={{ fontSize: 14 }}>{r.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


/* ─────────────────────────────────────────────
 *  PAGE 3: "How do I know it's working?"
 *
 *  Now they know what to do. Last thing: how
 *  to read the feedback the iPad gives them.
 *  Ends with confidence, not more information.
 *
 *  Left: visual mockups of green vs red frame
 *  Right: simple troubleshooting + "you're ready"
 * ───────────────────────────────────────────── */
const Page3 = () => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 24px" }}>

    <div style={{ textAlign: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>How You'll Know It's Working</div>
      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
        The colored frame around the screen tells you everything
      </div>
    </div>

    <div style={{ display: "flex", gap: 20, flex: 1 }}>

      {/* Left: The two states — visual comparison */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Green = everything's fine */}
        <div style={{
          flex: 1, display: "flex", gap: 14, padding: "14px 16px",
          borderRadius: 20, background: T.greenLight, border: `1.5px solid ${T.greenBorder}`,
          alignItems: "center",
        }}>
          <div style={{
            width: 100, height: 72, borderRadius: 12,
            border: `5px solid ${T.green}`, background: T.surface,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", flexShrink: 0,
          }}>
            <div style={{ fontSize: 28 }}>😊</div>
            <div style={{
              position: "absolute", bottom: 4, right: 4,
              padding: "2px 7px", borderRadius: 5,
              background: T.green, color: "#FFF", fontSize: 9, fontWeight: 700,
            }}>48:22</div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.green }}>Green frame</div>
            <div style={{
              fontSize: 12, color: T.textSecondary, marginTop: 4, lineHeight: 1.6,
            }}>
              Everything is working. The light is being delivered and your time is counting down. Just keep doing what you're doing.
            </div>
          </div>
        </div>

        {/* Red = needs attention */}
        <div style={{
          flex: 1, display: "flex", gap: 14, padding: "14px 16px",
          borderRadius: 20, background: T.coralLight, border: `1.5px solid ${T.coralBorder}`,
          alignItems: "center",
        }}>
          <div style={{
            width: 100, height: 72, borderRadius: 12,
            border: `5px solid ${T.coral}`, background: T.surface,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", flexShrink: 0,
          }}>
            <div style={{ fontSize: 28 }}>😕</div>
            <div style={{
              position: "absolute", bottom: 4, right: 4,
              padding: "2px 7px", borderRadius: 5,
              background: T.coral, color: "#FFF", fontSize: 9, fontWeight: 700,
            }}>PAUSED</div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.coral }}>Red frame</div>
            <div style={{
              fontSize: 12, color: T.textSecondary, marginTop: 4, lineHeight: 1.6,
            }}>
              The light is paused. This usually means the iPad can't see your face clearly. Small adjustment and it'll turn green again.
            </div>
          </div>
        </div>
      </div>

      {/* Right: Quick fixes + ready */}
      <div style={{
        width: 260, flexShrink: 0,
        display: "flex", flexDirection: "column", gap: 10,
      }}>

        {/* Quick fixes */}
        <div style={{
          padding: "14px 16px", borderRadius: 18,
          background: T.surfaceAlt, border: `1px solid ${T.borderLight}`,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
            textTransform: "uppercase", color: T.muted, marginBottom: 10,
          }}>If the frame turns red</div>
          {[
            { icon: "👀", problem: "Eyes not visible?", fix: "Look at the screen" },
            { icon: "📏", problem: "Too close or far?", fix: "Adjust your distance" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: i < 1 ? 10 : 0,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: T.coralLight, border: `1px solid ${T.coralBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{item.problem}</div>
                <div style={{ fontSize: 10, color: T.muted }}>{item.fix}</div>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: T.greenLight, border: `1px solid ${T.greenBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, flexShrink: 0,
              }}>✅</div>
            </div>
          ))}
        </div>

        {/* Reassurance */}
        <div style={{
          padding: "12px 14px", borderRadius: 14,
          background: T.surfaceAlt, border: `1px solid ${T.borderLight}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>🔄</span>
          <div style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: T.text }}>Don't worry</span> — it's normal for the frame to switch colors. Just adjust and keep going.
          </div>
        </div>

        {/* You're ready */}
        <div style={{
          flex: 1, padding: "16px", borderRadius: 20,
          background: `linear-gradient(135deg, ${T.amberLight}, ${T.greenLight})`,
          border: `1px solid ${T.amberBorder}`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>☀️</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: T.text }}>You're ready</div>
          <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 4, lineHeight: 1.5 }}>
            That's everything you need to know. Let's start your first session.
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Main ─── */
export default function HowToPreparePaged() {
  const [page, setPage] = useState(0);
  const pages = [Page1, Page2, Page3];
  const CurrentPage = pages[page];

  return (
    <div style={{
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      background: T.bg, minHeight: "100vh",
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      padding: "32px 24px",
    }}>
      <IPadLandscape footer={<NavFooter page={page} setPage={setPage} total={3} />}>
        <CurrentPage />
      </IPadLandscape>
    </div>
  );
}
