// "use client";
// import React from "react";
// import { Input } from "./ui/input";
// import { useChat, Message } from "ai/react";
// import { Button } from "./ui/button";
// import { Send } from "lucide-react";

// import MessageList from "./MessageList";

// type Props = { chatId: number };

// const ChatComponent = ({ chatId }: Props) => {
//   const { input, handleInputChange, handleSubmit, messages, append, setMessages, setInput } = useChat({
//     api: "/api/chat",
//     body: { chatId },
//   });

//   const handleStreamingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: "user",
//       content: input,
//     };
//     append(userMessage);
//     setInput(''); // Clear the input field after appending the user message

//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ messages: [...messages, userMessage], chatId }),
//       });

//       if (!response.body) throw new Error('No response body');

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let done = false;
//       let aiMessage: Message = { id: Date.now().toString(), role: "assistant", content: "" };

//       while (!done) {
//         const { value, done: readerDone } = await reader.read();
//         done = readerDone;
//         const chunk = decoder.decode(value, { stream: !done });
//         aiMessage.content += chunk;
//         setMessages([...messages.filter(m => m.id !== aiMessage.id), aiMessage]);
//       }
//     } catch (error) {
//       console.error("Error during streaming:", error);
//     }
//   };

//   React.useEffect(() => {
//     const messageContainer = document.getElementById("message-container");
//     if (messageContainer) {
//       messageContainer.scrollTo({
//         top: messageContainer.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages]);

//   return (
//     <div
//       className="relative max-h-screen overflow-scroll"
//       id="message-container"
//     >
//       {/* header */}
//       <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
//         <h3 className="text-xl font-bold">Chat</h3>
//       </div>

//       {/* message list */}
//       <MessageList messages={messages} />

//       <form
//         onSubmit={handleStreamingSubmit}
//         className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
//       >
//         <div className="flex">
//           <Input
//             value={input}
//             onChange={handleInputChange}
//             placeholder="Ask any question..."
//             className="w-full"
//           />
//           <Button className="bg-blue-600 ml-2">
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatComponent;


// // import { NextResponse } from 'next/server'
// // import { Configuration , OpenAIApi} from 'openai-edge'

// // export const runtime = "edge"

// // const config = new Configuration({
  
// // })

// // import OpenAI from "openai";

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY
// // });




// // export async function POST(req: Request) {
// //   try {
// //     const {messages, chatId } = await req.json()
// //     const _chats = await db.select().from(chats).where(eq(chats.id, chatId))
// //     if(_chats.length != 1) {
// //       return NextResponse.json({"error":"chat not found"}, {status:404})
// //     }    
// //     const lastMessage = messages[messages.length - 1]

// //     const fileKey = _chats[0].fileKey
// //     const context = await getContext(lastMessage.content, fileKey)

// //     const prompt = {
// //       role: "system",
// //       content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
// //       The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
// //       AI is a well-behaved and well-mannered individual.
// //       AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
// //       AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
// //       AI assistant is a big fan of Pinecone and Vercel.
// //       START CONTEXT BLOCK
// //       ${context}
// //       END OF CONTEXT BLOCK
// //       AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
// //       If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
// //       AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
// //       AI assistant will not invent anything that is not drawn directly from the context.
// //       `,
// //     };

// //     const response = await openai.chat.completions.create({
// //       model:'gpt-3.5-turbo',
// //       messages: {
// //         prompt, ...messages.filter((message:Message) => message.role ==="user")
// //       },
// //       stream:true
// //     })
    
// //     const stream = OpenAIStream(response)

// //     return new StreamingTextResponse(stream)
// //   } catch (error) {
    
// //   }
// // }


