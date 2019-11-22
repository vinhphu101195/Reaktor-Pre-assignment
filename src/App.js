import React from "react";
import "./App.css";
import PackageDataProvider from "./hooks/PackageDataProvider";
import Home from "./components/Home";

function App() {
  return (
    <PackageDataProvider>
      <Home />
    </PackageDataProvider>
  );
}

export default App;
