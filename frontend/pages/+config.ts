import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

export default {
  extends: [vikeReact],
  prerender: { partial: true },
  title: 'LiftShift — Free &amp; Open Source Workout Analytics',
  description:
    'Free and open source workout analytics. Import your gym logs from Hevy, Strong, or Lyfta — get muscle heatmaps, plateau detection, set-by-set feedback, and AI-ready exports. Runs in your browser, no account needed.',
  baseAssets: process.env.BASE_ASSETS || undefined,
} satisfies Config;
