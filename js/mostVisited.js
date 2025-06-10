
const airlineToCountry = {
  "LY": "Israel",
  "U2": "United Kingdom",
  "LH": "Germany",
  "A3": "Greece",
  "W6": "Hungary",
  "FR": "Ireland",
  "SN": "Belgium",   
  "AF": "France"      
};



document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("top-destinations");

  try {
    const res = await fetch(USERS_API);
    const users = await res.json();

    const counts = {};

    users.forEach(user => {
      (user.bookedFlights || []).forEach(flight => {
        const airlineCode = flight.match(/\b[A-Z0-9]{2}\b/)?.[0];
        const country = airlineToCountry[airlineCode] || "Unknown";
        counts[country] = (counts[country] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    container.innerHTML = `
      <h2>🌍 Top 10 Most Visited Countries</h2>
      <ul>
        ${sorted.map(([country, count]) => `<li>${country} – ${count} bookings</li>`).join("")}
      </ul>
    `;
  } catch (err) {
    container.textContent = "Failed to load destinations.";
    console.error("❌ Error loading destinations:", err);
  }
});
