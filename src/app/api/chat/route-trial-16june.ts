import OpenAI from "openai";
import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

import { eq } from 'drizzle-orm';

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request, res: Response) {
  console.log("API HIT");

  try {
    const { messages, chatId } = await req.json();

    console.log("Messages received:", messages);
    console.log("Chat ID:", chatId);

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      console.log("Chat not found");
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const lastMessage = messages[messages.length - 1];
    const fileKey = _chats[0].fileKey;
    const context = await getContext(lastMessage.content, fileKey);

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.`,
    };

    // const { textStream } = await streamText({
    //   model: openai('gpt-3.5-turbo'),
    //   messages: [
    //     prompt,
    //     ...messages.filter((message: any) => message.role === "user")
    //   ],
    // });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: "hello"}],
      // messages: [
      //   prompt,
      //   ...messages.filter((message: any) => message.role === "user")
      // ],
      // stream: true,
    });

    
    console.log(" Response Content: ", completion.choices[0].message.content)
    return NextResponse.json({ data: completion.choices[0].message.content }, { status: 500 });
    
    // for await (const chunk of stream) {
    //   process.stdout.write(chunk.choices[0]?.delta?.content || '');
    // }

  
    

    // return new StreamingTextResponse(textStream)


    // const response = await openaiInstance.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages: [
    //     prompt,
    //     ...messages.filter((message: any) => message.role === "user")
    //   ],
    //   stream: true,
    // });

    // const stream = new ReadableStream({
    //   async start(controller) {        
    //     const encoder = new TextEncoder();

    //     for await (const chunk of response) {
    //       const content = chunk.choices[0]?.delta?.content || '';
    //       // console.log("Chunk received:", chunk);
    //       if (content) {
    //         controller.enqueue(encoder.encode(content));
    //       }
    //     }
    //     controller.close();

    //     console.log("Stream closed");
    //   },
    //   cancel() {
    //     console.log('Stream cancelled');
    //   }
    // });

    // const streamResp = new StreamingTextResponse(stream);
    // console.log({streamResp})
    // return streamResp;

  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
