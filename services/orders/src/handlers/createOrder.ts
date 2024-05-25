import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

import { v4 as uuidv4 } from 'uuid';

interface InputEventSchema {
    detail: {
        products: [{ id: string; userId: string; price: number; name: string }];
        buyerId: string;
    };
}

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

async function createOrder(event: InputEventSchema): Promise<any> {
    const { products, buyerId } = event.detail;
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

    await docClient.send(putCommand);

    return document;
}

export const handler = createOrder;
