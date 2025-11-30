const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 9000;

// Enable CORS for all origins
app.use(cors());

// Serve static files from current directory
app.use(express.static(__dirname));

// Specific route for import-map.json with proper headers
app.get('/import-map.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, 'import-map.json'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Config server running on http://localhost:${PORT}`);
  console.log(`📋 Import map available at http://localhost:${PORT}/import-map.json`);
});