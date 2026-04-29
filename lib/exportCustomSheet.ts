import ExcelJS from "exceljs";

export interface CustomSheetRow {
  problemName: string;
  problemLink: string;
  topic: string;
  trick: string;
  idea: string;
  whatWentWrong: string;
  status: "Solved (No help)" | "Solved (With help)" | "Attempted" | "Unsolved";
  revisit: "Yes" | "No";
  notes: string;
}

function sanitizeRows(rows: CustomSheetRow[]) {
  return rows.filter((row) =>
    Object.values(row).some((value) => String(value).trim().length > 0)
  );
}

function getStatusStyle(status: CustomSheetRow["status"]) {
  if (status === "Solved (No help)") return { fill: "D9F2C8", font: "2A7E36" };
  if (status === "Solved (With help)") return { fill: "FDE7A3", font: "996300" };
  if (status === "Attempted") return { fill: "FCD8A8", font: "9A4B00" };
  return { fill: "F4B3B1", font: "9F1D1B" };
}

function getTopicStyle(topic: string) {
  const value = topic.toLowerCase();
  if (value.includes("array")) return { fill: "F7C9C8", font: "AA2A2A" };
  if (value.includes("string")) return { fill: "CFE7FF", font: "1E5E9D" };
  if (value.includes("linked")) return { fill: "D4EDC4", font: "3F7F29" };
  if (value.includes("stack")) return { fill: "FDE7A3", font: "8E6500" };
  if (value.includes("math")) return { fill: "FBCFB0", font: "9A4B00" };
  return { fill: "E5E7EB", font: "4B5563" };
}

export async function exportCustomSheetToExcel(rows: CustomSheetRow[]) {
  const validRows = sanitizeRows(rows);
  if (validRows.length === 0) {
    throw new Error("Add at least one row before exporting.");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("My Custom DSA Sheet", {
    views: [{ state: "frozen", ySplit: 1 }]
  });

  worksheet.columns = [
    { header: "Problem Name", key: "problemName", width: 30 },
    { header: "Problem Link", key: "problemLink", width: 36 },
    { header: "Topic", key: "topic", width: 16 },
    { header: "Trick", key: "trick", width: 24 },
    { header: "Idea", key: "idea", width: 32 },
    { header: "What I did wrong", key: "whatWentWrong", width: 32 },
    { header: "Status", key: "status", width: 24 },
    { header: "Revisit ?", key: "revisit", width: 12 },
    { header: "Notes", key: "notes", width: 28 }
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, name: "Calibri", size: 11 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F5D4D" } };
    cell.alignment = { horizontal: "left", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "FF0F3C2F" } },
      left: { style: "thin", color: { argb: "FF0F3C2F" } },
      right: { style: "thin", color: { argb: "FF0F3C2F" } },
      bottom: { style: "thin", color: { argb: "FF0F3C2F" } }
    };
  });

  validRows.forEach((row, index) => {
    const rowNumber = index + 2;
    worksheet.addRow(row);
    const worksheetRow = worksheet.getRow(rowNumber);
    worksheetRow.height = 24;
    worksheetRow.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 11, color: { argb: "FF1F2937" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowNumber % 2 === 0 ? "FFF8FBFA" : "FFF1F5F4" }
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFD6E2DE" } },
        left: { style: "thin", color: { argb: "FFD6E2DE" } },
        right: { style: "thin", color: { argb: "FFD6E2DE" } },
        bottom: { style: "thin", color: { argb: "FFD6E2DE" } }
      };
    });

    const linkCell = worksheet.getCell(`B${rowNumber}`);
    if (row.problemLink.trim()) {
      linkCell.value = { text: row.problemLink.trim(), hyperlink: row.problemLink.trim() };
      linkCell.font = { name: "Calibri", size: 11, color: { argb: "FF1D4ED8" }, underline: true };
    }

    const topicCell = worksheet.getCell(`C${rowNumber}`);
    const topicStyle = getTopicStyle(row.topic);
    topicCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${topicStyle.fill}` }
    };
    topicCell.font = { name: "Calibri", size: 11, color: { argb: `FF${topicStyle.font}` }, bold: true };
    topicCell.alignment = { horizontal: "center", vertical: "middle" };

    const statusCell = worksheet.getCell(`G${rowNumber}`);
    const statusStyle = getStatusStyle(row.status);
    statusCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${statusStyle.fill}` }
    };
    statusCell.font = { name: "Calibri", size: 11, color: { argb: `FF${statusStyle.font}` }, bold: true };
    statusCell.alignment = { horizontal: "center", vertical: "middle" };

    const revisitCell = worksheet.getCell(`H${rowNumber}`);
    const revisitFill = row.revisit === "Yes" ? "CDE7FF" : "D9F2C8";
    const revisitFont = row.revisit === "Yes" ? "1E5E9D" : "2A7E36";
    revisitCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${revisitFill}` }
    };
    revisitCell.font = { name: "Calibri", size: 11, color: { argb: `FF${revisitFont}` }, bold: true };
    revisitCell.alignment = { horizontal: "center", vertical: "middle" };
  });

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 9 }
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  const fileName = `my-custom-dsa-sheet-${new Date().toISOString().slice(0, 10)}.xlsx`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value: string) {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportCustomSheetToCsv(rows: CustomSheetRow[]) {
  const validRows = sanitizeRows(rows);
  if (validRows.length === 0) {
    throw new Error("Add at least one row before exporting.");
  }

  const headers = [
    "Problem Name",
    "Problem Link",
    "Topic",
    "Trick",
    "Idea",
    "What I did wrong",
    "Status",
    "Revisit ?",
    "Notes"
  ];

  const lines = [
    headers.join(","),
    ...validRows.map((row) =>
      [
        row.problemName,
        row.problemLink,
        row.topic,
        row.trick,
        row.idea,
        row.whatWentWrong,
        row.status,
        row.revisit,
        row.notes
      ]
        .map((value) => escapeCsvValue(String(value ?? "").trim()))
        .join(",")
    )
  ];

  const csvContent = lines.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const fileName = `my-custom-dsa-sheet-${new Date().toISOString().slice(0, 10)}.csv`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
