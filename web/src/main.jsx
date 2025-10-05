import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered:', registration))
      .catch(error => console.log('SW registration failed:', error));
  });
}

const rootElement = document.getElementById('root')
if (rootElement) {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Failed to render app:', error)
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(to bottom right, #581c87, #000, #1e3a8a); color: white; padding: 2rem; font-family: system-ui, -apple-system, sans-serif;">
        <div style="max-width: 500px; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border-radius: 1rem; padding: 2rem; border: 1px solid rgba(255,255,255,0.1);">
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ Loading Error</h1>
          <p style="margin-bottom: 1rem; color: #cbd5e1;">The application failed to load. Please try refreshing the page.</p>
          <button onclick="location.reload()" style="width: 100%; padding: 0.75rem; background: linear-gradient(to right, #2563eb, #7c3aed); border: none; border-radius: 0.5rem; color: white; font-weight: 600; cursor: pointer;">Refresh Page</button>
        </div>
      </div>
    `
  }
} else {
  console.error('Root element not found')
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #000; color: white; padding: 2rem;">
      <div>
        <h1>Error: Root element not found</h1>
        <p>The application could not mount. Please check the console for details.</p>
      </div>
    </div>
  `
}