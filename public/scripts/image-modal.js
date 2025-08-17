// Enhanced Image Modal Script with Performance Optimizations
// Provides full-screen image viewing with smooth animations and keyboard navigation

class ImageModal {
  constructor() {
    this.modal = null;
    this.currentImage = null;
    this.images = [];
    this.currentIndex = 0;
    this.isOpen = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
    this.setupImageClickHandlers();
  }

  createModal() {
    // Create modal HTML structure
    const modalHTML = `
      <div id="image-modal" class="image-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-backdrop" aria-hidden="true"></div>
        <div class="modal-container">
          <div class="modal-header">
            <h2 id="modal-title" class="modal-title">Resim Görüntüleyici</h2>
            <div class="modal-controls">
              <button class="modal-btn" id="modal-prev" aria-label="Önceki resim" title="Önceki resim (←)">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button class="modal-btn" id="modal-next" aria-label="Sonraki resim" title="Sonraki resim (→)">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <button class="modal-btn" id="modal-close" aria-label="Kapat" title="Kapat (Esc)">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="modal-content">
            <div class="image-container">
              <img id="modal-image" class="modal-image" alt="" loading="lazy">
              <div class="loading-spinner" id="loading-spinner">
                <div class="spinner"></div>
              </div>
            </div>
            <div class="image-info">
              <p class="image-caption" id="image-caption"></p>
              <div class="image-counter" id="image-counter"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('image-modal');

    // Add CSS styles
    this.addStyles();
  }

  addStyles() {
    const styles = `
      <style id="image-modal-styles">
        .image-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          display: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-modal.active {
          display: flex;
          opacity: 1;
        }

        .modal-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
        }

        .modal-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          max-width: 100vw;
          max-height: 100vh;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(30, 41, 59, 0.9);
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }

        .modal-title {
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .modal-controls {
          display: flex;
          gap: 0.5rem;
        }

        .modal-btn {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
          padding: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
          color: #93c5fd;
          transform: scale(1.05);
        }

        .modal-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .modal-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .image-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem;
          min-height: 0;
        }

        .modal-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 0.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease;
          cursor: zoom-in;
        }

        .modal-image.zoomed {
          cursor: zoom-out;
          transform: scale(1.5);
        }

        .loading-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: none;
        }

        .loading-spinner.active {
          display: block;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(59, 130, 246, 0.3);
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .image-info {
          padding: 1rem 2rem;
          background: rgba(30, 41, 59, 0.9);
          border-top: 1px solid rgba(148, 163, 184, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .image-caption {
          color: #e2e8f0;
          margin: 0;
          font-size: 0.875rem;
          max-width: 70%;
        }

        .image-counter {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .modal-header {
            padding: 0.75rem 1rem;
          }

          .modal-title {
            font-size: 1rem;
          }

          .image-container {
            padding: 1rem;
          }

          .image-info {
            padding: 0.75rem 1rem;
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .image-caption {
            max-width: 100%;
          }
        }

        /* Animation classes */
        .modal-enter {
          animation: modalEnter 0.3s ease-out;
        }

        .modal-exit {
          animation: modalExit 0.3s ease-in;
        }

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes modalExit {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.9);
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  setupImageClickHandlers() {
    // Find all images in prose content and make them clickable
    const images = document.querySelectorAll('.prose img, .prose-invert img, article img, .blog-content img');
    
    images.forEach((img, index) => {
      // Skip if already has click handler
      if (img.dataset.modalEnabled) return;
      
      img.dataset.modalEnabled = 'true';
      img.style.cursor = 'pointer';
      img.title = 'Büyütmek için tıklayın';
      
      img.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal(img, index);
      });
    });

    // Update images array
    this.images = Array.from(images);
  }

  bindEvents() {
    // Close modal events
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal());
    
    // Navigation events
    document.getElementById('modal-prev').addEventListener('click', () => this.previousImage());
    document.getElementById('modal-next').addEventListener('click', () => this.nextImage());
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      switch(e.key) {
        case 'Escape':
          this.closeModal();
          break;
        case 'ArrowLeft':
          this.previousImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
        case ' ':
          e.preventDefault();
          this.toggleZoom();
          break;
      }
    });

    // Touch events for mobile swipe
    this.modal.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    this.modal.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });

    // Image zoom on click
    document.getElementById('modal-image').addEventListener('click', () => {
      this.toggleZoom();
    });

    // Prevent body scroll when modal is open
    this.modal.addEventListener('wheel', (e) => {
      e.preventDefault();
    });
  }

  openModal(img, index = 0) {
    this.currentIndex = index;
    this.isOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show modal
    this.modal.classList.add('active');
    this.modal.classList.add('modal-enter');
    
    // Load image
    this.loadImage(img);
    
    // Update navigation
    this.updateNavigation();
    
    // Focus management
    document.getElementById('modal-close').focus();
    
    // Remove animation class after animation completes
    setTimeout(() => {
      this.modal.classList.remove('modal-enter');
    }, 300);
  }

  closeModal() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.modal.classList.add('modal-exit');
    
    setTimeout(() => {
      this.modal.classList.remove('active', 'modal-exit');
      document.body.style.overflow = '';
      
      // Reset zoom
      const modalImage = document.getElementById('modal-image');
      modalImage.classList.remove('zoomed');
    }, 300);
  }

  loadImage(img) {
    const modalImage = document.getElementById('modal-image');
    const spinner = document.getElementById('loading-spinner');
    const caption = document.getElementById('image-caption');
    
    // Show loading spinner
    spinner.classList.add('active');
    modalImage.style.opacity = '0';
    
    // Create new image for preloading
    const newImg = new Image();
    
    newImg.onload = () => {
      modalImage.src = newImg.src;
      modalImage.alt = img.alt || 'Resim';
      caption.textContent = img.alt || img.title || 'Resim açıklaması mevcut değil';
      
      // Hide spinner and show image
      spinner.classList.remove('active');
      modalImage.style.opacity = '1';
      
      // Update counter
      this.updateCounter();
    };
    
    newImg.onerror = () => {
      spinner.classList.remove('active');
      caption.textContent = 'Resim yüklenemedi';
    };
    
    // Start loading
    newImg.src = img.src;
    this.currentImage = img;
  }

  previousImage() {
    if (this.images.length <= 1) return;
    
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
    this.loadImage(this.images[this.currentIndex]);
    this.updateNavigation();
  }

  nextImage() {
    if (this.images.length <= 1) return;
    
    this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
    this.loadImage(this.images[this.currentIndex]);
    this.updateNavigation();
  }

  updateNavigation() {
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    
    if (this.images.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }

  updateCounter() {
    const counter = document.getElementById('image-counter');
    if (this.images.length > 1) {
      counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    } else {
      counter.textContent = '';
    }
  }

  toggleZoom() {
    const modalImage = document.getElementById('modal-image');
    modalImage.classList.toggle('zoomed');
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextImage(); // Swipe left - next image
      } else {
        this.previousImage(); // Swipe right - previous image
      }
    }
  }

  // Public method to refresh image handlers (useful for dynamic content)
  refresh() {
    this.setupImageClickHandlers();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.imageModal = new ImageModal();
});

// Re-initialize on Astro page transitions
document.addEventListener('astro:page-load', () => {
  if (window.imageModal) {
    window.imageModal.refresh();
  } else {
    window.imageModal = new ImageModal();
  }
});
