export interface Product {
    id: string;
    name: string;
    price: number;
    imageKey: string;
}

export interface ProductResponse {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
}
