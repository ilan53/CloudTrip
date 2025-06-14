function createNavbar() {
  const navbar = `
    <div class="logo">
      <img src="../img/logo.png" alt="CloudTrip Logo">
    </div>
    <nav>
      <div class="nav-left">
        <ul>
          <li><a href="../index.html">Home</a></li>
          <li><a href="mostVisited.html" class="mostVisted">Most Visited</a></li>
          <li><a href="my-bookings.html" class="myBooking">My Bookings</a></li> 
          <li><a href="my-map.html" class="TripMap">My Trips Map</a></li>
          <li><a href="admin.html" class="adminCheck">Admin Panel</a></li>
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
