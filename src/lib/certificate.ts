import type { LearningModule } from "@/types";
import { formatDate } from "@/lib/utils";

export interface CertificateData {
  name: string;
  module: LearningModule;
  issuedAt: string;
  code: string;
}

export function moduleSkills(module: LearningModule): string[] {
  return Array.from(new Set(module.lessons.flatMap((l) => l.skills)));
}

const TEAL: [number, number, number] = [44, 106, 92]; // sage
const TEAL_DARK: [number, number, number] = [44, 106, 92];
const ORANGE: [number, number, number] = [180, 71, 42]; // clay
const GOLD: [number, number, number] = [242, 181, 68]; // sun
const INK: [number, number, number] = [30, 43, 47];
const CREAM: [number, number, number] = [251, 246, 238]; // paper

/** Build and download a branded, landscape US-Letter PDF certificate. */
export async function downloadCertificate(data: CertificateData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const cx = W / 2;

  doc.setProperties({
    title: `Second Take Certificate — ${data.module.title}`,
    subject: "Certificate of Completion",
    author: "Second Take",
    creator: "Second Take",
  });

  // Background + borders
  doc.setFillColor(...CREAM);
  doc.rect(0, 0, W, H, "F");
  doc.setDrawColor(...TEAL);
  doc.setLineWidth(10);
  doc.roundedRect(22, 22, W - 44, H - 44, 18, 18, "S");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(2);
  doc.roundedRect(38, 38, W - 76, H - 76, 12, 12, "S");

  // Corner accents
  doc.setFillColor(...ORANGE);
  for (const [x, y] of [[56, 56], [W - 56, 56], [56, H - 56], [W - 56, H - 56]] as const) {
    doc.circle(x, y, 4, "F");
  }

  // Logo mark: ink square, sun arc, horizon line
  const lx = cx - 22;
  const ly = 62;
  doc.setFillColor(...INK);
  doc.roundedRect(lx, ly, 44, 44, 13, 13, "F");
  doc.setFillColor(...GOLD);
  doc.circle(cx, ly + 28.5, 11.5, "F");
  doc.setFillColor(...INK);
  doc.rect(lx + 2, ly + 28.5, 40, 14, "F");
  doc.setDrawColor(...CREAM);
  doc.setLineWidth(2.8);
  doc.line(lx + 8, ly + 28.5, lx + 36, ly + 28.5);
  doc.setLineWidth(2.8);
  doc.setDrawColor(150, 150, 145);
  doc.line(lx + 14.5, ly + 34.5, lx + 29.5, ly + 34.5);

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("SECOND TAKE", cx, ly + 64, { align: "center", charSpace: 2 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEAL_DARK);
  doc.text("YOUR REENTRY COACH", cx, ly + 78, { align: "center", charSpace: 1 });

  // Title
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.text("Certificate of Completion", cx, 196, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(68, 82, 79);
  doc.text("This certifies that", cx, 226, { align: "center" });

  // Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.setTextColor(...TEAL_DARK);
  doc.text(data.name, cx, 276, { align: "center" });
  const nameWidth = Math.max(220, doc.getTextWidth(data.name) + 40);
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(2.5);
  doc.line(cx - nameWidth / 2, 290, cx + nameWidth / 2, 290);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(68, 82, 79);
  doc.text("has successfully completed the module", cx, 318, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...INK);
  doc.text(data.module.title, cx, 346, { align: "center" });

  // Skills
  const skills = moduleSkills(data.module).slice(0, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...TEAL_DARK);
  doc.text("SKILLS DEMONSTRATED", cx, 378, { align: "center", charSpace: 1.5 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  const colW = 300;
  const left = cx - colW;
  skills.forEach((skill, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = left + col * colW + 20;
    const y = 398 + row * 17;
    doc.setFillColor(...ORANGE);
    doc.circle(x - 8, y - 3.5, 2.5, "F");
    doc.text(doc.splitTextToSize(skill, colW - 40)[0] as string, x, y);
  });

  // Footer: date, code, signature line
  const footerY = H - 88;
  doc.setDrawColor(200, 187, 166);
  doc.setLineWidth(1);
  doc.line(110, footerY, 290, footerY);
  doc.line(W - 290, footerY, W - 110, footerY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text(formatDate(data.issuedAt), 200, footerY - 8, { align: "center" });
  doc.text("Second Take", W - 200, footerY - 8, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(68, 82, 79);
  doc.text("Date", 200, footerY + 14, { align: "center" });
  doc.text("Your Reentry Coach", W - 200, footerY + 14, { align: "center" });

  // Seal
  doc.setFillColor(...GOLD);
  doc.circle(cx, footerY - 4, 30, "F");
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(2);
  doc.circle(cx, footerY - 4, 24, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text("MODULE", cx, footerY - 6, { align: "center" });
  doc.setFontSize(6.5);
  doc.text("COMPLETE", cx, footerY + 4, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(120, 130, 135);
  doc.text(`Certificate ID: ${data.code}`, cx, H - 50, { align: "center" });

  const safeName = data.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "learner";
  doc.save(`Second-Take-${data.module.shortTitle.replace(/\s+/g, "-")}-${safeName}.pdf`);
}
