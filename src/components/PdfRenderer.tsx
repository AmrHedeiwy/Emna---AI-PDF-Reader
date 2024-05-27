'use client';

import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react';
import { Page, Document, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { toast } from 'sonner';

import { useResizeDetector } from 'react-resize-detector';
import SimpleBar from 'simplebar-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PdfFullscreen from './PdfFullscreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfRenderer = ({ url }: { url: string }) => {
  const { width, ref } = useResizeDetector();

  const [size, setSize] = useState<string>('100');
  const [currPage, setCurrPage] = useState<number>(1);
  const [numOfPages, setNumOfPages] = useState<number>();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const PageSchema = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numOfPages!)
  });

  type TPageShema = z.infer<typeof PageSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<TPageShema>({
    resolver: zodResolver(PageSchema),
    defaultValues: {
      page: '1'
    }
  });

  const handlePageSubmit = ({ page }: TPageShema) => {
    setCurrPage(Number(page));
    setValue('page', page);
  };

  return (
    <div className="w-full flex flex-col items-center bg-white shadow rounded">
      <div className="flex items-center justify-between h-14 w-full px-2 border-b border-gray-200 ">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={currPage <= 1}
            onClick={() => {
              if (currPage > 1) {
                setCurrPage(currPage - 1);
                setValue('page', String(currPage - 1));
              }
            }}
          >
            <ChevronDown className="text-zinc-600 w-4 h-4" />
          </Button>

          <div className="relative">
            <Input
              className={cn(
                'w-20 pr-[50px] text-sm font-semibold text-center spin-button-none',
                errors.page && 'focus-visible:ring-red-500'
              )}
              type="number"
              {...register('page')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit(handlePageSubmit)();
              }}
            />
            <div className="absolute h-full border-l border-zinc-300 top-0 right-0 w-10 flex items-center justify-center">
              <div className="flex items-center justify-center">
                <p className=" text-sm">{numOfPages ?? 'x'}</p>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={currPage == numOfPages}
            onClick={() => {
              if (currPage < numOfPages!) {
                setCurrPage(currPage + 1);
                setValue('page', String(currPage + 1));
              }
            }}
          >
            <ChevronUp className="text-zinc-600 w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer group">
              <Button variant="ghost" aria-label="zoom" className="gap-1.5">
                <Search className="w-4 h-4" />
                {size}%
                <ChevronDown className="text-zinc-600 w-3 h-3 transition group-aria-expanded:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-20">
              <DropdownMenuRadioGroup value={size} onValueChange={setSize}>
                <DropdownMenuRadioItem value="100" onSelect={() => setScale(1)}>
                  100%
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="150" onSelect={() => setScale(1.5)}>
                  150%
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="200" onSelect={() => setScale(2)}>
                  200%
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="250" onSelect={() => setScale(2.5)}>
                  250%
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            aria-label="rotate 90 degrees"
            onClick={() => setRotation((prev) => prev + 90)}
          >
            <RotateCw className="text-zinc-600 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <PdfFullscreen url={url} />
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10.1rem)]">
          <div ref={ref}>
            <Document
              file={url}
              className="max-h-full"
              loading={
                <div className="flex items-center text-muted-foreground gap-1 justify-center py-28">
                  <Loader2 className="text-zinc-500 w-10 h-10 animate-spin" />
                  Loading documents...
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumOfPages(numPages)}
            >
              <Page
                rotate={rotation}
                scale={scale}
                width={width ?? 1}
                pageNumber={currPage}
                onLoadError={() => {
                  toast.error('Error loading PDF - Please try again later');
                }}
                loading={
                  <div className="flex items-center gap-1 text-muted-foreground justify-center py-28">
                    <Loader2 className="text-zinc-500 w-10 h-10 animate-spin" />
                    Loading PDF...
                  </div>
                }
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
