const USERS_API = "https://ay1rabd736.execute-api.us-east-1.amazonaws.com/prod/users";

document.addEventListener("DOMContentLoaded", loadBookings);

async function loadBookings() {
  const container = document.getElementById("bookings-container");
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    container.textContent = "Please log in to view your bookings.";
    return;
  }

  try {
    const res = await fetch(`${USERS_API}?email=${encodeURIComponent(userEmail)}`);
    const users = await res.json();
    const user = Array.isArray(users) ? users.find(u => u.email === userEmail) : null;

    if (!user || !user.bookedFlights || user.bookedFlights.length === 0) {
      container.textContent = "No bookings found.";
      return;
    }

    container.innerHTML = "";

    user.bookedFlights.forEach((booking, index) => {
      const item = document.createElement("div");
      item.classList.add("booking-card");

      const flightIdMatch = booking.match(/^([A-Z0-9]+ [0-9]+)-(\d{4}-\d{2}-\d{2})-(\d{2}:\d{2})/);
      const extrasMatch = booking.match(/\((.*?)\)/);

      const flightId = flightIdMatch ? flightIdMatch[1] : "N/A";
      const date = flightIdMatch ? flightIdMatch[2] : "N/A";
      const time = flightIdMatch ? flightIdMatch[3] : "N/A";
      const details = extrasMatch ? extrasMatch[1] : "N/A";

      const [passengers, flightClass, price] = details.split("-");

      item.innerHTML = `
        <div class="booking-info">
          <h3>✈️ Flight ${flightId}</h3>
          <p><strong>📅 Date:</strong> ${date}</p>
          <p><strong>⏰ Time:</strong> ${time}</p>
          <p><strong>👤 Passengers:</strong> ${passengers}</p>
          <p><strong>💺 Class:</strong> ${flightClass}</p>
          <p><strong>💰 Price:</strong> $${price}</p>
        </div>
        <div class="actions">
          <button onclick="deleteBooking(${index})" title="Delete" class="icon-btn delete">🗑️</button>
        </div>
      `;
      container.appendChild(item);
    });

  } catch (err) {
    console.error("Error loading bookings:", err);
    container.textContent = "Error loading bookings.";
  }
}

async function deleteBooking(index) {
  console.log("Deleting booking at index:", index);
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    alert("User not logged in.");
    return;
  }

  try {
    const res = await fetch(USERS_API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, index })
    });

    const result = await res.json();

    if (res.ok) {
      alert("Booking deleted successfully.");
      loadBookings();
    } else {
      alert(`Failed to delete booking: ${result.error}`);
    }
  } catch (err) {
    console.error("Delete request failed:", err);
    alert("An error occurred while deleting the booking.");
  }
}


window.deleteBooking = deleteBooking;
window.editBooking = editBooking;
