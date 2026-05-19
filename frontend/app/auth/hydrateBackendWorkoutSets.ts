import type { WorkoutSet } from '../../types';
import { parseHevyDateString } from '../../utils/date/parseHevyDateString';

const LBS_TO_KG = 0.45359237;

export const hydrateBackendWorkoutSets = (sets: WorkoutSet[]): WorkoutSet[] => {
  const inputLength = sets?.length ?? 0;
  const hydrated = (sets ?? []).map((s) => ({
    ...s,
    parsedDate: parseHevyDateString(String(s.start_time ?? '')),
  }));
  
  if (inputLength > 0 && hydrated.every(s => !s.parsedDate)) {
    console.warn('[hydrateBackendWorkoutSets] All sets have invalid parsedDate. First set start_time:', 
      sets[0]?.start_time);
  }
  
  return hydrated;
};

export const hydrateBackendWorkoutSetsWithSource = (
  sets: WorkoutSet[],
  source: 'hevy' | 'lyfta' | 'strong' | 'other'
): WorkoutSet[] => {
  const hydrated = hydrateBackendWorkoutSets(sets);
  return hydrated.map((s) => {
    let set = { ...s, source } as WorkoutSet;
    if (source === 'lyfta' && set.weight_unit === 'lbs') {
      set = { ...set, weight_kg: set.weight_kg * LBS_TO_KG, weight_unit: 'kg' };
    }
    return set;
  });
};
