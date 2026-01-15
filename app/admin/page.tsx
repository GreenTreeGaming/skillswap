'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Star,
  ArrowRight,
  Wrench,
} from 'lucide-react';

function AdminCard({
  title,
  desc,
  href,
  icon,
  tone = 'white',
}: {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  tone?: 'white' | 'yellow' | 'green' | 'blue';
}) {
  const bg =
    tone === 'yellow'
      ? 'bg-yellow-200/70'
      : tone === 'green'
      ? 'bg-emerald-200/70'
      : tone === 'blue'
      ? 'bg-sky-200/70'
      : 'bg-white';

  return (
    <motion.div
      whileHover={{ y: -4, rotate: -0.5 }}
      className={[
        'relative overflow-hidden rounded-[28px] border-2 border-black/70 p-5',
        'shadow-[0_18px_0_rgba(0,0,0,0.10)]',
        bg,
      ].join(' ')}
    >
      <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative">
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-black/70 bg-white shadow-[0_8px_0_rgba(0,0,0,0.12)]">
          {icon}
        </div>

        <h3 className="text-base font-black">{title}</h3>
        <p className="mt-1 text-sm font-semibold text-black/70">{desc}</p>

        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold underline underline-offset-4"
        >
          Open <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-black">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fbfbff] to-white" />
        <motion.div
          className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-yellow-300/30 via-pink-300/20 to-sky-300/20 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-40 top-20 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-emerald-300/25 via-sky-300/20 to-yellow-200/30 blur-3xl"
          animate={{ x: [0, -60, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-14">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 rounded-[32px] border-2 border-black/70 bg-white p-6 shadow-[0_22px_0_rgba(0,0,0,0.10)]"
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black/70 bg-emerald-100 shadow-[0_10px_0_rgba(0,0,0,0.12)]">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm font-semibold text-black/65">
                Internal tools for managing SkillSwap
              </p>
            </div>
          </div>
        </motion.div>

        {/* grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <AdminCard
            title="Users"
            desc="View users, profiles, ratings, and flags."
            href="/admin/users"
            icon={<Users className="h-5 w-5" />}
            tone="yellow"
          />

          <AdminCard
            title="Skills"
            desc="Review, approve, or remove skills."
            href="/admin/skills"
            icon={<GraduationCap className="h-5 w-5" />}
            tone="green"
          />

          <AdminCard
            title="Sessions & ratings"
            desc="Inspect completed sessions and ratings."
            href="/admin/sessions"
            icon={<Star className="h-5 w-5" />}
            tone="blue"
          />
        </div>

        {/* footer note */}
        <div className="mt-12 text-center text-xs font-semibold text-black/50">
          Admin tools are internal and subject to change.
        </div>
      </div>
    </main>
  );
}