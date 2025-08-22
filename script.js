document.getElementById('start-now-btn').onclick = function() {
    document.getElementById('play').scrollIntoView({ behavior: 'smooth' });
};

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get navigation elements
    const loginSignupLink = document.querySelector('a[href="#login-signup"]');
    const contactLink = document.querySelector('a[href="#contact"]');
    const homeLink = document.querySelector('a[href="#home"]');
    const aboutLink = document.querySelector('a[href="#about"]');
    
    const formSection = document.getElementById('login-signup');
    const heroContainer = document.querySelector('.hero-container');
    const aboutSection = document.getElementById('about');
    
    // Login/SignUp functionality
    loginSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Login/SignUp clicked');
        
        // Hide other sections
        heroContainer.style.display = 'none';
        aboutSection.style.display = 'none';
        
        // Show form section
        formSection.style.display = 'block';
        
        // Scroll to form
        formSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Contact functionality
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Hide form section
        formSection.style.display = 'none';
        
        // Show other sections
        heroContainer.style.display = 'block';
        aboutSection.style.display = 'block';
        
        // Scroll to footer
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Home functionality
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Hide form section
        formSection.style.display = 'none';
        
        // Show other sections
        heroContainer.style.display = 'block';
        aboutSection.style.display = 'block';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // About functionality
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Hide form section
        formSection.style.display = 'none';
        
        // Show other sections
        heroContainer.style.display = 'block';
        aboutSection.style.display = 'block';
        
        // Scroll to about section
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Form submission handling
    const form = document.querySelector('#login-signup form');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
});

// Database connection and form handling
async function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('Name') || document.getElementById('Name').value,
        dateOfBirth: formData.get('Date-Of-Birth') || document.getElementById('Date-Of-Birth').value,
        email: formData.get('Email-Id') || document.getElementById('Email-Id').value,
        phoneNumber: formData.get('Phone-Number') || document.getElementById('Phone-Number').value
    };
    
    try {
        // Check if user exists first
        const userExists = await checkUserExists(userData.email);
        
        if (userExists) {
            // User exists - proceed with login
            const loginSuccess = await loginUser(userData.email, userData.phoneNumber);
            if (loginSuccess) {
                alert('Login successful! Welcome back, ' + userData.name);
                // Redirect or show dashboard
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } else {
            // User doesn't exist - create new account
            const createSuccess = await createUser(userData);
            if (createSuccess) {
                alert('Account created successfully! Welcome to FinVoice, ' + userData.name);
                // Redirect or show dashboard
            } else {
                alert('Failed to create account. Please try again.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Database functions
async function checkUserExists(email) {
    try {
        const response = await fetch('/api/check-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.exists;
        }
        return false;
    } catch (error) {
        console.error('Error checking user:', error);
        return false;
    }
}

async function createUser(userData) {
    try {
        const response = await fetch('/api/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.success;
        }
        return false;
    } catch (error) {
        console.error('Error creating user:', error);
        return false;
    }
}

async function loginUser(email, phoneNumber) {
    try {
        const response = await fetch('/api/login-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, phoneNumber })
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.success;
        }
        return false;
    } catch (error) {
        console.error('Error logging in user:', error);
        return false;
    }
}

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

  
