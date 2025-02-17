(function () {
    console.log("Bookmarklet script loaded, initializing map...");

    loadLeaflet();

    document.addEventListener("keydown", function (e) {
        console.log("Key pressed:", e.key, "| Code:", e.code);

        if (e.key.toLowerCase() === "r") {
            console.log("R key detected! Reloading map...");
            reloadBookmarklet();
        }
    });

    let containerX = 10; // Default starting position
    let containerY = 10;

    function loadLeaflet() {
        if (!window.L) {
            console.log("Loading Leaflet.js...");
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet/dist/leaflet.css";
            document.head.appendChild(link);

            let script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
            script.onload = function () {
                console.log("Leaflet.js loaded!");
                runBookmarklet();
            };
            document.body.appendChild(script);
        } else {
            console.log("Leaflet.js already loaded!");
            runBookmarklet();
        }
    }

    function reloadBookmarklet() {
        let container = document.getElementById("bookmarklet-map-container");
        if (container) {
            containerX = container.offsetLeft;
            containerY = container.offsetTop;
        }
        runBookmarklet();
    }

    function runBookmarklet() {
        console.log("Initializing map...");
        createUI();
        let coordinates = extractCoordinates();

        if (!coordinates) {
            alert("Make sure you're on a WorldGuessr game. Once you are, click r to reload.");
            return;
        }

        let map = L.map("bookmarklet-map").setView([coordinates.lat, coordinates.lng], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        // Define the custom marker icon
        let customIcon = L.icon({
            iconUrl: "https://raw.githubusercontent.com/EvanTeGreat/HackGuessr/refs/heads/gh-pages/marker.png",
            iconSize: [16, 32],  // Adjust size as needed
            iconAnchor: [16, 32],  // Adjust anchor point
            popupAnchor: [0, -32]  // Positioning for the popup
        });

        L.marker([coordinates.lat, coordinates.lng], { icon: customIcon })
            .bindPopup(`Lat: ${coordinates.lat}<br>Lng: ${coordinates.lng}`)
            .addTo(map);

        console.log("Map initialized successfully with custom marker!");
    }

    function createUI() {
        let oldContainer = document.getElementById("bookmarklet-map-container");
        if (oldContainer) oldContainer.remove();

        let container = document.createElement("div");
        container.id = "bookmarklet-map-container";
        container.style = `
            position: fixed;
            left: ${containerX}px;
            top: ${containerY}px;
            width: 250px;
            height: 280px;
            z-index: 10000;
            background: white;
            border: 2px solid black;
            display: flex;
            flex-direction: column;
            box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
            font-family: Arial, sans-serif;
            border-radius: 10px;
        `;
        document.body.appendChild(container);

        let banner = document.createElement("div");
        banner.id = "bookmarklet-banner";
        banner.style = `
            width: 100%;
            height: 30px;
            background: lightgreen;
            cursor: grab;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        `;
        banner.onmousedown = dragElement;
        container.appendChild(banner);

        let mapDiv = document.createElement("div");
        mapDiv.id = "bookmarklet-map";
        mapDiv.style = "width: 100%; height: 250px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;";
        container.appendChild(mapDiv);
    }

    function dragElement(event) {
        event.preventDefault();
        let container = document.getElementById("bookmarklet-map-container");

        let startX = event.clientX;
        let startY = event.clientY;
        let startLeft = container.offsetLeft;
        let startTop = container.offsetTop;

        document.onmousemove = function (e) {
            let newX = startLeft + (e.clientX - startX);
            let newY = startTop + (e.clientY - startY);
            container.style.left = newX + "px";
            container.style.top = newY + "px";
            containerX = newX;
            containerY = newY;
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
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
