export type DutyUnit = 'kW' | 'MW' | 'kcal/h';
export type MassFlowUnit = 'kg/s' | 'kg/h' | 't/h';

export function massFlowToKgS(value: number, unit: MassFlowUnit): number {
  if (unit === 'kg/s') return value;
  if (unit === 'kg/h') return value / 3600;
  return value * 1000 / 3600;
}

export function dutyFromKW(value: number, unit: DutyUnit): number {
  if (unit === 'kW') return value;
  if (unit === 'MW') return value * 1000;
  return value / 860.42065;
}

export function dutyToKW(value: number, unit: DutyUnit): number {
  if (unit === 'kW') return value;
  if (unit === 'MW') return value / 1000;
  return value * 860.42065;
}

export interface HeatSide {
  flow: number;
  flowUnit: MassFlowUnit;
  hIn: number;
  hOut: number;
}

export function sideDutyKW(side: HeatSide): number {
  return massFlowToKgS(side.flow, side.flowUnit) * (side.hOut - side.hIn);
}

export function solveMissingColdFlow(hot: HeatSide, coldHIn: number, coldHOut: number, coldFlowUnit: MassFlowUnit): number {
  const qAbs = Math.abs(sideDutyKW(hot));
  const deltaH = Math.abs(coldHOut - coldHIn);
  if (deltaH === 0) return Number.NaN;
  const kgS = qAbs / deltaH;
  if (coldFlowUnit === 'kg/s') return kgS;
  if (coldFlowUnit === 'kg/h') return kgS * 3600;
  return kgS * 3600 / 1000;
}

export function solveColdOutlet(hot: HeatSide, coldFlow: number, coldFlowUnit: MassFlowUnit, coldHIn: number): number {
  const qAbs = Math.abs(sideDutyKW(hot));
  const kgS = massFlowToKgS(coldFlow, coldFlowUnit);
  if (kgS === 0) return Number.NaN;
  return coldHIn + qAbs / kgS;
}
