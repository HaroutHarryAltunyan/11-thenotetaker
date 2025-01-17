const express = require('express');
const path = require('path');
const api = require('./routes/apiRoutes.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', api);

// Serve static assets from the "public" directory
app.use(express.static('public'));

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Wildcard route to redirect to the homepage for unmatched routes
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Start the server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);