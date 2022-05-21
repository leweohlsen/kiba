import type { PayloadAction } from "@reduxjs/toolkit";
import type { EventPayload, Product, Transaction } from "../../app/types";
import { useSelector, useStore, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { selectIsTransactionsLoaded, setNewProductImage } from "../../app/ui.slice";
import { appendTransaction } from "../../app/events.slice";
import Layout from "../Layout";
import ReplayTransactions from "../ReplayTransactions";

import "./style.css";

declare global {
    interface Window {
        electronAPI: {
            appendTransaction: (t: Transaction) => void;
            getTransactions: () => void;
            selectProductImage: (productId: string) => void;
            updateProductImage: (channel: string, func: (event: string, data: string) => void) => void;
        };
    }
}

export const useDispatchAndSaveEvent = () => {
    const dispatch = useDispatch();
    const dispatchAndAddTransaction = async (action: Transaction) => {
        try {
            dispatch(action);
        } finally {
            dispatch(appendTransaction(action));
            await window.electronAPI.appendTransaction(action);
        }
    };
    return dispatchAndAddTransaction;
};

const App: React.FC = () => {
    const dispatch = useDispatch();
    const isTransactionsLoaded = useSelector(selectIsTransactionsLoaded);

    useEffect(() => {
        window.electronAPI.updateProductImage("updateProductImage", (event, data) => {
            dispatch(setNewProductImage(data));
        });
    }, []);

    if (!isTransactionsLoaded) return <ReplayTransactions />;
    return <Layout />;
};

export default App;
