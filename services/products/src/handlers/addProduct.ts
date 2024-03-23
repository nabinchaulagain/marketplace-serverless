import { addProductRequestBodySchema } from '@/schemas/product';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { withHttpMiddlewares } from '@marketplace/common';
import { type AuthenticatedHttpRequest } from '@marketplace/common/types';
import { type TypeOf } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import createHttpError from 'http-errors';
import pino from 'pino';

interface Response extends TypeOf<typeof addProductRequestBodySchema> {
    id: string;
}

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
        ...requestBody,
    };

    const putCommand = new PutCommand({
        TableName: process.env.PRODUCTS_TABLE_NAME,
        Item: document,
    });

    try {
        await docClient.send(putCommand);

        return document;
    } catch (error) {
        logger.error(error, 'Unexpected error while adding product');
        throw new createHttpError.InternalServerError(
            JSON.stringify({ error: 'An unexpected error occurred.,' }),
        );
    }
}

export const handler = withHttpMiddlewares(
    addProduct,
    addProductRequestBodySchema,
);
