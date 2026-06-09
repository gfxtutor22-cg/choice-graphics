// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// Check saved preference or default to dark
function getPreferredTheme() {
  const saved = localStorage.getItem('cg-theme');
  if (saved) return saved;
  return 'dark'; // Default to dark mode
}

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('cg-theme', theme);
}

// Apply saved theme on load
setTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  });
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (!localStorage.getItem('cg-theme')) {
    setTheme(e.matches ? 'light' : 'dark');
  }
});

// ===== HERO SLIDER =====
const heroSlider = document.getElementById('heroSlider');
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
let currentSlide = 0;
let slideInterval = null;
const SLIDE_DURATION = 5000; // 5 seconds per slide

function goToSlide(index) {
  // Remove active from all slides and dots
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  // Handle wrapping
  currentSlide = ((index % slides.length) + slides.length) % slides.length;

  // Activate current
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');

  // Restart the CSS progress bar animation
  dots[currentSlide].style.animation = 'none';
  void dots[currentSlide].offsetWidth; // trigger reflow
  dots[currentSlide].style.animation = '';
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function startAutoPlay() {
  stopAutoPlay();
  slideInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function stopAutoPlay() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

function resetAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

// Arrow buttons
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });
}
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });
}

// Dot navigation
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.getAttribute('data-index'));
    goToSlide(index);
    resetAutoPlay();
  });
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (heroSlider) {
  heroSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  heroSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoPlay();
    }
  }, { passive: true });
}

// Pause on hover (desktop)
if (heroSlider) {
  heroSlider.addEventListener('mouseenter', stopAutoPlay);
  heroSlider.addEventListener('mouseleave', startAutoPlay);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
  if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
});

// Start auto-play
startAutoPlay();

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar background
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top button
  if (scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== MOBILE NAV TOGGLE =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

createParticles();

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 40000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 5);
      const current = Math.floor(eased * target);
      counter.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  });
}

// Start counter animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  heroObserver.observe(heroStats);
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Add reveal class to elements
function setupRevealAnimations() {
  const revealSelectors = [
    '.section-header',
    '.service-card',
    '.feature-card',
    '.industry-card',
    '.why-card',
    '.portfolio-card',
    '.process-step',
    '.contact-item',
    '.contact-form',
    '.about-text',
    '.about-features'
  ];

  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (index % 4) * 0.1 + 's';
      revealObserver.observe(el);
    });
  });
}

setupRevealAnimations();

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ===== FILE UPLOAD ENHANCEMENT =====
const fileUpload = document.getElementById('fileUpload');
const fileInput = document.getElementById('artwork');

if (fileUpload && fileInput) {
  // Drag and drop
  ['dragenter', 'dragover'].forEach(eventName => {
    fileUpload.addEventListener(eventName, (e) => {
      e.preventDefault();
      fileUpload.style.borderColor = 'var(--primary)';
      fileUpload.style.background = 'rgba(108, 92, 231, 0.08)';
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    fileUpload.addEventListener(eventName, (e) => {
      e.preventDefault();
      fileUpload.style.borderColor = '';
      fileUpload.style.background = '';
    });
  });

  fileUpload.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    fileInput.files = files;
    updateFileLabel(files[0]);
  });

  fileInput.addEventListener('change', () => {
    updateFileLabel(fileInput.files[0]);
  });
}

function updateFileLabel(file) {
  if (!file) return;
  const uploadText = document.querySelector('.file-upload-text');
  if (uploadText) {
    uploadText.innerHTML = `
      <span class="upload-icon">📎</span>
      <p style="color: var(--primary-light); font-weight: 600;">${file.name}</p>
      <small>${(file.size / 1024).toFixed(1)} KB</small>
    `;
  }
}

// ===== FORM SUBMISSION =====
const quoteForm = document.getElementById('quoteForm');

if (quoteForm) {
  quoteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');
    const mobile = formData.get('mobile');
    const product = formData.get('product');
    const quantity = formData.get('quantity');
    const fileInput = document.getElementById('artwork');
    const hasFile = fileInput && fileInput.files.length > 0;

    // Build WhatsApp message
    let message = `Hello Choice Graphics!%0A%0A`;
    message += `*Quote Request*%0A`;
    message += `Name: ${name}%0A`;
    if (formData.get('company')) message += `Company: ${formData.get('company')}%0A`;
    message += `Mobile: ${mobile}%0A`;
    if (formData.get('email')) message += `Email: ${formData.get('email')}%0A`;
    message += `Product: ${product}%0A`;
    message += `Quantity: ${quantity}%0A`;
    if (formData.get('message')) message += `Message: ${formData.get('message')}%0A`;
    
    // File information
    if (hasFile) {
      const fileName = fileInput.files[0].name;
      const fileSize = (fileInput.files[0].size / 1024).toFixed(1);
      message += `%0A%0A*Artwork File:* ${fileName} (${fileSize} KB)%0A`;
      message += `_(Please send this file in the chat)_`;
    }

    // Convert file to base64 for WhatsApp (if small enough)
    if (hasFile && fileInput.files[0].size <= 50000) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const base64 = e.target.result.split(',')[1];
        const fileDataUrl = `data:${fileInput.files[0].type};base64,${base64}`;
        
        // Open WhatsApp with file info
        window.open(`https://wa.me/918104337338?text=${message}`, '_blank');
        
        // Show alert to send file
        setTimeout(() => {
          alert(`✅ Form submitted!\n\n📎 Now please send your artwork file "${fileName}" in the WhatsApp chat that just opened.`);
        }, 500);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      // Open WhatsApp
      window.open(`https://wa.me/918104337338?text=${message}`, '_blank');
      
      if (hasFile) {
        setTimeout(() => {
          alert(`✅ Form submitted!\n\n📎 File size is large (${(fileInput.files[0].size / 1024).toFixed(1)} KB).\n\nPlease send "${fileInput.files[0].name}" manually in the WhatsApp chat.`);
        }, 500);
      }
    }

    // Show success state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '✓ Redirecting to WhatsApp...';
    submitBtn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      this.reset(); // Reset form
    }, 3000);
  });
}

// ===== NAVBAR ACTIVE STATE =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.querySelectorAll('a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
});

// ===== TILT EFFECT ON CARDS =====
function addTiltEffect() {
  const cards = document.querySelectorAll('.service-card, .why-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

addTiltEffect();

// ===== GALLERY MODAL =====
const galleryData = {
  'tshirt-gallery': ['gallery/tshirt1.jpg', 'gallery/tshirt2.jpg', 'gallery/tshirt3.jpg'],
  'caps-gallery': ['gallery/cap1.webp', 'gallery/cap2.webp', 'gallery/cap3.webp'],
  'uv-products-gallery': ['gallery/uv1.jpg', 'gallery/uv2.jpg', 'gallery/uv3.jpg'],
  'uv-stickers-gallery': ['gallery/sticker1.jpg', 'gallery/sticker2.jpg', 'gallery/sticker3.jpg'],
  'signboards-gallery': ['gallery/signboard1.jpg', 'gallery/signboard2.jpg', 'gallery/signboard3.jpg'],
  'gifts-gallery': ['gallery/gift1.jpg', 'gallery/gift2.jpg', 'gallery/gift3.jpg'],
  'laser-gallery': ['gallery/laser1.jpg', 'gallery/laser2.jpg', 'gallery/laser3.jpg'],
  'stationery-gallery': ['gallery/stationery1.jpg', 'gallery/stationery2.jpg', 'gallery/stationery3.jpg', 'gallery/stationery4.jpg'],
  'vinyl-gallery': ['gallery/vinyl1.jpg', 'gallery/vinyl2.jpg', 'gallery/vinyl3.jpg', 'gallery/vinyl4.jpg', 'gallery/vinyl5.jpg', 'gallery/vinyl6.jpg', 'gallery/vinyl7.jpg', 'gallery/vinyl8.jpg', 'gallery/vinyl9.jpg', 'gallery/vinyl10.jpg', 'gallery/vinyl11.jpg', 'gallery/vinyl12.jpg', 'gallery/vinyl13.jpg', 'gallery/vinyl14.jpg', 'gallery/vinyl15.jpg', 'gallery/vinyl16.jpg', 'gallery/vinyl17.jpg', 'gallery/vinyl18.jpg', 'gallery/vinyl19.jpg', 'gallery/vinyl20.jpg'],  
  'event-gallery': ['gallery/event1.jpg', 'gallery/event2.jpg', 'gallery/event3.jpg']
};

let currentGallery = [];
let currentImageIndex = 0;

function openGallery(galleryName) {
  currentGallery = galleryData[galleryName] || [];
  currentImageIndex = 0;
  
  const modal = document.getElementById('galleryModal');
  const thumbnailsContainer = document.getElementById('galleryThumbnails');
  
  // Create thumbnails
  thumbnailsContainer.innerHTML = '';
  currentGallery.forEach((img, index) => {
    const thumb = document.createElement('img');
    thumb.src = img;
    thumb.alt = `Gallery Image ${index + 1}`;
    thumb.className = index === 0 ? 'active' : '';
    thumb.onclick = (e) => {
      e.stopPropagation();
      goToImage(index);
    };
    thumbnailsContainer.appendChild(thumb);
  });
  
  // Set first image
  updateGalleryImage();
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGallery(event) {
  if (event && event.target !== event.currentTarget && event.target.className !== 'gallery-close') return;
  
  const modal = document.getElementById('galleryModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function goToImage(index) {
  currentImageIndex = index;
  updateGalleryImage();
}

function prevImage(event) {
  event.stopPropagation();
  currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
  updateGalleryImage();
}

function nextImage(event) {
  event.stopPropagation();
  currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
  updateGalleryImage();
}

function updateGalleryImage() {
  const galleryImage = document.getElementById('galleryImage');
  const galleryCounter = document.getElementById('galleryCounter');
  const galleryTotal = document.getElementById('galleryTotal');
  const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
  
  // Update main image
  galleryImage.style.opacity = '0';
  
  setTimeout(() => {
    galleryImage.src = currentGallery[currentImageIndex];
    galleryCounter.textContent = currentImageIndex + 1;
    galleryTotal.textContent = currentGallery.length;
    galleryImage.style.opacity = '1';
  }, 150);
  
  // Update active thumbnail
  thumbnails.forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentImageIndex);
  });
  
  // Scroll active thumbnail into view
  if (thumbnails[currentImageIndex]) {
    thumbnails[currentImageIndex].scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest',
      inline: 'center' 
    });
  }
}

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('galleryModal');
  if (!modal.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowLeft') prevImage({ stopPropagation: () => {} });
  if (e.key === 'ArrowRight') nextImage({ stopPropagation: () => {} });
});

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('galleryModal');
  if (!modal.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowLeft') prevImage({ stopPropagation: () => {} });
  if (e.key === 'ArrowRight') nextImage({ stopPropagation: () => {} });
});

// ===== SERVICE IMAGE MODAL =====
function openServiceImage(imageSrc) {
  const modal = document.getElementById('serviceImageModal');
  const serviceImage = document.getElementById('serviceImage');
  
  serviceImage.src = imageSrc;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeServiceImage(event) {
  if (event && event.target !== event.currentTarget && event.target.className !== 'service-image-close') return;
  
  const modal = document.getElementById('serviceImageModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Keyboard close for service image
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('serviceImageModal');
  if (modal.classList.contains('active') && e.key === 'Escape') {
    closeServiceImage();
  }
});
