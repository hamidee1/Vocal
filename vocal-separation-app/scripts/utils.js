// Utilities: file validation, querystring, etc.
export function qs(sel, root=document){ return root.querySelector(sel); }
export function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
export function toQuery(params){ return new URLSearchParams(params).toString(); }
export function parseQuery(){ return Object.fromEntries(new URLSearchParams(location.search).entries()); }
export function fmtBytes(bytes){
  if(bytes===0) return '0 B';
  const k=1024, sizes=['B','KB','MB','GB']; const i=Math.floor(Math.log(bytes)/Math.log(k));
  return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+sizes[i];
}