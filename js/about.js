
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
    
   
    textContent.classList.add('fade-out');
    iconContainer.style.opacity = '0';
    
    
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
 
    setTimeout(() => {
       
        const slide = carouselData[currentSlide];
        textContent.querySelector('h2').textContent = slide.title;
        textContent.querySelector('p').textContent = slide.description;
        iconContainer.innerHTML = `<img src="${slide.image}" alt="${slide.title}" />`;
        
      
        textContent.classList.remove('fade-out');
        textContent.classList.add('fade-in');
        iconContainer.style.opacity = '1';
        
        
        setTimeout(() => {
            textContent.classList.remove('fade-in');
        }, 500);
    }, 500);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselData.length;
    updateCarousel('next');
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
    updateCarousel('prev');
}


document.addEventListener('DOMContentLoaded', () => {
    const textContent = document.querySelector('.carousel-text');
    const iconContainer = document.querySelector('.carousel-image');
    const slideLabel = document.querySelector('.slide-label');
    
    textContent.style.transition = 'opacity 0.3s ease';
    iconContainer.style.transition = 'opacity 0.3s ease';
    if (slideLabel) {
        slideLabel.style.transition = 'opacity 0.3s ease';
    }
    
    
    updateCarousel();

    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('section-title')) {
                    
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(-50%) translateY(0)';
                } else if (entry.target.classList.contains('team-member')) {
                    
                    const index = Array.from(document.querySelectorAll('.team-member')).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${0.2 * index}s`;
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.style.transform = 'translateX(-50%) translateY(30px)';
        observer.observe(sectionTitle);
    }

    
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        observer.observe(member);
    });
});
