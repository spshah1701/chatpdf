// import { getContext } from '@/lib/context';
// import { db } from '@/lib/db';
// import { chats } from '@/lib/db/schema';
// import { NextResponse } from 'next/server';
// import { Configuration, OpenAIApi } from 'openai-edge';
// import OpenAI from 'openai';
// import { StreamingTextResponse } from 'ai';
// import { eq } from 'drizzle-orm';

// export const runtime = "edge";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {

//   console.log("API HIT")
//   try {
//     const { messages, chatId } = await req.json();

//     console.log({messages}, {chatId})

//     const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
//     if (_chats.length !== 1) {
//       console.log("chats not found")
//       return NextResponse.json({ error: "chat not found" }, { status: 404 });
//     }

//     const lastMessage = messages[messages.length - 1];
//     const fileKey = _chats[0].fileKey;
//     const context = await getContext(lastMessage.content, fileKey);

//     const prompt = {
//       role: "system",
//       content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
//       The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
//       AI is a well-behaved and well-mannered individual.
//       AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
//       AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
//       AI assistant is a big fan of Pinecone and Vercel.
//       START CONTEXT BLOCK
//       ${context}
//       END OF CONTEXT BLOCK
//       AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
//       If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
//       AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
//       AI assistant will not invent anything that is not drawn directly from the context.`,
//     };

//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         prompt,
//         ...messages.filter((message: any) => message.role === "user")
//       ],
//       stream: true,
//     });



//     const stream = new ReadableStream({
//       async start(controller) {
//         const decoder = new TextDecoder();
//         for await (const chunk of response) {          
//           const content = chunk.choices[0]?.delta?.content || '';
//           console.log("Chunk", chunk)
//           if (content) {
//             controller.enqueue(new TextEncoder().encode(content));
//           }
//         }
//         controller.close();

//         console.log("RESPONSE", response)
//       },
//       cancel() {
//         console.log('Stream cancelled');
//       }
//     });

//     return new StreamingTextResponse(stream);

//   } catch (error) {
//     console.error("Error handling POST request:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


// import { openai } from '@ai-sdk/openai';
// import { Configuration, OpenAIApi } from 'openai-edge';
// import OpenAI from 'openai';
// import { streamText } from 'ai';
// import { StreamingTextResponse } from 'ai';
// import { StreamData } from "ai"

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

    console.log(prompt)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
          prompt,
          ...messages.filter((message: any) => message.role === "user")
        ],
    });
    
    console.log(" Response Content: ", completion.choices[0].message.content)
    return NextResponse.json({ data: completion.choices[0].message.content }, { status: 200 });    

  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
