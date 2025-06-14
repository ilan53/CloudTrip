let currentData = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentTableType = "flights"; 

async function loadFlights() {
    try {
        document.getElementById("flight-search").style.display = "block";
        const flights = await fetchFlights();
        renderTable(flights, "flights");
    } catch (err) {
        console.error("Error loading flights:", err);
    }
}

async function loadUsers() {
    try {
        document.getElementById("flight-search").style.display = "none";
        currentPage = 1;
        const res = await fetch(USERS_API);
        const data = await res.json();
        const users = Array.isArray(data) ? data : JSON.parse(data.body);
        renderTable(users, "users");
    } catch (err) {
        console.error("Error loading users:", err);
    }
}

function renderTable(items, type) {
    currentData = items;
    currentTableType = type;
    const container = document.getElementById("data-container");
    container.innerHTML = "";

    if (!items.length) {
        container.innerHTML = "<p>No data found.</p>";
        return;
    }

    let headers;
    if (type === "users") {
        headers = ["userId", "username", "email", "name", "family_name", "bookedFlights", "status"];
    } else {
        headers = Object.keys(items[0]);
    }

    let table = "<table class='data-table'><thead><tr>";

    // Render column headers
    headers.forEach(h => table += `<th>${h}</th>`);    
    table += "<th>Actions</th>"; 
    table += "</tr></thead><tbody>";

    // Render table rows
    const visibleItems = paginate(items, currentPage);
    visibleItems.forEach(item => {
        table += "<tr>";
        headers.forEach(h => {
            table += `<td>${item[h]}</td>`;
        });

        // Add buttons only for flights
        if (type === "flights") {
            table += `<td>
                <button onclick='editFlight(${JSON.stringify(item)})'>Edit</button>
                <button onclick='deleteFlight("${item.id}")'>Delete</button>
            </td>`;
        } else if (type === "users") {
            if(item.status !== 'admin'){
            table += `<td>           
                <button onclick='makeAdmin("${item.email}")'>Make Admin</button>
            </td>`;
            }
            else{
                table += `<td>           
                👑 
            </td>`;
            }
        }
        table += "</tr>";
    });

    table += "</tbody></table>";
    container.innerHTML = table;

    renderPagination(items.length);
}

function showAddFlightForm() {
    document.getElementById('form-title').textContent = "Add Flight";
    document.getElementById('flight-form').reset();
    document.getElementById('flight-id').value = '';
    document.getElementById('flight-form-container').style.display = 'block';
}

function closeFlightForm() {
    document.getElementById('flight-form-container').style.display = 'none';
}

document.getElementById('flight-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const flight = {
        from: document.getElementById('from').value,
        to: document.getElementById('to').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        flightNumber: document.getElementById('flightNumber').value,
        operator: document.getElementById('operator').value,
        price: Number(document.getElementById('price').value),
        durationMinutes: Number(document.getElementById('durationMinutes').value),
        stops: Number(document.getElementById('stops').value),
        aircraft: document.getElementById('aircraft').value,
        availableSeats: Number(document.getElementById('availableSeats').value),
        classOptions: document.getElementById('classOptions').value
    };
    const id = document.getElementById('flight-id').value;
    const method = id ? 'PUT' : 'POST';
    const url = FLIGHTS_API + (id ? `/${id}` : '');
    const fullFlight = { ...flight, id: id || flight.flightNumber + '-' + flight.date + '-' + flight.time };

    try {
        await fetch(FLIGHTS_API, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fullFlight)
        });
        closeFlightForm();
        loadFlights();
    } catch (err) {
        console.error('Failed to submit flight:', err);
    }
});



function editFlight(flight) {
    document.getElementById('form-title').textContent = "Edit Flight";
    Object.keys(flight).forEach(key => {
        if (document.getElementById(key)) {
            document.getElementById(key).value = flight[key];
        }
    });
    document.getElementById('flight-form-container').style.display = 'block';
}

function paginate(data, page) {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
}

function renderPagination(totalItems) {
    const container = document.getElementById("pagination-container");
    if (!container) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    container.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.onclick = () => {
            currentPage = i;
            renderTable(currentData, currentTableType);
        };
        container.appendChild(btn);
    }
}


function setupSearch() {
    const searchInput = document.getElementById("flight-search");
    searchInput.addEventListener("input", () => {
        const term = searchInput.value.toLowerCase().trim();
        if (!term) {
            loadFlights(); // Refresh all flights from server
            return;
        }
        const filtered = currentData.filter(item =>
            item.flightNumber.toLowerCase().includes(term)
        );

        renderTable(filtered, "flights");
    });
}

async function deleteFlight(id) {
    if (!confirm("Are you sure you want to delete this flight?")) return;

    try {
        await fetch(FLIGHTS_API, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        loadFlights();
    } catch (err) {
        console.error('Failed to delete flight:', err);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadFlights();     
    setupSearch();     
});

async function makeAdmin(email) {
  try {
    const res = await fetch(ADMIN_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, status: "admin" })
    });

    const result = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "User Promoted",
        text: `✅ ${email} is now an admin`
      });
      loadUsers(); 
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed to Promote",
        text: result.error || "Unknown error"
      });
    }
  } catch (err) {
    console.error("Error promoting user:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong"
    });
  }
}