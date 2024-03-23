import pino from 'pino';
import { QueryCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { withHttpMiddlewares } from '@marketplace/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { AttributeValue } from 'dynamodb-data-types';
import { type Product } from '@/types/product';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
const logger = pino();

interface Response {
    data: Product[];
}

async function getProducts(): Promise<Response> {
    const query = new QueryCommand({
        IndexName: 'inStockCreationDateGsi',
        TableName: process.env.PRODUCTS_TABLE_NAME,
        ScanIndexForward: false,
        KeyConditionExpression: 'inStock = :inStock',
        ExpressionAttributeValues: {
            ':inStock': { S: 'true' },
        },
    });

    const result = await docClient.send(query);
    logger.debug(result);

    return { data: result.Items?.map(AttributeValue.unwrap<Product>) ?? [] };
}

export const handler = withHttpMiddlewares(getProducts);
