import React from "react";

export default function TreeNode({ data, k, path, collapsed, setCollapsed, highlight }) {
  const id = path.join(".");
  const isPrimitive = (v) => v === null || ["string","number","boolean"].includes(typeof v);
  const isCollapsed = !!collapsed[id];
  const toggle = () => setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

  const Key = ({ name }) => {
    const str = String(name); // always safe
    const hit = highlight && str.toLowerCase().includes(highlight);
    return (
      <span className="tree-key">
        "{hit ? <mark className="tree-highlight">{str}</mark> : str}"
      </span>
    );
  };

  const Val = ({ value }) => {
    const cls = `tree-value ${value === null ? 'null' : typeof value}`;
    let txt = value === null ? 'null' : typeof value === 'string' ? `"${value}"` : String(value);
    if (highlight) {
      const i = txt.toLowerCase().indexOf(highlight);
      if (i >= 0) {
        txt = <>{txt.slice(0,i)}<mark className="tree-highlight">{txt.slice(i,i+highlight.length)}</mark>{txt.slice(i+highlight.length)}</>;
      }
    }
    return <span className={cls}>{txt}</span>;
  };

  if (isPrimitive(data)) {
    return <div className="tree-item">{k !== undefined && <><Key name={k} />: </>}<Val value={data} /></div>;
  }

  const entries = Array.isArray(data)? data.map((v,i)=>[(data.__indexMap?.[i] ?? i), v]): Object.entries(data);
  return (
    <div className="tree-item">
      <span className="tree-toggle" role="button" aria-expanded={!isCollapsed} onClick={toggle}>
        {k !== undefined && <Key name={String(k)} />} <span className="tree-bracket">{Array.isArray(data) ? "[" : "{"}</span>
      </span>
      {!isCollapsed && (
        <div style={{ marginLeft: 16 }}>
          {entries.map(([ck, cv], idx) => (
            <TreeNode key={idx} data={cv} k={ck} path={[...path, ck]} collapsed={collapsed} setCollapsed={setCollapsed} highlight={highlight} />
          ))}
        </div>
      )}
      <span className="tree-bracket">{Array.isArray(data) ? "]" : "}"}</span>
    </div>
  );
}
