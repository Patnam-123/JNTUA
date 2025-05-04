import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Login = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid username or password");
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                setError("");
                navigate("/dashboard"); // ✅ Redirect on successful login
            }
        } catch (err) {
            setError(err.message); // ✅ Fix: Show error message
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            /><br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br />
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;


// import React, { useState } from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Dashboard from "./Dashboard";

// const App = () => {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [token, setToken] = useState(null);
//     const [error, setError] = useState("");

//     const handleLogin = async () => {
//         try {
//             const { data } = await axios.post("http://localhost:5000/login", { username, password });
//             setToken(data.token);
//             setError("");
//         } catch  {
//             setError("Invalid credentials");
//         }
//     };

//     const handleLogout = () => {
//         setToken(null);
//         setUsername("");
//         setPassword("");
//         setError("");
//     };

//     return (
//         <Router>
//             <Routes>
//                 <Route
//                     path="/"
//                     element={
//                         token ? <Navigate to="/dashboard" /> : (
//                             <div style={{ textAlign: "center", padding: "20px" }}>
//                                 <h2>Login</h2>
//                                 <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
//                                 <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//                                 <button onClick={handleLogin}>Login</button>
//                                 {error && <p style={{ color: "red" }}>{error}</p>}
//                             </div>
//                         )
//                     }
//                 />
//                 <Route path="/dashboard" element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
//             </Routes>
//         </Router>
//     );
// };

// export default App;

// import React, { useState } from "react";
// import axios from "axios";

// const App = () => {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [token, setToken] = useState(null);
//     const [error, setError] = useState("");

//     const handleLogin = async () => {
//         try {
//             const { data } = await axios.post("http://localhost:5000/login", { username, password });
//             setToken(data.token);
//             setError("");
//         } catch (err) {
//             setError("Invalid credentials");
//         }
//     };

//     const fetchProtectedData = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:5000/protected", {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             alert(JSON.stringify(data));
//         } catch (err) {
//             alert("Unauthorized access");
//         }
//     };

//     return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//             <h2>Login</h2>
//             <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
//             <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//             <button onClick={handleLogin}>Login</button>
//             {error && <p style={{ color: "red" }}>{error}</p>}

//             {token && (
//                 <div>
//                     <p>Logged in successfully!</p>
//                     <button onClick={fetchProtectedData}>Access Protected Route</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default App;
