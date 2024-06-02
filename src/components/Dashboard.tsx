'use client';

import { trpc } from '@/app/_trpc/client';
import { Skeleton } from '@/components/ui/skeleton';
import UploadButton from '@/components/UploadButton';
import { Ghost, Loader2, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TGetUserSubscription } from '@/lib/stripe';

const Dashboard = ({ subscription }: { subscription: TGetUserSubscription }) => {
  const { data: files, isLoading, refetch } = trpc.dashboard.getUserFiles.useQuery();

  const { mutate: deleteFile, variables } = trpc.dashboard.deleteFile.useMutation({
    onSuccess: () => refetch()
  });

  return (
    <main className="mx-auto max-w-7xl p-2 md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 text-5xl font-bold text-gray-900">My Files</h1>

        <UploadButton isSubscribed={subscription.isSubscribed} />
      </div>

      {files && files?.length !== 0 && (
        <ul className="mt-8 grid gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3 overflow-hidden">
          {files.map((file) => (
            <li
              key={file.id}
              className="col-span-1 w-screen md:w-auto divide-y divide-gray-200 bg-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-green-50 transition"
            >
              <Link href={`/dashboard/${file.id}`}>
                <div className="flex space-x-4 p-4">
                  <div
                    aria-hidden="true"
                    className="w-10 h-10 flex-shrink-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  />
                  <div className="flex-1 self-center truncate">
                    <h1 className="font-medium text-lg text-gray-900 truncate">
                      {file.name}
                    </h1>
                  </div>
                </div>
              </Link>

              <div className="px-6 py-2 mt-4 w-full">
                <div className="grid grid-cols-2 place-items-center gap-6 max-w-lg lg:max-w-sm mx-auto">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Plus className="w-4 h-4 text-gray-400 " />

                    {format(new Date(file.createdAt), 'MMM yyyy')}
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    variant="destructive"
                    onClick={() => {
                      deleteFile({ id: file.id });
                    }}
                  >
                    {variables?.id == file.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && files?.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8" />
          <h1 className="text-xl text-gray-900 font-semibold">
            Pretty empty around here
          </h1>

          <p className="font-medium text-sm text-muted-foreground">
            Let&apos;s upload your first PDF.
          </p>
        </div>
      )}

      {isLoading && <Placeholder />}
    </main>
  );
};

const Placeholder = () => {
  return (
    <div className="grid gap-4 py-4 px-6 sm:px-6">
      <div className="grid relative bg-zinc-200 aspect-square w-full h-20 overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="grid relative bg-zinc-200 aspect-square w-full h-20 overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="grid relative bg-zinc-200 aspect-square w-full h-20 overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="grid relative bg-zinc-200 aspect-square w-full h-20 overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
};

export default Dashboard;
