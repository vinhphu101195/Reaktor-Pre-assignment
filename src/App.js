import React from "react";
import "./App.css";
import Context from "./context/Context";
import Home from "./components/Home";

function App() {
  return (
    <Context>
      <Home></Home>
    </Context>
  );
}

export default App;
