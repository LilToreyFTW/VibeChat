import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/components/DashboardProvider";
import { Navigation } from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeChat - Complete Communication Platform",
  description: "Unified chat platform with web, desktop, and admin controls",
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
        <DashboardProvider>
          <div className="min-h-screen bg-slate-900">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </DashboardProvider>
      </body>
    </html>
  );
}
