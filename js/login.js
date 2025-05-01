document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');

    // Check if there are saved credentials
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
        emailInput.value = savedEmail;
        passwordInput.value = savedPassword;
        rememberCheckbox.checked = true;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        const remember = rememberCheckbox.checked;

        // Save credentials if remember me is checked
        if (remember) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }

        // Handle login through auth.js
        handleLogin(email, password);
    });

    // Social login buttons
    document.querySelector('.btn-social.google').addEventListener('click', function() {
        alert('Google login functionality will be implemented soon!');
    });

    document.querySelector('.btn-social.facebook').addEventListener('click', function() {
        alert('Facebook login functionality will be implemented soon!');
    });

    // Forgot password link
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset functionality will be implemented soon!');
    });
}); 