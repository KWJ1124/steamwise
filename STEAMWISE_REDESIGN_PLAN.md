# SteamWise Redesign Plan — Plant Engineer Workflow

Date: 2026-06-27
Owner: MES
Status: active local redesign, not yet deployed

## User intent
SteamWise should not be one overloaded page. A plant engineer opens the tool for a specific job:

1. Steam Table
2. Pipe / Velocity / Pipe design reference
3. Unit Converter
4. Heat Exchanger

Each screen must show only the necessary workflow, with detailed usage/reference/table content behind separate clicks or subtabs.

## Immediate defects to fix

### Decimal input
- Pressure, temperature, quality, and other numeric fields must allow decimal typing.
- Input should preserve transient strings such as `1.`, `0.`, `0.1234`, `-0.5` while typing.
- Leading zero cleanup must not destroy valid decimals.
- Recommended rule: keep input text state separate from parsed numeric state; parse only when valid numeric text exists.
- Allow at least 4 decimal places naturally; do not force rounding in input fields.

### Desktop tab visibility
- Functional navigation must be visually obvious on desktop.
- Active function screen should be unmistakable.

## Steam Table screen

### Layout
Desktop:
- Left: Steam Table Input
- Center top: compact Calculated Result
- Right: T-s diagram
- Right/bottom: Recent searches

Mobile:
- Focused vertical sections.
- Consider swipeable or bottom tabs later for app release.

### Calculated Result
- Do not let result card dominate.
- Show core cards only: P, T, h, s, x/region.
- Put density/internal energy/specific volume under details if needed.

### Recent searches
- Show recent states with P / T / h / region.
- Click restores the saved state/input pair.
- Pin point remains small in top-right.

### Help / Reference
- Separate collapsible panel or secondary tab:
  - Usage
  - Input pair rules
  - Saturation/quality warning
  - IF97 reference/disclaimer

## Pipe screen

### Current safe boundary
Current data is geometry/velocity quick reference, not final pipe design.

### Geometry table
- Show more rows and make table usable, not tiny.
- Separate table view from calculator view.
- Allow code-specific browsing.
- SCH availability should be code/size dependent. Do not imply every size starts from SCH 10.

### Pipe design roadmap
Do not present safety/rating as final until data model is ready.
Needed model:
- Design code: ASME B31.1 / B31.3
- Material: e.g. SA-106 Gr.B, A312 TP316L
- Design pressure
- Design temperature
- Allowable stress by temperature
- Corrosion allowance
- Joint/weld efficiency
- Mill tolerance
- Minimum required thickness
- MAWP / pass-fail / warnings

### UI guardrail
Use clear wording:
- Dimension / velocity reference
- Code design check coming later
- Final design requires official code/project piping class verification

## Heat Exchanger screen

### Plant engineer workflow
Use a simple exchanger diagram:
- Hot side in/out
- Cold side in/out
- Optional Hot primary/secondary and Cold primary/secondary labels

### Input logic
- User enters available values.
- Required conditions completion turns Calculate button active.
- Missing calculated value is highlighted in a different color.
- Changing one value updates dependent result.

### Calculation modes
MVP:
1. Enthalpy balance
   - Q = m_dot * (h_out - h_in)
   - solve missing flow or outlet enthalpy
2. Cp sensible exchanger
   - Q = m_dot * Cp * ΔT
   - effectiveness ε = Q_actual / Q_max
3. Steam-specific helper later
   - use Steam Table/IF97 to convert P/T/x/h into enthalpy
   - warn when P+T on saturation line is not unique

### Common plant question
“How much steam flow is required?”
- Need duty and steam inlet/outlet enthalpy, or pressure/temperature/quality assumptions sufficient to derive enthalpy.
- P/T/flow alone is not always enough in saturation/two-phase regions.

## Implementation phases

### Phase 1 — input and layout correctness
- Fix decimal input state.
- Make functional tabs visible.
- Steam Table default screen with compact result + right T-s + recent searches.
- Help/reference separated.

### Phase 2 — pipe reference improvement
- Larger table browsing UI.
- Broader geometry data where practical.
- Explicit design-code boundary.
- Add data interfaces for future material/rating checks without claiming final compliance.

### Phase 3 — heat exchanger MVP
- Diagram-based UI.
- Required-field checklist.
- Calculate button gate.
- Highlight calculated missing value.
- Enthalpy-balance and Cp-effectiveness modes.

### Phase 4 — app/SEO readiness
- Route-based pages: /steam-table, /pipe, /unit-converter, /heat-exchanger.
- Per-page reference content for AdSense/SEO.
- Mobile-first app-like navigation.

## Verification gates
- Unit tests for decimal parsing and heat/pipe calculations.
- `npm test`
- `npm run build`
- Browser local verification for desktop and mobile-width.
- No public Cloudflare deployment without Boss approval.
