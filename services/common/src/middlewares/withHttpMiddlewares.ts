import zodValidator from '@/middlewares/zodValidator';
import { type AuthenticatedHttpRequest } from '@/types';
import middy, { type MiddyfiedHandler } from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import {
    type APIGatewayProxyHandler,
    type APIGatewayProxyEventV2,
} from 'aws-lambda';
import { type ZodSchema } from 'zod';

function withHttpMiddlewares<T>(
    handler:
        | ((event: APIGatewayProxyEventV2) => unknown)
        | ((event: AuthenticatedHttpRequest) => unknown),
    schema?: ZodSchema,
): MiddyfiedHandler<any, T> {
    const newHandler = middy()
        .use(httpErrorHandler())
        .use(httpEventNormalizer())
        .use(httpJsonBodyParser());

    if (schema !== undefined) {
        newHandler.use(zodValidator(schema));
    }

    return newHandler.handler(handler as unknown as APIGatewayProxyHandler);
}

export default withHttpMiddlewares;
