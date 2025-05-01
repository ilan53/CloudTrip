// Check if user is logged in
function checkAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const myBookingsLinks = document.querySelectorAll('.my-bookings-link');
    const authButtons = document.querySelectorAll('.auth-buttons');
    
    myBookingsLinks.forEach(link => {
        link.style.display = isLoggedIn ? 'block' : 'none';
    });

    authButtons.forEach(container => {
        if (isLoggedIn) {
            let buttons = `
                <div class="user-profile">
                    <i class="fas fa-user"></i>
                    <span>${userEmail}</span>
                </div>
                <button class="btn-logout" onclick="handleLogout()">Logout</button>
            `;
            
            if (isAdmin) {
                buttons += `<button class="btn-admin" onclick="window.location.href='admin.html'">Admin Panel</button>`;
            }
            
            container.innerHTML = buttons;
        } else {
            container.innerHTML = `
                <button class="btn-login" onclick="window.location.href='login.html'">Login</button>
                <button class="btn-signup" onclick="window.location.href='signup.html'">Sign Up</button>
            `;
        }
    });
}

// Handle login
function handleLogin(email, password) {
    // Check for admin credentials
    if (email === 'admin@admin.com' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAdmin', 'true');
        checkAuthState();
        window.location.href = 'admin.html';
        return;
    }

    // Regular user login
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isAdmin', 'false');
    checkAuthState();
    window.location.href = 'index.html';
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    checkAuthState();
    window.location.href = 'index.html';
}

// Check auth state when page loads
document.addEventListener('DOMContentLoaded', checkAuthState); 