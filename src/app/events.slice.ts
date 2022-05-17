import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Group, Account, Product, ShoppingCart, EventPayload } from "./types";

export interface EventsState {
  groups: Record<string, Group>;
  accounts: Record<string, Account>;
  products: Record<string, Product>;
  events: PayloadAction<EventPayload>[];
}

export const initialState: EventsState = {
  groups: {},
  accounts: {},
  products: {},
  events: [],
};

export const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups[action.payload.id] = action.payload;
      state.events.push(action);
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts[action.payload.id] = action.payload;
      state.events.push(action);
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products[action.payload.id] = action.payload;
      state.events.push(action);
    },
    checkout: (state, action: PayloadAction<ShoppingCart>) => {
      const buyer = state.accounts[action.payload.buyer_id];
      action.payload.product_ids.forEach((product_id) => {
        const product = state.products[product_id];
        buyer.balance -= product.price;
      });
      state.events.push(action);
    },
  },
});

export const { addGroup, addAccount, addProduct, checkout } =
  eventSlice.actions;

export default eventSlice.reducer;
