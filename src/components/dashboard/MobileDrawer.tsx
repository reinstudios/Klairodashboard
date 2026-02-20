import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutGrid, MessageSquare, Users, BarChart2,
  Zap, X, Settings, ChevronRight,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import logoImage from 'figma:asset/71db4ddb4dff2b50b549faea40c66d8a85b2e660.png';

type View = 'daily-brief' | 'new-chat' | 'team-feed' | 'reports';

const FONT = 'Inter, sans-serif';

const NAV_ITEMS: { id: View; label: string; Icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: 'daily-brief', label: 'Daily Brief', Icon: LayoutGrid    },
  { id: 'new-chat',    label: 'Chat',        Icon: MessageSquare },
  { id: 'team-feed',   label: 'Team Feed',   Icon: Users         },
  { id: 'reports',     label: 'Reports',     Icon: BarChart2     },
];

interface MobileDrawerProps {
  open: boolean;
  view: View;
  onViewChange: (v: View) => void;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenAgents: () => void;
}

export function MobileDrawer({
  open, view, onViewChange, onClose, onOpenSettings, onOpenAgents,
}: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="absolute left-0 top-0 bottom-0 flex flex-col bg-[#F9F8F4] border-r border-[#E5E5E5]"
            style={{ width: '272px', boxShadow: '4px 0 32px rgba(0,0,0,0.10)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Logo header */}
            <div className="flex items-center justify-between px-5 h-11 border-b border-[#E5E5E5] shrink-0">
              <div className="w-16">
                <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain" />
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center"
              >
                <X size={12} color="#888888" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map(item => {
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onViewChange(item.id); onClose(); }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all ${
                      active ? 'bg-[#EEF4FF]' : 'hover:bg-[#EEEEE8]'
                    }`}
                    style={{
                      fontSize: '14px',
                      fontWeight: active ? 600 : 500,
                      color: active ? '#5D9DF5' : '#555555',
                      fontFamily: FONT,
                    }}
                  >
                    <item.Icon size={16} color={active ? '#5D9DF5' : '#888888'} />
                    <span className="flex-1">{item.label}</span>
                    {/* Brand spec: Sky Blue dot indicator on active */}
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5] shrink-0" />}
                  </button>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="px-3 pb-8 pt-3 border-t border-[#E5E5E5] space-y-1 shrink-0">
              {/* Explore agents — ghost/outline style per brand spec */}
              <button
                onClick={() => { onOpenAgents(); onClose(); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border border-[#E5E5E5] bg-white/50 hover:bg-white transition-colors"
                style={{ fontSize: '13px', fontWeight: 500, color: '#555555', fontFamily: FONT }}
              >
                <Zap size={14} color="#5D9DF5" />
                <span className="flex-1">+ Explore agents</span>
                <ChevronRight size={11} color="#CCCCCC" />
              </button>

              {/* Settings */}
              <button
                onClick={() => { onOpenSettings(); onClose(); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[#EEEEE8] transition-colors"
                style={{ fontSize: '13px', fontWeight: 500, color: '#555555', fontFamily: FONT }}
              >
                <Settings size={15} color="#888888" />
                <span>Settings</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
