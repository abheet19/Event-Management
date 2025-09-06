import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ToastProvider, Toaster } from "./components/ui/toaster";
import TimezoneBadge from "./components/timezone-badge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Manager",
  description: "Mini Event Management frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a href="#main" className="sr-only focus:not-sr-only fixed left-4 top-4 z-50 rounded bg-black px-3 py-2 text-sm text-white">Skip to content</a>
        <ToastProvider>
          <div className="mx-auto max-w-5xl p-4 sm:p-6">
            <nav className="sticky top-0 z-40 mb-6 flex items-center justify-between rounded-xl border bg-white/70 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/50">
              <div className="flex items-center gap-3">
                <Link href="/events" className="text-base font-semibold">Event Manager</Link>
                <span className="hidden text-neutral-300 sm:inline">|</span>
                <Link href="/events" className="text-sm text-neutral-700 hover:underline">Events</Link>
                <span className="hidden text-neutral-300 sm:inline">•</span>
                <Link href="/events/new" className="text-sm text-neutral-700 hover:underline">Create</Link>
              </div>
              <div className="hidden sm:block"><TimezoneBadge /></div>
            </nav>
            {children}
          </div>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
