'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
  Music,
  Code2,
  Calculator,
  Camera,
  Palette,
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
        'border-2 border-black/80',
        'hover:-rotate-1',
        toneClasses,
      ].join(' ')}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function Tape({
  className = '',
  label,
}: {
  className?: string;
  label: string;
}) {
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

function PaperCard({
  title,
  kids,
  icon,
  color = 'from-pink-200/60 via-white to-emerald-200/50',
  tilt = -1,
}: {
  title: string;
  kids: string;
  icon: React.ReactNode;
  color?: string;
  tilt?: number;
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
      <div
        className={[
          'absolute inset-0 opacity-70',
          'bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_55%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.9),transparent_50%)]',
        ].join(' ')}
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />

      {/* paper grain */}
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

        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-black/70">
          <span className="rounded-full border border-black/50 bg-white px-3 py-1">
            quick
          </span>
          <span className="rounded-full border border-black/50 bg-white px-3 py-1">
            friendly
          </span>
          <span className="rounded-full border border-black/50 bg-white px-3 py-1">
            student-made
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function MiniSkill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border-2 border-black/70 bg-white px-3 py-1.5 text-xs font-semibold text-black shadow-[0_6px_0_rgba(0,0,0,0.10)]">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-black">
      {/* playful background */}
      <div className="pointer-events-none absolute inset-0">
        {/* base wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fbfbff] to-white" />

        {/* big blobs */}
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
          <Tape className="left-4 top-2 rotate-[-6deg]" label="new ✨" />
          <Tape className="right-6 top-10 rotate-[5deg]" label="made for students" />

          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <MiniSkill icon={<Code2 className="h-4 w-4" />} label="coding" />
                <MiniSkill icon={<Calculator className="h-4 w-4" />} label="math" />
                <MiniSkill icon={<Music className="h-4 w-4" />} label="music" />
                <MiniSkill icon={<Palette className="h-4 w-4" />} label="art" />
                <MiniSkill icon={<Camera className="h-4 w-4" />} label="photo" />
              </div>

              <h1 className="mt-7 text-balance text-4xl font-black tracking-tight md:text-6xl">
                Trade what you’re good at…
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-emerald-600 bg-clip-text text-transparent">
                    learn what you’re curious about
                  </span>
                  <Scribble className="absolute -bottom-6 left-1/2 h-10 w-52 -translate-x-1/2 rotate-[-2deg] opacity-70 md:w-72" />
                </span>
                .
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-black/75 md:text-lg">
                <span className="font-semibold">SkillSwap</span> is a student talent exchange:
                offer a skill, request a skill, schedule a session, and leave feedback.
                It’s like a friendly hallway conversation, but organized.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <StickerButton href="/explore" tone="black">
                  Explore skills
                </StickerButton>
                <StickerButton href="/signup" tone="pink">
                  Make a profile
                </StickerButton>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-black/70 bg-white px-3 py-1.5 shadow-[0_6px_0_rgba(0,0,0,0.10)]">
                  <Shield className="h-4 w-4" /> safety-first
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-black/70 bg-white px-3 py-1.5 shadow-[0_6px_0_rgba(0,0,0,0.10)]">
                  <CalendarDays className="h-4 w-4" /> simple scheduling
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-black/70 bg-white px-3 py-1.5 shadow-[0_6px_0_rgba(0,0,0,0.10)]">
                  <Star className="h-4 w-4" /> ratings & feedback
                </span>
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
              “Need help with vectors?” <span className="opacity-70">→ request</span>
            </motion.div>

            <motion.div
              className="absolute right-6 top-0 hidden w-fit rounded-2xl border-2 border-black/70 bg-white px-4 py-3 text-sm font-extrabold shadow-[0_12px_0_rgba(0,0,0,0.12)] md:block"
              variants={floaty}
              initial="initial"
              animate="animate"
              custom={2}
              style={{ rotate: 7 }}
            >
              “Teach me guitar chords 🎸”
            </motion.div>

            <motion.div
              className="absolute left-10 bottom-2 hidden w-fit rounded-2xl border-2 border-black/70 bg-yellow-200 px-4 py-3 text-sm font-extrabold shadow-[0_12px_0_rgba(0,0,0,0.12)] md:block"
              variants={floaty}
              initial="initial"
              animate="animate"
              custom={3}
              style={{ rotate: 4 }}
            >
              swap skills. keep it chill.
            </motion.div>

            {/* main “board” */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative overflow-hidden rounded-[32px] border-2 border-black/70 bg-white shadow-[0_22px_0_rgba(0,0,0,0.10)]"
            >
              {/* doodle header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/70 bg-gradient-to-r from-yellow-200/70 via-white to-emerald-200/50 px-6 py-4">
                <div className="inline-flex items-center gap-2 text-sm font-black">
                  <Sparkles className="h-4 w-4" />
                  Today’s vibe: learn something new
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-bold opacity-80">
                  <Users className="h-4 w-4" />
                  3 matches waiting
                </div>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-12">
                {/* left column */}
                <div className="md:col-span-5">
                  <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-black">Skill menu</div>
                      <div className="text-xs font-bold text-black/60">tap to explore</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        { label: 'AP Calc', icon: <Calculator className="h-4 w-4" /> },
                        { label: 'Python', icon: <Code2 className="h-4 w-4" /> },
                        { label: 'Guitar', icon: <Music className="h-4 w-4" /> },
                        { label: 'Art', icon: <Palette className="h-4 w-4" /> },
                        { label: 'Homework', icon: <GraduationCap className="h-4 w-4" /> },
                        { label: 'Study group', icon: <Users className="h-4 w-4" /> },
                      ].map((x) => (
                        <div
                          key={x.label}
                          className="inline-flex items-center gap-2 rounded-full border-2 border-black/70 bg-white px-3 py-2 text-xs font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.08)]"
                        >
                          {x.icon}
                          {x.label}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border-2 border-dashed border-black/50 bg-yellow-50 p-4">
                      <div className="text-xs font-black">Pro tip</div>
                      <div className="mt-1 text-xs font-semibold text-black/70">
                        Add 2 skills you can teach, and you’ll get better matches.
                      </div>
                    </div>
                  </div>
                </div>

                {/* right column */}
                <div className="md:col-span-7">
                  <div className="grid gap-4">
                    <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-black/70 bg-pink-100 shadow-[0_8px_0_rgba(0,0,0,0.10)]">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-black">Session request</div>
                          <div className="text-xs font-semibold text-black/65">
                            quick chat → confirm time → done
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-xs font-semibold">
                        <div className="w-fit max-w-[92%] rounded-2xl border-2 border-black/70 bg-black px-3 py-2 text-white shadow-[0_8px_0_rgba(0,0,0,0.10)]">
                          can someone explain momentum 😭
                        </div>
                        <div className="ml-auto w-fit max-w-[92%] rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-black shadow-[0_8px_0_rgba(0,0,0,0.10)]">
                          yeah I can! 25 mins after school? i’ll bring practice FRQs.
                        </div>
                        <div className="w-fit max-w-[92%] rounded-2xl border-2 border-black/70 bg-black px-3 py-2 text-white shadow-[0_8px_0_rgba(0,0,0,0.10)]">
                          YES. thank you!!
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          <div className="text-sm font-black">Fast scheduling</div>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-black/70">
                          Pick a time. Confirm it. Show up. That’s the whole thing.
                        </p>
                      </div>

                      <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          <div className="text-sm font-black">Safety controls</div>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-black/70">
                          Privacy settings + verified profiles + moderation tools.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURE CARDS (human, varied) */}
        <section className="mt-16 md:mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              The “actually-useful” stuff
            </h2>
            <p className="mt-3 text-sm font-semibold text-black/70 md:text-base">
              Profiles, scheduling, requests, feedback + optional messaging,
              groups, and admin monitoring.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <PaperCard
              title="Profiles that feel real"
              kids="Show what you can teach + what you want to learn. Add availability, goals, and your vibe."
              icon={<Users className="h-5 w-5" />}
              tilt={-2}
              color="from-yellow-200/70 via-white to-pink-200/60"
            />
            <PaperCard
              title="Request → schedule → done"
              kids="Send a request, propose a time, and meet. No endless group chats."
              icon={<CalendarDays className="h-5 w-5" />}
              tilt={1.5}
              color="from-emerald-200/60 via-white to-sky-200/60"
            />
            <PaperCard
              title="Feedback builds trust"
              kids="Rate sessions so great helpers get found. Bad experiences? Easier to moderate."
              icon={<Star className="h-5 w-5" />}
              tilt={-1}
              color="from-purple-200/60 via-white to-yellow-200/60"
            />
          </div>

          {/* little “handmade” callout row */}
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { icon: <MessageSquare className="h-4 w-4" />, title: 'Messaging', desc: 'Coordinate without chaos.' },
              { icon: <GraduationCap className="h-4 w-4" />, title: 'Group sessions', desc: 'Clubs + study squads.' },
              { icon: <Shield className="h-4 w-4" />, title: 'Privacy', desc: 'Control visibility + DMs.' },
              { icon: <CheckCircle2 className="h-4 w-4" />, title: 'Admin panel', desc: 'Monitor activity & users.' },
            ].map((x, i) => (
              <motion.div
                key={x.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-3xl border-2 border-black/70 bg-white p-5 shadow-[0_14px_0_rgba(0,0,0,0.10)]"
                style={{ transform: `rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)` }}
              >
                <div className="flex items-center gap-2 text-sm font-black">
                  {x.icon}
                  {x.title}
                </div>
                <div className="mt-2 text-xs font-semibold text-black/70">
                  {x.desc}
                </div>
              </motion.div>
            ))}
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
                  Ready to trade skills?
                </h3>
                <p className="mt-3 text-sm font-semibold text-black/75 md:text-base">
                  Make a profile in 60 seconds, request your first session, and
                  learn from someone who’s literally down the hall.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <StickerButton href="/signup" tone="green">
                    Create profile
                  </StickerButton>
                  <StickerButton href="/explore" tone="blue">
                    Browse skills
                  </StickerButton>
                  <Link
                    href="/login"
                    className="self-center text-sm font-black underline decoration-black/40 underline-offset-4 hover:decoration-black"
                  >
                    Sign in
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4">
                <div className="rounded-3xl border-2 border-black/70 bg-white p-5 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                  <div className="flex items-center gap-2 text-sm font-black">
                    <Sparkles className="h-4 w-4" />
                    Quick start checklist
                  </div>
                  <div className="mt-3 space-y-2 text-xs font-semibold text-black/75">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      Add 2 skills you can teach
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      Add 1 skill you want to learn
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      Request your first session
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-10 text-center text-xs font-semibold text-black/55">
            © {new Date().getFullYear()} SkillSwap • student talent exchange platform
          </footer>
        </section>
      </div>
    </main>
  );
}