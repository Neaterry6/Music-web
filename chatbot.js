// DOM Elements
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const imageUpload = document.getElementById("imageUpload");
const recordBtn = document.getElementById("recordBtn");

// Constants for Chatbot API
const API_URL = "https://kaiz-apis.gleeze.com/api/gpt-4.1";
const API_KEY = "a0ebe80e-bf1a-4dbf-8d36-6935b1bfa5ea";
const USER_ID = "1268"; // Replace this with the actual user ID if needed

// Event Listeners
sendMessageBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

imageUpload.addEventListener("change", handleImageUpload);
recordBtn.addEventListener("click", recordVoice);

// Function to send a text message
function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Display user's message with a timestamp
    addMessageToChat("user", userMessage, getCurrentTimestamp());

    // Call the chatbot API for a response
    callChatbotAPI(userMessage);

    // Clear the input field
    messageInput.value = "";
}

// Function to handle image uploads
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
        const imageUrl = reader.result; // Base64-encoded image
        addMessageToChat("user", `[Image uploaded]`, getCurrentTimestamp());

        // Call the chatbot API with the uploaded image
        const response = await callChatbotAPI("What is in this image?", imageUrl);
        if (response) {
            addMessageToChat("bot", response, getCurrentTimestamp());
        }
    };
    reader.readAsDataURL(file);
}

// Function to call the chatbot API
async function callChatbotAPI(query, imageUrl = null) {
    try {
        // Build the API request URL
        const apiUrl = `${API_URL}?ask=${encodeURIComponent(query)}&uid=${USER_ID}&apikey=${API_KEY}`;
        const fullUrl = imageUrl ? `${apiUrl}&imageUrl=${encodeURIComponent(imageUrl)}` : apiUrl;

        // Make the API request
        const response = await fetch(fullUrl, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        // Return the chatbot's response
        return data.response || "Sorry, I couldn't process your request.";
    } catch (error) {
        console.error("Chatbot API Error:", error);
        addMessageToChat("bot", "Sorry, something went wrong. Please try again later.", getCurrentTimestamp());
    }
}

// Function to add a message to the chat UI
function addMessageToChat(sender, message, timestamp) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", sender);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.innerHTML = message;

    const timestampDiv = document.createElement("div");
    timestampDiv.classList.add("timestamp");
    timestampDiv.textContent = timestamp;

    messageContainer.appendChild(messageDiv);
    messageContainer.appendChild(timestampDiv);
    chatMessages.appendChild(messageContainer);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to get the current timestamp
function getCurrentTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

// Placeholder for voice recording functionality
function recordVoice() {
    alert("Voice recording functionality is under development.");
    }
