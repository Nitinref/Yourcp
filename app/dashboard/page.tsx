"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Plus, RefreshCcw, Target } from "lucide-react";
import { AddQuestionModal } from "@/components/AddQuestionModal";
import { AuthRequiredNotice } from "@/components/AuthRequiredNotice";
import { PlatformAccountsSection } from "@/components/PlatformAccountsSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { platformColors } from "@/constants/platforms";
import { formatDate } from "@/lib/utils";
import { useTrackerStore } from "@/store/useTrackerStore";
import { useSession } from "next-auth/react";
import { useShallow } from "zustand/react/shallow";

export default function DashboardPage() {
  const { status } = useSession();
  const { questions, fetchQuestions, isLoading, error } = useTrackerStore(
    useShallow((state) => ({
      questions: state.questions,
      fetchQuestions: state.fetchQuestions,
      isLoading: state.isLoading,
      error: state.error
    }))
  );
  const [quickInput, setQuickInput] = React.useState("");

  React.useEffect(() => {
    if (status === "authenticated") {
      void fetchQuestions();
    }
  }, [fetchQuestions, status]);

  if (status === "unauthenticated") {
    return (
      <AuthRequiredNotice
        title="Sign in to unlock your dashboard"
        description="Your questions, stats, revisions, and notes are now tied to your Google account in the database."
      />
    );
  }

  const total = questions.length;
  const solved = questions.filter((question) => question.status === "Solved").length;
  const unsolved = questions.filter((question) => question.status === "Unsolved").length;
  const revisionDue = questions.filter((question) => question.revisionFlag).length;
  const recentQuestions = questions.slice(0, 5);

  const statCards = [
    { label: "Total", value: total, icon: Target },
    { label: "Solved", value: solved, icon: Plus },
    { label: "Unsolved", value: unsolved, icon: Clock3 },
    { label: "Revision Due", value: revisionDue, icon: RefreshCcw }
  ];

  return (
    <div className="space-y-8">
      <section className="glass-panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.4fr,0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">
              Dashboard
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                Build a cleaner record of how you practice.
              </h1>
              <p className="max-w-2xl text-slate-300">
                Your questions are stored in Postgres, your stats are live, and your
                tracker is ready for every new contest problem or interview drill.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={quickInput}
                onChange={(event) => setQuickInput(event.target.value)}
                placeholder="Paste a problem URL or type a title to quick-add"
                className="h-12 flex-1 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 text-sm text-slate-100"
                disabled={status !== "authenticated"}
              />
              <AddQuestionModal
                prefillInput={quickInput}
                trigger={
                  <Button size="lg">
                    <Plus className="h-4 w-4" />
                    Quick Add
                  </Button>
                }
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/tracker">
                <Button variant="outline">
                  Open Tracker
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/stats">
                <Button variant="ghost">See Stats</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="glow-ring">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardDescription>{stat.label}</CardDescription>
                      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2">
                        <Icon className="h-4 w-4 text-cyan-300" />
                      </div>
                    </div>
                    <CardTitle className="text-3xl">{stat.value}</CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Recent Questions</CardTitle>
            <CardDescription>The latest five additions to your archive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "loading" ? <p className="text-sm text-slate-400">Checking session...</p> : null}
            {isLoading ? <p className="text-sm text-slate-400">Loading questions...</p> : null}
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            {!isLoading && recentQuestions.length === 0 ? (
              <p className="text-sm text-slate-400">
                No questions saved yet. Add your first problem from the quick-add bar above.
              </p>
            ) : null}
            {recentQuestions.map((question) => (
              <div
                key={question.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={question.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-slate-100 transition hover:text-cyan-300"
                    >
                      {question.title}
                    </a>
                    <Badge className={platformColors[question.platform]}>
                      {question.platform}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">{question.summary}</p>
                </div>
                <div className="text-sm text-slate-400">
                  {formatDate(question.dateAdded)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <PlatformAccountsSection />
      </section>
    </div>
  );
}
