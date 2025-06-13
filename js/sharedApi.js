const API = "https://qxnpebrdq0.execute-api.us-east-1.amazonaws.com/prod/";
const FLIGHTS_API = API + "flights"; 
const USERS_API = API + "users";
const ADMIN_API = API + "admin";

async function fetchFlights() {
    const res = await fetch(FLIGHTS_API);
    const data = await res.json();
    return Array.isArray(data) ? data : JSON.parse(data.body);
}