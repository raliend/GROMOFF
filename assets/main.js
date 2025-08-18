document.addEventListener('DOMContentLoaded', () => {
  // Переключатель темы
  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    function updateThemeIcon() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      themeSwitch.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
    updateThemeIcon();
    themeSwitch.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon();
      if (typeof ym !== 'undefined') {
        ym(103795534, 'reachGoal', 'THEME_SWITCH');
      }
    });
  }

  // Мобильное меню
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      burger.classList.toggle('active');
      if (typeof ym !== 'undefined') {
        ym(103795534, 'reachGoal', 'MOBILE_MENU_TOGGLE');
      }
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('active');
      });
    });
  }

  document.querySelectorAll('.card-anim').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  // FAQ раскрытие
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    answer.style.display = 'none';
    question.addEventListener('click', () => {
      const isOpen = answer.style.display === 'block';
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.querySelector('.faq-a').style.display = 'none';
        otherItem.classList.remove('open');
      });
      if (!isOpen) {
        answer.style.display = 'block';
        item.classList.add('open');
      }
      if (typeof ym !== 'undefined') {
        ym(103795534, 'reachGoal', 'FAQ_CLICK');
      }
    });
  });

  // Плавная прокрутка к якорям с учетом фиксированной шапки
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const nav = document.querySelector('.nav');
        let navHeight = nav ? nav.offsetHeight : 64;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navHeight,
          behavior: 'smooth'
        });
      }
    });
  });

  document.querySelectorAll('.card-cta, .contact-link').forEach(button => {
    button.addEventListener('click', () => {
      if (typeof ym !== 'undefined') {
        ym(103795534, 'reachGoal', 'CTA_CLICK');
      }
    });
  });

  // Отслеживание просмотра секций
  const observerOptions = { threshold: 0.3, rootMargin: '0px 0px -100px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && typeof ym !== 'undefined') {
        const sectionName = entry.target.id.toUpperCase();
        ym(103795534, 'reachGoal', `SECTION_${sectionName}_VIEW`);
      }
    });
  }, observerOptions);
  ['hero', 'services', 'competence', 'reviews', 'faq', 'leadform'].forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) observer.observe(section);
  });

  // Эффект появления для карточек
  const cards = document.querySelectorAll('.service-card, .benefit-block, .review-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
  });
});
