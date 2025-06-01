// DOM Elements
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const imageUpload = document.getElementById("imageUpload");
const recordBtn = document.getElementById("recordBtn");

// WebSocket for Real-Time Communication
const socket = new WebSocket("ws://localhost:8080");

// Set Username
const username = prompt("Enter your username:") || "Anonymous";

// WebSocket Event: Connection Opened
socket.addEventListener("open", () => {
    console.log("Connected to WebSocket server.");
    addSystemMessage("You are connected to the chat!");
});

// WebSocket Event: Connection Error
socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
    addSystemMessage("Error connecting to the chat server.");
});

// WebSocket Event: Connection Closed
socket.addEventListener("close", () => {
    addSystemMessage("Disconnected from the chat server.");
});

// WebSocket Event: Message Received
socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "image") {
        addImageToChat(data.sender, data.imageUrl, data.timestamp);
    } else {
        addMessageToChat(data.sender, data.message, data.timestamp);
    }
});

// Send Message
function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    const messageData = {
        type: "text",
        sender: username,
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
    messageContainer.classList.add("message-container", sender === username ? "user" : "other");

    const senderDiv = document.createElement("div");
    senderDiv.classList.add("sender");
    senderDiv.textContent = sender;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.innerHTML = message;

    const timestampDiv = document.createElement("div");
    timestampDiv.classList.add("timestamp");
    timestampDiv.textContent = timestamp;

    messageContainer.appendChild(senderDiv);
    messageContainer.appendChild(messageDiv);
    messageContainer.appendChild(timestampDiv);
    chatMessages.appendChild(messageContainer);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add Image to Chat
function addImageToChat(sender, imageUrl, timestamp) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", sender === username ? "user" : "other");

    const senderDiv = document.createElement("div");
    senderDiv.classList.add("sender");
    senderDiv.textContent = sender;

    const imageDiv = document.createElement("div");
    imageDiv.classList.add("message");
    imageDiv.innerHTML = `<img src="${imageUrl}" alt="Uploaded Image" class="chat-image">`;

    const timestampDiv = document.createElement("div");
    timestampDiv.classList.add("timestamp");
    timestampDiv.textContent = timestamp;

    messageContainer.appendChild(senderDiv);
    messageContainer.appendChild(imageDiv);
    messageContainer.appendChild(timestampDiv);
    chatMessages.appendChild(messageContainer);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add System Message
function addSystemMessage(message) {
    const systemMessage = document.createElement("div");
    systemMessage.classList.add("system-message");
    systemMessage.textContent = message;
    chatMessages.appendChild(systemMessage);

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
        const imageUrl = reader.result;

        const messageData = {
            type: "image",
            sender: username,
            imageUrl: imageUrl,
            timestamp: getCurrentTimestamp(),
        };

        // Send the image upload message to the server
        socket.send(JSON.stringify(messageData));

        // Add image preview to chat
        addImageToChat(username, imageUrl, messageData.timestamp);
    };
    reader.readAsDataURL(file);
});

// Record Voice (Placeholder for voice functionality)
recordBtn.addEventListener("click", () => {
    alert("Voice recording functionality is under development.");
});

// Event Listener: Send Message on Button Click
sendMessageBtn.addEventListener("click", sendMessage);

// Event Listener: Send Message on Enter Key Press
messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});