import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import CSS

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const correctEmail = "siri@gmail.com";
  const correctPassword = "123456";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsAuthenticated(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (email === correctEmail && password === correctPassword) {
      localStorage.setItem("user", JSON.stringify({ email }));
      setIsAuthenticated(true);
      navigate("/dashboard");
      return;
    }

    try {
      const response = await fetch("http://localhost:7000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const result = await response.json();
      if (result.success) {
        localStorage.setItem("token", result.token);
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        setError(result.message || "Invalid email or password");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) navigate("/dashboard");

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}













// import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// import Dashboard from "./Dashboard";
// import './Dashboard.css' // Import Dashboard

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   //const navigate = useNavigate();

//   const correctEmail = "siri@gmail.com";
//   const correctPassword = "123456";

//   // Check if the user is already logged in
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (user) {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     console.log("Entered Email:", email);
//     console.log("Entered Password:", password);

//     // Local authentication check
//     if (email === correctEmail && password === correctPassword) {
//       console.log("Local login successful!");
//       localStorage.setItem("user", JSON.stringify({ email }));
//       setIsAuthenticated(true);
//       return;
//     }

//     // API authentication
//     try {
//       const response = await fetch("http://localhost:3000/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) throw new Error("Invalid credentials or server error");

//       const result = await response.json();
//       console.log("API Response:", result);

//       if (result.success) {
//         localStorage.setItem("token", result.token);
//         setIsAuthenticated(true);
//       } else {
//         setError(result.message || "Invalid email or password");
//       }
//     } catch (error) {
//       console.error("Login Error:", error);
//       setError("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isAuthenticated) {
//     return <Dashboard />;
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-96 p-6 shadow-lg bg-white rounded-2xl text-center">
//         <h2 className="text-2xl font-bold mb-4">Login</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="text-left">
//             <label className="font-medium">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full border p-2 rounded mt-1"
//             />
//           </div>
//           <div className="text-left">
//             <label className="font-medium">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full border p-2 rounded mt-1"
//             />
//           </div>
//           <button
//             type="submit"
//             className={`w-full bg-blue-500 text-white p-2 rounded transition ${
//               loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//           {error && <p className="text-red-500 mt-2">{error}</p>}
//         </form>
//       </div>
//     </div>
//   );
// }
