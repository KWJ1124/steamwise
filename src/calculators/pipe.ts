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

// Practical reference subset for engineering quick checks. It covers common plant sizes
// and schedules, but final design must always be verified against the latest official
// ASME/JIS/KS/DIN standard and project piping class.
export const PIPE_SIZES: PipeSizeRow[] = [
  // ASME / NPS quick reference, approximate IDs by common wall thickness.
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '10', odMm: 21.3, idMm: 17.1 },
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '40', odMm: 21.3, idMm: 15.8 },
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '80', odMm: 21.3, idMm: 13.9 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '10', odMm: 26.7, idMm: 22.5 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '40', odMm: 26.7, idMm: 20.9 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '80', odMm: 26.7, idMm: 18.8 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '10', odMm: 33.4, idMm: 28.4 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '40', odMm: 33.4, idMm: 26.6 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '80', odMm: 33.4, idMm: 24.3 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '10', odMm: 48.3, idMm: 43.7 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '40', odMm: 48.3, idMm: 40.9 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '80', odMm: 48.3, idMm: 38.1 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '10', odMm: 60.3, idMm: 54.8 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '40', odMm: 60.3, idMm: 52.5 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '80', odMm: 60.3, idMm: 49.3 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '10', odMm: 88.9, idMm: 82.8 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '40', odMm: 88.9, idMm: 77.9 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '80', odMm: 88.9, idMm: 73.7 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '10', odMm: 114.3, idMm: 108.2 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '40', odMm: 114.3, idMm: 102.3 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '80', odMm: 114.3, idMm: 97.2 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '10', odMm: 168.3, idMm: 162.3 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '40', odMm: 168.3, idMm: 154.1 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '80', odMm: 168.3, idMm: 146.3 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '10', odMm: 219.1, idMm: 212.7 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '40', odMm: 219.1, idMm: 202.7 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '80', odMm: 219.1, idMm: 193.7 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '10', odMm: 273.1, idMm: 266.3 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '40', odMm: 273.1, idMm: 254.5 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '80', odMm: 273.1, idMm: 242.9 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '10', odMm: 323.9, idMm: 315.9 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '40', odMm: 323.9, idMm: 303.2 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '80', odMm: 323.9, idMm: 288.8 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '10', odMm: 355.6, idMm: 344.6 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '40', odMm: 355.6, idMm: 333.4 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '10', odMm: 406.4, idMm: 394.8 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '40', odMm: 406.4, idMm: 381.0 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '10', odMm: 457.0, idMm: 444.4 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '40', odMm: 457.0, idMm: 428.6 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '10', odMm: 508.0, idMm: 495.4 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '40', odMm: 508.0, idMm: 477.8 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '10', odMm: 610.0, idMm: 596.8 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '40', odMm: 610.0, idMm: 575.0 },

  // JIS/KS quick reference subset.
  { standard: 'JIS G3454/G3455', nps: '15A', dn: '15', schedule: 'Sch 40', odMm: 21.7, idMm: 16.1, note: 'JIS quick reference' },
  { standard: 'JIS G3454/G3455', nps: '25A', dn: '25', schedule: 'Sch 40', odMm: 34.0, idMm: 27.6, note: 'JIS quick reference' },
  { standard: 'JIS G3454/G3455', nps: '50A', dn: '50', schedule: 'Sch 40', odMm: 60.5, idMm: 52.7, note: 'JIS quick reference' },
  { standard: 'JIS G3454/G3455', nps: '80A', dn: '80', schedule: 'Sch 40', odMm: 89.1, idMm: 78.1, note: 'JIS quick reference' },
  { standard: 'JIS G3454/G3455', nps: '100A', dn: '100', schedule: 'Sch 40', odMm: 114.3, idMm: 102.3, note: 'JIS quick reference' },
  { standard: 'JIS G3454/G3455', nps: '150A', dn: '150', schedule: 'Sch 40', odMm: 165.2, idMm: 155.2, note: 'JIS quick reference' },
  { standard: 'JIS G3454/G3455', nps: '200A', dn: '200', schedule: 'Sch 40', odMm: 216.3, idMm: 204.7, note: 'JIS quick reference' },
  { standard: 'JIS G3454/G3455', nps: '250A', dn: '250', schedule: 'Sch 40', odMm: 267.4, idMm: 254.2, note: 'JIS quick reference' },
  { standard: 'JIS G3454/G3455', nps: '300A', dn: '300', schedule: 'Sch 40', odMm: 318.5, idMm: 304.7, note: 'JIS quick reference' },
  { standard: 'KS/JIS compatible', nps: '50A', dn: '50', schedule: 'SGP approx.', odMm: 60.5, idMm: 53.0, note: 'Approximate KS/JIS-compatible utility pipe' },
  { standard: 'KS/JIS compatible', nps: '100A', dn: '100', schedule: 'SGP approx.', odMm: 114.3, idMm: 105.3, note: 'Approximate KS/JIS-compatible utility pipe' },
  { standard: 'KS/JIS compatible', nps: '150A', dn: '150', schedule: 'SGP approx.', odMm: 165.2, idMm: 155.2, note: 'Approximate KS/JIS-compatible utility pipe' },
  { standard: 'KS/JIS compatible', nps: '200A', dn: '200', schedule: 'SGP approx.', odMm: 216.3, idMm: 204.7, note: 'Approximate KS/JIS-compatible utility pipe' },

  // DIN/EN ISO quick reference subset.
  { standard: 'DIN/EN ISO', nps: 'DN25', dn: '25', schedule: 'Series approx.', odMm: 33.7, idMm: 28.5, note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN50', dn: '50', schedule: 'Series approx.', odMm: 60.3, idMm: 54.5, note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN80', dn: '80', schedule: 'Series approx.', odMm: 88.9, idMm: 82.5, note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN100', dn: '100', schedule: 'Series approx.', odMm: 114.3, idMm: 107.1, note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN150', dn: '150', schedule: 'Series approx.', odMm: 168.3, idMm: 160.3, note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN200', dn: '200', schedule: 'Series approx.', odMm: 219.1, idMm: 211.1, note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN300', dn: '300', schedule: 'Series approx.', odMm: 323.9, idMm: 313.9, note: 'Approximate EN series quick reference' }
];

export function getPipeStandards(): PipeStandard[] {
  return Array.from(new Set(PIPE_SIZES.map((row) => row.standard)));
}

export function getPipeSizes(standard: PipeStandard): string[] {
  return Array.from(new Set(PIPE_SIZES.filter((row) => row.standard === standard).map((row) => row.nps)));
}

export function getPipeSchedules(standard: PipeStandard, nps: string): string[] {
  return Array.from(new Set(PIPE_SIZES.filter((row) => row.standard === standard && row.nps === nps).map((row) => row.schedule)));
}

export function findPipeSize(standard: PipeStandard, nps: string, schedule: string): PipeSizeRow | undefined {
  return PIPE_SIZES.find((row) => row.standard === standard && row.nps === nps && row.schedule === schedule);
}

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
