import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ToastProvider, Toaster } from "./components/ui/toaster";

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
        <ToastProvider>
          <div className="mx-auto max-w-5xl p-4 sm:p-6">
            <nav className="sticky top-0 z-40 mb-6 flex items-center justify-between rounded-xl border bg-white/70 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/50">
              <div className="flex items-center gap-3">
                <Link href="/events" className="text-base font-semibold">Events</Link>
                <span className="hidden text-neutral-300 sm:inline">|</span>
                <Link href="/events/new" className="text-sm text-neutral-700 hover:underline">Create</Link>
              </div>
            </nav>
            {children}
          </div>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
