import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Simple app that demonstrates the Vite build system
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>VibeChat Development Environment</h1>
          <p>
            This is the Vite-based development environment for VibeChat.
          </p>
          <nav>
            <a href="/vibechat-web" target="_blank" rel="noopener noreferrer">
              Open Next.js Landing Page
            </a>
          </nav>
        </header>
      </div>
    </Router>
  );
}

export default App;
