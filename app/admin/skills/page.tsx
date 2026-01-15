'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Tag,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminSkill {
  slug: string;
  label: string;
  category?: string;
  createdBy?: string;
  active?: boolean;
  createdAt?: string;
}

export default function AdminSkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch('/api/admin/skills');
    const data = await res.json();
    setSkills(data.skills || []);
    setLoading(false);
  }

  async function updateSkill(slug: string, updates: Partial<AdminSkill>) {
    await fetch('/api/admin/skills', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, updates }),
    });
    load();
  }

  async function deleteSkill(slug: string) {
    if (!confirm(`Delete skill "${slug}"? This cannot be undone.`)) return;

    await fetch('/api/admin/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    load();
  }

  const filtered = useMemo(() => {
    return skills.filter(
      (s) =>
        s.label.toLowerCase().includes(query.toLowerCase()) ||
        s.slug.toLowerCase().includes(query.toLowerCase())
    );
  }, [skills, query]);

  if (loading) {
    return (
      <div className="mt-20 text-center text-sm font-semibold">
        Loading skills…
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-12 text-black">
      {/* back */}
      <button
        onClick={() => router.push('/admin')}
        className="mb-4 inline-flex items-center gap-2 rounded-[18px] border-2 border-black/70 bg-white px-4 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.10)]"
      >
        ← Back to Admin
      </button>

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-[32px] border-2 border-black/70 bg-white p-6 shadow-[0_22px_0_rgba(0,0,0,0.10)]"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black/70 bg-yellow-200 shadow-[0_10px_0_rgba(0,0,0,0.12)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Skills</h1>
            <p className="text-sm font-semibold text-black/65">
              Manage all skills in the platform
            </p>
          </div>
        </div>
      </motion.div>

      {/* search */}
      <div className="mb-6 flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-4 py-3 shadow-[0_10px_0_rgba(0,0,0,0.08)]">
        <Search className="h-4 w-4" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by label or slug…"
          className="w-full text-sm font-semibold outline-none"
        />
      </div>

      {/* table */}
      <div className="overflow-hidden rounded-[28px] border-2 border-black/70 bg-white shadow-[0_18px_0_rgba(0,0,0,0.10)]">
        <table className="w-full text-sm">
          <thead className="border-b-2 border-black/70 bg-slate-50">
            <tr className="text-left font-black">
              <th className="p-4">Skill</th>
              <th>Category</th>
              <th>Created by</th>
              <th>Status</th>
              <th className="pr-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.slug} className="border-t border-black/10">
                <td className="p-4">
                  <div className="font-black">{s.label}</div>
                  <div className="text-xs font-semibold text-black/60">
                    {s.slug}
                  </div>
                </td>

                <td className="text-xs font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {s.category ?? 'custom'}
                  </span>
                </td>

                <td className="text-xs font-semibold">
                  {s.createdBy ?? '—'}
                </td>

                <td>
                  {s.active ? (
                    <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-black">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black">
                      Disabled
                    </span>
                  )}
                </td>

                <td className="pr-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        updateSkill(s.slug, { active: !s.active })
                      }
                      className="rounded-xl border-2 border-black/70 bg-white p-2 shadow-[0_6px_0_rgba(0,0,0,0.08)]"
                      title="Toggle active"
                    >
                      {s.active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => deleteSkill(s.slug)}
                      className="rounded-xl border-2 border-red-600 bg-red-500 p-2 text-white shadow-[0_6px_0_rgba(0,0,0,0.10)]"
                      title="Delete skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}