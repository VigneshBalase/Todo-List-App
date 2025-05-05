import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import {
  faCircleExclamation,
  faSignal,
  faTag,
  faCircleCheck,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import '../css/navBar.css';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

const Sidebar = ({ onPriorityFilter, onTagFilter }) => {
  const [activePriority, setActivePriority] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [tags, setTags] = useState([]);
  const [userName, setUserName] = useState('Guest'); // Initial state

  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the token to get user information
        const decoded = jwtDecode(token);
        // Set the username from the decoded token
        setUserName(decoded.username || decoded.name || 'User'); // Use username or name from token
        // Store userId from token in localStorage (optional, but good practice if needed elsewhere)
        localStorage.setItem('userId', decoded.id);
      } catch (error) {
        console.error('Error decoding token:', error);
        // Handle invalid or expired token, e.g., clear localStorage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username'); // Also remove username if it was stored separately
        setUserName('Guest'); // Reset username
        // Optionally redirect to login page
      }
    } else {
      // If no token is found, ensure userId and username are also cleared
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      setUserName('Guest'); // Reset username
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const fetchPriorities = () => {
      setPriorities([
        { label: 'High', icon: faCircleExclamation, value: 'high' },
        { label: 'Medium', icon: faSignal, value: 'medium' },
        { label: 'Low', icon: faSignal, value: 'low' } // You can customize the icon
      ]);
    };

    const fetchTags = () => {
      setTags([
        { label: 'Design', value: 'design' },
        { label: 'Development', value: 'development' },
        { label: 'Bug', value: 'bug' },
        { label: 'Feature', value: 'feature' }
      ]);
    };

    fetchPriorities();
    fetchTags();
  }, []); // Empty dependency array means this runs once on mount

  // Removed the useEffect that fetches all users

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Ensure username is removed
    localStorage.removeItem('userId'); // Ensure userId is removed
    window.location.href = '/'; // Redirect to home/login page
  };

  const calculateHighlightPosition = (type, label) => {
    if (type === 'priority') {
      const index = priorities.findIndex(item => item.label === label);
      return index !== -1 ? index * 54 + 54 : 0;
    } else if (type === 'tag') {
      const index = tags.findIndex(item => item.label === label);
      return index !== -1 ? (priorities.length * 54) + 108 + index * 54 : 0;
    }
    return 0;
  };

  const handlePriorityClick = (priority) => {
    const newPriority = activePriority === priority.value ? null : priority.value;
    setActivePriority(newPriority);
    setActiveTag(null);
    if (onPriorityFilter) {
      onPriorityFilter(newPriority);
    }
  };

  const handleTagClick = (tag) => {
    const newTag = activeTag === tag.value ? null : tag.value;
    setActiveTag(newTag);
    setActivePriority(null);
    if (onTagFilter) {
      onTagFilter(newTag);
    }
  };

  const getActiveHighlightPosition = () => {
    if (activePriority) {
      const priority = priorities.find(p => p.value === activePriority);
      return calculateHighlightPosition('priority', priority?.label);
    } else if (activeTag) {
      const tag = tags.find(t => t.value === activeTag);
      return calculateHighlightPosition('tag', tag?.label);
    }
    return -1000;
  };

  return (
    <div id="nav-bar">
      <input type="checkbox" id="nav-toggle" />
      <div id="nav-header">
        <a id="nav-title" target="_blank" rel="noopener noreferrer">
          T<FontAwesomeIcon icon={faCircleCheck} />D<FontAwesomeIcon icon={faCircleCheck} /> LIST
        </a>
        <label htmlFor="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
        <hr />
      </div>

      <div id="nav-content">
        <div className="nav-section-header">
          <FontAwesomeIcon icon={faFilter} />
          <span>PRIORITY FILTER</span>
        </div>
        {priorities.map(item => (
          <div
            key={item.value}
            className={`nav-button ${activePriority === item.value ? 'active' : ''}`}
            onClick={() => handlePriorityClick(item)}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span>{item.label}</span>
            {activePriority === item.value && (
              <span className="active-indicator"></span>
            )}
          </div>
        ))}

        <hr />

        <div className="nav-section-header">
          <FontAwesomeIcon icon={faTag} />
          <span>TAG FILTER</span>
        </div>
        {tags.map(item => (
          <div
            key={item.value}
            className={`nav-button ${activeTag === item.value ? 'active' : ''}`}
            onClick={() => handleTagClick(item)}
          >
            <FontAwesomeIcon icon={faTag} />
            <span>{item.label}</span>
            <span className="count-badge">{item.count || ''}</span>
            {activeTag === item.value && (
              <span className="active-indicator"></span>
            )}
          </div>
        ))}

        <div
          id="nav-content-highlight"
          style={{
            top: `${getActiveHighlightPosition()}px`,
            display: activePriority || activeTag ? 'block' : 'none'
          }}
        ></div>
      </div>

      <div id="nav-footer">
        <div id="nav-footer-heading">
          <div id="nav-footer-avatar">
            <img
              src="https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547"
              alt="avatar"
            />
          </div>
          <div id="nav-footer-titlebox">
            {/* Display the userName state */}
            <a id="nav-footer-title" href="#">{userName}</a>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
