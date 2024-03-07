import { type APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda';

export interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
    picture?: string;
}

export interface AuthenticatedHttpRequestContext {
    authorizer: {
        lambda: {
            user: AuthenticatedUser;
        };
    };
}

export type AuthenticatedHttpRequest =
    APIGatewayProxyEventV2WithRequestContext<AuthenticatedHttpRequestContext>;
