'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

import Dropzone from 'react-dropzone';
import { CloudUpload, File, Loader2 } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadThing';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trpc } from '@/app/_trpc/client';

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(open);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

const UploadDropzone = () => {
  const { startUpload, isUploading } = useUploadThing('pdfUploader', {
    skipPolling: true
  });
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  const { mutate: startPolling } = trpc.dashboard.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);

      const timeout = setTimeout(() => setIsSuccess(false), 2000);

      clearTimeout(timeout);
    },
    retry: true,
    retryDelay: 500
  });

  return (
    <Dropzone
      multiple={false}
      disabled={isUploading || isSuccess}
      onDrop={async (acceptedFile) => {
        const res = await startUpload(acceptedFile);

        if (!res) return toast.error('Something went wrong!');

        const [{ key }] = res;

        if (!key) return toast.error('Something went wrong!');

        setIsSuccess(true);

        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-200 rounded-lg"
        >
          <div
            className={cn(
              'flex flex-col items-center justify-center bg-zinc-50 w-full h-full hover:bg-zinc-100 cursor-pointer',
              (isUploading || isSuccess) && 'cursor-not-allowed'
            )}
          >
            <div className="flex flex-col items-center justify-center mb-6">
              <CloudUpload className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-700 mb-2">
                <span className="font-semibold">Click to upload</span> or drag and drop.
              </p>
              <p className="text-xs text-muted-foreground">PDF up to (4MB)</p>
            </div>

            {acceptedFiles && acceptedFiles[0] && (
              <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                <div className="p-1.5 h-full grid place-items-center">
                  <File className="w-4 h-4 text-green-400" />
                </div>

                <div className="p-1.5 h-full text-sm font-medium text-zinc-700 truncate">
                  {acceptedFiles[0].name}
                </div>
              </div>
            )}

            {(isUploading || isSuccess) && (
              <div className="mt-4 w-full max-w-xs">
                <div className="border rounded bg-zinc-200 h-1">
                  <div
                    className={cn(
                      'h-full bg-green-500 transition',
                      isSuccess ? 'scale-100' : 'indeterminate-progress'
                    )}
                  />
                </div>
                {isSuccess && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Redirecting...
                    </span>
                  </div>
                )}
              </div>
            )}

            <input type="file" {...getInputProps()} className="hidden" />
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadButton;
