import { useState } from "react";

// ─── Design tokens ───
const T = {
  navy: "#0F1129",
  deep: "#1A1B3A",
  amber: "#F5A623",
  gold: "#FBD786",
  teal: "#4ECDC4",
  mint: "#A8E6CF",
  warm: "#FFFDF7",
  light: "#F7F7F2",
  char: "#2D2D3F",
  muted: "#7A7A8E",
  coral: "#FF6B6B",
  blue: "#6C8EBF",
  green: "#2ECC71",
  white: "#FFFFFF",
};

// ─── iPad frame ───
const iPad = ({ children, statusBar = "light" }) => (
  <div style={{
    width: 320, minHeight: 520, maxHeight: 580,
    background: T.navy, borderRadius: 28, padding: "0",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    overflow: "hidden", display: "flex", flexDirection: "column",
    border: "3px solid #2a2a4a", position: "relative",
  }}>
    {/* Status bar */}
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 16px 4px", fontSize: 10,
      color: statusBar === "light" ? "#fff" : T.muted,
    }}>
      <span>9:41 AM</span>
      <span style={{ display: "flex", gap: 4 }}>
        <span>⚡</span><span>📶</span>
      </span>
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {children}
    </div>
    {/* Home indicator */}
    <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 8px" }}>
      <div style={{ width: 100, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
    </div>
  </div>
);

// ─── Common components ───
const Btn = ({ children, color = T.amber, textColor = T.navy, full = false, small = false, outline = false }) => (
  <div style={{
    background: outline ? "transparent" : color,
    color: outline ? color : textColor,
    border: outline ? `1.5px solid ${color}` : "none",
    padding: small ? "8px 16px" : "12px 24px",
    borderRadius: 12, fontWeight: 700,
    fontSize: small ? 12 : 14, textAlign: "center",
    width: full ? "100%" : "auto",
    letterSpacing: 0.5,
  }}>
    {children}
  </div>
);

const ProgressDots = ({ total, current, color = T.amber }) => (
  <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "8px 0" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        width: i === current ? 20 : 6, height: 6, borderRadius: 3,
        background: i <= current ? color : "rgba(255,255,255,0.15)",
        transition: "all 0.3s",
      }} />
    ))}
  </div>
);

const ProgressBar = ({ pct, color = T.teal, label }) => (
  <div>
    {label && <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>{label}</div>}
    <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
      <div style={{ height: "100%", borderRadius: 3, background: color, width: `${pct}%` }} />
    </div>
  </div>
);

const Chip = ({ children, active, color = T.teal }) => (
  <div style={{
    padding: "6px 14px", borderRadius: 20,
    background: active ? color : "rgba(255,255,255,0.06)",
    color: active ? T.navy : T.muted,
    fontSize: 11, fontWeight: active ? 700 : 400,
    border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
  }}>
    {children}
  </div>
);

// ─── Screen registry ───
const phases = [
  {
    id: "phase1",
    label: "Phase 1 · Day 1",
    color: T.amber,
    screens: [
      {
        id: "p1_welcome",
        title: "Welcome Card",
        annotation: "Included in physical package. Patient sees this card first before touching the iPad.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: `linear-gradient(180deg, ${T.navy} 0%, #1a1b3a 100%)` }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>☀️</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.white, textAlign: "center", letterSpacing: 1 }}>Welcome to<br/>Circadian</div>
              <div style={{ width: 40, height: 2, background: T.amber, margin: "16px 0" }} />
              <div style={{ fontSize: 13, color: T.muted, textAlign: "center", lineHeight: 1.5, maxWidth: 240 }}>
                Your light therapy journey starts here. Let's get you set up — it only takes a few minutes.
              </div>
              <div style={{ marginTop: 24, fontSize: 11, color: T.amber, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
                Press the power button →
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p1_power_on",
        title: "Device Power On",
        annotation: "iPad boots directly into Circadian app (MDM-locked). No home screen, no distractions. Patient sees this immediately.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: T.navy }}>
              <div style={{
                width: 80, height: 80, borderRadius: 40,
                background: "rgba(245,166,35,0.1)", border: `2px solid ${T.amber}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36,
              }}>☀️</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.white, marginTop: 20, textAlign: "center" }}>Circadian</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 8 }}>Preparing your experience...</div>
              <div style={{ marginTop: 20, width: 120 }}>
                <ProgressBar pct={65} color={T.amber} />
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p1_intro_1",
        title: "Intro — What This Is",
        annotation: "First of 3 intro cards. Minimal text, warm tone. Patient learns what they're doing without medical jargon.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy }}>
              <ProgressDots total={3} current={0} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 100, height: 100, borderRadius: 50, background: "rgba(245,166,35,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🌅</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: T.white, marginTop: 20, textAlign: "center" }}>Your morning light</div>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 10, textAlign: "center", lineHeight: 1.6, maxWidth: 260 }}>
                  Each morning, you'll spend time with bright light while watching your favorite shows or scrolling your feeds.
                </div>
              </div>
              <Btn full>Next</Btn>
            </div>
          </iPad>
        ),
      },
      {
        id: "p1_intro_2",
        title: "Intro — How It Works",
        annotation: "Shows the simplicity: alarm goes off, open app, watch content. Three-step mental model.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy }}>
              <ProgressDots total={3} current={1} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.white, textAlign: "center" }}>Three simple steps</div>
                {[
                  { icon: "🔔", label: "Alarm wakes you", sub: "We'll set your time" },
                  { icon: "📱", label: "Open & answer 1 question", sub: "Takes 10 seconds" },
                  { icon: "🎬", label: "Watch what you love", sub: "Netflix, TikTok, news..." },
                ].map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14, width: "100%",
                    background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "12px 16px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ fontSize: 24, width: 40, textAlign: "center" }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: T.white }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Btn full>Next</Btn>
            </div>
          </iPad>
        ),
      },
      {
        id: "p1_intro_3",
        title: "Intro — Your Commitment",
        annotation: "Sets expectations clearly. Conservative messaging: shows slightly tighter rules than actual. SuperBetter 'epic win' framing.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy }}>
              <ProgressDots total={3} current={2} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>💪</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: T.white, textAlign: "center" }}>Your daily quest</div>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 10, textAlign: "center", lineHeight: 1.6, maxWidth: 260 }}>
                  One session each morning. That's your only mission. Complete it and you've won the day.
                </div>
                <div style={{
                  marginTop: 20, padding: "14px 20px", borderRadius: 14,
                  background: "rgba(78,205,196,0.08)", border: `1px solid rgba(78,205,196,0.2)`,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: T.teal }}>60 min</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>each morning · between 7-11 AM</div>
                </div>
              </div>
              <Btn full>Let's set up</Btn>
            </div>
          </iPad>
        ),
      },
      {
        id: "p1_patient_id",
        title: "Patient ID Entry",
        annotation: "Simple ID entry. No account creation — device is pre-assigned via MDM. Just confirm identity to link data.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy }}>
              <div style={{ fontSize: 11, color: T.muted, textAlign: "center", letterSpacing: 2, marginTop: 8 }}>SETUP 1 OF 4</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.white, textAlign: "center" }}>Enter your patient ID</div>
                <div style={{ fontSize: 12, color: T.muted, textAlign: "center", marginTop: 6 }}>You'll find this on the card in your package</div>
                <div style={{
                  marginTop: 24, background: "rgba(255,255,255,0.04)", borderRadius: 14,
                  padding: "16px 20px", border: "1.5px solid rgba(245,166,35,0.3)",
                }}>
                  <div style={{ fontSize: 24, fontWeight: 300, color: T.amber, letterSpacing: 8, textAlign: "center" }}>CRC-4829</div>
                </div>
                <div style={{ fontSize: 10, color: T.muted, textAlign: "center", marginTop: 10 }}>
                  This connects your sessions to your care team
                </div>
              </div>
              <Btn full>Confirm</Btn>
            </div>
          </iPad>
        ),
      },
      {
        id: "p1_alarm",
        title: "Set Alarm Time",
        annotation: "Hooked 'Investment' phase: patient picks their time, creating ownership. Constrained to 7-11 AM window. Large touch targets for accessibility.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy }}>
              <div style={{ fontSize: 11, color: T.muted, textAlign: "center", letterSpacing: 2, marginTop: 8 }}>SETUP 2 OF 4</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.white }}>When do you wake up?</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>We'll set your daily alarm</div>
                {/* Time picker mock */}
                <div style={{
                  marginTop: 24, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{
                    fontSize: 48, fontWeight: 800, color: T.amber,
                    background: "rgba(245,166,35,0.08)", borderRadius: 16, padding: "8px 20px",
                  }}>7</div>
                  <div style={{ fontSize: 40, color: T.muted }}>:</div>
                  <div style={{
                    fontSize: 48, fontWeight: 800, color: T.amber,
                    background: "rgba(245,166,35,0.08)", borderRadius: 16, padding: "8px 20px",
                  }}>30</div>
                  <div style={{
                    fontSize: 18, fontWeight: 700, color: T.white,
                    background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 12px",
                    marginLeft: 8,
                  }}>AM</div>
                </div>
                <div style={{
                  marginTop: 16, padding: "8px 16px", borderRadius: 10,
                  background: "rgba(78,205,196,0.08)",
                  fontSize: 11, color: T.teal,
                }}>
                  ✓ Great — within your session window
                </div>
              </div>
              <Btn full>Set alarm</Btn>
            </div>
          </iPad>
        ),
      },
      {
        id: "p1_connect_apps",
        title: "Connect Content Apps",
        annotation: "Pre-connect apps NOW during onboarding to eliminate content selection friction on daily sessions. Hooked 'Investment' — the more they connect, the more value stored.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy }}>
              <div style={{ fontSize: 11, color: T.muted, textAlign: "center", letterSpacing: 2, marginTop: 8 }}>SETUP 3 OF 4</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.white, textAlign: "center", marginTop: 16 }}>Connect your apps</div>
              <div style={{ fontSize: 12, color: T.muted, textAlign: "center", marginTop: 6 }}>So you can jump straight into content each morning</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                {[
                  { name: "Netflix", icon: "🎬", connected: true },
                  { name: "YouTube", icon: "▶️", connected: true },
                  { name: "Instagram", icon: "📸", connected: false },
                  { name: "TikTok", icon: "🎵", connected: false },
                  { name: "News", icon: "📰", connected: false },
                ].map((app, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", padding: "12px 16px",
                    background: "rgba(255,255,255,0.03)", borderRadius: 14,
                    border: `1px solid ${app.connected ? "rgba(78,205,196,0.3)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                    <span style={{ fontSize: 22, width: 36 }}>{app.icon}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.white }}>{app.name}</span>
                    {app.connected ? (
                      <span style={{ fontSize: 11, color: T.teal, fontWeight: 600 }}>✓ Connected</span>
                    ) : (
                      <span style={{ fontSize: 11, color: T.muted, padding: "4px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)" }}>Connect</span>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: T.muted, textAlign: "center", marginBottom: 8 }}>Connect at least one · you can add more later</div>
              <Btn full>Continue</Btn>
            </div>
          </iPad>
        ),
      },
      {
        id: "p1_test_light",
        title: "Test Light Position",
        annotation: "Setup 4: Patient positions device in the light frame. Visual feedback confirms correct placement. Graceful error handling if light sensor reads low.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy }}>
              <div style={{ fontSize: 11, color: T.muted, textAlign: "center", letterSpacing: 2, marginTop: 8 }}>SETUP 4 OF 4</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.white, textAlign: "center" }}>Position your device</div>
                <div style={{ fontSize: 12, color: T.muted, textAlign: "center", marginTop: 6 }}>Place the iPad in the light frame</div>
                {/* Light frame visualization */}
                <div style={{
                  marginTop: 24, width: 160, height: 120, borderRadius: 16,
                  border: `3px solid ${T.amber}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(245,166,35,0.05)",
                  position: "relative",
                }}>
                  <div style={{ fontSize: 40 }}>☀️</div>
                  {/* Glow effect */}
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                      position: "absolute",
                      [["top", "right", "bottom", "left"][i]]: -8,
                      [i % 2 === 0 ? "left" : "top"]: "20%",
                      width: i % 2 === 0 ? "60%" : 4,
                      height: i % 2 === 0 ? 4 : "60%",
                      background: T.amber, borderRadius: 2, opacity: 0.5,
                    }} />
                  ))}
                </div>
                <div style={{
                  marginTop: 20, padding: "10px 20px", borderRadius: 12,
                  background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.2)",
                }}>
                  <div style={{ fontSize: 13, color: T.green, fontWeight: 600, textAlign: "center" }}>✓ Light detected — looking good!</div>
                </div>
              </div>
              <Btn full>Start first session</Btn>
            </div>
          </iPad>
        ),
      },
      {
        id: "p1_first_session",
        title: "First Session Active",
        annotation: "First session immediately starts after setup. Timer doesn't start until content plays (solving Netflix selection problem). Minimal UI — content takes center stage.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#000" }}>
              {/* Content area (Netflix-like) */}
              <div style={{ flex: 1, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ fontSize: 60, opacity: 0.3 }}>🎬</div>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 30%)" }} />
                {/* Content label */}
                <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                  <div style={{ fontSize: 11, color: T.muted }}>Now playing</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.white }}>The Great British Bake Off</div>
                </div>
              </div>
              {/* Session bar */}
              <div style={{ padding: "12px 16px", background: T.navy }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: T.teal }}>12:34</span>
                    <span style={{ fontSize: 11, color: T.muted, marginLeft: 6 }}>/ 60:00</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", fontSize: 10, color: T.muted }}>Switch app</div>
                    <div style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", fontSize: 10, color: T.muted }}>Pause</div>
                  </div>
                </div>
                <ProgressBar pct={21} color={T.teal} />
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p1_first_complete",
        title: "First Session Complete!",
        annotation: "Huge celebration for Day 1. SuperBetter 'epic win' moment. Sets the emotional anchor for the rest of the trial. Bright, warm, unmistakably positive.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: T.navy }}>
              <div style={{ fontSize: 56 }}>🎉</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: T.white, marginTop: 12, textAlign: "center" }}>First session<br/>complete!</div>
              <div style={{ width: 40, height: 2, background: T.amber, margin: "16px 0" }} />
              <div style={{ fontSize: 13, color: T.muted, textAlign: "center", lineHeight: 1.6, maxWidth: 240 }}>
                You did it. Your first daily quest is done. Same time tomorrow — we'll remind you.
              </div>
              <div style={{
                marginTop: 20, display: "flex", gap: 16,
              }}>
                {[
                  { val: "60", label: "minutes" },
                  { val: "1", label: "session" },
                  { val: "Day 1", label: "streak" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: T.amber }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 28, width: "100%" }}>
                <Btn full color={T.teal}>See you tomorrow ☀️</Btn>
              </div>
            </div>
          </iPad>
        ),
      },
    ],
  },
  {
    id: "phase2",
    label: "Phase 2 · Regular Days",
    color: T.teal,
    screens: [
      {
        id: "p2_alarm_notif",
        title: "Alarm Notification",
        annotation: "Hooked 'External Trigger'. Notification appears at patient's chosen time. Clear, warm, one-tap to open. No medical language.",
        screen: () => (
          <iPad statusBar="dark">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: "#1c1c1e" }}>
              {/* Lock screen time */}
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <div style={{ fontSize: 56, fontWeight: 200, color: T.white }}>7:30</div>
                <div style={{ fontSize: 13, color: T.muted }}>Wednesday, March 4</div>
              </div>
              {/* Notification */}
              <div style={{
                marginTop: 40, background: "rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 14, backdropFilter: "blur(20px)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: T.amber, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 18,
                  }}>☀️</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.white }}>Circadian</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Good morning! Your light session is ready.</div>
                  </div>
                  <div style={{ fontSize: 10, color: T.muted }}>now</div>
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ textAlign: "center", fontSize: 10, color: T.muted }}>Tap notification to start</div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p2_survey",
        title: "Daily Survey",
        annotation: "Single question — takes 10 seconds. Large touch targets for sleepy/sick patients. No typing required. Data feeds into care team dashboard.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy }}>
              <div style={{ fontSize: 11, color: T.amber, fontWeight: 600, letterSpacing: 2, textAlign: "center" }}>DAILY CHECK-IN</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.white, textAlign: "center" }}>How did you sleep?</div>
                <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                  {[
                    { emoji: "😊", label: "Great", sub: "Felt rested" },
                    { emoji: "😐", label: "Okay", sub: "Could be better" },
                    { emoji: "😴", label: "Rough", sub: "Didn't sleep well" },
                  ].map((opt, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 18px", borderRadius: 14,
                      background: i === 0 ? "rgba(78,205,196,0.08)" : "rgba(255,255,255,0.03)",
                      border: `1.5px solid ${i === 0 ? "rgba(78,205,196,0.3)" : "rgba(255,255,255,0.06)"}`,
                    }}>
                      <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: T.white }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: T.muted }}>{opt.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 10, color: T.muted, textAlign: "center" }}>Day 5 of 14 · Tap to answer</div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p2_content_select",
        title: "Content Selection",
        annotation: "Timer NOT running yet. Recent/connected apps shown first to minimize browsing time. Easy switching. Pre-connected apps from onboarding pay off here.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 20, background: T.navy }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>Choose your content</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>Timer starts when you're ready</div>
              {/* Recent */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 10, color: T.amber, fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>CONTINUE WHERE YOU LEFT OFF</div>
                <div style={{
                  display: "flex", gap: 10,
                }}>
                  {[
                    { icon: "🎬", name: "Bake Off S14 E3", app: "Netflix" },
                    { icon: "▶️", name: "Morning playlist", app: "YouTube" },
                  ].map((r, i) => (
                    <div key={i} style={{
                      flex: 1, padding: "12px", borderRadius: 14,
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div style={{ fontSize: 24 }}>{r.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: T.white, marginTop: 6 }}>{r.name}</div>
                      <div style={{ fontSize: 10, color: T.muted }}>{r.app}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* All apps */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 10, color: T.amber, fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>YOUR APPS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {[
                    { icon: "🎬", name: "Netflix" },
                    { icon: "▶️", name: "YouTube" },
                    { icon: "📸", name: "Instagram" },
                    { icon: "🎵", name: "TikTok" },
                    { icon: "📰", name: "News" },
                    { icon: "➕", name: "Add app" },
                  ].map((a, i) => (
                    <div key={i} style={{
                      width: 80, textAlign: "center", padding: "10px 0",
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14, margin: "0 auto",
                        background: i === 5 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22, border: i === 5 ? "1.5px dashed rgba(255,255,255,0.15)" : "none",
                      }}>{a.icon}</div>
                      <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{a.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p2_session_active",
        title: "Session In Progress",
        annotation: "Minimal chrome — content dominates. Timer is present but not anxious. Progress bar subtly shows win zone approaching. Easy app switch and pause always visible.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#000" }}>
              <div style={{ flex: 1, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ fontSize: 60, opacity: 0.3 }}>🎬</div>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 30%)" }} />
                <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                  <div style={{ fontSize: 11, color: T.muted }}>Netflix</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.white }}>The Great British Bake Off</div>
                </div>
              </div>
              <div style={{ padding: "12px 16px", background: T.navy }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: T.teal }}>28:45</span>
                    <span style={{ fontSize: 11, color: T.muted, marginLeft: 6 }}>/ 60:00</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", fontSize: 10, color: T.muted }}>Switch</div>
                    <div style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", fontSize: 10, color: T.muted }}>Break</div>
                  </div>
                </div>
                <ProgressBar pct={48} color={T.teal} />
                <div style={{ fontSize: 9, color: T.muted, textAlign: "right", marginTop: 3 }}>🏆 Win zone in 13 min</div>
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p2_break",
        title: "Break Screen",
        annotation: "Break timer shows clearly. First half: 5 min max. Second half: 15 min max. Encouraging, not punitive. Easy resume.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: T.navy }}>
              <div style={{ fontSize: 11, color: T.amber, fontWeight: 600, letterSpacing: 2 }}>BREAK TIME</div>
              <div style={{ fontSize: 44, fontWeight: 200, color: T.white, marginTop: 16 }}>3:22</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>remaining of 5:00 break</div>
              <div style={{ marginTop: 20, width: 180 }}>
                <ProgressBar pct={33} color={T.amber} />
              </div>
              <div style={{ marginTop: 24, fontSize: 13, color: T.muted, textAlign: "center", lineHeight: 1.6 }}>
                Take your time. Stretch, grab water.<br/>Your session will be right here.
              </div>
              <div style={{ marginTop: 32 }}>
                <Btn color={T.teal}>Resume session</Btn>
              </div>
              <div style={{
                marginTop: 20, padding: "8px 16px", borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                fontSize: 10, color: T.muted,
              }}>
                Session progress: 28:45 / 60:00
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p2_win_zone",
        title: "42-Min Win Moment",
        annotation: "SuperBetter 'epic win'. At 70% threshold (42 min), patient sees celebration. Everything after is 'bonus'. Reframes remaining time as power-up, not obligation.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#000" }}>
              <div style={{ flex: 1, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ fontSize: 60, opacity: 0.3 }}>🎬</div>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 30%)" }} />
              </div>
              {/* Win banner */}
              <div style={{
                padding: "14px 16px", background: "rgba(46,204,113,0.12)",
                borderTop: `2px solid ${T.green}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>🏆</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.green }}>Daily quest complete!</div>
                    <div style={{ fontSize: 11, color: T.muted }}>Keep going for bonus power-up time</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: "10px 16px", background: T.navy }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: T.green }}>42:00</span>
                    <span style={{ fontSize: 11, color: T.muted, marginLeft: 6 }}>/ 60:00</span>
                  </div>
                  <div style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(245,166,35,0.1)", fontSize: 10, color: T.amber, fontWeight: 600 }}>⚡ POWER-UP ZONE</div>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "70%", background: T.green, borderRadius: 3 }} />
                  <div style={{ height: "100%", width: "0%", background: T.amber, borderRadius: 3, marginTop: -6 }} />
                </div>
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p2_cinema_dim",
        title: "Cinema Dim (Session End)",
        annotation: "Gradual screen dim like movie theater lights. No abrupt stop — content fades gently. Patient feels the session naturally concluding rather than being cut off.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#000", position: "relative" }}>
              <div style={{ flex: 1, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 60, opacity: 0.15 }}>🎬</div>
              </div>
              {/* Dim overlay */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(15,17,41,0.6)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 40 }}>🌅</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.white, marginTop: 12 }}>Session complete</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 6, textAlign: "center" }}>The lights are coming up...<br/>Great session today.</div>
              </div>
              <div style={{ position: "absolute", bottom: 60, left: 20, right: 20 }}>
                <Btn full color={T.teal}>See today's results</Btn>
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p2_daily_summary",
        title: "Daily Summary",
        annotation: "SuperBetter daily quest recap. Shows streak, quality metrics, power-ups earned. Feeds into Hooked 'Investment' — stored value makes tomorrow's session more meaningful.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy }}>
              <div style={{ fontSize: 11, color: T.amber, fontWeight: 600, letterSpacing: 2, textAlign: "center" }}>DAY 5 COMPLETE</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.white, textAlign: "center", marginTop: 8 }}>Well done! 💪</div>

              <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                {[
                  { val: "60:00", label: "Duration", icon: "⏱" },
                  { val: "5", label: "Day streak", icon: "🔥" },
                  { val: "A+", label: "Quality", icon: "⭐" },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex: 1, textAlign: "center", padding: "14px 8px",
                    background: "rgba(255,255,255,0.03)", borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ fontSize: 18 }}>{s.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: T.amber, marginTop: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: T.muted, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Power-ups */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 10, color: T.teal, fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>POWER-UPS EARNED</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { icon: "⚡", label: "No breaks taken", earned: true },
                    { icon: "👀", label: "Focused throughout", earned: true },
                    { icon: "⏰", label: "Started within 10 min of alarm", earned: false },
                  ].map((p, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                      borderRadius: 10, background: "rgba(255,255,255,0.02)",
                      opacity: p.earned ? 1 : 0.4,
                    }}>
                      <span style={{ fontSize: 16 }}>{p.icon}</span>
                      <span style={{ fontSize: 12, color: T.white }}>{p.label}</span>
                      {p.earned && <span style={{ marginLeft: "auto", fontSize: 10, color: T.green }}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1 }} />
              <Btn full color={T.teal}>See you tomorrow ☀️</Btn>
            </div>
          </iPad>
        ),
      },
      {
        id: "p2_dashboard",
        title: "Progress Dashboard",
        annotation: "Optional access from home. Shows journey progress, streak, upcoming sessions. Not the main path — daily flow is notification-driven. This is for curious/motivated patients.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 20, background: T.navy }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>Your Journey</div>
                  <div style={{ fontSize: 11, color: T.muted }}>Day 5 of 14</div>
                </div>
                <div style={{ fontSize: 28 }}>☀️</div>
              </div>

              {/* Overall progress */}
              <div style={{ marginTop: 16 }}>
                <ProgressBar pct={36} color={T.amber} label="TRIAL PROGRESS" />
              </div>

              {/* Week view */}
              <div style={{ marginTop: 16, display: "flex", gap: 6, justifyContent: "center" }}>
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} style={{
                    width: 34, height: 46, borderRadius: 10, display: "flex",
                    flexDirection: "column", alignItems: "center", justifyContent: "center",
                    background: i < 5 ? "rgba(46,204,113,0.1)" : i === 5 ? "rgba(78,205,196,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i < 5 ? "rgba(46,204,113,0.2)" : i === 5 ? "rgba(78,205,196,0.3)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                    <div style={{ fontSize: 9, color: T.muted }}>{d}</div>
                    <div style={{ fontSize: 14, marginTop: 2 }}>{i < 5 ? "✅" : i === 5 ? "🔵" : "○"}</div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                {[
                  { label: "Streak", val: "5 days", color: T.amber },
                  { label: "Avg quality", val: "A", color: T.teal },
                  { label: "Power-ups", val: "12", color: T.green },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 12, textAlign: "center",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Next session */}
              <div style={{
                marginTop: 16, padding: "12px 16px", borderRadius: 14,
                background: "rgba(245,166,35,0.06)", border: `1px solid rgba(245,166,35,0.15)`,
              }}>
                <div style={{ fontSize: 10, color: T.amber, fontWeight: 600, letterSpacing: 1 }}>TOMORROW</div>
                <div style={{ fontSize: 13, color: T.white, fontWeight: 600, marginTop: 4 }}>Session at 7:30 AM</div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>Alarm set · Netflix queued</div>
              </div>
            </div>
          </iPad>
        ),
      },
    ],
  },
  {
    id: "phase3",
    label: "Phase 3 · Last Day",
    color: T.coral,
    screens: [
      {
        id: "p3_last_day_notif",
        title: "Last Day Notification",
        annotation: "Special notification framing. Acknowledges this is the final session. Encouraging, celebratory tone. No medical language.",
        screen: () => (
          <iPad statusBar="dark">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: "#1c1c1e" }}>
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <div style={{ fontSize: 56, fontWeight: 200, color: T.white }}>7:30</div>
                <div style={{ fontSize: 13, color: T.muted }}>Tuesday, March 11</div>
              </div>
              <div style={{
                marginTop: 40, background: "rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 14,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: T.amber, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 18,
                  }}>🌟</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.white }}>Circadian</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Your final session! Let's finish strong 🎉</div>
                  </div>
                  <div style={{ fontSize: 10, color: T.muted }}>now</div>
                </div>
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p3_last_survey",
        title: "Final Survey",
        annotation: "Same familiar survey but with a 'last day' badge. Consistency matters — don't change the routine on the last day.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy }}>
              <div style={{
                padding: "6px 14px", borderRadius: 20, background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.2)", alignSelf: "center",
                fontSize: 10, color: T.coral, fontWeight: 600, letterSpacing: 1,
              }}>🌟 FINAL SESSION</div>
              <div style={{ fontSize: 11, color: T.amber, fontWeight: 600, letterSpacing: 2, textAlign: "center", marginTop: 12 }}>DAILY CHECK-IN</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.white }}>How did you sleep?</div>
                <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                  {[
                    { emoji: "😊", label: "Great" },
                    { emoji: "😐", label: "Okay" },
                    { emoji: "😴", label: "Rough" },
                  ].map((opt, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 18px", borderRadius: 14,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: T.white }}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 10, color: T.muted, textAlign: "center" }}>Day 14 of 14 · Last one!</div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p3_last_session",
        title: "Final Session Active",
        annotation: "Same session UI but with subtle 'final session' indicator. No extra pressure — the experience is the same. Let them enjoy it.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#000" }}>
              <div style={{ flex: 1, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ fontSize: 60, opacity: 0.3 }}>🎬</div>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 30%)" }} />
                {/* Final session badge */}
                <div style={{
                  position: "absolute", top: 12, right: 12,
                  padding: "4px 10px", borderRadius: 8,
                  background: "rgba(255,107,107,0.15)", fontSize: 9,
                  color: T.coral, fontWeight: 600,
                }}>🌟 FINAL SESSION</div>
              </div>
              <div style={{ padding: "12px 16px", background: T.navy }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: T.teal }}>45:12</span>
                    <span style={{ fontSize: 11, color: T.muted, marginLeft: 6 }}>/ 60:00</span>
                  </div>
                  <div style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(46,204,113,0.1)", fontSize: 10, color: T.green, fontWeight: 600 }}>✓ Quest complete</div>
                </div>
                <ProgressBar pct={75} color={T.green} />
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p3_final_dim",
        title: "Final Cinema Dim",
        annotation: "Same gentle dimming but the message acknowledges completion of the entire journey, not just one session.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#000", position: "relative" }}>
              <div style={{ flex: 1, background: "#111" }} />
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(15,17,41,0.75)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: 24,
              }}>
                <div style={{ fontSize: 48 }}>✨</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.white, marginTop: 12, textAlign: "center" }}>Journey complete</div>
                <div style={{ width: 40, height: 2, background: T.amber, margin: "16px 0" }} />
                <div style={{ fontSize: 13, color: T.muted, textAlign: "center", lineHeight: 1.6 }}>
                  That was your final session.<br/>You made it all the way.
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 60, left: 20, right: 20 }}>
                <Btn full color={T.amber}>See your journey</Btn>
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p3_journey_summary",
        title: "Journey Summary",
        annotation: "Full trial recap. Stats, streak, power-ups collected. Celebratory but not medical. No treatment outcomes — just behavioral achievement. SuperBetter 'post-game' screen.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, background: T.navy, overflow: "auto" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40 }}>🏆</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: T.white, marginTop: 8 }}>Your Journey</div>
                <div style={{ fontSize: 12, color: T.muted }}>14 days of light therapy</div>
              </div>

              {/* Big stats */}
              <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
                {[
                  { val: "14", label: "Sessions", sub: "completed" },
                  { val: "14h", label: "Total time", sub: "of light" },
                  { val: "100%", label: "Adherence", sub: "perfect!" },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex: 1, textAlign: "center", padding: "12px 4px",
                    background: "rgba(255,255,255,0.03)", borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: T.amber }}>{s.val}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: T.white, marginTop: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 9, color: T.muted }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Streak calendar */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 10, color: T.amber, fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>YOUR STREAK</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "rgba(46,204,113,0.15)",
                      border: "1px solid rgba(46,204,113,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12,
                    }}>✅</div>
                  ))}
                </div>
              </div>

              {/* Power-ups collected */}
              <div style={{ marginTop: 16, display: "flex", justifyContent: "space-around" }}>
                {[
                  { icon: "⚡", val: "38", label: "Power-ups" },
                  { icon: "🔥", val: "14", label: "Max streak" },
                  { icon: "⭐", val: "A+", label: "Avg quality" },
                ].map((p, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20 }}>{p.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.teal }}>{p.val}</div>
                    <div style={{ fontSize: 9, color: T.muted }}>{p.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </iPad>
        ),
      },
      {
        id: "p3_thank_you",
        title: "Thank You & Goodbye",
        annotation: "Final screen. Warm, genuine goodbye. No medical references. Acknowledges their commitment. Device can now be returned. Simple, elegant close.",
        screen: () => (
          <iPad>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: T.navy }}>
              <div style={{ fontSize: 56 }}>☀️</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: T.white, marginTop: 12, textAlign: "center" }}>Thank you</div>
              <div style={{ width: 40, height: 2, background: T.amber, margin: "16px 0" }} />
              <div style={{ fontSize: 14, color: T.muted, textAlign: "center", lineHeight: 1.7, maxWidth: 260 }}>
                You showed up every single day. That takes real commitment, and it matters.
              </div>
              <div style={{ fontSize: 13, color: T.muted, textAlign: "center", lineHeight: 1.7, maxWidth: 260, marginTop: 12 }}>
                Your care team has your results. You can return this device whenever you're ready.
              </div>
              <div style={{
                marginTop: 28, padding: "12px 20px", borderRadius: 14,
                background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)",
              }}>
                <div style={{ fontSize: 12, color: T.amber, textAlign: "center", fontWeight: 600 }}>
                  Be proud of yourself 💛
                </div>
              </div>
            </div>
          </iPad>
        ),
      },
    ],
  },
];

// ─── Main App ───
export default function CircadianWireframes() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeScreen, setActiveScreen] = useState(0);

  const phase = phases[activePhase];
  const screen = phase.screens[activeScreen];

  return (
    <div style={{
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      background: "#0a0b1a", minHeight: "100vh", color: T.white,
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1 }}>
          <span style={{ color: T.amber }}>☀️</span> Circadian OS — Wireframes
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
          Complete patient journey: Package → Onboarding → Daily Sessions → Completion
        </div>

        {/* Phase tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 16, paddingBottom: 0 }}>
          {phases.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { setActivePhase(i); setActiveScreen(0); }}
              style={{
                padding: "10px 18px", borderRadius: "10px 10px 0 0",
                background: i === activePhase ? "rgba(255,255,255,0.06)" : "transparent",
                color: i === activePhase ? p.color : T.muted,
                border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                borderBottom: i === activePhase ? `2px solid ${p.color}` : "2px solid transparent",
                letterSpacing: 0.5,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Screen selector */}
      <div style={{
        padding: "12px 24px", display: "flex", gap: 6,
        overflowX: "auto", background: "rgba(255,255,255,0.02)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        {phase.screens.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveScreen(i)}
            style={{
              padding: "6px 14px", borderRadius: 20,
              background: i === activeScreen ? phase.color : "rgba(255,255,255,0.04)",
              color: i === activeScreen ? T.navy : T.muted,
              border: `1px solid ${i === activeScreen ? phase.color : "rgba(255,255,255,0.08)"}`,
              cursor: "pointer", fontSize: 11, fontWeight: i === activeScreen ? 700 : 400,
              whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div style={{
        flex: 1, display: "flex", gap: 32,
        padding: "24px 32px", alignItems: "flex-start",
        flexWrap: "wrap", justifyContent: "center",
      }}>
        {/* iPad wireframe */}
        <div>
          <screen.screen />
          {/* Nav arrows */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, padding: "0 4px" }}>
            <button
              onClick={() => {
                if (activeScreen > 0) {
                  setActiveScreen(activeScreen - 1);
                } else if (activePhase > 0) {
                  setActivePhase(activePhase - 1);
                  setActiveScreen(phases[activePhase - 1].screens.length - 1);
                }
              }}
              style={{
                padding: "8px 16px", borderRadius: 8,
                background: "rgba(255,255,255,0.06)", border: "none",
                color: T.muted, fontSize: 12, cursor: "pointer",
                opacity: activePhase === 0 && activeScreen === 0 ? 0.3 : 1,
              }}
            >
              ← Previous
            </button>
            <span style={{ fontSize: 11, color: T.muted, padding: "8px 0" }}>
              {activeScreen + 1} / {phase.screens.length}
            </span>
            <button
              onClick={() => {
                if (activeScreen < phase.screens.length - 1) {
                  setActiveScreen(activeScreen + 1);
                } else if (activePhase < phases.length - 1) {
                  setActivePhase(activePhase + 1);
                  setActiveScreen(0);
                }
              }}
              style={{
                padding: "8px 16px", borderRadius: 8,
                background: "rgba(255,255,255,0.06)", border: "none",
                color: T.muted, fontSize: 12, cursor: "pointer",
                opacity: activePhase === phases.length - 1 && activeScreen === phase.screens.length - 1 ? 0.3 : 1,
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Annotation panel */}
        <div style={{ maxWidth: 360, minWidth: 280 }}>
          {/* Screen info */}
          <div style={{
            padding: "20px", borderRadius: 16,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{
              fontSize: 10, color: phase.color, fontWeight: 600,
              letterSpacing: 2, marginBottom: 8,
            }}>
              {phase.label.toUpperCase()} · SCREEN {activeScreen + 1}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>
              {screen.title}
            </div>
            <div style={{
              marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
            }}>
              {screen.annotation}
            </div>
          </div>

          {/* Design principles applied */}
          <div style={{
            marginTop: 12, padding: "16px 20px", borderRadius: 16,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: 2, marginBottom: 10 }}>
              PRINCIPLES APPLIED
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {["Minimalistic", "Clarity is care", "Works for everyone", "Light & uplifting"].map((p, i) => (
                <span key={i} style={{
                  padding: "3px 10px", borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  fontSize: 10, color: T.muted,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Phase overview */}
          <div style={{
            marginTop: 12, padding: "16px 20px", borderRadius: 16,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: 2, marginBottom: 10 }}>
              ALL SCREENS IN {phase.label.toUpperCase()}
            </div>
            {phase.screens.map((s, i) => (
              <div
                key={s.id}
                onClick={() => setActiveScreen(i)}
                style={{
                  padding: "6px 0", fontSize: 12, cursor: "pointer",
                  color: i === activeScreen ? phase.color : T.muted,
                  fontWeight: i === activeScreen ? 600 : 400,
                  borderLeft: `2px solid ${i === activeScreen ? phase.color : "transparent"}`,
                  paddingLeft: 10, marginLeft: -1,
                }}
              >
                {i + 1}. {s.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
