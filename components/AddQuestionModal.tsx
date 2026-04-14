"use client";

import * as React from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import {
  difficultyOptions,
  platforms,
  statusOptions,
  understoodOptions
} from "@/constants/platforms";
import { predefinedTopics } from "@/constants/topics";
import { normalizeTopics } from "@/lib/utils";
import { useTrackerStore } from "@/store/useTrackerStore";
import { AnalysisResult, Difficulty, Platform, Status, Understood } from "@/types";

interface FormState extends AnalysisResult {
  input: string;
  status: Status;
  confidence: number;
  understood: Understood;
  notes: string;
  timeTaken: number;
  url: string;
}

const initialState: FormState = {
  input: "",
  title: "",
  url: "",
  platform: "Other",
  difficulty: "Medium",
  topics: [],
  summary: "",
  hints: ["", "", ""],
  timeComplexity: "O(n)",
  status: "Unsolved",
  confidence: 3,
  understood: "Partially",
  notes: "",
  timeTaken: 0
};

interface AddQuestionModalProps {
  trigger?: React.ReactElement;
  prefillInput?: string;
}

export function AddQuestionModal({
  trigger,
  prefillInput = ""
}: AddQuestionModalProps) {
  const addQuestion = useTrackerStore((state) => state.addQuestion);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [form, setForm] = React.useState<FormState>(initialState);

  React.useEffect(() => {
    if (open) {
      setForm((current) => ({
        ...current,
        input: current.input || prefillInput
      }));
    }
  }, [open, prefillInput]);

  const resetForm = React.useCallback(() => {
    setForm({ ...initialState, input: prefillInput });
  }, [prefillInput]);

  const handleAnalyze = async () => {
    if (!form.input.trim()) {
      toast({
        title: "Input required",
        description: "Paste a URL or type a short problem description first.",
        variant: "error"
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input: form.input })
      });

      const data = (await response.json()) as AnalysisResult & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to analyze this question.");
      }

      setForm((current) => ({
        ...current,
        ...data,
        topics: normalizeTopics(data.topics),
        url: current.input.startsWith("http") ? current.input : current.url
      }));
      toast({
        title: "AI analysis complete",
        description: "Review the fields and adjust anything you want before saving.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description:
          error instanceof Error
            ? error.message
            : "The AI request failed. You can still fill the form manually.",
        variant: "error"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast({
        title: "Title required",
        description: "Add a question title before saving.",
        variant: "error"
      });
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Sign in required",
        description: "Use Google sign-in before saving questions to your account.",
        variant: "error"
      });
      return;
    }

    try {
      setIsSaving(true);
      await addQuestion({
        title: form.title.trim(),
        url: form.url.trim(),
        platform: form.platform,
        difficulty: form.difficulty,
        topics: form.topics,
        summary: form.summary.trim(),
        hints: form.hints,
        timeComplexity: form.timeComplexity.trim(),
        status: form.status,
        confidence: form.confidence,
        understood: form.understood,
        notes: form.notes.trim(),
        timeTaken: form.timeTaken,
        revisionFlag: false,
        isFavorite: false
      });

      toast({
        title: "Question added",
        description: `${form.title} was saved to your tracker.`,
        variant: "success"
      });

      setOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Save failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to save this question right now.",
        variant: "error"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateHint = (index: number, value: string) => {
    setForm((current) => {
      const hints = [...current.hints] as [string, string, string];
      hints[index] = value;
      return { ...current, hints };
    });
  };

  const toggleTopic = (topic: string) => {
    setForm((current) => ({
      ...current,
      topics: current.topics.includes(topic)
        ? current.topics.filter((item) => item !== topic)
        : [...current.topics, topic]
    }));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add a Question</DialogTitle>
          <DialogDescription>
            Paste a problem URL or describe the problem, then use AI to prefill
            the tracker fields before saving.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="problem-input">Problem URL or description</Label>
            <Textarea
              id="problem-input"
              value={form.input}
              onChange={(event) =>
                setForm((current) => ({ ...current, input: event.target.value }))
              }
              placeholder="https://leetcode.com/problems/two-sum or describe the problem in your own words"
            />
            <div className="flex justify-end">
              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Title">
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </FormField>
            <FormField label="URL">
              <Input
                value={form.url}
                onChange={(event) =>
                  setForm((current) => ({ ...current, url: event.target.value }))
                }
              />
            </FormField>
            <FormField label="Platform">
              <select
                value={form.platform}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    platform: event.target.value as Platform
                  }))
                }
                className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
              >
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Difficulty">
              <select
                value={form.difficulty}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    difficulty: event.target.value as Difficulty
                  }))
                }
                className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
              >
                {difficultyOptions.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Topics">
              <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                {predefinedTopics.map((topic) => {
                  const active = form.topics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={
                        active
                          ? "rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100"
                          : "rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300"
                      }
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </FormField>
            <FormField label="Time Complexity">
              <Input
                value={form.timeComplexity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    timeComplexity: event.target.value
                  }))
                }
              />
            </FormField>
          </div>

          <FormField label="Summary">
            <Textarea
              value={form.summary}
              onChange={(event) =>
                setForm((current) => ({ ...current, summary: event.target.value }))
              }
            />
          </FormField>

          <div className="grid gap-4 md:grid-cols-3">
            {form.hints.map((hint, index) => (
              <FormField key={index} label={`Hint ${index + 1}`}>
                <Textarea
                  value={hint}
                  onChange={(event) => updateHint(index, event.target.value)}
                />
              </FormField>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as Status
                  }))
                }
                className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label={`Confidence (${form.confidence}/5)`}>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={form.confidence}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    confidence: Number(event.target.value)
                  }))
                }
                className="mt-3 w-full accent-cyan-400"
              />
            </FormField>
            <FormField label="Understood">
              <select
                value={form.understood}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    understood: event.target.value as Understood
                  }))
                }
                className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
              >
                {understoodOptions.map((understood) => (
                  <option key={understood} value={understood}>
                    {understood}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Time Taken (min)">
              <Input
                type="number"
                min={0}
                value={form.timeTaken}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    timeTaken: Number(event.target.value)
                  }))
                }
              />
            </FormField>
          </div>

          <FormField label="Notes">
            <Textarea
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
            />
          </FormField>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
              <Button
                onClick={() => void handleSubmit()}
                disabled={isSaving || !session?.user?.id}
              >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Save Question
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
