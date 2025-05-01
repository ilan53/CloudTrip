// Function to load user's bookings
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingsContainer = document.querySelector('.bookings-container');
    
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-times"></i>
                <h2>No Bookings Found</h2>
                <p>You haven't made any bookings yet.</p>
                <a href="index.html" class="btn-explore">Explore Flights</a>
            </div>
        `;
        return;
    }

    let bookingsHTML = '<div class="bookings-grid">';
    bookings.forEach((booking, index) => {
        bookingsHTML += `
            <div class="booking-card">
                <div class="booking-header">
                    <h3>${booking.destination}</h3>
                    <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
                </div>
                <div class="booking-details">
                    <div class="detail">
                        <i class="fas fa-plane-departure"></i>
                        <span>${booking.departureDate}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-plane-arrival"></i>
                        <span>${booking.returnDate}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-users"></i>
                        <span>${booking.passengers} Passengers</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-dollar-sign"></i>
                        <span>$${booking.totalPrice}</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="btn-view" onclick="viewBookingDetails(${index})">View Details</button>
                    <button class="btn-cancel" onclick="cancelBooking(${index})">Cancel Booking</button>
                </div>
            </div>
        `;
    });
    bookingsHTML += '</div>';
    bookingsContainer.innerHTML = bookingsHTML;
}

// Function to view booking details
function viewBookingDetails(index) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings[index];
    
    // Create modal with booking details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Booking Details</h2>
            <div class="booking-info">
                <div class="info-group">
                    <h3>Flight Information</h3>
                    <p><strong>Destination:</strong> ${booking.destination}</p>
                    <p><strong>Departure:</strong> ${booking.departureDate}</p>
                    <p><strong>Return:</strong> ${booking.returnDate}</p>
                    <p><strong>Flight Number:</strong> ${booking.flightNumber}</p>
                </div>
                <div class="info-group">
                    <h3>Passenger Information</h3>
                    <p><strong>Number of Passengers:</strong> ${booking.passengers}</p>
                    <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
                </div>
                <div class="info-group">
                    <h3>Booking Status</h3>
                    <p class="status ${booking.status.toLowerCase()}">${booking.status}</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Function to cancel a booking
function cancelBooking(index) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings[index].status = 'Cancelled';
        localStorage.setItem('bookings', JSON.stringify(bookings));
        loadBookings(); // Refresh the bookings display
    }
}

// Initialize bookings when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    
    loadBookings();
}); 