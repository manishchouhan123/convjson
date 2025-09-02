import React, { useState } from "react";

export default function JsonTable({ obj, path = "$root" }) {
  const [expanded, setExpanded] = useState({}); // tracks expanded paths

  const toggleExpand = (keyPath) => {
    setExpanded(prev => ({ ...prev, [keyPath]: !prev[keyPath] }));
  };

  if (obj === null || typeof obj !== "object") {
    return <span>{String(obj)}</span>;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return <div><h8>{path}</h8><div>Empty array</div></div>;
    }

    if (typeof obj[0] !== "object") {
      return (
        <div>
          <h8>{path}</h8>
          <table className="json-table">
            <thead><tr><th>Value</th></tr></thead>
            <tbody>
              {obj.map((v, i) => <tr key={i}><td>{String(v)}</td></tr>)}
            </tbody>
          </table>
        </div>
      );
    }

    const headers = Array.from(new Set(obj.flatMap(o => Object.keys(o))));
    return (
      <div>
        <h8>{path}</h8>
        <table className="json-table">
          <thead>
            <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>

            {obj.map((row, idx) => {
              const originalIdx = obj.__indexMap?.[idx] ?? idx;
              return (
                <tr key={idx}>
                  {headers.map(h => {
                    const val = row[h];
                    const cellPath = `${path}[${originalIdx}].${h}`;
                    if (val !== null && typeof val === "object") {
                      return (
                        <td key={h}>
                          <button onClick={() => toggleExpand(cellPath)}>
                            {expanded[cellPath] ? "▼" : "▶"} {h}
                          </button>
                          {expanded[cellPath] && (
                            <div style={{ marginLeft: 12 }}>
                              <JsonTable obj={val} path={cellPath} />
                            </div>
                          )}
                        </td>
                      );
                    }
                    return <td key={h}>{String(val ?? "")}</td>;
                  })}
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>
    );
  }

  // Plain object
  const headers = Object.keys(obj);
  return (
    <div>
      <h8>{path}</h8>
      <table className="json-table">
        <thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          <tr>
            {headers.map(h => {
              const cellPath = `${path}.${h}`;
              const val = obj[h];
              if (val !== null && typeof val === "object") {
                return (
                  <td key={h}>
                    <button onClick={() => toggleExpand(cellPath)}>
                      {expanded[cellPath] ? "▼" : "▶"} {h}
                    </button>
                    {expanded[cellPath] && (
                      <div style={{ marginLeft: 12 }}>
                        <JsonTable obj={val} path={cellPath} />
                      </div>
                    )}
                  </td>
                );
              }
              return <td key={h}>{String(val ?? "")}</td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}