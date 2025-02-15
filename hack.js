(function() {
    console.log("Running bookmarklet...");

    function removeOldUI() {
        let oldContainer = document.getElementById("bookmarklet-map-container");
        if (oldContainer) {
            console.log("Removing old UI...");
            oldContainer.remove();
        }
    }

    function extractCoordinates() {
        try {
            console.log("Extracting coordinates...");
            const iframe = document.evaluate('/html/body/div/main/div[1]/iframe', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (iframe) {
                console.log("Iframe found:", iframe);
                const src = iframe.getAttribute('src');
                console.log("Iframe src:", src);
                if (src) {
                    const urlParams = new URLSearchParams('?' + src.split('?')[1]);
                    const lat = urlParams.get('lat');
                    const lng = urlParams.get('long');
                    if (lat && lng) {
                        console.log("Extracted coordinates:", lat, lng);
                        return { lat: parseFloat(lat), lng: parseFloat(lng) };
                    }
                }
            }
        } catch (error) {
            console.error("Error extracting coordinates:", error);
        }
        console.warn("No coordinates found!");
        return null;
    }

    function createUI() {
        removeOldUI();

        let container = document.createElement("div");
        container.id = "bookmarklet-map-container";
        container.style = `
            position:fixed;
            bottom:10px;
            left:10px;
            width:400px;
            height:450px;
            z-index:10000;
            background:white;
            border:2px solid black;
            display:flex;
            flex-direction:column;
            box-shadow: 3px 3px 10px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
        `;
        document.body.appendChild(container);
        console.log("Created UI container");

        let mapDiv = document.createElement("div");
        mapDiv.id = "bookmarklet-map";
        mapDiv.style = "width:100%; height:400px;";
        container.appendChild(mapDiv);

        let controlsDiv = document.createElement("div");
        controlsDiv.style = "padding:10px; background:#f5f5f5; border-top:1px solid #ddd; display:flex; justify-content:space-between;";
        container.appendChild(controlsDiv);

        let reloadButton = document.createElement("button");
        reloadButton.innerText = "Reload Map";
        reloadButton.style = "padding:5px 10px; cursor:pointer; background:#007BFF; color:white; border:none;";
        reloadButton.onclick = runBookmarklet;
        controlsDiv.appendChild(reloadButton);
    }

    function runBookmarklet() {
        console.log("Initializing map...");
        createUI();
        let coordinates = extractCoordinates();

        if (!coordinates) {
            alert("No coordinates found! Make sure you're on a WorldGuessr game.");
            return;
        }

        let map = L.map("bookmarklet-map").setView([coordinates.lat, coordinates.lng], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        L.marker([coordinates.lat, coordinates.lng])
            .bindPopup(`Lat: ${coordinates.lat}<br>Lng: ${coordinates.lng}`)
            .addTo(map);
       
        console.log("Map initialized successfully!");
    }

    function loadLeaflet() {
        if (!window.L) {
            console.log("Loading Leaflet.js...");
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet/dist/leaflet.css";
            document.head.appendChild(link);

            let script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
            script.onload = function() {
                console.log("Leaflet.js loaded!");
                runBookmarklet();
            };
            document.body.appendChild(script);
        } else {
            console.log("Leaflet.js already loaded!");
            runBookmarklet();
        }
    }

    loadLeaflet();
})();
