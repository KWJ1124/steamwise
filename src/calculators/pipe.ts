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

export interface PipePressureDropInput {
  massFlow: number;
  flowUnit: FlowUnit;
  specificVolume: number;
  pipeIdMm: number;
  lengthM: number;
  densityKgM3?: number;
  viscosityPaS?: number;
  roughnessMm?: number;
}

export type FlowRegime = 'laminar' | 'transitional' | 'turbulent';

export interface PipePressureDropResult {
  reynoldsNumber: number;
  flowRegime: FlowRegime;
  darcyFrictionFactor: number;
  pressureDropPa: number;
  pressureDropPerMeterPa: number;
  velocityMS: number;
}

// Comprehensive pipe size reference covering ASME B36.10/B36.19 (NPS 1/2 – 36),
// JIS G3454/G3456 (10A – 600A), and DIN/EN ISO (DN10 – DN1000).
// IDs are calculated from standard wall thicknesses per ASME B36.10M-2004,
// JIS G3454/G3456, and EN 10220 series. Final design must always be verified
// against the latest official standard and project piping class.
export const PIPE_SIZES: PipeSizeRow[] = [
  // ===== ASME B36.10 / B36.19 (NPS 1/2 – 36) =====
  // Sch 5S/10S/40S/80S per B36.19 (stainless); Sch 10/20/30/40/60/80/100/120/140/160/XXS per B36.10

  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '5S', odMm: 21.3, idMm: 18.0 },
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '10S', odMm: 21.3, idMm: 17.1 },
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '10', odMm: 21.3, idMm: 17.1 },
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '40S', odMm: 21.3, idMm: 15.8 },
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '40', odMm: 21.3, idMm: 15.8 },
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '80S', odMm: 21.3, idMm: 13.8 },
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '80', odMm: 21.3, idMm: 13.9 },
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: '160', odMm: 21.3, idMm: 11.7 },
  { standard: 'ASME B36.10/B36.19', nps: '1/2', dn: '15', schedule: 'XXS', odMm: 21.3, idMm: 6.4,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '5S', odMm: 26.7, idMm: 23.4 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '10S', odMm: 26.7, idMm: 22.5 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '10', odMm: 26.7, idMm: 22.5 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '40S', odMm: 26.7, idMm: 21.0 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '40', odMm: 26.7, idMm: 20.9 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '80S', odMm: 26.7, idMm: 18.9 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '80', odMm: 26.7, idMm: 18.8 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: '160', odMm: 26.7, idMm: 15.6 },
  { standard: 'ASME B36.10/B36.19', nps: '3/4', dn: '20', schedule: 'XXS', odMm: 26.7, idMm: 11.1,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '5S', odMm: 33.4, idMm: 30.1 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '10S', odMm: 33.4, idMm: 27.9 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '10', odMm: 33.4, idMm: 28.4 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '40S', odMm: 33.4, idMm: 26.6 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '40', odMm: 33.4, idMm: 26.6 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '80S', odMm: 33.4, idMm: 24.3 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '80', odMm: 33.4, idMm: 24.3 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: '160', odMm: 33.4, idMm: 20.7 },
  { standard: 'ASME B36.10/B36.19', nps: '1', dn: '25', schedule: 'XXS', odMm: 33.4, idMm: 15.2,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '1 1/4', dn: '32', schedule: '5S', odMm: 42.2, idMm: 38.9 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/4', dn: '32', schedule: '10S', odMm: 42.2, idMm: 36.7 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/4', dn: '32', schedule: '10', odMm: 42.2, idMm: 36.7 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/4', dn: '32', schedule: '40S', odMm: 42.2, idMm: 35.1 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/4', dn: '32', schedule: '40', odMm: 42.2, idMm: 35.1 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/4', dn: '32', schedule: '80S', odMm: 42.2, idMm: 32.5 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/4', dn: '32', schedule: '80', odMm: 42.2, idMm: 32.5 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/4', dn: '32', schedule: '160', odMm: 42.2, idMm: 29.5 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/4', dn: '32', schedule: 'XXS', odMm: 42.2, idMm: 22.8,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '5S', odMm: 48.3, idMm: 45.0 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '10S', odMm: 48.3, idMm: 42.8 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '10', odMm: 48.3, idMm: 43.7 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '40S', odMm: 48.3, idMm: 40.9 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '40', odMm: 48.3, idMm: 40.9 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '80S', odMm: 48.3, idMm: 38.1 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '80', odMm: 48.3, idMm: 38.1 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: '160', odMm: 48.3, idMm: 34.0 },
  { standard: 'ASME B36.10/B36.19', nps: '1 1/2', dn: '40', schedule: 'XXS', odMm: 48.3, idMm: 28.0,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '5S', odMm: 60.3, idMm: 57.0 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '10S', odMm: 60.3, idMm: 54.8 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '10', odMm: 60.3, idMm: 54.8 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '40S', odMm: 60.3, idMm: 52.5 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '40', odMm: 60.3, idMm: 52.5 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '80S', odMm: 60.3, idMm: 49.2 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '80', odMm: 60.3, idMm: 49.3 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: '160', odMm: 60.3, idMm: 42.9 },
  { standard: 'ASME B36.10/B36.19', nps: '2', dn: '50', schedule: 'XXS', odMm: 60.3, idMm: 38.2,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '2 1/2', dn: '65', schedule: '5S', odMm: 73.0, idMm: 68.8 },
  { standard: 'ASME B36.10/B36.19', nps: '2 1/2', dn: '65', schedule: '10S', odMm: 73.0, idMm: 66.9 },
  { standard: 'ASME B36.10/B36.19', nps: '2 1/2', dn: '65', schedule: '10', odMm: 73.0, idMm: 66.9 },
  { standard: 'ASME B36.10/B36.19', nps: '2 1/2', dn: '65', schedule: '40S', odMm: 73.0, idMm: 62.7 },
  { standard: 'ASME B36.10/B36.19', nps: '2 1/2', dn: '65', schedule: '40', odMm: 73.0, idMm: 62.7 },
  { standard: 'ASME B36.10/B36.19', nps: '2 1/2', dn: '65', schedule: '80S', odMm: 73.0, idMm: 59.0 },
  { standard: 'ASME B36.10/B36.19', nps: '2 1/2', dn: '65', schedule: '80', odMm: 73.0, idMm: 59.0 },
  { standard: 'ASME B36.10/B36.19', nps: '2 1/2', dn: '65', schedule: '160', odMm: 73.0, idMm: 53.9 },
  { standard: 'ASME B36.10/B36.19', nps: '2 1/2', dn: '65', schedule: 'XXS', odMm: 73.0, idMm: 45.0,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '5S', odMm: 88.9, idMm: 84.7 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '10S', odMm: 88.9, idMm: 82.8 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '10', odMm: 88.9, idMm: 82.8 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '40S', odMm: 88.9, idMm: 77.9 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '40', odMm: 88.9, idMm: 77.9 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '80S', odMm: 88.9, idMm: 73.7 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '80', odMm: 88.9, idMm: 73.7 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: '160', odMm: 88.9, idMm: 66.6 },
  { standard: 'ASME B36.10/B36.19', nps: '3', dn: '80', schedule: 'XXS', odMm: 88.9, idMm: 58.4,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '3 1/2', dn: '90', schedule: '5S', odMm: 101.6, idMm: 97.4 },
  { standard: 'ASME B36.10/B36.19', nps: '3 1/2', dn: '90', schedule: '10S', odMm: 101.6, idMm: 95.5 },
  { standard: 'ASME B36.10/B36.19', nps: '3 1/2', dn: '90', schedule: '10', odMm: 101.6, idMm: 95.5 },
  { standard: 'ASME B36.10/B36.19', nps: '3 1/2', dn: '90', schedule: '40S', odMm: 101.6, idMm: 90.1 },
  { standard: 'ASME B36.10/B36.19', nps: '3 1/2', dn: '90', schedule: '40', odMm: 101.6, idMm: 90.1 },
  { standard: 'ASME B36.10/B36.19', nps: '3 1/2', dn: '90', schedule: '80S', odMm: 101.6, idMm: 85.4 },
  { standard: 'ASME B36.10/B36.19', nps: '3 1/2', dn: '90', schedule: '80', odMm: 101.6, idMm: 85.4 },

  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '5S', odMm: 114.3, idMm: 110.1 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '10S', odMm: 114.3, idMm: 108.2 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '10', odMm: 114.3, idMm: 108.2 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '40S', odMm: 114.3, idMm: 102.3 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '40', odMm: 114.3, idMm: 102.3 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '80S', odMm: 114.3, idMm: 97.2 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '80', odMm: 114.3, idMm: 97.2 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '120', odMm: 114.3, idMm: 92.0 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: '160', odMm: 114.3, idMm: 87.3 },
  { standard: 'ASME B36.10/B36.19', nps: '4', dn: '100', schedule: 'XXS', odMm: 114.3, idMm: 80.1,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '5', dn: '125', schedule: '5S', odMm: 141.3, idMm: 135.8 },
  { standard: 'ASME B36.10/B36.19', nps: '5', dn: '125', schedule: '10S', odMm: 141.3, idMm: 134.5 },
  { standard: 'ASME B36.10/B36.19', nps: '5', dn: '125', schedule: '10', odMm: 141.3, idMm: 134.5 },
  { standard: 'ASME B36.10/B36.19', nps: '5', dn: '125', schedule: '40S', odMm: 141.3, idMm: 128.2 },
  { standard: 'ASME B36.10/B36.19', nps: '5', dn: '125', schedule: '40', odMm: 141.3, idMm: 128.2 },
  { standard: 'ASME B36.10/B36.19', nps: '5', dn: '125', schedule: '80S', odMm: 141.3, idMm: 122.2 },
  { standard: 'ASME B36.10/B36.19', nps: '5', dn: '125', schedule: '80', odMm: 141.3, idMm: 122.2 },
  { standard: 'ASME B36.10/B36.19', nps: '5', dn: '125', schedule: '120', odMm: 141.3, idMm: 115.9 },
  { standard: 'ASME B36.10/B36.19', nps: '5', dn: '125', schedule: '160', odMm: 141.3, idMm: 109.5 },
  { standard: 'ASME B36.10/B36.19', nps: '5', dn: '125', schedule: 'XXS', odMm: 141.3, idMm: 103.2,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '5S', odMm: 168.3, idMm: 162.8 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '10S', odMm: 168.3, idMm: 161.5 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '10', odMm: 168.3, idMm: 160.7 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '40S', odMm: 168.3, idMm: 154.1 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '40', odMm: 168.3, idMm: 154.1 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '80S', odMm: 168.3, idMm: 146.4 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '80', odMm: 168.3, idMm: 146.3 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '120', odMm: 168.3, idMm: 139.8 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: '160', odMm: 168.3, idMm: 131.8 },
  { standard: 'ASME B36.10/B36.19', nps: '6', dn: '150', schedule: 'XXS', odMm: 168.3, idMm: 124.4,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '5S', odMm: 219.1, idMm: 213.6 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '10S', odMm: 219.1, idMm: 211.6 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '10', odMm: 219.1, idMm: 212.7 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '20', odMm: 219.1, idMm: 209.5 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '30', odMm: 219.1, idMm: 208.0 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '40S', odMm: 219.1, idMm: 202.7 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '40', odMm: 219.1, idMm: 202.7 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '60', odMm: 219.1, idMm: 198.5 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '80S', odMm: 219.1, idMm: 193.7 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '80', odMm: 219.1, idMm: 193.7 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '100', odMm: 219.1, idMm: 188.9 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '120', odMm: 219.1, idMm: 182.6 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '140', odMm: 219.1, idMm: 177.9 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: '160', odMm: 219.1, idMm: 173.1 },
  { standard: 'ASME B36.10/B36.19', nps: '8', dn: '200', schedule: 'XXS', odMm: 219.1, idMm: 174.6,
    note: 'Double Extra Strong (XXS)' },

  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '5S', odMm: 273.1, idMm: 266.3 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '10S', odMm: 273.1, idMm: 264.7 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '10', odMm: 273.1, idMm: 266.3 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '20', odMm: 273.1, idMm: 263.5 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '30', odMm: 273.1, idMm: 260.4 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '40S', odMm: 273.1, idMm: 254.6 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '40', odMm: 273.1, idMm: 254.5 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '60', odMm: 273.1, idMm: 247.7 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '80S', odMm: 273.1, idMm: 242.9 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '80', odMm: 273.1, idMm: 242.9 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '100', odMm: 273.1, idMm: 236.6 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '120', odMm: 273.1, idMm: 230.2 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '140', odMm: 273.1, idMm: 222.3 },
  { standard: 'ASME B36.10/B36.19', nps: '10', dn: '250', schedule: '160', odMm: 273.1, idMm: 215.9 },

  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '5S', odMm: 323.9, idMm: 316.0 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '10S', odMm: 323.9, idMm: 314.8 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '10', odMm: 323.9, idMm: 315.9 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '20', odMm: 323.9, idMm: 312.8 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '30', odMm: 323.9, idMm: 311.2 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '40S', odMm: 323.9, idMm: 303.3 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '40', odMm: 323.9, idMm: 303.2 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '60', odMm: 323.9, idMm: 295.4 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '80S', odMm: 323.9, idMm: 288.9 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '80', odMm: 323.9, idMm: 288.8 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '100', odMm: 323.9, idMm: 281.0 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '120', odMm: 323.9, idMm: 273.1 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '140', odMm: 323.9, idMm: 266.7 },
  { standard: 'ASME B36.10/B36.19', nps: '12', dn: '300', schedule: '160', odMm: 323.9, idMm: 257.3 },

  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '10', odMm: 355.6, idMm: 344.6 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '20', odMm: 355.6, idMm: 342.9 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '30', odMm: 355.6, idMm: 339.8 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '40', odMm: 355.6, idMm: 333.4 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '60', odMm: 355.6, idMm: 325.4 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '80', odMm: 355.6, idMm: 317.5 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '100', odMm: 355.6, idMm: 307.9 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '120', odMm: 355.6, idMm: 300.0 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '140', odMm: 355.6, idMm: 292.1 },
  { standard: 'ASME B36.10/B36.19', nps: '14', dn: '350', schedule: '160', odMm: 355.6, idMm: 284.2 },

  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '10', odMm: 406.4, idMm: 394.8 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '20', odMm: 406.4, idMm: 393.7 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '30', odMm: 406.4, idMm: 390.6 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '40', odMm: 406.4, idMm: 381.0 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '60', odMm: 406.4, idMm: 373.1 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '80', odMm: 406.4, idMm: 363.5 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '100', odMm: 406.4, idMm: 354.0 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '120', odMm: 406.4, idMm: 344.5 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '140', odMm: 406.4, idMm: 333.3 },
  { standard: 'ASME B36.10/B36.19', nps: '16', dn: '400', schedule: '160', odMm: 406.4, idMm: 325.4 },

  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '10', odMm: 457.0, idMm: 444.4 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '20', odMm: 457.0, idMm: 444.3 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '30', odMm: 457.0, idMm: 441.2 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '40', odMm: 457.0, idMm: 428.6 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '60', odMm: 457.0, idMm: 418.9 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '80', odMm: 457.0, idMm: 409.3 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '100', odMm: 457.0, idMm: 398.3 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '120', odMm: 457.0, idMm: 387.1 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '140', odMm: 457.0, idMm: 377.7 },
  { standard: 'ASME B36.10/B36.19', nps: '18', dn: '450', schedule: '160', odMm: 457.0, idMm: 366.5 },

  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '10', odMm: 508.0, idMm: 495.4 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '20', odMm: 508.0, idMm: 495.3 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '30', odMm: 508.0, idMm: 488.9 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '40', odMm: 508.0, idMm: 477.8 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '60', odMm: 508.0, idMm: 466.8 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '80', odMm: 508.0, idMm: 455.6 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '100', odMm: 508.0, idMm: 442.9 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '120', odMm: 508.0, idMm: 431.8 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '140', odMm: 508.0, idMm: 419.1 },
  { standard: 'ASME B36.10/B36.19', nps: '20', dn: '500', schedule: '160', odMm: 508.0, idMm: 408.0 },

  { standard: 'ASME B36.10/B36.19', nps: '22', dn: '550', schedule: '10', odMm: 558.8, idMm: 547.7 },
  { standard: 'ASME B36.10/B36.19', nps: '22', dn: '550', schedule: '20', odMm: 558.8, idMm: 546.1 },
  { standard: 'ASME B36.10/B36.19', nps: '22', dn: '550', schedule: '30', odMm: 558.8, idMm: 539.7 },
  { standard: 'ASME B36.10/B36.19', nps: '22', dn: '550', schedule: '40', odMm: 558.8, idMm: 528.6 },
  { standard: 'ASME B36.10/B36.19', nps: '22', dn: '550', schedule: '60', odMm: 558.8, idMm: 517.6 },
  { standard: 'ASME B36.10/B36.19', nps: '22', dn: '550', schedule: '80', odMm: 558.8, idMm: 506.4 },
  { standard: 'ASME B36.10/B36.19', nps: '22', dn: '550', schedule: '100', odMm: 558.8, idMm: 493.7 },
  { standard: 'ASME B36.10/B36.19', nps: '22', dn: '550', schedule: '120', odMm: 558.8, idMm: 482.6 },
  { standard: 'ASME B36.10/B36.19', nps: '22', dn: '550', schedule: '140', odMm: 558.8, idMm: 469.9 },
  { standard: 'ASME B36.10/B36.19', nps: '22', dn: '550', schedule: '160', odMm: 558.8, idMm: 458.8 },

  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '10', odMm: 610.0, idMm: 596.8 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '20', odMm: 610.0, idMm: 597.3 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '30', odMm: 610.0, idMm: 590.9 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '40', odMm: 610.0, idMm: 575.0 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '60', odMm: 610.0, idMm: 560.8 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '80', odMm: 610.0, idMm: 548.1 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '100', odMm: 610.0, idMm: 532.2 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '120', odMm: 610.0, idMm: 518.0 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '140', odMm: 610.0, idMm: 502.0 },
  { standard: 'ASME B36.10/B36.19', nps: '24', dn: '600', schedule: '160', odMm: 610.0, idMm: 490.9 },

  { standard: 'ASME B36.10/B36.19', nps: '26', dn: '650', schedule: '10', odMm: 660.4, idMm: 649.3 },
  { standard: 'ASME B36.10/B36.19', nps: '26', dn: '650', schedule: '20', odMm: 660.4, idMm: 644.6 },
  { standard: 'ASME B36.10/B36.19', nps: '26', dn: '650', schedule: '30', odMm: 660.4, idMm: 635.0 },
  { standard: 'ASME B36.10/B36.19', nps: '26', dn: '650', schedule: '40', odMm: 660.4, idMm: 630.2 },

  { standard: 'ASME B36.10/B36.19', nps: '28', dn: '700', schedule: '10', odMm: 711.2, idMm: 700.1 },
  { standard: 'ASME B36.10/B36.19', nps: '28', dn: '700', schedule: '20', odMm: 711.2, idMm: 695.4 },
  { standard: 'ASME B36.10/B36.19', nps: '28', dn: '700', schedule: '30', odMm: 711.2, idMm: 685.8 },
  { standard: 'ASME B36.10/B36.19', nps: '28', dn: '700', schedule: '40', odMm: 711.2, idMm: 681.0 },

  { standard: 'ASME B36.10/B36.19', nps: '30', dn: '750', schedule: '10', odMm: 762.0, idMm: 750.9 },
  { standard: 'ASME B36.10/B36.19', nps: '30', dn: '750', schedule: '20', odMm: 762.0, idMm: 746.2 },
  { standard: 'ASME B36.10/B36.19', nps: '30', dn: '750', schedule: '30', odMm: 762.0, idMm: 736.6 },
  { standard: 'ASME B36.10/B36.19', nps: '30', dn: '750', schedule: '40', odMm: 762.0, idMm: 731.8 },

  { standard: 'ASME B36.10/B36.19', nps: '32', dn: '800', schedule: '10', odMm: 812.8, idMm: 801.7 },
  { standard: 'ASME B36.10/B36.19', nps: '32', dn: '800', schedule: '20', odMm: 812.8, idMm: 797.0 },
  { standard: 'ASME B36.10/B36.19', nps: '32', dn: '800', schedule: '30', odMm: 812.8, idMm: 787.4 },
  { standard: 'ASME B36.10/B36.19', nps: '32', dn: '800', schedule: '40', odMm: 812.8, idMm: 782.6 },

  { standard: 'ASME B36.10/B36.19', nps: '34', dn: '850', schedule: '10', odMm: 863.6, idMm: 852.5 },
  { standard: 'ASME B36.10/B36.19', nps: '34', dn: '850', schedule: '20', odMm: 863.6, idMm: 847.8 },
  { standard: 'ASME B36.10/B36.19', nps: '34', dn: '850', schedule: '30', odMm: 863.6, idMm: 838.2 },
  { standard: 'ASME B36.10/B36.19', nps: '34', dn: '850', schedule: '40', odMm: 863.6, idMm: 833.4 },

  { standard: 'ASME B36.10/B36.19', nps: '36', dn: '900', schedule: '10', odMm: 914.4, idMm: 903.3 },
  { standard: 'ASME B36.10/B36.19', nps: '36', dn: '900', schedule: '20', odMm: 914.4, idMm: 898.6 },
  { standard: 'ASME B36.10/B36.19', nps: '36', dn: '900', schedule: '30', odMm: 914.4, idMm: 889.0 },
  { standard: 'ASME B36.10/B36.19', nps: '36', dn: '900', schedule: '40', odMm: 914.4, idMm: 884.2 },

  // ===== JIS G3454 / G3456 (10A – 600A) =====

  { standard: 'JIS G3454/G3455', nps: '10A', dn: '10', schedule: 'Sch 10', odMm: 17.3, idMm: 13.3 },
  { standard: 'JIS G3454/G3455', nps: '10A', dn: '10', schedule: 'Sch 20', odMm: 17.3, idMm: 12.7 },
  { standard: 'JIS G3454/G3455', nps: '10A', dn: '10', schedule: 'Sch 40', odMm: 17.3, idMm: 11.7 },
  { standard: 'JIS G3454/G3455', nps: '10A', dn: '10', schedule: 'Sch 80', odMm: 17.3, idMm: 10.9 },

  { standard: 'JIS G3454/G3455', nps: '15A', dn: '15', schedule: 'Sch 10', odMm: 21.7, idMm: 17.7 },
  { standard: 'JIS G3454/G3455', nps: '15A', dn: '15', schedule: 'Sch 20', odMm: 21.7, idMm: 17.1 },
  { standard: 'JIS G3454/G3455', nps: '15A', dn: '15', schedule: 'Sch 40', odMm: 21.7, idMm: 16.1 },
  { standard: 'JIS G3454/G3455', nps: '15A', dn: '15', schedule: 'Sch 80', odMm: 21.7, idMm: 15.3 },

  { standard: 'JIS G3454/G3455', nps: '20A', dn: '20', schedule: 'Sch 10', odMm: 27.2, idMm: 23.2 },
  { standard: 'JIS G3454/G3455', nps: '20A', dn: '20', schedule: 'Sch 20', odMm: 27.2, idMm: 22.6 },
  { standard: 'JIS G3454/G3455', nps: '20A', dn: '20', schedule: 'Sch 40', odMm: 27.2, idMm: 21.6 },
  { standard: 'JIS G3454/G3455', nps: '20A', dn: '20', schedule: 'Sch 80', odMm: 27.2, idMm: 20.2 },

  { standard: 'JIS G3454/G3455', nps: '25A', dn: '25', schedule: 'Sch 10', odMm: 34.0, idMm: 29.4 },
  { standard: 'JIS G3454/G3455', nps: '25A', dn: '25', schedule: 'Sch 20', odMm: 34.0, idMm: 28.4 },
  { standard: 'JIS G3454/G3455', nps: '25A', dn: '25', schedule: 'Sch 40', odMm: 34.0, idMm: 27.6 },
  { standard: 'JIS G3454/G3455', nps: '25A', dn: '25', schedule: 'Sch 80', odMm: 34.0, idMm: 26.0 },

  { standard: 'JIS G3454/G3455', nps: '32A', dn: '32', schedule: 'Sch 10', odMm: 42.7, idMm: 38.1 },
  { standard: 'JIS G3454/G3455', nps: '32A', dn: '32', schedule: 'Sch 20', odMm: 42.7, idMm: 37.1 },
  { standard: 'JIS G3454/G3455', nps: '32A', dn: '32', schedule: 'Sch 40', odMm: 42.7, idMm: 35.7 },
  { standard: 'JIS G3454/G3455', nps: '32A', dn: '32', schedule: 'Sch 80', odMm: 42.7, idMm: 33.7 },

  { standard: 'JIS G3454/G3455', nps: '40A', dn: '40', schedule: 'Sch 10', odMm: 48.6, idMm: 44.0 },
  { standard: 'JIS G3454/G3455', nps: '40A', dn: '40', schedule: 'Sch 20', odMm: 48.6, idMm: 43.0 },
  { standard: 'JIS G3454/G3455', nps: '40A', dn: '40', schedule: 'Sch 40', odMm: 48.6, idMm: 41.6 },
  { standard: 'JIS G3454/G3455', nps: '40A', dn: '40', schedule: 'Sch 80', odMm: 48.6, idMm: 39.6 },

  { standard: 'JIS G3454/G3455', nps: '50A', dn: '50', schedule: 'Sch 10', odMm: 60.5, idMm: 54.9 },
  { standard: 'JIS G3454/G3455', nps: '50A', dn: '50', schedule: 'Sch 20', odMm: 60.5, idMm: 54.1 },
  { standard: 'JIS G3454/G3455', nps: '50A', dn: '50', schedule: 'Sch 40', odMm: 60.5, idMm: 52.7 },
  { standard: 'JIS G3454/G3455', nps: '50A', dn: '50', schedule: 'Sch 80', odMm: 60.5, idMm: 49.5 },

  { standard: 'JIS G3454/G3455', nps: '65A', dn: '65', schedule: 'Sch 10', odMm: 76.3, idMm: 69.9 },
  { standard: 'JIS G3454/G3455', nps: '65A', dn: '65', schedule: 'Sch 20', odMm: 76.3, idMm: 69.3 },
  { standard: 'JIS G3454/G3455', nps: '65A', dn: '65', schedule: 'Sch 40', odMm: 76.3, idMm: 65.9 },
  { standard: 'JIS G3454/G3455', nps: '65A', dn: '65', schedule: 'Sch 80', odMm: 76.3, idMm: 62.3 },

  { standard: 'JIS G3454/G3455', nps: '80A', dn: '80', schedule: 'Sch 10', odMm: 89.1, idMm: 82.1 },
  { standard: 'JIS G3454/G3455', nps: '80A', dn: '80', schedule: 'Sch 20', odMm: 89.1, idMm: 81.1 },
  { standard: 'JIS G3454/G3455', nps: '80A', dn: '80', schedule: 'Sch 40', odMm: 89.1, idMm: 78.1 },
  { standard: 'JIS G3454/G3455', nps: '80A', dn: '80', schedule: 'Sch 80', odMm: 89.1, idMm: 74.1 },

  { standard: 'JIS G3454/G3455', nps: '90A', dn: '90', schedule: 'Sch 10', odMm: 101.6, idMm: 94.6 },
  { standard: 'JIS G3454/G3455', nps: '90A', dn: '90', schedule: 'Sch 20', odMm: 101.6, idMm: 93.6 },
  { standard: 'JIS G3454/G3455', nps: '90A', dn: '90', schedule: 'Sch 40', odMm: 101.6, idMm: 90.2 },
  { standard: 'JIS G3454/G3455', nps: '90A', dn: '90', schedule: 'Sch 80', odMm: 101.6, idMm: 85.6 },

  { standard: 'JIS G3454/G3455', nps: '100A', dn: '100', schedule: 'Sch 10', odMm: 114.3, idMm: 106.3 },
  { standard: 'JIS G3454/G3455', nps: '100A', dn: '100', schedule: 'Sch 20', odMm: 114.3, idMm: 105.3 },
  { standard: 'JIS G3454/G3455', nps: '100A', dn: '100', schedule: 'Sch 40', odMm: 114.3, idMm: 102.3 },
  { standard: 'JIS G3454/G3455', nps: '100A', dn: '100', schedule: 'Sch 80', odMm: 114.3, idMm: 97.3 },

  { standard: 'JIS G3454/G3455', nps: '125A', dn: '125', schedule: 'Sch 10', odMm: 139.8, idMm: 131.8 },
  { standard: 'JIS G3454/G3455', nps: '125A', dn: '125', schedule: 'Sch 20', odMm: 139.8, idMm: 130.8 },
  { standard: 'JIS G3454/G3455', nps: '125A', dn: '125', schedule: 'Sch 40', odMm: 139.8, idMm: 126.8 },
  { standard: 'JIS G3454/G3455', nps: '125A', dn: '125', schedule: 'Sch 80', odMm: 139.8, idMm: 121.8 },

  { standard: 'JIS G3454/G3455', nps: '150A', dn: '150', schedule: 'Sch 10', odMm: 165.2, idMm: 156.2 },
  { standard: 'JIS G3454/G3455', nps: '150A', dn: '150', schedule: 'Sch 20', odMm: 165.2, idMm: 155.2 },
  { standard: 'JIS G3454/G3455', nps: '150A', dn: '150', schedule: 'Sch 40', odMm: 165.2, idMm: 155.2 },
  { standard: 'JIS G3454/G3455', nps: '150A', dn: '150', schedule: 'Sch 80', odMm: 165.2, idMm: 151.2 },

  { standard: 'JIS G3454/G3455', nps: '200A', dn: '200', schedule: 'Sch 10', odMm: 216.3, idMm: 206.3 },
  { standard: 'JIS G3454/G3455', nps: '200A', dn: '200', schedule: 'Sch 20', odMm: 216.3, idMm: 205.3 },
  { standard: 'JIS G3454/G3455', nps: '200A', dn: '200', schedule: 'Sch 40', odMm: 216.3, idMm: 204.7 },
  { standard: 'JIS G3454/G3455', nps: '200A', dn: '200', schedule: 'Sch 80', odMm: 216.3, idMm: 199.9 },

  { standard: 'JIS G3454/G3455', nps: '250A', dn: '250', schedule: 'Sch 10', odMm: 267.4, idMm: 256.4 },
  { standard: 'JIS G3454/G3455', nps: '250A', dn: '250', schedule: 'Sch 20', odMm: 267.4, idMm: 255.4 },
  { standard: 'JIS G3454/G3455', nps: '250A', dn: '250', schedule: 'Sch 40', odMm: 267.4, idMm: 254.2 },
  { standard: 'JIS G3454/G3455', nps: '250A', dn: '250', schedule: 'Sch 80', odMm: 267.4, idMm: 248.8 },

  { standard: 'JIS G3454/G3455', nps: '300A', dn: '300', schedule: 'Sch 10', odMm: 318.5, idMm: 306.5 },
  { standard: 'JIS G3454/G3455', nps: '300A', dn: '300', schedule: 'Sch 20', odMm: 318.5, idMm: 305.5 },
  { standard: 'JIS G3454/G3455', nps: '300A', dn: '300', schedule: 'Sch 40', odMm: 318.5, idMm: 304.7 },
  { standard: 'JIS G3454/G3455', nps: '300A', dn: '300', schedule: 'Sch 80', odMm: 318.5, idMm: 297.9 },

  { standard: 'JIS G3454/G3455', nps: '350A', dn: '350', schedule: 'Sch 10', odMm: 355.6, idMm: 343.6 },
  { standard: 'JIS G3454/G3455', nps: '350A', dn: '350', schedule: 'Sch 20', odMm: 355.6, idMm: 341.6 },
  { standard: 'JIS G3454/G3455', nps: '350A', dn: '350', schedule: 'Sch 40', odMm: 355.6, idMm: 341.6 },
  { standard: 'JIS G3454/G3455', nps: '350A', dn: '350', schedule: 'Sch 80', odMm: 355.6, idMm: 333.6 },

  { standard: 'JIS G3454/G3455', nps: '400A', dn: '400', schedule: 'Sch 10', odMm: 406.4, idMm: 393.4 },
  { standard: 'JIS G3454/G3455', nps: '400A', dn: '400', schedule: 'Sch 20', odMm: 406.4, idMm: 390.4 },
  { standard: 'JIS G3454/G3455', nps: '400A', dn: '400', schedule: 'Sch 40', odMm: 406.4, idMm: 390.4 },
  { standard: 'JIS G3454/G3455', nps: '400A', dn: '400', schedule: 'Sch 80', odMm: 406.4, idMm: 382.4 },

  { standard: 'JIS G3454/G3455', nps: '450A', dn: '450', schedule: 'Sch 10', odMm: 457.2, idMm: 444.2 },
  { standard: 'JIS G3454/G3455', nps: '450A', dn: '450', schedule: 'Sch 20', odMm: 457.2, idMm: 441.2 },
  { standard: 'JIS G3454/G3455', nps: '450A', dn: '450', schedule: 'Sch 40', odMm: 457.2, idMm: 441.2 },
  { standard: 'JIS G3454/G3455', nps: '450A', dn: '450', schedule: 'Sch 80', odMm: 457.2, idMm: 432.2 },

  { standard: 'JIS G3454/G3455', nps: '500A', dn: '500', schedule: 'Sch 10', odMm: 508.0, idMm: 495.0 },
  { standard: 'JIS G3454/G3455', nps: '500A', dn: '500', schedule: 'Sch 20', odMm: 508.0, idMm: 492.0 },
  { standard: 'JIS G3454/G3455', nps: '500A', dn: '500', schedule: 'Sch 40', odMm: 508.0, idMm: 492.0 },
  { standard: 'JIS G3454/G3455', nps: '500A', dn: '500', schedule: 'Sch 80', odMm: 508.0, idMm: 482.0 },

  { standard: 'JIS G3454/G3455', nps: '600A', dn: '600', schedule: 'Sch 10', odMm: 609.6, idMm: 596.6 },
  { standard: 'JIS G3454/G3455', nps: '600A', dn: '600', schedule: 'Sch 20', odMm: 609.6, idMm: 593.6 },
  { standard: 'JIS G3454/G3455', nps: '600A', dn: '600', schedule: 'Sch 40', odMm: 609.6, idMm: 593.6 },
  { standard: 'JIS G3454/G3455', nps: '600A', dn: '600', schedule: 'Sch 80', odMm: 609.6, idMm: 581.6 },

  // ===== KS/JIS compatible (utility pipe, SGP approx.) =====

  { standard: 'KS/JIS compatible', nps: '50A', dn: '50', schedule: 'SGP approx.', odMm: 60.5, idMm: 53.0,
    note: 'Approximate KS/JIS-compatible utility pipe' },
  { standard: 'KS/JIS compatible', nps: '100A', dn: '100', schedule: 'SGP approx.', odMm: 114.3, idMm: 105.3,
    note: 'Approximate KS/JIS-compatible utility pipe' },
  { standard: 'KS/JIS compatible', nps: '150A', dn: '150', schedule: 'SGP approx.', odMm: 165.2, idMm: 155.2,
    note: 'Approximate KS/JIS-compatible utility pipe' },
  { standard: 'KS/JIS compatible', nps: '200A', dn: '200', schedule: 'SGP approx.', odMm: 216.3, idMm: 204.7,
    note: 'Approximate KS/JIS-compatible utility pipe' },

  // ===== DIN / EN ISO (DN10 – DN1000) =====
  // Series 1 = light, Series 2 (Series approx.) = medium, Series 3 = heavy — per EN 10220

  { standard: 'DIN/EN ISO', nps: 'DN10', dn: '10', schedule: 'Series 1', odMm: 17.2, idMm: 13.6 },
  { standard: 'DIN/EN ISO', nps: 'DN10', dn: '10', schedule: 'Series 2', odMm: 17.2, idMm: 13.2 },
  { standard: 'DIN/EN ISO', nps: 'DN10', dn: '10', schedule: 'Series 3', odMm: 17.2, idMm: 12.6 },

  { standard: 'DIN/EN ISO', nps: 'DN15', dn: '15', schedule: 'Series 1', odMm: 21.3, idMm: 17.3 },
  { standard: 'DIN/EN ISO', nps: 'DN15', dn: '15', schedule: 'Series 2', odMm: 21.3, idMm: 16.7 },
  { standard: 'DIN/EN ISO', nps: 'DN15', dn: '15', schedule: 'Series 3', odMm: 21.3, idMm: 16.1 },

  { standard: 'DIN/EN ISO', nps: 'DN20', dn: '20', schedule: 'Series 1', odMm: 26.9, idMm: 22.9 },
  { standard: 'DIN/EN ISO', nps: 'DN20', dn: '20', schedule: 'Series 2', odMm: 26.9, idMm: 22.3 },
  { standard: 'DIN/EN ISO', nps: 'DN20', dn: '20', schedule: 'Series 3', odMm: 26.9, idMm: 21.7 },

  { standard: 'DIN/EN ISO', nps: 'DN25', dn: '25', schedule: 'Series approx.', odMm: 33.7, idMm: 28.5,
    note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN25', dn: '25', schedule: 'Series 1', odMm: 33.7, idMm: 29.1 },
  { standard: 'DIN/EN ISO', nps: 'DN25', dn: '25', schedule: 'Series 3', odMm: 33.7, idMm: 27.3 },

  { standard: 'DIN/EN ISO', nps: 'DN32', dn: '32', schedule: 'Series 1', odMm: 42.4, idMm: 37.8 },
  { standard: 'DIN/EN ISO', nps: 'DN32', dn: '32', schedule: 'Series 2', odMm: 42.4, idMm: 37.2 },
  { standard: 'DIN/EN ISO', nps: 'DN32', dn: '32', schedule: 'Series 3', odMm: 42.4, idMm: 36.0 },

  { standard: 'DIN/EN ISO', nps: 'DN40', dn: '40', schedule: 'Series 1', odMm: 48.3, idMm: 43.7 },
  { standard: 'DIN/EN ISO', nps: 'DN40', dn: '40', schedule: 'Series 2', odMm: 48.3, idMm: 43.1 },
  { standard: 'DIN/EN ISO', nps: 'DN40', dn: '40', schedule: 'Series 3', odMm: 48.3, idMm: 41.9 },

  { standard: 'DIN/EN ISO', nps: 'DN50', dn: '50', schedule: 'Series approx.', odMm: 60.3, idMm: 54.5,
    note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN50', dn: '50', schedule: 'Series 1', odMm: 60.3, idMm: 55.1 },
  { standard: 'DIN/EN ISO', nps: 'DN50', dn: '50', schedule: 'Series 3', odMm: 60.3, idMm: 53.1 },

  { standard: 'DIN/EN ISO', nps: 'DN65', dn: '65', schedule: 'Series 1', odMm: 76.1, idMm: 70.9 },
  { standard: 'DIN/EN ISO', nps: 'DN65', dn: '65', schedule: 'Series 2', odMm: 76.1, idMm: 70.3 },
  { standard: 'DIN/EN ISO', nps: 'DN65', dn: '65', schedule: 'Series 3', odMm: 76.1, idMm: 68.9 },

  { standard: 'DIN/EN ISO', nps: 'DN80', dn: '80', schedule: 'Series approx.', odMm: 88.9, idMm: 82.5,
    note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN80', dn: '80', schedule: 'Series 1', odMm: 88.9, idMm: 83.1 },
  { standard: 'DIN/EN ISO', nps: 'DN80', dn: '80', schedule: 'Series 3', odMm: 88.9, idMm: 80.9 },

  { standard: 'DIN/EN ISO', nps: 'DN100', dn: '100', schedule: 'Series approx.', odMm: 114.3, idMm: 107.1,
    note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN100', dn: '100', schedule: 'Series 1', odMm: 114.3, idMm: 107.9 },
  { standard: 'DIN/EN ISO', nps: 'DN100', dn: '100', schedule: 'Series 3', odMm: 114.3, idMm: 105.3 },

  { standard: 'DIN/EN ISO', nps: 'DN125', dn: '125', schedule: 'Series 1', odMm: 139.7, idMm: 133.3 },
  { standard: 'DIN/EN ISO', nps: 'DN125', dn: '125', schedule: 'Series 2', odMm: 139.7, idMm: 132.5 },
  { standard: 'DIN/EN ISO', nps: 'DN125', dn: '125', schedule: 'Series 3', odMm: 139.7, idMm: 130.7 },

  { standard: 'DIN/EN ISO', nps: 'DN150', dn: '150', schedule: 'Series approx.', odMm: 168.3, idMm: 160.3,
    note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN150', dn: '150', schedule: 'Series 1', odMm: 168.3, idMm: 161.1 },
  { standard: 'DIN/EN ISO', nps: 'DN150', dn: '150', schedule: 'Series 3', odMm: 168.3, idMm: 158.3 },

  { standard: 'DIN/EN ISO', nps: 'DN200', dn: '200', schedule: 'Series approx.', odMm: 219.1, idMm: 211.1,
    note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN200', dn: '200', schedule: 'Series 1', odMm: 219.1, idMm: 211.1 },
  { standard: 'DIN/EN ISO', nps: 'DN200', dn: '200', schedule: 'Series 3', odMm: 219.1, idMm: 207.3 },

  { standard: 'DIN/EN ISO', nps: 'DN250', dn: '250', schedule: 'Series 1', odMm: 273.0, idMm: 265.0 },
  { standard: 'DIN/EN ISO', nps: 'DN250', dn: '250', schedule: 'Series 2', odMm: 273.0, idMm: 263.0 },
  { standard: 'DIN/EN ISO', nps: 'DN250', dn: '250', schedule: 'Series 3', odMm: 273.0, idMm: 260.4 },

  { standard: 'DIN/EN ISO', nps: 'DN300', dn: '300', schedule: 'Series approx.', odMm: 323.9, idMm: 313.9,
    note: 'Approximate EN series quick reference' },
  { standard: 'DIN/EN ISO', nps: 'DN300', dn: '300', schedule: 'Series 1', odMm: 323.9, idMm: 314.9 },
  { standard: 'DIN/EN ISO', nps: 'DN300', dn: '300', schedule: 'Series 3', odMm: 323.9, idMm: 309.7 },

  { standard: 'DIN/EN ISO', nps: 'DN350', dn: '350', schedule: 'Series 1', odMm: 355.6, idMm: 346.6 },
  { standard: 'DIN/EN ISO', nps: 'DN350', dn: '350', schedule: 'Series 2', odMm: 355.6, idMm: 344.4 },
  { standard: 'DIN/EN ISO', nps: 'DN350', dn: '350', schedule: 'Series 3', odMm: 355.6, idMm: 341.4 },

  { standard: 'DIN/EN ISO', nps: 'DN400', dn: '400', schedule: 'Series 1', odMm: 406.4, idMm: 396.4 },
  { standard: 'DIN/EN ISO', nps: 'DN400', dn: '400', schedule: 'Series 2', odMm: 406.4, idMm: 393.8 },
  { standard: 'DIN/EN ISO', nps: 'DN400', dn: '400', schedule: 'Series 3', odMm: 406.4, idMm: 392.2 },

  { standard: 'DIN/EN ISO', nps: 'DN450', dn: '450', schedule: 'Series 1', odMm: 457.0, idMm: 447.0 },
  { standard: 'DIN/EN ISO', nps: 'DN450', dn: '450', schedule: 'Series 2', odMm: 457.0, idMm: 444.4 },
  { standard: 'DIN/EN ISO', nps: 'DN450', dn: '450', schedule: 'Series 3', odMm: 457.0, idMm: 441.0 },

  { standard: 'DIN/EN ISO', nps: 'DN500', dn: '500', schedule: 'Series 1', odMm: 508.0, idMm: 496.8 },
  { standard: 'DIN/EN ISO', nps: 'DN500', dn: '500', schedule: 'Series 2', odMm: 508.0, idMm: 495.4 },
  { standard: 'DIN/EN ISO', nps: 'DN500', dn: '500', schedule: 'Series 3', odMm: 508.0, idMm: 492.0 },

  { standard: 'DIN/EN ISO', nps: 'DN600', dn: '600', schedule: 'Series 1', odMm: 609.6, idMm: 597.0 },
  { standard: 'DIN/EN ISO', nps: 'DN600', dn: '600', schedule: 'Series 2', odMm: 609.6, idMm: 595.4 },
  { standard: 'DIN/EN ISO', nps: 'DN600', dn: '600', schedule: 'Series 3', odMm: 609.6, idMm: 592.0 },

  { standard: 'DIN/EN ISO', nps: 'DN700', dn: '700', schedule: 'Series 1', odMm: 711.2, idMm: 698.6 },
  { standard: 'DIN/EN ISO', nps: 'DN700', dn: '700', schedule: 'Series 2', odMm: 711.2, idMm: 697.0 },
  { standard: 'DIN/EN ISO', nps: 'DN700', dn: '700', schedule: 'Series 3', odMm: 711.2, idMm: 693.6 },

  { standard: 'DIN/EN ISO', nps: 'DN800', dn: '800', schedule: 'Series 1', odMm: 812.8, idMm: 800.2 },
  { standard: 'DIN/EN ISO', nps: 'DN800', dn: '800', schedule: 'Series 2', odMm: 812.8, idMm: 796.8 },
  { standard: 'DIN/EN ISO', nps: 'DN800', dn: '800', schedule: 'Series 3', odMm: 812.8, idMm: 792.8 },

  { standard: 'DIN/EN ISO', nps: 'DN900', dn: '900', schedule: 'Series 1', odMm: 914.4, idMm: 900.2 },
  { standard: 'DIN/EN ISO', nps: 'DN900', dn: '900', schedule: 'Series 2', odMm: 914.4, idMm: 898.4 },
  { standard: 'DIN/EN ISO', nps: 'DN900', dn: '900', schedule: 'Series 3', odMm: 914.4, idMm: 894.4 },

  { standard: 'DIN/EN ISO', nps: 'DN1000', dn: '1000', schedule: 'Series 1', odMm: 1016.0, idMm: 1001.8 },
  { standard: 'DIN/EN ISO', nps: 'DN1000', dn: '1000', schedule: 'Series 2', odMm: 1016.0, idMm: 998.4 },
  { standard: 'DIN/EN ISO', nps: 'DN1000', dn: '1000', schedule: 'Series 3', odMm: 1016.0, idMm: 994.0 },

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

function frictionFactorFromRe(Re: number, relativeRoughness: number): number {
  if (Re <= 0) return 0;
  if (Re < 2300) return 64 / Re;
  if (Re < 4000) return 0.3164 / Math.pow(Re, 0.25);
  const term = relativeRoughness / 3.7 + 5.74 / Math.pow(Re, 0.9);
  return 0.25 / Math.pow(Math.log10(term), 2);
}

export function calculatePipePressureDrop(input: PipePressureDropInput): PipePressureDropResult {
  const { velocityMS, kgS } = calculateVelocity(input.massFlow, input.flowUnit, input.specificVolume, input.pipeIdMm);
  const diameterM = input.pipeIdMm / 1000;
  const density = input.densityKgM3 ?? (input.specificVolume > 0 ? 1 / input.specificVolume : 0);
  const viscosity = input.viscosityPaS ?? 0.00002;
  const roughnessM = (input.roughnessMm ?? 0.045) / 1000;
  const reynoldsNumber = density > 0 && viscosity > 0 ? density * velocityMS * diameterM / viscosity : 0;
  const flowRegime: FlowRegime = reynoldsNumber < 2300 ? 'laminar' : reynoldsNumber < 4000 ? 'transitional' : 'turbulent';
  const relativeRoughness = diameterM > 0 ? roughnessM / diameterM : 0;
  const darcyFrictionFactor = frictionFactorFromRe(reynoldsNumber, relativeRoughness);
  const pressureDropPerMeterPa = diameterM > 0 && density > 0 ? darcyFrictionFactor * (density * velocityMS * velocityMS / 2) / diameterM : 0;
  const pressureDropPa = pressureDropPerMeterPa * Math.max(0, input.lengthM);
  return { reynoldsNumber, flowRegime, darcyFrictionFactor, pressureDropPa, pressureDropPerMeterPa, velocityMS };
}
