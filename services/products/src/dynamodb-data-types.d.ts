declare module 'dynamodb-data-types' {
    export const AttributeValue: {
        unwrap: <T>(items: Record<string, AttributeValue> | undefined) => T;
    };
}
