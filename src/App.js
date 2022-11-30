import React from "react";
import Flow from "./Flow";
import "./App.css";
import { ReactFlowProvider } from "reactflow";

export default function App() {
  return (
    <div className="App">
      <ReactFlowProvider>
      <Flow />
      </ReactFlowProvider>
    </div>
  );
}
