import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsTransactionsLoaded, setIsTransactionsLoaded } from "../../app/ui.slice";

const ReplayTransactions = () => {
  const dispatch = useDispatch();
  const isTransactionsLoaded = useSelector(selectIsTransactionsLoaded);

  useEffect(() => {
    if (isTransactionsLoaded) return;
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
