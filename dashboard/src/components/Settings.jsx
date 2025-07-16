import React from 'react';
import { User, Shield, LogOut, Edit } from 'lucide-react';
import '../styles/Settings.css'; // Uses a dedicated CSS file for the dark theme

/**
 * A simple, dark-themed settings page.
 * @param {object} props - The component props.
 * @param {object} props.user - An object containing user details.
 * @param {string} props.user.fullName - The user's full name.
 * @param {string} props.user.email - The user's email address.
 * @param {string} props.user.avatar - URL to the user's avatar image.
 * @param {string} props.user.role - The user's role (e.g., 'Administrator').
 * @param {string} props.user.memberSince - The date the user joined.
 * @param {function} props.onLogout - The function to call when the logout button is clicked.
 */
const Settings = ({ user, onLogout }) => {
  // If no user data is provided, show a loading or empty state
  if (!user) {
    return (
      <div className="settings-page-dark">
        <p>Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="settings-page-dark">
      <div className="settings-card-dark">
        
        {/* User Avatar and Name
        <div className="profile-header">
          <h1 className="profile-name">{user.fullName}</h1>
          <p className="profile-email">{user.email}</p>
        </div> */}

        {/* User Information Section */}
        <div className="info-section">
          <div className="info-item">
            <Shield size={20} className="info-icon" />
            <div className="info-text">
              <span className="info-label">Role</span>
              <span className="info-value">{user.role}</span>
            </div>
          </div>
          <div className="info-item">
            <User size={20} className="info-icon" />
            <div className="info-text">
              <span className="info-label">Member Since</span>
              <span className="info-value">{new Date(user.memberSince).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons Section */}
        <div className="action-section">
          <button className="settings-button">
            <Edit size={16} />
            <span>Edit Profile</span>
          </button>
          <button className="settings-button settings-button--danger" onClick={onLogout}>
            <LogOut size={16} />
            <span>Log Out</span>
          </button>

           {/* <button
        onClick={props.onLogout} // Use the passed onLogout function
        className="app__button app__button--logout"
        type="button"
      >
        Logout
      </button> */}
        </div>
      </div>
    </div>
  );
};

export default Settings;