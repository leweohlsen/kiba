import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Person, Product } from "./types";

export interface EventsState {
  persons: Person[];
  products: Product[];
  transactions: PayloadAction[];
}

const initialState: EventsState = {
  persons: [],
  products: [],
  transactions: [],
};

export const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
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

export const { addPerson, addProduct, addTransaction } = eventSlice.actions;

export default eventSlice.reducer;
