import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "../src/assets/scss/app.scss";
import "../src/assets/scss/style.css";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";

import "react-toastify/dist/ReactToastify.css";
// import "./server";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import MainApp from "./MainApp";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <MainApp />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </>
);
