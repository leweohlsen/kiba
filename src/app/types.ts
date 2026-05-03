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

export type DailySales = {
    timestamp: number;
    sales: number;
};

export type Series = {
    id: string;
    label: string;
    data: DailySales[];
};

export type Stats = {
    totalTurnover: number;
    dailyCategorySales: Series[];
};

export type TopProductSale = {
    id: string;
    name: string;
    quantity: number;
    turnover: number;
};

export type TopShopper = {
    id: string;
    name: string;
    purchases: number;
    turnover: number;
};

export type StatsTimePeriod = "24h" | "7d" | "30d" | "all";

export type StatsTimePeriodOption = {
    label: string;
    value: StatsTimePeriod;
    ms?: number;
};

export type HourlyDemand = {
    id: string;
    label: string;
    itemsSold: number;
};

export type KioskSessionStats = {
    id: string;
    label: string;
    startTimestamp: number;
    endTimestamp: number;
    purchases: number;
    itemsSold: number;
    turnover: number;
};

export type KioskStats = {
    averageBasket: number;
    hourlyDemand: HourlyDemand[];
    itemsSold: number;
    purchases: number;
    selectedPeriod: StatsTimePeriodOption;
    sessions: KioskSessionStats[];
    topProducts: TopProductSale[];
    topShoppers: TopShopper[];
    totalTurnover: number;
};
