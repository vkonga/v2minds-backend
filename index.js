const express = require('express'); 
const app = express();    
const cors = require('cors');
const {v4:uuid} = require('uuid');
const { open } = require('sqlite');
const path = require('path');
const sqlite3 = require('sqlite3');

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

const dbPath = path.join(__dirname, "notes.db");
let db = null;
let notes = [];
// Function to initialize the database and server
const initializeDBAndServer = async () => {
    try {
        // Open the SQLite database
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        // Start the server on port 3000
        app.listen(3000, () => {
            console.log("Server Running at localhost:3000");
        });
    } catch (e) {
        // Handle database connection errors
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

// Initialize the database and server
initializeDBAndServer();

// Route to add a new note
app.post("/notes", async (request, response) => {
    try {
        const { content } = request.body;
        const addNotes = {
            id: uuid(),
            content,
            createdAt: new Date().toDateString()
        };
        notes.push(addNotes);
        response.send("Note added successfully");
    } catch (e) {
        // Handle errors during insertion
        response.send("Adding Note Unsuccessful");
    }
});

// Route to get all notes
app.get("/notes", async (request, response) => {
    try {
        response.send(notes);
    } catch (e) {
        // Handle errors during retrieval
        response.send("Error retrieving notes");
    }
});

// Route to delete a note by ID
app.delete("/notes/:id", async (request, response) => {
    const { id } = request.params;
    const initialLength = notes.length;
    notes = notes.filter(notes => note.id !== id);
   if (notes.length < initialLength) {
       response.send("Note deleted successfully");
   } else {
       response.send("Note not found");
   }
});
