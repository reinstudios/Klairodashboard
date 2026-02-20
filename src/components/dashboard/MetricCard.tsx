import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const W = 110, H = 46;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4) + 2}`)
    .join(' ');
  const color = positive ? '#5D9DF5' : '#D32F2F';
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', flexShrink: 0 }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  data: number[];
  period?: string;
}

export function MetricCard({ label, value, delta, positive, data, period = 'vs prev period' }: MetricCardProps) {
  return (
    <div
      className="bg-white rounded-xl border border-[#EBEBEB] p-4 hover:border-[#D4D4D4] transition-colors"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Label */}
      <p style={{
        fontSize: '10px', fontWeight: 700, color: '#AAAAAA',
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px',
      }}>
        {label}
      </p>

      {/* Value row: number left, sparkline right */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#1C1C1C', lineHeight: 1, letterSpacing: '-0.01em' }}>
            {value}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            {positive
              ? <TrendingUp size={10} color="#2E7D32" strokeWidth={2.5} />
              : <TrendingDown size={10} color="#D32F2F" strokeWidth={2.5} />
            }
            <span style={{
              fontSize: '11px', fontWeight: 600,
              color: positive ? '#2E7D32' : '#D32F2F',
            }}>
              {delta}
            </span>
            <span style={{ fontSize: '11px', color: '#AAAAAA' }}>{period}</span>
          </div>
        </div>
        <Sparkline data={data} positive={positive} />
      </div>
    </div>
  );
}
