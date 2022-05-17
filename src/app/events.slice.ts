import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Group, Person, Product } from "./types";

export interface EventsState {
  groups: Group[];
  persons: Person[];
  products: Product[];
  transactions: PayloadAction[];
}

export const initialState: EventsState = {
  groups: [],
  persons: [],
  products: [],
  transactions: [],
};

export const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    addPerson: (state, action: PayloadAction<Person>) => {
      state.persons.push(action.payload);
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    addTransaction: (state, action: PayloadAction) => {
      state.transactions.push(action);
    },
  },
});

export const { addGroup, addPerson, addProduct, addTransaction } = eventSlice.actions;

export default eventSlice.reducer;
