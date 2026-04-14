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
    <div className="glass-panel flex flex-col items-center gap-5 p-10 text-center animate-scale-in">
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 animate-float">
        <LockKeyhole className="h-6 w-6 text-cyan-300" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="max-w-xl text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      <Button onClick={() => void signIn("google")} size="lg">Sign In With Google</Button>
    </div>
  );
}
