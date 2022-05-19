import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { EventPayload } from "../../app/types";
import { setIsTransactionsLoaded } from "../../app/ui.slice";

const ReplayTransactions = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getTransactions = async () => {
      const transactions = await window.electronAPI.getTransactions();
      transactions.forEach((transaction) => {
        console.log(transaction);
        dispatch(transaction);
      });
      console.log('all replayed')
      dispatch(setIsTransactionsLoaded(true));
    };
    getTransactions();
  }, []);

  return null;
};

export default ReplayTransactions;
