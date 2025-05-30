// import React, { useState, useEffect, useCallback } from 'react';
// import './styles/styles.css';

// import Sidebar from './components/Sidebar';
// import Header from './components/Header';
// import Dashboard from './components/Dashboard';
// import BinManagement from './components/BinManagement';
// import TruckManagement from './components/TruckManagement';
// import Reports from './components/Reports';
// import RouteManagement from './components/RouteManagement';

// function App({ onLogout }) {
//   // Main state variables
//   const [activeMenu, setActiveMenu] = useState('dashboard');
//   const [activeTab, setActiveTab] = useState('tab1');
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
//   const [modalState, setModalState] = useState({ open: false, type: null, data: null });
//   const [notificationsVisible, setNotificationsVisible] = useState(false);
//   const [notifications, setNotifications] = useState([
//     { id: 1, type: 'warning', message: 'Bin #245 is 90% full', time: '10 min ago' },
//     { id: 2, type: 'error', message: 'Truck #12 requires maintenance', time: '1 hour ago' }
//   ]);

//   // Media query handler
//   const updateMedia = useCallback(() => {
//     const newIsMobile = window.innerWidth < 768;
//     setIsMobile(newIsMobile);
    
//     // Auto close sidebar on mobile
//     if (newIsMobile && sidebarOpen) {
//       setSidebarOpen(false);
//     } else if (!newIsMobile && !sidebarOpen) {
//       // Auto open sidebar on desktop
//       setSidebarOpen(true);
//     }
//   }, [sidebarOpen]);

//   useEffect(() => {
//     window.addEventListener('resize', updateMedia);
//     updateMedia();
//     return () => window.removeEventListener('resize', updateMedia);
//   }, [updateMedia]);

//   // Toggle sidebar
//   const toggleSidebar = () => {
//     setSidebarOpen(prev => !prev);
//   };

//   // Toggle notifications visibility
//   const toggleNotifications = () => {
//     setNotificationsVisible(prev => !prev);
//   };

//   // Handle menu changes
//   const handleMenuChange = (menuItem) => {
//     setActiveMenu(menuItem);
//     setActiveTab('tab1'); // Reset active tab when changing menu
    
//     // Close sidebar on mobile after menu selection
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//   };

//   // Handle tab changes - FIXED: Added console.log for debugging
//   const handleTabChange = (tab) => {
//     console.log('Changing tab to:', tab);
//     setActiveTab(tab);
//   };

//   // Handle button actions
//   const handleButtonAction = (action, data = {}) => {
//     switch (action) {
//       case 'add':
//         setModalState({ open: true, type: 'add', data: null });
//         break;
//       case 'edit':
//         setModalState({ open: true, type: 'edit', data });
//         break;
//       case 'delete':
//         setModalState({ open: true, type: 'delete', data });
//         break;
//       case 'refresh':
//         // Handle refresh - you would typically fetch fresh data here
//         console.log('Refreshing data for', activeMenu);
//         break;
//       case 'export':
//         handleExport();
//         break;
//       case 'dismiss-notification':
//         dismissNotification(data);
//         break;
//       case 'clear-notifications':
//         setNotifications([]);
//         break;
//       default:
//         console.log('Unknown action:', action);
//     }
//   };

//   // Handle data export
//   const handleExport = () => {
//     // Simulate export process
//     alert(`Exporting data from ${activeMenu}${activeTab ? ' - ' + activeTab : ''}`);
//     // In a real implementation, you'd generate and download a file here
//   };

//   // Dismiss a single notification
//   const dismissNotification = (notificationId) => {
//     setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
//   };

//   // Close modal
//   const closeModal = () => {
//     setModalState({ open: false, type: null, data: null });
//   };

//   // Save modal data
//   const saveModalData = (formData) => {
//     console.log('Saving data:', formData);
//     // Here you would typically make an API call to save the data
//     closeModal();
//   };

//   // Helper function to get entity name based on active menu
//   const getEntityName = () => {
//     switch (activeMenu) {
//       case 'bin-management': return 'Bin';
//       case 'truck-management': return 'Truck';
//       case 'route-management': return 'Route';
//       case 'reports': return 'Report';
//       default: return 'Item';
//     }
//   };

//   // FIXED: Get tabs configuration for current menu
//   const getTabsForMenu = (menuItem) => {
//     switch (menuItem) {
//       case 'dashboard':
//         return [
//           { id: 'tab1', label: 'Overview' },
//           { id: 'tab2', label: 'Statistics' },
//           { id: 'tab3', label: 'Alerts' }
//         ];
//       case 'bin-management':
//         return [
//           { id: 'tab1', label: 'All Bins' },
//           { id: 'tab2', label: 'Maintenance' },
//           { id: 'tab3', label: 'Bin Map' }
//         ];
//       case 'truck-management':
//         return [
//           { id: 'tab1', label: 'Fleet'},
//           { id: 'tab2', label: 'On Route'}
//         ];
//       case 'route-management':
//         return [
//           { id: 'tab1', label: 'routes' },
//           { id: 'tab2', label: 'assignment' },
//           { id: 'tab3', label: 'map' }
//         ];
//       case 'reports':
//         return [
//           { id: 'tab1', label: 'Summary' },
//           { id: 'tab2', label: 'Analytics' },
//           { id: 'tab3', label: 'Export' }
//         ];
//       default:
//         return [
//           { id: 'tab1', label: 'Overview' },
//           { id: 'tab2', label: 'Details' }
//         ];
//     }
//   };

//   // FIXED: Render tab headers with proper event handling
//   const renderTabHeaders = () => {
//     const tabs = getTabsForMenu(activeMenu);
    
//     return (
//       <div className="app__tabs">
//         {tabs.map(tab => (
//           <button
//             key={tab.id}
//             className={`app__tab-button ${activeTab === tab.id ? 'app__tab-button--active' : ''}`}
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               handleTabChange(tab.id);
//             }}
//             type="button"
//           >
//             {tab.label}
//           </button>
//         ))}
//         <div className="app__tab-actions">
//           <button 
//             className="app__action-button" 
//             onClick={() => handleButtonAction('refresh')}
//             title="Refresh"
//             type="button"
//           >
//             ↻
//           </button>
//           {activeMenu !== 'dashboard' && activeMenu !== 'reports' && (
//             <button 
//               className="app__action-button" 
//               onClick={() => handleButtonAction('add')}
//               title={`Add ${getEntityName()}`}
//               type="button"
//             >
//               +
//             </button>
//           )}
//           {(activeMenu === 'reports' || (activeTab === 'tab3' && activeMenu === 'reports')) && (
//             <button 
//               className="app__action-button" 
//               onClick={() => handleButtonAction('export')}
//               title="Export"
//               type="button"
//             >
//               ↓
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Render notifications panel
//   const renderNotifications = () => {
//     return (
//       <div className={`app__notifications ${notificationsVisible ? 'app__notifications--visible' : ''}`}>
//         <div className="app__notifications-header">
//           <h3>Notifications</h3>
//           <button 
//             className="app__notifications-clear"
//             onClick={() => handleButtonAction('clear-notifications')}
//             disabled={notifications.length === 0}
//             type="button"
//           >
//             Clear All
//           </button>
//         </div>
//         <div className="app__notifications-list">
//           {notifications.length === 0 ? (
//             <div className="app__notifications-empty">No new notifications</div>
//           ) : (
//             notifications.map(notification => (
//               <div key={notification.id} className={`app__notification app__notification--${notification.type}`}>
//                 <div className="app__notification-content">
//                   <div className="app__notification-message">{notification.message}</div>
//                   <div className="app__notification-time">{notification.time}</div>
//                 </div>
//                 <button 
//                   className="app__notification-dismiss"
//                   onClick={() => handleButtonAction('dismiss-notification', notification.id)}
//                   type="button"
//                 >
//                   ×
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Render modal content
//   const renderModal = () => {
//     if (!modalState.open) return null;

//     const title = modalState.type === 'add' 
//       ? `Add New ${getEntityName()}` 
//       : modalState.type === 'edit' 
//         ? `Edit ${getEntityName()}` 
//         : `Delete ${getEntityName()}`;

//     return (
//       <div className="app__modal-overlay" onClick={closeModal}>
//         <div className="app__modal" onClick={e => e.stopPropagation()}>
//           <div className="app__modal-header">
//             <h2>{title}</h2>
//             <button className="app__modal-close" onClick={closeModal} type="button">×</button>
//           </div>
//           <div className="app__modal-content">
//             {modalState.type === 'delete' ? (
//               <div className="app__modal-delete-confirm">
//                 <p>Are you sure you want to delete this {getEntityName().toLowerCase()}?</p>
//                 <p>This action cannot be undone.</p>
//               </div>
//             ) : (
//               <div className="app__modal-form">
//                 {/* Form fields would go here */}
//                 <p>Form fields for {modalState.type === 'add' ? 'adding' : 'editing'} 
//                   a {getEntityName().toLowerCase()} would go here.</p>
//               </div>
//             )}
//           </div>
//           <div className="app__modal-footer">
//             <button className="app__button app__button--secondary" onClick={closeModal} type="button">Cancel</button>
//             {modalState.type === 'delete' ? (
//               <button className="app__button app__button--danger" 
//                 onClick={() => {
//                   console.log('Deleting:', modalState.data);
//                   closeModal();
//                 }}
//                 type="button">
//                 Delete
//               </button>
//             ) : (
//               <button className="app__button app__button--primary" 
//                 onClick={() => saveModalData({
//                   // Sample form data
//                   id: modalState.type === 'edit' ? modalState.data.id : Date.now(),
//                   name: 'Sample Data',
//                   status: 'Active'
//                 })}
//                 type="button">
//                 Save
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render content based on active menu and active tab
//   const renderContent = () => {
//     // Get props to pass to all components
//     const commonProps = {
//       activeTab,
//       onAction: handleButtonAction
//     };

//     // Return the appropriate component based on activeMenu
//     switch (activeMenu) {
//       case 'dashboard':
//         return <Dashboard {...commonProps} notifications={notifications} />;
//       case 'bin-management':
//         return <BinManagement {...commonProps} />;
//       case 'truck-management':
//         return <TruckManagement {...commonProps} />;
//       case 'route-management':
//         return <RouteManagement {...commonProps} />;
//       case 'reports':
//         return <Reports {...commonProps} />;
//       default:
//         return <Dashboard {...commonProps} notifications={notifications} />;
//     }
//   };

//   // Debug: Log current state
//   console.log('Current activeMenu:', activeMenu, 'Current activeTab:', activeTab);

//   return (
//     <div className="app">
//       {isMobile && sidebarOpen && (
//         <div className="app__overlay" onClick={toggleSidebar}></div>
//       )}
      
//       <div className={`sidebar ${!sidebarOpen ? 'sidebar--collapsed' : ''}`}>
//         <Sidebar 
//           activeMenu={activeMenu} 
//           setActiveMenu={handleMenuChange} 
//           isMobile={isMobile}
//         />
//       </div>
      
//       <div className="app__main">
//         <Header 
//           onToggleSidebar={toggleSidebar} 
//           onToggleNotifications={toggleNotifications}
//           notificationCount={notifications.length}
//           onLogout={onLogout}
//         />
        
//         {renderTabHeaders()}
        
//         <div className="app__content">
//           {renderContent()}
//         </div>
        
//         {renderNotifications()}
//         {renderModal()}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect, useCallback } from 'react';
import './styles/styles.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BinManagement from './components/BinManagement';
import TruckManagement from './components/TruckManagement';
import Reports from './components/Reports';
import RouteManagement from './components/RouteManagement';

function App({ onLogout }) {
  // Main state variables
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('tab1');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [modalState, setModalState] = useState({ open: false, type: null, data: null });
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Bin #245 is 90% full', time: '10 min ago' },
    { id: 2, type: 'error', message: 'Truck #12 requires maintenance', time: '1 hour ago' }
  ]);

  // Media query handler
  const updateMedia = useCallback(() => {
    const newIsMobile = window.innerWidth < 768;
    setIsMobile(newIsMobile);
    setSidebarOpen(!newIsMobile); // Simplified logic
  }, []); // Removed sidebarOpen dependency to avoid infinite loops

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    updateMedia();
    return () => window.removeEventListener('resize', updateMedia);
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
    
    // Close sidebar on mobile after menu selection
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Handle tab changes
  const handleTabChange = (tab) => {
    console.log('Changing tab to:', tab);
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
        break;
      case 'export':
        handleExport();
        break;
      case 'dismiss-notification':
        dismissNotification(data);
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
    console.log('Saving data:', formData);
    closeModal();
  };

  // Helper function to get entity name based on active menu
  const getEntityName = () => {
    switch (activeMenu) {
      case 'bin-management': return 'Bin';
      case 'truck-management': return 'Truck';
      case 'route-management': return 'Route';
      case 'reports': return 'Report';
      default: return 'Item';
    }
  };

  // Get tabs configuration for current menu
  const getTabsForMenu = (menuItem) => {
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
          { id: 'tab2', label: 'Maintenance' },
          { id: 'tab3', label: 'Bin Map' }
        ];
      case 'truck-management':
        return [
          { id: 'tab1', label: 'Fleet'},
          { id: 'tab2', label: 'On Route'}
        ];
      case 'route-management':
        return [
          { id: 'tab1', label: 'Routes' }, 
          { id: 'tab2', label: 'Assignment' }, 
          { id: 'tab3', label: 'Map' } 
        ];
      case 'reports':
        return [
          { id: 'tab1', label: 'Summary' },
          { id: 'tab2', label: 'Analytics' },
          { id: 'tab3', label: 'Export' }
        ];
      default:
        return [
          { id: 'tab1', label: 'Overview' },
          { id: 'tab2', label: 'Details' }
        ];
    }
  };

  // Render tab headers with proper event handling
  const renderTabHeaders = () => {
    const tabs = getTabsForMenu(activeMenu);
    
    return (
      <div className="app__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`app__tab-button ${activeTab === tab.id ? 'app__tab-button--active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleTabChange(tab.id);
            }}
            type="button"
          >
            {tab.label}
          </button>
        ))}
        <div className="app__tab-actions">
          <button 
            className="app__action-button" 
            onClick={() => handleButtonAction('refresh')}
            title="Refresh"
            type="button"
          >
            ↻
          </button>
          {activeMenu !== 'dashboard' && activeMenu !== 'reports' && (
            <button 
              className="app__action-button" 
              onClick={() => handleButtonAction('add')}
              title={`Add ${getEntityName()}`}
              type="button"
            >
              +
            </button>
          )}
          {/* Fixed export button logic - should show for reports or export tab */}
          {(activeMenu === 'reports' || (activeTab === 'tab3' && activeMenu === 'reports')) && (
            <button 
              className="app__action-button" 
              onClick={() => handleButtonAction('export')}
              title="Export"
              type="button"
            >
              ↓
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render notifications panel
  const renderNotifications = () => {
    return (
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
  };

  // Render modal content
  const renderModal = () => {
    if (!modalState.open) return null;

    const title = modalState.type === 'add' 
      ? `Add New ${getEntityName()}` 
      : modalState.type === 'edit' 
        ? `Edit ${getEntityName()}` 
        : `Delete ${getEntityName()}`;

    return (
      <div className="app__modal-overlay" onClick={closeModal}>
        <div className="app__modal" onClick={e => e.stopPropagation()}>
          <div className="app__modal-header">
            <h2>{title}</h2>
            <button className="app__modal-close" onClick={closeModal} type="button">×</button>
          </div>
          <div className="app__modal-content">
            {modalState.type === 'delete' ? (
              <div className="app__modal-delete-confirm">
                <p>Are you sure you want to delete this {getEntityName().toLowerCase()}?</p>
                <p>This action cannot be undone.</p>
              </div>
            ) : (
              <div className="app__modal-form">
                {/* Form fields would go here */}
                <p>Form fields for {modalState.type === 'add' ? 'adding' : 'editing'} 
                  a {getEntityName().toLowerCase()} would go here.</p>
              </div>
            )}
          </div>
          <div className="app__modal-footer">
            <button className="app__button app__button--secondary" onClick={closeModal} type="button">Cancel</button>
            {modalState.type === 'delete' ? (
              <button className="app__button app__button--danger" 
                onClick={() => {
                  console.log('Deleting:', modalState.data);
                  closeModal();
                }}
                type="button">
                Delete
              </button>
            ) : (
              <button className="app__button app__button--primary" 
                onClick={() => saveModalData({
                  id: modalState.type === 'edit' ? modalState.data?.id : Date.now(), // Added optional chaining
                  name: 'Sample Data',
                  status: 'Active'
                })}
                type="button">
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render content based on active menu and active tab
  const renderContent = () => {
    const commonProps = {
      activeTab,
      onAction: handleButtonAction
    };

    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard {...commonProps} notifications={notifications} />;
      case 'bin-management':
        return <BinManagement {...commonProps} />;
      case 'truck-management':
        return <TruckManagement {...commonProps} />;
      case 'route-management':
        return <RouteManagement {...commonProps} />;
      case 'reports':
        return <Reports {...commonProps} />;
      default:
        return <Dashboard {...commonProps} notifications={notifications} />;
    }
  };

  // Debug log (remove in production)
  console.log('Current activeMenu:', activeMenu, 'Current activeTab:', activeTab);

  return (
    <div className="app">
      {isMobile && sidebarOpen && (
        <div className="app__overlay" onClick={toggleSidebar}></div>
      )}
      
      <div className={`sidebar ${!sidebarOpen ? 'sidebar--collapsed' : ''}`}>
        <Sidebar 
          activeMenu={activeMenu} 
          setActiveMenu={handleMenuChange} 
          isMobile={isMobile}
        />
      </div>
      
      <div className="app__main">
        <Header 
          onToggleSidebar={toggleSidebar} 
          onToggleNotifications={toggleNotifications}
          notificationCount={notifications.length}
          onLogout={onLogout}
        />
        
        {renderTabHeaders()}
        
        <div className="app__content">
          {renderContent()}
        </div>
        
        {renderNotifications()}
        {renderModal()}
      </div>
    </div>
  );
}

export default App;