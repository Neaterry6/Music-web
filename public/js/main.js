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
  // Davido
  'Davido Flex My Soul', 'Davido Away Official Video', 'Davido No Competition ft Asake',
  'Davido For The Road Live Performance', 'Davido Unavailable Remix ft Musa Keys',

  // Wizkid
  'Wizkid Energy Remix ft Tems', 'Wizkid One Love Afro Edition', 'Wizkid Bad To Me Live',
  'Wizkid Frames Who’s Gonna Know', 'Wizkid Balance Official Video',

  // Asake
  'Asake Only Me', 'Asake 2:30 Live at Afro Nation', 'Asake Sunshine Bliss',
  'Asake Yoga Deluxe', 'Asake Terminator Reloaded',

  // Fireboy DML
  'Fireboy DML Obaa Sima', 'Fireboy DML Peru Piano Version', 'Fireboy DML Playboy Deluxe',
  'Fireboy DML Pressure Official Video', 'Fireboy DML Change Live',

  // Ruger
  'Ruger Kristy', 'Ruger Jonzing Boy', 'Ruger Tour Mixtape 2025', 'Ruger Bounce Unplugged',
  'Ruger Dear Ex Official Video',

  // Omah Lay
  'Omah Lay Hello Hello', 'Omah Lay Reason Official Video', 'Omah Lay Soso USA Tour',
  'Omah Lay Temptations Live', 'Omah Lay Imagine',

  // Ayra Starr
  'Ayra Starr Commas', 'Ayra Starr Rush Remix', 'Ayra Starr Control', 'Ayra Starr Fashion Killer Acoustic',

  // Burna Boy
  'Burna Boy Higher', 'Burna Boy City Boys Deluxe', 'Burna Boy Last Last 2025 Remix', 'Burna Boy Party Animal',

  // Seyi Vibez
  'Seyi Vibez Different Pattern', 'Seyi Vibez Karma', 'Seyi Vibez Billion Dollar',

  // Zinoleesky
  'Zinoleesky Sakara', 'Zinoleesky Personal', 'Zinoleesky Yan Yan',

  // Mohbad (RIP but tribute/legacy releases)
  'Mohbad Beast & Peace', 'Mohbad Feelings', 'Mohbad Peace II',

  // Portable (if you want street vibes)
  'Portable Dodondawa', 'Portable Ogundabede', 'Portable Neighbourhood',

  // BNXN (Buju)
  'BNXN Romeo Must Die ft Ruger', 'BNXN Pray', 'BNXN Sweet Tea', 'BNXN Say My Name',

  // Odumodublvck
  'Odumodublvck Blood On The Dance Floor', 'Odumodublvck Declan Rice II', 'Odumodublvck Techno Cruise',

  // Victony
  'Victony OHEMA', 'Victony Soweto Deluxe', 'Victony Holy Father Acoustic',

  // Others
  'Kizz Daniel Too Busy To Be Bae', 'Mayorkun Lowkey!', 'Lojay Arizona', 'Carter Efe Ololade Mi Carter',
  'Young Jonn Aquafina', 'Pheelz Go Low', 'Bella Shmurda Loner', 'Mr Eazi Advice' "Asake - Only Me",
    "Rema - Ravage",
    "Davido - Flex My Soul",
    "Wizkid - Energy Remix",
    "Omah Lay - Hello Hello",
    "Fireboy DML - Pressure",
    "Ayra Starr - Commas",
    "Tems - Forever Interlude",
    "Burna Boy - Tested, Approved & Trusted",
    "Joeboy - Osadebe",
    "Zinoleesky - Sakara",
    "Seyi Vibez - Different Patterns",
    "BNXN - Romeo Must Die ft Ruger",
    "Pheelz - Go Low",
    "Kizz Daniel - Twe Twe",
    "Oxlade - Intoxycated",
    "Bella Shmurda - Loner",
    "Mohbad - Ask About Me",
    "Tyla - Truth Or Dare",
    "Shallipopi - Elon Musk Remix",
    "Libianca - People",
    "Ruger - Kristy",
    "Victony - Ohema",
    "CKay - Capture My Soul",
    "Mayorkun - Lowkey!",

    // US / UK 🇺🇸 🇬🇧
    "Drake - Family Matters",
    "21 Savage - Should've Worn A Bonnet",
    "Nicki Minaj - Pink Friday Girls",
    "Future - Toxic Heart",
    "Travis Scott - FE!N",
    "Doja Cat - Paint The Town Red",
    "SZA - Saturn",
    "Post Malone - Pour Me A Drink",
    "The Weeknd - Angels Cry",
    "Lil Durk - All My Life ft J Cole",
    "Metro Boomin - Too Many Nights",
    "Kendrick Lamar - Euphoria",
    "Ice Spice - Think U The Shit",
    "Latto - Sunday Service",
    "Ariana Grande - We Can't Be Friends",
    "Bryson Tiller - Whatever She Wants",
    "Chris Brown - Nightmares",
    "Rod Wave - Checkmate",
    "Central Cee - Band4Band",
    "Stormzy - Toxic Trait",
    "Dave - Sprinter ft Central Cee",
    "J Hus - Who Told You",
    "Ed Sheeran - American Town",
    "PinkPantheress - Nice To Meet You",

    // SA / Ghana / East Africa 🇿🇦 🇬🇭 🇰🇪
    "Uncle Waffles - Yahyuppiyah",
    "Kabza De Small - Xola",
    "Focalistic - Ka Lekeke",
    "Black Sherif - Oh Paradise",
    "Stonebwoy - Life & Money",
    "Sarkodie - Otan",
    "King Promise - Terminator",
    "Camidoh - Brown Skin Girl",
    "Diamond Platnumz - My Baby",
    "Rayvanny - Forever",
    "Harmonize - Single Again",
    "Mbosso - Amepotea",
    "Zuchu - Napambana",

    // Caribbean / Afro-Fusion / Latin 🇯🇲 🇨🇴 🇧🇷
    "Popcaan - Bend It Over",
    "Vybz Kartel - Gaza Forever",
    "Sean Paul - Summa Hot",
    "J Balvin - Morado",
    "Maluma - Coco Loco",
    "Anitta - Bellakeo",
    "Rauw Alejandro - Dime Quien???",
    "Bad Bunny - Monaco",
    "Karol G - Provenza",

    // Viral / TikTok Hits 🌍
    "Tyla - Water",
    "Odumodublvck - Declan Rice",
    "Shallipopi - Cast ft Odumodublvck",
    "Victor Thompson - This Year",
    "Victony - Soweto Remix",
    "Ice Prince - Bank Alert",
    "Mr Eazi - Advice",
    "Reekado Banks - Feel Different",
    "Odumodublvck - Blood On The Dance Floor",
    "Tee Dollar - Alhamdulillah",
    "Bloody Civilian - Mad Apology",
    "Seyi Vibez - Hat-trick",
    "Portable - Dodondawa",

    // Alt / Pop / Other 🌏
    "Billie Eilish - Lunch",
    "Olivia Rodrigo - Obsessed",
    "Taylor Swift - Fortnight",
    "Tate McRae - Greedy",
    "Dua Lipa - Houdini",
    "Sabrina Carpenter - Espresso",
    "Charli XCX - 360",
    "Adele - Easy On Me",
    "Hozier - Too Sweet",
    "A Boogie Wit Da Hoodie - No 808s"
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