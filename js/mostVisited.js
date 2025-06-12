document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("top-destinations");

  const cityToCountry = {
    "Barcelona": "Spain",
    "Berlin": "Germany",
    "Tel Aviv": "Israel",
    "Paris": "France",
    "Athens": "Greece",
    "London": "United Kingdom",
    "Rome": "Italy",
    "Munich": "Germany"
  };

  try {
    const res = await fetch(USERS_API);
    if (!res.ok) throw new Error("Failed to fetch users.");
    const users = await res.json();

    const countryCounts = {};

    users.forEach(user => {
      (user.bookedFlights || []).forEach(flight => {
        const toMatch = flight.match(/to ([A-Za-z\s]+) \(/);
        const toCity = toMatch ? toMatch[1].trim() : "Unknown";
        const country = cityToCountry[toCity] || "Unknown";

        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });
    });

    const sortedCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const maxCount = Math.max(...Object.values(countryCounts));

    container.innerHTML = `
      <h2>🌍 Top 10 Most Visited Countries</h2>
      <ul class="destination-list">
        ${sortedCountries.map(([country, count], index) => `
          <li>
            ${
              maxCount > 1
                ? index === 0
                  ? '🏆'
                  : index === 1
                  ? '🥈'
                  : index === 2
                  ? '🥉'
                  : ''
                : ''
            }
            <img src="../img/flags/${country.toLowerCase().replace(/\s/g, "-")}.png"
                 alt="${country} flag" class="flag" onerror="this.style.display='none'" />
            ${country} – ${count} bookings
          </li>
        `).join("")}
      </ul>
    `;

  } catch (err) {
    container.textContent = "Failed to load destinations.";
    console.error("❌ Error loading destinations:", err);
  }
});
