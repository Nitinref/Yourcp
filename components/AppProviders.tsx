"use client";

import type React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster>{children}</Toaster>
    </SessionProvider>
  );
}
