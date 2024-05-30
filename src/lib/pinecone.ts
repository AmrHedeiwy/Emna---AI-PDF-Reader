import { Pinecone } from '@pinecone-database/pinecone';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { getUserSubscriptionPlan } from '@/lib/stripe';

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

export const indexFile = async (url: string, id: string) => {
  const res = await fetch(url);

  const blob = await res.blob();

  const loader = new PDFLoader(blob);

  const docs = await loader.load();

  const numOfPages = docs.length;
  const currentPlan = await getUserSubscriptionPlan();

  if (numOfPages > currentPlan.plan.pagesPerPdf) throw new Error('Exceeded page limit');

  const pineconeIndex = pinecone.Index('emna');

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small'
  });

  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex,
    namespace: id
  });
};
