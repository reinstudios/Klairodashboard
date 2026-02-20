import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, User, Settings2, CreditCard, BarChart2, Plug, Users, Bell, Key,
  Check, Copy, ChevronRight, Download, Mail, Package, ShoppingBag,
  Zap, Search, Plus, LogOut, ExternalLink, RefreshCw, HelpCircle,
  Building2, AlertTriangle, TrendingUp,
} from 'lucide-react';

const FONT = 'Inter, sans-serif';

type Section =
  | 'profile' | 'workspace' | 'billing' | 'usage'
  | 'connections' | 'team' | 'notifications' | 'api';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

// ── Reusable primitives ────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-checked={on}
      role="switch"
      className="relative shrink-0 focus:outline-none"
      style={{
        width: '34px', height: '19px', borderRadius: '999px',
        background: on ? '#1C1C1C' : '#DDDDDD',
        transition: 'background 0.18s',
      }}
    >
      <span
        style={{
          position: 'absolute', top: '2.5px',
          left: on ? '17px' : '2.5px',
          width: '14px', height: '14px',
          borderRadius: '50%', background: 'white',
          transition: 'left 0.18s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      />
    </button>
  );
}

function SettingsLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '10px', fontWeight: 700, color: '#888888',
      textTransform: 'uppercase', letterSpacing: '0.09em',
      marginBottom: '10px', fontFamily: FONT,
    }}>
      {children}
    </p>
  );
}

function InputRow({
  label, value, onChange, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#555555', marginBottom: '5px', fontFamily: FONT }}>{label}</p>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#F9F8F4] border border-[#E5E5E5] rounded-xl px-3 py-2.5 outline-none focus:border-[#AAAAAA] transition-colors"
        style={{ fontSize: '13px', color: '#1C1C1C', fontFamily: FONT }}
      />
    </div>
  );
}

function SelectRow({
  label, value, options, onChange,
}: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div>
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#555555', marginBottom: '5px', fontFamily: FONT }}>{label}</p>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#F9F8F4] border border-[#E5E5E5] rounded-xl px-3 py-2.5 outline-none focus:border-[#AAAAAA] transition-colors appearance-none"
        style={{ fontSize: '13px', color: '#1C1C1C', fontFamily: FONT }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function UsageBar({ label, used, total, unit = '' }: {
  label: string; used: number; total: number; unit?: string;
}) {
  const pct = Math.min((used / total) * 100, 100);
  const warn = pct > 80;
  return (
    <div className="py-4 border-b border-[#F0EFEA] last:border-0">
      <div className="flex items-baseline justify-between mb-2">
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1C', fontFamily: FONT }}>{label}</p>
        <p style={{ fontSize: '12px', color: warn ? '#D32F2F' : '#888888', fontFamily: FONT }}>
          {used.toLocaleString()}{unit} <span style={{ color: '#CCCCCC' }}>/</span> {total.toLocaleString()}{unit}
        </p>
      </div>
      <div className="h-1.5 bg-[#F0EFEA] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: warn ? '#D32F2F' : '#5D9DF5' }}
        />
      </div>
      <p style={{ fontSize: '10px', color: '#AAAAAA', marginTop: '5px', fontFamily: FONT }}>
        {Math.round(100 - pct)}% remaining
      </p>
    </div>
  );
}

// ── Section: Profile ──────────────────────────────────────────────────
function ProfileSection() {
  const [name, setName] = useState('Alex Chen');
  const [email, setEmail] = useState('alex@coastalbrand.com');
  const [role, setRole] = useState('Growth Manager');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <p style={{ fontFamily: 'Merriweather, serif', fontSize: '20px', fontWeight: 400, color: '#1C1C1C', marginBottom: '4px' }}>
        Profile
      </p>
      <p style={{ fontSize: '12px', color: '#888888', marginBottom: '24px', fontFamily: FONT }}>
        Manage your personal account details
      </p>

      {/* Avatar row */}
      <div className="flex items-center gap-4 mb-8 p-5 bg-white border border-[#E5E5E5] rounded-2xl">
        <div
          className="w-14 h-14 rounded-full bg-[#5D9DF5] flex items-center justify-center shrink-0"
          style={{ fontSize: '20px', fontWeight: 700, color: 'white', fontFamily: FONT }}
        >A</div>
        <div className="flex-1">
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#1C1C1C', fontFamily: FONT }}>{name}</p>
          <p style={{ fontSize: '12px', color: '#888888', fontFamily: FONT }}>{email}</p>
          <p style={{ fontSize: '11px', color: '#AAAAAA', marginTop: '2px', fontFamily: FONT }}>Klairo Pro · Coastal Brand Co.</p>
        </div>
        <button
          className="px-4 py-2 border border-[#E5E5E5] rounded-xl hover:border-[#AAAAAA] transition-colors"
          style={{ fontSize: '11px', fontWeight: 600, color: '#555555', fontFamily: FONT }}
        >
          Change avatar
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-4 mb-6">
        <SettingsLabel>Personal details</SettingsLabel>
        <div className="grid grid-cols-2 gap-3">
          <InputRow label="Full name" value={name} onChange={setName} />
          <InputRow label="Role / Title" value={role} onChange={setRole} />
        </div>
        <InputRow label="Email address" value={email} onChange={setEmail} type="email" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#F0EFEA]">
        <button
          className="flex items-center gap-1.5 text-[#D32F2F] hover:text-red-700 transition-colors"
          style={{ fontSize: '12px', fontWeight: 600, fontFamily: FONT }}
        >
          <LogOut size={12} /> Sign out
        </button>
        <button
          onClick={save}
          className="flex items-center gap-2 bg-[#1C1C1C] hover:bg-black text-white rounded-xl px-5 py-2.5 transition-colors"
          style={{ fontSize: '12px', fontWeight: 600, fontFamily: FONT }}
        >
          {saved ? <><Check size={12} />Saved</> : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

// ── Section: Workspace ────────────────────────────────────────────────
function WorkspaceSection() {
  const [store, setStore] = useState('Coastal Brand Co.');
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('America/New_York (EST)');
  const [fiscal, setFiscal] = useState('January');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <p style={{ fontFamily: 'Merriweather, serif', fontSize: '20px', fontWeight: 400, color: '#1C1C1C', marginBottom: '4px' }}>
        Workspace
      </p>
      <p style={{ fontSize: '12px', color: '#888888', marginBottom: '24px', fontFamily: FONT }}>
        Configure your store and regional preferences
      </p>

      <div className="space-y-4 mb-6">
        <SettingsLabel>Store details</SettingsLabel>
        <InputRow label="Store name" value={store} onChange={setStore} />
        <div className="grid grid-cols-2 gap-3">
          <SelectRow
            label="Currency"
            value={currency}
            options={['USD ($)', 'GBP (£)', 'EUR (€)', 'AUD ($)', 'CAD ($)']}
            onChange={setCurrency}
          />
          <SelectRow
            label="Fiscal year start"
            value={fiscal}
            options={['January', 'February', 'March', 'April', 'July', 'October']}
            onChange={setFiscal}
          />
        </div>
        <SelectRow
          label="Timezone"
          value={timezone}
          options={[
            'America/New_York (EST)',
            'America/Chicago (CST)',
            'America/Denver (MST)',
            'America/Los_Angeles (PST)',
            'Europe/London (GMT)',
            'Europe/Paris (CET)',
            'Asia/Tokyo (JST)',
            'Australia/Sydney (AEDT)',
          ]}
          onChange={setTimezone}
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-[#F0EFEA]">
        <button
          onClick={save}
          className="flex items-center gap-2 bg-[#1C1C1C] hover:bg-black text-white rounded-xl px-5 py-2.5 transition-colors"
          style={{ fontSize: '12px', fontWeight: 600, fontFamily: FONT }}
        >
          {saved ? <><Check size={12} />Saved</> : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

// ── Section: Billing ──────────────────────────────────────────────────
function BillingSection() {
  const invoices = [
    { date: 'Feb 20, 2026', amount: '$149.00' },
    { date: 'Jan 20, 2026', amount: '$149.00' },
    { date: 'Dec 20, 2025', amount: '$149.00' },
  ];

  return (
    <div>
      <p style={{ fontFamily: 'Merriweather, serif', fontSize: '20px', fontWeight: 400, color: '#1C1C1C', marginBottom: '4px' }}>
        Billing
      </p>
      <p style={{ fontSize: '12px', color: '#888888', marginBottom: '24px', fontFamily: FONT }}>
        Manage your subscription and payment details
      </p>

      {/* Plan card */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ fontFamily: 'Merriweather, serif', fontSize: '15px', fontWeight: 400, color: '#1C1C1C' }}>
              Klairo Pro
            </p>
            <p style={{ fontSize: '11px', color: '#888888', fontFamily: FONT, marginTop: '2px' }}>
              Renewal date: Mar 20, 2026 · $149/month
            </p>
          </div>
          <button
            className="px-4 py-2 border border-[#E5E5E5] rounded-xl hover:border-[#AAAAAA] transition-colors"
            style={{ fontSize: '11px', fontWeight: 600, color: '#555555', fontFamily: FONT }}
          >
            Manage plan
          </button>
        </div>
        <div className="border-t border-[#F0EFEA] pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1C', fontFamily: FONT }}>AI Queries</p>
              <p style={{ fontSize: '10px', color: '#AAAAAA', fontFamily: FONT }}>Resets Mar 20, 2026</p>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#1C1C1C', fontFamily: FONT }}>1,847 / 5,000</p>
          </div>
          <div className="h-1.5 bg-[#F0EFEA] rounded-full overflow-hidden">
            <div className="h-full bg-[#5D9DF5] rounded-full" style={{ width: '36.9%' }} />
          </div>
          <div className="flex items-center justify-between pt-1">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1C', fontFamily: FONT }}>Data refreshes</p>
              <p style={{ fontSize: '10px', color: '#AAAAAA', fontFamily: FONT }}>Syncs across all connected platforms</p>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#1C1C1C', fontFamily: FONT }}>284 / 1,000</p>
          </div>
          <div className="h-1.5 bg-[#F0EFEA] rounded-full overflow-hidden">
            <div className="h-full bg-[#5D9DF5] rounded-full" style={{ width: '28.4%' }} />
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0EFEA] flex items-center justify-between">
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1C', fontFamily: FONT }}>Recent invoices</p>
          <button
            className="flex items-center gap-1 hover:text-[#1C1C1C] transition-colors"
            style={{ fontSize: '11px', color: '#5D9DF5', fontWeight: 600, fontFamily: FONT }}
          >
            View all <ChevronRight size={10} />
          </button>
        </div>
        <div className="divide-y divide-[#F0EFEA]">
          {invoices.map((inv, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#F4F4F0] flex items-center justify-center">
                  <CreditCard size={12} color="#888888" />
                </div>
                <p style={{ fontSize: '12px', color: '#555555', fontFamily: FONT }}>{inv.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1C1C1C', fontFamily: FONT }}>{inv.amount}</p>
                <button
                  className="flex items-center gap-1 border border-[#E5E5E5] rounded-lg px-3 py-1.5 hover:border-[#AAAAAA] transition-colors"
                  style={{ fontSize: '11px', fontWeight: 600, color: '#555555', fontFamily: FONT }}
                >
                  <Download size={10} />PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Section: Usage ────────────────────────────────────────────────────
function UsageSection() {
  return (
    <div>
      <p style={{ fontFamily: 'Merriweather, serif', fontSize: '20px', fontWeight: 400, color: '#1C1C1C', marginBottom: '4px' }}>
        Usage
      </p>
      <p style={{ fontSize: '12px', color: '#888888', marginBottom: '24px', fontFamily: FONT }}>
        Current period — Feb 20, 2026 · Resets Mar 20, 2026
      </p>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Platforms',    value: '6',     cap: '10',   unit: '' },
          { label: 'Queries used', value: '1,847', cap: '5,000', unit: '' },
          { label: 'Syncs run',    value: '284',   cap: '1,000', unit: '' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E5E5E5] rounded-2xl p-4">
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: FONT, marginBottom: '6px' }}>
              {s.label}
            </p>
            <p style={{ fontFamily: 'Merriweather, serif', fontSize: '22px', color: '#1C1C1C', lineHeight: 1 }}>
              {s.value}
            </p>
            <p style={{ fontSize: '10px', color: '#AAAAAA', marginTop: '3px', fontFamily: FONT }}>of {s.cap}</p>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl px-5 py-1 mb-4">
        <UsageBar label="AI Queries"      used={1847} total={5000} />
        <UsageBar label="Data Refreshes"  used={284}  total={1000} />
        <UsageBar label="Report Exports"  used={9}    total={25}   />
        <UsageBar label="API Calls"       used={42}   total={500}  />
      </div>

      <p style={{ fontSize: '11px', color: '#AAAAAA', fontFamily: FONT }}>
        Upgrade to Klairo Scale for unlimited AI queries and data refreshes.
        {' '}<button style={{ color: '#5D9DF5', fontWeight: 600 }}>View plans →</button>
      </p>
    </div>
  );
}

// ── Section: Connections ──────────────────────────────────────────────
function ConnectionsSection() {
  const [connected, setConnected] = useState(
    new Set(['shopify', 'meta', 'google', 'tiktok', 'klaviyo', 'shipbob'])
  );

  const platforms = [
    { id: 'shopify',  Icon: ShoppingBag, name: 'Shopify',       desc: 'Online store, orders, inventory' },
    { id: 'meta',     Icon: BarChart2,   name: 'Meta Ads',      desc: 'Paid social — Facebook & Instagram' },
    { id: 'google',   Icon: Search,      name: 'Google Ads',    desc: 'Paid search and Performance Max' },
    { id: 'tiktok',   Icon: Zap,         name: 'TikTok Shop',   desc: 'Social commerce and paid video' },
    { id: 'klaviyo',  Icon: Mail,        name: 'Klaviyo',       desc: 'Email marketing and SMS flows' },
    { id: 'shipbob',  Icon: Package,     name: 'ShipBob',       desc: 'Fulfilment and inventory tracking' },
    { id: 'stripe',   Icon: CreditCard,  name: 'Stripe',        desc: 'Payment processing and revenue' },
    { id: 'gorgias',  Icon: Users,       name: 'Gorgias',       desc: 'Customer support and helpdesk' },
  ];

  const toggle = (id: string) =>
    setConnected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div>
      <p style={{ fontFamily: 'Merriweather, serif', fontSize: '20px', fontWeight: 400, color: '#1C1C1C', marginBottom: '4px' }}>
        Connections
      </p>
      <p style={{ fontSize: '12px', color: '#888888', marginBottom: '24px', fontFamily: FONT }}>
        {connected.size} of {platforms.length} platforms connected
      </p>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
        {platforms.map((p, i) => {
          const isConn = connected.has(p.id);
          return (
            <div
              key={p.id}
              className={`flex items-center gap-3.5 px-5 py-4 ${i < platforms.length - 1 ? 'border-b border-[#F0EFEA]' : ''}`}
            >
              {/* Icon — neutral, no platform colors */}
              <div className="w-9 h-9 rounded-xl bg-[#F4F4F0] flex items-center justify-center shrink-0">
                <p.Icon size={15} color="#555555" />
              </div>

              {/* Name + desc */}
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1C', fontFamily: FONT }}>{p.name}</p>
                <p style={{ fontSize: '11px', color: '#888888', fontFamily: FONT }}>{p.desc}</p>
              </div>

              {/* Status + action */}
              <div className="flex items-center gap-3 shrink-0">
                {isConn && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600, fontFamily: FONT }}>Connected</span>
                  </div>
                )}
                <button
                  onClick={() => toggle(p.id)}
                  className={`px-3.5 py-1.5 rounded-lg border transition-colors ${
                    isConn
                      ? 'border-[#E5E5E5] hover:border-[#D32F2F] hover:text-[#D32F2F] hover:bg-red-50'
                      : 'border-[#1C1C1C] bg-[#1C1C1C] text-white hover:bg-black'
                  }`}
                  style={{ fontSize: '11px', fontWeight: 600, fontFamily: FONT, color: isConn ? '#888888' : undefined }}
                >
                  {isConn ? 'Disconnect' : <span className="flex items-center gap-1"><Plus size={10} /> Connect</span>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="flex items-center gap-1.5 px-4 py-2.5 border border-[#E5E5E5] rounded-xl hover:border-[#AAAAAA] transition-colors"
          style={{ fontSize: '12px', fontWeight: 600, color: '#555555', fontFamily: FONT }}
        >
          <Plus size={12} />Browse all integrations
        </button>
      </div>
    </div>
  );
}

// ── Section: Team ─────────────────────────────────────────────────────
function TeamSection() {
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const members = [
    { name: 'Alex Chen',     email: 'alex@coastalbrand.com',   role: 'Owner',  isYou: true,  photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
    { name: 'Sarah Chen',    email: 'sarah@coastalbrand.com',  role: 'Admin',  isYou: false, photo: 'https://images.unsplash.com/photo-1758600587839-56ba05596c69?w=80&q=80' },
    { name: 'James Rivera',  email: 'james@coastalbrand.com',  role: 'Member', isYou: false, photo: 'https://images.unsplash.com/photo-1617746652974-0be48cd984d1?w=80&q=80' },
  ];

  const handleInvite = () => {
    if (!inviteEmail) return;
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setInviteEmail(''); }, 2200);
  };

  return (
    <div>
      <p style={{ fontFamily: 'Merriweather, serif', fontSize: '20px', fontWeight: 400, color: '#1C1C1C', marginBottom: '4px' }}>
        Team
      </p>
      <p style={{ fontSize: '12px', color: '#888888', marginBottom: '24px', fontFamily: FONT }}>
        Coastal Brand Co. · 3 of 5 seats used
      </p>

      {/* Members list */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-[#F0EFEA]">
          <SettingsLabel>Members</SettingsLabel>
        </div>
        {members.map((m, i) => (
          <div
            key={m.email}
            className={`flex items-center gap-3.5 px-5 py-3.5 ${i < members.length - 1 ? 'border-b border-[#F0EFEA]' : ''}`}
          >
            <img src={m.photo} alt={m.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1C', fontFamily: FONT }}>{m.name}</p>
                {m.isYou && (
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FONT }}>
                    You
                  </span>
                )}
              </div>
              <p style={{ fontSize: '11px', color: '#AAAAAA', fontFamily: FONT }}>{m.email}</p>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FONT }}>
              {m.role}
            </span>
            {!m.isYou && (
              <button
                className="w-6 h-6 rounded-lg bg-[#F4F4F0] hover:bg-[#EBEBEB] flex items-center justify-center transition-colors ml-1"
                title="Remove member"
              >
                <X size={10} color="#888888" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Invite */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5">
        <SettingsLabel>Invite teammate</SettingsLabel>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="colleague@brand.com"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            className="flex-1 bg-[#F9F8F4] border border-[#E5E5E5] rounded-xl px-3 py-2.5 outline-none focus:border-[#AAAAAA] transition-colors"
            style={{ fontSize: '12px', color: '#1C1C1C', fontFamily: FONT }}
          />
          <button
            onClick={handleInvite}
            className="flex items-center gap-1.5 bg-[#1C1C1C] hover:bg-black text-white rounded-xl px-4 py-2.5 transition-colors shrink-0"
            style={{ fontSize: '12px', fontWeight: 600, fontFamily: FONT }}
          >
            {inviteSent ? <><Check size={12} />Sent!</> : <><Plus size={12} />Invite</>}
          </button>
        </div>
        <p style={{ fontSize: '10px', color: '#AAAAAA', marginTop: '8px', fontFamily: FONT }}>
          They'll receive an email to join your Klairo workspace.
        </p>
      </div>
    </div>
  );
}

// ── Section: Notifications ────────────────────────────────────────────
function NotificationsSection() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    dailyBrief: true, weeklyPDF: true,
    revenueAnomaly: true, stockRisk: true,
    creativeFatigue: true, budgetPacing: false,
    teamMentions: true, reportShared: true,
    aiActions: false,
  });

  const toggle = (k: string) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  const groups = [
    {
      label: 'Digest & reports',
      items: [
        { id: 'dailyBrief',  label: 'Daily Brief',             note: 'Delivered at 7:00am in your timezone' },
        { id: 'weeklyPDF',   label: 'Weekly performance PDF',   note: 'Every Monday at 8:00am' },
      ],
    },
    {
      label: 'Live alerts',
      items: [
        { id: 'revenueAnomaly',  label: 'Revenue anomaly',       note: 'Triggered when >20% swing vs prior day' },
        { id: 'stockRisk',       label: 'Stock risk warning',     note: 'Triggered when cover drops below 14 days' },
        { id: 'creativeFatigue', label: 'Creative fatigue alert', note: 'When ROAS drops >0.5x on a running ad set' },
        { id: 'budgetPacing',    label: 'Budget pacing alert',    note: 'When daily pacing is >10% off target' },
      ],
    },
    {
      label: 'Team activity',
      items: [
        { id: 'teamMentions',  label: 'Teammate mentions',      note: 'When someone @mentions you in a chat' },
        { id: 'reportShared',  label: 'Report shared with you', note: 'When a report is sent to your inbox' },
        { id: 'aiActions',     label: 'AI action completions',  note: 'When Klairo completes an autonomous action' },
      ],
    },
  ];

  return (
    <div>
      <p style={{ fontFamily: 'Merriweather, serif', fontSize: '20px', fontWeight: 400, color: '#1C1C1C', marginBottom: '4px' }}>
        Notifications
      </p>
      <p style={{ fontSize: '12px', color: '#888888', marginBottom: '24px', fontFamily: FONT }}>
        Choose what Klairo sends to alex@coastalbrand.com
      </p>

      <div className="space-y-5">
        {groups.map(g => (
          <div key={g.label} className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0EFEA]">
              <SettingsLabel>{g.label}</SettingsLabel>
            </div>
            {g.items.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-5 py-3.5 ${i < g.items.length - 1 ? 'border-b border-[#F0EFEA]' : ''}`}
              >
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#1C1C1C', fontFamily: FONT }}>{item.label}</p>
                  <p style={{ fontSize: '11px', color: '#AAAAAA', fontFamily: FONT }}>{item.note}</p>
                </div>
                <Toggle on={prefs[item.id]} onChange={() => toggle(item.id)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: API Keys ──────────────��──────────────────────────────────
function ApiSection() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regen, setRegen] = useState(false);

  const key = 'sk-klairo-prod-a8f3k2m9xv1p4q7rn6yt5u2w0e';

  const copy = () => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const regenerate = () => {
    setRegen(true);
    setTimeout(() => setRegen(false), 2200);
  };

  return (
    <div>
      <p style={{ fontFamily: 'Merriweather, serif', fontSize: '20px', fontWeight: 400, color: '#1C1C1C', marginBottom: '4px' }}>
        API Keys
      </p>
      <p style={{ fontSize: '12px', color: '#888888', marginBottom: '24px', fontFamily: FONT }}>
        Use your API key to access Klairo data in external tools and automations
      </p>

      {/* API Key card */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 mb-5">
        <SettingsLabel>Production key</SettingsLabel>

        <div className="flex items-center gap-2 bg-[#F9F8F4] border border-[#E5E5E5] rounded-xl px-4 py-3 mb-3">
          <p
            className="flex-1 font-mono truncate"
            style={{ fontSize: '12px', color: '#555555', letterSpacing: '0.04em' }}
          >
            {show ? key : '••••••••••••••••••••••••••••••••'}
          </p>
          <button
            onClick={() => setShow(v => !v)}
            className="shrink-0 px-2 py-1 border border-[#E5E5E5] rounded-lg hover:border-[#AAAAAA] transition-colors"
            style={{ fontSize: '10px', fontWeight: 600, color: '#888888', fontFamily: FONT }}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p style={{ fontSize: '10px', color: '#AAAAAA', fontFamily: FONT }}>Created Jan 20, 2026</p>
          <div className="flex items-center gap-2">
            <button
              onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E5E5] rounded-lg hover:border-[#AAAAAA] transition-colors"
              style={{ fontSize: '11px', fontWeight: 600, color: copied ? '#2E7D32' : '#555555', fontFamily: FONT }}
            >
              {copied ? <><Check size={10} />Copied!</> : <><Copy size={10} />Copy key</>}
            </button>
            <button
              onClick={regenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E5E5] rounded-lg hover:border-[#AAAAAA] transition-colors"
              style={{ fontSize: '11px', fontWeight: 600, color: regen ? '#2E7D32' : '#888888', fontFamily: FONT }}
            >
              {regen ? <><Check size={10} />Done!</> : <><RefreshCw size={10} />Regenerate</>}
            </button>
          </div>
        </div>
      </div>

      {/* Webhook */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 mb-5">
        <SettingsLabel>Webhook endpoint</SettingsLabel>
        <div className="flex items-center gap-2 bg-[#F9F8F4] border border-[#E5E5E5] rounded-xl px-4 py-3">
          <p className="flex-1 font-mono truncate" style={{ fontSize: '11px', color: '#888888' }}>
            https://api.klairo.ai/webhooks/wh_a8f3k2m9xv1p4q7
          </p>
          <button
            className="shrink-0 flex items-center gap-1 px-2 py-1 border border-[#E5E5E5] rounded-lg hover:border-[#AAAAAA] transition-colors"
            style={{ fontSize: '10px', fontWeight: 600, color: '#888888', fontFamily: FONT }}
          >
            <Copy size={9} />Copy
          </button>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 bg-[#FFFBF0] border border-[#F5E6C8] rounded-xl mb-5">
        <AlertTriangle size={13} color="#D97706" className="shrink-0 mt-0.5" />
        <p style={{ fontSize: '11px', color: '#92400E', lineHeight: 1.6, fontFamily: FONT }}>
          Keep your API key private. Do not commit it to public repositories or share it in client-side code. Regenerating a key immediately invalidates the previous one.
        </p>
      </div>

      {/* Docs link */}
      <button
        className="flex items-center gap-2 hover:text-[#1C1C1C] transition-colors"
        style={{ fontSize: '12px', fontWeight: 600, color: '#5D9DF5', fontFamily: FONT }}
      >
        <ExternalLink size={12} />View API documentation
      </button>
    </div>
  );
}

// ── Nav item ──────────────────────────────────────────────────────────
function NavLink({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-left transition-all ${
        active ? 'bg-[#EEF4FF] text-[#5D9DF5]' : 'text-[#555555] hover:bg-[#F4F4F0] hover:text-[#1C1C1C]'
      }`}
      style={{ fontSize: '13px', fontWeight: active ? 600 : 500, fontFamily: FONT }}
    >
      <span className={`shrink-0 ${active ? 'text-[#5D9DF5]' : 'text-[#888888]'}`}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5] shrink-0" />}
    </button>
  );
}

// ── Main modal ────────────────────────────────────────────────────────
export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [section, setSection] = useState<Section>('profile');

  const nav: { id: Section; icon: React.ReactNode; label: string }[] = [
    { id: 'profile',       icon: <User size={14} />,       label: 'Profile' },
    { id: 'workspace',     icon: <Building2 size={14} />,  label: 'Workspace' },
    { id: 'billing',       icon: <CreditCard size={14} />, label: 'Billing' },
    { id: 'usage',         icon: <BarChart2 size={14} />,  label: 'Usage' },
    { id: 'connections',   icon: <Plug size={14} />,       label: 'Connections' },
    { id: 'team',          icon: <Users size={14} />,      label: 'Team' },
    { id: 'notifications', icon: <Bell size={14} />,       label: 'Notifications' },
    { id: 'api',           icon: <Key size={14} />,        label: 'API Keys' },
  ];

  const sectionContent: Record<Section, React.ReactNode> = {
    profile:       <ProfileSection />,
    workspace:     <WorkspaceSection />,
    billing:       <BillingSection />,
    usage:         <UsageSection />,
    connections:   <ConnectionsSection />,
    team:          <TeamSection />,
    notifications: <NotificationsSection />,
    api:           <ApiSection />,
  };

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
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="relative bg-white flex flex-col overflow-hidden w-full h-full md:h-auto md:rounded-2xl md:border md:border-[#E5E5E5]"
            style={{ maxWidth: '760px', height: '100%', maxHeight: '100vh', boxShadow: '0 24px 72px rgba(0,0,0,0.14)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Mobile: horizontal tab bar + content stack ── */}
            <div className="md:hidden flex flex-col h-full">
              {/* Mobile header */}
              <div className="shrink-0 flex items-center justify-between px-4 py-4 border-b border-[#E5E5E5]">
                <p style={{ fontFamily: 'Merriweather, serif', fontSize: '15px', fontWeight: 400, color: '#1C1C1C' }}>Settings</p>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#F4F4F0] flex items-center justify-center">
                  <X size={12} color="#888888" />
                </button>
              </div>
              {/* Mobile scrollable tabs */}
              <div className="shrink-0 flex gap-0 overflow-x-auto border-b border-[#E5E5E5] px-2">
                {nav.map(n => (
                  <button
                    key={n.id}
                    onClick={() => setSection(n.id)}
                    className="shrink-0 flex flex-col items-center gap-1 px-3 py-3 border-b-2 transition-all"
                    style={{
                      borderColor: section === n.id ? '#1C1C1C' : 'transparent',
                      color: section === n.id ? '#1C1C1C' : '#888888',
                    }}
                  >
                    <span style={{ color: 'inherit' }}>{n.icon}</span>
                    <span style={{ fontSize: '9px', fontWeight: section === n.id ? 700 : 500, fontFamily: FONT, whiteSpace: 'nowrap' }}>{n.label}</span>
                  </button>
                ))}
              </div>
              {/* Mobile content */}
              <div className="flex-1 overflow-y-auto px-4 py-5">
                {sectionContent[section]}
              </div>
            </div>

            {/* ── Desktop: sidebar + content ── */}
            <div className="hidden md:flex h-full" style={{ height: '560px' }}>
              {/* Left nav */}
              <div
                className="shrink-0 flex flex-col bg-[#F9F8F4] border-r border-[#E5E5E5]"
                style={{ width: '188px' }}
              >
                {/* Header */}
                <div className="px-5 py-5 border-b border-[#E5E5E5]">
                  <p style={{ fontFamily: 'Merriweather, serif', fontSize: '13px', fontWeight: 400, color: '#1C1C1C' }}>
                    Settings
                  </p>
                </div>

                {/* Nav items */}
                <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                  {nav.map(n => (
                    <NavLink
                      key={n.id}
                      icon={n.icon}
                      label={n.label}
                      active={section === n.id}
                      onClick={() => setSection(n.id)}
                    />
                  ))}
                </nav>

                {/* Bottom help */}
                <div className="px-3 py-3 border-t border-[#E5E5E5]">
                  <button
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-left text-[#888888] hover:text-[#1C1C1C] hover:bg-[#F0EFEA] transition-all"
                    style={{ fontSize: '13px', fontWeight: 500, fontFamily: FONT }}
                  >
                    <HelpCircle size={14} className="text-[#888888] shrink-0" />
                    <span>Get help</span>
                    <ExternalLink size={10} className="ml-auto shrink-0 opacity-50" />
                  </button>
                </div>
              </div>

              {/* Right content */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Close button */}
                <div className="shrink-0 flex justify-end px-5 py-4 border-b border-[#F0EFEA]">
                  <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-full bg-[#F4F4F0] hover:bg-[#EBEBEB] flex items-center justify-center transition-colors"
                  >
                    <X size={12} color="#888888" />
                  </button>
                </div>

                {/* Scrollable section content */}
                <div className="flex-1 overflow-y-auto px-7 py-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={section}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {sectionContent[section]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}