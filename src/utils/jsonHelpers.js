import yaml from "js-yaml";
import { js2xml } from "xml-js";

export function pretty(jsonText) {
  const obj = typeof jsonText === 'string' ? JSON.parse(jsonText) : jsonText;
  return JSON.stringify(obj, null, 2);
}

export function filterJson(data, query, indexMap = []) {
  if (data === null || typeof data !== "object") {
    return String(data).toLowerCase().includes(query) ? data : undefined;
  }

  if (Array.isArray(data)) {
    const filtered = [];
    const map = [];
    data.forEach((item, i) => {
      const res = filterJson(item, query, [...indexMap, i]);
      if (res !== undefined) {
        filtered.push(res);
        map.push(i); // preserve original index
      }
    });
    if (filtered.length === 0) return undefined;
    filtered.__indexMap = map;
    return filtered;
  }

  const obj = {};
  let matched = false;
  for (const [k, v] of Object.entries(data)) {
    const res = filterJson(v, query, [...indexMap, k]);
    if (res !== undefined || k.toLowerCase().includes(query)) {
      obj[k] = res !== undefined ? res : v;
      matched = true;
    }
  }
  return matched ? obj : undefined;
}



export function jsonToYaml(obj) {
  return yaml.dump(obj);
}

export function jsonToXml(obj) {
  return js2xml(obj, { compact: true, spaces: 2 });
}

export function jsonToProperties(obj, prefix = "", result = []) {
  if (obj === null || typeof obj !== "object") {
    result.push(`${prefix}=${obj}`);
    return result;
  }

  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      const originalIdx = obj.__indexMap?.[i] ?? i;
      jsonToProperties(v, `${prefix}[${originalIdx}]`, result);
    });
    return result;
  }

  for (const [k, v] of Object.entries(obj)) {
    const newPrefix = prefix ? `${prefix}.${k}` : k;
    jsonToProperties(v, newPrefix, result);
  }

  return result;
}

// utils/jsonHelpers.js

// Escape text to safe HTML

 export function escapeHtml(input) {
   return String(input)
     .replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")
     .replace(/"/g, "&quot;")
     .replace(/'/g, "&#39;");
 }

 // 🔹 Export-only HTML Table generator
 export function jsonToTableHTML(obj, path = "$root") {
   const renderValue = (v, kp = "") => {
     if (v === null || typeof v !== "object") {
       return escapeHtml(String(v));
     }
     if (Array.isArray(v)) return renderArray(v, kp);
     return renderObject(v, kp);
   };

   const renderArray = (arr, kp = "") => {
     if (arr.length === 0) return `<div>${escapeHtml(kp)}: []</div>`;

     // primitive array
     if (arr.every(el => el === null || typeof el !== "object")) {
       return `<div>${escapeHtml(kp)}:
         <table class="json-table">
           <thead><tr><th>Value</th></tr></thead>
           <tbody>
             ${arr.map((x, i) => {
               const orig = Array.isArray(arr.__indexMap) ? arr.__indexMap[i] : i; // ✅ original index
               // If you show index text anywhere, use `orig`. Value cell stays the same.
               return `<tr><td>${escapeHtml(String(x))}</td></tr>`;
             }).join("")}
           </tbody>
         </table>
       </div>`;
     }

     // array of objects
     const headers = Array.from(
         new Set(arr.flatMap(o => (o && typeof o === "object") ? Object.keys(o) : []))
       );
       const headerHtml = headers.map(h => `<th>${escapeHtml(h)}</th>`).join("");

       const rowsHtml = arr.map((row, i) => {
         const orig = Array.isArray(arr.__indexMap) ? arr.__indexMap[i] : i; // ✅ original index
         const rowPath = `${kp}[${orig}]`;                                   // ✅ use original index in path
         const cells = headers.map(
           h => `<td>${renderValue(row ? row[h] : "", `${rowPath}.${h}`)}</td>`
         ).join("");
         return `<tr>${cells}</tr>`;
       }).join("");

       return `<div>${escapeHtml(kp)}:
         <table class="json-table">
           <thead><tr>${headerHtml}</tr></thead>
           <tbody>${rowsHtml}</tbody>
         </table>
       </div>`;
     };

   const renderObject = (o, kp = "") => {
     const keys = Object.keys(o || {});
     if (keys.length === 0) return "{}";
     const rows = keys.map(
       k => `<tr><td>${escapeHtml(k)}</td><td>${renderValue(o[k], kp ? `${kp}.${k}` : k)}</td></tr>`
     ).join("");
     return `<table class="json-table">
       <thead><tr><th>Key</th><th>Value</th></tr></thead>
       <tbody>${rows}</tbody>
     </table>`;
   };

   if (obj === null || typeof obj !== "object") {
     return `<div>${escapeHtml(path)}: ${escapeHtml(String(obj))}</div>`;
   }
   if (Array.isArray(obj)) {
     return renderArray(obj, path);
   }

   // plain object
   const headers = Object.keys(obj);
   const headerHtml = headers.map(h => `<th>${escapeHtml(h)}</th>`).join("");
   const rowCells = headers.map(h => `<td>${renderValue(obj[h], `${path}.${h}`)}</td>`).join("");

   return `<div>${escapeHtml(path)}:
     <table class="json-table">
       <thead><tr>${headerHtml}</tr></thead>
       <tbody><tr>${rowCells}</tr></tbody>
     </table>
   </div>`;
 }

export function downloadHTML(filename, contentHtml) {
  const safeName = escapeHtml(filename);
  const full = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${safeName}</title>
  <style>
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
      background: #0b1020;
      color: #e8edf7;
      padding: 20px;
    }
    .json-table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 12px;
      font-size: 13px;
      background: #111936;
      border-radius: 8px;
      overflow: hidden;
    }
    .json-table th, .json-table td {
      border: 1px solid rgba(255,255,255,.12);
      padding: 6px 10px;
      text-align: left;
    }
    .json-table th {
      background: #1a223d;
      color: #90caf9;
      font-weight: 700;
    }
    .json-table td {
      color: #e8edf7;
    }
    .json-table tr:nth-child(even) {
      background: #0e1530;
    }
    .json-table tr:hover {
      background: rgba(255,255,255,.06);
    }
  </style>
</head>
<body>
${contentHtml}
</body>
</html>`;

  const blob = new Blob([full], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}






