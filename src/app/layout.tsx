import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Release Receipt",
  description:
    "Shareable, fail-closed evidence receipt for every release — GHAS + Snyk + Sonar.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <header className="border-b border-edge/80 bg-ink/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-snow">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-cyan/15 text-xs text-cyan ring-1 ring-cyan/40">
                RR
              </span>
              Release Receipt
            </Link>
            <nav className="flex items-center gap-4 text-sm text-fog">
              <Link href="/demo" className="hover:text-snow">
                Demo PASS
              </Link>
              <Link href="/demo?scenario=fail" className="hover:text-snow">
                Demo FAIL
              </Link>
              <a
                href="https://github.com/dhivagar29/release-receipt"
                className="hover:text-snow"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1 px-4 py-10">{children}</main>
        <footer className="border-t border-edge/60 py-6 text-center text-xs text-fog">
          MIT · Fixtures-only pilot · No live vendor APIs · No secret values
        </footer>
      </body>
    </html>
  );
}
