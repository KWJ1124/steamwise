import { describe, expect, it } from 'vitest';
import { getCheckedSteamFields, pressureToMPa, selectedFieldsToPair, solveSteam, type SteamTableField } from './steam';
import { calculateVelocity, findPipeSize, getPipeSchedules, getPipeSizes, getPipeStandards } from './pipe';
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

  it('maps two checked steam-table fields to the correct IF97 input pair', () => {
    expect(selectedFieldsToPair(['pressure', 'temperature'])).toBe('PT');
    expect(selectedFieldsToPair(['pressure', 'enthalpy'])).toBe('PH');
    expect(selectedFieldsToPair(['pressure', 'entropy'])).toBe('PS');
    expect(selectedFieldsToPair(['pressure', 'quality'])).toBe('Px');
    expect(selectedFieldsToPair(['temperature', 'enthalpy'])).toBe('TH');
    expect(selectedFieldsToPair(['temperature', 'entropy'])).toBe('TS');
  });

  it('returns only checked steam-table fields and ignores calculated fields', () => {
    const checked = getCheckedSteamFields({ pressure: true, temperature: false, enthalpy: true, entropy: false, quality: false, specificVolume: false });
    expect(checked).toEqual(['pressure', 'enthalpy'] satisfies SteamTableField[]);
  });

  it('rejects unsupported or incomplete checked field combinations', () => {
    expect(selectedFieldsToPair(['enthalpy', 'entropy'])).toBeUndefined();
    expect(selectedFieldsToPair(['pressure'])).toBeUndefined();
    expect(selectedFieldsToPair(['pressure', 'temperature', 'enthalpy'])).toBeUndefined();
  });
});

describe('pipe velocity', () => {
  it('calculates positive velocity', () => {
    const result = calculateVelocity(10, 't/h', 1.7, 154.1);
    expect(result.velocityMS).toBeGreaterThan(0);
  });

  it('supports stepped pipe selection by code, size, then schedule', () => {
    const standards = getPipeStandards();
    expect(standards).toContain('ASME B36.10/B36.19');
    const sizes = getPipeSizes('ASME B36.10/B36.19');
    expect(sizes).toContain('6');
    const schedules = getPipeSchedules('ASME B36.10/B36.19', '6');
    expect(schedules).toEqual(expect.arrayContaining(['40', '80']));
    const row = findPipeSize('ASME B36.10/B36.19', '6', '80');
    expect(row?.idMm).toBeCloseTo(146.3, 1);
  });
});

describe('heat balance', () => {
  it('solves missing cold outlet and flow', () => {
    const hot = { flow: 10, flowUnit: 't/h' as const, hIn: 3200, hOut: 900 };
    expect(solveColdOutlet(hot, 20, 't/h', 420)).toBeGreaterThan(700);
    expect(solveMissingColdFlow(hot, 420, 900, 't/h')).toBeGreaterThan(40);
  });
});
