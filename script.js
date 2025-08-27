document.addEventListener('DOMContentLoaded', () => {

  // Mobile Menu Toggle
  const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuLinks = mobileMenu?.querySelectorAll('a');
  let previouslyFocusedElement = null;

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('mobile-menu-open');

      if (!expanded) {
        previouslyFocusedElement = document.activeElement;
        mobileMenu.focus();
        trapFocus(mobileMenu);
      } else {
        previouslyFocusedElement?.focus();
      }
    });

    const closeMobileMenu = () => {
      mobileMenuButton.setAttribute('aria-expanded', false);
      mobileMenu.classList.remove('active');
      document.body.classList.remove('mobile-menu-open');
      previouslyFocusedElement?.focus();
    };

    document.addEventListener('keydown', (e) => {
      if (document.body.classList.contains('mobile-menu-open') && e.key === 'Escape') {
        closeMobileMenu();
      }
    });


    const trapFocus = (element) => {
      const focusableElements = element.querySelectorAll(
          'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              e.preventDefault();
            }
          }
        }
      });
    };
  }

  // Smooth Scroll and Back to Top
  const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
        if (mobileMenuButton) {
          mobileMenuButton.setAttribute('aria-expanded', false);
          mobileMenu.classList.remove('active');
          document.body.classList.remove('mobile-menu-open');
        }
      });
    });
  };

  const backToTopButton = document.querySelector('.back-to-top');

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  smoothScroll();

  // Testimonial Slider
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const prevButton = testimonialSlider.querySelector('.prev-testimonial');
    const nextButton = testimonialSlider.querySelector('.next-testimonial');
    let currentSlide = 0;
    let autoSlideInterval;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
      });
    }

    showSlide(currentSlide);
    startAutoSlide();

    testimonialSlider.addEventListener('mouseenter', stopAutoSlide);
    testimonialSlider.addEventListener('mouseleave', startAutoSlide);

  }
  // FAQ Accordion
  const faqContainer = document.querySelector('.faq-container');
  if (faqContainer) {
    const faqItems = faqContainer.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const header = item.querySelector('.faq-header');
      const content = item.querySelector('.faq-content');

      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        faqItems.forEach(otherItem => {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
        });

        if (!isOpen) {
          item.classList.add('open');
          content.setAttribute('aria-hidden', 'false');
        } else {
          content.setAttribute('aria-hidden', 'true');
        }
      });
    });
  }


  // Email Capture Validation
  const emailForm = document.querySelector('#email-capture-form');
  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = emailForm.querySelector('#email');
      const email = emailInput.value;

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      console.log('Email submitted:', email);
      // Ideally, send this to a server using fetch or XMLHttpRequest
      emailForm.reset();
    });

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  }

  // UTM Tracking Stub
  const logCtaClick = (event) => {
    const target = event.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    const utmParams = new URLSearchParams(window.location.search);

    console.log('CTA Clicked:', {
      href: href,
      utm_source: utmParams.get('utm_source'),
      utm_medium: utmParams.get('utm_medium'),
      utm_campaign: utmParams.get('utm_campaign'),
      utm_term: utmParams.get('utm_term'),
      utm_content: utmParams.get('utm_content')
    });
    // Send data to analytics server using fetch or XMLHttpRequest.
  };

  document.addEventListener('click', logCtaClick);

});