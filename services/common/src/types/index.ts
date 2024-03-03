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
