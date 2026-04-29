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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Stats</h1>
        <p className="text-slate-400">
          Live charts based on the questions saved in your Postgres database.
        </p>
      </div>

      {status === "loading" ? (
        <div className="glass-panel p-6 text-sm text-slate-400">Checking session...</div>
      ) : null}
      {isLoading ? (
        <div className="glass-panel p-6 text-sm text-slate-400">Loading stats...</div>
      ) : null}
      {error ? (
        <div className="glass-panel border-zinc-500/30 p-6 text-sm text-zinc-200">
          {error}
        </div>
      ) : null}
      {!isLoading ? <StatsPanel questions={questions} /> : null}
    </div>
  );
}
