import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/card.css';
import '../css/cardModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from './Header'; // Make sure to import the Header component
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


  const filteredTodos = todos.filter(todo => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.description && todo.description.toLowerCase().includes(searchLower)) ||
      (todo.tags && todo.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
      (todo.mentionedUsers &&
        todo.mentionedUsers.some(userId =>
          userMap[userId] && userMap[userId].toLowerCase().includes(searchLower)
        ))
    );
  });
  

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users first
        const usersResponse = await axios.get('http://localhost:5000/api/v1/users/');
        
        if (!usersResponse.data.success) {
          throw new Error('Failed to fetch users');
        }

        // Create mapping of user IDs to usernames
        const userData = {};
        usersResponse.data.data.forEach(user => {
          userData[user._id] = user.username;
        });
        setUserMap(userData);
        setAllUsers(usersResponse.data.data);

        // Then fetch todos
        const todoResponse = await axios.get('http://localhost:5000/api/v1/todos/todo');
        
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
  }, []);

  let baseFilteredTodos = todos.filter(todo => {
    const searchLower = searchTerm.toLowerCase();
    return (
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.description && todo.description.toLowerCase().includes(searchLower)) ||
      (todo.tags && todo.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
      (todo.mentionedUsers &&
        todo.mentionedUsers.some(userId =>
          userMap[userId] && userMap[userId].toLowerCase().includes(searchLower)
        ))
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
    setActiveTagFilter(null); // Clear tag when priority is selected
  };

  const handleTagFilter = (tag) => {
    setActiveTagFilter(tag);
    setActivePriorityFilter(null); // Clear priority when tag is selected
  };

  const handleUpdate = (todo) => {
    setCurrentTodo(todo);
    setShowUpdateModal(true);
  };

  const handleComplete = async (todoId) => {
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGY5YzBmMmJmODgzYjM2ZTA3YmViYyIsImlhdCI6MTc0NTkxNzI3OSwiZXhwIjoxNzQ4NTA5Mjc5fQ.5MxYozNKwnfQl8IdbJyc3Pl1F3zrc8L7TpDZ1X-kQwg";
  
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
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGY5YzBmMmJmODgzYjM2ZTA3YmViYyIsImlhdCI6MTc0NTkxNzI3OSwiZXhwIjoxNzQ4NTA5Mjc5fQ.5MxYozNKwnfQl8IdbJyc3Pl1F3zrc8L7TpDZ1X-kQwg";
      
      const response = await axios.patch(
        `http://localhost:5000/api/v1/todos/${currentTodo._id}`,
        updatedData,
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
      console.error('Update error:', err.response?.data || err.message);
      alert(`Update failed: ${err.response?.data?.message || err.message}`);
    }
  };
  
  const handleDelete = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGY5YzBmMmJmODgzYjM2ZTA3YmViYyIsImlhdCI6MTc0NTkxNzI3OSwiZXhwIjoxNzQ4NTA5Mjc5fQ.5MxYozNKwnfQl8IdbJyc3Pl1F3zrc8L7TpDZ1X-kQwg";
      
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
          <div key={todo._id} className="img-wrapper">
            <h2>{todo.title}</h2>
            
            <ul className="side-icons">
              <li title="Update" onClick={() => handleUpdate(todo)}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </li>
              <li title="Complete" onClick={() => handleComplete(todo._id)}>
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
                    <span key={index} className="tag-item">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {todo.mentionedUsers && todo.mentionedUsers.length > 0 && (
                <div className="mentions-container">
                  <span className="mention-label">Mentions:</span>
                  {todo.mentionedUsers
                    .filter(userId => userMap[userId])
                    .map(userId => (
                      <span key={userId} className="user-mention">
                        @{userMap[userId]}
                      </span>
                    ))
                  }
                </div>
              )}
              
              {todo.notes && todo.notes.length > 0 && (
                <div className="notes-section">
                  <strong>Notes:</strong>
                  <ul>
                    {todo.notes.map((note, index) => (
                      <li key={index}>
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
        />
      )}
    </>
  );
};

const UpdateCardPopup = ({ todo, allUsers, onClose, onSubmit }) => {
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [priority, setPriority] = useState(todo?.priority || 'Medium');
  const [tags, setTags] = useState(todo?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState(todo?.mentionedUsers || []);
  const [note, setNote] = useState(todo?.notes?.[0]?.content || '');
  const [selectedUser, setSelectedUser] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleAddUser = () => {
    if (selectedUser && !mentionedUsers.includes(selectedUser)) {
      setMentionedUsers([...mentionedUsers, selectedUser]);
      setSelectedUser('');
    }
  };

  const handleRemoveUser = (userId) => {
    setMentionedUsers(mentionedUsers.filter(id => id !== userId));
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
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
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(index)}>
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
              {allUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
            <button type="button" onClick={handleAddUser} className="add-button" disabled={!selectedUser}>
              Add
            </button>
          </div>
          {mentionedUsers.length > 0 && (
            <div className="user-list">
              {mentionedUsers.map((userId) => {
                const user = allUsers.find((u) => u._id === userId);
                return (
                  <div key={userId} className="user-chip">
                    <span className="user-avatar">{user?.username.charAt(0).toUpperCase()}</span>
                    <span className="user-name">{user?.username}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveUser(userId)}
                      className="remove-user-btn"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
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