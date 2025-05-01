document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
        alert('Access denied. You must be an admin to view this page.');
        window.location.href = 'index.html';
        return;
    }

    // Load statistics
    loadStatistics();

    // Add event listeners for action buttons
    setupActionButtons();
});

function loadStatistics() {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Calculate statistics
    const totalUsers = users.length;
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.price, 0);
    const averageRating = calculateAverageRating(bookings);

    // Update statistics display
    document.querySelector('.stat-card:nth-child(1) p').textContent = totalUsers;
    document.querySelector('.stat-card:nth-child(2) p').textContent = totalBookings;
    document.querySelector('.stat-card:nth-child(3) p').textContent = `$${totalRevenue.toFixed(2)}`;
    document.querySelector('.stat-card:nth-child(4) p').textContent = averageRating.toFixed(1);
}

function calculateAverageRating(bookings) {
    if (bookings.length === 0) return 0;
    const totalRating = bookings.reduce((sum, booking) => sum + (booking.rating || 0), 0);
    return totalRating / bookings.length;
}

function setupActionButtons() {
    // User Management
    document.querySelector('.action-list li:nth-child(1) a').addEventListener('click', function(e) {
        e.preventDefault();
        alert('User list functionality will be implemented soon!');
    });

    document.querySelector('.action-list li:nth-child(2) a').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Add user functionality will be implemented soon!');
    });

    // Flight Management
    document.querySelector('.action-list li:nth-child(3) a').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Flight list functionality will be implemented soon!');
    });

    document.querySelector('.action-list li:nth-child(4) a').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Add flight functionality will be implemented soon!');
    });

    // Content Management
    document.querySelector('.action-list li:nth-child(5) a').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Manage destinations functionality will be implemented soon!');
    });

    document.querySelector('.action-list li:nth-child(6) a').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Manage promotions functionality will be implemented soon!');
    });
} 