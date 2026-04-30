
import React, { memo } from 'react';

import { AlertTriangle, Calendar, Dumbbell, Trophy } from 'lucide-react';

import type { DashboardInsights, PRInsights } from '../../utils/analysis/insights';
import { KPICard } from './KPICard';

// PR Status Badge
const PRStatusBadge: React.FC<{ prInsights: PRInsights }> = ({ prInsights }) => {
  const { daysSinceLastPR, prDrought } = prInsights;

  if (daysSinceLastPR < 0) {
    return (
      <span className="text-[10px] text-slate-500">Chase your first PR</span>
    );
  }

  if (prDrought) {
    return (
      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10">
        <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
        <span className="text-[10px] font-bold text-amber-400 whitespace-nowrap">{daysSinceLastPR}d drought</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10">
      <Trophy className="w-3 h-3 text-emerald-400 flex-shrink-0" />
      <span className="text-[10px] font-bold text-emerald-400 whitespace-nowrap">
        {daysSinceLastPR === 0 ? 'PR today!' : `${daysSinceLastPR}d ago`}
      </span>
    </div>
  );
};

// Main Insights Panel Component
interface InsightsPanelProps {
  insights: DashboardInsights;
  totalWorkouts: number;
  totalSets: number;
  totalPRs: number;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = memo(function InsightsPanel(props) {
  const {
    insights,
    totalWorkouts,
    totalSets,
    totalPRs,
  } = props;
  const { rolling7d, streakInfo, prInsights, volumeSparkline, workoutSparkline, prSparkline, setsSparkline, consistencySparkline } = insights;

  return (
    <div className="grid gap-2 grid-cols-2 lg:grid-cols-3">
      {/* Workouts */}
      <KPICard
        title="Lst 7d"
        value={rolling7d.current.totalWorkouts}
        subtitle="workouts"
        icon={Calendar}
        iconColor="text-blue-400"
        delta={rolling7d.workouts ?? undefined}
        deltaContext="vs prev 7d"
        sparkline={workoutSparkline}
        sparklineColor="#3b82f6"
        sparklineTitle="Workout frequency over last 8 weeks"
      />

      {/* Sets This Week */}
      <KPICard
        title="Sets"
        value={rolling7d.current.totalSets}
        subtitle="lst 7d"
        icon={Dumbbell}
        iconColor="text-purple-400"
        delta={rolling7d.sets ?? undefined}
        deltaContext="vs prev 7d"
        sparkline={setsSparkline}
        sparklineColor="#a855f7"
        sparklineTitle="Training volume over last 8 weeks"
      />

      {/* PRs */}
      <KPICard
        title="PRs"
        value={totalPRs}
        subtitle="total"
        icon={Trophy}
        iconColor="text-yellow-400"
        sparkline={prSparkline}
        sparklineColor="#eab308"
        sparklineTitle="Personal records over last 8 weeks"
        badge={<PRStatusBadge prInsights={prInsights} />}
      />
    </div>
  );
});
