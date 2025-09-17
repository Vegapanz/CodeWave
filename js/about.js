// Carousel data
const carouselData = [
    {
        title: "Our Mission",
        description: "Empowering innovation through technology, we strive to create digital solutions that transform businesses and enhance user experiences. Our mission is to deliver excellence in every line of code we write.",
        image: "image/laptop.png",
        label: "Mission"
    },
    {
        title: "Our Vision",
        description: "To be at the forefront of technological advancement, creating solutions that not only meet today's needs but anticipate tomorrow's challenges, while fostering a culture of innovation and excellence.",
        image: "image/server1080.png",
        label: "Vision"
    }
];

let currentSlide = 0;

function updateCarousel(direction) {
    const textContent = document.querySelector('.carousel-text');
    const iconContainer = document.querySelector('.carousel-image');
    
    // Add fade-out class
    textContent.style.opacity = '0';
    iconContainer.style.opacity = '0';
    
    // Update indicators
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    setTimeout(() => {
        // Update content
        const slide = carouselData[currentSlide];
        textContent.querySelector('h2').textContent = slide.title;
        textContent.querySelector('p').textContent = slide.description;
        iconContainer.innerHTML = `<img src="${slide.image}" alt="${slide.title}" />`;
        
        // Add fade-in class
        textContent.style.opacity = '1';
        iconContainer.style.opacity = '1';
    }, 300);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselData.length;
    updateCarousel('next');
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
    updateCarousel('prev');
}

// Add transition effects when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const textContent = document.querySelector('.carousel-text');
    const iconContainer = document.querySelector('.carousel-image');
    const slideLabel = document.querySelector('.slide-label');
    
    textContent.style.transition = 'opacity 0.3s ease';
    iconContainer.style.transition = 'opacity 0.3s ease';
    slideLabel.style.transition = 'opacity 0.3s ease';
    
    // Initialize first slide
    updateCarousel();
});