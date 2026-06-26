# SteamWise — Competitor Benchmark Analysis

> **Date:** 2026-06-27
> **Analysis of:** 4 competitor steam/engineering calculator websites
> **Project:** SteamWise (https://steamwise.pages.dev/) — Free water & steam engineering calculator

---

## 1. SimuPipe Steam Tables

**URL:** https://simupipe.com/tools/steam-tables
**Analysis date:** 2026-06-27

### Features

- **Steam Table Calculator** — Saturated & Superheated (IAPWS-IF97)
  - Lookup modes: Saturated by Temperature, Saturated by Pressure, Superheated (P+T)
  - Outputs: Saturated liquid (f) & vapor (g) — Specific volume, Density, Internal energy, Enthalpy, Entropy, Specific heat, Latent heat (h_fg, s_fg)
  - Only **P+T** input pair — no P+h, P+s, T+h, T+s, quality (x) input
  - Full saturated steam tables (by temperature and by pressure) — precomputed reference tables from 0°C to critical point, scrollable
  - Temperature units: °C, °F, K, °R — Pressure units: bar, kPa, MPa, psi, atm
- **Full tool suite** (15+ calculators):
  - Friction Loss Calculator, Valve Cv/Kv Calculator, Reynolds Number Calculator
  - **Pipe Sizing Calculator** — by velocity AND pressure drop constraints
  - Orifice Plate Calculator, Insulation Calculator
  - **Flash Steam Calculator**, Boiler Efficiency Calculator
  - Condensate Load Calculator, Pipe Condensation Calculator
  - Compressed Air Moisture Calculator
  - Unit Converter, Reference Tables
- **Pipe Sizing Calculator (detailed):**
  - Fluids: Water (IAPWS-IF97) — uses real fluid properties
  - Inputs: Flow rate, Temperature, Pipe material (Carbon Steel ASME B36.10), Schedule (40/Std, 80/XS, 160/XXS), Pipe length
  - Constraints: Velocity + Pressure Drop (Both), or either alone
  - Velocity guidelines: Water general (2.5 m/s), Water pump suction (1.2 m/s), Steam (30 m/s), etc.
  - Outputs table: NPS, DN, ID (mm), Velocity, dP, dP/L, Re, Regime, Status (pass/fail)
  - Recommended size highlighted
  - Displays: Units swappable for Velocity, dP, dP/L

### UX

- **Modern, clean design** — Tailwind/Next.js SPA, good typography, dark/light theme toggle
- **Responsive** — mobile-friendly layout, side navigation collapses
- **Fast loading** — client-side calculation, no page reloads
- Language switch: EN/DE
- Sign-in/Get Started → SaaS model (freemium/paywalled features)
- **Steam table not interactive** — static reference tables below calculator (not searchable/filterable client-side beyond the calculator output)

### Gaps vs SteamWise

| Area | SimuPipe | SteamWise |
|------|----------|-----------|
| Property input pairs | Only P+T | P+T, P+h, P+s, P+x, T+h, T+s (6 pairs) |
| Quality (x) input | ❌ | ✅ |
| T-s / P-h diagram | ❌ | ✅ T-s diagram (echarts) |
| Precomputed reference tables | ✅ Full steam tables (big tables) | ❌ No precomputed tables |
| Pipe sizing (pressure drop) | ✅ Full-featured (dP calc, Re, regime) | ✅ Velocity bands only (no dP yet) |
| Flash steam calc | ✅ | ❌ |
| Boiler efficiency | ✅ | ❌ |
| Condensate load calc | ✅ | ❌ |
| Valve Cv/Kv | ✅ | ❌ |
| Orifice plate | ✅ | ❌ |
| Insulation thickness | ✅ | ❌ |
| Friction loss | ✅ | ❌ |
| Compressed air | ✅ | ❌ |
| No. pipe standards | Carbon Steel only (1 material) | 4 pipe standards, 396 size rows |
| Unit categories | Unknown count | 9 categories |
| Bilingual | EN/DE | EN/KO |
| History/save | ❌ (SaaS, login req) | ✅ Local save/restore/delete |
| Commercial model | Freemium (login required for full) | Completely free, no login |

### Good Ideas to Copy

1. **Precomputed saturated steam tables** — SteamWise could add scrollable reference tables below the calculator (good for SEO and quick lookup)
2. **Pipe sizing with pressure drop** — dP calculation + Reynolds number + flow regime detection would make SteamWise pipe calc compete
3. **Flash steam calculator** — common request for steam engineers
4. **Pipe sizing constraint mode** — "Both (Velocity + Pressure Drop)" selector is smart UX
5. **Velocity guideline presets** — drop-down with industry standard velocity limits (water gen, water suction, steam, etc.)

### Weaknesses

1. Only P+T input pair — much less flexible than SteamWise's 6 pairs
2. No thermodynamic diagrams (T-s, P-h)
3. No quality input for wet steam
4. SaaS model requires login for history/saves
5. No inline unit converter (separate page)
6. No bilingual capability beyond EN/DE

---

## 2. TLV Engineering Calculator Suite

**URL:** https://toolbox.tlv.com/global/TI/calculator/
**Analysis date:** 2026-06-27

### Features

- **Massive calculator suite** — 50+ calculations across Steam, Condensate, Water, Air, Gas
- **Steam Calculators (20+):**
  - Pipe Sizing by Pressure Loss, Pipe Sizing by Velocity, Pipe Sizing for Steam Vent
  - Pressure Loss through Piping, Steam Velocity through Piping, Steam Flow Rate through Piping
  - Economical Insulation Thickness
  - Cv & Kvs Values, Steam Flow Rate through Valve/Orifice
  - Condensate Load (from piping start-up, heating liquid continuous/batch, heating air, radiant heat loss, stall point)
  - Improved Steam Dryness (pressure reduction, pressure reduction + condensate separation)
  - Effect of Air Mixed in Steam (temp drop by air %, air % by mixture temp)
  - Steam & Energy Unit Cost, Boiler Efficiency
- **Condensate Recovery:** Economic analysis (open/closed system, heat exchanger, flash steam recovery), Pipe sizing (between equip & trap, by pressure loss/velocity, pump outlet), Flash steam generation
- **Water:** Pipe sizing by pressure loss/velocity, Pressure loss, Velocity, Flow rate, Insulation thickness, Valve Cv/Kvs, Orifice
- **Air:** Pipe sizing, Pressure loss, Velocity, Flow rate, Valve Cv/Kvs, Orifice, Condensate load from compressed air, Saturated humid air table
- **Gas:** Pressure loss through piping
- **Steam Tables (3 calculators):**
  - Saturated Steam Table (by Pressure) — lookup table
  - Saturated Steam Table (by Temperature) — lookup table
  - **Superheated Steam Table** — P+T input only
    - Inputs: Steam Pressure (many units: kPa/MPa/psi/bar abs/gauge, mmHg, kg/cm²), Steam Temperature (°C/°F/K)
    - Shows saturation temp inline
    - Has "Advanced Options" toggle
    - Calculates on button click (server-side)
    - Outputs: Specific volume, Enthalpy, Entropy, Temperature, Degree of superheat
- **Pipe Sizing by Velocity for Steam:**
  - Units: SI, SI(bar), Imperial, MKS
  - Pipe Grade: DIN 2448, JIS-SGP, JIS-STPG Sch40/60/80, ANSI Sch40/80/160
  - Inputs: Steam Pressure (abs/gauge), Steam Flow Rate (kg/h, t/h, lb/h), Max Allowable Velocity, Pipe Length
  - Output: Pipe size recommendation with velocity check
- **Mobile app:** TLV ToolBox for iOS and Android (native apps)
- **Multi-language:** 15+ language variants worldwide

### UX

- **Dated design** — traditional corporate site, blue header, dense navigation
- **Left sidebar navigation** with expandable tree structure — functional but cluttered
- **Server-side calculations** — page reloads/refreshes on "Calculate" button click (slow)
- **Not mobile-optimized** — narrow viewport breaks layout on mobile
- **Ad-heavy** — banner ads, newsletter signup prompts
- **Breadcrumb navigation** — good for deep site traversal
- **Separate page per calculator** — no unified SPA experience
- **Information-dense** — useful for engineers who know what they want, overwhelming for casual users

### Gaps vs SteamWise

| Area | TLV Toolbox | SteamWise |
|------|-------------|-----------|
| Property input pairs | P+T only (superheated), lookup tables (saturated) | 6 input pairs |
| Quality (x) input | ❌ | ✅ |
| T-s / P-h diagram | ❌ | ✅ T-s diagram |
| Pipe sizing | ✅ (by velocity AND pressure loss) | ✅ (by velocity only) |
| Unit converter | ❌ (separate tools) | ✅ (inline, 9 categories) |
| Dark/light theme | ❌ | ✅ |
| Bilingual | 15+ languages (nav/footer only) | EN/KO (full) |
| History/save | ❌ | ✅ Local |
| Mobile responsive | ❌ (not mobile-friendly) | ✅ |
| Flash steam | ✅ | ❌ |
| Boiler efficiency | ✅ | ❌ |
| Condensate load | ✅ (6 types) | ❌ |
| Steam cost calc | ✅ | ❌ |
| Valve Cv/Kvs | ✅ | ❌ |
| Insulation thickness | ✅ | ❌ |
| Air mixed in steam | ✅ | ❌ |
| Mobile native app | ✅ (iOS/Android) | ❌ (PWA only) |
| Calculation speed | Server-side (slow, page reloads) | Client-side (instant) |

### Good Ideas to Copy

1. **Pipe Sizing by Pressure Loss** — separate calculator targeting pressure drop constraint
2. **Condensate Load calculators** (from piping, heating, radiant heat loss) — very practical for steam engineers
3. **Steam & Energy Unit Cost** — practical business tool
4. **Effect of Air Mixed in Steam** — niche but useful
5. **Improved Steam Dryness** calculators — pressure reduction effects
6. **Flash Steam Recovery** — common industrial need
7. **Pipe Grade selection** — multiple international standards (DIN, JIS, ANSI)
8. **Mobile native app** — TLV has dedicated iOS/Android apps (brand presence)

### Weaknesses

1. **Dated UI/UX** — looks like early 2000s corporate site
2. **Not mobile-friendly at all** — major weakness
3. **Server-side calc** — slow page reloads for every calculation
4. **Only P+T input** — no flexible property pairs
5. **No thermodynamic diagrams** — can't visualize cycles
6. **No dark mode / theme options**
7. **Ad-heavy and newsletter-pushy** — user experience suffers
8. **No calculation history** — each calc is stateless
9. **Language is UI only** — calculator labels/units stay in English regardless

---

## 3. SteamTablesOnline.com

**URL:** https://www.steamtablesonline.com/
**Analysis date:** 2026-06-27

### Features

- **Steam97 Web Calculator** — web port of Steam97 Excel Add-In (MegaWatSoft)
  - Desktop-application-style UI with File/Theme/Diagrams/Language/Help/Login menu bar
  - Property input: Selectable pairs (P+T, saturation P, saturation T, etc.)
  - Outputs: Enthalpy, Entropy, Volume, Internal Energy, Quality, and more
  - **P-h diagram** available (static image on homepage; interactive likely in premium)
  - Zoom level settings, Full screen mode
- **Commercial model (3 tiers):**
  - **Basic (FREE):** Online calculator with limited functionality
  - **Regular:** Steam Tables Spreadsheet (Excel add-in)
  - **Premium:** Full Steam97 desktop application + spreadsheet + calculator
- **Other fluids:** CO2 Tables, NH3 Tables, Psychrometrics (separate tools)
- **Formulations:** IAPWS-IF97 (steam), IAPWS-95 (water), ideal gas (for gas tables)

### UX

- **Desktop-app-port-to-web** — menu bar, table layouts, feels like a .NET WinForms app in the browser
- **Very dated design** — table-based layouts, small fonts, gray backgrounds
- **Not mobile-friendly at all** — clearly designed for desktop only
- **ASPNET WebForms** — full page postbacks, slow interaction
- **Registration required** for non-basic features (login wall)
- **Static p-h diagram image** on homepage — not interactive
- **Heavy page** — large DOM (2400+ lines of table elements)

### Gaps vs SteamWise

| Area | SteamTablesOnline | SteamWise |
|------|-------------------|-----------|
| Property input pairs | Some pairs (P+T, sat P, sat T via menu) | 6 pairs |
| Quality (x) input | ✅ (likely in desktop version) | ✅ |
| T-s diagram | ❌ (P-h static image only) | ✅ T-s (echarts, interactive) |
| P-h diagram | ✅ (static image; interactive in premium) | ❌ |
| Pipe sizing | ❌ | ✅ |
| Unit converter | ❌ | ✅ (9 categories) |
| Dark/light theme | ❌ (has "Theme" menu but limited) | ✅ |
| Bilingual | Some language options | EN/KO |
| History/save | ❌ (login-based) | ✅ Local |
| Mobile responsive | ❌ | ✅ |
| Free calculator | ✅ (Basic tier, limited) | ✅ Complete |
| Other fluids | ✅ CO2, NH3, Psychrometrics | ❌ (water/steam only) |
| Excel Add-in | ✅ Steam97 | ❌ |
| Calculation speed | Server-side (ASPNET postback) | Client-side (instant) |
| Desktop app | ✅ Steam97 Desktop | ❌ (PWA) |

### Good Ideas to Copy

1. **P-h diagram** — SteamWise has T-s; adding P-h would be valuable for power cycle engineers
2. **Multiple fluid support** — CO2 and NH3 tables expand audience to refrigeration engineers
3. **Desktop application** — Steam97 is a known brand in power/chemical industry (credibility)
4. **Tabular steam table output** — spreadsheet-style results for easy copy-paste
5. **Theme/settings persistence** — language, zoom level, full-screen mode

### Weaknesses

1. **Very dated web design** — looks like a 2005-era ASP.NET app
2. **Not mobile-friendly** — completely unusable on phones
3. **Login/registration wall** for full features
4. **Server-side postback** — slow, full-page reloads
5. **Complex navigation** — desktop menu bar paradigm doesn't translate well to web
6. **No pipe sizing, no unit converter** — pure steam table tool only
7. **Static p-h diagram image** — not interactive (in free version)
8. **Commercial focus** — heavily pushy toward buying Excel add-in

---

## 4. CheCalc Steam Table

**URL:** https://checalc.com/calc/steam.html
**Analysis date:** 2026-06-27

### Features

- **Steam Table (IAPWS IF-97):**
  - 3 property modes: Pressure & Temperature, Pressure only (saturation), Temperature only (saturation)
  - Inputs: Pressure (bara), Temperature (°C)
  - Outputs: Enthalpy (kJ/kg), Density (kg/m³), Entropy (kJ/kg·K), Saturation Temperature (°C), Superheat (°C), Phase (Steam/Water)
  - Units: bara, °C only (no unit selection)
- **Other calculators on site:**
  - Condensate Flash Calculation
  - Steam Desuperheating Calculation
  - Unit Conversion
  - Gas Volume Conversion
  - Cooling Tower Makeup Water
  - Psychrometric Calculations
- **No pipe sizing calculator** on site
- **No diagrams** (T-s, P-h)
- **No pipe sizing** — not a pipe-focused site

### UX

- **Extremely minimal** — clean, simple, functional
- **Dated but usable** — basic HTML with minimal CSS
- **Desktop-oriented** — not mobile-responsive (but works on mobile due to simplicity)
- **Fast** — simple page with no JS overhead
- **Ads** — Google ads present (iframes detected)
- **Unit system locked** — bara, °C, kJ/kg only (no unit flexibility)
- **No theme/bilingual** options

### Gaps vs SteamWise

| Area | CheCalc | SteamWise |
|------|---------|-----------|
| Property input pairs | P+T, P (sat), T (sat) — 3 modes | 6 pairs |
| Quality (x) input | ❌ | ✅ |
| T-s / P-h diagram | ❌ | ✅ T-s |
| Pipe sizing | ❌ | ✅ |
| Unit converter | ✅ (separate page) | ✅ (inline, 9 categories) |
| Unit flexibility | bara/°C only (locked) | 6+ units per property |
| Dark/light theme | ❌ | ✅ |
| Bilingual | ❌ | EN/KO |
| History/save | ❌ | ✅ |
| Mobile responsive | ❌ (barely usable) | ✅ |
| Condensate flash | ✅ | ❌ |
| Steam desuperheating | ✅ | ❌ |
| Psychrometrics | ✅ | ❌ |
| Pipe standards | ❌ | 4 standards, 396 sizes |
| Output properties | 6 outputs | 6 outputs (same) |
| Phase detection | ✅ (shows "Steam"/"Water") | ✅ (superheated/saturated/wet) |

### Good Ideas to Copy

1. **Condensate Flash Calculation** — simple but practical
2. **Steam Desuperheating Calculation** — useful for process engineers
3. **Phase label** — clearly shows "Steam" vs "Water" phase state
4. **Superheat degree output** — SteamWise could explicitly show degree of superheat
5. **Minimalism** — the site loads instantly with zero bloat

### Weaknesses

1. **Extremely limited** — only P+T mode, no flexible pairs
2. **No quality input** — can't calculate wet steam
3. **Locked units** — bara/°C only
4. **No diagrams** — T-s, P-h all absent
5. **No pipe sizing** — not relevant for piping engineers
6. **No theme options**
7. **Bare minimum UX** — feels unfinished
8. **Ads detract from experience**
9. **No calculation history**

---

## Competitive Landscape Summary

### Feature Matrix

| Feature | SteamWise ✅ | SimuPipe | TLV Toolbox | SteamTablesOnline | CheCalc |
|---------|:-----------:|:--------:|:-----------:|:-----------------:|:-------:|
| **IAPWS-IF97** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **P+T input** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **P+h input** | ✅ | ❌ | ❌ | ? | ❌ |
| **P+s input** | ✅ | ❌ | ❌ | ? | ❌ |
| **P+x input** | ✅ | ❌ | ❌ | ? | ❌ |
| **T+h input** | ✅ | ❌ | ❌ | ? | ❌ |
| **T+s input** | ✅ | ❌ | ❌ | ? | ❌ |
| **Quality input** | ✅ | ❌ | ❌ | ✅(premium?) | ❌ |
| **T-s diagram** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **P-h diagram** | ❌ | ❌ | ❌ | ✅(static/premium) | ❌ |
| **Pipe velocity calc** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Pipe pressure drop** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Multiple pipe stds** | ✅ (4) | ❌ (1) | ✅ (8) | ❌ | ❌ |
| **Inline unit converter** | ✅ (9 cats) | ✅ (sep page) | ❌ | ❌ | ✅ (sep page) |
| **Flash steam** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Condensate load** | ❌ | ✅ | ✅ (6 types) | ❌ | ✅ (flash) |
| **Boiler efficiency** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Valve Cv/Kvs** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Steam cost calc** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Dark/light theme** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Bilingual** | ✅ (EN/KO) | ✅ (EN/DE) | ✅ (15+) | ❌ | ❌ |
| **History/save** | ✅ (local) | ❌ (login) | ❌ | ❌ | ❌ |
| **Mobile responsive** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Free & no login** | ✅ | ❌ (freemium) | ✅ | ❌ (basic) | ✅ |
| **Calculation speed** | Client (instant) | Client (instant) | Server (slow) | Server (slow) | Client (instant) |
| **Desuperheating** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Air-in-steam effect** | ❌ | ❌ | ✅ | ❌ | ❌ |

### What SteamWise Does **BETTER** Than All Competitors

1. **6 property input pairs** — No competitor offers P+h, P+s, P+x, T+h, T+s alongside P+T. This is SteamWise's #1 differentiator.
2. **Interactive T-s diagram** — Only SteamWise has an interactive thermodynamic diagram. SimuPipe, TLV, CheCalc have none; SteamTablesOnline has only a static P-h image.
3. **Quality (x) input** — Only SteamWise and possibly SteamTablesOnline (premium) support wet steam quality input.
4. **Inline unit converter** — Integrated with the steam table, not a separate page.
5. **Bilingual (EN/KO)** — Full interface translation, not just nav labels.
6. **History with save/restore/delete** — Works offline, no login required.
7. **Mobile responsive + dark theme** — Professional-grade UX that no competitor except SimuPipe matches.
8. **Completely free, no login** — Unlike SimuPipe (freemium), SteamTablesOnline (paid tiers), TLV (ad-heavy).
9. **Client-side instant calculation** — No server round-trips like TLV and SteamTablesOnline.

### Critical Gaps Where SteamWise Lags Behind

1. **NO PIPE PRESSURE DROP CALCULATION** ⚠️ — SimuPipe and TLV both offer this. SteamWise pipe calculator only shows velocity bands. Adding dP (Darcy-Weisbach), Reynolds number, and pressure loss would make it competitive.
2. **NO FLASH STEAM CALCULATOR** — Both SimuPipe and TLV offer this. Very common industrial need.
3. **NO CONDENSATE LOAD CALCULATORS** — TLV has 6 types, SimuPipe has 1, CheCalc has flash. This is a major gap.
4. **NO BOILER EFFICIENCY CALCULATOR** — Both SimuPipe and TLV offer this.
5. **NO STEAM DESUPERHEATING** — CheCalc has this basic but useful calc.
6. **NO P-h DIAGRAM** — T-s is great; adding P-h would cover power cycle engineers (steamTablesOnline has it as a selling point).
7. **NO VALVE Cv/Kvs CALCULATION** — SimuPipe and TLV both offer valve sizing.
8. **NO INSULATION THICKNESS CALCULATOR** — SimuPipe and TLV offer this.
9. **NO COMPRESSED AIR / AIR SYSTEM CALCULATORS** — TLV's air section is comprehensive.
10. **NO PRE-COMPUTED REFERENCE STEAM TABLES** — SimuPipe's scrollable reference tables below the calculator are good for SEO and quick lookup without interaction.
11. **NO STEAM/ENERGY UNIT COST CALCULATOR** — TLV offers practical cost estimation tools.
12. **NO MULTI-FLUID SUPPORT** — SteamTablesOnline offers CO2 and NH3 tables alongside steam.
13. **NO DEGREE OF SUPERHEAT OUTPUT** — CheCalc shows explicit superheat degrees; SteamWise could add this as a derived output.

### Recommendations for SteamWise Roadmap

#### Tier 1 — Quick Wins (low effort, high impact)
1. **Add "Degree of Superheat" to steam table outputs**
2. **Add precomputed saturated steam reference tables** below the calculator (SEO + quick lookup)
3. **Add explicit phase label** (e.g., "Superheated Steam", "Saturated", "Compressed Liquid")
4. **Improve pipe velocity calculator: add Reynolds number + flow regime column**
5. **Add P-h diagram** alongside T-s (reuse echarts)

#### Tier 2 — Feature Parity (medium effort)
6. **Pipe pressure drop calculation** — Darcy-Weisbach inside pipe calculator (major gap)
7. **Flash steam calculator** — very common request
8. **Steam desuperheating calculator** — simple mass/energy balance
9. **Condensate load calculator** — from piping, heating, radiant loss
10. **Boiler efficiency calculator** — direct/indirect method

#### Tier 3 — Competitive Moats (higher effort, differentiation)
11. **Valve Cv/Kvs sizing** — comprehensive calculator
12. **Insulation thickness / heat loss calculator**
13. **Steam cost / energy unit cost calculator**
14. **Multiple fluid support** — CO2 tables expand audience to refrigeration/HVAC
15. **Pipe sizing by pressure loss** — separate tool mode (like SimuPipe)
16. **Export results as CSV/PDF** — for professional reporting
17. **P-h diagram annotation** — plot user's state point on P-h diagram
18. **Mobile PWA install prompt** — make SteamWise installable (already PWA-capable)

---

*Analysis prepared by automated benchmarking — data captured from live sites on 2026-06-27.*
