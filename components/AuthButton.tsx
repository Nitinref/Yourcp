"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <Button variant="outline" onClick={() => void signIn("google")}>
        <LogIn className="h-4 w-4" />
        Sign In With Google
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right md:block">
        <div className="text-sm font-medium text-slate-100">
          {session.user.name ?? "Signed in"}
        </div>
        <div className="text-xs text-slate-500">{session.user.email}</div>
      </div>
      <Button variant="ghost" onClick={() => void signOut()} className="text-slate-400 hover:text-rose-300">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
