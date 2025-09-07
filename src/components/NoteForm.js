class NoteForm extends HTMLElement {
connectedCallback() {
this.innerHTML = `
<form id="noteForm">
<input type="text" id="title" placeholder="Judul catatan" required />
<textarea id="body" rows="4" placeholder="Isi catatan" required></textarea>
<button type="submit" disabled>Tambah Catatan</button>
</form>
`;


const form = this.querySelector('#noteForm');
const titleInput = this.querySelector('#title');
const bodyInput = this.querySelector('#body');
const button = this.querySelector('button');


form.addEventListener('input', () => {
button.disabled = !(titleInput.value.trim() && bodyInput.value.trim());
});


form.addEventListener('submit', (e) => {
e.preventDefault();
const title = titleInput.value.trim();
const body = bodyInput.value.trim();
this.dispatchEvent(new CustomEvent('note-submitted', { detail: { title, body }, bubbles: true, composed: true }));
form.reset();
button.disabled = true;
});
}
}
customElements.define('note-form', NoteForm);