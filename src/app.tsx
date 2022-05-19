import ReactDOM from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";

import App from "./components/App";
import { store } from "./app/store";
import "antd/dist/antd.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
