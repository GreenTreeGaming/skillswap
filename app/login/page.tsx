'use client';

import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useAuthRedirect } from '@/lib/use-auth-redirect';

function Tape({
  className = '',
  label,
}: {
  className?: string;
  label: string;
}) {
  return (
    <div
      className={[
        'pointer-events-none absolute z-10 rounded-md border border-black/10 bg-emerald-200/80 px-3 py-1 text-[11px] font-semibold text-black/80',
        'shadow-[0_8px_18px_rgba(0,0,0,0.10)] backdrop-blur',
        className,
      ].join(' ')}
    >
      {label}
    </div>
  );
}

function Scribble({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 55C28 35 49 68 70 48C89 30 109 64 131 43C155 20 175 58 198 36"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoginPage() {
    useAuthRedirect();
  return (
    <main className="relative min-h-screen overflow-hidden text-black">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fbfbff] to-white" />

        <motion.div
          className="absolute -left-32 -top-36 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-sky-300/35 via-emerald-300/25 to-yellow-200/25 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute -right-40 top-10 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-purple-300/25 via-pink-300/25 to-sky-300/35 blur-3xl"
          animate={{ x: [0, -55, 0], y: [0, 28, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <Tape
            label="Welcome back 👋"
            className="-left-6 -top-4 rotate-[-6deg]"
          />

          <div className="relative overflow-hidden rounded-[32px] border-2 border-black/70 bg-white shadow-[0_22px_0_rgba(0,0,0,0.10)]">
            {/* gradient wash */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/60 via-white to-sky-200/50" />
            <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />

            <div className="relative p-7">
              <div className="text-center">
                <Sparkles className="mx-auto h-7 w-7" />

                <h1 className="mt-5 text-3xl font-black tracking-tight">
                  Sign in to
                  <span className="relative inline-block">
                    <span className="ml-2 bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                      SkillSwap
                    </span>
                    <Scribble className="absolute -bottom-5 left-1/2 h-8 w-36 -translate-x-1/2 rotate-[-2deg] opacity-70" />
                  </span>
                </h1>

                <p className="mt-4 text-sm font-semibold text-black/70">
                  Jump back into sessions, messages,
                  and helping other students learn.
                </p>
              </div>

              {/* Google sign in */}
              <div className="mt-7">
                <button
                  onClick={() => signIn('google')}
                  className={[
                    'group flex w-full items-center justify-center gap-3 rounded-[18px]',
                    'border-2 border-black/80 bg-white px-5 py-3 text-sm font-extrabold',
                    'shadow-[0_10px_0_rgba(0,0,0,0.12)] transition',
                    'hover:-rotate-1 active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.12)]',
                  ].join(' ')}
                >
                  <svg viewBox="0 0 533.5 544.3" className="h-5 w-5">
                    <path
                      d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.2h146.9c-6.3 34.1-25.2 63-53.7 82.3v68h86.9c50.9-46.9 81.4-116 81.4-195.2z"
                      fill="#4285F4"
                    />
                    <path
                      d="M272 544.3c73.7 0 135.6-24.5 180.8-66.6l-86.9-68c-24.2 16.3-55.3 25.9-93.9 25.9-72 0-133-48.6-154.8-113.8H28.7v71.4C73.6 475.3 166.9 544.3 272 544.3z"
                      fill="#34A853"
                    />
                    <path
                      d="M117.2 321.8c-10.4-30.8-10.4-64.1 0-94.9V155.5H28.7c-38.6 76.9-38.6 167.4 0 244.3l88.5-71.4z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M272 107.7c39.9-.6 78.3 14 107.7 40.9l80.3-80.3C412.2 24.6 344.3-.5 272 0 166.9 0 73.6 69 28.7 155.5l88.5 71.4C139 156.3 200 107.7 272 107.7z"
                      fill="#EA4335"
                    />
                  </svg>

                  Continue with Google
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-black/60">
                <Shield className="h-4 w-4" />
                Secure Google sign-in • no passwords
              </div>

              <div className="mt-6 text-center text-xs font-semibold text-black/55">
                New here?{' '}
                <Link
                  href="/signup"
                  className="underline decoration-black/40 underline-offset-4 hover:decoration-black"
                >
                  Create a profile
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs font-semibold text-black/55">
            By signing in, you agree to SkillSwap’s Terms & Privacy Policy
          </div>
        </motion.div>
      </div>
    </main>
  );
}