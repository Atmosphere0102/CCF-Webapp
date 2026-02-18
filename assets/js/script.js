document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navbar = document.getElementById('navbar');

    if (mobileMenuButton && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', () => {
            const icon = mobileMenuButton.querySelector('i');

            // Toggle menu visibility via transform
            if (mobileMenuOverlay.classList.contains('translate-x-full')) {
                // Open Menu
                mobileMenuOverlay.classList.remove('translate-x-full');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                icon.classList.remove('text-ccf-wine');
                icon.classList.add('text-white'); // Change icon color to visible on overlay
            } else {
                // Close Menu
                mobileMenuOverlay.classList.add('translate-x-full');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                icon.classList.remove('text-white');
                icon.classList.add('text-ccf-wine');
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOverlay.classList.add('translate-x-full');
                const icon = mobileMenuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                icon.classList.remove('text-white');
                icon.classList.add('text-ccf-wine');
            });
        });
    }

    // Scroll Reveal Animation via Intersection Observer
    const callback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    };

    const observer = new IntersectionObserver(callback, {
        threshold: 0.1
    });

    const targets = document.querySelectorAll('.fade-in-section, .reveal');
    targets.forEach(target => {
        observer.observe(target);
    });

    // Testimonial Carousel
    const testimonials = document.querySelectorAll('.testimonial-slide');
    let currentTestimonial = 0;
    const totalTestimonials = testimonials.length;

    const showTestimonial = (index) => {
        testimonials.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('hidden');
                slide.classList.add('block', 'fade-in-active');
            } else {
                slide.classList.add('hidden');
                slide.classList.remove('block', 'fade-in-active');
            }
        });
    };

    const nextTestimonial = () => {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    };

    if (totalTestimonials > 0) {
        showTestimonial(0);
        setInterval(nextTestimonial, 5000); // Change every 5 seconds
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            // Simple validation
            if (name.value.trim() === '') {
                isValid = false;
                showError(name, 'Name is required');
            } else {
                clearError(name);
            }

            if (email.value.trim() === '' || !isValidEmail(email.value)) {
                isValid = false;
                showError(email, 'Valid email is required');
            } else {
                clearError(email);
            }

            if (message.value.trim() === '') {
                isValid = false;
                showError(message, 'Message cannot be empty');
            } else {
                clearError(message);
            }

            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert('Thank you for reaching out to CCF. We will get back to you shortly.');
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        let error = formGroup.querySelector('.error-message');
        if (!error) {
            error = document.createElement('p');
            error.className = 'error-message text-red-500 text-sm mt-1';
            formGroup.appendChild(error);
        }
        error.innerText = message;
        input.classList.add('border-red-500');
    }

    function clearError(input) {
        const formGroup = input.parentElement;
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.remove();
        }
        input.classList.remove('border-red-500');
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Smooth scrolling for anchor links (if browser support needs help or custom offset)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {

            // Allow default behavior for non-hash links (like to other pages)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80; // Fixed header height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
});
