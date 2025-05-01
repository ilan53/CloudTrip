document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsAccepted = termsCheckbox.checked;

        // Validate form
        if (!validateForm(fullName, email, password, confirmPassword, termsAccepted)) {
            return;
        }

        // Create user account
        createUserAccount(fullName, email, password);
    });

    // Social signup buttons
    document.querySelector('.btn-social.google').addEventListener('click', function() {
        alert('Google signup functionality will be implemented soon!');
    });

    document.querySelector('.btn-social.facebook').addEventListener('click', function() {
        alert('Facebook signup functionality will be implemented soon!');
    });

    // Password confirmation validation
    confirmPasswordInput.addEventListener('input', function() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    });
});

function validateForm(fullName, email, password, confirmPassword, termsAccepted) {
    // Validate full name
    if (fullName.length < 2) {
        alert('Please enter a valid full name');
        return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Validate password
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }

    // Validate terms acceptance
    if (!termsAccepted) {
        alert('Please accept the Terms and Conditions');
        return false;
    }

    return true;
}

function createUserAccount(fullName, email, password) {
    // Get existing users from localStorage or initialize empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        alert('An account with this email already exists');
        return;
    }

    // Create new user object
    const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        password, // Note: In a real application, password should be hashed
        createdAt: new Date().toISOString()
    };

    // Add new user to array
    users.push(newUser);

    // Save updated users array to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message and redirect to login
    alert('Account created successfully! Please login.');
    window.location.href = 'login.html';
} 