import { type CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { chats, messages as _messages } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { getContext } from '@/lib/context';
import { string } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, chatId }: { messages: CoreMessage[], chatId: any} = await req.json();

  const _chats = await db.select().from(chats).where(eq(chats.id, chatId));

  if (_chats.length !== 1) {
    console.log("Chat not found");
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const lastMessage = messages[messages.length - 1];
  const fileKey = _chats[0].fileKey;

  let context = '';
  let lastUserMessage = String(lastMessage.content)

  if (typeof lastMessage.content === 'string') {
    context = await getContext(lastMessage.content, _chats[0].fileKey);
  } else {
    console.error("Unexpected message content type:", lastMessage.content);
    return NextResponse.json({ error: "Invalid message content type" }, { status: 400 });
  }

  const prompt = `AI assistant is a knowledgeable, helpful, and articulate AI.
    AI is well-mannered, friendly, and eager to provide thoughtful responses.
    AI can accurately answer nearly any question.
    AI is a big fan of Pinecone and Vercel.

    START of QUERY BLOCK
    ${lastUserMessage}
    END OF QUERY BLOCK

    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI will answer the query inside the QUERY BLOCK. AI will consider any CONTEXT BLOCK provided.
    If the context doesn't provide an answer, AI will say, "I'm sorry, but I don't know the answer to that question".
    AI will indicate new information if gained and will not invent anything not drawn from the context.`
  ;
  
   // Save user message to db
   await db.insert(_messages).values({
    chatId,
    content: lastUserMessage,
    role: 'user'
  });

  const result = await streamText({
    model: openai('gpt-4'),
    system: `You are a helpful assistant.`,
    prompt,
    onFinish: async ({text}) => {
      await db.insert(_messages).values({
        chatId,
        content: text,
        role: 'system'
      })
    }
    
  });

  return result.toAIStreamResponse();
}