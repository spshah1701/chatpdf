// // For S3 Configuration
// // import S3 from aws-sdk
// import AWS from 'aws-sdk'

// export async function uploadToS3(
//   file: File
// ): Promise<{ file_key: string; file_name: string }> {
//   return new Promise((resolve, reject) => {
//     try {
//       const s3 = new S3({
//         region: "us-west-1",
//         credentials: {
//           accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
//           secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
//         },
//       });

//       const file_key =
//         "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

//       const params = {
//         Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
//         Key: file_key,
//         Body: file,
//       };

//       s3.putObject(
//         params,
//         (err: any, data: PutObjectCommandOutput | undefined) => {
//           return resolve({
//             file_key,
//             file_name: file.name,
//           });
//         }
//       );
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// export function getS3Url(file_key: string) {
//   const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-west-1.amazonaws.com/${file_key}`;
//   return url;
// }

import AWS from 'aws-sdk'

export async function uploadToS3(file: File) {
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

    const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-')

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file
    }

    const upload = s3.putObject(params).on('httpUploadProgress', evt => {
      console.log("Uploading to S3...", parseInt(((evt.loaded*100)/evt.total).toString()))
    }).promise()

    await upload.then(data => {
      console.log("Successfully uploaded to S3", file_key)
    })

    return Promise.resolve({
      file_key,
      file_name: file.name
    })

  } catch (error) {
    
  }
}


export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-west-1.amazonaws.com/${file_key}`;
  return url;
}