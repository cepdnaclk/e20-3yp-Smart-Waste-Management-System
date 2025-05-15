// src/components/StatCard.jsx
import React from 'react';
import IconWrapper from './IconWrapper'; // If you plan to use icons inside StatCard

const StatCard = ({ title, value, valueColor, subValue, Icon, children }) => {
  return (
    <div className="stat-card">
      <div>
        <h3 className="stat-card-title">{title}</h3>
        {value && <p className="stat-card-value" style={valueColor ? { color: valueColor } : {}}>{value}</p>}
        {subValue && <p className="stat-card-subvalue">{subValue}</p>}
      </div>
      {/* If you have specific content like truck/maintenance details */}
      {children && <div className="stat-card-custom-content">{children}</div>}
      {Icon && (
        <div className="stat-card-icon-container">
          <IconWrapper IconComponent={Icon} size={28} />
        </div>
      )}
    </div>
  );
};

export default StatCard;