// src/components/SidebarLink.jsx
import React from 'react';
import IconWrapper from './IconWrapper';

const SidebarLink = ({ IconComponent, text, isActive, onClick, isCollapsed }) => {
  return (
    <li>
      <a
        href="#"
        className={`sidebar-link ${isActive ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        title={isCollapsed ? text : undefined} // Show full text on hover when collapsed
      >
        {IconComponent && <IconWrapper IconComponent={IconComponent} size={22} />}
        {!isCollapsed && <span className="sidebar-link-text">{text}</span>}
      </a>
    </li>
  );
};

export default SidebarLink;