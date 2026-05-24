export { Page };

import React from 'react';
import { InfoShell } from '../../components/info/InfoShell';
import { assetPath } from '../../constants';

function Page() {
  return (
    <InfoShell
      title="How to read your training data like a coach"
      subtitle="Your workout app gives you numbers &mdash; sets, reps, weight, maybe a basic line chart. LiftShift turns those same numbers into answers you can actually act on. Here's how each feature works."
      activeNav={null}
    >
      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. Muscle heatmaps</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            The muscle heatmap is your bird&rsquo;s-eye view of training balance. Each muscle group is colored by total training volume over a rolling 7-day window, with volume zone scoring (Under, Optimal, Over) based on established hypertrophy ranges. Click any muscle to drill down into contributing exercises, see volume trends, and compare left/right balance. The heatmap makes it obvious if you&rsquo;ve been skipping legs or overemphasizing chest.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. Exercise status</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Every exercise gets a status label: <strong>Getting stronger</strong>, <strong>Plateauing</strong>, or <strong>Taking a dip</strong>. LiftShift compares your recent performance (volume load and estimated 1RM trends) against your historical baseline and assigns a confidence level. If you&rsquo;re plateauing, you get a specific, actionable suggestion &mdash; try higher reps, increase frequency, add a variation, or deload.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. Set-by-set feedback</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            After every workout, LiftShift runs each set through 19 predefined scenarios. Did you leave too many reps in reserve? Did your intensity drop mid-workout? Was your volume inconsistent with your typical pattern? Each set gets a badge, a plain-English explanation, and an improvement suggestion. It&rsquo;s like having a coach review your training log without the cost.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. Smart PR tracking</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            LiftShift tracks three kinds of PRs. <strong>All-time bests</strong> are your strongest performance ever. <strong>2-month bests</strong> show recent peaks &mdash; useful when coming back from a break or deload. <strong>Premature PRs</strong> are flagged when you hit a new record but your volume and rep quality suggest you pushed too far too soon. PR droughts are also tracked so you know which lifts need attention.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. AI-ready export</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            One click exports your entire training history as structured data with built-in analysis prompts. The export includes modules for junk volume audit, structural balance, joint health, program adherence, progressive overload analysis, and more. Paste the result into any LLM for personalized insights that go beyond what the dashboard alone can show. See the <a href={assetPath('ai/')} className="text-emerald-300 underline">AI reference</a> page for details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Calendar filtering</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Pick any date range using the calendar filter and every metric recalculates for just that window. Compare last month to the month before. Isolate a specific training block. See how your deload week changed your volume distribution. Every chart, every status label, every PR &mdash; all scoped to the dates you choose.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. Consistency heatmap &amp; Flex cards</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            The GitHub-style consistency heatmap shows your training frequency over time with streaks, consistency scores, and workout day highlights. Flex cards are shareable year-in-review summaries &mdash; your top exercises, total volume, PR count, and consistency stats in a single card. Perfect for sharing progress without dumping raw data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. Lifetime Progress</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Lifetime Progress tracks your cumulative training volume per muscle group on a 9-tier journey from <strong>Seedling</strong> to <strong>Legend</strong>. Each tier represents a volume milestone, giving you a long-term view of your training investment. It&rsquo;s gamification that actually tracks something meaningful &mdash; not streaks for the sake of streaks, but the total work you&rsquo;ve put in.
          </p>
        </section>

        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 mt-6">
          <p className="text-slate-300 text-sm">
            Every feature is documented in detail in the <a href={assetPath('how-it-works/')} className="text-emerald-300 underline">How it works</a> guide. Ready to try it? <a href={assetPath('/')} className="text-emerald-300 underline">Open the dashboard</a> and connect your workout app.
          </p>
        </div>
      </div>
    </InfoShell>
  );
}
