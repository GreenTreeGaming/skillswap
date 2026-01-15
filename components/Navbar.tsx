'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import {
  ArrowRight,
  Menu,
  X,
  Search,
  Users,
  CalendarDays,
  ShieldCheck,
  LogIn,
  UserPlus,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Inbox, // ✅ add
} from 'lucide-react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function NavPill({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border-2 px-3 py-2 text-sm font-extrabold transition',
        'shadow-[0_8px_0_rgba(0,0,0,0.10)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_5px_0_rgba(0,0,0,0.10)]',
        active
          ? 'border-black/80 bg-black text-white'
          : 'border-black/70 bg-white text-black hover:bg-slate-50'
      )}
    >
      <span className={cn(active ? 'text-white' : 'text-black')}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function StickerCTA({
  href,
  label,
  tone = 'black',
  icon,
  onClick,
}: {
  href: string;
  label: string;
  tone?: 'black' | 'pink' | 'green' | 'blue';
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  const toneClasses =
    tone === 'black'
      ? 'bg-black text-white'
      : tone === 'pink'
        ? 'bg-pink-600 text-white'
        : tone === 'green'
          ? 'bg-emerald-600 text-white'
          : 'bg-sky-600 text-white';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group inline-flex items-center gap-2 rounded-[18px] border-2 border-black/80 px-4 py-2.5 text-sm font-extrabold',
        'shadow-[0_10px_0_rgba(0,0,0,0.12)] transition hover:-rotate-1',
        'active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.12)]',
        toneClasses
      )}
    >
      {icon ? <span className="opacity-95">{icon}</span> : null}
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function Avatar({
  src,
  alt,
  size = 36,
}: {
  src?: string | null;
  alt: string;
  size?: number;
}) {
  if (!src) {
    return (
      <div
        className="grid place-items-center rounded-2xl border-2 border-black/80 bg-white shadow-[0_10px_0_rgba(0,0,0,0.12)]"
        style={{ width: size, height: size }}
      >
        <User className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-2 border-black/80 bg-white shadow-[0_10px_0_rgba(0,0,0,0.12)]"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function ProfileMenu({
  name,
  email,
  image,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-3 rounded-[18px] border-2 border-black/80 bg-white px-3 py-2',
          'shadow-[0_10px_0_rgba(0,0,0,0.12)] transition hover:-rotate-1',
          'active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.12)]'
        )}
        aria-label="Open profile menu"
      >
        <Avatar src={image} alt={name ?? 'User'} size={34} />
        <div className="hidden max-w-[140px] text-left md:block">
          <div className="truncate text-sm font-black leading-tight">
            {name ?? 'Profile'}
          </div>
          <div className="truncate text-[11px] font-semibold text-black/60">
            {email ?? ''}
          </div>
        </div>

        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={cn(
              'absolute right-0 z-[60] mt-3 w-[260px] overflow-hidden rounded-[22px] border-2 border-black/80 bg-white',
              'shadow-[0_16px_0_rgba(0,0,0,0.10)]'
            )}
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-100/45 via-white to-emerald-100/35" />

            <div className="relative p-3">
              {/* NO duplicate user header card here */}

              <div className="grid gap-2">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.08)] hover:bg-slate-50"
                >
                  <User className="h-4 w-4" />
                  View profile
                </Link>

                <Link
                  href="/inbox"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.08)] hover:bg-slate-50"
                >
                  <Inbox className="h-4 w-4" />
                  Inbox
                </Link>

                <Link
                  href="/onboarding"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.08)] hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4" />
                  Edit skills
                </Link>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.08)] hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  const items = useMemo(
    () => [
      { href: '/explore', label: 'Explore', icon: <Search className="h-4 w-4" /> },
      // { href: '/sessions', label: 'Sessions', icon: <CalendarDays className="h-4 w-4" /> },
      { href: '/community', label: 'Community', icon: <Users className="h-4 w-4" /> },
      { href: '/safety', label: 'Safety', icon: <ShieldCheck className="h-4 w-4" /> },
    ],
    []
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isAuthed = status === 'authenticated';
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') {
      setIsAdmin(false);
      return;
    }

    async function loadAdmin() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;

        const user = await res.json();
        setIsAdmin(user?.admin === true);
      } catch {
        setIsAdmin(false);
      }
    }

    loadAdmin();
  }, [status]);

  return (
    <header className="sticky top-0 z-50">
      <div className="relative mx-auto max-w-6xl px-4 pt-4">
        {/* OUTER shell is overflow-visible so dropdown can escape */}
        <div className="relative overflow-visible rounded-[28px] border-2 border-black/70 bg-white shadow-[0_16px_0_rgba(0,0,0,0.10)]">
          {/* INNER background layer is clipped to rounded corners */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
            <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-100/40 via-white to-emerald-100/35" />
          </div>

          {/* Content layer (not clipped) */}
          <div className="relative flex items-center justify-between gap-3 px-4 py-4 md:px-6">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border-2 border-black/80 bg-white shadow-[0_10px_0_rgba(0,0,0,0.12)] transition group-hover:-rotate-3">
                  <Image
                    src="/logo.png"
                    alt="SkillSwap logo"
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <div className="pointer-events-none absolute -right-2 -top-2 h-4 w-4 rounded-full border-2 border-black/70 bg-pink-200" />
              </div>

              <div className="leading-tight">
                <div className="text-base font-black tracking-tight">SkillSwap</div>
                <div className="text-[11px] font-semibold text-black/60">
                  student talent exchange
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-2 md:flex">
              {items.map((it) => (
                <NavPill
                  key={it.href}
                  href={it.href}
                  label={it.label}
                  icon={it.icon}
                  active={pathname === it.href}
                />
              ))}

              {isAdmin && (
                <NavPill
                  href="/admin"
                  label="Admin Dashboard"
                  icon={<ShieldCheck className="h-4 w-4" />}
                  active={pathname.startsWith('/admin')}
                />
              )}
            </nav>

            {/* Desktop right side */}
            <div className="hidden items-center gap-2 md:flex">
              {isAuthed ? (
                <ProfileMenu
                  name={session?.user?.name}
                  email={session?.user?.email}
                  image={session?.user?.image}
                />
              ) : (
                <>
                  <StickerCTA
                    href="/login"
                    label="Sign in"
                    tone="blue"
                    icon={<LogIn className="h-4 w-4" />}
                  />
                  <StickerCTA
                    href="/signup"
                    label="Make profile"
                    tone="pink"
                    icon={<UserPlus className="h-4 w-4" />}
                  />
                </>
              )}
            </div>

            {/* Mobile button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                'md:hidden inline-flex items-center justify-center',
                'h-11 w-11 rounded-2xl border-2 border-black/80 bg-white',
                'shadow-[0_10px_0_rgba(0,0,0,0.12)] transition',
                'active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.12)]'
              )}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu (still clipped by its own layout, fine) */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative md:hidden"
              >
                <div className="border-t-2 border-black/70 px-4 py-4">
                  {/* Profile block on mobile if logged in */}
                  {isAuthed ? (
                    <div className="mb-4 rounded-3xl border-2 border-black/70 bg-white p-4 shadow-[0_14px_0_rgba(0,0,0,0.10)]">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={session?.user?.image}
                          alt={session?.user?.name ?? 'User'}
                          size={42}
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-black">
                            {session?.user?.name ?? 'Profile'}
                          </div>
                          <div className="truncate text-xs font-semibold text-black/60">
                            {session?.user?.email ?? ''}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2">
                        <Link
                          href="/profile"
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.08)] hover:bg-slate-50"
                        >
                          <User className="h-4 w-4" />
                          View profile
                        </Link>

                        <Link
                          href="/inbox"
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.08)] hover:bg-slate-50"
                        >
                          <Inbox className="h-4 w-4" />
                          Inbox
                        </Link>

                        <Link
                          href="/onboarding"
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.08)] hover:bg-slate-50"
                        >
                          <Settings className="h-4 w-4" />
                          Edit skills
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            signOut({ callbackUrl: '/' });
                          }}
                          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/70 bg-white px-3 py-2 text-sm font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.08)] hover:bg-slate-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="grid gap-2">
                    {items.map((it, i) => (
                      <motion.div
                        key={it.href}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.03 * i, duration: 0.2 }}
                      >
                        <NavPill
                          href={it.href}
                          label={it.label}
                          icon={it.icon}
                          active={pathname === it.href}
                          onClick={() => setOpen(false)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {isAdmin && (
                    <NavPill
                      href="/admin"
                      label="Admin Dashboard"
                      icon={<ShieldCheck className="h-4 w-4" />}
                      active={pathname.startsWith('/admin')}
                      onClick={() => setOpen(false)}
                    />
                  )}

                  {!isAuthed ? (
                    <div className="mt-4 grid gap-2">
                      <StickerCTA
                        href="/login"
                        label="Sign in"
                        tone="blue"
                        icon={<LogIn className="h-4 w-4" />}
                        onClick={() => setOpen(false)}
                      />
                      <StickerCTA
                        href="/signup"
                        label="Make profile"
                        tone="pink"
                        icon={<UserPlus className="h-4 w-4" />}
                        onClick={() => setOpen(false)}
                      />
                    </div>
                  ) : null}

                  <div className="mt-4 rounded-2xl border-2 border-dashed border-black/50 bg-slate-50 px-4 py-3">
                    <div className="text-xs font-black">tiny tip</div>
                    <div className="mt-1 text-xs font-semibold text-black/70">
                      Add 2 “teach” skills and 1 “learn” skill for better matches.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}