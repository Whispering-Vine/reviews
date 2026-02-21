(function() {
    function init() {
      // Find the placeholder div
      var reviewDiv = document.querySelector('[data-wv-review]');
      if (!reviewDiv) {
        console.error('No element with data-wv-review attribute found.');
        return;
      }
  
      // Inject the HTML into the placeholder div
      reviewDiv.outerHTML = `
        <div class="wvrv-reviews-section">
          <!-- Reviews Header -->
          <div class="wvrv-reviews-header">
            <div class="wvrv-header-left">
              <h1>
                <img src="https://reviews.wvwine.co/google-logo.svg" alt="Google Logo" class="wvrv-google-logo">
                Reviews
              </h1>
              <div class="wvrv-rating">
                <span class="wvrv-score">4.7</span>
                <span class="wvrv-stars">★★★★★</span>
                <span class="wvrv-total-reviews">(492)</span>
              </div>
            </div>
            <div class="wvrv-header-right">
              <a href="https://g.page/r/CY2Hz_EFmln0EBM/review" target="_blank" class="wvrv-review-button-link">
                <button class="wvrv-review-button">Review us on Google</button>
              </a>
            </div>
          </div>
  
          <!-- Reviews Carousel -->
          <div class="wvrv-reviews-carousel">
            <button class="wvrv-carousel-btn wvrv-prev">‹</button>
            <div class="wvrv-fade wvrv-fade-left"></div>
            <div class="wvrv-carousel-container">
              <!-- Placeholder cards -->
              <div class="wvrv-review-card">
                <div class="wvrv-card-header">
                  <div class="wvrv-loading wvrv-loading-name"></div>
                </div>
                <div class="wvrv-card-stars">
                  <div class="wvrv-loading wvrv-loading-star"></div>
                </div>
                <div class="wvrv-review-text">
                  <div class="wvrv-loading wvrv-loading-text"></div>
                  <div class="wvrv-loading wvrv-loading-text"></div>
                  <div class="wvrv-loading wvrv-loading-text"></div>
                </div>
              </div>
              <!-- You can add more placeholder cards if needed -->
            </div>
            <div class="wvrv-fade wvrv-fade-right"></div>
            <button class="wvrv-carousel-btn wvrv-next">›</button>
          </div>
        </div>
  
        <!-- Modal -->
        <div class="wvrv-modal" id="wvrv-review-modal">
          <div class="wvrv-modal-content">
            <button class="wvrv-modal-close" id="wvrv-close-modal">&times;</button>
            <div class="wvrv-card-header">
              <img src="" alt="Profile" class="wvrv-profile-photo" id="wvrv-modal-photo">
              <div>
                <div class="wvrv-user-name" id="wvrv-modal-name"></div>
                <div class="wvrv-review-time" id="wvrv-modal-time"></div>
                <div class="wvrv-stars" id="wvrv-modal-stars"></div>
              </div>
            </div>
            <div class="wvrv-review-text" id="wvrv-modal-comment"></div>
            <div class="wvrv-modal-owner-reply" id="wvrv-modal-reply">
              <p><strong>Owner's Reply:</strong></p>
              <p id="wvrv-modal-reply-text"></p>
            </div>
          </div>
        </div>
      `;
  
      // Append the CSS styles to the document head
      var style = document.createElement('style');
      style.innerHTML = `
      /* Namespaced CSS Styles */
      /* Prefix all classes with .wvrv- */
  
      .wvrv-reviews-section * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
          
      .wvrv-reviews-section {
        padding: 20px;
        text-align: center;
        background-color: var(--black, #121212);
        color: #fff;
      }
  
      /* Modal Styles */
      .wvrv-modal {
        display: flex;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        justify-content: center;
        align-items: center;
        z-index: 1000;
        box-sizing: border-box;
      }
  
      .wvrv-modal.wvrv-show {
        opacity: 1;
        pointer-events: auto;
      }

      .wvrv-modal-content {
        position: relative;
        background-color: #222;
        color: #fff;
        border-radius: 10px;
        max-width: 500px;
        max-height: 80%;
        overflow-y: auto;
        padding: 20px;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-sizing: border-box;
      }
  
      .wvrv-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
  
      .wvrv-modal-owner-reply {
        padding: 10px;
        background-color: #333;
        border-radius: 5px;
      }
  
      .wvrv-modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        font-weight: bold;
        color: #fff;
        cursor: pointer;
        background: none;
        border: none;
        z-index: 1001;
        box-sizing: border-box;
      }
  
      .wvrv-modal-review {
        margin-top: 10px;
      }
  
      .wvrv-modal-owner-reply p {
        margin: 5px;
        font-size: 14px;
        line-height: 1.5;
        color: #ddd;
        text-align: left;
      }
  
      /* Button Style */
      .wvrv-read-more-btn {
        background: none;
        border: none;
        padding: 0;
        font-size: 14px;
        color: #1a73e8;
        cursor: pointer;
        text-align: left;
      }
  
      .wvrv-read-more-btn:hover {
        color: #165ab9;
        text-decoration: none;
      }
  
      /* Loading animation styles */
      .wvrv-loading {
        background: linear-gradient(90deg, #333, #555, #333);
        background-size: 200% 100%;
        animation: wvrv-loading 1.5s infinite;
        border-radius: 5px;
      }
  
      @keyframes wvrv-loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
  
      .wvrv-loading-text {
        width: 80%;
        height: 16px;
        margin-bottom: 10px;
      }
  
      .wvrv-loading-star {
        width: 40%;
        height: 16px;
      }
  
      .wvrv-loading-name {
        width: 50%;
        height: 16px;
      }
  
      .wvrv-reviews-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        margin-bottom: 20px;
        background-color: var(--black, #121212);
        color: #fff;
        border-bottom: 1px solid #333;
      }
  
      .wvrv-reviews-header h1 {
        font-size: 24px;
        margin: 0;
      }
  
      .wvrv-google-logo {
        height: 34px;
        vertical-align: middle;
        margin-right: 0px;
      }
  
      .wvrv-rating {
        display: flex;
        align-items: center;
        gap: 8px;
      }
  
      .wvrv-rating span {
        font-size: 18px;
      }
  
      .wvrv-stars {
        font-size: 18px;
        color: var(--orange, gold);
      }
  
      .wvrv-score {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
      }
  
      .wvrv-total-reviews {
        font-size: 18px;
        color: #bbb;
      }
  
      .wvrv-review-button {
        background-color: #1a73e8;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
      }
  
      .wvrv-review-button:hover {
        background-color: #165ab9;
      }
  
      .wvrv-reviews-carousel {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
      }
  
      .wvrv-carousel-container {
        display: flex;
        overflow-x: auto;
        width: 100%;
      }
  
      .wvrv-review-card {
        flex: 0 0 300px;
        background-color: var(--grey, #222);
        padding: 20px;
        border-radius: 10px;
        margin: 0 10px;
        color: #fff;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
  
      .wvrv-card-header {
        display: flex;
        align-items: center;
        gap: 10px;
      }
  
      .wvrv-profile-photo {
        width: 40px;
        height: 40px;
        border-radius: 0%;
        object-fit: cover;
      }
  
      .wvrv-user-info {
        display: flex;
        flex-direction: column;
      }
  
      .wvrv-name-and-badge {
        display: inline;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
      }
  
      .wvrv-last-name-and-badge {
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
      }
  
      .wvrv-user-name {
        font-size: 16px;
        font-weight: bold;
        text-align: left;
      }
  
      .wvrv-verified-badge-icon {
        width: 16px;
        height: 16px;
        margin-left: 4px;
      }
  
      .wvrv-review-time {
        font-size: 14px;
        text-align: left;
        color: #bbb;
      }
  
      .wvrv-card-stars {
        display: flex;
        align-items: center;
      }
  
      .wvrv-stars {
        font-size: 16px;
        color: var(--orange, gold);
      }
  
      .wvrv-review-text {
        font-size: 14px;
        line-height: 1.5;
        color: #ddd;
        text-align: left;
      }
        
      .wvrv-fade {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 60px;            /* adjust to taste */
        pointer-events: none;
        z-index: 1;             /* sits above cards but below arrows */
      }
      .wvrv-fade-left {
        left: 0;
        background: linear-gradient(to right, var(--grey, #121212), transparent);
      }
      .wvrv-fade-right {
        right: 0;
        background: linear-gradient(to left, var(--grey, #121212), transparent);
      }
  
      .wvrv-carousel-btn {
        position: absolute;
        top: 50%;
        width: 40px;
        height: 40px;
        background-color: rgba(0, 0, 0, 0.7);
        color: #fff;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 2;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        transition: background-color 0.3s ease;
        font-size: 28px;
        line-height: 1;
        overflow: hidden;
        box-sizing: border-box;
        -webkit-backdrop-filter: blur(50px);
        backdrop-filter: blur(50px);
      }
  
      .wvrv-carousel-btn:hover {
        background-color: rgba(26, 115, 232, 0.9);
      }
  
      .wvrv-carousel-btn.wvrv-prev {
        left: 10px;
        transform: translate(-50%, -50%);
      }
  
      .wvrv-carousel-btn.wvrv-next {
        right: 10px;
        transform: translate(50%, -50%);
      }
  
      .wvrv-carousel-btn.wvrv-hidden {
        display: none;
      }
  
      .wvrv-carousel-container::-webkit-scrollbar {
        display: none;
      }
  
      .wvrv-carousel-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
  
      /* Media Query for Responsive Design */
      @media (max-width: 600px) {
        .wvrv-carousel-container {
          margin-left: 0px;
        }
  
        .wvrv-reviews-header {
          flex-direction: column;
          align-items: flex-start;
        }
  
        .wvrv-review-card {
          max-width: 80%;
          padding: 22px;
          margin-left: 22px;
        }
        
        .wvrv-header-left,
        .wvrv-header-right {
          width: 100%;
          margin-bottom: 10px;
        }
        
        .wvrv-header-right {
          display: flex;
          justify-content: flex-start;
        }
        
        .wvrv-reviews-header h1 {
          margin-bottom: 0px;
          text-align: left;
        }
  
        .wvrv-carousel-btn {
          width: 36px;
          height: 36px;
          font-size: 20px;
        }
        
        .wvrv-carousel-btn.wvrv-prev {
          left: 5px;
        }
  
        .wvrv-carousel-btn.wvrv-next {
          right: 5px;
        }
  
        .wvrv-modal-content {
          max-width: 80%;
        }
      }
      `;
      document.head.appendChild(style);
  
      // JavaScript Code
    (function() {
        // Variables and functions
        const prevBtn = document.querySelector('.wvrv-prev');
        const nextBtn = document.querySelector('.wvrv-next');
        const fadeLeft  = document.querySelector('.wvrv-fade-left');
        const fadeRight = document.querySelector('.wvrv-fade-right');
        const carousel = document.querySelector('.wvrv-carousel-container');
  
        const modalPhoto = document.getElementById('wvrv-modal-photo');
        const modalName = document.getElementById('wvrv-modal-name');
        const modalTime = document.getElementById('wvrv-modal-time');
        const modalStars = document.getElementById('wvrv-modal-stars');
        const modalComment = document.getElementById('wvrv-modal-comment');
        const modalReply = document.getElementById('wvrv-modal-reply');
        const modalReplyText = document.getElementById('wvrv-modal-reply-text');
        const modal = document.getElementById('wvrv-review-modal');
        const closeModalButton = document.getElementById('wvrv-close-modal');

        let targetScroll = carousel.scrollLeft;
        let animationRunning;
        let animationFrameId;
  
        // Function to calculate relative time
        function getRelativeTime(createTime) {
          const now = new Date();
          const reviewDate = new Date(createTime);
          const diffInSeconds = Math.floor((now - reviewDate) / 1000);
  
          const secondsInMinute = 60;
          const secondsInHour = 3600;
          const secondsInDay = 86400;
          const secondsInMonth = 2592000;
          const secondsInYear = 31536000;
  
          if (diffInSeconds < secondsInMinute) {
            return `${diffInSeconds} seconds ago`;
          } else if (diffInSeconds < secondsInHour) {
            const minutes = Math.floor(diffInSeconds / secondsInMinute);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
          } else if (diffInSeconds < secondsInDay) {
            const hours = Math.floor(diffInSeconds / secondsInHour);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
          } else if (diffInSeconds < secondsInMonth) {
            const days = Math.floor(diffInSeconds / secondsInDay);
            return `${days} day${days > 1 ? 's' : ''} ago`;
          } else if (diffInSeconds < secondsInYear) {
            const months = Math.floor(diffInSeconds / secondsInMonth);
            return `${months} month${months > 1 ? 's' : ''} ago`;
          } else {
            const years = Math.floor(diffInSeconds / secondsInYear);
            return `${years} year${years > 1 ? 's' : ''} ago`;
          }
        }
  
        // Function to show modal with full review and owner reply
        function showModal(review) {
          modalPhoto.src = review.reviewer.profilePhotoUrl || 'default-photo.jpg';
          modalName.textContent = review.reviewer.displayName;
          modalTime.textContent = getRelativeTime(review.createTime);
          modalStars.innerHTML =
            '★'.repeat(starRatingMap[review.starRating]) +
            '☆'.repeat(5 - starRatingMap[review.starRating]);
          modalComment.textContent = review.comment;
  
          if (review.reviewReply) {
            modalReply.style.display = 'block';
            modalReplyText.textContent = review.reviewReply.comment;
          } else {
            modalReply.style.display = 'none';
          }
  
          // Show the modal with fade-in animation
          modal.classList.add('wvrv-show');
        }

        // Function to hide the modal
        function hideModal() {
            // Remove the 'wvrv-show' class to start the fade-out transition
            modal.classList.remove('wvrv-show');
        
            // Listen for the end of the opacity transition
            modal.addEventListener('transitionend', onTransitionEnd);
        }
        
        // Function to handle the transition end event
        function onTransitionEnd(event) {
            if (event.propertyName === 'opacity' && !modal.classList.contains('wvrv-show')) {
            // Remove the event listener to prevent it from firing multiple times
            modal.removeEventListener('transitionend', onTransitionEnd);
        
            // Disable pointer events after fade-out
            modal.style.pointerEvents = 'none';
            }
        }
        
        // Event listeners to close the modal
        closeModalButton.addEventListener('click', hideModal);
        
        // Close modal if clicked outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
            hideModal();
            }
        });
        
        // Enable pointer events when modal is shown
        modal.addEventListener('transitionstart', (event) => {
            if (event.propertyName === 'opacity' && modal.classList.contains('wvrv-show')) {
            modal.style.pointerEvents = 'auto';
            }
        });
  
        // Function to update button visibility based on scroll position
        function updateArrowVisibility() {
          const scrollVal = carousel.scrollLeft;
          const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
          
          prevBtn.style.display = scrollVal <= 0 ? 'none' : 'flex';
          nextBtn.style.display = scrollVal >= maxScrollLeft ? 'none' : 'flex';

          fadeLeft.style.display = scrollVal <= 0 ? 'none' : 'block';
          fadeRight.style.display = scrollVal >= maxScrollLeft ? 'none' : 'block';
        }
        
        // Start the continuously running animation if it’s not already active
        function startAnimation() {
          if (!animationRunning) {
            animationRunning = true;
            tick();
          }
        }

        // The tick function updates the carousel's scrollLeft toward targetScroll
        function tick() {
          const diff = targetScroll - carousel.scrollLeft;
          if (Math.abs(diff) > 1) {
            // Move a fraction (20% of the remaining distance) every frame
            carousel.scrollLeft += diff * 0.2;
            animationFrameId = requestAnimationFrame(tick);
          } else {
            // When close enough, snap to the target and end the animation
            carousel.scrollLeft = targetScroll;
            animationRunning = false;
          }
        }
  
        // Scroll carousel by the exact width of one review card
        function scrollCarousel(direction) {
          // Disable any native smooth scrolling
          carousel.style.scrollBehavior = 'auto';
        
          // Determine card width based on one review card
          const reviewCard = document.querySelector('.wvrv-review-card');
          if (!reviewCard) return;
          const style = window.getComputedStyle(reviewCard);
          const marginRight = parseInt(style.marginRight, 10);
          const marginLeft = parseInt(style.marginLeft, 10);
          const cardWidth = reviewCard.offsetWidth + marginLeft + marginRight;
        
          // Update targetScroll based on button direction
          if (direction === 'next') {
            targetScroll += cardWidth;
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            if (targetScroll > maxScrollLeft) targetScroll = maxScrollLeft;
          } else if (direction === 'prev') {
            targetScroll -= cardWidth;
            if (targetScroll < 0) targetScroll = 0;
          }
        
          // Update arrow visibility immediately (see section below)
          updateArrowVisibility();
        
          // Start the animation toward the new target immediately
          startAnimation();
        }
  
        // Map star rating strings to numeric equivalents
        const starRatingMap = {
          ONE: 1,
          TWO: 2,
          THREE: 3,
          FOUR: 4,
          FIVE: 5,
        };
  
        // Fetch reviews from proxy
        async function fetchReviews() {
          try {
            const response = await fetch('https://reviews.wvwine.co/reviews.json');
            const payload = await response.json();
        
            const fourth = payload?.fourth_st?.reviews ?? [];
            const south  = payload?.south_creek?.reviews ?? [];
        
            // order ALL by most recent across both
            const merged = [...fourth, ...south].sort(
              (a, b) => new Date(b.createTime) - new Date(a.createTime)
            );
        
            populateCarousel(merged);
          } catch (error) {
            console.error('Failed to fetch reviews:', error);
          }
        }
  
        // Populate carousel with reviews
        function populateCarousel(reviews) {
          const carouselContainer = document.querySelector('.wvrv-carousel-container');
          carouselContainer.innerHTML = ''; // Clear existing content
  
          reviews.forEach((review, index) => {
            const starCount = starRatingMap[review.starRating] || 0;
  
            const truncatedComment = review.comment.length > 125
              ? review.comment.substring(0, 125) + '...'
              : review.comment;
  
            // Split the displayName into first names and last name
            const displayName = review.reviewer.displayName.trim();
            const nameParts = displayName.split(' ');
            const lastName = nameParts.pop();
            const firstName = nameParts.join(' ');
  
            // Define the SVG icon
            const svgVerifiedBadge = `
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" class="wvrv-verified-badge-icon">
                <path fill="#197BFF" d="M6.757.236a.35.35 0 0 1 .486 0l1.106 1.07a.35.35 0 0 0 .329.089l1.493-.375a.35.35 0 0 1 .422.244l.422 1.48a.35.35 0 0 0 .24.24l1.481.423a.35.35 0 0 1 .244.422l-.375 1.493a.35.35 0 0 0 .088.329l1.071 1.106a.35.35 0 0 1 0 .486l-1.07 1.106a.35.35 0 0 0-.089.329l.375 1.493a.35.35 0 0 1-.244.422l-1.48.422a.35.35 0 0 0-.24.24l-.423 1.481a.35.35 0 0 1-.422.244l-1.493-.375a.35.35 0 0 0-.329.088l-1.106 1.071a.35.35 0 0 1-.486 0l-1.106-1.07a.35.35 0 0 0-.329-.089l-1.493.375a.35.35 0 0 1-.422-.244l-.422-1.48a.35.35 0 0 0-.24-.24l-1.481-.423a.35.35 0 0 1-.244-.422l.375-1.493a.35.35 0 0 0-.088-.329L.236 7.243a.35.35 0 0 1 0-.486l1.07-1.106a.35.35 0 0 0 .089-.329L1.02 3.829a.35.35 0 0 1 .244-.422l1.48-.422a.35.35 0 0 0 .24-.24l.423-1.481a.35.35 0 0 1 .422-.244l1.493.375a.35.35 0 0 0 .329-.088L6.757.236Z"></path>
                <path fill="#fff" fill-rule="evenodd" d="M9.065 4.85a.644.644 0 0 1 .899 0 .615.615 0 0 1 .053.823l-.053.059L6.48 9.15a.645.645 0 0 1-.84.052l-.06-.052-1.66-1.527a.616.616 0 0 1 0-.882.645.645 0 0 1 .84-.052l.06.052 1.21 1.086 3.034-2.978Z" clip-rule="evenodd"></path>
              </svg>
            `;
  
            const reviewCard = `
              <div class="wvrv-review-card">
                <div class="wvrv-card-header">
                  <img src="${review.reviewer.profilePhotoUrl || 'default-photo.jpg'}" 
                       alt="Profile Photo" 
                       class="wvrv-profile-photo">
                  <div class="wvrv-user-info">
                    <div class="wvrv-name-and-badge">
                      <span class="wvrv-user-name">${firstName}${firstName ? ' ' : ''}</span>
                      <span class="wvrv-last-name-and-badge">
                        ${lastName}${svgVerifiedBadge}
                      </span>
                    </div>
                    <span class="wvrv-review-time">${getRelativeTime(review.createTime)}</span>
                  </div>
                </div>
                <div class="wvrv-card-stars">
                  <span class="wvrv-stars">${'★'.repeat(starCount)}${'☆'.repeat(5 - starCount)}</span>
                </div>
                <div class="wvrv-review-text">${truncatedComment}</div>
                <button class="wvrv-read-more-btn" data-index="${index}">Read More</button>
              </div>
            `;
            carouselContainer.innerHTML += reviewCard;
          });
  
          // Attach click listeners to "Read More" buttons
          document.querySelectorAll('.wvrv-read-more-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
              const index = e.target.getAttribute('data-index');
              showModal(reviews[index]);
            });
          });
  
          updateArrowVisibility(); // Ensure buttons are updated after new cards are added
        }

        function cancelEasing() {
          if (animationRunning) {
            cancelAnimationFrame(animationFrameId);
            animationRunning = false;
          }
          targetScroll = carousel.scrollLeft;
        }
  
        // Event listeners for arrow buttons
        prevBtn.addEventListener('click', () => scrollCarousel('prev'));
        nextBtn.addEventListener('click', () => scrollCarousel('next'));
        // Cancel the JS animation loop as soon as the user touches/drags
        carousel.addEventListener('pointerdown', cancelEasing);
        carousel.addEventListener('touchstart',  cancelEasing, { passive: true });
        carousel.addEventListener('wheel',       cancelEasing, { passive: true });
        
        // Keep targetScroll in sync when native scrolling happens
        carousel.addEventListener('scroll', () => {
          if (!animationRunning) {
            // only reset after manual drags/swipes
            targetScroll = carousel.scrollLeft;
          }
          updateArrowVisibility();
        });
          
        // Fetch and populate the carousel on page load
        fetchReviews();
      })();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
