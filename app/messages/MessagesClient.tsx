'use client';

import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  SendHorizonal,
  User2,
  Sparkles,
  Clock,
  Info,
  RefreshCw,
} from 'lucide-react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatTime(d: string | Date) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDay(d: string | Date) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function prettySkill(slug: string | null) {
  const raw = (slug ?? '').trim();
  if (!raw) return 'Unknown topic';
  return raw
    .replace(/-/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function relative(dateLike: any) {
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

function Pill({
  icon,
  children,
  tone = 'plain',
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  tone?: 'plain' | 'info' | 'good' | 'warn';
}) {
  const bg =
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
        bg,
        'shadow-[0_6px_0_rgba(0,0,0,0.08)]'
      )}
    >
      {icon}
      {children}
    </span>
  );
}

type ChatMessage = {
  _id?: string;
  from?: string;
  to?: string;
  skill?: string;
  text: string;
  createdAt: string;
  _localId?: string;
  _pending?: boolean;
  _failed?: boolean;
};

// Extract the logic into a separate component that uses useSearchParams
function MessagesContent() {
  const params = useSearchParams();
  const to = params.get('to');
  const skill = params.get('skill');

  const { data: session, status: sessionStatus } = useSession();
  const myEmail = (session?.user?.email ?? '').toLowerCase();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [polling, setPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [toProfile, setToProfile] = useState<any>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastLoadedKeyRef = useRef<string>('');

  const topic = useMemo(() => prettySkill(skill), [skill]);

  const grouped = useMemo(() => {
    const buckets: Array<{ day: string; items: ChatMessage[] }> = [];
    let currentDay = '';
    for (const m of messages) {
      const day = formatDay(m.createdAt);
      if (!day) continue;
      if (day !== currentDay) {
        buckets.push({ day, items: [m] });
        currentDay = day;
      } else {
        buckets[buckets.length - 1].items.push(m);
      }
    }
    return buckets;
  }, [messages]);

  function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    endRef.current?.scrollIntoView({ behavior });
  }

  function isNearBottom() {
    const el = listRef.current;
    if (!el) return true;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance < 160;
  }

  async function loadMessages(opts?: { silent?: boolean }) {
    if (!to || !skill) return;

    if (!opts?.silent) setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/messages?to=${encodeURIComponent(to)}&skill=${encodeURIComponent(skill)}`,
        { credentials: 'include' }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to load messages');

      const incoming: ChatMessage[] = (data.messages ?? []).map((m: any) => ({
        ...m,
        createdAt: m.createdAt ?? new Date().toISOString(),
      }));

      const localOnly = messages.filter((m) => m._pending || m._failed);

      const seen = new Set<string>();
      const merged: ChatMessage[] = [];

      for (const m of incoming) {
        const key = `${(m.from ?? '').toLowerCase()}|${m.text}|${m.createdAt}`;
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(m);
      }
      for (const m of localOnly) {
        const key = `${(m.from ?? '').toLowerCase()}|${m.text}|${m.createdAt}`;
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(m);
      }

      merged.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const newKey = merged
        .map(
          (m) =>
            `${(m.from ?? '').toLowerCase()}|${m.text}|${m.createdAt}|${m._pending ? 'p' : ''}${
              m._failed ? 'f' : ''
            }`
        )
        .join('||');

      const prevKey = lastLoadedKeyRef.current;
      lastLoadedKeyRef.current = newKey;

      const shouldAutoScroll = isNearBottom();

      if (newKey !== prevKey) setMessages(merged);
      if (shouldAutoScroll) setTimeout(() => scrollToBottom(opts?.silent ? 'auto' : 'smooth'), 30);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }

  async function loadToProfile() {
    if (!to) return;
    try {
      const res = await fetch(`/api/profile/${encodeURIComponent(to)}`, {
        credentials: 'include',
      });
      if (!res.ok) return setToProfile(null);
      setToProfile(await res.json());
    } catch {
      setToProfile(null);
    }
  }

  useEffect(() => {
    if (!to || !skill) {
      setLoading(false);
      return;
    }
    loadToProfile();
    loadMessages({ silent: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, skill]);

  useEffect(() => {
    if (!to || !skill) return;
    if (!polling) return;

    const interval = setInterval(() => {
      loadMessages({ silent: true });
    }, 3500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, skill, polling]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!to || !skill) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    setSending(true);
    setError(null);

    const localId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const optimistic: ChatMessage = {
      _localId: localId,
      from: myEmail || 'me',
      to,
      skill,
      text: trimmed,
      createdAt: new Date().toISOString(),
      _pending: true,
      _failed: false,
    };

    const shouldAutoScroll = isNearBottom();
    setMessages((prev) => [...prev, optimistic]);
    setText('');
    if (shouldAutoScroll) setTimeout(() => scrollToBottom('smooth'), 30);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, skill, text: trimmed }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to send');

      setMessages((prev) =>
        prev.map((m) =>
          m._localId === localId ? { ...m, _pending: false, _failed: false } : m
        )
      );

      await loadMessages({ silent: true });
    } catch (e: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m._localId === localId ? { ...m, _pending: false, _failed: true } : m
        )
      );
      setError(e?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  async function retryFailed(localId: string) {
    const msg = messages.find((m) => m._localId === localId);
    if (!msg) return;

    setText(msg.text);
    setMessages((prev) => prev.filter((m) => m._localId !== localId));
  }

  const headerName = toProfile?.name ?? to ?? 'Unknown';
  const headerSub = toProfile?.email ?? to ?? '';
  const headerImage = toProfile?.image ?? null;

  const missingParams = !to || !skill;

  return (
    <main className="relative h-[100dvh] overflow-hidden text-black">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-200/55 via-white to-emerald-200/55" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative mx-auto flex h-full max-w-4xl flex-col px-4 pb-4 pt-4 md:px-6">
        <Tape className="right-6 top-5 rotate-[6deg] hidden md:block" label="keep it short & clear" />

        <div className="sticky top-3 z-20">
          <div className="rounded-[28px] border-2 border-black/70 bg-white shadow-[0_16px_0_rgba(0,0,0,0.10)]">
            <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-5">
              <Link
                href="/inbox"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.10)] transition hover:-translate-y-0.5 active:translate-y-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>

              <div className="min-w-0 text-center">
                <div className="inline-flex flex-wrap items-center justify-center gap-2">
                  <Pill tone="info" icon={<Sparkles className="h-3.5 w-3.5" />}>
                    {topic}
                  </Pill>
                  <Pill tone="plain" icon={<Clock className="h-3.5 w-3.5" />}>
                    {messages.length
                      ? `Last: ${relative(messages[messages.length - 1]?.createdAt)}`
                      : 'New chat'}
                  </Pill>
                </div>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="h-9 w-9 overflow-hidden rounded-2xl border-2 border-black/70 bg-white shadow-[0_8px_0_rgba(0,0,0,0.10)]">
                    {headerImage ? (
                      <img
                        src={headerImage}
                        alt={headerName}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-yellow-100 via-white to-emerald-100">
                        <User2 className="h-4 w-4 text-black/50" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-sm font-black">{headerName}</div>
                    <div className="truncate text-[11px] font-semibold text-black/60">
                      {headerSub}
                    </div>
                  </div>
                </div>

                {sessionStatus === 'loading' ? (
                  <div className="mt-1 text-[11px] font-semibold text-black/50">
                    Loading session…
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadMessages({ silent: false })}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.10)] transition hover:-translate-y-0.5 active:translate-y-0"
                >
                  <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPolling((v) => !v)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-2xl border-2 px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.10)] transition hover:-translate-y-0.5 active:translate-y-0',
                    polling ? 'border-black/80 bg-emerald-200' : 'border-black/60 bg-white'
                  )}
                >
                  <span className="hidden sm:inline">{polling ? 'Live' : 'Paused'}</span>
                  <span className="sm:hidden">{polling ? '●' : 'Ⅱ'}</span>
                </button>
              </div>
            </div>

            {missingParams ? (
              <div className="border-t-2 border-black/70 px-4 py-3 text-sm font-semibold text-black/70">
                Missing params. Need <span className="font-black">to</span> and{' '}
                <span className="font-black">skill</span>.
              </div>
            ) : null}
          </div>
        </div>

        <AnimatePresence>
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 rounded-2xl border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 shadow-[0_10px_0_rgba(0,0,0,0.08)]"
            >
              {error}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <div
            ref={listRef}
            className="relative min-h-0 flex-1 overflow-y-auto rounded-[30px] border-2 border-black/70 bg-white/80 p-4 shadow-[0_16px_0_rgba(0,0,0,0.10)] backdrop-blur md:p-6"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-br from-yellow-50/40 via-white/30 to-emerald-50/40" />

            <div className="relative">
              {loading ? (
                <div className="grid place-items-center py-16 text-sm font-semibold text-black/60">
                  Loading messages…
                </div>
              ) : !messages.length ? (
                <div className="mx-auto max-w-md py-14 text-center">
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black/70 bg-white shadow-[0_10px_0_rgba(0,0,0,0.10)]">
                    <Info className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-xl font-black">No messages yet</div>
                  <div className="mt-2 text-sm font-semibold text-black/70">
                    Send a quick message to kick things off. Mention your goal + what you're stuck on.
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {grouped.map((g) => (
                    <div key={g.day}>
                      <div className="mb-3 flex justify-center">
                        <span className="rounded-full border-2 border-black/60 bg-white px-4 py-1 text-[11px] font-extrabold shadow-[0_6px_0_rgba(0,0,0,0.08)]">
                          {g.day}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {g.items.map((m, idx) => {
                          const mine =
                            (m.from ?? '').toLowerCase() &&
                            myEmail &&
                            (m.from ?? '').toLowerCase() === myEmail;

                          const pending = !!m._pending;
                          const failed = !!m._failed;

                          return (
                            <motion.div
                              key={m._id ?? m._localId ?? `${g.day}_${idx}`}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.22 }}
                              className={cn('flex', mine ? 'justify-end' : 'justify-start')}
                            >
                              <div className={cn('max-w-[82%] md:max-w-[72%]')}>
                                <div
                                  className={cn(
                                    'rounded-[22px] border-2 px-4 py-3 text-sm font-semibold leading-relaxed',
                                    'shadow-[0_10px_0_rgba(0,0,0,0.10)]',
                                    mine
                                      ? 'border-black bg-emerald-200'
                                      : 'border-black/70 bg-yellow-100',
                                    failed && 'border-red-700 bg-red-100'
                                  )}
                                >
                                  <div className="whitespace-pre-wrap break-words">{m.text}</div>

                                  <div className="mt-2 flex items-center justify-end gap-2 text-[10px] font-bold text-black/60">
                                    {pending ? (
                                      <span className="rounded-full border border-black/40 bg-white/70 px-2 py-0.5">
                                        sending…
                                      </span>
                                    ) : failed ? (
                                      <button
                                        type="button"
                                        onClick={() => retryFailed(m._localId!)}
                                        className="rounded-full border border-red-700 bg-white px-2 py-0.5 text-red-800"
                                      >
                                        failed — tap to retry
                                      </button>
                                    ) : null}
                                    <span>{formatTime(m.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={sendMessage}
            className="mt-4 rounded-[26px] border-2 border-black/70 bg-white p-3 shadow-[0_14px_0_rgba(0,0,0,0.10)]"
          >
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between px-1">
                  <div className="text-xs font-black text-black/60">Message</div>
                  <div className="text-[11px] font-semibold text-black/50">
                    Enter to send • Shift+Enter for new line
                  </div>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
                    }
                  }}
                  placeholder="Type a message… (include a time + what you need help with)"
                  rows={2}
                  className="w-full resize-none rounded-2xl border-2 border-black/60 bg-white px-4 py-3 text-sm font-semibold shadow-[0_8px_0_rgba(0,0,0,0.08)] focus:outline-none"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={
                  !text.trim() ||
                  sending ||
                  missingParams ||
                  sessionStatus === 'loading' ||
                  !myEmail
                }
                className={cn(
                  'inline-flex h-[46px] items-center gap-2 rounded-2xl border-2 border-black bg-black px-4 text-sm font-extrabold text-white',
                  'shadow-[0_10px_0_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 active:translate-y-0',
                  (!text.trim() ||
                    sending ||
                    missingParams ||
                    sessionStatus === 'loading' ||
                    !myEmail) &&
                    'opacity-60 hover:translate-y-0'
                )}
              >
                {sending ? 'Sending…' : 'Send'}
                <SendHorizonal className="h-4 w-4" />
              </motion.button>
            </div>
          </form>

          <div className="mt-3 text-center text-xs font-semibold text-black/55">
            © {new Date().getFullYear()} SkillSwap
          </div>
        </div>
      </div>
    </main>
  );
}

// Main export wraps with Suspense
export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="grid h-screen place-items-center">
        <div className="text-sm font-semibold text-black/60">Loading...</div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}