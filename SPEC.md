# SPEC: Tally. The trading journal that writes itself (waitlist)

## 0. What this is

A single screen waitlist page for a fictional product called Tally, an automatic trading journal. One job: collect an email for the launch list. This is the bold minimal statement of the four page set: very few elements, huge type, precision spacing, one witty signature. Concept build for Isaac Olorode's portfolio.

Do not browse the web. Everything needed is in this file. Network use: npm install and the automatic next/font fetch only.

## 1. Setup

```
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
npm i framer-motion
```

No other dependencies. No images in /public except favicon.

## 2. Design system

Identity: a trading journal, literally. The page sits on graph paper. Ink type in a characterful serif display, one green and one red micro accent used the way a P&L uses them.

Palette:
- bg: #F1F4F8 (cool paper)
- grid: #DCE3EC (the graph lines)
- ink: #14171C
- muted: #66707E
- gain: #0E9F6E (green, micro use only)
- loss: #D7382E (red, micro use only)
- card: #FFFFFF

Graph paper background on the body:

```css
background-color: #F1F4F8;
background-image:
  linear-gradient(#DCE3EC 1px, transparent 1px),
  linear-gradient(90deg, #DCE3EC 1px, transparent 1px);
background-size: 32px 32px;
```

Fonts via next/font/google:
- Display: Fraunces, weights 500 and 600, optical size set high via the font axis if available, used at clamp(2.6rem, 7.5vw, 5.2rem)
- Body: Inter, 400 and 500
- Labels and the ticker glyphs: IBM Plex Mono, 500

Layout: everything vertically centered in the viewport on desktop (min-h-screen flex), content max width 720px, left aligned. Generous emptiness is the point; resist adding anything. Radius 10px on the form card.

Forbidden: cream and terracotta palettes, dark mode, gradients, emoji, icon libraries, raster images, decorative animation beyond the two specced, em dashes.

## 3. Signature element: the ticking headline word

H1 (Fraunces): Your trades have a story.
The word "story" is a client component that cycles through ["story", "pattern", "cost", "edge"] every 2.4 seconds. Each swap: the outgoing word slides up 8px and fades, the incoming slides in from below (framer-motion AnimatePresence, mode popLayout). The word is preceded by a small mono glyph that alternates with it: ▲ in `gain` before "story" and "edge", ▼ in `loss` before "pattern" and "cost". Reserve fixed width for the longest word so nothing shifts. Under reduced motion: static "story." with the green ▲.

This is the one memorable thing on the page. Everything else stays still.

## 4. Page structure and copy (verbatim)

A single viewport composition, top to bottom:

1) Wordmark, top left, Fraunces 600: tally. The period in `gain`.

2) The composition, vertically centered:
- Eyebrow (mono, muted, uppercase): LAUNCHING THIS FALL
- H1 with the ticking word (section 3): Your trades have a ▲ story.
- Sub (Inter, muted, max 50ch): Tally is the trading journal that writes itself. Every fill logged, tagged, and turned into the lesson you would have skipped writing down.
- Form card (white, hairline border in grid color, subtle 1px inset feel): one labeled email input and an ink button "Join the waitlist" side by side on desktop, stacked at mobile. On submit: validate, fire GA event, replace card content with: You are on the list. We will write when it is ready. Comment where the ESP would go in production.
- Under the card, one mono line, muted, spaced with two middot separators: AUTO IMPORT · PATTERN TAGS · WEEKLY REVIEW

3) Footer, bottom of viewport, small mono muted: Concept build · Designed and built by Isaac Olorode · isaac.aperio.finance/landing (link) · 2026

That is the entire page. Do not add sections, social proof, features grids, or a second CTA. The restraint is the design.

## 5. Motion spec

Two animations total: the ticking word (section 3) and a single page load entrance where eyebrow, H1, sub, and card fade and rise 14px with a 0.07 stagger. Button hover: background shifts from ink to #22262D. useReducedMotion disables the entrance and freezes the word.

## 6. Analytics

Same suite pattern in app/layout.tsx: GA4 gtag scripts with placeholder G-XXXXXXXXXX, commented Meta Pixel block, lib/track.ts helper.

Events: `cta_click` { location: "waitlist" } on button press; `waitlist_signup` on valid submit.

## 7. Performance and quality floor

- Zero raster images. The graph paper is CSS.
- Lighthouse mobile 97+ is realistic here; this page should be tiny. Ship the minimum client JS: the word ticker and the form are the only client components.
- All text server rendered at first paint except the cycling word, which must render "story" on the server and hydrate into the cycle (no blank flash).
- The grid must sit behind everything and never interfere with text contrast; the form card is solid white on top of it.
- focus-visible ring in ink. Labeled input, autocomplete email. 390px pass with keyboard open.
- Metadata: title "Tally. The trading journal that writes itself", one line description, Open Graph basics.
- No em dashes anywhere.

## 8. Acceptance checklist

- [ ] `npm run build` clean
- [ ] Word cycles with glyph color alternation, zero layout shift, static under reduced motion
- [ ] Graph paper renders at all sizes without moire or seams
- [ ] Form submits to success state, GA events fire
- [ ] Page is a single viewport on desktop, scrolls naturally if content exceeds on small phones
- [ ] Footer concept credit present and linked
- [ ] No raster images, exactly two accent colors used only as specced, no em dashes
