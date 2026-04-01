'use client';

import React from 'react';
import { PDFMerger } from '@/components/pdf-tools/PDFMerger';

export default function PDFMergerPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PDF Merger</h1>
          <p className="text-muted-foreground">
            Upload multiple PDFs, reorder pages, merge, rename, and export as a single document
          </p>
        </div>

        <PDFMerger />
      </div>
    </main>
  );
}
