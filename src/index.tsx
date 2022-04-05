import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory({ window });

ReactDOM.render(
  <React.StrictMode>
    <HistoryRouter history={history}>
      <App />
    </HistoryRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
