import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Group, Account, Product, Purchase, EventPayload } from "./types";
import { RootState } from "./store";

export interface EventsState {
  groups: Record<string, Group>;
  accounts: Record<string, Account>;
  products: Record<string, Product>;
  events: PayloadAction<EventPayload>[];
}

export const initialState: EventsState = {
  groups: {
    g0: {id: "g0", name: "Zelt 1"},
    g1: {id: "g1", name: "Zelt 2"}
  },
  accounts: {
    a0: { id: "a0", name: "Hein Blöd", balance: 3.57, groupId: "g0" },
  },
  products: {},
  events: [],
};

export const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups[action.payload.id] = action.payload;
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts[action.payload.id] = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products[action.payload.id] = action.payload;
    },
    checkout: (state, action: PayloadAction<Purchase>) => {
      const buyer = state.accounts[action.payload.buyer_id];
      action.payload.product_ids.forEach((product_id) => {
        const product = state.products[product_id];
        buyer.balance -= product.price;
      });
    },
    appendEvent: (
      state,
      action: PayloadAction<PayloadAction<EventPayload>>
    ) => {
      state.events.push(action.payload);
    },
  },
});

export const { addGroup, addAccount, addProduct, checkout, appendEvent } =
  eventSlice.actions;

export const selectAccounts = (state: RootState) =>
  Object.values(state.events.accounts);
  export const selectGroups = (state: RootState) =>
  Object.values(state.events.groups);


export default eventSlice.reducer;
