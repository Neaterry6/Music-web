const fetch = require("node-fetch");

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { q } = req.query;
    const API_KEY = process.env.API_KEY;
    const SEARCH_API = `https://kaiz-apis.gleeze.com/api/ytsearch?q=${encodeURIComponent(
        q
    )}&apikey=${API_KEY}`;

    try {
        const response = await fetch(SEARCH_API);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({ error: "Failed to fetch search results" });
    }
          
