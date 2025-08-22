document.getElementById('start-now-btn').onclick = function() {
    document.getElementById('play').scrollIntoView({ behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.steps-scroll-container');
    const cards = document.querySelectorAll('.step-card');
    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');
    const dotsContainer = document.querySelector('.carousel-dots');
    const cardWidth = cards[0].offsetWidth + 32; // card width + gap

    // Create dots
    cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (idx === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.carousel-dot');

    let currentIndex = 0;

    function updateDots(idx) {
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[idx]) dots[idx].classList.add('active');
    }

    function scrollToCard(idx) {
      container.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth'
      });
      currentIndex = idx;
      updateDots(idx);
    }

    leftArrow.addEventListener('click', () => {
      if (currentIndex > 0) scrollToCard(currentIndex - 1);
    });
    rightArrow.addEventListener('click', () => {
      if (currentIndex < cards.length - 1) scrollToCard(currentIndex + 1);
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => scrollToCard(idx));
    });

    // Update dots on manual scroll
    container.addEventListener('scroll', () => {
      const idx = Math.round(container.scrollLeft / cardWidth);
      if (idx !== currentIndex) {
        currentIndex = idx;
        updateDots(idx);
      }
    });
  });

  
