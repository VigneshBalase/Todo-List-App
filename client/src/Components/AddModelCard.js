// import React, { useState, useEffect } from 'react';
// import '../css/cardModal.css';

// const AddCardPopup = ({ onClose }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [priority, setPriority] = useState('Medium');
//   const [tags, setTags] = useState([]);
//   const [tagInput, setTagInput] = useState('');
//   const [mentionedUsers, setMentionedUsers] = useState([]);
//   const [note, setNote] = useState('');
//   const [allUsers, setAllUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState('');

//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGY5YzBmMmJmODgzYjM2ZTA3YmViYyIsImlhdCI6MTc0NTkwOTAxNSwiZXhwIjoxNzQ4NTAxMDE1fQ.udiRiPO6Nq8LI32x21g6M7-7ylBK84MzPgQf669B96g";
//   const createdBy = JSON.parse(atob(token.split('.')[1]))?.id; // Extract user id from token

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/v1/users', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = await response.json();
//         setAllUsers(data.data || []); // Adjust according to API response
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleAddTag = () => {
//     if (tagInput.trim()) {
//       setTags([...tags, tagInput.trim()]);
//       setTagInput('');
//     }
//   };

//   const handleAddUser = () => {
//     if (selectedUser && !mentionedUsers.includes(selectedUser)) {
//       setMentionedUsers([...mentionedUsers, selectedUser]);
//       setSelectedUser('');
//     }
//   };

//   const handleRemoveUser = (userId) => {
//     setMentionedUsers(mentionedUsers.filter(id => id !== userId));
//   };

//   const handleSubmit = async () => {
//     const data = {
//       title,
//       description,
//       priority,
//       tags,
//       mentionedUsers,
//       notes: note ? [{ content: note }] : [],
//       createdBy,
//     };

//     try {
//       const response = await fetch('http://localhost:5000/api/v1/todos', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         console.log('Todo created successfully:', result.data);
//         onClose && onClose();
//       } else {
//         console.error('Failed to create todo:', result.message);
//         alert(`Error: ${result.message}`);
//       }
//     } catch (err) {
//       console.error('Error creating todo:', err);
//       alert('An error occurred while creating the todo.');
//     }
//   };

//   return (
//     <div className="popup-overlay">
//       <div className="popup-card">
//         <div className="popup-header">
//           <h2>Create New Task</h2>
//           <button className="close-btn" onClick={onClose}>
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <path d="M18 6L6 18M6 6L18 18" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </button>
//         </div>

//         <div className="form-group">
//           <label>Task Title</label>
//           <input
//             type="text"
//             placeholder="e.g. Complete project documentation"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             className="task-title-input"
//           />
//         </div>

//         <div className="form-group">
//           <label>Description</label>
//           <textarea
//             placeholder="Add details about this task..."
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows="3"
//             className="task-description-input"
//           />
//         </div>

//         <div className="form-group">
//           <label>Priority</label>
//           <div className="priority-options">
//             {[
//               { value: 'High', color: '#F04438' },
//               { value: 'Medium', color: '#F79009' },
//               { value: 'Low', color: '#12B76A' }
//             ].map((level) => (
//               <button
//                 key={level.value}
//                 type="button"
//                 className={`priority-option ${priority === level.value ? 'active' : ''}`}
//                 style={{ '--priority-color': level.color }}
//                 onClick={() => setPriority(level.value)}
//               >
//                 {level.value}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Tags</label>
//           <div className="tag-input-container">
//             <input
//               type="text"
//               placeholder="Add a tag and press Enter"
//               value={tagInput}
//               onChange={(e) => setTagInput(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
//             />
//             <button type="button" onClick={handleAddTag} className="add-button">+</button>
//           </div>
//           {tags.length > 0 && (
//             <div className="tag-list">
//               {tags.map((tag, index) => (
//                 <span key={index} className="tag">
//                   {tag}
//                   <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== index))}>×</button>
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="form-group">
//           <label>Mention Team Members</label>
//           <div className="user-select-container">
//             <select 
//               value={selectedUser} 
//               onChange={(e) => setSelectedUser(e.target.value)}
//               className="user-select"
//             >
//               <option value="">Select a team member...</option>
//               {allUsers.map((user) => (
//                 <option key={user._id} value={user._id}>
//                   {user.username} ({user.email})
//                 </option>
//               ))}
//             </select>
//             <button type="button" onClick={handleAddUser} className="add-button" disabled={!selectedUser}>
//               Add
//             </button>
//           </div>
//           {mentionedUsers.length > 0 && (
//             <div className="user-list">
//               {mentionedUsers.map((userId) => {
//                 const user = allUsers.find((u) => u._id === userId);
//                 return (
//                   <div key={userId} className="user-chip">
//                     <span className="user-avatar">{user?.username.charAt(0).toUpperCase()}</span>
//                     <span className="user-name">{user?.username}</span>
//                     <button 
//                       type="button" 
//                       onClick={() => handleRemoveUser(userId)}
//                       className="remove-user-btn"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         <div className="form-group">
//           <label>Notes (Optional)</label>
//           <textarea
//             placeholder="Add any additional notes..."
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             rows="2"
//           />
//         </div>

//         <div className="action-buttons">
//           <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
//           <button className="submit-btn" onClick={handleSubmit}>Create Task</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddCardPopup;
import React, { useState, useEffect } from 'react';
import '../css/cardModal.css';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

const AddCardPopup = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [note, setNote] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  // Get token and user ID from localStorage
  const token = localStorage.getItem('token');
  let createdBy = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      createdBy = decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      // Handle invalid token, e.g., redirect to login
    }
  }


  useEffect(() => {
    const fetchUsers = async () => {
      // Use the token from localStorage for fetching users
      if (!token) {
        console.error('No token found. Cannot fetch users.');
        // Optionally redirect to login
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/v1/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setAllUsers(data.data || []); // Adjust according to API response
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]); // Add token as a dependency

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

  const handleSubmit = async () => {
    // Ensure token and createdBy are available
    if (!token || !createdBy) {
      alert('You must be logged in to create a task.');
      // Optionally redirect to login
      return;
    }

    const data = {
      title,
      description,
      priority,
      tags,
      mentionedUsers,
      notes: note ? [{ content: note }] : [],
      createdBy, // Use the createdBy derived from the localStorage token
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Use the token from localStorage
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Todo created successfully:', result.data);
        onClose && onClose();
      } else {
        console.error('Failed to create todo:', result.message);
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error('Error creating todo:', err);
      alert('An error occurred while creating the todo.');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <div className="popup-header">
          <h2>Create New Task</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
            {[
              { value: 'High', color: '#F04438' },
              { value: 'Medium', color: '#F79009' },
              { value: 'Low', color: '#12B76A' }
            ].map((level) => (
              <button
                key={level.value}
                type="button"
                className={`priority-option ${priority === level.value ? 'active' : ''}`}
                style={{ '--priority-color': level.color }}
                onClick={() => setPriority(level.value)}
              >
                {level.value}
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
            <button type="button" onClick={handleAddTag} className="add-button">+</button>
          </div>
          {tags.length > 0 && (
            <div className="tag-list">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== index))}>×</button>
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
          <label>Notes (Optional)</label>
          <textarea
            placeholder="Add any additional notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="2"
          />
        </div>

        <div className="action-buttons">
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn" onClick={handleSubmit}>Create Task</button>
        </div>
      </div>
    </div>
  );
};

export default AddCardPopup;
