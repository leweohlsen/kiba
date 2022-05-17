import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Group, Account, Product, Purchase, EventPayload } from "./types";

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
    appendEvent: (state, action: PayloadAction<PayloadAction<EventPayload>>) => {
      state.events.push(action.payload);
    }
  },
});

export const { addGroup, addAccount, addProduct, checkout, appendEvent } =
  eventSlice.actions;

export default eventSlice.reducer;
