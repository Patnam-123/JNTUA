import express from "express";
import mongoose from "mongoose";
import student from "./Schemas/student.js";
import fee from "./Schemas/Fee.js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const App = express();
App.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,  // For IPv4 compatibility
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

App.get('/home', (req, res) => {
    res.send('Hello World');
});
App.post('/student', async (req, res) => {
    try {
        const { name, class: classId, rollNo } = req.body;
        const newStudent = new student({ name, class: classId, rollNo });
        await newStudent.save();
        res.send('Student created successfully');
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});
App.post('/teacher',async(req,res) => {
    try {
        const { name, class: classId, rollNo } = req.body;
        const newStudent = new student({ name, class: classId, rollNo });
        await newStudent.save();
        res.send('Teacher created successfully');
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})
App.get('/teacher',async(req,res) => {
    try {
        const teachers = await teacher.find();
        res.send(teachers);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Update student details
App.put('/student/:id', async (req, res) => {
    try {
        const updatedStudent = await student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedStudent);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// Delete a student
App.delete('/student/:id', async (req, res) => {
    try {
        await student.findByIdAndDelete(req.params.id);
        res.send("Student deleted successfully");
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// Create a new fee record
App.post('/fee', async (req, res) => {
    try {
        const { student, amount, date } = req.body;
        const newFee = new fee({ student, amount, date });
        await newFee.save();
        res.send('Fee Document is created successfully');
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// Update fee details
App.put('/fee/:id', async (req, res) => {
    try {
        const updatedFee = await fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedFee);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// Delete a fee record
App.delete('/fee/:id', async (req, res) => {
    try {
        await fee.findByIdAndDelete(req.params.id);
        res.send("Fee record deleted successfully");
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// Get all fees for a student
App.get('/studentfee/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const StudentFees = await fee.find({ student: studentId });
        res.send(StudentFees);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

const PORT = process.env.PORT || 3000;
App.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});