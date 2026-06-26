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
import { heatEffectiveness, sideDutyKW, solveColdOutlet, solveMissingColdFlow, type MassFlowUnit } from './calculators/heat';
import { UNIT_GROUPS, convertUnit, normalizeNumericText, type UnitCategory } from './calculators/units';
import './styles.css';

const pressureUnits: PressureUnit[] = ['MPa', 'kPa', 'bar(a)', 'bar(g)', 'kgf/cm²', 'psi'];
const tempUnits: TemperatureUnit[] = ['°C', 'K', '°F'];
const hUnits: EnthalpyUnit[] = ['kJ/kg', 'kcal/kg', 'BTU/lb'];
const tableFields: SteamTableField[] = ['pressure', 'temperature', 'enthalpy', 'entropy', 'quality', 'specificVolume'];

type Lang = 'ko' | 'en';
type TabKey = 'steam' | 'pipe' | 'unit' | 'heat';
type RecordItem = { id: string; label: string; p: number; t: number; h: number; s: number; v: number; x: number | null; region: string };

const copy = {
  ko: {
    tagline: 'Plant engineering calculator',
    subtitle: '필요한 기능만 한 화면에 집중해서 봅니다. 기본은 Steam Table, 배관·단위환산·열전달은 탭으로 전환하세요.',
    steam: 'Steam Table', pipe: 'Pipe / Velocity', unit: 'Unit Converter', heat: 'Heat Transfer',
    mini: 'Mini', full: 'Full', pin: 'Pin', clear: 'Clear', language: 'English',
    steamInput: 'Steam Table Input', result: 'Calculated Result', chart: 'T-s Diagram',
    pipeTitle: 'Pipe Size & Velocity', unitTitle: 'Unit Converter', heatTitle: 'Heat Transfer Check',
    help: '사용법 / 더보기', trust: '검증/주의사항', table: 'Pipe table',
    selectedPair: 'Selected input pair', saturated: '포화선 감지', usePx: '입력쌍을 P+x로 전환',
    pipeHelp: '코드 → DN/NPS → 스케줄 순서로 선택하면 ID가 자동 적용됩니다. 표는 빠른 검토용 subset이며 최종 설계는 최신 공식 표준과 프로젝트 piping class로 확인하세요.',
    steamHelp: '입력할 상태량 2개를 체크하세요. P+T, P+h, P+s, P+x, T+h, T+s를 지원합니다. 체크하지 않은 값은 IF97 계산값입니다.',
    unitHelp: '발전/배관에서 자주 쓰는 압력, 온도, 엔탈피, 엔트로피, 유량, 길이 단위를 즉시 환산합니다.',
    heatHelp: '열수지는 엔탈피 기반 quick check입니다. 효율은 ε = 실제 열량 / 가능한 최대 열량으로 계산합니다. 나중에 LMTD/UA/접근온도까지 확장할 수 있습니다.',
    disclaimer: '⚠ Engineering reference only. All values are quick-check estimates. Final design requires verification against latest official standards, vendor documentation, and project-specific piping/equipment class. No liability assumed.'
  },
  en: {
    tagline: 'Plant engineering calculator',
    subtitle: 'Use one focused tool at a time. Steam Table is the default; switch tabs for pipe, units, or heat transfer.',
    steam: 'Steam Table', pipe: 'Pipe / Velocity', unit: 'Unit Converter', heat: 'Heat Transfer',
    mini: 'Mini', full: 'Full', pin: 'Pin', clear: 'Clear', language: '한국어',
    steamInput: 'Steam Table Input', result: 'Calculated Result', chart: 'T-s Diagram',
    pipeTitle: 'Pipe Size & Velocity', unitTitle: 'Unit Converter', heatTitle: 'Heat Transfer Check',
    help: 'How to use / more', trust: 'Verification / caution', table: 'Pipe table',
    selectedPair: 'Selected input pair', saturated: 'Saturation detected', usePx: 'Switch input pair to P+x',
    pipeHelp: 'Select code → DN/NPS → schedule. Pipe ID is applied automatically. This is a quick-reference subset; verify final design against official standards and project piping class.',
    steamHelp: 'Check two independent properties. Supported pairs: P+T, P+h, P+s, P+x, T+h, T+s. Unchecked fields are IF97 calculated results.',
    unitHelp: 'Convert common power-plant and piping units for pressure, temperature, enthalpy, entropy, flow, velocity, and length.',
    heatHelp: 'Heat balance is an enthalpy-based quick check. Effectiveness ε = actual duty / maximum possible duty. Later we can add LMTD, UA, and approach-temperature bands.',
    disclaimer: '⚠ Engineering reference only. All values are quick-check estimates. Final design requires verification against latest official standards, vendor documentation, and project-specific piping/equipment class. No liability assumed.',
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

function SteamChart({ records, current }: { records: RecordItem[]; current?: RecordItem }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    const dome = [[0.6, 20], [1.2, 80], [2.1, 140], [3.2, 200], [4.4, 260], [5.2, 320], [4.8, 374], [6.8, 320], [7.5, 260], [7.2, 200], [6.7, 140], [6.0, 80], [5.1, 20]];
    const pts = [...records.slice(-8), ...(current ? [current] : [])];
    chart.setOption({
      grid: { left: 45, right: 16, top: 18, bottom: 38 },
      tooltip: { trigger: 'item' },
      xAxis: { name: 's kJ/kg·K', type: 'value', min: 0, max: 9, splitLine: { lineStyle: { color: '#e7edf3' } } },
      yAxis: { name: 'T °C', type: 'value', min: 0, max: 650, splitLine: { lineStyle: { color: '#e7edf3' } } },
      series: [
        { name: 'Saturation dome', type: 'line', data: dome, smooth: true, symbol: 'none', lineStyle: { color: '#7aa7c7', width: 2 }, areaStyle: { color: 'rgba(125, 211, 252, .10)' } },
        { name: 'State', type: 'scatter', symbolSize: 13, data: pts.map((r) => [r.s, r.t, r.label]), itemStyle: { color: '#0f766e' } }
      ]
    });
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); chart.dispose(); };
  }, [records, current]);
  return <div ref={ref} className="chart" />;
}

function App() {
  const [lang, setLang] = useState<Lang>('en');
  const t = copy[lang];
  const [activeTab, setActiveTab] = useState<TabKey>('steam');
  const [mini, setMini] = useState(false);

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
    setInputs({ pair: 'PT', pressure: Math.round(r.p * 1e6) / 1e6, pressureUnit: 'MPa', temperature: r.t, temperatureUnit: '°C', enthalpy: Math.round(r.h), enthalpyUnit: 'kJ/kg', entropy: r.s, quality: r.x ?? 0.5 });
    setChecks({ pressure: true, temperature: true, enthalpy: false, entropy: false, quality: false, specificVolume: false });
  }

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

  const [unitCategory, setUnitCategory] = useState<UnitCategory>('pressure');
  const unitOptions = UNIT_GROUPS[unitCategory];
  const [unitFrom, setUnitFrom] = useState(unitOptions[0]);
  const [unitTo, setUnitTo] = useState(unitOptions[1]);
  const [unitValue, setUnitValue] = useState(1);
  const converterResult = useMemo(() => convertUnit(unitValue, unitCategory, unitFrom, unitTo), [unitValue, unitCategory, unitFrom, unitTo]);

  const [heat, setHeat] = useState({ hotFlow: 10, hotUnit: 't/h' as MassFlowUnit, hotIn: 3200, hotOut: 900, coldFlow: 20, coldUnit: 't/h' as MassFlowUnit, coldIn: 420, coldOut: 900 });
  const hotDuty = sideDutyKW({ flow: heat.hotFlow, flowUnit: heat.hotUnit, hIn: heat.hotIn, hOut: heat.hotOut });
  const coldOutlet = solveColdOutlet({ flow: heat.hotFlow, flowUnit: heat.hotUnit, hIn: heat.hotIn, hOut: heat.hotOut }, heat.coldFlow, heat.coldUnit, heat.coldIn);
  const coldFlow = solveMissingColdFlow({ flow: heat.hotFlow, flowUnit: heat.hotUnit, hIn: heat.hotIn, hOut: heat.hotOut }, heat.coldIn, heat.coldOut, heat.coldUnit);
  const [hx, setHx] = useState({ hotFlowKgS: 5, hotCpKJkgK: 4.2, hotInC: 140, hotOutC: 90, coldFlowKgS: 6, coldCpKJkgK: 4.2, coldInC: 30, coldOutC: 71.7 });
  const hxResult = heatEffectiveness(hx);

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
        <p className="subtitle">{t.subtitle}</p>
      </div>
      <div className="topActions">
        <button className="tinyButton" onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}>{t.language}</button>
        <button className="tinyButton" onClick={() => setMini(!mini)}>{mini ? t.full : t.mini}</button>
        <button className="tinyButton" onClick={savePoint} disabled={!state}>{t.pin}</button>
        <button className="tinyButton" onClick={() => setRecords([])}>{t.clear}</button>
      </div>
    </header>

    <nav className="toolTabs" aria-label="SteamWise tools">
      {(['steam', 'pipe', 'unit', 'heat'] as TabKey[]).map((tab) => <button key={tab} className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab)}>{t[tab]}</button>)}
    </nav>

    {activeTab === 'steam' && <section className="workspace steamWorkspace">
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

      <section className="panel resultPanel">
        <h2>{t.result}</h2>
        {state && <>
          <div className={`stateBadge ${regionTone(state)}`}>{regionLabel(state)}</div>
          <div className="resultCards">
            <Metric label="P" value={format(pressureFromMPa(state.pressure, inputs.pressureUnit))} unit={inputs.pressureUnit} />
            <Metric label="T" value={format(tempFromK(state.temperature, inputs.temperatureUnit))} unit={inputs.temperatureUnit} />
            <Metric label="h" value={format(state.enthalpy)} unit="kJ/kg" />
            <Metric label="s" value={format(state.entropy)} unit="kJ/kg·K" />
            <Metric label="v" value={format(state.specificVolume, 5)} unit="m³/kg" />
            <Metric label="ρ" value={format(state.density)} unit="kg/m³" />
          </div>
        </>}
      </section>

      {!mini && <section className="panel chartPanel"><h2>{t.chart}</h2><SteamChart records={records} current={current} /><div className="history">{records.map((r) => <button key={r.id} onClick={() => restoreRecord(r)} title="Click to restore">{r.label}<span>{r.region}</span><small>P={format(r.p)} T={format(r.t)} h={format(r.h)}</small></button>)}</div></section>}
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
        <details className="pipeTableDetails"><summary>{t.table} · {pipeStandard}</summary><PipeTable rows={pipeRowsForStandard} selected={resolvedPipeRow} onPick={(row) => { setPipeStandard(row.standard); setPipeNps(row.nps); setPipeSchedule(row.schedule); }} /></details>
        <Help title={t.help}>{t.pipeHelp}</Help>
      </section>
    </section>}

    {activeTab === 'unit' && <section className="workspace singleWorkspace">
      <section className="panel widePanel">
        <h2>{t.unitTitle}</h2>
        <div className="converterGrid">
          <label>Category<select value={unitCategory} onChange={(e) => { const next = e.target.value as UnitCategory; setUnitCategory(next); setUnitFrom(UNIT_GROUPS[next][0]); setUnitTo(UNIT_GROUPS[next][1] ?? UNIT_GROUPS[next][0]); }}>{Object.keys(UNIT_GROUPS).map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
          <NumberWithUnit label="From" value={unitValue} onValue={setUnitValue} unit={unitFrom} units={unitOptions} onUnit={setUnitFrom} />
          <label>To<select value={unitTo} onChange={(e) => setUnitTo(e.target.value)}>{unitOptions.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
        </div>
        <div className="converterResult"><span>{format(unitValue)} {unitFrom}</span><strong>= {format(converterResult, 6)} {unitTo}</strong></div>
        <Help title={t.help}>{t.unitHelp}</Help>
      </section>
    </section>}

    {activeTab === 'heat' && <section className="workspace heatWorkspace">
      <section className="panel">
        <h2>{t.heatTitle}</h2>
        <div className="miniFields">
          <NumberInput label="Hot flow t/h" value={heat.hotFlow} onValue={(v) => setHeat({ ...heat, hotFlow: v })} />
          <NumberInput label="Hot h in kJ/kg" value={heat.hotIn} onValue={(v) => setHeat({ ...heat, hotIn: v })} />
          <NumberInput label="Hot h out kJ/kg" value={heat.hotOut} onValue={(v) => setHeat({ ...heat, hotOut: v })} />
          <NumberInput label="Cold flow t/h" value={heat.coldFlow} onValue={(v) => setHeat({ ...heat, coldFlow: v })} />
          <NumberInput label="Cold h in kJ/kg" value={heat.coldIn} onValue={(v) => setHeat({ ...heat, coldIn: v })} />
          <NumberInput label="Cold h out target kJ/kg" value={heat.coldOut} onValue={(v) => setHeat({ ...heat, coldOut: v })} />
        </div>
        <div className="resultCards compact"><Metric label="|Q|" value={format(Math.abs(hotDuty))} unit="kW" /><Metric label="Cold h out" value={format(coldOutlet)} unit="kJ/kg" /><Metric label="Req. cold flow" value={format(coldFlow)} unit={heat.coldUnit} /></div>
        <Help title={t.help}>{t.heatHelp}</Help>
      </section>
      <section className="panel">
        <h2>Effectiveness ε</h2>
        <div className="miniFields twoCol">
          <NumberInput label="Hot flow kg/s" value={hx.hotFlowKgS} onValue={(v) => setHx({ ...hx, hotFlowKgS: v })} />
          <NumberInput label="Hot Cp kJ/kg·K" value={hx.hotCpKJkgK} onValue={(v) => setHx({ ...hx, hotCpKJkgK: v })} />
          <NumberInput label="Hot in °C" value={hx.hotInC} onValue={(v) => setHx({ ...hx, hotInC: v })} />
          <NumberInput label="Hot out °C" value={hx.hotOutC} onValue={(v) => setHx({ ...hx, hotOutC: v })} />
          <NumberInput label="Cold flow kg/s" value={hx.coldFlowKgS} onValue={(v) => setHx({ ...hx, coldFlowKgS: v })} />
          <NumberInput label="Cold Cp kJ/kg·K" value={hx.coldCpKJkgK} onValue={(v) => setHx({ ...hx, coldCpKJkgK: v })} />
          <NumberInput label="Cold in °C" value={hx.coldInC} onValue={(v) => setHx({ ...hx, coldInC: v })} />
          <NumberInput label="Cold out °C" value={hx.coldOutC} onValue={(v) => setHx({ ...hx, coldOutC: v })} />
        </div>
        <div className="resultCards compact"><Metric label="Actual Q" value={format(hxResult.actualKW)} unit="kW" /><Metric label="Max Q" value={format(hxResult.maxPossibleKW)} unit="kW" /><Metric label="ε" value={format(hxResult.effectiveness * 100)} unit="%" /></div>
        {hxResult.effectiveness > 1 && <div className="warn">⚠ ε &gt; 1 — impossible: check flow/direction assumptions</div>}
        {hx.hotInC < hx.hotOutC && <div className="warn">⚠ Hot outlet &gt; hot inlet — temperature reversal, check inputs</div>}
        {hxResult.heatBalanceGapKW > hxResult.actualKW * 0.5 && hxResult.actualKW > 0 && <div className="warn">⚠ Balance gap &gt; 50% — hot/cold duty mismatch</div>}
        <div className="warn subtle">Balance gap: {format(hxResult.heatBalanceGapKW)} kW · early sizing only</div>
      </section>
    </section>}
  </main>;
}

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
