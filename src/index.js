import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Game from "./routers/gamePage"
import Space from "./routers/spacePage"
import Example from "./routers/examplePage"
import Example1 from "./examples/example1"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="game" element={<Game />} />
      <Route path="space" element={<Space />} />
      <Route path="examples" element={<Example />} >
        <Route path="example1" element={<Example1 />} />
      </Route>

    </Routes>
  </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
