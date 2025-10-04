
import React, { useState, useEffect, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';

// Lazy load dashboard components
const HomeDashboard = lazy(() => import('./components/HomeDashboard.jsx'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard.jsx'));
const GovernanceDashboard = lazy(() => import('./components/GovernanceDashboard.jsx'));
const CommunityDashboard = lazy(() => import('./components/CommunityDashboard.jsx'));
const LiquidityDashboard = lazy(() => import('./components/LiquidityDashboard.jsx'));
const PaymentsDashboard = lazy(() => import('./components/PaymentsDashboard.jsx'));
const LawfulDashboard = lazy(() => import('./components/LawfulDashboard.jsx'));
const DeployDashboard = lazy(() => import('./components/DeployDashboard.jsx'));
const ShopDashboard = lazy(() => import('./components/ShopDashboard.jsx'));
const AIDashboard = lazy(() => import('./components/AIDashboard.jsx'));
const SocialDashboard = lazy(() => import('./components/SocialDashboard.jsx'));

const UnifiedDashboard = () => {
    const [currentPanel, setCurrentPanel] = useState('home');
    const [globalState, setGlobalState] = useState({
        walletConnected: false,
        walletAddress: null,
        truthBalance: 0,
        creatorBalance: 0,
        nftCount: 0
    });

    // Load panel from URL
    useEffect(() => {
        const path = window.location.pathname.replace('/', '') || 'home';
        setCurrentPanel(path);
    }, []);

    // Update global state
    const updateGlobalState = (newState) => {
        setGlobalState(prev => ({ ...prev, ...newState }));
    };

    const panels = {
        home: <HomeDashboard globalState={globalState} updateGlobalState={updateGlobalState} />,
        analytics: <AnalyticsDashboard globalState={globalState} updateGlobalState={updateGlobalState} />,
        governance: <GovernanceDashboard globalState={globalState} updateGlobalState={updateGlobalState} />,
        community: <CommunityDashboard globalState={globalState} updateGlobalState={updateGlobalState} />,
        liquidity: <LiquidityDashboard globalState={globalState} updateGlobalState={updateGlobalState} />,
        payments: <PaymentsDashboard globalState={globalState} updateGlobalState={updateGlobalState} />,
        lawful: <LawfulDashboard globalState={globalState} updateGlobalState={updateGlobalState} />,
        deploy: <DeployDashboard globalState={globalState} updateGlobalState={updateGlobalState} />,
        shop: <ShopDashboard globalState={globalState} updateGlobalState={updateGlobalState} />,
        ai: <AIDashboard globalState={globalState} updateGlobalState={updateGlobalState} />,
        social: <SocialDashboard globalState={globalState} updateGlobalState={updateGlobalState} />
    };

    return (
        <div className="unified-dashboard">
            <Suspense fallback={
                <div className="loading-panel">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            }>
                {panels[currentPanel] || panels.home}
            </Suspense>
        </div>
    );
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const root = ReactDOM.createRoot(document.getElementById('dashboard-root'));
        root.render(<UnifiedDashboard />);
    });
} else {
    const root = ReactDOM.createRoot(document.getElementById('dashboard-root'));
    root.render(<UnifiedDashboard />);
}

export default UnifiedDashboard;
