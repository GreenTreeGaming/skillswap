'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  Users,
  CalendarDays,
  Star,
  MapPin,
  Sparkles,
  GraduationCap,
  Code2,
  Calculator,
  Music,
  Palette,
  Camera,
  PenTool,
  Globe,
  Dumbbell,
  Mic,
  Gamepad2,
} from 'lucide-react';

type Tab = 'skills' | 'people' | 'sessions';
type SkillCategory =
  | 'coding'
  | 'math'
  | 'science'
  | 'music'
  | 'art'
  | 'photo'
  | 'video'
  | 'writing'
  | 'languages'
  | 'study'
  | 'sports'
  | 'public-speaking'
  | 'gaming';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

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
      className={cn(
        'group inline-flex items-center gap-2 rounded-[18px] px-5 py-3 text-sm font-semibold',
        'shadow-[0_10px_0_rgba(0,0,0,0.12)] transition active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.12)]',
        'border-2 border-black/80 hover:-rotate-1',
        toneClasses
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
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

function MiniSkill({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs font-semibold',
        'shadow-[0_6px_0_rgba(0,0,0,0.10)] transition',
        'active:translate-y-0.5 active:shadow-[0_3px_0_rgba(0,0,0,0.10)]',
        active
          ? 'border-black/80 bg-black text-white'
          : 'border-black/70 bg-white text-black hover:bg-slate-50'
      )}
      aria-pressed={!!active}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PaperCard({
  children,
  tilt = -0.8,
  className,
}: {
  children: React.ReactNode;
  tilt?: number;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, rotate: tilt * -1 }}
      className={cn(
        'relative overflow-hidden rounded-3xl border-2 border-black/70 bg-white',
        'shadow-[0_18px_0_rgba(0,0,0,0.10)]',
        className
      )}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative p-5">{children}</div>
    </motion.div>
  );
}

function TabButton({
  tab,
  current,
  icon,
  label,
  onClick,
}: {
  tab: Tab;
  current: Tab;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  const active = tab === current;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-extrabold transition',
        'shadow-[0_8px_0_rgba(0,0,0,0.10)] hover:-translate-y-0.5 active:translate-y-0',
        active
          ? 'border-black/80 bg-black text-white'
          : 'border-black/70 bg-white text-black hover:bg-slate-50'
      )}
      aria-pressed={active}
    >
      {icon}
      {label}
    </button>
  );
}

function BadgePill({
  children,
  tone = 'plain',
}: {
  children: React.ReactNode;
  tone?: 'plain' | 'good' | 'info' | 'warn';
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

const categoryMeta: Record<
  SkillCategory,
  { label: string; icon: React.ReactNode }
> = {
  coding: { label: 'coding', icon: <Code2 className="h-4 w-4" /> },
  math: { label: 'math', icon: <Calculator className="h-4 w-4" /> },
  science: { label: 'science', icon: <Sparkles className="h-4 w-4" /> },
  music: { label: 'music', icon: <Music className="h-4 w-4" /> },
  art: { label: 'art', icon: <Palette className="h-4 w-4" /> },
  photo: { label: 'photo', icon: <Camera className="h-4 w-4" /> },
  video: { label: 'video', icon: <Camera className="h-4 w-4" /> },
  writing: { label: 'writing', icon: <PenTool className="h-4 w-4" /> },
  languages: { label: 'languages', icon: <Globe className="h-4 w-4" /> },
  study: { label: 'study', icon: <GraduationCap className="h-4 w-4" /> },
  sports: { label: 'sports', icon: <Dumbbell className="h-4 w-4" /> },
  'public-speaking': { label: 'public speaking', icon: <Mic className="h-4 w-4" /> },
  gaming: { label: 'gaming', icon: <Gamepad2 className="h-4 w-4" /> },
};

type SkillListing = {
  id: string;
  title: string;
  category: SkillCategory;
  type: 'offer' | 'request';
  level: 'beginner' | 'intermediate' | 'advanced';
  blurb: string;
  tags: string[];
};

type PersonListing = {
  id: string;
  name: string;
  grade: string;
  rating: number;
  offers: SkillCategory[];
  seeks: SkillCategory[];
  vibe: string;
  locationHint: string;
};

type SessionListing = {
  id: string;
  title: string;
  host: string;
  category: SkillCategory;
  when: string;
  duration: string;
  format: 'in-person' | 'online';
  spots: number;
};

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>('skills');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<SkillCategory | 'all'>('all');
  const [mode, setMode] = useState<'all' | 'offer' | 'request'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<SkillListing[]>([]);
  const [people, setPeople] = useState<PersonListing[]>([]);
  const [sessions, setSessions] = useState<SessionListing[]>([]);

  // ✅ MOVE THIS UP
  const allCats = useMemo(
    () => Object.keys(categoryMeta) as SkillCategory[],
    []
  );

  // 🔹 effect
  useEffect(() => {
    async function load() {
      const res = await fetch('/api/explore');
      const data = await res.json();

      const skillListings: SkillListing[] = [];
      const peopleMap = new Map<string, PersonListing>();
      const sessionListings: SessionListing[] = [];

      const categoryByLabel = new Map<string, SkillCategory>();

      data.skills.forEach((s: any) => {
        categoryByLabel.set(s.label.toLowerCase(), s.category);
      });


      data.skills.forEach((skill: any) => {
        skill.helpers.forEach((u: any) => {
          skillListings.push({
            id: `${skill.slug}-${u.email}`,
            title: `${skill.label} help`,
            category: skill.category,
            type: 'offer',
            level: 'intermediate',
            blurb: `${u.name} can help with ${skill.label}.`,
            tags: [skill.label],
          });

          if (!peopleMap.has(u.email)) {
            peopleMap.set(u.email, {
              id: u.email,
              name: u.name,
              grade: '',
              rating: 4.8,
              offers: (u.canTeach ?? [])
                .map((label: string) => categoryByLabel.get(label.toLowerCase()))
                .filter(Boolean) as SkillCategory[],

              seeks: (u.wantsHelpWith ?? [])
                .map((label: string) => categoryByLabel.get(label.toLowerCase()))
                .filter(Boolean) as SkillCategory[],

              vibe: 'Friendly helper',
              locationHint: 'Flexible',
            });
          }
        });

        skill.openSessions.forEach((s: any) => {
          sessionListings.push({
            id: s._id,
            title: `Help with ${skill.label}`,
            host: 'Student',
            category: skill.category,
            when: 'TBD',
            duration: '30 min',
            format: 'online',
            spots: 1,
          });
        });
      });

      setSkills(skillListings);
      setPeople(Array.from(peopleMap.values()));
      setSessions(sessionListings);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="mt-20 text-center text-sm font-semibold">
        Loading real data…
      </div>
    );
  }



  // Filter helpers
  const norm = (s: string) => s.toLowerCase().trim();

  const matchesQuery = (text: string) =>
    !norm(query) || norm(text).includes(norm(query));

  const filteredSkills = skills.filter((s) => {
    const catOk = picked === 'all' ? true : s.category === picked;
    const modeOk = mode === 'all' ? true : s.type === mode;
    const qOk = matchesQuery(`${s.title} ${s.blurb} ${s.tags.join(' ')} ${s.category} ${s.level}`);
    return catOk && modeOk && qOk;
  });

  const filteredPeople = people.filter((p) => {
    const catOk =
      picked === 'all'
        ? true
        : p.offers.includes(picked) || p.seeks.includes(picked);
    const qOk = matchesQuery(`${p.name} ${p.vibe} ${p.grade} ${p.locationHint}`);
    return catOk && qOk;
  });

  const filteredSessions = sessions.filter((s) => {
    const catOk = picked === 'all' ? true : s.category === picked;
    const qOk = matchesQuery(`${s.title} ${s.host} ${s.when} ${s.format}`);
    return catOk && qOk;
  });

  return (
    <main className="relative min-h-screen overflow-hidden text-black">
      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-14 md:pt-16">
        {/* Header */}
        <section className="relative">
          <Tape className="left-6 top-0 rotate-[-6deg]" label="explore ✨" />
          <Tape className="right-6 top-8 rotate-[6deg]" label="find your people" />

          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-10 text-balance text-4xl font-black tracking-tight md:text-5xl"
            >
              Browse skills, students, and sessions —
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-emerald-600 bg-clip-text text-transparent">
                {' '}
                pick a vibe and go.
              </span>
            </motion.h1>

            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm font-semibold text-black/70 md:text-base">
              Filter by category, search by what you need, and jump into a session request.
              Profiles, scheduling, and feedback — all in one place.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <StickerButton href="/signup" tone="pink">
                Make a profile
              </StickerButton>
              <StickerButton href="/sessions" tone="blue">
                View sessions
              </StickerButton>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="mt-10">
          <div className="rounded-[32px] border-2 border-black/70 bg-white p-5 shadow-[0_18px_0_rgba(0,0,0,0.10)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <TabButton
                  tab="skills"
                  current={tab}
                  icon={<Search className="h-4 w-4" />}
                  label="Skills"
                  onClick={() => setTab('skills')}
                />
                <TabButton
                  tab="people"
                  current={tab}
                  icon={<Users className="h-4 w-4" />}
                  label="People"
                  onClick={() => setTab('people')}
                />
                <TabButton
                  tab="sessions"
                  current={tab}
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Sessions"
                  onClick={() => setTab('sessions')}
                />
              </div>

              {/* Search + Filters */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/60" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      tab === 'skills'
                        ? 'Search: “AP calc”, “python”, “guitar”…'
                        : tab === 'people'
                          ? 'Search people: “patient”, “library”…'
                          : 'Search sessions: “Sat”, “online”…'
                    }
                    className={cn(
                      'h-11 w-full rounded-2xl border-2 border-black/70 bg-white pl-10 pr-3 text-sm font-semibold',
                      'shadow-[0_10px_0_rgba(0,0,0,0.08)] outline-none',
                      'focus:shadow-[0_10px_0_rgba(0,0,0,0.12)]'
                    )}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-4 py-2 text-sm font-extrabold',
                    'shadow-[0_10px_0_rgba(0,0,0,0.10)] transition',
                    'hover:-translate-y-0.5 active:translate-y-0'
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="rounded-3xl border-2 border-dashed border-black/50 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      {/* Category */}
                      <div>
                        <div className="text-xs font-black text-black/70">Category</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <MiniSkill
                            icon={<Sparkles className="h-4 w-4" />}
                            label="all"
                            active={picked === 'all'}
                            onClick={() => setPicked('all')}
                          />
                          {allCats.map((c) => (
                            <MiniSkill
                              key={c}
                              icon={categoryMeta[c].icon}
                              label={categoryMeta[c].label}
                              active={picked === c}
                              onClick={() => setPicked(c)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Offer/request (skills tab only) */}
                      {tab === 'skills' && (
                        <div className="md:min-w-[240px]">
                          <div className="text-xs font-black text-black/70">Skills mode</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <MiniSkill
                              icon={<Sparkles className="h-4 w-4" />}
                              label="all"
                              active={mode === 'all'}
                              onClick={() => setMode('all')}
                            />
                            <MiniSkill
                              icon={<Star className="h-4 w-4" />}
                              label="offers"
                              active={mode === 'offer'}
                              onClick={() => setMode('offer')}
                            />
                            <MiniSkill
                              icon={<GraduationCap className="h-4 w-4" />}
                              label="requests"
                              active={mode === 'request'}
                              onClick={() => setMode('request')}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-black/70">
                      <div>
                        Tip: Search “after school”, “online”, “FRQ”, “beginner”, etc.
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPicked('all');
                          setMode('all');
                          setQuery('');
                        }}
                        className="rounded-full border-2 border-black/60 bg-white px-3 py-1 font-extrabold shadow-[0_6px_0_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 active:translate-y-0"
                      >
                        reset
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Results */}
        <section className="mt-10">
          <AnimatePresence mode="wait">
            {tab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-black">
                    Showing {filteredSkills.length} skill posts
                  </div>
                  <div className="text-xs font-semibold text-black/60">
                    Click a card to request or offer a session.
                  </div>
                </div>

                {filteredSkills.length === 0 ? (
                  <div className="rounded-3xl border-2 border-black/70 bg-white p-8 text-center shadow-[0_18px_0_rgba(0,0,0,0.10)]">
                    <div className="text-lg font-black">No matches (yet)</div>
                    <div className="mt-2 text-sm font-semibold text-black/70">
                      Try another category or search something broader.
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <StickerButton href="/explore" tone="black">
                        Clear filters
                      </StickerButton>
                      <StickerButton href="/signup" tone="pink">
                        Post your first skill
                      </StickerButton>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSkills.map((s, i) => (
                      <PaperCard
                        key={s.id}
                        tilt={i % 2 === 0 ? -1.2 : 1.1}
                        className="cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-base font-black">{s.title}</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <BadgePill tone={s.type === 'offer' ? 'good' : 'warn'}>
                                {s.type === 'offer' ? 'offer' : 'request'}
                              </BadgePill>
                              <BadgePill tone="info">
                                {categoryMeta[s.category]?.icon ?? <Sparkles className="h-4 w-4" />}
                              </BadgePill>

                              <BadgePill>{s.level}</BadgePill>
                            </div>
                          </div>
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-black/70 bg-white shadow-[0_8px_0_rgba(0,0,0,0.10)]">
                            {categoryMeta[s.category]?.icon ?? <Sparkles className="h-4 w-4" />}
                          </div>
                        </div>

                        <p className="mt-3 text-sm font-semibold text-black/75">
                          {s.blurb}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {s.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border-2 border-black/50 bg-white px-3 py-1 text-[11px] font-extrabold text-black/70 shadow-[0_6px_0_rgba(0,0,0,0.06)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <Link
                            href={`/request?skill=${encodeURIComponent(s.title)}`}
                            className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/80 bg-black px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 active:translate-y-0"
                          >
                            Request session <ArrowRight className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/profiles`}
                            className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-4 py-2 text-xs font-extrabold text-black shadow-[0_10px_0_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 active:translate-y-0"
                          >
                            See profiles <Users className="h-4 w-4" />
                          </Link>
                        </div>
                      </PaperCard>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'people' && (
              <motion.div
                key="people"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-black">
                    Showing {filteredPeople.length} people
                  </div>
                  <div className="text-xs font-semibold text-black/60">
                    Find someone who offers what you need (and vice versa).
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPeople.map((p, i) => (
                    <PaperCard key={p.id} tilt={i % 2 === 0 ? 1.0 : -1.0}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-base font-black">{p.name}</div>
                          <div className="mt-1 text-xs font-semibold text-black/60">
                            {p.grade} • {p.locationHint}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <BadgePill tone="good">
                              <Star className="h-3.5 w-3.5" /> {p.rating.toFixed(1)}
                            </BadgePill>
                          </div>
                        </div>

                        <div className="h-12 w-12 rounded-2xl border-2 border-black/70 bg-gradient-to-br from-pink-200/70 via-white to-emerald-200/70 shadow-[0_10px_0_rgba(0,0,0,0.10)]" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-black/75">
                        {p.vibe}
                      </p>

                      <div className="mt-4">
                        <div className="text-xs font-black text-black/70">Offers</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {p.offers
                            .filter((c) => categoryMeta[c as SkillCategory])
                            .slice(0, 3)
                            .map((c) => (
                              <BadgePill key={`${p.id}-o-${c}`} tone="good">
                                {categoryMeta[c as SkillCategory].label}
                              </BadgePill>
                            ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-xs font-black text-black/70">Wants</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {p.seeks.slice(0, 3).map((c) => (
                            <BadgePill key={`${p.id}-s-${c}`} tone="warn">
                              {categoryMeta[c]?.label ?? String(c)}
                            </BadgePill>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          href={`/profiles/${p.id}`}
                          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/80 bg-black px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 active:translate-y-0"
                        >
                          View profile <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/messages?to=${encodeURIComponent(p.name)}`}
                          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-4 py-2 text-xs font-extrabold text-black shadow-[0_10px_0_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Message
                        </Link>
                      </div>
                    </PaperCard>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === 'sessions' && (
              <motion.div
                key="sessions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-black">
                    Showing {filteredSessions.length} sessions
                  </div>
                  <div className="text-xs font-semibold text-black/60">
                    Pick one and join — then leave feedback after.
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSessions.map((s, i) => (
                    <PaperCard key={s.id} tilt={i % 2 === 0 ? -1.1 : 1.2}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-base font-black">{s.title}</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <BadgePill tone="info">{categoryMeta[s.category].label}</BadgePill>
                            <BadgePill tone={s.format === 'online' ? 'plain' : 'good'}>
                              {s.format}
                            </BadgePill>
                            <BadgePill>{s.duration}</BadgePill>
                          </div>
                        </div>
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-black/70 bg-white shadow-[0_8px_0_rgba(0,0,0,0.10)]">
                          {categoryMeta[s.category].icon}
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-sm font-semibold text-black/75">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {s.when}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Host: {s.host}
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Spots left: <span className="font-black">{s.spots}</span>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          href={`/sessions/${s.id}`}
                          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/80 bg-black px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 active:translate-y-0"
                        >
                          View details <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/sessions/${s.id}/join`}
                          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-4 py-2 text-xs font-extrabold text-black shadow-[0_10px_0_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Join session
                        </Link>
                      </div>
                    </PaperCard>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-[34px] border-2 border-black/70 bg-white p-8 shadow-[0_22px_0_rgba(0,0,0,0.10)] md:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/60 via-white to-emerald-200/60" />
            <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />
            <div className="relative grid items-center gap-6 md:grid-cols-12">
              <div className="md:col-span-8">
                <h3 className="text-3xl font-black tracking-tight md:text-4xl">
                  Don’t just browse — post one thing.
                </h3>
                <p className="mt-3 text-sm font-semibold text-black/75 md:text-base">
                  The best matches happen when you list what you can teach *and* what you want to learn.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <StickerButton href="/signup" tone="green">
                    Create profile
                  </StickerButton>
                  <StickerButton href="/request" tone="black">
                    Post a request
                  </StickerButton>
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="rounded-3xl border-2 border-black/70 bg-white p-5 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                  <div className="text-sm font-black">Quick idea</div>
                  <div className="mt-2 text-xs font-semibold text-black/70">
                    “I can teach: ________”<br />
                    “I want help with: ________”
                  </div>
                  <div className="mt-4 rounded-2xl border-2 border-dashed border-black/50 bg-slate-50 px-4 py-3 text-xs font-semibold text-black/70">
                    After sessions, ratings + feedback help everyone find better matches.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-10 text-center text-xs font-semibold text-black/55">
            © {new Date().getFullYear()} SkillSwap • explore
          </footer>
        </section>
      </div>
    </main>
  );
}