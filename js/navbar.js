function createNavbar() {
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName") || userEmail?.split('@')[0] || '';
  const currentPage = window.location.pathname.split('/').pop();
  const isLoggedIn = !!userEmail;

  const navbar = `
    <div class="logo">
      <img src="../img/logo.png" alt="CloudTrip Logo">
    </div>
    <nav>
      <div class="nav-left">
        <ul>
          <li><a href="../index.html">Home</a></li>
          <li><a href="mostVisited.html">Most Visited</a></li>
          ${isLoggedIn ? `<li><a href="my-bookings.html">My Bookings</a></li>` : ""}
          ${isLoggedIn ? `<li><a href="my-map.html">My Trips Map</a></li>` : ""}
          <li id="adminCheck" class="d-none"><a href="admin.html">Admin Panel</a></li>
        </ul>
      </div>
      <div class="nav-right">
        <ul id="authContainer">
          ${isLoggedIn ? `
            <li><span id="userGreeting">Hello, ${userName}</span></li>
            <li><button class="btn-signout" onclick="signOut()">Sign Out</button></li>
          ` : `
            <li><a href="#" id="authButton" class="btn-login">Login</a></li>
            <li><button class="btn-danger" onclick="signOut()">Sign Out</button></li>
          `}
        </ul>
      </div>
    </nav>
  `;

  const header = document.querySelector('header');
  if (header) {
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

function signOut() {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  window.location.href = "../index.html";
}
