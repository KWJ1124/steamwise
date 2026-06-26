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
import { sideDutyKW, solveColdOutlet, solveMissingColdFlow, type MassFlowUnit } from './calculators/heat';
import { UNIT_GROUPS, convertUnit, normalizeNumericText, type UnitCategory } from './calculators/units';
import './styles.css';

const pressureUnits: PressureUnit[] = ['MPa', 'kPa', 'bar(a)', 'bar(g)', 'kgf/cm²', 'psi'];
const tempUnits: TemperatureUnit[] = ['°C', 'K', '°F'];
const hUnits: EnthalpyUnit[] = ['kJ/kg', 'kcal/kg', 'BTU/lb'];
const fieldLabels: Record<SteamTableField, { symbol: string; label: string; unit: string; checkable: boolean }> = {
  pressure: { symbol: 'P', label: 'Pressure', unit: 'selected', checkable: true },
  temperature: { symbol: 'T', label: 'Temperature', unit: 'selected', checkable: true },
  enthalpy: { symbol: 'h', label: 'Enthalpy', unit: 'kJ/kg', checkable: true },
  entropy: { symbol: 's', label: 'Entropy', unit: 'kJ/kg·K', checkable: true },
  quality: { symbol: 'x', label: 'Quality', unit: '—', checkable: true },
  specificVolume: { symbol: 'v', label: 'Specific volume', unit: 'm³/kg', checkable: false }
};
const tableFields: SteamTableField[] = ['pressure', 'temperature', 'enthalpy', 'entropy', 'quality', 'specificVolume'];

type RecordItem = { id: string; label: string; p: number; t: number; h: number; s: number; v: number; x: number | null; region: string };

function SteamChart({ records, current }: { records: RecordItem[]; current?: RecordItem }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    const dome = [
      [0.6, 20], [1.2, 80], [2.1, 140], [3.2, 200], [4.4, 260], [5.2, 320], [4.8, 374],
      [6.8, 320], [7.5, 260], [7.2, 200], [6.7, 140], [6.0, 80], [5.1, 20]
    ];
    const pts = [...records.slice(-8), ...(current ? [current] : [])];
    chart.setOption({
      grid: { left: 45, right: 18, top: 22, bottom: 42 },
      tooltip: { trigger: 'item' },
      xAxis: { name: 's kJ/kg·K', type: 'value', min: 0, max: 9, splitLine: { lineStyle: { color: '#e7edf3' } } },
      yAxis: { name: 'T °C', type: 'value', min: 0, max: 650, splitLine: { lineStyle: { color: '#e7edf3' } } },
      series: [
        { name: 'Water/steam saturation dome (visual T-s guide)', type: 'line', data: dome, smooth: true, symbol: 'none', lineStyle: { color: '#7aa7c7', width: 2 }, areaStyle: { color: 'rgba(125, 211, 252, .10)' } },
        { name: 'State points', type: 'scatter', symbolSize: 13, data: pts.map((r) => [r.s, r.t, r.label]), itemStyle: { color: '#0f766e' }, tooltip: { formatter: (p: any) => `${p.data[2]}<br/>s ${format(p.data[0])}<br/>T ${format(p.data[1])} °C` } }
      ]
    });
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); chart.dispose(); };
  }, [records, current]);
  return <div ref={ref} className="chart" />;
}

function App() {
  const [mini, setMini] = useState(false);
  const [checks, setChecks] = useState<SteamFieldChecks>({ pressure: true, temperature: true, enthalpy: false, entropy: false, quality: false, specificVolume: false });
  const checkedFields = getCheckedSteamFields(checks).filter((field) => field !== 'specificVolume');
  const selectedPair = selectedFieldsToPair(checkedFields);
  const [inputs, setInputs] = useState<SteamInputs>({ pair: 'PT', pressure: 1, pressureUnit: 'MPa', temperature: 250, temperatureUnit: '°C', enthalpy: 2900, enthalpyUnit: 'kJ/kg', entropy: 6.5, quality: 0.5 });
  const steamInputs = useMemo(() => ({ ...inputs, pair: selectedPair ?? inputs.pair }), [inputs, selectedPair]);
  const result = useMemo(() => selectedPair ? solveSteam(steamInputs) : { error: '체크박스에서 서로 계산 가능한 상태량 2개를 선택하세요. 예: P+T, P+h, P+s, P+x, T+h, T+s', saturation: { ambiguous: false as const, resolution: 'single-phase' as const }, warnings: [] }, [steamInputs, selectedPair]);
  const state = result.state;
  const current: RecordItem | undefined = state ? { id: 'current', label: `${selectedPair} current`, p: state.pressure, t: tempFromK(state.temperature, '°C'), h: state.enthalpy, s: state.entropy, v: state.specificVolume, x: state.quality, region: regionLabel(state) } : undefined;

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
  const effectiveSpecificVolume = state?.specificVolume ?? velocitySpecificVolume;
  const velocity = calculateVelocity(pipeFlow, pipeFlowUnit, effectiveSpecificVolume, resolvedPipeRow.idMm);
  const pipeRowsForStandard = PIPE_SIZES.filter((row) => row.standard === pipeStandard);

  const [unitCategory, setUnitCategory] = useState<UnitCategory>('pressure');
  const unitOptions = UNIT_GROUPS[unitCategory];
  const [unitFrom, setUnitFrom] = useState(unitOptions[0]);
  const [unitTo, setUnitTo] = useState(unitOptions[1]);
  const [unitValue, setUnitValue] = useState(1);
  const converterResult = useMemo(() => convertUnit(unitValue, unitCategory, unitFrom, unitTo), [unitValue, unitCategory, unitFrom, unitTo]);

  const [records, setRecords] = useState<RecordItem[]>([]);
  const [heat, setHeat] = useState({ hotFlow: 10, hotUnit: 't/h' as MassFlowUnit, hotIn: 3200, hotOut: 900, coldFlow: 20, coldUnit: 't/h' as MassFlowUnit, coldIn: 420, coldOut: 900 });
  const hotDuty = sideDutyKW({ flow: heat.hotFlow, flowUnit: heat.hotUnit, hIn: heat.hotIn, hOut: heat.hotOut });
  const coldOutlet = solveColdOutlet({ flow: heat.hotFlow, flowUnit: heat.hotUnit, hIn: heat.hotIn, hOut: heat.hotOut }, heat.coldFlow, heat.coldUnit, heat.coldIn);
  const coldFlow = solveMissingColdFlow({ flow: heat.hotFlow, flowUnit: heat.hotUnit, hIn: heat.hotIn, hOut: heat.hotOut }, heat.coldIn, heat.coldOut, heat.coldUnit);

  function set<K extends keyof SteamInputs>(key: K, value: SteamInputs[K]) { setInputs((prev) => ({ ...prev, [key]: value })); }
  function savePoint() { if (current) setRecords((prev) => [...prev, { ...current, id: crypto.randomUUID(), label: `${selectedPair} · ${new Date().toLocaleTimeString()}` }].slice(-12)); }
  function canCheck(field: SteamTableField) {
    if (!fieldLabels[field].checkable) return false;
    if (checks[field]) return true;
    const selected = checkedFields;
    if (selected.length >= 2) return false;
    if (selected.length === 1) return Boolean(selectedFieldsToPair([selected[0], field]));
    return true;
  }
  function toggleField(field: SteamTableField) {
    if (!canCheck(field)) return;
    setChecks((prev) => ({ ...prev, [field]: !prev[field] }));
  }
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
    <header className="hero">
      <div>
        <p className="eyebrow">IAPWS-IF97 · Plant steam table</p>
        <h1>SteamWise</h1>
        <p className="subtitle">상태량 2개를 고르면 나머지를 계산하고, 포화선에서는 기본 건도 x=0.5 또는 포화수/포화증기를 선택해 오해 없이 해석합니다.</p>
      </div>
      <div className="heroActions">
        <button onClick={() => setMini(!mini)}>{mini ? 'Full workbench' : 'Mini window'}</button>
        <button onClick={savePoint} disabled={!state}>Pin point</button>
        <button onClick={() => setRecords([])}>Clear history</button>
      </div>
    </header>

    <section className="benchmarkNote">
      사용법: 1) 스팀테이블에서 입력할 상태량 2개 체크 → 2) 체크된 행에 숫자 입력 → 3) 나머지 상태량과 T-s 선도 위치 자동 확인. 두 개를 체크하면 나머지 체크박스는 비활성화됩니다.
    </section>

    <div className="grid">
      <section className="panel inputPanel">
        <h2>Steam table input</h2>
        <p className="muted">지원 입력쌍: P+T, P+h, P+s, P+x, T+h, T+s. v는 현재 계산 결과로 표시합니다.</p>
        <div className="steamTable">
          {tableFields.map((field) => <SteamTableRow
            key={field}
            field={field}
            checked={checks[field]}
            disabled={!canCheck(field)}
            value={showValue(field)}
            inputs={inputs}
            onToggle={() => toggleField(field)}
            onSet={set}
          />)}
        </div>
        {selectedPair && <div className="pairBadge">Selected input pair: {selectedPair}</div>}
        <SaturationAdvisor
          active={selectedPair === 'PT' && Boolean(result.saturation.ambiguous)}
          quality={inputs.quality}
          tSat={result.saturation.saturationTemperatureK ? tempFromK(result.saturation.saturationTemperatureK, inputs.temperatureUnit) : undefined}
          temperatureUnit={inputs.temperatureUnit}
          liquid={result.saturation.liquid}
          vapor={result.saturation.vapor}
          onQuality={(quality) => set('quality', quality)}
          onUseQualityPair={() => setChecks({ pressure: true, temperature: false, enthalpy: false, entropy: false, quality: true, specificVolume: false })}
        />
        {result.error && <div className="error">{result.error}</div>}
        {result.warnings.map((w) => <div className="warn" key={w}>{w}</div>)}
      </section>

      <section className="panel resultPanel">
        <h2>Calculated result</h2>
        {state && <>
          <div className={`stateBadge ${regionTone(state)}`}>{regionLabel(state)}</div>
          <p className="explain">체크하지 않은 값은 IF97 계산 결과입니다. 설계 확정 전에는 프로젝트 표준/벤더 자료로 재확인하세요.</p>
          <div className="resultCards">
            <Metric label="P" value={format(pressureFromMPa(state.pressure, inputs.pressureUnit))} unit={inputs.pressureUnit} />
            <Metric label="T" value={format(tempFromK(state.temperature, inputs.temperatureUnit))} unit={inputs.temperatureUnit} />
            <Metric label="h" value={format(state.enthalpy)} unit="kJ/kg" />
            <Metric label="s" value={format(state.entropy)} unit="kJ/kg·K" />
            <Metric label="v" value={format(state.specificVolume, 5)} unit="m³/kg" />
            <Metric label="x" value={format(state.quality, 4)} unit="—" />
            <Metric label="ρ" value={format(state.density)} unit="kg/m³" />
            <Metric label="u" value={format(state.internalEnergy)} unit="kJ/kg" />
          </div>
        </>}
      </section>

      {!mini && <section className="panel chartPanel"><h2>Water / Steam T-s diagram</h2><SteamChart records={records} current={current} /><div className="history">{records.map((r) => <button key={r.id}>{r.label}<span>{r.region}</span></button>)}</div></section>}
    </div>

    {!mini && <section className="seoHub" id="guides">
      <article><b>Steam table workflow</b><span>공학책의 물/증기표처럼 두 상태량을 기준으로 나머지 상태량을 계산합니다.</span></article>
      <article><b>T-s diagram</b><span>계산된 상태점을 물/증기 T-s 선도 위에 표시해 상태 영역을 빠르게 확인합니다.</span></article>
      <article><b>Pipe code selector</b><span>배관은 코드/표준을 먼저 고르고, 사이즈와 스케줄을 단계적으로 선택합니다.</span></article>
      <article><b>Engineering caution</b><span>표준표는 빠른 검토용 subset이며 최종 설계는 최신 코드와 프로젝트 기준을 확인해야 합니다.</span></article>
    </section>}

    {!mini && <div className="toolsGrid">
      <section className="panel" id="pipe-sizing">
        <div className="sectionHeaderLine">
          <div>
            <h2>Pipe size & velocity</h2>
            <p className="muted">코드 → DN/NPS → 스케줄을 고르면 ID가 자동 적용되고, 유량/비체적으로 유속을 바로 계산합니다.</p>
          </div>
        </div>
        <div className="pipeCascade">
          <label>Code / standard<select value={pipeStandard} onChange={(e) => { const standard = e.target.value as PipeStandard; const firstSize = getPipeSizes(standard)[0]; const firstSchedule = getPipeSchedules(standard, firstSize)[0]; setPipeStandard(standard); setPipeNps(firstSize); setPipeSchedule(firstSchedule); }}>{standards.map((standard) => <option key={standard}>{standard}</option>)}</select></label>
          <label>DN / NPS<select value={normalizedPipeNps} onChange={(e) => { const nps = e.target.value; const firstSchedule = getPipeSchedules(pipeStandard, nps)[0]; setPipeNps(nps); setPipeSchedule(firstSchedule); }}>{pipeSizes.map((nps) => <option key={nps} value={nps}>{nps} / DN{PIPE_SIZES.find((row) => row.standard === pipeStandard && row.nps === nps)?.dn}</option>)}</select></label>
          <label>Schedule / series<select value={normalizedSchedule} onChange={(e) => setPipeSchedule(e.target.value)}>{pipeSchedules.map((schedule) => <option key={schedule}>{schedule}</option>)}</select></label>
        </div>
        <div className="pipeSummary">Selected: DN{resolvedPipeRow.dn} · {resolvedPipeRow.nps} · {resolvedPipeRow.schedule} · OD {resolvedPipeRow.odMm} mm · ID {resolvedPipeRow.idMm} mm {resolvedPipeRow.note ? `· ${resolvedPipeRow.note}` : ''}</div>
        <div className="velocityInputs">
          <NumberWithUnit label="Mass flow" value={pipeFlow} onValue={setPipeFlow} unit={pipeFlowUnit} units={['kg/h','t/h','kg/s','lb/h'] as FlowUnit[]} onUnit={setPipeFlowUnit} />
          <NumberWithFixedUnit label="Specific volume" value={effectiveSpecificVolume} unit="m³/kg" onValue={setVelocitySpecificVolume} disabled={Boolean(state)} helper={state ? 'steam result applied' : 'default editable'} />
          <NumberWithFixedUnit label="Pipe ID" value={resolvedPipeRow.idMm} unit="mm" onValue={() => undefined} disabled helper="from table" />
        </div>
        <div className="resultCards compact"><Metric label="Velocity" value={format(velocity.velocityMS)} unit="m/s" /><Metric label="Vol. flow" value={format(velocity.volumetricM3S)} unit="m³/s" /><Metric label="Mass flow" value={format(velocity.kgS)} unit="kg/s" /></div>
        <details className="pipeTableDetails">
          <summary>Table · {pipeStandard}</summary>
          <PipeTable rows={pipeRowsForStandard} selected={resolvedPipeRow} onPick={(row) => { setPipeStandard(row.standard); setPipeNps(row.nps); setPipeSchedule(row.schedule); }} />
        </details>
      </section>

      <section className="panel" id="unit-converter">
        <h2>Unit converter</h2>
        <p className="muted">자주 쓰는 발전/배관 단위를 한 줄에서 바로 환산합니다.</p>
        <div className="converterGrid">
          <label>Category<select value={unitCategory} onChange={(e) => { const next = e.target.value as UnitCategory; setUnitCategory(next); setUnitFrom(UNIT_GROUPS[next][0]); setUnitTo(UNIT_GROUPS[next][1] ?? UNIT_GROUPS[next][0]); }}>{Object.keys(UNIT_GROUPS).map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
          <NumberWithUnit label="From" value={unitValue} onValue={setUnitValue} unit={unitFrom} units={unitOptions} onUnit={setUnitFrom} />
          <label>To<select value={unitTo} onChange={(e) => setUnitTo(e.target.value)}>{unitOptions.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
        </div>
        <div className="converterResult"><span>{format(unitValue)} {unitFrom}</span><strong>= {format(converterResult, 6)} {unitTo}</strong></div>
      </section>

      <section className="panel" id="heat-balance">
        <h2>Heat balance quick check</h2>
        <p className="muted">No heat loss assumption. Enthalpy-based quick check for one missing cold-side flow or outlet enthalpy.</p>
        <div className="miniFields">
          <NumberInput label="Hot flow t/h" value={heat.hotFlow} onValue={(v) => setHeat({ ...heat, hotFlow: v })} />
          <NumberInput label="Hot h in" value={heat.hotIn} onValue={(v) => setHeat({ ...heat, hotIn: v })} />
          <NumberInput label="Hot h out" value={heat.hotOut} onValue={(v) => setHeat({ ...heat, hotOut: v })} />
          <NumberInput label="Cold flow t/h" value={heat.coldFlow} onValue={(v) => setHeat({ ...heat, coldFlow: v })} />
          <NumberInput label="Cold h in" value={heat.coldIn} onValue={(v) => setHeat({ ...heat, coldIn: v })} />
          <NumberInput label="Cold h out target" value={heat.coldOut} onValue={(v) => setHeat({ ...heat, coldOut: v })} />
        </div>
        <div className="resultCards compact"><Metric label="|Q|" value={format(Math.abs(hotDuty))} unit="kW" /><Metric label="Cold h out" value={format(coldOutlet)} unit="kJ/kg" /><Metric label="Req. cold flow" value={format(coldFlow)} unit={heat.coldUnit} /></div>
      </section>

      <section className="panel contentPanel" id="methodology">
        <h2>Trust & methodology</h2>
        <ul>
          <li><b>IAPWS-IF97 basis:</b> steam/water properties are calculated client-side for fast static hosting.</li>
          <li><b>Steam table UX:</b> checked rows are independent inputs; unchecked rows are calculated outputs.</li>
          <li><b>Pipe standards:</b> code/size/schedule values are practical quick-reference subsets.</li>
          <li><b>Disclaimer:</b> engineering reference only. Final design requires latest standard, vendor, and project verification.</li>
        </ul>
      </section>
    </div>}
  </main>;
}

function SaturationAdvisor({ active, quality, tSat, temperatureUnit, liquid, vapor, onQuality, onUseQualityPair }: {
  active: boolean;
  quality: number;
  tSat?: number;
  temperatureUnit: TemperatureUnit;
  liquid?: { enthalpy: number; entropy: number; specificVolume: number };
  vapor?: { enthalpy: number; entropy: number; specificVolume: number };
  onQuality: (quality: number) => void;
  onUseQualityPair: () => void;
}) {
  if (!active) return null;
  const presets = [
    { label: '포화수', value: 0, helper: 'x=0' },
    { label: '기본 습증기', value: 0.5, helper: 'x=0.5' },
    { label: '건포화증기', value: 1, helper: 'x=1' }
  ];
  return <div className="satCard">
    <div className="satHeader">
      <span>포화선 감지</span>
      <strong>P+T만으로는 상태가 하나로 고정되지 않습니다.</strong>
      {tSat !== undefined && <small>현재 압력의 Tsat ≈ {format(tSat)} {temperatureUnit}</small>}
    </div>
    <div className="qualityPresets">
      {presets.map((preset) => <button type="button" className={Math.abs(quality - preset.value) < 0.0001 ? 'chip active' : 'chip'} key={preset.value} onClick={() => onQuality(preset.value)}>
        {preset.label}<small>{preset.helper}</small>
      </button>)}
    </div>
    <label className="qualitySlider">Custom quality x
      <input type="range" min="0" max="1" step="0.01" value={quality} onChange={(e) => onQuality(Number(e.target.value))} />
      <output>{format(quality, 2)}</output>
    </label>
    {liquid && vapor && <div className="satRange">
      <span>포화 범위</span>
      <b>h {format(liquid.enthalpy)} ~ {format(vapor.enthalpy)} kJ/kg</b>
      <b>s {format(liquid.entropy)} ~ {format(vapor.entropy)} kJ/kg·K</b>
      <b>v {format(liquid.specificVolume, 5)} ~ {format(vapor.specificVolume, 5)} m³/kg</b>
    </div>}
    <button type="button" className="secondaryButton" onClick={onUseQualityPair}>입력쌍을 P+x로 전환</button>
  </div>;
}

function SteamTableRow({ field, checked, disabled, value, inputs, onToggle, onSet }: { field: SteamTableField; checked: boolean; disabled: boolean; value: string; inputs: SteamInputs; onToggle: () => void; onSet: <K extends keyof SteamInputs>(key: K, value: SteamInputs[K]) => void }) {
  const meta = fieldLabels[field];
  return <div className={`${checked ? 'steamRow checked' : 'steamRow'}${disabled ? ' disabled' : ''}`}>
    <label className="steamCheck"><input type="checkbox" checked={checked} disabled={disabled} onChange={onToggle} /><span>{meta.symbol}</span></label>
    <div className="steamName"><b>{meta.label}</b><small>{meta.checkable ? 'check = input' : 'calculated only'}</small></div>
    <div className="steamValue">{checked ? <SteamFieldInput field={field} inputs={inputs} onSet={onSet} /> : <ValueWithUnit value={value} unit={displayUnit(field, inputs)} />}</div>
  </div>;
}

function SteamFieldInput({ field, inputs, onSet }: { field: SteamTableField; inputs: SteamInputs; onSet: <K extends keyof SteamInputs>(key: K, value: SteamInputs[K]) => void }) {
  if (field === 'pressure') return <NumberWithUnit label="" value={inputs.pressure} onValue={(v) => onSet('pressure', v)} unit={inputs.pressureUnit} units={pressureUnits} onUnit={(u) => onSet('pressureUnit', u)} />;
  if (field === 'temperature') return <NumberWithUnit label="" value={inputs.temperature} onValue={(v) => onSet('temperature', v)} unit={inputs.temperatureUnit} units={tempUnits} onUnit={(u) => onSet('temperatureUnit', u)} />;
  if (field === 'enthalpy') return <NumberWithUnit label="" value={inputs.enthalpy} onValue={(v) => onSet('enthalpy', v)} unit={inputs.enthalpyUnit} units={hUnits} onUnit={(u) => onSet('enthalpyUnit', u)} />;
  if (field === 'entropy') return <NumberWithFixedUnit label="" value={inputs.entropy} unit="kJ/kg·K" onValue={(v) => onSet('entropy', v)} />;
  if (field === 'quality') return <NumberWithFixedUnit label="" value={inputs.quality} unit="x" onValue={(v) => onSet('quality', v)} />;
  return <output>—</output>;
}

function displayUnit(field: SteamTableField, inputs: SteamInputs) {
  if (field === 'pressure') return inputs.pressureUnit;
  if (field === 'temperature') return inputs.temperatureUnit;
  if (field === 'enthalpy') return 'kJ/kg';
  if (field === 'entropy') return 'kJ/kg·K';
  if (field === 'quality') return 'x';
  return 'm³/kg';
}

function ValueWithUnit({ value, unit }: { value: string; unit: string }) {
  return <output className="valueWithUnit"><strong>{value}</strong><em>{unit}</em></output>;
}

function parseNumericInput(raw: string, fallback: number) {
  const normalized = normalizeNumericText(raw);
  const next = Number(normalized);
  return { text: normalized, value: Number.isFinite(next) ? next : fallback };
}
function NumberInput({ label, value, onValue, disabled = false, helper }: { label: string; value: number; onValue: (value: number) => void; disabled?: boolean; helper?: string }) {
  return <label>{label}<input type="text" inputMode="decimal" value={String(value)} disabled={disabled} onChange={(e) => { const parsed = parseNumericInput(e.target.value, value); e.currentTarget.value = parsed.text; onValue(parsed.value); }} />{helper && <small className="fieldHelper">{helper}</small>}</label>;
}
function NumberWithUnit<T extends string>({ label, value, onValue, unit, units, onUnit }: { label: string; value: number; onValue: (value: number) => void; unit: T; units: readonly T[]; onUnit: (unit: T) => void }) {
  return <label>{label}<div className="unitInput"><input type="text" inputMode="decimal" value={String(value)} onChange={(e) => { const parsed = parseNumericInput(e.target.value, value); e.currentTarget.value = parsed.text; onValue(parsed.value); }} /><select value={unit} onChange={(e) => onUnit(e.target.value as T)}>{units.map((u) => <option key={u}>{u}</option>)}</select></div></label>;
}
function NumberWithFixedUnit({ label, value, unit, onValue, disabled = false, helper }: { label: string; value: number; unit: string; onValue: (value: number) => void; disabled?: boolean; helper?: string }) {
  return <label>{label}<div className="unitInput fixed"><input type="text" inputMode="decimal" value={String(value)} disabled={disabled} onChange={(e) => { const parsed = parseNumericInput(e.target.value, value); e.currentTarget.value = parsed.text; onValue(parsed.value); }} /><span className="unitBadge">{unit}</span></div>{helper && <small className="fieldHelper">{helper}</small>}</label>;
}
function PipeTable({ rows, selected, onPick }: { rows: PipeSizeRow[]; selected: PipeSizeRow; onPick: (row: PipeSizeRow) => void }) {
  return <div className="pipeTableWrap">
    <table className="pipeTable">
      <thead><tr><th>Code</th><th>DN</th><th>NPS/A</th><th>Sch</th><th>OD mm</th><th>ID mm</th></tr></thead>
      <tbody>{rows.map((row) => <tr key={`${row.standard}-${row.nps}-${row.schedule}`} className={row.standard === selected.standard && row.nps === selected.nps && row.schedule === selected.schedule ? 'selected' : ''} onClick={() => onPick(row)}>
        <td>{row.standard}</td><td>DN{row.dn}</td><td>{row.nps}</td><td>{row.schedule}</td><td>{row.odMm}</td><td>{row.idMm}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}
function Metric({ label, value, unit }: { label: string; value: string; unit: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><em>{unit}</em></div>; }

createRoot(document.getElementById('root')!).render(<App />);
