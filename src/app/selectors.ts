import { createSelector } from "@reduxjs/toolkit";
import { selectAccounts, selectGroups, selectProducts, selectShoppingCart, selectTransactions } from "./events.slice";
import type {
    HourlyDemand,
    KioskSessionStats,
    KioskStats,
    Purchase,
    StatsTimePeriod,
    StatsTimePeriodOption,
    TopProductSale,
    TopShopper,
    Transaction,
} from "./types";
import { selectCurrentGroup } from "./ui.slice";
import { calculatePurchaseTotal } from "./util";
import type { RootState } from "./store";

export const selectCurrentGroupAccounts = createSelector(
    [selectAccounts, selectCurrentGroup],
    (accounts, currentGroup) => {
        return Object.values(accounts).filter((a) => a.groupId === currentGroup);
    }
);

export const selectActiveAccounts = createSelector([selectAccounts], (accounts) => {
    return Object.values(accounts).filter((a) => !a.isDeleted);
});

export const selectActiveProducts = createSelector([selectProducts], (products) => {
    return Object.values(products).filter((p) => !p.isDeleted);
});

export const selectCartTotal = createSelector([selectShoppingCart, selectProducts], (shoppingCart, products) => {
    return calculatePurchaseTotal(shoppingCart, products);
});

export const selectNumAccounts = createSelector([selectActiveAccounts], (activeAccounts) => {
    return activeAccounts.length;
});

export const selectTotalBankBalance = createSelector([selectAccounts], (accounts) => {
    return Object.values(accounts).reduce((total, account) => total + account.balance, 0.0);
});

export const selectCheckoutTransactions = createSelector([selectTransactions], (transactions) => {
    return transactions.filter((t) => t.type === "events/checkout") as Transaction<Purchase>[];
});

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const KIOSK_SESSION_GAP_MS = 3 * HOUR_MS;

export const statsTimePeriodOptions: StatsTimePeriodOption[] = [
    { label: "24 Stunden", value: "24h", ms: DAY_MS },
    { label: "7 Tage", value: "7d", ms: 7 * DAY_MS },
    { label: "30 Tage", value: "30d", ms: 30 * DAY_MS },
    { label: "Alle", value: "all" },
];

export const getCheckoutTotal = (
    transaction: Transaction<Purchase>,
    products: ReturnType<typeof selectProducts>
) => {
    return transaction.payload.customPrice ?? calculatePurchaseTotal(transaction.payload.shoppingCart, products);
};

const getSelectedStatsPeriod = (timePeriod: StatsTimePeriod) => {
    return statsTimePeriodOptions.find((option) => option.value === timePeriod) || statsTimePeriodOptions[0];
};

const countItems = (shoppingCart: Record<string, number>) => {
    return Object.values(shoppingCart).reduce((total, quantity) => total + quantity, 0);
};

const filterCheckoutTransactionsForPeriod = (
    checkoutTransactions: Transaction<Purchase>[],
    timePeriod: StatsTimePeriod
) => {
    const selectedPeriod = getSelectedStatsPeriod(timePeriod);
    const periodStart = selectedPeriod.ms ? Date.now() - selectedPeriod.ms : 0;

    return checkoutTransactions
        .filter((transaction) => transaction.timestamp >= periodStart)
        .sort((a, b) => a.timestamp - b.timestamp);
};

const getKioskSessions = (
    checkoutTransactions: Transaction<Purchase>[],
    products: ReturnType<typeof selectProducts>
) => {
    const sessions: KioskSessionStats[] = [];

    checkoutTransactions.forEach((transaction) => {
        const previousSession = sessions[sessions.length - 1];
        const transactionTotal = getCheckoutTotal(transaction, products);
        const transactionItems = countItems(transaction.payload.shoppingCart);

        if (!previousSession || transaction.timestamp - previousSession.endTimestamp > KIOSK_SESSION_GAP_MS) {
            sessions.push({
                id: transaction.payload.id,
                label: new Date(transaction.timestamp).toLocaleString("de-DE", {
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "2-digit",
                }),
                startTimestamp: transaction.timestamp,
                endTimestamp: transaction.timestamp,
                purchases: 1,
                itemsSold: transactionItems,
                turnover: transactionTotal,
            });
            return;
        }

        previousSession.endTimestamp = transaction.timestamp;
        previousSession.purchases += 1;
        previousSession.itemsSold += transactionItems;
        previousSession.turnover += transactionTotal;
    });

    return sessions;
};

const getKioskStats = (
    timePeriod: StatsTimePeriod,
    checkoutTransactions: Transaction<Purchase>[],
    accounts: ReturnType<typeof selectAccounts>,
    products: ReturnType<typeof selectProducts>
): KioskStats => {
    const selectedPeriod = getSelectedStatsPeriod(timePeriod);
    const filteredCheckouts = filterCheckoutTransactionsForPeriod(checkoutTransactions, timePeriod);
    const sessions = getKioskSessions(filteredCheckouts, products);
    const salesByProduct = new Map<string, TopProductSale>();
    const shoppersByAccount = new Map<string, TopShopper>();
    const itemsByHour = new Map<number, number>();
    let totalTurnover = 0;
    let itemsSold = 0;

    filteredCheckouts.forEach((transaction) => {
        const transactionTotal = getCheckoutTotal(transaction, products);
        const account = accounts[transaction.payload.customerId];
        const hour = new Date(transaction.timestamp).getHours();

        totalTurnover += transactionTotal;

        if (account) {
            const shopper = shoppersByAccount.get(account.id) || {
                id: account.id,
                name: account.name,
                purchases: 0,
                turnover: 0,
            };

            shopper.purchases += 1;
            shopper.turnover += transactionTotal;
            shoppersByAccount.set(account.id, shopper);
        }

        Object.entries(transaction.payload.shoppingCart).forEach(([productId, quantity]) => {
            const product = products[productId];
            if (!product) return;

            const productSales = salesByProduct.get(productId) || {
                id: productId,
                name: product.name,
                quantity: 0,
                turnover: 0,
            };

            itemsSold += quantity;
            productSales.quantity += quantity;
            productSales.turnover += product.price * quantity;
            salesByProduct.set(productId, productSales);
            itemsByHour.set(hour, (itemsByHour.get(hour) || 0) + quantity);
        });
    });

    const hourlyDemand: HourlyDemand[] = Array.from({ length: 24 }, (_value, hour) => ({
        id: String(hour),
        label: `${hour.toString().padStart(2, "0")}:00`,
        itemsSold: itemsByHour.get(hour) || 0,
    })).sort((a, b) => b.itemsSold - a.itemsSold);

    const topProducts = Array.from(salesByProduct.values()).sort(
        (a, b) => b.quantity - a.quantity || b.turnover - a.turnover
    );
    const topShoppers = Array.from(shoppersByAccount.values()).sort(
        (a, b) => b.turnover - a.turnover || b.purchases - a.purchases
    );

    return {
        averageBasket: filteredCheckouts.length ? totalTurnover / filteredCheckouts.length : 0,
        hourlyDemand,
        itemsSold,
        purchases: filteredCheckouts.length,
        selectedPeriod,
        sessions,
        topProducts,
        topShoppers,
        totalTurnover,
    };
};

export const makeSelectCheckoutTransactionsForPeriod = (timePeriod: StatsTimePeriod) =>
    createSelector([selectCheckoutTransactions], (checkoutTransactions) => {
        return filterCheckoutTransactionsForPeriod(checkoutTransactions, timePeriod);
    });

export const makeSelectKioskSessionsForPeriod = (timePeriod: StatsTimePeriod) =>
    createSelector([selectCheckoutTransactions, selectProducts], (checkoutTransactions, products) => {
        return getKioskSessions(filterCheckoutTransactionsForPeriod(checkoutTransactions, timePeriod), products);
    });

export const makeSelectKioskStatsForPeriod = (timePeriod: StatsTimePeriod) =>
    createSelector([selectCheckoutTransactions, selectAccounts, selectProducts], (checkoutTransactions, accounts, products) => {
        return getKioskStats(timePeriod, checkoutTransactions, accounts, products);
    });

export const selectCheckoutTransactionsForPeriod = (state: RootState, timePeriod: StatsTimePeriod) => {
    return filterCheckoutTransactionsForPeriod(selectCheckoutTransactions(state), timePeriod);
};

export const selectKioskSessionsForPeriod = (state: RootState, timePeriod: StatsTimePeriod) => {
    return getKioskSessions(selectCheckoutTransactionsForPeriod(state, timePeriod), selectProducts(state));
};

export const selectKioskStatsForPeriod = (state: RootState, timePeriod: StatsTimePeriod) => {
    return getKioskStats(timePeriod, selectCheckoutTransactions(state), selectAccounts(state), selectProducts(state));
};
