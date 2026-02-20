import React from 'react';
import {
  ResponsiveContainer, ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  BarChart, Bar, Cell,
} from 'recharts';

// ── Revenue Trend ────────────────────────────────────────────────────
const revenueData = [
  { day: 'Mon', actual: 9400,  forecast: null  },
  { day: 'Tue', actual: 10200, forecast: null  },
  { day: 'Wed', actual: 11400, forecast: null  },
  { day: 'Thu', actual: 13200, forecast: null  },
  { day: 'Fri', actual: 14200, forecast: 14200 },
  { day: 'Sat', actual: null,  forecast: 15100 },
  { day: 'Sun', actual: null,  forecast: 16400 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const val = payload.find((p: any) => p.value !== null)?.value;
  if (!val) return null;
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <p style={{ fontSize: '10px', color: '#AAAAAA', marginBottom: '3px' }}>{label}</p>
      <p style={{ fontSize: '15px', fontWeight: 700, color: '#1C1C1C' }}>${val.toLocaleString()}</p>
    </div>
  );
};

export function RevenueTrendChart() {
  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
            Revenue
          </p>
          <div className="flex items-center gap-2.5">
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1C1C1C', lineHeight: 1 }}>$14,200</p>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#5D9DF5' }}>↑ 22% vs last week</span>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5">
            <svg width="20" height="2" style={{ overflow: 'visible' }}>
              <line x1="0" y1="1" x2="20" y2="1" stroke="#5D9DF5" strokeWidth="2" />
            </svg>
            <span style={{ fontSize: '11px', color: '#888888' }}>Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="20" height="2" style={{ overflow: 'visible' }}>
              <line x1="0" y1="1" x2="20" y2="1" stroke="#5D9DF5" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.5" />
            </svg>
            <span style={{ fontSize: '11px', color: '#888888' }}>Forecast</span>
          </div>
        </div>
      </div>

      {/* Chart — explicit pixel height so Recharts can resolve it */}
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={revenueData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="actualAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#5D9DF5" stopOpacity={0.14} />
              <stop offset="100%" stopColor="#5D9DF5" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F0F0F0" strokeWidth={1} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#AAAAAA', fontFamily: 'Inter,sans-serif' }}
            axisLine={false} tickLine={false} tickMargin={10}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#AAAAAA', fontFamily: 'Inter,sans-serif' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `$${v / 1000}k`}
            domain={[0, 18000]}
            ticks={[0, 5000, 9000, 14000, 18000]}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Vertical dashed divider at today (Fri) */}
          <ReferenceLine x="Fri" stroke="#5D9DF5" strokeDasharray="4 3" strokeOpacity={0.35} strokeWidth={1} />
          {/* Actual — solid area */}
          <Area
            type="monotone" dataKey="actual"
            stroke="#5D9DF5" strokeWidth={2}
            fill="url(#actualAreaGrad)" fillOpacity={1}
            dot={false} activeDot={{ r: 4, fill: '#5D9DF5', strokeWidth: 0 }}
            connectNulls={false}
          />
          {/* Forecast — dashed line only */}
          <Line
            type="monotone" dataKey="forecast"
            stroke="#5D9DF5" strokeWidth={1.5}
            strokeDasharray="5 4" strokeOpacity={0.45}
            dot={false} activeDot={{ r: 3, fill: '#5D9DF5', strokeWidth: 0 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Channel Breakdown ────────────────────────────────────────────────
const channelData = [
  { name: 'Meta Ads',   value: 47200, roas: '4.2x', color: '#5D9DF5' },
  { name: 'Shopify',    value: 38100, roas: '—',     color: '#1C1C1C' },
  { name: 'Google Ads', value: 18400, roas: '3.1x',  color: '#93BCF8' },
  { name: 'Klaviyo',    value: 9600,  roas: '8.2x',  color: '#BDD6FC' },
  { name: 'TikTok',     value: 5100,  roas: '2.8x',  color: '#D9EAFF' },
];
const totalChannel = channelData.reduce((s, d) => s + d.value, 0);

export function ChannelBreakdownChart() {
  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="mb-5">
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
          Revenue by Channel
        </p>
        <p style={{ fontSize: '24px', fontWeight: 700, color: '#1C1C1C', lineHeight: 1 }}>
          ${(totalChannel / 1000).toFixed(0)}k
        </p>
        <p style={{ fontSize: '11px', color: '#AAAAAA', marginTop: '4px' }}>Today's breakdown</p>
      </div>

      <div className="space-y-3.5 flex-1">
        {channelData.map(ch => {
          const pct = (ch.value / totalChannel) * 100;
          return (
            <div key={ch.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ch.color === '#D9EAFF' || ch.color === '#BDD6FC' ? '#5D9DF5' : ch.color }} />
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#1C1C1C' }}>{ch.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {ch.roas !== '—' && (
                    <span style={{ fontSize: '10px', color: '#AAAAAA' }}>{ch.roas} ROAS</span>
                  )}
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1C1C1C' }}>
                    ${(ch.value / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-[#F4F4F0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: ch.color, opacity: ch.color === '#D9EAFF' ? 0.5 : 1, transition: 'width 0.5s ease' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-[#F0EFEA] grid grid-cols-2 gap-4">
        {[{ l: 'Blended MER', v: '8.0x' }, { l: 'Blended ROAS', v: '4.0x' }].map(s => (
          <div key={s.l}>
            <p style={{ fontSize: '9px', fontWeight: 700, color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{s.l}</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#1C1C1C' }}>{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Creative ROAS bar chart (Reports view) ───────────────────────────
const creativeData = [
  { name: 'Hook 3',   roas: 4.2 },
  { name: 'Hook 1',   roas: 2.9 },
  { name: 'UGC B',    roas: 2.1 },
  { name: 'Static A', roas: 1.8 },
  { name: 'Video A',  roas: 1.2 },
];

export function CreativeChart() {
  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="mb-5">
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
          Meta · Creative Performance
        </p>
        <div className="flex items-baseline gap-2">
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#1C1C1C', lineHeight: 1 }}>4.2x</p>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#5D9DF5' }}>↑ Top creative ROAS</span>
        </div>
      </div>

      {/* Explicit pixel height — no percentage height in flex container */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={creativeData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barSize={32}>
          <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F0F0F0" strokeWidth={1} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#AAAAAA', fontFamily: 'Inter,sans-serif' }}
            axisLine={false} tickLine={false} tickMargin={8}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#AAAAAA', fontFamily: 'Inter,sans-serif' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `${v}x`}
          />
          <Tooltip
            cursor={{ fill: '#F9F8F4' }}
            contentStyle={{ fontFamily: 'Inter,sans-serif', borderRadius: '12px', border: '1px solid #E5E5E5' }}
            formatter={(v: number) => [`${v}x ROAS`, '']}
          />
          <Bar dataKey="roas" radius={[5, 5, 0, 0]}>
            {creativeData.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#5D9DF5' : '#C8DFFE'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
