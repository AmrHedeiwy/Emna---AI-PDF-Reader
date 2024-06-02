import { indexFile } from '@/lib/pinecone';
import prisma from '@/lib/prismadb';
import { getUserSubscription } from '@/lib/stripe';

import authOptions from '@/server/authOptions';
import { getServerSession } from 'next-auth';

import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

const middleware = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) throw new UploadThingError('Unauthorized');

  return { userId: session.user.id, subscription: await getUserSubscription() };
};

const onUploadComplete = async ({
  metadata,
  file
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    url: string;
    name: string;
  };
}) => {
  const isFileExist = !!(await prisma.file.findFirst({ where: { key: file.key } }));

  if (isFileExist) return;

  // const isUserExceedQuota = await prisma.file.count({
  //   where: { userId: metadata.userId }
  // }) >= metadata.subscription.plan.quota;

  const createdFile = await prisma.file.create({
    data: {
      url: file.url,
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      uploadStatus: 'PROCESSING'
    }
  });

  try {
    await indexFile(createdFile.url, createdFile.id, metadata.subscription);

    await prisma.file.update({
      where: { id: createdFile.id },
      data: { uploadStatus: 'SUCCESS' }
    });
  } catch (error) {
    console.log(error);
    if (
      error instanceof UploadThingError &&
      (error.code === 'UPLOAD_FAILED' ||
        error.code === 'INTERNAL_CLIENT_ERROR' ||
        error.code === 'INTERNAL_SERVER_ERROR' ||
        error.code === 'URL_GENERATION_FAILED')
    )
      console.error(error);

    await prisma.file.update({
      where: {
        id: createdFile.id
      },
      data: {
        uploadStatus: 'FAILED'
      }
    });
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete)
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
