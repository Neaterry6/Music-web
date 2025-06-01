const fetch = require("node-fetch");

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { url } = req.query;
    const API_KEY = process.env.API_KEY;
    const MP3_API = `https://kaiz-apis.gleeze.com/api/ytdown-mp3?url=${encodeURIComponent(
        url
    )}&apikey=${API_KEY}`;

    try {
        const response = await fetch(MP3_API);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("MP3 Download API Error:", error);
        res.status(500).json({ error: "Failed to fetch MP3 download link" });
    }
          
