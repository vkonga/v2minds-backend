const express = require('express'); 
const app = express();    
const cors = require('cors');
const { open } = require('sqlite');
const path = require('path');
const sqlite3 = require('sqlite3');

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

const dbPath = path.join(__dirname, "notes.db");
let db = null;

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
        const { id, content, createdAt } = request.body;
        // SQL query to insert a new note
        const addNotes = `
            INSERT INTO notes(id, content, created_at)
            VALUES (${id}, '${content}', '${createdAt}');
        `;
        // Execute the query
        const notes = await db.run(addNotes);
        // Respond with a success message
        response.send(notes);
    } catch (e) {
        // Handle errors during insertion
        response.send("Adding Note Unsuccessful");
    }
});

// Route to get all notes
app.get("/notes", async (request, response) => {
    try {
        // SQL query to select all notes
        const getNotes = `
            SELECT * FROM notes;
        `;
        // Execute the query and get the results
        const notes = await db.all(getNotes);
        // Respond with the retrieved notes
        response.send(notes);
    } catch (e) {
        // Handle errors during retrieval
        response.send("Error retrieving notes");
    }
});

// Route to delete a note by ID
app.delete("/notes/:id", async (request, response) => {
    const { id } = request.params;
    try {
        // SQL query to delete a note by ID
        const deleteQuery = `
            DELETE FROM notes 
            WHERE id = ${id};
        `;
        // Execute the query
        const deleteNotes = await db.run(deleteQuery);
        // Respond with a success message
        response.send(deleteNotes);
    } catch (e) {
        // Handle errors during deletion
        response.send("Error deleting note");
    }
});
