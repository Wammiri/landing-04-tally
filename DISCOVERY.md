# DISCOVERY: Tally

**Mode:** New build from a PRD (`SPEC.md`). The spec is unusually complete, so discovery is a thin pass recording intent, weight class, and open ambiguities. Not a full grill; the spec already answers what a grill would have asked.

**Date:** 2026-08-06

---

## 1. What is being built and why

A single screen waitlist page for a fictional automatic trading journal. The conversion goal is an email for the launch list. This is the **waitlist** pattern in the four pattern portfolio set, and the smallest page of the five.

The real purpose is portfolio evidence, and this page carries a specific and unusual burden: it proves Isaac knows **when to stop**. Three of the four concept pages demonstrate what he can add. This one demonstrates what he can leave out. In a portfolio being reviewed by someone hiring a landing page builder, restraint is a harder signal to fake than ornament.

## 2. The real audience, two layers

- **Fictional:** an active trader who knows they should keep a journal and does not, because journaling is admin and admin loses to the next trade. The promise that converts them is that it writes itself. They are impatient, so a long page would lose them.
- **Real:** the recruiter and the end client. This page takes ten seconds to read, which is exactly the point. It demonstrates confidence: no hedging, no stuffing, one idea presented once.

## 3. Why this pattern, in this suite

Four concept pages, four DR patterns, four visual identities. Tally is the **waitlist** entry and the minimal one.

Its counterparts: Foundations (lead capture, dark market terminal), Cambr (free trial, light and restrained SaaS), Market Clarity Live (webinar registration, hot red poster). Tally is minimal in a different way to Cambr: Cambr is quiet and full, Tally is quiet and nearly empty. The graph paper ground and the characterful Fraunces display are what stop it reading as unfinished.

## 4. Success criteria

- The page fits one viewport on desktop and reads as deliberate rather than unfinished.
- The ticking word is noticed, enjoyed, and causes zero layout shift.
- The server rendered HTML contains `story` with the green glyph, so there is no blank flash on load.
- Lighthouse mobile 97+, which the spec correctly notes is realistic here because the page is tiny.
- GA4 fires `cta_click` and `waitlist_signup`.
- A reviewer's instinct to say "it needs more" is overridden by the page looking intentional.

## 5. Scale assumptions

None that matter. Static page, CDN served, no backend, no database, no per user state. The form posts nowhere; it swaps to a success state client side. Traffic is portfolio traffic.

This is why the weight class is LIGHT. This is also the smallest project in the suite by some distance.

## 6. Failure modes worth designing against

| Failure | Why it matters | Mitigation |
|---|---|---|
| **Additions creeping in** | The single biggest risk on this project. A helpful features grid destroys the entire thesis | The restraint rule is the first substantive section of `CLAUDE.md`, stated as a prohibition list |
| Layout shift from the cycling word | Constantly visible because it happens every 2.4 seconds | Reserve fixed width for the longest word, `pattern`, and verify with repeated bounding box samples |
| Blank flash on hydration | The spec calls this out explicitly | Server render `story` with the green `▲`, hydrate into the cycle |
| Reading as unfinished rather than minimal | The failure state of every minimal design | Fraunces at real display scale, precise vertical centring, the graph paper ground, one perfect form card |
| Graph paper moire or seams | Visible at certain zoom levels and screen densities | 32px grid on 1px lines, verified at several viewport widths and zoom levels |
| Grid interfering with text contrast | Accessibility failure | Grid sits behind everything, form card is solid white on top of it |
| Green and red misread as fake P&L | Honesty rule risk on a trading product | The accents appear only on the two glyphs, never on numbers |

## 7. Data model

There is none. The only data is a single email string held in client state for the duration of a submission, then discarded. Nothing is persisted, transmitted, or stored.

A code comment marks where a real ESP would be wired in production. That comment is the deliverable, not an integration.

**Implication:** no privacy policy, no consent management, no data protection surface beyond GA4 itself. Recorded as a decision, see `DECISIONS.md` D-06.

## 8. Ambiguities the spec leaves open

Resolved with sensible defaults, isolated as one line switches, flagged for Isaac. Full record with confidence and cost in `DECISIONS.md`.

- Fraunces optical size axis. The spec says "set optical size high via the font axis if available". Default: request the axis through `next/font`; if it is unavailable in the Google Fonts variable build, fall back to the static weights 500 and 600 and note it.
- Whether the cycling word keeps its trailing period. Default: the period sits outside the animated span so it never moves.
- Word cycle behavior when the tab is hidden. Default: leave the interval running; the cost is negligible and pausing adds code for no visible benefit.
- Whether the page scrolls on short phones. The spec says it should scroll naturally if content exceeds. Default: `min-h-screen` with natural overflow, not a locked viewport.
- Favicon design. Default: a vector `t.` mark with the period in `gain` green, echoing the wordmark.

## 9. Where this is heading next

Nowhere. Fixed scope, deadline tonight. Not a product with a roadmap.

One downstream dependency, external: once deployed, the production URL and real Lighthouse mobile score go to project `05-isaac-site` for `[TODO_URL_4]` and `[TODO_SCORE_4]`. Tracked in `BATCH_PLAN.md` as an outbound handoff.

## 10. Weight class decision

**LIGHT.** No heavy signal present: one anonymous role, no multi-tenancy, no regulated data, no money, no irreversible actions, no AI with tool use.

Pack files exist because they are cheap and carry the trail. Contents stay thin. On this project in particular, the pack's most useful job is not documenting complexity, it is recording that the simplicity was chosen rather than skipped.
