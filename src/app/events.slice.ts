import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Group, Account, Product, Purchase, EventPayload } from "./types";
import { RootState } from "./store";

export interface EventsState {
  groups: Record<string, Group>;
  accounts: Record<string, Account>;
  products: Record<string, Product>;
  transactions: PayloadAction<EventPayload>[];
}

export const initialState: EventsState = {
  groups: {},
  accounts: {},
  products: {},
  transactions: [],
};

export const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups[action.payload.id] = { ...action.payload };
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts[action.payload.id] = { ...action.payload };
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products[action.payload.id] = { ...action.payload };
    },
    checkout: (state, action: PayloadAction<Purchase>) => {
      const buyer = state.accounts[action.payload.buyer_id];
      action.payload.product_ids.forEach((product_id) => {
        const product = state.products[product_id];
        buyer.balance -= product.price;
      });
    },
    appendTransaction: (
      state,
      action: PayloadAction<PayloadAction<EventPayload>>
    ) => {
      state.transactions.push(action.payload);
    },
  },
});

export const { addGroup, addAccount, addProduct, checkout, appendTransaction } =
  eventSlice.actions;

export const selectAccounts = (state: RootState) =>
  Object.values(state.events.accounts);
export const selectGroups = (state: RootState) =>
  Object.values(state.events.groups);
export const selectTransactions = (state: RootState) =>
  state.events.transactions;

export default eventSlice.reducer;
