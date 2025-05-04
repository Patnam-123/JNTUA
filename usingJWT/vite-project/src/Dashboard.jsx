import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css"; // Import the CSS file

const Dashboard = ({ onLogout }) => {
    const [data, setData] = useState("Loading...");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios
            .get("http://localhost:5000/dashboard", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setData(res.data.message))
            .catch(() => setData("Unauthorized"));
    }, []);

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-header">Dashboard</h2>
            <p>{data}</p>
            <button onClick={onLogout}>Logout</button>

            <div className="card-container">
                <div className="card">
                    <img
                        src="https://thaka.bing.com/th/id/OIP.C2EVNI3TDqSyFb7pPW5CHwHaD4?rs=1&pid=ImgDetMain"
                        alt="Flower 1"
                    />
                    <p>Flower 1</p>
                </div>
                <div className="card">
                    <img
                        src="https://thaka.bing.com/th/id/OPAC.dnN1qvvcX9ltCw474C474?o=5&pid=21.1&w=160&h=160"
                        alt="Flower 2"
                    />
                    <p>Flower 2</p>
                </div>
                <div className="card">
                    <img
                        src="https://thaka.bing.com/th/id/OPAC.nRWdU7NtO51AbQ474C474?o=5&pid=21.1&w=160&h=160"
                        alt="Flower 3"
                    />
                    <p>Flower 3</p>
                </div>
                {/* Last three cards with images and names */}
                <div className="card">
                    <img
                        src="https://thaka.bing.com/th/id/OIP.YUmmw_GejctKsNB-jN4o8AHaL2?rs=1&pid=ImgDetMain"
                        alt="Fruits 4"
                    />
                    <p>Fruits 4</p>
                </div>
                <div className="card">
                    <img
                        src="https://www.thespruce.com/thmb/J2Je3xHZpnnK29p4Rn_MLdOa4ZQ=/5400x3575/filters:no_upscale():max_bytes(150000):strip_icc()/dwarf-fruit-trees-4588521-02-cb9992fa5ed6425494afcc0c542b7335.jpg"
                        alt="Fruits 5"
                    />
                    <p>Fruits 5</p>
                </div>
                <div className="card">
                    <img
                        src="https://thaka.bing.com/th/id/OIP.C57tcz1x6Lde0BRojUnf1AHaDl?w=342&h=180&c=7&r=0&o=5&pid=1.7"
                        alt="Fruits 6"
                    />
                    <p>Fruits 6</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
