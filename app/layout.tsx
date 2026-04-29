import type React from "react";
import type { Metadata } from "next";
import { AppProviders } from "@/components/AppProviders";
import { Navbar } from "@/components/Navbar";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "CodeTracker Pro",
  description: "Universal competitive programming question manager with AI analysis."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <AppProviders>
          <div className="app-surface relative min-h-screen overflow-x-hidden">
            <div className="app-grid-overlay fixed inset-0 z-0" />

            <Navbar />
            <main className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pt-10">
              {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
