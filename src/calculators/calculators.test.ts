import { describe, expect, it } from 'vitest';
import { pressureToMPa, solveSteam } from './steam';
import { calculateVelocity } from './pipe';
import { solveColdOutlet, solveMissingColdFlow } from './heat';

describe('steam calculator', () => {
  it('solves near atmospheric saturated vapor by P+x', () => {
    const result = solveSteam({ pair: 'Px', pressure: 0.1, pressureUnit: 'MPa', temperature: 100, temperatureUnit: '°C', enthalpy: 0, enthalpyUnit: 'kJ/kg', entropy: 0, quality: 1 });
    expect(result.error).toBeUndefined();
    expect(result.state?.enthalpy).toBeGreaterThan(2600);
    expect(result.state?.quality).toBe(1);
  });

  it('converts bar(g) to absolute MPa', () => {
    expect(pressureToMPa(0, 'bar(g)')).toBeCloseTo(0.101325, 6);
  });
});

describe('pipe velocity', () => {
  it('calculates positive velocity', () => {
    const result = calculateVelocity(10, 't/h', 1.7, 154.1);
    expect(result.velocityMS).toBeGreaterThan(0);
  });
});

describe('heat balance', () => {
  it('solves missing cold outlet and flow', () => {
    const hot = { flow: 10, flowUnit: 't/h' as const, hIn: 3200, hOut: 900 };
    expect(solveColdOutlet(hot, 20, 't/h', 420)).toBeGreaterThan(700);
    expect(solveMissingColdFlow(hot, 420, 900, 't/h')).toBeGreaterThan(40);
  });
});
