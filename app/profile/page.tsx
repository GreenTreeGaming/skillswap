'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Settings,
  LogOut,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';

interface UserDoc {
  name: string;
  email: string;
  image?: string;
  canTeach: string[];
  wantsHelpWith: string[];
}

function SkillPill({ label }: { label: string }) {
  return (
    <div className="rounded-full border-2 border-black/70 bg-white px-3 py-1.5 text-xs font-extrabold shadow-[0_6px_0_rgba(0,0,0,0.10)]">
      {label}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔒 auth guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // fetch user doc
  useEffect(() => {
    if (!session?.user?.email) return;

    async function load() {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
      setLoading(false);
    }

    load();
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold">
        Loading profile…
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="relative mx-auto max-w-5xl px-6 pb-20 pt-12 text-black">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[32px] border-2 border-black/70 bg-white p-6 shadow-[0_22px_0_rgba(0,0,0,0.10)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-200/50 via-white to-emerald-200/50" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-3xl border-2 border-black/80 bg-white shadow-[0_10px_0_rgba(0,0,0,0.12)]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="grid h-full w-full place-items-center">
                  <User className="h-6 w-6" />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                {user.name}
              </h1>
              <p className="text-sm font-semibold text-black/65">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push('/onboarding')}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-4 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.10)] hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" />
              Edit skills
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-4 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.10)] hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </motion.div>

      {/* skills */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* Can teach */}
        <div
          className="rounded-[28px] border-2 border-black/70 bg-white p-5 shadow-[0_18px_0_rgba(0,0,0,0.10)]"
          style={{ transform: 'rotate(-0.6deg)' }}
        >
          <div className="flex items-center gap-2 text-sm font-black">
            <GraduationCap className="h-4 w-4" />
            Skills you can teach
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {user.canTeach.length ? (
              user.canTeach.map((s) => <SkillPill key={s} label={s} />)
            ) : (
              <div className="text-xs font-semibold text-black/60">
                You haven’t added any yet.
              </div>
            )}
          </div>
        </div>

        {/* Wants help */}
        <div
          className="rounded-[28px] border-2 border-black/70 bg-white p-5 shadow-[0_18px_0_rgba(0,0,0,0.10)]"
          style={{ transform: 'rotate(0.6deg)' }}
        >
          <div className="flex items-center gap-2 text-sm font-black">
            <HelpCircle className="h-4 w-4" />
            Skills you want help with
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {user.wantsHelpWith.length ? (
              user.wantsHelpWith.map((s) => <SkillPill key={s} label={s} />)
            ) : (
              <div className="text-xs font-semibold text-black/60">
                Nothing listed yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}