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


// Updated random search terms for 2025
const randomSearchTerms = [
    // Nigerian trending songs
    'Asake Only Me',
    'Rema Ravage',
    'Davido Flex My Soul',
    'Wizkid Energy Remix',
    'Omah Lay Hello Hello',
    'Fireboy DML Pressure',
    'Ayra Starr Commas',
    'Tems Forever Interlude',
    'Zinoleesky Personal 2025',
    'Seyi Vibez Crown Of Glory',
    'Kizz Daniel Show You Off',
    'BNXN RMD ft Ruger',
    'Victony Stamina 2025',
    'Joeboy Shine On Me',
    'Mayorkun Low Key',
    'Tiwa Savage Water & Garri Soundtrack',
    'Odumodublvck Bulldozer',
    'Portable Ologo Forever',
    'Mohbad Blessing Me Tribute',
    'Pheelz Finesse Reloaded',
    'Reekado Banks Jeje Love',
    'Bella Shmurda Level Up',
    'Patoranking Higher Vibes',
    'Spyro Only Fine Girl Remix',
    'Skales Koni Koni Love',
    // International trending songs
    'Burna Boy Bad Since 97 Deluxe',
    'Drake Summer Diaries',
    'The Weeknd Angel’s Cry',
    'Central Cee Famous 2025',
    'Future Metro Boomin Toxic Heart',
    'Travis Scott Intergalactic',
    'Doja Cat Raw Energy',
    'Chris Brown Back 2 Sleep 2025',
    'Nicki Minaj Pink Friday 3 Reloaded',
    'Post Malone Golden Days',
    'Adele Only Us',
    'Lil Durk No Love Lost',
    'Kanye West Ty Dolla $ign Vultures 2',
    'Olivia Rodrigo Midnight Tears',
    'Dua Lipa Houdini',
    'Ed Sheeran Saltwater 2025 Edition',
    'Rihanna Comeback Single',
    'Latto Big Energy Reloaded',
    'J Hus Victory Lap',
    'Lil Baby Hard 2 Trust',
    'Stormzy Crown 2.0',
    'Sam Smith Lighthouse',
    'Metro Boomin 21 Savage Savage World',
    'Ice Spice Princess Peach',
    'Tyla Water Remix ft Tems Ayra Starr'
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
        
        const data = await response.json();
        loadingIndicator.style.display = 'none'; // Hide loading indicator
        if (data && data.items && Array.isArray(data.items)) {
            return data.items.map((item, index) => ({
                videoId: item.url ? item.url.split('v=')[1]?.split('&')[0] : `video-${index}`,
                title: item.title || 'Unknown Title',
                author: extractAuthorFromTitle(item.title) || 'Unknown Artist',
                thumbnail: item.thumbnail || 'https://via.placeholder.com/480x360?text=No+Image',
                duration: item.duration || 'Unknown',
                url: item.url || '',
                type: item.type || 'video/mp4' // Default type to video
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
            <button class="play-btn" onclick="redirectToPlay('${result.urldata.download_url) {
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