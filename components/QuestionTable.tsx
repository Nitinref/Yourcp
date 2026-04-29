"use client";

import { Heart, Pencil, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceStars } from "@/components/ConfidenceStars";
import {
  difficultyColors,
  platformColors,
  statusOptions,
  understoodOptions
} from "@/constants/platforms";
import { formatDate } from "@/lib/utils";
import { Question, Status, Understood } from "@/types";

interface QuestionTableProps {
  questions: Question[];
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onToggleRevision: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onViewHints: (question: Question) => void;
}

export function QuestionTable({
  questions,
  onUpdate,
  onDelete,
  onToggleRevision,
  onToggleFavorite,
  onViewHints
}: QuestionTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/80">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800/80 text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-400">
            <tr>
              {[
                "#",
                "Title",
                "Platform",
                "Difficulty",
                "Topics",
                "Status",
                "Confidence",
                "Understood",
                "Time",
                "Date",
                "Actions"
              ].map((header) => (
                <th key={header} className="px-4 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {questions.map((question, index) => (
              <tr key={question.id} className="transition-colors duration-150 hover:bg-slate-950/60">
                <td className="px-4 py-4 text-slate-400">{index + 1}</td>
                <td className="min-w-[260px] px-4 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={question.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-slate-100 transition hover:text-zinc-200"
                      >
                        {question.title}
                      </a>
                      {question.isFavorite ? (
                        <Heart className="h-4 w-4 fill-zinc-200 text-zinc-200" />
                      ) : null}
                    </div>
                    <p className="max-w-sm text-xs text-slate-400">
                      {question.summary}
                    </p>
                    <textarea
                      value={question.notes}
                      onChange={(event) =>
                        onUpdate(question.id, { notes: event.target.value })
                      }
                      className="min-h-[76px] w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100"
                      placeholder="Inline notes..."
                    />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Badge className={platformColors[question.platform]}>
                    {question.platform}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <Badge className={difficultyColors[question.difficulty]}>
                    {question.difficulty}
                  </Badge>
                </td>
                <td className="min-w-[180px] px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {question.topics.map((topic) => (
                      <Badge
                        key={topic}
                        className="border-slate-700 bg-slate-800/80 text-slate-200"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={question.status}
                    onChange={(event) =>
                      onUpdate(question.id, {
                        status: event.target.value as Status
                      })
                    }
                    className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <ConfidenceStars
                    value={question.confidence}
                    onChange={(confidence) => onUpdate(question.id, { confidence })}
                  />
                </td>
                <td className="px-4 py-4">
                  <select
                    value={question.understood}
                    onChange={(event) =>
                      onUpdate(question.id, {
                        understood: event.target.value as Understood
                      })
                    }
                    className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
                  >
                    {understoodOptions.map((understood) => (
                      <option key={understood} value={understood}>
                        {understood}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    min={0}
                    value={question.timeTaken}
                    onChange={(event) =>
                      onUpdate(question.id, {
                        timeTaken: Number(event.target.value)
                      })
                    }
                    className="h-10 w-24 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-400">
                  {formatDate(question.dateAdded)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewHints(question)}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onToggleFavorite(question.id)}
                    >
                      <Heart
                        className={
                          question.isFavorite
                            ? "h-4 w-4 fill-zinc-200 text-zinc-200"
                            : "h-4 w-4"
                        }
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onToggleRevision(question.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
