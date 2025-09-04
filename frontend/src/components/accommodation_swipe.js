// Accommodation Swipe utilities and animations
// This module handles the swipe gestures, animations, and UI interactions

export class AccommodationSwipe {
  constructor(container, onSwipeLeft, onSwipeRight) {
    this.container = container;
    this.onSwipeLeft = onSwipeLeft;
    this.onSwipeRight = onSwipeRight;
    this.isAnimating = false;
    this.threshold = 100; // Minimum distance for a swipe
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;

    this.initializeSwipeHandlers();
  }

  initializeSwipeHandlers() {
    if (!this.container) return;

    // Touch events for mobile
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

    // Mouse events for desktop
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.container.addEventListener('mouseleave', this.handleMouseUp.bind(this));
  }

  handleTouchStart(e) {
    if (this.isAnimating) return;
    
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.currentX = touch.clientX;
    this.currentY = touch.clientY;
    
    this.container.style.transition = 'none';
  }

  handleTouchMove(e) {
    if (this.isAnimating) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    this.currentX = touch.clientX;
    this.currentY = touch.clientY;
    
    this.updateCardPosition();
  }

  handleTouchEnd(e) {
    if (this.isAnimating) return;
    
    this.handleSwipeEnd();
  }

  handleMouseDown(e) {
    if (this.isAnimating) return;
    
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    
    this.container.style.transition = 'none';
    this.isDragging = true;
  }

  handleMouseMove(e) {
    if (this.isAnimating || !this.isDragging) return;
    
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    
    this.updateCardPosition();
  }

  handleMouseUp(e) {
    if (this.isAnimating || !this.isDragging) return;
    
    this.isDragging = false;
    this.handleSwipeEnd();
  }

  updateCardPosition() {
    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;
    
    // Calculate rotation based on horizontal movement
    const rotation = deltaX * 0.1;
    
    // Apply transform
    this.container.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
    
    // Add visual feedback for direction
    const opacity = Math.max(0, 1 - (Math.abs(deltaX) / 300));
    this.container.style.opacity = opacity;
    
    // Color feedback
    if (deltaX > 50) {
      this.container.classList.add('swipe-right');
      this.container.classList.remove('swipe-left');
    } else if (deltaX < -50) {
      this.container.classList.add('swipe-left');
      this.container.classList.remove('swipe-right');
    } else {
      this.container.classList.remove('swipe-right', 'swipe-left');
    }
  }

  handleSwipeEnd() {
    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;
    
    // Reset transition
    this.container.style.transition = 'all 0.3s ease-out';
    
    // Determine if swipe threshold was met
    if (Math.abs(deltaX) > this.threshold) {
      if (deltaX > 0) {
        // Swipe right (accept)
        this.animateSwipeRight();
      } else {
        // Swipe left (reject)
        this.animateSwipeLeft();
      }
    } else {
      // Return to center
      this.resetCardPosition();
    }
  }

  animateSwipeRight() {
    this.isAnimating = true;
    this.container.style.transform = 'translateX(100%) rotate(30deg)';
    this.container.style.opacity = '0';
    
    setTimeout(() => {
      this.onSwipeRight();
      this.resetCard();
    }, 300);
  }

  animateSwipeLeft() {
    this.isAnimating = true;
    this.container.style.transform = 'translateX(-100%) rotate(-30deg)';
    this.container.style.opacity = '0';
    
    setTimeout(() => {
      this.onSwipeLeft();
      this.resetCard();
    }, 300);
  }

  resetCardPosition() {
    this.container.style.transform = 'translate(0, 0) rotate(0deg)';
    this.container.style.opacity = '1';
    this.container.classList.remove('swipe-right', 'swipe-left');
  }

  resetCard() {
    this.container.style.transition = 'none';
    this.container.style.transform = 'translate(0, 0) rotate(0deg)';
    this.container.style.opacity = '1';
    this.container.classList.remove('swipe-right', 'swipe-left');
    this.isAnimating = false;
  }

  // Programmatically trigger swipes (for button clicks)
  triggerSwipeLeft() {
    if (this.isAnimating) return;
    this.animateSwipeLeft();
  }

  triggerSwipeRight() {
    if (this.isAnimating) return;
    this.animateSwipeRight();
  }

  destroy() {
    if (!this.container) return;
    
    // Remove all event listeners
    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchmove', this.handleTouchMove);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
    this.container.removeEventListener('mousedown', this.handleMouseDown);
    this.container.removeEventListener('mousemove', this.handleMouseMove);
    this.container.removeEventListener('mouseup', this.handleMouseUp);
    this.container.removeEventListener('mouseleave', this.handleMouseUp);
  }
}

// CSS classes for swipe feedback (to be added to your CSS)
export const swipeStyles = `
  .swipe-card {
    cursor: grab;
    user-select: none;
    position: relative;
  }

  .swipe-card.swipe-right {
    border-color: #10b981;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
  }

  .swipe-card.swipe-left {
    border-color: #ef4444;
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
  }

  .swipe-card:active {
    cursor: grabbing;
  }

  .swipe-feedback {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .swipe-feedback.show {
    opacity: 1;
  }

  .swipe-feedback.accept {
    color: #10b981;
    font-size: 2rem;
    font-weight: bold;
  }

  .swipe-feedback.reject {
    color: #ef4444;
    font-size: 2rem;
    font-weight: bold;
  }
`;

export default AccommodationSwipe;