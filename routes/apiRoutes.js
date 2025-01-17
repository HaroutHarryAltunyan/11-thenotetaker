const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

const router = express.Router();
const dbPath = path.join(__dirname, '../db/db.json');

// GET /api/notes - Retrieve all notes
router.get('/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// POST /api/notes - Add a new note
router.post('/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Note must have a title and text' });
  }

  const newNote = {
    id: uniqid(),
    title,
    text,
  };

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save note' });
      }
      res.json(newNote);
    });
  });
});

// DELETE /api/notes/:id - Delete a note by ID
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }

    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== noteId);

    fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete note' });
      }
      res.json({ message: `Note ${noteId} deleted` });
    });
  });
});

module.exports = router;