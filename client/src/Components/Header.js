import React, { useState, useEffect, useRef } from 'react';
import '../css/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddCardModal from './AddModelCard';

const Header = ({ onSearch, onUserSelect = () => {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const dropdownRef = useRef(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        const response = await fetch('http://localhost:5000/api/v1/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setAllUsers(data.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (typeof onSearch === 'function') {
      onSearch(searchTerm);
    }
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleUserClick = (userId) => {
    if (typeof onUserSelect === 'function') {
      onUserSelect(userId);
    }
    setShowUserDropdown(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="icons">
          {/* Add Card Button */}
          <button
            className="icon-link plus-icon"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>ADD CARD</span>
          </button>

          {/* Profile Dropdown */}
          <div className="icon-link profile-icon-container" ref={dropdownRef}>
            <button className="icon-button" onClick={toggleUserDropdown}>
              <FontAwesomeIcon icon={faUser} />
            </button>
            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-header">Filter by User</div>
                <div 
                  className="dropdown-item" 
                  onClick={() => handleUserClick(null)}
                >
                  All Tasks
                </div>
                {allUsers.map((user) => (
                  <div
                    key={user._id}
                    className="dropdown-item"
                    onClick={() => handleUserClick(user._id)}
                  >
                    <span className="user-avatar">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                    <span className="user-info">
                      <span className="username">{user.username}</span>
                      <span className="email">{user.email}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* Add Modal */}
      {showModal && <AddCardModal setShowModal={setShowModal} onClose={handleModalClose} />}
    </header>
  );
};

export default Header;