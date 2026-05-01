import React, { Suspense } from 'react';
import { ChartSkeleton } from '../../ui/ChartSkeleton';
import { LazyRender } from '../../ui/LazyRender';

const TopExercisesCard = React.lazy(() => import('../topExercises/TopExercisesCard').then((m) => ({ default: m.TopExercisesCard })));

interface DashboardSecondaryChartsProps {
  topExerciseMode: 'volume' | 'pr';
  setTopExerciseMode: (v: 'volume' | 'pr') => void;
  topExercisesView: 'barh' | 'area';
  setTopExercisesView: (v: 'barh' | 'area') => void;
  topExercisesBarData: any[];
  topExercisesOverTimeData: any[];
  topExerciseNames: string[];
  topExercisesInsight: any;
  pieColors: string[];
  tooltipStyle: any;
  onExerciseClick?: (exerciseName: string) => void;
  assetsMap?: Map<string, any> | null;
  assetsLowerMap?: Map<string, any> | null;
}

export const DashboardSecondaryCharts: React.FC<DashboardSecondaryChartsProps> = ({
  topExerciseMode,
  setTopExerciseMode,
  topExercisesView,
  setTopExercisesView,
  topExercisesBarData,
  topExercisesOverTimeData,
  topExerciseNames,
  topExercisesInsight,
  pieColors,
  tooltipStyle,
  onExerciseClick,
  assetsMap,
  assetsLowerMap,
}) => (
  <div className="min-w-0">
    <LazyRender className="min-w-0" placeholder={<ChartSkeleton className="min-h-[360px]" />}>
      <Suspense fallback={<ChartSkeleton className="min-h-[360px]" />}>
        <TopExercisesCard
          isMounted={true}
          topExerciseMode={topExerciseMode}
          setTopExerciseMode={setTopExerciseMode}
          topExercisesView={topExercisesView}
          setTopExercisesView={setTopExercisesView}
          topExercisesBarData={topExercisesBarData}
          topExercisesOverTimeData={topExercisesOverTimeData}
          topExerciseNames={topExerciseNames}
          topExercisesInsight={topExercisesInsight}
          pieColors={pieColors}
          tooltipStyle={tooltipStyle as any}
          onExerciseClick={onExerciseClick}
          assetsMap={assetsMap}
          assetsLowerMap={assetsLowerMap}
        />
      </Suspense>
    </LazyRender>
  </div>
);
