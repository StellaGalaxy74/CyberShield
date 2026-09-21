import { jsPDF } from 'jspdf';
import { InvestigationReport } from '../types';

/**
 * CyberShield AI — Incident Forensic PDF Dossier Generator
 * Generates an official, print-ready multi-page PDF document aligned with
 * Indian Cyber Crime Coordination Centre (I4C) standards and legal evidentiary formats.
 */
export function generateReportPdf(report: InvestigationReport): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm
  let currentY = 16;

  // Helper to check page break
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      drawFooter();
      doc.addPage();
      currentY = 18;
      drawHeaderBanner();
    }
  };

  const drawFooter = () => {
    const pageNum = doc.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

    doc.text(
      `CyberShield AI Threat Dossier • Case #${report.id} • Helpline: 1930 | cybercrime.gov.in`,
      marginX,
      pageHeight - 8
    );
    doc.text(`Page ${pageNum}`, pageWidth - marginX - 10, pageHeight - 8);
  };

  const drawHeaderBanner = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('CYBERSHIELD AI DEFENSE • INCIDENT FORENSIC DOSSIER', marginX, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Case ID: ${report.id}`, pageWidth - marginX - 35, currentY);

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(marginX, currentY + 2, pageWidth - marginX, currentY + 2);
    currentY += 8;
  };

  // -------------------------------------------------------------
  // PAGE 1: OFFICIAL INCIDENT HEADER
  // -------------------------------------------------------------
  // Header Box Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(marginX, currentY, contentWidth, 26, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('CYBERSHIELD AI DEFENSE', marginX + 6, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text('OFFICIAL CYBER SCAM & THREAT FORENSIC INVESTIGATION REPORT', marginX + 6, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('I4C Taxonomy Aligned • Indian Cybercrime Reporting Portal (cybercrime.gov.in) • Helpline: 1930', marginX + 6, currentY + 20);

  // Top right metadata box
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(report.id, pageWidth - marginX - 38, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const formattedDate = new Date(report.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  doc.text(formattedDate, pageWidth - marginX - 38, currentY + 14);
  doc.text(`MODALITY: ${report.inputType.toUpperCase()}`, pageWidth - marginX - 38, currentY + 20);

  currentY += 31;

  // -------------------------------------------------------------
  // THREAT LEVEL & RISK ASSESSMENT PANEL
  // -------------------------------------------------------------
  let themeColor = [16, 185, 129]; // emerald (low)
  let themeBg = [240, 253, 244];
  let themeBorder = [134, 239, 172];

  if (report.risk_level === 'CRITICAL') {
    themeColor = [225, 29, 72]; // rose-600
    themeBg = [255, 241, 242];
    themeBorder = [254, 205, 211];
  } else if (report.risk_level === 'HIGH') {
    themeColor = [217, 119, 6]; // amber-600
    themeBg = [254, 243, 199];
    themeBorder = [253, 230, 138];
  } else if (report.risk_level === 'SUSPICIOUS') {
    themeColor = [202, 138, 4]; // yellow-600
    themeBg = [254, 252, 232];
    themeBorder = [254, 240, 138];
  }

  // Draw Risk Card
  doc.setFillColor(themeBg[0], themeBg[1], themeBg[2]);
  doc.setDrawColor(themeBorder[0], themeBorder[1], themeBorder[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, currentY, contentWidth, 24, 2, 2, 'FD');

  // Risk Score Badge
  doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.roundedRect(marginX + 5, currentY + 4, 30, 16, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(`${report.risk_score}`, marginX + 12, currentY + 12);
  doc.setFontSize(7.5);
  doc.text('/100', marginX + 22, currentY + 12);
  doc.setFontSize(6.5);
  doc.text('RISK INDEX', marginX + 11, currentY + 17);

  // Level & Confidence
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.text(`${report.risk_level} THREAT DETECTED`, marginX + 40, currentY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Forensic Confidence: ${report.confidence} CONFIDENCE  |  Categories: ${report.categories.join(', ')}`, marginX + 40, currentY + 17);

  currentY += 28;

  // -------------------------------------------------------------
  // EXECUTIVE SUMMARY NARRATIVE
  // -------------------------------------------------------------
  checkPageBreak(30);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, currentY, contentWidth, 6, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('EXECUTIVE FORENSIC SUMMARY', marginX + 3, currentY + 4.2);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const summaryLines = doc.splitTextToSize(report.summary, contentWidth - 4);
  doc.text(summaryLines, marginX + 2, currentY);
  currentY += summaryLines.length * 4.2 + 4;

  // -------------------------------------------------------------
  // FORENSIC REASONING & DIAGNOSTIC POINTS
  // -------------------------------------------------------------
  if (report.reasoning_points && report.reasoning_points.length > 0) {
    checkPageBreak(25);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, currentY, contentWidth, 6, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('FORENSIC REASONING & WHY THIS WAS FLAGGED', marginX + 3, currentY + 4.2);
    currentY += 8;

    report.reasoning_points.forEach((pt, index) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(2, 132, 199); // sky-600
      doc.text(`${index + 1}.`, marginX + 2, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      const lines = doc.splitTextToSize(pt, contentWidth - 10);
      doc.text(lines, marginX + 7, currentY);
      currentY += lines.length * 3.8 + 2.5;
    });
    currentY += 2;
  }

  // -------------------------------------------------------------
  // DECOMPOSED RED FLAGS TABLE
  // -------------------------------------------------------------
  if (report.red_flags && report.red_flags.length > 0) {
    checkPageBreak(30);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, currentY, contentWidth, 6, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('DECOMPOSED THREAT INDICATORS & RED FLAGS', marginX + 3, currentY + 4.2);
    currentY += 8;

    report.red_flags.forEach((rf) => {
      checkPageBreak(16);
      // Row box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      let sevColor = [225, 29, 72];
      if (rf.severity === 'HIGH') sevColor = [217, 119, 6];
      if (rf.severity === 'MEDIUM') sevColor = [202, 138, 4];
      if (rf.severity === 'LOW') sevColor = [16, 185, 129];

      doc.setTextColor(sevColor[0], sevColor[1], sevColor[2]);
      doc.text(`[${rf.severity}] ${rf.indicator}`, marginX + 2, currentY);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      if (rf.evidence) {
        doc.text(`Evidence: "${rf.evidence.slice(0, 70)}"`, marginX + 70, currentY);
      }
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const expLines = doc.splitTextToSize(rf.explanation, contentWidth - 6);
      doc.text(expLines, marginX + 4, currentY);
      currentY += expLines.length * 3.4 + 3;
    });
    currentY += 2;
  }

  // -------------------------------------------------------------
  // EXTRACTED ARTIFACTS / IOCs
  // -------------------------------------------------------------
  const allUrls = report.entities?.urls || [];
  const allPhones = report.entities?.phone_numbers || [];
  const allPayments = report.entities?.payment_identifiers || [];
  const allKeywords = report.entities?.suspicious_keywords || [];

  if (allUrls.length > 0 || allPhones.length > 0 || allPayments.length > 0 || allKeywords.length > 0) {
    checkPageBreak(25);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, currentY, contentWidth, 6, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('EXTRACTED ENTITIES & SUSPECT IDENTIFIERS (IOCs)', marginX + 3, currentY + 4.2);
    currentY += 8;

    if (allUrls.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Links / URLs:', marginX + 2, currentY);
      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(225, 29, 72);
      doc.text(allUrls.join('  •  '), marginX + 26, currentY);
      currentY += 4.5;
    }

    if (allPhones.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Phone Numbers:', marginX + 2, currentY);
      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(217, 119, 6);
      doc.text(allPhones.join('  •  '), marginX + 26, currentY);
      currentY += 4.5;
    }

    if (allPayments.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Payment / UPI:', marginX + 2, currentY);
      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(147, 51, 234);
      doc.text(allPayments.join('  •  '), marginX + 26, currentY);
      currentY += 4.5;
    }

    if (allKeywords.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Keywords Flagged:', marginX + 2, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(allKeywords.join(', '), marginX + 28, currentY);
      currentY += 5;
    }
    currentY += 2;
  }

  // -------------------------------------------------------------
  // RECOMMENDED ACTIONS & INDIA REPORTING GUIDANCE
  // -------------------------------------------------------------
  checkPageBreak(35);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, currentY, contentWidth, 6, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('DEFENSIVE ACTIONS & OFFICIAL COMPLAINT PROTOCOL', marginX + 3, currentY + 4.2);
  currentY += 8;

  report.recommended_actions.forEach((act) => {
    checkPageBreak(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129); // emerald
    doc.text('✓', marginX + 2, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const actLines = doc.splitTextToSize(act, contentWidth - 8);
    doc.text(actLines, marginX + 7, currentY);
    currentY += actLines.length * 3.8 + 2;
  });

  // Official Helpline Box (1930 / cybercrime.gov.in)
  checkPageBreak(24);
  currentY += 2;
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(marginX, currentY, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(49, 46, 129); // indigo-900
  doc.text('OFFICIAL INDIA REPORTING DIRECTORY (I4C / MHA)', marginX + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(67, 56, 202);
  doc.text('• National Cybercrime Helpline: Call 1930 immediately if money has been debited (Golden Hour).', marginX + 4, currentY + 9.5);
  doc.text('• Online Complaint Filing: Visit https://cybercrime.gov.in to log a formal First Information Report (FIR).', marginX + 4, currentY + 13.5);
  doc.text('• Chakshu Portal (Sanchar Saathi): Report fraudulent SMS/calls via sancharsaathi.gov.in.', marginX + 4, currentY + 17.5);
  currentY += 24;

  // Final page footer
  drawFooter();

  return doc;
}

/**
 * Directly downloads the forensic investigation report as a clean PDF file.
 */
export function downloadReportPdf(report: InvestigationReport): void {
  const doc = generateReportPdf(report);
  const cleanId = report.id.replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`CyberShield_Investigation_${cleanId}.pdf`);
}

/**
 * Triggers printing of the PDF document or falls back safely to browser print.
 */
export function printReportAsPdf(report: InvestigationReport): void {
  try {
    // If standard browser print is supported and accessible, invoke it:
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
  } catch (err) {
    console.warn('[CyberShield AI] window.print() caught exception, falling back to direct PDF download:', err);
    downloadReportPdf(report);
  }
}
