import React, { useId } from 'react';

import type { SparklinePoint } from '../../utils/analysis/insights';

function catmullRomPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// Mini Sparkline Component
export const Sparkline: React.FC<{
  data: SparklinePoint[];
  color?: string;
  height?: number;
  title?: string;
  width?: number;
}> = ({ data, color = '#3b82f6', height = 24, title, width = 60 }) => {
  if (data.length < 2) return null;

  const uid = useId();
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const coordWidth = width; // keep coordinate space in sync with svg viewBox

  const pts = data
    .map((d, i) => ({
      x: (i / (data.length - 1)) * coordWidth,
      y: height - ((d.value - min) / range) * (height - 4) - 2,
    }));

  const linePath = catmullRomPath(pts);
  const areaPath = `${linePath} L ${coordWidth},${height} L 0,${height} Z`;

  const gradientId = `sa-${uid}`;
  const markerId = `sm-${uid}`;
  const edgeFadeId = `ef-${uid}`;
  const maskId = `em-${uid}`;

  return (
    <span title={title} className="inline-block cursor-help">
      <svg
        width={coordWidth}
        height={height}
        viewBox={`0 0 ${coordWidth} ${height}`}
        className="overflow-visible"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={edgeFadeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="12%" stopColor="white" stopOpacity="1" />
            <stop offset="88%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id={maskId}>
            <rect x="0" y="0" width={coordWidth} height={height} fill={`url(#${edgeFadeId})`} />
          </mask>
          <marker
            id={markerId}
            viewBox="0 0 6 10"
            refX="4.8"
            refY="5"
            markerWidth="5"
            markerHeight="9"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M 0 0 L 6 5 L 0 10 z" fill={color} />
          </marker>
        </defs>

        <path d={areaPath} fill={`url(#${gradientId})`} mask={`url(#${maskId})`} />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={`url(#${markerId})`}
          className="drop-shadow-sm"
        />
      </svg>
    </span>
  );
};
