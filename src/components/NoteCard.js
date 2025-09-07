import { formatDate } from '../utils/dom.js';


class NoteCard extends HTMLElement {
set noteData(note) {
this._note = note;
this.render();
}
render() {
const note = this._note;
this.innerHTML = `
<div class="note-card">
<h3>${note.title}</h3>
<p>${note.body}</p>
<small>Dibuat: ${formatDate(note.createdAt || note.created_at || '')}</small>
<div style="margin-top:0.6rem; display:flex; gap:0.5rem;">
<button class="delete">Hapus</button>
</div>
</div>
`;
this.querySelector('.delete').addEventListener('click', () => {
this.dispatchEvent(new CustomEvent('note-delete', { detail: { id: note.id }, bubbles: true, composed: true }));
});
}
}
customElements.define('note-card', NoteCard);