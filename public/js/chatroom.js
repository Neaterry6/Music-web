const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const imageUpload = document.getElementById("imageUpload");
const recordBtn = document.getElementById("recordBtn");

// Send Message
sendMessageBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message.startsWith(".")) {
        callChatbot(message.substring(1));
    } else {
        appendMessage("You", message);
    }
    messageInput.value = "";
});

// Call Chatbot
async function callChatbot(query) {
    try {
        const response = await fetch(`/api/chatbot?ask=${encodeURIComponent(query)}&uid=1234`);
        const data = await response.json();
        appendMessage("Chatbot", data.response);
    } catch (error) {
        console.error("Chatbot Error:", error);
    }
}

// Append Message to Chat
function appendMessage(sender, message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Image Upload
imageUpload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            appendMessage("You", `<img src="${data.imageUrl}" alt="Uploaded Image" style="max-width: 200px;">`);
        } catch (error) {
            console.error("Image Upload Error:", error);
        }
    }
});

// Voice Recording (Placeholder)
recordBtn.addEventListener("click", () => {
    alert("Voice recording feature is under development.");
})
