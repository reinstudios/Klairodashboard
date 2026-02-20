import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Check, Plus, Wand2, Film, TrendingUp,
  Eye, Package, Mail, Zap,
} from 'lucide-react';

const FONT = 'Inter, sans-serif';

type Category = 'all' | 'creative' | 'finance' | 'marketing' | 'operations';

interface Agent {
  id: string;
  name: string;
  category: Exclude<Category, 'all'>;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  tagline: string;
  description: string;
  capabilities: string[];
  price: string;
}

const AGENTS: Agent[] = [
  {
    id: 'brand-creative',
    name: 'Brand Creative',
    category: 'creative',
    Icon: Wand2,
    tagline: 'On-brand static ads. Briefed in seconds.',
    description: 'Turns your Shopify products into paid-ready static creatives. Brief it with a product link — it handles sizing, copy, and brand rules itself.',
    capabilities: ['Static ads', 'Auto-brief', 'Brand sync', 'Multi-format'],
    price: '$79 / mo',
  },
  {
    id: 'video-producer',
    name: 'Video Producer',
    category: 'creative',
    Icon: Film,
    tagline: 'Scripts, hooks, and UGC direction.',
    description: 'Writes short-form scripts, storyboards, and UGC briefs from your top-performing hooks. Ready to hand to creators or a production team the same day.',
    capabilities: ['UGC briefs', 'Hook testing', 'Storyboards', 'TikTok + Reels'],
    price: '$99 / mo',
  },
  {
    id: 'cfo',
    name: 'CFO',
    category: 'finance',
    Icon: TrendingUp,
    tagline: 'A 90-day forecast that updates itself daily.',
    description: 'Builds rolling revenue forecasts, gross margin scenarios, and channel P&L models from live data. Knows when your numbers are about to move before they do.',
    capabilities: ['90-day forecast', 'P&L models', 'Scenario analysis', 'Margin tracking'],
    price: '$129 / mo',
  },
  {
    id: 'cmo',
    name: 'CMO',
    category: 'marketing',
    Icon: Eye,
    tagline: 'Your ads under 24/7 surveillance.',
    description: 'Monitors every ad account in real time. Alerts you to creative fatigue, ROAS spikes, audience saturation, and budget drift — before they cost you.',
    capabilities: ['24/7 monitoring', 'Creative fatigue', 'ROAS alerts', 'Audience tracking'],
    price: '$149 / mo',
  },
  {
    id: 'demand-planner',
    name: 'Demand Planner',
    category: 'operations',
    Icon: Package,
    tagline: 'Never stock out. Never overorder.',
    description: 'Forecasts demand from sales velocity, ad spend, and seasonality. Raises reorder alerts 21 days before projected stockout — SKU by SKU, automatically.',
    capabilities: ['Demand forecast', 'Reorder alerts', 'SKU-level', 'ShipBob sync'],
    price: '$79 / mo',
  },
  {
    id: 'email-strategist',
    name: 'Email Strategist',
    category: 'marketing',
    Icon: Mail,
    tagline: 'Flows that convert. Copy that lands.',
    description: 'Analyzes your Klaviyo performance and rewrites underperforming sequences. Tests subject lines, optimises send times, and maps flows to purchase moments.',
    capabilities: ['Flow analysis', 'A/B testing', 'Send-time AI', 'Klaviyo sync'],
    price: '$69 / mo',
  },
];

const CATEGORY_LABELS: { id: Category; label: string }[] = [
  { id: 'all',        label: 'All' },
  { id: 'creative',   label: 'Creative' },
  { id: 'finance',    label: 'Finance' },
  { id: 'marketing',  label: 'Marketing' },
  { id: 'operations', label: 'Operations' },
];

// ── Capability chip ───────────────────────────────────────────────────
function Chip({ label }: { label: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-md bg-[#F4F4F0]"
      style={{
        fontSize: '9px', fontWeight: 700, color: '#888888',
        textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FONT,
      }}
    >
      {label}
    </span>
  );
}

// ── Agent card ──────────────────────────────────���─────────────────────
function AgentCard({
  agent,
  isAdded,
  onAdd,
}: {
  agent: Agent;
  isAdded: boolean;
  onAdd: (id: string) => void;
}) {
  const { Icon } = agent;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white border border-[#E5E5E5] rounded-2xl p-5 flex flex-col"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      {/* Top row: icon + category label */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#F4F4F0] flex items-center justify-center shrink-0">
          <Icon size={16} color="#555555" />
        </div>
        <span style={{
          fontSize: '9px', fontWeight: 700, color: '#888888',
          textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: FONT,
        }}>
          {agent.category}
        </span>
      </div>

      {/* Name */}
      <p style={{
        fontFamily: 'Merriweather, serif',
        fontSize: '15px',
        fontWeight: 400,
        color: '#1C1C1C',
        marginBottom: '3px',
      }}>
        {agent.name}
      </p>

      {/* Tagline */}
      <p style={{
        fontSize: '11px', fontWeight: 500, color: '#888888',
        fontFamily: FONT, marginBottom: '8px', lineHeight: 1.5,
      }}>
        {agent.tagline}
      </p>

      {/* Description */}
      <p style={{
        fontSize: '12px', color: '#555555', fontFamily: FONT,
        lineHeight: 1.65, marginBottom: '14px', flexGrow: 1,
      }}>
        {agent.description}
      </p>

      {/* Capability chips */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {agent.capabilities.map(c => <Chip key={c} label={c} />)}
      </div>

      {/* Footer: price + CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F0EFEA]">
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#1C1C1C', fontFamily: FONT }}>
          {agent.price}
        </p>

        {isAdded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5"
          >
            <div className="w-5 h-5 rounded-full bg-[#F0FAF1] flex items-center justify-center">
              <Check size={10} strokeWidth={3} className="text-[#2E7D32]" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#2E7D32', fontFamily: FONT }}>
              Added
            </span>
          </motion.div>
        ) : (
          <button
            onClick={() => onAdd(agent.id)}
            className="flex items-center gap-1.5 bg-[#1C1C1C] hover:bg-black text-white rounded-xl px-4 py-2 transition-colors"
            style={{ fontSize: '11px', fontWeight: 600, fontFamily: FONT }}
          >
            <Plus size={10} strokeWidth={2.5} />
            Add agent
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── Main marketplace modal ────────────────────────────────────────────
interface AgentMarketplaceProps {
  open: boolean;
  onClose: () => void;
}

export function AgentMarketplace({ open, onClose }: AgentMarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [added, setAdded] = useState<Set<string>>(new Set());

  const filtered = activeCategory === 'all'
    ? AGENTS
    : AGENTS.filter(a => a.category === activeCategory);

  const handleAdd = (id: string) =>
    setAdded(prev => new Set([...prev, id]));

  const countFor = (cat: Category) =>
    cat === 'all' ? AGENTS.length : AGENTS.filter(a => a.category === cat).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[4px]" />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 14 }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            className="relative bg-white border border-[#E5E5E5] flex flex-col overflow-hidden w-full h-full md:h-auto md:rounded-2xl rounded-none md:border"
            style={{
              maxWidth: '900px',
              maxHeight: '88vh',
              boxShadow: '0 24px 72px rgba(0,0,0,0.13)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className="shrink-0 flex items-start justify-between px-4 md:px-8 pt-5 md:pt-7 pb-4 md:pb-5 border-b border-[#E5E5E5]">
              <div>
                <p style={{
                  fontFamily: 'Merriweather, serif',
                  fontSize: '20px',
                  fontWeight: 400,
                  color: '#1C1C1C',
                  marginBottom: '4px',
                }}>
                  Agent Marketplace
                </p>
                <p style={{ fontSize: '12px', color: '#888888', fontFamily: FONT }}>
                  Expand your workspace with specialist AI agents. Each one has a single job — and does it exceptionally.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-[#F4F4F0] hover:bg-[#EBEBEB] flex items-center justify-center transition-colors shrink-0 ml-4 mt-0.5"
              >
                <X size={12} color="#888888" />
              </button>
            </div>

            {/* ── Filter tabs ── */}
            <div className="shrink-0 flex items-center gap-0 px-4 md:px-8 border-b border-[#E5E5E5] overflow-x-auto">
              {CATEGORY_LABELS.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-1.5 px-0 py-4 mr-6 border-b-2 transition-all"
                  style={{
                    borderColor: activeCategory === cat.id ? '#1C1C1C' : 'transparent',
                    fontFamily: FONT,
                    fontSize: '12px',
                    fontWeight: activeCategory === cat.id ? 700 : 500,
                    color: activeCategory === cat.id ? '#1C1C1C' : '#888888',
                  }}
                >
                  {cat.label}
                  <span
                    className="rounded-full px-1.5 py-0.5 transition-colors"
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      fontFamily: FONT,
                      background: activeCategory === cat.id ? '#1C1C1C' : '#F0EFEA',
                      color: activeCategory === cat.id ? 'white' : '#888888',
                    }}
                  >
                    {countFor(cat.id)}
                  </span>
                </button>
              ))}

              <div className="ml-auto flex items-center gap-1.5 pb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5]" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: FONT }}>
                  {added.size} added this session
                </span>
              </div>
            </div>

            {/* ── Card grid ── */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="grid gap-4"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
                >
                  {filtered.map(agent => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      isAdded={added.has(agent.id)}
                      onAdd={handleAdd}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 flex items-center justify-between px-8 py-4 border-t border-[#F0EFEA] bg-[#FAFAF8]">
              <p style={{ fontSize: '11px', color: '#888888', fontFamily: FONT }}>
                Your plan includes <span style={{ fontWeight: 700, color: '#1C1C1C' }}>3 agent slots</span> · {3 - added.size > 0 ? `${3 - added.size} remaining` : 'all slots used'}
              </p>
              <button
                className="flex items-center gap-1.5 border border-[#E5E5E5] hover:border-[#AAAAAA] rounded-xl px-4 py-2 transition-colors"
                style={{ fontSize: '11px', fontWeight: 600, color: '#555555', fontFamily: FONT }}
              >
                <Zap size={11} />
                Upgrade for unlimited agents
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}