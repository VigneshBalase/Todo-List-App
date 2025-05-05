import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/card.css';
import '../css/cardModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import Sidebar from './NavBar';

const ProfileHover = () => {
  const [todos, setTodos] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePriorityFilter, setActivePriorityFilter] = useState(null);
  const [activeTagFilter, setActiveTagFilter] = useState(null);


  // Get token from localStorage
  const token = localStorage.getItem('token');
  //  let createdBy = null;
  //  if (token) {
  //    try {
  //      const decoded = jwtDecode(token);
  //      createdBy = decoded.id;
  //    } catch (error) {
  //      console.error('Error decoding token:', error);
  //      // Handle invalid token, e.g., redirect to login
  //    }
  //  }


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        // Fetch all users first
        const usersResponse = await axios.get('http://localhost:5000/api/v1/users/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!usersResponse.data.success) {
          throw new Error('Failed to fetch users');
        }

        // Create mapping of user IDs to usernames
        const userData = {};
        usersResponse.data.data.forEach(user => {
          if (user._id && user.username) {  // Add validation
            userData[user._id] = user.username;
          }
        });
        setUserMap(userData);
        setAllUsers(usersResponse.data.data);

        // Then fetch todos
        const todoResponse = await axios.get('http://localhost:5000/api/v1/todos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!todoResponse.data.success) {
          throw new Error('Failed to fetch todos');
        }

        setTodos(todoResponse.data.data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  let baseFilteredTodos = todos.filter(todo => {
    const searchLower = searchTerm.toLowerCase();
    return (
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.description && todo.description.toLowerCase().includes(searchLower)) ||
      (todo.tags && todo.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
      (todo.mentionedUsers &&
        todo.mentionedUsers.some(userId =>
          userMap[userId] && userMap[userId].toLowerCase().includes(searchLower)
        )
      ) 
    );
  });
  
  // Apply additional filters
  if (activePriorityFilter) {
    baseFilteredTodos = baseFilteredTodos.filter(todo =>
      todo.priority?.toLowerCase() === activePriorityFilter
    );
  }
  if (activeTagFilter) {
    baseFilteredTodos = baseFilteredTodos.filter(todo =>
      todo.tags?.includes(activeTagFilter)
    );
  }

  const handlePriorityFilter = (priority) => {
    setActivePriorityFilter(priority);
    setActiveTagFilter(null);
  };

  const handleTagFilter = (tag) => {
    setActiveTagFilter(tag);
    setActivePriorityFilter(null);
  };

  const handleUpdate = (todo) => {
    setCurrentTodo(todo);
    setShowUpdateModal(true);
  };

  const handleComplete = async (todoId) => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/v1/todos/${todoId}`,
        { status: 'completed' },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        setTodos(todos.map(todo =>
          todo._id === todoId ? response.data.data : todo
        ));
        alert('Task marked as completed!');
      }
    } catch (err) {
      console.error('Error completing task:', err.response?.data || err.message);
      alert(`Failed to complete task: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleUpdateSubmit = async (updatedData) => {
    if (!token) {
      alert('Authentication required');
      return;
    }
  
    try {
      // Ensure mentionedUsers is in the correct format (array of IDs)
      const dataToSend = {
        ...updatedData,
        mentionedUsers: updatedData.mentionedUsers.map(user => 
          typeof user === 'object' ? user._id : user
        )
      };
  
      const response = await axios.patch(
        `http://localhost:5000/api/v1/todos/${currentTodo._id}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        setTodos(todos.map(todo => 
          todo._id === currentTodo._id ? response.data.data : todo
        ));
        setShowUpdateModal(false);
        alert('Task updated successfully!');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert(`Update failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleRemoveUserFromDb = async (todoId, userId) => {
    if (!token) {
      alert('Authentication required');
      return;
    }
  
    try {
      const currentTodo = todos.find(todo => todo._id === todoId);
      if (!currentTodo) return;
  
      // Convert all mentioned users to IDs first for consistent comparison
      const updatedMentionedUsers = currentTodo.mentionedUsers
        .map(user => typeof user === 'object' ? user._id : user)
        .filter(id => id !== userId);
  
      const response = await axios.patch(
        `http://localhost:5000/api/v1/todos/${todoId}`,
        { mentionedUsers: updatedMentionedUsers },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        setTodos(todos.map(todo =>
          todo._id === todoId ? {
            ...response.data.data,
            mentionedUsers: updatedMentionedUsers // Ensure consistent format
          } : todo
        ));
      }
    } catch (err) {
      console.error('Error removing user:', err.response?.data || err.message);
      alert(`Failed to remove user: ${err.response?.data?.message || err.message}`);
    }
  };

 
  
  const handleDelete = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/todos/${todoId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      setTodos(todos.filter(todo => todo._id !== todoId));
      alert('Task deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      alert(`Delete failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Sidebar onPriorityFilter={handlePriorityFilter} onTagFilter={handleTagFilter} />
      <Header onSearch={handleSearch} />
      <div className="card-container">
        {baseFilteredTodos.map((todo) => (
          <div key={todo._id} className={`img-wrapper ${todo.status === 'completed' ? 'completed-task' : ''}`}>
            <h2>{todo.title}</h2>
            
            <ul className="side-icons">
              <li title="Update" onClick={() => handleUpdate(todo)}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </li>
              <li 
                title="Complete" 
                className="complete-btn"
                onClick={() => handleComplete(todo._id)}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
              </li>
            </ul>

            <div className="card-content">
              <p className="description">{todo.description || 'N/A'}</p>
              
              <div className={`priority-box ${todo.priority.toLowerCase()}`}>
                {todo.priority}
              </div>
              
              {todo.tags && todo.tags.length > 0 && (
                <div className="tags">
                  {todo.tags.map((tag, index) => (
                    <span key={tag} className="tag-item">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {todo.mentionedUsers && todo.mentionedUsers.length > 0 && (
                <div className="mentions-container">
                  <span className="mention-label">Mentions:</span>
                  {todo.mentionedUsers
                    .map(userId => {
                      // Convert to string if it's an object
                      const id = typeof userId === 'object' ? userId._id || JSON.stringify(userId) : userId;
                      const username = userMap[id];
                      return username ? (
                        <span key={`mention-${id}`} className="user-mention">
                          @{username}
                        </span>
                      ) : null;
                    })
                    .filter(Boolean) // Remove any null entries
                  }
                </div>
              )}
                            
              {todo.notes && todo.notes.length > 0 && (
                <div className="notes-section">
                  <strong>Notes:</strong>
                  <ul>
                    {todo.notes.map((note) => (
                      <li key={`note-${note._id || note.content?.substring(0, 20)}`}>
                        {note.content || 'No content'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bottom-circle" title="Delete" onClick={() => handleDelete(todo._id)}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </div>
        ))}
      </div>

      {showUpdateModal && (
        <UpdateCardPopup 
          todo={currentTodo}
          allUsers={allUsers}
          onClose={() => setShowUpdateModal(false)}
          onSubmit={handleUpdateSubmit}
          onRemoveUser={handleRemoveUserFromDb}
        />
      )}
    </>
  );
};

const UpdateCardPopup = ({ todo, allUsers, onClose, onSubmit, onRemoveUser }) => {
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [priority, setPriority] = useState(todo?.priority || 'Medium');
  const [tags, setTags] = useState(todo?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState(
    todo?.mentionedUsers 
      ? todo.mentionedUsers.map(user => typeof user === 'object' ? user._id : user)
      : []
  );
  const [note, setNote] = useState(todo?.notes?.[0]?.content || '');
  const [selectedUser, setSelectedUser] = useState('');

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {  // Prevent duplicate tags
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleAddUser = () => {
    if (selectedUser && !mentionedUsers.some(userId => userId === selectedUser)) {
      setMentionedUsers([...mentionedUsers, selectedUser]);
      setSelectedUser('');
    } else {
      // Optional: Show feedback that user is already mentioned
      alert('This user is already mentioned in the task');
    }
  };

  const handleRemoveUser = (userId) => {
    setMentionedUsers(mentionedUsers.filter(id => id !== userId));
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    const updatedData = {
      title,
      description,
      priority,
      tags,
      mentionedUsers,
      notes: note ? [{ content: note }] : [],
    };
    onSubmit(updatedData);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <div className="popup-header">
          <h2>Update Task</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="form-group">
          <label>Task Title</label>
          <input
            type="text"
            placeholder="e.g. Complete project documentation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="task-title-input"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Add details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="task-description-input"
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <div className="priority-options">
            {['High', 'Medium', 'Low'].map((level) => (
              <button
                key={level}
                type="button"
                className={`priority-option ${priority === level ? 'active' : ''}`}
                style={{ 
                  '--priority-color': 
                    level === 'High' ? '#F04438' : 
                    level === 'Medium' ? '#F79009' : '#12B76A' 
                }}
                onClick={() => setPriority(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tag-input-container">
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button type="button" onClick={handleAddTag} className="add-button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3.33334V12.6667M3.33333 8H12.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          {tags.length > 0 && (
            <div className="tag-list">
              {tags.map((tag) => (
                <span key={`tag-${tag}`} className="tag">  
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
  <label>Mention Team Members</label>
  <div className="user-select-container">
    <select 
      value={selectedUser} 
      onChange={(e) => setSelectedUser(e.target.value)}
      className="user-select"
    >
      <option value="">Select a team member...</option>
      {allUsers
        .filter(user => !mentionedUsers.some(u => u._id === user._id)) // Only show non-mentioned users
        .map((user) => (
          <option key={user._id} value={user._id}>
            {user.username} ({user.email})
          </option>
        ))}
    </select>
    <button 
      type="button" 
      onClick={handleAddUser} 
      className="add-button" 
      disabled={!selectedUser}
    >
      Add
    </button>
  </div>
  
  {mentionedUsers.length > 0 && (
    <div className="user-mentions-display">
      <h4>Currently Mentioned:</h4>
      <div className="mentioned-users-list">
        {mentionedUsers.map(user => {
          // Handle both string IDs and full user objects
          const userId = typeof user === 'object' ? user._id : user;
          const userObj = allUsers.find(u => u._id === userId) || {};
          
          return (
            <div key={`mentioned-${userId}`} className="mentioned-user-item">
              <span className="user-info">
                <span className="user-avatar">
                  {userObj.username?.charAt(0).toUpperCase() || '?'}
                </span>
                <span className="user-name">
                  {userObj.username || 'Unknown user'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  handleRemoveUser(userId);
                  onRemoveUser(todo._id, userId); // Call the removal API
                }}
                className="remove-mention-btn"
                aria-label={`Remove mention of ${userObj.username}`}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )}
</div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            placeholder="Add any additional notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="2"
          />
        </div>

        <div className="action-buttons">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Update Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHover;