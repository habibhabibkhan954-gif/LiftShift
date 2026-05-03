/**
 * Centralized preferences hook for easy database migration.
 * 
 * All user preferences are managed through this hook. Currently uses localStorage,
 * but the interface is designed so that swapping to a database backend only requires
 * changing the implementation of the get/save functions - no changes needed in components.
 * 
 * To migrate to a database:
 * 1. Create a PreferencesService class with async get/save methods
 * 2. Replace the localStorage calls in this file with API calls
 * 3. Add loading states and error handling as needed
 * 4. Components using this hook won't need any changes
 */

import { useCallback, useMemo } from 'react';
import {
  WeightUnit,
  getWeightUnit,
  saveWeightUnit,
  StoredBodyMapGender,
  getBodyMapGender,
  saveBodyMapGender,
  ThemeMode,
  getThemeMode,
  saveThemeMode,
  ExerciseTrendMode,
  getExerciseTrendMode,
  saveExerciseTrendMode,
} from '../../utils/storage/localStorage';

/**
 * Shape of all user preferences.
 * Add new preferences here when extending the system.
 */
export interface UserPreferences {
  weightUnit: WeightUnit;
  bodyMapGender: StoredBodyMapGender;
  themeMode: ThemeMode;
  exerciseTrendMode: ExerciseTrendMode;
}

/**
 * Actions to update preferences.
 * Mirrors the shape of UserPreferences with setter functions.
 */
export interface PreferencesActions {
  setWeightUnit: (unit: WeightUnit) => void;
  setBodyMapGender: (gender: StoredBodyMapGender) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setExerciseTrendMode: (mode: ExerciseTrendMode) => void;
}

/**
 * Get all current preferences from storage.
 * This is a synchronous read - for database migration, this would become async.
 */
export const getAllPreferences = (): UserPreferences => ({
  weightUnit: getWeightUnit(),
  bodyMapGender: getBodyMapGender(),
  themeMode: getThemeMode(),
  exerciseTrendMode: getExerciseTrendMode(),
});

/**
 * Hook to access and update user preferences.
 * 
 * Note: This hook returns stable getter functions. For React state integration,
 * components should still manage their own state and use the setters to persist.
 * This design allows for easy database migration while keeping the React
 * reactivity model intact.
 */
export const usePreferences = (): PreferencesActions => {
  const setWeightUnit = useCallback((unit: WeightUnit) => {
    saveWeightUnit(unit);
  }, []);

  const setBodyMapGender = useCallback((gender: StoredBodyMapGender) => {
    saveBodyMapGender(gender);
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    saveThemeMode(mode);
  }, []);

  const setExerciseTrendMode = useCallback((mode: ExerciseTrendMode) => {
    saveExerciseTrendMode(mode);
  }, []);

  return useMemo(() => ({
    setWeightUnit,
    setBodyMapGender,
    setThemeMode,
    setExerciseTrendMode,
  }), [setWeightUnit, setBodyMapGender, setThemeMode, setExerciseTrendMode]);
};

/**
 * Compute the effective "now" date based on user preference.
 * 
 * @param dataBasedNow - The date derived from the latest workout data
 * @param dateMode - User's preference for date calculation
 * @returns The appropriate "now" date based on preference
 * 
 * Behavior:
 * - 'effective' mode (default): Uses the latest workout date as "now"
 *   This makes relative time displays more meaningful (e.g., "yesterday" refers to
 *   the day before the last workout, not the actual yesterday)
 * 
 * - 'actual' mode: Uses the real current date as "now"
 *   This shows true relative times but may result in empty recent charts
 *   if data is old (e.g., if last workout was 3 months ago, "last 7 days" is empty)
 */

export interface DataAgeInfo {
  /** Whether data is considered "stale" (more than 14 days old) */
  isStale: boolean;
}

export const getDataAgeInfo = (dataBasedNow: Date): DataAgeInfo => {
  const actualNow = new Date();
  const diffMs = actualNow.getTime() - dataBasedNow.getTime();
  const daysSinceLastData = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  
  return {
    isStale: daysSinceLastData > 14,
  };
};
