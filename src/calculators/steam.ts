import { solvePT, solvePH, solvePS, solvePx, solveTH, solveTS, Region, type SteamState } from 'iapws-if97';
import { saturationTemperature } from 'iapws-if97/saturation';

export type SteamInputPair = 'PT' | 'PH' | 'PS' | 'Px' | 'TH' | 'TS';
export type SteamTableField = 'pressure' | 'temperature' | 'enthalpy' | 'entropy' | 'quality' | 'specificVolume';
export type SteamFieldChecks = Record<SteamTableField, boolean>;

const FIELD_PAIR_MAP: Record<string, SteamInputPair> = {
  'pressure+temperature': 'PT',
  'enthalpy+pressure': 'PH',
  'entropy+pressure': 'PS',
  'pressure+quality': 'Px',
  'enthalpy+temperature': 'TH',
  'entropy+temperature': 'TS'
};

export function getCheckedSteamFields(checks: SteamFieldChecks): SteamTableField[] {
  return (Object.keys(checks) as SteamTableField[]).filter((field) => checks[field]);
}

export function selectedFieldsToPair(fields: SteamTableField[]): SteamInputPair | undefined {
  if (fields.length !== 2) return undefined;
  const key = [...fields].sort().join('+');
  return FIELD_PAIR_MAP[key];
}

export interface SteamInputs {
  pair: SteamInputPair;
  pressure: number;
  pressureUnit: PressureUnit;
  temperature: number;
  temperatureUnit: TemperatureUnit;
  enthalpy: number;
  enthalpyUnit: EnthalpyUnit;
  entropy: number;
  quality: number;
}

export type PressureUnit = 'MPa' | 'kPa' | 'bar(a)' | 'bar(g)' | 'kgf/cm²' | 'psi';
export type TemperatureUnit = '°C' | 'K' | '°F';
export type EnthalpyUnit = 'kJ/kg' | 'kcal/kg' | 'BTU/lb';

const ATM_MPA = 0.101325;

export function pressureToMPa(value: number, unit: PressureUnit): number {
  switch (unit) {
    case 'MPa': return value;
    case 'kPa': return value / 1000;
    case 'bar(a)': return value / 10;
    case 'bar(g)': return value / 10 + ATM_MPA;
    case 'kgf/cm²': return value * 0.0980665;
    case 'psi': return value * 0.006894757;
  }
}

export function pressureFromMPa(value: number, unit: PressureUnit): number {
  switch (unit) {
    case 'MPa': return value;
    case 'kPa': return value * 1000;
    case 'bar(a)': return value * 10;
    case 'bar(g)': return (value - ATM_MPA) * 10;
    case 'kgf/cm²': return value / 0.0980665;
    case 'psi': return value / 0.006894757;
  }
}

export function tempToK(value: number, unit: TemperatureUnit): number {
  if (unit === 'K') return value;
  if (unit === '°C') return value + 273.15;
  return (value - 32) * 5 / 9 + 273.15;
}

export function tempFromK(value: number, unit: TemperatureUnit): number {
  if (unit === 'K') return value;
  if (unit === '°C') return value - 273.15;
  return (value - 273.15) * 9 / 5 + 32;
}

export function enthalpyToKJkg(value: number, unit: EnthalpyUnit): number {
  if (unit === 'kJ/kg') return value;
  if (unit === 'kcal/kg') return value * 4.1868;
  return value * 2.326;
}

export function enthalpyFromKJkg(value: number, unit: EnthalpyUnit): number {
  if (unit === 'kJ/kg') return value;
  if (unit === 'kcal/kg') return value / 4.1868;
  return value / 2.326;
}

export function regionLabel(state: SteamState): string {
  if (state.region === Region.Region1) return 'Compressed / Subcooled Water';
  if (state.region === Region.Region2) return 'Superheated Steam';
  if (state.region === Region.Region3) return 'Supercritical / Dense Fluid';
  if (state.region === Region.Region4) {
    if (state.quality === 0) return 'Saturated Liquid';
    if (state.quality === 1) return 'Saturated Vapor';
    return 'Wet Steam / Two-phase Mixture';
  }
  if (state.region === Region.Region5) return 'High-temperature Steam';
  return 'Unknown';
}

export function regionTone(state: SteamState): string {
  if (state.region === Region.Region1) return 'liquid';
  if (state.region === Region.Region2 || state.region === Region.Region5) return 'superheated';
  if (state.region === Region.Region4) return 'wet';
  return 'dense';
}

export interface SaturationAssessment {
  ambiguous: boolean;
  resolution: 'quality' | 'single-phase';
  saturationTemperatureK?: number;
  deltaK?: number;
  qualityUsed?: number;
  liquid?: Pick<SteamState, 'enthalpy' | 'entropy' | 'specificVolume'>;
  vapor?: Pick<SteamState, 'enthalpy' | 'entropy' | 'specificVolume'>;
}

export interface SteamResult {
  state?: SteamState;
  saturation: SaturationAssessment;
  error?: string;
  warnings: string[];
}

const SATURATION_TOLERANCE_K = 0.25;

function clampQuality(x: number): number {
  if (!Number.isFinite(x)) return 0.5;
  return Math.min(1, Math.max(0, x));
}

function assessPTSat(p: number, T: number): SaturationAssessment {
  try {
    const saturationTemperatureK = saturationTemperature(p);
    const deltaK = T - saturationTemperatureK;
    return {
      ambiguous: Math.abs(deltaK) <= SATURATION_TOLERANCE_K,
      resolution: Math.abs(deltaK) <= SATURATION_TOLERANCE_K ? 'quality' : 'single-phase',
      saturationTemperatureK,
      deltaK
    };
  } catch {
    return { ambiguous: false, resolution: 'single-phase' };
  }
}

export function solveSteam(inputs: SteamInputs): SteamResult {
  const warnings: string[] = [];
  let saturation: SaturationAssessment = { ambiguous: false, resolution: 'single-phase' };
  try {
    const p = pressureToMPa(inputs.pressure, inputs.pressureUnit);
    const T = tempToK(inputs.temperature, inputs.temperatureUnit);
    const h = enthalpyToKJkg(inputs.enthalpy, inputs.enthalpyUnit);
    const s = inputs.entropy;
    const x = inputs.quality;

    if (inputs.pair.includes('x') && (x < 0 || x > 1)) {
      return { error: 'Dryness fraction / quality x must be between 0 and 1.', saturation, warnings };
    }
    if (inputs.pressureUnit === 'bar(g)') warnings.push('bar(g) is converted to absolute pressure by adding 1.01325 bar.');

    let state: SteamState;
    switch (inputs.pair) {
      case 'PT': {
        saturation = assessPTSat(p, T);
        if (saturation.ambiguous) {
          const qualityUsed = clampQuality(x);
          const liquid = solvePx(p, 0);
          const vapor = solvePx(p, 1);
          state = solvePx(p, qualityUsed);
          saturation = {
            ...saturation,
            qualityUsed,
            liquid: { enthalpy: liquid.enthalpy, entropy: liquid.entropy, specificVolume: liquid.specificVolume },
            vapor: { enthalpy: vapor.enthalpy, entropy: vapor.entropy, specificVolume: vapor.specificVolume }
          };
          warnings.push('P+T가 포화선 위에 있습니다. 압력과 온도는 독립 상태량이 아니므로 기본/사용자 건도 x로 2상 상태를 해석합니다.');
        } else {
          state = solvePT(p, T);
        }
        break;
      }
      case 'PH': state = solvePH(p, h); break;
      case 'PS': state = solvePS(p, s); break;
      case 'Px': state = solvePx(p, x); break;
      case 'TH': state = solveTH(T, h); break;
      case 'TS': state = solveTS(T, s); break;
    }

    if (state.region === Region.Region4) warnings.push('2상/습증기 구간입니다. 건도에 따라 배관 유속·압력강하·밸브/트랩 선정 결과가 달라지므로 최종 설계 전 프로젝트/벤더 기준으로 확인하세요.');
    return { state, saturation, warnings };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error), saturation, warnings };
  }
}

export function format(value: number | null | undefined, digits = 3): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  if (Math.abs(value) >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: digits });
  return value.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
