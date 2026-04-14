import * as XLSX from "xlsx";
import { Question } from "@/types";

function getRowFill(difficulty: Question["difficulty"]) {
  if (difficulty === "Easy") return "E8FFF1";
  if (difficulty === "Medium") return "FFF5E5";
  return "FFE9EE";
}

export function exportToExcel(questions: Question[]) {
  const rows = questions.map((question, index) => ({
    "#": index + 1,
    Title: question.title,
    URL: question.url,
    Platform: question.platform,
    Difficulty: question.difficulty,
    Topics: question.topics.join(", "),
    Status: question.status,
    Confidence: question.confidence,
    Understood: question.understood,
    "Time(min)": question.timeTaken,
    "Date Added": question.dateAdded,
    Notes: question.notes,
    Revision: question.revisionFlag ? "Yes" : "No"
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const columnWidths = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.max(
      key.length + 4,
      ...rows.map((row) => String(row[key as keyof typeof row] ?? "").length + 2)
    )
  }));

  worksheet["!cols"] = columnWidths;

  const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "A1");

  for (let column = range.s.c; column <= range.e.c; column += 1) {
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: column });
    if (!worksheet[headerCell]) continue;
    worksheet[headerCell].s = {
      font: { bold: true, color: { rgb: "F8FAFC" } },
      fill: { fgColor: { rgb: "0891B2" } }
    };
  }

  questions.forEach((question, rowIndex) => {
    const fillColor = getRowFill(question.difficulty);
    for (let column = range.s.c; column <= range.e.c; column += 1) {
      const cell = XLSX.utils.encode_cell({ r: rowIndex + 1, c: column });
      if (!worksheet[cell]) continue;
      worksheet[cell].s = {
        fill: { fgColor: { rgb: fillColor } }
      };
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
  XLSX.writeFile(workbook, `codetracker-pro-${Date.now()}.xlsx`, {
    cellStyles: true
  });
}
