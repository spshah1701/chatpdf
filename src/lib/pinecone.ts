import { Pinecone, PineconeRecord} from '@pinecone-database/pinecone'
import { downloadfromS3 } from './s3-server';
import { PDFLoader} from 'langchain/document_loaders/fs/pdf'
let md5 = require('md5');
import { Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';
import { convertToAscii } from './utils';

import { Vector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import utils from '@pinecone-database/pinecone' 

// let pinecone: Pinecone | null = null;

// export const getPineconeClient = async () => {
//     if(!pinecone) {
//         pinecone = new Pinecone({
//             apiKey: 'process.env.PINECONE_API_KEY'
//         })
//         return pinecone;
//     }
// }

export const getPineconeClient = () => {
    return new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
};

type PDFPage = {
    pageContent: string,
    metadata: {
        loc: {pageNumber: number}
    }
}


export async function loadS3IntoPinecone(fileKey:string) {
    //1. Obtain the PDF. Download and read from PDF
    console.log('Downloading S3 into file system! File Key: ', fileKey)
    const file_name = await downloadfromS3(fileKey);
    if(!file_name){
        throw new Error("Error downloading from S3!")
    }
    const loader = new PDFLoader(file_name)
    const pages = (await loader.load()) as PDFPage[]

    // 2. Split and segment the PDF
    const documents = await Promise.all(pages.map(prepareDocument))

    // 3. Vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument))

    // 4. Upload the vectors to PineconeDB
    // const client = await getPineconeClient()
    // const pineconeIndex =  client.Index('chatpdf')    

    // console.log(pineconeIndex)
    // console.log("Inserting vectors into Pinecone")

    // const namespace = convertToAscii(fileKey)
    // utils.chunkedUpsert(pineconeIndex, vectors, namespace, 10)
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("chatpdf");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
  
    console.log("inserting vectors into pinecone");
    await namespace.upsert(vectors);    

    return documents[0];

}

async function embedDocument(doc: Document) {
    try {
      const embeddings = await getEmbeddings(doc.pageContent);
      const hash = md5(doc.pageContent);
  
      return {
        id: hash,
        values: embeddings,
        metadata: {
          text: doc.metadata.text,
          pageNumber: doc.metadata.pageNumber,
        },
      } as PineconeRecord;

    } catch (error) {
      console.log("error embedding document", error);
      throw error;
    }
  }


export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, "");
    // OR USE THIS? pageContent = pageContent.replace(/\n/g, "");
    
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
          text: truncateStringByBytes(pageContent, 36000),
        },
      }),
    ]);
    return docs;
  }