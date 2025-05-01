// Function to create the navigation bar
function createNavbar() {
    const navbar = `
        <div class="logo">
            <img src="../img/Gemini_Generated_Image_xper4mxper4mxper-Photoroom.png" alt="CloudTrip Logo">
        </div>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="mostVisited.html">Most Visited</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="#" class="login">Login</a></li>
            </ul>
        </nav>
    `;

    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = navbar;
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createNavbar();
});
