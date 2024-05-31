import { Pinecone } from '@pinecone-database/pinecone';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { TGetUserSubscription } from '@/lib/stripe';

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

export const indexFile = async (
  url: string,
  id: string,
  subscription: TGetUserSubscription
) => {
  const res = await fetch(url);

  const blob = await res.blob();

  const loader = new PDFLoader(blob);

  const doc = await loader.load();

  const numOfPages = doc.length;

  if (numOfPages > subscription.plan.pagesPerPdf) throw new Error('Exceeded page limit');

  const pineconeIndex = pinecone.Index('emna');

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small'
  });

  await PineconeStore.fromDocuments(doc, embeddings, {
    pineconeIndex,
    namespace: id
  });
};
