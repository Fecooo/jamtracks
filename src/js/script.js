// Start
let apiData = null;

function getAPIData() {
    fetch("https://api.f5api.xyz/jamtracks")
    .then(res => res.json())
    .then(data => {
        apiData = data.tracks;
        apiData = sortTracks(apiData, ['track_title']);
        updateTracks();
        localStorage.setItem("data", JSON.stringify(apiData));
        localStorage.setItem("displayed", JSON.stringify(apiData));
    })
}

checkLocalStorage();
loadFromLocalStorage();
showAllTracksChanged();
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

// Local storage handle
function checkLocalStorage() {
    if (localStorage.getItem("filterInstrument") == null) {
        localStorage.setItem("filterInstrument", "vocal")
    }
    if (localStorage.getItem("filterInstrumentValue") == null) {
        localStorage.setItem("filterInstrumentValue", 1)
    }
    if (localStorage.getItem("filterInstrumentExpression") == null) {
        localStorage.setItem("filterInstrumentExpression", "filterDifficultyOptionGreater")
    }
    if (localStorage.getItem("orderTracksBy") == null) {
        localStorage.setItem("orderTracksBy", "sortBytrack_title")
    }
    if (localStorage.getItem("orderTracksOrder") == null) {
        localStorage.setItem("orderTracksOrder", "orderAsc")
    }
    if (localStorage.getItem("showAllTracks") == null) {
        localStorage.setItem("showAllTracks", false)
    }
}

function updateLocalStorage() {
    localStorage.setItem("filterInstrument", document.getElementById("filterDifficultyInstrument").value);
    localStorage.setItem("filterInstrumentValue", parseInt(document.getElementById("filterDifficultyValue").value));
    localStorage.setItem("filterInstrumentExpression", document.querySelector('input[name="filterDifficultyOption"]:checked').getAttribute("id"));
    localStorage.setItem("orderTracksBy", document.getElementById("sortTracks").value);
    localStorage.setItem("orderTracksOrder", document.getElementById("orderTracks").value);
    localStorage.setItem("showAllTracks", document.getElementById("allTracks").checked);

    loadFromLocalStorage();
    showAllTracksChanged();
    updateTracks();
}

function loadFromLocalStorage() {
    document.getElementById("filterDifficultyInstrument").value = localStorage.getItem("filterInstrument") == null ? "vocal" : localStorage.getItem("filterInstrument");
    document.getElementById("filterDifficultyValue").value = localStorage.getItem("filterInstrumentValue") == null ? 1 : localStorage.getItem("filterInstrumentValue");
    localStorage.getItem("filterInstrumentExpression") == null ? document.getElementById("filterDifficultyOptionGreater").checked = true : document.getElementById(localStorage.getItem("filterInstrumentExpression")).checked = true;
    document.getElementById("sortTracks").value = localStorage.getItem("orderTracksBy") == null ? "sortBytrack_title" : localStorage.getItem("orderTracksBy");
    document.getElementById("orderTracks").value = localStorage.getItem("orderTracksOrder") == null ? "orderAsc" : localStorage.getItem("orderTracksOrder");
    localStorage.getItem("showAllTracks") == null ? document.getElementById("allTracks").checked = false : document.getElementById("allTracks").checked = JSON.parse(localStorage.getItem("showAllTracks"));
}

// Updating tracks
function updateTracks() {
    let tracks = JSON.parse(localStorage.getItem("data"));

    let instrument = localStorage.getItem("filterInstrument");
    let difficulty = parseInt(localStorage.getItem("filterInstrumentValue"));
    let option = localStorage.getItem("filterInstrumentExpression");
    let sort = localStorage.getItem("orderTracksBy");
    let order = localStorage.getItem("orderTracksOrder");
    let showall = JSON.parse(localStorage.getItem("showAllTracks"));
    let searchtext = document.getElementById("searchBar").value;
    let filteredTracks;

    filteredTracks = filterBySearchBar(tracks, searchtext);

    if (!showall) {
        filteredTracks = Object.fromEntries(Object.entries(filteredTracks).filter(([key, value]) => {
            if (option == "filterDifficultyOptionLower") {
                return value.difficulties[instrument] <= difficulty;
            } else if (option == "filterDifficultyOptionEqual") {
                return value.difficulties[instrument] == difficulty;
            } else if (option == "filterDifficultyOptionGreater") {
                return value.difficulties[instrument] >= difficulty;
            }
        }));
    }

    filteredTracks = sortTracks(filteredTracks, [sort.split("sortBy").pop()], order == "orderAsc" ? false : true);
    
    console.log(filteredTracks);
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

function filterBySearchBar(tracks, text) {
    let filtered = {};
    for (let id in tracks) {
        const track = tracks[id];
        const { track_title, artist_name } = track;
        const fields = [track_title, artist_name];
        if (fields.some(field => field && field.toLowerCase().includes(text.toLowerCase()))) {
            filtered[id] = track;
        }
    }
    return filtered;
}



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

// Change show all stuff
function showAllTracksChanged() {
    let cb = document.getElementById("allTracks").checked;
    let div = document.getElementById("instrumentSection");

    if (cb) {
        div.style.display = "none";
    } else {
        div.style.display = "block";
    }
}

// Change search text
function searchBarChanged() {
    updateTracks();
}