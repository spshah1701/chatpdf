# Project Documentation

## Project Overview

This project is a web application built using Next.js, a popular React framework. The application is designed to facilitate chat interactions with PDF documents. Users can upload PDF files, and the application allows them to chat with an AI assistant to extract and interact with the content of the PDFs.

## Key Features

-   Chat with PDF: Users can upload PDF documents and interact with an AI assistant to ask questions about the content of the PDFs.
-   User Authentication: The application uses Clerk for user authentication, ensuring secure access to the chat functionalities.
-   Subscription Management: Users can manage their subscriptions to access premium features.
-   Real-time Chat: The chat interface is designed to provide real-time responses from the AI assistant.
-   PDF Viewer: Integrated PDF viewer to display the content of the uploaded PDFs.
-   Chat Sidebar: A sidebar to navigate between different chat sessions and manage them efficiently.

## Technical Stack

-   Frontend: Built with Next.js and React.
-   Styling: Tailwind CSS for styling the application.
-   Backend: Uses Next.js API routes for server-side logic.
-   ORM: Drizzle ORM for database interactions.
-   Authentication: Clerk for user authentication.
-   NeonDB: Used as a serverless PostgreSQL database.
-   PineconeDB: Used for storing and querying vector embeddings.
-   AI Integration: OpenAI's GPT-3.5-turbo model for generating responses in the chat.
-   Subscription Management: Integration with Stripe for handling subscriptions.

## Motivation

The primary motivation behind creating this project was to provide a seamless way for users to interact with the content of PDF documents using AI. Traditional methods of extracting information from PDFs can be cumbersome and time-consuming. By integrating AI, users can quickly get answers to their questions and interact with the content in a more intuitive and efficient manner. Various web platforms using LLM models answer user queries based on data the model was trained on. So, this web application aims to provide context to the AI agent by:

-   Uploading PDF Documents: Allowing users to upload their own PDF documents to the platform.
-   Generating Embeddings: Using OpenAI's GPT-3.5-turbo model to generate embeddings for the content of the uploaded PDFs.
-   Storing Embeddings in PineconeDB: Storing these embeddings in PineconeDB for efficient retrieval.
-   Retrieval-Augmented Generation (RAG): Implementing RAG to retrieve relevant segments from the stored embeddings and augmenting the user's query with this context.
-   Providing Accurate Responses: Using the augmented query to generate accurate and contextually relevant responses from the AI, ensuring that the answers are based on the specific content of the uploaded PDFs.

## Approach

1. When a user uploads a file, it is then uploaded to an S3 bucket using the AWS SDK.
2. Then the file is split into segments and embeddings are generated for each segment.
3. The embeddings are then uploaded to Pinecone for storage and future querying.
4. When a user enters a query and the most relevant segments from Pinecone are retrieved and concatenated to form a context that is used to generate a response.
5. The context generated from the relevant segments is used to form a prompt for the ChatGPT API. The prompt is sent to the ChatGPT API, which generates a response based on the provided context and query. The response is then returned to the user.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

```
git clone https://github.com/spshah1701/chatpdf.git
```

2. Install dependencies:

```
npm install
# or
yarn install
```

3. Run the development server:

```
npm run dev
# or
yarn dev
```

4. Setup environment variables:

Add the following environment variables to use the APIs.

**Clerk API Keys** \
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
CLERK_SECRET_KEY \
CLERK_SIGN_IN_URL=/sign-in \
CLERK_SIGN_UP_URL=/sign-up \
CLERK_SIGN_IN_FORCE_REDIRECT_URL=/ \
CLERK_SIGN_UP_FORCE_REDIRECT_URL=/ \

**NeonDB** \
DATABASE_URL=postgresql://<...> \

**AWS** \
NEXT_PUBLIC_AWS_ACCESS_KEY \
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY \
NEXT_PUBLIC_S3_BUCKET_NAME \

**PineconeDB** \
PINECONE_API_KEY \

**OpenAI** \
OPENAI_API_KEY \

**Stripe** \
STRIPE_API_KEY \
STRIPE_WEBHOOK_SIGNING_SECRET \
NEXT_BASE_URL=http://localhost:3000 \

5. Open the application:

Open http://localhost:3000 with your browser to see the result.
