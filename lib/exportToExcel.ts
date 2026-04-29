import ExcelJS from "exceljs";
import { Question } from "@/types";

type ExportStatus = "Solved (No help)" | "Solved (With help)" | "Attempted" | "Unsolved";

function getDisplayStatus(question: Question): ExportStatus {
  if (question.status === "Unsolved") return "Unsolved";
  if (question.status === "Attempted") return "Attempted";
  return question.understood === "Yes" ? "Solved (No help)" : "Solved (With help)";
}

function getTopicLabel(topics: string[]) {
  if (topics.length === 0) return "General";
  if (topics.length === 1) return topics[0];
  return `${topics[0]} +${topics.length - 1}`;
}

function getStatusStyle(status: ExportStatus) {
  if (status === "Solved (No help)") {
    return { fill: "D9F2C8", font: "2A7E36" };
  }
  if (status === "Solved (With help)") {
    return { fill: "FDE7A3", font: "996300" };
  }
  if (status === "Attempted") {
    return { fill: "FCD8A8", font: "9A4B00" };
  }
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

export async function exportToExcel(questions: Question[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("DSA Revision Sheet", {
    views: [{ state: "frozen", ySplit: 1 }]
  });

  worksheet.columns = [
    { header: "Problem Name", key: "problemName", width: 30 },
    { header: "Problem Link", key: "problemLink", width: 38 },
    { header: "Topic", key: "topic", width: 18 },
    { header: "Idea", key: "idea", width: 34 },
    { header: "What I did wrong", key: "mistake", width: 34 },
    { header: "Status", key: "status", width: 24 },
    { header: "Revisit ?", key: "revisit", width: 12 }
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11, name: "Calibri" };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F5D4D" } };
    cell.border = {
      top: { style: "thin", color: { argb: "FF0F3C2F" } },
      left: { style: "thin", color: { argb: "FF0F3C2F" } },
      bottom: { style: "thin", color: { argb: "FF0F3C2F" } },
      right: { style: "thin", color: { argb: "FF0F3C2F" } }
    };
  });

  questions.forEach((question, index) => {
    const rowIndex = index + 2;
    const displayStatus = getDisplayStatus(question);
    const topicLabel = getTopicLabel(question.topics);

    worksheet.addRow({
      problemName: question.title,
      problemLink: question.url,
      topic: topicLabel,
      idea: question.summary,
      mistake: question.notes || "-",
      status: displayStatus,
      revisit: question.revisionFlag ? "Yes" : "No"
    });

    const row = worksheet.getRow(rowIndex);
    row.height = 24;
    row.eachCell((cell, columnNumber) => {
      cell.font = { name: "Calibri", size: 11, color: { argb: "FF1F2937" } };
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowIndex % 2 === 0 ? "FFF8FBFA" : "FFF1F5F4" }
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFD6E2DE" } },
        left: { style: "thin", color: { argb: "FFD6E2DE" } },
        bottom: { style: "thin", color: { argb: "FFD6E2DE" } },
        right: { style: "thin", color: { argb: "FFD6E2DE" } }
      };

      if (columnNumber >= 3 && columnNumber <= 7) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }
    });

    const linkCell = worksheet.getCell(`B${rowIndex}`);
    if (question.url) {
      linkCell.value = { text: question.url, hyperlink: question.url };
      linkCell.font = {
        name: "Calibri",
        size: 11,
        color: { argb: "FF1D4ED8" },
        underline: true
      };
    } else {
      linkCell.value = "No link";
      linkCell.font = { name: "Calibri", size: 11, color: { argb: "FF6B7280" } };
    }
    linkCell.alignment = { vertical: "middle", horizontal: "left" };

    const topicCell = worksheet.getCell(`C${rowIndex}`);
    const topicStyle = getTopicStyle(topicLabel);
    topicCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${topicStyle.fill}` }
    };
    topicCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: `FF${topicStyle.font}` } };

    const statusCell = worksheet.getCell(`F${rowIndex}`);
    const statusStyle = getStatusStyle(displayStatus);
    statusCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${statusStyle.fill}` }
    };
    statusCell.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: `FF${statusStyle.font}` }
    };

    const revisitCell = worksheet.getCell(`G${rowIndex}`);
    const revisitFill = question.revisionFlag ? "CDE7FF" : "D9F2C8";
    const revisitFont = question.revisionFlag ? "1E5E9D" : "2A7E36";
    revisitCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${revisitFill}` }
    };
    revisitCell.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: `FF${revisitFont}` }
    };
  });

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 7 }
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  const fileName = `dsa-revision-sheet-${new Date().toISOString().slice(0, 10)}.xlsx`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
