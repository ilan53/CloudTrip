  let filteredFlights = [];
  let currentFlight = null;
  
document.addEventListener("DOMContentLoaded", () => {
  populateFromSelect();
  setupOrderButton();
  const userEmail = localStorage.getItem("userEmail");
});

async function populateFromSelect() {
  const loadingMessage = document.getElementById("loading-cities");
  loadingMessage.style.display = "block";

  try {
    const flights = await fetchFlights();
    setupFromSelect(flights);
    setupToSelect(flights);
    setupClassSelect(flights);
    setupDateSelect(flights);
  } catch (error) {
    console.error("Error loading cities:", error);
  } finally {
    loadingMessage.style.display = "none";
  }
}

function setupFromSelect(flights) {
  const fromSelect = document.getElementById("from");
  const fromCities = [...new Set(flights.map(f => f.from))].sort();
  fromCities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    fromSelect.appendChild(option);
  });
}

function setupToSelect(flights) {
  const fromSelect = document.getElementById("from");
  const toSelect = document.getElementById("to");
  const toGroup = document.getElementById("to-group");
  document.getElementById("flight-info-row").style.display = "none";

  fromSelect.addEventListener("change", () => {
    const selectedFrom = fromSelect.value;
    resetSelect("to");
    resetSelect("flight-class");
    resetSelect("departure-date");
    hideGroup("class-group");
    hideGroup("departure-group");

    if (selectedFrom) {
      const destinations = flights.filter(f => f.from === selectedFrom).map(f => f.to);
      const uniqueTo = [...new Set(destinations)].sort();
      uniqueTo.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        toSelect.appendChild(option);
      });
      toGroup.style.display = "block";
    } else {
      toGroup.style.display = "none";
    }
  });
}

function setupClassSelect(flights) {
  const fromSelect = document.getElementById("from");
  const toSelect = document.getElementById("to");
  const classSelect = document.getElementById("flight-class");
  const classGroup = document.getElementById("class-group");

  toSelect.addEventListener("change", () => {
    const selectedFrom = fromSelect.value;
    const selectedTo = toSelect.value;
    resetSelect("flight-class");
    resetSelect("departure-date");
    hideGroup("departure-group");
    document.getElementById("flight-info-row").style.display = "none";

    if (selectedFrom && selectedTo) {
      const classOptions = flights
        .filter(f => f.from === selectedFrom && f.to === selectedTo)
        .flatMap(f => Array.isArray(f.classOptions) ? f.classOptions : String(f.classOptions).split(","));
      const uniqueClasses = [...new Set(classOptions.map(c => c.trim()))].sort();
      uniqueClasses.forEach(cls => {
        const option = document.createElement("option");
        option.value = cls;
        option.textContent = cls;
        classSelect.appendChild(option);
      });
      classGroup.style.display = "block";
    }
  });
}

function setupDateSelect(flights) {
  const fromSelect = document.getElementById("from");
  const toSelect = document.getElementById("to");
  const classSelect = document.getElementById("flight-class");
  const dateSelect = document.getElementById("departure-date");
  const dateGroup = document.getElementById("departure-group");

  const infoRow = document.getElementById("flight-info-row");
  const flightIdDisplay = document.getElementById("flight-id");
  const priceDisplay = document.getElementById("flight-price");
  const passengersInput = document.getElementById("passengers");

  classSelect.addEventListener("change", () => {
    const from = fromSelect.value;
    const to = toSelect.value;
    const selectedClass = classSelect.value;
    if (!from || !to || !selectedClass) return;

    filteredFlights = flights.filter(f =>
      f.from === from &&
      f.to === to &&
      (Array.isArray(f.classOptions)
        ? f.classOptions.includes(selectedClass)
        : String(f.classOptions).includes(selectedClass))
    );

    const availableDates = [...new Set(filteredFlights.map(f => f.date))].sort();
    resetSelect("departure-date");

    availableDates.forEach(date => {
      const opt = document.createElement("option");
      opt.value = date;
      opt.textContent = date;
      dateSelect.appendChild(opt);
    });

    if (availableDates.length) {
      dateSelect.value = availableDates[-1];
      updateFlightInfo(); // אוטומטי כברירת מחדל
    }

    dateGroup.style.display = "block";
  });

  dateSelect.addEventListener("change", updateFlightInfo);
  passengersInput.addEventListener("input", updateFlightInfo);

  function updateFlightInfo() {
    const selectedDate = dateSelect.value;
    const selectedPassengers = Number(passengersInput.value);

    currentFlight = filteredFlights.find(f => f.date === selectedDate);
    if (currentFlight) {
      const totalPrice = (Number(currentFlight.price) * selectedPassengers).toFixed(2);
      flightIdDisplay.textContent = currentFlight.id;
      priceDisplay.textContent = `$${totalPrice}`;
      infoRow.style.display = "flex";
    } else {
      infoRow.style.display = "none";
    }
  }
}




function resetSelect(id) {
  const select = document.getElementById(id);
  if (select) select.innerHTML = '<option value="">Select</option>';
}

function hideGroup(id) {
  const group = document.getElementById(id);
  if (group) group.style.display = "none";
}

function setupOrderButton() {
  const form = document.getElementById("flight-search-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("👋 Please sign in before booking a flight.");
      return;
    }

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const selectedClass = document.getElementById("flight-class").value;
    const passengers = parseInt(document.getElementById("passengers").value);
    const date = document.getElementById("departure-date").value;
    const currentFlight = filteredFlights.find(f => f.date === date);
    const flightId = `${currentFlight.flightNumber}-${currentFlight.date}-${currentFlight.time} (${passengers}Adults-${selectedClass}-${currentFlight.price}) from ${currentFlight.from} to ${currentFlight.to} (${currentFlight.countryTo})`;


    const priceText = document.getElementById("flight-price").textContent.replace("$", "");
    const price = parseFloat(priceText);

    if (!flightId || !passengers || !price || !selectedClass) {
      alert("Missing booking information. Please complete all fields.");
      return;
    }

    try {
      const res = await fetch(USERS_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          flightId,
          class: selectedClass,
          passengers,
          price
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`🎫 Ticket booked successfully!\n\n✈️ Flight ID: ${flightId}\n👤 Passengers: ${passengers}\n💺 Class: ${selectedClass}\n💰 Price: $${price.toFixed(2)}`);
      } else {
        console.error("Error booking flight:", data);
        alert("❌ Failed to book flight.");
      }
    } catch (err) {
      console.error("❌ Network or server error:", err);
      alert("❌ Network error occurred while booking.");
    }
  });
}


function createNavbar() {
  const navbar = `
    <div class="logo">
      <img src="img/logo.png" alt="CloudTrip Logo">
    </div>
    <nav>
      <div class="nav-left">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="pages/mostVisited.html" class="mostVisted">Most Visited</a></li>
          <li><a href="pages/my-bookings.html" class="myBooking">My Bookings</a></li> 
          <li><a href="pages/my-map.html" class="TripMap">My Trips Map</a></li>
          <li><a href="pages/admin.html" class="adminCheck">Admin Panel</a></li>
        </ul>
      </div>
      <div class="nav-right">
        <ul id="authContainer">
          <li><span id="userGreeting" class="d-none me-2"></span></li>
          <li><a href="#" class="btn-login" onclick="signIn()">Login</a></li>
          <li><a href="#" class="btn-signup" onclick="signUp()">Sign Up</a></li>
          <li><a href="#" class="btn-signout btn-danger" onclick="signOut()">Sign Out</a></li>
        </ul>
      </div>
    </nav>
  `;

  const header = document.querySelector('header');
  if (header){ 
    header.innerHTML = navbar;

    // הדגשת הקישור הפעיל
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-left a').forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref.includes(currentPage)) {
        link.classList.add('active');
      }
    });
  }
}

createNavbar();