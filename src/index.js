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
import Example2 from "./examples/example2"
import Example3 from "./examples/example3"
import Example4 from "./examples/example4"
import Example5 from "./examples/example5"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="game" element={<Game />} />
      <Route path="space" element={<Space />} />
      <Route path="examples" element={<Example />} >
        <Route path="example1" element={<Example1 />} />
        <Route path="example2" element={<Space />} />
        <Route path="example3" element={<Example3 />} />
        <Route path="example4" element={<Example4 />} />
        <Route path="example5" element={<Example5 />} />
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
