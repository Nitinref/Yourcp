"use client";

import * as React from "react";
import { LayoutGrid, Table2 } from "lucide-react";
import { AddQuestionModal } from "@/components/AddQuestionModal";
import { AuthRequiredNotice } from "@/components/AuthRequiredNotice";
import { ExportButton } from "@/components/ExportButton";
import { FilterBar } from "@/components/FilterBar";
import { HintDrawer } from "@/components/HintDrawer";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionTable } from "@/components/QuestionTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { predefinedTopics } from "@/constants/topics";
import { filterAndSortQuestions } from "@/lib/utils";
import { useTrackerStore } from "@/store/useTrackerStore";
import { Question } from "@/types";
import { useSession } from "next-auth/react";
import { useShallow } from "zustand/react/shallow";

export default function TrackerPage() {
  const { status } = useSession();
  const {
    questions,
    isLoading,
    error,
    fetchQuestions,
    updateQuestion,
    deleteQuestion,
    toggleRevision,
    toggleFavorite,
    filterPlatform,
    filterDifficulty,
    filterStatus,
    filterTopic,
    searchQuery,
    sortBy,
    sortOrder,
    setFilter,
    clearFilters,
    setSort
  } = useTrackerStore(
    useShallow((state) => ({
      questions: state.questions,
      isLoading: state.isLoading,
      error: state.error,
      fetchQuestions: state.fetchQuestions,
      updateQuestion: state.updateQuestion,
      deleteQuestion: state.deleteQuestion,
      toggleRevision: state.toggleRevision,
      toggleFavorite: state.toggleFavorite,
      filterPlatform: state.filterPlatform,
      filterDifficulty: state.filterDifficulty,
      filterStatus: state.filterStatus,
      filterTopic: state.filterTopic,
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      setFilter: state.setFilter,
      clearFilters: state.clearFilters,
      setSort: state.setSort
    }))
  );
  const { toast } = useToast();
  const [view, setView] = React.useState("table");
  const [selectedQuestion, setSelectedQuestion] = React.useState<Question | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (status === "authenticated") {
      void fetchQuestions();
    }
  }, [fetchQuestions, status]);

  if (status === "unauthenticated") {
    return (
      <AuthRequiredNotice
        title="Sign in to open your tracker"
        description="Questions are now stored per user, so sign in with Google to create and manage your own archive."
      />
    );
  }

  const filteredQuestions = filterAndSortQuestions(
    questions,
    {
      filterPlatform,
      filterDifficulty,
      filterStatus,
      filterTopic,
      searchQuery
    },
    sortBy,
    sortOrder
  );

  const topics = [...predefinedTopics];

  const handleUpdate = async (id: string, updates: Partial<Question>) => {
    try {
      await updateQuestion(id, updates);
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Unable to update the question.",
        variant: "error"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion(id);
      toast({
        title: "Question deleted",
        description: "The problem was removed from your tracker.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "Unable to delete the question.",
        variant: "error"
      });
    }
  };

  const handleToggleRevision = async (id: string) => {
    await toggleRevision(id);
  };

  const handleToggleFavorite = async (id: string) => {
    await toggleFavorite(id);
  };

  const openHints = (question: Question) => {
    setSelectedQuestion(question);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Tracker</h1>
          <p className="text-slate-400">
            Search, filter, edit inline, and export your full problem archive.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AddQuestionModal />
          <ExportButton questions={filteredQuestions} />
        </div>
      </div>

      <FilterBar
        filterPlatform={filterPlatform}
        filterDifficulty={filterDifficulty}
        filterStatus={filterStatus}
        filterTopic={filterTopic}
        searchQuery={searchQuery}
        sortBy={sortBy}
        sortOrder={sortOrder}
        topics={topics}
        onFilterChange={(key, value) =>
          setFilter(
            key as
              | "filterPlatform"
              | "filterDifficulty"
              | "filterStatus"
              | "filterTopic"
              | "searchQuery",
            value
          )
        }
        onSortChange={setSort}
        onClearFilters={clearFilters}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing {filteredQuestions.length} of {questions.length} questions
        </p>
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="table">
              <Table2 className="h-4 w-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="card">
              <LayoutGrid className="h-4 w-4" />
              Cards
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {status === "loading" ? (
        <div className="glass-panel p-6 text-sm text-slate-400">Checking session...</div>
      ) : null}
      {isLoading ? (
        <div className="glass-panel p-6 text-sm text-slate-400">Loading tracker...</div>
      ) : null}
      {error ? (
        <div className="glass-panel border-rose-500/20 p-6 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {!isLoading && filteredQuestions.length === 0 ? (
        <div className="glass-panel p-8 text-center text-slate-400">
          No questions match the current filters yet.
        </div>
      ) : null}

      {!isLoading && filteredQuestions.length > 0 && view === "table" ? (
        <QuestionTable
          questions={filteredQuestions}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onToggleRevision={handleToggleRevision}
          onToggleFavorite={handleToggleFavorite}
          onViewHints={openHints}
        />
      ) : null}

      {!isLoading && filteredQuestions.length > 0 && view === "card" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onToggleRevision={handleToggleRevision}
              onToggleFavorite={handleToggleFavorite}
              onViewHints={openHints}
            />
          ))}
        </div>
      ) : null}

      <HintDrawer
        question={selectedQuestion}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
}
