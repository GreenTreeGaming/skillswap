'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CalendarDays,
    User,
    ArrowRight,
    CheckCircle2,
    Clock,
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Session {
    _id: string;
    tutorEmail: string;
    requesterEmail: string;
    skillSlug: string;
    skillLabel?: string;
    status: 'pending' | 'active' | 'completed';
    createdAt: string;
}

export default function SessionsPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const res = await fetch('/api/sessions');

            if (!res.ok) {
                throw new Error(`Failed to load sessions (${res.status})`);
            }

            const data = await res.json();
            setSessions(data.sessions || []);
        } catch (err: any) {
            console.error('Sessions load failed:', err);
            setError('Could not load sessions. Are you signed in?');
        } finally {
            setLoading(false);
        }
    }

    const grouped = useMemo(() => {
        return {
            active: sessions.filter((s) => s.status === 'active'),
            pending: sessions.filter((s) => s.status === 'pending'),
            completed: sessions.filter((s) => s.status === 'completed'),
        };
    }, [sessions]);

    if (loading) {
        return (
            <div className="mt-20 text-center text-sm font-semibold">
                Loading sessions…
            </div>
        );
    }

    if (error) {
        return (
            <main className="mx-auto max-w-5xl px-6 pb-20 pt-12 text-black">
                <button
                    onClick={() => router.push('/explore')}
                    className="mb-4 inline-flex items-center gap-2 rounded-[18px] border-2 border-black/70 bg-white px-4 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.10)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="rounded-[28px] border-2 border-black/70 bg-white p-6 text-sm font-semibold shadow-[0_18px_0_rgba(0,0,0,0.10)]">
                    {error}
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-6 pb-20 pt-12 text-black">
            {/* back */}
            <button
                onClick={() => router.push('/explore')}
                className="mb-4 inline-flex items-center gap-2 rounded-[18px] border-2 border-black/70 bg-white px-4 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.10)]"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            {/* header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 rounded-[32px] border-2 border-black/70 bg-white p-6 shadow-[0_22px_0_rgba(0,0,0,0.10)]"
            >
                <div className="flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black/70 bg-sky-200 shadow-[0_10px_0_rgba(0,0,0,0.12)]">
                        <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black">Sessions</h1>
                        <p className="text-sm font-semibold text-black/65">
                            Session activity and status
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* empty state */}
            {sessions.length === 0 ? (
                <div className="rounded-[28px] border-2 border-black/70 bg-white p-6 text-sm font-semibold shadow-[0_18px_0_rgba(0,0,0,0.10)]">
                    You don’t have any sessions yet.
                </div>
            ) : (
                (['active', 'pending', 'completed'] as const).map((status) => (
                    <section key={status} className="mb-10">
                        <h2 className="mb-3 text-sm font-black uppercase tracking-wide">
                            {status}
                        </h2>

                        <div className="grid gap-4">
                            {grouped[status].map((s) => (
                                <motion.div
                                    key={s._id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-[26px] border-2 border-black/70 bg-white p-5 shadow-[0_14px_0_rgba(0,0,0,0.10)]"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-black">
                                                {s.skillLabel ?? s.skillSlug}
                                            </div>
                                            <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-black/60">
                                                <User className="h-3.5 w-3.5" />
                                                {s.tutorEmail} ↔ {s.requesterEmail}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <StatusPill status={s.status} />
                                            <Link
                                                href="/inbox"
                                                className="inline-flex items-center gap-1 rounded-xl border-2 border-black/70 bg-white px-3 py-1.5 text-xs font-extrabold shadow-[0_6px_0_rgba(0,0,0,0.08)]"
                                            >
                                                View
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))
            )}
        </main>
    );
}

function StatusPill({ status }: { status: Session['status'] }) {
    if (status === 'completed') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200 px-3 py-1 text-xs font-black">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Completed
            </span>
        );
    }

    if (status === 'active') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-200 px-3 py-1 text-xs font-black">
                <ArrowRight className="h-3.5 w-3.5" />
                Active
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 px-3 py-1 text-xs font-black">
            <Clock className="h-3.5 w-3.5" />
            Pending
        </span>
    );
}