import type { PayloadAction } from "@reduxjs/toolkit";
import type { MenuProps } from "antd";

export type Group = {
    id: string;
    name: string;
};

export type Category = {
    id: string;
    name: string;
};

export type Account = {
    id: string;
    name: string;
    groupId: string;
    balance: number;
};

export type Product = {
    id: string;
    name: string;
    categoryId: string;
    price: number;
    image: string;
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
