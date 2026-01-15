'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  EyeOff,
  MessageSquare,
  CalendarDays,
  Star,
  Flag,
  Users,
  MapPin,
  Globe,
  FileWarning,
} from 'lucide-react';

const floaty = {
  initial: { y: 0 },
  animate: (i: number) => ({
    y: [0, -10 - i * 2, 0],
    rotate: [0, i % 2 === 0 ? 2 : -2, 0],
    transition: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut' },
  }),
};

function StickerButton({
  href,
  children,
  tone = 'black',
}: {
  href: string;
  children: React.ReactNode;
  tone?: 'black' | 'blue' | 'green' | 'pink';
}) {
  const toneClasses =
    tone === 'black'
      ? 'bg-black text-white'
      : tone === 'blue'
      ? 'bg-sky-600 text-white'
      : tone === 'green'
      ? 'bg-emerald-600 text-white'
      : 'bg-pink-600 text-white';

  return (
    <Link
      href={href}
      className={[
        'group inline-flex items-center gap-2 rounded-[18px] px-5 py-3 text-sm font-semibold',
        'shadow-[0_10px_0_rgba(0,0,0,0.12)] transition active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.12)]',
        'border-2 border-black/80 hover:-rotate-1',
        toneClasses,
      ].join(' ')}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function Tape({ className = '', label }: { className?: string; label: string }) {
  return (
    <div
      className={[
        'pointer-events-none absolute z-10 rounded-md border border-black/10 bg-yellow-200/80 px-3 py-1 text-[11px] font-semibold text-black/80',
        'shadow-[0_8px_18px_rgba(0,0,0,0.10)] backdrop-blur',
        className,
      ].join(' ')}
    >
      {label}
    </div>
  );
}

function Scribble({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 55C28 35 49 68 70 48C89 30 109 64 131 43C155 20 175 58 198 36"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M14 66C34 50 51 76 73 58C95 41 110 70 132 54C154 38 175 66 206 44"
        stroke="rgba(0,0,0,0.28)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniPill({
  icon,
  label,
  tone = 'white',
}: {
  icon: React.ReactNode;
  label: string;
  tone?: 'white' | 'yellow' | 'green';
}) {
  const bg =
    tone === 'yellow'
      ? 'bg-yellow-200/70'
      : tone === 'green'
      ? 'bg-emerald-200/70'
      : 'bg-white';

  return (
    <div
      className={[
        'inline-flex items-center gap-2 rounded-full border-2 border-black/70 px-3 py-1.5 text-xs font-semibold text-black shadow-[0_6px_0_rgba(0,0,0,0.10)]',
        bg,
      ].join(' ')}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function PaperCard({
  title,
  kids,
  icon,
  color = 'from-pink-200/60 via-white to-emerald-200/50',
  tilt = -1,
  tags = ['practical', 'student-first', 'clear'],
}: {
  title: string;
  kids: string;
  icon: React.ReactNode;
  color?: string;
  tilt?: number;
  tags?: string[];
}) {
  return (
    <motion.div
      whileHover={{ rotate: tilt * -1, y: -4 }}
      className={[
        'relative overflow-hidden rounded-3xl border-2 border-black/70 bg-white',
        'shadow-[0_18px_0_rgba(0,0,0,0.10)]',
      ].join(' ')}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_55%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.9),transparent_50%)]" />
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
      <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative p-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-black/70 bg-white shadow-[0_6px_0_rgba(0,0,0,0.12)]">
            {icon}
          </div>
          <h3 className="text-base font-extrabold tracking-tight text-black">
            {title}
          </h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-black/75">{kids}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-black/70">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-black/50 bg-white px-3 py-1"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RuleRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border-2 border-black/70 bg-white p-5 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
      <div className="flex items-center gap-2 text-sm font-black">
        {icon}
        {title}
      </div>
      <div className="mt-2 text-xs font-semibold text-black/70">{desc}</div>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-10 h-px w-full bg-black/10" />
  );
}

export default function page() {
  return (
    <main className="relative min-h-screen overflow-hidden text-black">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fbfbff] to-white" />
        <motion.div
          className="absolute -left-32 -top-36 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-pink-300/35 via-purple-300/25 to-sky-300/25 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-40 top-10 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-emerald-300/25 via-sky-300/25 to-yellow-200/35 blur-3xl"
          animate={{ x: [0, -55, 0], y: [0, 28, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-14 md:pt-16">
        {/* HERO */}
        <section className="relative">
          <Tape className="left-4 top-2 rotate-[-6deg]" label="safety ✨" />
          <Tape className="right-6 top-10 rotate-[5deg]" label="student-first" />

          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <MiniPill icon={<Shield className="h-4 w-4" />} label="safety controls" tone="yellow" />
                <MiniPill icon={<Lock className="h-4 w-4" />} label="private by default" />
                <MiniPill icon={<MessageSquare className="h-4 w-4" />} label="in-app messaging" />
                <MiniPill icon={<Star className="h-4 w-4" />} label="ratings & accountability" tone="green" />
              </div>

              <h1 className="mt-7 text-balance text-4xl font-black tracking-tight md:text-6xl">
                Built-in safety —
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-emerald-600 bg-clip-text text-transparent">
                    {' '}
                    not an afterthought
                  </span>
                  <Scribble className="absolute -bottom-6 left-1/2 h-10 w-52 -translate-x-1/2 rotate-[-2deg] opacity-70 md:w-72" />
                </span>
                .
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-relaxed text-black/75 md:text-lg">
                SkillSwap is designed for students. Here’s the real safety stuff we built into the site:
                requests go through the Inbox, session details are shared inside the app, and sessions only close
                when both people finish — then the requester can rate the tutor.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <StickerButton href="/explore" tone="black">
                  Browse skills
                </StickerButton>
                <StickerButton href="/inbox" tone="blue">
                  Safety lives in Inbox
                </StickerButton>
                <StickerButton href="/community" tone="pink">
                  Community norms
                </StickerButton>
              </div>
            </motion.div>
          </div>

          {/* floating stickers */}
          <div className="pointer-events-none relative mx-auto mt-10 max-w-5xl">
            <motion.div
              className="absolute left-2 top-4 hidden w-fit rounded-2xl border-2 border-black/70 bg-white px-4 py-3 text-sm font-extrabold shadow-[0_12px_0_rgba(0,0,0,0.12)] md:block"
              variants={floaty}
              initial="initial"
              animate="animate"
              custom={1}
              style={{ rotate: -6 }}
            >
              “No link? no session.” <span className="opacity-70">Set it in Inbox.</span>
            </motion.div>

            <motion.div
              className="absolute right-6 top-0 hidden w-fit rounded-2xl border-2 border-black/70 bg-white px-4 py-3 text-sm font-extrabold shadow-[0_12px_0_rgba(0,0,0,0.12)] md:block"
              variants={floaty}
              initial="initial"
              animate="animate"
              custom={2}
              style={{ rotate: 7 }}
            >
              “Finish → then rate.” <span className="opacity-70">Accountability.</span>
            </motion.div>

            <motion.div
              className="absolute left-10 bottom-2 hidden w-fit rounded-2xl border-2 border-black/70 bg-yellow-200 px-4 py-3 text-sm font-extrabold shadow-[0_12px_0_rgba(0,0,0,0.12)] md:block"
              variants={floaty}
              initial="initial"
              animate="animate"
              custom={3}
              style={{ rotate: 4 }}
            >
              meet in public • be respectful
            </motion.div>

            {/* safety board */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative overflow-hidden rounded-[32px] border-2 border-black/70 bg-white shadow-[0_22px_0_rgba(0,0,0,0.10)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/70 bg-gradient-to-r from-yellow-200/70 via-white to-emerald-200/50 px-6 py-4">
                <div className="inline-flex items-center gap-2 text-sm font-black">
                  <Shield className="h-4 w-4" />
                  Safety checklist (inside the app)
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-bold opacity-80">
                  <Users className="h-4 w-4" />
                  student-to-student sessions
                </div>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-12">
                {/* left */}
                <div className="md:col-span-5">
                  <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                    <div className="text-sm font-black">What we built</div>

                    <div className="mt-4 space-y-3">
                      {[
                        {
                          icon: <MessageSquare className="h-4 w-4" />,
                          t: 'Inbox-based requests',
                          d: 'Requests are accepted/rejected in one place (less chaos, more visibility).',
                        },
                        {
                          icon: <CalendarDays className="h-4 w-4" />,
                          t: 'Session details stored in-app',
                          d: 'Meeting link (online) or address (in-person) is saved on the session by the tutor.',
                        },
                        {
                          icon: <CheckCircle2 className="h-4 w-4" />,
                          t: 'Two-step session close',
                          d: 'Both people must click “Finish class” before it becomes completed.',
                        },
                        {
                          icon: <Star className="h-4 w-4" />,
                          t: 'Rating after completion',
                          d: 'Only the requester can rate, and only after the session is completed.',
                        },
                      ].map((x) => (
                        <div
                          key={x.t}
                          className="rounded-2xl border-2 border-black/70 bg-white px-4 py-3 shadow-[0_10px_0_rgba(0,0,0,0.08)]"
                        >
                          <div className="flex items-center gap-2 text-xs font-black">
                            {x.icon}
                            {x.t}
                          </div>
                          <div className="mt-1 text-xs font-semibold text-black/70">
                            {x.d}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border-2 border-dashed border-black/50 bg-yellow-50 p-4">
                      <div className="text-xs font-black">Good default</div>
                      <div className="mt-1 text-xs font-semibold text-black/70">
                        If something feels off, don’t continue the session. You can stop and message/report.
                      </div>
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className="md:col-span-7">
                  <div className="grid gap-4">
                    <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-black/70 bg-emerald-100 shadow-[0_8px_0_rgba(0,0,0,0.10)]">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-black">Privacy + control</div>
                          <div className="text-xs font-semibold text-black/65">
                            minimize oversharing, maximize clarity
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <RuleRow
                          icon={<EyeOff className="h-4 w-4" />}
                          title="Share details only in Inbox"
                          desc="Don’t post links/addresses publicly. Keep it inside the session thread."
                        />
                        <RuleRow
                          icon={<Shield className="h-4 w-4" />}
                          title="Ratings create accountability"
                          desc="Reliable helpers get surfaced; bad experiences leave a trail."
                        />
                        <RuleRow
                          icon={<Flag className="h-4 w-4" />}
                          title="Stop if it feels wrong"
                          desc="Trust your gut. Leave, message, and report if needed."
                        />
                        <RuleRow
                          icon={<FileWarning className="h-4 w-4" />}
                          title="No unsafe/harassing behavior"
                          desc="Any harassment, threats, or pressure is not allowed—period."
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          <div className="text-sm font-black">In-person safety</div>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-black/70">
                          Meet in a public school/common area. Bring a friend if you want. Don’t go to private locations.
                        </p>
                      </div>

                      <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          <div className="text-sm font-black">Online safety</div>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-black/70">
                          Use a normal meeting link. Don’t share passwords or personal info. Keep chat inside SkillSwap.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Divider />

        {/* “Real things you’ll see in the UI” */}
        <section className="mt-2 md:mt-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Real safety behaviors in the product
            </h2>
            <p className="mt-3 text-sm font-semibold text-black/70 md:text-base">
              These aren’t “policy words” — they map to actual screens you built.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <PaperCard
              title="Tutor sets meeting link/address"
              kids="On accepted sessions, the tutor can save the meeting link (online) or address (in-person) inside the session details box."
              icon={<CalendarDays className="h-5 w-5" />}
              tilt={-2}
              color="from-yellow-200/70 via-white to-pink-200/60"
              tags={['in-app', 'clear', 'no scrambling']}
            />
            <PaperCard
              title="Both must finish to close"
              kids="The session only completes when both people click “Finish class”. This prevents ‘fake’ completions and keeps status honest."
              icon={<CheckCircle2 className="h-5 w-5" />}
              tilt={1.5}
              color="from-emerald-200/60 via-white to-sky-200/60"
              tags={['mutual', 'transparent', 'fair']}
            />
            <PaperCard
              title="Requester-only rating after"
              kids="Only the requester can rate the tutor, only after completion. That rating updates the tutor’s average + count."
              icon={<Star className="h-5 w-5" />}
              tilt={-1}
              color="from-purple-200/60 via-white to-yellow-200/60"
              tags={['accountability', 'trust', 'earned']}
            />
          </div>

          <div className="mt-10 rounded-[34px] border-2 border-black/70 bg-white p-7 shadow-[0_18px_0_rgba(0,0,0,0.10)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-yellow-200/70 px-3 py-2 text-sm font-black shadow-[0_10px_0_rgba(0,0,0,0.10)]">
                  <AlertTriangle className="h-4 w-4" />
                  If you feel unsafe
                </div>
                <p className="mt-3 text-sm font-semibold text-black/70">
                  Leave the situation immediately. For in-person, go to a public area.
                  For online, leave the call. Then message through SkillSwap and contact a trusted adult/school staff.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end">
                <StickerButton href="/inbox" tone="blue">
                  Go to Inbox
                </StickerButton>
                <StickerButton href="/explore" tone="black">
                  Explore
                </StickerButton>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 md:mt-20">
          <div className="relative overflow-hidden rounded-[34px] border-2 border-black/70 bg-white p-8 shadow-[0_22px_0_rgba(0,0,0,0.10)] md:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/60 via-white to-emerald-200/60" />
            <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />

            <div className="relative grid items-center gap-6 md:grid-cols-12">
              <div className="md:col-span-8">
                <h3 className="text-3xl font-black tracking-tight md:text-4xl">
                  Safety is a feature — and a habit.
                </h3>
                <p className="mt-3 text-sm font-semibold text-black/75 md:text-base">
                  Use Inbox for session details, meet in public places, and rate honestly after sessions.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <StickerButton href="/signup" tone="green">
                    Create profile
                  </StickerButton>
                  <StickerButton href="/inbox" tone="blue">
                    Manage sessions
                  </StickerButton>
                  <Link
                    href="/community"
                    className="self-center text-sm font-black underline decoration-black/40 underline-offset-4 hover:decoration-black"
                  >
                    Community norms
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4">
                <div className="rounded-3xl border-2 border-black/70 bg-white p-5 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                  <div className="flex items-center gap-2 text-sm font-black">
                    <Shield className="h-4 w-4" />
                    Safety recap
                  </div>
                  <div className="mt-3 space-y-2 text-xs font-semibold text-black/75">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      Keep links/addresses in Inbox
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      Meet in public places
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      Finish → then rate honestly
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-10 text-center text-xs font-semibold text-black/55">
            © {new Date().getFullYear()} SkillSwap • safety
          </footer>
        </section>
      </div>
    </main>
  );
}