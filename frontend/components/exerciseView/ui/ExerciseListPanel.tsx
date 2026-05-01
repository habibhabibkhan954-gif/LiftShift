import React, { useCallback } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import { ExerciseStats } from '../../../types';
import { ExerciseAssetLookup } from '../../../utils/exercise/exerciseAssetLookup';
import type { UseExerciseFiltersReturn } from '../hooks/useExerciseFilters';
import { ExerciseListRow } from './ExerciseListRow';
import { SegmentControl } from '../../ui/SegmentControl';

interface ExerciseListPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  exerciseListSortMode: UseExerciseFiltersReturn['exerciseListSortMode'];
  setExerciseListSortMode: UseExerciseFiltersReturn['setExerciseListSortMode'];
  exerciseListSortDir: UseExerciseFiltersReturn['exerciseListSortDir'];
  setExerciseListSortDir: UseExerciseFiltersReturn['setExerciseListSortDir'];
  filteredExercises: ExerciseStats[];
  selectedExerciseName: string;
  statusMap: UseExerciseFiltersReturn['statusMap'];
  assetLookup: ExerciseAssetLookup | null;
  trainingStructure: UseExerciseFiltersReturn['trainingStructure'];
  lastSessionByName: UseExerciseFiltersReturn['lastSessionByName'];
  effectiveNow: Date;
  exerciseButtonRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  onExerciseClick?: (exerciseName: string) => void;
  setSelectedExerciseName: (name: string) => void;
}

export const ExerciseListPanel: React.FC<ExerciseListPanelProps> = ({
  searchTerm,
  setSearchTerm,
  exerciseListSortMode,
  setExerciseListSortMode,
  exerciseListSortDir,
  setExerciseListSortDir,
  filteredExercises,
  selectedExerciseName,
  statusMap,
  assetLookup,
  trainingStructure,
  lastSessionByName,
  effectiveNow,
  exerciseButtonRefs,
  onExerciseClick,
  setSelectedExerciseName,
}) => {
  const handleSelect = useCallback((exerciseName: string) => {
    if (onExerciseClick) {
      onExerciseClick(exerciseName);
    } else {
      setSelectedExerciseName(exerciseName);
    }
    
    // Auto-scroll on mobile to show the exercise details below
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      // Small delay to let React render and blur take effect
      requestAnimationFrame(() => {
        setTimeout(() => {
          const summaryPanel = document.querySelector('[data-exercise-summary-panel]');
          if (summaryPanel) {
            summaryPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    }
  }, [onExerciseClick, setSelectedExerciseName]);

  return (
    <div className="lg:col-span-1 flex flex-col gap-1 h-[25vh] lg:h-0 lg:min-h-full">
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search for exercises..."
          className="w-full bg-black/70 border border-slate-700/50 rounded-lg pl-9 pr-[8.5rem] py-1 sm:py-2 text-[11px] sm:text-xs text-slate-200 focus:outline-none focus:border-transparent transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <SegmentControl
            options={[
              { value: 'recent', label: 'recent', title: 'Sort by most recently trained' },
              { value: 'trend', label: '%', title: 'Sort by % strength change' },
            ]}
            value={exerciseListSortMode}
            onChange={setExerciseListSortMode}
          />

          <button
            type="button"
            onClick={() => setExerciseListSortDir(exerciseListSortDir === 'desc' ? 'asc' : 'desc')}
            title={exerciseListSortMode === 'trend'
              ? (exerciseListSortDir === 'desc' ? 'Highest % to lowest' : 'Lowest % to highest')
              : (exerciseListSortDir === 'desc' ? 'Latest to oldest' : 'Oldest to latest')}
            aria-label="Reverse sort direction"
            className="p-2 rounded-lg bg-black/70 border border-slate-700/50 text-slate-500 hover:text-slate-300 hover:bg-black/60 transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-black/70 border border-slate-700/50 rounded-lg overflow-hidden flex flex-col min-h-0">
        <div className="overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar flex-1">
          {filteredExercises.map((exercise) => {
            const status = statusMap[exercise.name];
            const isSelected = selectedExerciseName === exercise.name;
            const asset = assetLookup?.getAsset(exercise.name);
            const eligibility = trainingStructure.eligibilityByName.get(exercise.name);
            const isEligible = eligibility?.isEligible ?? false;
            const inactiveLabel = eligibility?.inactiveLabel ?? 'inactive';
            const lastDone = lastSessionByName.get(exercise.name) ?? null;

            return (
              <ExerciseListRow
                key={exercise.name}
                exercise={exercise}
                asset={asset}
                status={status}
                isSelected={isSelected}
                isEligible={isEligible}
                inactiveLabel={inactiveLabel}
                lastDone={lastDone}
                effectiveNow={effectiveNow}
                onSelect={() => handleSelect(exercise.name)}
                rowRef={(el) => {
                  exerciseButtonRefs.current[exercise.name] = el;
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
