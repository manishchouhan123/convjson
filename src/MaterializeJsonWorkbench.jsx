// src/MaterializeJsonWorkbench.jsx
import React, { useState } from "react";
import Header from "./components/Header";
import InputSection from "./components/InputSection";
import OutputSection from "./components/OutputSection";
import FileUploader from "./components/FileUploader";
import "./App.css";

const MaterializeJsonWorkbench = () => {
  // Main state only here
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState("");
  const [format, setFormat] = useState("json");

  return (
    <div className="mw-root">
      {/* Header */}
      <Header />

      {/* Body layout */}
      <div className="mw-body">
        {/* Left side: input + upload */}
        <div className="mw-left">
          <FileUploader onLoad={setInputText} />
          <InputSection inputText={inputText} setInputText={setInputText} />
        </div>

        {/* Right side: output */}
        <div className="mw-right">
          <OutputSection output={output} format={format} setFormat={setFormat} />
        </div>
      </div>
    </div>
  );
};

export default MaterializeJsonWorkbench;
