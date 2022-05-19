import type { PayloadAction } from "@reduxjs/toolkit";
import type { EventPayload } from "../../app/types";
import { useSelector, useStore, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { selectIsTransactionsLoaded } from "../../app/ui.slice";
import { appendTransaction } from "../../app/events.slice";
import Layout from "../Layout";
import ReplayTransactions from "../ReplayTransactions";

import './style.css';

declare global {
    interface Window {
        electronAPI: {
            appendTransaction: Function;
            getTransactions: Function;
        }
    }
}

export const useDispatchAndSaveEvent = () => {
    const dispatch = useDispatch();
    const dispatchAndAddTransaction = async (action: PayloadAction<EventPayload>) => {
        try {
            dispatch(action);
        } catch (error) {
            throw error;
        } finally {
            dispatch(appendTransaction(action));
            await window.electronAPI.appendTransaction(action);
        }
    };
    return dispatchAndAddTransaction;
};

const App = () => {
    const isTransactionsLoaded = useSelector(selectIsTransactionsLoaded);

    if (!isTransactionsLoaded) return <ReplayTransactions />;
    return <Layout />;
};

export default App;
