// Start
let apiData = null;

function getAPIData() {
    fetch("https://api.f5api.xyz/jamtracks")
    .then(res => res.json())
    .then(data => {
        apiData = data.tracks;
        apiData = sortTracks(apiData, ['track_title']);
        loadTracks(apiData);
        localStorage.setItem("data", JSON.stringify(apiData));
        localStorage.setItem("displayed", JSON.stringify(apiData));
    })
}

getAPIData();

// Track cards handle
function loadTracks(data) {
    let cards = document.getElementById("cards");
    for (const track of Object.keys(data)) {
        cards.innerHTML += 
        `
            <a href="track/?id=${track}">
                <div class="card ${(data[track].released) ? `` : "unreleased"}">
                    <img src="${data[track].cover_image}" alt="${data[track].track_title} cover img">
                    <div>
                        ${(data[track].released) ? `<h3>${data[track].track_title}</h3>` : `<h3>${data[track].track_title}</h3>`}
                        <h4>${data[track].artist_name}</h4>
                    </div>
                </div>
            </a>
        `;
    }
}

function clearTracks() {
    let cards = document.getElementById("cards");
    while (cards.firstChild) {
        cards.removeChild(cards.lastChild);
    }
}


// Filter tracks
function updateTracksByDifficulty() {
    let tracks = JSON.parse(localStorage.getItem("data"));
    let instrument = document.getElementById("filterDifficultyInstrument").value;
    let difficulty = parseInt(document.getElementById("filterDifficultyValue").value);
    let option = document.querySelector('input[name="filterDifficultyOption"]:checked').getAttribute("id");

    let sort = document.getElementById("sortTracks").value;
    let order = document.getElementById("orderTracks").value;

    let filteredTracks = Object.fromEntries(Object.entries(tracks).filter(([key, value]) => {
        if (option == "filterDifficultyOptionLower") {
            return value.difficulties[instrument] <= difficulty;
        } else if (option == "filterDifficultyOptionEqual") {
            return value.difficulties[instrument] == difficulty;
        } else if (option == "filterDifficultyOptionGreater") {
            return value.difficulties[instrument] >= difficulty;
        }
    }));

    filteredTracks = sortTracks(filteredTracks, [sort.split("sortBy").pop()], order == "orderAsc" ? false : true);
    clearTracks();
    loadTracks(filteredTracks);
    localStorage.setItem("displayed", JSON.stringify(filteredTracks));
}

function updateTracksBySort() {
    let tracks = JSON.parse(localStorage.getItem("displayed"));
    let sort = document.getElementById("sortTracks").value;
    let order = document.getElementById("orderTracks").value;

    filteredTracks = sortTracks(tracks, [sort.split("sortBy").pop()], order == "orderAsc" ? false : true);
    clearTracks();
    loadTracks(filteredTracks);
    localStorage.setItem("displayed", JSON.stringify(filteredTracks));
}


// Sort tracks
const getNestedProperty = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const sortTracks = (tracks, keys, reverse = false) => {
    const tracksArray = Object.entries(tracks);

    tracksArray.sort((a, b) => {
        for (const key of keys) {
            let aValue = getNestedProperty(a[1], key);
            let bValue = getNestedProperty(b[1], key);

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
        }
        return 0;
    });

    if (reverse) {
        tracksArray.reverse();
    }

    return Object.fromEntries(tracksArray);
};


// Change difficulty value
function changeDifficultyValue(elem) {
    const valueElement = document.getElementById("filterDifficultyValue");
    let currentValue = parseInt(valueElement.value);

    if (elem.id === "setValueMinus") {
        if (currentValue - 1 > 0) {
            valueElement.value = currentValue - 1;
        }
    } else {
        if (currentValue + 1 < 8) {
            valueElement.value = currentValue + 1;
        }
    }
}