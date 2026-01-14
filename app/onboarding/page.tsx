'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Search, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

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
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'rounded-full border-2 px-4 py-2 text-xs font-extrabold transition cursor-pointer',
        'shadow-[0_6px_0_rgba(0,0,0,0.10)]',
        selected
          ? 'border-black bg-black text-white'
          : 'border-black/70 bg-white text-black hover:-rotate-1',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

export default function OnboardingPage() {
  const [teach, setTeach] = useState<string[]>([]);
  const [learn, setLearn] = useState<string[]>([]);
  const [previousTeach, setPreviousTeach] = useState<string[]>([]);
  const [previousLearn, setPreviousLearn] = useState<string[]>([]);
  const [skills, setSkills] = useState<
    { slug: string; label: string }[]
  >([]);
  const [searchQueryTeach, setSearchQueryTeach] = useState('');
  const [searchQueryLearn, setSearchQueryLearn] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState<'teach' | 'learn' | null>(null);

  // 🔹 Load skills from DB
  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((data) => setSkills(data.skills));
  }, []);

  // 🔹 Load user's existing skills
  useEffect(() => {
    fetch('/api/onboarding')
      .then((r) => r.json())
      .then((data) => {
        setPreviousTeach(data.canTeach || []);
        setPreviousLearn(data.wantsHelpWith || []);
        setTeach(data.canTeach || []);
        setLearn(data.wantsHelpWith || []);
      });
  }, []);

  function toggle(
    slug: string,
    list: string[],
    setList: (v: string[]) => void
  ) {
    setList(
      list.includes(slug)
        ? list.filter((x) => x !== slug)
        : [...list, slug]
    );
  }

  function addCustomSkill(section: 'teach' | 'learn') {
    if (!customSkillInput.trim()) return;

    const customLabel = customSkillInput.trim();

    // Save to database
    fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: customLabel }),
    })
      .then((r) => r.json())
      .then((data) => {
        const { skill } = data;
        
        // Add to local skills list if not already present
        const exists = skills.some(s => s.slug === skill.slug);
        if (!exists) {
          setSkills([...skills, skill]);
        }

        // Add to appropriate section
        if (section === 'teach') {
          if (!teach.includes(skill.slug)) {
            setTeach([...teach, skill.slug]);
          }
        } else {
          if (!learn.includes(skill.slug)) {
            setLearn([...learn, skill.slug]);
          }
        }

        // Reset input
        setCustomSkillInput('');
        setShowCustomInput(null);
      })
      .catch((err) => {
        console.error('Error adding custom skill:', err);
        alert('Failed to add custom skill. Please try again.');
      });
  }

  // Filter and sort skills for teach section (selected first)
  const filteredTeachSkills = skills
    .filter(s => s.label.toLowerCase().includes(searchQueryTeach.toLowerCase()))
    .sort((a, b) => {
      const aSelected = teach.includes(a.slug);
      const bSelected = teach.includes(b.slug);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

  // Filter and sort skills for learn section (selected first)
  const filteredLearnSkills = skills
    .filter(s => s.label.toLowerCase().includes(searchQueryLearn.toLowerCase()))
    .sort((a, b) => {
      const aSelected = learn.includes(a.slug);
      const bSelected = learn.includes(b.slug);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

  // Display logic: show ALL selected skills first, then all unselected
  const getDisplayedSkills = (filtered: typeof skills, selected: string[], hasSearch: boolean) => {
    if (hasSearch) return filtered; // Show all when searching
    
    const selectedSkills = filtered.filter(s => selected.includes(s.slug));
    const unselectedSkills = filtered.filter(s => !selected.includes(s.slug));
    return [...selectedSkills, ...unselectedSkills];
  };

  const displayedTeachSkills = getDisplayedSkills(filteredTeachSkills, teach, !!searchQueryTeach);
  const displayedLearnSkills = getDisplayedSkills(filteredLearnSkills, learn, !!searchQueryLearn);

  return (
    <main className="relative min-h-screen overflow-hidden text-black">
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-2xl"
        >
          <Tape label="step 1 of 1" className="-left-6 -top-4 rotate-[-6deg]" />

          <div className="relative overflow-hidden rounded-[32px] border-2 border-black/70 bg-white shadow-[0_22px_0_rgba(0,0,0,0.10)]">
            <div className="relative p-8">
              <h1 className="text-center text-3xl font-black">
                Let’s set up your skills
              </h1>

              {/* Teach */}
              <section className="mt-8">
                <h2 className="text-sm font-black">
                  What can you help others with?
                </h2>

                {/* Search Bar for Teach */}
                <div className="mt-3 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/60" />
                  <input
                    type="text"
                    value={searchQueryTeach}
                    onChange={(e) => setSearchQueryTeach(e.target.value)}
                    placeholder="Search skills to teach..."
                    className="w-full rounded-full border-2 border-black/70 bg-white pl-10 pr-4 py-2 text-sm font-semibold shadow-[0_6px_0_rgba(0,0,0,0.10)] outline-none focus:shadow-[0_6px_0_rgba(0,0,0,0.15)]"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {displayedTeachSkills.map((s) => (
                    <SkillChip
                      key={s.slug}
                      label={s.label}
                      selected={teach.includes(s.slug)}
                      onClick={() => toggle(s.slug, teach, setTeach)}
                    />
                  ))}
                </div>

                {/* Custom skill input for teach */}
                {showCustomInput === 'teach' ? (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addCustomSkill('teach');
                        if (e.key === 'Escape') {
                          setShowCustomInput(null);
                          setCustomSkillInput('');
                        }
                      }}
                      placeholder="Enter custom skill..."
                      className="flex-1 rounded-full border-2 border-black/70 bg-white px-4 py-2 text-xs font-semibold shadow-[0_6px_0_rgba(0,0,0,0.10)] outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => addCustomSkill('teach')}
                      className="cursor-pointer rounded-full border-2 border-black bg-black px-4 py-2 text-xs font-extrabold text-white shadow-[0_6px_0_rgba(0,0,0,0.10)]"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(null);
                        setCustomSkillInput('');
                      }}
                      className="cursor-pointer rounded-full border-2 border-black/70 bg-white px-4 py-2 text-xs font-extrabold text-black shadow-[0_6px_0_rgba(0,0,0,0.10)]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCustomInput('teach')}
                    className="cursor-pointer mt-4 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-black/50 bg-white px-4 py-2 text-xs font-extrabold text-black/70 shadow-[0_6px_0_rgba(0,0,0,0.08)] transition hover:-rotate-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add custom skill
                  </button>
                )}
              </section>

              {/* Learn */}
              <section className="mt-8">
                <h2 className="text-sm font-black">
                  What do you want help with?
                </h2>

                {/* Search Bar for Learn */}
                <div className="mt-3 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/60" />
                  <input
                    type="text"
                    value={searchQueryLearn}
                    onChange={(e) => setSearchQueryLearn(e.target.value)}
                    placeholder="Search skills to learn..."
                    className="w-full rounded-full border-2 border-black/70 bg-white pl-10 pr-4 py-2 text-sm font-semibold shadow-[0_6px_0_rgba(0,0,0,0.10)] outline-none focus:shadow-[0_6px_0_rgba(0,0,0,0.15)]"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {displayedLearnSkills.map((s) => (
                    <SkillChip
                      key={s.slug}
                      label={s.label}
                      selected={learn.includes(s.slug)}
                      onClick={() => toggle(s.slug, learn, setLearn)}
                    />
                  ))}
                </div>

                {/* Custom skill input for learn */}
                {showCustomInput === 'learn' ? (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addCustomSkill('learn');
                        if (e.key === 'Escape') {
                          setShowCustomInput(null);
                          setCustomSkillInput('');
                        }
                      }}
                      placeholder="Enter custom skill..."
                      className="flex-1 rounded-full border-2 border-black/70 bg-white px-4 py-2 text-xs font-semibold shadow-[0_6px_0_rgba(0,0,0,0.10)] outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => addCustomSkill('learn')}
                      className="cursor-pointer rounded-full border-2 border-black bg-black px-4 py-2 text-xs font-extrabold text-white shadow-[0_6px_0_rgba(0,0,0,0.10)]"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(null);
                        setCustomSkillInput('');
                      }}
                      className="cursor-pointer rounded-full border-2 border-black/70 bg-white px-4 py-2 text-xs font-extrabold text-black shadow-[0_6px_0_rgba(0,0,0,0.10)]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCustomInput('learn')}
                    className="cursor-pointer mt-4 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-black/50 bg-white px-4 py-2 text-xs font-extrabold text-black/70 shadow-[0_6px_0_rgba(0,0,0,0.08)] transition hover:-rotate-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add custom skill
                  </button>
                )}
              </section>

              {/* CTA */}
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
                  className="cursor-pointer rounded-[18px] border-2 border-black bg-black px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.20)]"
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