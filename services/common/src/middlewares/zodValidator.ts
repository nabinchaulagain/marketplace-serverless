import type middy from '@middy/core';
import {
    type APIGatewayProxyEvent,
    type APIGatewayProxyResult,
} from 'aws-lambda';
import { ZodError, type ZodSchema } from 'zod';

import createHttpError from 'http-errors';
const zodValidator = (
    schema: ZodSchema,
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
    const before: middy.MiddlewareFn<
        APIGatewayProxyEvent,
        APIGatewayProxyResult
    > = async (request): Promise<void> => {
        try {
            request.event.body = schema.parse(request.event.body);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new createHttpError.BadRequest(
                    JSON.stringify(error.flatten()),
                );
            }
        }
    };

    return {
        before,
        after: () => {},
    };
};

export default zodValidator;
