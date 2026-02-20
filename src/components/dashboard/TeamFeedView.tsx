import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check, X, FileText, AlertTriangle, Zap, TrendingUp,
  BarChart2, Mail, ShoppingBag, Plug, UserPlus,
} from 'lucide-react';

const FONT = 'Inter, sans-serif';

// ── Members ───────────────────────────────────────────────────────────
const MEMBERS = {
  alex: {
    name: 'Alex Chen',
    role: 'Owner',
    photo: 'https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120&q=80',
    initials: 'AC',
  },
  sarah: {
    name: 'Sarah Chen',
    role: 'Admin',
    photo: 'https://images.unsplash.com/photo-1758600587839-56ba05596c69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120&q=80',
    initials: 'SC',
  },
  james: {
    name: 'James Rivera',
    role: 'Member',
    photo: 'https://images.unsplash.com/photo-1708364171715-16eaf0b2d8dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120&q=80',
    initials: 'JR',
  },
};

// ── Pending sign-off data ─────────────────────────────────────────────
interface Signoff {
  id: string;
  requester: keyof typeof MEMBERS;
  title: string;
  subtitle: string;
  meta: string;
  time: string;
  status: 'pending' | 'approved' | 'declined';
}

const INITIAL_SIGNOFFS: Signoff[] = [
  {
    id: 'vs-1',
    requester: 'sarah',
    title: 'Q1 Revenue Report',
    subtitle: 'Klairo-generated PDF · Jan 1 – Mar 31, 2026',
    meta: '52 pages · includes channel breakdown, MER trend, and AOV analysis',
    time: '14 minutes ago',
    status: 'pending',
  },
  {
    id: 'vs-2',
    requester: 'james',
    title: 'Scale Meta Ads Budget',
    subtitle: 'Klairo AI recommendation · $1,200 → $1,800 / day',
    meta: 'Based on 7-day ROAS of 4.6x — projected +$9,200 incremental revenue',
    time: '2 hours ago',
    status: 'pending',
  },
];

// ── Timeline data ─────────────────────────────────────────────────────
type EventType = 'report' | 'alert' | 'analysis' | 'budget' | 'insight' | 'connect' | 'access';
type Actor = keyof typeof MEMBERS | 'klairo';

interface TimelineEvent {
  id: string;
  actor: Actor;
  action: string;
  detail: string;
  tag: string;
  time: string;
  type: EventType;
  group: 'today' | 'yesterday' | 'feb18';
}

const EVENTS: TimelineEvent[] = [
  {
    id: 'e1',
    actor: 'alex',
    action: 'exported the Q4 Annual Revenue Review',
    detail: 'PDF · 24 pages · sent to your inbox',
    tag: 'Report',
    time: '5m ago',
    type: 'report',
    group: 'today',
  },
  {
    id: 'e2',
    actor: 'klairo',
    action: 'flagged a revenue anomaly on Meta Ads',
    detail: 'ROAS dropped 0.6x vs your 7-day average — creative fatigue suspected',
    tag: 'Alert',
    time: '22m ago',
    type: 'alert',
    group: 'today',
  },
  {
    id: 'e3',
    actor: 'sarah',
    action: 'ran a TikTok Shop ROAS analysis',
    detail: 'Shop ads — Feb 1–20, 2026 · avg ROAS 3.1x',
    tag: 'Analysis',
    time: '1h ago',
    type: 'analysis',
    group: 'today',
  },
  {
    id: 'e4',
    actor: 'alex',
    action: 'updated Meta Ads daily budget',
    detail: '$1,200 → $1,500 / day · effective immediately',
    tag: 'Budget',
    time: '2h ago',
    type: 'budget',
    group: 'today',
  },
  {
    id: 'e5',
    actor: 'james',
    action: 'shared the Klaviyo welcome series performance',
    detail: '31.4% open rate · 8.7% click rate · $4.20 revenue per recipient',
    tag: 'Analysis',
    time: '3h ago',
    type: 'analysis',
    group: 'today',
  },
  {
    id: 'e6',
    actor: 'klairo',
    action: 'delivered the weekly MER breakdown',
    detail: 'MER 3.4x — up from 3.1x last week · Shopify revenue $98,400',
    tag: 'Insight',
    time: '7:00am',
    type: 'insight',
    group: 'yesterday',
  },
  {
    id: 'e7',
    actor: 'sarah',
    action: 'generated the Q1 product margin report',
    detail: 'Gross margin 64% · up 3pts vs Q4 2025 · top SKU: Coastal Linen Tee',
    tag: 'Report',
    time: '11:42am',
    type: 'report',
    group: 'yesterday',
  },
  {
    id: 'e8',
    actor: 'james',
    action: 'connected Google Ads to the workspace',
    detail: 'Performance Max campaigns now syncing · first data in ~4h',
    tag: 'Integration',
    time: '9:18am',
    type: 'connect',
    group: 'yesterday',
  },
  {
    id: 'e9',
    actor: 'alex',
    action: 'invited Sarah Chen to join the workspace',
    detail: 'Admin access · accepted 3 minutes later',
    tag: 'Team',
    time: 'Feb 18',
    type: 'access',
    group: 'feb18',
  },
];

// ── Dot styles ────────────────────────────────────────────────────────
function getDotColor(actor: Actor, type: EventType): string {
  if (type === 'alert') return '#D32F2F';
  if (actor === 'klairo') return '#5D9DF5';
  return '#CCCCCC';
}

function getDotIcon(type: EventType, actor: Actor) {
  if (actor === 'klairo' && type === 'alert') return <AlertTriangle size={8} color="white" />;
  if (actor === 'klairo' && type === 'insight') return <Zap size={8} color="white" />;
  if (actor === 'klairo') return <Zap size={8} color="white" />;
  return null;
}

// ── Icon for event type ───────────────────────────────────────────────
function EventIcon({ type }: { type: EventType }) {
  const cls = 'text-[#888888]';
  if (type === 'report')   return <FileText size={12} className={cls} />;
  if (type === 'alert')    return <AlertTriangle size={12} className="text-[#D32F2F]" />;
  if (type === 'analysis') return <BarChart2 size={12} className={cls} />;
  if (type === 'budget')   return <TrendingUp size={12} className={cls} />;
  if (type === 'insight')  return <Zap size={12} className="text-[#5D9DF5]" />;
  if (type === 'connect')  return <Plug size={12} className={cls} />;
  if (type === 'access')   return <UserPlus size={12} className={cls} />;
  return <FileText size={12} className={cls} />;
}

// ── Label pill ────────────────────────────────────────────────────────
function TagPill({ label, type }: { label: string; type: EventType }) {
  return (
    <span
      className="px-2 py-0.5 rounded-md bg-[#F4F4F0]"
      style={{
        fontSize: '9px',
        fontWeight: 700,
        color: '#888888',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontFamily: FONT,
      }}
    >
      {label}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────
function Avatar({ actor, size = 28 }: { actor: Actor; size?: number }) {
  if (actor === 'klairo') {
    return (
      <div
        className="rounded-full bg-[#5D9DF5] flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <Zap size={size * 0.42} color="white" />
      </div>
    );
  }
  const m = MEMBERS[actor];
  return (
    <img
      src={m.photo}
      alt={m.name}
      className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

// ── Signoff card ──────────────────────────────────────────────────────
function SignoffCard({
  signoff,
  onApprove,
  onDecline,
}: {
  signoff: Signoff;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const requester = MEMBERS[signoff.requester];
  const { status } = signoff;

  return (
    <motion.div
      layout
      className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
    >
      {/* Top strip */}
      <div className="px-5 pt-5 pb-4">
        {/* Requested by */}
        <p style={{
          fontSize: '10px', fontWeight: 700, color: '#888888',
          textTransform: 'uppercase', letterSpacing: '0.09em',
          fontFamily: FONT, marginBottom: '8px',
        }}>
          Requested by
        </p>

        <div className="flex items-center gap-2.5 mb-4">
          <img
            src={requester.photo}
            alt={requester.name}
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#1C1C1C', fontFamily: FONT }}>{requester.name}</p>
            <p style={{ fontSize: '10px', color: '#AAAAAA', fontFamily: FONT }}>{requester.role} · {signoff.time}</p>
          </div>
        </div>

        {/* Title */}
        <p style={{
          fontFamily: 'Merriweather, serif',
          fontSize: '16px',
          fontWeight: 400,
          color: '#1C1C1C',
          marginBottom: '4px',
        }}>
          {signoff.title}
        </p>
        <p style={{ fontSize: '11px', color: '#888888', fontFamily: FONT, marginBottom: '3px' }}>
          {signoff.subtitle}
        </p>
        <p style={{ fontSize: '11px', color: '#AAAAAA', fontFamily: FONT, lineHeight: 1.5 }}>
          {signoff.meta}
        </p>
      </div>

      {/* Action strip */}
      <div className="px-5 pb-5">
        {status === 'pending' && (
          <div className="flex gap-2 pt-4 border-t border-[#F0EFEA]">
            <button
              onClick={() => onApprove(signoff.id)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#1C1C1C] hover:bg-black text-white rounded-xl py-2.5 transition-colors"
              style={{ fontSize: '12px', fontWeight: 600, fontFamily: FONT }}
            >
              <Check size={12} strokeWidth={2.5} />
              Approve
            </button>
            <button
              onClick={() => onDecline(signoff.id)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-[#E5E5E5] hover:border-[#AAAAAA] rounded-xl py-2.5 transition-colors"
              style={{ fontSize: '12px', fontWeight: 600, color: '#555555', fontFamily: FONT }}
            >
              <X size={12} strokeWidth={2.5} />
              Decline
            </button>
          </div>
        )}

        {status === 'approved' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 pt-4 border-t border-[#F0EFEA]"
          >
            <div className="w-6 h-6 rounded-full bg-[#F0FAF1] flex items-center justify-center">
              <Check size={11} strokeWidth={3} className="text-[#2E7D32]" />
            </div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#2E7D32', fontFamily: FONT }}>
              Approved by you
            </p>
            <p style={{ fontSize: '11px', color: '#AAAAAA', fontFamily: FONT }}>· just now</p>
          </motion.div>
        )}

        {status === 'declined' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between pt-4 border-t border-[#F0EFEA]"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#F4F4F0] flex items-center justify-center">
                <X size={10} strokeWidth={2.5} color="#888888" />
              </div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#888888', fontFamily: FONT }}>
                Declined
              </p>
            </div>
            <button
              onClick={() => onApprove(signoff.id)}
              style={{ fontSize: '11px', fontWeight: 600, color: '#5D9DF5', fontFamily: FONT }}
            >
              Undo
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Timeline event row ──────────��─────────────────────────────────────
function EventRow({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const actor = event.actor === 'klairo' ? null : MEMBERS[event.actor as keyof typeof MEMBERS];
  const dotColor = getDotColor(event.actor, event.type);

  return (
    <div className="flex items-start gap-0 group">
      {/* Left: dot + line */}
      <div className="flex flex-col items-center shrink-0" style={{ width: '32px' }}>
        <div
          className="rounded-full flex items-center justify-center shrink-0 mt-0.5 relative z-10"
          style={{
            width: '10px', height: '10px',
            background: dotColor,
            marginTop: '7px',
          }}
        />
        {!isLast && (
          <div className="flex-1 w-px bg-[#E5E5E5] mt-1" style={{ minHeight: '32px' }} />
        )}
      </div>

      {/* Right: content */}
      <div className={`flex-1 pb-5 pl-3 ${!isLast ? '' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {/* Avatar */}
            <Avatar actor={event.actor} size={24} />

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C1C1C', fontFamily: FONT }}>
                  {event.actor === 'klairo' ? 'Klairo AI' : actor!.name}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 400, color: '#555555', fontFamily: FONT }}>
                  {event.action}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <TagPill label={event.tag} type={event.type} />
                <p style={{ fontSize: '11px', color: '#888888', fontFamily: FONT }}>
                  {event.detail}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <p
            className="shrink-0"
            style={{ fontSize: '11px', color: '#AAAAAA', fontFamily: FONT, paddingTop: '2px', whiteSpace: 'nowrap' }}
          >
            {event.time}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Group header ──────────────────────────────────────────────────────
function GroupHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-3 mb-1">
      <p style={{
        fontSize: '10px', fontWeight: 700, color: '#888888',
        textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: FONT,
      }}>
        {label}
      </p>
      <div className="flex-1 h-px bg-[#EBEBEB]" />
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────
function SectionLabel({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <p style={{
        fontSize: '10px', fontWeight: 700, color: '#888888',
        textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: FONT,
      }}>
        {children}
      </p>
      {count !== undefined && (
        <span
          className="flex items-center justify-center bg-[#1C1C1C] text-white rounded-full"
          style={{ width: '16px', height: '16px', fontSize: '9px', fontWeight: 700, fontFamily: FONT }}
        >
          {count}
        </span>
      )}
      <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5] shrink-0" />
    </div>
  );
}

// ── Main TeamFeedView ──────────────────────────────────────────────────
export function TeamFeedView() {
  const [signoffs, setSignoffs] = useState<Signoff[]>(INITIAL_SIGNOFFS);

  const pendingCount = signoffs.filter(s => s.status === 'pending').length;

  const handleApprove = (id: string) =>
    setSignoffs(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));

  const handleDecline = (id: string) =>
    setSignoffs(prev => prev.map(s => s.id === id ? { ...s, status: 'declined' } : s));

  const groupedEvents = {
    today: EVENTS.filter(e => e.group === 'today'),
    yesterday: EVENTS.filter(e => e.group === 'yesterday'),
    feb18: EVENTS.filter(e => e.group === 'feb18'),
  };

  return (
    <div
      className="flex-1 h-full overflow-y-auto bg-[#F9F8F4]"
      style={{ fontFamily: FONT }}
    >
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mb-8"
        >
          <h1 style={{
            fontFamily: 'Merriweather, serif',
            fontSize: '26px',
            fontWeight: 400,
            color: '#1C1C1C',
            marginBottom: '4px',
          }}>
            Team Feed
          </h1>
          <p style={{ fontSize: '13px', color: '#888888', fontFamily: FONT }}>
            Coastal Brand Co. · 3 members · Today, Feb 20, 2026
          </p>
        </motion.div>

        {/* ── Pending sign-offs ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.07 }}
          className="mb-10"
        >
          <SectionLabel count={pendingCount}>Awaiting your review</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signoffs.map(s => (
              <SignoffCard
                key={s.id}
                signoff={s}
                onApprove={handleApprove}
                onDecline={handleDecline}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Activity timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.14 }}
        >
          <SectionLabel>Activity</SectionLabel>

          {/* Today */}
          <GroupHeader label="Today" />
          <div className="mb-4">
            {groupedEvents.today.map((e, i) => (
              <EventRow
                key={e.id}
                event={e}
                isLast={i === groupedEvents.today.length - 1}
              />
            ))}
          </div>

          {/* Yesterday */}
          <GroupHeader label="Yesterday" />
          <div className="mb-4">
            {groupedEvents.yesterday.map((e, i) => (
              <EventRow
                key={e.id}
                event={e}
                isLast={i === groupedEvents.yesterday.length - 1}
              />
            ))}
          </div>

          {/* Feb 18 */}
          <GroupHeader label="Feb 18" />
          <div>
            {groupedEvents.feb18.map((e, i) => (
              <EventRow
                key={e.id}
                event={e}
                isLast={true}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}