// styles/styles.js
const styles = `
  :root {
    --bg: #0b1020;
    --panel: #111936;
    --panel-2: #0e1530;
    --accent: #64b5f6;
    --accent-2: #ffb74d;
    --text: #e8edf7;
    --muted: #aab3c5;
    --ok: #26a69a;
    --err: #ef5350;
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
  .mw-textarea.invalid { border-color: var(--err); background: rgba(239,83,80,.1); }
  .mw-chip { display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:9999px; background: rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); font-size:.85rem }
  .mw-error { background: rgba(239,83,80,.15); border: 1px solid rgba(239,83,80,.55); color: #ffc9c9; padding: 10px 12px; border-radius: 12px; }
  .mw-success { background: rgba(38,166,154,.15); border: 1px solid rgba(38,166,154,.55); color: #b9f6ca; padding: 10px 12px; border-radius: 12px; }

  /* Tree view */
  .tree { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace; font-size: 13px; }
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

  /*@media (max-width: 980px) { .mw-body { grid-template-columns: 1fr; height: auto; min-height: 88vh; } .mw-header { height: 12vh } }*/
`;

export default styles;
