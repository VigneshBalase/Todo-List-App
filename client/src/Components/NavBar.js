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

const Sidebar = ({ onPriorityFilter, onTagFilter }) => {
  const [activePriority, setActivePriority] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [tags, setTags] = useState([]);
  const userId = localStorage.getItem('userId');
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUserName(storedUsername);
  }, []);

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
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/users');
        const matchedUser = res.data.users.find(user => user._id === userId);
        if (matchedUser) {
          setUserName(matchedUser.username || matchedUser.name);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
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
