# SteamWise

## Weekly Updates

### 2026-06-29
- Fixed numeric drag-select/delete editing so empty or partial numeric text stays in an in-progress edit state instead of snapping to `0`.
- Fixed Pin/history pressure serialization so display-unit pressure (for example `200 bar(g)`) stays consistent in history display and restore.
- Fixed replace-mode ambiguity: when two checked fields could both pair with a newly clicked field (for example `P+T` then click `h`), SteamWise no longer switches unexpectedly; the user must uncheck explicitly in ambiguous cases.
- Re-verified with `npm run test`, `npm run build`, browser console check, and a mobile-width visual pass.

### 2026-06-28
- Added an explicit **degree of superheat** output in the Steam Table view for superheated states.
- Added a **Darcy-Weisbach pipe pressure-drop estimate** in the Pipe tab, including Reynolds number, flow regime, friction factor, and pressure-loss metrics.
- Kept the existing velocity-based pipe sizing flow intact and added a clear warning that pressure-drop values are quick engineering estimates only.
- Verified with `npm test` and `npm run build`.
