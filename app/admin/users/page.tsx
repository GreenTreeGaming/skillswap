'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Star,
    Trash2,
    UserCheck,
    UserX,
    Search,
} from 'lucide-react';

interface AdminUser {
    name: string;
    email: string;
    image?: string;
    admin?: boolean;
    ratingAvg?: number;
    ratingCount?: number;
    canTeach?: string[];
    wantsHelpWith?: string[];
    createdAt?: string;
}

import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Tooltip({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        function onEnter() {
            const r = ref.current!.getBoundingClientRect();
            setPos({
                x: r.left + r.width / 2,
                y: r.top,
            });
        }

        function onLeave() {
            setPos(null);
        }

        const el = ref.current;
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);

        return () => {
            el.removeEventListener('mouseenter', onEnter);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <>
            <div ref={ref} className="inline-flex">
                {children}
            </div>

            {pos &&
                createPortal(
                    <div
                        className="
              fixed z-[9999]
              -translate-x-1/2 -translate-y-2
              rounded-xl border-2 border-black/70 bg-white px-3 py-1.5
              text-[11px] font-extrabold text-black
              shadow-[0_8px_0_rgba(0,0,0,0.12)]
              pointer-events-none
            "
                        style={{ left: pos.x, top: pos.y }}
                    >
                        {label}
                    </div>,
                    document.body
                )}
        </>
    );
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data.users || []);
        setLoading(false);
    }

    async function updateUser(email: string, updates: Partial<AdminUser>) {
        await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, updates }),
        });
        load();
    }

    async function deleteUser(email: string) {
        if (!confirm(`Delete ${email}? This cannot be undone.`)) return;

        await fetch('/api/admin/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        load();
    }

    const filtered = useMemo(() => {
        return users.filter(
            (u) =>
                u.name?.toLowerCase().includes(query.toLowerCase()) ||
                u.email.toLowerCase().includes(query.toLowerCase())
        );
    }, [users, query]);

    if (loading) {
        return (
            <div className="mt-20 text-center text-sm font-semibold">
                Loading users…
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-6 pb-20 pt-12 text-black">
            {/* header */}
            <div className="mb-4">
                <button
                    onClick={() => router.push('/admin')}
                    className="
      inline-flex items-center gap-2
      rounded-[18px] border-2 border-black/70 bg-white
      px-4 py-2 text-sm font-extrabold
      shadow-[0_8px_0_rgba(0,0,0,0.10)]
      transition hover:-translate-y-0.5
      active:translate-y-0 active:shadow-[0_5px_0_rgba(0,0,0,0.10)]
    "
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Admin
                </button>
            </div>
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
                        <h1 className="text-3xl font-black">Users</h1>
                        <p className="text-sm font-semibold text-black/65">
                            Manage accounts, admins, and ratings
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
                    placeholder="Search by name or email…"
                    className="w-full text-sm font-semibold outline-none"
                />
            </div>

            {/* table */}
            <div className="overflow-hidden rounded-[28px] border-2 border-black/70 bg-white shadow-[0_18px_0_rgba(0,0,0,0.10)]">
                <table className="w-full text-sm">
                    <thead className="border-b-2 border-black/70 bg-slate-50">
                        <tr className="text-left font-black">
                            <th className="p-4">User</th>
                            <th>Rating</th>
                            <th>Skills</th>
                            <th>Admin</th>
                            <th className="pr-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((u) => (
                            <tr key={u.email} className="border-t border-black/10">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {u.image && (
                                            <img
                                                src={u.image}
                                                alt={u.name}
                                                className="h-9 w-9 rounded-xl border-2 border-black/70"
                                                referrerPolicy="no-referrer"
                                            />
                                        )}
                                        <div>
                                            <div className="font-black">{u.name}</div>
                                            <div className="text-xs font-semibold text-black/60">
                                                {u.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div className="flex items-center gap-1 font-extrabold">
                                        <Star className="h-4 w-4" />
                                        {u.ratingAvg
                                            ? `${u.ratingAvg.toFixed(1)} (${u.ratingCount})`
                                            : 'New'}
                                    </div>
                                </td>

                                <td className="text-xs font-semibold">
                                    {u.canTeach?.length ?? 0} teach /{' '}
                                    {u.wantsHelpWith?.length ?? 0} learn
                                </td>

                                <td>
                                    {u.admin ? (
                                        <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-black">
                                            Admin
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black">
                                            User
                                        </span>
                                    )}
                                </td>

                                <td className="pr-4">
                                    <div className="flex justify-end gap-2">
                                        <Tooltip label={u.admin ? 'Remove admin access' : 'Grant admin access'}>
                                            <button
                                                onClick={() => updateUser(u.email, { admin: !u.admin })}
                                                className="rounded-xl border-2 border-black/70 bg-white p-2 shadow-[0_6px_0_rgba(0,0,0,0.08)]"
                                            >
                                                {u.admin ? (
                                                    <UserX className="h-4 w-4" />
                                                ) : (
                                                    <UserCheck className="h-4 w-4" />
                                                )}
                                            </button>
                                        </Tooltip>
                                        <Tooltip label="Reset rating to 0 (removes all stars)">
                                            <button
                                                onClick={() =>
                                                    updateUser(u.email, {
                                                        ratingAvg: 0,
                                                        ratingCount: 0,
                                                    })
                                                }
                                                className="rounded-xl border-2 border-black/70 bg-white p-2 shadow-[0_6px_0_rgba(0,0,0,0.08)]"
                                            >
                                                <Star className="h-4 w-4" />
                                            </button>
                                        </Tooltip>

                                        <Tooltip label="Delete user permanently (cannot be undone)">
                                            <button
                                                onClick={() => deleteUser(u.email)}
                                                className="rounded-xl border-2 border-red-600 bg-red-500 p-2 text-white shadow-[0_6px_0_rgba(0,0,0,0.10)]"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </Tooltip>
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