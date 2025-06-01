// DOM Elements
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const imageUpload = document.getElementById("imageUpload");
const recordBtn = document.getElementById("recordBtn");

// WebSocket for Real-Time Communication
const socket = new WebSocket("ws://localhost:8080");

// Listen for messages from the server
socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    addMessageToChat(data.sender, data.message, data.timestamp);
});

// Send Message
function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    const messageData = {
        sender: "user",
        message: userMessage,
        timestamp: getCurrentTimestamp(),
    };

    // Send the message to the server
    socket.send(JSON.stringify(messageData));

    // Add the message to the chat UI
    addMessageToChat(messageData.sender, messageData.message, messageData.timestamp);

    // Clear the input field
    messageInput.value = "";
}

// Add Message to Chat
function addMessageToChat(sender, message, timestamp) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", sender);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = message;

    const timestampDiv = document.createElement("div");
    timestampDiv.classList.add("timestamp");
    timestampDiv.textContent = timestamp;

    messageContainer.appendChild(messageDiv);
    messageContainer.appendChild(timestampDiv);
    chatMessages.appendChild(messageContainer);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get Current Timestamp
function getCurrentTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

// Handle Image Upload
imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const messageData = {
            sender: "user",
            message: `[Image uploaded]`,
            timestamp: getCurrentTimestamp(),
        };

        // Send the image upload message to the server
        socket.send(JSON.stringify(messageData));

        // Add image preview to chat
        addMessageToChat("image", `<img src="${reader.result}" alt="Uploaded Image" class="chat-image">`, messageData.timestamp);
    };
    reader.readAsDataURL(file);
});

// Record Voice (Placeholder for voice functionality)
recordBtn.addEventListener("click", () => {
    alert("Voice recording functionality is under development.");
});