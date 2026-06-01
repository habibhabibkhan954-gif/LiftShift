import darkBg1 from './dark-bg1.avif';
import darkBg5 from './dark-bg5.avif';
import lightBg1 from './light-bg1.avif';

const darkImageMap: Record<string, string> = {
  'dark-bg1': darkBg1,
  'dark-bg5': darkBg5,
};

const lightImageMap: Record<string, string> = {
  'light-bg1': lightBg1,
};

function resolveDarkBg(choice: string): string {
  return darkImageMap[choice] ?? darkBg1;
}

function resolveLightBg(choice: string): string {
  return lightImageMap[choice] ?? lightBg1;
}

function resolveDarkBgByMode(_mode: string, choice: string): string {
  return resolveDarkBg(choice);
}

export { resolveDarkBg, resolveLightBg, resolveDarkBgByMode, darkImageMap, lightImageMap };
