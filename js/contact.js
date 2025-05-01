document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        // Validate form
        if (!validateForm(name, email, subject, message)) {
            return;
        }

        // Save contact message
        saveContactMessage(name, email, subject, message);

        // Show success message and reset form
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
});

function validateForm(name, email, subject, message) {
    // Validate name
    if (name.length < 2) {
        alert('Please enter a valid name');
        return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Validate subject
    if (subject.length < 5) {
        alert('Please enter a subject with at least 5 characters');
        return false;
    }

    // Validate message
    if (message.length < 10) {
        alert('Please enter a message with at least 10 characters');
        return false;
    }

    return true;
}

function saveContactMessage(name, email, subject, message) {
    // Get existing messages from localStorage or initialize empty array
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    // Create new message object
    const newMessage = {
        id: Date.now().toString(),
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
        status: 'unread'
    };

    // Add new message to array
    messages.push(newMessage);

    // Save updated messages array to localStorage
    localStorage.setItem('contactMessages', JSON.stringify(messages));
} 