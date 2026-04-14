"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { exportToExcel } from "@/lib/exportToExcel";
import { Question } from "@/types";

export function ExportButton({ questions }: { questions: Question[] }) {
  const { toast } = useToast();

  const handleExport = () => {
    if (questions.length === 0) {
      toast({
        title: "Nothing to export",
        description: "Add or unfilter questions before exporting.",
        variant: "error"
      });
      return;
    }

    exportToExcel(questions);
    toast({
      title: "Export complete",
      description: `${questions.length} questions were exported to Excel.`,
      variant: "success"
    });
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="h-4 w-4" />
      Export XLSX
    </Button>
  );
}
