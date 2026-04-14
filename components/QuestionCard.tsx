"use client";

import { Heart, Pencil, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceStars } from "@/components/ConfidenceStars";
import {
  difficultyColors,
  platformColors,
  statusOptions,
  understoodOptions
} from "@/constants/platforms";
import { formatDate } from "@/lib/utils";
import { Question, Status, Understood } from "@/types";

interface QuestionCardProps {
  question: Question;
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onToggleRevision: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onViewHints: (question: Question) => void;
}

export function QuestionCard({
  question,
  onUpdate,
  onDelete,
  onToggleRevision,
  onToggleFavorite,
  onViewHints
}: QuestionCardProps) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-1 hover:border-cyan-500/40">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={question.url || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-lg font-semibold text-slate-100 transition hover:text-cyan-300"
              >
                {question.title}
              </a>
              {question.isFavorite ? (
                <Heart className="h-4 w-4 fill-cyan-400 text-cyan-300" />
              ) : null}
            </div>
            <p className="text-sm text-slate-400">{question.summary}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={platformColors[question.platform]}>
              {question.platform}
            </Badge>
            <Badge className={difficultyColors[question.difficulty]}>
              {question.difficulty}
            </Badge>
          </div>
        </div>

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

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select
            value={question.status}
            onChange={(event) =>
              onUpdate(question.id, { status: event.target.value as Status })
            }
            className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

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

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2">
            <ConfidenceStars
              value={question.confidence}
              onChange={(confidence) => onUpdate(question.id, { confidence })}
            />
          </div>

          <input
            type="number"
            min={0}
            value={question.timeTaken}
            onChange={(event) =>
              onUpdate(question.id, {
                timeTaken: Number(event.target.value)
              })
            }
            className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
          />
        </div>

        <textarea
          value={question.notes}
          onChange={(event) => onUpdate(question.id, { notes: event.target.value })}
          className="min-h-[100px] w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-100"
          placeholder="Keep concise notes, traps, and reminders here..."
        />

        <div className="flex flex-col gap-3 border-t border-slate-800 pt-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-400">
            Added {formatDate(question.dateAdded)} · Complexity {question.timeComplexity}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewHints(question)}>
              <Sparkles className="h-4 w-4" />
              View Hints
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(question.id)}
            >
              <Heart
                className={
                  question.isFavorite
                    ? "h-4 w-4 fill-cyan-400 text-cyan-300"
                    : "h-4 w-4"
                }
              />
              Favorite
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleRevision(question.id)}
            >
              <RotateCcw className="h-4 w-4" />
              {question.revisionFlag ? "Revision On" : "Mark Revision"}
            </Button>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
              Inline edit enabled
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(question.id)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
