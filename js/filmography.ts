import './main';

// Filmography page — filters only
// (Video lightbox is handled by main.ts to avoid duplicate event listeners)
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.tag[data-filter]');
  const filmCards = document.querySelectorAll('.film-card[data-type]');

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
});
