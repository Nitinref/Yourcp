"use client";

import { signIn } from "next-auth/react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthRequiredNotice({
  title = "Sign in to continue",
  description = "Use Google sign-in to load and manage your personal question archive."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="glass-panel flex flex-col items-center gap-4 p-8 text-center">
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3">
        <LockKeyhole className="h-5 w-5 text-cyan-300" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="max-w-xl text-sm text-slate-400">{description}</p>
      </div>
      <Button onClick={() => void signIn("google")}>Sign In With Google</Button>
    </div>
  );
}
