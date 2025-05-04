import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";

// dotenv.config();
dotenv.config({ path: "../.env" }); 

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

/** ✅ Register Route */
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
});

/** ✅ Login Route (Fixed) */
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" }); // ✅ Fix: Username must exist
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" }); // ✅ Fix: Check correct password
    }

    const token = jwt.sign(
        { userId: user._id, username: user.username },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

/** ✅ Token Verification Middleware */
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(403).json({ message: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        req.user = decoded;
        next();
    });
};

/** ✅ Protected Routes */
app.get("/dashboard", verifyToken, (req, res) => {
    res.json({ message: "Welcome to the dashboard!", user: req.user });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


// import express from "express";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import bcrypt from "bcrypt";
// import User from "./Schema/User.js"; // Import the User schema

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const SECRET_KEY = process.env.SECRET_KEY;
// const MONGO_URI = process.env.MONGO_URI;

// mongoose.connect(MONGO_URI, { 
//     useNewUrlParser: true, 
//     useUnifiedTopology: true, 
//     family: 4 
// })
// .then(() => console.log("Connected to MongoDB"))
// .catch(err => console.error("MongoDB connection error:", err));

// app.use(cors());
// app.use(express.json());

// // Auto-Create User on First Login
// app.post("/login", async (req, res) => {
//     const { username, password } = req.body;

//     let user = await User.findOne({ username });

//     if (!user) {
//         // Create user if not found
//         const hashedPassword = await bcrypt.hash(password, 10);
//         user = new User({ username, password: hashedPassword });
//         await user.save();
//         console.log("New user created:", username);
//     }

//     // Verify password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//         return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT Token
//     const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

//     res.json({ token });
// });

// // Middleware for Protected Route
// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) return res.status(403).json({ message: "No token provided" });

//     jwt.verify(token, SECRET_KEY, (err, decoded) => {
//         if (err) return res.status(401).json({ message: "Invalid token" });

//         req.user = decoded;
//         next();
//     });
// };

// // Protected Route
// app.get("/protected", verifyToken, (req, res) => {
//     res.json({ message: "Protected content", user: req.user });
// });

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
