import React, { useState } from 'react';
import {
  Plus, LayoutGrid, Users, Zap, Settings, Check,
  ArrowRight, TrendingUp, TrendingDown, Play, Package,
  ChevronRight, MessageSquare, BarChart3, Shield, Menu, X
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import logoImage from 'figma:asset/71db4ddb4dff2b50b549faea40c66d8a85b2e660.png';

// ── Tiny sparkline ──────────────────────────────────────────────────
function Spark({ data, color, w=48, h=14 }: { data:number[]; color:string; w?:number; h?:number }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*(h-2)+1}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Mini area chart ─────────────────────────────────────────────────
function MobileAreaChart() {
  const pts = [[0,9400],[1,11200],[2,10800],[3,13600],[4,14200]] as [number,number][];
  const W=280, H=52;
  const toX=(i:number)=>(i/4)*W;
  const toY=(v:number)=>H-((v-8000)/7000)*(H-8)-2;
  const path=pts.map(([i,v],idx)=>`${idx===0?'M':'L'}${toX(i)},${toY(v)}`).join(' ');
  const area=path+` L${toX(4)},${H} L0,${H} Z`;
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{display:'block'}}>
      <defs>
        <linearGradient id="mag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5D9DF5" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#5D9DF5" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mag)"/>
      <path d={path} fill="none" stroke="#5D9DF5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={toX(4)} cy={toY(14200)} r="2.5" fill="#5D9DF5"/>
    </svg>
  );
}

// ── Bottom tab bar ──────────────────────────────────────────────────
function BottomTab({ icon, label, active=false }: { icon:React.ReactNode; label:string; active?:boolean }) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 ${active?'text-[#5D9DF5]':'text-[#888888]'}`}>
      <span>{icon}</span>
      <span style={{fontSize:'8px',fontWeight:active?700:500,lineHeight:1}}>{label}</span>
      {active && <span className="w-1 h-1 rounded-full bg-[#5D9DF5] mt-0.5"/>}
    </div>
  );
}

// ── Phone frame wrapper ─────────────────────────────────────────────
function PhoneFrame({ children, label }: { children:React.ReactNode; label:string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Label */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5]"/>
        <p className="text-[11px] font-bold tracking-widest text-[#888888] uppercase">{label}</p>
      </div>

      {/* Phone shell */}
      <div className="relative" style={{width:'260px'}}>
        {/* Outer shell */}
        <div className="rounded-[36px] bg-[#1C1C1C] p-[10px] shadow-2xl">
          {/* Screen */}
          <div className="rounded-[28px] overflow-hidden bg-[#F9F8F4] flex flex-col" style={{height:'520px',fontFamily:'Inter,sans-serif'}}>
            {/* Status bar */}
            <div className="h-9 bg-[#F9F8F4] flex items-center justify-between px-5 pt-2 shrink-0">
              <span style={{fontSize:'10px',fontWeight:700,color:'#1C1C1C'}}>9:41</span>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5 items-end">
                  {[3,5,7,9].map((h,i)=><div key={i} className="w-1 bg-[#1C1C1C] rounded-sm" style={{height:`${h}px`}}/>)}
                </div>
                <div className="w-4 h-2.5 rounded-sm border border-[#1C1C1C] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[110%] w-0.5 h-1 bg-[#1C1C1C] rounded-full"/>
                  <div className="w-3/4 h-full bg-[#1C1C1C] rounded-sm"/>
                </div>
              </div>
            </div>

            {/* Content area (flex-1) */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {children}
            </div>

            {/* Bottom tab bar */}
            <div className="bg-white border-t border-[#E5E5E5] flex items-stretch shrink-0 pb-1">
              <BottomTab icon={<LayoutGrid size={14}/>} label="Brief" active/>
              <BottomTab icon={<MessageSquare size={14}/>} label="Chat"/>
              <BottomTab icon={<Zap size={14}/>} label="Agents"/>
              <BottomTab icon={<Settings size={14}/>} label="Settings"/>
            </div>
          </div>
        </div>

        {/* Side button */}
        <div className="absolute right-[-3px] top-20 w-[3px] h-12 bg-[#111111] rounded-r-full"/>
        <div className="absolute left-[-3px] top-16 w-[3px] h-8 bg-[#111111] rounded-l-full"/>
        <div className="absolute left-[-3px] top-28 w-[3px] h-8 bg-[#111111] rounded-l-full"/>
      </div>
    </div>
  );
}

// ── Screen: Daily Brief ─────────────────────────────────────────────
function BriefScreen() {
  return (
    <>
      {/* Top bar */}
      <div className="px-4 pt-1 pb-3 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12">
            <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#5D9DF5] flex items-center justify-center" style={{fontSize:'10px',fontWeight:700,color:'white'}}>A</div>
        </div>
        <p style={{fontFamily:'Merriweather,serif',fontSize:'17px',fontWeight:400,color:'#1C1C1C',lineHeight:1.2}}>Good morning, Alex.</p>
        <div className="w-6 h-0.5 bg-[#5D9DF5] rounded-full mt-1.5 mb-1"/>
        <p style={{fontSize:'10px',color:'#888888',lineHeight:1.4}}>Thu, Feb 20, 2026</p>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-3">
        {/* 2×2 metric grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            {l:'Revenue',  v:'$14,200', d:'+22%', pos:true,  data:[90,95,91,108,88,104,114,120,118,130,126,142]},
            {l:'Ad Spend', v:'$1,691',  d:'-2.4%',pos:false, data:[180,175,190,160,155,165,169]},
            {l:'MER',      v:'8.0x',    d:'+1.0x',pos:true,  data:[70,72,71,75,78,79,79,80,81,80,81,80]},
            {l:'Customers',v:'40',      d:'-13%', pos:false, data:[45,48,42,44,40,38,40]},
          ].map(m=>(
            <div key={m.l} className="bg-white rounded-xl border border-[#E5E5E5] p-2.5">
              <p style={{fontSize:'7.5px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.06em'}} className="mb-1">{m.l}</p>
              <p style={{fontSize:'15px',fontWeight:700,color:'#1C1C1C',lineHeight:1}} className="mb-1.5">{m.v}</p>
              <div className="flex items-center justify-between">
                <span style={{fontSize:'8px',fontWeight:700}} className={`flex items-center gap-0.5 ${m.pos?'text-[#2E7D32]':'text-[#D32F2F]'}`}>
                  {m.pos?<TrendingUp size={7}/>:<TrendingDown size={7}/>}{m.d}
                </span>
                <Spark data={m.data} color={m.pos?'#5D9DF5':'#D32F2F'} w={40} h={12}/>
              </div>
            </div>
          ))}
        </div>

        {/* Area chart */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-3">
          <div className="flex items-baseline justify-between mb-2">
            <p style={{fontSize:'9px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.06em'}}>Revenue · 5-day</p>
            <p style={{fontSize:'11px',fontWeight:700,color:'#1C1C1C'}}>$14.2k <span style={{color:'#5D9DF5',fontSize:'9px'}}>↑ 22%</span></p>
          </div>
          <MobileAreaChart/>
        </div>

        {/* Actions */}
        <div className="space-y-1.5">
          <p style={{fontSize:'8px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.06em'}}>Actions</p>
          {[
            {tag:'Meta',    text:'Scale budget to $500/day', urgent:false},
            {tag:'ShipBob', text:'Stock out risk in 6 days', urgent:true },
          ].map(a=>(
            <div key={a.tag} className="bg-white rounded-lg border border-[#E5E5E5] px-3 py-2 flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.urgent?'bg-[#D32F2F]':'bg-[#5D9DF5]'}`}/>
              <div className="flex-1 min-w-0">
                <span style={{fontSize:'7.5px',fontWeight:700,color:'#888888',textTransform:'uppercase'}}>{a.tag} · </span>
                <span style={{fontSize:'9.5px',color:'#1C1C1C'}}>{a.text}</span>
              </div>
              <button className="flex items-center gap-0.5 bg-[#1C1C1C] text-white rounded-full px-2 py-0.5 shrink-0">
                <Play size={6} className="fill-white"/>
                <span style={{fontSize:'7.5px',fontWeight:700}}>Do It</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Screen: New Chat ────────────────────────────────────────────────
function ChatScreen() {
  return (
    <>
      {/* Top bar */}
      <div className="px-4 pt-1 pb-3 border-b border-[#F0F0F0] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12">
            <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain"/>
          </div>
          <button className="flex items-center gap-1.5 bg-[#1C1C1C] text-white rounded-full px-3 py-1.5">
            <Plus size={10}/><span style={{fontSize:'9px',fontWeight:600}}>New Chat</span>
          </button>
        </div>
      </div>

      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* User */}
        <div className="flex justify-end">
          <div className="bg-[#1C1C1C] text-white px-3 py-2 rounded-2xl rounded-tr-sm" style={{fontSize:'11px',maxWidth:'75%',lineHeight:1.5}}>
            How were sales yesterday?
          </div>
        </div>

        {/* AI insight card */}
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0 mt-0.5">
            <Zap size={10} color="#5D9DF5"/>
          </div>
          <div className="flex-1 space-y-2">
            {/* Insight card (compact for mobile) */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
              <div className="p-3 bg-[#FDFCF8]">
                <p style={{fontSize:'8px',fontWeight:700,color:'#5D9DF5',textTransform:'uppercase',letterSpacing:'0.07em'}} className="mb-1">Shopify · Yesterday</p>
                <p style={{fontFamily:'Merriweather,serif',fontSize:'18px',fontWeight:400,color:'#1C1C1C',lineHeight:1}}>$14,200</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={10} color="#2E7D32"/>
                  <span style={{fontSize:'10px',fontWeight:700,color:'#2E7D32'}}>+22% vs prev day</span>
                </div>
              </div>
              {/* Stats grid */}
              <div className="grid grid-cols-4 border-t border-[#F0F0F0]">
                {[{l:'Rev',v:'$14.2k'},{l:'ROAS',v:'4.2x'},{l:'MER',v:'3.7x'},{l:'CVR',v:'4.1%'}].map((s,i)=>(
                  <div key={s.l} className={`py-2 text-center ${i<3?'border-r border-[#F0F0F0]':''}`}>
                    <p style={{fontSize:'7px',fontWeight:700,color:'#888888',textTransform:'uppercase'}}>{s.l}</p>
                    <p style={{fontSize:'10px',fontWeight:700,color:'#1C1C1C'}}>{s.v}</p>
                  </div>
                ))}
              </div>
              {/* Done action */}
              <div className="bg-[#EEF6FF] px-3 py-2 border-t border-[#D1E9FF]/50 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#2E7D32] flex items-center justify-center shrink-0">
                  <Check size={9} strokeWidth={2.5} color="white"/>
                </div>
                <p style={{fontSize:'9px',fontWeight:700,color:'#1C4E80'}}>Done. Budget updated to $500/day.</p>
              </div>
            </div>

            {/* Agent chips 2-col */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                {tag:'TikTok Shop', text:'Trending product', urgent:true },
                {tag:'Klaviyo',     text:'340 new subs',     urgent:false},
              ].map(c=>(
                <div key={c.tag} className="bg-white rounded-lg border border-[#E5E5E5] p-2">
                  <p style={{fontSize:'7px',fontWeight:700,color:'#888888',textTransform:'uppercase',letterSpacing:'0.06em'}} className="mb-0.5">{c.tag}</p>
                  <p style={{fontSize:'9px',color:'#1C1C1C',lineHeight:1.3}}>{c.text}</p>
                  {c.urgent && <p style={{fontSize:'7px',fontWeight:700,color:'#D32F2F',textTransform:'uppercase',marginTop:'2px'}}>Urgent</p>}
                  <button className="mt-1.5 w-full flex items-center justify-center gap-1 bg-[#1C1C1C] text-white rounded py-0.5">
                    <Play size={5} className="fill-white"/><span style={{fontSize:'7px',fontWeight:700}}>Do It</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Typing */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EEF4FF] flex items-center justify-center">
            <Zap size={10} color="#5D9DF5"/>
          </div>
          <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E5E5E5] px-3 py-2">
            {[0,0.2,0.4].map(d=>(
              <span key={d} className="w-1 h-1 rounded-full bg-[#888888] animate-bounce" style={{animationDelay:`${d}s`}}/>
            ))}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="px-3 pb-2 pt-2 border-t border-[#E5E5E5] bg-white/80">
        <div className="flex items-center gap-2 bg-[#F9F8F4] rounded-xl border border-[#E5E5E5] px-3 py-2">
          <span style={{fontSize:'11px',color:'#BBBBBB',flex:1}}>Ask a follow-up…</span>
          <button className="w-6 h-6 rounded-full bg-[#1C1C1C] flex items-center justify-center shrink-0">
            <ArrowRight size={9} color="white"/>
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main export ─────────────────────────────────────────────────────
export function MobileMockup() {
  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 justify-center items-start py-4">
      <PhoneFrame label="Daily Brief — mobile">
        <BriefScreen/>
      </PhoneFrame>
      <PhoneFrame label="Chat — mobile">
        <ChatScreen/>
      </PhoneFrame>
    </div>
  );
}
