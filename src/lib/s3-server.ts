// // import { S3 } from "@aws-sdk/client-s3";
// import { S3 } from "aws-sdk";
// import fs from "fs";
// import { PassThrough } from "stream";

// export async function downloadFromS3(file_key: string): Promise<string> {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const s3 = new S3({
//         region: "us-west-1",
//         credentials: {
//           accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
//           secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
//         },
//       });
//       const params = {
//         Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
//         Key: file_key,
//       };

//       const obj = await s3.getObject(params).promise();
//       const file_name = `/tmp/chatpdf-documents/${Date.now().toString()}.pdf`;

//       // Type assertion to let TypeScript know that obj.Body is a readable stream
//       const bodyStream = obj.Body as PassThrough;

//       // Check if the stream is readable
//       if (bodyStream instanceof require("stream").Readable) {
//         const file = fs.createWriteStream(file_name);
//         file.on("open", function (fd) {
//           // Pipe the body stream to the file
//           bodyStream.pipe(file).on("finish", () => {
//             return resolve(file_name);
//           });
//         });
//       } else {
//         reject(new Error("S3 object body is not a readable stream"));
//       }
//     } catch (error) {
//       console.error(error);
//       reject(error);
//     }
//   });
// }

// // downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");


import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "us-west-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        },
      });
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };

      const obj = await s3.getObject(params).promise();
      const dir = path.join(__dirname, 'tmp', 'chatpdf-documents');
      const file_name = path.join(dir, `${Date.now().toString()}.pdf`);


      

      // Ensure the directory exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Ensure obj.Body is a Buffer or ReadableStream
      if (obj.Body instanceof Buffer) {
        fs.writeFile(file_name, obj.Body, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`File downloaded to ${file_name}`);
            resolve(file_name);
          }
        });
      } else if (obj.Body instanceof Readable) {
        const file = fs.createWriteStream(file_name);
        obj.Body.pipe(file).on("finish", () => {
          resolve(file_name);
        }).on("error", (err) => {
          reject(err);
        });
      } else {
        reject(new Error("S3 object body is not a readable stream or buffer"));
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

// Example usage
// downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");
