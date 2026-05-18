import type { WorkoutSet } from '../../types';
import type { DataSourceChoice } from '../../utils/storage/dataSourceStorage';
import type { OnboardingFlow } from '../onboarding/types';

export interface StartupAutoLoadParams {
  parsedData: WorkoutSet[];
  setOnboarding: (flow: OnboardingFlow | null) => void;
  setDataSource: (source: DataSourceChoice | null) => void;
  setParsedData: (data: WorkoutSet[]) => void;
  setHevyLoginError: (error: string | null) => void;
  setLyfatLoginError: (error: string | null) => void;
  setCsvImportError: (error: string | null) => void;
  setIsAnalyzing: (value: boolean) => void;
  isAnalyzing: boolean;
  setLoadingKind: (kind: 'hevy' | 'lyfta' | 'csv' | null) => void;
  startProgress: () => number;
  finishProgress: (startedAt: number) => void;
}
