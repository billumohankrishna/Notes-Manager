const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/notes", (req, res) => {
  const { category, search } = req.query;
  let query = `SELECT * FROM notes WHERE title LIKE ? OR category LIKE ? ORDER BY created_at DESC`;

  db.all(query, [category, search], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post("/notes", (req, res) => {
  const { title, description, category } = req.body;
  const stmt = db.prepare(
    `INSERT INTO notes (title, description, category) VALUES (?, ?, ?)`
  );
  stmt.run(title, description, category, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, title, description, category });
  });
});

app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;
  const stmt = db.prepare(
    `UPDATE notes SET title = ?, description = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  );
  stmt.run(title, description, category, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ id, title, description, category });
  });
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare(`DELETE FROM notes WHERE id = ?`);
  stmt.run(id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  });
});

app.listen(5000, () => {
  console.log("Server is running");
});
