import { type AuthenticatedUser } from '@marketplace/common/types';
import { UserInfoClient } from 'auth0';
import {
    type APIGatewayRequestAuthorizerEventV2,
    type APIGatewayAuthorizerResult,
} from 'aws-lambda';

async function authorizer(
    event: APIGatewayRequestAuthorizerEventV2,
): Promise<any> {
    const accessToken = event.headers?.authorization?.split(' ')[1] ?? '';

    const userInfoClient = new UserInfoClient({
        domain: process.env.AUTH0_DOMAIN,
    });

    if (accessToken === '') {
        return generatePolicy({
            isAuthorized: false,
            routeArn: event.routeArn,
        });
    }

    const { data: userInfo } = await userInfoClient.getUserInfo(accessToken);

    return generatePolicy({
        isAuthorized: true,
        routeArn: event.routeArn,
        userInfo: {
            id: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
        },
    });
}

function generatePolicy({
    isAuthorized,
    routeArn,
    userInfo,
}: {
    isAuthorized: boolean;
    routeArn: string;
    userInfo?: AuthenticatedUser;
}): APIGatewayAuthorizerResult {
    return {
        principalId: userInfo?.id ?? 'unauthorized',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: isAuthorized ? 'Allow' : 'Deny',
                    Resource: routeArn,
                },
            ],
        },
        context: {
            user: userInfo as unknown as string,
        },
    };
}

export const handler = authorizer;
