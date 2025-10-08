
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TruthProvider } from './context/TruthContext';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Governance from './pages/Governance';
import Community from './pages/Community';
import Liquidity from './pages/Liquidity';
import Payments from './pages/Payments';
import Social from './pages/Social';
import Lawful from './pages/Lawful';
import Shop from './pages/Shop';
import Deploy from './pages/Deploy';

function App() {
  const basename = import.meta.env.MODE === 'production' ? '/The_Truth' : '/';
  
  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <TruthProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
            <Navigation />
            <main className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/community" element={<Community />} />
              <Route path="/liquidity" element={<Liquidity />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/social" element={<Social />} />
              <Route path="/lawful" element={<Lawful />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/deploy" element={<Deploy />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </TruthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
