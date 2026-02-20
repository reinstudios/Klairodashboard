import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './dashboard/Sidebar';
import { MetricCard } from './dashboard/MetricCard';
import { RevenueTrendChart, ChannelBreakdownChart, CreativeChart } from './dashboard/DashboardCharts';
import { SettingsModal } from './dashboard/SettingsModal';
import { TeamFeedView } from './dashboard/TeamFeedView';
import { AgentMarketplace } from './dashboard/AgentMarketplace';
import {
  Plus, Zap, ArrowRight, Check, ExternalLink,
  Play, ChevronRight, Package, BarChart2,
  Calendar, ChevronDown, Filter, X, FileText, Download,
  Wand2, Share2, Search, TrendingUp, ShoppingBag,
  Menu,
} from 'lucide-react';
import { MobileDrawer } from './dashboard/MobileDrawer';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/71db4ddb4dff2b50b549faea40c66d8a85b2e660.png';

type View = 'daily-brief' | 'new-chat' | 'reports' | 'team-feed';
const FONT = 'Inter, sans-serif';

const VIEW_TITLES: Record<View, string> = {
  'daily-brief': 'Daily Brief',
  'new-chat':    'Chat',
  'reports':     'Reports',
  'team-feed':   'Team Feed',
};

function useIsMobile() {
  const [is, setIs] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const h = () => setIs(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return is;
}

// ── Mini sparkline ────────────────────────────────────────────────────
function Spark({ data, color, w = 48, h = 14 }: { data: number[]; color: string; w?: number; h?: number }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) + 1}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Loading spinner ───────────────────────────────────────────────────
function Spinner() {
  return <div className="w-3.5 h-3.5 rounded-full border-2 border-[#E5E5E5] border-t-[#5D9DF5] animate-spin shrink-0" />;
}

// ── Priority bars (signal-strength style) ────────────────────────────
function PriorityBars({ level }: { level: 'urgent' | 'high' | 'medium' | 'low' }) {
  const cfg = {
    urgent: { color: '#D32F2F', filled: 3, label: 'Urgent' },
    high:   { color: '#E87722', filled: 3, label: 'High'   },
    medium: { color: '#F59E0B', filled: 2, label: 'Medium' },
    low:    { color: '#BBBBBB', filled: 1, label: 'Low'    },
  };
  const { color, filled, label } = cfg[level];
  return (
    <div className="flex items-center gap-1.5">
      <svg width="15" height="12" viewBox="0 0 15 12" style={{ flexShrink: 0 }}>
        {[0, 1, 2].map(i => (
          <rect key={i} x={i * 5} y={12 - (i + 1) * 4} width="4" height={(i + 1) * 4} rx="1"
            fill={i < filled ? color : '#E5E5E5'} />
        ))}
      </svg>
      <span style={{ fontSize: '11px', fontWeight: 600, color }}>{label}</span>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────
function StatusBadge({ s }: { s: 'new' | 'reviewed' | 'actioned' }) {
  const cfg = {
    new:      { bg: '#EEF4FF', color: '#1D4ED8', label: 'New'      },
    reviewed: { bg: '#FFF8E1', color: '#B45309', label: 'Reviewed' },
    actioned: { bg: '#EDFBF0', color: '#2E7D32', label: 'Actioned' },
  };
  const { bg, color, label } = cfg[s];
  return (
    <span style={{ fontSize: '10px', fontWeight: 700, background: bg, color, padding: '3px 8px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

// ── Review accordion content ──────────────────────────────────────────
const reviewData: Record<string, { headline: string; body: string; metrics: { label: string; value: string; positive?: boolean }[] }> = {
  A1: {
    headline: 'Scale now before efficiency drops',
    body: "Hook 3 has held a 4.2x ROAS across 72 hours at $112/day with stable CPMs of $8.40. Historical patterns show creative efficiency typically drops after day 8 — you're on day 5. Scaling to $800/day projects an additional $18.4k in weekly revenue at current conversion rates.",
    metrics: [
      { label: 'Current ROAS',   value: '4.2x',     positive: true  },
      { label: 'Proj. Rev. Lift', value: '+$18.4k/wk', positive: true },
      { label: 'CPM Trend',      value: 'Stable',    positive: true  },
    ],
  },
  A2: {
    headline: 'SKU-4421 needs a PO in the next 48 hours',
    body: "At 142 units/day sell-through, SKU-4421 (Beach Vibes Tote) stocks out in 6 days. Standard ShipBob lead time is 8 days — you need to approve today. The draft PO covers 2,800 units at $8.40/unit.",
    metrics: [
      { label: 'Days Cover',  value: '6 days',  positive: false },
      { label: 'Sell-through', value: '142/day', positive: true  },
      { label: 'Draft PO',   value: '$23,520',  positive: true  },
    ],
  },
  A3: {
    headline: '#BeachVibes is breaking — strike now',
    body: "The hashtag spiked 340% in reach over the last 6 hours. Your top SKU appeared organically in 3 trending videos with 2.4M combined views. A targeted retargeting campaign at $200/day is estimated to capture this demand at a 4.1x projected ROAS.",
    metrics: [
      { label: 'Hashtag Reach', value: '+340%',  positive: true },
      { label: 'Viral Mentions', value: '3 videos', positive: true },
      { label: 'Est. ROAS',    value: '4.1x',   positive: true },
    ],
  },
  A4: {
    headline: 'Variant B is the winner — run it',
    body: "Current subject line converts at 8.2%. Variant B — 'Your summer wishlist is waiting' — achieved 9.4% CVR on a 500-person sample, a statistically significant uplift. Running it to your full welcome audience projects 142 additional conversions this week.",
    metrics: [
      { label: 'Current CVR',  value: '8.2%',    positive: true },
      { label: 'Variant B CVR', value: '9.4%',   positive: true },
      { label: 'Proj. Uplift', value: '+142 conv.', positive: true },
    ],
  },
  A5: {
    headline: 'CPC doubled in 4 hours — adjust bids',
    body: "Brand campaign CPC moved from $1.20 to $2.40 in 4 hours, likely competitor activity. Impression share remains at 88% — you don't need to match. Reducing max CPC from $3.00 to $2.00 restores efficiency without meaningful volume loss.",
    metrics: [
      { label: 'CPC Change',      value: '+100%',  positive: false },
      { label: 'Impression Share', value: '88%',   positive: true  },
      { label: 'Rec. Max CPC',    value: '$2.00',  positive: true  },
    ],
  },
  A6: {
    headline: 'The payment step is where you\'re losing people',
    body: "Checkout abandonment jumped from 34% to 52% this week. Session recordings show 68% of drop-off at the payment step. Adding Apple Pay and Klarna is estimated to recover 18–24% of abandonment based on comparable Shopify store benchmarks.",
    metrics: [
      { label: 'Abandonment',      value: '34%→52%',    positive: false },
      { label: 'Drop-off Point',   value: 'Payment',     positive: false },
      { label: 'Recovery Est.',    value: '18–24%',      positive: true  },
    ],
  },
};

// ── Teammates for Send popup ──────────────────────────────────────────
const teammates = [
  { name: 'Sarah Chen',    role: 'Head of Paid Social', photo: 'https://images.unsplash.com/photo-1758600587839-56ba05596c69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'James Rivera',  role: 'Growth Lead',          photo: 'https://images.unsplash.com/photo-1617746652974-0be48cd984d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Priya Nair',    role: 'Head of E-commerce',   photo: 'https://images.unsplash.com/photo-1729337531424-198f880cb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
];

// ── Chat Insight Card ─────────────────────────�����───────────────────────
function InsightCard({ onRunReport }: { onRunReport: () => void }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [sendOpen,   setSendOpen]   = useState(false);
  const [sendSent,   setSendSent]   = useState<string | null>(null);
  const [doing,      setDoing]      = useState(false);
  const [done,       setDone]       = useState(false);

  const stats = [
    { label: 'Revenue', value: '$47.2k', delta: '+38%',  pos: true  },
    { label: 'ROAS',    value: '4.2x',   delta: '+0.8x', pos: true  },
    { label: 'Spend',   value: '$11.2k', delta: '-3%',   pos: false },
    { label: 'CPM',     value: '$8.40',  delta: '+12%',  pos: false },
  ];
  const creatives = [
    { name: 'Hook 3',  val: 4.2 },
    { name: 'Hook 1',  val: 3.1 },
    { name: 'UGC B',   val: 2.6 },
    { name: 'Static',  val: 2.1 },
    { name: 'Video A', val: 1.8 },
  ];
  const sparkData = [38200, 40100, 38900, 42300, 44100, 43700, 47200];

  const handleDoIt = () => {
    setDoing(true);
    setTimeout(() => { setDoing(false); setDone(true); }, 2000);
  };
  const handleSend = (name: string) => {
    setSendSent(name);
    setTimeout(() => { setSendOpen(false); setSendSent(null); }, 1400);
  };

  return (
    <>
      {/* Send modal */}
      <AnimatePresence>
        {sendOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => { setSendOpen(false); setSendSent(null); }}
          >
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[3px]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.22, ease: [0.4,0,0.2,1] }}
              className="relative bg-white rounded-2xl border border-[#E5E5E5] p-6"
              style={{ width: '460px', boxShadow: '0 24px 64px rgba(0,0,0,0.14)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p style={{ fontSize:'16px', fontWeight:700, color:'#1C1C1C', marginBottom:'3px' }}>Share with teammate</p>
                  <p style={{ fontSize:'11px', color:'#AAAAAA' }}>Meta Ads · This Week breakdown</p>
                </div>
                <button onClick={() => { setSendOpen(false); setSendSent(null); }}
                  className="w-7 h-7 rounded-full bg-[#F4F4F0] hover:bg-[#EBEBEB] flex items-center justify-center transition-colors">
                  <X size={13} color="#888888" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {teammates.map(tm => (
                  <button key={tm.name} onClick={() => handleSend(tm.name)}
                    className="group flex flex-col items-center pt-5 pb-4 px-3 rounded-2xl border border-[#EBEBEB] hover:border-[#5D9DF5] hover:bg-[#F8FBFF] transition-all duration-200 hover:-translate-y-1">
                    {sendSent === tm.name ? (
                      <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
                        className="w-14 h-14 rounded-full bg-[#EDFBF0] flex items-center justify-center mb-3">
                        <Check size={22} color="#2E7D32" strokeWidth={2.5} />
                      </motion.div>
                    ) : (
                      <div className="w-14 h-14 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-[#5D9DF5] ring-offset-2 transition-all duration-200">
                        <img src={tm.photo} alt={tm.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p style={{ fontSize:'12px', fontWeight:700, color: sendSent===tm.name?'#2E7D32':'#1C1C1C', textAlign:'center', marginBottom:'2px' }}>
                      {sendSent === tm.name ? 'Sent!' : tm.name}
                    </p>
                    <p style={{ fontSize:'10px', color:'#AAAAAA', textAlign:'center', marginBottom:'12px' }}>{tm.role}</p>
                    {sendSent !== tm.name && (
                      <div className="w-full rounded-full py-1.5 text-center bg-[#F4F4F0] group-hover:bg-[#5D9DF5] transition-colors duration-200"
                        style={{ fontSize:'10px', fontWeight:700, color:'#888888' }}>
                        <span className="group-hover:text-white transition-colors duration-200">Send →</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <motion.div
        initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.4, delay:0.25 }}
        className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden mt-6"
        style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}
      >
        <div className="p-5 pb-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 bg-[#EEF4FF]">
            <Zap size={9} color="#5D9DF5" className="fill-[#5D9DF5]" />
            <span style={{ fontSize:'9px', fontWeight:700, color:'#5D9DF5', letterSpacing:'0.10em', textTransform:'uppercase' }}>
              Meta Ads · This Week
            </span>
          </div>

          {/* Hero metric */}
          <div className="flex items-baseline gap-3 mb-3">
            <span style={{ fontSize:'30px', fontWeight:700, color:'#1C1C1C', lineHeight:1 }}>$47,200</span>
            <span style={{ fontSize:'14px', fontWeight:700, color:'#2E7D32' }}>↑ +38%</span>
          </div>

          {/* Body */}
          <p style={{ fontSize:'13px', color:'#555555', lineHeight:1.65, marginBottom:'16px' }}>
            Revenue driven by Meta Ads this week.{' '}
            <strong style={{ fontWeight:700, color:'#1C1C1C' }}>'Summer UGC — Hook 3'</strong>
            {' '}is your top creative — outperforming all others by 120%.
          </p>

          {/* Stat grid */}
          <div className="grid grid-cols-4 gap-2.5 mb-5">
            {stats.map(s => (
              <div key={s.label} className="bg-[#FAFAF8] rounded-xl p-3">
                <p style={{ fontSize:'8px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'4px' }}>{s.label}</p>
                <p style={{ fontSize:'15px', fontWeight:700, color:'#1C1C1C', lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:'10px', fontWeight:600, color: s.pos?'#2E7D32':'#D32F2F', marginTop:'3px' }}>{s.delta}</p>
              </div>
            ))}
          </div>

          {/* Top Creatives bar chart */}
          <div className="mb-4">
            <p style={{ fontSize:'9px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'10px' }}>
              Top Creatives — ROAS
            </p>
            <div className="flex items-end gap-2" style={{ height:'72px' }}>
              {creatives.map((c, i) => {
                const barH = Math.round((c.val / 4.2) * 56);
                return (
                  <div key={c.name} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full rounded-t" style={{ height:`${barH}px`, background:`rgba(93,157,245,${1 - i*0.17})` }} />
                    <p style={{ fontSize:'8px', color:'#AAAAAA', textAlign:'center', whiteSpace:'nowrap' }}>{c.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sparkline row */}
          <div className="flex items-center justify-between">
            <p style={{ fontSize:'10px', color:'#AAAAAA', fontWeight:500 }}>Revenue · 7-day trend</p>
            <Spark data={sparkData} color="#5D9DF5" w={80} h={22} />
          </div>
        </div>

        {/* Action footer */}
        <div className="border-t border-[#F0EFEA] px-5 py-3.5">
          {done ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#EDFBF0] flex items-center justify-center shrink-0">
                  <Check size={10} color="#2E7D32" strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ fontSize:'11px', fontWeight:700, color:'#2E7D32' }}>Done. Budget scaled to $800/day on Hook 3.</p>
                  <p style={{ fontSize:'10px', color:'#AAAAAA', marginTop:'1px' }}>2 other actions available</p>
                </div>
              </div>
              <button onClick={onRunReport}
                className="flex items-center gap-1.5 text-[#5D9DF5] hover:text-[#1C4E80] transition-colors"
                style={{ fontSize:'11px', fontWeight:600 }}>
                <ExternalLink size={11} />Full report
              </button>
            </div>
          ) : doing ? (
            <div className="flex items-center gap-2.5">
              <Spinner />
              <span style={{ fontSize:'12px', color:'#888888' }}>Scaling budget to $800/day…</span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setReviewOpen(o => !o)}
                  className="px-3 py-1.5 rounded-lg border transition-all"
                  style={{ fontSize:'11px', fontWeight:600,
                    borderColor: reviewOpen?'#5D9DF5':'#E5E5E5',
                    color:       reviewOpen?'#5D9DF5':'#555555',
                    background:  reviewOpen?'#EEF4FF':'transparent' }}>
                  Review
                </button>
                <button onClick={() => { setSendOpen(true); setSendSent(null); }}
                  className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] hover:border-[#C8C8C8] transition-all"
                  style={{ fontSize:'11px', fontWeight:600, color:'#555555' }}>
                  Send
                </button>
                <button onClick={handleDoIt}
                  className="px-3 py-1.5 rounded-lg bg-[#1C1C1C] hover:bg-black transition-all"
                  style={{ fontSize:'11px', fontWeight:600, color:'#FFFFFF' }}>
                  Do It
                </button>
              </div>
              <button onClick={onRunReport}
                className="flex items-center gap-1.5 text-[#5D9DF5] hover:text-[#1C4E80] transition-colors shrink-0"
                style={{ fontSize:'11px', fontWeight:600 }}>
                <FileText size={11} />Run deeper report
              </button>
            </div>
          )}
        </div>

        {/* Review accordion */}
        <AnimatePresence>
          {reviewOpen && (
            <motion.div
              initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
              transition={{ duration:0.24, ease:[0.4,0,0.2,1] }}
              style={{ overflow:'hidden' }}
            >
              <div className="px-5 py-5 border-t border-[#EEF4FF] bg-[#F8FBFF]" style={{ borderLeft:'3px solid #5D9DF5' }}>
                <p style={{ fontSize:'12px', fontWeight:700, color:'#1C1C1C', marginBottom:'6px' }}>
                  Scale now before efficiency drops
                </p>
                <p style={{ fontSize:'12px', color:'#555555', lineHeight:1.75 }}>
                  Hook 3 has held a 4.2x ROAS across 72 hours at $112/day with stable CPMs of $8.40. Historical patterns show creative efficiency typically drops after day 8 — you're on day 5. Scaling to $800/day projects an additional $18.4k in weekly revenue at current conversion rates.
                </p>
                <div className="mt-4 flex items-center gap-2.5">
                  {[
                    { label:'Current ROAS',    value:'4.2x'       },
                    { label:'Proj. Rev. Lift',  value:'+$18.4k/wk' },
                    { label:'CPM Trend',        value:'Stable'     },
                  ].map(m => (
                    <div key={m.label} className="bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-center flex-1">
                      <p style={{ fontSize:'15px', fontWeight:700, color:'#1C1C1C', lineHeight:1 }}>{m.value}</p>
                      <p style={{ fontSize:'9px', color:'#AAAAAA', marginTop:'5px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em' }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

// ── Deep Report PDF Canvas ────────────────────────────────────────────
function DeepReportCanvas({ generating }: { generating: boolean }) {
  const creativeRows = [
    { name:"Summer UGC — Hook 3", spend:'$1,120', rev:'$4,704', roas:'4.2x', cpm:'$8.40',  winner:true  },
    { name:"Hook 1 — Static",     spend:'$840',   rev:'$2,604', roas:'3.1x', cpm:'$9.10',  winner:false },
    { name:"UGC B — Lifestyle",   spend:'$560',   rev:'$1,456', roas:'2.6x', cpm:'$9.80',  winner:false },
    { name:"Static Product",      spend:'$420',   rev:'$882',   roas:'2.1x', cpm:'$10.20', winner:false },
    { name:"Video A — Brand",     spend:'$260',   rev:'$468',   roas:'1.8x', cpm:'$11.60', winner:false },
  ];
  const weekSparkData = [31200, 34800, 33100, 38400, 41200, 40700, 47200];

  if (generating) {
    return (
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mt-6">
        <div className="flex items-center gap-3 bg-white rounded-2xl border border-[#E5E5E5] p-6"
          style={{ boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <div className="w-4 h-4 rounded-full border-2 border-[#5D9DF5] border-t-transparent animate-spin shrink-0" />
          <span style={{ fontSize:'13px', color:'#888888' }}>Generating deeper report…</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5 }}
      className="mt-6 space-y-8"
    >
      {/* PDF Canvas */}
      <div className="rounded-2xl overflow-hidden border border-[#E0DDD6]"
        style={{ background:'#F9F8F4', boxShadow:'0 4px 32px rgba(0,0,0,0.09)' }}>

        {/* Sky-blue accent rule at top */}
        <div style={{ height:'4px', background:'linear-gradient(90deg,#5D9DF5,#93C5FD)' }} />

        <div className="px-8 py-7">
          {/* Report header */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-[#E8E6E0]">
            <div>
              <p style={{ fontSize:'8px', fontWeight:700, color:'#5D9DF5', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'10px' }}>
                Klairo Intelligence Report
              </p>
              <h2 style={{ fontFamily:'Merriweather, serif', fontSize:'22px', fontWeight:400, color:'#1C1C1C', lineHeight:1.2, marginBottom:'6px' }}>
                Meta Ads Deep Dive
              </h2>
              <p style={{ fontSize:'12px', color:'#888888' }}>Week of Feb 10–16, 2026 · Generated Feb 20, 2026</p>
            </div>
            <div className="flex items-center gap-1.5 opacity-40">
              <div className="w-2 h-2 rounded-full bg-[#5D9DF5]" />
              <p style={{ fontSize:'9px', fontWeight:700, color:'#1C1C1C', letterSpacing:'0.1em' }}>KLAIRO</p>
            </div>
          </div>

          {/* KPI summary */}
          <div className="grid grid-cols-4 gap-3 mb-7">
            {[
              { label:'Total Revenue', value:'$47,200', delta:'+38%',  pos:true  },
              { label:'Blended ROAS',  value:'4.2x',    delta:'+0.8x', pos:true  },
              { label:'Total Spend',   value:'$11,200', delta:'-3%',   pos:false },
              { label:'Avg CPM',       value:'$8.40',   delta:'+12%',  pos:false },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-[#EBEBEB]">
                <p style={{ fontSize:'8px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>{s.label}</p>
                <p style={{ fontSize:'20px', fontWeight:700, color:'#1C1C1C', lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:'10px', fontWeight:600, color: s.pos?'#2E7D32':'#D32F2F', marginTop:'4px' }}>{s.delta}</p>
              </div>
            ))}
          </div>

          {/* Revenue trend */}
          <div className="mb-7 bg-white rounded-xl border border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between mb-3">
              <p style={{ fontFamily:'Merriweather, serif', fontSize:'13px', fontWeight:400, color:'#1C1C1C' }}>Revenue — 7-day trend</p>
              <p style={{ fontSize:'10px', color:'#AAAAAA' }}>Feb 10–16</p>
            </div>
            <Spark data={weekSparkData} color="#5D9DF5" w={520} h={48} />
            <div className="flex justify-between mt-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                <span key={d} style={{ fontSize:'8px', color:'#CCCCCC', fontWeight:600 }}>{d}</span>
              ))}
            </div>
          </div>

          {/* Section: Executive Summary */}
          <div className="mb-7">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#5D9DF5] shrink-0" />
              <p style={{ fontFamily:'Merriweather, serif', fontSize:'14px', fontWeight:400, color:'#1C1C1C' }}>Executive Summary</p>
            </div>
            <p style={{ fontSize:'12px', color:'#555555', lineHeight:1.8, paddingLeft:'20px' }}>
              Meta Ads delivered a standout week with $47,200 in attributed revenue — a 38% increase over the prior period. Performance was concentrated in a single breakout creative: 'Summer UGC — Hook 3', which drove 9.98% of total weekly revenue on just 10% of total spend. CPMs remain stable at $8.40 despite increased investment, suggesting the algorithm has found a strong audience match. This efficiency window typically lasts 8–12 days; at day 5, meaningful room to scale remains.
            </p>
          </div>

          {/* Section: Creative Performance table */}
          <div className="mb-7">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#5D9DF5] shrink-0" />
              <p style={{ fontFamily:'Merriweather, serif', fontSize:'14px', fontWeight:400, color:'#1C1C1C' }}>Creative Performance</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#E8E6E0]" style={{ marginLeft:'20px' }}>
              <table className="w-full" style={{ borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid #EBEBEB', background:'#FAFAF8' }}>
                    {['Creative','Spend','Revenue','ROAS','CPM'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left"
                        style={{ fontSize:'8px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.09em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {creativeRows.map((r, i) => (
                    <tr key={r.name}
                      style={{ borderBottom: i<creativeRows.length-1?'1px solid #F0EFEA':'none', background: r.winner?'#F4F8FF':'transparent' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize:'12px', fontWeight: r.winner?700:500, color:'#1C1C1C' }}>{r.name}</span>
                          {r.winner && <span style={{ fontSize:'8px', fontWeight:700, color:'#5D9DF5', background:'#EEF4FF', padding:'1px 6px', borderRadius:'999px' }}>Top</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ fontSize:'12px', color:'#555555' }}>{r.spend}</td>
                      <td className="px-4 py-3" style={{ fontSize:'12px', fontWeight:600, color:'#1C1C1C' }}>{r.rev}</td>
                      <td className="px-4 py-3">
                        <span style={{ fontSize:'12px', fontWeight:700, color: r.winner?'#2E7D32':'#888888' }}>{r.roas}</span>
                      </td>
                      <td className="px-4 py-3" style={{ fontSize:'12px', color:'#888888' }}>{r.cpm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Key Recommendations */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#5D9DF5] shrink-0" />
              <p style={{ fontFamily:'Merriweather, serif', fontSize:'14px', fontWeight:400, color:'#1C1C1C' }}>Key Recommendations</p>
            </div>
            <div className="space-y-4" style={{ paddingLeft:'20px' }}>
              {[
                { n:'01', head:'Scale Hook 3 immediately', body:'Increase daily budget from $112 to $800. At current 4.2x ROAS and stable CPMs, this projects an additional $18.4k in weekly revenue. Act within the next 24 hours to capture the peak efficiency window.' },
                { n:'02', head:'Pause underperforming creatives', body:'Video A and Static Product are delivering sub-2.2x ROAS. Reallocating their combined $680/week spend to Hook 3 improves blended ROAS by an estimated 0.3x with no incremental spend.' },
                { n:'03', head:'Brief Hook 3 variations now', body:'With Hook 3 proven, brief 2–3 UGC variations with different opening hooks and endings. Creative fatigue typically appears at day 8–10; new variants protect the audience match.' },
                { n:'04', head:'Monitor CPM daily', body:'CPMs have risen 3% over the past 48 hours. If CPM exceeds $11.00, ROAS drops below 3.6x at current CVR — below your threshold. Klairo will flag this automatically.' },
              ].map(r => (
                <div key={r.n} className="flex gap-3">
                  <span style={{ fontSize:'10px', fontWeight:700, color:'#5D9DF5', minWidth:'22px', marginTop:'2px', letterSpacing:'0.04em' }}>{r.n}</span>
                  <div>
                    <p style={{ fontSize:'12px', fontWeight:700, color:'#1C1C1C', marginBottom:'3px' }}>{r.head}</p>
                    <p style={{ fontSize:'12px', color:'#555555', lineHeight:1.7 }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-[#E8E6E0] bg-white flex items-center justify-between">
          <p style={{ fontSize:'10px', color:'#CCCCCC', fontWeight:500 }}>Generated by Klairo · Feb 20, 2026 · Confidential</p>
          <button className="flex items-center gap-1.5 text-[#5D9DF5] hover:text-[#1C4E80] transition-colors"
            style={{ fontSize:'11px', fontWeight:600 }}>
            <Download size={11} />Export PDF
          </button>
        </div>
      </div>

      {/* Deeper key takeaways from Klairo */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.3 }}>
        <div className="flex items-center gap-3 mb-5">
          <PixelDog scale={3} running={false} />
          <span style={{ fontFamily:'Merriweather, serif', fontSize:'15px', fontWeight:400, color:'#1C1C1C' }}>Klairo</span>
        </div>
        <div style={{ fontSize:'13px', color:'#555555', lineHeight:1.78 }} className="space-y-4">
          <p>Here are the three things that matter most from this week's Meta performance.</p>
          <p>
            <strong style={{ color:'#1C1C1C', fontWeight:700 }}>Hook 3 is a rare event.</strong>{' '}
            A 4.2x ROAS held over 72 hours at meaningful spend ($112/day) happens in fewer than 8% of creatives we track across comparable accounts. The combination of stable CPMs and strong conversion rate means the audience–creative match is unusually tight — and you still have runway.
          </p>
          <p>
            <strong style={{ color:'#1C1C1C', fontWeight:700 }}>The efficiency window is closing.</strong>{' '}
            Based on patterns across 240+ similar campaigns, creative-level ROAS typically begins declining between days 8–12. You are on day 5. Scaling now — rather than in 3 days — captures the bulk of the opportunity before frequency starts building.
          </p>
          <p>
            <strong style={{ color:'#1C1C1C', fontWeight:700 }}>CPM creep is the leading risk.</strong>{' '}
            The 3% daily CPM increase is within normal variance, but warrants daily monitoring. If CPM crosses $11.00, the ROAS drops below 3.6x at current conversion rates. I'll flag this automatically each morning in your Daily Brief.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Pixel dog running frames (12 cols × 9 rows; 1=body, 2=eye accent) ─
const DOG_FRAMES = [
  // Frame 1 — gallop, legs wide
  [[0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,1,1,1,1,0,0,0,0,0],[0,0,0,1,2,1,1,1,0,0,0,0],[1,1,0,1,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,1,1,1,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,0,1,0,0],[0,1,0,0,0,0,0,0,0,1,0,0]],
  // Frame 2 — stride front-right / back-left
  [[0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,1,1,1,1,0,0,0,0,0],[0,0,0,1,2,1,1,1,0,0,0,0],[1,1,0,1,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,1,1,1,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,1,0,0,0,0]],
  // Frame 3 — tuck, legs under body
  [[0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,1,1,1,1,0,0,0,0,0],[0,0,0,1,2,1,1,1,0,0,0,0],[1,1,0,1,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,1,1,1,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],
  // Frame 4 — stride back-right / front-left
  [[0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,1,1,1,1,0,0,0,0,0],[0,0,0,1,2,1,1,1,0,0,0,0],[1,1,0,1,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,1,1,1,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,1,0,0,0,0,0,0],[0,0,1,0,1,0,0,0,0,0,0,0]],
];

function PixelDog({ scale = 3, running = true }: { scale?: number; running?: boolean }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!running) { setFrame(0); return; }
    const id = setInterval(() => setFrame(f => (f + 1) % DOG_FRAMES.length), 130);
    return () => clearInterval(id);
  }, [running]);
  const rows = DOG_FRAMES[frame];
  return (
    <svg width={12 * scale} height={9 * scale} viewBox={`0 0 ${12 * scale} ${9 * scale}`}
      style={{ imageRendering: 'pixelated', display: 'block', flexShrink: 0 }}>
      {rows.map((row, y) =>
        row.map((px, x) =>
          px ? <rect key={`${x}-${y}`} x={x * scale} y={y * scale} width={scale} height={scale}
            fill={px === 2 ? '#1C4E80' : '#7BB8FF'} /> : null
        )
      )}
    </svg>
  );
}

// ── Chat data sources & streaming response text ───────────────────────
const CHAT_SOURCES = [
  { platform: 'Shopify',    color: '#96BF48', action: "Reading yesterday's orders & GMV"      },
  { platform: 'Meta Ads',   color: '#1877F2', action: 'Fetching ad performance & creatives'   },
  { platform: 'Klaviyo',    color: '#F7C948', action: 'Checking email flow attribution'        },
  { platform: 'Google Ads', color: '#EA4335', action: 'Pulling campaign performance data'      },
  { platform: 'Klairo',     color: '#5D9DF5', action: 'Generating analysis & recommendations' },
];

const RESPONSE_TEXT = [
  '### Yesterday at a Glance',
  '',
  "Revenue hit $14,200 — your strongest day in February. Here's what drove it.",
  '',
  "**Meta Ads** contributed $9,600 at a 4.2x ROAS. 'Summer UGC — Hook 3' generated $4,100 alone. CPM is at $8.40 and climbing 3% daily — you're on day 5 of an 8-day efficiency window.",
  '',
  '**Shopify** processed 40 orders at a $355 average order value. Mobile CVR reached 4.1%, up from 3.8% last week. The checkout improvements from Tuesday are working.',
  '',
  '**Klaviyo** attributed $2,400 in revenue. Your welcome flow is converting at 8.2% — double the account average of 4.1%.',
  '',
  '### One Thing to Watch',
  '',
  'Checkout abandonment hit 52% this week, up from 34%. Session recordings show 68% of drop-off at the payment step. Adding Apple Pay is estimated to recover 18–24% of abandonment. I have drafted the action for your review.',
].join('\n');

// ── Streaming response renderer ───────────────────────────────────────
function StreamedResponse({ text, complete }: { text: string; complete: boolean }) {
  const lines = text.split('\n');
  const segs: { type: 'h' | 'p'; content: string }[] = [];
  let cur = '';
  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (cur.trim()) { segs.push({ type: 'p', content: cur.trim() }); cur = ''; }
      segs.push({ type: 'h', content: line.slice(4) });
    } else if (line === '') {
      if (cur.trim()) { segs.push({ type: 'p', content: cur.trim() }); cur = ''; }
    } else {
      cur += (cur ? ' ' : '') + line;
    }
  }
  if (cur.trim()) segs.push({ type: 'p', content: cur.trim() });

  const renderInline = (content: string, isLast: boolean) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} style={{ fontWeight: 700, color: '#1C1C1C' }}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
      {!complete && isLast && <span className="ks-cursor" />}
    </>;
  };

  return (
    <div>
      {segs.map((seg, i) => {
        const isLast = i === segs.length - 1;
        if (seg.type === 'h') return (
          <p key={i} style={{ fontFamily: 'Merriweather, serif', fontSize: '15px', fontWeight: 400, color: '#1C1C1C', lineHeight: 1.4, marginBottom: '10px', marginTop: i > 0 ? '24px' : '0' }}>
            {seg.content}{!complete && isLast && <span className="ks-cursor" />}
          </p>
        );
        return (
          <p key={i} style={{ fontSize: '13px', color: '#444444', lineHeight: 1.78, marginBottom: '6px' }}>
            {renderInline(seg.content, isLast)}
          </p>
        );
      })}
    </div>
  );
}

// ── VIEW: Daily Brief ────────────────────────────────────────────────
function DailyBriefView() {
  const [range, setRange]       = useState<'today' | 'yesterday' | 'last7' | 'last30' | 'month'>('last7');
  const [rangeOpen, setRangeOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState<Set<string>>(new Set());
  const [sendOpen, setSendOpen]   = useState<string | null>(null);
  const [sendSent, setSendSent]   = useState<string | null>(null);
  const [doingIt, setDoingIt]     = useState<Set<string>>(new Set());
  const [done, setDone]           = useState<Set<string>>(new Set());

  const rangeOptions = [
    { id: 'today',     label: 'Today'        },
    { id: 'yesterday', label: 'Yesterday'    },
    { id: 'last7',     label: 'Last 7 days'  },
    { id: 'last30',    label: 'Last 30 days' },
    { id: 'month',     label: 'This month'   },
  ];
  const rangeLabel  = rangeOptions.find(r => r.id === range)?.label ?? 'Last 7 days';
  const periodLabel = range === 'today' ? 'vs yesterday' : range === 'yesterday' ? 'vs prev day' : range === 'last7' ? 'vs last week' : 'vs prev month';

  const metrics = [
    { label: 'Revenue', value: '$14,200', delta: '+22%',  positive: true,  data: [9400,10200,9800,11200,10800,12400,13200,12600,13800,12900,13700,14200] },
    { label: 'ROAS',    value: '4.2x',    delta: '+0.8x', positive: true,  data: [3.1,3.4,3.2,3.6,3.8,3.9,4.0,3.8,4.1,3.9,4.1,4.2] },
    { label: 'MER',     value: '3.7x',    delta: '+0.5x', positive: true,  data: [2.9,3.0,3.1,3.0,3.2,3.3,3.4,3.3,3.5,3.4,3.6,3.7] },
    { label: 'CVR',     value: '4.1%',    delta: '-0.3%', positive: false, data: [4.8,4.6,4.9,4.5,4.4,4.2,4.3,4.1,4.0,4.2,4.0,4.1] },
  ];

  const actions = [
    { id: 'A1', source: 'Meta Ads',    sc: '#1877F2', action: "Scale 'Summer UGC — Hook 3' budget to $800/day",       priority: 'high'   as const, status: 'new'      as const, created: 'Today, 6:02 AM', due: '2h left' },
    { id: 'A2', source: 'ShipBob',     sc: '#D32F2F', action: 'Stock-out risk in 6 days — approve draft PO now',      priority: 'urgent' as const, status: 'new'      as const, created: 'Today, 5:55 AM', due: '6d left' },
    { id: 'A3', source: 'TikTok Shop', sc: '#111111', action: 'Trending SKU detected — launch retargeting campaign',  priority: 'high'   as const, status: 'new'      as const, created: 'Today, 5:57 AM', due: '1d left' },
    { id: 'A4', source: 'Klaviyo',     sc: '#F7C948', action: 'Welcome flow at 8.2% CVR — A/B test subject line',     priority: 'medium' as const, status: 'reviewed' as const, created: 'Yesterday',      due: '3d left' },
    { id: 'A5', source: 'Google Ads',  sc: '#EA4335', action: 'CPC spike on Brand campaign — review bids now',        priority: 'medium' as const, status: 'new'      as const, created: 'Today, 7:15 AM', due: '4h left' },
    { id: 'A6', source: 'Shopify',     sc: '#96BF48', action: 'Checkout abandonment up 18% this week — review flow',  priority: 'low'    as const, status: 'new'      as const, created: 'Yesterday',      due: '5d left' },
  ];

  const toggleReview = (id: string) => {
    const n = new Set(reviewOpen);
    n.has(id) ? n.delete(id) : n.add(id);
    setReviewOpen(n);
  };

  const handleDoIt = (id: string) => {
    setDoingIt(prev => new Set(prev).add(id));
    setTimeout(() => {
      setDoingIt(prev => { const n = new Set(prev); n.delete(id); return n; });
      setDone(prev => new Set(prev).add(id));
    }, 2000);
  };

  const handleSend = (name: string) => {
    setSendSent(name);
    setTimeout(() => { setSendOpen(null); setSendSent(null); }, 1400);
  };

  const COLS = '28px 100px 1fr 94px 86px 110px 60px 160px';

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ fontFamily: FONT }}>

      {/* Send popup — fixed overlay */}
      <AnimatePresence>
        {sendOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => { setSendOpen(null); setSendSent(null); }}
          >
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[3px]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="relative bg-white rounded-2xl border border-[#E5E5E5] p-5 md:p-6 mx-4 w-full"
              style={{ maxWidth: '460px', boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1C', marginBottom: '3px' }}>Share with teammate</p>
                  <p style={{ fontSize: '11px', color: '#AAAAAA', maxWidth: '320px' }} className="truncate">
                    {actions.find(a => a.id === sendOpen)?.action}
                  </p>
                </div>
                <button
                  onClick={() => { setSendOpen(null); setSendSent(null); }}
                  className="w-7 h-7 rounded-full bg-[#F4F4F0] hover:bg-[#EBEBEB] flex items-center justify-center transition-colors shrink-0 ml-3"
                >
                  <X size={13} color="#888888" />
                </button>
              </div>

              {/* Teammate cards */}
              <div className="grid grid-cols-3 gap-3">
                {teammates.map(tm => (
                  <button
                    key={tm.name}
                    onClick={() => handleSend(tm.name)}
                    className="group flex flex-col items-center pt-5 pb-4 px-3 rounded-2xl border border-[#EBEBEB] hover:border-[#5D9DF5] hover:bg-[#F8FBFF] transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  >
                    {sendSent === tm.name ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-14 h-14 rounded-full bg-[#EDFBF0] flex items-center justify-center mb-3"
                      >
                        <Check size={22} color="#2E7D32" strokeWidth={2.5} />
                      </motion.div>
                    ) : (
                      <div className="w-14 h-14 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-[#5D9DF5] ring-offset-2 transition-all duration-200">
                        <img src={tm.photo} alt={tm.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p style={{ fontSize: '12px', fontWeight: 700, color: sendSent === tm.name ? '#2E7D32' : '#1C1C1C', textAlign: 'center', marginBottom: '2px' }}>
                      {sendSent === tm.name ? 'Sent!' : tm.name}
                    </p>
                    <p style={{ fontSize: '10px', color: '#AAAAAA', textAlign: 'center', marginBottom: '12px' }}>{tm.role}</p>
                    {sendSent !== tm.name && (
                      <div
                        className="w-full rounded-full py-1.5 text-center transition-colors duration-200 bg-[#F4F4F0] group-hover:bg-[#5D9DF5]"
                        style={{ fontSize: '10px', fontWeight: 700, color: '#888888' }}
                      >
                        <span className="group-hover:text-white transition-colors duration-200">Send →</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar — desktop only */}
      <div className="h-11 border-b border-[#E5E5E5] bg-[#F9F8F4]/80 backdrop-blur-sm hidden md:flex items-center px-6 shrink-0 sticky top-0 z-10">
        <p style={{ fontFamily: 'Merriweather, serif', fontSize: '14px', fontWeight: 400, color: '#1C1C1C' }}>Daily Brief</p>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <p style={{ fontSize: '11px', color: '#AAAAAA' }}>Fri, Feb 20, 2026</p>
          <div className="relative">
            <button
              onClick={() => setRangeOpen(o => !o)}
              className="flex items-center gap-1.5 bg-white border border-[#E5E5E5] rounded-lg px-3 py-1.5 hover:border-[#C8C8C8] transition-colors"
              style={{ fontSize: '12px', fontWeight: 500, color: '#1C1C1C' }}
            >
              <Calendar size={12} color="#888888" />
              {rangeLabel}
              <ChevronDown size={11} color="#888888" />
            </button>
            <AnimatePresence>
              {rangeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#E5E5E5] rounded-xl py-1 z-20"
                  style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                >
                  {rangeOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setRange(opt.id as any); setRangeOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-[#F4F4F0] transition-colors"
                      style={{ fontSize: '12px', fontWeight: range === opt.id ? 600 : 400, color: range === opt.id ? '#5D9DF5' : '#1C1C1C' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5 space-y-4 md:space-y-5">

        {/* Greeting */}
        <div>
          <h1 style={{ fontFamily: 'Merriweather, serif', fontSize: '22px', fontWeight: 400, color: '#1C1C1C', lineHeight: 1.2 }} className="mb-1">
            Good morning, Alex.
          </h1>
          <p style={{ fontSize: '13px', color: '#888888', lineHeight: 1.6 }}>
            Revenue is up 22% on yesterday. Meta CPMs are climbing and your Klaviyo welcome flow is converting at 8.2% — double the account average.
          </p>
        </div>

        {/* Metric cards — 2-col on mobile (brand spec), 4-col on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map(m => (
            <MetricCard key={m.label} label={m.label} value={m.value} delta={m.delta}
              positive={m.positive} data={m.data} period={periodLabel} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><RevenueTrendChart /></div>
          <div><ChannelBreakdownChart /></div>
        </div>

        {/* ── TODAY'S INSIGHTS ── */}
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em' }} className="mb-3">
            Today's Insights
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                platform: 'Meta Ads',    time: '6:02 AM',
                headline: 'Hook 3 is your breakout creative of Q1',
                body: "'Summer UGC — Hook 3' is outperforming all other ad sets by 120% with a 4.2x ROAS on $4.2k weekly spend.",
                metric: '4.2x', metricLabel: 'ROAS', delta: '↑ 120% vs others',
              },
              {
                platform: 'Shopify',     time: '6:01 AM',
                headline: 'Best GMV day this month',
                body: '$14,200 from 40 orders — the highest single-day revenue in February, driven by the Meta creative lift.',
                metric: '$14,200', metricLabel: 'GMV Today', delta: '↑ 22% vs yesterday',
              },
              {
                platform: 'Klaviyo',     time: '5:59 AM',
                headline: 'Welcome flow hits 8.2% CVR',
                body: 'Double the account average. 340 new subscribers converted after Monday\'s subject line A/B update.',
                metric: '8.2%', metricLabel: 'CVR', delta: '↑ 2× account avg',
              },
              {
                platform: 'TikTok Shop', time: '5:57 AM',
                headline: '#BeachVibes — your SKU is going viral',
                body: '3 trending videos featuring your Beach Vibes Tote reached a combined 2.4M views in 6 hours.',
                metric: '2.4M', metricLabel: 'Organic Reach', delta: '↑ 340% spike',
              },
            ].map(ins => (
              <div key={ins.platform} className="bg-white rounded-2xl border border-[#EBEBEB] p-4 flex flex-col hover:border-[#D4D4D4] transition-colors">
                {/* Platform + time */}
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {ins.platform}
                  </span>
                  <span style={{ fontSize: '9px', color: '#CCCCCC', fontWeight: 500 }}>{ins.time}</span>
                </div>
                {/* Merriweather headline — consistent across all four cards */}
                <p style={{ fontFamily: 'Merriweather, serif', fontSize: '13px', fontWeight: 400, color: '#1C1C1C', lineHeight: 1.45, marginBottom: '8px' }}>
                  {ins.headline}
                </p>
                {/* Body */}
                <p style={{ fontSize: '11px', color: '#888888', lineHeight: 1.65, flexGrow: 1 }}>
                  {ins.body}
                </p>
                {/* Metric footer */}
                <div className="border-t border-[#F0EFEA] mt-4 pt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#1C1C1C', lineHeight: 1 }}>{ins.metric}</span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#5D9DF5' }}>{ins.delta}</span>
                  </div>
                  <p style={{ fontSize: '9px', color: '#CCCCCC', marginTop: '3px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {ins.metricLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SUGGESTED ACTIONS ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                Suggested Actions
              </p>
              <span style={{ fontSize: '10px', fontWeight: 700, background: '#EEF4FF', color: '#1D4ED8', padding: '1px 7px', borderRadius: '999px' }}>
                {actions.filter(a => !done.has(a.id)).length}
              </span>
            </div>
            <button className="flex items-center gap-1.5 border border-[#E5E5E5] rounded-lg px-3 py-1.5 bg-white hover:border-[#C8C8C8] transition-colors">
              <Filter size={11} color="#888888" />
              <span style={{ fontSize: '11px', color: '#888888', fontWeight: 500 }}>Filter</span>
            </button>
          </div>

          {/* ── Mobile action cards ── */}
          <div className="md:hidden space-y-2.5">
            {actions.map((a) => {
              if (done.has(a.id)) return null;
              return (
                <div key={a.id} className="bg-white border border-[#EBEBEB] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: FONT }}>{a.source}</span>
                    <div className="flex items-center gap-2">
                      <PriorityBars level={a.priority} />
                      <StatusBadge s={a.status} />
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#1C1C1C', lineHeight: 1.5, fontFamily: FONT }} className="mb-3">{a.action}</p>
                  <div className="flex flex-col gap-2.5 pt-3 border-t border-[#F0EFEA]">
                    <p style={{ fontSize: '10px', color: '#AAAAAA', fontFamily: FONT }}>{a.created} · Due {a.due}</p>
                    {doingIt.has(a.id) ? (
                      <div className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#EEF4FF]">
                        <Spinner />
                        <span style={{ fontSize: '11px', color: '#5D9DF5', fontWeight: 600, fontFamily: FONT }}>Doing…</span>
                      </div>
                    ) : done.has(a.id) ? (
                      <div className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#EDFBF0]">
                        <Check size={11} color="#2E7D32" />
                        <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600, fontFamily: FONT }}>Done</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDoIt(a.id)}
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#1C1C1C] hover:bg-black transition-colors"
                      >
                        <Zap size={11} color="white" />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'white', fontFamily: FONT }}>Do It</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop actions table ── */}
          <div className="hidden md:block bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
            {/* Table header */}
            <div className="grid items-center px-4 py-2.5 border-b border-[#F0EFEA]" style={{ gridTemplateColumns: COLS }}>
              {['', 'SOURCE', 'ACTION', 'PRIORITY', 'STATUS', 'CREATED', 'DUE', ''].map((col, i) => (
                <span key={i} style={{ fontSize: '9px', fontWeight: 700, color: '#BBBBBB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {col}
                </span>
              ))}
            </div>

            {/* Action rows with accordion */}
            {actions.map((a, i) => (
              <div key={a.id} className={i < actions.length - 1 ? 'border-b border-[#F4F4F0]' : ''}>
                {/* Main row */}
                <div
                  className={`grid items-center px-4 py-3 transition-colors ${done.has(a.id) ? 'opacity-50' : 'hover:bg-[#FAFAF8]'} ${reviewOpen.has(a.id) ? 'bg-[#F8FBFF]' : ''}`}
                  style={{ gridTemplateColumns: COLS }}
                >
                  {/* Checkbox */}
                  <input type="checkbox" className="w-3.5 h-3.5 cursor-pointer accent-[#5D9DF5]" />
                  {/* Source */}
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.sc }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#1C1C1C' }} className="truncate">{a.source}</span>
                  </div>
                  {/* Action */}
                  <p style={{ fontSize: '12px', color: '#444444', paddingRight: '12px' }} className="truncate">{a.action}</p>
                  {/* Priority */}
                  <PriorityBars level={a.priority} />
                  {/* Status */}
                  <StatusBadge s={a.status} />
                  {/* Created */}
                  <p style={{ fontSize: '11px', color: '#AAAAAA' }}>{a.created}</p>
                  {/* Due */}
                  <p style={{ fontSize: '11px', fontWeight: 600, color: a.due.includes('h') ? '#D32F2F' : '#888888' }}>{a.due}</p>
                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5">
                    {done.has(a.id) ? (
                      <span className="flex items-center gap-1" style={{ fontSize: '11px', fontWeight: 700, color: '#2E7D32' }}>
                        <Check size={11} strokeWidth={2.5} /> Complete
                      </span>
                    ) : doingIt.has(a.id) ? (
                      <span className="flex items-center gap-1.5" style={{ fontSize: '11px', color: '#888888' }}>
                        <Spinner /> Working…
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleReview(a.id)}
                          className="px-2.5 py-1 rounded-md border transition-all"
                          style={{
                            fontSize: '10px', fontWeight: 600,
                            borderColor: reviewOpen.has(a.id) ? '#5D9DF5' : '#E5E5E5',
                            color:       reviewOpen.has(a.id) ? '#5D9DF5' : '#555555',
                            background:  reviewOpen.has(a.id) ? '#EEF4FF' : 'transparent',
                          }}
                        >
                          Review
                        </button>
                        <button
                          onClick={() => { setSendOpen(a.id); setSendSent(null); }}
                          className="px-2.5 py-1 rounded-md border border-[#E5E5E5] hover:border-[#C8C8C8] transition-all"
                          style={{ fontSize: '10px', fontWeight: 600, color: '#555555' }}
                        >
                          Send
                        </button>
                        <button
                          onClick={() => handleDoIt(a.id)}
                          className="px-2.5 py-1 rounded-md bg-[#1C1C1C] hover:bg-black transition-all"
                          style={{ fontSize: '10px', fontWeight: 600, color: '#FFFFFF' }}
                        >
                          Do It
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Review accordion */}
                <AnimatePresence>
                  {reviewOpen.has(a.id) && (
                    <motion.div
                      key={`review-${a.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{    opacity: 0, height: 0    }}
                      transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        className="px-6 py-5 border-t border-[#EEF4FF]"
                        style={{ background: '#F8FBFF', borderLeft: `3px solid ${a.sc}` }}
                      >
                        <div className="flex items-start justify-between gap-8">
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: '12px', fontWeight: 700, color: '#1C1C1C', marginBottom: '6px' }}>
                              {reviewData[a.id].headline}
                            </p>
                            <p style={{ fontSize: '12px', color: '#555555', lineHeight: 1.7, maxWidth: '560px' }}>
                              {reviewData[a.id].body}
                            </p>
                          </div>
                          <div className="flex items-stretch gap-2.5 shrink-0">
                            {reviewData[a.id].metrics.map(m => (
                              <div key={m.label} className="bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-center" style={{ minWidth: '90px' }}>
                                <p style={{ fontSize: '15px', fontWeight: 700, color: m.positive === false ? '#D32F2F' : '#1C1C1C', lineHeight: 1 }}>
                                  {m.value}
                                </p>
                                <p style={{ fontSize: '9px', color: '#AAAAAA', marginTop: '5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1.3 }}>
                                  {m.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => { toggleReview(a.id); setSendOpen(a.id); setSendSent(null); }}
                            className="flex items-center gap-1.5 border border-[#E5E5E5] bg-white rounded-full px-3.5 py-1.5 hover:border-[#5D9DF5] transition-colors"
                            style={{ fontSize: '11px', fontWeight: 600, color: '#555555' }}
                          >
                            Share with teammate
                          </button>
                          <button
                            onClick={() => { toggleReview(a.id); handleDoIt(a.id); }}
                            className="flex items-center gap-1.5 bg-[#1C1C1C] hover:bg-black rounded-full px-3.5 py-1.5 transition-colors"
                            style={{ fontSize: '11px', fontWeight: 600, color: '#FFFFFF' }}
                          >
                            <Play size={9} className="fill-white" /> Do It Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}

// ── VIEW: New Chat ────────────────────────────────────────────────────
function NewChatView() {
  type CS = 'idle' | 'thinking' | 'sourcing' | 'streaming' | 'complete';
  const [chatState, setChatState]           = useState<CS>('idle');
  const [inputValue, setInputValue]         = useState('');
  const [query, setQuery]                   = useState('');
  const [sourcingStep, setSourcingStep]     = useState(-1);
  const [doneSteps, setDoneSteps]           = useState<Set<number>>(new Set());
  const [streamedText, setStreamedText]     = useState('');
  const [deepReport, setDeepReport]         = useState<'idle'|'generating'|'done'>('idle');
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleRunReport = () => {
    setDeepReport('generating');
    setTimeout(() => setDeepReport('done'), 2600);
  };

  useEffect(() => () => { if (streamRef.current) clearInterval(streamRef.current); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [streamedText, sourcingStep, chatState]);

  const handleSubmit = (q: string) => {
    if (!q.trim() || chatState !== 'idle') return;
    setQuery(q); setInputValue('');
    setChatState('thinking'); setSourcingStep(-1); setDoneSteps(new Set()); setStreamedText('');

    setTimeout(() => {
      setChatState('sourcing');
      let step = 0;
      const next = () => {
        setSourcingStep(step);
        setTimeout(() => {
          setDoneSteps(prev => new Set([...prev, step]));
          step++;
          if (step < CHAT_SOURCES.length) setTimeout(next, 180);
          else setTimeout(() => {
            setChatState('streaming');
            let idx = 0;
            if (streamRef.current) clearInterval(streamRef.current);
            streamRef.current = setInterval(() => {
              idx += 2;
              setStreamedText(RESPONSE_TEXT.slice(0, idx));
              if (idx >= RESPONSE_TEXT.length) {
                clearInterval(streamRef.current!);
                setStreamedText(RESPONSE_TEXT);
                setChatState('complete');
              }
            }, 14);
          }, 500);
        }, 530);
      };
      next();
    }, 1400);
  };

  const PILLS = [
    { l: 'Meta', c: '#1877F2' }, { l: 'Shopify', c: '#96BF48' },
    { l: 'Klaviyo', c: '#F7C948' }, { l: 'TikTok', c: '#111111' }, { l: 'Google', c: '#EA4335' },
  ];
  const prompts = [
    'How were sales yesterday?', 'Which ad is performing best?',
    'Am I at risk of stocking out?', 'Scale my Meta budget',
    'Weekly performance summary', "What drove this week's MER?",
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ fontFamily: FONT }}>

      {/* ── Animation keyframes ── */}
      <style>{`
        @keyframes ks-shimmer { 0% { background-position: -700px center; } 100% { background-position: 700px center; } }
        @keyframes ks-blink   { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes ks-pulse   { 0%,100% { opacity:.45; transform:scale(.95); } 50% { opacity:1; transform:scale(1.12); } }
        @keyframes ks-spin    { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes ks-fadeup  { from { opacity:0; transform:translateY(7px); } to { opacity:1; transform:translateY(0); } }
        .ks-shimmer {
          background: linear-gradient(90deg, #BBBBBB 0%, #BBBBBB 28%, #1A1A1A 50%, #BBBBBB 72%, #BBBBBB 100%);
          background-size: 700px 100%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: ks-shimmer 2.6s linear infinite;
        }
        .ks-spin    { animation: ks-spin    0.85s linear infinite; }
        .ks-pulse   { animation: ks-pulse   1.5s  ease-in-out infinite; }
        .ks-cursor  { display:inline-block; width:2px; height:13px; background:#5D9DF5; margin-left:1px; vertical-align:middle; animation: ks-blink 1s step-end infinite; }
        .ks-fadeup  { animation: ks-fadeup 0.36s ease forwards; }
      `}</style>

      {chatState === 'idle' ? (
        /* ── IDLE screen ── */
        <div className="flex-1 flex flex-col items-center justify-center bg-[#FDFCF8] overflow-hidden px-4 md:px-6 py-8 md:py-12 relative">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #1C1C1C 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative z-10 w-full max-w-[680px] flex flex-col items-center">
            <div className="w-20 mb-7 opacity-60">
              <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain" />
            </div>
            <h1 style={{ fontFamily: 'Merriweather, serif', fontWeight: 400, color: '#1C1C1C', lineHeight: 1.2, textAlign: 'center' }} className="mb-2 text-2xl md:text-4xl">
              Ask Klairo anything.
            </h1>
            <p style={{ fontSize: '14px', color: '#888888', textAlign: 'center', lineHeight: 1.6 }} className="mb-9">
              Your connected business brain — across every platform.
            </p>
            <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden mb-5">
              <textarea value={inputValue} onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(inputValue); } }}
                className="w-full px-5 pt-5 pb-4 resize-none outline-none"
                style={{ fontSize: '14px', color: '#1C1C1C', lineHeight: 1.6, minHeight: '72px', background: 'transparent', fontFamily: FONT }}
                placeholder="What do you want to know today?" rows={2} />
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#F0EFEA]">
                <div className="flex items-center gap-2">
                  {PILLS.map(p => (
                    <div key={p.l} className="flex items-center gap-1.5 bg-[#F4F4F0] rounded-full px-2.5 py-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.c }} />
                      <span style={{ fontSize: '10px', color: '#888888', fontWeight: 600 }}>{p.l}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 bg-[#F4F4F0] rounded-full px-2.5 py-1">
                    <Plus size={9} color="#888888" />
                    <span style={{ fontSize: '10px', color: '#888888', fontWeight: 600 }}>1</span>
                  </div>
                </div>
                <button onClick={() => handleSubmit(inputValue)}
                  className="w-9 h-9 rounded-full bg-[#1C1C1C] hover:bg-black flex items-center justify-center transition-colors">
                  <ArrowRight size={14} color="white" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-full">
              {prompts.map((p, idx) => (
                <button key={p} onClick={() => handleSubmit(p)}
                  className={`flex items-center gap-1.5 bg-white border border-[#E5E5E5] rounded-full px-4 py-2 hover:border-[#5D9DF5] hover:bg-[#F4F8FF] transition-all group ${idx > 2 ? 'hidden md:flex' : ''}`}>
                  <ChevronRight size={10} color="#5D9DF5" className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                  <span style={{ fontSize: '12px', color: '#555555', fontWeight: 500 }}>{p}</span>
                </button>
              ))}
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="h-px w-16 bg-[#E5E5E5]" />
              <span style={{ fontSize: '10px', color: '#CCCCCC', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>6 platforms connected</span>
              <div className="h-px w-16 bg-[#E5E5E5]" />
            </div>
          </div>
        </div>

      ) : (
        /* ── CONVERSATION view ── */
        <div className="flex-1 flex flex-col bg-[#FDFCF8] overflow-hidden">

          {/* Scrollable thread */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[700px] mx-auto px-8 py-12 space-y-10">

              {/* User bubble */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex justify-end">
                <div className="bg-white rounded-2xl px-5 py-4 border border-[#E5E5E5]"
                  style={{ maxWidth: '80%', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize: '14px', color: '#1C1C1C', lineHeight: 1.65 }}>{query}</p>
                </div>
              </motion.div>

              {/* Klairo response block */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.2 }}>

                {/* Dog + name header */}
                <div className="flex items-center gap-3 mb-5">
                  <PixelDog scale={3} running={chatState === 'thinking' || chatState === 'sourcing'} />
                  <span style={{ fontFamily: 'Merriweather, serif', fontSize: '15px', fontWeight: 400, color: '#1C1C1C' }}>Klairo</span>
                </div>

                {/* Acknowledgment */}
                <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.7, marginBottom: '22px' }}>
                  On it. Reading across your connected platforms now.
                </p>

                {/* Thinking */}
                {chatState === 'thinking' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7BB8FF] shrink-0 ks-pulse" />
                    <span className="ks-shimmer" style={{ fontSize: '13px', fontWeight: 500 }}>
                      Thinking across your platforms…
                    </span>
                  </div>
                )}

                {/* Sourcing steps */}
                {(chatState === 'sourcing' || chatState === 'streaming' || chatState === 'complete') && (
                  <div className="space-y-2.5 mb-8">
                    {CHAT_SOURCES.map((src, i) => {
                      const isDone   = doneSteps.has(i);
                      const isActive = sourcingStep === i && !isDone;
                      if (i > sourcingStep && !isDone) return null;
                      const faded = (chatState === 'streaming' || chatState === 'complete') && isDone;
                      return (
                        <div key={src.platform} className="ks-fadeup flex items-center gap-3"
                          style={{ opacity: faded ? 0.38 : 1, transition: 'opacity 0.6s ease' }}>
                          <div className="w-4 h-4 flex items-center justify-center shrink-0">
                            {isDone
                              ? <div className="w-4 h-4 rounded-full bg-[#EDFBF0] flex items-center justify-center"><Check size={8} color="#2E7D32" strokeWidth={3} /></div>
                              : isActive
                                ? <div className="w-4 h-4 rounded-full border-[2px] border-[#7BB8FF] border-t-transparent ks-spin" />
                                : <div className="w-4 h-4 rounded-full border-[2px] border-[#DDDDD8]" />
                            }
                          </div>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: src.color }} />
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1C' }}>{src.platform}</span>
                          <span style={{ fontSize: '12px', color: '#D4D4D0' }}>—</span>
                          {isActive
                            ? <span className="ks-shimmer" style={{ fontSize: '12px', fontWeight: 500 }}>{src.action}</span>
                            : <span style={{ fontSize: '12px', color: isDone ? '#AAAAAA' : '#888888' }}>{src.action}</span>
                          }
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Streamed response */}
                {(chatState === 'streaming' || chatState === 'complete') && streamedText && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="w-12 h-px mb-7" style={{ background: '#E8E6E0' }} />
                    <StreamedResponse text={streamedText} complete={chatState === 'complete'} />
                  </motion.div>
                )}

                {/* At-a-glance insight card */}
                {chatState === 'complete' && (
                  <InsightCard onRunReport={handleRunReport} />
                )}

              </motion.div>

              {/* Deep report (outside the Klairo response block so it sits at thread level) */}
              {deepReport !== 'idle' && (
                <DeepReportCanvas generating={deepReport === 'generating'} />
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Bottom input bar */}
          <div className="border-t border-[#EBEBEB] bg-white/90 backdrop-blur-sm px-8 py-4">
            <div className="max-w-[700px] mx-auto">
              <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${chatState === 'complete' ? 'bg-white border-[#E5E5E5]' : 'bg-[#F4F4F0] border-[#EAEAEA]'}`}>
                <div className="px-5 py-4">
                  <p style={{ fontSize: '13px', color: '#C8C8C4' }}>
                    {chatState === 'complete' ? 'Ask a follow-up…' : 'Thinking…'}
                  </p>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-[#F0EFEA]">
                  <div className="flex items-center gap-2" style={{ opacity: 0.45 }}>
                    {PILLS.slice(0, 3).map(p => (
                      <div key={p.l} className="flex items-center gap-1.5 bg-[#EBEBEB] rounded-full px-2.5 py-1">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.c }} />
                        <span style={{ fontSize: '10px', color: '#AAAAAA', fontWeight: 600 }}>{p.l}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${chatState === 'complete' ? 'bg-[#1C1C1C]' : 'bg-[#DDDDD8]'}`}>
                    <ArrowRight size={14} color={chatState === 'complete' ? 'white' : '#AAAAAA'} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ── VIEW: Reports ─────────────────────────────────────────────────────
function ReportsView() {
  const [generating, setGenerating] = useState<Set<string>>(new Set());
  const [generated,  setGenerated]  = useState<Set<string>>(new Set());
  const [sendOpen,   setSendOpen]   = useState<string | null>(null);
  const [sendSent,   setSendSent]   = useState<string | null>(null);
  const [search,     setSearch]     = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // ── Suggested report prompts ──
  const suggestions = [
    { id: 'bf',       Icon: TrendingUp,  label: 'Seasonal',    title: 'Black Friday 2025 vs 2024',         desc: 'Year-over-year comparison across every channel' },
    { id: 'q4',       Icon: BarChart2,   label: 'Quarterly',   title: 'Q4 2025 Full Channel Review',       desc: 'Complete quarterly performance breakdown' },
    { id: 'ads6',     Icon: Zap,         label: 'Creative',    title: 'Top Ads — Last 6 Months',           desc: 'Ranked by ROAS, CPM, and conversion rate' },
    { id: 'ltv',      Icon: Package,     label: 'Retention',   title: 'Customer LTV by Channel',           desc: 'Lifetime value segmented by acquisition source' },
    { id: 'spring',   Icon: Calendar,    label: 'Forecast',    title: 'Spring 2026 Demand Forecast',       desc: 'Seasonal projection built on 2025 actuals' },
    { id: 'funnel',   Icon: ShoppingBag, label: 'Conversion',  title: 'Checkout Funnel Deep Dive',         desc: 'Drop-off analysis with recovery recommendations' },
  ];

  // ── Saved reports library ──
  const allReports = [
    {
      id: 'r1', category: 'Paid Social', title: 'Meta Ads Deep Dive — Week of Feb 10–16',
      desc: 'Hook 3 drove $4,700 at 4.2x ROAS. Full creative breakdown, CPM trend analysis, and scaling recommendations across 5 active ad sets.',
      date: 'Feb 20, 2026', pages: 4, size: '1.2 MB', isNew: true,
    },
    {
      id: 'r2', category: 'Full Channel', title: 'Q4 2025 Performance Review',
      desc: 'November–December across all platforms. $312k in revenue at 3.8x blended MER. Klaviyo and Meta dominated; TikTok underperformed vs forecast.',
      date: 'Jan 3, 2026', pages: 12, size: '3.4 MB', isNew: false,
    },
    {
      id: 'r3', category: 'Email', title: 'Klaviyo Flow Attribution — January 2026',
      desc: 'Welcome, post-purchase, and win-back flows generated $18.4k. Subject line A/B results and recommended sequence changes included.',
      date: 'Feb 1, 2026', pages: 6, size: '1.8 MB', isNew: false,
    },
    {
      id: 'r4', category: 'Creative', title: 'Top Performing Creatives — Q4 2025',
      desc: '48 creatives analysed across paid social and display. UGC hook formats dominated. Average top-quartile ROAS: 4.1x. Full scoring matrix enclosed.',
      date: 'Jan 7, 2026', pages: 8, size: '2.1 MB', isNew: false,
    },
    {
      id: 'r5', category: 'Paid Search', title: 'Brand Campaign CPC Spike — Analysis',
      desc: 'CPC doubled from $1.20 to $2.40 in one week. Competitor activity identified. Bid strategy changes and impression share recovery plan included.',
      date: 'Feb 14, 2026', pages: 3, size: '0.9 MB', isNew: false,
    },
    {
      id: 'r6', category: 'Inventory', title: 'Stock Risk Report — Feb 2026',
      desc: 'SKU-4421 at 6-day cover with 142 units/day velocity. Full sell-through analysis across 24 active SKUs with draft PO recommendations.',
      date: 'Feb 20, 2026', pages: 5, size: '1.5 MB', isNew: true,
    },
  ];

  const filters = ['All', 'Paid Social', 'Full Channel', 'Email', 'Creative', 'Inventory'];

  const visible = allReports.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    const matchFilter = activeFilter === 'All' || r.category === activeFilter;
    return matchSearch && matchFilter;
  });

  const handleGenerate = (id: string) => {
    setGenerating(prev => new Set([...prev, id]));
    setTimeout(() => {
      setGenerating(prev => { const n = new Set(prev); n.delete(id); return n; });
      setGenerated(prev => new Set([...prev, id]));
    }, 3200);
  };

  const handleSend = (name: string) => {
    setSendSent(name);
    setTimeout(() => { setSendOpen(null); setSendSent(null); }, 1400);
  };

  const sharingReport = allReports.find(r => r.id === sendOpen);

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ fontFamily: FONT }}>

      {/* ── Share modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {sendOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => { setSendOpen(null); setSendSent(null); }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[3px]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="relative bg-white rounded-2xl border border-[#E5E5E5] p-5 md:p-6 mx-4 w-full"
              style={{ maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '4px' }}>Share Report</p>
                  <p style={{ fontFamily: 'Merriweather, serif', fontSize: '15px', fontWeight: 400, color: '#1C1C1C', maxWidth: '320px', lineHeight: 1.4 }}>
                    {sharingReport?.title}
                  </p>
                </div>
                <button
                  onClick={() => { setSendOpen(null); setSendSent(null); }}
                  className="w-7 h-7 rounded-full bg-[#F4F4F0] hover:bg-[#EBEBEB] flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={12} color="#888888" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {teammates.map(tm => (
                  <button key={tm.name} onClick={() => handleSend(tm.name)}
                    className="group flex flex-col items-center pt-5 pb-4 px-3 rounded-2xl border border-[#EBEBEB] hover:border-[#5D9DF5] hover:bg-[#F9FBFF] transition-all duration-200 hover:-translate-y-0.5">
                    {sendSent === tm.name ? (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="w-14 h-14 rounded-full bg-[#F4F4F0] flex items-center justify-center mb-3">
                        <Check size={20} color="#2E7D32" strokeWidth={2.5} />
                      </motion.div>
                    ) : (
                      <div className="w-14 h-14 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-[#5D9DF5] ring-offset-2 transition-all duration-200">
                        <img src={tm.photo} alt={tm.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p style={{ fontSize: '12px', fontWeight: 700, color: sendSent === tm.name ? '#2E7D32' : '#1C1C1C', textAlign: 'center', marginBottom: '2px' }}>
                      {sendSent === tm.name ? 'Sent!' : tm.name}
                    </p>
                    <p style={{ fontSize: '10px', color: '#888888', textAlign: 'center', marginBottom: '12px' }}>{tm.role}</p>
                    {sendSent !== tm.name && (
                      <div className="w-full rounded-full py-1.5 text-center bg-[#F4F4F0] group-hover:bg-[#5D9DF5] transition-colors duration-200"
                        style={{ fontSize: '10px', fontWeight: 700, color: '#888888' }}>
                        <span className="group-hover:text-white transition-colors duration-200">Send →</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top bar — desktop only ──────────────────────────────────── */}
      <div className="h-12 border-b border-[#E5E5E5] bg-[#F9F8F4]/80 backdrop-blur-sm hidden md:flex items-center px-8 shrink-0 sticky top-0 z-10">
        <p style={{ fontFamily: 'Merriweather, serif', fontSize: '15px', fontWeight: 400, color: '#1C1C1C' }}>Reports</p>
        <div className="flex-1" />
        <button className="flex items-center gap-2 bg-[#1C1C1C] hover:bg-black text-white rounded-xl px-4 py-2 transition-colors"
          style={{ fontSize: '12px', fontWeight: 600 }}>
          <Plus size={13} />New Report
        </button>
      </div>

      {/* ── Scrollable body ──────────��──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-6 md:py-8 space-y-10 md:space-y-12">

          {/* ═══ SUGGESTED REPORTS ═══ */}
          <section>
            <div className="mb-1">
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '6px' }}>
                Suggested
              </p>
              <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '22px', fontWeight: 400, color: '#1C1C1C', lineHeight: 1.2 }}>
                Reports to make
              </h2>
              <div className="w-6 h-[2px] rounded-full bg-[#5D9DF5] mt-3 mb-1" />
            </div>
            <p style={{ fontSize: '12px', color: '#888888', marginBottom: '20px' }}>
              Each is generated fresh from your live connected data.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {suggestions.map(({ id, Icon, label, title, desc }) => (
                <div key={id}
                  className="bg-white border border-[#E5E5E5] rounded-2xl p-5 flex flex-col hover:border-[#D4D4D4] transition-colors">
                  {/* Icon + label */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#F4F4F0] flex items-center justify-center shrink-0">
                      <Icon size={14} color="#555555" />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {label}
                    </span>
                  </div>

                  {/* Title */}
                  <p style={{ fontFamily: 'Merriweather, serif', fontSize: '13px', fontWeight: 400, color: '#1C1C1C', lineHeight: 1.5, marginBottom: '6px', flexGrow: 1 }}>
                    {title}
                  </p>

                  {/* Desc */}
                  <p style={{ fontSize: '11px', color: '#888888', lineHeight: 1.6, marginBottom: '16px' }}>
                    {desc}
                  </p>

                  {/* CTA */}
                  {generated.has(id) ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#F4F4F0] flex items-center justify-center shrink-0">
                        <Check size={8} color="#2E7D32" strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#2E7D32' }}>Ready</span>
                      <button style={{ fontSize: '11px', fontWeight: 600, color: '#5D9DF5' }}
                        className="ml-auto flex items-center gap-1 hover:text-[#1C4E80] transition-colors">
                        View <ArrowRight size={10} />
                      </button>
                    </div>
                  ) : generating.has(id) ? (
                    <div className="flex items-center gap-2">
                      <Spinner />
                      <span style={{ fontSize: '11px', color: '#888888' }}>Generating…</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGenerate(id)}
                      className="flex items-center justify-center gap-1.5 w-full border border-[#E5E5E5] rounded-xl py-2 hover:border-[#5D9DF5] hover:bg-[#F9FBFF] transition-all group"
                      style={{ fontSize: '11px', fontWeight: 600, color: '#555555' }}
                    >
                      <Wand2 size={11} color="#5D9DF5" />
                      <span className="group-hover:text-[#5D9DF5] transition-colors">Generate Report</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ═══ YOUR REPORTS LIBRARY ═══ */}
          <section>
            {/* Section header */}
            <div className="flex items-end justify-between mb-1">
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '6px' }}>
                  Library
                </p>
                <div className="flex items-center gap-3">
                  <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '22px', fontWeight: 400, color: '#1C1C1C', lineHeight: 1.2 }}>
                    Your Reports
                  </h2>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#5D9DF5', background: '#EEF4FF', padding: '1px 9px', borderRadius: '999px' }}>
                    {visible.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-6 h-[2px] rounded-full bg-[#5D9DF5] mt-3 mb-5" />

            {/* Search + filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 w-full md:w-56 shrink-0">
                <Search size={12} color="#AAAAAA" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search reports…"
                  className="flex-1 outline-none bg-transparent"
                  style={{ fontSize: '12px', color: '#1C1C1C', fontFamily: FONT }}
                />
              </div>
              {/* Filter chips — scroll horizontally on mobile, no wrapping */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 -mb-0.5">
                {filters.map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)}
                    className="px-3 py-1.5 rounded-lg border transition-all shrink-0"
                    style={{
                      fontSize: '11px',
                      fontWeight: activeFilter === f ? 700 : 500,
                      borderColor: activeFilter === f ? '#1C1C1C' : '#E5E5E5',
                      color:       activeFilter === f ? '#1C1C1C' : '#888888',
                      background:  activeFilter === f ? '#1C1C1C' : 'transparent',
                      ...(activeFilter === f ? { color: '#FFFFFF' } : {}),
                    }}
                  >{f}</button>
                ))}
              </div>
            </div>

            {/* Cards grid */}
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-10 h-10 rounded-2xl bg-[#F4F4F0] flex items-center justify-center mb-4">
                  <FileText size={18} color="#CCCCCC" />
                </div>
                <p style={{ fontFamily: 'Merriweather, serif', fontSize: '15px', color: '#AAAAAA' }}>No reports found</p>
                <p style={{ fontSize: '12px', color: '#CCCCCC', marginTop: '4px' }}>Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visible.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease: [0.4, 0, 0.2, 1] }}
                    className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden flex flex-col hover:border-[#D4D4D4] transition-colors"
                  >
                    <div className="p-5 flex flex-col flex-1">
                      {/* Category + new badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                          {r.category}
                        </span>
                        {r.isNew && (
                          <span style={{ fontSize: '9px', fontWeight: 700, color: '#5D9DF5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            New
                          </span>
                        )}
                      </div>

                      {/* PDF document mark */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F4F4F0] flex items-center justify-center shrink-0 mt-0.5">
                          <FileText size={14} color="#888888" />
                        </div>
                        <p style={{ fontFamily: 'Merriweather, serif', fontSize: '14px', fontWeight: 400, color: '#1C1C1C', lineHeight: 1.45 }}>
                          {r.title}
                        </p>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: '11px', color: '#888888', lineHeight: 1.65, flexGrow: 1 }}>
                        {r.desc}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-1 mt-4">
                        <span style={{ fontSize: '10px', color: '#BBBBBB' }}>{r.date}</span>
                        <span style={{ fontSize: '10px', color: '#DDDDDD' }}>·</span>
                        <span style={{ fontSize: '10px', color: '#BBBBBB' }}>{r.pages} pages</span>
                        <span style={{ fontSize: '10px', color: '#DDDDDD' }}>·</span>
                        <span style={{ fontSize: '10px', color: '#BBBBBB' }}>{r.size}</span>
                      </div>

                      {/* Separator */}
                      <div className="border-t border-[#F0EFEA] mt-4 mb-3.5" />

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl bg-[#1C1C1C] hover:bg-black transition-colors"
                          style={{ fontSize: '11px', fontWeight: 600, color: '#FFFFFF' }}
                        >
                          <Download size={11} />Download
                        </button>
                        <button
                          onClick={() => setSendOpen(r.id)}
                          className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl border border-[#E5E5E5] hover:border-[#AAAAAA] transition-colors"
                          style={{ fontSize: '11px', fontWeight: 600, color: '#555555' }}
                        >
                          <Share2 size={11} />Share
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────
export function Dashboard() {
  const [view, setView]                         = useState<View>('daily-brief');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen]         = useState(false);
  const [agentMarketplaceOpen, setAgentMarketplaceOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen]       = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-[#F9F8F4] text-[#1C1C1C] overflow-hidden" style={{ fontFamily: FONT }}>

      {/* Sidebar — desktop only */}
      <div className="hidden md:block">
        <Sidebar
          activeView={view}
          onViewChange={setView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenAgentMarketplace={() => setAgentMarketplaceOpen(true)}
        />
      </div>

      {/* Mobile top bar — hidden on desktop */}
      <div className="fixed top-0 left-0 right-0 h-11 md:hidden bg-[#F9F8F4]/90 backdrop-blur-sm border-b border-[#E5E5E5] z-30 flex items-center px-4 shrink-0" style={{ gap: '12px' }}>
        {/* Hamburger — opens slide-out drawer */}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="w-8 h-8 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0"
          aria-label="Open navigation"
        >
          <Menu size={15} color="#555555" />
        </button>
        {/* Current view title — centred via flex-1 */}
        <p className="flex-1 text-center" style={{ fontFamily: 'Merriweather, serif', fontSize: '13px', fontWeight: 400, color: '#1C1C1C' }}>
          {VIEW_TITLES[view]}
        </p>
        {/* Logo — right side, keeps the title visually centred */}
        <div className="w-14 shrink-0">
          <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain" />
        </div>
      </div>

      {/* Mobile slide-out nav drawer */}
      <MobileDrawer
        open={mobileNavOpen}
        view={view}
        onViewChange={setView}
        onClose={() => setMobileNavOpen(false)}
        onOpenSettings={() => { setSettingsOpen(true); setMobileNavOpen(false); }}
        onOpenAgents={() => { setAgentMarketplaceOpen(true); setMobileNavOpen(false); }}
      />

      {/* Main content area */}
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{
          height: '100vh',
          marginLeft: isMobile ? 0 : (sidebarCollapsed ? 0 : 220),
          paddingTop: isMobile ? 44 : 0,
          transition: 'margin-left 0.26s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {view === 'daily-brief' && <DailyBriefView />}
        {view === 'new-chat'    && <NewChatView />}
        {view === 'reports'     && <ReportsView />}
        {view === 'team-feed'   && <TeamFeedView />}
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AgentMarketplace open={agentMarketplaceOpen} onClose={() => setAgentMarketplaceOpen(false)} />
    </div>
  );
}

export default Dashboard;