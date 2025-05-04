import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Shiri@123",
  database: process.env.DB_NAME || "login_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database Connection Failed:", err);
    process.exit(1); // Stop the app if DB fails
  } else {
    console.log("Connected to MySQL Database!");
    connection.release();
  }
});

const SECRET_KEY = process.env.JWT_SECRET || "defaultsecretkey";

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required!" });
  }

  console.log("Login attempt:", username);

  try {
    const [rows] = await db.promise().query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length > 0) {
      const isMatch = await bcrypt.compare(password, rows[0].password);
      if (isMatch) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ success: true, token });
      }
    }
    res.status(401).json({ success: false, message: "Invalid credentials!" });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    res.json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});
app.get('/api/users', (req, res) => {
      const query = 'SELECT * FROM users';
      db.query(query, (err, results) => {
          if (err) throw error;
          res.json(results);
      });
  });
  

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to mySQL:', err);
//         return;
//     }
//     console.log('Connected to  MYSQL database');
// });
// app.get('/api/users', (req, res) => {
//     const query = 'SELECT * FROM users';
//     connection.query(query, (err, results) => {
//         if (err) throw error;
//         res.json(results);
//     });
// });
// app.put('/api/users/:id', (req, res) => {
//     const { id } = req.params;
//     const { name, email } = req.body;
//     const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
//     connection.query(query, [name, email, id], (err, result) => {
//         if (err) throw error;
//         res.json({ message: 'User updated' });
//     });
// });
// app.delete('/api/users/:id', (req, res) => {
//     const { id } = req.params;
//     const query = 'DELETE FROM users WHERE id = ?';
//     connection.query(query, [id], (err, result) => {
//         if (err) throw err;
//         res.json({ message: 'User deleted' });
//     });
// });
// app.post('/api/users', (req, res) => {
//     const { name, email } = req.body;
//     const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
//     connection.query(query, [name, email], (err, result) => {
//         if (err) throw error;
//         res.json({ message: 'User added', id: result.insertId });
//     });
// });
// connection.query('select * from users', (err, result) => {
//     if (err) throw error;
//     console.log('Data fetched:',result);

// });
// app.listen(3000,() => {
//     console.log("server is running on port 3000");
// });

// const  sql =  'INSERT INTO users(name,email) VALUES(?,?)';
// const values = ['Siri','siri@gmail.com'];
// connection.query(sql, values, (err, results) => {

//     if (err) throw err;
//     console.log("Data Inserted",results);
// });
// const deleteQuery = "DELETE FROM usersWHERE id = ?";
// connection.query('select * from users', (err, result) => {
//     if (err) throw err;
//     console.log('Data fetched:',result);

// });
// connection.query(deleteQuery, (err, result) => {
//     if (err.code == "ER_PARSE_ERROR") {
//         console.log("Invalid query");
//     }
//     console.log('Data deleted:',result);
// })
// connection.query('select * from users', (err, result) => {
//     if (err) throw err;
//     console.log('Data fetched:',result);

// });
