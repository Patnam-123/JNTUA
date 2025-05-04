import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />}
                />
                <Route
                    path="/dashboard"
                    element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />}
                />
            </Routes>
        </Router>
    );
};

export default App;
