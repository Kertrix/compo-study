import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_API_URL ?? "",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  },
});

export async function uploadFileToS3(params: {
  file: File;
  prefix: string;
  filename?: string;
}) {
  const fileBuffer = await params.file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  const fileExtension = params.file.name.split(".").pop();
  const uniqueFilename = `${params.prefix}/${params.filename ?? Date.now()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME ?? "",
    Key: uniqueFilename,
    Body: buffer,
    ContentType: params.file.type,
  });

  try {
    await s3Client.send(command);

    return `${process.env.R2_URL}/${uniqueFilename}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}
