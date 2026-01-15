'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

/* ───────────────────────── helpers ───────────────────────── */

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

function SkillChip({
  label,
  selected,
  onClick,
  isCustom,
  onDelete,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  isCustom?: boolean;
  onDelete?: () => void;
}) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => isCustom && setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <button
        onClick={onClick}
        className={[
          'rounded-full border-2 px-4 py-2 text-xs font-extrabold transition',
          'shadow-[0_6px_0_rgba(0,0,0,0.10)]',
          selected
            ? 'border-black bg-black text-white'
            : 'border-black/70 bg-white text-black hover:-rotate-1',
        ].join(' ')}
      >
        {label}
      </button>
      {isCustom && showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
          title="Delete custom skill"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── SkillSection ─────────────────────── */

function SkillSection({
  title,
  selectedSkills,
  searchQuery,
  onSearchChange,
  allSkills,
  onToggle,
  onAddCustom,
  onDeleteCustomSkill,
}: {
  title: string;
  selectedSkills: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allSkills: { slug: string; label: string; category?: string }[];
  onToggle: (slug: string) => void;
  onAddCustom: (newSkill: { slug: string; label: string; category?: string }) => void;
  onDeleteCustomSkill?: (slug: string) => void;
}) {
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [category, setCategory] = useState('all');
  const [expanded, setExpanded] = useState(false);

  const CATEGORIES = ['all', 'study', 'tech', 'design', 'communication', 'custom'];
  const MAX_VISIBLE = 12;

  const filtered = allSkills.filter((s) => {
    const matchesSearch = s.label.toLowerCase().includes(searchQuery.toLowerCase());
    const cat = s.category ?? 'custom';
    const matchesCategory = category === 'all' || cat === category;
    return matchesSearch && matchesCategory;
  });

  const ordered = searchQuery
    ? filtered.filter((s) => !selectedSkills.includes(s.slug))
    : [
        ...filtered.filter((s) => selectedSkills.includes(s.slug)),
        ...filtered.filter((s) => !selectedSkills.includes(s.slug)),
      ];

  const visible = expanded ? ordered : ordered.slice(0, MAX_VISIBLE);

  async function handleAddCustom() {
    if (!customInput.trim()) return;

    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: customInput }),
    });

    if (!res.ok) return;

    const newSkill = await res.json();
    onAddCustom({ slug: newSkill.slug, label: newSkill.label, category: 'custom' });
    setCustomInput('');
    setShowAddCustom(false);
  }

  return (
    <section className="mt-10">
      <h2 className="text-sm font-black">{title}</h2>
      <p className="mt-1 text-xs font-semibold text-black/50">
        Pick 2–5 skills (you can change this later)
      </p>

      {/* Selected tray */}
      {selectedSkills.length > 0 && (
        <div className="mt-3 rounded-2xl border-2 border-black/60 bg-slate-50 p-3">
          <div className="mb-2 text-xs font-black text-black/70">
            Selected ({selectedSkills.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {allSkills
              .filter((s) => selectedSkills.includes(s.slug))
              .map((s) => (
                <SkillChip
                  key={s.slug}
                  label={s.label}
                  selected
                  onClick={() => onToggle(s.slug)}
                  isCustom={s.category === 'custom'}
                  onDelete={() => onDeleteCustomSkill?.(s.slug)}
                />
              ))}
          </div>
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search skills…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mt-4 w-full rounded-lg border-2 border-black/70 px-4 py-2 text-sm font-semibold placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black/50"
      />

      {/* Category pills */}
      <div className="mt-3 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={[
              'rounded-full border-2 px-3 py-1 text-xs font-extrabold transition',
              category === c
                ? 'border-black bg-black text-white'
                : 'border-black/60 bg-white hover:-rotate-1',
            ].join(' ')}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Add custom */}
      <button
        onClick={() => setShowAddCustom((v) => !v)}
        className="mt-4 flex items-center gap-2 rounded-lg border-2 border-black/50 px-3 py-1.5 text-xs font-extrabold hover:bg-black/5"
      >
        <Plus className="h-3 w-3" />
        Add custom skill
      </button>

      {showAddCustom && (
        <div className="mt-3 flex gap-2">
          <input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            placeholder="Enter skill name…"
            className="flex-1 rounded-lg border-2 border-black/70 px-3 py-1.5 text-xs font-semibold focus:outline-none"
            autoFocus
          />
          <button
            onClick={handleAddCustom}
            className="rounded-lg bg-black px-3 py-1.5 text-xs font-extrabold text-white"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowAddCustom(false);
              setCustomInput('');
            }}
            className="rounded-lg border-2 border-black/70 px-3 py-1.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Skills grid */}
      <div className="mt-4 flex flex-wrap gap-2">
        {visible.map((s) => (
          <SkillChip
            key={s.slug}
            label={s.label}
            selected={selectedSkills.includes(s.slug)}
            onClick={() => onToggle(s.slug)}
            isCustom={s.category === 'custom'}
            onDelete={() => onDeleteCustomSkill?.(s.slug)}
          />
        ))}
      </div>

      {ordered.length > MAX_VISIBLE && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-xs font-extrabold underline decoration-dashed underline-offset-4"
        >
          {expanded
            ? 'Show fewer skills'
            : `Show ${ordered.length - MAX_VISIBLE} more`}
        </button>
      )}
    </section>
  );
}

/* ─────────────────────── OnboardingPage ───────────────────── */

export default function OnboardingPage() {
  const [teach, setTeach] = useState<string[]>([]);
  const [learn, setLearn] = useState<string[]>([]);
  const [skills, setSkills] = useState<
    { slug: string; label: string; category?: string }[]
  >([]);
  const [teachSearch, setTeachSearch] = useState('');
  const [learnSearch, setLearnSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const skillsRes = await fetch('/api/skills');
      const skillsData = await skillsRes.json();
      setSkills(skillsData.skills || []);

      const userSkillsRes = await fetch('/api/user-skills');
      if (userSkillsRes.ok) {
        const userSkills = await userSkillsRes.json();
        setTeach(userSkills.canTeach || []);
        setLearn(userSkills.wantsHelpWith || []);
      }

      setLoading(false);
    }
    load();
  }, []);

  function toggle(slug: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(slug) ? list.filter((x) => x !== slug) : [...list, slug]);
  }

  const handleDeleteCustomSkill = async (slug: string) => {
    if (!confirm('Delete this custom skill?')) return;

    try {
      const res = await fetch(`/api/skills?slug=${slug}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Delete failed:', errorData);
        alert('Failed to delete skill: ' + (errorData.error || 'Unknown error'));
        return;
      }

      // Remove from skills list
      setSkills((prev) => prev.filter((s) => s.slug !== slug));
      // Remove from selections if selected
      setTeach((prev) => prev.filter((s) => s !== slug));
      setLearn((prev) => prev.filter((s) => s !== slug));
    } catch (error) {
      console.error('Failed to delete skill:', error);
      alert('Failed to delete skill');
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm font-semibold">
        Loading…
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-black">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-2xl"
        >
          <Tape label="step 1 of 1" className="-left-6 -top-4 rotate-[-6deg]" />

          <div className="rounded-[32px] border-2 border-black/70 bg-white shadow-[0_22px_0_rgba(0,0,0,0.10)]">
            <div className="p-8">
              <h1 className="text-center text-3xl font-black">
                Let’s set up your skills
              </h1>

              <SkillSection
                title="What can you help others with?"
                selectedSkills={teach}
                searchQuery={teachSearch}
                onSearchChange={setTeachSearch}
                allSkills={skills}
                onToggle={(s) => toggle(s, teach, setTeach)}
                onAddCustom={(newSkill) => {
                  setSkills((prev) => [...prev, newSkill]);
                  setTeach((prev) => [...prev, newSkill.slug]);
                }}
                onDeleteCustomSkill={handleDeleteCustomSkill}
              />

              <SkillSection
                title="What do you want help with?"
                selectedSkills={learn}
                searchQuery={learnSearch}
                onSearchChange={setLearnSearch}
                allSkills={skills}
                onToggle={(s) => toggle(s, learn, setLearn)}
                onAddCustom={(newSkill) => {
                  setSkills((prev) => [...prev, newSkill]);
                  setLearn((prev) => [...prev, newSkill.slug]);
                }}
                onDeleteCustomSkill={handleDeleteCustomSkill}
              />

              <div className="mt-10 flex flex-col items-center gap-4">
                <button
                  onClick={async () => {
                    await fetch('/api/onboarding', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        canTeach: teach,
                        wantsHelpWith: learn,
                      }),
                    });
                    window.location.href = '/explore';
                  }}
                  className="rounded-[18px] border-2 border-black bg-black px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.20)]"
                >
                  Finish setup <ArrowRight className="inline h-4 w-4" />
                </button>

                <div className="flex items-center gap-2 text-xs font-semibold text-black/60">
                  <CheckCircle2 className="h-4 w-4" />
                  You can edit skills anytime
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}