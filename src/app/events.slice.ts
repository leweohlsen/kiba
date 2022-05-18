import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
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
    g0: { id: "g0", name: "Zelt 1" },
    g1: { id: "g1", name: "Zelt 2" },
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
      const id = uuidv4();
      state.groups[id] = { ...action.payload, id };
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      const id = uuidv4();
      state.accounts[id] = { ...action.payload, id };
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      const id = uuidv4();
      state.products[id] = { ...action.payload, id };
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
