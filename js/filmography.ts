// Filmography filter + video lightbox
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.tag[data-filter]');
  const filmCards = document.querySelectorAll('.film-card[data-type]');
  const lightbox = document.getElementById('videoLightbox') as HTMLElement;
  const lightboxClose = document.getElementById('videoLightboxClose') as HTMLElement;
  const lightboxPlayer = document.getElementById('videoLightboxPlayer') as HTMLElement;

  // Filter functionality
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      filmCards.forEach((card) => {
        const type = card.getAttribute('data-type');
        if (filter === 'all' || type === filter) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // Video lightbox — open on film card click
  filmCards.forEach((card) => {
    card.addEventListener('click', () => {
      const vimeoId = card.getAttribute('data-vimeo');
      if (!vimeoId || !lightbox || !lightboxPlayer) return;

      lightboxPlayer.innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      // Stop video by removing iframe
      setTimeout(() => {
        if (lightboxPlayer) lightboxPlayer.innerHTML = '';
      }, 400);
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
