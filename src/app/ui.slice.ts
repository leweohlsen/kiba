import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Group, Account, Product, Purchase } from "./types";
import { RootState } from "./store";

export interface UiState {
    isAccountCreationVisible: boolean;
    isGroupCreationVisible: boolean;
    isCategoryCreationVisible: boolean;
    isProductCreationVisible: boolean;
    isTransactionsLoaded: boolean;
    currentGroup: string;
    currentMenuItem: string;
    itemBeingEditedId: string;
    newProductImage: string;
    accountSearchTerm: string;
    productSearchTerm: string;
}

export const initialState: UiState = {
    isAccountCreationVisible: false,
    isGroupCreationVisible: false,
    isCategoryCreationVisible: false,
    isProductCreationVisible: false,
    isTransactionsLoaded: false,
    currentGroup: undefined,
    currentMenuItem: "accounts",
    itemBeingEditedId: undefined,
    newProductImage: undefined,
    accountSearchTerm: "",
    productSearchTerm: "",
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
        setIsCategoryCreationVisible: (state, action: PayloadAction<boolean>) => {
            state.isCategoryCreationVisible = action.payload;
        },
        setIsProductCreationVisible: (state, action: PayloadAction<boolean>) => {
            state.isProductCreationVisible = action.payload;
        },
        setIsTransactionsLoaded: (state, action: PayloadAction<boolean>) => {
            state.isTransactionsLoaded = action.payload;
        },
        setCurrentGroup: (state, action: PayloadAction<string>) => {
            state.currentGroup = action.payload;
        },
        setCurrentMenuItem: (state, action: PayloadAction<string>) => {
            state.currentMenuItem = action.payload;
        },
        setItemBeingEditedId: (state, action: PayloadAction<string>) => {
            state.itemBeingEditedId = action.payload;
        },
        setNewProductImage: (state, action: PayloadAction<string>) => {
            state.newProductImage = action.payload;
        },
        setAccountSearchTerm: (state, action: PayloadAction<string>) => {
            state.accountSearchTerm = action.payload;
        },
        setProductSearchTerm: (state, action: PayloadAction<string>) => {
            state.productSearchTerm = action.payload;
        },
    },
});

export const {
    setIsAccountCreationVisible,
    setIsGroupCreationVisible,
    setIsCategoryCreationVisible,
    setIsProductCreationVisible,
    setIsTransactionsLoaded,
    setCurrentGroup,
    setCurrentMenuItem,
    setItemBeingEditedId,
    setNewProductImage,
    setAccountSearchTerm,
    setProductSearchTerm,
} = uiSlice.actions;

export const selectIsAccountCreationVisible = (state: RootState) => state.ui.isAccountCreationVisible;
export const selectIsGroupCreationVisible = (state: RootState) => state.ui.isGroupCreationVisible;
export const selectIsCategoryCreationVisible = (state: RootState) => state.ui.isCategoryCreationVisible;
export const selectIsProductCreationVisible = (state: RootState) => state.ui.isProductCreationVisible;
export const selectIsTransactionsLoaded = (state: RootState) => state.ui.isTransactionsLoaded;
export const selectCurrentGroup = (state: RootState) => state.ui.currentGroup;
export const selectCurrentMenuItem = (state: RootState) => state.ui.currentMenuItem;
export const selectItemBeingEditedId = (state: RootState) => state.ui.itemBeingEditedId;
export const selectNewProductImage = (state: RootState) => state.ui.newProductImage;
export const selectAccountSearchTerm = (state: RootState) => state.ui.accountSearchTerm;
export const selectProductSearchTerm = (state: RootState) => state.ui.productSearchTerm;

export default uiSlice.reducer;
