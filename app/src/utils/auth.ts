import {
    AccessTokenError,
    AccessTokenErrorCode,
    getAccessToken as getAuth0AccesToken,
} from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export async function getAccessToken(): Promise<string> {
    let accessToken: string | undefined;
    try {
        accessToken = (await getAuth0AccesToken()).accessToken;

        if (!accessToken) {
            throw new AccessTokenError(
                AccessTokenErrorCode.MISSING_ACCESS_TOKEN,
                'No access token.',
            );
        }
        return accessToken;
    } catch (error) {
        if (error instanceof AccessTokenError) {
            redirect('/api/auth/logout');
        }
        throw error;
    }
}
