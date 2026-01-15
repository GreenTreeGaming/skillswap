'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  Users,
  Sparkles,
  Video,
  MapPin,
} from 'lucide-react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function Tape({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute z-10 rounded-md border border-black/10',
        'bg-yellow-200/80 px-3 py-1 text-[11px] font-semibold text-black/80',
        'shadow-[0_8px_18px_rgba(0,0,0,0.10)] backdrop-blur',
        className
      )}
    >
      {label}
    </div>
  );
}

function PaperCard({
  children,
  tilt = -1,
}: {
  children: React.ReactNode;
  tilt?: number;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, rotate: tilt * -1 }}
      className={cn(
        'relative overflow-hidden rounded-3xl border-2 border-black/70 bg-white',
        'shadow-[0_18px_0_rgba(0,0,0,0.10)]'
      )}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative p-6">{children}</div>
    </motion.div>
  );
}

type Session = {
  id: string;
  title: string;
  hostName: string;
  hostEmail: string;
  hostImage?: string | null;
  category: string;
  when: string;
  duration: string;
  format: 'online' | 'in-person';
  spotsLeft: number;
};

export default function SessionsPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      setSessions(data.sessions || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="mt-20 text-center text-sm font-semibold">
        Loading sessions…
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-black">
      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-14">
        <Tape label="sessions" className="left-6 top-4 rotate-[-6deg]" />
        <Tape label="join & learn" className="right-6 top-10 rotate-[6deg]" />

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-12 text-4xl font-black tracking-tight md:text-5xl"
          >
            Live & upcoming sessions
          </motion.h1>
          <p className="mt-4 text-sm font-semibold text-black/70 md:text-base">
            Join a session, learn something new, and leave a rating after.
          </p>
        </div>

        {/* Sessions */}
        <section className="mt-14">
          {sessions.length === 0 ? (
            <div className="rounded-3xl border-2 border-black/70 bg-white p-10 text-center shadow-[0_18px_0_rgba(0,0,0,0.10)]">
              <div className="text-lg font-black">No sessions yet</div>
              <div className="mt-2 text-sm font-semibold text-black/70">
                Be the first to host or request one.
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/request"
                  className="rounded-2xl border-2 border-black bg-black px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.20)]"
                >
                  Request a session
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map((s, i) => (
                <PaperCard key={s.id} tilt={i % 2 === 0 ? -1.2 : 1.1}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-black">{s.title}</div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-black/70">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {s.when}
                        </span>
                        <span>• {s.duration}</span>
                      </div>
                    </div>

                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-black/70 bg-white shadow-[0_8px_0_rgba(0,0,0,0.10)]">
                      {s.format === 'online' ? (
                        <Video className="h-5 w-5" />
                      ) : (
                        <MapPin className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 text-sm font-semibold text-black/75">
                    Hosted by{' '}
                    <Link
                      href={`/profiles/${encodeURIComponent(s.hostEmail)}`}
                      className="font-black underline underline-offset-4"
                    >
                      {s.hostName}
                    </Link>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-black/70">
                    <Users className="h-4 w-4" />
                    {s.spotsLeft} spot{s.spotsLeft !== 1 && 's'} left
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link
                      href={`/sessions/${s.id}`}
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-black bg-black px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.12)]"
                    >
                      View details <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/sessions/${s.id}/join`}
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-4 py-2 text-xs font-extrabold shadow-[0_10px_0_rgba(0,0,0,0.08)]"
                    >
                      Join
                    </Link>
                  </div>
                </PaperCard>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-16 text-center text-xs font-semibold text-black/55">
          © {new Date().getFullYear()} SkillSwap • sessions
        </footer>
      </div>
    </main>
  );
}