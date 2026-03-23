document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  document.getElementById('year').textContent = new Date().getFullYear();

  // --- Mobile Navigation Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(13, 15, 18, 0.95)';
      navLinks.style.padding = '2rem';
      navLinks.style.backdropFilter = 'blur(20px)';
    });
  }

  // --- Language Switcher ---
  const langBtns = document.querySelectorAll('.lang-btn');
  const i18nElements = document.querySelectorAll('[data-i18n]');

  const setLanguage = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations && translations[lang] && translations[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[lang][key];
        } else {
          el.textContent = translations[lang][key];
        }
      }
    });

    // Update dynamic CV Link
    const cvLink = document.querySelector('a[download]');
    if(cvLink && translations && translations[lang] && translations[lang].cv_url) {
        cvLink.href = translations[lang].cv_url;
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // Save preference
    localStorage.setItem('portfolio_lang', lang);
  };

  // Check for saved language or browser default
  const savedLang = localStorage.getItem('portfolio_lang');
  const userLang = navigator.language.slice(0, 2);
  const defaultLang = savedLang || (['en', 'fr', 'nl'].includes(userLang) ? userLang : 'en');
  
  setLanguage(defaultLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // --- Portfolio Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.dataset.category === filterValue) {
          item.style.display = 'block';
          // Small animation reset
          item.style.animation = 'none';
          item.offsetHeight; /* trigger reflow */
          item.style.animation = null; 
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // --- Scroll Effect for Nav ---
  const nav = document.querySelector('.glass-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
      nav.style.padding = '0.5rem 0';
    } else {
      nav.style.boxShadow = 'none';
      nav.style.padding = '1rem 0';
    }
  });

  // --- Contact Form Submission ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get current language for messages
      const currentLang = localStorage.getItem('portfolio_lang') || 'en';
      
      // Show sending state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = translations[currentLang].msg_sending || 'Sending...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        // Success
        formStatus.textContent = translations[currentLang].msg_success || 'Message sent!';
        formStatus.className = 'form-status success';
        
        // Reset form
        contactForm.reset();
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;

        // Clear success message after 5 seconds
        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 5000);
      }, 1500);
    });
  }

  // --- Image Carousel ---
  const track = document.querySelector('.carousel-track');
  if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-dots');
    const dots = Array.from(dotsNav.children);

    let currentSlideIndex = 0;
    
    const updateCarousel = (index) => {
      // 100% per slide width
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
      currentSlideIndex = index;
    };

    nextButton.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card click
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      updateCarousel(nextIndex);
    });

    prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      let prevIndex = currentSlideIndex - 1;
      if (prevIndex < 0) prevIndex = slides.length - 1;
      updateCarousel(prevIndex);
    });

    dotsNav.addEventListener('click', e => {
      e.stopPropagation();
      const targetDot = e.target.closest('.dot');
      if (!targetDot) return;
      const targetIndex = dots.findIndex(dot => dot === targetDot);
      updateCarousel(targetIndex);
    });

    // Autoplay
    setInterval(() => {
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      updateCarousel(nextIndex);
    }, 4000);
  }
});
