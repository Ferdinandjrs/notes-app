export function qs(sel, base = document) { return base.querySelector(sel); }
export function qsa(sel, base = document) { return Array.from(base.querySelectorAll(sel)); }
export function formatDate(isoString) {
try { return new Date(isoString).toLocaleString(); } catch(e) { return isoString; }
}