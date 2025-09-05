import React, { useEffect, useMemo, useState } from "react";
/*import yaml from "js-yaml";
import { js2xml } from "xml-js";*/

import {filterJson,pretty,jsonToYaml,jsonToXml,jsonToProperties,jsonToTableHTML, downloadHTML} from "./utils/jsonHelpers";

import JsonTable from "./components/JsonTable";
import TreeNode from "./components/TreeNode";
import FormView from "./components/FormView";


import './App.css';

// ---------- Minimal Scoped Styles ----------
const styles = `
  :root {
    --bg: #0b1020;
    --panel: #111936;
    --panel-2: #0e1530;
    --accent: #64b5f6;
    --accent-2: #ffb74d;
    --text: #e8edf7;
    --muted: #aab3c5;
    --ok: #26a69a; /* materialize teal lighten-1 */
    --err: #ef5350; /* materialize red lighten-1 */
  }
  .mw-root { background: var(--bg); color: var(--text); min-height: 100vh; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; }
  .mw-header { height: 12vh; position: relative; overflow: hidden; }
  .mw-wave { position: absolute; bottom: -1px; left: 0; width: 100%; }
  .mw-header-inner { position: relative; z-index: 2; height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .mw-title { font-weight: 800; letter-spacing: .5px; }
  .mw-sub { color: var(--muted); font-size: .95rem; }

  .mw-body { height: 88vh; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 14px 18px 22px; }
  .mw-card { background: linear-gradient(180deg, var(--panel), var(--panel-2)); border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.35); overflow: hidden; display: flex; flex-direction: column; }
  .mw-card-header { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,.06); display:flex; justify-content: space-between; align-items: center; }
  .mw-card-title { font-weight: 700; font-size: 1.05rem; }
  .mw-card-body { padding: 14px; flex: 1; overflow: auto; }
  .mw-toolbar { display: flex; gap: 8px; flex-wrap: wrap; }
  .mw-btn { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); color: var(--text); padding: 8px 12px; border-radius: 12px; cursor: pointer; font-weight: 600; }
  .mw-btn:hover { background: rgba(255,255,255,.12); }
  .mw-btn.primary { background: var(--accent); color: #0a0f21; border-color: transparent; }
  .mw-btn.warn { background: var(--accent-2); color: #1a1208; border-color: transparent; }
  .mw-btn.ghost { background: transparent; }
  .mw-input, .mw-textarea { width: 100%; background: rgba(255,255,255,.06); color: var(--text); border: 1px solid rgba(255,255,255,.12); border-radius: 12px; padding: 2px 2px; outline: none; }
  .mw-textarea { min-height: 220px; resize: vertical; }
  .mw-textarea.invalid {
    border-color: var(--err);
    background: rgba(239,83,80,.1);
  }
  .mw-chip { display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:9999px; background: rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); font-size:.85rem }
  .mw-error { background: rgba(239,83,80,.15); border: 1px solid rgba(239,83,80,.55); color: #ffc9c9; padding: 10px 12px; border-radius: 12px; }
  .mw-success { background: rgba(38,166,154,.15); border: 1px solid rgba(38,166,154,.55); color: #b9f6ca; padding: 10px 12px; border-radius: 12px; }

  /* Tree view */
  .tree { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 13px; }
  .tree-item { position: relative; margin-left: 16px; }
  .tree-key { color: #90caf9; }
  .tree-value.string { color: #ffe082; }
  .tree-value.number { color: #ffcc80; }
  .tree-value.boolean { color: #80cbc4; }
  .tree-value.null { color: #b39ddb; font-style: italic; }
  .tree-toggle { cursor: pointer; user-select: none; margin-right: 6px; display: inline-flex; align-items:center; }
  .tree-toggle::before { content: "▸"; display:inline-block; transition: transform .2s ease; margin-right: 4px; }
  .tree-toggle[aria-expanded="true"]::before { transform: rotate(90deg); }
  .tree-highlight { background: rgba(255, 235, 59, .22); border-radius:4px; padding: 0 2px; }
  .tree-bracket { color: #90a4ae; }

  /* Header gradient */
  .grad { background: linear-gradient(120deg, #1976d2, #26c6da 35%, #ffb74d 75%); }

  /* Responsive */
  @media (max-width: 980px) { .mw-body { grid-template-columns: 1fr; height: auto; min-height: 88vh; } .mw-header { height: 12vh } }
`;

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

export default function MaterializeJsonWorkbench() {
  const [raw, setRaw] = useState("");          // user input
  const [prettyText, setPrettyText] = useState(""); // beautified output
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [view, setView] = useState("tree");
  const [collapsed, setCollapsed] = useState({});
  const [filter, setFilter] = useState("");
  const [json, setJson] = useState(null);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [mode, setMode] = useState(""); // "parse" | "beautify"

  const highlight = filter.trim().toLowerCase();

  useEffect(() => {
    if (!raw.trim()) {
      setJson(null);
      setError("");
      return;
    }

    try {
      const obj = JSON.parse(raw);
      setJson(obj);
      setError("");
    } catch (e) {
      setJson(null);
      setError(`Invalid JSON: ${e.message}`);
    }
  }, [raw]);

  const filteredJson = useMemo(() => {
    try {
      if (!json) return null;
      if (!highlight) return json;
      return filterJson(json, highlight);
    } catch {
      return json;
    }
  }, [json, highlight]);

  function handleBeautify() {
    try {
      const source = raw.trim() || (json ? JSON.stringify(json) : "");
      if (!source) {
        setError("Nothing to beautify.");
        return;
      }
      const prettyStr = pretty(source);
      setPrettyText(prettyStr);
      setView("pretty");
      setMode("beautify");   // ✅ mark active
      setError("");
    } catch (e) {
      setError(`Beautify failed: ${e.message}`);
    }
  }

  function handleParse() {
    try {
      const obj = JSON.parse(raw);
      setJson(obj);
      setView("tree");
      setMode("parse");      // ✅ mark active
      setError("");
    } catch (e) {
      setError(`Parse error: ${e.message}`);
    }
  }


  function handleUpload(file) {
    if (!file) return;
    // extension validation: only accept .json
    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("Invalid file type. Only .json files are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const obj = JSON.parse(text);
        setRaw(text);
        setJson(obj);
        setError("");
        setInfo(`Loaded ${file.name}`);
      } catch (e) {
        setError(`File loaded but not valid JSON: ${e.message}`);
        setJson(null);
      }
    };
    reader.onerror = () => setError("Could not read the file.");
    reader.readAsText(file);
  }

  function handleCopy() {
      const text = getExportText();
      copyText(text).then(ok => {
        setShowCopyPopup(true);
        setTimeout(() => setShowCopyPopup(false), 1500); // hide after 1.5s
      });
    }

  function getExportText() {
    if (!json) return "";
    switch (view) {
      case "yaml":
        return jsonToYaml(filteredJson ?? json);
      case "xml":
        return jsonToXml(filteredJson ?? json);
      case "properties":
        // 🔥 FIX: join into a newline string
        return (jsonToProperties(filteredJson ?? json) || []).join("\n");
      case "table":
        return jsonToTableHTML(filteredJson ?? json);
      case "pretty":
        return prettyText || (json ? JSON.stringify(filteredJson ?? json, null, 2) : "");
      default:
        return JSON.stringify(filteredJson ?? json, null, 2);
    }
  }


  function handleFormChange(path, value) {
    if (!json) return;
    const clone = structuredClone(json);
    let ref = clone;
    for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
    const leaf = path[path.length - 1];
    // best-effort type inference
    let coerced = value;
    if (value === 'true') coerced = true;
    else if (value === 'false') coerced = false;
    else if (value === 'null') coerced = null;
    else if (!isNaN(Number(value)) && value.trim() !== '') coerced = Number(value);
    ref[leaf] = coerced;
    setJson(clone);
    setRaw(JSON.stringify(clone, null, 2));
  }

  const showTree = view === 'tree' && filteredJson;
  const showPretty = view === 'pretty';
  const showForm = view === 'form' && filteredJson;

  return (
    <div className="mw-root">
      <style>{styles}</style>

      {/* Curved Gradient Header with Animation */}
      <header className="mw-header grad">

        <div className="mw-header-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/ConvJSON.png"
              alt="App Logo"
              className="app-logo"
              style={{
                height: "50px",
                width: "50px",
                borderRadius: "25px",
              }}
            />
            <div
              className="mw-title"
              style={{ fontSize: "1.35rem", fontWeight: "bold", color: "#fff" }}
            >
              ConvJSON.com
            </div>
          </div>
        </div>

        {/* SVG wave for curved bottom */}
        <svg className="mw-wave" viewBox="0 0 1440 150" preserveAspectRatio="none" height="150">
          <path fill="currentColor" fillOpacity="0.18" d="M0,96L80,112C160,128,320,160,480,149.3C640,139,800,85,960,64C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" />
          <path fill="white" fillOpacity="0.06" d="M0,64L80,80C160,96,320,128,480,138.7C640,149,800,139,960,117.3C1120,96,1280,64,1360,64L1440,64L1440,150L1360,150C1280,150,1120,150,960,150C800,150,640,150,480,150C320,150,160,150,80,150L0,150Z" />
        </svg>
      </header>

      {/* Body */}
      <main className="mw-body">
        {/* Left: Input */}
        <section className="mw-card">
          <div className="mw-card-header">
            <div className="mw-card-title">Input</div>
            <div className="mw-toolbar">
              <button
                className={`mw-btn ${mode === "parse" ? "primary" : ""}`}
                onClick={handleParse}
              >
                Parse
              </button>

              <button
                className={`mw-btn ${mode === "beautify" ? "primary" : ""}`}
                onClick={handleBeautify}
              >
                Beautify
              </button>

            </div>
          </div>
          <div className="mw-card-body">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginBottom:12 }}>
              <label className="mw-btn warn" htmlFor="file">Upload JSON</label>
              <input id="file" type="file" accept=".json,application/json,text/plain" style={{ display:'none' }} onChange={e=>handleUpload(e.target.files?.[0])} />
              <span style={{opacity:.7}}>or paste into the textarea</span>
            </div>
            <textarea
                className={`mw-textarea ${error ? 'invalid' : ''}`}
                value={raw}
                onChange={e => setRaw(e.target.value)}
                placeholder='{"hello":"world"}\n// Paste or type JSON here'
                style={{ flexGrow: 1, minHeight: '300px' }}
              />
            {error && <div className="mw-error" style={{marginTop:12}}>{error}</div>}

          </div>
        </section>

        {/* Right: Result */}
        <section className="mw-card">
          <div className="mw-card-header">
            <div className="mw-toolbar">
              <button
                className={`mw-btn ${view === "pretty" ? "primary" : ""}`}
                onClick={() => {
                  try {
                    const src = json ?? (raw ? JSON.parse(raw) : null);
                    if (!src) {
                      setError("Nothing to show.");
                      setPrettyText("");
                    } else {
                      setPrettyText(pretty(src));
                      setError("");
                    }
                    setView("pretty");
                  } catch (e) {
                    setError(`Cannot format JSON: ${e.message}`);
                  }
                }}
              >
                JSON
              </button>
              <button className={`mw-btn ${view==='tree'?'primary':''}`} onClick={()=>setView('tree')}>Tree</button>
              <button className={`mw-btn ${view==='form'?'primary':''}`} onClick={()=>setView('form')}>Form</button>
              <button className={`mw-btn ${view==='yaml'?'primary':''}`} onClick={()=>setView('yaml')}>YAML</button>
              <button className={`mw-btn ${view==='xml'?'primary':''}`} onClick={()=>setView('xml')}>XML</button>
              <button className={`mw-btn ${view==='properties'?'primary':''}`} onClick={()=>setView('properties')}>Properties</button>
              <button className={`mw-btn ${view==='table'?'primary':''}`} onClick={()=>setView('table')}>Table</button>
            </div>
             <div className="mw-toolbar" style={{ position: "relative" }}>
                <input
                  className="mw-input"
                  placeholder="Filter: search key or value"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  style={{ minWidth: 200 }}
                />

                {view !== "table" && (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <button className="mw-btn" onClick={handleCopy}>Copy</button>
                    {showCopyPopup && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "105%",
                          transform: "translateY(-50%)",
                          background: "#26a69a",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          whiteSpace: "nowrap",
                          boxShadow: "0 2px 6px rgba(0,0,0,.3)"
                        }}
                      >
                        Copied!
                      </div>
                    )}
                  </div>
                )}

                {view === "table" && (
                  <button
                    className="mw-btn"
                    onClick={() =>
                      downloadHTML("table-view.html", jsonToTableHTML(filteredJson ?? json))
                    }
                  >
                    Download Table
                  </button>
                )}
              </div>
          </div>
          <div className="mw-card-body">
            {showPretty && (
              <pre className="tree" style={{ whiteSpace: 'pre-wrap' }}>{prettyText || (json ? JSON.stringify(filteredJson ?? json, null, 2) : raw)}</pre>
            )}

            {view==='pretty' && !raw && (
              <div className="mw-error">Nothing to show. Paste JSON on the left and click Beautify or Parse.</div>
            )}

            {view!=='pretty' && !json && (
              <div className="mw-error">No parsed JSON yet. Click Parse (left) after pasting your JSON.</div>
            )}

            {view === 'yaml' && json && (
              <pre className="tree" style={{ whiteSpace: 'pre-wrap' }}>
                {jsonToYaml(filteredJson ?? json)}
              </pre>
            )}

            {view === 'xml' && json && (
              <pre className="tree" style={{ whiteSpace: 'pre-wrap' }}>
                {jsonToXml(filteredJson ?? json)}
              </pre>
            )}


            {view === 'properties' && json && (
              <pre className="tree" style={{ whiteSpace: 'pre-wrap' }}>
                {jsonToProperties(filteredJson ?? json).join("\n")}
              </pre>
            )}

            {view === 'table' && json && (
              <JsonTable obj={filteredJson ?? json} />
            )}


            {showTree && (
              <div className="tree">
                <TreeNode data={filteredJson} path={["$root"]} collapsed={collapsed} setCollapsed={setCollapsed} highlight={highlight} />
              </div>
            )}

            {showForm && (
              <FormView data={filteredJson} onChange={handleFormChange} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
