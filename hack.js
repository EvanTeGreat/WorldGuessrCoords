(function() {
    console.log("Bookmarklet script loaded, waiting for Right Shift...");

    function runBookmarkletOnShift(e) {
        if (e.code === "ShiftRight") {
            console.log("Right Shift detected! Running bookmarklet...");
            document.removeEventListener("keydown", runBookmarkletOnShift); // Prevent multiple runs
            loadLeaflet();
        }
    }

    document.addEventListener("keydown", runBookmarkletOnShift);

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
})();
