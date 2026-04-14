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
          <div className="min-h-screen bg-grid-glow">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
