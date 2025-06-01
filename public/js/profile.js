const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const dpInput = document.getElementById("dp");
    const dpFile = dpInput.files[0];

    if (!name || !dpFile) {
        alert("Please fill in all fields.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("dp", dpFile);

    try {
        const response = await fetch("/api/profile", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        alert(`Profile created!\nName: ${data.name}\nUser ID: ${data.uid}`);
    } catch (error) {
        console.error("Profile Creation Error:", error);
        alert("Failed to create profile. Please try again.");
    }
})
