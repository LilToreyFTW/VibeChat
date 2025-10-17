/**
 * VibeChat Update Server
 * Serves update files for the desktop application
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the electron dist directory
app.use('/updates', express.static(path.join(__dirname, 'clients_chat_exe', 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'VibeChat Update Server',
    port: PORT
  });
});

// List available updates
app.get('/updates', async (req, res) => {
  try {
    const updatesDir = path.join(__dirname, 'clients_chat_exe', 'dist');
    const files = await fs.readdir(updatesDir);

    const updateFiles = files.filter(file =>
      file.endsWith('.exe') ||
      file.endsWith('.yml') ||
      file.endsWith('.json') ||
      file.includes('VibeChat')
    );

    res.json({
      success: true,
      updates: updateFiles,
      count: updateFiles.length,
      server: 'VibeChat Update Server',
      url: `http://localhost:${PORT}/updates/`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to list updates',
      message: error.message
    });
  }
});

// Latest release info endpoint
app.get('/updates/latest', async (req, res) => {
  try {
    const updatesDir = path.join(__dirname, 'clients_chat_exe', 'dist');
    const files = await fs.readdir(updatesDir);

    // Look for the latest release files
    const exeFiles = files.filter(file => file.endsWith('.exe') && file.includes('VibeChat'));
    const ymlFiles = files.filter(file => file.endsWith('.yml'));

    if (exeFiles.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No update files found'
      });
    }

    // Get the latest file (assuming naming convention includes version)
    const latestExe = exeFiles.sort().pop();
    const version = latestExe.match(/(\d+\.\d+\.\d+)/)?.[1] || '1.0.0';

    res.json({
      success: true,
      version: version,
      files: {
        exe: latestExe,
        yml: ymlFiles.find(yml => yml.includes(version)) || ymlFiles[0]
      },
      downloadUrl: `http://localhost:${PORT}/updates/${latestExe}`,
      releaseDate: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get latest update',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VibeChat Update Server running on port ${PORT}`);
  console.log(`📡 Update URL: http://localhost:${PORT}/updates/`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`📋 Latest Update: http://localhost:${PORT}/updates/latest`);
  console.log('');
  console.log('📦 To serve updates:');
  console.log('   1. Build the electron app: npm run build');
  console.log('   2. Copy files to clients_chat_exe/dist/');
  console.log('   3. Updates will be available at the URLs above');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down update server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down update server');
  process.exit(0);
});

module.exports = app;
