import { createSelector } from "@reduxjs/toolkit";
import { selectAccounts, selectGroups, selectProducts, selectShoppingCart, selectTransactions } from "./events.slice";
import { Purchase, Transaction } from "./types";
import { selectCurrentGroup } from "./ui.slice";
import { calculatePurchaseTotal } from "./util";

export const selectCurrentGroupAccounts = createSelector(
    [selectAccounts, selectCurrentGroup],
    (accounts, currentGroup) => {
        return accounts.filter((a) => a.groupId === currentGroup);
    }
);

export const selectCartTotal = createSelector([selectShoppingCart, selectProducts], (shoppingCart, products) => {
    return calculatePurchaseTotal(shoppingCart, products);
});

export const selectNumAccounts = createSelector([selectAccounts], (accounts) => {
    return accounts.length;
});

export const selectTotalBankBalance = createSelector([selectAccounts], (accounts) => {
    return Object.values(accounts).reduce((total, account) => total + account.balance, 0.0);
});

export const selectCheckoutTransactions = createSelector([selectTransactions], (transactions) => {
    return transactions.filter((t) => t.type === "events/checkout") as Transaction<Purchase>[];
});
