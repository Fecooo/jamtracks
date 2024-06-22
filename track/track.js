function loadPage() {
    let params = new URLSearchParams(window.location.search);

    if (params.has("id")) {
        const SONGID = params.get("id");
        const TRACKDATA = JSON.parse(localStorage.getItem("data"))[SONGID];

        document.title = TRACKDATA.track_title;
        document.getElementById("content").innerHTML = 
        `
            <h1>${TRACKDATA.track_title} (${TRACKDATA.release_year})</h1>

            <div id="dataTable">
                <div id="trackImage">
                    <img src="${TRACKDATA.cover_image}">
                </div>

                <div id="trackData">
                    <ul id="trackDataList">
                        <li>Artist: <span id="trackArtist">${TRACKDATA.artist_name}</span></li>
                        <li>Album: <span id="trackAlbum">${TRACKDATA.album_name ? TRACKDATA.album_name : "-"}</span></li>
                        <li>Length: <span id="trackLength">${TRACKDATA.duration.formatted}</span></li>
                        <li>BPM: <span id="trackBPM">${TRACKDATA.bpm}</span></li>
                        <!-- <li>Instruments: <span id="trackInstruments">ABC, DEF, GHI, JKL</span></li> -->
                        <li>
                            Instruments:
                            <ul id="trackInstrumentsUl">
                                <li><span class="trackInstrument">${TRACKDATA.instruments[0]}</span></li>
                                <li><span class="trackInstrument">${TRACKDATA.instruments[1]}</span></li>
                                <li><span class="trackInstrument">${TRACKDATA.instruments[2]}</span></li>
                                <li><span class="trackInstrument">${TRACKDATA.instruments[3]}</span></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div id="trackDifficulties">
                    <h1>Difficulties</h1>

                    <img src="../src/images/difficulties/bass-${TRACKDATA.difficulties.lead}.png" alt="" class="diff">
                    <img src="../src/images/difficulties/drum-${TRACKDATA.difficulties.drum}.png" alt="" class="diff">
                    <img src="../src/images/difficulties/vocal-${TRACKDATA.difficulties.vocal}.png" alt="" class="diff">
                    <img src="../src/images/difficulties/lead-${TRACKDATA.difficulties.bass}.png" alt="" class="diff">
                </div>

                <div id="trackRotation">
                    <h1>Rotation</h1>

                    <p>-</p>
                </div>
            </div>
        `
    }
    else {
        //window.location.href = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/index.html";
        window.location.href = window.location.protocol + "//" + window.location.hostname + "/jamtracks"
    }
}

function backToMain() {
    //window.location.href = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/index.html";
    window.location.href = window.location.protocol + "//" + window.location.hostname + "/jamtracks"
}

loadPage();