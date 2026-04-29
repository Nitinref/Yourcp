"use client";

import * as React from "react";
import { Download, FileSpreadsheet, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  CustomSheetRow,
  exportCustomSheetToCsv,
  exportCustomSheetToExcel
} from "@/lib/exportCustomSheet";

const DEFAULT_ROW: CustomSheetRow = {
  problemName: "",
  problemLink: "",
  topic: "",
  trick: "",
  idea: "",
  whatWentWrong: "",
  status: "Unsolved",
  revisit: "No",
  notes: ""
};

const SAMPLE_ROWS: CustomSheetRow[] = [
  {
    problemName: "Two Sum",
    problemLink: "https://leetcode.com/problems/two-sum/",
    topic: "Arrays",
    trick: "Use map for complement lookup",
    idea: "Single pass hash map",
    whatWentWrong: "Initially forgot to return indices in order",
    status: "Solved (No help)",
    revisit: "No",
    notes: "Practice follow-up with sorted array variant"
  },
  {
    problemName: "Valid Parentheses",
    problemLink: "https://leetcode.com/problems/valid-parentheses/",
    topic: "Stack",
    trick: "Push opening and match with closing map",
    idea: "Stack-based matching",
    whatWentWrong: "Missed empty-stack check on closing bracket",
    status: "Solved (With help)",
    revisit: "Yes",
    notes: "Need speed practice for edge cases"
  },
  {
    problemName: "Best Time to Buy and Sell Stock",
    problemLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    topic: "Arrays",
    trick: "Track running minimum",
    idea: "Greedy with min price and max profit",
    whatWentWrong: "Compared profit before updating min",
    status: "Attempted",
    revisit: "Yes",
    notes: "Re-do without looking at notes"
  }
];

const TOPIC_SUGGESTIONS = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stack",
  "Queue",
  "Hashing",
  "Recursion",
  "Backtracking",
  "Binary Search",
  "Dynamic Programming",
  "Graph",
  "Tree",
  "Math",
  "Greedy"
];

const STATUS_OPTIONS: CustomSheetRow["status"][] = [
  "Solved (No help)",
  "Solved (With help)",
  "Attempted",
  "Unsolved"
];

const REVISIT_OPTIONS: CustomSheetRow["revisit"][] = ["No", "Yes"];

const STORAGE_KEY = "codetracker-pro-custom-sheet-builder";

export default function MakeYourOwnSheetPage() {
  const { toast } = useToast();
  const [rows, setRows] = React.useState<CustomSheetRow[]>([DEFAULT_ROW]);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CustomSheetRow[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setRows(parsed);
      }
    } catch {
      setRows([DEFAULT_ROW]);
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const updateRow = <K extends keyof CustomSheetRow>(
    index: number,
    key: K,
    value: CustomSheetRow[K]
  ) => {
    setRows((previous) =>
      previous.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row
      )
    );
  };

  const addRow = () => {
    setRows((previous) => [...previous, { ...DEFAULT_ROW }]);
  };

  const removeRow = (index: number) => {
    setRows((previous) => {
      if (previous.length === 1) return [{ ...DEFAULT_ROW }];
      return previous.filter((_, rowIndex) => rowIndex !== index);
    });
  };

  const loadSample = () => {
    setRows(SAMPLE_ROWS);
    toast({
      title: "Sample loaded",
      description: "Starter rows were added. Edit anything and export.",
      variant: "success"
    });
  };

  const clearAll = () => {
    setRows([{ ...DEFAULT_ROW }]);
    toast({
      title: "Sheet cleared",
      description: "You can start creating a fresh custom sheet now.",
      variant: "success"
    });
  };

  const handleExcelExport = async () => {
    try {
      await exportCustomSheetToExcel(rows);
      toast({
        title: "Excel export ready",
        description: "Your custom sheet has been downloaded as .xlsx.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description:
          error instanceof Error ? error.message : "Unable to export your custom sheet.",
        variant: "error"
      });
    }
  };

  const handleCsvExport = () => {
    try {
      exportCustomSheetToCsv(rows);
      toast({
        title: "CSV export ready",
        description: "Use this file directly in Google Sheets (File > Import).",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description:
          error instanceof Error ? error.message : "Unable to export your custom sheet.",
        variant: "error"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-500/30 bg-zinc-300/10 px-3 py-1 text-xs font-medium text-zinc-300">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Make Your Own Sheet
          </div>
          <CardTitle className="text-2xl">Build a custom revision sheet manually</CardTitle>
          <CardDescription>
            Add your own rows with topics, tricks, idea, mistakes, and status. Export as
            Excel or CSV for Google Sheets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={loadSample}>
              Load Sample Like Previous
            </Button>
            <Button variant="outline" onClick={addRow}>
              <Plus className="h-4 w-4" />
              Add Row
            </Button>
            <Button variant="ghost" onClick={clearAll}>
              <RotateCcw className="h-4 w-4" />
              Reset Sheet
            </Button>
            <Button onClick={handleExcelExport}>
              <Download className="h-4 w-4" />
              Export Excel (.xlsx)
            </Button>
            <Button variant="outline" onClick={handleCsvExport}>
              <Download className="h-4 w-4" />
              Export Google Sheet (.csv)
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="min-w-[1500px] w-full divide-y divide-slate-800 text-left text-sm">
            <thead className="bg-slate-950/70 text-slate-300">
              <tr>
                {[
                  "#",
                  "Problem Name",
                  "Problem Link",
                  "Topic",
                  "Trick",
                  "Idea",
                  "What I did wrong",
                  "Status",
                  "Revisit ?",
                  "Notes",
                  "Action"
                ].map((header) => (
                  <th key={header} className="px-3 py-3 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((row, index) => (
                <tr key={`row-${index}`} className="align-top">
                  <td className="px-3 py-3 text-slate-400">{index + 1}</td>
                  <td className="px-3 py-3">
                    <Input
                      value={row.problemName}
                      onChange={(event) => updateRow(index, "problemName", event.target.value)}
                      placeholder="e.g. Two Sum"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={row.problemLink}
                      onChange={(event) => updateRow(index, "problemLink", event.target.value)}
                      placeholder="https://..."
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      list={`topics-${index}`}
                      value={row.topic}
                      onChange={(event) => updateRow(index, "topic", event.target.value)}
                      placeholder="Arrays / Stack / DP..."
                    />
                    <datalist id={`topics-${index}`}>
                      {TOPIC_SUGGESTIONS.map((topic) => (
                        <option key={topic} value={topic} />
                      ))}
                    </datalist>
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={row.trick}
                      onChange={(event) => updateRow(index, "trick", event.target.value)}
                      placeholder="Small shortcut/trick"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={row.idea}
                      onChange={(event) => updateRow(index, "idea", event.target.value)}
                      placeholder="Core idea"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={row.whatWentWrong}
                      onChange={(event) => updateRow(index, "whatWentWrong", event.target.value)}
                      placeholder="Mistake done"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={row.status}
                      onChange={(event) =>
                        updateRow(
                          index,
                          "status",
                          event.target.value as CustomSheetRow["status"]
                        )
                      }
                      className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={row.revisit}
                      onChange={(event) =>
                        updateRow(
                          index,
                          "revisit",
                          event.target.value as CustomSheetRow["revisit"]
                        )
                      }
                      className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
                    >
                      {REVISIT_OPTIONS.map((revisit) => (
                        <option key={revisit} value={revisit}>
                          {revisit}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={row.notes}
                      onChange={(event) => updateRow(index, "notes", event.target.value)}
                      placeholder="Extra note"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => removeRow(index)}
                      title="Delete row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
