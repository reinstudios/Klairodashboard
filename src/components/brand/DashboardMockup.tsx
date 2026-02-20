import React, { useState } from 'react';
import {
  Plus, LayoutGrid, Users, Zap, Shield, Settings,
  Check, ArrowRight, ChevronDown, TrendingUp, TrendingDown,
  Package, BarChart3, Bell, Search, ChevronRight, Play
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import logoImage from 'figma:asset/71db4ddb4dff2b50b549faea40c66d8a85b2e660.png';

// ── Tiny SVG sparkline ──────────────────────────────────────────────
function Spark({ data, color, w = 40, h = 14 }: { data: number[]; color: string; w?: number; h?: number }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) + 1}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── SVG area chart for Daily Brief ─────────────────────────────────
function BriefAreaChart() {
  const pts    = [[0,9400],[1,11200],[2,10800],[3,13600],[4,14200]] as [number,number][];
  const predPts= [[4,14200],[5,15100],[6,16400]] as [number,number][];
  const W = 500, H = 72;
  const toX = (i: number) => (i / 6) * W;
  const toY = (v: number) => H - ((v - 8000) / 9000) * (H - 10) - 2;
  const solidPath = pts.map(([i,v],idx) => `${idx===0?'M':'L'}${toX(i)},${toY(v)}`).join(' ');
  const solidArea = solidPath + ` L${toX(4)},${H} L0,${H} Z`;
  const dashPath  = predPts.map(([i,v],idx) => `${idx===0?'M':'L'}${toX(i)},${toY(v)}`).join(' ');
  return (
    <svg width="100%" height={H + 16} viewBox={`0 0 ${W} ${H + 16}`} preserveAspectRatio="none" style={{ display:'block' }}>
      <defs>
        <linearGradient id="bag2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#5D9DF5" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#5D9DF5" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0.3,0.6,0.9].map(f => <line key={f} x1={0} y1={H*f} x2={W} y2={H*f} stroke="#F4F4F0" strokeWidth="1"/>)}
      <path d={solidArea} fill="url(#bag2)"/>
      <path d={solidPath} fill="none" stroke="#5D9DF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={dashPath}  fill="none" stroke="#5D9DF5" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
      <circle cx={toX(4)} cy={toY(14200)} r="3" fill="#5D9DF5"/>
      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => (
        <text key={d} x={toX(i)} y={H+13} textAnchor="middle" fontSize="8" fill={i>=5?'#C8C8C8':'#AAAAAA'} fontFamily="Inter,sans-serif">{d}</text>
      ))}
    </svg>
  );
}

// ── Sidebar item ────────────────────────────────────────────────────
function SbItem({ icon, label, active=false, indent=false, dot=false, onClick }: {
  icon:React.ReactNode; label:string; active?:boolean; indent?:boolean; dot?:boolean; onClick?:()=>void;
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 w-full px-2 py-[5px] rounded-lg text-left transition-colors
        ${active ? 'bg-[#EEF4FF] text-[#5D9DF5]' : 'text-[#555555] hover:bg-[#F0EFEB] hover:text-[#1C1C1C]'}
        ${indent ? 'ml-3' : ''}`}>
      <span className={`shrink-0 ${active ? 'text-[#5D9DF5]' : 'text-[#888888]'}`}>{icon}</span>
      <span style={{fontSize:'11px',fontWeight:500,lineHeight:1}} className="truncate flex-1">{label}</span>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5] shrink-0"/>}
    </button>
  );
}

// ── Quick prompt chip ───────────────────────────────────────────────
function PromptChip({ text }: { text: string }) {
  return (
    <button className="flex items-center gap-1 bg-white border border-[#E5E5E5] rounded-full px-3 py-1.5 hover:border-[#5D9DF5] hover:bg-[#F4F8FF] transition-all group">
      <ChevronRight size={9} color="#5D9DF5" className="opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5"/>
      <span style={{fontSize:'10.5px',color:'#555555',fontWeight:500}}>{text}</span>
    </button>
  );
}

// ── VIEW: New Chat ──────────────────────────────────────────────────
function NewChatView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FDFCF8] overflow-hidden px-6 py-8 relative">
      {/* Faint dot grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #1C1C1C 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}/>

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Logo */}
        <div className="w-14 mb-5 opacity-60">
          <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/>
        </div>

        {/* Heading */}
        <p style={{fontFamily:'Merriweather,serif',fontSize:'22px',fontWeight:400,color:'#1C1C1C',lineHeight:1.25,textAlign:'center'}} className="mb-1.5">
          Ask Klairo anything.
        </p>
        <p style={{fontSize:'11.5px',color:'#888888',textAlign:'center',lineHeight:1.6}} className="mb-7">
          Your connected business brain — across every platform.
        </p>

        {/* Chat input card */}
        <div className="w-full bg-white rounded-2xl border border-[#E0E0DA] shadow-sm overflow-hidden mb-4">
          <div className="px-4 pt-4 pb-3 min-h-[56px]">
            <p style={{fontSize:'12px',color:'#C4C4C4',lineHeight:1.6}}>What do you want to know?</p>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#F0EFEA]">
            <div className="flex items-center gap-1.5">
              {[
                {l:'Meta',    c:'#1877F2'},
                {l:'Shopify', c:'#96BF48'},
                {l:'Klaviyo', c:'#F7C948'},
                {l:'TikTok',  c:'#111111'},
              ].map(p => (
                <div key={p.l} className="flex items-center gap-1 bg-[#F4F4F0] rounded-full px-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{background:p.c}}/>
                  <span style={{fontSize:'8.5px',color:'#888888',fontWeight:600}}>{p.l}</span>
                </div>
              ))}
              <div className="flex items-center gap-0.5 bg-[#F4F4F0] rounded-full px-2 py-0.5">
                <Plus size={7} color="#888888"/>
                <span style={{fontSize:'8.5px',color:'#888888',fontWeight:600}}>2</span>
              </div>
            </div>
            <button className="w-7 h-7 rounded-full bg-[#1C1C1C] flex items-center justify-center">
              <ArrowRight size={12} color="white"/>
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            'How were sales yesterday?',
            'Which ad is performing best?',
            'Am I at risk of stocking out?',
            'Scale my Meta budget',
            'Create a weekly report',
            "What drove this week's MER?",
          ].map(p => <PromptChip key={p} text={p}/>)}
        </div>

        <div className="mt-7 flex items-center gap-2">
          <div className="h-px w-10 bg-[#E5E5E5]"/>
          <span style={{fontSize:'9px',color:'#CCCCCC',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em'}}>6 platforms connected</span>
          <div className="h-px w-10 bg-[#E5E5E5]"/>
        </div>
      </div>
    </div>
  );
}

// ── VIEW: Daily Brief ───────────────────────────────────────────────
function DailyBriefView() {
  const metrics = [
    { l:'Revenue',       v:'$14,200', delta:'+22%',  pos:true,  d:[90,95,91,108,88,104,114,120,118,130,126,142] },
    { l:'Ad Spend',      v:'$1,691',  delta:'-2.4%', pos:false, d:[180,175,190,160,155,165,169,168,170,166,168,169] },
    { l:'MER',           v:'8.0x',    delta:'+1.0x', pos:true,  d:[70,72,71,75,78,79,79,80,81,80,81,80] },
    { l:'New Customers', v:'40',      delta:'-13%',  pos:false, d:[45,48,42,44,40,38,40,39,42,38,40,40] },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9F8F4] overflow-hidden">
      {/* Top bar */}
      <div className="h-9 border-b border-[#E5E5E5] bg-white/60 flex items-center px-5 shrink-0">
        <p style={{fontSize:'13px',fontWeight:700,color:'#1C1C1C',fontFamily:'Merriweather,serif'}}>Daily Brief</p>
        <div className="flex-1"/>
        <p style={{fontSize:'9px',color:'#AAAAAA'}}>Thu, Feb 20, 2026</p>
      </div>

      {/* Scrollable main */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Greeting */}
        <div>
          <p style={{fontSize:'17px',fontFamily:'Merriweather,serif',color:'#1C1C1C',lineHeight:1.2,fontWeight:400}}>
            Good morning, Alex.
          </p>
          <div className="w-7 h-0.5 rounded-full bg-[#5D9DF5] mt-1.5 mb-1.5"/>
          <p style={{fontSize:'11px',color:'#555555',lineHeight:1.5}}>
            Revenue is up, Meta CPMs are climbing, and your welcome flow is crushing it.
          </p>
        </div>

        {/* Compact 4-col metric card */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-[#F0F0F0]">
            {metrics.map(m => (
              <div key={m.l} className="p-3">
                <p style={{fontSize:'8px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.06em',lineHeight:1}} className="mb-1.5">{m.l}</p>
                <p style={{fontSize:'14px',fontWeight:700,color:'#1C1C1C',lineHeight:1}} className="mb-1.5">{m.v}</p>
                <div className="flex items-center justify-between">
                  <span style={{fontSize:'8px',fontWeight:700}} className={`flex items-center gap-0.5 ${m.pos?'text-[#2E7D32]':'text-[#D32F2F]'}`}>
                    {m.pos ? <TrendingUp size={7}/> : <TrendingDown size={7}/>}{m.delta}
                  </span>
                  <Spark data={m.d} color={m.pos?'#5D9DF5':'#D32F2F'}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Area chart */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-3">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <p style={{fontSize:'8px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.06em'}}>Revenue — Last 7 Days</p>
              <p style={{fontSize:'13px',fontWeight:700,color:'#1C1C1C'}}>$14,200 <span style={{color:'#5D9DF5',fontSize:'10px',fontWeight:400}}>↑ 22%</span></p>
            </div>
            <div style={{fontSize:'8px',color:'#AAAAAA'}} className="flex items-center gap-2">
              <span>— Actual</span><span>- - Forecast</span>
            </div>
          </div>
          <BriefAreaChart/>
        </div>

        {/* What Changed */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-3">
          <p style={{fontSize:'8px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.06em'}} className="mb-2">What Changed</p>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0 mt-0.5">
              <Zap size={9} color="#5D9DF5"/>
            </div>
            <p style={{fontSize:'10px',color:'#555555',lineHeight:1.55}}>
              Meta <strong style={{color:'#1C1C1C'}}>'Summer UGC — Hook 3'</strong> is outperforming all ad sets by 120% with a 4.2x ROAS. Klaviyo welcome flow converted at 8.2% — double the account average.
            </p>
          </div>
        </div>

        {/* Suggested actions */}
        <div className="space-y-1.5">
          <p style={{fontSize:'8px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.06em'}}>Suggested Actions</p>
          {[
            { tag:'Meta Ads',    action:'Scale budget to $500/day on winning campaign', urgent:false },
            { tag:'ShipBob',     action:'Stock out in 6 days — approve draft PO',       urgent:true  },
            { tag:'TikTok Shop', action:'Trending product detected — launch retargeting',urgent:true  },
          ].map(a => (
            <div key={a.tag} className="bg-white rounded-lg border border-[#E5E5E5] px-3 py-2.5 flex items-center gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.urgent?'bg-[#D32F2F]':'bg-[#5D9DF5]'}`}/>
              <div className="flex-1 min-w-0">
                <span style={{fontSize:'8px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.05em'}}>{a.tag} · </span>
                <span style={{fontSize:'10px',color:'#1C1C1C'}}>{a.action}</span>
              </div>
              <button className="flex items-center gap-1 bg-[#1C1C1C] text-white rounded-full px-2 py-1 shrink-0">
                <Play size={7} className="fill-white"/>
                <span style={{fontSize:'8px',fontWeight:700}}>Do It</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────
export function DashboardMockup() {
  const [view, setView] = useState<'new-chat'|'daily-brief'>('new-chat');
  const [agentsOpen, setAgentsOpen] = useState(true);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#D0D0D0] shadow-2xl" style={{fontFamily:'Inter,sans-serif'}}>

      {/* Browser chrome */}
      <div className="h-8 bg-[#EFEFEB] border-b border-[#E0E0DC] flex items-center px-3 gap-3 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"/>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"/>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"/>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white/70 border border-[#E0E0DC] rounded-md px-8 py-0.5">
            <span style={{fontSize:'9px',color:'#888888'}}>app.klairo.ai</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Bell size={11} color="#888888"/>
          <Search size={11} color="#888888"/>
        </div>
      </div>

      {/* App body */}
      <div className="flex bg-[#F9F8F4]" style={{height:'580px'}}>

        {/* ─── Sidebar ──────────────────────────────────────── */}
        <div className="w-[168px] shrink-0 bg-[#F9F8F4] border-r border-[#E5E5E5] flex flex-col overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <div className="w-16">
              <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/>
            </div>
          </div>

          {/* New Chat */}
          <div className="px-3 pb-3">
            <button
              onClick={() => setView('new-chat')}
              className="w-full flex items-center justify-center gap-1.5 bg-[#1C1C1C] text-white rounded-lg py-2 hover:bg-black transition-colors">
              <Plus size={11}/><span style={{fontSize:'11px',fontWeight:600}}>New Chat</span>
            </button>
          </div>

          {/* Nav */}
          <div className="px-2 space-y-0.5 pb-2">
            <SbItem icon={<LayoutGrid size={13}/>} label="Daily Brief"
              active={view==='daily-brief'} dot={view==='daily-brief'}
              onClick={() => setView('daily-brief')}/>
            <SbItem icon={<Users size={13}/>}     label="Team Feed"/>
            <SbItem icon={<BarChart3 size={13}/>} label="Reports"/>
          </div>

          {/* Agents */}
          <div className="px-2 pt-2 pb-1">
            <button onClick={() => setAgentsOpen(v => !v)} className="flex items-center gap-1.5 w-full px-2 pb-1.5">
              <span style={{fontSize:'9px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.08em'}}>Agents</span>
              <ChevronDown size={9} color="#888888" style={{transform:agentsOpen?'rotate(0deg)':'rotate(-90deg)',transition:'transform .15s'}}/>
            </button>
            {agentsOpen && (
              <div className="space-y-0.5">
                {[
                  {icon:<Zap size={10}/>,    label:'Meta Ads'},
                  {icon:<Zap size={10}/>,    label:'TikTok Shop'},
                  {icon:<Zap size={10}/>,    label:'Klaviyo'},
                  {icon:<Zap size={10}/>,    label:'Google Ads'},
                  {icon:<Package size={10}/>,label:'ShipBob'},
                ].map(a => <SbItem key={a.label} icon={a.icon} label={a.label} indent/>)}
              </div>
            )}
          </div>

          {/* Recent chats */}
          <div className="px-2 pt-2 pb-1">
            <p className="px-2 pb-1.5" style={{fontSize:'9px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.08em'}}>Recent Chats</p>
            {[
              {text:'How were sales yesterday?', time:'5m',  active:view==='new-chat'},
              {text:'TikTok spike — what now?',  time:'2h',  active:false},
              {text:'Scale Meta for weekend?',    time:'Tue', active:false},
              {text:'Klaviyo flow performance',   time:'Mon', active:false},
            ].map(c => (
              <div key={c.text} className={`px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${c.active?'bg-[#EEF4FF]':'hover:bg-[#F0EFEB]'}`}>
                <p style={{fontSize:'10px',fontWeight:c.active?600:400,color:c.active?'#1C1C1C':'#555555',lineHeight:1.3}} className="truncate">{c.text}</p>
                <p style={{fontSize:'8px',color:'#888888'}}>{c.time} ago</p>
              </div>
            ))}
          </div>

          <div className="flex-1"/>

          {/* Bottom */}
          <div className="px-2 border-t border-[#E5E5E5] pt-2 pb-1 space-y-0.5">
            <SbItem icon={<Shield size={13}/>}   label="Account Access"/>
            <SbItem icon={<Settings size={13}/>} label="Settings"/>
          </div>

          {/* User */}
          <div className="px-3 py-3 border-t border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#5D9DF5] flex items-center justify-center text-white shrink-0" style={{fontSize:'9px',fontWeight:700}}>A</div>
              <div className="flex-1 overflow-hidden">
                <p style={{fontSize:'10px',fontWeight:700,color:'#1C1C1C'}} className="truncate">Alex Chen</p>
                <p style={{fontSize:'9px',color:'#888888'}} className="truncate">alex@brand.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Main view ────────────────────────────────────── */}
        {view === 'new-chat'    && <NewChatView/>}
        {view === 'daily-brief' && <DailyBriefView/>}

      </div>
    </div>
  );
}
