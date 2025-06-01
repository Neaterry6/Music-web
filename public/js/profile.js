const profileForm = document.getElementById("profileForm");

// Simulated Backend Data for Chat History and Last Search
const userData = {
    email: "johndoe@example.com",
    password: "securePassword123",
    iif: "1234567890", // Unique IIF Number
    chatHistory: [
        { timestamp: "2025-05-31 12:34:56", message: "What is the latest song by Taylor Swift?" },
        { timestamp: "2025-05-30 09:20:11", message: "Play 'Shape of You' by Ed Sheeran." },
    ],
    lastSearches: ["Taylor Swift", "Ed Sheeran", "Coldplay"],
};

// Profile Form Submission for Email and Password
profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill in both email and password fields.");
        return;
    }

    // Simulated Backend Call for Authentication
    try {
        const response = await fetch("/api/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        alert(`Welcome back, ${data.name}!`);
        displayProfile(data); // Display the profile info, chat history, and last searches
    } catch (error) {
        console.error("Authentication Error:", error);
        alert("Failed to authenticate. Please check your email and password.");
    }
});

// Display Profile Info, Chat History, and Last Searches
function displayProfile(user) {
    // Update Profile Section
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userIIF").textContent = `IIF Number: ${user.iif}`;

    // Display Chat History
    const chatHistoryContainer = document.getElementById("chatHistory");
    chatHistoryContainer.innerHTML = "";
    user.chatHistory.forEach((chat) => {
        const chatItem = document.createElement("div");
        chatItem.classList.add("chat-item");
        chatItem.innerHTML = `
            <span class="chat-timestamp">${chat.timestamp}</span>
            <span class="chat-message">${chat.message}</span>
        `;
        chatHistoryContainer.appendChild(chatItem);
    });

    // Display Last Searches
    const lastSearchesContainer = document.getElementById("lastSearches");
    lastSearchesContainer.innerHTML = "";
    user.lastSearches.forEach((search) => {
        const searchItem = document.createElement("div");
        searchItem.classList.add("search-item");
        searchItem.textContent = search;
        lastSearchesContainer.appendChild(searchItem);
    });
}

// Simulate Profile Loading on Page Load
document.addEventListener("DOMContentLoaded", () => {
    displayProfile(userData); // Replace with a real API call in production
});