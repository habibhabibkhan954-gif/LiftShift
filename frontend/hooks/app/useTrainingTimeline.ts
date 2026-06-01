import { useMemo } from 'react';
import { differenceInMonths, differenceInCalendarWeeks, subWeeks } from 'date-fns';
import type { WorkoutSet } from '../../types';
import { isWarmupSet } from '../../utils/analysis/classification';
import { isUnilateralSet } from '../../utils/analysis/classification/setClassification';
import {
  computeTimelineProgress,
  calculateUnifiedScore,
  JOURNEY_TIERS,
  type TimelineProgress,
} from '../../utils/training/trainingTimeline';

/**
 * Walk through workout history chronologically and compute the actual month number
 * (relative to earliestDate) when the unified score first crossed each checkpoint threshold.
 */
function computeActualCheckpointAchievedMonths(
  data: WorkoutSet[],
  earliestDate: Date,
): Map<string, number | null> {
  const result = new Map<string, number | null>();
  const recorded = new Set<string>();

  for (const cp of JOURNEY_TIERS) {
    if (cp.positionPercent === 0) {
      result.set(cp.key, 0);
      recorded.add(cp.key);
    } else {
      result.set(cp.key, null);
    }
  }

  // Group sets by unique date, accumulating counts per day
  const dateMap = new Map<string, { date: Date; sets: number }>();
  for (const s of data) {
    if (!s.parsedDate || isWarmupSet(s)) continue;
    const key = s.parsedDate.toISOString().split('T')[0];
    const existing = dateMap.get(key);
    if (existing) {
      existing.sets += isUnilateralSet(s) ? 0.5 : 1;
    } else {
      dateMap.set(key, { date: s.parsedDate, sets: isUnilateralSet(s) ? 0.5 : 1 });
    }
  }

  // Sort chronologically
  const sorted = [...dateMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  let cumulativeSets = 0;
  for (const [, { date, sets }] of sorted) {
    cumulativeSets += sets;
    const monthsAtDate = Math.max(0, differenceInMonths(date, earliestDate));
    const score = calculateUnifiedScore(cumulativeSets, monthsAtDate);

    for (const cp of JOURNEY_TIERS) {
      if (recorded.has(cp.key)) continue;
      if (score >= cp.positionPercent) {
        result.set(cp.key, Math.round(monthsAtDate * 10) / 10);
        recorded.add(cp.key);
      }
    }
  }

  return result;
}

/**
 * Compute the user's position on the training timeline using a unified score system.
 *
 * - Total sets = primary driver (measures actual work done)
 * - Months = time from first workout to latest workout (effective date)
 * - Recent sets per week = for pace estimation
 *
 * Returns the full TimelineProgress snapshot.
 */
export const useTrainingTimeline = (
  data: WorkoutSet[],
  effectiveNow?: Date,
): TimelineProgress => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return computeTimelineProgress(0, 0, null);
    }

    // Count total sets (excluding warmups)
    // Unilateral sets (left/right) count as 0.5
    let totalSets = 0;
    let earliestDate: Date | null = null;
    let latestDate: Date | null = null;

    for (const s of data) {
      if (isWarmupSet(s)) continue;

      const d = s.parsedDate;
      if (!d) continue;

      // Track earliest and latest dates
      if (!earliestDate || d < earliestDate) {
        earliestDate = d;
      }
      if (!latestDate || d > latestDate) {
        latestDate = d;
      }

      // Count sets (0.5 for unilateral, 1 for bilateral)
      const setCount = isUnilateralSet(s) ? 0.5 : 1;
      totalSets += setCount;
    }

    if (!earliestDate || !latestDate) {
      return computeTimelineProgress(0, 0, null);
    }

    // Months = time from first workout to latest workout (not current date)
    const monthsTraining = differenceInMonths(latestDate, earliestDate);
    const weeksTraining = differenceInCalendarWeeks(latestDate, earliestDate) || 1;

    // Recent sets per week calculation
    const recentSetsCutoff = subWeeks(latestDate, 4);
    let recentSets = 0;
    for (const s of data) {
      if (isWarmupSet(s)) continue;
      const d = s.parsedDate;
      if (!d || d < recentSetsCutoff) continue;
      recentSets += isUnilateralSet(s) ? 0.5 : 1;
    }

    // Sets per week (overall average)
    const setsPerWeek = totalSets / weeksTraining;

    // Recent sets per week (for pace estimation)
    const recentSetsPerWeek = recentSets / 4;

    // Use recent pace for better ETA estimates
    const paceForEta = recentSets > 0 ? recentSetsPerWeek : setsPerWeek;

    // Compute actual checkpoint achieved dates from workout history
    const checkpointAchievedAtMonths = computeActualCheckpointAchievedMonths(data, earliestDate);

    return computeTimelineProgress(totalSets, monthsTraining, paceForEta, checkpointAchievedAtMonths);
  }, [data, effectiveNow]);
};
