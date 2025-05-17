// // src/components/Header.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import IconWrapper from './IconWrapper';
// import { Search, Bell, User, ChevronDown, Menu, Settings, LogOut, UserCircle } from 'lucide-react'; // Added UserCircle for dropdown
// import { mockData } from '../data/mockData';


// const Header = ({ onMenuToggle, isMobile }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <header className="header">
//       <div className="header-left">
//         {isMobile && (
//           <button onClick={onMenuToggle} className="header-menu-button" aria-label="Toggle menu">
//             <IconWrapper IconComponent={Menu} size={26} />
//           </button>
//         )}
//         <h1 className="header-title">Welcome, {mockData.userName}</h1>
//       </div>

//       <div className="header-right">
//         {!isMobile && (
//           <div className="search-container">
//             <IconWrapper IconComponent={Search} size={18} className="search-icon" />
//             <input type="text" placeholder="Find Something..." className="search-input" />
//           </div>
//         )}

//         <button className="header-icon-button" aria-label="Notifications">
//           <IconWrapper IconComponent={Bell} size={22} />
//           <span className="notification-badge"></span>
//         </button>

//         <div className="user-menu" ref={dropdownRef}>
//           <button
//             className="user-menu-button"
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             aria-expanded={isDropdownOpen}
//             aria-haspopup="true"
//           >
//             <IconWrapper IconComponent={User} size={24} className="user-avatar-placeholder small" />
//             {!isMobile && <span className="user-name-header">{mockData.userName}</span>}
//             <IconWrapper IconComponent={ChevronDown} size={18} />
//           </button>
//           <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
//             <a href="#" className="dropdown-item">
//               <IconWrapper IconComponent={UserCircle} size={18} /> Profile
//             </a>
//             <a href="#" className="dropdown-item">
//               <IconWrapper IconComponent={Settings} size={18} /> Settings
//             </a>
//             <a href="#" className="dropdown-item">
//               <IconWrapper IconComponent={LogOut} size={18} /> Logout
//             </a>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from 'react';
import { Bell } from 'lucide-react';
import SearchBar from './SearchBar';

const Header = () => {
  return (
    <header className="header">
      <div className="header__welcome">
        <h1 className="header__title">Welcome,</h1>
        <h2 className="header__user">Admin User</h2>
      </div>
      
      <SearchBar />
      
      <div className="header__notifications">
        <div className="header__notification-icon">
          <Bell size={20} />
          <span className="header__notification-badge">1</span>
        </div>
      </div>
    </header>
  );
};

export default Header;