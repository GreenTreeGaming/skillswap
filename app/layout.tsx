import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import Providers from './providers';
import Navbar from '@/components/Navbar';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillSwap",
  description: "Student Talent Exchange Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased">
        {/* background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-white to-emerald-100/40" />
          <div
            className="absolute inset-0 opacity-[0.18]
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.35)_1px,transparent_1px),
            linear-gradient(to_bottom,rgba(0,0,0,0.35)_1px,transparent_1px)]
            [background-size:64px_64px]"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
            }}
          />
        </div>

        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}