"use client";

import { create } from "zustand";
import { Question, QuestionPayload, SortBy, SortOrder } from "@/types";

export interface TrackerStore {
  questions: Question[];
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;
  fetchQuestions: () => Promise<void>;
  addQuestion: (q: QuestionPayload) => Promise<void>;
  updateQuestion: (id: string, updates: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  toggleRevision: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  filterPlatform: string;
  filterDifficulty: string;
  filterStatus: string;
  filterTopic: string;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  setFilter: (
    key:
      | "filterPlatform"
      | "filterDifficulty"
      | "filterStatus"
      | "filterTopic"
      | "searchQuery",
    value: string
  ) => void;
  clearFilters: () => void;
  setSort: (by: SortBy, order: SortOrder) => void;
}

const defaultFilters = {
  filterPlatform: "",
  filterDifficulty: "",
  filterStatus: "",
  filterTopic: "",
  searchQuery: ""
};

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(data.error ?? "Sign in with Google to access your tracker.");
    }
    throw new Error(data.error ?? "Request failed.");
  }

  return data;
}

export const useTrackerStore = create<TrackerStore>()((set, get) => ({
  questions: [],
  isLoading: false,
  hasFetched: false,
  error: null,
  ...defaultFilters,
  sortBy: "date",
  sortOrder: "desc",
  fetchQuestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const questions = await request<Question[]>("/api/questions");
      set({ questions, isLoading: false, hasFetched: true });
    } catch (error) {
      set({
        isLoading: false,
        hasFetched: true,
        error: error instanceof Error ? error.message : "Unable to load questions."
      });
    }
  },
  addQuestion: async (payload) => {
    await request<Question>("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    await get().fetchQuestions();
  },
  updateQuestion: async (id, updates) => {
    await request<Question>(`/api/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updates)
    });
    set((state) => ({
      questions: state.questions.map((question) =>
        question.id === id ? { ...question, ...updates } : question
      )
    }));
  },
  deleteQuestion: async (id) => {
    await request<{ success: true }>(`/api/questions/${id}`, {
      method: "DELETE"
    });
    set((state) => ({
      questions: state.questions.filter((question) => question.id !== id)
    }));
  },
  toggleRevision: async (id) => {
    const current = get().questions.find((question) => question.id === id);
    if (!current) return;
    await get().updateQuestion(id, { revisionFlag: !current.revisionFlag });
  },
  toggleFavorite: async (id) => {
    const current = get().questions.find((question) => question.id === id);
    if (!current) return;
    await get().updateQuestion(id, { isFavorite: !current.isFavorite });
  },
  setFilter: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value
    })),
  clearFilters: () =>
    set(() => ({
      ...defaultFilters
    })),
  setSort: (by, order) =>
    set(() => ({
      sortBy: by,
      sortOrder: order
    }))
}));
