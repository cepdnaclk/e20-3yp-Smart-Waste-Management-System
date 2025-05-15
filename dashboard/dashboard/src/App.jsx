// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/SideBar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import { mockData } from './data/mockData';
import './styles/styles.css'; // Import the CSS file

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Sidebar states: 'open-desktop', 'collapsed-desktop', 'open-mobile', 'closed-mobile'
  const [sidebarState, setSidebarState] = useState(window.innerWidth < 768 ? 'closed-mobile' : 'open-desktop');
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const updateMedia = useCallback(() => {
    const mobileCheck = window.innerWidth < 768;
    setIsMobile(mobileCheck);
    
    // Adjust sidebar state on resize
    if (mobileCheck) {
      // If moving to mobile, and sidebar was desktop open/collapsed, close it on mobile
      if (sidebarState === 'open-desktop' || sidebarState === 'collapsed-desktop') {
        setSidebarState('closed-mobile');
      }
    } else {
      // If moving to desktop, and sidebar was mobile-open/closed, set to default desktop state (e.g., open)
      if (sidebarState === 'open-mobile' || sidebarState === 'closed-mobile') {
         setSidebarState('open-desktop'); // Or 'collapsed-desktop' if that's preferred default
      }
    }
  }, [sidebarState]); // Include sidebarState to avoid stale closures if logic depends on current state

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    updateMedia(); // Initial check
    return () => window.removeEventListener('resize', updateMedia);
  }, [updateMedia]);

  const toggleSidebar = (forceState) => {
    if (forceState === 'force-close-mobile') {
        setSidebarState('closed-mobile');
        return;
    }

    if (isMobile) {
      setSidebarState(prevState => prevState === 'closed-mobile' ? 'open-mobile' : 'closed-mobile');
    } else {
      // Desktop toggle between open and collapsed
      setSidebarState(prevState => prevState === 'open-desktop' ? 'collapsed-desktop' : 'open-desktop');
    }
  };

  const mainContentClass = isMobile ? '' : (sidebarState === 'open-desktop' ? 'sidebar-open-desktop' : 'sidebar-collapsed-desktop');


  return (
    <div className="app-container">
      <Sidebar
        sidebarState={sidebarState}
        toggleSidebar={toggleSidebar}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobile={isMobile}
      />
      {isMobile && sidebarState === 'open-mobile' && (
        <div
          onClick={() => toggleSidebar('force-close-mobile')}
          className="mobile-overlay"
          aria-hidden="true"
        ></div>
      )}
      <div className={`main-content-area ${mainContentClass}`}>
        <Header
          onMenuToggle={toggleSidebar}
          isMobile={isMobile}
        />
        <main className="content-scroll-area"> {/* Added for clarity if main content needs its own scroll */}
          {activeMenu === 'Dashboard' && <DashboardView isMobile={isMobile}/>}
          {activeMenu !== 'Dashboard' && (
            <div className="placeholder-view">
              <h2 className="placeholder-view-title">{activeMenu}</h2>
              <p>Content for {activeMenu.toLowerCase()} will be displayed here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;