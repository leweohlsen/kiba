import type { PayloadAction } from "@reduxjs/toolkit";

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

export type Purchase = {
    id: string;
    buyer_id: string;
    custom_price?: number;
    product_ids: string[];
}

export type EventPayload = Group | Account | Product | Purchase;

export type Transaction = PayloadAction<EventPayload>
