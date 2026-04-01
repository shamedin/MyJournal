import { PDFDocument } from 'pdf-lib';

export interface PDFFile {
  id: string;
  file: File;
  name: string;
  pageCount: number;
}

export interface PDFPage {
  id: string;
  pdfId: string;
  pageNumber: number;
  name: string;
}

/**
 * Load a PDF file and get its page count
 */
export async function loadPDFFile(file: File): Promise<PDFFile> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  return {
    id: `${Date.now()}-${Math.random()}`,
    file,
    name: file.name.replace('.pdf', ''),
    pageCount,
  };
}

/**
 * Merge multiple PDFs in the specified order
 */
export async function mergePDFs(
  pdfs: PDFFile[],
  pageOrder: PDFPage[],
  outputName: string
): Promise<Blob> {
  // Create a new PDF document
  const mergedPdf = await PDFDocument.create();

  // Group pages by their source PDF
  const groupedPages = new Map<string, number[]>();
  pageOrder.forEach((page) => {
    if (!groupedPages.has(page.pdfId)) {
      groupedPages.set(page.pdfId, []);
    }
    groupedPages.get(page.pdfId)!.push(page.pageNumber);
  });

  // Load and merge pages in order
  for (const page of pageOrder) {
    const sourcePDF = pdfs.find((p) => p.id === page.pdfId);
    if (!sourcePDF) continue;

    const arrayBuffer = await sourcePDF.file.arrayBuffer();
    const srcPdfDoc = await PDFDocument.load(arrayBuffer);

    // Get the specific page (0-indexed)
    const [copiedPage] = await mergedPdf.copyPages(srcPdfDoc, [page.pageNumber - 1]);
    mergedPdf.addPage(copiedPage);
  }

  // Save to blob
  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get all pages from loaded PDFs
 */
export function getAllPages(pdfs: PDFFile[]): PDFPage[] {
  const pages: PDFPage[] = [];
  pdfs.forEach((pdf) => {
    for (let i = 1; i <= pdf.pageCount; i++) {
      pages.push({
        id: `${pdf.id}-page-${i}`,
        pdfId: pdf.id,
        pageNumber: i,
        name: `${pdf.name} - Page ${i}`,
      });
    }
  });
  return pages;
}
