import express from "express";
import mysql from "mysql2";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Shiri@123",
  database: "test1",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json()); // Keep JSON parsing

// ✅ Check Database Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database Connection Failed:", err.code, err.message);
    process.exit(1);
  } else {
    console.log("Connected to MySQL Database successfully!");
    connection.release();
  }
});

// ✅ GET all users
app.get("/api/users", (req, res) => {
  const query = "SELECT id, name, email FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ success: false, message: "Database query failed." });
    }
    res.json({ success: true, data: results });
  });
});

// ✅ Create a new user (WITHOUT password hashing ❌)
app.post("/api/users", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required!" });
  }

  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ success: false, message: "Database insertion failed." });
    }
    res.json({ success: true, message: "User added", id: result.insertId });
  });
});

// ✅ User Login (WITHOUT password hashing ❌)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required!" });
  }

  const query = "SELECT id, name, email, password FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ success: false, message: "Database query failed." });
    }

    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    res.json({ success: true, message: "Login successful!", user: { id: results[0].id, name: results[0].name, email: results[0].email } });
  });
});

// ✅ UPDATE a user
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Name and email are required!" });
  }

  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(query, [name, email, id], (err, result) => {
    if (err) {
      console.error("Database update error:", err);
      return res.status(500).json({ success: false, message: "Database update failed." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, message: "User updated successfully!" });
  });
});

// ✅ DELETE a user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID!" });
  }

  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Database deletion error:", err);
      return res.status(500).json({ success: false, message: "Database deletion failed." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, message: "User deleted successfully!" });
  });
});

// ✅ Start the Express Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
