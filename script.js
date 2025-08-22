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

// Botpress Chatbot Initialization
function initializeChatbot() {
    if (window.botpressWebChat) {
        window.botpressWebChat.init({
            "composerPlaceholder": "Chat with FinVoice AI Assistant",
            "botConversationDescription": "Get personalized financial advice and manage your money with voice commands",
            "botId": "20250822042015-G3IXMQX1",
            "hostUrl": "https://cdn.botpress.cloud/webchat/v3.2",
            "messagingUrl": "https://messaging.botpress.cloud",
            "clientId": "20250822042015-G3IXMQX1",
            "webhookId": "20250822042015-G3IXMQX1",
            "lazySocket": true,
            "themeName": "prism",
            "frontendVersion": "v3.2.0",
            "showPoweredBy": false,
            "theme": "dark",
            "themeColor": "#168fc0"
        });
        
        // Show the chatbot
        setTimeout(() => {
            if (window.botpressWebChat.sendEvent) {
                window.botpressWebChat.sendEvent({ type: "show" });
            }
        }, 2000);
    } else {
        // Retry after a short delay
        setTimeout(initializeChatbot, 1000);
    }
}

// Start initialization when page loads
window.addEventListener('load', function() {
    setTimeout(initializeChatbot, 2000);
});

// Also try on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeChatbot, 3000);
});

// Add test button functionality
document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.getElementById('test-chatbot');
    if (testButton) {
        testButton.addEventListener('click', function() {
            console.log('Test button clicked');
            console.log('botpressWebChat available:', !!window.botpressWebChat);
            if (window.botpressWebChat) {
                console.log('Initializing chatbot manually...');
                initializeChatbot();
            } else {
                console.log('Botpress not loaded yet');
            }
        });
    }
});

  
