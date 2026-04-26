# THE WELL LIVED CITIZEN: MASTER SITE SPEC v1.1
**Status**: RECONCILED & LOCKED (Post-Manus/Replit Drift)
**Objective**: Fill the tank for a clean, stable deployment.

---

## 1. BRAND CORE (IDENTITY LOCK)
- **Business Name**: The Well Lived Citizen
- **Founder**: Dayna Brown (Operational Rigor / Luxury Retail Background)
- **Tagline**: "Well Placed. Well Dressed (again). Transitions done Well."
- **Voice**: Professional, Trusted, Direct, Operational. No "Elder Care" mentions. No clinical ADHD talk (personal experience only).

---

## 2. SERVICE ARCHITECTURE (THE FOUR DOORS)

### DOOR 1: THE RESET (Home Organization)
- **Tagline**: "The Last Box"
- **Rate**: $150/hr (3-hour minimum)
- **Flex Blocks**: 
  - 10hr: $1,250
  - 25hr: $3,150
- **Flat Rate**: Move-In Setup: $1,200/day (8 hours)
- **Reject**: Comparisons to gig apps or low-cost competitors.

### DOOR 2: THE RECORD (Legacy Inventory & Storytelling)
- **Tagline**: "The Archives"
- **Rate**: From $3,500 (Project-based)
- **Hourly**: $175/hr (Additional work)
- **Deliverable**: Physical Leather Book with prints and research data.
- **Reject**: "Death/Will" keywords. Use "Major Life Transitions" or "Next Chapter".

### DOOR 3: THE ROUTINE (House Calls)
- **Tagline**: "The Last Detail"
- **Rate**: $175/hr
- **Focus**: Trusted presence, tech setup, continuity gaps.

### DOOR 4: THE RELEASE (Vintage Resale & Consignment)
- **Tagline**: "The Last Look"
- **Commission Split**:
  - Clothing: 55% Me / 45% Client
  - Designer & Furniture: 50% / 50%
- **Reject**: Minimums or photography fees. Payouts by the 5th.

---

## 3. TECHNICAL RECONCILIATION (GIT & DEPLOY)
- **Live Host**: Firebase Hosting (Recommended for Stability)
- **Legacy Repos**: 
  - `well-lived-citizen-main`: DECOMMISSION (High Drift)
  - `site-engine-manus-v2`: EXTRACT LOGIC ONLY (Sitemap Errors)
  - `content-launcher-replit`: SYNC CONTENT ONLY
- **Clean Slate Command**:
  ```bash
  # Prep a clean repository
  git init && git branch -m main
  echo "The Well Lived Citizen: Brand Identity v1.1" > README.md
  # Lock the specs
  cat <<EOF > .brand_guard.json
  {
    "voice": "Operational Rigor",
    "forbidden_keywords": ["Elder Care", "Estate Sale", "Will/Death"],
    "fixed_rates": { "home": 150, "legacy": 175, "house_calls": 175 }
  }
  EOF
  ```

---

## 4. DESIGN LOCK
- **Palette**: Sage/Olive, Navy/Indigo, Warm Taupe, Charcoal.
- **Typography**: Inter (Sans), Space Grotesk (Display), JetBrains Mono (Technical).
- **Layout**: Clean, Architectural, Minimalist. No AI-generated fluff.

---

**Master Handoff Complete.** Fill the tank with this Spec and launch.
