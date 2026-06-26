import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as echarts from 'echarts';
import {
  format,
  getCheckedSteamFields,
  pressureFromMPa,
  regionLabel,
  regionTone,
  selectedFieldsToPair,
  solveSteam,
  tempFromK,
  type EnthalpyUnit,
  type PressureUnit,
  type SteamFieldChecks,
  type SteamInputs,
  type SteamTableField,
  type TemperatureUnit
} from './calculators/steam';
import {
  PIPE_SIZES,
  calculateVelocity,
  findPipeSize,
  getPipeSchedules,
  getPipeSizes,
  getPipeStandards,
  type FlowUnit,
  type PipeSizeRow,
  type PipeStandard
} from './calculators/pipe';
import { UNIT_GROUPS, convertUnit, normalizeNumericText, type UnitCategory } from './calculators/units';
import './styles.css';

const pressureUnits: PressureUnit[] = ['MPa', 'kPa', 'bar(a)', 'bar(g)', 'kgf/cm²', 'psi'];
const tempUnits: TemperatureUnit[] = ['°C', 'K', '°F'];
const hUnits: EnthalpyUnit[] = ['kJ/kg', 'kcal/kg', 'BTU/lb'];
const tableFields: SteamTableField[] = ['pressure', 'temperature', 'enthalpy', 'entropy', 'quality', 'specificVolume'];

type Lang = 'ko' | 'en';
type Theme = 'light' | 'dark';
type TabKey = 'steam' | 'pipe';
type RecordItem = { id: string; label: string; p: number; t: number; h: number; s: number; v: number; x: number | null; region: string };

const copy = {
  ko: {
    tagline: 'IAPWS-IF97 · SteamWise',
    steam: 'Steam Table', pipe: 'Pipe / Velocity',
    mini: 'Mini', full: 'Full', pin: 'Pin', clear: 'Clear', language: 'English',
    steamInput: '입력', chart: 'T-s 선도', history: '기록',
    pipeTitle: 'Pipe Size & Velocity',
    help: '사용법 / 더보기', table: '배관표',
    selectedPair: '입력쌍', saturated: '포화선 감지', usePx: 'P+x로 전환',
    pipeHelp: '코드 → DN/NPS → 스케줄 순서로 선택. 모든 주요 코드(ASME/JIS/DIN/KS)를 포함한 종합 배관 데이터입니다. 최종 설계는 최신 공식 표준과 프로젝트 piping class로 확인하세요.',
    steamHelp: '상태량 2개를 체크하세요. P+T, P+h, P+s, P+x, T+h, T+s 지원. 체크 안 한 필드는 IF97 계산값입니다.',
    unitLabel: '단위 변환',
    disclaimer: '⚠ Engineering reference only. All values are quick-check estimates. Final design requires verification against latest official standards, vendor documentation, and project-specific piping/equipment class. No liability assumed.'
  },
  en: {
    tagline: 'IAPWS-IF97 · SteamWise',
    steam: 'Steam Table', pipe: 'Pipe / Velocity',
    mini: 'Mini', full: 'Full', pin: 'Pin', clear: 'Clear', language: '한국어',
    steamInput: 'Input', chart: 'T-s Diagram', history: 'History',
    pipeTitle: 'Pipe Size & Velocity',
    help: 'How to use / more', table: 'Pipe table',
    selectedPair: 'Pair', saturated: 'Saturation detected', usePx: 'Use P+x',
    pipeHelp: 'Select code → DN/NPS → schedule. Covers all major codes (ASME/JIS/DIN/KS) with comprehensive size data. Verify final design against official standards and project piping class.',
    steamHelp: 'Check two independent properties. Supported pairs: P+T, P+h, P+s, P+x, T+h, T+s. Unchecked fields are IF97 calculated results.',
    unitLabel: 'Unit converter',
    disclaimer: '⚠ Engineering reference only. All values are quick-check estimates. Final design requires verification against latest official standards, vendor documentation, and project-specific piping/equipment class. No liability assumed.'
  }
};

const fieldLabels: Record<SteamTableField, { symbol: string; ko: string; en: string; checkable: boolean }> = {
  pressure: { symbol: 'P', ko: '압력', en: 'Pressure', checkable: true },
  temperature: { symbol: 'T', ko: '온도', en: 'Temperature', checkable: true },
  enthalpy: { symbol: 'h', ko: '엔탈피', en: 'Enthalpy', checkable: true },
  entropy: { symbol: 's', ko: '엔트로피', en: 'Entropy', checkable: true },
  quality: { symbol: 'x', ko: '건도', en: 'Quality', checkable: true },
  specificVolume: { symbol: 'v', ko: '비체적', en: 'Specific volume', checkable: false }
};

function SteamChart({ records, current, theme }: { records: RecordItem[]; current?: RecordItem; theme: Theme }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, undefined, { renderer: 'svg' });
    const dome = [[0.6, 20], [1.2, 80], [2.1, 140], [3.2, 200], [4.4, 260], [5.2, 320], [4.8, 374], [6.8, 320], [7.5, 260], [7.2, 200], [6.7, 140], [6.0, 80], [5.1, 20]];
    const pts = [...records.slice(-8), ...(current ? [current] : [])];
    const isDark = theme === 'dark';
    chart.setOption({
      grid: { left: 40, right: 12, top: 16, bottom: 32 },
      tooltip: { trigger: 'item' },
      xAxis: { name: 's kJ/kg·K', type: 'value', min: 0, max: 9, nameTextStyle: { color: isDark ? '#8896a9' : '#526174', fontSize: 10 }, axisLabel: { color: isDark ? '#6b7a8e' : '#667789', fontSize: 10 }, splitLine: { lineStyle: { color: isDark ? '#2a3649' : '#e7edf3' } } },
      yAxis: { name: 'T °C', type: 'value', min: 0, max: 650, nameTextStyle: { color: isDark ? '#8896a9' : '#526174', fontSize: 10 }, axisLabel: { color: isDark ? '#6b7a8e' : '#667789', fontSize: 10 }, splitLine: { lineStyle: { color: isDark ? '#2a3649' : '#e7edf3' } } },
      series: [
        { name: 'Saturation dome', type: 'line', data: dome, smooth: true, symbol: 'none', lineStyle: { color: isDark ? '#3a7a9a' : '#7aa7c7', width: 1.5 }, areaStyle: { color: isDark ? 'rgba(58, 122, 154, .10)' : 'rgba(125, 211, 252, .08)' } },
        { name: 'State', type: 'scatter', symbolSize: 11, data: pts.map((r) => [r.s, r.t, r.label]), itemStyle: { color: isDark ? '#14c5b4' : '#0f766e' } }
      ]
    });
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); chart.dispose(); };
  }, [records, current, theme]);
  return <div ref={ref} className="chart" />;
}

function App() {
  const [lang, setLang] = useState<Lang>('en');
  const t = copy[lang];
  const [activeTab, setActiveTab] = useState<TabKey>('steam');
  const [mini, setMini] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (typeof localStorage !== 'undefined' ? (localStorage.getItem('steamwise-theme') as Theme || 'light') : 'light'));
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('steamwise-theme', theme); }, [theme]);

  // Steam Table
  const [checks, setChecks] = useState<SteamFieldChecks>({ pressure: true, temperature: true, enthalpy: false, entropy: false, quality: false, specificVolume: false });
  const checkedFields = getCheckedSteamFields(checks).filter((field) => field !== 'specificVolume');
  const selectedPair = selectedFieldsToPair(checkedFields);
  const [inputs, setInputs] = useState<SteamInputs>({ pair: 'PT', pressure: 1, pressureUnit: 'MPa', temperature: 250, temperatureUnit: '°C', enthalpy: 2900, enthalpyUnit: 'kJ/kg', entropy: 6.5, quality: 0.5 });
  const steamInputs = useMemo(() => ({ ...inputs, pair: selectedPair ?? inputs.pair }), [inputs, selectedPair]);
  const result = useMemo(() => selectedPair ? solveSteam(steamInputs) : { error: 'Choose two compatible input fields.', saturation: { ambiguous: false as const, resolution: 'single-phase' as const }, warnings: [] }, [steamInputs, selectedPair]);
  const state = result.state;
  const current: RecordItem | undefined = state ? { id: 'current', label: `${selectedPair} current`, p: state.pressure, t: tempFromK(state.temperature, '°C'), h: state.enthalpy, s: state.entropy, v: state.specificVolume, x: state.quality, region: regionLabel(state) } : undefined;
  const [records, setRecords] = useState<RecordItem[]>([]);
  function restoreRecord(r: RecordItem) {
    if (r.x !== null && r.x >= 0 && r.x <= 1) {
      setInputs({ pair: 'Px', pressure: Math.round(r.p * 1e6) / 1e6, pressureUnit: 'MPa', temperature: r.t, temperatureUnit: '°C', enthalpy: Math.round(r.h), enthalpyUnit: 'kJ/kg', entropy: r.s, quality: r.x ?? 0.5 });
      setChecks({ pressure: true, temperature: false, enthalpy: false, entropy: false, quality: true, specificVolume: false });
    } else {
      setInputs({ pair: 'PT', pressure: Math.round(r.p * 1e6) / 1e6, pressureUnit: 'MPa', temperature: r.t, temperatureUnit: '°C', enthalpy: Math.round(r.h), enthalpyUnit: 'kJ/kg', entropy: r.s, quality: r.x ?? 0.5 });
      setChecks({ pressure: true, temperature: true, enthalpy: false, entropy: false, quality: false, specificVolume: false });
    }
  }
  function deleteRecord(id: string) { setRecords((prev) => prev.filter((r) => r.id !== id)); }

  // Pipe
  const standards = getPipeStandards();
  const [pipeStandard, setPipeStandard] = useState<PipeStandard>('ASME B36.10/B36.19');
  const pipeSizes = getPipeSizes(pipeStandard);
  const [pipeNps, setPipeNps] = useState('6');
  const normalizedPipeNps = pipeSizes.includes(pipeNps) ? pipeNps : pipeSizes[0];
  const pipeSchedules = getPipeSchedules(pipeStandard, normalizedPipeNps);
  const [pipeSchedule, setPipeSchedule] = useState('40');
  const normalizedSchedule = pipeSchedules.includes(pipeSchedule) ? pipeSchedule : pipeSchedules[0];
  const pipeRow = findPipeSize(pipeStandard, normalizedPipeNps, normalizedSchedule) ?? findPipeSize(pipeStandard, normalizedPipeNps, pipeSchedules[0]);
  const resolvedPipeRow: PipeSizeRow = pipeRow ?? findPipeSize('ASME B36.10/B36.19', '6', '40')!;
  const [pipeFlow, setPipeFlow] = useState(10);
  const [pipeFlowUnit, setPipeFlowUnit] = useState<FlowUnit>('t/h');
  const [velocitySpecificVolume, setVelocitySpecificVolume] = useState(0.24);
  const [useSteamSv, setUseSteamSv] = useState(true);
  const effectiveSpecificVolume = (useSteamSv && state?.specificVolume) ? state.specificVolume : velocitySpecificVolume;
  const velocity = calculateVelocity(pipeFlow, pipeFlowUnit, effectiveSpecificVolume, resolvedPipeRow.idMm);
  const pipeRowsForStandard = PIPE_SIZES.filter((row) => row.standard === pipeStandard);

  // Unit converter (inline)
  const [unitCategory, setUnitCategory] = useState<UnitCategory>('pressure');
  const unitOptions = UNIT_GROUPS[unitCategory];
  const [unitFrom, setUnitFrom] = useState(unitOptions[0]);
  const [unitTo, setUnitTo] = useState(unitOptions[1]);
  const [unitValue, setUnitValue] = useState(1);
  const converterResult = useMemo(() => convertUnit(unitValue, unitCategory, unitFrom, unitTo), [unitValue, unitCategory, unitFrom, unitTo]);

  function set<K extends keyof SteamInputs>(key: K, value: SteamInputs[K]) { setInputs((prev) => ({ ...prev, [key]: value })); }
  function savePoint() { if (current) setRecords((prev) => [...prev, { ...current, id: crypto.randomUUID(), label: `${selectedPair} · ${new Date().toLocaleTimeString()}` }].slice(-12)); }
  function canCheck(field: SteamTableField) {
    if (!fieldLabels[field].checkable) return false;
    if (checks[field]) return true;
    if (checkedFields.length >= 2) return false;
    return checkedFields.length === 0 || Boolean(selectedFieldsToPair([checkedFields[0], field]));
  }
  function toggleField(field: SteamTableField) { if (canCheck(field)) setChecks((prev) => ({ ...prev, [field]: !prev[field] })); }
  function showValue(field: SteamTableField) {
    if (!state) return '—';
    if (field === 'pressure') return format(pressureFromMPa(state.pressure, inputs.pressureUnit));
    if (field === 'temperature') return format(tempFromK(state.temperature, inputs.temperatureUnit));
    if (field === 'enthalpy') return format(state.enthalpy);
    if (field === 'entropy') return format(state.entropy);
    if (field === 'quality') return format(state.quality, 4);
    return format(state.specificVolume, 5);
  }

  return <main className={mini ? 'app mini' : 'app'}>
    <header className="topBar">
      <div className="brandBlock">
        <p className="eyebrow">IAPWS-IF97 · SteamWise</p>
        <h1>SteamWise</h1>
        <p className="subtitle">{t.tagline}</p>
      </div>
      <div className="topActions">
        <button className="tinyButton" onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}>{t.language}</button>
        <button className="tinyButton themeToggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀️' : '🌙'}</button>
        <button className="tinyButton" onClick={() => setMini(!mini)}>{mini ? t.full : t.mini}</button>
      </div>
    </header>

    {/* Inline Unit Converter — always visible below header */}
    <div className="inlineUnit">
      <span className="inlineUnitLabel">{t.unitLabel}</span>
      <select value={unitCategory} onChange={(e) => { const next = e.target.value as UnitCategory; setUnitCategory(next); setUnitFrom(UNIT_GROUPS[next][0]); setUnitTo(UNIT_GROUPS[next][1] ?? UNIT_GROUPS[next][0]); }}>{Object.keys(UNIT_GROUPS).map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select>
      <input type="text" inputMode="decimal" value={String(unitValue)} onChange={(e) => { const normalized = normalizeNumericText(e.target.value); const n = Number(normalized); if (Number.isFinite(n)) setUnitValue(n); }} className="unitInlineInput" />
      <select value={unitFrom} onChange={(e) => setUnitFrom(e.target.value)}>{unitOptions.map((u) => <option key={u}>{u}</option>)}</select>
      <span className="inlineUnitEquals">=</span>
      <span className="unitInlineResult">{format(converterResult, 6)}</span>
      <select value={unitTo} onChange={(e) => setUnitTo(e.target.value)}>{unitOptions.map((u) => <option key={u}>{u}</option>)}</select>
    </div>

    <nav className="toolTabs" aria-label="SteamWise tools">
      {(['steam', 'pipe'] as TabKey[]).map((tab) => <button key={tab} className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab)}>{t[tab]}</button>)}
    </nav>

    {activeTab === 'steam' && <section className="workspace steamWorkspaceV2">
      {/* Left: Steam Table Input */}
      <section className="panel inputPanel">
        <h2>{t.steamInput}</h2>
        <div className="steamTable">
          {tableFields.map((field) => <SteamTableRow key={field} field={field} lang={lang} checked={checks[field]} disabled={!canCheck(field)} value={showValue(field)} inputs={inputs} onToggle={() => toggleField(field)} onSet={set} />)}
        </div>
        {selectedPair && <div className="pairBadge">{t.selectedPair}: {selectedPair}</div>}
        <SaturationAdvisor copy={t} active={selectedPair === 'PT' && Boolean(result.saturation.ambiguous)} quality={inputs.quality} tSat={result.saturation.saturationTemperatureK ? tempFromK(result.saturation.saturationTemperatureK, inputs.temperatureUnit) : undefined} temperatureUnit={inputs.temperatureUnit} liquid={result.saturation.liquid} vapor={result.saturation.vapor} onQuality={(quality) => set('quality', quality)} onUseQualityPair={() => setChecks({ pressure: true, temperature: false, enthalpy: false, entropy: false, quality: true, specificVolume: false })} />
        {result.error && <div className="error">{result.error}</div>}
        {result.warnings.map((w) => <div className="warn" key={w}>{w}</div>)}
        <Help title={t.help}>{t.steamHelp}</Help>
      </section>

      {/* Center: T-s Diagram */}
      <section className="panel chartPanelV2">
        <div className="chartHeader">
          <h2>{t.chart}</h2>
          <div className="chartActions">
            <button className="tinyButton" onClick={savePoint} disabled={!state}>{t.pin}</button>
            <button className="tinyButton" onClick={() => setRecords([])} disabled={records.length === 0}>{t.clear}</button>
          </div>
        </div>
        <div className="chartBody">
          {!mini && <SteamChart records={records} current={current} theme={theme} />}
          {state && !mini && <div className={`stateBadge ${regionTone(state)}`}>{regionLabel(state)}</div>}
        </div>
      </section>

      {/* Right: History */}
      <section className="panel historyPanel">
        <h2>{t.history}</h2>
        {records.length === 0 && <p className="muted">{lang === 'ko' ? '저장된 기록이 없습니다. Pin 버튼으로 상태를 저장하세요.' : 'No saved records. Pin a state to save.'}</p>}
        <div className="historyList">
          {records.map((r, i) => <div key={r.id} className="historyItem" onClick={() => restoreRecord(r)}>
            <span className="historyNum">{i + 1}</span>
            <div className="historyBody">
              <span className="historyLabel">{r.label}</span>
              <span className="historyRegion">{r.region}</span>
              <span className="historyValues">P={format(r.p)} T={format(r.t)} h={format(r.h)} s={format(r.s, 3)} {r.x !== null ? `x=${format(r.x, 3)}` : ''}</span>
            </div>
            <button className="historyDelete" onClick={(e) => { e.stopPropagation(); deleteRecord(r.id); }} title={lang === 'ko' ? '삭제' : 'Delete'}>✕</button>
          </div>)}
        </div>
        {t.disclaimer && <Help title={lang === 'ko' ? '참고사항' : 'Reference'}>{t.disclaimer}</Help>}
      </section>
    </section>}

    {activeTab === 'pipe' && <section className="workspace singleWorkspace">
      <section className="panel widePanel">
        <h2>{t.pipeTitle}</h2>
        <div className="pipeCascade">
          <label>Code / standard<select value={pipeStandard} onChange={(e) => { const standard = e.target.value as PipeStandard; const firstSize = getPipeSizes(standard)[0]; const firstSchedule = getPipeSchedules(standard, firstSize)[0]; setPipeStandard(standard); setPipeNps(firstSize); setPipeSchedule(firstSchedule); }}>{standards.map((standard) => <option key={standard}>{standard}</option>)}</select></label>
          <label>DN / NPS<select value={normalizedPipeNps} onChange={(e) => { const nps = e.target.value; const firstSchedule = getPipeSchedules(pipeStandard, nps)[0]; setPipeNps(nps); setPipeSchedule(firstSchedule); }}>{pipeSizes.map((nps) => <option key={nps} value={nps}>{nps} / DN{PIPE_SIZES.find((row) => row.standard === pipeStandard && row.nps === nps)?.dn}</option>)}</select></label>
          <label>Schedule / series<select value={normalizedSchedule} onChange={(e) => setPipeSchedule(e.target.value)}>{pipeSchedules.map((schedule) => <option key={schedule}>{schedule}</option>)}</select></label>
        </div>
        <div className="pipeSummary">DN{resolvedPipeRow.dn} · {resolvedPipeRow.nps} · {resolvedPipeRow.schedule} · OD {resolvedPipeRow.odMm} mm · ID {resolvedPipeRow.idMm} mm</div>
        <div className="velocityInputs">
          <NumberWithUnit label="Mass flow" value={pipeFlow} onValue={setPipeFlow} unit={pipeFlowUnit} units={['kg/h', 't/h', 'kg/s', 'lb/h'] as FlowUnit[]} onUnit={setPipeFlowUnit} />
          <NumberWithFixedUnit label="Specific volume" value={effectiveSpecificVolume} unit="m³/kg" onValue={setVelocitySpecificVolume} disabled={useSteamSv && Boolean(state)} helper={state ? (useSteamSv ? 'from steam result' : 'manual') : 'default editable'} />
          {state && <label className="steamSvToggle"><input type="checkbox" checked={useSteamSv} onChange={() => setUseSteamSv(!useSteamSv)} />use steam result</label>}
          <NumberWithFixedUnit label="Pipe ID" value={resolvedPipeRow.idMm} unit="mm" onValue={() => undefined} disabled helper="from table" />
        </div>
        <div className="resultCards compact"><Metric label="Velocity" value={format(velocity.velocityMS)} unit="m/s" /><Metric label="Vol. flow" value={format(velocity.volumetricM3S)} unit="m³/s" /><Metric label="Mass flow" value={format(velocity.kgS)} unit="kg/s" /></div>
        {velocity.velocityMS > 60 && <div className="warn">⚠ Velocity {format(velocity.velocityMS)} m/s exceeds steam guideline (~25–40 m/s) — erosion risk, check pipe spec</div>}
        {velocity.velocityMS > 0 && velocity.velocityMS < 5 && <div className="warn subtle">Velocity low ({format(velocity.velocityMS)} m/s) — may cause condensate accumulation in steam lines</div>}
        <details className="pipeTableDetails"><summary>{t.table} · {pipeStandard}</summary><PipeTable rows={pipeRowsForStandard} selected={resolvedPipeRow} onPick={(row) => { setPipeStandard(row.standard); setPipeNps(row.nps); setPipeSchedule(row.schedule); }} /></details>
        <Help title={t.help}>{t.pipeHelp}</Help>
        <Help title={lang === 'ko' ? '참고사항' : 'Reference'}>{t.disclaimer}</Help>
      </section>
    </section>}
  </main>;
}

// Helper components
function Help({ title, children }: { title: string; children: React.ReactNode }) { return <details className="helpDetails"><summary>{title}</summary><p>{children}</p></details>; }

function SaturationAdvisor({ copy: t, active, quality, tSat, temperatureUnit, liquid, vapor, onQuality, onUseQualityPair }: { copy: typeof copy.ko; active: boolean; quality: number; tSat?: number; temperatureUnit: TemperatureUnit; liquid?: { enthalpy: number; entropy: number; specificVolume: number }; vapor?: { enthalpy: number; entropy: number; specificVolume: number }; onQuality: (quality: number) => void; onUseQualityPair: () => void }) {
  if (!active) return null;
  const presets = [{ label: 'x=0', value: 0 }, { label: 'x=0.5', value: 0.5 }, { label: 'x=1', value: 1 }];
  return <div className="satCard"><div className="satHeader"><span>{t.saturated}</span>{tSat !== undefined && <small>Tsat ≈ {format(tSat)} {temperatureUnit}</small>}</div><div className="qualityPresets">{presets.map((preset) => <button type="button" className={Math.abs(quality - preset.value) < 0.0001 ? 'chip active' : 'chip'} key={preset.value} onClick={() => onQuality(preset.value)}>{preset.label}</button>)}</div><label className="qualitySlider">x<input type="range" min="0" max="1" step="0.01" value={quality} onChange={(e) => onQuality(Number(e.target.value))} /><output>{format(quality, 2)}</output></label>{liquid && vapor && <div className="satRange"><b>h {format(liquid.enthalpy)} ~ {format(vapor.enthalpy)} kJ/kg</b><b>s {format(liquid.entropy)} ~ {format(vapor.entropy)} kJ/kg·K</b></div>}<button type="button" className="secondaryButton" onClick={onUseQualityPair}>{t.usePx}</button></div>;
}

function SteamTableRow({ field, checked, disabled, value, inputs, lang, onToggle, onSet }: { field: SteamTableField; checked: boolean; disabled: boolean; value: string; inputs: SteamInputs; lang: Lang; onToggle: () => void; onSet: <K extends keyof SteamInputs>(key: K, value: SteamInputs[K]) => void }) {
  const meta = fieldLabels[field];
  return <div className={`${checked ? 'steamRow checked' : 'steamRow'}${disabled ? ' disabled' : ''}`}><label className="steamCheck"><input type="checkbox" checked={checked} disabled={disabled} onChange={onToggle} /><span>{meta.symbol}</span></label><div className="steamName"><b>{meta[lang]}</b><small>{meta.checkable ? 'input' : 'calc'}</small></div><div className="steamValue">{checked ? <SteamFieldInput field={field} inputs={inputs} onSet={onSet} /> : <ValueWithUnit value={value} unit={displayUnit(field, inputs)} />}</div></div>;
}

function SteamFieldInput({ field, inputs, onSet }: { field: SteamTableField; inputs: SteamInputs; onSet: <K extends keyof SteamInputs>(key: K, value: SteamInputs[K]) => void }) {
  if (field === 'pressure') return <NumberWithUnit label="" value={inputs.pressure} onValue={(v) => onSet('pressure', v)} unit={inputs.pressureUnit} units={pressureUnits} onUnit={(u) => onSet('pressureUnit', u)} />;
  if (field === 'temperature') return <NumberWithUnit label="" value={inputs.temperature} onValue={(v) => onSet('temperature', v)} unit={inputs.temperatureUnit} units={tempUnits} onUnit={(u) => onSet('temperatureUnit', u)} />;
  if (field === 'enthalpy') return <NumberWithUnit label="" value={inputs.enthalpy} onValue={(v) => onSet('enthalpy', v)} unit={inputs.enthalpyUnit} units={hUnits} onUnit={(u) => onSet('enthalpyUnit', u)} />;
  if (field === 'entropy') return <NumberWithFixedUnit label="" value={inputs.entropy} unit="kJ/kg·K" onValue={(v) => onSet('entropy', v)} />;
  if (field === 'quality') return <NumberWithFixedUnit label="" value={inputs.quality} unit="x" onValue={(v) => onSet('quality', v)} />;
  return <output>—</output>;
}

function displayUnit(field: SteamTableField, inputs: SteamInputs) { if (field === 'pressure') return inputs.pressureUnit; if (field === 'temperature') return inputs.temperatureUnit; if (field === 'enthalpy') return 'kJ/kg'; if (field === 'entropy') return 'kJ/kg·K'; if (field === 'quality') return 'x'; return 'm³/kg'; }
function ValueWithUnit({ value, unit }: { value: string; unit: string }) { return <output className="valueWithUnit"><strong>{value}</strong><em>{unit}</em></output>; }
function parseNumericInput(raw: string) { const normalized = normalizeNumericText(raw); const next = Number(normalized); return { text: normalized, value: Number.isFinite(next) ? next : undefined }; }
function DecimalTextInput({ value, onValue, disabled = false }: { value: number; onValue: (value: number) => void; disabled?: boolean }) {
  const [text, setText] = useState(String(value));
  useEffect(() => {
    const parsed = normalizeNumericText(text);
    if (Number(parsed) !== value) setText(String(value));
  }, [value]);
  return <input type="text" inputMode="decimal" value={text} disabled={disabled} onChange={(e) => {
    const parsed = parseNumericInput(e.target.value);
    setText(parsed.text);
    if (parsed.value !== undefined) onValue(parsed.value);
  }} />;
}
function NumberInput({ label, value, onValue, disabled = false, helper }: { label: string; value: number; onValue: (value: number) => void; disabled?: boolean; helper?: string }) { return <label>{label}<DecimalTextInput value={value} disabled={disabled} onValue={onValue} />{helper && <small className="fieldHelper">{helper}</small>}</label>; }
function NumberWithUnit<T extends string>({ label, value, onValue, unit, units, onUnit }: { label: string; value: number; onValue: (value: number) => void; unit: T; units: readonly T[]; onUnit: (unit: T) => void }) { return <label>{label}<div className="unitInput"><DecimalTextInput value={value} onValue={onValue} /><select value={unit} onChange={(e) => onUnit(e.target.value as T)}>{units.map((u) => <option key={u}>{u}</option>)}</select></div></label>; }
function NumberWithFixedUnit({ label, value, unit, onValue, disabled = false, helper }: { label: string; value: number; unit: string; onValue: (value: number) => void; disabled?: boolean; helper?: string }) { return <label>{label}<div className="unitInput fixed"><DecimalTextInput value={value} disabled={disabled} onValue={onValue} /><span className="unitBadge">{unit}</span></div>{helper && <small className="fieldHelper">{helper}</small>}</label>; }
function PipeTable({ rows, selected, onPick }: { rows: PipeSizeRow[]; selected: PipeSizeRow; onPick: (row: PipeSizeRow) => void }) { return <div className="pipeTableWrap"><table className="pipeTable"><thead><tr><th>Code</th><th>DN</th><th>NPS/A</th><th>Sch</th><th>OD mm</th><th>ID mm</th></tr></thead><tbody>{rows.map((row) => <tr key={`${row.standard}-${row.nps}-${row.schedule}`} className={row.standard === selected.standard && row.nps === selected.nps && row.schedule === selected.schedule ? 'selected' : ''} onClick={() => onPick(row)}><td>{row.standard}</td><td>DN{row.dn}</td><td>{row.nps}</td><td>{row.schedule}</td><td>{row.odMm}</td><td>{row.idMm}</td></tr>)}</tbody></table></div>; }
function Metric({ label, value, unit }: { label: string; value: string; unit: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><em>{unit}</em></div>; }

createRoot(document.getElementById('root')!).render(<App />);
