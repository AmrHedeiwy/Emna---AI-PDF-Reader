import { NextRequest, NextResponse } from 'next/server';

import authOptions from '@/server/authOptions';
import { getServerSession } from 'next-auth';

import { SendMessageValidator } from '@/lib/validators/send-message-validator';
import prisma from '@/lib/prismadb';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { pinecone } from '@/lib/pinecone';
import { openai } from '@/lib/openai';

import { OpenAIStream, StreamingTextResponse } from 'ai';

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id)
    return new NextResponse('UNAUTHORIZED', { status: 401 });

  const body = await req.json();

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await prisma.file.findFirst({
    where: { id: fileId, userId: session.user.id }
  });

  if (!file) return new NextResponse('NOT_FOUND', { status: 404 });

  await prisma.message.create({
    data: { content: message, fileId, isUserMessage: true, userId: session.user.id }
  });

  const pineconeIndex = pinecone.Index('emna');

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
  });

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await prisma.message.findMany({
    where: { fileId: file.id },
    orderBy: { createdAt: 'asc' },
    take: 6
  });

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? 'user' : 'assistant',
    content: msg.content
  }));

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    temperature: 0,
    user: session.user.id,
    messages: [
      {
        role: 'system',
        content:
          'When responding to user queries related to the PDF file topic, aim to provide comprehensive answers. Utilize the provided context effectively to address any and all questions. Prioritize clarity and accuracy in your responses. Ensure that all responses are relevant to the topic discussed in the PDF file.'
      },
      {
        role: 'user',
        content: `Use the following pieces of context (or previous conversation if needed) to answer the user's question in markdown format. If you don't know the answer, just say that you don't know; don't try to make up an answer.
          
          \n----------------\n
  
          PREVIOUS CONVERSATION:
          ${formattedPrevMessages.map((message) => {
            if (message.role === 'user') return `User: ${message.content}\n`;
            return `Assistant: ${message.content}\n`;
          })}
  
          \n----------------\n
  
          CONTEXT:
          ${results.map((r) => r.pageContent).join('\n\n')}
  
          USER INPUT: ${message}`
      }
    ]
  });

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      await prisma.message.create({
        data: {
          content: completion,
          isUserMessage: false,
          fileId: file.id,
          userId: session.user.id
        }
      });
    }
  });

  return new StreamingTextResponse(stream);
};
