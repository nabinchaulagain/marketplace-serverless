import {
    QueryCommand,
    DynamoDBClient,
    type AttributeValue as DynamoDBAttributeValue,
} from '@aws-sdk/client-dynamodb';
import { withHttpMiddlewares } from '@marketplace/common';
import {
    DynamoDBDocumentClient,
    type QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { AttributeValue } from 'dynamodb-data-types';
import { type ProductResponse, type Product } from '@/types/product';
import { type AuthenticatedHttpRequest } from '@marketplace/common/types';
import { S3Client } from '@aws-sdk/client-s3';
import { getPresignedURL } from '@/utils/file';

const s3Client = new S3Client();
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

interface Response {
    data: ProductResponse[];
    lastEvaluatedKey: Record<string, unknown>;
}

async function getProducts(event: AuthenticatedHttpRequest): Promise<Response> {
    const pageSize = +(event?.queryStringParameters?.pageSize ?? 10);

    const queryCommandParams: QueryCommandInput = {
        IndexName: 'inStockCreationDateGsi',
        TableName: process.env.PRODUCTS_TABLE_NAME,
        ScanIndexForward: false,
        KeyConditionExpression: '#inStock = :inStock',
        ExpressionAttributeNames: {
            '#inStock': 'inStock',
            '#userId': 'userId',
        },
        FilterExpression: '#userId <> :userId',
        ExpressionAttributeValues: {
            ':inStock': { S: 'true' },
            ':userId': { S: event.requestContext.authorizer.lambda.user.id },
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

    const products = results?.map(AttributeValue.unwrap<Product>);
    const productImages = await Promise.all(
        products.map(
            async ({ imageKey }) =>
                await getPresignedURL({ key: imageKey ?? '', s3Client }),
        ),
    );

    return {
        data: products.map((product, index) => ({
            ...product,
            imageUrl: productImages[index] ?? '',
        })),

        lastEvaluatedKey: AttributeValue.unwrap(lastEvaluatedKey),
    };
}

export const handler = withHttpMiddlewares(getProducts);
