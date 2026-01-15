'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Users,
  MessageSquare,
  Sparkles,
  Star,
  Shield,
  CalendarDays,
  CheckCircle2,
  Flag,
  HeartHandshake,
  Megaphone,
  Lightbulb,
  Globe,
  GraduationCap,
  Zap,
} from 'lucide-react';

import { useSession } from 'next-auth/react';

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
  tone?: 'white' | 'yellow';
}) {
  return (
    <div
      className={[
        'inline-flex items-center gap-2 rounded-full border-2 border-black/70 px-3 py-1.5 text-xs font-semibold text-black shadow-[0_6px_0_rgba(0,0,0,0.10)]',
        tone === 'yellow' ? 'bg-yellow-200/70' : 'bg-white',
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
  tags = ['friendly', 'student-made', 'real'],
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

export default function page() {
  const { data: session, status } = useSession();
  const isAuthed = status === 'authenticated';
  if (status === 'loading') return null;
  return (
    <main className="relative min-h-screen overflow-hidden text-black">
      {/* background (same vibe as other pages) */}
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
          <Tape className="left-4 top-2 rotate-[-6deg]" label="community ✨" />
          <Tape className="right-6 top-10 rotate-[5deg]" label="keep it kind" />

          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <MiniPill icon={<Users className="h-4 w-4" />} label="students helping students" />
                <MiniPill icon={<HeartHandshake className="h-4 w-4" />} label="good vibes only" tone="yellow" />
                <MiniPill icon={<Shield className="h-4 w-4" />} label="safety-first" />
                <MiniPill icon={<Star className="h-4 w-4" />} label="ratings build trust" />
              </div>

              <h1 className="mt-7 text-balance text-4xl font-black tracking-tight md:text-6xl">
                SkillSwap community:
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-emerald-600 bg-clip-text text-transparent">
                    {' '}
                    friendly, helpful, real
                  </span>
                  <Scribble className="absolute -bottom-6 left-1/2 h-10 w-52 -translate-x-1/2 rotate-[-2deg] opacity-70 md:w-72" />
                </span>
                .
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-black/75 md:text-lg">
                This is where we set the tone. Be respectful, show up when you say you will,
                and help people feel confident asking questions.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <StickerButton href="/explore" tone="black">
                  Explore skills
                </StickerButton>
                <StickerButton href="/inbox" tone="blue">
                  View inbox
                </StickerButton>
                <StickerButton href={isAuthed ? '/profile' : '/signup'} tone="pink">
                  {isAuthed ? 'View profile' : 'Make a profile'}
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
              “No dumb questions.” <span className="opacity-70">Ever.</span>
            </motion.div>

            <motion.div
              className="absolute right-6 top-0 hidden w-fit rounded-2xl border-2 border-black/70 bg-white px-4 py-3 text-sm font-extrabold shadow-[0_12px_0_rgba(0,0,0,0.12)] md:block"
              variants={floaty}
              initial="initial"
              animate="animate"
              custom={2}
              style={{ rotate: 7 }}
            >
              “Show up + be patient.”
            </motion.div>

            <motion.div
              className="absolute left-10 bottom-2 hidden w-fit rounded-2xl border-2 border-black/70 bg-yellow-200 px-4 py-3 text-sm font-extrabold shadow-[0_12px_0_rgba(0,0,0,0.12)] md:block"
              variants={floaty}
              initial="initial"
              animate="animate"
              custom={3}
              style={{ rotate: 4 }}
            >
              help someone today 🙂
            </motion.div>

            {/* big board */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative overflow-hidden rounded-[32px] border-2 border-black/70 bg-white shadow-[0_22px_0_rgba(0,0,0,0.10)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/70 bg-gradient-to-r from-yellow-200/70 via-white to-emerald-200/50 px-6 py-4">
                <div className="inline-flex items-center gap-2 text-sm font-black">
                  <Sparkles className="h-4 w-4" />
                  Community board
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-bold opacity-80">
                  <Globe className="h-4 w-4" />
                  be kind • be consistent • be real
                </div>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-12">
                {/* left */}
                <div className="md:col-span-5">
                  <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-black">How sessions work</div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {[
                        { icon: <MessageSquare className="h-4 w-4" />, t: 'Send a request', d: 'Explain what you need + your time window.' },
                        { icon: <CalendarDays className="h-4 w-4" />, t: 'Confirm a plan', d: 'Online link or in-person location gets shared in Inbox.' },
                        { icon: <Zap className="h-4 w-4" />, t: 'Do the session', d: 'Be on time. Keep it focused and friendly.' },
                        { icon: <Star className="h-4 w-4" />, t: 'Finish + rate', d: 'Both click “Finish class”. Requester leaves a rating.' },
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
                      <div className="text-xs font-black">Tiny tip</div>
                      <div className="mt-1 text-xs font-semibold text-black/70">
                        If you’re tutoring, drop the link/address early so nobody’s scrambling.
                      </div>
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className="md:col-span-7">
                  <div className="grid gap-4">
                    <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-black/70 bg-pink-100 shadow-[0_8px_0_rgba(0,0,0,0.10)]">
                          <Megaphone className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-black">Community vibe checks</div>
                          <div className="text-xs font-semibold text-black/65">
                            quick rules that keep things fun
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <RuleRow
                          icon={<HeartHandshake className="h-4 w-4" />}
                          title="Be patient"
                          desc="If someone’s learning, they’re allowed to be confused."
                        />
                        <RuleRow
                          icon={<Flag className="h-4 w-4" />}
                          title="Be reliable"
                          desc="Don’t ghost. If plans change, send a message."
                        />
                        <RuleRow
                          icon={<Shield className="h-4 w-4" />}
                          title="Keep it safe"
                          desc="Meet in public places. No weird requests. Ever."
                        />
                        <RuleRow
                          icon={<Lightbulb className="h-4 w-4" />}
                          title="Teach clearly"
                          desc="Explain steps, not just answers. Share resources."
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          <div className="text-sm font-black">Good help looks like</div>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-black/70">
                          Asking what they know, working through examples, and leaving them
                          with a way to practice.
                        </p>
                      </div>

                      <div className="rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          <div className="text-sm font-black">Ratings matter</div>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-black/70">
                          Be honest and fair. Ratings help everyone find reliable people.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="mt-16 md:mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              What the community is for
            </h2>
            <p className="mt-3 text-sm font-semibold text-black/70 md:text-base">
              Not a “forum.” More like: a culture. These are the vibes we’re building.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <PaperCard
              title="Ask for help without stress"
              kids="You don’t need to be ‘good enough’ to ask. Curiosity is the requirement."
              icon={<MessageSquare className="h-5 w-5" />}
              tilt={-2}
              color="from-yellow-200/70 via-white to-pink-200/60"
              tags={['no-judgment', 'questions welcome', 'real']}
            />
            <PaperCard
              title="Teach without being a robot"
              kids="Explain like you’re helping a friend. Clear steps. Tiny examples. Small wins."
              icon={<Users className="h-5 w-5" />}
              tilt={1.5}
              color="from-emerald-200/60 via-white to-sky-200/60"
              tags={['patient', 'step-by-step', 'chill']}
            />
            <PaperCard
              title="Build trust over time"
              kids="Show up, be respectful, and ratings will take care of the rest."
              icon={<Shield className="h-5 w-5" />}
              tilt={-1}
              color="from-purple-200/60 via-white to-yellow-200/60"
              tags={['reliable', 'safe', 'fair']}
            />
          </div>

          {/* little callout row */}
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { icon: <CheckCircle2 className="h-4 w-4" />, title: 'Be on time', desc: 'Respect people’s schedules.' },
              { icon: <MessageSquare className="h-4 w-4" />, title: 'Communicate', desc: 'Short messages > confusion.' },
              { icon: <Shield className="h-4 w-4" />, title: 'Keep it public', desc: 'School + public places for in-person.' },
              { icon: <Star className="h-4 w-4" />, title: 'Rate fairly', desc: 'Honest feedback helps everyone.' },
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

        {/* PROJECT INFO / CREDITS */}
        <section className="mt-16 md:mt-20">
          <div className="relative overflow-hidden rounded-[34px] border-2 border-black/70 bg-white p-8 shadow-[0_22px_0_rgba(0,0,0,0.10)] md:p-10">
            {/* background texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-200/50 via-white to-yellow-200/50" />
            <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />

            <div className="relative grid gap-6 md:grid-cols-12">
              {/* Left */}
              <div className="md:col-span-7">
                <h3 className="text-2xl font-black tracking-tight md:text-3xl">
                  About this project
                </h3>
                <p className="mt-3 text-sm font-semibold text-black/75 md:text-base">
                  SkillSwap is a student-built platform designed to help students teach,
                  learn, and support one another through real skills and real connections.
                </p>

                <div className="mt-5 space-y-2 text-sm font-semibold text-black/70">
                  <div>
                    <span className="font-black text-black/80">Theme:</span>{' '}
                    SkillSwap: Student Talent Exchange Platform
                  </div>
                  <div>
                    <span className="font-black text-black/80">Year:</span> 2026
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="md:col-span-5">
                <div className="rounded-3xl border-2 border-black/70 bg-white p-5 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                  <div className="text-sm font-black">Built by</div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold">
                    <div>Sarvajith Karun</div>
                    <div>Shubham Panchal</div>
                    <div>Aaron Zou</div>
                    <div>Jasper Fang</div>
                  </div>

                  <div className="mt-4 border-t border-black/20 pt-3 text-xs font-semibold text-black/65">
                    Wayzata Chapter<br />
                    Wayzata High School<br />
                    Plymouth, Minnesota
                  </div>
                </div>
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
                  Join the vibe.
                </h3>
                <p className="mt-3 text-sm font-semibold text-black/75 md:text-base">
                  Make a profile, list what you can teach, and help one person this week.
                  That’s how a community starts.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <StickerButton href={isAuthed ? '/profile' : '/signup'} tone="green">
                    {isAuthed ? 'View profile' : 'Create profile'}
                  </StickerButton>
                  <StickerButton href="/explore" tone="blue">
                    Browse skills
                  </StickerButton>

                  {!isAuthed && (
                    <Link
                      href="/login"
                      className="self-center text-sm font-black underline decoration-black/40 underline-offset-4 hover:decoration-black"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>

              <div className="md:col-span-4">
                <div className="rounded-3xl border-2 border-black/70 bg-white p-5 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                  <div className="flex items-center gap-2 text-sm font-black">
                    <Sparkles className="h-4 w-4" />
                    Quick community pledge
                  </div>
                  <div className="mt-3 space-y-2 text-xs font-semibold text-black/75">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      I’ll be respectful + patient
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      I’ll show up when I commit
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      I’ll keep it safe + public
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-10 text-center text-xs font-semibold text-black/55">
            © {new Date().getFullYear()} SkillSwap • community
          </footer>
        </section>
      </div>
    </main>
  );
}