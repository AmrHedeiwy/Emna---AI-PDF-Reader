'use client';

import { Expand, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import SimpleBar from 'simplebar-react';
import { Document, Page } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { toast } from 'sonner';
import { useState } from 'react';

const PdfFullscreen = ({ url }: { url: string }) => {
  const { width, ref } = useResizeDetector();
  const [isOpen, setIsOpen] = useState(false);

  const [numOfPages, setNumPages] = useState<number>();

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button aria-label="fullscreen" variant="ghost">
          <Expand className="text-zinc-600 w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            <Document
              file={url}
              className="max-h-full"
              loading={
                <div className="flex items-center text-muted-foreground gap-1 justify-center py-28">
                  <Loader2 className="text-zinc-500 w-10 h-10 animate-spin" />
                  Loading document...
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => {
                toast.error('Error loading PDF - Please try again later');
              }}
            >
              {new Array(numOfPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  width={width ? width : 1}
                  pageNumber={i + 1}
                  loading={
                    <div className="flex items-center gap-1 text-muted-foreground justify-center py-28">
                      <Loader2 className="text-zinc-500 w-10 h-10 animate-spin" />
                      Loading PDF...
                    </div>
                  }
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
