import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";


export async function getContext(query: string, fileKey:string) {

  console.log(query, fileKey)
  const queryEmbeddings = await getEmbeddings(query)
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey)

  const qualifyingDocs = matches.filter((match => match.score && match.score > 0.5))

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  
  // let tempContext = docs.join("\n").substring(0, 3000)

  console.log({docs})
  
  // Increase substring length if desired to include more information.
  return docs.join("\n").substring(0, 3000);
  
  
}

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey:string) {
  const pinecone =  new Pinecone({    
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const index = await pinecone.Index('chatpdf')

  try {
    const namespace = convertToAscii(fileKey)
    const queryResult = await index.namespace(namespace).query({
      topK:5,
      vector: embeddings,
      includeMetadata: true
    })

    let matched_result = queryResult.matches
    console.log({matched_result})
    
    return queryResult.matches || [];
  } catch (error) {
    console.log("Error querying embeddings", error)
    throw error
  }
}