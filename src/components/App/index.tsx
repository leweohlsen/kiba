import type { PayloadAction } from "@reduxjs/toolkit";
import type { EventPayload } from "../../app/types";
import { useSelector, useStore, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { selectIsTransactionsLoaded } from "../../app/ui.slice";
import { appendTransaction } from "../../app/events.slice";
import Layout from "../Layout";
import ReplayTransactions from "../ReplayTransactions";

export const useDispatchAndSaveEvent = () => {
    const dispatch = useDispatch();

    // dispatch event
    const dispatchAndAddTransaction = (action: PayloadAction<EventPayload>) => {
        dispatch(action);
        dispatch(appendTransaction(action));
    };
    // save transaction to redux

    // save transactions to main process
    // useEffect(() => {
    //     fetch(url)
    //         .then((res) => res.json())
    //         .then((data) => setData(data));
    // }, []);

    return dispatchAndAddTransaction;
};

const App = () => {
    const isTransactionsLoaded = useSelector(selectIsTransactionsLoaded);

    if (!isTransactionsLoaded) return <ReplayTransactions />;
    return <Layout />;
};

export default App;
