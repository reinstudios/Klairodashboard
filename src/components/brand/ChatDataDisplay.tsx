import React from 'react';
import { Zap, TrendingUp, TrendingDown, ArrowRight, Check, ExternalLink, Play, BarChart2 } from 'lucide-react';

// ── SVG mini bar chart ──────────────────────────────────────────────
function CreativeBarChart() {
  const bars = [
    { label: 'Hook 3',  value: 4.2, color: '#5D9DF5' },
    { label: 'Hook 1',  value: 2.9, color: '#C4D9FD' },
    { label: 'UGC B',   value: 2.1, color: '#C4D9FD' },
    { label: 'Static',  value: 1.6, color: '#C4D9FD' },
    { label: 'Video A', value: 1.2, color: '#C4D9FD' },
  ];
  const maxVal = 4.2;
  const W = 320, H = 56;
  const barW = 36, gap = (W - bars.length * barW) / (bars.length + 1);

  return (
    <svg width="100%" height={H + 24} viewBox={`0 0 ${W} ${H + 24}`} preserveAspectRatio="none">
      {bars.map((b, i) => {
        const x = gap + i * (barW + gap);
        const barH = (b.value / maxVal) * H;
        const y = H - barH;
        return (
          <g key={b.label}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill={b.color}/>
            <text x={x + barW/2} y={y - 4} textAnchor="middle" fontSize="9" fill="#5D9DF5" fontWeight="700" fontFamily="Inter,sans-serif">
              {i === 0 ? `${b.value}x` : ''}
            </text>
            <text x={x + barW/2} y={H + 14} textAnchor="middle" fontSize="8" fill="#888888" fontFamily="Inter,sans-serif">
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Sparkline ───────────────────────────────────────────────────────
function Spark({ data, color, w = 80, h = 24 }: { data: number[]; color: string; w?: number; h?: number }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 3) + 1}`).join(' ');
  const areaClose = ` L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="spg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`M${pts.split(' ').join(' L')}${areaClose}`} fill="url(#spg)"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── The main insight card that appears in chat ──────────────────────
function InsightCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E8E4] shadow-sm" style={{maxWidth:'480px'}}>
      {/* Platform badge + header */}
      <div className="px-5 pt-5 pb-4 bg-[#FDFCF8]">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1.5 bg-[#EEF4FF] text-[#5D9DF5] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            <Zap size={9} className="fill-[#5D9DF5]"/> Meta Ads · This Week
          </span>
        </div>
        {/* Big value */}
        <div className="flex items-end gap-3 mb-2">
          <p style={{fontFamily:'Merriweather,serif',fontSize:'32px',fontWeight:400,color:'#1C1C1C',lineHeight:1}}>$47,200</p>
          <span className="flex items-center gap-1 bg-green-50 text-[#2E7D32] text-[11px] font-bold px-2 py-0.5 rounded-full mb-1">
            <TrendingUp size={10}/> +38%
          </span>
        </div>
        <p style={{fontSize:'12px',color:'#555555',lineHeight:1.6}}>
          Revenue driven by Meta Ads this week. <strong style={{color:'#1C1C1C'}}>'Summer UGC — Hook 3'</strong> is your top creative — outperforming all others by 120%.
        </p>
      </div>

      {/* 4-stat grid */}
      <div className="grid grid-cols-4 border-t border-[#EEEDE9]">
        {[
          { l:'Revenue', v:'$47.2k', d:'+38%', pos:true  },
          { l:'ROAS',    v:'4.2x',   d:'+0.8x',pos:true  },
          { l:'Spend',   v:'$11.2k', d:'-3%',  pos:false },
          { l:'CPM',     v:'$8.40',  d:'+12%', pos:false },
        ].map((s,i) => (
          <div key={s.l} className={`py-3 px-3 text-center ${i<3?'border-r border-[#EEEDE9]':''}`}>
            <p style={{fontSize:'8px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.07em'}} className="mb-1">{s.l}</p>
            <p style={{fontSize:'14px',fontWeight:700,color:'#1C1C1C',lineHeight:1}} className="mb-1">{s.v}</p>
            <span style={{fontSize:'9px',fontWeight:700}} className={s.pos?'text-[#2E7D32]':'text-[#D32F2F]'}>{s.d}</span>
          </div>
        ))}
      </div>

      {/* Sparkline chart */}
      <div className="px-5 pt-4 pb-2 border-t border-[#EEEDE9]">
        <p style={{fontSize:'9px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.06em'}} className="mb-3">Top Creatives — ROAS</p>
        <CreativeBarChart/>
      </div>

      {/* Revenue trend sparkline */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <p style={{fontSize:'9px',color:'#888888'}}>Revenue · 7-day trend</p>
          <Spark data={[28,32,29,38,41,39,47]} color="#5D9DF5" w={80} h={24}/>
        </div>
      </div>

      {/* Action bar */}
      <div className="border-t border-[#D1E9FF]/60 bg-[#EEF6FF] px-5 py-3 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-[#2E7D32] flex items-center justify-center shrink-0">
          <Check size={12} strokeWidth={2.5} color="white"/>
        </div>
        <div className="flex-1">
          <p style={{fontSize:'11px',fontWeight:700,color:'#1C4E80'}}>Done. Budget scaled to $800/day on Hook 3.</p>
          <p style={{fontSize:'9px',color:'#5D9DF5'}}>2 other actions available</p>
        </div>
        <button className="flex items-center gap-1 text-[#5D9DF5] hover:text-[#1C4E80] transition-colors">
          <ExternalLink size={11}/>
          <span style={{fontSize:'9px',fontWeight:600}}>Full report</span>
        </button>
      </div>
    </div>
  );
}

// ── Compact table card ──────────────────────────────────────────────
function TableCard() {
  const rows = [
    { channel:'Meta Ads',    rev:'$47,200', roas:'4.2x', spend:'$11.2k', cpm:'$8.40',  pos:true  },
    { channel:'Google Ads',  rev:'$18,400', roas:'3.1x', spend:'$5.9k',  cpm:'$6.20',  pos:true  },
    { channel:'TikTok Shop', rev:'$9,100',  roas:'2.8x', spend:'$3.2k',  cpm:'$11.40', pos:false },
    { channel:'Klaviyo',     rev:'$6,800',  roas:'8.2x', spend:'$280',   cpm:'—',      pos:true  },
    { channel:'SMS',         rev:'$2,400',  roas:'6.1x', spend:'$140',   cpm:'—',      pos:true  },
  ];
  return (
    <div className="bg-white rounded-2xl border border-[#E8E8E4] shadow-sm overflow-hidden" style={{maxWidth:'480px'}}>
      {/* Header */}
      <div className="px-5 py-4 bg-[#FDFCF8] border-b border-[#EEEDE9]">
        <div className="flex items-center justify-between">
          <div>
            <p style={{fontFamily:'Merriweather,serif',fontSize:'16px',fontWeight:400,color:'#1C1C1C'}}>Channel Breakdown</p>
            <p style={{fontSize:'10px',color:'#888888'}}>Week of Feb 10–16, 2026</p>
          </div>
          <button className="flex items-center gap-1 text-[#5D9DF5] hover:text-[#1C4E80]">
            <ExternalLink size={12}/>
            <span style={{fontSize:'9px',fontWeight:600}}>Export</span>
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{fontSize:'11px'}}>
          <thead>
            <tr className="border-b border-[#F0F0EC]">
              {['Channel','Revenue','ROAS','Spend','CPM'].map(h => (
                <th key={h} className="px-4 py-2 text-left" style={{fontSize:'8px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.07em'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.channel} className={`border-b border-[#F8F8F6] ${i===0?'bg-[#F4F8FF]':''}`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${r.pos?'bg-[#5D9DF5]':'bg-[#888888]'}`}/>
                    <span style={{fontWeight:i===0?700:400,color:'#1C1C1C'}}>{r.channel}</span>
                    {i===0 && <span style={{fontSize:'7px',fontWeight:700,color:'#5D9DF5',background:'#EEF4FF',padding:'1px 5px',borderRadius:'9999px'}}>Best</span>}
                  </div>
                </td>
                <td className="px-4 py-2.5" style={{fontWeight:600,color:'#1C1C1C'}}>{r.rev}</td>
                <td className="px-4 py-2.5">
                  <span style={{color:r.pos?'#2E7D32':'#D32F2F',fontWeight:600}}>{r.roas}</span>
                </td>
                <td className="px-4 py-2.5" style={{color:'#555555'}}>{r.spend}</td>
                <td className="px-4 py-2.5" style={{color:'#888888'}}>{r.cpm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#EEEDE9] bg-[#FAFAF8] flex items-center justify-between">
        <p style={{fontSize:'9px',color:'#888888'}}>Total blended MER: <strong style={{color:'#1C1C1C'}}>3.7x</strong> · Blended ROAS: <strong style={{color:'#1C1C1C'}}>4.0x</strong></p>
        <button className="flex items-center gap-1 bg-[#1C1C1C] text-white rounded-full px-3 py-1">
          <Play size={7} className="fill-white"/>
          <span style={{fontSize:'8px',fontWeight:700}}>Take action</span>
        </button>
      </div>
    </div>
  );
}

// ── Full export — chat thread with data cards ───────────────────────
export function ChatDataDisplay() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

      {/* ── LEFT: Insight card in context ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#5D9DF5]"/>
          <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">Insight card</p>
        </div>
        <p className="text-[12px] text-[#555555] mb-6 leading-relaxed">
          Returned when asking about a specific channel's performance. Contains a headline value, 4-stat grid, creative breakdown chart, trend sparkline, and a completed action bar.
        </p>

        {/* Chat thread context */}
        <div className="bg-[#F9F8F4] rounded-2xl p-5 space-y-4" style={{fontFamily:'Inter,sans-serif'}}>
          {/* User msg */}
          <div className="flex justify-end">
            <div className="bg-[#1C1C1C] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm" style={{fontSize:'13px',maxWidth:'80%'}}>
              How did Meta Ads perform this week?
            </div>
          </div>

          {/* Klairo msg */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0 mt-0.5">
              <Zap size={13} color="#5D9DF5"/>
            </div>
            <div className="space-y-2 flex-1">
              <p style={{fontSize:'12px',color:'#555555',lineHeight:1.6}}>Here's your Meta Ads breakdown for the week — strong performance led by one creative.</p>
              <InsightCard/>
            </div>
          </div>

          {/* Follow-up prompt */}
          <div className="flex justify-end">
            <div className="bg-[#1C1C1C] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm" style={{fontSize:'13px',maxWidth:'80%'}}>
              Show me all channels side by side.
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Table card in context ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#5D9DF5]"/>
          <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">Report table card</p>
        </div>
        <p className="text-[12px] text-[#555555] mb-6 leading-relaxed">
          Returned for cross-channel comparisons and report requests. A structured table with sortable rows, colour-coded delta indicators, and a footer action bar.
        </p>

        {/* Chat thread context */}
        <div className="bg-[#F9F8F4] rounded-2xl p-5 space-y-4" style={{fontFamily:'Inter,sans-serif'}}>
          {/* Klairo msg */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0 mt-0.5">
              <Zap size={13} color="#5D9DF5"/>
            </div>
            <div className="space-y-2 flex-1">
              <p style={{fontSize:'12px',color:'#555555',lineHeight:1.6}}>Here's your full channel breakdown for the week. Email continues to have the best ROAS by a wide margin.</p>
              <TableCard/>
              <div className="flex items-center gap-2 pl-1">
                <button className="flex items-center gap-1.5 text-[#5D9DF5] hover:text-[#1C4E80] transition-colors">
                  <BarChart2 size={11}/>
                  <span style={{fontSize:'11px',fontWeight:600}}>View as chart</span>
                </button>
                <span style={{color:'#D0D0D0'}}>·</span>
                <button className="flex items-center gap-1.5 text-[#5D9DF5] hover:text-[#1C4E80] transition-colors">
                  <ExternalLink size={11}/>
                  <span style={{fontSize:'11px',fontWeight:600}}>Download CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
