// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'path';

// Create an instance of an Express application
const app = express();
app.use(express.static(path.join(__dirname, "public")));

const name = process.env.NAME;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    res.send(`Welcome, ${name}!`);
});
app.get('/new-route', (req, res ) => {
    res.send("This is a new route");
});
app.get('/about-page', (req,res) => {
    res.send("This is the about page")

});
// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});