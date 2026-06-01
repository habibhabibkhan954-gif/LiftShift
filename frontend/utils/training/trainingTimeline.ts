import type { TrainingLevel } from '../muscle/hypertrophy/muscleParams';
import {
  DASHBOARD_TIERS,
  calculateAchievement,
  findTierByAchievement,
  calculateProgressToNextTier,
  getNextTier,
  estimateWeeksToNextTier,
  getTierColor,
  getTierByKey,
  type TierDef,
} from './tierUtils';

// Re-export for backward compatibility
export type { TierDef };
export { DASHBOARD_TIERS as JOURNEY_TIERS, getTierColor, getTierByKey };

// ---------------------------------------------------------------------------
// Training Timeline – Unified sets + months progression system
// ---------------------------------------------------------------------------

/** Alias for backward compatibility */
export type TimelineCheckpointDef = TierDef;

/** Progress snapshot returned by the timeline calculator */
export interface TimelineProgress {
  /** Unified score (0-100) combining sets and months */
  readonly unifiedScore: number;
  /** Current checkpoint the user is at or has passed */
  readonly currentCheckpoint: TierDef;
  /** Next checkpoint to reach, or null if at max (Legend) */
  readonly nextCheckpoint: TierDef | null;
  /** Progress within current → next checkpoint (0-100) */
  readonly progressToNext: number;
  /** Remaining % points to reach next checkpoint */
  readonly remainingToNext: number;
  /** Index of current checkpoint in JOURNEY_TIERS array */
  readonly currentIndex: number;
  /** The resolved core training level for volume thresholds */
  readonly trainingLevel: TrainingLevel;
  /** User's total lifetime sets */
  readonly totalSets: number;
  /** User's months of training (first to latest workout) */
  readonly monthsTraining: number;
  /** User's weeks of training (first to latest workout) */
  readonly weeksTraining: number;
  /** Sets per week (calculated from recent activity for pace) */
  readonly setsPerWeek: number | null;
  /** Weekly progress rate (% points per week) */
  readonly weeklyProgressRate: number;
  /** Whether user has reached Legend */
  readonly isLegend: boolean;
  /** Estimate months ago when each checkpoint was reached (null if not yet reached) */
  readonly checkpointAchievedAtMonths: ReadonlyMap<string, number | null>;
}

/** Alias for backward compatibility */
export const CHECKPOINTS = DASHBOARD_TIERS;

/** Helper: get checkpoints belonging to a given phase */
export function getPhaseCheckpoints(phase: TrainingLevel): TierDef[] {
  return DASHBOARD_TIERS.filter(c => c.phase === phase);
}

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/**
 * Calculate unified score (0-100) combining sets and months.
 * Formula: (sets/50000 * 0.6 + months/96 * 0.4) * 100
 */
export function calculateUnifiedScore(totalSets: number, monthsTraining: number): number {
  const setsProgress = Math.min(totalSets / 50000, 1);
  const monthsProgress = Math.min(monthsTraining / 96, 1);
  
  const score = (setsProgress * 0.6 + monthsProgress * 0.4) * 100;
  return Math.round(score * 10) / 10;
}

/**
 * Find the current checkpoint based on unified score.
 * Returns the highest checkpoint whose positionPercent <= user's score.
 */
export function findCurrentCheckpointIndexByScore(unifiedScore: number): number {
  let idx = 0;
  for (let i = DASHBOARD_TIERS.length - 1; i >= 0; i--) {
    if (unifiedScore >= DASHBOARD_TIERS[i].positionPercent) {
      idx = i;
      break;
    }
  }
  return idx;
}

/**
 * Compute full timeline progress snapshot.
 *
 * @param totalSets     Total lifetime sets
 * @param monthsTraining Months of training
 * @param setsPerWeek   Average sets per week (for ETA calculation)
 */
export function computeTimelineProgress(
  totalSets: number,
  monthsTraining: number,
  setsPerWeek?: number | null,
  checkpointAchievedAtMonths?: Map<string, number | null>,
): TimelineProgress {
  // Calculate weeks of training
  const weeksTraining = Math.max(1, Math.round(monthsTraining * 4.33));
  
  // Calculate unified score first
  const unifiedScore = calculateUnifiedScore(totalSets, monthsTraining);
  const currentIndex = findCurrentCheckpointIndexByScore(unifiedScore);
  const currentCheckpoint = DASHBOARD_TIERS[currentIndex];
  const isLegend = currentIndex === DASHBOARD_TIERS.length - 1;

  const nextCheckpoint = !isLegend && currentIndex < DASHBOARD_TIERS.length - 1
    ? DASHBOARD_TIERS[currentIndex + 1]
    : null;

  // Calculate progress to next based on unified score and checkpoint positions
  let progressToNext = 100;
  let remainingToNext = 0;
  if (nextCheckpoint) {
    const fromPercent = currentCheckpoint.positionPercent;
    const toPercent = nextCheckpoint.positionPercent;
    const range = toPercent - fromPercent;
    if (range > 0) {
      progressToNext = Math.min(100, Math.round(((unifiedScore - fromPercent) / range) * 100));
      remainingToNext = toPercent - unifiedScore;
    }
  }

  // Calculate weekly progress rate based on recent pace (last 4 weeks)
  // Uses sets per week converted to % points per week
  let weeklyProgressRate = 0;
  if (setsPerWeek && setsPerWeek > 0) {
    const setsProgressPerWeek = setsPerWeek / 50000;
    weeklyProgressRate = setsProgressPerWeek * 0.6 * 100;
  }

  return {
    unifiedScore,
    currentCheckpoint,
    nextCheckpoint,
    progressToNext,
    remainingToNext,
    currentIndex,
    trainingLevel: currentCheckpoint.phase,
    totalSets,
    monthsTraining,
    weeksTraining,
    setsPerWeek: setsPerWeek ?? null,
    weeklyProgressRate,
    isLegend,
    checkpointAchievedAtMonths: checkpointAchievedAtMonths ?? new Map(),
  };
}

// ---------------------------------------------------------------------------
// ETA formatting helpers
// ---------------------------------------------------------------------------

/** Format a week count into a human-readable label */
export function formatEta(weeks: number | null): string {
  if (weeks === null || weeks <= 0) return 'Reached';
  if (weeks > 104) return '>2 years';
  if (weeks <= 1) return '~1 week';
  if (weeks < 6) return `~${weeks} weeks`;
  const months = Math.round(weeks / 4.33);
  if (months <= 1) return '~1 month';
  if (months < 12) return `~${months} months`;
  const years = Math.round((months / 12) * 10) / 10;
  if (years <= 1) return '~1 year';
  return `~${years} years`;
}

/** Format months count for display */
export function formatMonths(n: number): string {
  if (n < 12) return `${n} month${n !== 1 ? 's' : ''}`;
  const years = n / 12;
  return `${years.toFixed(1)} year${years !== 1 ? 's' : ''}`;
}

// ---------------------------------------------------------------------------
// Re-exports from tierUtils
// ---------------------------------------------------------------------------

export { calculateAchievement, findTierByAchievement, getNextTier, estimateWeeksToNextTier };
