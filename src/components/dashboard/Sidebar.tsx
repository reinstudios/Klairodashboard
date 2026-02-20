import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  Plus, LayoutGrid, Users, BarChart3, Zap, Package,
  Shield, Settings, ChevronDown, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import logoImage from 'figma:asset/71db4ddb4dff2b50b549faea40c66d8a85b2e660.png';

type View = 'daily-brief' | 'new-chat' | 'reports' | 'team-feed';

interface SidebarProps {
  activeView: View;
  onViewChange: (v: View) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSettings: () => void;
  onOpenAgentMarketplace: () => void;
}

function NavItem({
  icon, label, active = false, indent = false, dot = false, onClick,
}: {
  icon: React.ReactNode; label: string; active?: boolean;
  indent?: boolean; dot?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-left transition-all
        ${active ? 'bg-[#EEF4FF] text-[#5D9DF5]' : 'text-[#555555] hover:bg-[#EEEEE9] hover:text-[#1C1C1C]'}
        ${indent ? 'pl-5' : ''}`}
      style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: active ? 600 : 500 }}
    >
      <span className={`shrink-0 ${active ? 'text-[#5D9DF5]' : 'text-[#888888]'}`}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5] shrink-0" />}
    </button>
  );
}

export function Sidebar({ activeView, onViewChange, collapsed, onToggleCollapse, onOpenSettings, onOpenAgentMarketplace }: SidebarProps) {
  const [agentsOpen, setAgentsOpen] = useState(true);

  const recentChats = [
    { text: 'How were sales yesterday?',   time: '5m'  },
    { text: 'TikTok spike — what now?',    time: '2h'  },
    { text: 'Scale Meta for the weekend?', time: 'Tue' },
    { text: 'Klaviyo flow performance',    time: 'Mon' },
    { text: 'Weekly MER breakdown',        time: 'Mon' },
    { text: 'Hook 3 ROAS analysis',        time: 'Sun' },
    { text: 'Checkout abandonment fix',    time: 'Sun' },
    { text: 'Q1 revenue summary',          time: 'Sat' },
  ];

  return (
    /* Outer wrapper — overflow visible so the collapse tab can stick out */
    <div
      className="fixed left-0 top-0 h-screen z-40"
      style={{
        width: '220px',
        transform: collapsed ? 'translateX(-220px)' : 'translateX(0)',
        transition: 'transform 0.26s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* ── Inner sidebar panel ── */}
      <div
        className="w-full h-full flex flex-col bg-[#F9F8F4] border-r border-[#E5E5E5] overflow-hidden"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >

        {/* ── STICKY TOP ── */}
        <div className="shrink-0">
          {/* Logo */}
          <div className="px-5 pt-6 pb-4">
            <Link to="/">
              <div className="w-20">
                <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain" />
              </div>
            </Link>
          </div>

          {/* New Chat */}
          <div className="px-4 pb-4">
            <button
              onClick={() => onViewChange('new-chat')}
              className="w-full flex items-center justify-center gap-2 bg-[#1C1C1C] hover:bg-black text-white rounded-xl py-2.5 transition-colors"
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              <Plus size={14} />New Chat
            </button>
          </div>

          {/* Main nav */}
          <div className="px-3 space-y-0.5 pb-3">
            <NavItem
              icon={<LayoutGrid size={15} />}
              label="Daily Brief"
              active={activeView === 'daily-brief'}
              dot={activeView === 'daily-brief'}
              onClick={() => onViewChange('daily-brief')}
            />
            <NavItem icon={<Users size={15} />} label="Team Feed" active={activeView === 'team-feed'} onClick={() => onViewChange('team-feed')} />
            <NavItem
              icon={<BarChart3 size={15} />}
              label="Reports"
              active={activeView === 'reports'}
              onClick={() => onViewChange('reports')}
            />
          </div>

          {/* Separator */}
          <div className="mx-4 border-t border-[#E5E5E5]" />
        </div>

        {/* ── SCROLLABLE MIDDLE (agents + chats only) ── */}
        <div className="flex-1 overflow-y-auto min-h-0 py-3">

          {/* Agents */}
          <div className="px-3 mb-2">
            <button
              onClick={() => setAgentsOpen(v => !v)}
              className="flex items-center gap-1.5 w-full px-3 py-1 mb-1"
            >
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                Agents
              </span>
              <ChevronDown
                size={11} color="#AAAAAA"
                style={{ transform: agentsOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .15s' }}
              />
            </button>
            {agentsOpen && (
              <div className="space-y-0.5">
                {[
                  { icon: <Zap size={13} />,     label: 'Meta Ads'    },
                  { icon: <Zap size={13} />,     label: 'TikTok Shop' },
                  { icon: <Zap size={13} />,     label: 'Klaviyo'     },
                  { icon: <Zap size={13} />,     label: 'Google Ads'  },
                  { icon: <Package size={13} />, label: 'ShipBob'     },
                ].map(a => <NavItem key={a.label} icon={a.icon} label={a.label} indent />)}

                {/* Explore agents — minimal, quiet */}
                <button
                  onClick={onOpenAgentMarketplace}
                  className="flex items-center gap-1.5 w-full pl-5 pr-3 py-1.5 rounded-xl transition-colors hover:bg-[#EEEEE9] group"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#BBBBBB' }}
                >
                  <Plus size={10} color="#BBBBBB" className="group-hover:text-[#888888] transition-colors" />
                  <span className="group-hover:text-[#888888] transition-colors">Explore agents</span>
                </button>
              </div>
            )}
          </div>

          {/* Recent chats */}
          <div className="px-3">
            <p className="px-3 py-1 mb-1" style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              Recent Chats
            </p>
            {recentChats.map((c, i) => (
              <button
                key={c.text}
                className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${i === 0 ? 'bg-[#EEF4FF]' : 'hover:bg-[#EEEEE9]'}`}
              >
                <p style={{ fontSize: '12px', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#1C1C1C' : '#555555', lineHeight: 1.35 }} className="truncate">
                  {c.text}
                </p>
                <p style={{ fontSize: '10px', color: '#AAAAAA' }}>{c.time} ago</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── STICKY BOTTOM ── */}
        <div className="shrink-0">
          {/* Separator */}
          <div className="mx-4 border-t border-[#E5E5E5]" />

          <div className="px-4 pt-3 pb-4 space-y-2">
            {/* Account card */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl px-3 py-3"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full bg-[#5D9DF5] flex items-center justify-center text-white shrink-0"
                  style={{ fontSize: '12px', fontWeight: 700 }}
                >A</div>
                <div className="flex-1 overflow-hidden">
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#1C1C1C' }} className="truncate">Alex Chen</p>
                  <p style={{ fontSize: '10px', color: '#888888' }} className="truncate">alex@brand.com</p>
                </div>
                <Link to="/" title="Back to site" className="shrink-0">
                  <LogOut size={13} color="#AAAAAA" className="hover:text-[#1C1C1C] transition-colors" />
                </Link>
              </div>
            </div>

            {/* Account Access + Settings */}
            <div className="space-y-0.5">
              <NavItem icon={<Shield size={15} />}   label="Account Access" />
              <NavItem icon={<Settings size={15} />} label="Settings" onClick={onOpenSettings} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Collapse tab — sticks out on the right edge ── */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-1/2 bg-white hover:bg-[#F4F4F0] flex items-center justify-center transition-colors"
        style={{
          right: '-14px',
          transform: 'translateY(-50%)',
          width: '14px',
          height: '44px',
          borderRadius: '0 8px 8px 0',
          border: '1px solid #E5E5E5',
          borderLeft: 'none',
          boxShadow: '3px 0 10px rgba(0,0,0,0.07)',
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight size={9} color="#888888" />
          : <ChevronLeft  size={9} color="#888888" />
        }
      </button>
    </div>
  );
}