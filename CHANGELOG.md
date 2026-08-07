# Changelog

All notable changes to Tally. Format based on Keep a Changelog. This project does not use semantic versioning; entries are grouped by batch.

## [Unreleased]

### Added

- Building pack: `CLAUDE.md`, `DISCOVERY.md`, `DECISIONS.md`, `BATCH_PLAN.md`, `SESSION_LOG.md`, `CHANGELOG.md`.
- `SPEC.md`, renamed from `04-tally.md`.

- The Tally waitlist page, complete and built to `SPEC.md`. Batch B1.
  - Next.js App Router scaffold on Next 16.3.0, React 19.2.8, Tailwind v4, TypeScript. `framer-motion` pinned at 13.0.0 as the only added dependency.
  - Design system: the seven colour tokens, the CSS graph paper ground, Fraunces (variable, optical size axis at 120), Inter, and IBM Plex Mono via `next/font`.
  - The ticking headline word. `story`, `pattern`, `cost`, `edge` on a 2.4 second cycle, with the mono glyph alternating green up and red down. Server renders `story` with the green glyph and hydrates into the cycle. Zero layout shift.
  - Waitlist form: labelled email input, ink button, client side validation, success state, and a comment marking where an ESP would be wired.
  - Page load entrance: eyebrow, H1, sub, and card fade and rise 14px on a 0.07 stagger. Disabled under reduced motion, in CSS as well as in the hook.
  - Footer concept credit line, linked to isaac.aperio.finance/landing.
  - GA4 with the `G-XXXXXXXXXX` placeholder, `cta_click` and `waitlist_signup` events, Meta Pixel left commented.
  - Vector `t.` favicon. No raster images anywhere.
  - `tests/tally.spec.ts`, the thirteen assertion Playwright behavioral check.

### Changed

- Batch B2. The GA4 Measurement ID is now the real `G-0QXCCQYR17`, replacing the `G-XXXXXXXXXX` placeholder. Deployed to <https://landing-04-tally.vercel.app/>.

### Notes

- The restraint rule (no additions beyond the spec) is recorded as binding decision D-02 and held: no features grid, no social proof, no FAQ, no second CTA.
- D-08 resolved: `next/font` rejects an `axes` option alongside an explicit weight list, so Fraunces loads as a variable font. The optical size axis is kept, set to 120 on the display class.
- D-09 revised: the trailing period moved inside the animated span. Outside it, the fixed width reservation stranded the period to the right of shorter words.
