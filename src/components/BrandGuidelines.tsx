import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { DashboardMockup } from './brand/DashboardMockup';
import { ChatDataDisplay } from './brand/ChatDataDisplay';
import { MobileMockup } from './brand/MobileMockup';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  Check, Copy, ArrowLeft, ArrowRight, ExternalLink,
  X, Loader2, Send, FileText, Play, Zap, TrendingUp, TrendingDown
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/71db4ddb4dff2b50b549faea40c66d8a85b2e660.png';
import appLogoImage from 'figma:asset/b714819a0e38cda4bc1635fd11f20a6e161f9173.png';
import badExampleImage from 'figma:asset/8eaae7920b746a4101228246f5cb6d2f706a9b3a.png';

// ─── Mock data ────────────────────────────────────────────────────
const revenueData = [
  { day: 'Mon', rev: 9400, pred: null },
  { day: 'Tue', rev: 11200, pred: null },
  { day: 'Wed', rev: 10800, pred: null },
  { day: 'Thu', rev: 13600, pred: null },
  { day: 'Fri', rev: 14200, pred: null },
  { day: 'Sat', rev: null, pred: 15100 },
  { day: 'Sun', rev: null, pred: 16400 },
];

const channelData = [
  { name: 'Meta',   roas: 4.2, spend: 3200 },
  { name: 'Google', roas: 3.1, spend: 1800 },
  { name: 'TikTok', roas: 2.8, spend: 900  },
  { name: 'Email',  roas: 8.2, spend: 280  },
  { name: 'SMS',    roas: 6.1, spend: 140  },
];

const merData = [
  { week: 'W1', mer: 2.9 }, { week: 'W2', mer: 3.1 },
  { week: 'W3', mer: 3.4 }, { week: 'W4', mer: 3.2 },
  { week: 'W5', mer: 3.6 }, { week: 'W6', mer: 3.7 },
];

const sparkData = [18, 24, 22, 28, 31, 27, 34, 38, 42, 39, 44, 48];

// ─── Colour tokens ────────────────────────────────────────────────
const COLORS = {
  cream:   { name: 'Cream',       hex: '#F9F8F4', usage: 'Page background, large surfaces' },
  black:   { name: 'Near-Black',  hex: '#1C1C1C', usage: 'Primary text, headings, CTA buttons' },
  blue:    { name: 'Sky Blue',    hex: '#5D9DF5', usage: 'Accent, links, highlights, indicators' },
  white:   { name: 'White',       hex: '#FFFFFF', usage: 'Card backgrounds, chat bubbles' },
  gray1:   { name: 'Body Gray',   hex: '#555555', usage: 'Secondary body copy' },
  gray2:   { name: 'Muted Gray',  hex: '#888888', usage: 'Labels, captions, dividers' },
  gray3:   { name: 'Border',      hex: '#E5E5E5', usage: 'Borders, separators' },
  blueDark:{ name: 'Deep Blue',   hex: '#1C4E80', usage: 'Action card text on blue tint bg' },
  blueTint:{ name: 'Blue Tint',   hex: '#D1E9FF', usage: 'Action bar background' },
  green:   { name: 'Success',     hex: '#2E7D32', usage: 'Confirmation states' },
  red:     { name: 'Alert',       hex: '#D32F2F', usage: 'Urgent flags, warnings' },
};

// ─── Copy hook ────────────────────────────────────────────────────
function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return { copied, copy };
}

// ─── Mini sparkline (SVG path) ────────────────────────────────────
function Sparkline({ data, color = '#5D9DF5', w = 80, h = 28 }: { data: number[]; color?: string; w?: number; h?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Recharts custom tooltip ──────────────────────────────────────
const KlairoTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 shadow-md">
      <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-[13px] font-semibold text-[#1C1C1C]">
          {p.name === 'roas' ? `${p.value}x ROAS` : p.name === 'mer' ? `${p.value}x MER` : `$${p.value?.toLocaleString()}`}
        </p>
      ))}
    </div>
  );
};

// ─── Metric card with sparkline ───────────────────────────────────
function MetricCard({ label, value, delta, positive, spark }: {
  label: string; value: string; delta: string; positive: boolean; spark: number[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-1">{label}</p>
          <p className="text-[22px] font-bold text-[#1C1C1C] leading-none">{value}</p>
        </div>
        <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${positive ? 'bg-green-50 text-[#2E7D32]' : 'bg-red-50 text-[#D32F2F]'}`}>
          {positive ? <TrendingUp size={11}/> : <TrendingDown size={11}/>} {delta}
        </span>
      </div>
      <Sparkline data={spark} color={positive ? '#5D9DF5' : '#D32F2F'} w={100} h={32}/>
    </div>
  );
}

// ─── Color swatch ─────────────────────────────────────────────────
function ColorSwatch({ color }: { color: { name: string; hex: string; usage: string } }) {
  const { copied, copy } = useCopy(color.hex);
  const isLight = ['#F9F8F4','#FFFFFF','#D1E9FF','#E5E5E5'].includes(color.hex);
  return (
    <div className="rounded-2xl overflow-hidden border border-[#E5E5E5] group cursor-pointer" onClick={copy}>
      <div className="h-28 w-full flex items-end p-3 relative transition-all group-hover:scale-[0.98]" style={{ background: color.hex }}>
        <button className={`opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm ${isLight ? 'bg-black/10 text-[#1C1C1C]' : 'bg-white/20 text-white'}`}>
          {copied ? <Check size={13} strokeWidth={3}/> : <Copy size={13}/>}
        </button>
      </div>
      <div className="bg-white p-4">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[13px] font-semibold text-[#1C1C1C]">{color.name}</span>
          <span className="font-mono text-[11px] text-[#888888]">{color.hex}</span>
        </div>
        <p className="text-[11px] text-[#888888] leading-relaxed">{color.usage}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-4">
      {children}
      <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5] shrink-0" />
    </div>
  );
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-20 border-b border-[#E5E5E5] scroll-mt-20">
      {children}
    </section>
  );
}

const NAV = [
  { id: 'logo',       label: 'Logo' },
  { id: 'colors',     label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'components', label: 'Components' },
  { id: 'charts',     label: 'Charts & Data' },
  { id: 'ads',        label: 'Ad Formats' },
  { id: 'dashboard',  label: 'Dashboard' },
  { id: 'mobile',     label: 'Mobile' },
  { id: 'voice',      label: 'Voice & Tone' },
  { id: 'motion',     label: 'Motion' },
  { id: 'dont',       label: "Do's & Don'ts" },
];

// ─── Ad mockup: 9:16 ─────────────────────────────────────────────
function Ad916({ variant }: { variant: 'dark' | 'cream' | 'blue' }) {
  if (variant === 'dark') return (
    <div className="w-full aspect-[9/16] bg-[#1C1C1C] rounded-2xl overflow-hidden flex flex-col p-6 relative select-none">
      {/* top label */}
      <div className="flex items-center gap-2 mb-auto">
        <div className="w-16">
          <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain invert brightness-200"/>
        </div>
      </div>
      {/* center content */}
      <div className="flex-1 flex flex-col justify-center">
        {/* mini chart */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <p className="text-[9px] font-bold tracking-widest text-white/40 uppercase mb-2">Revenue — Last 7 Days</p>
          <p className="font-serif text-white text-xl mb-3">$14,200 <span className="text-[#5D9DF5] text-[13px]">↑22%</span></p>
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="blueGrad916" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5D9DF5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#5D9DF5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="rev" stroke="#5D9DF5" fill="url(#blueGrad916)" strokeWidth={2} dot={false}/>
              <Area type="monotone" dataKey="pred" stroke="#5D9DF5" fill="none" strokeWidth={2} strokeDasharray="4 3" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <h2 className="font-serif text-white leading-[1.1] mb-4" style={{ fontSize: 'clamp(20px, 5vw, 28px)' }}>
          Finally, your<br/>business has<br/>a brain.
        </h2>
        <p className="text-white/50 text-[11px] leading-relaxed mb-6">
          Connect your tools. Ask anything. Klairo takes action.
        </p>
      </div>
      {/* CTA */}
      <button className="w-full bg-[#5D9DF5] text-white rounded-full py-3 text-[13px] font-bold flex items-center justify-center gap-2">
        Join the Waitlist <ArrowRight size={13}/>
      </button>
      <p className="text-[9px] text-white/20 text-center mt-3">klairo.ai</p>
    </div>
  );

  if (variant === 'cream') return (
    <div className="w-full aspect-[9/16] bg-[#F9F8F4] rounded-2xl overflow-hidden flex flex-col p-6 relative select-none border border-[#E5E5E5]">
      <div className="w-16 mb-auto">
        <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {/* Stat highlight */}
        <div className="mb-6">
          <p className="text-[9px] font-bold tracking-widest text-[#888888] uppercase mb-1">Meta Ads — Yesterday</p>
          <p className="font-serif text-[#1C1C1C] leading-none mb-1" style={{ fontSize: 'clamp(32px, 8vw, 48px)' }}>4.2x</p>
          <p className="text-[#5D9DF5] text-[11px] font-bold">ROAS on winning campaign</p>
        </div>
        {/* channel bar */}
        <div className="space-y-2 mb-8">
          {[
            { label: 'Meta', pct: 85, val: '4.2x' },
            { label: 'Email', pct: 65, val: '8.2x' },
            { label: 'Google', pct: 50, val: '3.1x' },
          ].map(ch => (
            <div key={ch.label}>
              <div className="flex justify-between text-[10px] font-bold text-[#888888] mb-1">
                <span>{ch.label}</span><span>{ch.val}</span>
              </div>
              <div className="h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                <div className="h-full bg-[#5D9DF5] rounded-full" style={{ width: `${ch.pct}%` }}/>
              </div>
            </div>
          ))}
        </div>
        <h2 className="font-serif text-[#1C1C1C] leading-[1.1] mb-3" style={{ fontSize: 'clamp(18px, 4.5vw, 24px)' }}>
          Know what to do,<br/>not just what happened.
        </h2>
        <p className="text-[#555555] text-[11px] leading-relaxed mb-6">
          Klairo surfaces every insight and tells you exactly what to do next.
        </p>
      </div>
      <button className="w-full bg-[#1C1C1C] text-white rounded-full py-3 text-[13px] font-bold">
        Try Klairo Free
      </button>
      <p className="text-[9px] text-[#888888] text-center mt-3">klairo.ai</p>
    </div>
  );

  // blue
  return (
    <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden flex flex-col p-6 relative select-none" style={{ background: 'linear-gradient(160deg, #1C4E80 0%, #5D9DF5 100%)' }}>
      <div className="w-16 mb-auto invert brightness-200">
        <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {/* action card mockup */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"/>
            <p className="text-[9px] font-bold tracking-widest text-white/60 uppercase">Klairo detected</p>
          </div>
          <p className="font-serif text-white text-[13px] leading-snug mb-1">"Blue Crewneck" went viral on TikTok</p>
          <p className="text-white/50 text-[10px]">84 orders · 8.4% CVR · no ad spend</p>
          <div className="mt-3 bg-white/10 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-white text-[10px] font-medium">Launch retargeting campaign</span>
            <div className="bg-white text-[#1C4E80] text-[9px] font-bold px-2 py-1 rounded-full">Do It</div>
          </div>
        </div>
        <h2 className="font-serif text-white leading-[1.1] mb-3" style={{ fontSize: 'clamp(20px, 5vw, 28px)' }}>
          Move faster<br/>than everyone<br/>else.
        </h2>
        <p className="text-white/60 text-[11px] leading-relaxed mb-6">
          Klairo spots opportunities and acts on them before you even open your laptop.
        </p>
      </div>
      <button className="w-full bg-white text-[#1C4E80] rounded-full py-3 text-[13px] font-bold">
        Get Early Access
      </button>
      <p className="text-[9px] text-white/30 text-center mt-3">klairo.ai</p>
    </div>
  );
}

// ─── Ad mockup: 1:1 ──────────────────────────────────────────────
function Ad1x1({ variant }: { variant: 'dark' | 'cream' | 'split' }) {
  if (variant === 'dark') return (
    <div className="w-full aspect-square bg-[#1C1C1C] rounded-2xl overflow-hidden p-6 flex flex-col relative select-none">
      <div className="w-14 mb-6">
        <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain invert brightness-200"/>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { l: 'Revenue', v: '$14,200', d: '+22%', up: true },
              { l: 'ROAS',    v: '4.2x',   d: '+18%', up: true },
              { l: 'MER',     v: '3.7x',   d: '+9%',  up: true },
              { l: 'CVR',     v: '4.1%',   d: '+1.2%',up: true },
            ].map(m => (
              <div key={m.l} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-[9px] font-bold tracking-widest text-white/40 uppercase mb-1">{m.l}</p>
                <p className="font-bold text-white" style={{ fontSize: '14px' }}>{m.v}</p>
                <p className="text-[#5D9DF5] text-[9px] font-bold mt-0.5">{m.d}</p>
              </div>
            ))}
          </div>
          <h2 className="font-serif text-white leading-[1.15]" style={{ fontSize: 'clamp(16px, 4vw, 22px)' }}>
            Your business, fully in focus.
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white/40 text-[10px]">klairo.ai</p>
          <button className="bg-[#5D9DF5] text-white text-[11px] font-bold px-4 py-2 rounded-full">
            Join Waitlist →
          </button>
        </div>
      </div>
    </div>
  );

  if (variant === 'cream') return (
    <div className="w-full aspect-square bg-[#F9F8F4] rounded-2xl overflow-hidden p-6 flex flex-col relative select-none border border-[#E5E5E5]">
      <div className="w-14 mb-4">
        <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[9px] font-bold tracking-widest text-[#888888] uppercase mb-2">This morning, Klairo noticed:</p>
          {[
            { icon: '⚡', text: 'Meta budget auto-scaled to $500/day' },
            { icon: '📦', text: 'Restock PO drafted — arrives with 2-day buffer' },
            { icon: '✉️', text: '2 new Klaviyo emails queued for your spike' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[#E5E5E5] last:border-0">
              <span style={{ fontSize: '12px' }}>{item.icon}</span>
              <p className="text-[12px] text-[#1C1C1C] leading-snug">{item.text}</p>
              <Check size={11} className="text-[#2E7D32] ml-auto shrink-0 mt-0.5" strokeWidth={3}/>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <h2 className="font-serif text-[#1C1C1C] leading-snug" style={{ fontSize: 'clamp(13px, 3vw, 16px)' }}>
            While you<br/>were sleeping.
          </h2>
          <button className="bg-[#1C1C1C] text-white text-[11px] font-bold px-4 py-2 rounded-full">
            Try Klairo →
          </button>
        </div>
      </div>
    </div>
  );

  // split
  return (
    <div className="w-full aspect-square rounded-2xl overflow-hidden flex relative select-none border border-[#E5E5E5]">
      {/* Left half */}
      <div className="w-1/2 bg-[#1C1C1C] p-5 flex flex-col justify-between">
        <div className="w-12">
          <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain invert brightness-200"/>
        </div>
        <div>
          <p className="text-[9px] font-bold tracking-widest text-white/40 uppercase mb-1">Before Klairo</p>
          <p className="font-serif text-white leading-snug mb-2" style={{ fontSize: 'clamp(12px, 2.5vw, 15px)' }}>2 hours of dashboards. Still no answers.</p>
          <div className="space-y-1">
            {['Shopify', 'Meta Ads', 'Klaviyo', 'ShipBob'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"/>
                <span className="text-[9px] text-white/40">{t}: open tab</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right half */}
      <div className="w-1/2 bg-[#F9F8F4] p-5 flex flex-col justify-between">
        <div className="flex justify-end">
          <span className="text-[9px] font-bold tracking-widest text-[#5D9DF5] uppercase">With Klairo</span>
        </div>
        <div>
          <p className="font-serif text-[#1C1C1C] leading-snug mb-3" style={{ fontSize: 'clamp(12px, 2.5vw, 15px)' }}>10 seconds. Every answer. Actions taken.</p>
          <div className="space-y-1.5">
            {[
              { t: 'Revenue up 22%', c: true },
              { t: 'Budget scaled ✓', c: true },
              { t: 'PO approved ✓',  c: true },
              { t: 'Emails queued ✓',c: true },
            ].map(item => (
              <div key={item.t} className="flex items-center gap-1.5">
                <Check size={9} className="text-[#2E7D32]" strokeWidth={3}/>
                <span className="text-[9px] text-[#1C1C1C] font-medium">{item.t}</span>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full bg-[#1C1C1C] text-white text-[10px] font-bold py-2 rounded-full">
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export function BrandGuidelines() {
  const [active, setActive] = useState('logo');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    NAV.forEach(n => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F8F4] font-sans text-[#1C1C1C]">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F8F4]/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1.5 text-[13px] text-[#555555] hover:text-[#1C1C1C] transition-colors">
              <ArrowLeft size={14}/> Back to site
            </Link>
            <span className="text-[#E5E5E5]">/</span>
            <span className="text-[13px] font-semibold text-[#1C1C1C]">Brand Guidelines</span>
          </div>
          <div className="w-20">
            <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/>
          </div>
          <span className="text-[11px] font-bold tracking-widest text-[#888888] uppercase hidden md:block">v1.0 — Feb 2026</span>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-14 flex gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0 pt-12 sticky top-14 h-[calc(100vh-3.5rem)] overflow-auto">
          <nav className="space-y-0.5">
            {NAV.map(n => (
              <a key={n.id} href={`#${n.id}`}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                  active === n.id ? 'bg-[#1C1C1C] text-white font-semibold' : 'text-[#555555] hover:text-[#1C1C1C] hover:bg-[#EFEFEB]'
                }`}>
                {active === n.id && <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5] shrink-0"/>}
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-10 p-4 rounded-2xl bg-white border border-[#E5E5E5]">
            <p className="text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-2">Questions?</p>
            <p className="text-[12px] text-[#555555] leading-relaxed">Reach out to the brand team before using Klairo assets externally.</p>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 pt-10 pb-32">

          {/* Intro */}
          <div className="mb-16">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-5">
              Klairo Brand <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5] shrink-0"/>
            </div>
            <h1 className="font-serif text-[40px] md:text-[56px] text-[#1C1C1C] leading-[1.1] mb-6 tracking-tight">
              How Klairo<br/>looks and sounds.
            </h1>
            <p className="text-[17px] text-[#555555] leading-relaxed max-w-2xl">
              This document is the single source of truth for Klairo's visual identity and brand voice. Use it to stay consistent across every touchpoint — product, marketing, partnerships, and beyond.
            </p>
          </div>

          {/* ══ LOGO ══ */}
          <Section id="logo">
            <SectionLabel>01 — Logo</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">The Klairo wordmark.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-12">
              The Klairo logo is a custom-set wordmark. Never recreate it with a system font. Always use the approved asset files.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="rounded-2xl bg-[#F9F8F4] border border-[#E5E5E5] p-10 flex flex-col items-center justify-center gap-6">
                <div className="w-40"><ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/></div>
                <span className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">On Cream — Primary</span>
              </div>
              <div className="rounded-2xl bg-[#1C1C1C] border border-[#1C1C1C] p-10 flex flex-col items-center justify-center gap-6">
                <div className="w-40 invert brightness-200"><ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/></div>
                <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">On Black — Inverted</span>
              </div>
            </div>
            <div className="mt-10 bg-white rounded-2xl border border-[#E5E5E5] p-8">
              <h3 className="font-semibold text-[#1C1C1C] mb-6">Clear space & minimum size</h3>
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-1">
                  <div className="relative inline-flex items-center justify-center p-10 border border-dashed border-[#5D9DF5]/50 rounded-xl bg-[#F9F8F4]">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#5D9DF5]">x</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#5D9DF5]">x</div>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#5D9DF5]">x</div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#5D9DF5]">x</div>
                    <div className="w-28"><ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/></div>
                  </div>
                  <p className="text-[12px] text-[#888888] mt-3">Maintain clearspace equal to the cap-height of the "K" on all sides.</p>
                </div>
                <div className="flex-1 space-y-4">
                  {[
                    { label: 'Digital minimum', value: '80px wide' },
                    { label: 'Print minimum',   value: '25mm wide' },
                    { label: 'Favicon',         value: 'Use the "K" mark only' },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between py-3 border-b border-[#F0F0F0]">
                      <span className="text-[13px] text-[#555555]">{r.label}</span>
                      <span className="text-[13px] font-semibold text-[#1C1C1C]">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Don't stretch or distort",    style: { transform: 'scaleX(1.4)', transformOrigin: 'center' } },
                { label: "Don't use on busy imagery",   bg: 'bg-gradient-to-br from-blue-300 to-purple-400' },
                { label: "Don't recolor the wordmark",  tint: true },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-red-100 overflow-hidden">
                  <div className={`h-20 flex items-center justify-center ${item.bg || 'bg-[#FFF5F5]'}`}>
                    <div style={item.style || {}}>
                      <ImageWithFallback src={logoImage} alt="Klairo" className={`w-20 h-auto object-contain ${item.tint ? 'hue-rotate-180 saturate-200' : ''}`}/>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-2.5 flex items-center gap-2">
                    <X size={12} className="text-[#D32F2F] shrink-0"/><span className="text-[12px] text-[#555555]">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── App Logo: Light & Dark ── */}
            <div className="mt-16">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-4">
                App Logo
              </div>
              <h3 className="font-serif text-2xl text-[#1C1C1C] mb-3">Light &amp; dark versions.</h3>
              <p className="text-[#555555] max-w-2xl leading-relaxed mb-8">
                Two approved logo treatments — light and dark. Use each version only on its corresponding surface. Never swap them or apply either to an unapproved background.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#F9F8F4] border border-[#E5E5E5] flex flex-col items-center justify-center gap-10 py-20 px-10">
                  <ImageWithFallback src={appLogoImage} alt="Klairo" className="w-44 h-auto object-contain" />
                  <span className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">Light — On Cream</span>
                </div>
                <div className="rounded-2xl bg-[#1C1C1C] border border-[#1C1C1C] flex flex-col items-center justify-center gap-10 py-20 px-10">
                  <div className="invert brightness-200">
                    <ImageWithFallback src={appLogoImage} alt="Klairo" className="w-44 h-auto object-contain" />
                  </div>
                  <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Dark — On Black</span>
                </div>
              </div>
            </div>
          </Section>

          {/* ══ COLORS ══ */}
          <Section id="colors">
            <SectionLabel>02 — Colors</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">Color palette.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-12">
              Klairo's palette is rooted in warmth and clarity. Cream creates an intelligent, editorial feel. Sky Blue is used sparingly as a live signal of intelligence and action.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.values(COLORS).map(c => <ColorSwatch key={c.hex} color={c}/>)}
            </div>
            <div className="mt-12">
              <h3 className="font-semibold text-[#1C1C1C] mb-6">Approved combinations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { bg: '#F9F8F4', text: '#1C1C1C', label: 'Primary — Cream + Black',      ratio: '14.4:1' },
                  { bg: '#1C1C1C', text: '#FFFFFF', label: 'Inverted — Black + White',     ratio: '21:1'   },
                  { bg: '#FFFFFF', text: '#1C1C1C', label: 'Card — White + Black',         ratio: '18.1:1' },
                  { bg: '#5D9DF5', text: '#FFFFFF', label: 'Accent — Blue + White',        ratio: '3.5:1'  },
                  { bg: '#D1E9FF', text: '#1C4E80', label: 'Tint — Blue tint + Deep blue', ratio: '7.2:1'  },
                  { bg: '#1C1C1C', text: '#5D9DF5', label: 'Dark — Black + Sky Blue',      ratio: '5.8:1'  },
                ].map(combo => (
                  <div key={combo.label} className="rounded-xl overflow-hidden border border-[#E5E5E5]">
                    <div className="h-16 px-4 flex items-center" style={{ background: combo.bg }}>
                      <span className="text-sm font-bold" style={{ color: combo.text }}>Klairo</span>
                    </div>
                    <div className="bg-white px-4 py-3">
                      <p className="text-[12px] font-medium text-[#1C1C1C] mb-0.5">{combo.label}</p>
                      <p className="text-[11px] text-[#888888]">Contrast {combo.ratio} ✓</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ══ TYPOGRAPHY ══ */}
          <Section id="typography">
            <SectionLabel>03 — Typography</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">Type system.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-12">Two typefaces. One for editorial gravitas, one for clarity and efficiency.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-1">Heading typeface</p>
                    <p className="text-[13px] font-semibold text-[#1C1C1C]">Merriweather</p>
                  </div>
                  <a href="https://fonts.google.com/specimen/Merriweather" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-[#5D9DF5] hover:underline">Google Fonts <ExternalLink size={10}/></a>
                </div>
                <div className="font-serif space-y-4">
                  <div><p className="text-[48px] text-[#1C1C1C] leading-none mb-1">Aa</p><p className="text-[11px] text-[#888888]">Regular 400</p></div>
                  <div><p className="text-[48px] text-[#1C1C1C] font-bold leading-none mb-1">Aa</p><p className="text-[11px] text-[#888888]">Bold 700</p></div>
                  <div><p className="text-[48px] text-[#1C1C1C] italic leading-none mb-1">Aa</p><p className="text-[11px] text-[#888888]">Italic 400</p></div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#F0F0F0]">
                  <p className="font-serif text-[13px] text-[#555555] leading-relaxed italic">"Finally, your business has a brain."</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-1">Body typeface</p>
                    <p className="text-[13px] font-semibold text-[#1C1C1C]">Inter</p>
                  </div>
                  <a href="https://fonts.google.com/specimen/Inter" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-[#5D9DF5] hover:underline">Google Fonts <ExternalLink size={10}/></a>
                </div>
                <div className="font-sans space-y-4">
                  <div><p className="text-[48px] text-[#1C1C1C] font-light leading-none mb-1">Aa</p><p className="text-[11px] text-[#888888]">Light 300</p></div>
                  <div><p className="text-[48px] text-[#1C1C1C] leading-none mb-1">Aa</p><p className="text-[11px] text-[#888888]">Regular 400</p></div>
                  <div><p className="text-[48px] text-[#1C1C1C] font-semibold leading-none mb-1">Aa</p><p className="text-[11px] text-[#888888]">Semibold 600</p></div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#F0F0F0]">
                  <p className="text-[13px] text-[#555555] leading-relaxed">Klairo connects your tools, makes sense of the data, and takes action to grow your business.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
              <div className="px-8 py-5 border-b border-[#F0F0F0]"><h3 className="font-semibold text-[#1C1C1C]">Type scale</h3></div>
              <div className="divide-y divide-[#F0F0F0]">
                {[
                  { role: 'Display',  font: 'Merriweather', size: '56px', weight: 400, lh: '1.1',  eg: 'Finally, your business has a brain.' },
                  { role: 'H1',       font: 'Merriweather', size: '40px', weight: 400, lh: '1.1',  eg: 'Your business can now move at the speed of AI.' },
                  { role: 'H2',       font: 'Merriweather', size: '32px', weight: 400, lh: '1.1',  eg: 'The Connected Brain.' },
                  { role: 'H3',       font: 'Merriweather', size: '24px', weight: 700, lh: '1.2',  eg: 'Creative Fatigue Alert' },
                  { role: 'Body Lg',  font: 'Inter',        size: '18px', weight: 400, lh: '1.7',  eg: 'Connect your stack. Ask any question.' },
                  { role: 'Body',     font: 'Inter',        size: '16px', weight: 400, lh: '1.6',  eg: 'Klairo connects your tools and makes sense of the data.' },
                  { role: 'Body Sm',  font: 'Inter',        size: '14px', weight: 400, lh: '1.6',  eg: 'Budget updated to $500/day.' },
                  { role: 'Caption',  font: 'Inter',        size: '12px', weight: 400, lh: '1.5',  eg: 'On winning campaign' },
                  { role: 'Label',    font: 'Inter',        size: '11px', weight: 700, lh: '1',    eg: 'META ADS — UPPERCASE TRACKING-WIDEST' },
                ].map(t => (
                  <div key={t.role} className="px-8 py-5 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <div className="w-20 shrink-0"><span className="text-[11px] font-bold tracking-wider text-[#888888] uppercase">{t.role}</span></div>
                    <div className="w-28 shrink-0 hidden md:block"><span className="text-[11px] text-[#888888]">{t.font}</span></div>
                    <div className="w-14 shrink-0 hidden md:block"><span className="font-mono text-[11px] text-[#888888]">{t.size}</span></div>
                    <div className={`flex-1 ${t.font === 'Merriweather' ? 'font-serif' : 'font-sans'} text-[#1C1C1C] truncate`}
                         style={{ fontSize: ['56px','40px'].includes(t.size) ? '24px' : t.size === '32px' ? '20px' : t.size, lineHeight: t.lh, fontWeight: t.weight }}>
                      {t.eg}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ══ COMPONENTS ══ */}
          <Section id="components">
            <SectionLabel>04 — Components</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">UI components.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-12">A minimal, purposeful set. Each component has a single job. Don't over-decorate.</p>
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 mb-6">
              <h3 className="font-semibold text-[#1C1C1C] mb-6">Buttons</h3>
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="bg-[#1C1C1C] text-white px-6 py-3 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-sm">Join the Waitlist</button>
                <button className="bg-[#1C1C1C] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-1.5">Do it <ArrowRight size={14}/></button>
                <button className="border border-[#1C1C1C] text-[#1C1C1C] px-5 py-2.5 rounded-full text-sm font-medium">Learn more</button>
                <button className="text-sm font-medium text-[#1C1C1C] hover:text-[#555555] transition-colors px-4 py-2">Log in</button>
                <button className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F9F8F4] rounded-lg text-sm font-medium text-[#1C1C1C] border border-[#E5E5E5]"><FileText size={14}/> Review</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 mb-6">
              <h3 className="font-semibold text-[#1C1C1C] mb-6">Status indicators</h3>
              <div className="flex flex-wrap gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2E7D32] flex items-center justify-center text-white"><Check size={12} strokeWidth={3}/></div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#D1E9FF]/40 rounded-full border border-[#D1E9FF]"><Loader2 size={12} className="text-[#5D9DF5] animate-spin"/><span className="text-xs font-medium text-[#1C4E80]">Processing…</span></div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-full border border-red-100"><span className="text-[10px] font-bold text-[#D32F2F] uppercase tracking-wide">Urgent · Stock out in 6 days</span></div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full border border-green-100"><span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wide">Done</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8">
              <h3 className="font-semibold text-[#1C1C1C] mb-4">Chat elements</h3>
              <div className="space-y-4 max-w-md">
                <div className="flex justify-end"><div className="bg-[#1C1C1C] text-white px-5 py-3 rounded-2xl rounded-tr-sm text-sm font-medium shadow-sm max-w-[80%]">How were sales yesterday?</div></div>
                <div className="flex justify-start"><div className="bg-[#F9F8F4] border border-[#F0F0F0] px-5 py-3 rounded-2xl rounded-tl-sm text-sm text-[#555555] max-w-[80%]">Revenue was <strong className="text-[#1C1C1C]">$14,200</strong> — up 22%. Let me show you what drove it.</div></div>
              </div>
            </div>
          </Section>

          {/* ══ CHARTS & DATA VIZ ══ */}
          <Section id="charts">
            <SectionLabel>05 — Charts & Data Viz</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">Data visualisation.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-12">
              Klairo's charts are calm, editorial, and immediately legible. Sky Blue is the primary data ink. Dashed lines signal predicted/AI-generated values. Gridlines are barely-there — they guide without competing.
            </p>

            {/* Metric cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <MetricCard label="Revenue" value="$14,200" delta="+22%" positive spark={[80,95,91,110,88,104,114,120,118,130,126,142]}/>
              <MetricCard label="ROAS" value="4.2x" delta="+0.8x" positive spark={[28,30,27,32,31,36,33,38,40,37,41,42]}/>
              <MetricCard label="MER" value="3.7x" delta="+0.5x" positive spark={[26,28,29,30,28,32,31,34,35,33,36,37]}/>
              <MetricCard label="CVR" value="4.1%" delta="-0.3%" positive={false} spark={[48,45,46,44,47,43,45,42,44,41,43,41]}/>
            </div>

            {/* Revenue area chart */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-1">Revenue</p>
                  <p className="font-serif text-[#1C1C1C] text-2xl font-bold">$14,200 <span className="text-[#5D9DF5] text-base font-normal">↑ 22% vs last week</span></p>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-[#888888]">
                  <span className="flex items-center gap-1.5"><span className="inline-block w-5 h-0.5 bg-[#5D9DF5] rounded"/>&nbsp;Actual</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block w-5 border-t-2 border-dashed border-[#5D9DF5]/50 rounded"/>&nbsp;Forecast</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#5D9DF5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#5D9DF5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#5D9DF5" stopOpacity={0.07}/>
                      <stop offset="95%" stopColor="#5D9DF5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false}/>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#888888', fontFamily: 'Inter' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: '#888888', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={36}/>
                  <Tooltip content={<KlairoTooltip/>}/>
                  <ReferenceLine x="Fri" stroke="#5D9DF5" strokeDasharray="4 3" strokeWidth={1} label={{ value: 'Today', position: 'top', fontSize: 10, fill: '#5D9DF5', fontFamily: 'Inter' }}/>
                  <Area type="monotone" dataKey="rev"  name="rev"  stroke="#5D9DF5" fill="url(#revGrad)"  strokeWidth={2.5} dot={false} connectNulls={false}/>
                  <Area type="monotone" dataKey="pred" name="pred" stroke="#5D9DF5" fill="url(#predGrad)" strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls={false}/>
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-5 pt-5 border-t border-[#F0F0F0] grid grid-cols-3 gap-4">
                {[
                  { l: 'Chart color', v: 'Sky Blue #5D9DF5' },
                  { l: 'Forecast style', v: 'Dashed + lower opacity' },
                  { l: 'Grid', v: '1px #F0F0F0, horizontal only' },
                ].map(r => (
                  <div key={r.l}>
                    <p className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-1">{r.l}</p>
                    <p className="text-[12px] text-[#1C1C1C]">{r.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-col: ROAS bar + MER line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* ROAS by channel */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                <p className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-1">ROAS by Channel</p>
                <p className="font-serif text-[#1C1C1C] text-xl font-bold mb-5">Email leads at 8.2x</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={channelData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false}/>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888888', fontFamily: 'Inter' }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize: 11, fill: '#888888', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}x`} width={28}/>
                    <Tooltip content={<KlairoTooltip/>}/>
                    <ReferenceLine y={3} stroke="#E5E5E5" strokeDasharray="4 3" label={{ value: 'Target 3x', position: 'right', fontSize: 10, fill: '#888888', fontFamily: 'Inter' }}/>
                    <Bar dataKey="roas" name="roas" fill="#5D9DF5" radius={[6, 6, 0, 0]}
                      label={{ position: 'top', fontSize: 10, fill: '#888888', fontFamily: 'Inter', formatter: (v: number) => `${v}x` }}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* MER trend */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                <p className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-1">MER — 6 Week Trend</p>
                <p className="font-serif text-[#1C1C1C] text-xl font-bold mb-5">Efficiency improving <span className="text-[#5D9DF5] text-base font-normal">+0.8x</span></p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={merData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false}/>
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#888888', fontFamily: 'Inter' }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize: 11, fill: '#888888', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}x`} width={28} domain={[2.5, 4]}/>
                    <Tooltip content={<KlairoTooltip/>}/>
                    <Line type="monotone" dataKey="mer" name="mer" stroke="#5D9DF5" strokeWidth={2.5}
                      dot={{ fill: '#5D9DF5', r: 4, strokeWidth: 0 }}
                      activeDot={{ fill: '#5D9DF5', r: 6, stroke: '#D1E9FF', strokeWidth: 3 }}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart rules callout */}
            <div className="bg-[#1C1C1C] rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase mb-5">Chart design rules</p>
                <ul className="space-y-3">
                  {[
                    'Primary data ink: Sky Blue #5D9DF5 always',
                    'Dashed line = AI forecast / predicted value',
                    'Grid: horizontal only, #F0F0F0, 1px weight',
                    'Axis labels: Inter 11px, #888888, no axis lines',
                    'Tooltips: white card, rounded-xl, no heavy shadow',
                    'Reference lines: subtle, #E5E5E5, always labeled',
                    'Bar radius: 6px top corners only',
                    'Area gradient: 15% → 0% opacity, blue to transparent',
                  ].map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5] shrink-0 mt-1.5"/>
                      <span className="text-[13px] text-white/60">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase mb-5">What to avoid</p>
                <ul className="space-y-3">
                  {[
                    'Multiple competing colors — Sky Blue only',
                    'Pie charts (use bars or a stat card instead)',
                    'Vertical grid lines — they add noise',
                    '3D or skeuomorphic chart styles',
                    'Cluttered legends when a label works',
                    'Rounded corners on bars less than 12px wide',
                    'Small multiples without enough breathing room',
                    'Raw timestamps on X axis — always humanize (Mon, Tue…)',
                  ].map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <X size={13} className="text-[#D32F2F] shrink-0 mt-0.5"/>
                      <span className="text-[13px] text-white/60">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* ══ AD FORMATS ══ */}
          <Section id="ads">
            <SectionLabel>06 — Ad Formats</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">Ad creative system.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-12">
              Every Klairo ad should feel like it belongs in the product — not outside it. Use real data, real actions, and real outcomes. Three creative territories: <strong className="text-[#1C1C1C]">Dark/Product</strong>, <strong className="text-[#1C1C1C]">Cream/Editorial</strong>, and <strong className="text-[#1C1C1C]">Blue/Gradient</strong>.
            </p>

            {/* Format rule callout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                { fmt: '9:16',   px: '1080 × 1920px', use: 'Instagram Stories, Reels, TikTok', safe: '250px top & bottom safe zone' },
                { fmt: '1:1',    px: '1080 × 1080px', use: 'Instagram Feed, Facebook Feed',    safe: '80px all edges safe zone'     },
                { fmt: '1.91:1', px: '1200 × 628px',  use: 'Facebook/Google banner ads',       safe: '50px all edges safe zone'     },
              ].map(f => (
                <div key={f.fmt} className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
                  <p className="font-serif text-[#1C1C1C] text-2xl mb-1">{f.fmt}</p>
                  <p className="font-mono text-[11px] text-[#5D9DF5] mb-3">{f.px}</p>
                  <p className="text-[12px] text-[#555555] mb-2">{f.use}</p>
                  <p className="text-[11px] text-[#888888]">Safe zone: {f.safe}</p>
                </div>
              ))}
            </div>

            {/* 9:16 previews */}
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[#E5E5E5]"/>
                <span className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">9:16 — Stories / Reels / TikTok</span>
                <div className="h-px flex-1 bg-[#E5E5E5]"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-3 text-center">Dark / Product</p>
                  <Ad916 variant="dark"/>
                  <p className="text-[11px] text-[#888888] mt-3 text-center">Best for: retargeting, product demos</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-3 text-center">Cream / Editorial</p>
                  <Ad916 variant="cream"/>
                  <p className="text-[11px] text-[#888888] mt-3 text-center">Best for: top-of-funnel awareness</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-3 text-center">Blue / Gradient</p>
                  <Ad916 variant="blue"/>
                  <p className="text-[11px] text-[#888888] mt-3 text-center">Best for: high-energy launch moments</p>
                </div>
              </div>
            </div>

            {/* 1:1 previews */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[#E5E5E5]"/>
                <span className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">1:1 — Feed / Square</span>
                <div className="h-px flex-1 bg-[#E5E5E5]"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-3 text-center">Metrics Grid</p>
                  <Ad1x1 variant="dark"/>
                  <p className="text-[11px] text-[#888888] mt-3 text-center">Best for: performance marketers, retargeting</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-3 text-center">Action Log</p>
                  <Ad1x1 variant="cream"/>
                  <p className="text-[11px] text-[#888888] mt-3 text-center">Best for: founder audiences, cold traffic</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase mb-3 text-center">Before / After Split</p>
                  <Ad1x1 variant="split"/>
                  <p className="text-[11px] text-[#888888] mt-3 text-center">Best for: competitive conquesting</p>
                </div>
              </div>
            </div>

            {/* Ad copy rules */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
              <div className="px-8 py-5 border-b border-[#F0F0F0]"><h3 className="font-semibold text-[#1C1C1C]">Ad copy principles</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#F0F0F0]">
                <div className="p-8 space-y-4">
                  <p className="text-[11px] font-bold tracking-widest text-[#2E7D32] uppercase mb-4">Headline formulas that work</p>
                  {[
                    '"Finally, [outcome you\'ve always wanted]."',
                    '"[Real number] — [what drove it]."',
                    '"While you were sleeping, Klairo [action]."',
                    '"A 10-second question shouldn\'t take 20 minutes."',
                    '"[Platform] saw [result]. Klairo caught it."',
                  ].map((h, i) => (
                    <p key={i} className="font-serif text-[13px] text-[#1C1C1C] italic border-l-2 border-[#5D9DF5] pl-3">{h}</p>
                  ))}
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-[11px] font-bold tracking-widest text-[#D32F2F] uppercase mb-4">Always avoid</p>
                  {[
                    '"AI-powered business intelligence platform"',
                    '"Leverage your data at scale"',
                    '"Unlock actionable insights"',
                    '"Seamlessly integrate your tech stack"',
                    '"Drive growth with data-driven decisions"',
                  ].map((h, i) => (
                    <p key={i} className="text-[13px] text-[#888888] line-through border-l-2 border-[#D32F2F]/30 pl-3">{h}</p>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ══ DASHBOARD ══ */}
          <Section id="dashboard">
            <SectionLabel>07 — Dashboard</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">Dashboard with chat open.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-10">
              Two distinct main-canvas states live behind the same sidebar. <strong className="text-[#1C1C1C]">New Chat</strong> is a clean, open space — centered heading, a prominent input, platform badges, and quick-prompt chips. <strong className="text-[#1C1C1C]">Daily Brief</strong> compresses data into compact, scannable tiles and pins a chat bar to the bottom. Toggle between both views in the mockup below.
            </p>

            {/* Full mockup */}
            <DashboardMockup />

            {/* Anatomy grid */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Sidebar */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-7">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#5D9DF5]" />
                  <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">Sidebar</p>
                </div>
                <p className="text-[11px] text-[#888888] mb-5 leading-relaxed">Persistent across all views. Never scrolls. Hierarchy: most-used at top, least-used at bottom.</p>
                <ul className="space-y-3">
                  {[
                    { item: 'Logo',           note: '64px wide, top-left, always links home' },
                    { item: '+ New Chat',     note: 'Full-width black pill — primary affordance' },
                    { item: 'Daily Brief',    note: 'Active: Sky Blue bg tint + indicator dot' },
                    { item: 'Team Feed',      note: 'Shared workspace activity stream' },
                    { item: 'Reports',        note: 'Saved, scheduled & archived views' },
                    { item: 'Agents',         note: 'Collapsible ��� icon + platform name' },
                    { item: 'Recent Chats',   note: 'Last 4, 1-line truncation, relative time' },
                    { item: 'Account Access', note: 'Team, roles, billing — bottom section' },
                    { item: 'Settings',       note: 'Config, API keys, notifications' },
                    { item: 'User row',       note: 'Avatar initial (Sky Blue) + name + email' },
                  ].map(r => (
                    <li key={r.item} className="flex items-start gap-2.5">
                      <span className="text-[12px] font-semibold text-[#1C1C1C] w-28 shrink-0">{r.item}</span>
                      <span className="text-[11px] text-[#555555] leading-relaxed">{r.note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Chat view */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-7">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#5D9DF5]" />
                  <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">New Chat view</p>
                </div>
                <p className="text-[11px] text-[#888888] mb-5 leading-relaxed">Default on load. Open, generous space. Nothing competes with the input.</p>
                <ul className="space-y-3">
                  {[
                    { item: 'Background',     note: '#FDFCF8 + faint dot-grid overlay at 2.5% opacity' },
                    { item: 'Logo mark',      note: 'Small, 64px, centered, 70% opacity — supporting role' },
                    { item: 'Heading',        note: 'Merriweather 24px: "Ask Klairo anything."' },
                    { item: 'Subheading',     note: 'Inter 12px muted — one grounding line of context' },
                    { item: 'Input card',     note: 'White, rounded-2xl, shadow-sm. Two internal zones.' },
                    { item: 'Input zone',     note: 'Min 52px height, placeholder #BBBBBB' },
                    { item: 'Bottom bar',     note: 'Platform badges + arrow send. Hairline divider.' },
                    { item: 'Platform badges',note: 'Coloured dot + 8px label + green check. Connected only.' },
                    { item: 'Quick prompts',  note: 'Pill chips — hover reveals Sky Blue chevron icon' },
                    { item: 'Tools note',     note: 'Quiet separator: "6 platforms connected"' },
                  ].map(r => (
                    <li key={r.item} className="flex items-start gap-2.5">
                      <span className="text-[12px] font-semibold text-[#1C1C1C] w-28 shrink-0">{r.item}</span>
                      <span className="text-[11px] text-[#555555] leading-relaxed">{r.note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Daily Brief view */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-7">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#5D9DF5]" />
                  <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">Daily Brief view</p>
                </div>
                <p className="text-[11px] text-[#888888] mb-5 leading-relaxed">Data-dense but scannable. Follows brand component spec — compact tiles, not spacious cards.</p>
                <ul className="space-y-3">
                  {[
                    { item: 'Top bar',        note: '"Daily Brief" Merriweather 13px + right-aligned date' },
                    { item: 'Greeting',       note: 'Merriweather 17px + 2px Sky Blue underline accent' },
                    { item: 'Subtitle',       note: 'Inter 11px muted — AI-generated 1-sentence summary' },
                    { item: 'Metric row',     note: 'Single white card with 4-col divider grid — not 4 cards' },
                    { item: 'Metric cell',    note: '9px label / 14px value / 8px delta + 40×14px sparkline' },
                    { item: 'Sparkline',      note: 'Sky Blue = positive, Red = negative. 12 pts.' },
                    { item: 'Area chart',     note: '72px tall. Solid actual + dashed AI forecast.' },
                    { item: 'What Changed',   note: 'Zap icon + single AI narrative sentence' },
                    { item: 'Action list',    note: 'Compact rows — coloured dot + text + "Do It" pill' },
                    { item: 'Bottom chat bar',note: 'Fixed. Blur bg + platform avatar row + arrow send.' },
                  ].map(r => (
                    <li key={r.item} className="flex items-start gap-2.5">
                      <span className="text-[12px] font-semibold text-[#1C1C1C] w-28 shrink-0">{r.item}</span>
                      <span className="text-[11px] text-[#555555] leading-relaxed">{r.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Layout dimensions */}
            <div className="mt-6 bg-[#1C1C1C] rounded-2xl p-8">
              <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase mb-6">Layout specs</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Sidebar width',     value: '220px', note: 'Fixed, never collapses on desktop' },
                  { label: 'Chat panel',         value: '280px', note: 'Fixed right, opens alongside main' },
                  { label: 'Min content width',  value: '400px', note: 'Main area when chat is open' },
                  { label: 'Top bar height',     value: '40px',  note: 'Shared across sidebar + main' },
                  { label: 'Sidebar item height',value: '30px',  note: '10px padding top/bottom, icon 14px' },
                  { label: 'Metric card',        value: '96px',  note: '12px padding, 2×2 grid with gap-2.5' },
                  { label: 'User avatar',        value: '24px',  note: 'Initials, Sky Blue background' },
                  { label: 'Chat input',         value: '40px',  note: 'Fixed to bottom of chat panel' },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-4">
                    <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">{s.label}</p>
                    <p className="font-mono text-[16px] font-bold text-white mb-1">{s.value}</p>
                    <p className="text-[10px] text-white/40 leading-relaxed">{s.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* States */}
            <div className="mt-6 bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
              <div className="px-8 py-5 border-b border-[#F0F0F0]">
                <h3 className="font-semibold text-[#1C1C1C]">Chat panel states</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#F0F0F0]">
                {[
                  { state: 'Closed',      bg: '#F9F8F4',  desc: 'Main content fills full width. No panel visible. Chat icon in top-right or sidebar to open.' },
                  { state: 'Loading',     bg: '#EEF4FF',  desc: 'Typing dots animation. 3 bouncing #888888 circles. Klairo avatar shown with Zap icon.' },
                  { state: 'Responding',  bg: '#FDFBF7',  desc: 'Insight card fades in (opacity 0→1, y +10→0, 0.5s easeOut). Stats row follows 0.15s later.' },
                  { state: 'Actioning',   bg: '#D1E9FF',  desc: 'Blue tint bar: proposal → spinner → ✓ check. Each state is a 200ms crossfade.' },
                ].map(s => (
                  <div key={s.state} className="p-6">
                    <div className="w-8 h-8 rounded-lg mb-3" style={{ background: s.bg, border: '1px solid #E5E5E5' }} />
                    <p className="text-[12px] font-semibold text-[#1C1C1C] mb-2">{s.state}</p>
                    <p className="text-[11px] text-[#555555] leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat data display */}
            <div className="mt-10">
              <div className="mb-8">
                <h3 className="font-serif text-2xl text-[#1C1C1C] mb-3">How data renders in chat.</h3>
                <p className="text-[#555555] text-sm leading-relaxed max-w-2xl">
                  Every Klairo response that contains data uses a structured card — not prose tables or plain numbers. The insight card and report table card are the two primary formats. Both are returned inline in the chat thread and contain their own action affordances.
                </p>
              </div>
              <ChatDataDisplay/>
            </div>
          </Section>

          {/* ══ MOBILE ══ */}
          <Section id="mobile">
            <SectionLabel>08 — Mobile</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">Klairo on mobile.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-10">
              The sidebar collapses entirely on mobile. Navigation moves to a 4-tab bottom bar: Brief, Chat, Agents, Settings. The Daily Brief shows a 2×2 compact metric grid. Chat is full-screen with a sticky input bar above the tab bar. There are no persistent panels — everything is full canvas.
            </p>

            <MobileMockup/>

            {/* Mobile rules */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { rule:'Bottom navigation', body:'4 tabs: Brief · Chat · Agents · Settings. Active tab shows Sky Blue icon + dot underline.' },
                { rule:'No sidebar',        body:'The sidebar is desktop-only. All navigation lives in the bottom bar on screens narrower than 768px.' },
                { rule:'Full-canvas views', body:'No split panels. Each tab fills the full screen. Data cards scroll within the content area.' },
                { rule:'Chat input',        body:'Sticky above the tab bar. White/blur background. Platform avatars + arrow send button.' },
              ].map(r => (
                <div key={r.rule} className="bg-white rounded-xl border border-[#E5E5E5] p-5">
                  <div className="w-2 h-2 rounded-full bg-[#5D9DF5] mb-3"/>
                  <p className="text-[12px] font-semibold text-[#1C1C1C] mb-1.5">{r.rule}</p>
                  <p className="text-[11px] text-[#555555] leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ══ VOICE ══ */}
          <Section id="voice">
            <SectionLabel>09 — Voice & Tone</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">How Klairo speaks.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-12">Klairo is the smartest person in the room who doesn't need you to know it. Direct. Precise. Human. Never condescending, never vague.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {[
                { title: 'Intelligent', icon: '🧠', desc: 'Klairo surfaces insights that matter. Never data for data\'s sake. Every sentence earns its place.' },
                { title: 'Direct',      icon: '⚡', desc: 'Short sentences. Strong verbs. No hedge words. "Budget updated" — not "The update may have been applied."' },
                { title: 'Human',       icon: '🤝', desc: 'We talk like a brilliant colleague, not a dashboard. "Your Meta ad is crushing it" is fine.' },
              ].map(p => (
                <div key={p.title} className="bg-white rounded-2xl border border-[#E5E5E5] p-7">
                  <div className="text-3xl mb-4">{p.icon}</div>
                  <h3 className="font-serif font-bold text-xl text-[#1C1C1C] mb-3">{p.title}</h3>
                  <p className="text-[13px] text-[#555555] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
              <div className="px-8 py-5 border-b border-[#F0F0F0]"><h3 className="font-semibold text-[#1C1C1C]">In practice</h3></div>
              <div className="divide-y divide-[#F0F0F0]">
                {[
                  { dont: 'Your marketing efficiency ratio has been calculated and the resulting figure suggests a potential opportunity for optimization.', do: 'Your MER is 3.7x. That\'s solid — but your winning campaign can do better. Want to scale it?' },
                  { dont: 'It appears that inventory levels may be approaching a threshold which could result in a stock-out event.', do: 'You\'ll run out of stock in 6 days. Draft PO is ready — approve today and it arrives with 2 days buffer.' },
                  { dont: 'User engagement metrics indicate elevated interaction patterns on social commerce platforms.', do: '"Blue Crewneck" went viral on TikTok overnight — 84 orders, no ad spend, 8.4% conversion.' },
                ].map((ex, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2">
                    <div className="px-8 py-6 border-b md:border-b-0 md:border-r border-[#F0F0F0] bg-red-50/30">
                      <div className="flex items-center gap-2 mb-3"><X size={13} className="text-[#D32F2F]"/><span className="text-[11px] font-bold tracking-wide text-[#D32F2F] uppercase">Don't</span></div>
                      <p className="text-[13px] text-[#888888] leading-relaxed italic">"{ex.dont}"</p>
                    </div>
                    <div className="px-8 py-6 bg-green-50/30">
                      <div className="flex items-center gap-2 mb-3"><Check size={13} className="text-[#2E7D32]" strokeWidth={3}/><span className="text-[11px] font-bold tracking-wide text-[#2E7D32] uppercase">Do</span></div>
                      <p className="text-[13px] text-[#1C1C1C] leading-relaxed font-medium">"{ex.do}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ══ MOTION ══ */}
          <Section id="motion">
            <SectionLabel>10 — Motion</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">Motion principles.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-12">Motion at Klairo is purposeful, never decorative. Every animation has a reason.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {[
                { title: 'Entrance — fade + rise',      easing: 'easeOut',  dur: '0.5–0.8s',   use: 'Cards, insights, AI responses',      css: 'opacity: 0→1, y: +10px→0' },
                { title: 'Stagger — children cascade',  easing: 'easeOut',  dur: '0.2s delay', use: 'Agent card grid after action',        css: 'staggerChildren: 0.2s' },
                { title: 'Process — spinning loader',   easing: 'linear',   dur: '1s loop',    use: 'AI processing, budget update',        css: 'rotate: 0→360° continuous' },
                { title: 'Confirm — scale + check',     easing: 'spring',   dur: '0.3s',       use: 'Success state after "Do It"',          css: 'scale: 0.8→1, opacity: 0→1' },
              ].map(m => (
                <div key={m.title} className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                  <div className="flex items-center gap-3 mb-4"><div className="w-2 h-2 rounded-full bg-[#5D9DF5]"/><h3 className="font-semibold text-[#1C1C1C]">{m.title}</h3></div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><p className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-1">Easing</p><p className="font-mono text-[12px] text-[#1C1C1C]">{m.easing}</p></div>
                    <div><p className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-1">Duration</p><p className="font-mono text-[12px] text-[#1C1C1C]">{m.dur}</p></div>
                  </div>
                  <p className="font-mono text-[11px] text-[#5D9DF5] bg-[#F9F8F4] px-3 py-2 rounded-lg mb-3">{m.css}</p>
                  <p className="text-[12px] text-[#555555]">{m.use}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ══ DO'S & DON'TS ══ */}
          <Section id="dont">
            <SectionLabel>11 — Do's & Don'ts</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1C] mb-4">Quick reference rules.</h2>
            <p className="text-[#555555] max-w-2xl leading-relaxed mb-12">The fastest way to check yourself before shipping.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                <div className="px-7 py-5 border-b border-[#F0F0F0] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#2E7D32] flex items-center justify-center"><Check size={13} strokeWidth={3} className="text-white"/></div>
                  <h3 className="font-semibold text-[#1C1C1C]">Do</h3>
                </div>
                <ul className="divide-y divide-[#F0F0F0]">
                  {[
                    'Use Merriweather for all editorial & heading moments',
                    'Keep the cream background (#F9F8F4) as the primary canvas',
                    'Use Sky Blue (#5D9DF5) sparingly — it should feel like a signal',
                    'Write sentences that could be said aloud by a smart colleague',
                    'Maintain whitespace — let the content breathe',
                    'Use real data and real outcomes in all ad creatives',
                    'Use horizontal-only gridlines in all charts',
                    'Show, don\'t tell: use real data in mockups',
                    'Favor fade+rise animation for content arrival',
                    'Use uppercase + letter-spacing for labels and section markers',
                  ].map((item, i) => (
                    <li key={i} className="px-7 py-4 flex items-start gap-3">
                      <Check size={13} className="text-[#2E7D32] shrink-0 mt-0.5" strokeWidth={3}/>
                      <span className="text-[13px] text-[#555555] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                <div className="px-7 py-5 border-b border-[#F0F0F0] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#D32F2F] flex items-center justify-center"><X size={13} strokeWidth={3} className="text-white"/></div>
                  <h3 className="font-semibold text-[#1C1C1C]">Don't</h3>
                </div>
                <ul className="divide-y divide-[#F0F0F0]">
                  {[
                    'Never use system fonts in brand materials',
                    'Don\'t use the logo on a patterned or photographic background',
                    'Don\'t use Sky Blue as a background color for large surfaces',
                    'Avoid jargon ("leverage synergies", "unlock insights")',
                    'Don\'t use pie charts — use bars or stat cards',
                    'Don\'t use multiple competing chart colors',
                    'Never stretch, rotate, or recolor the Klairo wordmark',
                    'Don\'t add vertical grid lines to charts',
                    'Avoid heavy drop shadows — they conflict with the editorial feel',
                    'Don\'t use animation for its own sake — every motion needs purpose',
                    'Never use third-party platform colors (Meta blue, Shopify green, Klaviyo yellow) as card borders, badges, or background tints',
                    'Never use colored side or top border strokes on cards — hierarchy comes from size, type, and spacing only',
                    'Never stack text-only boxes where color is the primary differentiator — one system, one accent color',
                  ].map((item, i) => (
                    <li key={i} className="px-7 py-4 flex items-start gap-3">
                      <X size={13} className="text-[#D32F2F] shrink-0 mt-0.5" strokeWidth={3}/>
                      <span className="text-[13px] text-[#555555] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Visual violation — real world example ── */}
            <div className="mt-14">
              <div className="flex items-center gap-2 mb-6">
                <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">Visual violation — real world example</p>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] shrink-0" />
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid rgba(211,47,47,0.2)' }}>
                {/* Red header banner */}
                <div className="bg-[#D32F2F] px-6 py-3.5 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <X size={13} strokeWidth={3} className="text-white" />
                  </div>
                  <p className="text-[11px] font-bold text-white uppercase tracking-widest">Never ship this</p>
                  <div className="flex-1" />
                  <p className="text-[11px] text-white/50">Today's Insights — incorrect implementation</p>
                </div>

                {/* Screenshot with subtle red tint overlay */}
                <div className="relative select-none">
                  <img
                    src={badExampleImage}
                    alt="Brand violation example — Today's Insights with platform colors"
                    className="w-full block"
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(211,47,47,0.05)' }} />
                  {/* Numbered annotation dots */}
                  {[
                    { top: '22%', left:  '1.5%', n: '1' },
                    { top: '62%', left:  '1.5%', n: '2' },
                    { top: '62%', left: '35%',   n: '2' },
                    { top: '62%', left: '68%',   n: '2' },
                    { top: '32%', left: '66%',   n: '3' },
                  ].map((dot, i) => (
                    <div
                      key={i}
                      className="absolute w-5 h-5 rounded-full bg-[#D32F2F] flex items-center justify-center"
                      style={{ top: dot.top, left: dot.left, boxShadow: '0 0 0 2px white, 0 2px 6px rgba(0,0,0,0.2)' }}
                    >
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'white', lineHeight: 1 }}>{dot.n}</span>
                    </div>
                  ))}
                </div>

                {/* Annotation legend */}
                <div className="border-t border-red-100 px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6" style={{ background: '#FEF2F2' }}>
                  {[
                    {
                      n: '1',
                      title: 'Third-party platform colors',
                      desc: 'Meta blue (#1877F2), Shopify green (#96BF48), Klaviyo yellow (#F7C948) — these belong to other companies. Klairo\'s palette is cream, near-black, and sky blue only. Platform identity stays in the platform name label, never in the color.',
                    },
                    {
                      n: '2',
                      title: 'Colored top & side card strokes',
                      desc: 'Border accents in green, yellow, and black make each card feel like it belongs to a different system. Klairo cards share one visual language: white background, #EBEBEB border. Size, type weight, and spacing do the work color should never do.',
                    },
                    {
                      n: '3',
                      title: 'Text boxes differentiated by color',
                      desc: 'When a set of cards each carries its own accent color, the brand system dissolves. All cards in a grouped set must be visually identical in treatment — hierarchy expressed only through layout and typography, not decorative color.',
                    },
                  ].map(a => (
                    <div key={a.n} className="flex gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                        <span style={{ fontSize: '10px', fontWeight: 800, color: 'white' }}>{a.n}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#D32F2F', marginBottom: '5px' }}>{a.title}</p>
                        <p style={{ fontSize: '12px', color: '#555555', lineHeight: 1.7 }}>{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Principle rule strip */}
                <div className="bg-[#1C1C1C] px-6 py-4 flex items-center gap-5 flex-wrap">
                  <p style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
                    The rule
                  </p>
                  <div className="w-px h-4 bg-white/10 shrink-0" />
                  <p style={{ fontFamily: 'Merriweather, serif', fontSize: '13px', fontWeight: 400, color: 'white', fontStyle: 'italic' }}>
                    "Hierarchy through size, weight, and spacing. Never through color."
                  </p>
                </div>
              </div>
            </div>

            {/* Token quick-ref */}
            <div className="mt-10 bg-[#1C1C1C] rounded-2xl p-8">
              <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase mb-6">Quick token reference</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Background',  value: '#F9F8F4' },
                  { label: 'Text primary',value: '#1C1C1C' },
                  { label: 'Text body',   value: '#555555' },
                  { label: 'Text muted',  value: '#888888' },
                  { label: 'Accent blue', value: '#5D9DF5' },
                  { label: 'Border',      value: '#E5E5E5' },
                  { label: 'Card bg',     value: '#FFFFFF' },
                  { label: 'Action tint', value: '#D1E9FF' },
                  { label: 'Success',     value: '#2E7D32' },
                ].map(t => {
                  const TokenChip = () => {
                    const { copied, copy } = useCopy(t.value);
                    return (
                      <button onClick={copy} className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 py-3 group text-left w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full shrink-0 border border-white/10" style={{ background: t.value }}/>
                          <span className="text-[12px] text-white/60">{t.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-white/40">{t.value}</span>
                          {copied ? <Check size={11} className="text-[#5D9DF5]" strokeWidth={3}/> : <Copy size={11} className="text-white/20 group-hover:text-white/60 transition-colors"/>}
                        </div>
                      </button>
                    );
                  };
                  return <TokenChip key={t.label}/>;
                })}
              </div>
            </div>
          </Section>

          {/* Footer */}
          <div className="pt-16 pb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-20"><ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain opacity-60"/></div>
              <span className="text-[13px] text-[#888888]">Brand Guidelines v1.0 — February 2026</span>
            </div>
            <Link to="/" className="flex items-center gap-1.5 text-[13px] text-[#5D9DF5] hover:underline">
              Back to site <ArrowRight size={13}/>
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
