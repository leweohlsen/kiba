import type { PayloadAction } from "@reduxjs/toolkit";

export type Group = {
    id: string;
    name: string;
    isDeleted: boolean;
};

export type Category = {
    id: string;
    name: string;
    isDeleted: boolean;
};

export type Account = {
    id: string;
    name: string;
    groupId?: string;
    balance: number;
    isDeleted: boolean;
};

export type Product = {
    id: string;
    ean: number;
    name: string;
    categoryId: string;
    price: number;
    image: string;
    isDeleted: boolean;
};

export type Purchase = {
    id: string;
    customerId: string;
    customPrice?: number;
    shoppingCart: Record<string, number>;
};

export interface Transaction<P> extends PayloadAction<P> {
    timestamp: number;
}

export type Stats = {
    totalTurnover: number;
}