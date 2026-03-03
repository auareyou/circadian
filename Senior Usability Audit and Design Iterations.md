# Senior Usability Audit & Design Iterations
### Circadian — "My Health" Dashboard
**Audience:** Patients 60+, many undergoing cancer treatment or managing chronic illness

---

## What's already working well

The current design has a strong foundation. Before proposing changes, it's worth naming what should be preserved:

- **The timeline calendar at the top** is the best element on the screen. Those blue checkmarks are the indirect streak — a patient sees six completed days in a row without anyone telling them "great job." That's exactly the invisible motivation principle. Keep this prominent.
- **The "Start session" button** is large, blue, fixed at the bottom left. High contrast, clear action. This is good.
- **The logged sessions list** with day labels, weekday names, and time ranges is clear and scannable. The chevrons suggest tappability without being confusing.
- **The overall color palette** — white, soft grays, blue accents — is calm and medical-appropriate without feeling clinical.
- **Low information density** — the screen doesn't overwhelm. There's breathing room.

---

## Audit findings: What needs iteration for 60+

### 1. Typography & Readability

**Issue:** Several text elements are too small for comfortable reading at arm's length on an iPad (where many 60+ users will hold it ~18-24 inches away).

**Specific concerns:**
- The day labels ("Day 01", "Day 02") and weekday names ("Tuesday", "Wednesday") above the calendar circles are quite small — likely 10-11pt equivalent. A 65-year-old with early presbyopia will squint.
- "Light exposure 50%", "Sleep 50%", "Powerups 50%" legend text beside the donut chart is small and low contrast.
- The weekday abbreviations (T, W, Th, F, S, Su, M) under the session quality chart are tiny.
- "See all" link text at the bottom is small and easy to miss.

**Proposed iteration:**
- Minimum text size across the entire app: 16pt (iOS Dynamic Type "Body" equivalent). No exceptions.
- Calendar day labels: bump to 14pt minimum, ideally 16pt. Consider showing only "Day 1" through "Day 13" and dropping the weekday row — or making the weekday the primary label since older adults orient by weekday, not "Day 07."
- Chart legends: increase to 16pt and ensure WCAG AA contrast ratio (4.5:1 minimum).

---

### 2. The Donut Chart ("Score")

**Issue:** This is the most cognitively complex element on the screen, and it's where 60+ usability breaks down.

**Specific concerns:**
- Three nested rings with three color-coded categories (blue, coral, green) requires the patient to decode a legend, match colors to rings, and understand what "Light exposure 50%" means in context. That's a lot of mental work for a tired patient at 7 AM.
- The "Latest / All time" toggle adds another decision. Does the patient understand the difference? Does it matter to them?
- "Score" as a label is vague — score of what? Compared to what?
- "Powerups" as a category name is gamification vocabulary that contradicts the invisible motivation principle. It's the kind of word a healthy 30-year-old designer uses, not language a 68-year-old cancer patient relates to.

**Proposed iteration:**
- Replace the donut chart with something immediately readable. Options:
  - **Three simple progress bars** stacked vertically, each labeled plainly: "Light sessions: 4 of 7 days", "Sleep logged: 4 of 7 days", "Daily check-ins: 4 of 7 days" — no percentages, no color matching needed.
  - Or a **single, clear number** — "This week: 6 of 7 sessions completed" — since session completion is the metric that actually matters for treatment adherence.
- Rename "Powerups" to something grounded. Based on the app context, this likely maps to daily questionnaires or check-ins. Call them what they are: "Check-ins" or "Daily questions."
- Remove or simplify the Latest/All time toggle. For a 2-3 week treatment, "All time" is barely different from "Latest." If the toggle stays, label it more clearly: "This week" / "All weeks."

---

### 3. Session Quality Chart

**Issue:** The bar chart with weekday labels is abstract and doesn't clearly communicate what "80%" means or what the patient should do with this information.

**Specific concerns:**
- "Session quality" is ambiguous. Quality of what? Did I sit correctly? Was the light bright enough? Did I watch long enough?
- The 80% number is large and prominent but unexplained. Is 80% good? Bad? What's the target?
- The small bar chart with T/W/Th/F/S/Su/M labels has very thin bars and tiny text.
- For a patient whose primary job is "show up and sit in front of the light," this level of analytics may create anxiety rather than confidence.

**Proposed iteration:**
- Reframe entirely around what the patient can control and understand. Instead of "Session quality: 80%," try: **"Today's session: Ready"** (pre-session) or **"Today's session: Complete — 45 minutes"** (post-session).
- If session quality data is clinically important to show, use plain language: "6 of 7 sessions were full length this week." A patient understands that. They don't understand what makes a bar taller than another bar.
- Consider whether this card needs to exist at all in the patient view. Session quality may be more useful in a clinician dashboard. For the patient, the calendar checkmarks already tell the story.

---

### 4. Navigation & Sidebar

**Issue:** The left sidebar is clean but has some concerns for older adults.

**Specific concerns:**
- "Apps" as a navigation label is generic and potentially confusing. Apps inside an app? What apps?
- The sidebar icons (heart, play button, question mark) are small. Touch targets may be adequate but the visual weight is low.
- The sidebar/main content split works well on iPad landscape but the sidebar takes up significant horizontal space.

**Proposed iteration:**
- Rename "Apps" to what it actually contains — likely "Content" or "Watch" (for Netflix/TikTok during sessions). Use language that maps to the patient's mental model.
- Increase icon sizes in the sidebar by ~20%.
- "Help" is well-placed. Consider adding a phone number or "Call support" option directly visible (not buried inside Help) — older patients often prefer calling over troubleshooting in-app.

---

### 5. The Calendar Timeline

**Issue:** Mostly excellent, but a few refinements.

**Specific concerns:**
- Showing 13 days horizontally means each circle is relatively small. On some iPad screen sizes, the rightmost days might feel cramped.
- "Day 07" with the blue outline (current day, incomplete) vs. "Day 09" with a blue underline — the visual distinction between "today" and "next scheduled" might be unclear.
- Future days (Day 08 onwards) show as gray outlines. The patient might wonder: "Are those days I failed? Or days that haven't happened yet?"

**Proposed iteration:**
- Show fewer days at once (7-day rolling window) and make each circle larger. A patient in a 14-day treatment doesn't need to see all 14 days simultaneously — they need to see "where am I right now."
- Make the "today" indicator unmistakable — a filled background color, a "Today" label above it, or both.
- Future days: use a clearly different visual treatment from missed days. A dotted outline for "upcoming" vs. empty/red for "missed" removes ambiguity.
- Consider showing the current day's date prominently: **"Day 7 of 14 — Monday, March 2"** as a header, making the timeline a supporting element rather than the primary orientation tool.

---

### 6. Language & Tone

**Issue:** Several terms throughout the screen lean toward tech/wellness vocabulary rather than plain medical language.

**Specific items:**
- "Powerups" — remove entirely, as discussed above
- "Score" — too gamified for the conservative approach; replace with "Progress" or "This week"
- "Session quality" — too abstract; reframe around completion
- "Light sessions" as a section header — good, clear, keep it
- "Start session" — good, clear, keep it
- "My health" — appropriate for the overall section

**Proposed language principles for 60+:**
- Use the words patients already use with their doctors: "sessions," "treatment," "days," "complete"
- Avoid percentages where possible — use "X of Y" framing instead (easier to understand)
- No jargon, no app-culture vocabulary, no metaphors that require explanation

---

### 7. Touch Targets & Interaction

**Specific concerns:**
- The "Latest / All time" toggle buttons appear small (likely under 44pt minimum recommended by Apple's HIG for accessibility)
- The logged session rows have chevrons suggesting they're tappable, but the tap target height should be verified at 48pt minimum
- "See all" as a text link is easy to miss — consider making it a full-width button or at least increasing its tap target

**Proposed iteration:**
- All interactive elements: minimum 48x48pt touch targets (exceeding Apple's 44pt guideline, appropriate for this audience)
- "See all" → make it a button with visible borders, not just a text link
- If toggle controls are kept, make them visibly larger segmented controls

---

### 8. Contrast & Color

**Issue:** The design mostly uses blue on white which is good contrast, but some elements are borderline.

**Specific concerns:**
- The green ring in the donut chart and green dots in the legend may be difficult for patients with color vision deficiency (8% of men)
- Gray text for future calendar days may be too low contrast
- The thin blue bars in the session quality chart may not have sufficient contrast against the white background

**Proposed iteration:**
- Don't rely on color alone to convey information — pair every color with a label, pattern, or position
- Verify all text meets WCAG AAA contrast (7:1) not just AA — this audience warrants the higher standard
- Future calendar days: use a medium gray, not a light gray

---

## Summary of proposed changes, ranked by impact

1. **Replace the donut chart** with plain-language progress bars or a single completion number — highest cognitive load reduction
2. **Reframe "Session quality"** around completion rather than abstract percentages — removes anxiety
3. **Increase all text to 16pt minimum** — immediate readability improvement
4. **Rename "Powerups," "Score," "Session quality"** to plain patient language — aligns with both the 60+ audience and the invisible gamification principle
5. **Show a 7-day rolling calendar** with larger circles and a clear "Today" marker — reduces visual clutter, improves orientation
6. **Increase all touch targets to 48pt minimum** — reduces mis-taps
7. **Meet WCAG AAA contrast** throughout — appropriate for this patient population
8. **Rename "Apps" in navigation** to match patient mental model

---

*These iterations preserve the essence of the design — the clean white space, the blue accent system, the calm tone, the checkmark-driven progress visualization — while making every element immediately usable for a tired older patient navigating treatment.*
