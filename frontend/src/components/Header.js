import React from 'react';
import '../pages/HomePage.css'; // Import the main CSS for variables and global styles

function Header({ user }) {
  return (
    <header className="app-header">
      <div className="app-logo">NoteMind</div>
      <nav className="main-nav">
        {/* Navigation items can go here if needed */}
      </nav>
      <div className="user-info">
        {user && user.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="header-profile-pic" />
        ) : (
          <div className="header-profile-pic-placeholder">
            {user && user.displayName ? user.displayName[0] : 'U'}
          </div>
        )}
        {user && user.displayName && <span className="user-display-name">{user.displayName}</span>}
        {/* <button className="create-note-button">Create Note</button> */}
      </div>
    </header>
  );
}

export default Header;
