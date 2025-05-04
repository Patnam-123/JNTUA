




import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; 

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Image links
  const images = [
    "https://i2.wp.com/youmeandtrends.com/wp-content/uploads/2015/11/beautiful-flowers-pictures-free-download.jpg",
    "https://th.bing.com/th/id/OIP.qyFYnw16wSs82SNlnnpkJQHaEo?rs=1&pid=ImgDetMain",
    "https://th.bing.com/th/id/OIP.SVe3J_VJA-qtamG0F7c4swHaEo?rs=1&pid=ImgDetMain",
    "https://images8.alphacoders.com/398/thumb-1920-398553.jpg",
    "https://i.pinimg.com/originals/8b/ce/0e/8bce0e670f0680b86690311e6064e934.jpg",
    "https://www.cakehut.in/image/cache/catalog/2021%20cake%20photos/Double%20Chocolatee-1701x1423.jpg.webp",
    
  ];

  return (
    <div className="dashboard-container">
      {/* User Info Card */}
      <div className="user-info-card">
        <h2>Welcome, {user?.email || "Guest"}!</h2>
        <p>You are logged in.</p>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {/* Card Section */}
      <div className="card-grid">
        {images.map((src, index) => (
          <div key={index} className="card">
            <div className="card-image">
              <img src={src} alt={`Card ${index + 1}`} />
            </div>
            <div className="card-content">
              <h3>Card {index + 1}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
