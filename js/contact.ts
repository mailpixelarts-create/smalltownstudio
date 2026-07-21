// Contact form functionality
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Here you would normally send the form data to a server
    console.log('Form submitted:', data);

    // Show success message
    const btn = form.querySelector('.btn') as HTMLButtonElement;
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
});
