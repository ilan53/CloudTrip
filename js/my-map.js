const cityCoordinates = {
  "Barcelona": [41.3851, 2.1734],
  "Berlin": [52.52, 13.405],
  "Tel Aviv": [32.0853, 34.7818],
  "Paris": [48.8566, 2.3522],
  "Athens": [37.9838, 23.7275],
  "London": [51.5074, -0.1278],
  "Rome": [41.9028, 12.4964],
  "Munich": [48.1351, 11.5820]
};

const countryImages = {
  "Barcelona": "spain.png",
  "Berlin": "germany.png",
  "Tel Aviv": "israel.png",
  "Paris": "france.png",
  "Athens": "greece.png",
  "London": "united-kingdom.png",
  "Rome": "italy.png",
  "Munich": "germany.png"
};

document.addEventListener("DOMContentLoaded", async () => {
  const map = L.map('map').setView([48.5, 10], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
  }).addTo(map);

  const userEmail = localStorage.getItem("userEmail");
   if (!userEmail) {
    Swal.fire({
      title: "Login Required",
      text: "Please log in to see your trips on the map.",
      icon: "warning",
      confirmButtonText: "OK"
    });
    return;
  }

  try {
    const res = await fetch(`${USERS_API}?email=${encodeURIComponent(userEmail)}`);
    const data = await res.json();
    const user = Array.isArray(data) ? data.find(u => u.email === userEmail) : null;
    const flights = user?.bookedFlights || [];

    const visitedCities = new Set();

    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    flights.forEach(flight => {
      const match = flight.match(/to ([A-Za-z\s]+) \(/);
      const toCity = match ? match[1].trim() : null;

      if (toCity && cityCoordinates[toCity] && !visitedCities.has(toCity)) {
        visitedCities.add(toCity);

        L.marker(cityCoordinates[toCity], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <strong>${toCity}</strong><br/>
            You will visit here ✈️<br/>
            <img src="../img/flags/${countryImages[toCity]}" alt="${toCity}"
              onerror="this.style.display='none'"
              style="width:100px; margin-top:8px; border-radius:6px; box-shadow:0 0 5px rgba(0,0,0,0.3)" />
          `);
      }
    });

     if (visitedCities.size === 0) {
      Swal.fire({
        title: "No Trips Found",
        text: "You have no visited destinations.",
        icon: "info",
        confirmButtonText: "OK"
      });
    }

  } catch (err) {
    console.error("Error loading map data:", err);
    Swal.fire({
      title: "Error",
      text: "Failed to load your flight data.",
      icon: "error",
      confirmButtonText: "Retry"
    });
  }
});