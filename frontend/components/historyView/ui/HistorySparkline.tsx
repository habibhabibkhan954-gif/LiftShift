import React, { useId } from 'react';

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

export const Sparkline: React.FC<{ data: number[]; width?: number; height?: number; color?: string; title?: string }> = ({
  data,
  width = 60,
  height = 20,
  color = '#10b981',
  title,
}) => {
  if (data.length < 2) return null;
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padX = 4;
  const padY = 4;
  const innerW = Math.max(width - padX * 2, 1);
  const innerH = Math.max(height - padY * 2, 1);

  const trend = data[data.length - 1] - data[0];
  const strokeColor = trend >= 0 ? '#10b981' : '#f43f5e';

  const pts = data.map((val, i) => ({
    x: padX + (i / (data.length - 1)) * innerW,
    y: padY + (innerH - ((val - min) / range) * innerH),
  }));

  const linePath = catmullRomPath(pts);
  const areaPath = `${linePath} L ${width - padX},${height - padY} L ${padX},${height - padY} Z`;

  const gradientId = `hsa-${safeId}`;
  const markerId = `hsm-${safeId}`;
  const edgeFadeId = `hef-${safeId}`;
  const maskId = `hem-${safeId}`;

  return (
    <span title={title} className="inline-block cursor-help">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
            <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={edgeFadeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id={maskId}>
            <rect x="0" y="0" width={width} height={height} fill={`url(#${edgeFadeId})`} />
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
            <path d="M 0 0 L 6 5 L 0 10 z" fill={strokeColor} />
          </marker>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} mask={`url(#${maskId})`} />
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={`url(#${markerId})`}
          opacity="0.8"
        />
      </svg>
    </span>
  );
};
