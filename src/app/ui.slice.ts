import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Group, Account, Product, Purchase, EventPayload } from "./types";
import { RootState } from "./store";

export interface UiState {
  isAccountCreationVisible: boolean;
  currentGroup: string;
}

export const initialState: UiState = {
  isAccountCreationVisible: false,
  currentGroup: undefined,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsAccountCreationVisible: (state, action: PayloadAction<boolean>) => {
      state.isAccountCreationVisible = action.payload;
    },
    setCurrentGroup: (state, action: PayloadAction<string>) => {
      state.currentGroup = action.payload;
    },
  },
});

export const { setIsAccountCreationVisible, setCurrentGroup } = uiSlice.actions;

export const selectIsAccountCreationVisible = (state: RootState) =>
  state.ui.isAccountCreationVisible;
export const selectCurrentGroup = (state: RootState) => state.ui.currentGroup;

export default uiSlice.reducer;
