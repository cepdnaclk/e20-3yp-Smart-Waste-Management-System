// src/components/IconWrapper.jsx
import React from 'react';

const IconWrapper = ({ IconComponent, size, color, strokeWidth, className = '', 'aria-label': ariaLabel }) => {
  if (!IconComponent) {
    return null;
  }
  return (
    <IconComponent
      className={`icon-wrapper ${className}`}
      size={size || 20}
      color={color || 'currentColor'}
      strokeWidth={strokeWidth || 2}
      aria-hidden={!ariaLabel ? true : undefined}
      aria-label={ariaLabel}
    />
  );
};

export default IconWrapper;