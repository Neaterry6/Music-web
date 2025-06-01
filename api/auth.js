const express = require("express");
const router = express.Router();

// Simulated database (replace with your actual database)
const users = [
    { email: "johndoe@example.com", password: "securePassword123", name: "John Doe", iif: "1234567890" },
    { email: "janedoe@example.com", password: "password456", name: "Jane Doe", iif: "0987654321" },
];

// Authentication endpoint
router.post("/authenticate", (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    // Find user in the database
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
    }

    // Send user data (excluding the password)
    res.json({
        name: user.name,
        email: user.email,
        iif: user.iif,
    });
});

module.exports = router;