import {
    QueryCommand,
    DynamoDBClient,
    type AttributeValue as DynamoDBAttributeValue,
} from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    type QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { withHttpMiddlewares } from '@marketplace/common';
import { type AuthenticatedHttpRequest } from '@marketplace/common/types';

import { AttributeValue } from 'dynamodb-data-types';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

interface Product {
    id: string;
    name: string;
    price: number;
}

interface Response {
    data: Array<{
        creationDate: number;
        products: Product[];
    }>;
    lastEvaluatedKey: Record<string, unknown>;
}

async function getOrders(event: AuthenticatedHttpRequest): Promise<Response> {
    const pageSize = +(event?.queryStringParameters?.pageSize ?? 10);

    const queryCommandParams: QueryCommandInput = {
        TableName: process.env.ORDERS_TABLE_NAME,
        ScanIndexForward: false,
        IndexName: 'buyerIdGsi',
        KeyConditionExpression: '#buyerId = :buyerId',
        ExpressionAttributeNames: {
            '#buyerId': 'buyerId',
        },
        ExpressionAttributeValues: {
            ':buyerId': { S: event.requestContext.authorizer.lambda.user.id },
        },
        Limit: pageSize,
    };

    if (event?.queryStringParameters?.lastEvaluatedKey) {
        queryCommandParams.ExclusiveStartKey = AttributeValue.wrap(
            JSON.parse(event.queryStringParameters.lastEvaluatedKey) as Record<
                string,
                unknown
            >,
        );
    }

    const results: Array<Record<string, DynamoDBAttributeValue>> = [];
    let lastEvaluatedKey;
    while (results.length < pageSize) {
        const query = new QueryCommand(queryCommandParams);

        const { Items, LastEvaluatedKey } = await docClient.send(query);
        if (LastEvaluatedKey) {
            queryCommandParams.ExclusiveStartKey = LastEvaluatedKey;
        }

        lastEvaluatedKey = LastEvaluatedKey;

        if (Items) {
            results.push(...Items);
        }

        if (!lastEvaluatedKey) {
            break;
        }
    }

    return {
        data: results.map((order) => ({
            ...AttributeValue.unwrap(order),
            products: AttributeValue.unwrap<{ products: Product[] }>(
                order,
            ).products.map(AttributeValue.unwrap<Product>),
        })),
        lastEvaluatedKey: AttributeValue.unwrap(lastEvaluatedKey),
    };
}

export const handler = withHttpMiddlewares(getOrders);
