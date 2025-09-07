const BASE = 'https://notes-api.dicoding.dev/v2';


async function safeJson(res) {
const json = await res.json().catch(() => null);
if (!res.ok) {
const msg = (json && (json.message || json.error)) || `HTTP ${res.status}`;
throw new Error(msg);
}
return json;
}


export async function getAllNotes() {
const res = await fetch(`${BASE}/notes`);
const json = await safeJson(res);
// diasumsikan respon: { status: 'success', data: { notes: [...] } }
return (json && json.data && json.data.notes) ? json.data.notes : (json || []);
}


export async function createNote({ title, body }) {
const res = await fetch(`${BASE}/notes`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ title, body })
});
const json = await safeJson(res);
return (json && json.data && json.data.note) ? json.data.note : json;
}


export async function deleteNote(id) {
const res = await fetch(`${BASE}/notes/${id}`, { method: 'DELETE' });
const json = await safeJson(res);
return json;
}