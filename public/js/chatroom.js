// DOM Elements
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const imageUpload = document.getElementById("imageUpload");
const recordBtn = document.getElementById("recordBtn");

sendMessageBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

imageUpload.addEventListener("change", handleImageUpload);
recordBtn.addEventListener("click", recordVoice);

// Send Message
function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Display user's message
    addMessageToChat("user", userMessage);

    // Check if the message includes @bot
    if (userMessage.includes("@bot")) {
        callChatbotAPI(userMessage);
    }

    // Clear the input
    messageInput.value = "";
}

// Add Message to Chat
function addMessageToChat(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Call Chatbot API
async function callChatbotAPI(userMessage) {
    try {
        const response = await fetch(`/api/chatbot?ask=${encodeURIComponent(userMessage)}`, {
            method: "GET",
        });
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Display chatbot's response
        addMessageToChat("bot", data.response);
    } catch (error) {
        console.error("Chatbot Error:", error);
        addMessageToChat("bot", "Sorry, I couldn't process your message. Please try again.");
    }
}

// Handle Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        addMessageToChat("user", "[Image uploaded]");
        addMessageToChat("image", `<img src="${reader.result}" alt="Uploaded Image" class="chat-image">`);
    };
    reader.readAsDataURL(file);
}

// Record Voice (Placeholder for voice functionality)
function recordVoice() {
    // Placeholder: Implement voice recording functionality here
    alert("Voice recording functionality is under development.");
    }
