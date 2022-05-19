import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Group, Account, Product, Purchase, EventPayload } from "./types";
import { RootState } from "./store";

export interface UiState {
  isAccountCreationVisible: boolean;
  isGroupCreationVisible: boolean;
  isTransactionsLoaded: boolean;
  currentGroup: string;
}

export const initialState: UiState = {
  isAccountCreationVisible: false,
  isGroupCreationVisible: false,
  isTransactionsLoaded: false,
  currentGroup: undefined,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsAccountCreationVisible: (state, action: PayloadAction<boolean>) => {
      state.isAccountCreationVisible = action.payload;
    },
    setIsGroupCreationVisible: (state, action: PayloadAction<boolean>) => {
      state.isGroupCreationVisible = action.payload;
    },
    setIsTransactionsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isTransactionsLoaded = action.payload;
    },
    setCurrentGroup: (state, action: PayloadAction<string>) => {
      state.currentGroup = action.payload;
    },
  },
});

export const { setIsAccountCreationVisible, setIsGroupCreationVisible, setIsTransactionsLoaded, setCurrentGroup } =
  uiSlice.actions;

export const selectIsAccountCreationVisible = (state: RootState) => state.ui.isAccountCreationVisible;
export const selectIsGroupCreationVisible = (state: RootState) => state.ui.isGroupCreationVisible;
export const selectIsTransactionsLoaded = (state: RootState) => state.ui.isTransactionsLoaded;
export const selectCurrentGroup = (state: RootState) => state.ui.currentGroup;

export default uiSlice.reducer;
