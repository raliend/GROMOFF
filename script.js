document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const resumeContent = document.getElementById('resume-content');
    const languageToggle = document.getElementById('languageToggle');
    const langLabelEn = document.getElementById('lang-label-en');
    const langLabelRu = document.getElementById('lang-label-ru');

    // 1. Переключатель тем
    const themeSwitcher = document.getElementById('theme-switcher');

    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    themeSwitcher.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // 2. Логика переключения языка и загрузки контента
    // Default language is English. Set 'ru' as default if you prefer.
    let currentLang = localStorage.getItem('resumeLang') || 'en';

    // Set initial toggle state based on currentLang
    if (currentLang === 'ru') {
        languageToggle.checked = true; // 'true' means Russian (toggled)
        body.lang = 'ru'; // Устанавливаем lang атрибут на body
    } else {
        languageToggle.checked = false; // 'false' means English (default)
        body.lang = 'en'; // Устанавливаем lang атрибут на body
    }

    // Function to update language labels visually
    function updateLanguageLabels() {
        if (currentLang === 'en') {
            langLabelEn.style.fontWeight = 'bold';
            langLabelEn.style.color = 'var(--accent)';
            langLabelRu.style.fontWeight = 'normal';
            langLabelRu.style.color = 'inherit';
        } else {
            langLabelRu.style.fontWeight = 'bold';
            langLabelRu.style.color = 'var(--accent)';
            langLabelEn.style.fontWeight = 'normal';
            langLabelEn.style.color = 'inherit';
        }
    }

    // Function to load resume data
    async function loadResume(lang) {
        resumeContent.innerHTML = '<p id="loading-message">Загрузка резюме...</p>'; // Show loading message
        try {
            const response = await fetch(`./resume-data/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            renderResume(data, lang);
            updateModalContent(data.modals); // Обновляем текст в модальных окнах
            updateNavLinks(data.nav); // Обновляем текст в навигации
        } catch (error) {
            console.error('Failed to load resume data:', error);
            resumeContent.innerHTML = `<p style="color: red;">Ошибка загрузки резюме. Пожалуйста, попробуйте позже. (${error.message})</p>`;
        }
    }

    // Function to render resume data into HTML
    function renderResume(data, lang) {
        let html = '';

        // Hero Section
        html += `
            <section class="hero" id="top">
              <img src="avatar.png" alt="${data.hero.avatarAlt}" class="avatar">
              <h1>${data.personalInfo.name}</h1>
              <p class="role">${data.personalInfo.title}</p>
              <div class="cta">
                <a href="#contact">${data.hero.contactButton}</a>
                <a href="${data.hero.resumePdfLink}" download>${data.hero.downloadPdfButton}</a>
              </div>
            </section>
        `;

        // About Section
        html += `
            <section id="about">
              <h2>${data.sections.about}</h2>
              <div class="about-grid">
                  <div>
                      <h3>${data.about.specializationTitle}</h3>
                      <p>${data.about.specializationText}</p>
                  </div>
                  <div>
                      <h3>${data.about.approachTitle}</h3>
                      <p>${data.about.approachText}</p>
                  </div>
                  <div>
                      <h3>${data.about.goalsTitle}</h3>
                      <p>${data.about.goalsText}</p>
                  </div>
              </div>
            </section>
        `;

        // Experience Section
        html += `
            <section id="experience">
                <h2>${data.sections.experience}</h2>
                <div class="experience-grid">
                    <div class="experience-card" data-modal="rts-modal">
                        <span class="exp-year">${data.experience.rts.dates}</span>
                        <img src="nplogo.jpg" alt="${data.experience.rts.alt}" class="exp-logo no-invert">
                    </div>
                    <div class="experience-card" data-modal="tbank-modal">
                        <span class="exp-year">${data.experience.tbank.dates}</span>
                        <img src="T-LOGO.jpg" alt="${data.experience.tbank.alt}" class="exp-logo no-invert">
                    </div>
                </div>
            </section>
        `;

        // Cases Section
        html += `
            <section id="cases">
                <h2>${data.sections.cases}</h2>
                <div class="cases-grid">
                    <div class="case-card" onclick="toggleReview(this)">
                        <div class="case-header">
                            <img src="rts-case.jpg" alt="${data.cases.rts.imageAlt}" class="case-icon">
                            <div class="case-title">
                                <h3>${data.cases.rts.title}</h3>
                                <p>${data.cases.rts.clickToSee}</p>
                            </div>
                        </div>
                        <div class="case-review">
                            <blockquote>${data.cases.rts.quote}</blockquote>
                            <footer>${data.cases.rts.author}</footer>
                        </div>
                    </div>

                    <div class="case-card" onclick="toggleReview(this)">
                        <div class="case-header">
                            <img src="tinkoff-edu-case.jpg" alt="${data.cases.tinkoffEdu.imageAlt}" class="case-icon">
                            <div class="case-title">
                                <h3>${data.cases.tinkoffEdu.title}</h3>
                                <p>${data.cases.tinkoffEdu.clickToSee}</p>
                            </div>
                        </div>
                        <div class="case-review">
                            <blockquote>${data.cases.tinkoffEdu.quote}</blockquote>
                            <footer>${data.cases.tinkoffEdu.author}</footer>
                        </div>
                    </div>
                    
                    <div class="case-card" onclick="toggleReview(this)">
                         <div class="case-header">
                            <img src="private-case.jpg" alt="${data.cases.privateInvest.imageAlt}" class="case-icon">
                            <div class="case-title">
                                <h3>${data.cases.privateInvest.title}</h3>
                                <p>${data.cases.privateInvest.clickToSee}</p>
                            </div>
                        </div>
                        <div class="case-review">
                            <blockquote>${data.cases.privateInvest.quote}</blockquote>
                            <footer>${data.cases.privateInvest.author}</footer>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Competencies Section
        html += `
            <section id="competencies">
              <h2>${data.sections.competencies}</h2>
              <div class="competencies-grid">
                ${data.competencies.map(block => `
                  <div class="competency-block">
                    <h3>${block.category}</h3>
                    ${block.skills.map(skill => `
                      <div class="skillbox">
                        <div class="skill-label"><span>${skill.name}</span><span>${skill.level}</span></div>
                        <div class="skill-bar"><div class="skill-bar-fill" data-level="${skill.percentage}"></div></div>
                      </div>
                    `).join('')}
                  </div>
                `).join('')}
              </div>
            </section>
        `;
        
        // Contact Section
        html += `
            <section id="contact">
                <h2>${data.sections.contact}</h2>
                <p>${data.contact.location}</p>
                 <a href="mailto:${data.contact.email}">${data.contact.emailLabel}</a> ·
                 <a href="${data.contact.telegramLink}" target="_blank">${data.contact.telegramLabel}</a></p>
            </section>
        `;

        resumeContent.innerHTML = html;

        // Re-initialize dynamic elements after content is loaded
        initSkillsAnimation();
        initExperienceCardModals(); // Re-attach listeners for experience cards
    }

    // Function to update modal content based on current language
    function updateModalContent(modalData) {
        // RTS Modal
        document.querySelector('#rts-modal h3').textContent = modalData.rts.title;
        document.querySelector('#rts-modal li[data-key="rtsModalItem1"]').textContent = modalData.rts.items[0];
        document.querySelector('#rts-modal li[data-key="rtsModalItem2"]').textContent = modalData.rts.items[1];
        document.querySelector('#rts-modal li[data-key="rtsModalItem3"]').textContent = modalData.rts.items[2];
        document.querySelector('#rts-modal li[data-key="rtsModalItem4"]').textContent = modalData.rts.items[3];

        // T-Bank Modal
        document.querySelector('#tbank-modal h3').textContent = modalData.tbank.title;
        document.querySelector('#tbank-modal li[data-key="tbankModalItem1"]').textContent = modalData.tbank.items[0];
        document.querySelector('#tbank-modal li[data-key="tbankModalItem2"]').textContent = modalData.tbank.items[1];
        document.querySelector('#tbank-modal li[data-key="tbankModalItem3"]').textContent = modalData.tbank.items[2];
        document.querySelector('#tbank-modal li[data-key="tbankModalItem4"]').textContent = modalData.tbank.items[3];
    }

    // Function to update navigation links based on current language
    function updateNavLinks(navData) {
        document.querySelector('a[data-section="about"]').textContent = navData.about;
        document.querySelector('a[data-section="experience"]').textContent = navData.experience;
        document.querySelector('a[data-section="cases"]').textContent = navData.cases;
        document.querySelector('a[data-section="competencies"]').textContent = navData.competencies;
        document.querySelector('a[data-section="contact"]').textContent = navData.contact;
    }


    // Event listener for language toggle
    languageToggle.addEventListener('change', () => {
        if (languageToggle.checked) {
            currentLang = 'ru';
            body.lang = 'ru';
        } else {
            currentLang = 'en';
            body.lang = 'en';
        }
        localStorage.setItem('resumeLang', currentLang); // Save preference
        updateLanguageLabels();
        loadResume(currentLang);
    });

    // Initial load based on stored preference or default
    updateLanguageLabels(); // Set initial label styles
    loadResume(currentLang);

    // 3. Логика для модальных окон (Pop-up) - перенесена в функцию для повторного вызова
    function initExperienceCardModals() {
        const experienceCards = document.querySelectorAll('.experience-card');
        const modalOverlays = document.querySelectorAll('.modal-overlay');
        const modalCloseButtons = document.querySelectorAll('.modal-close');

        // Remove existing listeners to prevent duplicates
        experienceCards.forEach(card => {
            const oldClickListener = card.__handleClick__;
            if (oldClickListener) {
                card.removeEventListener('click', oldClickListener);
            }
            const newClickListener = () => {
                const modalId = card.getAttribute('data-modal');
                document.getElementById(modalId).classList.add('is-visible');
            };
            card.addEventListener('click', newClickListener);
            card.__handleClick__ = newClickListener; // Store reference
        });

        function closeModal() {
            modalOverlays.forEach(overlay => {
                overlay.classList.remove('is-visible');
            });
        }

        modalCloseButtons.forEach(button => {
            const oldClickListener = button.__handleClick__;
            if (oldClickListener) {
                button.removeEventListener('click', oldClickListener);
            }
            const newClickListener = closeModal;
            button.addEventListener('click', newClickListener);
            button.__handleClick__ = newClickListener;
        });

        modalOverlays.forEach(overlay => {
            const oldClickListener = overlay.__handleClick__;
            if (oldClickListener) {
                overlay.removeEventListener('click', oldClickListener);
            }
            const newClickListener = (event) => {
                if (event.target === overlay) {
                    closeModal();
                }
            };
            overlay.addEventListener('click', newClickListener);
            overlay.__handleClick__ = newClickListener;
        });
    }


    // 4. Открытие/закрытие отзывов в кейсах (Global function)
    window.toggleReview = function(cardElement) {
        cardElement.classList.toggle('is-open');
    }

    // 5. Бургер-меню (Global function)
    window.toggleMenu = function(){document.getElementById('nav-list').classList.toggle('open');}

    // 6. Анимация скиллов при прокрутке - перенесена в функцию для повторного вызова
    function initSkillsAnimation() {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
              skillBars.forEach(bar => {
                bar.style.width = bar.dataset.level;
              });
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        const competenciesSection = document.getElementById('competencies');
        if (competenciesSection) {
          skillsObserver.observe(competenciesSection);
        }
    }

    // 7. Генерация и анимация молний
    const lightningContainer = document.getElementById('lightning-container');
    const lightnings = [];
    const numLightnings = 15; // Увеличено количество молний

    if (lightningContainer) {
        for (let i = 0; i < numLightnings; i++) {
            const lightning = document.createElement('div');
            lightning.className = 'lightning';
            
            const side = Math.random() < 0.5 ? 'left' : 'right';
            const xPos = side === 'left' ? Math.random() * 20 : Math.random() * 20 + 80; // 0-20% или 80-100% ширины экрана

            lightning.style.left = `${xPos}vw`;
            lightning.style.top = `${Math.random() * 100}vh`;
            lightning.style.width = `${Math.random() * 30 + 40}px`;
            lightning.style.height = `${Math.random() * 60 + 50}px`;
            lightning.style.animationDelay = `${Math.random() * 5}s`;
            lightning.style.animationDuration = `${Math.random() * 2 + 3}s`;
            
            lightningContainer.appendChild(lightning);
            lightnings.push(lightning);
        }
    }

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;

        const { clientX, clientY } = e;

        lightnings.forEach(bolt => {
            const rect = bolt.getBoundingClientRect();
            const boltCenterX = rect.left + rect.width / 2;
            const boltCenterY = rect.top + rect.height / 2;

            const deltaX = clientX - boltCenterX;
            const deltaY = clientY - boltCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const maxDist = 150;
            if (distance < maxDist) {
                const force = (maxDist - distance) / maxDist;
                const moveX = -deltaX * force * 0.5;
                const moveY = -deltaY * force * 0.5;
                bolt.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                bolt.style.transform = `translate(0, 0)`;
            }
        });
    });
});
