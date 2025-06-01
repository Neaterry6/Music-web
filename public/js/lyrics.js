const API_KEY = "a0ebe80e-bf1a-4dbf-8d36-6935b1bfa5ea";
const LYRICS_API = "https://kaiz-apis.gleeze.com/api/shazam-lyrics";

const lyricsForm = document.getElementById("lyricsForm");
const lyricsResult = document.getElementById("lyricsResult");

lyricsForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission

    const songTitle = document.getElementById("songTitle").value.trim();
    if (!songTitle) {
        alert("Please enter a song title and artist.");
        return;
    }

    try {
        // Show loading indicator
        lyricsResult.innerHTML = "<p>Loading lyrics...</p>";

        // Fetch lyrics from the API
        const response = await fetch(`${LYRICS_API}?title=${encodeURIComponent(songTitle)}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Display lyrics
        lyricsResult.innerHTML = `
            <h2>Lyrics for "${data.title}" by ${data.artist}</h2>
            <pre>${data.lyrics}</pre>
        `;
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        lyricsResult.innerHTML = `<p class="error">Failed to fetch lyrics. Please try again later.</p>`;
    }
})
