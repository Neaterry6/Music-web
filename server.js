const express = require("express");
const multer = require("multer");
const path = require("path");
const { Server } = require("socket.io"); // Added for real-time chat
const http = require("http");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Wrap app in HTTP server for Socket.IO
const io = new Server(server); // Initialize Socket.IO
const PORT = process.env.PORT || 3000;

// Simulated database for users and chat history
const users = [];
const chatHistory = {};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: "public/assets",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Authentication API
app.post("/api/authenticate", (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    // Find user in the database
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
    }

    // Return user data (excluding password)
    res.json({
        name: user.name,
        email: user.email,
        iif: user.iif,
        chatHistory: chatHistory[user.iif] || [],
        lastSearches: user.lastSearches || [],
    });
});

// Profile API
app.post("/api/profile", (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return res.status(409).json({ error: "User already exists. Please log in." });
    }

    // Create new user profile
    const uid = Date.now().toString(); // Generate a unique ID
    const newUser = { name, email, password, iif: uid, lastSearches: [] };
    users.push(newUser);

    // Initialize chat history for the user
    chatHistory[uid] = [];

    res.json({ uid, name, email });
});

// Chatbot API with Chat History Support
app.get("/api/chatbot", async (req, res) => {
    const { ask, uid } = req.query;

    if (!ask || !uid) {
        return res.status(400).json({ error: "Question and user ID are required." });
    }

    const API_KEY = process.env.API_KEY;
    const CHATBOT_API = `https://kaiz-apis.gleeze.com/api/gpt-4.1?ask=${encodeURIComponent(
        ask
    )}&uid=${uid}&apikey=${API_KEY}`;

    try {
        const response = await fetch(CHATBOT_API);
        const data = await response.json();

        // Save chat history for the user
        if (!chatHistory[uid]) {
            chatHistory[uid] = [];
        }
        chatHistory[uid].push({
            timestamp: new Date().toISOString(),
            message: ask,
            response: data.response,
        });

        res.json(data);
    } catch (error) {
        console.error("Chatbot API Error:", error);
        res.status(500).json({ error: "Failed to fetch chatbot response" });
    }
});

// Real-time Chatroom Socket.IO Integration
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining the chatroom
    socket.on("join-chat", ({ username, uid }) => {
        users.push({ username, uid, socketId: socket.id });
        socket.broadcast.emit("user-joined", { username });
        console.log(`${username} joined the chat.`);
    });

    // Handle new chat messages
    socket.on("chat-message", ({ username, message }) => {
        const timestamp = new Date().toLocaleTimeString();
        chatHistory[username] = chatHistory[username] || [];
        chatHistory[username].push({ message, timestamp });

        // Emit to all clients
        io.emit("chat-message", { username, message, timestamp });
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        const user = users.find((u) => u.socketId === socket.id);
        if (user) {
            users.splice(users.indexOf(user), 1);
            io.emit("user-left", { username: user.username });
            console.log(`${user.username} left the chat.`);
        }
    });
});

// Music and Video Search API
app.get("/api/search", async (req, res) => {
    const query = req.query.q;
    const uid = req.query.uid; // User ID for tracking searches
    const API_KEY = process.env.API_KEY;
    const SEARCH_API = `https://kaiz-apis.gleeze.com/api/ytsearch?q=${encodeURIComponent(query)}&apikey=${API_KEY}`;

    if (!query || !uid) {
        return res.status(400).json({ error: "Search query and user ID are required." });
    }

    try {
        const response = await fetch(SEARCH_API);
        const data = await response.json();

        // Track user's last searches
        const user = users.find(u => u.iif === uid);
        if (user) {
            user.lastSearches = user.lastSearches || [];
            user.lastSearches.push(query);
            if (user.lastSearches.length > 10) {
                user.lastSearches.shift(); // Keep only the last 10 searches
            }
        }

        res.json(data);
    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({ error: "Error fetching search results" });
    }
});

// MP3 and Video Download APIs
app.get("/api/download-mp3", async (req, res) => {
    const url = req.query.url;
    const API_KEY = process.env.API_KEY;
    const MP3_API = `https://kaiz-apis.gleeze.com/api/ytdown-mp3?url=${encodeURIComponent(url)}&apikey=${API_KEY}`;

    try {
        const response = await fetch(MP3_API);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("MP3 Download API Error:", error);
        res.status(500).json({ error: "Error fetching MP3 download link" });
    }
});

app.get("/api/download-video", async (req, res) => {
    const url = req.query.url;
    const quality = req.query.quality || "360";
    const API_KEY = process.env.API_KEY;
    const VIDEO_API = `https://kaiz-apis.gleeze.com/api/ytmp4?url=${encodeURIComponent(url)}&quality=${quality}&apikey=${API_KEY}`;

    try {
        const response = await fetch(VIDEO_API);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Video Download API Error:", error);
        res.status(500).json({ error: "Error fetching video download link" });
    }
});

// Upload APIs
app.post("/api/upload-image", upload.single("image"), (req, res) => {
    res.json({ imageUrl: `/assets/${req.file.filename}` });
});

app.post("/api/upload-voice", upload.single("voice"), (req, res) => {
    res.json({ voiceUrl: `/assets/${req.file.filename}` });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});