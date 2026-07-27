import './main';

// Journal filter functionality
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.tag[data-filter]');
  const journalCards = document.querySelectorAll('.journal-card[data-type]');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      journalCards.forEach((card) => {
        const type = card.getAttribute('data-type');
        if (filter === 'all' || type === filter) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // YouTube click-to-load functionality
  const videoContainers = document.querySelectorAll('.journal-card__video[data-video-id]');
  
  videoContainers.forEach((container) => {
    container.addEventListener('click', () => {
      const videoId = container.getAttribute('data-video-id');
      if (!videoId) return;

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      
      container.classList.add('is-playing');
      container.appendChild(iframe);
    });
  });
});
