'use client';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
}

export default function Sparkline({ data, width = 80, height = 24 }: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <div className="sparkline" style={{ width, height }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="#2A2F3E"
            strokeWidth="1"
          />
        </svg>
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="sparkline" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="#00F5FF"
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    </div>
  );
}
