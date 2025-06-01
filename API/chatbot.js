const fetch = require("node-fetch");

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { ask, uid, imageUrl } = req.query;
    const API_KEY = process.env.API_KEY;
    const CHATBOT_API = `https://kaiz-apis.gleeze.com/api/gpt-4.1?ask=${encodeURIComponent(
        ask
    )}&uid=${uid}&imageUrl=${encodeURIComponent(imageUrl || "")}&apikey=${API_KEY}`;

    try {
        const response = await fetch(CHATBOT_API);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Chatbot API Error:", error);
        res.status(500).json({ error: "Failed to fetch chatbot response" });
    }
        
