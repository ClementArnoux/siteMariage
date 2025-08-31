import './style.scss'

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  // Handle smooth scrolling
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Handle RSVP form
  const rsvpForm = document.querySelector('.rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());
      
      // Simple form validation
      if (data.name && data.email && data.attendance) {
        alert('Merci ! Votre réponse a été enregistrée.');
        this.reset();
      } else {
        alert('Veuillez remplir tous les champs obligatoires.');
      }
    });
  }

  // Add header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
});