'use client';

import React, { useState } from 'react';
import { PDFFile, PDFPage, loadPDFFile, mergePDFs, downloadBlob, getAllPages } from '@/lib/pdf-merger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Trash2, Download, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

export function PDFMerger() {
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [outputName, setOutputName] = useState('merged-document');
  const [isLoading, setIsLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.includes('pdf')) {
          toast.error(`${file.name} is not a PDF`);
          continue;
        }

        const pdfFile = await loadPDFFile(file);
        setPdfs((prev) => [...prev, pdfFile]);
      }
      toast.success('PDFs loaded successfully');
    } catch (error) {
      toast.error('Failed to load PDF');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePages = (updatedPdfs: PDFFile[]) => {
    const allPages = getAllPages(updatedPdfs);
    setPages(allPages);
  };

  const removePDF = (pdfId: string) => {
    const updated = pdfs.filter((p) => p.id !== pdfId);
    setPdfs(updated);
    updatePages(updated);
    toast.success('PDF removed');
  };

  const handleDragStart = (pageId: string) => {
    setDraggedItem(pageId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetPageId: string) => {
    if (!draggedItem || draggedItem === targetPageId) return;

    const draggedIndex = pages.findIndex((p) => p.id === draggedItem);
    const targetIndex = pages.findIndex((p) => p.id === targetPageId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newPages = [...pages];
    const [draggedPage] = newPages.splice(draggedIndex, 1);
    newPages.splice(targetIndex, 0, draggedPage);

    setPages(newPages);
    setDraggedItem(null);
    toast.success('Page reordered');
  };

  const handleMergePDFs = async () => {
    if (pages.length === 0) {
      toast.error('Add at least one PDF');
      return;
    }

    if (!outputName.trim()) {
      toast.error('Please enter an output name');
      return;
    }

    setIsLoading(true);
    try {
      const blob = await mergePDFs(pdfs, pages, outputName);
      downloadBlob(blob, outputName);
      toast.success('PDFs merged and downloaded successfully!');
    } catch (error) {
      toast.error('Failed to merge PDFs');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPdfs([]);
    setPages([]);
    setOutputName('merged-document');
    toast.success('Cleared all PDFs');
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold">Upload PDFs</h2>
        <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-3 w-full">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-semibold text-sm">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PDF files only</p>
            </div>
          </label>
        </div>

        {pdfs.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">{pdfs.length} PDF(s) loaded</p>
            <div className="flex flex-wrap gap-2">
              {pdfs.map((pdf) => (
                <div key={pdf.id} className="flex items-center gap-2 bg-muted px-3 py-1 rounded text-sm">
                  <span className="truncate max-w-[150px]">{pdf.name}</span>
                  <span className="text-xs text-muted-foreground">({pdf.pageCount}p)</span>
                  <button
                    onClick={() => removePDF(pdf.id)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Pages Reordering Section */}
      {pages.length > 0 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Reorder Pages ({pages.length} pages)</h2>
          <p className="text-xs text-muted-foreground">Drag pages to reorder them</p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {pages.map((page, index) => (
              <div
                key={page.id}
                draggable
                onDragStart={() => handleDragStart(page.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(page.id)}
                className={`flex items-center gap-3 p-3 rounded border transition-colors cursor-move ${
                  draggedItem === page.id
                    ? 'bg-primary/10 border-primary opacity-50'
                    : 'bg-muted/30 border-border hover:bg-muted/50 hover:border-muted-foreground'
                }`}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold">#{index + 1}</span>
                    <span className="text-sm">{page.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Output Name Section */}
      {pages.length > 0 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Output Settings</h2>
          <div>
            <label className="text-sm font-semibold block mb-2">Filename</label>
            <div className="flex gap-2">
              <Input
                value={outputName}
                onChange={(e) => setOutputName(e.target.value)}
                placeholder="merged-document"
                className="flex-1"
              />
              <span className="text-muted-foreground text-sm self-center">.pdf</span>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      {pages.length > 0 && (
        <div className="flex gap-2">
          <Button
            onClick={handleMergePDFs}
            disabled={isLoading}
            size="lg"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {isLoading ? 'Merging...' : 'Merge & Download'}
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            size="lg"
            disabled={isLoading}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
