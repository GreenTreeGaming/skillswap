'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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
        'rounded-full border-2 px-4 py-2 text-xs font-extrabold transition',
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
  const [skills, setSkills] = useState<
    { slug: string; label: string }[]
  >([]);

  // 🔹 Load skills from DB
  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((data) => setSkills(data.skills));
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

                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <SkillChip
                      key={s.slug}
                      label={s.label}
                      selected={teach.includes(s.slug)}
                      onClick={() => toggle(s.slug, teach, setTeach)}
                    />
                  ))}
                </div>
              </section>

              {/* Learn */}
              <section className="mt-8">
                <h2 className="text-sm font-black">
                  What do you want help with?
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <SkillChip
                      key={s.slug}
                      label={s.label}
                      selected={learn.includes(s.slug)}
                      onClick={() => toggle(s.slug, learn, setLearn)}
                    />
                  ))}
                </div>
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