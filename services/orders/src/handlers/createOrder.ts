import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

import { type SQSEvent, type SQSRecord } from 'aws-lambda';
import pino from 'pino';

import { v4 as uuidv4 } from 'uuid';

interface InputEventSchema {
    products: [{ id: string; userId: string; price: number; name: string }];
    buyerId: string;
}

const logger = pino();

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

async function createOrder(event: SQSEvent): Promise<void> {
    const orders: InputEventSchema[] = event.Records.map(
        (record: SQSRecord) => JSON.parse(record.body).detail,
    );

    for (const order of orders) {
        const { buyerId, products } = order;
        const document = {
            id: uuidv4(),
            buyerId,
            creationDate: Date.now(),
            products,
        };
        const putCommand = new PutCommand({
            TableName: process.env.ORDERS_TABLE_NAME,
            Item: document,
        });

        logger.info(
            `Order created for ${JSON.stringify(products)} by ${buyerId}`,
        );

        await docClient.send(putCommand);
    }
}

export const handler = createOrder;
