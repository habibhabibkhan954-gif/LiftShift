import { trackEvent, resetUser } from '../../utils/integrations/analytics';
import { computationCache } from '../../utils/storage/computationCache';
import { browserCache } from '../../utils/storage/browserCache';
import { clearCSVData, clearPreferencesConfirmed } from '../../utils/storage/localStorage';
import {
  clearDataSourceChoice,
  clearHevyAuthToken,
  clearLastCsvPlatform,
  clearLastLoginMethod,
  clearCombinedDataSources,
  clearSetupComplete,
} from '../../utils/storage/dataSourceStorage';
import {
  clearHevyProApiKey,
  clearHevyCredentials,
  clearLyftaApiKey,
} from '../../utils/storage/hevyCredentialsStorage';

export const clearCacheAndRestart = (): void => {
  trackEvent('unload_data', {});
  resetUser();
  clearCSVData();
  clearHevyAuthToken();
  clearHevyProApiKey();
  clearHevyCredentials();
  clearLyftaApiKey();
  clearDataSourceChoice();
  clearLastCsvPlatform();
  clearLastLoginMethod();
  clearCombinedDataSources();
  clearSetupComplete();
  clearPreferencesConfirmed();
  computationCache.clear();
  browserCache.clearAllCache();
  window.location.reload();
};

export const forceRefreshAndRelogin = (): void => {
  trackEvent('force_refresh', {});
  resetUser();
  clearCSVData();
  clearHevyAuthToken();
  clearHevyProApiKey();
  clearHevyCredentials();
  clearLyftaApiKey();
  clearDataSourceChoice();
  clearLastCsvPlatform();
  clearLastLoginMethod();
  clearCombinedDataSources();
  clearSetupComplete();
  clearPreferencesConfirmed();
  computationCache.clear();
  browserCache.clearAllCache();
  window.location.reload();
};
