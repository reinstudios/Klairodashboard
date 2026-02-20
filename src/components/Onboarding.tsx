import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Check, Loader2, Plus, X, ChevronDown,
  ShoppingBag, Package, CreditCard, Mail, DollarSign,
  Landmark, Truck, Hash, Users, Target, Eye,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/71db4ddb4dff2b50b549faea40c66d8a85b2e660.png';
import matchIllustration from 'figma:asset/644ca67a41b015cf8ee33f8c27edb772bc48f96b.png';
import seedlingIllustration from 'figma:asset/4574f38c230db3b714e3b468377d9566ac7c7007.png';
import scaleIllustration from 'figma:asset/589a33b7c63e8b2d14b29f6b0c32f8805abe47b8.png';

// ─── Design tokens ────────────────────────────────────────────────────────────
const FONT  = 'Inter, sans-serif';
const SERIF = 'Merriweather, serif';
const CREAM = '#F9F8F4';
const BLACK = '#1C1C1C';
const BLUE  = '#5D9DF5';
const GRAY1 = '#555555';
const GRAY2 = '#888888';
const GRAY3 = '#E5E5E5';
const GREEN = '#2E7D32';

// ─── Types ────────────────────────────────────────────────────────────────────
type UserType = 'business' | 'agency' | 'investor' | null;

// ─── Platform data ────────────────────────────────────────────────────────────
interface Platform {
  id: string; name: string; category: string;
  color: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}

const PLATFORMS: Platform[] = [
  // Revenue & Commerce
  { id: 'shopify',      name: 'Shopify',      category: 'Revenue & Commerce', color: '#96BF48', Icon: ShoppingBag },
  { id: 'amazon',       name: 'Amazon',       category: 'Revenue & Commerce', color: '#FF9900', Icon: Package     },
  { id: 'tiktok-shop',  name: 'TikTok Shop',  category: 'Revenue & Commerce', color: '#FE2C55', Icon: ShoppingBag },
  { id: 'stripe',       name: 'Stripe',       category: 'Revenue & Commerce', color: '#635BFF', Icon: CreditCard  },
  // Marketing & Ads
  { id: 'meta',         name: 'Meta',         category: 'Marketing & Ads',    color: '#1877F2', Icon: Users       },
  { id: 'google-ads',   name: 'Google Ads',   category: 'Marketing & Ads',    color: '#4285F4', Icon: Target      },
  { id: 'tiktok-ads',   name: 'TikTok Ads',   category: 'Marketing & Ads',    color: '#FE2C55', Icon: Eye         },
  // Email & SMS
  { id: 'klaviyo',      name: 'Klaviyo',      category: 'Email & SMS',        color: '#F1A12B', Icon: Mail        },
  // Finance
  { id: 'quickbooks',   name: 'QuickBooks',   category: 'Finance',            color: '#2CA01C', Icon: DollarSign  },
  { id: 'mercury',      name: 'Mercury',      category: 'Finance',            color: '#6B7280', Icon: Landmark    },
  // Inventory & Fulfillment
  { id: 'shipbob',      name: 'ShipBob',      category: 'Inventory',          color: '#F06527', Icon: Truck       },
  // Communications
  { id: 'slack',        name: 'Slack',        category: 'Communications',     color: '#4A154B', Icon: Hash        },
];

// ─── Step progress bar ────────────────────────────────────────────────────────
function StepProgress({ step }: { step: number }) {
  // Shown for steps 2-5 (steps 1, 6, 7 are full-canvas)
  const total = 4;
  const current = step - 1; // steps 2-5 map to 1-4
  const pct = (current / total) * 100;
  if (step < 2 || step > 5) return null;
  return (
    <div className="w-full h-0.5 bg-[#E5E5E5] fixed top-0 left-0 z-50">
      <motion.div
        className="h-full rounded-full"
        style={{ background: BLUE }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

// ─── Button components ────────────────────────────────────────────────────────
function PrimaryBtn({
  onClick, disabled = false, loading = false, children, className = '',
}: {
  onClick?: () => void; disabled?: boolean; loading?: boolean;
  children: React.ReactNode; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 px-7 py-3 rounded-full transition-all ${
        disabled || loading
          ? 'bg-[#CCCCCC] cursor-not-allowed'
          : 'bg-[#1C1C1C] hover:bg-black active:scale-[0.98]'
      } ${className}`}
      style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 600, color: 'white' }}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

function GhostBtn({
  onClick, children, className = '',
}: { onClick?: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-6 py-3 rounded-full border border-[#E5E5E5] hover:border-[#C8C8C8] transition-colors bg-white ${className}`}
      style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 500, color: GRAY1 }}
    >
      {children}
    </button>
  );
}

// ─── Pill selector ────────────────────────────────────────────────────────────
function PillSelect({
  options, value, onChange,
}: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="px-4 py-2 rounded-full border transition-all"
          style={{
            fontFamily: FONT, fontSize: '13px', fontWeight: value === opt ? 600 : 400,
            borderColor: value === opt ? BLACK : GRAY3,
            background:  value === opt ? BLACK : 'white',
            color:       value === opt ? 'white' : GRAY1,
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function TextInput({
  placeholder, value, onChange, type = 'text',
}: { placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white border border-[#E5E5E5] rounded-2xl px-5 py-3.5 outline-none transition-all focus:border-[#BBBBBB]"
      style={{ fontFamily: FONT, fontSize: '15px', color: BLACK }}
    />
  );
}

// ─── Fade-rise animation wrapper ──────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Step wrapper with slide transitions ─────────────────────────────────────
const stepVariants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 36 : -36 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -36 : 36 }),
};

// ─── STEP 2: Who are you? ─────────────────────────────────────────────────────
const USER_TYPE_CARDS = [
  {
    id: 'business' as UserType,
    illustration: matchIllustration,
    label: 'Business',
    desc: 'I run a brand or company and want full visibility into my business.',
  },
  {
    id: 'agency' as UserType,
    illustration: scaleIllustration,
    label: 'Agency',
    desc: 'I manage multiple clients and need one place to see everything.',
  },
  {
    id: 'investor' as UserType,
    illustration: seedlingIllustration,
    label: 'Investor',
    desc: 'I have portfolio companies and want automated performance visibility.',
  },
];

function Step2UserType({
  value, onChange, onContinue,
}: { value: UserType; onChange: (v: UserType) => void; onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto px-4">
      <FadeUp>
        <p className="mb-1 text-center" style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 700, color: GRAY2, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
          Step 1 of 4
        </p>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h2 className="text-center mb-2" style={{ fontFamily: SERIF, fontSize: '26px', fontWeight: 400, color: BLACK, lineHeight: 1.2 }}>
          First, tell us about you.
        </h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <p className="text-center mb-9" style={{ fontFamily: FONT, fontSize: '14px', color: GRAY1, lineHeight: 1.6 }}>
          This shapes your workspace, permissions, and first brief.
        </p>
      </FadeUp>

      <div className="w-full space-y-3 mb-8">
        {USER_TYPE_CARDS.map((card, i) => (
          <FadeUp key={card.id as string} delay={0.12 + i * 0.07}>
            <button
              onClick={() => onChange(card.id)}
              className="w-full text-left rounded-2xl border p-5 flex items-center gap-5 transition-all"
              style={{
                background:   value === card.id ? '#EEF4FF' : 'white',
                borderColor:  value === card.id ? BLUE : GRAY3,
                outline:      value === card.id ? `2px solid ${BLUE}` : '2px solid transparent',
                outlineOffset: '-1px',
              }}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                <ImageWithFallback src={card.illustration} alt={card.label} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 400, color: BLACK, marginBottom: '3px' }}>
                  {card.label}
                </p>
                <p style={{ fontFamily: FONT, fontSize: '13px', color: GRAY1, lineHeight: 1.5 }}>
                  {card.desc}
                </p>
              </div>
              {value === card.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: BLUE }}
                >
                  <Check size={11} color="white" strokeWidth={3} />
                </motion.div>
              )}
            </button>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.36} className="w-full">
        <PrimaryBtn onClick={onContinue} disabled={!value} className="w-full">
          Continue <ArrowRight size={14} />
        </PrimaryBtn>
      </FadeUp>
    </div>
  );
}

// ─── STEP 3: Business details ─────────────────────────────────────────────────
function Step3Details({
  userType, companyName, setCompanyName,
  teamSize, setTeamSize, revenue, setRevenue, onContinue,
}: {
  userType: UserType; companyName: string; setCompanyName: (v: string) => void;
  teamSize: string; setTeamSize: (v: string) => void;
  revenue: string; setRevenue: (v: string) => void;
  onContinue: () => void;
}) {
  const config = {
    business: {
      heading: 'Tell us about your business.',
      namePlaceholder: 'Company name, e.g. Chili Chews',
      sizeLabel: 'How big is your team?',
      sizeOptions: ['Just me', '2–5', '6–15', '16–50', '50+'],
      revenueLabel: 'Approximate annual revenue?',
      revenueOptions: ['Pre-revenue', 'Under $1M', '$1M–$5M', '$5M–$20M', '$20M+'],
    },
    agency: {
      heading: 'Tell us about your agency.',
      namePlaceholder: 'Agency name',
      sizeLabel: 'How many clients do you manage?',
      sizeOptions: ['1–5', '6–15', '16–30', '30+'],
      revenueLabel: 'Average client monthly spend?',
      revenueOptions: ['Under $10k', '$10k–$50k', '$50k–$200k', '$200k+'],
    },
    investor: {
      heading: 'Tell us about your portfolio.',
      namePlaceholder: 'Fund or firm name',
      sizeLabel: 'How many portfolio companies?',
      sizeOptions: ['1–5', '6–15', '16–30', '30+'],
      revenueLabel: 'Combined portfolio revenue?',
      revenueOptions: ['Under $1M', '$1M–$10M', '$10M–$50M', '$50M+'],
    },
  };
  const c = config[userType || 'business'];
  const canContinue = companyName.trim().length > 0 && teamSize && revenue;

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto px-4">
      <FadeUp>
        <p className="mb-1 text-center" style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 700, color: GRAY2, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
          Step 2 of 4
        </p>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h2 className="text-center mb-9" style={{ fontFamily: SERIF, fontSize: '26px', fontWeight: 400, color: BLACK, lineHeight: 1.2 }}>
          {c.heading}
        </h2>
      </FadeUp>

      <div className="w-full space-y-7 mb-8">
        {/* Company name */}
        <FadeUp delay={0.1} className="w-full">
          <label className="block mb-2" style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 700, color: GRAY2, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            Name
          </label>
          <TextInput placeholder={c.namePlaceholder} value={companyName} onChange={setCompanyName} />
        </FadeUp>

        {/* Team size pills */}
        <FadeUp delay={0.18} className="w-full">
          <label className="block mb-3" style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 700, color: GRAY2, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            {c.sizeLabel}
          </label>
          <PillSelect options={c.sizeOptions} value={teamSize} onChange={setTeamSize} />
        </FadeUp>

        {/* Revenue pills */}
        <FadeUp delay={0.25} className="w-full">
          <label className="block mb-3" style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 700, color: GRAY2, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            {c.revenueLabel}
          </label>
          <PillSelect options={c.revenueOptions} value={revenue} onChange={setRevenue} />
        </FadeUp>
      </div>

      <FadeUp delay={0.32} className="w-full">
        <PrimaryBtn onClick={onContinue} disabled={!canContinue} className="w-full">
          Continue <ArrowRight size={14} />
        </PrimaryBtn>
      </FadeUp>
    </div>
  );
}

// ─── STEP 4: Connect platforms ────────────────────────────────────────────────
function PlatformCard({
  platform, connected, connecting, onConnect,
}: {
  platform: Platform;
  connected: boolean;
  connecting: boolean;
  onConnect: () => void;
}) {
  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex flex-col items-center gap-3 transition-colors"
      style={{ minHeight: '116px' }}
    >
      {/* Platform icon — this is the brand-permitted place for platform color */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${platform.color}15` }}
      >
        <platform.Icon size={20} color={platform.color} strokeWidth={1.8} />
      </div>

      <p style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 600, color: BLACK, textAlign: 'center', lineHeight: 1.3 }}>
        {platform.name}
      </p>

      {connected ? (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ background: '#EDFBF0' }}
        >
          <Check size={10} color={GREEN} strokeWidth={3} />
          <span style={{ fontFamily: FONT, fontSize: '10px', fontWeight: 700, color: GREEN }}>Connected</span>
        </motion.div>
      ) : connecting ? (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: '#EEF4FF' }}>
          <Loader2 size={10} color={BLUE} className="animate-spin" />
          <span style={{ fontFamily: FONT, fontSize: '10px', fontWeight: 600, color: BLUE }}>Connecting…</span>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="px-4 py-1.5 rounded-full border border-[#E5E5E5] hover:border-[#1C1C1C] transition-all"
          style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 600, color: GRAY1 }}
        >
          Connect
        </button>
      )}
    </motion.div>
  );
}

function Step4Connect({
  connected, onConnect, onContinue,
}: {
  connected: Set<string>;
  onConnect: (id: string) => void;
  onContinue: () => void;
}) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    if (connected.has(id) || connecting === id) return;
    setConnecting(id);
    setTimeout(() => { onConnect(id); setConnecting(null); }, 1400);
  };

  const categories = Array.from(new Set(PLATFORMS.map(p => p.category)));
  const connectedCount = connected.size;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4">
      <FadeUp>
        <p className="mb-1 text-center" style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 700, color: GRAY2, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
          Step 3 of 4
        </p>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h2 className="text-center mb-2" style={{ fontFamily: SERIF, fontSize: '26px', fontWeight: 400, color: BLACK, lineHeight: 1.2 }}>
          Now the good part.
        </h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <p className="text-center mb-2" style={{ fontFamily: FONT, fontSize: '14px', color: GRAY1, lineHeight: 1.6 }}>
          Connect your tools and Klairo will start learning your business.
        </p>
      </FadeUp>

      {/* Connected counter */}
      <FadeUp delay={0.15}>
        <div className="flex items-center gap-2 mb-7">
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ background: connectedCount > 0 ? '#EEF4FF' : '#F4F4F0' }}>
            <span style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 700, color: connectedCount > 0 ? BLUE : GRAY2 }}>
              {connectedCount} of {PLATFORMS.length} connected
            </span>
          </div>
          {connectedCount >= 2 && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontFamily: FONT, fontSize: '11px', color: '#2E7D32' }}
            >
              ✓ Looking good
            </motion.span>
          )}
        </div>
      </FadeUp>

      {/* Platform categories */}
      <div className="w-full space-y-6 mb-8">
        {categories.map((cat, ci) => (
          <FadeUp key={cat} delay={0.2 + ci * 0.05}>
            <div>
              <p className="mb-3" style={{ fontFamily: FONT, fontSize: '10px', fontWeight: 700, color: GRAY2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {cat}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {PLATFORMS.filter(p => p.category === cat).map(platform => (
                  <PlatformCard
                    key={platform.id}
                    platform={platform}
                    connected={connected.has(platform.id)}
                    connecting={connecting === platform.id}
                    onConnect={() => handleConnect(platform.id)}
                  />
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      {connectedCount === 0 && (
        <FadeUp className="mb-5">
          <p style={{ fontFamily: FONT, fontSize: '12px', color: GRAY2, textAlign: 'center', lineHeight: 1.6 }}>
            The more you connect, the smarter Klairo gets.
          </p>
        </FadeUp>
      )}

      <FadeUp className="w-full">
        <PrimaryBtn
          onClick={onContinue}
          disabled={connectedCount === 0}
          className="w-full"
        >
          {connectedCount === 0
            ? 'Connect at least 1 platform'
            : `Continue with ${connectedCount} connected`}
          {connectedCount > 0 && <ArrowRight size={14} />}
        </PrimaryBtn>
      </FadeUp>

      <FadeUp delay={0.08}>
        <p className="mt-4 text-center" style={{ fontFamily: FONT, fontSize: '11px', color: GRAY2, lineHeight: 1.5 }}>
          You can always add more later in Settings.
        </p>
      </FadeUp>
    </div>
  );
}

// ─── STEP 5: Invite team ──────────────────────────────────────────────────────
const ROLES = ['Admin', 'Member', 'View only'];

function Step5Invite({ onInvite, onSkip }: { onInvite: () => void; onSkip: () => void }) {
  const [rows, setRows] = useState([{ email: '', role: 'Member' }]);
  const [loading, setLoading] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const addRow = () => setRows(r => [...r, { email: '', role: 'Member' }]);
  const removeRow = (i: number) => setRows(r => r.filter((_, idx) => idx !== i));
  const updateEmail = (i: number, v: string) => setRows(r => r.map((row, idx) => idx === i ? { ...row, email: v } : row));
  const updateRole  = (i: number, v: string) => { setRows(r => r.map((row, idx) => idx === i ? { ...row, role: v } : row)); setOpenIdx(null); };

  const hasEmail = rows.some(r => r.email.trim().length > 0);

  const handleInvite = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onInvite(); }, 900);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto px-4">
      <FadeUp>
        <p className="mb-1 text-center" style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 700, color: GRAY2, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
          Step 4 of 4
        </p>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h2 className="text-center mb-2" style={{ fontFamily: SERIF, fontSize: '26px', fontWeight: 400, color: BLACK, lineHeight: 1.2 }}>
          Who else should have access?
        </h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <p className="text-center mb-9" style={{ fontFamily: FONT, fontSize: '14px', color: GRAY1, lineHeight: 1.6 }}>
          Invite teammates now or skip and do it in Settings.
        </p>
      </FadeUp>

      <div className="w-full space-y-3 mb-6">
        {rows.map((row, i) => (
          <FadeUp key={i} delay={0.15 + i * 0.04}>
            <div className="flex gap-2 items-stretch">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="teammate@company.com"
                  value={row.email}
                  onChange={e => updateEmail(i, e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] rounded-2xl px-4 py-3 outline-none focus:border-[#BBBBBB] transition-all"
                  style={{ fontFamily: FONT, fontSize: '14px', color: BLACK }}
                />
              </div>
              {/* Role dropdown */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="h-full flex items-center gap-2 px-4 bg-white border border-[#E5E5E5] rounded-2xl hover:border-[#C8C8C8] transition-colors"
                  style={{ fontFamily: FONT, fontSize: '13px', color: GRAY1, fontWeight: 500, minWidth: '100px' }}
                >
                  {row.role} <ChevronDown size={12} color={GRAY2} />
                </button>
                <AnimatePresence>
                  {openIdx === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 top-full mt-1 bg-white border border-[#E5E5E5] rounded-xl overflow-hidden z-20"
                      style={{ minWidth: '110px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                    >
                      {ROLES.map(role => (
                        <button
                          key={role}
                          onClick={() => updateRole(i, role)}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#F4F4F0] transition-colors"
                          style={{ fontFamily: FONT, fontSize: '13px', fontWeight: row.role === role ? 600 : 400, color: row.role === role ? BLACK : GRAY1 }}
                        >
                          {role}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {rows.length > 1 && (
                <button onClick={() => removeRow(i)} className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl hover:bg-[#F4F4F0] transition-colors self-center">
                  <X size={14} color={GRAY2} />
                </button>
              )}
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Add row */}
      <FadeUp delay={0.24} className="w-full mb-8">
        <button
          onClick={addRow}
          className="flex items-center gap-2 text-left"
          style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 500, color: BLUE }}
        >
          <Plus size={14} color={BLUE} />
          Add another
        </button>
      </FadeUp>

      <FadeUp delay={0.28} className="w-full flex flex-col sm:flex-row gap-3">
        <PrimaryBtn onClick={handleInvite} loading={loading} disabled={!hasEmail} className="flex-1">
          Invite &amp; Continue
        </PrimaryBtn>
        <GhostBtn onClick={onSkip} className="flex-1 justify-center">
          Skip for now <ArrowRight size={13} />
        </GhostBtn>
      </FadeUp>
    </div>
  );
}

// ─── STEP 6: Building your brain ─────────────────────────────────────────────
type SyncState = 'queued' | 'syncing' | 'done';

function Step6Building({
  connected, onDone,
}: { connected: Set<string>; onDone: () => void }) {
  const connectedPlatforms = PLATFORMS.filter(p => connected.has(p.id));
  const [statuses, setStatuses] = useState<Record<string, SyncState>>(
    () => Object.fromEntries(connectedPlatforms.map(p => [p.id, 'queued']))
  );
  const [phase, setPhase] = useState<'running' | 'done'>('running');
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Sequence: each platform goes queued → syncing → done over time
    let elapsed = 800;
    const ids = connectedPlatforms.map(p => p.id);

    ids.forEach((id, idx) => {
      const tStart = setTimeout(() => {
        setStatuses(prev => ({ ...prev, [id]: 'syncing' }));
      }, elapsed);
      elapsed += 1600;

      const tDone = setTimeout(() => {
        setStatuses(prev => ({ ...prev, [id]: 'done' }));
      }, elapsed);
      elapsed += 600;
      timerRef.current.push(tStart, tDone);
    });

    // All done
    const tFinal = setTimeout(() => {
      setPhase('done');
      setTimeout(onDone, 1200);
    }, elapsed + 400);
    timerRef.current.push(tFinal);

    return () => timerRef.current.forEach(clearTimeout);
  }, []);

  const syncMessages: Record<string, string> = {
    shopify:     'syncing 12 months of orders',
    amazon:      'pulling marketplace data',
    'tiktok-shop': 'fetching shop analytics',
    stripe:      'importing payment history',
    meta:        'pulling campaign data',
    'google-ads': 'importing ad performance',
    'tiktok-ads': 'fetching ad campaigns',
    klaviyo:     'importing flows and segments',
    quickbooks:  'syncing financial records',
    mercury:     'connecting bank accounts',
    shipbob:     'fetching fulfillment data',
    slack:       'indexing team messages',
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4">
      {/* Brain illustration */}
      <FadeUp className="mb-8 relative">
        {/* Orbit rings */}
        <div className="relative flex items-center justify-center" style={{ width: '200px', height: '200px' }}>
          {/* Outer orbit ring */}
          <div className="absolute rounded-full border border-dashed"
            style={{ width: '190px', height: '190px', borderColor: `${BLUE}25`, animation: 'spin 18s linear infinite' }}
          />
          {/* Inner orbit ring */}
          <div className="absolute rounded-full border border-dashed"
            style={{ width: '136px', height: '136px', borderColor: `${BLUE}18`, animation: 'spin 12s linear infinite reverse' }}
          />

          {/* Center brain circle with Klairo logo */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: BLACK, boxShadow: `0 0 32px ${BLUE}30` }}
          >
            <div className="w-11 p-1">
              <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
          </div>

          {/* Orbiting platform icons — positioned at clock positions */}
          {connectedPlatforms.slice(0, 6).map((p, i) => {
            const angle = (i / Math.min(connectedPlatforms.length, 6)) * 360;
            const rad   = (angle * Math.PI) / 180;
            const r     = 88;
            const x     = 100 + r * Math.cos(rad - Math.PI / 2);
            const y     = 100 + r * Math.sin(rad - Math.PI / 2);
            const isDone = statuses[p.id] === 'done';
            const isSyncing = statuses[p.id] === 'syncing';
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 + 0.3, type: 'spring', stiffness: 300, damping: 24 }}
                className="absolute w-9 h-9 rounded-xl flex items-center justify-center border"
                style={{
                  left: `${x - 18}px`,
                  top:  `${y - 18}px`,
                  background: isDone ? '#EDFBF0' : isSyncing ? '#EEF4FF' : 'white',
                  borderColor: isDone ? '#BBE5C7' : isSyncing ? `${BLUE}40` : GRAY3,
                  boxShadow: isSyncing ? `0 0 12px ${BLUE}30` : 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                {isDone
                  ? <Check size={13} color={GREEN} strokeWidth={3} />
                  : <p.Icon size={14} color={isSyncing ? p.color : '#BBBBBB'} strokeWidth={1.8} />
                }
              </motion.div>
            );
          })}
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </FadeUp>

      {/* Heading */}
      <FadeUp delay={0.2}>
        <h2 className="text-center mb-2" style={{ fontFamily: SERIF, fontSize: '24px', fontWeight: 400, color: BLACK, lineHeight: 1.2 }}>
          Klairo is learning your business.
        </h2>
      </FadeUp>
      <FadeUp delay={0.28}>
        <p className="text-center mb-8" style={{ fontFamily: FONT, fontSize: '14px', color: GRAY1, lineHeight: 1.65, maxWidth: '340px' }}>
          We're pulling data from your connected tools, reconciling the numbers, and building your first brief.
        </p>
      </FadeUp>

      {/* Status feed */}
      <FadeUp delay={0.35} className="w-full bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden mb-7">
        <div className="px-5 py-3.5 border-b border-[#F0F0F0]">
          <p style={{ fontFamily: FONT, fontSize: '10px', fontWeight: 700, color: GRAY2, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            Sync status
          </p>
        </div>
        <div className="divide-y divide-[#F8F8F6]">
          {connectedPlatforms.map((p, i) => {
            const s = statuses[p.id];
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.4 }}
                className="flex items-center gap-3 px-5 py-3"
              >
                {/* Status dot */}
                <div className="shrink-0">
                  {s === 'done' ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: GREEN }}
                    >
                      <Check size={9} color="white" strokeWidth={3} />
                    </motion.div>
                  ) : s === 'syncing' ? (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: `${BLUE}20` }}>
                      <Loader2 size={9} color={BLUE} className="animate-spin" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-[#E5E5E5]" />
                  )}
                </div>

                {/* Platform name */}
                <span style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 500, color: s === 'queued' ? GRAY2 : BLACK, flex: 1 }}>
                  {p.name}
                </span>

                {/* Message */}
                <span style={{ fontFamily: FONT, fontSize: '11px', color: s === 'done' ? GREEN : s === 'syncing' ? BLUE : '#CCCCCC' }}>
                  {s === 'done'    ? 'Done ✓' :
                   s === 'syncing' ? `${syncMessages[p.id] || 'syncing…'}` :
                   'Queued'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </FadeUp>

      <FadeUp delay={0.5} className="w-full">
        <GhostBtn onClick={onDone} className="w-full justify-center">
          We'll email you when it's ready
        </GhostBtn>
        <p className="text-center mt-3" style={{ fontFamily: FONT, fontSize: '11px', color: GRAY2 }}>
          This usually takes a few minutes.
        </p>
      </FadeUp>
    </div>
  );
}

// ─── STEP 7: Brain is ready ───────────────────────────────────────────────────
function Confetti() {
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 3 + Math.random() * 4,
    delay: Math.random() * 0.8,
    dur: 1.8 + Math.random() * 1.2,
    color: [BLUE, BLACK, '#D1E9FF', GRAY3, '#FFFFFF'][i % 5],
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '110%', opacity: 1, x: `${p.x}vw` }}
          animate={{ y: '-20%', opacity: [1, 1, 0] }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.5 }}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: p.color, bottom: 0, left: 0 }}
        />
      ))}
    </div>
  );
}

function Step7Ready({
  companyName, connected, onEnterDashboard,
}: { companyName: string; connected: Set<string>; onEnterDashboard: () => void }) {
  const connectedCount = connected.size;
  return (
    <div className="relative flex flex-col items-center w-full max-w-sm mx-auto px-4 overflow-hidden">
      <Confetti />
      <div className="relative z-10 flex flex-col items-center">
        {/* Heading */}
        <FadeUp delay={0.25}>
          <h2 className="text-center mb-3" style={{ fontFamily: SERIF, fontSize: '28px', fontWeight: 400, color: BLACK, lineHeight: 1.15 }}>
            Your business brain<br />is ready.
          </h2>
        </FadeUp>

        <FadeUp delay={0.35}>
          <p className="text-center mb-8" style={{ fontFamily: FONT, fontSize: '14px', color: GRAY1, lineHeight: 1.65 }}>
            {companyName ? `${companyName}'s first brief is waiting.` : 'Your first brief is waiting.'}{' '}
            {connectedCount} platform{connectedCount !== 1 ? 's' : ''} connected and syncing.
          </p>
        </FadeUp>

        {/* Connected platforms summary */}
        <FadeUp delay={0.42} className="w-full mb-8">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
            <p className="mb-3" style={{ fontFamily: FONT, fontSize: '10px', fontWeight: 700, color: GRAY2, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              Connected
            </p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.filter(p => connected.has(p.id)).map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E5E5] bg-[#FAFAF8]"
                >
                  <p.Icon size={11} color={p.color} strokeWidth={2} />
                  <span style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 500, color: GRAY1 }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.5} className="w-full">
          <PrimaryBtn onClick={onEnterDashboard} className="w-full">
            Open Klairo <ArrowRight size={14} />
          </PrimaryBtn>
        </FadeUp>
      </div>
    </div>
  );
}

// ─── Main Onboarding orchestrator ─────────────────────────────────────────────
export function Onboarding() {
  const navigate = useNavigate();

  const [step,        setStep]        = useState(2);
  const [direction,   setDirection]   = useState(1);
  const [userType,    setUserType]    = useState<UserType>(null);
  const [companyName, setCompanyName] = useState('');
  const [teamSize,    setTeamSize]    = useState('');
  const [revenue,     setRevenue]     = useState('');
  const [connected,   setConnected]   = useState<Set<string>>(new Set());

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const addPlatform = (id: string) =>
    setConnected(prev => new Set([...prev, id]));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: CREAM, fontFamily: FONT }}
    >
      {/* Subtle dot-grid backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #1C1C1C 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.025,
        }}
      />

      {/* Progress bar */}
      <StepProgress step={step} />

      {/* Back button (steps 3-5) */}
      {step >= 3 && step <= 5 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => goTo(step - 1)}
          className="fixed top-4 left-4 flex items-center gap-1.5 z-40"
          style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 500, color: GRAY2 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 13L5 8L10 3" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </motion.button>
      )}

      {/* Logo (steps 2-5 top-right) */}
      {step >= 2 && step <= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-3 right-4 w-14 z-40 opacity-60"
        >
          <ImageWithFallback src={logoImage} alt="Klairo" className="w-full h-auto object-contain" />
        </motion.div>
      )}

      {/* Step content */}
      <div className="relative z-10 w-full py-12 flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="w-full px-4"
          >
            {step === 2 && (
              <Step2UserType
                value={userType}
                onChange={setUserType}
                onContinue={() => goTo(3)}
              />
            )}
            {step === 3 && (
              <Step3Details
                userType={userType}
                companyName={companyName} setCompanyName={setCompanyName}
                teamSize={teamSize}       setTeamSize={setTeamSize}
                revenue={revenue}         setRevenue={setRevenue}
                onContinue={() => goTo(4)}
              />
            )}
            {step === 4 && (
              <Step4Connect
                connected={connected}
                onConnect={addPlatform}
                onContinue={() => goTo(5)}
              />
            )}
            {step === 5 && (
              <Step5Invite
                onInvite={() => goTo(6)}
                onSkip={() => goTo(6)}
              />
            )}
            {step === 6 && (
              <Step6Building
                connected={connected}
                onDone={() => goTo(7)}
              />
            )}
            {step === 7 && (
              <Step7Ready
                companyName={companyName}
                connected={connected}
                onEnterDashboard={() => navigate('/dashboard')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Onboarding;