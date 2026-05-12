import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExerciseStats } from '../../../types';

export interface UseExerciseSelectionReturn {
  selectedExerciseName: string;
  setSelectedExerciseName: (name: string) => void;
  exerciseButtonRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  scrollToExercise: (exerciseName: string) => void;
}

export interface UseExerciseSelectionProps {
  stats: ExerciseStats[];
  highlightedExercise?: string | null;
  onHighlightApplied?: () => void;
  defaultExerciseName?: string;
}

export function useExerciseSelection({
  stats,
  highlightedExercise,
  onHighlightApplied,
  defaultExerciseName = '',
}: UseExerciseSelectionProps): UseExerciseSelectionReturn {
  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(highlightedExercise || defaultExerciseName || '');
  const exerciseButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Handle highlight from URL param
  useEffect(() => {
    if (!highlightedExercise) return;

    const trimmed = highlightedExercise.trim();
    const exact = stats.find(s => s.name === trimmed)?.name;
    const caseInsensitive = exact
      ? exact
      : stats.find(s => s.name.trim().toLowerCase() === trimmed.toLowerCase())?.name;

    if (!caseInsensitive) return;

    setSelectedExerciseName(caseInsensitive);
    requestAnimationFrame(() => {
      const el = exerciseButtonRefs.current[caseInsensitive];
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    onHighlightApplied?.();
  }, [highlightedExercise, onHighlightApplied, stats]);

  const scrollToExercise = useCallback((exerciseName: string) => {
    const el = exerciseButtonRefs.current[exerciseName];
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  return {
    selectedExerciseName,
    setSelectedExerciseName,
    exerciseButtonRefs,
    scrollToExercise,
  };
}
