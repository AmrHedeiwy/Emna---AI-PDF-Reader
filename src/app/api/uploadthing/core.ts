import prisma from '@/lib/prismadb';

import authOptions from '@/server/authOptions';
import { getServerSession } from 'next-auth';

import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

import { pinecone } from '@/lib/pinecone';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async ({}) => {
      const session = await getServerSession(authOptions);

      if (!session || !session.user.id) throw new UploadThingError('Unauthorized');

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const isFileExist = !!(await prisma.file.findFirst({ where: { key: file.key } }));

      if (isFileExist) return;

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
        const res = await fetch(createdFile.url);

        const blob = await res.blob();

        const loader = new PDFLoader(blob);

        const docs = await loader.load();

        const numOfPages = docs.length;

        const pineconeIndex = pinecone.Index('emna');

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
          model: 'text-embedding-3-small'
        });

        await PineconeStore.fromDocuments(docs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id
        });

        await prisma.file.update({
          where: { id: createdFile.id },
          data: { uploadStatus: 'SUCCESS' }
        });
      } catch (error) {
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
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
