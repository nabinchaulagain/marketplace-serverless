export interface ProductListResponse {
    data: Product[];
    lastEvaluatedKey: unknown;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    imageURL: string;
}

export async function getProducts(
    accessToken: string,
    lastEvaluatedKey?: unknown,
): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('pageSize', '5');
    if (lastEvaluatedKey) {
        queryParams.append(
            'lastEvaluatedKey',
            JSON.stringify(lastEvaluatedKey),
        );
    }
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}?${queryParams.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        },
    );
    return await response.json();
}
