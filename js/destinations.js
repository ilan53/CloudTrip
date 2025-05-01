document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    initializeCarousel();

    // Load destinations data
    loadDestinations();

    // Add event listeners for explore buttons
    setupExploreButtons();
});

function initializeCarousel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;

    // Add click handlers for navigation buttons
    document.querySelector('.carousel-control.prev').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel(currentSlide);
    });

    document.querySelector('.carousel-control.next').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel(currentSlide);
    });

    // Add click handlers for indicators
    document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel(currentSlide);
        });
    });
}

function updateCarousel(currentSlide) {
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.carousel-indicator');

    // Update slides
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function loadDestinations() {
    // Get destinations from localStorage or use default data
    const destinations = JSON.parse(localStorage.getItem('destinations')) || [
        {
            id: '1',
            name: 'Paris',
            price: 499,
            duration: '2h 30m',
            bestTime: 'April - June',
            image: 'img/paris.jpg'
        },
        {
            id: '2',
            name: 'Tokyo',
            price: 799,
            duration: '12h 45m',
            bestTime: 'March - May',
            image: 'img/tokyo.jpg'
        },
        {
            id: '3',
            name: 'New York',
            price: 599,
            duration: '7h 15m',
            bestTime: 'September - November',
            image: 'img/new-york.jpg'
        },
        {
            id: '4',
            name: 'Dubai',
            price: 699,
            duration: '6h 30m',
            bestTime: 'November - March',
            image: 'img/dubai.jpg'
        },
        {
            id: '5',
            name: 'Sydney',
            price: 899,
            duration: '22h 30m',
            bestTime: 'September - November',
            image: 'img/sydney.jpg'
        },
        {
            id: '6',
            name: 'Rome',
            price: 549,
            duration: '2h 45m',
            bestTime: 'April - June',
            image: 'img/rome.jpg'
        }
    ];

    // Save destinations to localStorage if not already present
    if (!localStorage.getItem('destinations')) {
        localStorage.setItem('destinations', JSON.stringify(destinations));
    }

    // Update carousel items
    const carouselItems = document.querySelector('.carousel-items');
    carouselItems.innerHTML = destinations.map(destination => `
        <div class="carousel-item">
            <img src="${destination.image}" alt="${destination.name}">
            <div class="destination-info">
                <h3>${destination.name}</h3>
                <p>From $${destination.price}</p>
                <p>Flight Duration: ${destination.duration}</p>
                <p>Best Time to Visit: ${destination.bestTime}</p>
                <button class="btn-explore" data-id="${destination.id}">Explore</button>
            </div>
        </div>
    `).join('');

    // Add indicators
    const indicators = document.querySelector('.carousel-indicators');
    indicators.innerHTML = destinations.map((_, index) => `
        <span class="carousel-indicator ${index === 0 ? 'active' : ''}"></span>
    `).join('');

    // Reinitialize carousel after loading content
    initializeCarousel();
}

function setupExploreButtons() {
    document.querySelectorAll('.btn-explore').forEach(button => {
        button.addEventListener('click', function() {
            const destinationId = this.dataset.id;
            // In a real application, this would redirect to a booking page
            alert(`Exploring destination ${destinationId}. Booking functionality will be implemented soon!`);
        });
    });
} 