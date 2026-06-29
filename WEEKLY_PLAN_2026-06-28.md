# SteamWise Weekly Plan — 2026-06-28

## Goal
Bring SteamWise closer to the benchmark gap with two high-value improvements that fit a single session and can be fully tested.

## Selected scope
1. **Degree of superheat output**
   - Show explicit superheat in the Steam Table result view when the state is superheated.
   - Keep the UI bilingual and non-intrusive.

2. **Pipe pressure drop estimate**
   - Add a practical Darcy-Weisbach pressure-drop estimate to the Pipe tab.
   - Include Reynolds number, flow regime, friction factor, and pressure-loss per length.
   - Keep the current velocity-based sizing workflow intact.

## Constraints
- No paid APIs or new services.
- No login, paywall, analytics, or hosting changes.
- Keep dark/light theme, bilingual UI, and current functionality working.
- Only touch SteamWise project files that are necessary.

## Verification gates
- Add/adjust unit tests for new calculations.
- Run `npm test`.
- Run `npm run build`.
- Browser-check the live site for visible result changes.
- Only deploy if the review pass is clean.

## Notes
- The pressure-drop feature should be a useful engineering estimate, not a claim of final piping design compliance.
- Keep warnings explicit that final design must be verified against project code/class and official references.
