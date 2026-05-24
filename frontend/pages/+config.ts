import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

export default {
  extends: [vikeReact],
  prerender: { partial: true },
  title: 'LiftShift — Free Workout Analytics Dashboard',
  description:
    'Turn Hevy, Strong, and Lyfta workout logs into beautiful analytics dashboards. Track volume trends, PRs, muscle heatmaps, and exercise progress. 100% free, runs in your browser.',
  baseAssets: process.env.BASE_ASSETS || undefined,
} satisfies Config;
