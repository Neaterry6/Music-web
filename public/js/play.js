const videoPlayer = document.getElementById("videoPlayer");
const audioPlayer = document.getElementById("audioPlayer");
const mediaTitle = document.getElementById("mediaTitle");
const downloadMP3 = document.getElementById("downloadMP3");
const downloadMP4 = document.getElementById("downloadMP4");

// URL parameters to dynamically load media
const urlParams = new URLSearchParams(window.location.search);
const mediaType = urlParams.get("type"); // 'audio' or 'video'
const mediaUrl = urlParams.get("url");
const title = urlParams.get("title");

// Initialize media
if (mediaType === "video") {
    videoPlayer.src = mediaUrl;
    videoPlayer.style.display = "block";
    mediaTitle.textContent = title || "Now Playing";
} else if (mediaType === "audio") {
    audioPlayer.src = mediaUrl;
    audioPlayer.style.display = "block";
    mediaTitle.textContent = title || "Now Playing";
}

// Download Buttons
downloadMP3.addEventListener("click", async () => {
    try {
        const response = await fetch(`${MP3_API}?url=${encodeURIComponent(mediaUrl)}&apikey=${API_KEY}`);
        const data = await response.json();
        window.open(data.download_url, "_blank");
    } catch (error) {
        alert("Failed to fetch MP3 download link.");
        console.error(error);
    } 
});

downloadMP4.addEventListener("click", async () => {
    try {
        const response = await fetch(`${VIDEO_API}?url=${encodeURIComponent(mediaUrl)}&apikey=${API_KEY}`);
        const data = await response.json();
        window.open(data.download_url, "_blank");
    } catch (error) {
        alert("Failed to fetch MP4 download link.");
        console.error(error);
    }
});

// Apply effects
function applyEffect(effect) {
    const player = mediaType === "video" ? videoPlayer : audioPlayer;

    switch (effect) {
        case "normal":
            player.playbackRate = 1.0;
            break;
        case "slow":
            player.playbackRate = 0.5;
            break;
        case "speedup":
            player.playbackRate = 1.5;
            break;
        case "reverb":
            alert("Reverb effect is under development.");
            break;
        default:
            console.error("Unknown effect:", effect);
    }
}