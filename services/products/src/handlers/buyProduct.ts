import { QueryCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { withHttpMiddlewares } from '@marketplace/common';
import createHttpError from 'http-errors';
import {
    EventBridgeClient,
    PutEventsCommand,
} from '@aws-sdk/client-eventbridge';

import { type AuthenticatedHttpRequest } from '@marketplace/common/types';
import { AttributeValue } from 'dynamodb-data-types';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
const eventBridgeClient = new EventBridgeClient({});

async function buyProduct(event: AuthenticatedHttpRequest): Promise<any> {
    const id: string = event.pathParameters?.id ?? '';

    const queryResult = await docClient.send(
        new QueryCommand({
            TableName: process.env.PRODUCTS_TABLE_NAME,
            KeyConditionExpression: '#id = :id',
            ExpressionAttributeNames: {
                '#id': 'id',
            },
            ExpressionAttributeValues: { ':id': { S: id } },
            Limit: 1,
            ProjectionExpression: 'id,userId,price',
        }),
    );
    const product = queryResult.Items?.[0];

    if (!product) {
        throw new createHttpError.NotFound('Product not found');
    }

    const input = {
        Entries: [
            {
                Source: 'marketplace.products-service.buy-product',
                DetailType: 'Create order for products.',
                Detail: JSON.stringify({
                    type: 'CREATE_ORDER',
                    buyerId: event.requestContext.authorizer.lambda.user.id,
                    products: [product],
                }),
                EventBusName: process.env.ORDERS_EVENT_BUS_ARN,
            },
        ],
    };
    const command = new PutEventsCommand(input);
    await eventBridgeClient.send(command);

    return AttributeValue.unwrap(product);
}

export const handler = withHttpMiddlewares(buyProduct);
