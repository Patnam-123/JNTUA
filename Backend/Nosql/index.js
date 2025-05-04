import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Test from "./Schemas/test.js";


// This will load the .env file located in the backend folder
dotenv.config({ path: "../.env" });  // Path relative to the current file

// console.log(process.env.MONGO_URI);  // Logs the Mongo URI from your .env file


const app = express();
app.use(express.json()); // Middleware to parse JSON

// MongoDB connection using MONGO_URI from the .env file
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,  // For IPv4 compatibility
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Register route (Plain text password - not secure for production)
app.post("/register", async (req, res) => {
  const { name, age, email, password } = req.body;

  if (!name || !age || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await Test.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Save user with plain text password (not secure for production)
    const newUser = new Test({ name, age, email, password });
    await newUser.save();

    res.json({ message: "User registered successfully", name, email });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login route (Plain text password - not secure for production)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Test.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare plain text passwords (use bcrypt in production)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await Test.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Update user details
app.put("/users/:id", async (req, res) => {
  try {
    const { name, age } = req.body;
    const updatedUser = await Test.findByIdAndUpdate(
      req.params.id,
      { name, age },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await Test.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Set the port from environment variables or default to 7000
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
