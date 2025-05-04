import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:7000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Welcome to the Dashboard</h2>
      <h3>Users List</h3>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>{user.name} - {user.age} years old</li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
}













// import { useEffect, useState } from "react";

// export default function Dashboard() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:7000/users") // Backend API
//       .then((res) => res.json())
//       .then((data) => setUsers(data))
//       .catch((error) => console.error("Error fetching users:", error));
//   }, []);

//   return (
//     <div className="dashboard">
//       <h2>Welcome to the Dashboard</h2>
//       <h3>Users List</h3>
//       {users.length > 0 ? (
//         <ul>
//           {users.map((user) => (
//             <li key={user._id}>
//               {user.name} - {user.age} years old
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No users found</p>
//       )}
//     </div>
//   );
// }









// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import './Dashboard.css'

// // export default function Dashboard() {
// //   const [users, setUsers] = useState([]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     // Fetch users from API
// //     const fetchUsers = async () => {
// //       try {
// //         const response = await fetch("http://localhost:3000/api/users", {
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
// //           },
// //         });

// //         if (!response.ok) throw new Error("Failed to fetch users");

// //         const data = await response.json();
// //         setUsers(data.users);
// //       } catch (error) {
// //         console.error("Error fetching users:", error);
// //       }
// //     };

// //     fetchUsers();
// //   }, []);

// //   const handleLogout = () => {
// //     localStorage.removeItem("user");
// //     localStorage.removeItem("token");
// //     navigate("/");
// //   };

// //   return (
// //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
// //       <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>

// //       {/* Display Users */}
// //       <div className="w-96 bg-white shadow-lg rounded-2xl p-4">
// //         <h2 className="text-xl font-semibold mb-2">Users List</h2>
// //         {users.length === 0 ? (
// //           <p className="text-gray-500">No users found</p>
// //         ) : (
// //           <ul className="space-y-2">
// //             {users.map((user) => (
// //               <li
// //                 key={user.id}
// //                 className="p-2 border rounded bg-gray-50 text-center"
// //               >
// //                 {user.name} ({user.email})
// //               </li>
// //             ))}
// //           </ul>
// //         )}
// //       </div>

// //       {/* Logout Button */}
// //       <button
// //         onClick={handleLogout}
// //         className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
// //       >
// //         Logout
// //       </button>
// //     </div>
// //   );
// // }
