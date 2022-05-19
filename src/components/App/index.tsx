import { useSelector } from "react-redux"
import { selectIsTransactionsLoaded } from "../../app/ui.slice"
import Layout from "../Layout";
import ReplayTransactions from "../ReplayTransactions";

const App = () => {
    const isTransactionsLoaded = useSelector(selectIsTransactionsLoaded);

    if (!isTransactionsLoaded) return <ReplayTransactions />
    return <Layout />
}

export default App;
