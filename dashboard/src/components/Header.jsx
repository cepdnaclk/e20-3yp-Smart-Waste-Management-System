import React from 'react';
import { Bell } from 'lucide-react';
import SearchBar from './SearchBar';

const Header = (props) => {
  return (
    <header className="header">
      <div className="header__welcome">
        <h1 className="header__title">Welcome,</h1>
        <h2 className="header__user">Admin User</h2>
      </div>
      
      <SearchBar />
      <div></div>
      {/* Logout Button */}
      
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
