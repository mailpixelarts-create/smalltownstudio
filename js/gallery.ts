// Gallery lightbox functionality
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage') as HTMLImageElement;
  const lightboxClose = document.querySelector('.lightbox__close');

  if (!lightbox || !lightboxImage || !lightboxClose) return;

  // Open lightbox on gallery item click
  const galleryItems = document.querySelectorAll('.film-gallery__item, .film-bts__item');
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close lightbox
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
});
