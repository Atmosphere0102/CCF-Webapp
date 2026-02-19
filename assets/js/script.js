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
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const progressBar = document.getElementById('testimonial-progress');
    let currentSlide = 0;
    const totalSlides = testimonialSlides.length;
    const slideDuration = 5000; // ms
    let autoTimer = null;
    let progressTimer = null;

    const goToSlide = (index) => {
        // Hide current
        testimonialSlides[currentSlide].style.opacity = '0';
        testimonialSlides[currentSlide].style.pointerEvents = 'none';
        setTimeout(() => {
            testimonialSlides[currentSlide].classList.add('hidden');
            testimonialSlides[currentSlide].classList.remove('block');

            currentSlide = (index + totalSlides) % totalSlides;

            testimonialSlides[currentSlide].classList.remove('hidden');
            testimonialSlides[currentSlide].classList.add('block');
            // Trigger reflow to enable transition
            void testimonialSlides[currentSlide].offsetWidth;
            testimonialSlides[currentSlide].style.opacity = '1';
            testimonialSlides[currentSlide].style.pointerEvents = '';

            // Update dots
            testimonialDots.forEach((dot, i) => {
                if (i === currentSlide) {
                    dot.classList.add('bg-ccf-gold');
                    dot.classList.remove('bg-white/30');
                    dot.style.transform = 'scale(1.3)';
                } else {
                    dot.classList.remove('bg-ccf-gold');
                    dot.classList.add('bg-white/30');
                    dot.style.transform = 'scale(1)';
                }
            });
        }, 350); // half of CSS transition duration

        // Restart progress bar
        restartProgress();
    };

    const restartProgress = () => {
        if (progressBar) {
            clearInterval(progressTimer);
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            // Force reflow
            void progressBar.offsetWidth;
            progressBar.style.transition = `width ${slideDuration}ms linear`;
            progressBar.style.width = '100%';
        }
    };

    const startAuto = () => {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, slideDuration);
    };

    if (totalSlides > 0) {
        // Init first slide
        testimonialSlides.forEach((slide, i) => {
            slide.style.opacity = i === 0 ? '1' : '0';
            slide.style.pointerEvents = i === 0 ? '' : 'none';
            if (i !== 0) {
                slide.classList.add('hidden');
                slide.classList.remove('block');
            } else {
                slide.classList.remove('hidden');
                slide.classList.add('block');
            }
        });

        startAuto();
        restartProgress();

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                startAuto();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                startAuto();
            });
        }
        testimonialDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.dataset.index, 10);
                if (idx !== currentSlide) {
                    goToSlide(idx);
                    startAuto();
                }
            });
        });
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
