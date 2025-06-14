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

  const flightIdMatch = booking.match(/([A-Z0-9]+ [0-9]+)-(\d{4}-\d{2}-\d{2})-(\d{2}:\d{2})/);
  const extrasMatch = booking.match(/\((.*?)\)/);
  const routeMatch = booking.match(/from ([A-Za-z\s]+) to ([A-Za-z\s]+) \(/);

  const flightId = flightIdMatch ? flightIdMatch[1] : "N/A";
  const date = flightIdMatch ? flightIdMatch[2] : "N/A";
  const time = flightIdMatch ? flightIdMatch[3] : "N/A";
  const details = extrasMatch ? extrasMatch[1] : "N/A";
  const [passengers, flightClass, price] = details.split("-");
  const fromCity = routeMatch ? routeMatch[1].trim() : "N/A";
  const toCity = routeMatch ? routeMatch[2].trim() : "N/A";

  item.innerHTML = `
    <div class="booking-info">
      <h3>✈️ Flight ${flightId}</h3>
      <p><strong>📅 Date:</strong> ${date}</p>
      <p><strong>⏰ Time:</strong> ${time}</p>
      <p><strong>🌍 From:</strong> ${fromCity}</p>
      <p><strong>🧭 To:</strong> ${toCity}</p>
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
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    Swal.fire({
      title: "Not Logged In",
      text: "Please log in to manage your bookings.",
      icon: "warning",
      confirmButtonText: "OK"
    });
    return;
  }

  // אישור לפני מחיקה
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This booking will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel"
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(USERS_API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, index })
    });

    const result = await res.json();

    if (res.ok) {
      await Swal.fire({
        title: "Deleted!",
        text: "The booking has been removed.",
        icon: "success",
        confirmButtonText: "OK"
      });
      loadBookings();
    } else {
      Swal.fire({
        title: "Failed",
        text: `Failed to delete booking: ${result.error}`,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  } catch (err) {
    console.error("Delete request failed:", err);
    Swal.fire({
      title: "Error",
      text: "An error occurred while deleting the booking.",
      icon: "error",
      confirmButtonText: "OK"
    });
  }
}


window.deleteBooking = deleteBooking;