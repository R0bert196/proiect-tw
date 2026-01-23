import { useEffect, useState } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [repos, setRepos] = useState([]);
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [editingRepoId, setEditingRepoId] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoLink, setNewRepoLink] = useState("");
  const [editingRepoItemId, setEditingRepoItemId] = useState(null);
  const [editingRepoName, setEditingRepoName] = useState("");
  const [editingRepoLink, setEditingRepoLink] = useState("");

  // --- Notes ---
  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const addNote = async () => {
    if (!newTitle || !newContent)
      return alert("Titlu și conținut sunt necesare");

    await API.post("/notes", {
      title: newTitle,
      content: newContent,
      repoId: selectedRepoId,
    });
    setNewTitle("");
    setNewContent("");
    setSelectedRepoId(null);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  const startEditingNote = (note) => {
    setEditingId(note.id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
    setEditingRepoId(note.repoId || "");
  };

  const cancelEditingNote = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
    setEditingRepoId(null);
  };

  const saveEditingNote = async (id) => {
    if (!editingTitle || !editingContent)
      return alert("Titlu și conținut necesare");

    await API.put(`/notes/${id}`, {
      title: editingTitle,
      content: editingContent,
      repoId: editingRepoId || null,
    });
    cancelEditingNote();
    fetchNotes();
  };

  // --- Repos ---
  const fetchRepos = async () => {
    const res = await API.get("/repos");
    setRepos(res.data);
  };

  const addRepo = async () => {
    if (!newRepoName || !newRepoLink) return alert("Nume și link necesare");

    await API.post("/repos", { name: newRepoName, url: newRepoLink });
    setNewRepoName("");
    setNewRepoLink("");
    fetchRepos();
  };

  const startEditingRepo = (repo) => {
    setEditingRepoItemId(repo.id);
    setEditingRepoName(repo.name);
    setEditingRepoLink(repo.url);
  };

  const cancelEditingRepo = () => {
    setEditingRepoItemId(null);
    setEditingRepoName("");
    setEditingRepoLink("");
  };

  const saveEditingRepo = async (id) => {
    if (!editingRepoName || !editingRepoLink)
      return alert("Nume și link necesare");

    await API.put(`/repos/${id}`, {
      name: editingRepoName,
      url: editingRepoLink,
    });
    cancelEditingRepo();
    fetchRepos();
  };

  const deleteRepo = async (id) => {
    await API.delete(`/repos/${id}`);
    fetchRepos();
  };

  useEffect(() => {
    fetchNotes();
    fetchRepos();
  }, []);

  return (
    <div className='p-6 max-w-xl mx-auto'>
      {/* --- Repos Section --- */}
      <h2 className='text-lg font-bold mb-2'>GitHub Repos</h2>
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
      <ul className='mb-6'>
        {repos.map((repo) =>
          editingRepoItemId === repo.id ? (
            <li key={repo.id} className='flex items-center space-x-2 mb-2'>
              <input
                type='text'
                value={editingRepoName}
                onChange={(e) => setEditingRepoName(e.target.value)}
                className='border px-2 py-1 flex-1 rounded'
              />
              <input
                type='text'
                value={editingRepoLink}
                onChange={(e) => setEditingRepoLink(e.target.value)}
                className='border px-2 py-1 flex-2 rounded'
              />
              <button
                onClick={() => saveEditingRepo(repo.id)}
                className='bg-green-500 text-white px-2 rounded hover:bg-green-600'
              >
                Save
              </button>
              <button
                onClick={cancelEditingRepo}
                className='bg-gray-300 px-2 rounded hover:bg-gray-400'
              >
                Cancel
              </button>
            </li>
          ) : (
            <li
              key={repo.id}
              className='flex justify-between items-center mb-2'
            >
              <div>
                <strong>{repo.name}</strong> ({repo.url})
              </div>
              <div className='space-x-2'>
                <button
                  onClick={() => startEditingRepo(repo)}
                  className='text-yellow-500 hover:text-yellow-700'
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRepo(repo.id)}
                  className='text-red-500 hover:text-red-700'
                >
                  Delete
                </button>
              </div>
            </li>
          )
        )}
      </ul>

      {/* --- Notes Section --- */}
      <h2 className='text-lg font-bold mb-2'>Notes</h2>
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
          <option value=''>Selecteaza tema GitHub</option>
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

      <ul>
        {notes.map((note) => {
          const repoName = note.repo?.name || "";
          return (
            <li
              key={note.id}
              className='flex items-center justify-between mb-2'
            >
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
                  <select
                    value={editingRepoId || ""}
                    onChange={(e) => setEditingRepoId(Number(e.target.value))}
                    className='border px-2 py-1 rounded'
                  >
                    <option value=''>Selecteaza tema GitHub</option>
                    {repos.map((repo) => (
                      <option key={repo.id} value={repo.id}>
                        {repo.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => saveEditingNote(note.id)}
                    className='bg-green-500 text-white px-2 rounded hover:bg-green-600'
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditingNote}
                    className='bg-gray-300 px-2 rounded hover:bg-gray-400'
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className='flex-grow'>
                    <strong>{note.title}</strong>: {note.content}{" "}
                    {repoName && (
                      <span className='text-sm text-gray-500'>
                        ({repoName})
                      </span>
                    )}
                  </div>
                  <div className='space-x-2'>
                    <button
                      onClick={() => startEditingNote(note)}
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
          );
        })}
      </ul>
    </div>
  );
}
