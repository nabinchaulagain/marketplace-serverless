import { AuthenticationClient, AuthApiError } from 'auth0';
import { type APIGatewayProxyEventV2 } from 'aws-lambda';
import { loginRequestBodySchema } from '@/schemas/login';

import { withHttpMiddlewares } from '@marketplace/common/middlewares';
import type z from 'zod';
import createHttpError from 'http-errors';

interface ResponseSchema {
    accessToken: string;
    idToken?: string;
}

async function login(event: APIGatewayProxyEventV2): Promise<ResponseSchema> {
    const body = event.body as unknown as z.TypeOf<
        typeof loginRequestBodySchema
    >;

    const auth0 = new AuthenticationClient({
        clientId: process.env.AUTH0_CLIENT_ID,
        domain: process.env.AUTH0_DOMAIN,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
    });

    try {
        const { data: response } = await auth0.oauth.passwordGrant({
            username: body.username,
            password: body.password,
        });

        return {
            accessToken: response.access_token,
            idToken: response.id_token,
        };
    } catch (error) {
        if (error instanceof AuthApiError) {
            throw createHttpError(
                error.statusCode,
                JSON.stringify({ message: error.error_description }),
            );
        }

        throw new createHttpError.InternalServerError(
            JSON.stringify({
                message: 'Something went wrong.',
            }),
        );
    }
}

export const handler = withHttpMiddlewares(login, loginRequestBodySchema);
