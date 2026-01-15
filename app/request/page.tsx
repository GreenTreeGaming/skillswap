'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Mail,
  Star,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from 'lucide-react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function Tape({ className = '', label }: { className?: string; label: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute z-10 rounded-md border border-black/10 bg-yellow-200/80 px-3 py-1 text-[11px] font-semibold text-black/80',
        'shadow-[0_8px_18px_rgba(0,0,0,0.10)] backdrop-blur',
        className
      )}
    >
      {label}
    </div>
  );
}

function BadgePill({
  children,
  tone = 'plain',
}: {
  children: React.ReactNode;
  tone?: 'plain' | 'info' | 'good' | 'warn';
}) {
  const cls =
    tone === 'good'
      ? 'bg-emerald-100'
      : tone === 'info'
        ? 'bg-sky-100'
        : tone === 'warn'
          ? 'bg-yellow-100'
          : 'bg-white';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border-2 border-black/60 px-3 py-1 text-[11px] font-extrabold text-black',
        cls,
        'shadow-[0_6px_0_rgba(0,0,0,0.08)]'
      )}
    >
      {children}
    </span>
  );
}

function RequestModal({
  open,
  onClose,
  onSubmit,
  prettyTopic,
  sending,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    message: string;
    timeWindow: string;
    format: 'online' | 'in-person';
  }) => void;
  prettyTopic: string;
  sending: boolean;
}) {
  const [message, setMessage] = useState('');
  const [timeWindow, setTimeWindow] = useState('After school (3–5pm)');
  const [format, setFormat] = useState<'online' | 'in-person'>('online');

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border-2 border-black/70 bg-white p-6 shadow-[0_26px_0_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-black">
                  Request help with {prettyTopic}
                </div>
                <div className="mt-1 text-sm font-semibold text-black/70">
                  Give a bit of context so they can help faster.
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl border-2 border-black/70 p-2 shadow-[0_6px_0_rgba(0,0,0,0.12)]"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Message */}
            <div className="mt-5">
              <label className="text-sm font-black">
                What do you need help with?
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: I'm stuck on recursion base cases and keep getting infinite loops…"
                className="mt-2 w-full rounded-2xl border-2 border-black/60 p-3 text-sm font-semibold shadow-[0_6px_0_rgba(0,0,0,0.08)] focus:outline-none"
                rows={4}
              />
            </div>

            {/* Time window */}
            <div className="mt-4">
              <label className="text-sm font-black">Preferred time</label>
              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className="mt-2 w-full rounded-2xl border-2 border-black/60 bg-white p-3 text-sm font-semibold shadow-[0_6px_0_rgba(0,0,0,0.08)]"
              >
                <option>After school (3–5pm)</option>
                <option>Evening (6–9pm)</option>
                <option>Lunch / Free period</option>
                <option>Weekend</option>
                <option>Custom — I’ll explain in message</option>
              </select>
            </div>

            {/* Format */}
            <div className="mt-4">
              <label className="text-sm font-black">Format</label>
              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setFormat('online')}
                  className={cn(
                    'flex-1 rounded-2xl border-2 px-4 py-3 text-sm font-extrabold shadow-[0_6px_0_rgba(0,0,0,0.08)]',
                    format === 'online'
                      ? 'border-black bg-emerald-200'
                      : 'border-black/50 bg-white'
                  )}
                >
                  Online
                </button>
                <button
                  onClick={() => setFormat('in-person')}
                  className={cn(
                    'flex-1 rounded-2xl border-2 px-4 py-3 text-sm font-extrabold shadow-[0_6px_0_rgba(0,0,0,0.08)]',
                    format === 'in-person'
                      ? 'border-black bg-yellow-200'
                      : 'border-black/50 bg-white'
                  )}
                >
                  In person
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-[16px] border-2 border-black/70 bg-white px-5 py-2 text-sm font-extrabold shadow-[0_6px_0_rgba(0,0,0,0.10)]"
              >
                Cancel
              </button>

              <button
                disabled={sending}
                onClick={() =>
                  onSubmit({
                    message,
                    timeWindow,
                    format,
                  })
                }
                className="rounded-[16px] border-2 border-black bg-black px-6 py-2 text-sm font-extrabold text-white shadow-[0_8px_0_rgba(0,0,0,0.20)]"
              >
                {sending ? 'Sending…' : 'Send request'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function RequestPage() {
  const params = useSearchParams();
  const router = useRouter();

  const to = params.get('to') ?? params.get('user');
  const skillSlug = params.get('skillSlug') ?? params.get('skill');
  const skillLabel =
    params.get('skillLabel') ??
    params.get('skill') ??
    (skillSlug ? skillSlug.replace(/-/g, ' ') : null);

  const [showModal, setShowModal] = useState(false);

  const prettyTopic = useMemo(() => {
    const raw = (skillLabel ?? '').trim();
    if (!raw) return null;
    return raw
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }, [skillLabel]);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!to) {
      setLoading(false);
      setProfile(null);
      return;
    }

    async function loadProfile() {
      try {
        const res = await fetch(`/api/profile/${encodeURIComponent(to)}`);
        if (res.ok) setProfile(await res.json());
        else setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [to]);

  async function submit() {
    if (!to || !skillSlug) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, skillSlug }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Failed to send request');
      }

      setSent(true);
      setTimeout(() => router.push('/explore'), 900);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-20 text-center text-sm font-semibold">
        Loading request…
      </div>
    );
  }

  // Missing params (topic is the #1 thing you want clearly)
  if (!to || !skillSlug || !prettyTopic) {
    return (
      <main className="relative min-h-screen overflow-hidden px-6 pb-24 pt-14 text-black">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[34px] border-2 border-black/70 bg-white p-8 shadow-[0_22px_0_rgba(0,0,0,0.10)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-2xl font-black tracking-tight">
                  Missing request info
                </div>
                <div className="mt-2 text-sm font-semibold text-black/70">
                  This page needs a recipient and a topic.
                </div>
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black/70 bg-white shadow-[0_10px_0_rgba(0,0,0,0.10)]">
                <XCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 space-y-2 text-xs font-semibold text-black/70">
              <div>
                <span className="font-extrabold">to:</span> {to ?? '(missing)'}
              </div>
              <div>
                <span className="font-extrabold">skillSlug:</span>{' '}
                {skillSlug ?? '(missing)'}
              </div>
              <div>
                <span className="font-extrabold">skillLabel:</span>{' '}
                {skillLabel ?? '(missing)'}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-[18px] border-2 border-black bg-black px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 active:translate-y-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to explore
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <div className="mt-20 text-center text-sm font-semibold">
        Profile not found
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pb-24 pt-14 text-black">
      {/* soft playful background like your explore page */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-200/55 via-white to-emerald-200/55" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative mx-auto max-w-3xl">
        <Tape className="right-4 top-8 rotate-[6deg]" label="be specific = faster help" />

        {/* Top: topic hero */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-10 rounded-[34px] border-2 border-black/70 bg-white p-6 shadow-[0_22px_0_rgba(0,0,0,0.10)] md:p-8"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-black text-black/60">
                You’re requesting help with
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="text-2xl font-black tracking-tight md:text-3xl">
                  {prettyTopic}
                </div>
              </div>

              <div className="mt-3 text-sm font-semibold text-black/70">
                You’re about to message <span className="font-black">{profile.name}</span> to
                set up a 1-on-1 help session.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <BadgePill tone="info">
                  <Mail className="h-3.5 w-3.5" />
                  {profile.email}
                </BadgePill>

                {profile.rating ? (
                  <BadgePill tone="good">
                    <Star className="h-3.5 w-3.5" />
                    {profile.rating.toFixed(1)}
                    <span className="text-black/50 font-black">
                      {profile.ratingCount ? ` (${profile.ratingCount})` : ''}
                    </span>
                  </BadgePill>
                ) : (
                  <BadgePill tone="plain">
                    <Star className="h-3.5 w-3.5" />
                    New
                  </BadgePill>
                )}
              </div>
            </div>

            {/* avatar card */}
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-black/70 bg-white shadow-[0_10px_0_rgba(0,0,0,0.10)]">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-purple-200/70 via-white to-emerald-200/70" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black">{profile.name}</div>
                <div className="text-xs font-semibold text-black/60 truncate max-w-[220px]">
                  {profile.email}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Bottom: action card */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="mt-6 rounded-[34px] border-2 border-black/70 bg-white p-6 shadow-[0_22px_0_rgba(0,0,0,0.10)] md:p-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-base font-black">Quick checklist</div>
              <div className="mt-2 text-sm font-semibold text-black/70">
                You’ll get better responses if your request is specific.
              </div>

              <div className="mt-4 grid gap-2 text-sm font-semibold text-black/75">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-black/60 bg-yellow-100 font-black shadow-[0_6px_0_rgba(0,0,0,0.08)]">
                    1
                  </span>
                  <div>
                    Mention what you’re stuck on in <span className="font-black">{prettyTopic}</span>.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-black/60 bg-yellow-100 font-black shadow-[0_6px_0_rgba(0,0,0,0.08)]">
                    2
                  </span>
                  <div>Suggest a time window (after school, lunch, weekend).</div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-black/60 bg-yellow-100 font-black shadow-[0_6px_0_rgba(0,0,0,0.08)]">
                    3
                  </span>
                  <div>Say if you prefer in-person or online.</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href={`/profiles/${encodeURIComponent(profile.email)}`}
                className="rounded-[18px] border-2 border-black/70 bg-white px-6 py-3 text-sm font-extrabold shadow-[0_10px_0_rgba(0,0,0,0.10)] transition hover:-translate-y-0.5 active:translate-y-0"
              >
                View profile
              </Link>

              <button
                onClick={() => setShowModal(true)}
                disabled={sending || sent}
                className={cn(
                  'rounded-[18px] border-2 border-black bg-black px-6 py-3 text-sm font-extrabold text-white',
                  'shadow-[0_10px_0_rgba(0,0,0,0.20)] transition hover:-translate-y-0.5 active:translate-y-0',
                  (sending || sent) && 'opacity-80'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {sent ? (
                    <>
                      Sent <CheckCircle2 className="h-4 w-4" />
                    </>
                  ) : sending ? (
                    'Sending…'
                  ) : (
                    <>
                      Send request <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="mt-5 rounded-2xl border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <RequestModal
            open={showModal}
            onClose={() => setShowModal(false)}
            prettyTopic={prettyTopic}
            sending={sending}
            onSubmit={async (data) => {
              setSending(true);
              setError(null);

              try {
                const res = await fetch('/api/request', {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    to,
                    skillSlug,
                    message: data.message,
                    timeWindow: data.timeWindow,
                    format: data.format,
                  }),
                });

                if (!res.ok) {
                  const j = await res.json().catch(() => ({}));
                  throw new Error(j?.error || 'Failed to send request');
                }

                setShowModal(false);
                setSent(true);
                setTimeout(() => router.push('/explore'), 900);
              } catch (e: any) {
                setError(e?.message || 'Something went wrong');
              } finally {
                setSending(false);
              }
            }}
          />

          <div className="mt-6 flex items-center justify-between gap-3 text-xs font-semibold text-black/60">
            <Link href="/explore" className="inline-flex items-center gap-2 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to explore
            </Link>
          </div>
        </motion.section>

        <footer className="mt-10 text-center text-xs font-semibold text-black/55">
          © {new Date().getFullYear()} SkillSwap
        </footer>
      </div>
    </main>
  );
}