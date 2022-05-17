import ReactDOM from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";

import Layout from "./components/Layout";
import { store } from "./app/store";
import "antd/dist/antd.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Layout />
    </Provider>
  </React.StrictMode>
);
