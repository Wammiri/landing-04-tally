# SESSION_LOG: Tally

Appended after every session. Never deleted. Newest entry at the bottom.

---

## 2026-08-06. Session 0: pack generation

**Who:** Claude Code, suite level setup session (run from the `landing-suite` root, covering all five projects).

**What landed:**
- `SPEC.md` renamed from `04-tally.md` so the kickoff prompt resolves.
- Building pack created: `CLAUDE.md`, `DISCOVERY.md`, `DECISIONS.md`, `BATCH_PLAN.md`, `SESSION_LOG.md`, `CHANGELOG.md`.
- Weight class set to LIGHT and recorded as decision D-01.
- The restraint rule recorded as D-02 and made binding, since the main risk on this project is helpful additions rather than bugs.
- Git repository initialised, no remote yet.

**Verification:** none applicable. No product code exists yet. Toolchain verified at suite level: Node 22.22.2, npm 10.9.7, git 2.53.0, Vercel CLI 52.0.0 present, GitHub CLI authenticated as `Wammiri`.

**Commits pushed:** none. Repo initialised locally; the remote is a human gate.

**Flags for Isaac:**
1. **Vercel CLI is not logged in.** `vercel whoami` found no credentials. Run `vercel login` in a real terminal before any deploy.
2. **GA4 Measurement ID needed.** Create the property and the data stream for this site, then replace `G-XXXXXXXXXX` in `app/layout.tsx`.
3. **GitHub remote not created.** Create the repo and add the remote, or authorise Claude to run `gh repo create`.
4. **Fraunces optical size axis is uncertain** (D-08). If the variable axis is not available through `next/font`, the build falls back to static weights 500 and 600. Cosmetic only, but it will be noted here when known.

**Parked:** B2 is blocked pending deploy, which is blocked pending Vercel login.

**Next:** Batch B1, using the session prompt at the bottom of `BATCH_PLAN.md`, in a fresh session.

---
