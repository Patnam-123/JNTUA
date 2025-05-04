import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { TiUserDelete } from 'react-icons/ti';
import { TbDatabaseEdit } from 'react-icons/tb';
import Modal from './Modal';
import Login from './Login';
import './UserManagement.css';

const API_URL = 'http://localhost:3000';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [feedback, setFeedback] = useState({ message: '', error: '' });

  // Fetch profile and users when the token is available
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  useEffect(() => {
    if (role === 'admin') {
      fetchUsers(); // Only fetch users for admins
    }
  }, [role]);

  // Auto-clear feedback message after an action
  useEffect(() => {
    if (feedback.message || feedback.error) {
      const timer = setTimeout(() => {
        setFeedback({ message: '', error: '' });
      }, 3000); // Clear message/error after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const getAuthToken = () => localStorage.getItem('token');

  // Fetch the logged-in user's profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      setRole(res.data.role);
      setCurrentUser(res.data);
    } catch (err) {
      setFeedback({ error: 'Error fetching profile' });
      console.error(err);
    }
  };

  // Fetch all users (only for admins)
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      setUsers(res.data);
    } catch (err) {
      setFeedback({ error: 'Error loading users' });
      console.error(err);
    }
  };

  // Add a new user
  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setFeedback({ error: 'All fields are required' });
      return;
    }
    try {
      await axios.post(`${API_URL}/register`, formData);
      setFeedback({ message: 'User added' });
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setFeedback({ error: 'Add user failed' });
      console.error(err);
    }
  };

  // Update an existing user
  const handleUpdateUser = async () => {
    if (!formData.name || !formData.email) {
      setFeedback({ error: 'Name and email required' });
      return;
    }

    try {
      await axios.put(`${API_URL}/users/${selectedUserId}`, formData, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      setFeedback({ message: 'User updated' });
      setShowModal(false);
      fetchUsers();
      fetchProfile(); // Re-fetch the current user's updated profile
    } catch (err) {
      setFeedback({ error: 'Update failed' });
      console.error(err);
    }
  };

  // Delete a user (admin only)
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      setFeedback({ message: 'User deleted' });
      fetchUsers();
    } catch (err) {
      setFeedback({ error: 'Delete failed' });
      console.error(err);
    }
  };

  // Open the modal for adding a user
  const openModalForAdd = () => {
    setActionType('add');
    setFormData({ name: '', email: '', password: '' });
    setShowModal(true);
  };

  // Open the modal for updating an existing user
  const openModalForUpdate = (user) => {
    if (role === 'user' && user._id !== currentUser._id) {
      setFeedback({ error: 'You can only edit your own profile' });
      return;
    }
    setActionType('update');
    setSelectedUserId(user._id);
    setFormData({ name: user.name, email: user.email, password: '' });
    setShowModal(true);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole('');
    setCurrentUser({});
  };

  // Redirect to login if token is not available
  if (!token) return <Login setToken={setToken} />;

  return (
    <div className="container">
      <h2>User Management</h2>
      <p className="role-display">Logged in as: {role}</p>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      {/* Show add user button only for admins */}
      {role === 'admin' && (
        <button className="add-btn" onClick={openModalForAdd}>
          <FaPlus /> Add User
        </button>
      )}

      {/* Display error or success feedback */}
      {feedback.error && <p className="error">{feedback.error}</p>}
      {feedback.message && <p className="success">{feedback.message}</p>}

      {/* Modal for adding/updating users */}
      {showModal && (
        <Modal
          title={actionType === 'add' ? 'Add User' : 'Update User'}
          onSubmit={actionType === 'add' ? handleAddUser : handleUpdateUser}
          closeModal={() => setShowModal(false)}
        >
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {actionType === 'add' && (
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          )}
        </Modal>
      )}

      {/* User list display */}
      <div className="card user-card">
        <h3>{role === 'admin' ? 'All Users' : 'My Profile'}</h3>
        <ul className="user-list">
          {(role === 'admin' ? users : [currentUser]).map((user) => (
            <li key={user._id} className="user-item">
              <span>{user.name} - {user.email}</span>
              <button className="update-btn" onClick={() => openModalForUpdate(user)}>
                <TbDatabaseEdit />
              </button>

              {/* Allow delete button for admins */}
              {role === 'admin' && (
                <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
                  <TiUserDelete />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;




// // user management using jwt for users
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaPlus } from 'react-icons/fa';
// import { TiUserDelete } from 'react-icons/ti';
// import { TbDatabaseEdit } from 'react-icons/tb';
// import Modal from './Modal';
// import Login from './Login'; // Import Login component
// import './UserManagement.css';

// const API_URL = 'http://localhost:3000'; // Backend URL

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [actionType, setActionType] = useState('');
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   // ✅ UPDATED useEffect to avoid warning
//   useEffect(() => {
//     const getUsers = async () => {
//       if (token) {
//         await fetchUsers();
//       }
//     };
//     getUsers();
//   }, [token]);

//   const getAuthToken = () => localStorage.getItem('token');

//   const fetchUsers = async () => {
//     const authToken = getAuthToken();

//     if (!authToken) {
//       setError('Unauthorized: No token found');
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_URL}/users`, {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });

//       if (response.status === 200) {
//         setUsers(response.data);
//         setError('');
//       } else {
//         setError('Unexpected response from server');
//       }
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setError(err.response?.data?.message || 'Failed to load users');
//     }
//   };

//   const handleAddUser = async () => {
//     setError('');
//     setMessage('');

//     if (!formData.name || !formData.email || !formData.password) {
//       setError('All fields are required');
//       return;
//     }

//     try {
//       await axios.post(`${API_URL}/register`, formData);
//       setMessage('User added successfully!');
//       setFormData({ name: '', email: '', password: '' });

//       setTimeout(() => {
//         fetchUsers(); // Refresh users list
//       }, 500);

//       setShowModal(false);
//     } catch (err) {
//       console.error('Error adding user:', err);
//       setError('Failed to add user');
//     }
//   };

//   const handleUpdateUser = async () => {
//     setError('');
//     setMessage('');

//     if (!formData.name || !formData.email) {
//       setError('Name and Email are required');
//       return;
//     }

//     try {
//       await axios.put(`${API_URL}/user/${selectedUserId}`, formData, {
//         headers: { Authorization: `Bearer ${getAuthToken()}` },
//       });
//       setMessage('User updated successfully!');
//       fetchUsers();
//       setShowModal(false);
//     } catch (err) {
//       console.error('Error updating user:', err);
//       setError('Failed to update user');
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     try {
//       await axios.delete(`${API_URL}/user/${userId}`, {
//         headers: { Authorization: `Bearer ${getAuthToken()}` },
//       });
//       fetchUsers();
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       setError('Failed to delete user');
//     }
//   };

//   const handleOpenModalForAdd = () => {
//     setActionType('add');
//     setFormData({ name: '', email: '', password: '' });
//     setShowModal(true);
//   };

//   const handleOpenModalForUpdate = (user) => {
//     setActionType('update');
//     setFormData({ name: user.name, email: user.email, password: '' });
//     setSelectedUserId(user._id);
//     setShowModal(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//   };

//   if (!token) {
//     return <Login setToken={setToken} />;
//   }

//   return (
//     <div className="container">
//       <h2>User Management</h2>
//       <button className="logout-btn" onClick={handleLogout}>
//         Logout
//       </button>
//       <button className="add-btn" onClick={handleOpenModalForAdd}>
//         <FaPlus /> Add User
//       </button>

//       {error && <p className="error">{error}</p>}
//       {message && <p className="success">{message}</p>}

//       {showModal && (
//         <Modal
//           closeModal={() => setShowModal(false)}
//           title={actionType === 'add' ? 'Add User' : 'Update User'}
//           onSubmit={actionType === 'add' ? handleAddUser : handleUpdateUser}
//         >
//           <form>
//             <input
//               type="text"
//               placeholder="Name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               required
//             />
//             {actionType === 'add' && (
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 required
//               />
//             )}
//           </form>
//         </Modal>
//       )}

//       <div className="card user-card">
//         <h3>Users List</h3>
//         <ul className="user-list">
//           {users.length > 0 ? (
//             users.map((user) => (
//               <li key={user._id} className="user-item">
//                 <span>
//                   {user.name} - {user.email}
//                 </span>
//                 <button className="update-btn" onClick={() => handleOpenModalForUpdate(user)}>
//                   <TbDatabaseEdit />
//                 </button>
//                 <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
//                   <TiUserDelete />
//                 </button>
//               </li>
//             ))
//           ) : (
//             <p>No users found</p>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;




// user management without jwt

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaPlus } from 'react-icons/fa';
// import { TiUserDelete } from 'react-icons/ti';
// import { TbDatabaseEdit } from 'react-icons/tb';
// import Modal from './Modal'; // Importing Modal component
// import './UserManagement.css';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [actionType, setActionType] = useState(''); // 'add' or 'update'
//   const [selectedUserId, setSelectedUserId] = useState(null); // For tracking the user to be updated

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/users');
//       setUsers(response.data);
//     } catch (err) {
//       console.error('Failed to load users:', err);
//       setError('Failed to load users');
//     }
//   };

//   const handleAddUser = async () => {
//     setError(''), setMessage('');

//     if (!formData.name || !formData.email || !formData.password) {
//       setError('All fields are required');
//       return;
//     }

//     try {
//       await axios.post('http://localhost:3000/user', formData);
//       setMessage('User added successfully!');
//       setFormData({ name: '', email: '', password: '' });
//       fetchUsers();
//       setShowModal(false);
//     } catch (err) {
//       console.error('Error adding user:', err);
//       setError('Failed to add user');
//     }
//   };

//   const handleUpdateUser = async () => {
//     setError(''), setMessage('');

//     if (!formData.name || !formData.email) {
//       setError('Name and Email are required');
//       return;
//     }

//     try {
//       await axios.put(`http://localhost:3000/user/${selectedUserId}`, formData);
//       setMessage('User updated successfully!');
//       setShowModal(false);
//       fetchUsers();
//     } catch (err) {
//       console.error('Error updating user:', err);
//       setError('Failed to update user');
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     try {
//       await axios.delete(`http://localhost:3000/user/${userId}`);
//       fetchUsers();
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       setError('Failed to delete user');
//     }
//   };

//   const handleOpenModalForAdd = () => {
//     setActionType('add');
//     setFormData({ name: '', email: '', password: '' });
//     setShowModal(true);
//   };

//   const handleOpenModalForUpdate = (user) => {
//     setActionType('update');
//     setFormData({ name: user.name, email: user.email, password: '' }); // Optionally, password is not updated
//     setSelectedUserId(user._id);
//     setShowModal(true);
//   };

//   return (
//     <div className="container">
//       <h2>User Management</h2>
//       <button className="add-btn" onClick={handleOpenModalForAdd}>
//         <FaPlus /> Add User
//       </button>

//       {error && <p className="error">{error}</p>}
//       {message && <p className="success">{message}</p>}

//       {showModal && (
//         <Modal
//           closeModal={() => setShowModal(false)}
//           title={actionType === 'add' ? 'Add User' : 'Update User'}
//           onSubmit={actionType === 'add' ? handleAddUser : handleUpdateUser}
//         >
//           <form>
//             <input
//               type="text"
//               placeholder="Name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               required
//             />
//             {actionType === 'add' && (
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 required
//               />
//             )}
//           </form>
//         </Modal>
//       )}

//       <div className="card user-card">
//         <h3>Users List</h3>
//         <ul className="user-list">
//           {users.map((user) => (
//             <li key={user._id} className="user-item">
//               <span>
//                 {user.name} - {user.email}
//               </span>
//               <button className="update-btn" onClick={() => handleOpenModalForUpdate(user)}>
//                 <TbDatabaseEdit />
//               </button>
//               <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
//                 <TiUserDelete />
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;


// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { FaPlus } from "react-icons/fa";
// // import { TiUserDelete } from "react-icons/ti";
// // import { TbDatabaseEdit } from "react-icons/tb";
// // import "./UserManagement.css";

// // const UserManagement = () => {
// //     const [users, setUsers] = useState([]);
// //     const [showAddForm, setShowAddForm] = useState(false);
// //     const [showUpdateForm, setShowUpdateForm] = useState(null);
// //     const [formData, setFormData] = useState({ name: "", email: "", password: "" });
// //     const [error, setError] = useState("");
// //     const [message, setMessage] = useState("");

// //     useEffect(() => {
// //         fetchUsers();
// //     }, []);

// //     const fetchUsers = async () => {
// //         try {
// //             const response = await axios.get("http://localhost:3000/users");
// //             setUsers(response.data);
// //         } catch (err) {
// //             console.error("Failed to load users:", err);
// //             setError("Failed to load users");
// //         }
// //     };

// //     const handleAddUser = async (e) => {
// //         e.preventDefault();
// //         setError(""), setMessage("");
        
// //         if (!formData.name || !formData.email || !formData.password) {
// //             setError("All fields are required");
// //             return;
// //         }

// //         try {
// //             await axios.post("http://localhost:3000/user", formData);
// //             setMessage("User added successfully!");
// //             setFormData({ name: "", email: "", password: "" });
// //             setShowAddForm(false);
// //             fetchUsers();
// //         } catch (err) {
// //             console.error("Error adding user:", err);
// //             setError("Failed to add user");
// //         }
// //     };

// //     const handleUpdateUser = async (e) => {
// //         e.preventDefault();
// //         setError(""), setMessage("");
        
// //         if (!formData.name || !formData.email) {
// //             setError("Name and Email are required");
// //             return;
// //         }

// //         try {
// //             await axios.put(`http://localhost:3000/user/${showUpdateForm}`, {
// //                 name: formData.name,
// //                 email: formData.email
// //             });
// //             setMessage("User updated successfully!");
// //             setShowUpdateForm(null);
// //             fetchUsers();
// //         } catch (err) {
// //             console.error("Error updating user:", err);
// //             setError("Failed to update user");
// //         }
// //     };

// //     const handleDeleteUser = async (userId) => {
// //         try {
// //             await axios.delete(`http://localhost:3000/user/${userId}`);
// //             fetchUsers();
// //         } catch (err) {
// //             console.error("Error deleting user:", err);
// //             setError("Failed to delete user");
// //         }
// //     };

// //     return (
// //         <div className="container">
// //             <h2>User Management</h2>
// //             <button className="add-btn" onClick={() => setShowAddForm(true)}><FaPlus /> Add User</button>
            
// //             {error && <p className="error">{error}</p>}
// //             {message && <p className="success">{message}</p>}

// //             {showAddForm && (
// //                 <div className="card">
// //                     <h3>Add User</h3>
// //                     <form onSubmit={handleAddUser} className="user-form">
// //                         <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
// //                         <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
// //                         <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
// //                         <button type="submit">Submit</button>
// //                         <button onClick={() => setShowAddForm(false)}>Cancel</button>
// //                     </form>
// //                 </div>
// //             )}
            
// //             {showUpdateForm && (
// //                 <div className="card">
// //                     <h3>Update User</h3>
// //                     <form onSubmit={handleUpdateUser} className="user-form">
// //                         <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
// //                         <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
// //                         <button type="submit">Update</button>
// //                         <button onClick={() => setShowUpdateForm(null)}>Cancel</button>
// //                     </form>
// //                 </div>
// //             )}

// //             <div className="card user-card">
// //                 <h3>Users List</h3>
// //                 <ul className="user-list">
// //                     {users.map((user) => (
// //                         <li key={user._id} className="user-item">
// //                             <span>{user.name} - {user.email}</span>
// //                             <button className="update-btn" onClick={() => { setShowUpdateForm(user._id); setFormData({ name: user.name, email: user.email }); }}><TbDatabaseEdit /></button>
// //                             <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}><TiUserDelete /></button>
// //                         </li>
// //                     ))}
// //                 </ul>
// //             </div>
// //         </div>
// //     );
// // };

// // export default UserManagement;




// // import React, { useState } from "react";
// // import "./App.css";

// // const App = () => {
// //   const [users, setUsers] = useState([]); // State for users list
// //   const [newUser, setNewUser] = useState(""); // State for new user input
// //   const [editingUser, setEditingUser] = useState(null); // State for editing user
// //   const [updatedName, setUpdatedName] = useState(""); // State for updated name

// //   // Function to add a user
// //   const addUser = () => {
// //     if (newUser.trim() !== "") {
// //       setUsers([...users, newUser]);
// //       setNewUser(""); // Clear input field after adding
// //     }
// //   };

// //   // Function to delete a user
// //   const deleteUser = (index) => {
// //     const updatedUsers = users.filter((_, i) => i !== index);
// //     setUsers(updatedUsers);
// //   };

// //   // Function to set user for update
// //   const startUpdate = (index) => {
// //     setEditingUser(index);
// //     setUpdatedName(users[index]);
// //   };

// //   // Function to update user
// //   const updateUser = () => {
// //     if (editingUser !== null && updatedName.trim() !== "") {
// //       const updatedUsers = [...users];
// //       updatedUsers[editingUser] = updatedName;
// //       setUsers(updatedUsers);
// //       setEditingUser(null);
// //       setUpdatedName("");
// //     }
// //   };

// //   return (
// //     <div className="container">
// //       {/* Card for Adding Users */}
// //       <div className="card">
// //         <h2>Add User</h2>
// //         <input
// //           type="text"
// //           placeholder="Enter Name"
// //           value={newUser}
// //           onChange={(e) => setNewUser(e.target.value)}
// //         />
// //         <button onClick={addUser}>Add User</button>
// //       </div>

// //       {/* Card for User List */}
// //       <div className="card">
// //         <h2>Users List</h2>
// //         <ul className="user-list">
// //           {users.map((user, index) => (
// //             <li key={index} className="user-item">
// //               <span>{user}</span>
// //               <div>
// //                 <button className="update-btn" onClick={() => startUpdate(index)}>
// //                   Update
// //                 </button>
// //                 <button className="delete-btn" onClick={() => deleteUser(index)}>
// //                   Delete
// //                 </button>
// //               </div>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>

// //       {/* Card for Updating Users (Only Visible When Editing) */}
// //       {editingUser !== null && (
// //         <div className="card">
// //           <h2>Update User</h2>
// //           <input
// //             type="text"
// //             placeholder="Update Name"
// //             value={updatedName}
// //             onChange={(e) => setUpdatedName(e.target.value)}
// //           />
// //           <button onClick={updateUser}>Update</button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default App;


// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import "./UserManagement.css";

// // const UserManagement = () => {
// //     const [users, setUsers] = useState([]);
// //     const [name, setName] = useState("");
// //     const [email, setEmail] = useState("");
// //     const [password, setPassword] = useState("");
// //     const [error, setError] = useState("");
// //     const [message, setMessage] = useState("");

// //     const fetchUsers = async () => {
// //         try {
// //             const response = await axios.get("http://localhost:3000/users");
// //             setUsers(response.data);
// //         } catch (err) {
// //             console.error("Failed to load users:", err);
// //             setError("Failed to load users");
// //         }
// //     };

// //     useEffect(() => {
// //         fetchUsers();
// //     }, []);


// //     const handleAddUser = async (e) => {
// //         e.preventDefault();
// //         setError("");
// //         setMessage("");

// //         if (!name || !email || !password) {
// //             setError("All fields are required");
// //             return;
// //         }

// //         try {
// //             const response = await axios.post("http://localhost:3000/user", { name, email, password });
// //             setMessage(response.data.message || "User added successfully!");
// //             setName("");
// //             setEmail("");
// //             setPassword("");
// //             fetchUsers();
// //         } catch (err) {
// //             console.error("Error adding user:", err);
// //             setError("Failed to add user");
// //         }
// //     };

// //     const handleDeleteUser = async (userId) => {
// //         try {
// //             await axios.delete(`http://localhost:3000/user/${userId}`);
// //             fetchUsers();
// //         } catch (err) {
// //             console.error("Error deleting user:", err);
// //             setError("Failed to delete user");
// //         }
// //     };

// //     const handleUpdateUser = async (userId) => {
// //         const newName = prompt("Enter new name:");
// //         const newEmail = prompt("Enter new email:");
// //         if (!newName || !newEmail) {
// //             alert("Both fields are required for update.");
// //             return;
// //         }

// //         try {
// //             await axios.put(`http://localhost:3000/user/${userId}`, { name: newName, email: newEmail });
// //             fetchUsers();
// //         } catch (err) {
// //             console.error("Error updating user:", err);
// //             setError("Failed to update user");
// //         }
// //     };

// //     return (
// //         <div className="container">
// //             <h2>User Management</h2>

// //             <form onSubmit={handleAddUser} className="user-form">
// //                 <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
// //                 <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
// //                 <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
// //                 <button type="submit">Add User</button>
// //             </form>

// //             {error && <p className="error">{error}</p>}
// //             {message && <p className="success">{message}</p>}

// //             <h3>Users List</h3>
// //             <ul className="user-list">
// //                 {users.map((user) => (
// //                     <li key={user._id} className="user-item">
// //                         <span>{user.name} - {user.email}</span>
// //                         <button className="update-btn" onClick={() => handleUpdateUser(user._id)}>Update</button>
// //                         <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>Delete</button>
// //                     </li>
// //                 ))}
// //             </ul>
// //         </div>
// //     );
// // };

// // export default UserManagement;
