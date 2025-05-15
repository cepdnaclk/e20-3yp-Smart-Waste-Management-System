// src/components/Sidebar.jsx
import React from 'react';
import SidebarLink from './SideBarLink';
import IconWrapper from './IconWrapper';
import { mockData } from '../data/mockData';
import {
  LayoutDashboard, Trash2, Truck, MapPinned, BarChart3, Users, Settings, LifeBuoy, LogOut, CircleUserRound, X, Package
} from 'lucide-react'; // Package for GreenPulse logo

const Sidebar = ({ sidebarState, toggleSidebar, activeMenu, setActiveMenu, isMobile }) => {
  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    if (isMobile && sidebarState !== 'closed-mobile') { // if mobile and sidebar is open
      toggleSidebar('force-close-mobile'); // force close on mobile after click
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Bin Management', icon: Trash2 },
    { name: 'Truck Management', icon: Truck },
    { name: 'Monitoring', icon: MapPinned },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Users', icon: Users },
  ];

  const bottomNavItems = [
    { name: 'Settings', icon: Settings },
    { name: 'Support', icon: LifeBuoy },
  ];

  const isEffectivelyCollapsed = !isMobile && sidebarState === 'collapsed-desktop';

  return (
    <aside className={`sidebar ${sidebarState}`}>
      {isMobile && sidebarState === 'open-mobile' && (
        <button
          onClick={() => toggleSidebar('force-close-mobile')}
          className="sidebar-close-button"
          aria-label="Close sidebar"
        >
          <IconWrapper IconComponent={X} size={28} />
        </button>
      )}
      <div className="sidebar-content-wrapper">
        <div className="sidebar-logo-container">
          <IconWrapper IconComponent={Package} size={isEffectivelyCollapsed ? 36 : 40} className="sidebar-logo-icon" />
          {!isEffectivelyCollapsed && <span className="sidebar-logo-text">GreenPulse</span>}
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map(item => (
              <SidebarLink
                key={item.name}
                IconComponent={item.icon}
                text={item.name}
                isActive={activeMenu === item.name}
                onClick={() => handleMenuClick(item.name)}
                isCollapsed={isEffectivelyCollapsed}
              />
            ))}
          </ul>
        </nav>

        <div className="sidebar-bottom-section">
           <ul className="sidebar-bottom-nav">
            {bottomNavItems.map(item => (
              <SidebarLink
                key={item.name}
                IconComponent={item.icon}
                text={item.name}
                isActive={activeMenu === item.name}
                onClick={() => handleMenuClick(item.name)}
                isCollapsed={isEffectivelyCollapsed}
              />
            ))}
          </ul>
          <div className="sidebar-user-profile">
            <IconWrapper IconComponent={CircleUserRound} size={40} className="user-avatar-placeholder" />
            {!isEffectivelyCollapsed && (
              <div className="sidebar-user-info">
                <p className="user-name">{mockData.userName}</p>
                <p className="user-role">Admin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;