import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { sessionDetail } from "@/app/(routes)/dashboard/medical-agent/[sessionId]/page";

export const downloadReport = (record: sessionDetail) => {
  const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let y = 50;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(33, 37, 41);
  doc.text("Medical Assistant Report", pageWidth / 2, y, { align: "center" });
  y += 30;

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    styles: { fontSize: 11, cellPadding: 6 },
    theme: "striped",
    head: [["Field", "Value"]],
    body: [
      ["Doctor", record.selectedDocter?.specialist || "-"],
      ["Consult Date", new Date(record.createdOn).toLocaleString()],
      ["User", record.report?.user || "-"],
      ["Agent", record.report?.agent || "-"],
    ],
  });
  y = (doc as any).lastAutoTable.finalY + 20;

  const addHeading = (text: string) => {
    doc.setFontSize(14);
    doc.setTextColor(30, 80, 160);
    doc.text(text, marginX, y);
    doc.setDrawColor(30, 80, 160);
    doc.setLineWidth(0.5);
    doc.line(marginX, y + 2, pageWidth - marginX, y + 2); // divider
    y += 18;
    doc.setFontSize(11);
    doc.setTextColor(0);
  };

  const addTextBlock = (text: string) => {
    if (!text) return;
    const lines = doc.splitTextToSize(text, pageWidth - marginX * 2);
    doc.text(lines, marginX, y);
    y += lines.length * 14 + 8;
    if (y > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      y = 50;
    }
  };

  if (record.report?.chiefComplaint) {
    addHeading("Chief Complaint");
    addTextBlock(record.report.chiefComplaint);
  }

  if (record.report?.summary) {
    addHeading("Summary");
    addTextBlock(record.report.summary);
  }

  if (record.report?.symptoms?.length) {
    addHeading("Symptoms");
    record.report.symptoms.forEach((sym: string) => addTextBlock(`• ${sym}`));
  }

  if (record.report?.duration || record.report?.severity) {
    addHeading("Duration & Severity");
    addTextBlock(`Duration: ${record.report?.duration || "-"}`);
    addTextBlock(`Severity: ${record.report?.severity || "-"}`);
  }

  if (record.report?.recommandations?.length) {
    addHeading("Recommendations");
    record.report.recommandations.forEach((rec: string) =>
      addTextBlock(`• ${rec}`)
    );
  }

  if (record.report?.medicationsMentioned?.length) {
    addHeading("Medications Mentioned");
    record.report.medicationsMentioned.forEach((rec: string) =>
      addTextBlock(`• ${rec}`)
    );
  }

  doc.save(`Medical_Report.pdf`);
};