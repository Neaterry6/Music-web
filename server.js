const express = require("express");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// API Routes

// Chatbot API
app.get("/api/chatbot", async (req, res) => {
    const { ask, uid, imageUrl } = req.query;
    const API_KEY = process.env.API_KEY;
    const CHATBOT_API = `https://kaiz-apis.gleeze.com/api/gpt-4.1?ask=${encodeURIComponent(
        ask
    )}&uid=${uid}&imageUrl=${encodeURIComponent(imageUrl || "")}&apikey=${API_KEY}`;

    try {
        const response = await fetch(CHATBOT_API);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Chatbot API Error:", error);
        res.status(500).json({ error: "Failed to fetch chatbot response" });
    }
});

// Music and Video Search API
app.get("/api/search", async (req, res) => {
    const query = req.query.q;
    const API_KEY = process.env.API_KEY;
    const SEARCH_API = `https://kaiz-apis.gleeze.com/api/ytsearch?q=${encodeURIComponent(query)}&apikey=${API_KEY}`;

    try {
        const response = await fetch(SEARCH_API);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({ error: "Error fetching search results" });
    }
});

// MP3 Download API
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

// Video Download API
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

// Upload Image API
app.post("/api/upload-image", upload.single("image"), (req, res) => {
    res.json({ imageUrl: `/assets/${req.file.filename}` });
});

// Upload Voice API
app.post("/api/upload-voice", upload.single("voice"), (req, res) => {
    res.json({ voiceUrl: `/assets/${req.file.filename}` });
});

// Profile API
app.post("/api/profile", (req, res) => {
    const { name, dp } = req.body;
    const uid = Date.now(); // Generate a unique ID
    res.json({ uid, name, dp });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})
