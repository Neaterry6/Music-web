const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill in both email and password fields.");
        return;
    }

    try {
        const response = await fetch("/api/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to authenticate.");
        }

        const data = await response.json();
        alert(`Welcome back, ${data.name}!\nYour IIF: ${data.iif}`);
        displayProfile(data); // Display the profile info
    } catch (error) {
        console.error("Authentication Error:", error);
        alert(error.message || "An error occurred during authentication.");
    }
});

function displayProfile(user) {
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userIIF").textContent = `IIF Number: ${user.iif}`;
}
