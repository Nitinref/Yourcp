"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { AuthRequiredNotice } from "@/components/AuthRequiredNotice";
import { StatsPanel } from "@/components/StatsPanel";
import { useTrackerStore } from "@/store/useTrackerStore";
import { useShallow } from "zustand/react/shallow";

export default function StatsPage() {
  const { status } = useSession();
  const { questions, fetchQuestions, isLoading, error } = useTrackerStore(
    useShallow((state) => ({
      questions: state.questions,
      fetchQuestions: state.fetchQuestions,
      isLoading: state.isLoading,
      error: state.error
    }))
  );

  React.useEffect(() => {
    if (status === "authenticated") {
      void fetchQuestions();
    }
  }, [fetchQuestions, status]);

  if (status === "unauthenticated") {
    return (
      <AuthRequiredNotice
        title="Sign in to view your stats"
        description="Stats are generated from your own saved questions, so sign in with Google first."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-extrabold tracking-tight text-white gradient-text">Stats</h1>
        <p className="mt-1 text-slate-400">
          Live charts based on the questions saved in your Postgres database.
        </p>
      </div>

      {status === "loading" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton h-24 w-full" />
          ))}
        </div>
      ) : null}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton h-24 w-full" />
          ))}
        </div>
      ) : null}
      {error ? (
        <div className="glass-panel border-rose-500/20 p-6 text-sm text-rose-300">
          {error}
        </div>
      ) : null}
      {!isLoading ? <StatsPanel questions={questions} /> : null}
    </div>
  );
}
