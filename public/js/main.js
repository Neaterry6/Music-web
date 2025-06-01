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

// Random search terms for initial display
const randomSearchTerms = [
    'NF', 'Eminem', 'Drake', 'Taylor Swift', 
    'Ed Sheeran', 'Billie Eilish', 'The Weeknd', 
    'Ariana Grande', 'Post Malone', 'Dua Lipa',
    'trending music 2024', 'top hits', 'new songs'
];

// Search YouTube using the API
async function searchYouTube(query) {
    try {
        loadingIndicator.style.display = 'block'; // Show loading indicator
        const searchUrl = `${SEARCH_API}?q=${encodeURIComponent(query)}&apikey=${API_KEY}`;
        
        const response = await fetch(searchUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        loadingIndicator.style.display = 'none'; // Hide loading indicator
        if (data && data.items && Array.isArray(data.items)) {
            return data.items.map((item, index) => ({
                videoId: item.url ? item.url.split('v=')[1]?.split('&')[0] : `video-${index}`,
                title: item.title || 'Unknown Title',
                author: extractAuthorFromTitle(item.title) || 'Unknown Artist',
                thumbnail: item.thumbnail || 'https://via.placeholder.com/480x360?text=No+Image',
                duration: item.duration || 'Unknown',
                url: item.url || ''
            }));
        } else {
            return [];
        }
    } catch (error) {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
        console.error('Error fetching search results:', error);
        alert('Failed to fetch search results. Please try again later.');
        return [];
    }
}

// Extract artist name from title
function extractAuthorFromTitle(title) {
    const patterns = [/^([^-]+)\s*-/, /^([^|]+)\s*\|/, /^([^:]+)\s*:/];
    for (const pattern of patterns) {
        const match = title.match(pattern);
        if (match) return match[1].trim();
    }
    return title.split(/[-|:]/)[0].trim() || 'Unknown Artist';
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
            <button class="download-btn mp3-btn" onclick="downloadMP3('${result.url}', '${result.title}')">🎵 Download MP3</button>
            <button class="download-btn video-btn" onclick="downloadVideo('${result.url}', '${result.title}')">🎬 Download Video</button>
        `;
        resultsGrid.appendChild(card);
    });
}

// Download MP3
async function downloadMP3(url, title) {
    try {
        const response = await fetch(`${MP3_API}?url=${encodeURIComponent(url)}&apikey=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.download_url) {
            window.open(data.download_url, '_blank');
        } else {
            alert('Failed to fetch MP3 download link.');
        }
    } catch (error) {
        console.error('Error downloading MP3:', error);
        alert('Failed to download MP3. Please try again later.');
    }
}

// Download Video
async function downloadVideo(url, title) {
    try {
        const response = await fetch(`${VIDEO_API}?url=${encodeURIComponent(url)}&apikey=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.download_url) {
            window.open(data.download_url, '_blank');
        } else {
            alert('Failed to fetch video download link.');
        }
    } catch (error) {
        console.error('Error downloading video:', error);
        alert('Failed to download video. Please try again later.');
    }
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