document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navbar = document.getElementById('navbar');

    if (mobileMenuButton && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', () => {
            const icon = mobileMenuButton.querySelector('i');

            if (mobileMenuOverlay.classList.contains('translate-x-full')) {
                mobileMenuOverlay.classList.remove('translate-x-full');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                icon.classList.remove('text-ccf-wine');
                icon.classList.add('text-white');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                mobileMenuOverlay.classList.add('translate-x-full');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                icon.classList.remove('text-white');
                icon.classList.add('text-ccf-wine');
                document.body.style.overflow = '';
            }
        });

        // Mobile Dropdown Toggle Logic
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown-trigger');
        mobileDropdowns.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = trigger.parentElement;
                const menu = parent.querySelector('.mobile-dropdown-menu');
                const icon = trigger.querySelector('.fa-chevron-down');

                // Toggle current menu
                menu.classList.toggle('hidden');
                if (icon) {
                    icon.classList.toggle('rotate-180 transition-transform duration-300');
                }
            });
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // If it's a dropdown trigger, don't close the whole overlay
                if (link.classList.contains('mobile-dropdown-trigger')) return;

                mobileMenuOverlay.classList.add('translate-x-full');
                const icon = mobileMenuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                icon.classList.remove('text-white');
                icon.classList.add('text-ccf-wine');
                document.body.style.overflow = '';
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

    // Quotes Carousel (Reuse similar logic for consistency)
    const quoteSlides = document.querySelectorAll('.quote-slide');
    const quoteDots = document.querySelectorAll('.quote-dot');
    const qPrevBtn = document.getElementById('quote-prev');
    const qNextBtn = document.getElementById('quote-next');
    let curQuote = 0;
    const totalQuotes = quoteSlides.length;
    const qSlideDuration = 6000;
    let qAutoTimer = null;

    const goToQuote = (index) => {
        if (totalQuotes === 0) return;

        // Hide current
        quoteSlides[curQuote].style.opacity = '0';
        quoteSlides[curQuote].style.pointerEvents = 'none';

        setTimeout(() => {
            quoteSlides[curQuote].classList.add('hidden');
            quoteSlides[curQuote].classList.remove('block');

            curQuote = (index + totalQuotes) % totalQuotes;

            quoteSlides[curQuote].classList.remove('hidden');
            quoteSlides[curQuote].classList.add('block');
            void quoteSlides[curQuote].offsetWidth;
            quoteSlides[curQuote].style.opacity = '1';
            quoteSlides[curQuote].style.pointerEvents = '';

            // Update dots
            quoteDots.forEach((dot, i) => {
                if (i === curQuote) {
                    dot.classList.add('bg-ccf-gold');
                    dot.classList.remove('bg-ccf-wine/20');
                    dot.style.transform = 'scale(1.3)';
                } else {
                    dot.classList.remove('bg-ccf-gold');
                    dot.classList.add('bg-ccf-wine/20');
                    dot.style.transform = 'scale(1)';
                }
            });
        }, 350);
    };

    const startQAuto = () => {
        clearInterval(qAutoTimer);
        qAutoTimer = setInterval(() => {
            goToQuote(curQuote + 1);
        }, qSlideDuration);
    };

    if (totalQuotes > 0) {
        quoteSlides.forEach((slide, i) => {
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

        startQAuto();

        if (qPrevBtn) {
            qPrevBtn.addEventListener('click', () => {
                goToQuote(curQuote - 1);
                startQAuto();
            });
        }
        if (qNextBtn) {
            qNextBtn.addEventListener('click', () => {
                goToQuote(curQuote + 1);
                startQAuto();
            });
        }
        quoteDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.dataset.index, 10);
                if (idx !== curQuote) {
                    goToQuote(idx);
                    startQAuto();
                }
            });
        });
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
