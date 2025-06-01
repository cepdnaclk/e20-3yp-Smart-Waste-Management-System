import React, { useState, useEffect, useCallback } from 'react';
import './styles/styles.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BinManagement from './components/BinManagement';
import TruckManagement from './components/TruckManagement';
import UserManagement from './components/UserManagement';
import RouteManagement from './components/RouteManagement';

function App({ onLogout }) { // onLogout is now passed from main.jsx's AppRouter
  // Main state variables
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('tab1');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Initial state based on isMobile
  const [modalState, setModalState] = useState({ open: false, type: null, data: null });
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Bin #245 is 90% full', time: '10 min ago' },
    { id: 2, type: 'error', message: 'Truck #12 requires maintenance', time: '1 hour ago' }
  ]);

  // Authentication state is removed from here
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate authentication check on mount (removed - handled by main.jsx)
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  // Media query handler
  const updateMedia = useCallback(() => {
    const newIsMobile = window.innerWidth < 768;
    setIsMobile(newIsMobile);
    // Open sidebar by default on desktop, closed on mobile,
    // unless it was explicitly changed by the user.
    // This logic might need refinement based on desired UX.
    // For now, let's keep the simple logic:
    setSidebarOpen(!newIsMobile);
  }, []);


  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    // updateMedia(); // Call once on mount to set initial state
    return () => window.removeEventListener('resize', updateMedia);
  }, [updateMedia]);

  // Call updateMedia on mount to set initial isMobile and sidebarOpen correctly
  useEffect(() => {
    updateMedia();
  }, [updateMedia]);


  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Toggle notifications visibility
  const toggleNotifications = () => {
    setNotificationsVisible(prev => !prev);
  };

  // Handle menu changes
  const handleMenuChange = (menuItem) => {
    setActiveMenu(menuItem);
    setActiveTab('tab1'); // Reset active tab when changing menu
    if (isMobile && sidebarOpen) { // Close sidebar on mobile if it's open
      setSidebarOpen(false);
    }
  };

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle button actions
  const handleButtonAction = (action, data = {}) => {
    switch (action) {
      case 'add':
        setModalState({ open: true, type: 'add', data: null });
        break;
      case 'edit':
        setModalState({ open: true, type: 'edit', data });
        break;
      case 'delete':
        setModalState({ open: true, type: 'delete', data });
        break;
      case 'refresh':
        console.log('Refreshing data for', activeMenu);
        // Add actual data fetching logic here
        break;
      case 'export':
        handleExport();
        break;
      case 'dismiss-notification':
        dismissNotification(data); // data here is notificationId
        break;
      case 'clear-notifications':
        setNotifications([]);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Handle data export
  const handleExport = () => {
    alert(`Exporting data from ${activeMenu}${activeTab ? ' - ' + activeTab : ''}`);
    // Implement actual export logic here
  };

  // Dismiss a single notification
  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  // Close modal
  const closeModal = () => {
    setModalState({ open: false, type: null, data: null });
  };

  // Save modal data
  const saveModalData = (formData) => {
    console.log('Saving data:', formData, 'for', activeMenu);
    // Add actual save logic here (e.g., API call)
    // Then potentially refresh data or update local state
    closeModal();
  };

  // Logout handler - now calls the prop from main.jsx
  const handleLogout = () => {
    // localStorage.removeItem('token'); // Handled by main.jsx
    // setIsAuthenticated(false); // Handled by main.jsx
    if (onLogout) onLogout(); // Notify parent component (AppRouter in main.jsx)
  };

  // Get entity name
  const getEntityName = () => {
    switch (activeMenu) {
      case 'bin-management': return 'Bin';
      case 'truck-management': return 'Truck';
      case 'route-management': return 'Route';
      case 'user-management': return 'User';
      default: return 'Item';
    }
  };

  // Get tabs for current menu
  const getTabsForMenu = (menuItem) => {
    // ... (your existing getTabsForMenu function - no changes needed)
    switch (menuItem) {
      case 'dashboard':
        return [
          { id: 'tab1', label: 'Overview' },
          { id: 'tab2', label: 'Statistics' },
          { id: 'tab3', label: 'Alerts' }
        ];
      case 'bin-management':
        return [
          { id: 'tab1', label: 'All Bins' },
          { id: 'tab2', label: 'Active Bins' },
          { id: 'tab3', label: 'Maintenance' },
          { id: 'tab4', label: 'Bin Map' }
        ];
      case 'truck-management':
        return [
          { id: 'tab1', label: 'Fleet' },
          { id: 'tab2', label: 'On Route' }
        ];
      case 'route-management':
        return [
          { id: 'tab1', label: 'Routes' },
          { id: 'tab2', label: 'Assignment' },
          { id: 'tab3', label: 'Map' }
        ];
      case 'user-management':
        return [
          { id: 'tab1', label: 'Collectors' },
          { id: 'tab2', label: 'Bin Users' },
          { id: 'tab3', label: 'Admins' }
        ];
      default:
        return [
          { id: 'tab1', label: 'Overview' },
          { id: 'tab2', label: 'Details' }
        ];
    }
  };

  // Render tab headers
  const renderTabHeaders = () => {
    const tabs = getTabsForMenu(activeMenu);
    if (!tabs || tabs.length === 0) return null; // Handle case where no tabs
    return (
      <div className="app__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`app__tab-button ${activeTab === tab.id ? 'app__tab-button--active' : ''}`}
            onClick={(e) => {
              e.preventDefault(); // Good practice for buttons not submitting forms
              // e.stopPropagation(); // Usually not needed unless specific event bubbling issues
              handleTabChange(tab.id);
            }}
            type="button"
          >
            {tab.label}
          </button>
        ))}
        <div className="app__tab-actions">
          <button className="app__action-button" onClick={() => handleButtonAction('refresh')} title="Refresh" type="button">
            ↻
          </button>
          {activeMenu !== 'dashboard' && (
            <button className="app__action-button" onClick={() => handleButtonAction('add')} title={`Add ${getEntityName()}`} type="button">
              +
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render notifications
  const renderNotifications = () => (
    // ... (your existing renderNotifications function - no changes needed)
    <div className={`app__notifications ${notificationsVisible ? 'app__notifications--visible' : ''}`}>
      <div className="app__notifications-header">
        <h3>Notifications</h3>
        <button
          className="app__notifications-clear"
          onClick={() => handleButtonAction('clear-notifications')}
          disabled={notifications.length === 0}
          type="button"
        >
          Clear All
        </button>
      </div>
      <div className="app__notifications-list">
        {notifications.length === 0 ? (
          <div className="app__notifications-empty">No new notifications</div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className={`app__notification app__notification--${notification.type}`}>
              <div className="app__notification-content">
                <div className="app__notification-message">{notification.message}</div>
                <div className="app__notification-time">{notification.time}</div>
              </div>
              <button
                className="app__notification-dismiss"
                onClick={() => handleButtonAction('dismiss-notification', notification.id)}
                title="Dismiss notification"
                type="button"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Render modal
  const renderModal = () => {
    // ... (your existing renderModal function - no changes needed)
    if (!modalState.open) return null;
    const currentEntityName = getEntityName(); // Get current entity name
    const title =
      modalState.type === 'add'
        ? `Add New ${currentEntityName}`
        : modalState.type === 'edit'
        ? `Edit ${currentEntityName}`
        : `Delete ${currentEntityName}`;
    return (
      <div className="app__modal-overlay" onClick={closeModal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="app__modal" onClick={(e) => e.stopPropagation()}>
          <div className="app__modal-header">
            <h2 id="modal-title">{title}</h2>
            <button className="app__modal-close" onClick={closeModal} type="button" aria-label="Close modal">
              ×
            </button>
          </div>
          <div className="app__modal-content">
            {modalState.type === 'delete' ? (
              <div className="app__modal-delete-confirm">
                <p>Are you sure you want to delete this {currentEntityName.toLowerCase()}?</p>
                {modalState.data && modalState.data.name && <p><strong>Item: {modalState.data.name}</strong></p>}
                <p>This action cannot be undone.</p>
              </div>
            ) : (
              <div className="app__modal-form">
                {/* TODO: Implement actual forms here based on modalState.type and activeMenu */}
                <p>Form fields for {modalState.type === 'add' ? 'adding' : 'editing'} a {currentEntityName.toLowerCase()} would go here.</p>
                {modalState.type === 'edit' && modalState.data && (
                  <p>Editing item with ID: {modalState.data.id}</p>
                )}
              </div>
            )}
          </div>
          <div className="app__modal-footer">
            <button className="app__button app__button--secondary" onClick={closeModal} type="button">
              Cancel
            </button>
            {modalState.type === 'delete' ? (
              <button
                className="app__button app__button--danger"
                onClick={() => {
                  console.log('Deleting:', modalState.data);
                  // Add actual delete API call here
                  closeModal();
                  // Potentially refresh data after delete
                  handleButtonAction('refresh');
                }}
                type="button"
              >
                Delete
              </button>
            ) : (
              <button
                className="app__button app__button--primary"
                onClick={() =>
                  // TODO: Gather data from actual form fields
                  saveModalData({
                    id: modalState.type === 'edit' && modalState.data ? modalState.data.id : Date.now(), // Ensure modalState.data exists for edit
                    name: 'Sample Data Input', // Replace with actual form data
                    // ... other fields
                  })
                }
                type="button"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render content
  const renderContent = () => {
    // ... (your existing renderContent function - no changes needed)
    const commonProps = { activeTab, onAction: handleButtonAction, isMobile };
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard {...commonProps} notifications={notifications} />;
      case 'bin-management':
        return <BinManagement {...commonProps} />;
      case 'truck-management':
        return <TruckManagement {...commonProps} />;
      case 'route-management':
        return <RouteManagement {...commonProps} />;
      case 'user-management':
        return <UserManagement {...commonProps} />;
      default: // Fallback to dashboard or an error/empty state component
        return <Dashboard {...commonProps} notifications={notifications} />;
    }
  };

  // Removed unauthenticated section - App component will only render if authenticated (handled by main.jsx)
  // if (!isAuthenticated) { ... }

  return (
    <div className="app">
      {isMobile && sidebarOpen && <div className="app__overlay" onClick={toggleSidebar} role="button" tabIndex={0} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') toggleSidebar();}} aria-label="Close sidebar"></div>}
      <div className={`sidebar ${sidebarOpen ? '' : 'sidebar--collapsed'}`}> {/* Simpler toggle */}
        <Sidebar activeMenu={activeMenu} setActiveMenu={handleMenuChange} isMobile={isMobile} sidebarOpen={sidebarOpen} />
      </div>
      <div className="app__main">
        <Header
          onToggleSidebar={toggleSidebar}
          onToggleNotifications={toggleNotifications}
          notificationCount={notifications.length}
          onLogout={handleLogout} // This now calls main.jsx's logout
          sidebarOpen={sidebarOpen}
        />
        {renderTabHeaders()}
        <div className="app__content">{renderContent()}</div>
        {renderNotifications()}
        {renderModal()}
      </div>
    </div>
  );
}

export default App;