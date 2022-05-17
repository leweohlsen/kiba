export type Group = {
    id: string;
    name: string;
}

export type Account = {
    id: string;
    name: string;
    groupId: string;
    balance: number;
}

export type Product = {
    id: string;
    name: string;
    price: number;
}

export type ShoppingCart = {
    id: string;
    buyer_id: string;
    custom_price?: number;
    product_ids: string[];
}

export type EventPayload = Group | Account | Product | ShoppingCart;