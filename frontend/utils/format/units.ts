import { WeightUnit } from '../storage/localStorage';

const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 0.45359237;

/**
 * Convert weight between units.
 * @param weight - The weight value
 * @param targetUnit - The unit to display in
 * @param sourceUnit - The unit the weight is stored in (default 'kg' for backward compat)
 */
export const convertWeight = (
  weight: number,
  targetUnit: WeightUnit | string,
  sourceUnit?: WeightUnit | string
): number => {
  const src = sourceUnit || 'kg';

  if (src === targetUnit) {
    if (targetUnit === 'lbs') return Number(weight.toFixed(1));
    return Number(weight.toFixed(2));
  }

  if (targetUnit === 'lbs') {
    return Number((weight * KG_TO_LBS).toFixed(1));
  }
  return Number((weight * LBS_TO_KG).toFixed(2));
};

/**
 * Format weight with unit label
 */
export const formatWeight = (
  weight: number,
  targetUnit: WeightUnit | string,
  sourceUnit?: WeightUnit | string
): string => {
  const converted = convertWeight(weight, targetUnit, sourceUnit);
  return `${converted} ${targetUnit}`;
};

/**
 * Get just the unit label
 */
export const getUnitLabel = (unit: WeightUnit | string): string => {
  return unit as string;
};

/**
 * Standard progression step in kg, matching typical plate jumps.
 * - kg: +2.5kg
 * - lbs: +5lbs (converted to kg)
 */
export const getStandardWeightIncrementKg = (unit: WeightUnit | string): number => {
  if (unit === 'lbs') {
    return 5 / KG_TO_LBS;
  }
  return 2.5;
};

/**
 * Convert volume between units.
 * @param volume - The volume value
 * @param targetUnit - The unit to display in
 * @param sourceUnit - The unit the volume is stored in (default 'kg' for backward compat)
 */
export const convertVolume = (
  volume: number,
  targetUnit: WeightUnit | string,
  sourceUnit?: WeightUnit | string
): number => {
  const src = sourceUnit || 'kg';

  if (src === targetUnit) {
    if (targetUnit === 'lbs') return Number(volume.toFixed(0));
    return Number(volume.toFixed(2));
  }

  if (targetUnit === 'lbs') {
    return Number((volume * KG_TO_LBS).toFixed(0));
  }
  return Number((volume * LBS_TO_KG).toFixed(2));
};
