let apiData = null;

function loadTracks() {
    fetch("https://f5api.sparkedservers.us/jamtracks")
    .then(res => res.json())
    .then(data => {
        apiData = data.data;
        let cards = document.getElementById("cards");

        for (const track of Object.keys(data.data)) {
            cards.innerHTML += `<div class="card" onclick="openWindow('${track}')"><img src="${data.data[track].cover_image}" alt="${data.data[track].track_title} cover img"><h3>${data.data[track].track_title}</h3><h4>${data.data[track].artist_name}</h4></div>`;
        }
    })
}

function openWindow(track) {
    let trackData = apiData[track];
    console.log(trackData.difficulties.lead)

    document.getElementById("left-col").innerHTML = 
    `
        <img src="https://f5api.sparkedservers.us/media/jamtrack?id=${track}" alt="${track}">
        <h3>DIFFICULTIES</h3>
        <hr>
        <img src="difficulties/lead-${trackData.difficulties.lead}.png" alt="difficulty" class="diff">
        <img src="difficulties/drum-${trackData.difficulties.drum}.png" alt="difficulty" class="diff">
        <img src="difficulties/vocal-${trackData.difficulties.vocal}.png" alt="difficulty" class="diff">
        <img src="difficulties/bass-${trackData.difficulties.bass}.png" alt="difficulty" class="diff">
    `

    let rotStr = "";
    if (trackData.rotation) {
        rotStr += "<h3>ROTATION:</h3><ul>";

        trackData.rotation.forEach(rot => {
            rotStr += `<li>${rot.replaceAll('-', '.')}.</li>\n`;
        });

        rotStr += "</ul>";
    }

    document.getElementById("right-col").innerHTML = 
    `
        <h2>${trackData.track_title} (${trackData.release_year})</h2>
        <h3>${trackData.artist_name}</h3>
        <hr>

        <h3>LENGTH: <span>${trackData.duration.formatted}</span></h3>
        <h3>BPM: <span>${trackData.bpm}</span></h3>
        <hr>
        
        <h3>INSTRUMENTS:</h3>
        <ul>
            <li>${trackData.instruments[0]}</li>
            <li>${trackData.instruments[1]}</li>
            <li>${trackData.instruments[2]}</li>
            <li>${trackData.instruments[3]}</li>
        </ul>
        <hr>

        ${rotStr}
    `

    document.getElementById("mainDiv").style.display = "block";
}

function closeWindow() {
    document.getElementById("mainDiv").style.display = "none";
}

loadTracks()