// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'path';

// Create an instance of an Express application
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'src/views'));



// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    const title = "Welcome Home Chamo";
    res.render('home', {title});
});
app.get('/about', (req, res ) => {
    const title = "About Me Page Chatel";
    res.render('about', {title});
});
app.get('/products', (req, res ) => {
    const title = "Products You Might Like";
    res.render('products', {title});
});
app.get('/student', (req, res ) => {
    const name = "Eric";
    const id = 28178;
    const email = "eric234@gmail.com"
    const address = "54 W 1st E, Rocky Rd, TX 83940"
    const title = "Student Record"
    res.render('student', {name, id, email, address, title});
    
});

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});