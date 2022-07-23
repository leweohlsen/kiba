import type { Transaction } from "../../app/types";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { selectIsTransactionsLoaded, setNewProductImage } from "../../app/ui.slice";
import { appendTransaction } from "../../app/events.slice";
import Layout from "../Layout";
import ReplayTransactions from "../ReplayTransactions";

import "./style.css";

export const useDispatchAndSaveEvent = () => {
    const dispatch = useDispatch();
    const dispatchAndAddTransaction = async (action: Transaction<any>) => {
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
