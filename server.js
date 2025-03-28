require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas

const DB_URL = process.env.DB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;

mongoose
	.connect(DB_URL)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Define User Schema with unique email
const userSchema = new mongoose.Schema({
	name: String,
	email: { type: String, unique: true },
	password: String
});

// Define Note Schema
const NoteSchema = new mongoose.Schema({
	email: String, // Associate notes with users's email
	content: String,
	createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model("Note", NoteSchema);
const User = mongoose.model("User", userSchema);

// Homepage
app.get("/", (req, res) => {
	res.send("API is running successfuly...");
});

// Handle signup
app.post("/signup", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Check for existing user
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(200).json({
				redirect: true,
				message: "User already exists. Redirecting to login...",
				url: "http://127.0.0.1:5500/Signup/Login.html"
			});
		}

		// Hash password and save
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({ name, email, password: hashedPassword });
		await newUser.save();

		res.status(201).json({ message: "User created successfully!" });
	} catch (error) {
		// Handle duplicate key error (race condition)
		if (error.code === 11000) {
			return res.status(200).json({
				redirect: true,
				message: "User already exists. Redirecting to login...",
				url: "http://127.0.0.1:5500/Signup/Login.html"
			});
		}
		res
			.status(500)
			.json({ message: "Error saving user", error: error.message });
	}
});

// Handle Login
app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Compare passwords
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Return success + user data (excluding password)
		const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: "1h"
		});

		res.json({
			success: true,
			token,
			user: { name: user.name, email: user.email }
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

// Save a new note
app.post("/notes", async (req, res) => {
	try {
		console.log("Incoming note request:", req.body);
		const { email, content } = req.body;

		if (!email || !content) {
			return res.status(400).json({ error: "Email and content are required" });
		}

		const newNote = new Note({ email, content });
		await newNote.save();

		res.status(201).json({ message: "Note saved successfully", note: newNote });
	} catch (error) {
		console.error("Error saving note:", error);
		res
			.status(500)
			.json({ error: "Failed to save note", details: error.message });
	}
});

// Get notes for a user
app.get("/notes/:email", async (req, res) => {
	try {
		const { email } = req.params;
		console.log(`Fetching notes for email: ${email}`);

		if (!email) {
			return res.status(400).json({ error: "Email is required" });
		}

		const notes = await Note.find({ email }).sort({ createdAt: -1 });

		console.log("Notes found:", notes);
		res.json(notes);
	} catch (error) {
		console.error("Error fetching notes:", error);
		res
			.status(500)
			.json({ error: "Failed to fetch notes", details: error.message });
	}
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
