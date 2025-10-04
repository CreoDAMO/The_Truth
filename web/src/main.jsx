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

// Ensure DOM is loaded
const mountApp = () => {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement)
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )
      console.log('✅ React app mounted successfully')
    } catch (error) {
      console.error('❌ Failed to mount React app:', error)
      // Fallback error display
      rootElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif;">
          <h1>Application Error</h1>
          <p>Failed to load the application. Please refresh the page.</p>
          <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error.message}</pre>
        </div>
      `
    }
  } else {
    console.error('❌ Root element not found')
  }
}

// Mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp)
} else {
  mountApp()
}