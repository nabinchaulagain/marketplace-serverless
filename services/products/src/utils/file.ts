import { GetObjectCommand, type S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function getPresignedURL({
    key,
    s3Client,
}: {
    key: string;
    s3Client: S3Client;
}): Promise<string> {
    const getCommand = new GetObjectCommand({
        Bucket: process.env.PRODUCT_IMAGES_BUCKET_NAME,
        Key: key,
    });
    return await getSignedUrl(s3Client, getCommand, {
        expiresIn: 3600,
    });
}
