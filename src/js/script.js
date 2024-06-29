// Start
let apiData = null;
let loadedIDs = [];

let currentIndex = 0;
let itemsPerStep = 50;

function getAPIData() {
    fetch("https://api.f5api.xyz/jamtracks")
    .then(res => res.json())
    .then(data => {
        apiData = data.tracks;
        localStorage.setItem("data", JSON.stringify(apiData));
        localStorage.setItem("displayed", JSON.stringify(apiData));
        updateTracks(clear=true);
    })
}

function getDailyRotation() {
    let date = new Date().toISOString().split("T")[0];
    
    fetch(`https://api.f5api.xyz/jamtracks/rotation?date=${date}`)
    .then(res => res.json())
    .then(data => {
        if (data.result) {
            localStorage.setItem("rotation", JSON.stringify(data.data));
        } else {
            localStorage.setItem("rotation", JSON.stringify([]));
        }
    });
}

checkLocalStorage();
loadFromLocalStorage();

showAllTracksChanged();

getDailyRotation();
getAPIData();

// Track cards handle
function loadTracks(data) {
    let cards = document.getElementById("cards");
    let loadMoreBtn = document.getElementById("loadMoreBtn");
    let rotation = JSON.parse(localStorage.getItem("rotation"));
    document.getElementById("countOfTracks").innerHTML = `${Object.keys(data).length}`;

    let keys = Object.keys(data);

    let startIndex = currentIndex;
    let endIndex = currentIndex + itemsPerStep;
    let keysSlice = keys.slice(startIndex, endIndex);

    for (const track of keysSlice) {
        let a = document.createElement('a');
        a.href = `track/?id=${track}`;
        
        let divCard = document.createElement('div');
        divCard.className = `card ${(rotation.includes(track)) ? 'inrotation' : ''}`;
        
        let img = document.createElement('img');
        img.src = `${data[track].cover_image}`;
        img.alt = `${data[track].track_title} cover img`;
        
        let divInner = document.createElement('div');
        
        let h3 = document.createElement('h3');
        h3.textContent = `${data[track].track_title}`;
        
        let h4 = document.createElement('h4');
        h4.textContent = `${data[track].artist_name}`;
        
        let p;
        if (localStorage.getItem("orderTracksBy") == "sortByrotation.length") {
            p = document.createElement('p');
            p.textContent = data[track].rotation != null ? `${data[track].rotation.length}x` : '0x';
        }

        divInner.appendChild(h3);
        divInner.appendChild(h4);
        if (p) {
            divInner.appendChild(p);
        }
        divCard.appendChild(img);
        divCard.appendChild(divInner);
        a.appendChild(divCard);
        cards.appendChild(a);

        loadedIDs.push(track);
    }
    if (loadedIDs.length == keys.length) {
        loadMoreBtn.style.display = "none";
    }
    currentIndex += itemsPerStep;
}

function loadMore() {
    let data = JSON.parse(localStorage.getItem("data"));
    
    let sort = localStorage.getItem("orderTracksBy");
    let order = localStorage.getItem("orderTracksOrder");

    data = sortTracks(data, [sort.split("sortBy").pop()], order == "orderAsc" ? false : true);

    updateTracks(clear=false);
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
        localStorage.setItem("showAllTracks", true)
    }
    if (localStorage.getItem("showRotationTracks") == null) {
        localStorage.setItem("showRotationTracks", false)
    }
}

function updateLocalStorage() {
    localStorage.setItem("filterInstrument", document.getElementById("filterDifficultyInstrument").value);
    localStorage.setItem("filterInstrumentValue", parseInt(document.getElementById("filterDifficultyValue").value));
    localStorage.setItem("filterInstrumentExpression", document.querySelector('input[name="filterDifficultyOption"]:checked').getAttribute("id"));
    localStorage.setItem("orderTracksBy", document.getElementById("sortTracks").value);
    localStorage.setItem("orderTracksOrder", document.getElementById("orderTracks").value);
    localStorage.setItem("showAllTracks", document.getElementById("allTracks").checked);
    localStorage.setItem("showRotationTracks", document.getElementById("rotationTracks").checked);

    loadFromLocalStorage();
    showAllTracksChanged();
    updateTracks(clear=true);
}

function loadFromLocalStorage() {
    document.getElementById("filterDifficultyInstrument").value = localStorage.getItem("filterInstrument") == null ? "vocal" : localStorage.getItem("filterInstrument");
    document.getElementById("filterDifficultyValue").value = localStorage.getItem("filterInstrumentValue") == null ? 1 : localStorage.getItem("filterInstrumentValue");
    localStorage.getItem("filterInstrumentExpression") == null ? document.getElementById("filterDifficultyOptionGreater").checked = true : document.getElementById(localStorage.getItem("filterInstrumentExpression")).checked = true;
    document.getElementById("sortTracks").value = localStorage.getItem("orderTracksBy") == null ? "sortBytrack_title" : localStorage.getItem("orderTracksBy");
    document.getElementById("orderTracks").value = localStorage.getItem("orderTracksOrder") == null ? "orderAsc" : localStorage.getItem("orderTracksOrder");
    localStorage.getItem("showAllTracks") == null ? document.getElementById("allTracks").checked = false : document.getElementById("allTracks").checked = JSON.parse(localStorage.getItem("showAllTracks"));
    localStorage.getItem("showRotationTracks") == null ? document.getElementById("rotationTracks").checked = false : document.getElementById("rotationTracks").checked = JSON.parse(localStorage.getItem("showRotationTracks"));
}

// Updating tracks
function updateTracks(clear) {
    if (clear) {
        currentIndex = 0;
        loadedIDs = [];
        document.getElementById("loadMoreBtn").style.display = "block";
    }

    let tracks = JSON.parse(localStorage.getItem("data"));
    let rotation = JSON.parse(localStorage.getItem("rotation"));

    let instrument = localStorage.getItem("filterInstrument");
    let difficulty = parseInt(localStorage.getItem("filterInstrumentValue"));
    let option = localStorage.getItem("filterInstrumentExpression");
    let sort = localStorage.getItem("orderTracksBy");
    let order = localStorage.getItem("orderTracksOrder");
    let showall = JSON.parse(localStorage.getItem("showAllTracks"));
    let showrotation = JSON.parse(localStorage.getItem("showRotationTracks"));
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

    if (showrotation) {
        filteredTracks = Object.fromEntries(Object.entries(filteredTracks).filter(([key, value]) => {
            if (rotation.includes(key)) {
                return true;
            }
        }));
    }

    if (sort == "sortBylongest_wait") {
        filteredTracks = sortByRotation(filteredTracks, order == "orderAsc" ? false : true);
    } else {
        filteredTracks = sortTracks(filteredTracks, [sort.split("sortBy").pop()], order == "orderAsc" ? false : true);
    }
    
    //console.log(filteredTracks);
    if (clear) { clearTracks(); }
    loadTracks(filteredTracks);
    localStorage.setItem("displayed", JSON.stringify(filteredTracks));
}


// Sort tracks
function getNestedProperty(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

function sortTracks(tracks, keys, reverse = false) {
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

function sortByRotation(tracks, reverse = false) {
    // Szűrjük ki azokat a zeneszámokat, amelyeknek üres a "rotation" tömbje
    const filteredTracks = Object.entries(tracks).filter(([id, track]) => track.rotation.length > 0);

    // Rendezzük a zeneszámokat a "rotation" tömb utolsó eleme alapján
    filteredTracks.sort((a, b) => {
        const aRotation = a[1].rotation;
        const bRotation = b[1].rotation;

        const aValue = aRotation[aRotation.length - 1];
        const bValue = bRotation[bRotation.length - 1];

        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;

        // Ha az aValue és bValue azonos, akkor track_title szerint rendezünk
        const aTitle = a[1].track_title.toLowerCase();
        const bTitle = b[1].track_title.toLowerCase();
        if (aTitle < bTitle) return -1;
        if (aTitle > bTitle) return 1;

        return 0;
    });

    // Ha a reverse paraméter igaz, akkor fordítsuk meg a sorrendet
    if (reverse) {
        filteredTracks.reverse();
    }

    return Object.fromEntries(filteredTracks);
}

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
    updateTracks(clear=true);
}