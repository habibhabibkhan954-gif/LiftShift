import React, { useMemo } from 'react';
import {
  ScatterChart as ReScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { SegmentControl } from '../../ui/SegmentControl';
import {
  FACTOR_WEIGHTS,
  type MuscleHypertrophyData,
} from '../../../utils/muscle/hypertrophy/hypertrophyScore';

const PROGRESS_MID = 25;
const VOLUME_MID = 25;

const SCORE_COLORS = ['#ef4444', '#f59e0b', '#22c55e'] as const;

const getDotColor = (total: number) => {
  if (total <= 30) return SCORE_COLORS[0];
  if (total <= 60) return SCORE_COLORS[1];
  return SCORE_COLORS[2];
};

const volColor = (v: number) => v <= 15 ? '#ef4444' : v <= 35 ? '#f59e0b' : '#22c55e';
const progColor = (v: number) => v <= 11 ? '#ef4444' : v <= 22 ? '#f59e0b' : '#22c55e';

interface ChartPoint {
  name: string;
  muscleId: string;
  progress: number;
  volume: number;
  total: number;
  quadrant: string;
}

interface HypertrophyScatterCardProps {
  hypertrophyData: MuscleHypertrophyData[];
  hypertrophyPeriod: '7d' | '30d';
  setHypertrophyPeriod: (v: '7d' | '30d') => void;
}

function getQuadrant(progress: number, volume: number): string {
  if (volume >= VOLUME_MID && progress < PROGRESS_MID) return 'Volume Focus';
  if (volume >= VOLUME_MID && progress >= PROGRESS_MID) return 'Optimal Growth';
  if (volume < VOLUME_MID && progress < PROGRESS_MID) return 'Undertrained';
  return 'Strength Focus';
}

/** Euclidean distance in (progress, volume) space — max domain is (50,50) so max dist ~70 */
function dist(a: ChartPoint, b: ChartPoint): number {
  return Math.sqrt((a.progress - b.progress) ** 2 + (a.volume - b.volume) ** 2);
}

function filterLabelsByCluster(points: ChartPoint[]): string[] {
  if (points.length === 0) return [];
  const sorted = [...points].sort((a, b) => b.total - a.total);
  const ids = new Set<string>();
  ids.add(sorted[0].muscleId);
  for (let i = 1; i < sorted.length; i++) {
    // Check 2D distance to every already-labeled point
    let tooClose = false;
    for (const labeled of sorted) {
      if (!ids.has(labeled.muscleId)) continue;
      const d = dist(sorted[i], labeled);
      if (d < 3) { tooClose = true; break; }
    }
    if (!tooClose) {
      ids.add(sorted[i].muscleId);
    }
  }
  return Array.from(ids);
}

export const HypertrophyScatterCard: React.FC<HypertrophyScatterCardProps> = ({
  hypertrophyData,
  hypertrophyPeriod,
  setHypertrophyPeriod,
}) => {
  const chartData: ChartPoint[] = useMemo(() =>
    hypertrophyData.map(m => {
      const progress = Math.round(m.score.progressiveOverload);
      const volume = Math.round(m.score.volumeScore * FACTOR_WEIGHTS.volumeScore);
      return {
        name: m.muscleName,
        muscleId: m.muscleId,
        progress,
        volume,
        total: m.score.totalScore,
        quadrant: getQuadrant(progress, volume),
      };
    }),
    [hypertrophyData]
  );

  const labeledIds = useMemo(() => filterLabelsByCluster(chartData), [chartData]);

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d: ChartPoint | undefined = payload[0]?.payload;
    if (!d) return null;

    const quadrantDesc: Record<string, { desc: string; advice: string }> = {
      'Volume Focus': { desc: 'High volume but lagging strength progress', advice: 'Focus on progressive overload, add weight or reps slowly' },
      'Optimal Growth': { desc: 'High volume + strong progress, ideal for hypertrophy', advice: 'Keep it up! Maintain this balance for gains' },
      'Undertrained': { desc: 'Low volume + low progress', advice: 'If prioritizing this muscle, add sets and train 2-3x/week' },
      'Strength Focus': { desc: 'Strong progress despite low volume', advice: 'Consider increasing volume for more size gains' },
    };

    const q = quadrantDesc[d.quadrant];
    return (
      <div className="rounded-lg px-3 py-2 shadow-2xl border text-xs"
        style={{ backgroundColor: 'rgb(var(--panel-rgb) / 0.95)', borderColor: 'rgb(var(--border-rgb) / 0.5)', color: 'var(--text-primary)' }}>
        <p className="font-semibold mb-1.5">{d.name} <span className="opacity-60 font-normal">({d.total}/100)</span></p>
        <div className="flex items-center gap-3 mb-1.5">
          <span>Progress <b style={{ color: progColor(d.progress) }}>{d.progress}/40</b></span>
          <span>Volume <b style={{ color: volColor(d.volume) }}>{d.volume}/50</b></span>
        </div>
        <div className="border-t pt-1.5 text-slate-400" style={{ borderColor: 'rgb(var(--border-rgb) / 0.3)' }}>
          <p className="font-semibold text-[10px]">{d.quadrant}</p>
          <p className="text-[9px] leading-tight mt-0.5">{q.desc}</p>
          <p className="text-[8px] mt-1">{q.advice}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black/70 rounded-xl border border-slate-700/50 overflow-hidden h-[400px] sm:h-[450px] lg:h-full flex flex-col">
      <div className="p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-white">Hypertrophy Scatter Plot</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Progress vs Volume per muscle</p>
          </div>
          <SegmentControl
            options={[
              { value: '7d', label: 'lst wk', title: 'Last 7 days' },
              { value: '30d', label: 'lst mo', title: 'Last 30 days' },
            ]}
            value={hypertrophyPeriod}
            onChange={(v) => setHypertrophyPeriod(v as '7d' | '30d')}
          />
        </div>
      </div>

      <div className="flex-1 w-full relative" style={{ minHeight: 300 }}>
        {hypertrophyData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <ReScatterChart margin={{ top: 28, right: 8, bottom: 28, left: 0 }}>
                <XAxis type="number" dataKey="volume" domain={[0, 50]}
                  tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={{ stroke: '#475569' }}
                  label={{ value: 'Volume', position: 'bottom', offset: 5, fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                <YAxis type="number" dataKey="progress" domain={[0, 50]}
                  tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={{ stroke: '#475569' }} width={28}
                  label={{ value: 'Progress', angle: 0, position: 'insideTop', offset: -18, dx: +12, fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />

                <ReferenceLine x={VOLUME_MID} stroke="#475569" strokeDasharray="4 4" strokeWidth={1} />
                <ReferenceLine y={PROGRESS_MID} stroke="#475569" strokeDasharray="4 4" strokeWidth={1} />

                <RechartsTooltip content={<CustomScatterTooltip />} />

                <Scatter data={chartData} shape="circle" isAnimationActive={false}>
                  {chartData.map((entry) => {
                    const c = getDotColor(entry.total);
                    return (
                      <Cell
                        key={entry.muscleId}
                        fill={c}
                        fillOpacity={0.85}
                        stroke={c}
                        strokeWidth={0.5}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  })}
                </Scatter>

                <Scatter data={chartData.filter(d => labeledIds.includes(d.muscleId))} shape="circle" isAnimationActive={false} legendType="none"
                  label={{ dataKey: 'name', position: 'top', fontSize: 10, fill: '#7f7b7b', offset: 2, fontWeight: 600 }} >
                  {chartData.filter(d => labeledIds.includes(d.muscleId)).map((entry) => (
                    <Cell key={entry.muscleId} fill="transparent" stroke="none" />
                  ))}
                </Scatter>
              </ReScatterChart>
            </ResponsiveContainer>

           
          </>
        ) : (
          <div className="text-[10px] text-slate-500 py-4 text-center">No muscle data available.</div>
        )}
      </div>
   
    </div>
  );
};