(function() {
    console.log("Bookmarklet script loaded, initializing map...");

    // Automatically load Leaflet and show the map
    loadLeaflet();

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

        // Reload map with "R" key press
        document.addEventListener("keydown", function(e) {
            if (e.key === "r" || e.key === "R") {
                console.log("Reloading map...");
                map.setView([coordinates.lat, coordinates.lng], map.getZoom()); // Keep the same location
            }
        });
    }

    function createUI() {
        let oldContainer = document.getElementById("bookmarklet-map-container");
        if (oldContainer) oldContainer.remove();

        // Create the draggable banner
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

        let banner = document.createElement("div");
        banner.id = "bookmarklet-banner";
        banner.style = `
            background-color: lightblue;
            padding: 10px;
            text-align: center;
            cursor: move;
            z-index: 10;
            font-weight: bold;
        `;
        banner.innerHTML = "Map Banner";
        container.appendChild(banner);

        let mapDiv = document.createElement("div");
        mapDiv.id = "bookmarklet-map";
        mapDiv.style = "width:100%; height:400px;";
        container.appendChild(mapDiv);

        // Draggable banner functionality
        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        banner.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - banner.offsetLeft;
            offsetY = e.clientY - banner.offsetTop;
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                banner.style.left = `${x}px`;
                container.style.left = `${x}px`;
                container.style.top = `${y + banner.offsetHeight}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });
    }

    function extractCoordinates() {
        try {
            console.log("Extracting coordinates...");
            const iframe = document.querySelector("iframe");
            if (iframe) {
                console.log("Iframe found:", iframe);
                const src = iframe.getAttribute("src");
                if (src) {
                    const urlParams = new URLSearchParams(src.split("?")[1]);
                    const lat = urlParams.get("lat");
                    const lng = urlParams.get("long");
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
})();
