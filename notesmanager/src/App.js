import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Others");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      const result = await axios.get("http://localhost:5000/notes");
      setNotes(result.data);
    };
    fetchNotes();
  }, []);

  const addNote = async (e) => {
    e.preventDefault();
    const newNote = { title, description, category };
    await axios.post("http://localhost:5000/notes", newNote);
    setTitle("");
    setDescription("");
    setCategory("Others");

    const result = await axios.get("http://localhost:5000/notes");
    setNotes(result.data);
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:5000/notes/${id}`);

    const result = await axios.get("http://localhost:5000/notes");
    setNotes(result.data);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Personal Notes Manager</h1>

      <input
        type="text"
        className="search-bar"
        placeholder="Sarceh notes by title or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form onSubmit={addNote}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Others">Others</option>
        </select>
        <button type="submit">Add Note</button>
      </form>

      {filteredNotes.map((note) => (
        <div className="note-card" key={note._id}>
          <h5>{note.title}</h5>
          <p>{note.description}</p>
          <p>
            <strong>Category:</strong> {note.category}
          </p>
          <button onClick={() => deleteNote(note._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default App;
