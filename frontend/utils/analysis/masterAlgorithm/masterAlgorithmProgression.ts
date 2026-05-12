import { WorkoutSet, SetWisdom } from '../../../types';
import { getSetTypeId } from '../classification';
import type { SetTypeId } from '../classification';
import { MIN_HYPERTROPHY_REPS } from './masterAlgorithmConstants';
import type { WeightUnit } from '../../storage/localStorage';
import type { ExerciseProgressionProfile } from '../userProfile';
import { convertWeight } from '../../format/units';
import { getSuggestedWeightForTarget } from '../userProfile';
import { pickDeterministic } from '../common/messageVariations';
import { getLoadProgressionDirection } from '../../exercise/loadProgression';

const fmt = (value: number): string => {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
};

const roundReps = (value: number): number => Math.max(3, Math.round(value));

const PROMOTE_MESSAGES = [
  'Ceiling hit, ready to progress',
  'Ready to level up',
  'Time to add weight',
  'You have outgrown this load',
  'Strong performance, progress awaits',
  'Crushed the ceiling, move up',
  'Load maxed out, add weight',
  'At your limit, push forward',
  'Ceiling reached, ready for more',
  'Ready to advance',
  'Time to increase the challenge',
  'You have earned a weight increase',
  'Performance ceiling hit',
  'Ready for heavier load',
  'Push to the next level',
] as const;

const ASSISTED_PROMOTE_MESSAGES = [
  'Ready for less assistance',
  'Support can come down',
  'You have outgrown this support level',
  'Time to reduce assistance',
  'Assistance ceiling reached',
  'Move to a harder support level',
] as const;

const PROMOTE_TOOLTIPS = [
  'Next session: Use ~{upDisplay}, aim for {targetReps}+ reps across all sets, then move up again',
  'Progress: Try ~{upDisplay}, get {targetReps}+ reps on all sets, then add more weight',
  'Advance: Use ~{upDisplay} for {targetReps}+ reps on each set, then increase weight',
  'Level up: Switch to ~{upDisplay}, hit {targetReps}+ reps on all sets, then add weight',
  'Add weight: Go to ~{upDisplay}, aim for {targetReps}+ reps consistently, then progress',
  'Push forward: Try ~{upDisplay} for {targetReps}+ reps on each set, then increase load',
  'Next step: Use ~{upDisplay}, lock in {targetReps}+ reps per set, then add weight',
  'Ready: Try ~{upDisplay}, hit {targetReps}+ reps on all sets, then go heavier',
  'Advance: Pick ~{upDisplay}, get {targetReps}+ reps every set, then add load',
  'Move up: Use ~{upDisplay}, achieve {targetReps}+ reps across sets, then increase',
] as const;

const ASSISTED_PROMOTE_TOOLTIPS = [
  'Next session: Use ~{upDisplay} support, aim for {targetReps}+ reps across all sets, then reduce support again',
  'Progress: Try ~{upDisplay} support, get {targetReps}+ reps on all sets, then lower assistance further',
  'Advance: Use ~{upDisplay} support for {targetReps}+ reps on each set, then reduce assistance',
  'Harder step: Switch to ~{upDisplay} support, hit {targetReps}+ reps on all sets, then reduce support',
  'Level up: Go to ~{upDisplay} support, aim for {targetReps}+ reps consistently, then progress',
] as const;

const DEMOTE_HEAVY_MESSAGES = [
  'Load is limiting you',
  'Weight too heavy',
  'Too heavy for progress',
  'Load exceeding capacity',
  'Weight holding you back',
  'Heavier is not working',
  'Drop weight to progress',
  'Load needs to come down',
  'Too heavy to grow',
  'Weight blocks progress',
  'Heavy is not helping',
  'Load needs reduction',
] as const;

const ASSISTED_DEMOTE_HEAVY_MESSAGES = [
  'Current support is too low',
  'Not enough assistance right now',
  'Support reduction is too aggressive',
  'Add a bit more support',
  'Rebuild with slightly more assistance',
  'Support level is limiting output',
] as const;

const DEMOTE_HEAVY_TOOLTIPS = [
  'Next: Use ~{downDisplay}, aim for {rebuildTarget}+ reps across all sets, then rebuild',
  'Drop down: Try ~{downDisplay}, get {rebuildTarget}+ reps on all sets before adding weight',
  'Lighter load: Use ~{downDisplay} and target {rebuildTarget}+ reps on each set',
  'Scale back: Go to ~{downDisplay}, hit {rebuildTarget}+ reps consistently, then progress',
  'Reduce weight: Try ~{downDisplay} for {rebuildTarget}+ reps on each set, then increase',
  'Step down: Use ~{downDisplay}, achieve {rebuildTarget}+ reps per set before adding load',
  'Come down: Pick ~{downDisplay}, lock in {rebuildTarget}+ reps on all sets, then advance',
  'Lighter: Use ~{downDisplay}, get {rebuildTarget}+ reps across sets before progressing',
] as const;

const ASSISTED_DEMOTE_HEAVY_TOOLTIPS = [
  'Next: Use ~{downDisplay} support, aim for {rebuildTarget}+ reps across all sets, then rebuild',
  'Scale up support: Try ~{downDisplay}, get {rebuildTarget}+ reps on all sets before reducing support again',
  'More support: Use ~{downDisplay} and target {rebuildTarget}+ reps on each set',
  'Reset: Go to ~{downDisplay}, hit {rebuildTarget}+ reps consistently, then reduce support',
  'Support first: Use ~{downDisplay}, achieve {rebuildTarget}+ reps per set before lowering assistance',
] as const;

const DEMOTE_INCONSISTENT_MESSAGES = [
  'Load control is inconsistent',
  'Reps are all over the place',
  'Output varies too much',
  'Sets need to stabilize',
  'Consistency is the issue',
  'Reps need to even out',
  'Work on uniform output',
  'Sets are uneven',
  'Need steady performance',
  'Output needs to converge',
  'Variable performance',
  'Reps are too scattered',
] as const;

const ASSISTED_DEMOTE_INCONSISTENT_MESSAGES = [
  'Support control is inconsistent',
  'Output varies too much at this support',
  'Sets need to stabilize',
  'Support level needs consistency',
  'Performance is too uneven',
  'Lock in this support first',
] as const;

const CORE_SET_TYPES: Set<SetTypeId> = new Set(['normal', 'topset', 'failure', 'amrap', 'left', 'right']);
const TECHNIQUE_SET_TYPES: Set<SetTypeId> = new Set([
  'myoreps', 'dropset', 'restpause', 'cluster', 'backoff',
  'negative', 'partial', 'feederset', 'giantset', 'superset',
]);

interface TechniqueWisdomBundle {
  messages: readonly string[];
  tooltips: readonly string[];
}

const TECHNIQUE_WISDOM: Record<string, TechniqueWisdomBundle> = {
  myoreps: {
    messages: ['Myo-reps: extended set work', 'Myo-reps: intensity volume', 'Myo-reps technique done'] as const,
    tooltips: ['Myo-reps performed, activation set at ~{topWeight} drives intensity'] as const,
  },
  dropset: {
    messages: ['Drop set: extended past failure', 'Drop set: volume extension', 'Drop set done'] as const,
    tooltips: ['Drop set performed, weight dropped after reaching failure'] as const,
  },
  backoff: {
    messages: ['Back-off: volume accumulated', 'Back-off: quality reps', 'Back-off set done'] as const,
    tooltips: ['Back-off volume at ~{topWeight}, supporting hypertrophy'] as const,
  },
  restpause: {
    messages: ['Rest-pause: extended set work', 'Rest-pause: intensity work'] as const,
    tooltips: ['Rest-pause performed with brief intra-set rest intervals'] as const,
  },
  cluster: {
    messages: ['Cluster set: intensity work', 'Cluster set: strength volume'] as const,
    tooltips: ['Cluster set performed, reps grouped with intra-set rest'] as const,
  },
  negative: {
    messages: ['Negatives: eccentric emphasis', 'Negatives: controlled lowering'] as const,
    tooltips: ['Negative reps with eccentric focus, longer lowering phase'] as const,
  },
  partial: {
    messages: ['Partials: targeted ROM work', 'Partials: range-specific load'] as const,
    tooltips: ['Partial ROM set, targeting specific range of motion'] as const,
  },
  feederset: {
    messages: ['Feeder set: activation work', 'Feeder set: blood flow prep'] as const,
    tooltips: ['Feeder set for blood flow and activation before heavier work'] as const,
  },
  giantset: {
    messages: ['Giant set circuit work', 'Giant set: multi-exercise set'] as const,
    tooltips: ['Giant set: multiple exercises performed in sequence'] as const,
  },
  superset: {
    messages: ['Superset work done', 'Superset: paired exercise set'] as const,
    tooltips: ['Superset: paired exercises performed back to back'] as const,
  },
};

const DEMOTE_INCONSISTENT_TOOLTIPS = [
  'Next: Use ~{preferredWeight}, aim for {targetReps}+ reps across all sets, then progress',
  'Stabilize: Try ~{preferredWeight}, get {targetReps}+ reps on each set, then add weight',
  'Even out: Use ~{preferredWeight} and target {targetReps}+ reps on every set',
  'Consistency: Go to ~{preferredWeight}, hit {targetReps}+ reps on all sets before advancing',
  'Uniform output: Try ~{preferredWeight} for {targetReps}+ reps on each set, then increase',
  'Steady: Use ~{preferredWeight}, achieve {targetReps}+ reps per set before adding load',
  'Even performance: Pick ~{preferredWeight}, lock in {targetReps}+ reps on all sets, then progress',
  'Converge: Use ~{preferredWeight}, get {targetReps}+ reps across sets before moving up',
] as const;

const ASSISTED_DEMOTE_INCONSISTENT_TOOLTIPS = [
  'Next: Use ~{preferredWeight} support, aim for {targetReps}+ reps across all sets, then reduce support',
  'Stabilize: Try ~{preferredWeight} support, get {targetReps}+ reps on each set, then lower assistance',
  'Even out: Use ~{preferredWeight} support and target {targetReps}+ reps on every set',
  'Consistency: Stay at ~{preferredWeight} support, hit {targetReps}+ reps on all sets before progressing',
  'Uniform output: Use ~{preferredWeight} support for {targetReps}+ reps on each set, then reduce support',
] as const;

export interface AnalyzeProgressionOptions {
  exerciseName?: string;
  typicalWeightJump?: number;
  weightUnit?: WeightUnit;
  isCompound?: boolean;
  progressionProfile?: ExerciseProgressionProfile | null;
}

const getDominantTechniqueType = (techniqueSets: WorkoutSet[]): string | null => {
  if (techniqueSets.length === 0) return null;
  const counts = new Map<string, number>();
  for (const s of techniqueSets) {
    const id = getSetTypeId(s);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  let dominant: string | null = null;
  let maxCount = 0;
  for (const [id, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      dominant = id;
    }
  }
  return dominant;
};

const getMyorepsWisdom = (
  validSets: WorkoutSet[],
  weightUnit: WeightUnit,
  _isLowerWeightBetter: boolean
): SetWisdom | null => {
  const myorepsIndices: number[] = [];
  for (let i = 0; i < validSets.length; i++) {
    if (getSetTypeId(validSets[i]) === 'myoreps') {
      myorepsIndices.push(i);
    }
  }
  if (myorepsIndices.length === 0) return null;

  const firstMyorepsIdx = myorepsIndices[0];
  const lastCoreBeforeMyoreps = firstMyorepsIdx > 0 ? validSets[firstMyorepsIdx - 1] : null;

  const myorepsSets = myorepsIndices.map(i => validSets[i]);
  const miniSetReps = myorepsSets.map(s => s.reps);
  const miniSetWeights = myorepsSets.map(s => s.weight_kg);
  const minMiniReps = Math.min(...miniSetReps);
  const avgMiniReps = Math.round(miniSetReps.reduce((a, b) => a + b, 0) / miniSetReps.length);
  const firstMiniReps = myorepsSets[0]?.reps ?? 0;
  const firstMiniWeight = myorepsSets[0]?.weight_kg ?? 0;

  const activationSet: WorkoutSet | null = (lastCoreBeforeMyoreps
    && lastCoreBeforeMyoreps.reps >= 6
    && Math.abs(lastCoreBeforeMyoreps.weight_kg - firstMiniWeight) / Math.max(0.1, firstMiniWeight) < 0.15)
    ? lastCoreBeforeMyoreps
    : null;

  const activationReps = activationSet?.reps ?? 0;
  const activationWeight = activationSet?.weight_kg ?? 0;
  const activationWeightDisplay = activationWeight > 0 ? fmt(convertWeight(activationWeight, weightUnit)) : '';
  const unitSymbol = weightUnit;

  const seedBase = `myoreps-${activationReps}-${miniSetReps.join('-')}`;

  if (activationSet && activationReps < 10) {
    const message = pickDeterministic(
      `${seedBase}|heavy-activation`,
      ['Myo-reps activation too heavy', 'Activation weight too high for myo-reps', 'Reduce weight for myo-reps'] as readonly string[]
    ) as string;
    const tooltip = `Activation set at ${activationWeightDisplay}${unitSymbol}×${activationReps} is too heavy for myo-reps (target 12-20 reps). Lower the weight to reach the correct rep range for effective activation. Mini-sets averaged ${avgMiniReps} reps (target 3-5).`;
    return { type: 'demote', message, tooltip };
  }

  if (activationSet && activationReps < 12) {
    const message = pickDeterministic(
      `${seedBase}|suboptimal-activation`,
      ['Myo-reps activation slightly low', 'Activation reps could be higher', 'Push activation closer to failure'] as readonly string[]
    ) as string;
    const tooltip = `Activation set at ${activationWeightDisplay}${unitSymbol}×${activationReps}, aiming for 12-20 reps is ideal for myo-reps. Current reps are close but could be higher for better fiber recruitment.`;
    return { type: 'neutral', message, tooltip };
  }

  if (!activationSet && firstMiniReps < 4) {
    const firstMiniWeightDisplay = fmt(convertWeight(firstMiniWeight, weightUnit));
    const message = pickDeterministic(
      `${seedBase}|low-mini`,
      ['Myo-reps mini-set reps low', 'Mini-sets dropping below target', 'Myo-reps weight too heavy'] as readonly string[]
    ) as string;
    const tooltip = `First myo-reps mini-set at ${firstMiniWeightDisplay}${unitSymbol} got only ${firstMiniReps} reps (target 3-5). The activation weight may be too heavy. Consider reducing weight so mini-sets consistently hit 3-5 reps.`;
    return { type: 'demote', message, tooltip };
  }

  if (minMiniReps < 3) {
    const message = pickDeterministic(
      `${seedBase}|mini-too-low`,
      ['Myo-reps mini-set too low', 'Mini-sets below effective range', 'Myo-reps mini-set reps dropped'] as readonly string[]
    ) as string;
    const tooltip = `Myo-reps mini-set dropped to ${minMiniReps} reps (target 3-5). Lower the activation weight or increase rest between mini-sets to maintain rep quality.`;
    return { type: 'demote', message, tooltip };
  }

  if (activationSet) {
    const message = pickDeterministic(
      `${seedBase}|good`,
      ['Good myo-reps execution', 'Myo-reps on point', 'Effective myo-reps work'] as readonly string[]
    ) as string;
    const tooltip = `Activation set at ${activationWeightDisplay}${unitSymbol}×${activationReps} reps, mini-sets averaging ${avgMiniReps} reps. Good myo-reps protocol execution.`;
    return { type: 'neutral', message, tooltip };
  }

  const avgMiniWeight = fmt(convertWeight(
    miniSetWeights.reduce((a, b) => a + b, 0) / miniSetWeights.length,
    weightUnit
  ));
  const message = pickDeterministic(
    `${seedBase}|no-activation`,
    ['Myo-reps performed', 'Myo-reps technique done', 'Myo-reps mini-sets completed'] as readonly string[]
  ) as string;
  const tooltip = `Myo-reps mini-sets at ~${avgMiniWeight}${unitSymbol}, averaging ${avgMiniReps} reps. For best results, include an activation set in the 12-20 rep range before mini-sets.`;
  return { type: 'neutral', message, tooltip };
};

const getDropsetWisdom = (
  validSets: WorkoutSet[],
  weightUnit: WeightUnit
): SetWisdom | null => {
  const dropsetIndices: number[] = [];
  for (let i = 0; i < validSets.length; i++) {
    if (getSetTypeId(validSets[i]) === 'dropset') {
      dropsetIndices.push(i);
    }
  }
  if (dropsetIndices.length === 0) return null;

  const firstDropsetIdx = dropsetIndices[0];
  const precedingSet = firstDropsetIdx > 0 ? validSets[firstDropsetIdx - 1] : null;

  const dropsetSets = dropsetIndices.map(i => validSets[i]);
  const dropsetReps = dropsetSets.map(s => s.reps);
  const dropsetWeights = dropsetSets.map(s => s.weight_kg);
  const firstDropWeight = dropsetWeights[0];
  const firstDropReps = dropsetReps[0];
  const totalDropsetReps = dropsetReps.reduce((a, b) => a + b, 0);
  const seedBase = `dropset-${dropsetReps.join('-')}`;

  if (precedingSet && precedingSet.weight_kg > 0 && firstDropWeight > 0) {
    const dropPct = ((precedingSet.weight_kg - firstDropWeight) / precedingSet.weight_kg) * 100;
    const prevWeightDisplay = fmt(convertWeight(precedingSet.weight_kg, weightUnit));
    const dropWeightDisplay = fmt(convertWeight(firstDropWeight, weightUnit));

    if (dropPct < 10) {
      const message = pickDeterministic(
        `${seedBase}|drop-too-small`,
        ['Drop set drop too small', 'Increase drop for effective dropset', 'Drop more weight'] as readonly string[]
      ) as string;
      const tooltip = `Weight dropped only ${Math.round(dropPct)}% from ${prevWeightDisplay}${weightUnit} to ${dropWeightDisplay}${weightUnit}. Effective dropsets need a 20-30% drop to extend past failure.`;
      return { type: 'demote', message, tooltip };
    }

    if (dropPct > 40) {
      const message = pickDeterministic(
        `${seedBase}|drop-too-large`,
        ['Drop set drop too large', 'Drop is too aggressive', 'Reduce weight drop amount'] as readonly string[]
      ) as string;
      const tooltip = `Weight dropped ${Math.round(dropPct)}%, larger than the recommended 20-30%. An excessive drop may reduce intensity stimulus. Try a smaller drop for more productive volume.`;
      return { type: 'demote', message, tooltip };
    }

    if (firstDropReps < 4) {
      const message = pickDeterministic(
        `${seedBase}|low-reps`,
        ['Dropset reps too low', 'Drop set not productive', 'Dropset added few reps'] as readonly string[]
      ) as string;
      const tooltip = `First dropset at ${dropWeightDisplay}${weightUnit} only produced ${firstDropReps} reps. The initial working set may not have reached true failure, or the drop was too large.`;
      return { type: 'demote', message, tooltip };
    }

    const message = pickDeterministic(
      `${seedBase}|good`,
      ['Good dropset execution', 'Effective drop set', 'Dropset volume achieved'] as readonly string[]
    ) as string;
    const tooltip = `Dropped ${Math.round(dropPct)}% from ${prevWeightDisplay}${weightUnit} → ${dropWeightDisplay}${weightUnit}, added ${totalDropsetReps} extra reps. Well-executed dropset protocol.`;
    return { type: 'neutral', message, tooltip };
  }

  const avgDropWeight = fmt(convertWeight(
    dropsetWeights.reduce((a, b) => a + b, 0) / dropsetWeights.length,
    weightUnit
  ));
  const message = pickDeterministic(
    `${seedBase}|generic`,
    ['Drop set performed', 'Dropset done', 'Drop set completed'] as readonly string[]
  ) as string;
  const tooltip = `Dropset at ~${avgDropWeight}${weightUnit} added ${totalDropsetReps} total reps. For best results, precede with a set taken to near-failure.`;
  return { type: 'neutral', message, tooltip };
};

const getBackoffWisdom = (
  validSets: WorkoutSet[],
  weightUnit: WeightUnit
): SetWisdom | null => {
  const backoffIndices: number[] = [];
  for (let i = 0; i < validSets.length; i++) {
    if (getSetTypeId(validSets[i]) === 'backoff') {
      backoffIndices.push(i);
    }
  }
  if (backoffIndices.length === 0) return null;

  const firstBackoffIdx = backoffIndices[0];
  const precedingSet = firstBackoffIdx > 0 ? validSets[firstBackoffIdx - 1] : null;

  const backoffSets = backoffIndices.map(i => validSets[i]);
  const backoffReps = backoffSets.map(s => s.reps);
  const backoffWeights = backoffSets.map(s => s.weight_kg);
  const firstBackoffReps = backoffReps[0];
  const firstBackoffWeight = backoffWeights[0];
  const seedBase = `backoff-${backoffReps.join('-')}`;

  if (precedingSet && precedingSet.weight_kg > 0 && firstBackoffWeight > 0) {
    const dropPct = ((precedingSet.weight_kg - firstBackoffWeight) / precedingSet.weight_kg) * 100;
    const topWeightDisplay = fmt(convertWeight(precedingSet.weight_kg, weightUnit));
    const backoffWeightDisplay = fmt(convertWeight(firstBackoffWeight, weightUnit));

    if (dropPct < 5) {
      const message = pickDeterministic(
        `${seedBase}|drop-too-small`,
        ['Back-off drop too small', 'Reduce weight more for back-off', 'Back-off needs larger drop'] as readonly string[]
      ) as string;
      const tooltip = `Back-off weight only ${Math.round(dropPct)}% lighter than the top set (${topWeightDisplay}${weightUnit} → ${backoffWeightDisplay}${weightUnit}). Aim for 10-20% drop for productive volume work.`;
      return { type: 'demote', message, tooltip };
    }

    if (firstBackoffReps < 6) {
      const message = pickDeterministic(
        `${seedBase}|low-reps`,
        ['Back-off reps too low', 'Top set fatigue carrying over', 'Increase back-off weight drop'] as readonly string[]
      ) as string;
      const tooltip = `First back-off set only got ${firstBackoffReps} reps at ${backoffWeightDisplay}${weightUnit}. Consider a larger drop (15-20%) or more rest after the top set to keep back-off reps in the 8-12 hypertrophy range.`;
      return { type: 'demote', message, tooltip };
    }

    if (backoffReps.some(r => r > 15)) {
      const message = pickDeterministic(
        `${seedBase}|reps-too-high`,
        ['Back-off weight too light', 'Increase back-off weight', 'Back-off too easy'] as readonly string[]
      ) as string;
      const tooltip = `Back-off sets hitting ${Math.max(...backoffReps)}+ reps, the drop may be too generous. Back-off weight should challenge you in the 8-12 rep range for optimal hypertrophy stimulus.`;
      return { type: 'demote', message, tooltip };
    }

    const avgBackoffReps = Math.round(backoffReps.reduce((a, b) => a + b, 0) / backoffReps.length);
    const message = pickDeterministic(
      `${seedBase}|good`,
      ['Good back-off work', 'Effective back-off volume', 'Solid back-off sets'] as readonly string[]
    ) as string;
    const tooltip = `Top set at ${topWeightDisplay}${weightUnit}, back-off dropped ${Math.round(dropPct)}% to ${backoffWeightDisplay}${weightUnit} for ${backoffSets.length} sets averaging ${avgBackoffReps} reps. Solid top-set + back-off protocol.`;
    return { type: 'neutral', message, tooltip };
  }

  const avgBackoffWeight = fmt(convertWeight(
    backoffWeights.reduce((a, b) => a + b, 0) / backoffWeights.length,
    weightUnit
  ));
  const avgBackoffReps = Math.round(backoffReps.reduce((a, b) => a + b, 0) / backoffReps.length);
  const message = pickDeterministic(
    `${seedBase}|generic`,
    ['Back-off sets performed', 'Back-off volume done', 'Back-off work completed'] as readonly string[]
  ) as string;
  const tooltip = `${backoffSets.length} back-off sets at ~${avgBackoffWeight}${weightUnit}, averaging ${avgBackoffReps} reps. For best results, precede with a heavy top set (1-5 reps at RPE 8-9).`;
  return { type: 'neutral', message, tooltip };
};

export const analyzeProgression = (
  allSetsForExercise: WorkoutSet[],
  _targetReps = 10,
  options?: AnalyzeProgressionOptions
): SetWisdom | null => {
  const validSets = allSetsForExercise.filter(s => s.reps > 0 && s.weight_kg > 0);
  if (validSets.length < 2) return null;

  const weightUnit = options?.weightUnit ?? 'kg';
  const exerciseName = options?.exerciseName ?? validSets[0]?.exercise_title ?? '';
  const isLowerWeightBetter = getLoadProgressionDirection(exerciseName) === 'lower';
  const profile = options?.progressionProfile;

  const coreSets = validSets.filter(s => CORE_SET_TYPES.has(getSetTypeId(s)));
  const techniqueSets = validSets.filter(s => TECHNIQUE_SET_TYPES.has(getSetTypeId(s)));

  if (coreSets.length >= 2 && profile && profile.availableWeights.length > 0) {
    const sets = coreSets.map((s) => ({ reps: s.reps, weight: convertWeight(s.weight_kg, weightUnit) }));
    const reps = sets.map((s) => s.reps);
    const weights = sets.map((s) => s.weight);
    const topWeight = isLowerWeightBetter ? Math.min(...weights) : Math.max(...weights);
    const topWeightTolerance = Math.max(0.5, profile.preferredJump * 0.5);
    const topWeightSets = sets.filter((s) => Math.abs(s.weight - topWeight) <= topWeightTolerance);
    if (topWeightSets.length > 0) {
      const topWeightReps = topWeightSets.map((s) => s.reps);
      const minReps = Math.min(...reps);
      const maxReps = Math.max(...reps);
      const spread = maxReps - minReps;
      const avgReps = Math.round(reps.reduce((a, b) => a + b, 0) / reps.length);

      const targetReps = roundReps(profile.repTarget);
      const ceilingReps = roundReps(profile.repCeiling);
      const topWeightDisplay = `${fmt(topWeight)}${weightUnit}`;

      const suggestedDownWeight = getSuggestedWeightForTarget(profile, topWeight, isLowerWeightBetter ? 'up' : 'down');
      const suggestedUpWeight = getSuggestedWeightForTarget(profile, topWeight, isLowerWeightBetter ? 'down' : 'up');
      const downDisplay = `${fmt(suggestedDownWeight)}${weightUnit}`;
      const upDisplay = `${fmt(suggestedUpWeight)}${weightUnit}`;

      const seedBase = `progression-${topWeight}-${reps.join('-')}`;

      const topRepeated = topWeightReps.length >= 2;
      const topAllAtCeiling = topWeightReps.every((r) => r >= ceilingReps);
      if (topRepeated && topAllAtCeiling) {
        const promoteMessages = isLowerWeightBetter ? ASSISTED_PROMOTE_MESSAGES : PROMOTE_MESSAGES;
        const promoteTooltips = isLowerWeightBetter ? ASSISTED_PROMOTE_TOOLTIPS : PROMOTE_TOOLTIPS;
        const message = pickDeterministic(`${seedBase}|promote`, promoteMessages as readonly string[]) as string;
        let tooltip = pickDeterministic(`${seedBase}|promote-tip`, promoteTooltips as readonly string[]) as string;
        tooltip = tooltip
          .replace('{upDisplay}', upDisplay)
          .replace('{targetReps}', String(targetReps));
        return { type: 'promote', message, tooltip };
      }

      if (minReps < MIN_HYPERTROPHY_REPS) {
        const rebuildTarget = Math.max(MIN_HYPERTROPHY_REPS, targetReps);
        const demoteMessages = isLowerWeightBetter ? ASSISTED_DEMOTE_HEAVY_MESSAGES : DEMOTE_HEAVY_MESSAGES;
        const demoteTooltips = isLowerWeightBetter ? ASSISTED_DEMOTE_HEAVY_TOOLTIPS : DEMOTE_HEAVY_TOOLTIPS;
        const message = pickDeterministic(`${seedBase}|demote-heavy`, demoteMessages as readonly string[]) as string;
        let tooltip = pickDeterministic(`${seedBase}|demote-heavy-tip`, demoteTooltips as readonly string[]) as string;
        tooltip = tooltip
          .replace('{downDisplay}', downDisplay)
          .replace('{rebuildTarget}', String(rebuildTarget));
        return { type: 'demote', message, tooltip };
      }

      if (spread >= 2) {
        const preferredWeight = avgReps < targetReps ? downDisplay : topWeightDisplay;
        const inconsistentMessages = isLowerWeightBetter ? ASSISTED_DEMOTE_INCONSISTENT_MESSAGES : DEMOTE_INCONSISTENT_MESSAGES;
        const inconsistentTooltips = isLowerWeightBetter ? ASSISTED_DEMOTE_INCONSISTENT_TOOLTIPS : DEMOTE_INCONSISTENT_TOOLTIPS;
        const message = pickDeterministic(`${seedBase}|demote-inconsistent`, inconsistentMessages as readonly string[]) as string;
        let tooltip = pickDeterministic(`${seedBase}|demote-inconsistent-tip`, inconsistentTooltips as readonly string[]) as string;
        tooltip = tooltip
          .replace('{preferredWeight}', preferredWeight)
          .replace('{targetReps}', String(targetReps));
        return { type: 'demote', message, tooltip };
      }
    }
  }

  if (techniqueSets.length > 0) {
    const dominantType = getDominantTechniqueType(techniqueSets);

    if (dominantType === 'myoreps') {
      const myoWisdom = getMyorepsWisdom(validSets, weightUnit, isLowerWeightBetter);
      if (myoWisdom) return myoWisdom;
    }

    if (dominantType === 'dropset') {
      const dropWisdom = getDropsetWisdom(validSets, weightUnit);
      if (dropWisdom) return dropWisdom;
    }

    if (dominantType === 'backoff') {
      const backoffWisdom = getBackoffWisdom(validSets, weightUnit);
      if (backoffWisdom) return backoffWisdom;
    }

    if (dominantType && TECHNIQUE_WISDOM[dominantType]) {
      const bundle = TECHNIQUE_WISDOM[dominantType];
      const techniqueWeights = techniqueSets.map(s => convertWeight(s.weight_kg, weightUnit));
      const topTechniqueWeight = isLowerWeightBetter ? Math.min(...techniqueWeights) : Math.max(...techniqueWeights);
      const seedBase = `technique-${dominantType}-${techniqueSets.length}-${topTechniqueWeight}`;
      const message = pickDeterministic(`${seedBase}|message`, bundle.messages as readonly string[]) as string;
      let tooltip = pickDeterministic(`${seedBase}|tooltip`, bundle.tooltips as readonly string[]) as string;
      tooltip = tooltip.replace('{topWeight}', `${fmt(topTechniqueWeight)}${weightUnit}`);
      return { type: 'neutral', message, tooltip };
    }
  }

  return null;
};
