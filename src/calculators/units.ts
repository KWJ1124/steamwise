export type UnitCategory = 'pressure' | 'temperature' | 'specificEnthalpy' | 'specificEntropy' | 'specificVolume' | 'density' | 'massFlow' | 'velocity' | 'length';

export const UNIT_GROUPS: Record<UnitCategory, string[]> = {
  pressure: ['MPa', 'kPa', 'bar(a)', 'bar(g)', 'kgf/cm²', 'psi', 'mmH₂O', 'mmHg', 'torr', 'inH₂O', 'inHg', 'mbar', 'Pa', 'atm'],
  temperature: ['°C', 'K', '°F'],
  specificEnthalpy: ['kJ/kg', 'kcal/kg', 'BTU/lb'],
  specificEntropy: ['kJ/kg·K', 'kcal/kg·K', 'BTU/lb·°F'],
  specificVolume: ['m³/kg', 'ft³/lb'],
  density: ['kg/m³', 'lb/ft³'],
  massFlow: ['kg/s', 'kg/h', 't/h', 'lb/h', 'lb/s', 'lb/min', 'kg/min'],
  velocity: ['m/s', 'ft/s', 'km/h'],
  length: ['mm', 'inch', 'm', 'cm', 'ft']
};

export function normalizeNumericText(raw: string): string {
  const compact = raw.trim().replace(/,/g, '');
  if (compact === '' || compact === '-' || compact === '.' || compact === '-.') return compact;
  const sign = compact.startsWith('-') ? '-' : '';
  const unsigned = sign ? compact.slice(1) : compact;
  const [integerPart, decimalPart] = unsigned.split('.');
  const strippedInteger = integerPart.replace(/^0+(?=\d)/, '');
  const normalizedInteger = strippedInteger === '' ? '0' : strippedInteger;
  if (decimalPart !== undefined) return `${sign}${normalizedInteger}.${decimalPart}`;
  return `${sign}${normalizedInteger}`;
}

export function parseNumericInput(raw: string): { text: string; value: number | undefined } {
  const normalized = normalizeNumericText(raw);
  if (normalized === '' || normalized === '-' || normalized === '.' || normalized === '-.') return { text: normalized, value: undefined };
  const next = Number(normalized);
  return { text: normalized, value: Number.isFinite(next) ? next : undefined };
}


function temperatureToK(value: number, unit: string): number {
  if (unit === 'K') return value;
  if (unit === '°F') return (value - 32) * 5 / 9 + 273.15;
  return value + 273.15;
}

function temperatureFromK(value: number, unit: string): number {
  if (unit === 'K') return value;
  if (unit === '°F') return (value - 273.15) * 9 / 5 + 32;
  return value - 273.15;
}

function toBase(value: number, category: UnitCategory, unit: string): number {
  switch (category) {
    case 'pressure':
      if (unit === 'MPa') return value;
      if (unit === 'kPa') return value / 1000;
      if (unit === 'bar(a)') return value / 10;
      if (unit === 'bar(g)') return (value + 1.01325) / 10;
      if (unit === 'kgf/cm²') return value * 0.0980665;
      if (unit === 'psi') return value * 0.006894757;
      if (unit === 'mmH₂O') return value * 0.00000980665;
      if (unit === 'mmHg') return value * 0.000133322;
      if (unit === 'torr') return value * 0.000133322;
      if (unit === 'inH₂O') return value * 0.000249089;
      if (unit === 'inHg') return value * 0.00338639;
      if (unit === 'mbar') return value * 0.0001;
      if (unit === 'Pa') return value * 0.000001;
      if (unit === 'atm') return value * 0.101325;
      break;
    case 'temperature': return temperatureToK(value, unit);
    case 'specificEnthalpy':
      if (unit === 'kJ/kg') return value;
      if (unit === 'kcal/kg') return value * 4.1868;
      if (unit === 'BTU/lb') return value * 2.326;
      break;
    case 'specificEntropy':
      if (unit === 'kJ/kg·K') return value;
      if (unit === 'kcal/kg·K') return value * 4.1868;
      if (unit === 'BTU/lb·°F') return value * 4.1868;
      break;
    case 'specificVolume':
      if (unit === 'm³/kg') return value;
      if (unit === 'ft³/lb') return value * 0.06242796;
      break;
    case 'density':
      if (unit === 'kg/m³') return value;
      if (unit === 'lb/ft³') return value * 16.018463;
      break;
    case 'massFlow':
      if (unit === 'kg/s') return value;
      if (unit === 'kg/h') return value / 3600;
      if (unit === 't/h') return value * 1000 / 3600;
      if (unit === 'lb/h') return value * 0.45359237 / 3600;
      if (unit === 'lb/s') return value * 0.45359237;
      if (unit === 'lb/min') return value * 0.45359237 / 60;
      if (unit === 'kg/min') return value / 60;
      break;
    case 'velocity':
      if (unit === 'm/s') return value;
      if (unit === 'ft/s') return value * 0.3048;
      if (unit === 'km/h') return value / 3.6;
      break;
    case 'length':
      if (unit === 'mm') return value;
      if (unit === 'inch') return value * 25.4;
      if (unit === 'm') return value * 1000;
      if (unit === 'cm') return value * 10;
      if (unit === 'ft') return value * 304.8;
      break;
  }
  throw new Error(`Unsupported unit ${unit} for ${category}`);
}

function fromBase(value: number, category: UnitCategory, unit: string): number {
  switch (category) {
    case 'pressure':
      if (unit === 'MPa') return value;
      if (unit === 'kPa') return value * 1000;
      if (unit === 'bar(a)') return value * 10;
      if (unit === 'bar(g)') return value * 10 - 1.01325;
      if (unit === 'kgf/cm²') return value / 0.0980665;
      if (unit === 'psi') return value / 0.006894757;
      if (unit === 'mmH₂O') return value / 0.00000980665;
      if (unit === 'mmHg') return value / 0.000133322;
      if (unit === 'torr') return value / 0.000133322;
      if (unit === 'inH₂O') return value / 0.000249089;
      if (unit === 'inHg') return value / 0.00338639;
      if (unit === 'mbar') return value / 0.0001;
      if (unit === 'Pa') return value / 0.000001;
      if (unit === 'atm') return value / 0.101325;
      break;
    case 'temperature': return temperatureFromK(value, unit);
    case 'specificEnthalpy':
      if (unit === 'kJ/kg') return value;
      if (unit === 'kcal/kg') return value / 4.1868;
      if (unit === 'BTU/lb') return value / 2.326;
      break;
    case 'specificEntropy':
      if (unit === 'kJ/kg·K') return value;
      if (unit === 'kcal/kg·K') return value / 4.1868;
      if (unit === 'BTU/lb·°F') return value / 4.1868;
      break;
    case 'specificVolume':
      if (unit === 'm³/kg') return value;
      if (unit === 'ft³/lb') return value / 0.06242796;
      break;
    case 'density':
      if (unit === 'kg/m³') return value;
      if (unit === 'lb/ft³') return value / 16.018463;
      break;
    case 'massFlow':
      if (unit === 'kg/s') return value;
      if (unit === 'kg/h') return value * 3600;
      if (unit === 't/h') return value * 3600 / 1000;
      if (unit === 'lb/h') return value * 3600 / 0.45359237;
      if (unit === 'lb/s') return value / 0.45359237;
      if (unit === 'lb/min') return value * 60 / 0.45359237;
      if (unit === 'kg/min') return value * 60;
      break;
    case 'velocity':
      if (unit === 'm/s') return value;
      if (unit === 'ft/s') return value / 0.3048;
      if (unit === 'km/h') return value * 3.6;
      break;
    case 'length':
      if (unit === 'mm') return value;
      if (unit === 'inch') return value / 25.4;
      if (unit === 'm') return value / 1000;
      if (unit === 'cm') return value / 10;
      if (unit === 'ft') return value / 304.8;
      break;
  }
  throw new Error(`Unsupported unit ${unit} for ${category}`);
}

export function convertUnit(value: number, category: UnitCategory, fromUnit: string, toUnit: string): number {
  return fromBase(toBase(value, category, fromUnit), category, toUnit);
}
