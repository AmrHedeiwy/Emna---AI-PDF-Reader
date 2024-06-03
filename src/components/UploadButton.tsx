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
import { Progress } from './ui/progress';

const UploadButton = ({ isSubscribed }: { isSubscribed: boolean }) => {
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
        <UploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  );
};

const UploadDropzone = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const router = useRouter();

  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing(
    isSubscribed ? 'proPlanUploader' : 'freePlanUploader',
    {
      skipPolling: true,
      onUploadProgress: (num) => setProgress(num),
      onUploadError: ({ code, message }) => {
        if (code === 'TOO_LARGE') return toast.error('File too large');

        if (message.includes('InvalidFileType'))
          return toast.error('Invalid file type', {
            description: 'Only PDF files are allowed.'
          });
        toast.error('Something went wrong', { description: 'Please try again later.' });
      },
      onClientUploadComplete: (res) => {
        if (!res || res.length === 0) return;
        const [{ key }] = res;

        startPolling({ key });
      }
    }
  );

  const { mutate: startPolling } = trpc.dashboard.getFile.useMutation({
    onSuccess: (file) => router.push(`/dashboard/${file.id}`),
    retry: true,
    retryDelay: 500
  });

  return (
    <Dropzone
      multiple={false}
      disabled={isUploading || !!progress}
      maxFiles={1}
      onDropRejected={() =>
        toast.error('Too many files', {
          description: 'Only 1 file can be uploaded.',
          duration: 5000
        })
      }
      onDrop={async (acceptedFile) =>
        acceptedFile.length > 0 ? await startUpload(acceptedFile) : null
      }
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-200 rounded-lg"
        >
          <div
            className={cn(
              'flex flex-col items-center justify-center bg-zinc-50 w-full h-full hover:bg-zinc-100 cursor-pointer',
              (isUploading || !!progress) && 'cursor-not-allowed'
            )}
          >
            <div className="flex flex-col items-center justify-center mb-6">
              <CloudUpload className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-700 mb-2">
                <span className="font-semibold">Click to upload</span> or drag and drop.
              </p>
              <p className="text-xs text-muted-foreground">
                PDF up to ({isSubscribed ? '32' : '16'}MB)
              </p>
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

            {(isUploading || !!progress) && (
              <div className="mt-4 w-full max-w-xs">
                <Progress value={progress} />

                <div className="flex items-center justify-center gap-1 mt-1">
                  {progress === 0 ? (
                    <>
                      <p className="text-xs font-medium text-muted-foreground">
                        Connecting to the server...
                      </p>
                    </>
                  ) : progress === 100 ? (
                    <>
                      <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Redirecting...
                      </span>
                    </>
                  ) : (
                    <p className="text-xs font-medium text-muted-foreground">
                      Uploading {progress}%
                    </p>
                  )}
                </div>
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
