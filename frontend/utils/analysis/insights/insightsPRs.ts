import { differenceInDays, subDays } from 'date-fns';
import { WorkoutSet } from '../../../types';
import {
  PRDetectionResult,
  detectGoldAndSilverPRs,
  sortSetsChronologically,
} from '../core/prCalculation';
import { getLoadProgressionDirection } from '../../exercise/loadProgression';

export type RecentPR = PRDetectionResult & { isSilver?: boolean };

export interface PRInsights {
  daysSinceLastPR: number;
  lastPRDate: Date | null;
  lastPRExercise: string | null;
  prDrought: boolean;
  recentPRs: RecentPR[];
  prFrequency: number;
  totalPRs: number;
  totalSilverPRs: number;
  recentSilverPRs: RecentPR[];
}

const SILVER_PR_WINDOW_DAYS = 60;

const normalizeDisplayImprovement = (pr: RecentPR): RecentPR => {
  const isLowerWeightBetter = getLoadProgressionDirection(pr.exercise) === 'lower';
  if (!isLowerWeightBetter) return pr;
  return {
    ...pr,
    improvement: Math.abs(pr.improvement),
  };
};

export const calculatePRInsights = (data: WorkoutSet[], now: Date = new Date(0)): PRInsights => {
  const sorted = sortSetsChronologically(data);

  if (sorted.length === 0) {
    return {
      daysSinceLastPR: 0,
      lastPRDate: null,
      lastPRExercise: null,
      prDrought: false,
      recentPRs: [],
      prFrequency: 0,
      totalPRs: 0,
      totalSilverPRs: 0,
      recentSilverPRs: [],
    };
  }

  const { goldPRs, silverPRs } = detectGoldAndSilverPRs(sorted, SILVER_PR_WINDOW_DAYS, now);

  const lastGoldPR = goldPRs[goldPRs.length - 1];
  const daysSinceLastPR = lastGoldPR ? differenceInDays(now, lastGoldPR.date) : 0;

  const PR_TYPE_PRIORITY: Record<string, number> = {
    weight: 3,
    oneRm: 2,
    volume: 1,
  };

  // Per-exercise best: highest priority type, newest if same priority
  const bestGold = new Map<string, { pr: PRDetectionResult; priority: number }>();
  for (const pr of goldPRs) {
    const p = PR_TYPE_PRIORITY[pr.type] ?? 0;
    const existing = bestGold.get(pr.exercise);
    if (!existing || p > existing.priority || (p === existing.priority && pr.date > existing.pr.date)) {
      bestGold.set(pr.exercise, { pr, priority: p });
    }
  }

  const recentGoldPRs = Array.from(bestGold.values())
    .map(({ pr }) => normalizeDisplayImprovement({ ...pr, isSilver: false }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 7);

  // Per-exercise best for silver: highest priority, exclude exercises already in gold
  const goldExercises = new Set(bestGold.keys());
  const bestSilver = new Map<string, { pr: PRDetectionResult; priority: number }>();
  for (const pr of silverPRs) {
    if (goldExercises.has(pr.exercise)) continue;
    const p = PR_TYPE_PRIORITY[pr.type] ?? 0;
    const existing = bestSilver.get(pr.exercise);
    if (!existing || p > existing.priority || (p === existing.priority && pr.date > existing.pr.date)) {
      bestSilver.set(pr.exercise, { pr, priority: p });
    }
  }

  const recentSilverPRs = Array.from(bestSilver.values())
    .map(({ pr }) => normalizeDisplayImprovement({ ...pr, isSilver: true }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const recentPRs = [...recentGoldPRs, ...recentSilverPRs]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 7);

  const thirtyDaysAgo = subDays(now, 30);
  const recentGoldCount = goldPRs.filter((pr) => pr.date >= thirtyDaysAgo).length;
  const prFrequency = Math.round((recentGoldCount / 4) * 10) / 10;

  return {
    daysSinceLastPR,
    lastPRDate: lastGoldPR?.date ?? null,
    lastPRExercise: lastGoldPR?.exercise ?? null,
    prDrought: daysSinceLastPR > 14,
    recentPRs,
    prFrequency,
    totalPRs: goldPRs.length,
    totalSilverPRs: silverPRs.length,
    recentSilverPRs,
  };
};
