import './components/AppBar.js';
import './components/NoteCard.js';
import './components/NoteForm.js';
import './components/LoadingIndicator.js';
import './styles/style.css';
import { qs } from './utils/dom.js';
import * as notesApi from './api/notesApi.js';

document.addEventListener('DOMContentLoaded', () => {
  const notesListEl = qs('#notes-list');
  const loadingEl = qs('loading-indicator');

  let notes = [];

  // Tampilkan / sembunyikan loading (menggunakan method pada web component)
  function setLoading(show) {
    if (!loadingEl) return;
    if (show) loadingEl.show();
    else loadingEl.hide();
  }

  // Render daftar notes ke DOM
  function renderNotes() {
    notesListEl.innerHTML = '';
    if (!notes || notes.length === 0) {
      notesListEl.innerHTML = '<p>Tidak ada catatan</p>';
      return;
    }

    notes.forEach(note => {
      const card = document.createElement('note-card');
      card.noteData = note;
      notesListEl.appendChild(card);
    });
  }

  // Helper: normalisasi hasil GET notes (menangani beberapa bentuk respons)
  function normalizeNotesResponse(res) {
    if (Array.isArray(res)) return res;
    if (res && res.data && Array.isArray(res.data.notes)) return res.data.notes;
    if (res && Array.isArray(res.notes)) return res.notes;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  }

  // Ambil data dari API dan render
  async function loadNotes() {
    setLoading(true);
    try {
      const res = await notesApi.getAllNotes();
      notes = normalizeNotesResponse(res);
      renderNotes();
    } catch (err) {
      console.error('Gagal memuat notes:', err);
      notesListEl.innerHTML = '<div class="note-card">Gagal memuat catatan. Cek koneksi atau lihat console.</div>';
    } finally {
      setLoading(false);
    }
  }

  // Helper: normalisasi hasil POST (kembalian create)
  function normalizeNoteResponse(obj) {
    if (!obj) return null;
    if (obj.id) return obj;
    if (obj.data && obj.data.note) return obj.data.note;
    if (obj.note) return obj.note;
    if (obj.data && Array.isArray(obj.data.notes) && obj.data.notes.length) return obj.data.notes[0];
    return null;
  }

  // Tangani event submit dari NoteForm (komponen)
  window.addEventListener('note-submitted', async (e) => {
    const { title, body } = e.detail || {};
    if (!title || !body) return;

    setLoading(true);
    try {
      const created = await notesApi.createNote({ title, body });
      const createdNote = normalizeNoteResponse(created);

      if (createdNote && createdNote.id) {
        notes.unshift(createdNote);
        renderNotes();
      } else {
        // fallback: reload seluruh daftar jika API tidak mengembalikan object note
        await loadNotes();
      }
    } catch (err) {
      console.error('Gagal membuat catatan:', err);
      alert('Gagal membuat catatan: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  });

  // Tangani event delete yang dikirim dari NoteCard
  window.addEventListener('note-delete', async (e) => {
    const id = e.detail && e.detail.id;
    if (!id) return;

    const confirmed = confirm('Yakin ingin menghapus catatan ini?');
    if (!confirmed) return;

    setLoading(true);
    try {
      await notesApi.deleteNote(id);
      notes = notes.filter(n => String(n.id) !== String(id));
      renderNotes();
    } catch (err) {
      console.error('Gagal menghapus catatan:', err);
      alert('Gagal menghapus catatan: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  });

  // Boot aplikasi: muat data pertama kali
  loadNotes();
});
