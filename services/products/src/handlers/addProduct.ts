import { type addProductRequestBodySchema } from '@/schemas/product';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { withHttpMiddlewares } from '@marketplace/common';
import { type AuthenticatedHttpRequest } from '@marketplace/common/types';
import { type TypeOf } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import createHttpError from 'http-errors';
import pino from 'pino';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { lookup as lookupContentType } from 'mime-types';

interface Response {
    id: string;
    name: string;
    price: number;
}

const s3Client = new S3Client();
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
const logger = pino();

async function addProduct(event: AuthenticatedHttpRequest): Promise<Response> {
    const requestBody = event.body as unknown as TypeOf<
        typeof addProductRequestBodySchema
    >;

    const document = {
        id: uuidv4(),
        userId: event.requestContext.authorizer.lambda.user.id,
        creationDate: Date.now(),
        inStock: 'true',
        name: requestBody.name,
        price: requestBody.price,
        imageKey: '',
    };
    const imageKey = `${document.id}-${requestBody.image.name}`;
    document.imageKey = imageKey;

    const putCommand = new PutCommand({
        TableName: process.env.PRODUCTS_TABLE_NAME,
        Item: document,
    });

    try {
        await docClient.send(putCommand);
    } catch (error) {
        logger.error(error, 'Unexpected error while adding product');
        throw new createHttpError.InternalServerError(
            JSON.stringify({ error: 'An unexpected error occurred.,' }),
        );
    }

    const putFileCommand = new PutObjectCommand({
        Bucket: process.env.PRODUCT_IMAGES_BUCKET_NAME,
        Key: imageKey,
        Body: Buffer.from(requestBody.image.base64EncodedContent, 'base64'),
        ContentType: lookupContentType(requestBody.image.name) || '',
        ContentDisposition: 'inline',
    });
    await s3Client.send(putFileCommand);

    return document;
}

export const handler = withHttpMiddlewares(addProduct);
