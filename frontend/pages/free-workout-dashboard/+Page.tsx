export { Page };

import React from 'react';
import { InfoShell } from '../../components/info/InfoShell';
import { assetPath } from '../../constants';

function Page() {
  return (
    <InfoShell
      title="What your workout app doesn't tell you"
      subtitle="Hevy, Strong, and Lyfta are great at logging your workouts. But when it comes to understanding what your data actually means, their built-in charts leave you guessing."
      activeNav={null}
    >
      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Your app logs the work. Here&rsquo;s what it misses</h2>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">Are your muscles balanced?</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            Your logging app tracks exercises, not muscles. It can&rsquo;t tell you that you&rsquo;re doing 3&times; the volume on your anterior delts compared to your rear delts, or that your quads are getting all the love while your hamstrings are neglected. LiftShift maps every exercise to its primary and secondary muscles and builds a color-coded heatmap so you can see imbalances at a glance. Click any muscle and see exactly which exercises are contributing &mdash; and which ones are missing.
          </p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">Are you actually getting stronger?</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            More weight does not always mean more strength. If your reps dropped or your form degraded, that PR might be premature. LiftShift analyzes volume, intensity trends, and rep quality to give each exercise a clear status: <strong>Getting stronger</strong>, <strong>Plateauing</strong>, or <strong>Taking a dip</strong>. It tracks all-time bests, 2-month bests, and premature PRs &mdash; so you know which lifts are genuinely improving and which need attention.
          </p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">What happened inside your last workout?</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            Most apps show you a workout summary: sets completed, volume total. LiftShift goes set-by-set. It analyzes every set across 19 scenarios &mdash; RIR errors, intensity drops, volume mismatches, rep quality issues &mdash; and gives you plain-English feedback with specific suggestions. Was your second set too easy? Did you fall off a cliff on set four? Should you go up in weight next session? You get answers, not just numbers.
          </p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">What if you could ask an AI about your training?</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            LiftShift includes a one-click AI-ready export that packages your entire training history with built-in analysis modules &mdash; junk volume audit, structural balance, joint health, program adherence, and more. Paste it into any LLM and ask questions like &ldquo;Where am I leaving gains on the table?&rdquo; or &ldquo;Is my programming balanced for my goals?&rdquo; See the <a href={assetPath('ai/')} className="text-emerald-300 underline">AI reference</a> page to learn more.
          </p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">What about comparing different training blocks?</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            LiftShift&rsquo;s calendar filter lets you pick any date range and recalculates every metric for that window. Compare your last bulk to your current cut. See how your deload affected volume distribution. Isolate a specific program and check whether it delivered. Your logging app shows you raw data by date; LiftShift lets you ask questions about specific time periods.
          </p>
        </section>

        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 mt-6">
          <p className="text-slate-300 text-sm">
            LiftShift is free and open source. <a href={assetPath('/')} className="text-emerald-300 underline">Open the dashboard</a> to connect Hevy or upload a CSV from Strong or Lyfta. Every feature is documented in the <a href={assetPath('how-it-works/')} className="text-emerald-300 underline">How it works</a> guide.
          </p>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">What about combining apps?</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Switched from Strong to Hevy? Use both? LiftShift merges data from multiple platforms into one dashboard. Your training history doesn&rsquo;t have to be fragmented just because you changed apps. See <a href={assetPath('supported-apps/')} className="text-emerald-300 underline">Supported apps</a> for import guides.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Lifetime Progress tracking</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Beyond per-workout analytics, LiftShift tracks your cumulative training volume per muscle group on a 9-tier journey from <strong>Seedling</strong> to <strong>Legend</strong>. This gives you a long-term view of your training investment that no workout logger provides. Combined with the consistency heatmap and Flex cards, you get a complete picture of not just what you did, but the arc of your training over months and years.
          </p>
        </section>
      </div>
    </InfoShell>
  );
}
