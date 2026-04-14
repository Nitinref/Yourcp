"use client";

import { ArrowUpDown, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { difficultyOptions, platforms, statusOptions } from "@/constants/platforms";
import { SortBy, SortOrder } from "@/types";

interface FilterBarProps {
  filterPlatform: string;
  filterDifficulty: string;
  filterStatus: string;
  filterTopic: string;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  topics: string[];
  onFilterChange: (key: string, value: string) => void;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  filterPlatform,
  filterDifficulty,
  filterStatus,
  filterTopic,
  searchQuery,
  sortBy,
  sortOrder,
  topics,
  onFilterChange,
  onSortChange,
  onClearFilters
}: FilterBarProps) {
  const activeFilters = [
    filterPlatform && `Platform: ${filterPlatform}`,
    filterDifficulty && `Difficulty: ${filterDifficulty}`,
    filterStatus && `Status: ${filterStatus}`,
    filterTopic && `Topic: ${filterTopic}`,
    searchQuery && `Search: ${searchQuery}`
  ].filter(Boolean) as string[];

  return (
    <div className="glass-panel space-y-4 p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
        <SlidersHorizontal className="h-4 w-4 text-cyan-300" />
        Filter and sort your archive
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <select
          value={filterPlatform}
          onChange={(event) => onFilterChange("filterPlatform", event.target.value)}
          className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
        >
          <option value="">All Platforms</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>

        <select
          value={filterDifficulty}
          onChange={(event) =>
            onFilterChange("filterDifficulty", event.target.value)
          }
          className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
        >
          <option value="">All Difficulties</option>
          {difficultyOptions.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(event) => onFilterChange("filterStatus", event.target.value)}
          className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={filterTopic}
          onChange={(event) => onFilterChange("filterTopic", event.target.value)}
          className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
        >
          <option value="">All Topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        <div className="relative xl:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(event) => onFilterChange("searchQuery", event.target.value)}
            placeholder="Search title, summary, topic..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-800/40 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sortBy}
            onChange={(event) =>
              onSortChange(event.target.value as SortBy, sortOrder)
            }
            className="h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
          >
            <option value="date">Sort by date</option>
            <option value="difficulty">Sort by difficulty</option>
            <option value="confidence">Sort by confidence</option>
            <option value="platform">Sort by platform</option>
          </select>

          <Button
            variant="outline"
            onClick={() =>
              onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
            }
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>

        <Button variant="ghost" onClick={onClearFilters}>
          <RotateCcw className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>

      {activeFilters.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((item) => (
            <Badge
              key={item}
              className="border-cyan-500/20 bg-cyan-500/10 text-cyan-100"
            >
              {item}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
