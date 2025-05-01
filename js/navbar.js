// Function to create the navigation bar
function createNavbar() {
    const navbar = `
        <nav class="navbar">
            <div class="logo">
                <img src="img/logo.png" alt="CloudTrip Logo" class="plane-icon">
            </div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="destinations.html">Destinations</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li class="my-bookings-link" style="display: none;"><a href="bookings.html">My Bookings</a></li>
            </ul>
            <div class="auth-buttons">
                <button class="btn-login" onclick="window.location.href='login.html'">Login</button>
                <button class="btn-signup" onclick="window.location.href='signup.html'">Sign Up</button>
            </div>
        </nav>
    `;

    // Insert navbar into header
    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = navbar;
    }

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Function to create the footer
function createFooter() {
    const footer = `
        <div class="footer-content">
            <div class="footer-section">
                <h3>About CloudTrip</h3>
                <p>Your trusted partner in air travel since 2024. We're committed to making your journey comfortable and memorable.</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="destinations.html">Destinations</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Contact Us</h3>
                <p>Email: support@cloudtrip.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 CloudTrip. All rights reserved - Ilan haskel & Lital shwartz.</p>
        </div>
    `;

    // Insert footer
    const footerElement = document.querySelector('footer');
    if (footerElement) {
        footerElement.innerHTML = footer;
    }
}

// Initialize navbar and footer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createNavbar();
    createFooter();
}); 