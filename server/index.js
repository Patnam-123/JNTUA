import express from "express";

const app = express();
app.use(express.json()); // Built-in body parser for JSON

const users = { "shirisha@123gmail.com": "Siri@123" }; 

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (users[email] && users[email] === password) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
