import { useEffect, useState } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [repos, setRepos] = useState([]);
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoLink, setNewRepoLink] = useState("");

  const addRepo = async () => {
    if (!newRepoName || !newRepoLink)
      return alert("Numele și link-ul repo-ului sunt necesare");

    await API.post("/repos", { name: newRepoName, url: newRepoLink });
    setNewRepoName("");
    setNewRepoLink("");
    fetchRepos(); // reîncarcă lista pentru dropdown
  };

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  // Fetch all GitHub repos
  const fetchRepos = async () => {
    const res = await API.get("/repos");
    setRepos(res.data);
  };

  const addNote = async () => {
    if (!newTitle || !newContent)
      return alert("Titlu și conținut sunt necesare");

    await API.post("/notes", {
      title: newTitle,
      content: newContent,
      repoId: selectedRepoId, // trimite id-ul repo selectat
    });

    setNewTitle("");
    setNewContent("");
    setSelectedRepoId(null); // resetează dropdown-ul
    fetchNotes();
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  // Start editing note
  const startEditing = (note) => {
    setEditingId(note.id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  // Save edited note
  const saveEditing = async (id) => {
    if (!editingTitle || !editingContent) {
      return alert("Titlu și conținut necesare");
    }
    try {
      await API.put(`/notes/${id}`, {
        title: editingTitle,
        content: editingContent,
      });
      cancelEditing();
      fetchNotes();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  useEffect(() => {
    fetchRepos();
    fetchNotes();
  }, []);

  return (
    <div className='p-6 max-w-xl mx-auto'>
      {/* Add new Repo  */}
      <div className='flex mb-4 space-x-2'>
        <input
          type='text'
          placeholder='Nume repo GitHub'
          value={newRepoName}
          onChange={(e) => setNewRepoName(e.target.value)}
          className='border px-2 py-1 rounded flex-1'
        />
        <input
          type='text'
          placeholder='Link repo GitHub'
          value={newRepoLink}
          onChange={(e) => setNewRepoLink(e.target.value)}
          className='border px-2 py-1 rounded flex-2'
        />
        <button
          onClick={addRepo}
          className='bg-green-500 text-white px-4 rounded hover:bg-green-600'
        >
          Add Repo
        </button>
      </div>

      {/* Add new note */}
      <div className='flex mb-4 space-x-2'>
        <input
          type='text'
          placeholder='Titlu'
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className='border px-2 py-1 rounded flex-1'
        />
        <input
          type='text'
          placeholder='Conținut'
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className='border px-2 py-1 rounded flex-2'
        />
        <select
          value={selectedRepoId || ""}
          onChange={(e) => setSelectedRepoId(Number(e.target.value))}
          className='border px-2 py-1 rounded'
        >
          <option value=''>Selectează tema GitHub</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.id}>
              {repo.name}
            </option>
          ))}
        </select>
        <button
          onClick={addNote}
          className='bg-blue-500 text-white px-4 rounded hover:bg-blue-600'
        >
          Add
        </button>
      </div>

      {/* Notes list */}
      <ul>
        {notes.map((note) => (
          <li key={note.id} className='flex items-center justify-between mb-2'>
            {editingId === note.id ? (
              <div className='flex flex-grow items-center space-x-2'>
                <input
                  type='text'
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className='border px-2 py-1 flex-1 rounded'
                />
                <input
                  type='text'
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className='border px-2 py-1 flex-2 rounded'
                />
                <button
                  onClick={() => saveEditing(note.id)}
                  className='bg-green-500 text-white px-2 rounded hover:bg-green-600'
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className='bg-gray-300 px-2 rounded hover:bg-gray-400'
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className='flex-grow'>
                  <strong>{note.title}</strong>: {note.content}
                </div>
                <div className='space-x-2'>
                  <button
                    onClick={() => startEditing(note)}
                    className='text-yellow-500 hover:text-yellow-700'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className='text-red-500 hover:text-red-700'
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
