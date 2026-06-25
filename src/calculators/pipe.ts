export type PipeStandard = 'ASME B36.10/B36.19' | 'JIS G3454/G3455' | 'DIN/EN ISO' | 'KS/JIS compatible';
export type FlowUnit = 'kg/h' | 't/h' | 'kg/s' | 'lb/h';

export interface PipeSizeRow {
  standard: PipeStandard;
  nps: string;
  dn: string;
  schedule: string;
  odMm: number;
  idMm: number;
  note?: string;
}

// Practical reference subset for engineering quick checks. Values are common nominal dimensions;
// always verify final design against the latest project/company standard.
export const PIPE_SIZES: PipeSizeRow[] = [
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '40', odMm: 21.3, idMm: 15.8 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '40', odMm: 26.7, idMm: 20.9 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '40', odMm: 33.4, idMm: 26.6 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '40', odMm: 48.3, idMm: 40.9 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '40', odMm: 60.3, idMm: 52.5 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '40', odMm: 88.9, idMm: 77.9 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '40', odMm: 114.3, idMm: 102.3 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '40', odMm: 168.3, idMm: 154.1 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '40', odMm: 219.1, idMm: 202.7 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '40', odMm: 273.1, idMm: 254.5 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '40', odMm: 323.9, idMm: 303.2 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '80', odMm: 60.3, idMm: 49.3 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '80', odMm: 114.3, idMm: 97.2 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '80', odMm: 168.3, idMm: 146.3 },
  { standard: 'JIS G3454/G3455', nps: '50A', dn: '50', schedule: 'Sch 40', odMm: 60.5, idMm: 52.7, note: 'JIS quick reference' },
  { standard: 'JIS G3454/G3455', nps: '100A', dn: '100', schedule: 'Sch 40', odMm: 114.3, idMm: 102.3, note: 'JIS quick reference' },
  { standard: 'JIS G3454/G3455', nps: '150A', dn: '150', schedule: 'Sch 40', odMm: 165.2, idMm: 155.2, note: 'JIS quick reference' },
  { standard: 'KS/JIS compatible', nps: '50A', dn: '50', schedule: 'SGP approx.', odMm: 60.5, idMm: 53.0, note: 'Approximate KS/JIS-compatible utility pipe' },
  { standard: 'DIN/EN ISO', nps: 'DN50', dn: '50', schedule: 'Series approx.', odMm: 60.3, idMm: 54.5, note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN100', dn: '100', schedule: 'Series approx.', odMm: 114.3, idMm: 107.1, note: 'Approximate EN series quick reference' }
];

export function flowToKgS(value: number, unit: FlowUnit): number {
  if (unit === 'kg/s') return value;
  if (unit === 'kg/h') return value / 3600;
  if (unit === 't/h') return value * 1000 / 3600;
  return value * 0.45359237 / 3600;
}

export function calculateVelocity(massFlow: number, flowUnit: FlowUnit, specificVolume: number, idMm: number) {
  const kgS = flowToKgS(massFlow, flowUnit);
  const volumetricM3S = kgS * specificVolume;
  const diameterM = idMm / 1000;
  const areaM2 = Math.PI * diameterM * diameterM / 4;
  const velocityMS = volumetricM3S / areaM2;
  return { kgS, volumetricM3S, areaM2, velocityMS };
}
