function createNavbar() {
  const userEmail = localStorage.getItem("userEmail");

  const navbar = `
    <div class="logo">
      <img src="../img/logo.png" alt="CloudTrip Logo">
    </div>
    <nav>
      <div class="nav-left">
        <ul>
          <li><a href="../index.html">Home</a></li>
          <li><a href="mostVisited.html">Most Visited</a></li>
          <li><a href="contact.html">Contact</a></li>
          ${userEmail ? `<li><a href="my-bookings.html">My Bookings</a></li>` : ""}
          <li id="adminCheck" class="d-none"><a href="admin.html">Admin Panel</a></li>
        </ul>
      </div>
      <div class="nav-right">
        <ul id="authContainer">
          <li><span id="userGreeting" class="d-none me-2"></span></li>
          <li><a href="#" id="authButton" class="btn-login">Login</a></li>
          <li><a href="#" class="btn-signup" onclick="signUp()">Sign Up</a></li>
        </ul>
      </div>
    </nav>
  `;

  const header = document.querySelector('header');
  if (header) {
    header.innerHTML = navbar;

    // ✅ הדגש קישור פעיל בתפריט
    const currentPage = window.location.pathname.split('/').pop(); // לדוגמה: "contact.html"
    document.querySelectorAll('.nav-left a').forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref.includes(currentPage)) {
        link.classList.add('active');
      }
    });
  }
}
