import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'

export async function downloadfromS3(file_key: string) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        })
        const s3 = new AWS.S3({
            params: {
              Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
            },
            region: 'us-west-1'
        })
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,        
        }
        const obj = await s3.getObject(params).promise()
        // const file_name = `/tmp/pdf-${Date.now()}.pdf`
        // fs.writeFileSync(file_name, obj.Body as Buffer)

        const tempDirPath = 'D:/temp';

        // Check if the D drive exists and create the temp folder if it doesn't exist
        if (!fs.existsSync('D:')) {
            console.error('The D drive does not exist.');
            return null;
        }
        if (!fs.existsSync(tempDirPath)) {
            fs.mkdirSync(tempDirPath, { recursive: true });
        }

        
        // Generate the file name using the temp folder in the D drive
        const file_name = path.join(tempDirPath, `pdf-${Date.now()}.pdf`);
        fs.writeFileSync(file_name, obj.Body as Buffer);
        return file_name
    } catch (error) {
        console.log(error)
        return null
    }
}