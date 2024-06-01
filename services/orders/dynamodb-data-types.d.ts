declare module 'dynamodb-data-types' {
    export const AttributeValue: {
        unwrap: <T>(items: unknown | undefined) => T;
        wrap: (
            items: Record<string, unknown>,
        ) => Record<string, AttributeValue> | undefined;
    };
}
