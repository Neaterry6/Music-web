const API_KEY = '8e3b0d39-d9d4-47a1-a125-0801eb103e7f';
const SEARCH_API = 'https://kaiz-apis.gleeze.com/api/ytsearch';
const MP3_API = 'https://kaiz-apis.gleeze.com/api/ytdown-mp3';
const VIDEO_API = 'https://kaiz-apis.gleeze.com/api/ytmp4';

const loadingScreen = document.getElementById('loadingScreen');
const mainContent = document.getElementById('mainContent');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsGrid = document.getElementById('resultsGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const welcomeSection = document.getElementById('welcomeSection');
const videoContainer = document.getElementById('videoContainer');
const videoPlayer = document.getElementById('videoPlayer');

// Updated random search terms
const randomSearchTerms = [
    'Asake Only Me', 'Rema Ravage', 'Davido Flex My Soul', 'Wizkid Energy Remix',
    'Omah Lay Hello Hello', 'Fireboy DML Pressure', 'Ayra Starr Commas',
    'Tems Forever Interlude', 'Burna Boy Bad Since 97 Deluxe', 'Drake Summer Diaries',
    'The Weeknd Angel’s Cry', 'Central Cee Famous 2025', 'Future Toxic Heart'
];

// Ensure API_KEY is present
if (!API_KEY) {
    alert('API Key is missing. Please update the script with a valid API key.');
    throw new Error('API Key is missing.');
}

// Search YouTube using the API
async function searchYouTube(query) {
    try {
        loadingIndicator.style.display = 'block'; // Show loading indicator
        const searchUrl = `${SEARCH_API}?q=${encodeURIComponent(query)}&apikey=${API_KEY}`;
        const response = await fetch(searchUrl);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        loading indicator

        if (data && data.items && Array.isArray(data.items)) {
            return data.items.map((item, index) => ({
                videoId: item.url ? item.url.split('v=')[1]?.split('&')[0] : `video-${index}`,
                title: item.title || 'Unknown Title',
                author: extractAuthorFromTitle(item.title) || 'Unknown Artist',
                thumbnail: item.thumbnail || 'https://via.placeholder.com/480x360?text=No+Image',
                duration: item.duration || 'Unknown',
                url: item.url || '',
            }));
        } else {
            return [];
 name from title
function extractAuthorFromTitle(title) {
    const patterns = [/^([^-]+)\s*-/, /^([^|]+)\s*\|/, /^([^:]+)\s*:/];
    for (const pattern of patterns) {
        const match = title.match(pattern);
        if (match) return match[1].trim();
    }
    return title.split(/[-|:]/)[0].trim() || 'Unknown Artist';
}

// Play video on the site
async function playVideo(videoId) {
    try {
        const videoUrl = `${VIDEO_API}?id=${videoId}&apikey=${API_KEY}`;
        const response = await fetch(videoUrl);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data && data.video_url) {
            videoPlayer.src = data.video_url;
            videoContainer.style.display = 'block'; // Show the video player
            videoPlayer.play();
        } else {
            alert('Failed to fetch video playback URL.');
        }
    } catch (error) {
        console.error('Error playing video:', error);
        alert('Failed to play video. Please try again later.');
    }
}

// Download video
async function downloadVideo(videoId) {
    try {
        const videoUrl = `${VIDEO_API}?id=${videoId}&apikey=${API_KEY}`;
        const response = await fetch(videoUrl);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data && data.download_url) {
            window.open(data.download_url, '_blank'); // Open download link in a new tab
        } else {
            alert('Failed to fetch video download link.');
        }
    } catch (error) {
        console.error('Error downloading video:', error);
        alert('Failed to download video. Please try again later.');
    }
}

// Display search results
function displayResults(results) {
    resultsGrid.innerHTML = ''; // Clear previous results
    results.forEach((result) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <img src="${result.thumbnail}" alt="${result.title}" class="thumbnail">
            <div class="result-title">${result.title}</div>
            <div class="result-author">By: ${result.author}</div>
            <div class="result-duration">Duration: ${result.duration}</div>
            <button class="play-btn" onclick="playVideo('${result.videoId}')">▶️ Play</button>
            <button class="download-btn" onclick="downloadVideo('${result.videoId}')">⬇️ Download</button>
        `;
        resultsGrid.appendChild(card);
    });
}

// Initialize random content on startup
setTimeout(() => {
    loadingScreen.classList.add('hidden');
    mainContent.classList.add('visible');
    const randomTerm = randomSearchTerms[Math.floor(Math.random() * randomSearchTerms.length)];
    searchYouTube(randomTerm).then(displayResults);
}, 3000);

// Handle Search Button Click
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a search query.');
        return;
    }
    searchYouTube(query).then(displayResults);
});