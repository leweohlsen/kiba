import ReactDOM from "react-dom/client";
import React from "react";

import Layout from './components/Layout'
import "antd/dist/antd.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);
