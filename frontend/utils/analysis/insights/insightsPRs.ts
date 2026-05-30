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

  const recentGoldPRs: RecentPR[] = [];
  const seen = new Set<string>();
  for (let i = goldPRs.length - 1; i >= 0 && recentGoldPRs.length < 10; i--) {
    const pr = goldPRs[i];
    if (!seen.has(pr.exercise)) {
      seen.add(pr.exercise);
      recentGoldPRs.push(normalizeDisplayImprovement({ ...pr, isSilver: false }));
    }
  }

  const recentSilverPRs: RecentPR[] = [];
  for (let i = silverPRs.length - 1; i >= 0 && recentSilverPRs.length < 5; i--) {
    const pr = silverPRs[i];
    if (!seen.has(pr.exercise)) {
      seen.add(pr.exercise);
      recentSilverPRs.push(normalizeDisplayImprovement({ ...pr, isSilver: true }));
    }
  }

  const recentPRs = [...recentGoldPRs, ...recentSilverPRs]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

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
