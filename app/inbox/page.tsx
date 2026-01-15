'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  Globe,
  MapPin,
  Search,
  SlidersHorizontal,
  ArrowRight,
  User2,
  Send,
  Link as LinkIcon,
  Home,
  Check,
  Star,
  Flag,
} from 'lucide-react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatRelative(dateLike: any) {
  const d = dateLike ? new Date(dateLike) : null;
  if (!d || Number.isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const s = Math.max(0, Math.floor(diff / 1000));
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const days = Math.floor(h / 24);
  if (days >= 7) return d.toLocaleDateString();
  if (days >= 1) return `${days}d ago`;
  if (h >= 1) return `${h}h ago`;
  if (m >= 1) return `${m}m ago`;
  return 'just now';
}

function prettySkill(slug: string) {
  const raw = (slug ?? '').trim();
  if (!raw) return 'Unknown topic';
  return raw
    .replace(/-/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function Pill({
  icon,
  children,
  tone = 'plain',
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  tone?: 'plain' | 'info' | 'good' | 'warn' | 'bad';
}) {
  const bg =
    tone === 'good'
      ? 'bg-emerald-100'
      : tone === 'info'
        ? 'bg-sky-100'
        : tone === 'warn'
          ? 'bg-yellow-100'
          : tone === 'bad'
            ? 'bg-red-100'
            : 'bg-white';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border-2 border-black/60 px-3 py-1 text-[11px] font-extrabold text-black',
        bg,
        'shadow-[0_6px_0_rgba(0,0,0,0.08)]'
      )}
    >
      {icon}
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? 'pending').toLowerCase();
  const tone = s === 'accepted' ? 'good' : s === 'rejected' ? 'bad' : 'warn';
  const label =
    s === 'accepted' ? 'Accepted' : s === 'rejected' ? 'Rejected' : 'Pending';

  return (
    <Pill
      tone={tone as any}
      icon={
        s === 'accepted' ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : s === 'rejected' ? (
          <XCircle className="h-3.5 w-3.5" />
        ) : (
          <Clock className="h-3.5 w-3.5" />
        )
      }
    >
      {label}
    </Pill>
  );
}

function StarRow({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          className={cn(
            'rounded-xl border-2 border-black/60 bg-white p-2 shadow-[0_8px_0_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 active:translate-y-0',
            disabled && 'opacity-60 hover:translate-y-0',
            n <= value && 'bg-yellow-100'
          )}
          aria-label={`${n} star`}
        >
          <Star className={cn('h-4 w-4', n <= value ? 'fill-black' : '')} />
        </button>
      ))}
    </div>
  );
}

export default function InboxPage() {
  const { data: session } = useSession();
  const me = (session?.user?.email ?? '').toLowerCase();

  const [requests, setRequests] = useState<any[]>([]);
  const [sessions, setSessions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState<string | null>(null);

  const [meetingDraft, setMeetingDraft] = useState<Record<string, string>>({});
  const [meetingBusy, setMeetingBusy] = useState<string | null>(null);

  const [finishBusy, setFinishBusy] = useState<string | null>(null);

  const [ratingDraft, setRatingDraft] = useState<Record<string, number>>({});
  const [ratingBusy, setRatingBusy] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'accepted' | 'rejected'
  >('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    fetch('/api/inbox', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const incoming = data.incoming ?? [];
        const outgoing = data.outgoing ?? [];

        setRequests([
          ...incoming.map((r: any) => ({ ...r, direction: 'incoming' })),
          ...outgoing.map((r: any) => ({ ...r, direction: 'outgoing' })),
        ]);

        setSessions(data.sessions ?? {});
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const pending = requests.filter((r) => (r.status ?? 'pending') === 'pending').length;
    const accepted = requests.filter((r) => r.status === 'accepted').length;
    const rejected = requests.filter((r) => r.status === 'rejected').length;
    return { total: requests.length, pending, accepted, rejected };
  }, [requests]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...requests];

    if (statusFilter !== 'all') {
      list = list.filter((r) => (r.status ?? 'pending') === statusFilter);
    }

    if (q) {
      list = list.filter((r) => {
        const from = (r.from ?? '').toLowerCase();
        const to = (r.to ?? '').toLowerCase();
        const skill = (r.skillSlug ?? '').toLowerCase();
        const msg = (r.message ?? '').toLowerCase();
        const timeWindow = (r.timeWindow ?? '').toLowerCase();
        const format = (r.format ?? '').toLowerCase();
        const dir = (r.direction ?? '').toLowerCase();
        return (
          from.includes(q) ||
          to.includes(q) ||
          skill.includes(q) ||
          msg.includes(q) ||
          timeWindow.includes(q) ||
          format.includes(q) ||
          dir.includes(q)
        );
      });
    }

    list.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sort === 'newest' ? db - da : da - db;
    });

    return list;
  }, [requests, query, statusFilter, sort]);

  if (loading) {
    return <div className="mt-20 text-center text-sm font-semibold">Loading inbox…</div>;
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pb-24 pt-14 text-black">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-200/55 via-white to-emerald-200/55" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-4 py-2 shadow-[0_10px_0_rgba(0,0,0,0.10)]">
              <Inbox className="h-4 w-4" />
              <div className="text-sm font-black">Inbox</div>
            </div>
            <div className="mt-3 text-3xl font-black tracking-tight">Session requests</div>
            <div className="mt-2 text-sm font-semibold text-black/70">
              Accept, reject, share meeting details, and finish classes (then rate the tutor).
            </div>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-2">
            <Pill tone="plain">
              <span className="text-black/60">Total:</span> {stats.total}
            </Pill>
            <Pill tone="warn">
              <span className="text-black/60">Pending:</span> {stats.pending}
            </Pill>
            <Pill tone="good">
              <span className="text-black/60">Accepted:</span> {stats.accepted}
            </Pill>
            <Pill tone="bad">
              <span className="text-black/60">Rejected:</span> {stats.rejected}
            </Pill>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 rounded-[28px] border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)] md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by email, topic, message, time window…"
                className="w-full rounded-2xl border-2 border-black/60 bg-white py-3 pl-10 pr-3 text-sm font-semibold shadow-[0_8px_0_rgba(0,0,0,0.08)] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/60 bg-white px-3 py-2 shadow-[0_8px_0_rgba(0,0,0,0.08)]">
                <SlidersHorizontal className="h-4 w-4 text-black/60" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent text-sm font-extrabold focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/60 bg-white px-3 py-2 shadow-[0_8px_0_rgba(0,0,0,0.08)]">
                <CalendarDays className="h-4 w-4 text-black/60" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="bg-transparent text-sm font-extrabold focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs font-semibold text-black/60">
            Showing <span className="font-black">{filtered.length}</span> of{' '}
            <span className="font-black">{requests.length}</span> requests
          </div>
        </div>

        {/* Empty */}
        {!filtered.length ? (
          <div className="mt-10 rounded-[34px] border-2 border-black/70 bg-white p-8 text-center shadow-[0_18px_0_rgba(0,0,0,0.10)]">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black/70 bg-white shadow-[0_10px_0_rgba(0,0,0,0.10)]">
              <Inbox className="h-6 w-6" />
            </div>
            <div className="mt-4 text-xl font-black">No matches</div>
            <div className="mt-2 text-sm font-semibold text-black/70">
              Try a different search or switch the filter.
            </div>

            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => {
                  setQuery('');
                  setStatusFilter('all');
                }}
                className="rounded-[16px] border-2 border-black bg-black px-5 py-2 text-sm font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.18)]"
              >
                Reset
              </button>
              <Link
                href="/explore"
                className="rounded-[16px] border-2 border-black/70 bg-white px-5 py-2 text-sm font-extrabold shadow-[0_10px_0_rgba(0,0,0,0.10)]"
              >
                Find people
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {filtered.map((r) => {
              const status = (r.status ?? 'pending') as string;
              const isPending = status === 'pending';

              const isOutgoing = r.direction === 'outgoing';
              const otherEmail = isOutgoing ? r.to : r.from;

              const created = formatRelative(r.createdAt);
              const topic = prettySkill(r.skillSlug);

              const fmt =
                r.format === 'in-person'
                  ? 'In person'
                  : r.format === 'online'
                    ? 'Online'
                    : null;

              const sessionKey = String(r.sessionId ?? '');
              const sess = sessionKey ? sessions[sessionKey] : null;

              const isTutor = me && (r.to ?? '').toLowerCase() === me; // receiver/tutor
              const isRequester = me && (r.from ?? '').toLowerCase() === me;

              const sessionStatus = (sess?.status ?? 'active') as string;
              const isCompleted = sessionStatus === 'completed';

              const finishedFrom = !!sess?.finishedBy?.from;
              const finishedTo = !!sess?.finishedBy?.to;

              const iFinished = isRequester ? finishedFrom : isTutor ? finishedTo : false;
              const otherFinished = isRequester ? finishedTo : isTutor ? finishedFrom : false;

              const canEditMeeting =
                status === 'accepted' && !!sess && !isCompleted && isTutor;

              const meetingLabel =
                (r.format ?? '').toLowerCase() === 'in-person'
                  ? 'Address'
                  : 'Meeting link';

              const meetingIcon =
                (r.format ?? '').toLowerCase() === 'in-person'
                  ? <Home className="h-4 w-4" />
                  : <LinkIcon className="h-4 w-4" />;

              const meetingValue = sess?.meetingPlace?.value ?? '';

              const canFinish =
                status === 'accepted' && !!sess && !isCompleted && (isTutor || isRequester);

              const canRate =
                status === 'accepted' &&
                !!sess &&
                isCompleted &&
                isRequester &&
                !sess?.rated;

              const ratingValue = ratingDraft[sessionKey] ?? 0;

              return (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[30px] border-2 border-black/70 bg-white p-5 shadow-[0_16px_0_rgba(0,0,0,0.10)] md:p-6"
                >
                  {/* Top row */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-lg font-black tracking-tight">{topic}</div>

                        <StatusBadge status={status} />

                        {created && (
                          <Pill tone="plain" icon={<Clock className="h-3.5 w-3.5" />}>
                            {created}
                          </Pill>
                        )}

                        {isOutgoing ? (
                          <Pill tone="info" icon={<Send className="h-3.5 w-3.5" />}>
                            Sent
                          </Pill>
                        ) : null}

                        {status === 'accepted' && sess ? (
                          <Pill
                            tone={isCompleted ? 'plain' : 'good'}
                            icon={<Flag className="h-3.5 w-3.5" />}
                          >
                            {isCompleted ? 'Completed' : 'Active session'}
                          </Pill>
                        ) : null}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-black/70">
                        <span className="inline-flex items-center gap-2">
                          <User2 className="h-4 w-4 text-black/50" />
                          <span className="text-black/50 font-extrabold">
                            {isOutgoing ? 'To:' : 'From:'}
                          </span>
                          <span className="font-black text-black">{otherEmail}</span>
                        </span>

                        <span className="text-black/30">•</span>

                        <span className="text-black/60">
                          Request ID:{' '}
                          <span className="font-black text-black/80">
                            {String(r._id).slice(-8)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Link
                        href={`/profiles/${encodeURIComponent(otherEmail)}`}
                        className="rounded-[16px] border-2 border-black/70 bg-white px-4 py-2 text-sm font-extrabold shadow-[0_10px_0_rgba(0,0,0,0.10)] transition hover:-translate-y-0.5 active:translate-y-0"
                      >
                        View profile
                      </Link>

                      {!isOutgoing && isPending ? (
                        <>
                          <button
                            disabled={busyId === r._id}
                            onClick={() => updateStatus(r._id, 'accepted')}
                            className={cn(
                              'rounded-[16px] border-2 border-black bg-emerald-200 px-4 py-2 text-sm font-extrabold shadow-[0_10px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 active:translate-y-0',
                              busyId === r._id && 'opacity-70'
                            )}
                          >
                            {busyId === r._id ? 'Saving…' : 'Accept'}
                          </button>

                          <button
                            disabled={busyId === r._id}
                            onClick={() => updateStatus(r._id, 'rejected')}
                            className={cn(
                              'rounded-[16px] border-2 border-black bg-red-200 px-4 py-2 text-sm font-extrabold shadow-[0_10px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 active:translate-y-0',
                              busyId === r._id && 'opacity-70'
                            )}
                          >
                            {busyId === r._id ? 'Saving…' : 'Reject'}
                          </button>
                        </>
                      ) : status === 'accepted' ? (
                        <Link
                          href={`/messages?to=${encodeURIComponent(otherEmail)}&skill=${encodeURIComponent(
                            r.skillSlug ?? ''
                          )}`}
                          className="rounded-[16px] border-2 border-black bg-black px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Message <ArrowRight className="ml-1 inline h-4 w-4" />
                        </Link>
                      ) : isOutgoing && isPending ? (
                        <div className="rounded-[16px] border-2 border-black/50 bg-white px-4 py-2 text-sm font-extrabold text-black/60 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                          Waiting…
                        </div>
                      ) : (
                        <div className="rounded-[16px] border-2 border-black/50 bg-white px-4 py-2 text-sm font-extrabold text-black/60 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                          Closed
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border-2 border-black/60 bg-white p-4 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                      <div className="text-xs font-black text-black/60">Preferred time</div>
                      <div className="mt-2 text-sm font-extrabold">
                        {r.timeWindow ?? 'Not specified'}
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-black/60 bg-white p-4 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                      <div className="text-xs font-black text-black/60">Format</div>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold">
                        {fmt ? (
                          fmt === 'Online' ? (
                            <>
                              <Globe className="h-4 w-4" /> Online
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4" /> In person
                            </>
                          )
                        ) : (
                          'Not specified'
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-black/60 bg-white p-4 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                      <div className="text-xs font-black text-black/60">Updated</div>
                      <div className="mt-2 text-sm font-extrabold">
                        {r.updatedAt ? formatRelative(r.updatedAt) : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mt-4 rounded-2xl border-2 border-black/60 bg-yellow-50 p-4 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                    <div className="text-xs font-black text-black/60">Message</div>
                    <div className="mt-2 text-sm font-semibold text-black/80 leading-relaxed">
                      {r.message?.trim() ? `“${r.message.trim()}”` : 'No message provided.'}
                    </div>
                  </div>

                  {/* Session Controls (only when accepted and session exists) */}
                  {status === 'accepted' && sess ? (
                    <div className="mt-4 rounded-2xl border-2 border-black/60 bg-white p-4 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-black">Session details</div>
                          <div className="mt-1 text-xs font-semibold text-black/60">
                            Tutor shares {meetingLabel.toLowerCase()} • both must finish to close
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Pill tone={iFinished ? 'good' : 'warn'} icon={<Check className="h-3.5 w-3.5" />}>
                            {iFinished ? 'You finished' : 'Not finished'}
                          </Pill>
                          <Pill tone={otherFinished ? 'good' : 'warn'} icon={<Check className="h-3.5 w-3.5" />}>
                            {otherFinished ? 'They finished' : 'Waiting'}
                          </Pill>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {/* Meeting Place */}
                        <div className="rounded-2xl border-2 border-black/60 bg-white p-4 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-black text-black/60">{meetingLabel}</div>
                            <div className="text-xs font-semibold text-black/50">
                              {sess?.meetingPlace?.updatedAt
                                ? `Updated ${formatRelative(sess.meetingPlace.updatedAt)}`
                                : 'Not set'}
                            </div>
                          </div>

                          <div className="mt-2 flex items-center gap-2 text-sm font-extrabold">
                            {meetingIcon}
                            {meetingValue ? (
                              <span className="break-all text-black/80">{meetingValue}</span>
                            ) : (
                              <span className="text-black/50">No {meetingLabel.toLowerCase()} yet.</span>
                            )}
                          </div>

                          {canEditMeeting ? (
                            <div className="mt-3 flex gap-2">
                              <input
                                value={meetingDraft[sessionKey] ?? meetingValue ?? ''}
                                onChange={(e) =>
                                  setMeetingDraft((p) => ({
                                    ...p,
                                    [sessionKey]: e.target.value,
                                  }))
                                }
                                placeholder={
                                  (r.format ?? '').toLowerCase() === 'in-person'
                                    ? '123 Main St, City, State'
                                    : 'https://zoom.us/j/…'
                                }
                                className="flex-1 rounded-2xl border-2 border-black/60 bg-white px-3 py-2 text-sm font-semibold shadow-[0_8px_0_rgba(0,0,0,0.08)] focus:outline-none"
                              />
                              <button
                                disabled={meetingBusy === sessionKey}
                                onClick={() => saveMeetingPlace(sessionKey)}
                                className={cn(
                                  'rounded-2xl border-2 border-black bg-black px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 active:translate-y-0',
                                  meetingBusy === sessionKey && 'opacity-70 hover:translate-y-0'
                                )}
                                type="button"
                              >
                                {meetingBusy === sessionKey ? 'Saving…' : 'Save'}
                              </button>
                            </div>
                          ) : null}
                        </div>

                        {/* Finish + Rating */}
                        <div className="rounded-2xl border-2 border-black/60 bg-white p-4 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                          <div className="text-xs font-black text-black/60">Finish class</div>

                          <div className="mt-2 text-sm font-semibold text-black/70">
                            Once <span className="font-black">both</span> people finish, the session closes.
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {canFinish ? (
                              <button
                                type="button"
                                disabled={finishBusy === sessionKey || iFinished}
                                onClick={() => finishSession(sessionKey)}
                                className={cn(
                                  'rounded-2xl border-2 border-black bg-emerald-200 px-4 py-2 text-sm font-extrabold shadow-[0_10px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 active:translate-y-0',
                                  (finishBusy === sessionKey || iFinished) && 'opacity-70 hover:translate-y-0'
                                )}
                              >
                                {iFinished ? 'Finished' : finishBusy === sessionKey ? 'Finishing…' : 'Finish class'}
                              </button>
                            ) : (
                              <div className="rounded-2xl border-2 border-black/50 bg-white px-4 py-2 text-sm font-extrabold text-black/60 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                                {isCompleted ? 'Session closed' : 'Finish unavailable'}
                              </div>
                            )}

                            {isCompleted && isRequester && sess?.rated ? (
                              <Pill tone="good" icon={<Check className="h-3.5 w-3.5" />}>
                                Rated
                              </Pill>
                            ) : null}
                          </div>

                          {/* Rating UI (requester only) */}
                          {canRate ? (
                            <div className="mt-4 rounded-2xl border-2 border-black/60 bg-yellow-50 p-4 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
                              <div className="text-sm font-black">Rate your tutor</div>
                              <div className="mt-1 text-xs font-semibold text-black/60">
                                This updates their profile rating.
                              </div>

                              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                <StarRow
                                  value={ratingValue}
                                  onChange={(n) =>
                                    setRatingDraft((p) => ({ ...p, [sessionKey]: n }))
                                  }
                                  disabled={ratingBusy === sessionKey}
                                />
                                <button
                                  type="button"
                                  disabled={ratingBusy === sessionKey || ratingValue < 1}
                                  onClick={() => submitRating(sessionKey, (r.to ?? '').toLowerCase(), ratingValue)}
                                  className={cn(
                                    'rounded-2xl border-2 border-black bg-black px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 active:translate-y-0',
                                    (ratingBusy === sessionKey || ratingValue < 1) &&
                                      'opacity-60 hover:translate-y-0'
                                  )}
                                >
                                  {ratingBusy === sessionKey ? 'Submitting…' : 'Submit'}
                                </button>
                              </div>
                            </div>
                          ) : null}

                          {isCompleted && isTutor && !sess?.rated ? (
                            <div className="mt-4 text-xs font-semibold text-black/60">
                              Waiting for the requester to rate you.
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        )}

        <footer className="mt-10 text-center text-xs font-semibold text-black/55">
          © {new Date().getFullYear()} SkillSwap
        </footer>
      </div>
    </main>
  );

  async function refreshInbox() {
    const res = await fetch('/api/inbox', { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    const incoming = data.incoming ?? [];
    const outgoing = data.outgoing ?? [];
    setRequests([
      ...incoming.map((r: any) => ({ ...r, direction: 'incoming' })),
      ...outgoing.map((r: any) => ({ ...r, direction: 'outgoing' })),
    ]);
    setSessions(data.sessions ?? {});
  }

  async function updateStatus(id: string, status: 'accepted' | 'rejected') {
    try {
      const row = requests.find((r) => r._id === id);
      if (row?.direction === 'outgoing') return;

      setBusyId(id);

      const res = await fetch(`/api/request/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Failed to update status');
      }

      await refreshInbox();
    } catch (e: any) {
      alert(e?.message || 'Something went wrong');
    } finally {
      setBusyId(null);
    }
  }

  async function saveMeetingPlace(sessionId: string) {
    try {
      setMeetingBusy(sessionId);

      const value = String(meetingDraft[sessionId] ?? '').trim();
      if (!value) return;

      const res = await fetch(`/api/session/${sessionId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setMeetingPlace', value }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || 'Failed to save');

      setSessions((prev) => ({ ...prev, [sessionId]: j.session }));
      await refreshInbox();
    } catch (e: any) {
      alert(e?.message || 'Failed to save meeting details');
    } finally {
      setMeetingBusy(null);
    }
  }

  async function finishSession(sessionId: string) {
    try {
      setFinishBusy(sessionId);

      const res = await fetch(`/api/session/${sessionId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finish' }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || 'Failed to finish');

      setSessions((prev) => ({ ...prev, [sessionId]: j.session }));
      await refreshInbox();
    } catch (e: any) {
      alert(e?.message || 'Failed to finish session');
    } finally {
      setFinishBusy(null);
    }
  }

  async function submitRating(sessionId: string, toUser: string, rating: number) {
    try {
      setRatingBusy(sessionId);

      const res = await fetch('/api/ratings', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, toUser, rating }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || 'Failed to submit rating');

      setRatingDraft((p) => ({ ...p, [sessionId]: 0 }));
      await refreshInbox();
    } catch (e: any) {
      alert(e?.message || 'Failed to submit rating');
    } finally {
      setRatingBusy(null);
    }
  }
}