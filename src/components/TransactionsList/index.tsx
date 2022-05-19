import { useSelector } from "react-redux";
import { selectTransactions } from "../../app/events.slice";

const TransactionsList = () => {
    const transactions = useSelector(selectTransactions);

    return (
        <div>
            {transactions.map((transaction) => (
                <p>{JSON.stringify(transaction)}</p>
            ))}
        </div>
    );
};

export default TransactionsList;
