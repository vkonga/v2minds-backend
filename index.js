const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();
const PORT = 3000; // Change to your preferred port

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let notes = [];

// GET endpoint to fetch all notes
app.get('/notes', (req, res) => {
    res.status(200).json(notes);
});

// POST endpoint to create a new note
app.post('/notes', (req, res) => {
    const { content } = req.body;
    const newNote = {
        id: uuid(),
        content,
        createdAt: new Date().toISOString(),
    };
    notes.push(newNote);
    res.status(201).json(newNote);
});

// DELETE endpoint to delete a note by id
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = notes.length;
    notes = notes.filter(note => note.id !== id);
    
    if (notes.length < initialLength) {
        res.status(200).json({ message: 'Note deleted successfully' });
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
