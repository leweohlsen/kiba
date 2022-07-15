import { createSlice, ActionCreator } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Group, Account, Category, Product, Purchase, Transaction } from "./types";
import { RootState } from "./store";

export interface EventsState {
    groups: Record<string, Group>;
    accounts: Record<string, Account>;
    categories: Record<string, Category>;
    products: Record<string, Product>;
    transactions: Transaction<any>[];
    shoppingCart: Record<string, number>;
    customPrice: number;
    customerId: string;
}

export const initialState: EventsState = {
    groups: {},
    accounts: {},
    categories: {},
    products: {},
    transactions: [],
    shoppingCart: {},
    customPrice: undefined,
    customerId: undefined,
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
        addCategory: (state, action: PayloadAction<Category>) => {
            state.categories[action.payload.id] = { ...action.payload };
        },
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products[action.payload.id] = { ...action.payload };
        },
        checkout: (state, action: PayloadAction<Purchase>) => {
            const buyer = state.accounts[action.payload.customerId];
            if (action.payload.customPrice) {
                buyer.balance -= action.payload.customPrice;
            } else {
                Object.entries(action.payload.shoppingCart).forEach(([productId, quantity]) => {
                    const product = state.products[productId];
                    buyer.balance -= product.price * quantity;
                });
            }
            state.shoppingCart = initialState.shoppingCart;
            state.customerId = initialState.customerId;
            state.customPrice = undefined;
        },
        editGroup: (state, action: PayloadAction<Group>) => {
            state.groups[action.payload.id] = {
                ...state.groups[action.payload.id],
                ...action.payload,
            };
        },
        editProduct: (state, action: PayloadAction<Product>) => {
            state.products[action.payload.id] = {
                ...state.products[action.payload.id],
                ...action.payload,
            };
        },
        editAccount: (state, action: PayloadAction<Account>) => {
            state.accounts[action.payload.id] = {
                ...state.accounts[action.payload.id],
                ...action.payload,
            };
        },
        addToCart: (state, action: PayloadAction<string>) => {
            if (!state.shoppingCart[action.payload]) {
                state.shoppingCart[action.payload] = 1;
            } else {
                state.shoppingCart[action.payload] += 1;
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            if (!state.shoppingCart[action.payload]) return;
            if (state.shoppingCart[action.payload] === 1) {
                delete state.shoppingCart[action.payload];
            } else {
                state.shoppingCart[action.payload] -= 1;
            }
        },
        appendTransaction: (state, action: PayloadAction<Transaction<any>>) => {
            state.transactions.push(action.payload);
        },
        setTransactions: (state, action: PayloadAction<Transaction<any>[]>) => {
            state.transactions = action.payload;
        },
        setCustomerId: (state, action: PayloadAction<string>) => {
            state.customerId = action.payload;
        },
        setCustomPrice: (state, action: PayloadAction<number>) => {
            state.customPrice = action.payload;
        },
    },
});

const actionCreatorsWithDates = (actionCreators: Record<string, ActionCreator<any>>) => {
    return Object.fromEntries(
        Object.entries(actionCreators).map(([name, action]) => {
            const actionCreator: ActionCreator<Transaction<any>> = (payload) => ({
                ...action(payload),
                timestamp: new Date().getTime(),
            });
            return [name, actionCreator];
        })
    );
};

export const {
    addGroup,
    addAccount,
    addCategory,
    addProduct,
    checkout,
    editGroup,
    editProduct,
    editAccount,
    appendTransaction,
    setTransactions,
    addToCart,
    removeFromCart,
    setCustomerId,
    setCustomPrice,
} = actionCreatorsWithDates(eventSlice.actions);

export const selectAccounts = (state: RootState) => Object.values(state.events.accounts);
export const selectGroups = (state: RootState) => Object.values(state.events.groups);
export const selectTransactions = (state: RootState) => state.events.transactions;
export const selectCategories = (state: RootState) => Object.values(state.events.categories);
export const selectProducts = (state: RootState) => Object.values(state.events.products);
export const selectShoppingCart = (state: RootState) => state.events.shoppingCart;
export const selectCustomerId = (state: RootState) => state.events.customerId;
export const selectCustomPrice = (state: RootState) => state.events.customPrice;

export default eventSlice.reducer;
