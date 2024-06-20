// "use client";
// import React from "react";
// import { Input } from "./ui/input";
// import { useChat } from "ai/react";
// import { Button } from "./ui/button";
// import { Send } from "lucide-react";

// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { Message } from "ai";
// import MessageList from "./MessageList";

// type Props = { chatId: number };

// const ChatComponent = ({ chatId }: Props) => {
//   // const { data, isLoading } = useQuery({
//   //   queryKey: ["chat", chatId],
//   //   queryFn: async () => {
//   //     const response = await axios.post<Message[]>("/api/get-messages", {
//   //       chatId,
//   //     });
//   //     return response.data;
//   //   },
//   // });

//   const { input, handleInputChange, handleSubmit, messages } = useChat({
//     api: "/api/chat",
//     body: {
//       chatId,
//     },
//     // initialMessages: data || [],
//   });
  
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
//       <MessageList messages={messages}  />

//       <form
//         onSubmit={handleSubmit}
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


// -------------------better-working---------------------

// "use client";
// import React, { useEffect } from "react";
// import { Input } from "./ui/input";
// import { Message, useChat } from "ai/react";
// import { Button } from "./ui/button";
// import { Send } from "lucide-react";
// import MessageList from "./MessageList";

// type Props = { chatId: number };

// const ChatComponent = ({ chatId }: Props) => {
//   const { input, handleInputChange, handleSubmit, messages, setMessages } = useChat({
//     api: "/api/chat",
//     body: {
//       chatId,
//     },
//     onResponse: async (response) => {
//       const data = await response.json();
//       const assistantMessage: Message = {
//         id: Date.now().toString(),
//         role: "assistant",
//         content: data.data,        
//       };

      
//       setMessages([...messages, assistantMessage]);
//     }
//     // initialMessages: data || [],
//   });

//   const handleSubmit = () => {
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: "user",
//       content: data.data,        
//     };
//     setMessages([...messages, ]);
//   }

//   useEffect(() => {
    
//     const messageContainer = document.getElementById("message-container");
    
//     if (messageContainer) {
//       messageContainer.scrollTo({
//         top: messageContainer.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//     console.log("Messages updated", messages)
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
//         onSubmit={handleSubmit}
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


"use client";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { Message, useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { input, handleInputChange, messages, setMessages, setInput } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    // onResponse: async (response) => {
    //   const data = await response.json();
    //   const assistantMessage: Message = {
    //     id: Date.now().toString(),
    //     role: "assistant",
    //     content: data.data,
    //   };

    //   setMessages([...messages, assistantMessage]);
    // },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages([...messages, userMessage]);
    console.log("input", input)
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          chatId,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.data,
      };

      setMessages([...messages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
    console.log("Messages updated", messages);
  }, [messages]);

  return (
    <div className="relative max-h-screen overflow-scroll" id="message-container">
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* message list */}
      <MessageList messages={messages} />

      <form onSubmit={handleSubmit} className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white">
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button type="submit" className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;




