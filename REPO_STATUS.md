# REPO STATUS — Well Lived Citizen Fleet

**Compiled**: 2026-05-11
**By**: Claude (session scoped to `dbrownla5/dashboard-` only)
**Status**: PARTIAL — see "Operator handoff" at bottom. Of the 24 repos in
scope, only 1 (Dashboard-) was directly inspectable in this session. The
other 23 are recommended classifications based on naming conventions and
prior-session context; **all need operator confirmation** before any
ARCHIVE action is taken.

---

## Legend

- **KEEP** — active workstream, do not touch
- **ARCHIVE** — superseded, complete, or retired; safe to move out of active set
- **INVESTIGATE** — name unclear or status unknown; needs operator triage

---

## Status table — 7 directly named repos

| # | Repo | Status | Workstream (if KEEP) | Evidence / Reasoning |
|---|---|---|---|---|
| 1 | `dbrownla5/Dashboard-` | **KEEP** | Creative Co-Pilot / Sounding Board Engine (TWLC internal tool) | Inspected. Active `src/App.tsx` is the Creative Co-Pilot. `outputs/manus_build_directive.md` is marked PRODUCTION READY. Branch `claude/extract-copy-consolidate-K17g3` open. |
| 2 | `team-project-build` | **KEEP** | Voice canon source-of-truth (`claude/extract-repo-copy-SIlf7/COPY.md`) | Stated by Dayna as the canon. Could not access from this session. |
| 3 | `well-lived-citizen-site` | **KEEP** (probable) | TWLC marketing site v? | Name matches active business domain. Confirm whether this or repo #4 is the live site. |
| 4 | `the-well-lived-citizen-rebuild` | **INVESTIGATE** | (likely TWLC marketing site, current build) | "rebuild" suggests it supersedes #3. Operator: confirm which one is live on `TheWellLivedCitizen.com` — KEEP the live one, ARCHIVE the other. |
| 5 | `Well_Livedv5.1` | **INVESTIGATE** | (likely TWLC app/site, version 5.1) | Versioned name suggests one of several iterations. If superseded by #4, **ARCHIVE**. |
| 6 | `Resell-Google-App-v5.3.2026` | **KEEP** (probable) | DOOR 4 — Resale automation (Etsy/Chairish/Poshmark crosslisting; Nifty replacement candidate) | Latest 2026-stamped version. Aligns with Roadmap pillar #4 (Automated Resale Suite). |
| 7 | `Propertyv050826` | **INVESTIGATE** | (unclear — not in known TWLC workstreams) | "Property" + date-stamp `050826`. Could be a real-estate / listing prototype, or a one-off. Operator: confirm relevance. Default recommendation: **ARCHIVE** unless tied to House Calls / legacy services. |

---

## Status table — 17 unnamed repos (placeholders)

The task references 24 total repos. The 7 above are named. The remaining
17 were not enumerated in this session and `gh repo list` is not
available (GitHub MCP scope is `dbrownla5/dashboard-` only). Each row
below is a placeholder for the operator to fill.

| # | Repo | Status | Workstream | Notes |
|---|---|---|---|---|
| 8 | [PASTE] | INVESTIGATE | — | — |
| 9 | [PASTE] | INVESTIGATE | — | — |
| 10 | [PASTE] | INVESTIGATE | — | — |
| 11 | [PASTE] | INVESTIGATE | — | — |
| 12 | [PASTE] | INVESTIGATE | — | — |
| 13 | [PASTE] | INVESTIGATE | — | — |
| 14 | [PASTE] | INVESTIGATE | — | — |
| 15 | [PASTE] | INVESTIGATE | — | — |
| 16 | [PASTE] | INVESTIGATE | — | — |
| 17 | [PASTE] | INVESTIGATE | — | — |
| 18 | [PASTE] | INVESTIGATE | — | — |
| 19 | [PASTE] | INVESTIGATE | — | — |
| 20 | [PASTE] | INVESTIGATE | — | — |
| 21 | [PASTE] | INVESTIGATE | — | — |
| 22 | [PASTE] | INVESTIGATE | — | — |
| 23 | [PASTE] | INVESTIGATE | — | — |
| 24 | [PASTE] | INVESTIGATE | — | — |

---

## Known retired / killed (from `outputs/session_summary.md` Decision Lock)

These names appear in canon and should be **ARCHIVE** if they exist as
repos under the GitHub account:

- `@velvetnomad` (brand name retired)
- Kulu (project complete)
- Vern (project complete)
- Replit app (killed, not using)
- Grailed integration (killed)
- Depop integration (banned)

---

## Workstream → KEEP-repo map (clean view)

| Workstream | Owning repo(s) |
|---|---|
| **Voice canon (source-of-truth)** | `team-project-build` |
| **Creative Co-Pilot / Sounding Board engine** (internal tool) | `Dashboard-` |
| **TWLC marketing site** (live) | one of: `well-lived-citizen-site` / `the-well-lived-citizen-rebuild` — operator to confirm |
| **DOOR 4: Resale automation** (Nifty replacement) | `Resell-Google-App-v5.3.2026` |
| **DOOR 1–3 deliverables** (Reset / Record / Routine) | currently lives inside `Dashboard-` Master Roadmap; no dedicated repo yet |
| **CRM (Nifty replacement)** | not yet built — Roadmap pillar #3 |
| **CMS (zero-code site updates)** | not yet built — Roadmap pillar #2 |

---

## Operator handoff (execute these, then re-run me)

This session could not reach beyond `dbrownla5/dashboard-`. To finish the
full extraction the user asked for, the operator (Dayna or a session
with broader scope) needs to:

1. **Grant or run with full repo scope** (e.g., `read:org`, `repo`) so a
   single agent can hit all 24 repos.
2. **Ingest `team-project-build:claude/extract-repo-copy-SIlf7/COPY.md`**
   into the next session's context. That file is the voice-canon
   source-of-truth; the `COPY.md` in this repo is a local extract and
   must be reconciled against it.
3. **For each of repos #3–7 above** (`well-lived-citizen-site`,
   `the-well-lived-citizen-rebuild`, `Well_Livedv5.1`,
   `Resell-Google-App-v5.3.2026`, `Propertyv050826`):
   - Create branch `claude/extract-repo-copy-<5-char-suffix>` from default
   - Run the same extraction (apply the §0–§4 schema from this repo's
     `COPY.md` as the template)
   - Commit `COPY.md` at repo root
   - Open a **draft PR** titled
     `chore(copy): extract markdown copy canon — <repo>` into the
     default branch
4. **Enumerate the remaining 17 repos** (e.g., `gh repo list dbrownla5
   --limit 40 --json name,description,updatedAt,isArchived,defaultBranchRef`)
   and paste names into rows #8–24 above.
5. **Confirm site-rebuild question**: which of #3 vs #4 is live on
   `TheWellLivedCitizen.com`. The other becomes ARCHIVE.
6. **Confirm `Propertyv050826` relevance**. If it isn't tied to House
   Calls, Legacy, or any active workstream → ARCHIVE.

### Recommended command (run on a machine with full `gh` auth)

```bash
gh repo list dbrownla5 --limit 100 \
  --json name,description,updatedAt,isArchived,defaultBranchRef,visibility \
  | jq -r '.[] | [.name, (.updatedAt|split("T")[0]), .isArchived, .defaultBranchRef.name, .description] | @tsv' \
  | column -t -s $'\t'
```

Paste the output here, and the next session can finalize the table
without re-deriving.
