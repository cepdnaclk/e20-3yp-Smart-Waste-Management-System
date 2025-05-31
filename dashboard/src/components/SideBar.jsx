import React from 'react';
import { 
  LayoutDashboard, 
  Trash2, 
  Truck, 
  LineChart, 
  BarChart, 
  Users, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'bin-management', label: 'Bin Management', icon: <Trash2 size={20} /> },
    { id: 'truck-management', label: 'Truck Management', icon: <Truck size={20} /> },
    { id: 'garbage-collection', label: 'Garbage Collection Monitoring', icon: <LineChart size={20} /> },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart size={20} /> },
    { id: 'user-management', label: 'User Management', icon: <Users size={20} /> },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src="../public/Logo.png" alt="GreenPulse Logo" className="sidebar__logo-img" />
       
      </div>
      
      <nav className="sidebar__menu">
        <ul className="sidebar__menu-list">
          {menuItems.map((item) => (
            <li 
              key={item.id}
              className={`sidebar__menu-item ${activeTab === item.id ? 'sidebar__menu-item--active' : ''}`}
              onClick={() => handleTabChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar__footer">
        <div 
          className={`sidebar__footer-item ${activeTab === 'settings' ? 'sidebar__footer-item--active' : ''}`}
          onClick={() => handleTabChange('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </div>
        <div 
          className={`sidebar__footer-item ${activeTab === 'support' ? 'sidebar__footer-item--active' : ''}`}
          onClick={() => handleTabChange('support')}
        >
          <HelpCircle size={20} />
          <span>Support</span>
        </div>
      </div>
      
      <div className="sidebar__user">
        <div className="sidebar__user-avatar">A</div>
        <span className="sidebar__user-name">Admin User</span>
      </div>
    </aside>
  );
};

export default Sidebar;