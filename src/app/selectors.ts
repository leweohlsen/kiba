import { createSelector } from "@reduxjs/toolkit";
import { selectAccounts, selectGroups, selectProducts, selectShoppingCart } from "./events.slice";
import { selectCurrentGroup } from "./ui.slice";

export const selectCurrentGroupAccounts = createSelector(
  [selectAccounts, selectCurrentGroup],
  (accounts, currentGroup) => {
    return accounts.filter(a => a.groupId === currentGroup);
  }
);

export const selectCurrentTotal = createSelector(
  [selectShoppingCart, selectProducts],
  (shoppingCart, products) => {
    return Object.entries(shoppingCart).reduce((total, [productId, quantity]) => {
      return total += products.find(p => p.id === productId).price * quantity;
    }, 0);
  }
)
