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
    schema: ZodSchema,
): MiddyfiedHandler<any, T> {
    return middy()
        .use(httpErrorHandler())
        .use(httpEventNormalizer())
        .use(httpJsonBodyParser())
        .use(zodValidator(schema))
        .handler(handler as unknown as APIGatewayProxyHandler);
}

export default withHttpMiddlewares;
