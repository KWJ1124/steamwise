import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import { format, pressureFromMPa, regionLabel, regionTone, solveSteam, tempFromK, type EnthalpyUnit, type PressureUnit, type SteamInputPair, type SteamInputs, type TemperatureUnit } from './calculators/steam';
import { PIPE_SIZES, calculateVelocity, type FlowUnit, type PipeSizeRow } from './calculators/pipe';
import { sideDutyKW, solveColdOutlet, solveMissingColdFlow, type MassFlowUnit } from './calculators/heat';
import './styles.css';

const pressureUnits: PressureUnit[] = ['MPa', 'kPa', 'bar(a)', 'bar(g)', 'kgf/cm²', 'psi'];
const tempUnits: TemperatureUnit[] = ['°C', 'K', '°F'];
const hUnits: EnthalpyUnit[] = ['kJ/kg', 'kcal/kg', 'BTU/lb'];
const pairs: { id: SteamInputPair; label: string; hint: string }[] = [
  { id: 'PT', label: 'P + T', hint: 'Most common quick check' },
  { id: 'PH', label: 'P + h', hint: 'Process / turbine state' },
  { id: 'PS', label: 'P + s', hint: 'Isentropic estimate' },
  { id: 'Px', label: 'P + x', hint: 'Wet steam quality' },
  { id: 'TH', label: 'T + h', hint: 'Inverse solver' },
  { id: 'TS', label: 'T + s', hint: 'Inverse solver' }
];

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
        { name: 'Saturation dome (visual guide)', type: 'line', data: dome, smooth: true, symbol: 'none', lineStyle: { color: '#7aa7c7', width: 2 }, areaStyle: { color: 'rgba(125, 211, 252, .10)' } },
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
  const [inputs, setInputs] = useState<SteamInputs>({ pair: 'PT', pressure: 1, pressureUnit: 'MPa', temperature: 250, temperatureUnit: '°C', enthalpy: 2900, enthalpyUnit: 'kJ/kg', entropy: 6.5, quality: 1 });
  const [records, setRecords] = useState<RecordItem[]>([]);
  const result = useMemo(() => solveSteam(inputs), [inputs]);
  const state = result.state;
  const current: RecordItem | undefined = state ? { id: 'current', label: `${inputs.pair} current`, p: state.pressure, t: tempFromK(state.temperature, '°C'), h: state.enthalpy, s: state.entropy, v: state.specificVolume, x: state.quality, region: regionLabel(state) } : undefined;

  const [pipe, setPipe] = useState<{ row: PipeSizeRow; flow: number; unit: FlowUnit }>({ row: PIPE_SIZES[7], flow: 10, unit: 't/h' });
  const velocity = state ? calculateVelocity(pipe.flow, pipe.unit, state.specificVolume, pipe.row.idMm) : undefined;

  const [heat, setHeat] = useState({ hotFlow: 10, hotUnit: 't/h' as MassFlowUnit, hotIn: 3200, hotOut: 900, coldFlow: 20, coldUnit: 't/h' as MassFlowUnit, coldIn: 420, coldOut: 900 });
  const hotDuty = sideDutyKW({ flow: heat.hotFlow, flowUnit: heat.hotUnit, hIn: heat.hotIn, hOut: heat.hotOut });
  const coldOutlet = solveColdOutlet({ flow: heat.hotFlow, flowUnit: heat.hotUnit, hIn: heat.hotIn, hOut: heat.hotOut }, heat.coldFlow, heat.coldUnit, heat.coldIn);
  const coldFlow = solveMissingColdFlow({ flow: heat.hotFlow, flowUnit: heat.hotUnit, hIn: heat.hotIn, hOut: heat.hotOut }, heat.coldIn, heat.coldOut, heat.coldUnit);

  function set<K extends keyof SteamInputs>(key: K, value: SteamInputs[K]) { setInputs((prev) => ({ ...prev, [key]: value })); }
  function savePoint() { if (current) setRecords((prev) => [...prev, { ...current, id: crypto.randomUUID(), label: `${inputs.pair} · ${new Date().toLocaleTimeString()}` }].slice(-12)); }

  return <main className={mini ? 'app mini' : 'app'}>
    <header className="hero">
      <div>
        <p className="eyebrow">Free static engineering web app · IAPWS-IF97 based</p>
        <h1>SteamWise</h1>
        <p className="subtitle">Select an input pair, enter values, and read the state instantly. Full workbench for analysis, mini mode for a corner-of-screen quick check.</p>
      </div>
      <div className="heroActions">
        <button onClick={() => setMini(!mini)}>{mini ? 'Full workbench' : 'Mini window'}</button>
        <button onClick={savePoint} disabled={!state}>Pin point</button>
        <button onClick={() => setRecords([])}>Clear history</button>
      </div>
    </header>

    <section className="benchmarkNote">
      Workflow: 1) choose P+T, P+h, P+s, P+x, T+h, or T+s → 2) enter plant values → 3) check phase, h, s, v, x, chart point, pipe velocity, or heat balance.
    </section>

    <div className="grid">
      <section className="panel inputPanel">
        <h2>Steam state</h2>
        <div className="chips">{pairs.map((p) => <button className={inputs.pair === p.id ? 'chip active' : 'chip'} key={p.id} onClick={() => set('pair', p.id)}><b>{p.label}</b><span>{p.hint}</span></button>)}</div>
        <div className="formGrid">
          {['PT','PH','PS','Px'].includes(inputs.pair) && <NumberWithUnit label="Pressure" value={inputs.pressure} onValue={(v) => set('pressure', v)} unit={inputs.pressureUnit} units={pressureUnits} onUnit={(u) => set('pressureUnit', u)} />}
          {['PT','TH','TS'].includes(inputs.pair) && <NumberWithUnit label="Temperature" value={inputs.temperature} onValue={(v) => set('temperature', v)} unit={inputs.temperatureUnit} units={tempUnits} onUnit={(u) => set('temperatureUnit', u)} />}
          {['PH','TH'].includes(inputs.pair) && <NumberWithUnit label="Enthalpy" value={inputs.enthalpy} onValue={(v) => set('enthalpy', v)} unit={inputs.enthalpyUnit} units={hUnits} onUnit={(u) => set('enthalpyUnit', u)} />}
          {['PS','TS'].includes(inputs.pair) && <NumberInput label="Entropy kJ/kg·K" value={inputs.entropy} onValue={(v) => set('entropy', v)} />}
          {inputs.pair === 'Px' && <NumberInput label="Quality / dryness x" value={inputs.quality} onValue={(v) => set('quality', v)} />}
        </div>
        {result.error && <div className="error">{result.error}</div>}
        {result.warnings.map((w) => <div className="warn" key={w}>{w}</div>)}
      </section>

      <section className="panel resultPanel">
        <h2>Result</h2>
        {state && <>
          <div className={`stateBadge ${regionTone(state)}`}>{regionLabel(state)}</div>
          <p className="explain">At this condition SteamWise calculates the state from {inputs.pair}. Use it as engineering reference and verify final design with project standards.</p>
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

      {!mini && <section className="panel chartPanel"><h2>Steam chart point</h2><SteamChart records={records} current={current} /><div className="history">{records.map((r) => <button key={r.id}>{r.label}<span>{r.region}</span></button>)}</div></section>}
    </div>

    {!mini && <section className="seoHub" id="guides">
      <article><b>Steam properties</b><span>P-T, P-h, P-s, P-x, T-h, and T-s input pairs for quick plant checks.</span></article>
      <article><b>Pipe sizing reference</b><span>ASME/ANSI, JIS, DIN/EN, and KS/JIS-style quick-reference dimensions for velocity estimates.</span></article>
      <article><b>Heat balance</b><span>Enthalpy-based no-loss quick check for missing cold-side flow or outlet enthalpy.</span></article>
      <article><b>Methodology</b><span>IAPWS-IF97 basis, assumptions, limitations, and final-design verification notes.</span></article>
    </section>}

    {!mini && <div className="toolsGrid">
      <section className="panel" id="pipe-sizing">
        <h2>Pipe size / steam velocity</h2>
        <p className="muted">Includes practical quick-reference pipe dimensions by standard/code family. Final design must verify latest ASME/JIS/DIN/KS project standard.</p>
        <label>Pipe standard & size<select value={PIPE_SIZES.indexOf(pipe.row)} onChange={(e) => setPipe({ ...pipe, row: PIPE_SIZES[Number(e.target.value)] })}>{PIPE_SIZES.map((r, i) => <option key={`${r.standard}-${r.nps}-${r.schedule}-${i}`} value={i}>{r.standard} · {r.nps}/DN{r.dn} · {r.schedule} · ID {r.idMm}mm</option>)}</select></label>
        <NumberWithUnit label="Mass flow" value={pipe.flow} onValue={(v) => setPipe({ ...pipe, flow: v })} unit={pipe.unit} units={['kg/h','t/h','kg/s','lb/h'] as FlowUnit[]} onUnit={(u) => setPipe({ ...pipe, unit: u })} />
        {velocity && <div className="resultCards compact"><Metric label="Velocity" value={format(velocity.velocityMS)} unit="m/s" /><Metric label="Vol. flow" value={format(velocity.volumetricM3S)} unit="m³/s" /><Metric label="Pipe ID" value={format(pipe.row.idMm)} unit="mm" /></div>}
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
          <li><b>Standards:</b> pipe sizes are practical reference subsets for ASME/ANSI, JIS, DIN/EN, and KS/JIS-style workflows.</li>
          <li><b>Advertising rule:</b> ads belong below tools or inside guide pages, never between engineering inputs and results.</li>
          <li><b>Disclaimer:</b> engineering reference only. Final design requires latest standard, vendor, and project verification.</li>
        </ul>
      </section>
    </div>}
  </main>;
}

function toFiniteNumber(raw: string, fallback: number) {
  const next = Number(raw);
  return Number.isFinite(next) ? next : fallback;
}
function NumberInput({ label, value, onValue }: { label: string; value: number; onValue: (value: number) => void }) {
  return <label>{label}<input type="number" value={value} onChange={(e) => onValue(toFiniteNumber(e.target.value, value))} /></label>;
}
function NumberWithUnit<T extends string>({ label, value, onValue, unit, units, onUnit }: { label: string; value: number; onValue: (value: number) => void; unit: T; units: T[]; onUnit: (unit: T) => void }) {
  return <label>{label}<div className="unitInput"><input type="number" value={value} onChange={(e) => onValue(toFiniteNumber(e.target.value, value))} /><select value={unit} onChange={(e) => onUnit(e.target.value as T)}>{units.map((u) => <option key={u}>{u}</option>)}</select></div></label>;
}
function Metric({ label, value, unit }: { label: string; value: string; unit: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><em>{unit}</em></div>; }

createRoot(document.getElementById('root')!).render(<App />);
