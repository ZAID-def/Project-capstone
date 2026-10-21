import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRestoreGuard from "@/components/ScrollRestoreGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aspirasi SMK IT Baitul Aziz - Saluran Komunikasi Dua Arah & Pengaduan Terpadu",
  description: "Portal resmi SMK IT Baitul Aziz untuk mengumpulkan, mengklasifikasi, dan menindaklanjuti aspirasi siswa, orang tua, dan masyarakat kepada manajemen sekolah.",
  keywords: ["SMK IT Baitul Aziz", "Aspirasi Siswa", "Pengaduan Sekolah", "Sarpras", "Kesiswaan", "Baitul Aziz"]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFDFB] text-slate-900 selection:bg-orange-100 selection:text-orange-800">
        {/* Komponen ini memastikan setiap halaman dimulai dari paling atas saat di-refresh */}
        <ScrollRestoreGuard />
        <Suspense fallback={<div className="h-20 bg-white border-b border-orange-100" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
