document.addEventListener('DOMContentLoaded', function() {
    // Load team members data
    loadTeamMembers();

    // Add animation effects
    setupAnimations();
});

function loadTeamMembers() {
    // Get team members from localStorage or use default data
    const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [
        {
            id: '1',
            name: 'John Smith',
            position: 'CEO & Founder',
            image: 'img/team1.jpg',
            bio: 'With over 20 years of experience in the travel industry, John founded CloudTrip with a vision to revolutionize air travel.'
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            position: 'Operations Director',
            image: 'img/team2.jpg',
            bio: 'Sarah brings her expertise in operations management to ensure smooth and efficient service delivery.'
        },
        {
            id: '3',
            name: 'Michael Chen',
            position: 'Technology Lead',
            image: 'img/team3.jpg',
            bio: 'Michael leads our technology initiatives, ensuring our platform remains cutting-edge and user-friendly.'
        }
    ];

    // Save team members to localStorage if not already present
    if (!localStorage.getItem('teamMembers')) {
        localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    }

    // Update team members section
    const teamContainer = document.querySelector('.team-members');
    teamContainer.innerHTML = teamMembers.map(member => `
        <div class="team-member">
            <img src="${member.image}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p class="position">${member.position}</p>
            <p class="bio">${member.bio}</p>
        </div>
    `).join('');
}

function setupAnimations() {
    // Add scroll animation for sections
    const sections = document.querySelectorAll('.about-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Add hover effects for team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        member.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
} 