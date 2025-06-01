const fetch = require("node-fetch");

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { url, quality } = req.query;
    const API_KEY = process.env.API_KEY;
    const VIDEO_API = `https://kaiz-apis.gleeze.com/api/ytmp4?url=${encodeURIComponent(
        url
    )}&quality=${encodeURIComponent(quality || "720")}&apikey=${API_KEY}`;

    try {
        const response = await fetch(VIDEO_API);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Video Download API Error:", error);
        res.status(500).json({ error: "Failed to fetch video download link" });
    }
