'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react'; // ✅ Import use hook

function Tape({ label, className = '' }: { label: string; className?: string }) {
    return (
        <div
            className={[
                'pointer-events-none absolute z-10 rounded-md border border-black/10',
                'bg-yellow-200/80 px-3 py-1 text-[11px] font-semibold text-black/80',
                'shadow-[0_8px_18px_rgba(0,0,0,0.10)] backdrop-blur',
                className,
            ].join(' ')}
        >
            {label}
        </div>
    );
}

function SkillChip({ label }: { label: string }) {
    return (
        <span className="rounded-full border-2 border-black/60 bg-white px-3 py-1 text-[11px] font-extrabold shadow-[0_6px_0_rgba(0,0,0,0.08)]">
            {label}
        </span>
    );
}

export default function ProfilePage({
    params,
}: {
    params: Promise<{ email: string }>; // ✅ Update type
}) {
    const { email } = use(params); // ✅ Unwrap params using React.use()
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);

    const hasRating =
        typeof profile?.ratingAvg === 'number' && Number.isFinite(profile.ratingAvg);

    useEffect(() => {
        async function load() {
            const res = await fetch(`/api/profile/${encodeURIComponent(email)}`); // ✅ Use unwrapped email
            if (res.ok) {
                setProfile(await res.json());
            }
            setLoading(false);
        }
        load();
    }, [email]); // ✅ Use unwrapped email in dependency array

    if (loading) {
        return (
            <div className="mt-20 text-center text-sm font-semibold">
                Loading profile…
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="mt-20 text-center text-sm font-semibold">
                Profile not found
            </div>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden text-black">
            <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-14">
                <Tape label="profile" className="left-6 top-4 rotate-[-6deg]" />

                <Link
                    href="/explore"
                    className="mb-6 inline-flex items-center gap-2 text-xs font-extrabold underline underline-offset-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to explore
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative rounded-[32px] border-2 border-black/70 bg-white p-8 shadow-[0_22px_0_rgba(0,0,0,0.10)]"
                >
                    {/* Header */}
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-3xl border-2 border-black/70 bg-white shadow-[0_10px_0_rgba(0,0,0,0.12)]">
                                {profile.image ? (
                                    <img
                                        src={profile.image}
                                        alt={profile.name}
                                        referrerPolicy="no-referrer"
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                            </div>

                            <div>
                                <div className="text-2xl font-black">{profile.name}</div>
                                <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-black/60">
                                    <Mail className="h-3.5 w-3.5" />
                                    {profile.email}
                                </div>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border-2 border-black/70 bg-emerald-100 px-4 py-2 text-xs font-extrabold shadow-[0_6px_0_rgba(0,0,0,0.08)]">
                            <Star className="h-4 w-4" />
                            {hasRating ? (
                                <>
                                    {profile.ratingAvg.toFixed(1)}
                                    <span className="text-black/60">({profile.ratingCount ?? 0})</span>
                                </>
                            ) : (
                                <span className="text-black/60">New</span>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <div>
                            <div className="text-xs font-black text-black/70">
                                Can help with
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {profile.canTeach.length > 0 ? (
                                    profile.canTeach.map((s: any) => (
                                        <SkillChip key={s.slug} label={s.label} />
                                    ))
                                ) : (
                                    <span className="text-xs text-black/50">
                                        No skills listed
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-black text-black/70">
                                Wants help with
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {profile.wantsHelpWith.length > 0 ? (
                                    profile.wantsHelpWith.map((s: any) => (
                                        <SkillChip key={s.slug} label={s.label} />
                                    ))
                                ) : (
                                    <span className="text-xs text-black/50">
                                        Not specified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-10 flex flex-wrap gap-3">
                        <Link
                            href={`/request?to=${encodeURIComponent(profile.email)}&skillSlug=${profile.canTeach[0]?.slug}&skillLabel=${profile.canTeach[0]?.label}`}
                            className="rounded-[18px] border-2 border-black bg-black px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_0_rgba(0,0,0,0.20)]"
                        >
                            Request session
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}