import zodValidator from '@/middlewares/zodValidator';
import middy, { type MiddyfiedHandler } from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { type APIGatewayProxyEventV2 } from 'aws-lambda';
import { type ZodSchema } from 'zod';

function withHttpMiddlewares<T>(
    handler: (event: APIGatewayProxyEventV2) => unknown,
    schema: ZodSchema,
): MiddyfiedHandler<any, T> {
    return middy()
        .use(httpErrorHandler())
        .use(httpEventNormalizer())
        .use(httpJsonBodyParser())
        .use(zodValidator(schema))
        .handler(handler);
}

export default withHttpMiddlewares;
