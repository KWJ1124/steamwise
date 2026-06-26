export type UnitCategory = 'pressure' | 'temperature' | 'specificEnthalpy' | 'specificEntropy' | 'specificVolume' | 'density' | 'massFlow' | 'velocity' | 'length';

export const UNIT_GROUPS: Record<UnitCategory, string[]> = {
  pressure: ['MPa', 'kPa', 'bar(a)', 'bar(g)', 'kgf/cm²', 'psi'],
  temperature: ['°C', 'K', '°F'],
  specificEnthalpy: ['kJ/kg', 'kcal/kg', 'BTU/lb'],
  specificEntropy: ['kJ/kg·K', 'kcal/kg·K', 'BTU/lb·°F'],
  specificVolume: ['m³/kg', 'ft³/lb'],
  density: ['kg/m³', 'lb/ft³'],
  massFlow: ['kg/s', 'kg/h', 't/h', 'lb/h'],
  velocity: ['m/s', 'ft/s'],
  length: ['mm', 'inch', 'm']
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
      break;
    case 'velocity':
      if (unit === 'm/s') return value;
      if (unit === 'ft/s') return value * 0.3048;
      break;
    case 'length':
      if (unit === 'mm') return value;
      if (unit === 'inch') return value * 25.4;
      if (unit === 'm') return value * 1000;
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
      break;
    case 'velocity':
      if (unit === 'm/s') return value;
      if (unit === 'ft/s') return value / 0.3048;
      break;
    case 'length':
      if (unit === 'mm') return value;
      if (unit === 'inch') return value / 25.4;
      if (unit === 'm') return value / 1000;
      break;
  }
  throw new Error(`Unsupported unit ${unit} for ${category}`);
}

export function convertUnit(value: number, category: UnitCategory, fromUnit: string, toUnit: string): number {
  return fromBase(toBase(value, category, fromUnit), category, toUnit);
}
