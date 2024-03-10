import { OpenAIApi, Configuration } from 'openai-edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export async function getEmbeddings(text: string) {
    try {
        
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, ' ')
        })

        const result = await response.json()
        
        // return result.data[0].embedding as number[]
        // Check if the data array exists and has at least one element
        if (result.data && result.data.length > 0) {
            // Access the first element's embedding
            return result.data[0].embedding as number[];
        } else {
            // Handle the case where the data array is missing or empty
            console.error('The response does not contain any embeddings.');
            throw new Error('The response does not contain any embeddings.');
        }
    } catch (error) {
        console.log("Error calling openAI Embeddings API", error)
        throw error
    }
}
