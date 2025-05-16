const API_ENDPOINT_SEARCH_FLIGHTS = "https://1z6pdnnb4h.execute-api.us-east-1.amazonaws.com/prod/getsearchflights";

const cities = [
  "New York", "Los Angeles", "San Francisco", "London", "Paris", "Tokyo",
  "Tel Aviv", "Rome", "Berlin", "Madrid", "Dubai", "Bangkok",
  "Toronto", "Sydney", "Chicago", "Amsterdam", "Frankfurt", "Singapore",
  "Seoul", "Barcelona"
];

function populateCitySelects() {
  const fromSelect = document.getElementById("from");
  const toSelect = document.getElementById("to");

  cities.forEach(city => {
    const optionFrom = document.createElement("option");
    optionFrom.value = city;
    optionFrom.textContent = city;
    fromSelect.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = city;
    optionTo.textContent = city;
    toSelect.appendChild(optionTo);
  });
}

function displayFlightResults(flights) {
  const resultsContainer = document.getElementById("flight-results");
  resultsContainer.innerHTML = ""; // clear previous

  if (!flights || flights.length === 0) {
    resultsContainer.innerHTML = "<p>No flights found.</p>";
    return;
  }

  flights.forEach(flight => {
    const card = document.createElement("div");
    card.className = "flight-card";
    card.innerHTML = `
      <h3>${flight.from} → ${flight.to}</h3>
      <p><strong>Date:</strong> ${flight.departureDate}</p>
      <p><strong>Return:</strong> ${flight.returnDate || "One-way"}</p>
      <p><strong>Price:</strong> $${flight.price}</p>
      <p><strong>Airline:</strong> ${flight.airline}</p>
      <p><strong>Class:</strong> ${flight.class}</p>
    `;
    resultsContainer.appendChild(card);
  });
}

function fetchFlightSearchResults(params) {
  const url = new URL(API_ENDPOINT_SEARCH_FLIGHTS);
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });

  return fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': window.location.origin,
    }
  })
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Raw received data:', data);
      if (Array.isArray(data)) {
        displayFlightResults(data);
        return data;
      } else if (data.body && Array.isArray(data.body)) {
        displayFlightResults(data.body);
        return data.body;
      } else {
        console.error("Unexpected data structure:", data);
        return [];
      }
    })
    .catch(error => {
      console.error("Error fetching flight data:", error);
      alert("Error fetching flights. Please try again later.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  populateCitySelects();

  const form = document.getElementById("flight-search-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const departureDate = document.getElementById("departure-date").value;
    /*const returnDate = document.getElementById("return-date").value;?*/
    const passengers = document.getElementById("passengers").value;
    const flightClass = document.getElementById("flight-class").value;

    if (!from || !to || !departureDate) {
      alert("Please fill in From, To, and Departure date");
      return;
    }

    const queryParams = {
      from,
      to,
      departure: departureDate,
      return: returnDate,
      passengers,
      class: flightClass
    };

    fetchFlightSearchResults(queryParams);
  });
});
