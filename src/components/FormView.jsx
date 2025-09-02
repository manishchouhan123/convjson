import React from "react";

export default function FormView({ data, onChange }) {
  const render = (val, path = []) => {
    if (val === null || typeof val !== "object") {
      const key = path.join(".") || "root";
      return (
        <div className="input-field" key={key}>
          <label className="active">{key}</label>
          <input className="mw-input" value={String(val)} onChange={e=>onChange(path, e.target.value)} />
        </div>
      );
    }
    const entries = Array.isArray(val)
      ? val.map((v,i)=>[(val.__indexMap?.[i] ?? i), v])
      : Object.entries(val);
    return (
      <div style={{ borderLeft: '2px solid rgba(255,255,255,.08)', marginLeft: 6, paddingLeft: 10 }} key={path.join('.')||'root-obj'}>
        {entries.map(([k,v]) => (
          <div key={[...path,k].join('.')} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{String(k)}</div>
            {render(v, [...path, k])}
          </div>
        ))}
      </div>
    );
  };
  return <div className="tree">{render(data)}</div>;
}
