/* ====================================
   ELECTRONIC SERVICES CENTER - MAIN JAVASCRIPT
   Interactive Features & Animations
   ==================================== */

// ====================================
// MOBILE MENU TOGGLE
// ====================================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking nav link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// ====================================
// HEADER SCROLL EFFECT
// ====================================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ====================================
// ACTIVE NAVIGATION LINK
// ====================================
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Call on page load
setActiveNavLink();

// ====================================
// SCROLL REVEAL ANIMATION
// ====================================
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  
  reveals.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    const revealPoint = 100;
    
    if (elementTop < windowHeight - revealPoint) {
      element.classList.add('active');
    }
  });
}

// Initial check
revealOnScroll();

// Check on scroll
window.addEventListener('scroll', revealOnScroll);

// ====================================
// STATS COUNTER ANIMATION
// ====================================
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16); // 60fps
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

// Trigger counter animation when stats section is visible
let statsAnimated = false;

function checkStatsVisibility() {
  const statsSection = document.querySelector('.stats');
  if (!statsSection || statsAnimated) return;
  
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom >= 0) {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      animateCounter(counter, target);
    });
    statsAnimated = true;
  }
}

window.addEventListener('scroll', checkStatsVisibility);
checkStatsVisibility(); // Initial check

// ====================================
// TESTIMONIALS SLIDER
// ====================================
class TestimonialsSlider {
  constructor() {
    this.slider = document.querySelector('.testimonials-slider');
    this.dots = document.querySelectorAll('.slider-dot');
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    
    if (this.slider && this.dots.length > 0) {
      this.init();
    }
  }
  
  init() {
    // Dot click handlers
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
        this.resetAutoPlay();
      });
    });
    
    // Touch/swipe support
    this.addSwipeSupport();
    
    // Auto play
    this.startAutoPlay();
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    const offset = -index * 100;
    this.slider.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    this.dots.forEach(dot => dot.classList.remove('active'));
    this.dots[index].classList.add('active');
  }
  
  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.dots.length;
    this.goToSlide(nextIndex);
  }
  
  prevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.dots.length) % this.dots.length;
    this.goToSlide(prevIndex);
  }
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }
  
  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }
  
  addSwipeSupport() {
    let startX = 0;
    let endX = 0;
    
    this.slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    this.slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) {
        this.nextSlide();
        this.resetAutoPlay();
      } else if (endX - startX > 50) {
        this.prevSlide();
        this.resetAutoPlay();
      }
    });
  }
}

// Initialize slider
const testimonialsSlider = new TestimonialsSlider();

// ====================================
// SERVICE FILTER (for Services Page)
// ====================================
class ServiceFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.serviceCards = document.querySelectorAll('.service-card');
    
    if (this.filterButtons.length > 0) {
      this.init();
    }
  }
  
  init() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        this.filterServices(filter);
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }
  
  filterServices(category) {
    this.serviceCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'block';
        // Fade in animation
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }
}

// Initialize filter
const serviceFilter = new ServiceFilter();

// ====================================
// CONTACT FORM VALIDATION
// ====================================
class ContactForm {
  constructor() {
    this.form = document.querySelector('.contact-form');
    
    if (this.form) {
      this.init();
    }
  }
  
  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (this.validateForm()) {
        this.submitForm();
      }
    });
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        // Remove error on input
        const errorElement = input.parentElement.querySelector('.form-error');
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      });
    });
  }
  
  validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    let error = '';
    
    if (!value) {
      error = 'هذا الحقل مطلوب';
    } else {
      switch(name) {
        case 'name':
          if (value.length < 3) {
            error = 'الاسم يجب أن يكون 3 أحرف على الأقل';
          }
          break;
        case 'phone':
          const phoneRegex = /^[\d\s\-\+\(\)]+$/;
          if (!phoneRegex.test(value) || value.length < 10) {
            error = 'رقم الهاتف غير صحيح';
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'البريد الإلكتروني غير صحيح';
          }
          break;
        case 'message':
          if (value.length < 10) {
            error = 'الرسالة يجب أن تكون 10 أحرف على الأقل';
          }
          break;
      }
    }
    
    this.showError(field, error);
    return error === '';
  }
  
  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  showError(field, error) {
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) {
      if (error) {
        errorElement.textContent = error;
        errorElement.style.display = 'block';
      } else {
        errorElement.style.display = 'none';
      }
    }
  }
  
  submitForm() {
    const formData = new FormData(this.form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    console.log('Form Data:', data);
    
    // Show success message
    this.showSuccessMessage();
    
    // Reset form
    this.form.reset();
  }
  
  showSuccessMessage() {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
      color: #0a0e17;
      padding: 20px 30px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
      z-index: 9999;
      font-weight: 600;
      animation: slideInRight 0.5s ease;
    `;
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      تم إرسال رسالتك بنجاح! سنتواصل معك قريباً
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
      successDiv.style.animation = 'slideOutRight 0.5s ease';
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 500);
    }, 5000);
  }
}

// Initialize contact form
const contactForm = new ContactForm();

// ====================================
// GALLERY LIGHTBOX
// ====================================
class GalleryLightbox {
  constructor() {
    this.galleryItems = document.querySelectorAll('.gallery-item');
    
    if (this.galleryItems.length > 0) {
      this.init();
    }
  }
  
  init() {
    this.galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.openLightbox(index);
      });
    });
  }
  
  openLightbox(index) {
    const img = this.galleryItems[index].querySelector('img');
    const imgSrc = img.src;
    
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      animation: fadeIn 0.3s ease;
    `;
    
    lightbox.innerHTML = `
      <img src="${imgSrc}" style="max-width: 90%; max-height: 90%; border-radius: 10px; box-shadow: 0 0 40px rgba(0, 255, 136, 0.5);">
      <button style="position: absolute; top: 30px; right: 30px; background: transparent; border: none; color: #00ff88; font-size: 2rem; cursor: pointer;">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    document.body.appendChild(lightbox);
    
    // Close on click
    lightbox.addEventListener('click', () => {
      lightbox.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(lightbox);
      }, 300);
    });
  }
}

// Initialize gallery lightbox
const galleryLightbox = new GalleryLightbox();

// ====================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ====================================
// BACK TO TOP BUTTON
// ====================================
function createBackToTopButton() {
  const button = document.createElement('button');
  button.className = 'back-to-top';
  button.innerHTML = '<i class="fas fa-arrow-up"></i>';
  button.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 65px;
    height: 65px;
    background: var(--gradient-green);
    border: none;
    border-radius: 50%;
    color: var(--bg-dark);
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 998;
    box-shadow: var(--shadow-glow);
  `;
  
  document.body.appendChild(button);
  
  // Show/hide on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
    } else {
      button.style.opacity = '0';
      button.style.visibility = 'hidden';
    }
  });
  
  // Scroll to top on click
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Hover effect
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-5px)';
    button.style.boxShadow = 'var(--shadow-glow-strong)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = 'var(--shadow-glow)';
  });
}

// Create back to top button
createBackToTopButton();

// ====================================
// LOADING ANIMATION (Optional)
// ====================================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// ====================================
// UTILITY FUNCTIONS
// ====================================

// Debounce function for performance
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(() => {
  revealOnScroll();
  checkStatsVisibility();
}, 10));

// ====================================
// CONSOLE MESSAGE
// ====================================
console.log('%c Electronic Services Center ', 'background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%); color: #0a0e17; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
console.log('%c Developed with ❤️ using Pure HTML, CSS & JavaScript ', 'color: #00ff88; font-size: 14px;');
