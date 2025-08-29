const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the root directory
// This will serve index.html, deploy.html, shop.html, app.js, etc.
// Serve static files from current directory and parent
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '..')));

// Serve contract artifacts specifically
app.use('/contract-artifacts.js', express.static(path.join(__dirname, '..', 'contract-artifacts.js')));


// API Routes (example)
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Catch-all for serving the main HTML file for client-side routing
// This should be the last route defined
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});