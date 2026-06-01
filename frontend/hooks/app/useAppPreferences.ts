import { useState, useEffect, useLayoutEffect } from 'react';
import { useTheme } from '../../components/theme/ThemeProvider';
import { useFont } from '../../components/theme/FontProvider';
import { setContext } from '../../utils/integrations/analytics';
import {
  FontChoice,
  WeightUnit,
  getWeightUnit,
  saveWeightUnit,
  StoredBodyMapGender,
  getBodyMapGender,
  saveBodyMapGender,
  ExerciseTrendMode,
  getExerciseTrendMode,
  saveExerciseTrendMode,
  getSecondarySetMultiplier,
  saveSecondarySetMultiplier,
  getShowTransparency,
  saveShowTransparency,
  getDarkBgChoice,
  saveDarkBgChoice,
  getLightBgChoice,
  saveLightBgChoice,
} from '../../utils/storage/localStorage';
import { BodyMapGender } from '../../components/bodyMap/BodyMap';

import type { ThemeMode } from '../../utils/storage/localStorage';

export interface UseAppPreferencesReturn {
  // Theme
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;

  // Font
  font: FontChoice;
  setFont: (font: FontChoice) => void;
  
  // Weight unit
  weightUnit: WeightUnit;
  setWeightUnit: (unit: WeightUnit) => void;
  
  // Body map gender
  bodyMapGender: BodyMapGender;
  setBodyMapGender: (gender: BodyMapGender) => void;
  
  // Exercise trend mode
  exerciseTrendMode: ExerciseTrendMode;
  setExerciseTrendMode: (mode: ExerciseTrendMode) => void;

  // Secondary set multiplier
  secondarySetMultiplier: number;
  setSecondarySetMultiplier: (value: number) => void;

  // Show transparency
  showTransparency: boolean;
  setShowTransparency: (value: boolean) => void;

  // Background image choices
  darkBgChoice: string;
  setDarkBgChoice: (value: string) => void;
  lightBgChoice: string;
  setLightBgChoice: (value: string) => void;
}

export function useAppPreferences(): UseAppPreferencesReturn {
  const { mode, setMode } = useTheme();
  const { font, setFont } = useFont();
  
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>(() => getWeightUnit());
  const [bodyMapGender, setBodyMapGenderState] = useState<BodyMapGender>(() => getBodyMapGender());
  const [exerciseTrendMode, setExerciseTrendModeState] = useState<ExerciseTrendMode>(() => getExerciseTrendMode());
  const [secondarySetMultiplier, setSecondarySetMultiplierState] = useState<number>(() => getSecondarySetMultiplier());
  const [showTransparency, setShowTransparencyState] = useState<boolean>(() => getShowTransparency());
  const [darkBgChoice, setDarkBgChoiceState] = useState<string>(() => getDarkBgChoice());
  const [lightBgChoice, setLightBgChoiceState] = useState<string>(() => getLightBgChoice());

  // Persist weight unit
  useEffect(() => {
    saveWeightUnit(weightUnit);
    setContext({ weight_unit: weightUnit });
  }, [weightUnit]);

  // Persist body map gender
  useEffect(() => {
    saveBodyMapGender(bodyMapGender as StoredBodyMapGender);
    setContext({ body_map_gender: bodyMapGender });
  }, [bodyMapGender]);

  // Persist exercise trend mode
  useEffect(() => {
    saveExerciseTrendMode(exerciseTrendMode);
  }, [exerciseTrendMode]);

  // Persist secondary set multiplier
  useEffect(() => {
    saveSecondarySetMultiplier(secondarySetMultiplier);
  }, [secondarySetMultiplier]);

  // Persist show transparency
  useEffect(() => {
    saveShowTransparency(showTransparency);
  }, [showTransparency]);

  // Persist dark bg choice
  useEffect(() => {
    saveDarkBgChoice(darkBgChoice);
  }, [darkBgChoice]);

  // Persist light bg choice
  useEffect(() => {
    saveLightBgChoice(lightBgChoice);
  }, [lightBgChoice]);

  // Apply CSS variables - heatmap hue (warm red for dark themes)
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--heatmap-hue', '142');
    root.style.setProperty('--bodymap-hover-rgb', '14 90 182');
    root.style.setProperty('--bodymap-selection-rgb', '37 99 235');
  }, []);

  return {
    mode,
    setMode,
    font,
    setFont,
    weightUnit,
    setWeightUnit: setWeightUnitState,
    bodyMapGender,
    setBodyMapGender: setBodyMapGenderState,
    exerciseTrendMode,
    setExerciseTrendMode: setExerciseTrendModeState,
    secondarySetMultiplier,
    setSecondarySetMultiplier: setSecondarySetMultiplierState,
    showTransparency,
    setShowTransparency: setShowTransparencyState,
    darkBgChoice,
    setDarkBgChoice: setDarkBgChoiceState,
    lightBgChoice,
    setLightBgChoice: setLightBgChoiceState,
  };
}
