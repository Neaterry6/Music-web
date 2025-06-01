const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission reload

    const userMessage = chatInput.value.trim();
    if (!userMessage) {
        alert("Please enter a message.");
        return;
    }

    // Display user's message in the chat
    addMessageToChat("user", userMessage);

    // Check if the chatbot is tagged (e.g., @bot)
    if (userMessage.includes("@bot")) {
        try {
            // Call the chatbot API
            const response = await fetch(`/api/chatbot?ask=${encodeURIComponent(userMessage)}`, {
                method: "GET",
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Display chatbot's response in the chat
            addMessageToChat("bot", data.response);
        } catch (error) {
            console.error("Chatbot Error:", error);
            addMessageToChat("bot", "Sorry, I couldn't process your message. Please try again.");
        }
    }

    // Clear input field
    chatInput.value = "";
});

function addMessageToChat(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
