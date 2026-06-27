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
  return value / (3600 / 4.1868);  // IT calorie: 859.845227...
}

export function dutyToKW(value: number, unit: DutyUnit): number {
  if (unit === 'kW') return value;
  if (unit === 'MW') return value / 1000;
  return value * (3600 / 4.1868);  // IT calorie: 859.845227...
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

export interface HeatEffectivenessInput {
  hotFlowKgS: number;
  hotCpKJkgK: number;
  hotInC: number;
  hotOutC: number;
  coldFlowKgS: number;
  coldCpKJkgK: number;
  coldInC: number;
  coldOutC: number;
}

export function heatEffectiveness(input: HeatEffectivenessInput) {
  const hotCapacityKWK = input.hotFlowKgS * input.hotCpKJkgK;
  const coldCapacityKWK = input.coldFlowKgS * input.coldCpKJkgK;
  const cMinKWK = Math.min(hotCapacityKWK, coldCapacityKWK);
  const actualHotKW = hotCapacityKWK * (input.hotInC - input.hotOutC);
  const actualColdKW = coldCapacityKWK * (input.coldOutC - input.coldInC);
  const actualKW = Math.max(0, Math.min(Math.abs(actualHotKW), Math.abs(actualColdKW)));
  const maxPossibleKW = Math.max(0, cMinKWK * (input.hotInC - input.coldInC));
  const effectiveness = maxPossibleKW > 0 ? actualKW / maxPossibleKW : Number.NaN;
  const heatBalanceGapKW = Math.abs(Math.abs(actualHotKW) - Math.abs(actualColdKW));
  return { actualKW, maxPossibleKW, effectiveness, heatBalanceGapKW, hotCapacityKWK, coldCapacityKWK };
}
